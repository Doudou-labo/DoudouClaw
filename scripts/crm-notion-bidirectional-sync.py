#!/usr/bin/env python3
"""
crm-notion-bidirectional-sync.py — Sync bidirectionnel CRM ↔ Notion

Usage:
  python3 scripts/crm-notion-bidirectional-sync.py --dry-run    # Preview
  python3 scripts/crm-notion-bidirectional-sync.py --apply      # Apply
  python3 scripts/crm-notion-bidirectional-sync.py --status     # Status
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
LAST_SYNC_FILE = WORKSPACE / "data" / "crm_notion_last_sync.txt"

# Notion API config
NOTION_DS_ID = "3109cdc8-2c0c-81db-9578-000bd094e927"
MATON_API_KEY = os.environ.get("MATON_API_KEY")

# Status mappings
CRM_TO_NOTION = {
    "PROCHAINEMENT": "À venir",
    "EN_ATTENTE_EXTERNE": "En attente",
    "A_FAIRE": "Cette semaine",
    "FAIT": "Terminé"
}

NOTION_TO_CRM = {v: k for k, v in CRM_TO_NOTION.items()}


def load_mapping():
    """Load CRM ID → Notion Page ID mapping"""
    if MAPPING_FILE.exists():
        with open(MAPPING_FILE) as f:
            return json.load(f)
    return {}


def save_mapping(mapping):
    """Save mapping to file"""
    MAPPING_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(MAPPING_FILE, 'w') as f:
        json.dump(mapping, f, indent=2)


def get_last_sync():
    """Get last sync timestamp"""
    if LAST_SYNC_FILE.exists():
        try:
            with open(LAST_SYNC_FILE) as f:
                return f.read().strip()
        except:
            pass
    return None


def set_last_sync(timestamp):
    """Set last sync timestamp"""
    LAST_SYNC_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LAST_SYNC_FILE, 'w') as f:
        f.write(timestamp)


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
        SELECT f.id, f.contact_id, f.motif, f.due_at, f.status, f.created_at, f.updated_at,
               c.nom as contact_nom, c.tel, c.societe, c.loueur
        FROM followups f
        JOIN contacts c ON f.contact_id = c.id
        ORDER BY f.due_at
    """)
    
    followups = {str(row['id']): dict(row) for row in cursor.fetchall()}
    conn.close()
    return followups


def get_notion_pages():
    """Fetch all pages from Notion data source"""
    url = f"/v1/data_sources/{NOTION_DS_ID}/query"
    data = {"page_size": 100}
    
    result = notion_api_call("POST", url, data)
    pages = {}
    
    for page in result.get('results', []):
        page_id = page['id']
        props = page.get('properties', {})
        
        # Extract CRM ID from title if present
        name = props.get('Nom', {}).get('title', [{}])[0].get('text', {}).get('content', '')
        crm_id = None
        if name.startswith('[') and ']' in name:
            try:
                crm_id = name[1:name.index(']')]
            except:
                pass
        
        # Get status
        status = props.get('Statut', {}).get('select', {}).get('name', '')
        
        # Get last edited time
        last_edited = page.get('last_edited_time', '')
        
        pages[page_id] = {
            'id': page_id,
            'crm_id': crm_id,
            'name': name,
            'status': status,
            'last_edited': last_edited
        }
    
    return pages


def update_crm_followup(followup_id: int, new_status: str):
    """Update followup status in CRM"""
    conn = sqlite3.connect(CRM_DB)
    cursor = conn.cursor()
    
    # Validate status
    valid_statuses = ['PROCHAINEMENT', 'EN_ATTENTE_EXTERNE', 'A_FAIRE', 'FAIT']
    if new_status not in valid_statuses:
        raise ValueError(f"Invalid status: {new_status}")
    
    cursor.execute(
        "UPDATE followups SET status = ?, updated_at = datetime('now') WHERE id = ?",
        (new_status, followup_id)
    )
    conn.commit()
    conn.close()


