#!/bin/bash
# PARA → Notion sync wrapper
# Usage: bash scripts/para-notion-sync.sh

cd ~/.openclaw/workspace

LOG_FILE="memory/para-notion-sync-$(date +%Y-%m-%d).log"
SUMMARY_FILE="memory/para-notion-sync-latest.log"

echo "🔄 PARA Sync started: $(date)" | tee -a "$LOG_FILE"

# Run sync
python3 scripts/para-notion-sync.py 2>&1 | tee -a "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}

# Generate summary
if [ $EXIT_CODE -eq 0 ]; then
    SUMMARY="✅ Sync OK - $(grep -E 'Created:|Updated:' "$LOG_FILE" | tail -2 | tr '\n' ' ')"
else
    SUMMARY="❌ Sync FAILED (exit $EXIT_CODE)"
fi

echo "$SUMMARY" > "$SUMMARY_FILE"
echo "📊 $SUMMARY" | tee -a "$LOG_FILE"
echo "🕐 Finished: $(date)" | tee -a "$LOG_FILE"

# Git sync if successful
if [ $EXIT_CODE -eq 0 ]; then
    git add memory/para-notion-sync-*.log 2>/dev/null
    git diff --cached --quiet || git commit -m "📚 PARA sync log $(date +%Y-%m-%d)" 2>/dev/null
fi

exit $EXIT_CODE
