#!/bin/bash
# Script helper pour logger un événement d'évolution
# Usage: ./log-evolution.sh "category" "context" "lesson" "applied" "impact" ["parent_id"]

set -euo pipefail

CATEGORY="$1"
CONTEXT="$2"
LESSON="$3"
APPLIED="${4:-false}"
IMPACT="${5:-}"
PARENT_ID="${6:-null}"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ID="evt-$(date +%s)-$(head -c 4 /dev/urandom | xxd -p)"

LOG_FILE="$(dirname "$0")/../evolution-log.jsonl"

if [[ "$PARENT_ID" == "null" ]]; then
  PARENT_JSON="null"
else
  PARENT_JSON="\"$PARENT_ID\""
fi

EVENT=$(jq -n \
  --arg ts "$TIMESTAMP" \
  --arg id "$ID" \
  --arg cat "$CATEGORY" \
  --arg ctx "$CONTEXT" \
  --arg lsn "$LESSON" \
  --argjson app "$APPLIED" \
  --arg imp "$IMPACT" \
  --argjson par "$PARENT_JSON" \
  '{
    timestamp: $ts,
    id: $id,
    category: $cat,
    context: $ctx,
    lesson: $lsn,
    applied: $app,
    impact: $imp,
    parent_id: $par
  }')

echo "$EVENT" >> "$LOG_FILE"

echo "✅ Événement d'évolution loggé : $ID"
echo "$EVENT" | jq .
