#!/usr/bin/env bash
# heartbeat-auto-learn.sh — Extraction automatique de learnings depuis les erreurs récentes
set -euo pipefail

cd /root/.openclaw/workspace

echo "=== Auto-Learn Check ($(date -u '+%Y-%m-%d %H:%M UTC')) ==="

TODAY=$(date -u '+%Y-%m-%d')
LEARNINGS_DIR="skills/self-improving-agent/.learnings"
DAILY_NOTE="memory/$TODAY.md"
NEW_LEARNINGS=0

# 1) Scanner les logs récents pour des patterns d'erreur
ERRORS=""

# Logs openclaw
for logdir in /tmp/openclaw /tmp/openclaw-logs "$HOME/.openclaw/logs"; do
  if [ -d "$logdir" ]; then
    RECENT_ERRORS=$(find "$logdir" -name "*.log" -mmin -60 -exec grep -il "error\|ECONNREFUSED\|timeout\|rate.limit\|ENOMEM" {} \; 2>/dev/null | head -5)
    if [ -n "$RECENT_ERRORS" ]; then
      ERRORS="${ERRORS}$(for f in $RECENT_ERRORS; do grep -c "error\|Error" "$f" 2>/dev/null | xargs -I{} echo "$f: {} errors"; done)\n"
    fi
  fi
done

# 2) Scanner memory du jour pour erreurs mentionnées
if [ -f "$DAILY_NOTE" ]; then
  ERROR_MENTIONS=$(grep -ci "erreur\|error\|échoué\|failed\|bug\|fix" "$DAILY_NOTE" 2>/dev/null || echo "0")
  echo "Mentions d'erreur dans daily note: $ERROR_MENTIONS"
fi

# 3) Chercher des patterns récurrents (même erreur >3x)
if [ -d "$LEARNINGS_DIR" ]; then
  EXISTING=$(ls "$LEARNINGS_DIR"/*.md 2>/dev/null | wc -l || echo "0")
  echo "Learnings existants: $EXISTING"
  
  # Vérifier pending learnings
  PENDING=$(grep -rl "status: pending\|status: identified" "$LEARNINGS_DIR" 2>/dev/null | wc -l || echo "0")
  echo "Learnings pending: $PENDING"
fi

# 4) Résumé
echo ""
echo "=== Résultat ==="
if [ -n "$ERRORS" ]; then
  echo -e "Erreurs récentes détectées:\n$ERRORS"
  echo "→ Vérifier si learning à créer"
else
  echo "Pas de nouvelles erreurs ✅"
fi
echo "Nouveau learnings créés: $NEW_LEARNINGS"