def update_notion_page(page_id: str, new_status: str):
    """Update page status in Notion"""
    properties = {
        "Statut": {"select": {"name": new_status}}
    }
    
    notion_api_call("PATCH", f"/v1/pages/{page_id}", {"properties": properties})


def create_notion_page(followup: dict):
    """Create a new page in Notion for a followup"""
    contact_name = followup.get('contact_nom') or 'Inconnu'
    motif = followup.get('motif', '')
    fu_id = str(followup['id'])
    title = f"[{fu_id}] {contact_name} — {motif}"
    
    crm_status = followup.get('status', 'A_FAIRE')
    notion_status = CRM_TO_NOTION.get(crm_status, 'À venir')
    
    description_parts = []
    if followup.get('tel'):
        description_parts.append(f"📞 {followup['tel']}")
    if followup.get('societe'):
        description_parts.append(f"🏢 {followup['societe']}")
    if followup.get('loueur'):
        description_parts.append(f"👤 Loueur: {followup['loueur']}")
    
    description = "\n".join(description_parts) if description_parts else ""
    
    due_date = followup.get('due_at')
    date_obj = None
    if due_date:
        try:
            date_str = due_date.replace('Z', '+00:00')
            date_obj = datetime.fromisoformat(date_str)
        except:
            pass
    
    properties = {
        "Nom": {"title": [{"text": {"content": title[:100]}}]},
        "Statut": {"select": {"name": notion_status}},
        "Description": {"rich_text": [{"text": {"content": description}}]},
        "Catégorie": {"multi_select": [{"name": "Tâche"}]}
    }
    
    if followup.get('societe'):
        properties["Société"] = {"rich_text": [{"text": {"content": followup['societe']}}]}
    
    if date_obj:
        properties["Date d\u2019échéance"] = {"date": {"start": date_obj.strftime("%Y-%m-%d")}}
    
    data = {
        "parent": {"data_source_id": NOTION_DS_ID},
        "properties": properties,
        "icon": {"type": "emoji", "emoji": "📋"}
    }
    
    return notion_api_call("POST", "/v1/pages", data)


