#!/usr/bin/env bash
# heartbeat-auto-commit.sh — Commit auto des fichiers importants non versionnés
set -euo pipefail

cd /root/.openclaw/workspace

echo "=== Auto-Commit Check ($(date -u '+%Y-%m-%d %H:%M UTC')) ==="

# Fichiers critiques à surveiller
WATCHED_PATTERNS=(
  "memory/*.md"
  "notes/**/*.md"
  "MEMORY.md"
  "SESSION-STATE.md"
  "RECENT_CONTEXT.md"
  "TOOLS.md"
  "AGENTS.md"
  "HEARTBEAT.md"
  "SOUL.md"
  "USER.md"
  "scripts/*.sh"
  "scripts/*.py"
)

# Vérifier s'il y a des changements non commités
CHANGED=$(git status --porcelain -- ${WATCHED_PATTERNS[@]} 2>/dev/null | head -20)

if [ -z "$CHANGED" ]; then
  echo "Rien à commiter ✅"
  exit 0
fi

COUNT=$(echo "$CHANGED" | wc -l)
echo "Fichiers modifiés détectés: $COUNT"
echo "$CHANGED"

# Auto-commit
git add -- ${WATCHED_PATTERNS[@]} 2>/dev/null || true
git commit -m "🤖 auto-commit heartbeat: $COUNT fichier(s) modifié(s)

$(echo "$CHANGED" | head -10)" 2>/dev/null || { echo "Commit échoué ou rien à commiter"; exit 0; }

echo ""
echo "=== Résultat ==="
echo "✅ Auto-commit: $COUNT fichier(s)"
echo "Push automatique via hook post-commit"
