#!/usr/bin/env bash
set -euo pipefail

# Bi-directional sync between CRM and Google Tasks (list: OpenClaw)
# - CRM -> Google: push any CRM tasks that are not yet linked
# - Google -> CRM: import any Google tasks in list OpenClaw that are not yet present in CRM
#   (creates missing clients by name when possible)
#
# Notes:
# - We store linkage on CRM tasks: .googleTasks {listId, taskId, webViewLink}
# - We treat Google completed as CRM "Réalisé", otherwise "Prochainement".
# - Due dates: if absent in Google, CRM dueAt is omitted.
#
# Usage:
#   ./crm/bin/crm-sync-google-tasks-bidir.sh

: "${MATON_API_KEY:?MATON_API_KEY env var is required}"

KEY_FILE="/root/.config/crm-age.key"
CRM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$CRM_DIR/data"
PUB_FILE="$CRM_DIR/docs/age-public-key.txt"
CLIENTS_AGE="$DATA_DIR/clients.json.age"
TASKS_AGE="$DATA_DIR/tasks.json.age"

for f in "$KEY_FILE" "$PUB_FILE" "$CLIENTS_AGE" "$TASKS_AGE"; do
  [[ -f "$f" ]] || { echo "ERROR: missing file: $f" >&2; exit 1; }
done

OPENCLAW_LIST_ID="MTY0NDM2ODc0NzI3NjY0NDY3OTk6MDow"

TMP_CLIENTS=$(mktemp)
TMP_TASKS=$(mktemp)
trap 'rm -f "$TMP_CLIENTS" "$TMP_TASKS"' EXIT

age -d -i "$KEY_FILE" -o "$TMP_CLIENTS" "$CLIENTS_AGE"
age -d -i "$KEY_FILE" -o "$TMP_TASKS" "$TASKS_AGE"

# 1) CRM -> Google (push unlinked tasks)
# (this will re-encrypt tasks.json.age internally; but we also update TMP_TASKS by re-decrypt after push)
UNLINKED=$(jq -r '.tasks[]? | select(has("googleTasks")|not) | .id' "$TMP_TASKS" || true)
if [[ -n "$UNLINKED" ]]; then
  echo "$UNLINKED" | while read -r id; do
    [[ -n "$id" ]] || continue
    echo "CRM->Google: pushing $id"
    "$CRM_DIR/bin/crm-push-to-google-tasks.sh" "$id" >/dev/null
  done
  # Refresh temp tasks after pushes
  age -d -i "$KEY_FILE" -o "$TMP_TASKS" "$TASKS_AGE"
fi

export TMP_CLIENTS
export TMP_TASKS
export OPENCLAW_LIST_ID

