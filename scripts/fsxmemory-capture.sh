#!/usr/bin/env bash
# fsxmemory capture — quick capture vers inbox
# Usage: fsxmemory-capture.sh "text to capture"
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
INBOX="$VAULT/inbox"
mkdir -p "$INBOX"

TEXT="${1:-}"
if [ -z "$TEXT" ]; then
  echo "Usage: $0 \"text to capture\""
  exit 1
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%H%M%S")
FILENAME="$INBOX/capture-${DATE}-${TIME}.md"

cat > "$FILENAME" << EOF
---
title: "Capture $DATE $TIME"
date: $DATE
type: capture
created: $TIMESTAMP
---

$TEXT
EOF

echo "✅ Captured → $FILENAME"
