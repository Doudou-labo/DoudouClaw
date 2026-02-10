#!/usr/bin/env bash
set -euo pipefail

# Bidirectional sync between CRM tasks and Google Tasks statuses.
# - If CRM status == "Réalisé" => mark Google task completed
# - If Google task status == completed => set CRM status "Réalisé"
# Other CRM statuses remain as-is (they map to Google "needsAction").
#
# Requires:
# - MATON_API_KEY env var (Maton gateway)
# - age key at /root/.config/crm-age.key
#
# Usage:
#   ./crm/bin/crm-sync-google-tasks-statuses.sh

: "${MATON_API_KEY:?MATON_API_KEY env var is required}"

KEY_FILE="/root/.config/crm-age.key"
CRM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$CRM_DIR/data"
PUB_FILE="$CRM_DIR/docs/age-public-key.txt"
TASKS_AGE="$DATA_DIR/tasks.json.age"

for f in "$KEY_FILE" "$PUB_FILE" "$TASKS_AGE"; do
  [[ -f "$f" ]] || { echo "ERROR: missing file: $f" >&2; exit 1; }
done

PUB=$(cat "$PUB_FILE")

TMP_IN=$(mktemp)
TMP_OUT=$(mktemp)
trap 'rm -f "$TMP_IN" "$TMP_OUT"' EXIT

age -d -i "$KEY_FILE" -o "$TMP_IN" "$TASKS_AGE"

export CRM_TASKS_IN="$TMP_IN"
export CRM_TASKS_OUT="$TMP_OUT"

python3 - <<'PY'
import os, json, urllib.request

MATON=os.environ['MATON_API_KEY']
INP=os.environ['CRM_TASKS_IN']
OUT=os.environ['CRM_TASKS_OUT']

with open(INP,'r',encoding='utf-8') as f:
    doc=json.load(f)

tasks=doc.get('tasks',[])

changed_crm=0
changed_google=0
errors=0

for t in tasks:
    gt = t.get('googleTasks') or {}
    list_id = gt.get('listId')
    task_id = gt.get('taskId')
    if not list_id or not task_id:
        continue

    # Fetch Google Task
    try:
        url=f'https://gateway.maton.ai/google-tasks/tasks/v1/lists/{list_id}/tasks/{task_id}'
        req=urllib.request.Request(url)
        req.add_header('Authorization', f'Bearer {MATON}')
        g=json.load(urllib.request.urlopen(req))
    except Exception:
        errors += 1
        continue

    g_status = g.get('status')  # needsAction|completed
    crm_status = t.get('status')

    # 1) Google -> CRM
    if g_status == 'completed' and crm_status != 'Réalisé':
        t['status'] = 'Réalisé'
        changed_crm += 1

    # 2) CRM -> Google
    if crm_status == 'Réalisé' and g_status != 'completed':
        try:
            patch_url=f'https://gateway.maton.ai/google-tasks/tasks/v1/lists/{list_id}/tasks/{task_id}'
            body=json.dumps({'status':'completed'}).encode('utf-8')
            req=urllib.request.Request(patch_url, data=body, method='PATCH')
            req.add_header('Authorization', f'Bearer {MATON}')
            req.add_header('Content-Type','application/json')
            json.load(urllib.request.urlopen(req))
            changed_google += 1
        except Exception:
            errors += 1

with open(OUT,'w',encoding='utf-8') as f:
    json.dump(doc,f,ensure_ascii=False,indent=2)

print(json.dumps({'changed_crm':changed_crm,'changed_google':changed_google,'errors':errors}, ensure_ascii=False))
PY

# Re-encrypt back
age -r "$PUB" -o "$TASKS_AGE" "$TMP_OUT"

echo "OK: synced Google Tasks <-> CRM statuses"