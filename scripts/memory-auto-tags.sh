#!/usr/bin/env bash
set -euo pipefail

DATE_PARIS="${1:-$(TZ=Europe/Paris date +%F)}"
FILE="/root/.openclaw/workspace/memory/${DATE_PARIS}.md"

if [[ ! -f "$FILE" ]]; then
  echo "[memory-auto-tags] no file: $FILE"
  exit 0
fi

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

extract_matches() {
  local pattern="$1"
  local limit="${2:-6}"
  python3 - "$FILE" "$pattern" "$limit" <<'PY'
import re, sys
path, pattern, limit = sys.argv[1], sys.argv[2], int(sys.argv[3])
rx = re.compile(pattern, re.I)
items = []
with open(path, 'r', encoding='utf-8') as f:
    for raw in f:
        line = raw.strip()
        if not line:
            continue
        if line.startswith('---'):
            continue
        if line.startswith('## 🏷️ Auto-tags'):
            break
        if line.startswith('- ') or line.startswith('* '):
            text = line[2:].strip()
        else:
            text = line
        if len(text) < 8:
            continue
        if rx.search(text):
            items.append(text)
seen = []
for item in items:
    if item not in seen:
        seen.append(item)
for item in seen[:limit]:
    print(item)
PY
}

mapfile -t decisions < <(extract_matches 'décision|decide|validé|validée|choix|arbitrage|on garde|on installe|confirmée|confirmé')
mapfile -t preferences < <(extract_matches 'préf|pref|aime|veut|souhaite|je veux|je voudrais|format|markdown|emoji|naturel')
mapfile -t todos < <(extract_matches 'prochaine action|todo|à faire|next|préparer|voir avec|relancer|tester|ajouter|intégrer|mettre en place')
mapfile -t subjects < <(extract_matches 'sujet|thème|topic|discussion|venus beauté|arnaud|rcs|mem0|cognee|fsxmemory|qmd|marc dr|finance')

print_section() {
  local title="$1"
  shift
  local arr=("$@")
  if [[ ${#arr[@]} -gt 0 ]]; then
    echo "### [$title]" >> "$TMP"
    for item in "${arr[@]}"; do
      echo "- $item" >> "$TMP"
    done
    echo "" >> "$TMP"
  fi
}

{
  echo "## 🏷️ Auto-tags (heuristique)"
  echo ""
} >> "$TMP"

print_section "decision" "${decisions[@]}"
print_section "preference" "${preferences[@]}"
print_section "todo" "${todos[@]}"
print_section "subject" "${subjects[@]}"

python3 - "$FILE" "$TMP" <<'PY'
import sys
file_path, tags_path = sys.argv[1], sys.argv[2]
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
marker = '## 🏷️ Auto-tags (heuristique)'
if marker in content:
    content = content.split(marker)[0].rstrip() + '\n\n'
else:
    content = content.rstrip() + '\n\n'
with open(tags_path, 'r', encoding='utf-8') as f:
    tags = f.read().strip() + '\n'
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content + tags)
PY

echo "[memory-auto-tags] updated with detailed tags: $FILE"
