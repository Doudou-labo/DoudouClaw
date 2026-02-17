#!/usr/bin/env bash
# heartbeat-auto-alert.sh — Alertes intelligentes (GitHub, CRM, contexte)
set -euo pipefail

cd /root/.openclaw/workspace

echo "=== Auto-Alert Check ($(date -u '+%Y-%m-%d %H:%M UTC')) ==="

ALERTS=""
TOKEN=$(cat .credentials/github-token.txt 2>/dev/null || echo "")

# 1) GitHub Issues — nouvelles issues ou critiques
if [ -n "$TOKEN" ]; then
  OPEN_ISSUES=$(curl -s -H "Authorization: token $TOKEN" \
    "https://api.github.com/repos/Doudou-labo/DoudouClaw/issues?state=open&per_page=5" \
    2>/dev/null | python3 -c "
import json, sys
try:
    issues = json.load(sys.stdin)
    if isinstance(issues, list):
        for i in issues:
            labels = [l['name'] for l in i.get('labels', [])]
            if any(l in labels for l in ['bug', 'urgent', 'critical']):
                print(f\"🚨 #{i['number']}: {i['title']} [{','.join(labels)}]\")
        print(f'Total open: {len(issues)}')
except: pass
" 2>/dev/null || echo "GitHub API error")
  
  if [ -n "$OPEN_ISSUES" ]; then
    echo "$OPEN_ISSUES"
    if echo "$OPEN_ISSUES" | grep -q "🚨"; then
      ALERTS="${ALERTS}GitHub: issues critiques détectées\n"
    fi
  fi
fi

# 2) CRM — tâches en retard
if command -v crm &>/dev/null || [ -f "./crm/bin/crm" ]; then
  CRM_BIN="./crm/bin/crm"
  [ ! -f "$CRM_BIN" ] && CRM_BIN="crm"
  
  OVERDUE=$($CRM_BIN tasks --overdue 2>/dev/null | head -5 || true)
  if [ -n "$OVERDUE" ]; then
    COUNT=$(echo "$OVERDUE" | wc -l)
    ALERTS="${ALERTS}📞 CRM: $COUNT tâche(s) en retard\n"
    echo "CRM overdue: $COUNT"
  else
    echo "CRM: pas de retard ✅"
  fi
fi

# 3) Dernière dépense finance (>48h sans saisie)
if [ -f "scripts/finance_tracker.py" ] || command -v finance &>/dev/null; then
  LAST_EXPENSE=$(python3 -c "
import json, os, time
db = os.path.expanduser('~/.openclaw/workspace/.finance/expenses.json')
if os.path.exists(db):
    with open(db) as f:
        data = json.load(f)
    if data:
        last = max(e.get('date', '1970-01-01') for e in data)
        print(last)
    else:
        print('no-data')
else:
    print('no-db')
" 2>/dev/null || echo "check-failed")
  
  echo "Finance: dernière saisie = $LAST_EXPENSE"
fi

# 4) Résumé
echo ""
echo "=== Résultat ==="
if [ -n "$ALERTS" ]; then
  echo -e "⚠️ Alertes:\n$ALERTS"
else
  echo "RAS ✅"
fi
