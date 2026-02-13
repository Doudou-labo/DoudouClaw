#!/usr/bin/env bash
set -euo pipefail

ROOT="/root/.openclaw/workspace"
cd "$ROOT"

SESSION_KEY="${1:-agent:main:telegram:group:-1003791371950:topic:37}"
CM_DIR="skills/context-manager"
OUT_DIR="notes/resources/context-compression"
mkdir -p "$OUT_DIR"

if [[ ! -x "$CM_DIR/compress.sh" ]]; then
  echo "Erreur: context-manager non installé ($CM_DIR/compress.sh introuvable)"
  exit 1
fi

echo "[preview] Session: $SESSION_KEY"
"$CM_DIR/compress.sh" summarize "$SESSION_KEY" | tee /tmp/context-preview.out

LATEST_SUMMARY=$(ls -1t "$CM_DIR"/memory/compressed/*.ai-summary.md 2>/dev/null | head -n1 || true)
if [[ -n "$LATEST_SUMMARY" ]]; then
  cp "$LATEST_SUMMARY" "$OUT_DIR/latest-summary.md"
fi

TODAY="$(date -u +%F)"
MEM_FILE="memory/$TODAY.md"
[[ -f "$MEM_FILE" ]] || echo "# Memory — $TODAY" > "$MEM_FILE"
{
  echo ""
  echo "## $(date -u +%H:%M) UTC — Context compress PREVIEW"
  echo "- Session: $SESSION_KEY"
  echo "- Summary file: ${LATEST_SUMMARY:-non trouvé}"
  echo "- Action: PREVIEW only (aucun reset)"
} >> "$MEM_FILE"

git add "$MEM_FILE" "$OUT_DIR/latest-summary.md" 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "chore(context): preview summary for session compression"
  git push
  COMMIT="$(git rev-parse --short HEAD)"
else
  COMMIT="none"
fi

echo ""
echo "Résultats"
echo "- preview summary généré"
echo "- commit: $COMMIT"
echo "Points à retenir"
echo "- Vérifie latest-summary.md avant apply"
echo "- Aucun reset effectué"
