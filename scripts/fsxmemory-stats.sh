#!/usr/bin/env bash
# fsxmemory stats — statistiques du vault
# Usage: fsxmemory-stats.sh
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"

echo "📊 VAULT STATISTICS"
echo "==================="
echo "📍 Vault: $VAULT"
echo ""

TOTAL=0
for dir in decisions lessons people projects procedures knowledge episodes handoffs inbox; do
  if [ -d "$VAULT/$dir" ]; then
    COUNT=$(find "$VAULT/$dir" -name "*.md" -type f 2>/dev/null | wc -l)
    TOTAL=$((TOTAL + COUNT))
    ICON=""
    case "$dir" in
      decisions) ICON="⚖️";;
      lessons) ICON="📚";;
      people) ICON="👥";;
      projects) ICON="🚀";;
      procedures) ICON="📋";;
      knowledge) ICON="🧠";;
      episodes) ICON="📖";;
      handoffs) ICON="🤝";;
      inbox) ICON="📥";;
    esac
    printf "  %s %-12s : %d files\n" "$ICON" "$dir" "$COUNT"
  fi
done

# Daily notes
DAILY_COUNT=$(find "$VAULT" -maxdepth 1 -name "????-??-??.md" -type f 2>/dev/null | wc -l)
TOTAL=$((TOTAL + DAILY_COUNT))
printf "  📝 %-12s : %d files\n" "daily notes" "$DAILY_COUNT"

echo ""
echo "📦 Total: $TOTAL memory files"

# Vault size
SIZE=$(du -sh "$VAULT" 2>/dev/null | cut -f1)
echo "💾 Size: $SIZE"

# Last checkpoint
if [ -f "$VAULT/.fsxmemory/last-checkpoint.json" ]; then
  LAST_CP=$(python3 -c "import json; d=json.load(open('$VAULT/.fsxmemory/last-checkpoint.json')); print(d.get('timestamp','unknown'))" 2>/dev/null || echo "unknown")
  echo "📌 Last checkpoint: $LAST_CP"
fi

# Last handoff
LAST_HO=$(ls -t "$VAULT/handoffs/"*.md 2>/dev/null | head -1 || true)
if [ -n "${LAST_HO:-}" ]; then
  echo "🤝 Last handoff: $(basename "$LAST_HO")"
fi

# Death flag
if [ -f "$VAULT/.fsxmemory/dirty-death.flag" ]; then
  echo "⚠️  DIRTY DEATH FLAG present!"
fi
