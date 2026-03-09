#!/usr/bin/env bash
# fsxmemory recap — bootstrap pour nouvelle session (résumé handoffs + projets + leçons récentes)
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"

echo "🧠 SESSION RECAP"
echo "================"
echo ""

# Last handoff
echo "## 🤝 Dernier Handoff"
LAST_HANDOFF=$(ls -t "$VAULT/handoffs/"*.md 2>/dev/null | head -1 || true)
if [ -n "${LAST_HANDOFF:-}" ]; then
  cat "$LAST_HANDOFF"
else
  echo "(aucun handoff trouvé)"
fi
echo ""

# Last checkpoint
echo "## 📌 Dernier Checkpoint"
if [ -f "$VAULT/.fsxmemory/last-checkpoint.json" ]; then
  cat "$VAULT/.fsxmemory/last-checkpoint.json" | python3 -m json.tool 2>/dev/null || cat "$VAULT/.fsxmemory/last-checkpoint.json"
else
  echo "(aucun checkpoint)"
fi
echo ""

# Recent lessons (last 5)
echo "## 📚 Leçons Récentes"
if ls "$VAULT/lessons/"*.md &>/dev/null; then
  ls -t "$VAULT/lessons/"*.md | head -5 | while read f; do
    echo "- $(basename "$f" .md)"
  done
else
  echo "(aucune leçon)"
fi
echo ""

# Active projects
echo "## 🚀 Projets Actifs"
if ls "$VAULT/projects/"*.md &>/dev/null; then
  ls -t "$VAULT/projects/"*.md | head -5 | while read f; do
    echo "- $(basename "$f" .md)"
  done
else
  echo "(aucun projet)"
fi
echo ""

# Today's notes
TODAY=$(date +"%Y-%m-%d")
echo "## 📝 Notes du Jour"
if [ -f "$VAULT/$TODAY.md" ]; then
  echo "(existe — voir $VAULT/$TODAY.md)"
else
  echo "(pas encore créées)"
fi

# Death check
if [ -f "$VAULT/.fsxmemory/dirty-death.flag" ]; then
  echo ""
  echo "⚠️  DIRTY DEATH détectée — la session précédente s'est terminée anormalement"
  echo "   Timestamp: $(cat "$VAULT/.fsxmemory/dirty-death.flag")"
fi