SUMMARY_JSON=$(python3 - <<'PY'
import os, json, urllib.request, re

MATON=os.environ['MATON_API_KEY']
list_id=os.environ['OPENCLAW_LIST_ID']
clients_path=os.environ['TMP_CLIENTS']
tasks_path=os.environ['TMP_TASKS']

with open(clients_path,'r',encoding='utf-8') as f:
    cdoc=json.load(f)
clients=cdoc.get('clients',[])

with open(tasks_path,'r',encoding='utf-8') as f:
    tdoc=json.load(f)
crm_tasks=tdoc.get('tasks',[])

# Maps
by_client_name={ (c.get('name','') or '').strip().lower(): c for c in clients }
by_google_task_id={ (t.get('googleTasks') or {}).get('taskId'): t for t in crm_tasks if (t.get('googleTasks') or {}).get('taskId') }

# Determine next ids
next_cli=1
for c in clients:
    m=re.match(r'^cli_(\d+)$', c.get('id',''))
    if m:
        next_cli=max(next_cli, int(m.group(1))+1)
next_tsk=1
for t in crm_tasks:
    m=re.match(r'^tsk_(\d+)$', t.get('id',''))
    if m:
        next_tsk=max(next_tsk, int(m.group(1))+1)

def new_cli_id():
    nonlocal_next[0]+=1

# Helper to create ids

def make_cli_id(n):
    return f"cli_{n:03d}"

def make_tsk_id(n):
    return f"tsk_{n:03d}"

# List google tasks from OpenClaw list ONLY (pagination)
google_items=[]
page=None
while True:
    # IMPORTANT: only fetch from OpenClaw list
    url=f'https://gateway.maton.ai/google-tasks/tasks/v1/lists/{list_id}/tasks?maxResults=100&showCompleted=true&showHidden=true'
    if page:
        url += f'&pageToken={page}'
    req=urllib.request.Request(url)
    req.add_header('Authorization', f'Bearer {MATON}')
    data=json.load(urllib.request.urlopen(req))
    google_items += data.get('items',[]) or []
    page=data.get('nextPageToken')
    if not page:
        break

imported=0
created_clients=0
skipped=0

for g in google_items:
    gid=g.get('id')
    if not gid:
        continue
    if gid in by_google_task_id:
        continue

    title=(g.get('title') or '').strip()
    notes=(g.get('notes') or '')

    # Try to extract client/desc from title: "Client — desc"
    client_name=''
    desc=title
    if '—' in title:
        parts=[p.strip() for p in title.split('—',1)]
        if len(parts)==2 and parts[0] and parts[1]:
            client_name, desc = parts[0], parts[1]

    # If notes include explicit client line, prefer it
    m=re.search(r'^Client:\s*(.+)\s*$', notes, flags=re.MULTILINE)
    if m:
        client_name=m.group(1).strip()

    # If notes include CRM tag, and CRM doesn't have it, we still import but keep id? (rare)
    crm_id=None
    m=re.search(r'^CRM:\s*(tsk_\d+)\s*$', notes, flags=re.MULTILINE)
    if m:
        crm_id=m.group(1).strip()
        # If that id already exists locally, just link it (but it would have had gid mapping). Skip safety.

    # Find or create client
    client_id=None
    if client_name:
        key=client_name.lower()
        if key in by_client_name:
            client_id=by_client_name[key].get('id')
        else:
            cid=make_cli_id(next_cli)
            next_cli += 1
            newc={'id':cid,'name':client_name,'createdAt':'2026-02-10','notes':'(import Google Tasks)'}
            clients.append(newc)
            by_client_name[key]=newc
            client_id=cid
            created_clients += 1

    # Build CRM task
    tid = crm_id or make_tsk_id(next_tsk)
    if not crm_id:
        next_tsk += 1

    crm_status = 'Réalisé' if (g.get('status')=='completed') else 'Prochainement'

    newt={
        'id': tid,
        'clientId': client_id or '',
        'type': 'import',
        'description': desc or title or f'Import Google Tasks {gid}',
        'status': crm_status,
        'createdAt': '2026-02-10',
        'googleTasks': {
            'listId': list_id,
            'taskId': gid,
            'webViewLink': g.get('webViewLink')
        }
    }
    if g.get('due'):
        newt['dueAt']=g.get('due')

    crm_tasks.append(newt)
    by_google_task_id[gid]=newt
    imported += 1

# write back
tdoc['tasks']=crm_tasks
cdoc['clients']=clients

with open(tasks_path,'w',encoding='utf-8') as f:
    json.dump(tdoc,f,ensure_ascii=False,indent=2)
with open(clients_path,'w',encoding='utf-8') as f:
    json.dump(cdoc,f,ensure_ascii=False,indent=2)

print(json.dumps({'imported_from_google':imported,'created_clients':created_clients,'google_total':len(google_items)}, ensure_ascii=False))
PY
)

echo "$SUMMARY_JSON" | jq . >/dev/null 2>&1 || true

# Re-encrypt updated clients/tasks
PUB=$(cat "$PUB_FILE")
age -r "$PUB" -o "$CLIENTS_AGE" "$TMP_CLIENTS"
age -r "$PUB" -o "$TASKS_AGE" "$TMP_TASKS"

echo "OK: bidir sync done. $SUMMARY_JSON"