#!/usr/bin/env bash
set -euo pipefail

WORKDIR="/root/.openclaw/workspace"
cd "$WORKDIR"

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 \"fact 1\" [\"fact 2\" ...]"
  exit 1
fi

python3 skills/rosepuppy-memory/scripts/capture.py --facts "$@"

# Sync only memory/protocol files to keep commits focused
FILES=(
  "memory"
  "MEMORY.md"
  "SESSION-STATE.md"
  "RECENT_CONTEXT.md"
)

git add -- "${FILES[@]}" 2>/dev/null || true

if ! git diff --cached --quiet -- "${FILES[@]}"; then
  TS="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
  git commit -m "chore(memory): capture sync ${TS}" >/dev/null
  git push origin HEAD >/dev/null
  echo "Memory captured and synced to GitHub."
else
  echo "No memory changes to sync."
fi
