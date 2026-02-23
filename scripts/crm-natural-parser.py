#!/usr/bin/env python3
"""
crm-natural-parser.py — Parse natural language and create CRM/Notion entries

Usage:
  python3 scripts/crm-natural-parser.py "il faut que je rappelle Mr Dupont au 0606060606 le 24 février à 10h pour un pneu Michelin 205/55R16 CrossClimate"
"""

import os
import sys
import re
import json
import sqlite3
import urllib.request
from pathlib import Path
from datetime import datetime, timedelta

# Config
WORKSPACE = Path("/root/.openclaw/workspace")
CRM_DB = WORKSPACE / "data" / "crm.sqlite"
MAPPING_FILE = WORKSPACE / "data" / "crm_notion_map.json"
NOTION_DS_ID = "3109cdc8-2c0c-81db-9578-000bd094e927"
MATON_API_KEY = os.environ.get("MATON_API_KEY")

# Status mapping
CRM_TO_NOTION = {
    "PROCHAINEMENT": "À venir",
    "EN_ATTENTE_EXTERNE": "En attente",
    "A_FAIRE": "Cette semaine",
    "FAIT": "Terminé"
}

# Tire dimension pattern: 205/55R16, 195/65 R15, etc.
TIRE_PATTERN = re.compile(r'(\d{3})/(\d{2,3})\s*R\s*(\d{2})', re.IGNORECASE)

# Phone pattern
PHONE_PATTERN = re.compile(r'(\b0\d[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}\b)')

# Date patterns
DATE_PATTERNS = [
    # "24 février à 10h" / "24 février 2026 à 10h"
    (re.compile(r'(\d{1,2})\s+([a-zéû]+)(?:\s+(\d{4}))?\s*(?:à|@)?\s*(\d{1,2})\s*h?(\d{2})?'), 'french'),
    # "demain à 10h"
    (re.compile(r'(demain|aujourd\'hui|après-demain)\s*(?:à|@)?\s*(\d{1,2})\s*h?(\d{2})?'), 'relative'),
]

MONTHS_FR = {
    'janvier': 1, 'février': 2, 'fevrier': 2, 'mars': 3, 'avril': 4,
    'mai': 5, 'juin': 6, 'juillet': 7, 'août': 8, 'aout': 8,
    'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12
}


def parse_tire_dimension(text):
    """Extract tire dimension from text"""
    match = TIRE_PATTERN.search(text)
    if match:
        width, ratio, rim = match.groups()
        return f"{width}/{ratio}R{rim}"
    return None


def parse_tire_brand_model(text):
    """Extract tire brand and model from text"""
    match = TIRE_PATTERN.search(text)
    if not match:
        return None
    
    # Look for brand BEFORE the dimension (e.g., "Michelin 205/55R16")
    start_pos = match.start()
    before = text[:start_pos].strip()
    before_words = before.split()
    brand = None
    
    # Take last 1-2 words before dimension as brand (if they look like proper nouns)
    if before_words:
        potential_brand = before_words[-1]
        # Check if it looks like a brand (capitalized or known brand)
        if potential_brand[0].isupper() or potential_brand.lower() in ['michelin', 'continental', 'pirelli', 'bridgestone', 'goodyear', 'dunlop', 'hankook', 'nokian', 'vredenstein']:
            brand = potential_brand
    
    # Look for model AFTER the dimension
    end_pos = match.end()
    rest = text[end_pos:].strip()
    words = rest.split()
    model_words = []
    
    for word in words[:3]:  # Max 3 words for model
        word_clean = word.strip('.,;:!?')
        if word_clean.lower() in ['pour', 'un', 'une', 'le', 'la', 'suite', 'car', 'a', 'sur', 'de']:
            break
        model_words.append(word_clean)
    
    model = ' '.join(model_words) if model_words else None
    
    # Combine brand + model
    if brand and model:
        return f"{brand} {model}"
    elif brand:
        return brand
    elif model:
        return model
    
    return None


def parse_phone(text):
    """Extract phone number"""
    match = PHONE_PATTERN.search(text)
    if match:
        # Clean up: remove spaces and dots
        phone = re.sub(r'[\s\.]', '', match.group(1))
        return phone
    return None


