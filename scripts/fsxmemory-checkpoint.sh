#!/usr/bin/env bash
# fsxmemory checkpoint — sauvegarde l'état de la session active
# Usage: fsxmemory-checkpoint.sh --working-on "task" [--focus "focus"] [--blocked "blocker"]
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
STATE_DIR="$VAULT/.fsxmemory"
CHECKPOINT="$STATE_DIR/last-checkpoint.json"
mkdir -p "$STATE_DIR"

WORKING_ON=""
FOCUS=""
BLOCKED=""
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

while [[ $# -gt 0 ]]; do
  case $1 in
    --working-on) WORKING_ON="$2"; shift 2;;
    --focus) FOCUS="$2"; shift 2;;
    --blocked) BLOCKED="$2"; shift 2;;
    *) shift;;
  esac
done

if [ -z "$WORKING_ON" ]; then
  echo "Usage: $0 --working-on \"description\" [--focus \"focus\"] [--blocked \"blocker\"]"
  exit 1
fi

cat > "$CHECKPOINT" << EOF
{
  "timestamp": "$TIMESTAMP",
  "working_on": "$WORKING_ON",
  "focus": "$FOCUS",
  "blocked": "$BLOCKED",
  "alive": true
}
EOF

echo "✅ Checkpoint saved at $TIMESTAMP"
echo "   Working on: $WORKING_ON"
[ -n "$FOCUS" ] && echo "   Focus: $FOCUS"
[ -n "$BLOCKED" ] && echo "   Blocked: $BLOCKED"
