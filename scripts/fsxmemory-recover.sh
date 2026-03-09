#!/usr/bin/env bash
# fsxmemory recover — vérifie si la dernière session est morte et récupère le contexte
# Usage: fsxmemory-recover.sh [--clear]
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
STATE_DIR="$VAULT/.fsxmemory"
CHECKPOINT="$STATE_DIR/last-checkpoint.json"
DEATH_FLAG="$STATE_DIR/dirty-death.flag"
CLEAR=false

[[ "${1:-}" == "--clear" ]] && CLEAR=true

echo "🔍 Checking session state..."

# Check for dirty death flag
if [ -f "$DEATH_FLAG" ]; then
  DEATH_TIME=$(cat "$DEATH_FLAG")
  echo "💀 CONTEXT DEATH DETECTED at $DEATH_TIME"
fi

# Check last checkpoint
if [ -f "$CHECKPOINT" ]; then
  echo ""
  echo "📌 Last checkpoint:"
  cat "$CHECKPOINT" | python3 -m json.tool 2>/dev/null || cat "$CHECKPOINT"
else
  echo "ℹ️  No checkpoint found"
fi

# Check last handoff
LAST_HANDOFF=$(ls -t "$VAULT/handoffs/"*.md 2>/dev/null | head -1)
if [ -n "$LAST_HANDOFF" ]; then
  echo ""
  echo "🤝 Last handoff: $(basename "$LAST_HANDOFF")"
  head -30 "$LAST_HANDOFF"
fi

# Check today's daily note
TODAY=$(date +"%Y-%m-%d")
if [ -f "$VAULT/$TODAY.md" ]; then
  echo ""
  echo "📝 Today's notes exist: $VAULT/$TODAY.md"
fi

if $CLEAR; then
  rm -f "$DEATH_FLAG"
  echo ""
  echo "✅ Death flag cleared"
fi
