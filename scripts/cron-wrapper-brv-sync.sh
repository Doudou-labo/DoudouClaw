#!/bin/bash
# Cron wrapper pour sync-brv-to-github.sh
# Log: /var/log/brv-sync.log

LOG_FILE="/var/log/brv-sync.log"
SCRIPT="/root/.openclaw/workspace/scripts/sync-brv-to-github.sh"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting sync..." >> "$LOG_FILE"

if [[ -x "$SCRIPT" ]]; then
    "$SCRIPT" >> "$LOG_FILE" 2>&1
    EXIT_CODE=$?
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Exit code: $EXIT_CODE" >> "$LOG_FILE"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Script not found or not executable" >> "$LOG_FILE"
fi

echo "---" >> "$LOG_FILE"
