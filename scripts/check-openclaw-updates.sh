#!/bin/bash
# =============================================================================
# check-openclaw-updates.sh
# Vérifie si une nouvelle version d'OpenClaw est disponible sur GitHub
# Compare avec la version installée et notifie sur Discord avec le changelog
# Ne notifie que si la version est NOUVELLE (pas déjà notifiée)
# =============================================================================

set -euo pipefail

WORKSPACE="/root/.openclaw/workspace"
STATE_FILE="$WORKSPACE/memory/openclaw-update-state.json"
GITHUB_API="https://api.github.com/repos/openclaw/openclaw/releases/latest"

# --- Version installée ---
CURRENT_VERSION=$(openclaw --version 2>/dev/null | tr -d '\n' || echo "unknown")

# --- Dernière version déjà notifiée ---
LAST_NOTIFIED=""
if [ -f "$STATE_FILE" ]; then
  LAST_NOTIFIED=$(cat "$STATE_FILE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('last_notified',''))" 2>/dev/null || echo "")
fi

# --- Appel GitHub API ---
RELEASE_JSON=$(curl -s --max-time 15 "$GITHUB_API" 2>/dev/null || echo "")

if [ -z "$RELEASE_JSON" ]; then
  echo "⚠️ Impossible de contacter l'API GitHub (timeout ou réseau). Vérification annulée."
  exit 0
fi

LATEST_VERSION=$(echo "$RELEASE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tag_name','').lstrip('v'))" 2>/dev/null || echo "")
RELEASE_NAME=$(echo "$RELEASE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('name',''))" 2>/dev/null || echo "")
RELEASE_URL=$(echo "$RELEASE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('html_url',''))" 2>/dev/null || echo "")
RELEASE_DATE=$(echo "$RELEASE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('published_at','')[:10])" 2>/dev/null || echo "")
CHANGELOG=$(echo "$RELEASE_JSON" | python3 -c "
import sys, json, re
d = json.load(sys.stdin)
body = d.get('body','')
# Tronquer à 1800 chars pour ne pas exploser Discord
if len(body) > 1800:
    body = body[:1800] + '\n...(tronqué, voir lien pour la suite)'
print(body)
" 2>/dev/null || echo "Changelog non disponible.")

if [ -z "$LATEST_VERSION" ]; then
  echo "⚠️ Impossible de parser la réponse GitHub. Vérification annulée."
  exit 0
fi

# --- Pas de nouvelle version ---
if [ "$LATEST_VERSION" = "$CURRENT_VERSION" ]; then
  echo "✅ OpenClaw est à jour : **v$CURRENT_VERSION**. Aucune mise à jour disponible."
  exit 0
fi

# --- Déjà notifié pour cette version ---
if [ "$LAST_NOTIFIED" = "$LATEST_VERSION" ]; then
  echo "ℹ️ Déjà notifié pour v$LATEST_VERSION (installée: v$CURRENT_VERSION). Aucun doublon envoyé."
  exit 0
fi

# --- Nouvelle version détectée ! Sauvegarder l'état ---
mkdir -p "$(dirname "$STATE_FILE")"
python3 -c "
import json
data = {
  'last_notified': '$LATEST_VERSION',
  'current_installed': '$CURRENT_VERSION',
  'notified_at': '$(date -u +%Y-%m-%dT%H:%M:%SZ)'
}
with open('$STATE_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"

# --- Output du message Discord ---
cat << EOF
🚀 **Nouvelle version d'OpenClaw disponible !**

📦 **Version actuelle :** v$CURRENT_VERSION
✨ **Nouvelle version :** v$LATEST_VERSION
📅 **Publiée le :** $RELEASE_DATE
🔗 [Voir la release sur GitHub]($RELEASE_URL)

---

### 📋 Changelog — $RELEASE_NAME

$CHANGELOG

---

⚠️ **Installation en attente de ton accord.**
Pour installer, dis-moi **"installe la mise à jour OpenClaw"** et je m'en occupe avec \`npm install -g openclaw@latest\` + redémarrage du gateway. 🙂
EOF
