#!/bin/bash
# =============================================================================
# check-openclaw-updates.sh
# Vérifie si une nouvelle version d'OpenClaw est disponible sur GitHub
# Compare avec la version installée et génère un résumé explicatif du changelog
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
SUMMARY=$(echo "$RELEASE_JSON" | python3 -c "
import sys, json, re

def clean(text):
    text = re.sub(r'\[#\d+\]\([^)]*\)', '', text)
    text = re.sub(r'\s+', ' ', text).strip(' -')
    return text

def short(text, limit=180):
    text = clean(text)
    return text if len(text) <= limit else text[:limit-1].rstrip() + '…'

d = json.load(sys.stdin)
body = d.get('body', '')
changes, fixes = [], []
section = None
for raw in body.splitlines():
    line = raw.strip()
    low = line.lower()
    if low.startswith('### changes'):
        section = 'changes'
        continue
    if low.startswith('### fixes'):
        section = 'fixes'
        continue
    if not line.startswith('- '):
        continue
    text = line[2:].strip()
    if section == 'changes':
        changes.append(short(text))
    elif section == 'fixes':
        fixes.append(short(text))

highlights = []
for item in changes:
    low = item.lower()
    if any(k in low for k in ['dream', 'memory', 'ui', 'control ui', 'webchat', 'plugin', 'codex', 'oauth', 'video_generate', 'video', 'teams', 'feishu']):
        highlights.append(item)
seen = set()
ordered = []
for item in highlights + changes:
    if item and item not in seen:
        ordered.append(item)
        seen.add(item)
key_changes = ordered[:4]
key_fixes = fixes[:3]
impact = []
for item in key_changes + key_fixes:
    low = item.lower()
    if 'dream' in low or 'memory' in low:
        impact.append('Si tu suis Dreaming / Memory Wiki, cette release enrichit surtout cette zone.')
    elif 'ui' in low or 'webchat' in low:
        impact.append('L\'interface gagne en lisibilité sur les sorties riches, médias et réponses vocales.')
    elif 'plugin' in low:
        impact.append('Les plugins deviennent plus propres à configurer, avec des flows d\'activation/setup mieux décrits.')
    elif 'codex' in low or 'oauth' in low:
        impact.append('Le flux de connexion Codex/OpenAI-compatible est plus fiable, donc moins de friction côté auth.')
    elif 'video' in low:
        impact.append('La génération vidéo gagne des options plus avancées si tu l\'utilises.')
seen = set()
impact = [x for x in impact if not (x in seen or seen.add(x))][:3]
if not key_changes and not key_fixes:
    print('Résumé du changelog non disponible.')
    sys.exit(0)
print('### Ce qu\'il faut retenir\n')
if key_changes:
    print('**Nouveautés marquantes**')
    for item in key_changes:
        print(f'- {item}')
    print()
if key_fixes:
    print('**Correctifs utiles**')
    for item in key_fixes:
        print(f'- {item}')
    print()
if impact:
    print('**Impact concret**')
    for item in impact:
        print(f'- {item}')
    print()
print('**Mon avis**')
if key_changes:
    print('- Release intéressante surtout si tu testes les nouveautés mémoire/UI. Pas un énorme séisme, mais un bon lot d\'améliorations utiles.')
else:
    print('- Release plutôt orientée correctifs et stabilisation.')
" 2>/dev/null || echo "Résumé du changelog non disponible.")

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

### 📋 En clair — $RELEASE_NAME

$SUMMARY

---

📎 **Lien release complète :** $RELEASE_URL

⚠️ **Installation en attente de ton accord.**
Si tu veux, je peux ensuite l'installer proprement et vérifier quelles nouveautés sont réellement activées chez toi.
EOF
