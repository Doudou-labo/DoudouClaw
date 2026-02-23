#!/usr/bin/env python3
"""
crm-to-notion-sync.py — Sync CRM followups to Notion database

Usage:
  python3 scripts/crm-to-notion-sync.py --dry-run    # Preview changes
  python3 scripts/crm-to-notion-sync.py --apply      # Apply changes
  python3 scripts/crm-to-notion-sync.py --status     # Show sync status
"""

import os
import sys
import json
import sqlite3
from pathlib import Path
from datetime import datetime
import urllib.request
import urllib.error

# Configuration
WORKSPACE = Path("/root/.openclaw/workspace")
CRM_DB = WORKSPACE / "data" / "crm.sqlite"
MAPPING_FILE = WORKSPACE / "data" / "crm_notion_map.json"

# Notion API config
NOTION_DS_ID = "3109cdc8-2c0c-81db-9578-000bd094e927"  # Data source ID
MATON_API_KEY = os.environ.get("MATON_API_KEY")

# Status mapping: CRM -> Notion
STATUS_MAP = {
    "PROCHAINEMENT": "À venir",
    "EN_ATTENTE_EXTERNE": "En attente",
    "A_FAIRE": "Cette semaine",
    "FAIT": "Terminé"
}

# Category mapping (heuristic based on content)
def guess_category(motif: str) -> list:
    motif_lower = motif.lower()
    categories = ["Tâche"]  # Default
    if "pneu" in motif_lower:
        categories.append("Attente pneu")
    if "roue" in motif_lower or "dépos" in motif_lower:
        categories.append("Roue déposée")
    if "devis" in motif_lower or "relance" in motif_lower:
        categories.append("Rappel devis")
    if "dépannage" in motif_lower or "panne" in motif_lower:
        categories.append("Dépannage")
    return categories


def load_mapping():
    """Load CRM ID -> Notion Page ID mapping"""
    if MAPPING_FILE.exists():
        with open(MAPPING_FILE) as f:
            return json.load(f)
    return {}


def save_mapping(mapping):
    """Save mapping to file"""
    MAPPING_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(MAPPING_FILE, 'w') as f:
        json.dump(mapping, f, indent=2)


def notion_api_call(method: str, path: str, data: dict = None):
    """Make a Notion API call via Maton gateway"""
    if not MATON_API_KEY:
        raise RuntimeError("MATON_API_KEY not set")
    
    url = f"https://gateway.maton.ai/notion{path}"
    headers = {
        "Authorization": f"Bearer {MATON_API_KEY}",
        "Notion-Version": "2025-09-03"
    }
    
    if data:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode()
    else:
        body = None
    
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    
    try:
        resp = urllib.request.urlopen(req)
        return json.load(resp) if resp.status != 204 else None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise RuntimeError(f"Notion API error: {e.code} {e.reason} - {error_body}")


