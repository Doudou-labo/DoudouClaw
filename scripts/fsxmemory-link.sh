#!/usr/bin/env bash
# fsxmemory link — auto-link wiki-style mentions [[entity]] dans les fichiers markdown
# Usage: fsxmemory-link.sh [--all | file.md]
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  echo "Usage: $0 --all | path/to/file.md"
  exit 1
fi

# Collect all entity names from people/ and projects/
declare -a ENTITIES=()
for dir in people projects; do
  if [ -d "$VAULT/$dir" ]; then
    for f in "$VAULT/$dir"/*.md; do
      [ -f "$f" ] || continue
      NAME=$(basename "$f" .md | sed 's/-/ /g')
      ENTITIES+=("$NAME")
    done
  fi
done

if [ ${#ENTITIES[@]} -eq 0 ]; then
  echo "ℹ️  No entities found in people/ or projects/ — nothing to link"
  exit 0
fi

link_file() {
  local file="$1"
  local changed=false
  for entity in "${ENTITIES[@]}"; do
    # Skip if already wiki-linked
    WIKI="[[$entity]]"
    if grep -qi "$entity" "$file" && ! grep -q "\[\[$entity\]\]" "$file"; then
      # Case-insensitive replace, only first occurrence per line that isn't already linked
      sed -i "s/\b${entity}\b/[[$entity]]/gI" "$file" 2>/dev/null && changed=true
    fi
  done
  if $changed; then
    echo "🔗 Linked entities in: $(basename "$file")"
  fi
}

if [ "$TARGET" == "--all" ]; then
  echo "🔗 Auto-linking entities across vault..."
  LINKED=0
  find "$VAULT" -name "*.md" -type f | while read -r f; do
    # Skip templates and .fsxmemory
    [[ "$f" == *"/templates/"* ]] && continue
    [[ "$f" == *"/.fsxmemory/"* ]] && continue
    link_file "$f"
  done
  echo "✅ Done"
else
  if [ -f "$TARGET" ]; then
    link_file "$TARGET"
  else
    echo "❌ File not found: $TARGET"
    exit 1
  fi
fi
