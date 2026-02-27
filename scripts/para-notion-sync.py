#!/usr/bin/env python3
"""
PARA -> Notion sync (idempotent)
- Uses parent children listing (not global search)
- Normalizes IDs to avoid hyphen/no-hyphen mismatch
- Updates existing pages by clearing old blocks then re-writing content
- Optional dedupe mode to archive duplicate pages per parent+title
"""

import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

NOTES_DIR = Path.home() / ".openclaw" / "workspace" / "notes"
PARA_CATEGORIES = ["projects", "areas", "resources", "archive"]
NOTION_TEXT_LIMIT = 2000
SAFE_CHUNK_SIZE = 1800
MAX_CHILDREN_PER_REQUEST = 100


def norm_id(value: str | None) -> str:
    return (value or "").replace("-", "").lower().strip()


def norm_title(value: str | None) -> str:
    return " ".join((value or "").strip().split()).lower()


def get_api_key():
    creds_path = Path.home() / ".openclaw" / "workspace" / ".credentials" / "maton-api-key.txt"
    if creds_path.exists():
        return creds_path.read_text().strip()
    return os.environ.get("MATON_API_KEY")


def get_notion_parent_id():
    config_path = Path.home() / ".openclaw" / "workspace" / ".credentials" / "notion-para-parent-id.txt"
    if config_path.exists():
        return config_path.read_text().strip()
    return None


def get_category_parent_ids():
    mapping_path = Path.home() / ".openclaw" / "workspace" / ".credentials" / "notion-para-mapping.json"
    if mapping_path.exists():
        return json.loads(mapping_path.read_text())
    parent_id = get_notion_parent_id()
    return {"projects": parent_id, "areas": parent_id, "resources": parent_id, "archive": parent_id}


def notion_request(path, method="GET", data=None, api_key=None):
    if not api_key:
        api_key = get_api_key()
        if not api_key:
            raise ValueError("MATON_API_KEY not found")

    url = f"https://gateway.maton.ai/notion{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Notion-Version", "2025-09-03")

    if data is not None:
        req.add_header("Content-Type", "application/json")
        req.data = json.dumps(data).encode()

    with urllib.request.urlopen(req, timeout=45) as resp:
        raw = resp.read().decode()
        return json.loads(raw) if raw else {}


def list_block_children(block_id, api_key):
    items = []
    cursor = None
    while True:
        qs = f"?page_size={MAX_CHILDREN_PER_REQUEST}"
        if cursor:
            qs += "&start_cursor=" + urllib.parse.quote(cursor, safe="")
        out = notion_request(f"/v1/blocks/{block_id}/children{qs}", api_key=api_key)
        items.extend(out.get("results", []))
        if not out.get("has_more"):
            break
        cursor = out.get("next_cursor")
        if not cursor:
            break
    return items


def list_child_pages(parent_id, api_key):
    pages = []
    for b in list_block_children(parent_id, api_key):
        if b.get("type") == "child_page":
            pages.append({
                "id": b.get("id"),
                "title": b.get("child_page", {}).get("title", "")
            })
    return pages


def archive_page(page_id, api_key):
    notion_request(f"/v1/pages/{page_id}", method="PATCH", data={"archived": True}, api_key=api_key)


def delete_block(block_id, api_key):
    notion_request(f"/v1/blocks/{block_id}", method="DELETE", api_key=api_key)


def clear_page_children(page_id, api_key):
    for child in list_block_children(page_id, api_key):
        cid = child.get("id")
        if cid:
            delete_block(cid, api_key)


def split_text_for_notion(content, max_len=SAFE_CHUNK_SIZE):
    text = (content or "").replace("\r\n", "\n")
    if not text.strip():
        return ["(vide)"]

    chunks = []
    paragraphs = text.split("\n\n")
    for para in paragraphs:
        p = para.strip()
        if not p:
            continue
        while len(p) > max_len:
            chunks.append(p[:max_len])
            p = p[max_len:]
        chunks.append(p)

    if not chunks:
        chunks = [text[:max_len]]
    return [c[:NOTION_TEXT_LIMIT] for c in chunks]


