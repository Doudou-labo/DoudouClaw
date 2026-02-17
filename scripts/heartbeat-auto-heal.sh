#!/usr/bin/env bash
# heartbeat-auto-heal.sh — Détecte et corrige les problèmes providers/crons
set -euo pipefail

AUTH_PROFILES="$HOME/.openclaw/agents/main/agent/auth-profiles.json"
NOW_MS=$(date +%s%3N)
FIXES=0
ALERTS=""

echo "=== Auto-Heal Check ($(date -u '+%Y-%m-%d %H:%M UTC')) ==="

# 1) Détecter cooldowns actifs et les nettoyer
if [ -f "$AUTH_PROFILES" ]; then
  COOLDOWNS=$(python3 -c "
import json, sys
with open('$AUTH_PROFILES') as f:
    data = json.load(f)
stats = data.get('usageStats', {})
now = $NOW_MS
cooldowns = []
for k, v in stats.items():
    cd = v.get('cooldownUntil', 0)
    if cd > now:
        cooldowns.append(k)
        # Reset cooldown
        v.pop('cooldownUntil', None)
        v.pop('failureCounts', None)
        v['errorCount'] = 0
if cooldowns:
    with open('$AUTH_PROFILES', 'w') as f:
        json.dump(data, f, indent=2)
for c in cooldowns:
    print(c)
" 2>/dev/null || true)
  
  if [ -n "$COOLDOWNS" ]; then
    COUNT=$(echo "$COOLDOWNS" | wc -l)
    FIXES=$((FIXES + COUNT))
    ALERTS="${ALERTS}🔧 Nettoyé $COUNT cooldown(s): $(echo $COOLDOWNS | tr '\n' ', ')\n"
    echo "Fixed $COUNT cooldowns"
  else
    echo "No active cooldowns"
  fi
fi

# 2) Détecter tokens OAuth expirés
if [ -f "$AUTH_PROFILES" ]; then
  EXPIRED=$(python3 -c "
import json
with open('$AUTH_PROFILES') as f:
    data = json.load(f)
now = $NOW_MS
for k, v in data.get('profiles', {}).items():
    exp = v.get('expires', 0)
    if exp > 0 and exp < now and v.get('type') == 'oauth':
        print(f'{k} (expired {int((now - exp) / 3600000)}h ago)')
" 2>/dev/null || true)
  
  if [ -n "$EXPIRED" ]; then
    ALERTS="${ALERTS}⚠️ Tokens expirés: $(echo $EXPIRED | tr '\n' ', ')\n"
    echo "Expired tokens found: $EXPIRED"
  else
    echo "All tokens valid"
  fi
fi

# 3) Résumé
echo ""
echo "=== Résultat ==="
echo "Fixes appliqués: $FIXES"
if [ -n "$ALERTS" ]; then
  echo -e "Alertes:\n$ALERTS"
else
  echo "RAS ✅"
fi
