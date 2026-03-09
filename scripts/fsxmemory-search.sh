#!/usr/bin/env bash
# fsxmemory search — recherche par mots-clés dans le vault
# Usage: fsxmemory-search.sh "query"
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
QUERY="${1:-}"

if [ -z "$QUERY" ]; then
  echo "Usage: $0 \"search query\""
  exit 1
fi

echo "🔍 Searching vault for: \"$QUERY\""
echo "================================="
echo ""

# Use ripgrep if available, else grep
if command -v rg &>/dev/null; then
  RESULTS=$(rg -il --glob '*.md' "$QUERY" "$VAULT" 2>/dev/null || true)
else
  RESULTS=$(grep -ril "$QUERY" "$VAULT" --include="*.md" 2>/dev/null || true)
fi

if [ -z "$RESULTS" ]; then
  echo "❌ No results found for \"$QUERY\""
  exit 0
fi

COUNT=$(echo "$RESULTS" | wc -l)
echo "📄 Found $COUNT file(s):"
echo ""

echo "$RESULTS" | while read -r file; do
  REL_PATH="${file#$VAULT/}"
  # Get the type from directory
  DIR_NAME=$(dirname "$REL_PATH")
  echo "📁 [$DIR_NAME] $(basename "$file" .md)"
  # Show matching lines (max 3 per file)
  if command -v rg &>/dev/null; then
    rg -n --max-count 3 "$QUERY" "$file" 2>/dev/null | sed 's/^/   /'
  else
    grep -n --max-count=3 "$QUERY" "$file" 2>/dev/null | sed 's/^/   /'
  fi
  echo ""
done
