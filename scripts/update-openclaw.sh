#!/bin/bash
# =============================================================================
# update-openclaw.sh — Mise à jour OpenClaw en toute sécurité
# Usage : bash /root/.openclaw/workspace/scripts/update-openclaw.sh
# Ce script tourne en autonome, même si le gateway est arrêté pendant l'opération
# =============================================================================

set -euo pipefail
LOG="/tmp/openclaw-update-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG") 2>&1

echo "════════════════════════════════════════"
echo "  OpenClaw Update — $(date)"
echo "════════════════════════════════════════"

CURRENT=$(node /usr/lib/node_modules/openclaw/openclaw.mjs --version 2>/dev/null | head -1 || echo "inconnu")
echo "▶ Version actuelle : $CURRENT"

# 1. Arrêt propre du gateway
echo ""
echo "⏹ Étape 1 : Arrêt du gateway..."
systemctl --user stop openclaw-gateway 2>/dev/null || true
sleep 3
pgrep -f "openclaw/dist/entry\|openclaw.mjs gateway" | xargs kill -9 2>/dev/null || true
sleep 2
echo "   ✅ Gateway arrêté"

# 2. Nettoyage résidus npm si besoin
echo ""
echo "🧹 Étape 2 : Nettoyage résidus npm..."
rm -f /usr/lib/node_modules/.openclaw-* 2>/dev/null || true
rm -f /usr/bin/.openclaw-* 2>/dev/null || true
echo "   ✅ Propre"

# 3. Installation
echo ""
echo "📦 Étape 3 : Installation openclaw@latest..."
npm install -g openclaw@latest --force 2>&1
echo "   ✅ Installation terminée"

# 4. Vérification binaire
echo ""
echo "🔍 Étape 4 : Vérification binaire..."
NEW_VERSION=$(openclaw --version 2>/dev/null || node /usr/lib/node_modules/openclaw/openclaw.mjs --version 2>/dev/null | head -1 || echo "ERREUR")
echo "   Version installée : $NEW_VERSION"

# 5. Redémarrage du gateway
echo ""
echo "▶ Étape 5 : Redémarrage du gateway..."
systemctl --user start openclaw-gateway 2>/dev/null || true
sleep 5

# Vérifier que le gateway tourne
if pgrep -f "openclaw" > /dev/null 2>&1; then
  echo "   ✅ Gateway redémarré"
else
  echo "   ⚠️  Gateway pas détecté, tentative manuelle..."
  nohup node /usr/lib/node_modules/openclaw/openclaw.mjs gateway &
  sleep 3
fi

echo ""
echo "════════════════════════════════════════"
echo "  ✅ Mise à jour terminée : $CURRENT → $NEW_VERSION"
echo "  📄 Log complet : $LOG"
echo "════════════════════════════════════════"
