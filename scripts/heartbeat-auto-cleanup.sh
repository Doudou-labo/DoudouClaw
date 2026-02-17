#!/usr/bin/env bash
# heartbeat-auto-cleanup.sh — Nettoyage préventif fichiers/logs
set -euo pipefail

echo "=== Auto-Cleanup ($(date -u '+%Y-%m-%d %H:%M UTC')) ==="

CLEANED=0

# 1) Fichiers tmp orphelins (>24h)
TMP_COUNT=$(find /tmp -maxdepth 2 -name "*.tmp" -mtime +1 2>/dev/null | wc -l)
if [ "$TMP_COUNT" -gt 0 ]; then
  find /tmp -maxdepth 2 -name "*.tmp" -mtime +1 -delete 2>/dev/null || true
  CLEANED=$((CLEANED + TMP_COUNT))
  echo "🧹 Supprimé $TMP_COUNT fichier(s) .tmp orphelins"
fi

# 2) Logs volumineux (>50MB) — rotation
for logdir in /tmp/clawdbot /tmp/openclaw-logs; do
  if [ -d "$logdir" ]; then
    BIGFILES=$(find "$logdir" -type f -size +50M 2>/dev/null)
    for f in $BIGFILES; do
      tail -1000 "$f" > "${f}.rotated" && mv "${f}.rotated" "$f"
      CLEANED=$((CLEANED + 1))
      echo "📜 Rotaté: $f"
    done
  fi
done

# 3) Anciens rapports (>30 jours)
if [ -d "/root/.openclaw/workspace/reports" ]; then
  OLD_REPORTS=$(find /root/.openclaw/workspace/reports -name "*.md" -mtime +30 2>/dev/null | wc -l)
  if [ "$OLD_REPORTS" -gt 0 ]; then
    find /root/.openclaw/workspace/reports -name "*.md" -mtime +30 -exec mv {} /root/.openclaw/workspace/notes/archive/ \; 2>/dev/null || true
    CLEANED=$((CLEANED + OLD_REPORTS))
    echo "📦 Archivé $OLD_REPORTS rapport(s) >30j"
  fi
fi

# 4) Inbound media anciens (>7 jours)
MEDIA_DIR="$HOME/.openclaw/media/inbound"
if [ -d "$MEDIA_DIR" ]; then
  OLD_MEDIA=$(find "$MEDIA_DIR" -type f -mtime +7 2>/dev/null | wc -l)
  if [ "$OLD_MEDIA" -gt 0 ]; then
    find "$MEDIA_DIR" -type f -mtime +7 -delete 2>/dev/null || true
    CLEANED=$((CLEANED + OLD_MEDIA))
    echo "🗑️ Supprimé $OLD_MEDIA média(s) inbound >7j"
  fi
fi

# 5) Espace disque
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
echo ""
echo "💽 Disque utilisé: ${DISK_USAGE}%"
if [ "$DISK_USAGE" -gt 85 ]; then
  echo "⚠️ ALERTE: Disque >85% !"
fi

echo ""
echo "=== Résultat ==="
echo "Nettoyé: $CLEANED élément(s)"
if [ "$DISK_USAGE" -lt 85 ] && [ "$CLEANED" -eq 0 ]; then
  echo "RAS ✅"
fi
