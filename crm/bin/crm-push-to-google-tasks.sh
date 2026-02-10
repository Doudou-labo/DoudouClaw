#!/usr/bin/env bash
set -euo pipefail

# Push a CRM task to Google Tasks (list: OpenClaw) via Maton gateway.
# - Creates the Google Task if not already linked
# - Writes googleTasks.{listId,taskId,webViewLink} back into tasks.json.age
#
# Usage:
#   ./crm/bin/crm-push-to-google-tasks.sh <crm_task_id>

TASK_ID="${1:-}"
if [[ -z "$TASK_ID" ]]; then
  echo "Usage: $0 <crm_task_id>" >&2
  exit 2
fi

: "${MATON_API_KEY:?MATON_API_KEY env var is required}"

KEY_FILE="/root/.config/crm-age.key"
CRM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$CRM_DIR/data"
PUB_FILE="$CRM_DIR/docs/age-public-key.txt"

TASKS_AGE="$DATA_DIR/tasks.json.age"
CLIENTS_AGE="$DATA_DIR/clients.json.age"

for f in "$KEY_FILE" "$PUB_FILE" "$TASKS_AGE" "$CLIENTS_AGE"; do
  [[ -f "$f" ]] || { echo "ERROR: missing file: $f" >&2; exit 1; }
done

# OpenClaw Google Tasks list id (title: OpenClaw)
OPENCLAW_LIST_ID="MTY0NDM2ODc0NzI3NjY0NDY3OTk6MDow"

TMP_TASKS=$(mktemp)
TMP_CLIENTS=$(mktemp)
trap 'rm -f "$TMP_TASKS" "$TMP_CLIENTS"' EXIT

age -d -i "$KEY_FILE" -o "$TMP_TASKS" "$TASKS_AGE"
age -d -i "$KEY_FILE" -o "$TMP_CLIENTS" "$CLIENTS_AGE"

# Ensure task exists
if ! jq -e --arg id "$TASK_ID" '.tasks | any(.id == $id)' "$TMP_TASKS" >/dev/null; then
  echo "ERROR: task id not found: $TASK_ID" >&2
  exit 1
fi

# If already linked, no-op
if jq -e --arg id "$TASK_ID" '(.tasks[] | select(.id==$id) | has("googleTasks"))' "$TMP_TASKS" >/dev/null; then
  echo "SKIP: $TASK_ID already linked to Google Tasks"
  exit 0
fi

export CRM_TASK_ID="$TASK_ID"
export TMP_TASKS="$TMP_TASKS"
export TMP_CLIENTS="$TMP_CLIENTS"
export OPENCLAW_LIST_ID="$OPENCLAW_LIST_ID"

python3 - <<'PY'
import os, json, urllib.request

task_id = os.environ['CRM_TASK_ID']
key_tasks = os.environ['TMP_TASKS']
key_clients = os.environ['TMP_CLIENTS']
list_id = os.environ['OPENCLAW_LIST_ID']
maton = os.environ['MATON_API_KEY']

with open(key_tasks,'r',encoding='utf-8') as f:
    tasks = json.load(f).get('tasks',[])
with open(key_clients,'r',encoding='utf-8') as f:
    clients = {c.get('id'): c.get('name') for c in json.load(f).get('clients',[])}

t = next(x for x in tasks if x.get('id')==task_id)
client_name = clients.get(t.get('clientId'), t.get('clientId',''))

desc = t.get('description','').strip()
due_at = t.get('dueAt')

# Title: "<Client> — <short desc>" (keep it readable)
# If no client name, just use description.
if client_name and client_name != 'null':
    title = f"{client_name} — {desc}" if desc else client_name
else:
    title = desc or f"CRM {task_id}"

notes_lines = [
    f"CRM: {task_id}",
]
if client_name:
    notes_lines.append(f"Client: {client_name}")
status = t.get('status')
if status:
    notes_lines.append(f"Statut CRM: {status}")

notes = "\n".join(notes_lines)

payload = {"title": title, "notes": notes}
# If no due date, omit it (Google Tasks allows tasks without due)
if due_at:
    payload["due"] = due_at

url = f"https://gateway.maton.ai/google-tasks/tasks/v1/lists/{list_id}/tasks"
body = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=body, method='POST')
req.add_header('Authorization', f'Bearer {maton}')
req.add_header('Content-Type', 'application/json')
with urllib.request.urlopen(req) as resp:
    data = json.load(resp)

print(json.dumps({
    "taskId": data.get('id'),
    "webViewLink": data.get('webViewLink'),
    "listId": list_id,
}, indent=2))
PY
