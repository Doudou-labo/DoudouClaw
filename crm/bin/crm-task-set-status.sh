#!/usr/bin/env bash
set -euo pipefail

# Set the status of a task in the local CRM (tasks.json.age)
#
# Usage:
#   ./crm/bin/crm-task-set-status.sh <task_id> "Réalisé"
#   ./crm/bin/crm-task-set-status.sh <task_id> "En attente (externe)"
#
# Notes:
# - This script decrypts tasks.json.age to a temp file, edits it with jq,
#   then re-encrypts it. No plaintext is kept in the repo.

TASK_ID="${1:-}"
STATUS="${2:-}"

if [[ -z "$TASK_ID" || -z "$STATUS" ]]; then
  echo "Usage: $0 <task_id> \"Réalisé\"|\"En attente (externe)\"" >&2
  exit 2
fi

case "$STATUS" in
  "Réalisé"|"En attente (externe)")
    ;;
  *)
    echo "ERROR: statut invalide: $STATUS" >&2
    echo "Statuts autorisés: \"Réalisé\", \"En attente (externe)\"" >&2
    exit 2
    ;;
esac

KEY_FILE="/root/.config/crm-age.key"
CRM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$CRM_DIR/data"
PUB_FILE="$CRM_DIR/docs/age-public-key.txt"

IN_AGE="$DATA_DIR/tasks.json.age"

if [[ ! -f "$KEY_FILE" ]]; then
  echo "ERROR: missing key file: $KEY_FILE" >&2
  exit 1
fi
if [[ ! -f "$PUB_FILE" ]]; then
  echo "ERROR: missing public key file: $PUB_FILE" >&2
  exit 1
fi
if [[ ! -f "$IN_AGE" ]]; then
  echo "ERROR: missing file: $IN_AGE" >&2
  exit 1
fi

PUB=$(cat "$PUB_FILE")

TMP1=$(mktemp)
TMP2=$(mktemp)
trap 'rm -f "$TMP1" "$TMP2"' EXIT

age -d -i "$KEY_FILE" -o "$TMP1" "$IN_AGE"

# Ensure task exists
if ! jq -e --arg id "$TASK_ID" '.tasks | any(.id == $id)' "$TMP1" >/dev/null; then
  echo "ERROR: task id not found: $TASK_ID" >&2
  echo "Tip: liste les tâches avec: age -d -i /root/.config/crm-age.key -o - crm/data/tasks.json.age | jq -r '.tasks[] | \"\\(.id) - \\(.description) [\\(.status)]\"'" >&2
  exit 1
fi

jq --arg id "$TASK_ID" --arg status "$STATUS" '(.tasks[] | select(.id == $id) | .status) = $status' "$TMP1" > "$TMP2"

age -r "$PUB" -o "$IN_AGE" "$TMP2"

echo "OK: $TASK_ID -> $STATUS"
