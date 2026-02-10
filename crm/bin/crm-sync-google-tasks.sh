#!/usr/bin/env bash
set -euo pipefail

# Push all CRM tasks that are not yet linked to Google Tasks.
# Usage:
#   ./crm/bin/crm-sync-google-tasks.sh

: "${MATON_API_KEY:?MATON_API_KEY env var is required}"

CRM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KEY_FILE="/root/.config/crm-age.key"
TASKS_AGE="$CRM_DIR/data/tasks.json.age"

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

age -d -i "$KEY_FILE" -o "$TMP" "$TASKS_AGE"

ids=$(jq -r '.tasks[] | select(has("googleTasks") | not) | .id' "$TMP")

if [[ -z "$ids" ]]; then
  echo "Nothing to sync."
  exit 0
fi

echo "$ids" | while read -r id; do
  [[ -n "$id" ]] || continue
  echo "Syncing $id ..."
  "$CRM_DIR/bin/crm-push-to-google-tasks.sh" "$id"
done
