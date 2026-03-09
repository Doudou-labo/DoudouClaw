#!/usr/bin/env bash
# fsxmemory handoff — crée un handoff avant fin de session
# Usage: fsxmemory-handoff.sh --working-on "task" [--blocked "blocker"] [--next "next steps"] [--feeling "mood"]
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
HANDOFF_DIR="$VAULT/handoffs"
mkdir -p "$HANDOFF_DIR"

WORKING_ON=""
BLOCKED=""
NEXT=""
FEELING=""
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%H%M")
FILENAME="$HANDOFF_DIR/handoff-${DATE}-${TIME}.md"

while [[ $# -gt 0 ]]; do
  case $1 in
    --working-on) WORKING_ON="$2"; shift 2;;
    --blocked) BLOCKED="$2"; shift 2;;
    --next) NEXT="$2"; shift 2;;
    --feeling) FEELING="$2"; shift 2;;
    *) shift;;
  esac
done

if [ -z "$WORKING_ON" ]; then
  echo "Usage: $0 --working-on \"description\" [--blocked \"...\"] [--next \"...\"] [--feeling \"...\"]"
  exit 1
fi

cat > "$FILENAME" << EOF
---
title: "Handoff $DATE"
date: $TIMESTAMP
type: handoff
---

# Session Handoff

## Working On
- $WORKING_ON

## Blocked
- ${BLOCKED:-None}

## Next Steps
- [ ] ${NEXT:-Review and continue}

## Feeling
${FEELING:-Not specified}

## Context
Session ended at $TIMESTAMP
EOF

echo "✅ Handoff saved: $FILENAME"
echo "   Working on: $WORKING_ON"
[ -n "$NEXT" ] && echo "   Next: $NEXT"