def build_paragraph_blocks(content):
    return [{
        "object": "block",
        "type": "paragraph",
        "paragraph": {"rich_text": [{"type": "text", "text": {"content": chunk}}]}
    } for chunk in split_text_for_notion(content)]


def append_blocks_in_batches(page_id, blocks, api_key):
    for i in range(0, len(blocks), MAX_CHILDREN_PER_REQUEST):
        batch = blocks[i:i + MAX_CHILDREN_PER_REQUEST]
        notion_request(f"/v1/blocks/{page_id}/children", method="PATCH", data={"children": batch}, api_key=api_key)


def ensure_no_duplicates(parent_id, api_key):
    pages = list_child_pages(parent_id, api_key)
    by_title = {}
    archived = 0
    for p in pages:
        key = norm_title(p["title"])
        if not key:
            continue
        if key not in by_title:
            by_title[key] = p
            continue
        # duplicate -> archive newer duplicate page
        archive_page(p["id"], api_key)
        archived += 1
    return archived


def create_or_update_page(parent_id, title, content, api_key):
    pages = list_child_pages(parent_id, api_key)
    wanted = norm_title(title)

    match = None
    for p in pages:
        if norm_title(p["title"]) == wanted:
            match = p
            break

    blocks = build_paragraph_blocks(content)
    if match:
        page_id = match["id"]
        print(f"  Updating: {title}")
        clear_page_children(page_id, api_key)
        append_blocks_in_batches(page_id, blocks, api_key)
        return page_id, "updated"

    print(f"  Creating: {title}")
    first = blocks[:MAX_CHILDREN_PER_REQUEST]
    rest = blocks[MAX_CHILDREN_PER_REQUEST:]
    created = notion_request("/v1/pages", method="POST", data={
        "parent": {"page_id": parent_id},
        "properties": {"title": {"title": [{"text": {"content": title}}]}},
        "children": first
    }, api_key=api_key)
    page_id = created.get("id")
    if page_id and rest:
        append_blocks_in_batches(page_id, rest, api_key)
    return page_id, "created"


def get_category_emoji(category):
    return {"projects": "🚀", "areas": "🌱", "resources": "📚", "archive": "📦"}.get(category, "📝")


def scan_para_files():
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
                "mtime": md_file.stat().st_mtime,
            })
    return files


def main():
    api_key = get_api_key()
    category_parents = get_category_parent_ids()

    if not api_key:
        print("❌ Error: MATON_API_KEY not found", file=sys.stderr)
        sys.exit(1)

    if not category_parents or not any(category_parents.values()):
        print("❌ Error: Notion parent IDs not found", file=sys.stderr)
        sys.exit(1)

    print(f"🔄 PARA Sync started at {datetime.now().isoformat()}")

    # Pre-dedupe per category parent
    deduped = 0
    seen_parents = set()
    for cat in PARA_CATEGORIES:
        pid = category_parents.get(cat) or category_parents.get("root")
        if not pid:
            continue
        nid = norm_id(pid)
        if nid in seen_parents:
            continue
        seen_parents.add(nid)
        d = ensure_no_duplicates(pid, api_key)
        deduped += d

    files = scan_para_files()
    print(f"📄 Found {len(files)} markdown files")

    stats = {"created": 0, "updated": 0, "errors": 0, "deduped": deduped}

    for file_info in sorted(files, key=lambda x: x["mtime"], reverse=True):
        cat = file_info["category"]
        parent_id = category_parents.get(cat, category_parents.get("root"))
        if not parent_id:
            print(f"⚠️  Skipping {file_info['rel_path']}: no parent ID for category {cat}")
            continue

        print(f"{get_category_emoji(cat)} [{cat.upper()}] {file_info['rel_path']}")
        try:
            page_id, action = create_or_update_page(parent_id=parent_id, title=file_info["title"], content=file_info["content"], api_key=api_key)
            if page_id and action in stats:
                stats[action] += 1
        except Exception as e:
            print(f"  ❌ Error: {e}", file=sys.stderr)
            stats["errors"] += 1

    print("\n✅ Sync completed!")
    print(f"   Created: {stats['created']}")
    print(f"   Updated: {stats['updated']}")
    print(f"   Deduped: {stats['deduped']}")
    print(f"   Errors: {stats['errors']}")

    return 0 if stats["errors"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
