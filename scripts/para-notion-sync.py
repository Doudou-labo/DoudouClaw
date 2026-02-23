#!/usr/bin/env python3
"""
Sync PARA notes from local filesystem to Notion.
Scans notes/{projects,areas,resources,archive}/ and creates/updates pages in Notion.
"""

import os
import sys
import json
import urllib.request
from pathlib import Path
from datetime import datetime

# Config
NOTES_DIR = Path.home() / ".openclaw" / "workspace" / "notes"
PARA_CATEGORIES = ["projects", "areas", "resources", "archive"]

def get_api_key():
    """Get Maton API key from credentials file."""
    creds_path = Path.home() / ".openclaw" / "workspace" / ".credentials" / "maton-api-key.txt"
    if creds_path.exists():
        return creds_path.read_text().strip()
    return os.environ.get("MATON_API_KEY")

def get_notion_parent_id():
    """Get Notion parent page/database ID from config."""
    config_path = Path.home() / ".openclaw" / "workspace" / ".credentials" / "notion-para-parent-id.txt"
    if config_path.exists():
        return config_path.read_text().strip()
    return None

def get_category_parent_ids():
    """Get mapping of PARA category -> Notion page ID."""
    mapping_path = Path.home() / ".openclaw" / "workspace" / ".credentials" / "notion-para-mapping.json"
    if mapping_path.exists():
        return json.loads(mapping_path.read_text())
    # Fallback: use single parent ID for all
    parent_id = get_notion_parent_id()
    return {
        "projects": parent_id,
        "areas": parent_id,
        "resources": parent_id,
        "archive": parent_id
    }

def notion_request(path, method="GET", data=None, api_key=None):
    """Make a request to Notion API via Maton gateway."""
    if not api_key:
        api_key = get_api_key()
        if not api_key:
            raise ValueError("MATON_API_KEY not found")
    
    url = f"https://gateway.maton.ai/notion{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Notion-Version", "2025-09-03")
    
    if data:
        req.add_header("Content-Type", "application/json")
        req.data = json.dumps(data).encode()
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"HTTP Error {e.code}: {error_body}", file=sys.stderr)
        raise

def search_page_by_title(title, api_key):
    """Search for a page with given title."""
    result = notion_request("/v1/search", method="POST", data={
        "query": title,
        "filter": {"property": "object", "value": "page"}
    }, api_key=api_key)
    return result.get("results", [])

def create_or_update_page(parent_id, title, content, category, api_key):
    """Create or update a page in Notion."""
    # Search existing page
    existing = search_page_by_title(title, api_key)
    for page in existing:
        if page.get("parent", {}).get("page_id") == parent_id or \
           page.get("parent", {}).get("database_id") == parent_id:
            # Update existing page
            page_id = page["id"]
            print(f"  Updating: {title}")
            notion_request(f"/v1/pages/{page_id}", method="PATCH", data={
                "properties": {
                    "title": {"title": [{"text": {"content": title}}]}
                }
            }, api_key=api_key)
            # Update content (append new block)
            notion_request(f"/v1/blocks/{page_id}/children", method="PATCH", data={
                "children": [{
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": content[:1990]}}]
                    }
                }]
            }, api_key=api_key)
            return page_id
    
    # Create new page
    print(f"  Creating: {title}")
    page_data = {
        "parent": {"page_id": parent_id},
        "properties": {
            "title": {"title": [{"text": {"content": title}}]}
        },
        "children": [{
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"type": "text", "text": {"content": content[:1990]}}]
            }
        }]
    }
    result = notion_request("/v1/pages", method="POST", data=page_data, api_key=api_key)
    return result.get("id")

def get_category_emoji(category):
    """Get emoji for PARA category."""
    emojis = {
        "projects": "🚀",
        "areas": "🌱",
        "resources": "📚",
        "archive": "📦"
    }
    return emojis.get(category, "📝")

def scan_para_files():
    """Scan all PARA markdown files."""
    files = []
    for category in PARA_CATEGORIES:
        cat_dir = NOTES_DIR / category
        if not cat_dir.exists():
            continue
        for md_file in cat_dir.rglob("*.md"):
            rel_path = md_file.relative_to(cat_dir)
            files.append({
                "category": category,
                "path": md_file,
                "rel_path": str(rel_path),
                "title": md_file.stem.replace("-", " ").replace("_", " ").title(),
                "content": md_file.read_text(encoding="utf-8"),
                "mtime": md_file.stat().st_mtime
            })
    return files

def main():
    api_key = get_api_key()
    category_parents = get_category_parent_ids()
    
    if not api_key:
        print("❌ Error: MATON_API_KEY not found", file=sys.stderr)
        print("   Create: .credentials/maton-api-key.txt", file=sys.stderr)
        sys.exit(1)
    
    if not category_parents or not any(category_parents.values()):
        print("❌ Error: Notion parent IDs not found", file=sys.stderr)
        print("   Create: .credentials/notion-para-mapping.json", file=sys.stderr)
        sys.exit(1)
    
    print(f"🔄 PARA Sync started at {datetime.now().isoformat()}")
    print(f"📁 Notes dir: {NOTES_DIR}")
    print(f"🎯 Notion mapping: Projects→{category_parents.get('projects','?')[:8]}... Areas→{category_parents.get('areas','?')[:8]}... Resources→{category_parents.get('resources','?')[:8]}...")
    print()
    
    files = scan_para_files()
    print(f"📄 Found {len(files)} markdown files")
    print()
    
    stats = {"created": 0, "updated": 0, "errors": 0}
    
    for file_info in sorted(files, key=lambda x: x["mtime"], reverse=True):
        emoji = get_category_emoji(file_info["category"])
        parent_id = category_parents.get(file_info["category"], category_parents.get("root"))
        
        if not parent_id:
            print(f"⚠️  Skipping {file_info['rel_path']}: no parent ID for category {file_info['category']}")
            continue
        
        print(f"{emoji} [{file_info['category'].upper()}] {file_info['rel_path']} -> {parent_id[:8]}...")
        
        try:
            page_id = create_or_update_page(
                parent_id=parent_id,
                title=file_info["title"],
                content=file_info["content"],
                category=file_info["category"],
                api_key=api_key
            )
            if page_id:
                stats["updated" if any(
                    p.get("parent", {}).get("page_id") == parent_id 
                    for p in search_page_by_title(file_info["title"], api_key)
                ) else "created"] += 1
        except Exception as e:
            print(f"  ❌ Error: {e}", file=sys.stderr)
            stats["errors"] += 1
    
    print()
    print(f"✅ Sync completed!")
    print(f"   Created: {stats['created']}")
    print(f"   Updated: {stats['updated']}")
    print(f"   Errors: {stats['errors']}")
    
    return stats

if __name__ == "__main__":
    main()
