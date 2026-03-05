#!/usr/bin/env bash
set -euo pipefail

DATE_PARIS="${1:-$(TZ=Europe/Paris date +%F)}"
FILE="/root/.openclaw/workspace/memory/${DATE_PARIS}.md"

if [[ ! -f "$FILE" ]]; then
  echo "[memory-auto-tags] no file: $FILE"
  exit 0
fi

decision=$(grep -Eic "décision|decide|validé|choix|arbitrage" "$FILE" || true)
preference=$(grep -Eic "préf|pref|aime|veut|souhaite" "$FILE" || true)
todo=$(grep -Eic "prochaine action|todo|à faire|next" "$FILE" || true)
subject=$(grep -Eic "sujet|thème|topic|discussion" "$FILE" || true)

{
  echo ""
  echo "## 🏷️ Auto-tags (heuristique)"
  echo "- [decision] ${decision}"
  echo "- [preference] ${preference}"
  echo "- [todo] ${todo}"
  echo "- [subject] ${subject}"
} >> "$FILE"

echo "[memory-auto-tags] updated: $FILE"
