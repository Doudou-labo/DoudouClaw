#!/usr/bin/env bash
set -euo pipefail

ROOT="/root/.openclaw/workspace"
cd "$ROOT"

SESSION_KEY="${1:-agent:main:telegram:group:-1003791371950:topic:37}"
CONFIRM="${2:-}"
CM_DIR="skills/context-manager"
OUT_DIR="notes/resources/context-compression"
mkdir -p "$OUT_DIR"

if [[ "$CONFIRM" != "RESET_OK" ]]; then
  echo "Refus: confirmation requise."
  echo "Usage: bash scripts/context-compress-apply.sh '<session_key>' RESET_OK"
  exit 2
fi

if [[ ! -x "$CM_DIR/compress.sh" ]]; then
  echo "Erreur: context-manager non installé ($CM_DIR/compress.sh introuvable)"
  exit 1
fi

echo "[apply] Session: $SESSION_KEY"
"$CM_DIR/compress.sh" summarize "$SESSION_KEY" --replace | tee /tmp/context-apply.out

LATEST_SUMMARY=$(ls -1t "$CM_DIR"/memory/compressed/*.ai-summary.md 2>/dev/null | head -n1 || true)
LATEST_BACKUP=$(ls -1t "$CM_DIR"/memory/compressed/*.session-backup.jsonl 2>/dev/null | head -n1 || true)
if [[ -n "$LATEST_SUMMARY" ]]; then
  cp "$LATEST_SUMMARY" "$OUT_DIR/latest-summary.md"
fi

TODAY="$(date -u +%F)"
MEM_FILE="memory/$TODAY.md"
[[ -f "$MEM_FILE" ]] || echo "# Memory — $TODAY" > "$MEM_FILE"
{
  echo ""
  echo "## $(date -u +%H:%M) UTC — Context compress APPLY"
  echo "- Session: $SESSION_KEY"
  echo "- Summary: ${LATEST_SUMMARY:-non trouvé}"
  echo "- Backup: ${LATEST_BACKUP:-non trouvé}"
  echo "- Action: APPLY effectué (reset + inject)"
} >> "$MEM_FILE"

git add "$MEM_FILE" "$OUT_DIR/latest-summary.md" "$CM_DIR"/memory/compressed/*.ai-summary.md "$CM_DIR"/memory/compressed/*.session-backup.jsonl 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "chore(context): apply session compression with backup trace"
  git push
  COMMIT="$(git rev-parse --short HEAD)"
else
  COMMIT="none"
fi

echo ""
echo "Résultats"
echo "- apply compression exécuté"
echo "- backup: ${LATEST_BACKUP:-non trouvé}"
echo "- commit: $COMMIT"
echo "Points à retenir"
echo "- Session reset/inject a été effectué"
echo "- Backup JSONL disponible pour rollback"