def parse_societe(text):
    """Extract company name from text"""
    text_lower = text.lower()
    
    # Patterns for company detection
    patterns = [
        r'(?:pour\s+la\s+société|pour\s+la\s+ste|chez|société|ste|entreprise|sarl|sas|eurl)\s+([A-Z][A-Za-z0-9\s&\.\-]+?)(?:\s+(?:pour|au|le|la|un|une|à|@)\s|$)',
        r'(?:client\s+pro|professionnel|société)\s*:?\s*([A-Z][A-Za-z0-9\s&\.\-]+?)(?:\s+(?:pour|au|le)\s|$)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            # Clean up and limit length
            societe = match.group(1).strip()
            # Remove trailing words that aren't part of company name
            societe = re.sub(r'\s+(pour|au|le|la|un|une|à|@|en|sur)\s+.*$', '', societe, flags=re.IGNORECASE)
            return societe[:100]  # Limit length
    
    return None


def parse_date(text):
    """Extract date and time from text"""
    text_lower = text.lower()
    now = datetime.now()
    
    # Try relative dates first
    if 'demain' in text_lower:
        match = re.search(r'demain\s*(?:à|@)?\s*(\d{1,2})\s*h?(\d{2})?', text_lower)
        if match:
            hour = int(match.group(1))
            minute = int(match.group(2)) if match.group(2) else 0
            date = now + timedelta(days=1)
            return date.replace(hour=hour, minute=minute, second=0, microsecond=0)
        else:
            return (now + timedelta(days=1)).replace(hour=9, minute=0)
    
    if 'aujourd\'hui' in text_lower or "aujourd'hui" in text_lower:
        match = re.search(r"aujourd'hui\s*(?:à|@)?\s*(\d{1,2})\s*h?(\d{2})?", text_lower)
        if match:
            hour = int(match.group(1))
            minute = int(match.group(2)) if match.group(2) else 0
            return now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    # French date: "24 février à 10h" - look for month name specifically
    # Pattern: day (1-31) + month name + optional year + @/à + hour
    month_pattern = '|'.join(MONTHS_FR.keys())
    regex = rf'(\d{{1,2}})\s+({month_pattern})\s*(?:à|@|a)?\s*(\d{{1,2}})(?:\s*h|:)?(\d{{2}})?'
    match = re.search(regex, text_lower, re.IGNORECASE)
    
    if match:
        day = int(match.group(1))
        month_str = match.group(2).lower().rstrip('s')
        hour = int(match.group(3)) if match.group(3) else 9
        minute = int(match.group(4)) if match.group(4) else 0
        
        month = MONTHS_FR.get(month_str)
        if month:
            try:
                return datetime(now.year, month, day, hour, minute)
            except:
                pass
    
    # Default: tomorrow 9am
    return (now + timedelta(days=1)).replace(hour=9, minute=0)


def parse_name(text):
    """Extract person name from text"""
    # Look for patterns: "Mr Dupont", "Mme Martin", "rappeler X", "appeler X"
    patterns = [
        r'(?:Monsieur|M|M\.\s*|Mr\s+|Mme\s+|Madame\s+)([A-Z][a-z]+)',
        r'(?:rappeller?|appeller?)\s+(?:Monsieur|M|M\.\s*|Mr\s+|Mme\s+|Madame\s+)?([A-Z][a-z]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    # Fallback: look for capitalized words after "rappelle"
    match = re.search(r'rappelle\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    
    return "Contact"


def guess_category(text):
    """Guess category based on keywords"""
    text_lower = text.lower()
    categories = ["Tâche"]
    
    if any(word in text_lower for word in ['pneu', 'crevaison', 'gonflage', 'valve']):
        categories.append("Attente pneu")
    if any(word in text_lower for word in ['roue', 'déposée', 'jante']):
        categories.append("Roue déposée")
    if any(word in text_lower for word in ['devis', 'relance', 'tarif', 'prix']):
        categories.append("Rappel devis")
    if any(word in text_lower for word in ['dépannage', 'panne', 'urgence', 'remorquage']):
        categories.append("Dépannage")
    
    return categories


def guess_priority(text):
    """Guess priority based on keywords"""
    text_lower = text.lower()
    
    urgent = ['urgence', 'urgent', 'crevaison', 'dépannage', 'panne', 'immédiat', 'aujourd\'hui']
    if any(word in text_lower for word in urgent):
        return "Haute 🔥"
    
    low = ['semaine prochaine', 'mois prochain', 'pas pressé', 'basse priorité']
    if any(word in text_lower for word in low):
        return "Basse"
    
    return "Moyenne"


def parse_input(text):
    """Main parsing function"""
    result = {
        'raw': text,
        'name': parse_name(text),
        'phone': parse_phone(text),
        'societe': parse_societe(text),
        'date': parse_date(text),
        'tire_dimension': parse_tire_dimension(text),
        'tire_brand_model': parse_tire_brand_model(text),
        'categories': guess_category(text),
        'priority': guess_priority(text)
    }
    return result


def format_summary(parsed):
    """Format parsed data for display"""
    lines = [
        "📋 **Compris :**",
        f"**Nom :** {parsed['name']}",
    ]
    
    if parsed['societe']:
        lines.append(f"**Société :** {parsed['societe']}")
    
    lines.extend([
        f"**Téléphone :** {parsed['phone'] or 'Non spécifié'}",
        f"**Date :** {parsed['date'].strftime('%d/%m/%Y à %Hh%M')}",
        f"**Priorité :** {parsed['priority']}",
    ])
    
    if parsed['tire_dimension']:
        lines.append(f"**Dimension pneu :** {parsed['tire_dimension']}")
    if parsed['tire_brand_model']:
        lines.append(f"**Pneu :** {parsed['tire_brand_model']}")
    
    lines.append(f"**Catégories :** {', '.join(parsed['categories'])}")
    lines.append(f"**Description :** {parsed['raw']}")
    
    return '\n'.join(lines)


def get_or_create_contact(name, phone=None, societe=None):
    """Get or create contact in CRM"""
    conn = sqlite3.connect(CRM_DB)
    cursor = conn.cursor()
    
    # Search by name
    cursor.execute("SELECT id FROM contacts WHERE nom LIKE ?", (f'%{name}%',))
    row = cursor.fetchone()
    
    if row:
        contact_id = row[0]
        # Update phone if provided and not set
        if phone:
            cursor.execute("UPDATE contacts SET tel = ? WHERE id = ? AND (tel IS NULL OR tel = '')", 
                         (phone, contact_id))
        conn.commit()
        conn.close()
        return contact_id, False  # existing
    
    # Create new contact
    cursor.execute(
        "INSERT INTO contacts (nom, tel, societe, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))",
        (name, phone, societe)
    )
    contact_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return contact_id, True  # new


def create_followup(contact_id, motif, due_date, phone=None, status='PROCHAINEMENT'):
    """Create followup in CRM"""
    conn = sqlite3.connect(CRM_DB)
    cursor = conn.cursor()
    
    due_str = due_date.strftime('%Y-%m-%d %H:%M')
    phone = phone or ''
    
    cursor.execute(
        "INSERT INTO followups (contact_id, motif, tel, due_at, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
        (contact_id, motif, phone, due_str, status)
    )
    followup_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return followup_id


def create_notion_page(parsed, followup_id, contact_name):
    """Create page in Notion"""
    if not MATON_API_KEY:
        raise RuntimeError("MATON_API_KEY not set")
    
    # Build title
    title = f"[{followup_id}] {contact_name}"
    if parsed['tire_dimension']:
        title += f" — {parsed['tire_dimension']}"
    else:
        title += " — Relance"
    
    # Build properties
    properties = {
        "Nom": {"title": [{"text": {"content": title[:100]}}]},
        "Statut": {"select": {"name": CRM_TO_NOTION['PROCHAINEMENT']}},
        "Description": {"rich_text": [{"text": {"content": parsed['raw']}}]},
        "Catégorie": {"multi_select": [{"name": c} for c in parsed['categories']]},
        "Priorité": {"select": {"name": parsed['priority']}},
        "Date d\u2019échéance": {"date": {"start": parsed['date'].strftime('%Y-%m-%d')}}
    }
    
    if parsed['tire_dimension']:
        properties["Dimension pneu"] = {"rich_text": [{"text": {"content": parsed['tire_dimension']}}]}
    
    if parsed['tire_brand_model']:
        properties["Pneu"] = {"rich_text": [{"text": {"content": parsed['tire_brand_model']}}]}
    
    if parsed['phone']:
        properties["Téléphone"] = {"phone_number": parsed['phone']}
    
    if parsed['societe']:
        properties["Société"] = {"rich_text": [{"text": {"content": parsed['societe']}}]}
    
    # API call
    url = f"https://gateway.maton.ai/notion/v1/pages"
    data = json.dumps({
        "parent": {"data_source_id": NOTION_DS_ID},
        "properties": properties,
        "icon": {"type": "emoji", "emoji": "📋"}
    }).encode()
    
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header("Authorization", f"Bearer {MATON_API_KEY}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Notion-Version", "2025-09-03")
    
    resp = urllib.request.urlopen(req)
    return json.load(resp)


def process(text):
    """Main processing function"""
    print("🔍 Analyse de la phrase...")
    print()
    
    # Parse
    parsed = parse_input(text)
    
    # Show what we understood
    print(format_summary(parsed))
    print()
    
    # Create in CRM
    print("💾 Création dans le CRM...")
    contact_id, is_new = get_or_create_contact(
        parsed['name'], 
        parsed['phone'],
        parsed['societe']
    )
    
    followup_id = create_followup(
        contact_id,
        parsed['raw'][:200],  # motif = truncated raw text
        parsed['date'],
        parsed['phone']
    )
    
    print(f"   ✅ Contact {'créé' if is_new else 'trouvé'} : {parsed['name']} (ID: {contact_id})")
    print(f"   ✅ Relance créée : ID {followup_id}")
    
    # Create in Notion
    print()
    print("📝 Création dans Notion...")
    try:
        notion_result = create_notion_page(parsed, followup_id, parsed['name'])
        print(f"   ✅ Page créée : {notion_result.get('url', 'OK')}")
    except Exception as e:
        print(f"   ❌ Erreur Notion : {e}")
    
    print()
    print("🎉 Terminé !")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 crm-natural-parser.py 'il faut rappeler Mr Dupont...'")
        print()
        print("Test avec une phrase exemple :")
        test = "il faut que je rappelle Mr Dupont au 0606060606 le 24 février à 10h pour un pneu Michelin 205/55R16 CrossClimate 3 suite a sa crevaison"
        print(f"> {test}")
        print()
        process(test)
        return
    
    text = ' '.join(sys.argv[1:])
    process(text)


if __name__ == "__main__":
    main()
