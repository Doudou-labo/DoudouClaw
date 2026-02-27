#!/bin/bash
# PARA → Notion sync wrapper (with lock to prevent overlap)
# Usage: bash scripts/para-notion-sync.sh

set -euo pipefail
cd ~/.openclaw/workspace

LOCK_FILE="/tmp/para-notion-sync.lock"
LOG_FILE="memory/para-notion-sync-$(date +%Y-%m-%d).log"
SUMMARY_FILE="memory/para-notion-sync-latest.log"

# Prevent concurrent runs (major duplicate risk)
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  echo "⚠️ PARA sync skipped: another sync is already running." | tee -a "$LOG_FILE"
  echo "⚠️ Sync skipped (already running)" > "$SUMMARY_FILE"
  exit 0
fi

echo "🔄 PARA Sync started: $(date)" | tee -a "$LOG_FILE"

# Run sync
set +e
python3 scripts/para-notion-sync.py 2>&1 | tee -a "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}
set -e

# Generate summary
if [ $EXIT_CODE -eq 0 ]; then
    SUMMARY="✅ Sync OK - $(grep -E 'Created:|Updated:|Deduped:' "$LOG_FILE" | tail -3 | tr '\n' ' ')"
else
    SUMMARY="❌ Sync FAILED (exit $EXIT_CODE)"
fi

echo "$SUMMARY" > "$SUMMARY_FILE"
echo "📊 $SUMMARY" | tee -a "$LOG_FILE"
echo "🕐 Finished: $(date)" | tee -a "$LOG_FILE"

# Git sync if successful (logs only)
if [ $EXIT_CODE -eq 0 ]; then
    git add memory/para-notion-sync-*.log 2>/dev/null || true
    git diff --cached --quiet || git commit -m "📚 PARA sync log $(date +%Y-%m-%d)" 2>/dev/null || true
fi

exit $EXIT_CODE