def get_crm_followups():
    """Fetch all followups from CRM"""
    conn = sqlite3.connect(CRM_DB)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT f.id, f.contact_id, f.motif, f.due_at, f.status, f.created_at,
               c.nom as contact_nom, c.tel, c.societe, c.loueur
        FROM followups f
        JOIN contacts c ON f.contact_id = c.id
        ORDER BY f.due_at
    """)
    
    followups = []
    for row in cursor.fetchall():
        followups.append(dict(row))
    
    conn.close()
    return followups


def create_notion_page(followup: dict, dry_run: bool = False):
    """Create a new page in Notion for a followup"""
    # Build title
    contact_name = followup.get('contact_nom') or 'Inconnu'
    motif = followup.get('motif', '')
    title = f"[{followup['id']}] {contact_name} — {motif}"
    
    # Map status
    crm_status = followup.get('status', 'A_FAIRE')
    notion_status = STATUS_MAP.get(crm_status, 'À venir')
    
    # Build description
    description_parts = []
    if followup.get('tel'):
        description_parts.append(f"📞 {followup['tel']}")
    if followup.get('societe'):
        description_parts.append(f"🏢 {followup['societe']}")
    if followup.get('loueur'):
        description_parts.append(f"👤 Loueur: {followup['loueur']}")
    
    description = "\n".join(description_parts) if description_parts else ""
    
    # Parse due date
    due_date = followup.get('due_at')
    date_obj = None
    if due_date:
        try:
            # Handle ISO format with timezone
            date_str = due_date.replace('Z', '+00:00')
            date_obj = datetime.fromisoformat(date_str)
        except:
            pass
    
    # Build properties
    properties = {
        "Nom": {"title": [{"text": {"content": title[:100]}}]},
        "Statut": {"select": {"name": notion_status}},
        "Description": {"rich_text": [{"text": {"content": description}}]},
        "Catégorie": {"multi_select": [{"name": c} for c in guess_category(motif)]}
    }
    
    if followup.get('societe'):
        properties["Société"] = {"rich_text": [{"text": {"content": followup['societe']}}]}
    
    if date_obj:
        # Note: uses right single quotation mark (U+2019) as in Notion
        properties["Date d’échéance"] = {"date": {"start": date_obj.strftime("%Y-%m-%d")}}
    
    if dry_run:
        return {"id": "DRY_RUN", "properties": properties}
    
    # Create page
    data = {
        "parent": {"data_source_id": NOTION_DS_ID},
        "properties": properties,
        "icon": {"type": "emoji", "emoji": "📋"}
    }
    
    result = notion_api_call("POST", "/v1/pages", data)
    return result


def update_notion_page(page_id: str, followup: dict, dry_run: bool = False):
    """Update an existing Notion page"""
    crm_status = followup.get('status', 'A_FAIRE')
    notion_status = STATUS_MAP.get(crm_status, 'À venir')
    
    properties = {
        "Statut": {"select": {"name": notion_status}}
    }
    
    if dry_run:
        return {"id": page_id, "updated": True}
    
    data = {"properties": properties}
    result = notion_api_call("PATCH", f"/v1/pages/{page_id}", data)
    return result


def sync(dry_run: bool = False):
    """Main sync function"""
    if not MATON_API_KEY:
        print("❌ MATON_API_KEY not set")
        return 1
    
    if not CRM_DB.exists():
        print(f"❌ CRM database not found: {CRM_DB}")
        return 1
    
    mapping = load_mapping()
    followups = get_crm_followups()
    
    created = 0
    updated = 0
    skipped = 0
    errors = 0
    
    print(f"📊 Found {len(followups)} followups in CRM")
    print(f"📊 Current mapping has {len(mapping)} entries")
    print()
    
    for fu in followups:
        fu_id = str(fu['id'])
        
        if fu_id in mapping:
            # Update existing
            notion_page_id = mapping[fu_id]
            try:
                if dry_run:
                    print(f"📝 Would update: {fu.get('contact_nom')} — {fu.get('motif')} [{fu.get('status')}]")
                else:
                    update_notion_page(notion_page_id, fu)
                    print(f"📝 Updated: {fu.get('contact_nom')} — {fu.get('motif')}")
                updated += 1
            except Exception as e:
                print(f"❌ Error updating {fu_id}: {e}")
                errors += 1
        else:
            # Create new
            try:
                if dry_run:
                    print(f"✨ Would create: {fu.get('contact_nom')} — {fu.get('motif')} [{fu.get('status')}]")
                else:
                    result = create_notion_page(fu)
                    mapping[fu_id] = result['id']
                    print(f"✨ Created: {fu.get('contact_nom')} — {fu.get('motif')}")
                created += 1
            except Exception as e:
                print(f"❌ Error creating {fu_id}: {e}")
                errors += 1
    
    if not dry_run and created > 0:
        save_mapping(mapping)
    
    print()
    print(f"✅ Summary: {created} created, {updated} updated, {skipped} skipped, {errors} errors")
    
    return 0 if errors == 0 else 1


def show_status():
    """Show current sync status"""
    if not CRM_DB.exists():
        print("❌ CRM database not found")
        return 1
    
    mapping = load_mapping()
    followups = get_crm_followups()
    
    # Count by status
    status_counts = {}
    for fu in followups:
        status = fu.get('status', 'UNKNOWN')
        status_counts[status] = status_counts.get(status, 0) + 1
    
    print("📊 CRM Followups Status")
    print("=" * 40)
    for status, count in sorted(status_counts.items()):
        notion_status = STATUS_MAP.get(status, '?')
        print(f"  {status:20} → {notion_status:15} ({count})")
    print(f"\nTotal: {len(followups)}")
    print(f"Synced to Notion: {len(mapping)}")
    print(f"Pending sync: {len(followups) - len(mapping)}")
    
    return 0


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Sync CRM followups to Notion')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without applying')
    parser.add_argument('--apply', action='store_true', help='Apply changes')
    parser.add_argument('--status', action='store_true', help='Show sync status')
    
    args = parser.parse_args()
    
    if args.status:
        return show_status()
    elif args.apply:
        return sync(dry_run=False)
    else:
        return sync(dry_run=True)


if __name__ == "__main__":
    sys.exit(main())
