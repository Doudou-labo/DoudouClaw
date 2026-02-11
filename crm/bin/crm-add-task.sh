#!/usr/bin/env bash
set -euo pipefail

# Add a new task to the CRM and push it automatically to Google Tasks.
# Usage:
#   ./crm/bin/crm-add-task.sh <clientId> "<description>" <dueAt-ISO|->
# Example:
#   ./crm/bin/crm-add-task.sh cli_001 "Appeler client X" "2026-03-01T10:00:00+01:00"

CLIENT_ID="${1:-}"
DESCRIPTION="${2:-}"
DUE_AT="${3:-}"  # pass "-" for no dueAt

if [[ -z "$CLIENT_ID" || -z "$DESCRIPTION" || -z "$DUE_AT" ]]; then
  echo "Usage: $0 <clientId> \"<description>\" <dueAt-ISO|->" >&2
  exit 2
fi

KEY_FILE="/root/.config/crm-age.key"
CRM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$CRM_DIR/data"
PUB_FILE="$CRM_DIR/docs/age-public-key.txt"
TASKS_AGE="$DATA_DIR/tasks.json.age"

for f in "$KEY_FILE" "$PUB_FILE" "$TASKS_AGE"; do
  [[ -f "$f" ]] || { echo "ERROR: missing file: $f" >&2; exit 1; }
done

# Decrypt to temp
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
age -d -i "$KEY_FILE" -o "$TMP" "$TASKS_AGE"

# Determine next task ID
NEXT=$(jq -r '[.tasks[]?.id | sub("tsk_";"") | tonumber] | max + 1' "$TMP")
TASK_ID=$(printf "tsk_%03d" "$NEXT")

# Prepare due field
if [[ "$DUE_AT" == "-" ]]; then
  DUE_FIELD="null"
else
  DUE_FIELD="\"$DUE_AT\""
fi

# Insert task
jq ".tasks += [{\"id\":\"${TASK_ID}\",\"clientId\":\"${CLIENT_ID}\",\"type\":\"commande\",\"description\":\"${DESCRIPTION}\",\"dueAt\":${DUE_FIELD},\"status\":\"Prochainement\",\"createdAt\":\"$(date +%Y-%m-%d)\"}]" \
  "$TMP" > "$TMP.2" && mv "$TMP.2" "$TMP"

# Re-encrypt
PUB=$(cat "$PUB_FILE")
age -r "$PUB" -o "$TASKS_AGE" "$TMP"

# Commit to Git
cd "$CRM_DIR"
git add crm/data/tasks.json.age
git commit -m "CRM: ajoute tâche $TASK_ID via crm-add-task" || true

# Push to Google Tasks
"$CRM_DIR/bin/crm-push-to-google-tasks.sh" "$TASK_ID"

echo "OK: tâche $TASK_ID créée et synchronisée vers Google Tasks."