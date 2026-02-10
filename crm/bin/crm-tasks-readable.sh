#!/usr/bin/env bash
set -euo pipefail

# Natural-language task listing for the local CRM.
#
# Usage:
#   ./crm/bin/crm-tasks-readable.sh            # list all tasks
#   ./crm/bin/crm-tasks-readable.sh --open     # exclude "Réalisé"
#   ./crm/bin/crm-tasks-readable.sh --client Commonwealth
#
# Output example:
#   • Aujourd’hui 14h15 — Commonwealth — Commander 1 pneu 195/50R13C 104/102N — En attente (externe) [tsk_001]

MODE="all"
CLIENT_FILTER=""

while (( "$#" )); do
  case "$1" in
    --open)
      MODE="open"; shift ;;
    --client)
      CLIENT_FILTER="${2:-}"; shift 2 ;;
    -h|--help)
      sed -n '1,60p' "$0"; exit 0 ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 2
      ;;
  esac
done

KEY_FILE="/root/.config/crm-age.key"
CRM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$CRM_DIR/data"

CLIENTS_AGE="$DATA_DIR/clients.json.age"
TASKS_AGE="$DATA_DIR/tasks.json.age"

for f in "$KEY_FILE" "$CLIENTS_AGE" "$TASKS_AGE"; do
  [[ -f "$f" ]] || { echo "ERROR: missing file: $f" >&2; exit 1; }
done

TMP_CLIENTS=$(mktemp)
TMP_TASKS=$(mktemp)
trap 'rm -f "$TMP_CLIENTS" "$TMP_TASKS"' EXIT

age -d -i "$KEY_FILE" -o "$TMP_CLIENTS" "$CLIENTS_AGE"
age -d -i "$KEY_FILE" -o "$TMP_TASKS" "$TASKS_AGE"

# Build a small lookup {clientId: name}
CLIENT_MAP=$(jq -c '{map: (.clients // [] | map({key:.id, value:.name}) | from_entries)}' "$TMP_CLIENTS")

jq -c '.tasks // [] | .[]' "$TMP_TASKS" | while read -r task; do
  status=$(jq -r '.status // ""' <<<"$task")

  emoji="📝"
  case "$status" in
    "Prochainement") emoji="📅";;
    "En cours") emoji="🔧";;
    "En attente (externe)") emoji="⏳";;
    "Réalisé") emoji="✅";;
  esac
  if [[ "$MODE" == "open" && "$status" == "Réalisé" ]]; then
    continue
  fi

  clientId=$(jq -r '.clientId // ""' <<<"$task")
  clientName=$(jq -r --arg cid "$clientId" '.map[$cid] // $cid // ""' <<<"$CLIENT_MAP")

  if [[ -n "$CLIENT_FILTER" ]]; then
    # case-insensitive contains
    shopt -s nocasematch
    if [[ "$clientName" != *"$CLIENT_FILTER"* ]]; then
      shopt -u nocasematch
      continue
    fi
    shopt -u nocasematch
  fi

  desc=$(jq -r '.description // ""' <<<"$task")
  dueAt=$(jq -r '.dueAt // ""' <<<"$task")
  id=$(jq -r '.id' <<<"$task")

  # Human-ish date in Europe/Paris
  when=""
  if [[ -n "$dueAt" && "$dueAt" != "null" ]]; then
    # Convert to Europe/Paris if possible
    if when_paris=$(TZ=Europe/Paris date -d "$dueAt" '+%Y-%m-%d %H:%M' 2>/dev/null); then
      today=$(TZ=Europe/Paris date '+%Y-%m-%d')
      tomorrow=$(TZ=Europe/Paris date -d 'tomorrow' '+%Y-%m-%d')
      d=${when_paris%% *}
      hm=${when_paris#* }
      if [[ "$d" == "$today" ]]; then
        when="Aujourd’hui $hm"
      elif [[ "$d" == "$tomorrow" ]]; then
        when="Demain $hm"
      else
        when=$(TZ=Europe/Paris date -d "$dueAt" '+%d/%m %H:%M' 2>/dev/null || echo "$dueAt")
      fi
    else
      when="$dueAt"
    fi
  fi

  if [[ -n "$when" ]]; then
    echo "• $emoji $when — $clientName — $desc — $status [$id]"
  else
    echo "• $emoji $clientName — $desc — $status [$id]"
  fi

done