#!/bin/bash
# Cron wrapper pour sync-fsxmemory-to-github.sh
# Log: /var/log/fsxmemory-sync.log

LOG_FILE="/var/log/fsxmemory-sync.log"
SCRIPT="/root/.openclaw/workspace/scripts/sync-fsxmemory-to-github.sh"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting fsxmemory sync..." >> "$LOG_FILE"

if [[ -x "$SCRIPT" ]]; then
    "$SCRIPT" >> "$LOG_FILE" 2>&1
    EXIT_CODE=$?
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Exit code: $EXIT_CODE" >> "$LOG_FILE"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Script not found or not executable" >> "$LOG_FILE"
    EXIT_CODE=1
fi

echo "---" >> "$LOG_FILE"
exit $EXIT_CODE