def sync_bidirectional(dry_run: bool = False):
    """Main bidirectional sync function"""
    if not MATON_API_KEY:
        print("❌ MATON_API_KEY not set")
        return 1
    
    if not CRM_DB.exists():
        print(f"❌ CRM database not found: {CRM_DB}")
        return 1
    
    mapping = load_mapping()  # crm_id -> notion_page_id
    reverse_mapping = {v: k for k, v in mapping.items()}  # notion_page_id -> crm_id
    
    crm_followups = get_crm_followups()
    notion_pages = get_notion_pages()
    
    # Track changes
    crm_to_notion_updates = []
    notion_to_crm_updates = []
    creations = []
    conflicts = []
    
    print(f"📊 CRM: {len(crm_followups)} followups")
    print(f"📊 Notion: {len(notion_pages)} pages")
    print()
    
    # 1. CRM → Notion: New followups and updates
    for fu_id, fu in crm_followups.items():
        crm_status = fu.get('status', 'A_FAIRE')
        expected_notion_status = CRM_TO_NOTION.get(crm_status, 'À venir')
        
        if fu_id in mapping:
            # Existing mapping - check for updates
            notion_page_id = mapping[fu_id]
            notion_page = notion_pages.get(notion_page_id)
            
            if notion_page:
                notion_status = notion_page.get('status', '')
                if notion_status != expected_notion_status:
                    # Status mismatch - check which is newer
                    # For now, CRM wins for existing mappings unless explicitly changed in Notion
                    crm_to_notion_updates.append({
                        'fu_id': fu_id,
                        'page_id': notion_page_id,
                        'contact': fu.get('contact_nom'),
                        'from_status': notion_status,
                        'to_status': expected_notion_status
                    })
        else:
            # New followup - create in Notion
            creations.append({
                'fu_id': fu_id,
                'contact': fu.get('contact_nom'),
                'motif': fu.get('motif'),
                'status': expected_notion_status
            })
    
    # 2. Notion → CRM: Updates made in Notion
    for page_id, page in notion_pages.items():
        notion_status = page.get('status', '')
        crm_id = page.get('crm_id') or reverse_mapping.get(page_id)
        
        if crm_id and crm_id in crm_followups:
            expected_crm_status = NOTION_TO_CRM.get(notion_status)
            actual_crm_status = crm_followups[crm_id].get('status')
            
            if expected_crm_status and expected_crm_status != actual_crm_status:
                # Notion has different status - update CRM
                notion_to_crm_updates.append({
                    'fu_id': crm_id,
                    'page_id': page_id,
                    'contact': crm_followups[crm_id].get('contact_nom'),
                    'from_status': actual_crm_status,
                    'to_status': expected_crm_status
                })
    
    # Apply changes
    if dry_run:
        print("🔍 DRY RUN - No changes applied")
        print()
    
    # Process creations (CRM → Notion)
    for item in creations:
        if dry_run:
            print(f"✨ Would create in Notion: {item['contact']} — {item['motif']} [{item['status']}]")
        else:
            try:
                fu = crm_followups[item['fu_id']]
                result = create_notion_page(fu)
                mapping[item['fu_id']] = result['id']
                print(f"✨ Created in Notion: {item['contact']} — {item['motif']}")
            except Exception as e:
                print(f"❌ Error creating {item['fu_id']}: {e}")
    
    # Process CRM → Notion updates
    for item in crm_to_notion_updates:
        if dry_run:
            print(f"📝 Would update Notion: {item['contact']} [{item['from_status']} → {item['to_status']}]")
        else:
            try:
                update_notion_page(item['page_id'], item['to_status'])
                print(f"📝 Updated Notion: {item['contact']} [{item['from_status']} → {item['to_status']}]")
            except Exception as e:
                print(f"❌ Error updating Notion {item['page_id']}: {e}")
    
    # Process Notion → CRM updates
    for item in notion_to_crm_updates:
        if dry_run:
            print(f"🔄 Would update CRM: {item['contact']} [{item['from_status']} → {item['to_status']}]")
        else:
            try:
                update_crm_followup(int(item['fu_id']), item['to_status'])
                print(f"🔄 Updated CRM: {item['contact']} [{item['from_status']} → {item['to_status']}]")
            except Exception as e:
                print(f"❌ Error updating CRM {item['fu_id']}: {e}")
    
    if not dry_run:
        save_mapping(mapping)
        set_last_sync(datetime.now().isoformat())
    
    print()
    print(f"📈 Summary: {len(creations)} created, {len(crm_to_notion_updates)} CRM→Notion, {len(notion_to_crm_updates)} Notion→CRM")
    
    return 0


def show_status():
    """Show sync status"""
    if not CRM_DB.exists():
        print("❌ CRM database not found")
        return 1
    
    mapping = load_mapping()
    followups = get_crm_followups()
    
    last_sync = get_last_sync()
    
    print("📊 Sync Status")
    print("=" * 40)
    print(f"CRM followups: {len(followups)}")
    print(f"Synced to Notion: {len(mapping)}")
    print(f"Pending sync: {len(followups) - len(mapping)}")
    if last_sync:
        print(f"Last sync: {last_sync}")
    else:
        print("Last sync: Never")
    
    return 0


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Bidirectional sync CRM ↔ Notion')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes')
    parser.add_argument('--apply', action='store_true', help='Apply changes')
    parser.add_argument('--status', action='store_true', help='Show status')
    
    args = parser.parse_args()
    
    if args.status:
        return show_status()
    elif args.apply:
        return sync_bidirectional(dry_run=False)
    else:
        return sync_bidirectional(dry_run=True)


if __name__ == "__main__":
    sys.exit(main())
