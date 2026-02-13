#!/usr/bin/env bash
set -euo pipefail

ROOT="/root/.openclaw/workspace"
cd "$ROOT"

WINDOW="${1:-checkpoint}"
DRY_RUN="${2:-}"
if [[ "$WINDOW" == "--dry-run" ]]; then
  WINDOW="checkpoint"
  DRY_RUN="--dry-run"
fi

TODAY="$(date -u +%F)"
NOW="$(date -u +%H:%M)"
MEM_FILE="memory/${TODAY}.md"
OPEN_LOOPS="notes/areas/open-loops.md"

mkdir -p memory notes/areas

if [[ ! -f "$MEM_FILE" ]]; then
  cat > "$MEM_FILE" <<EOF
# Memory — ${TODAY}
EOF
fi

if [[ ! -f "$OPEN_LOOPS" ]]; then
  cat > "$OPEN_LOOPS" <<'EOF'
# Open Loops

> Fils ouverts à suivre. Un item = une prochaine action claire.

## En cours
EOF
fi

NEXT_ACTION="$(grep -E '^- \[ \]' "$OPEN_LOOPS" | head -n1 | sed 's/^- \[ \] //')"
if [[ -z "$NEXT_ACTION" ]]; then
  NEXT_ACTION="Définir 1 prochaine action prioritaire dans notes/areas/open-loops.md"
fi

{
  echo ""
  echo "## ${NOW} UTC — AUTO PARA 3-min (${WINDOW})"
  echo "- Checkpoint automatique exécuté."
  echo "- Prochaine action suggérée: ${NEXT_ACTION}"
  echo "- Objectif: garder une seule prochaine action claire à exécuter maintenant."
} >> "$MEM_FILE"

if ! grep -q '^## Auto-checkpoints$' "$OPEN_LOOPS"; then
  {
    echo ""
    echo "## Auto-checkpoints"
  } >> "$OPEN_LOOPS"
fi

echo "- [ ] [AUTO ${TODAY} ${WINDOW}] Checkpoint 3-min fait. Next: ${NEXT_ACTION}" >> "$OPEN_LOOPS"

if [[ "$DRY_RUN" == "--dry-run" ]]; then
  echo "[dry-run] Files updated locally without git push."
  exit 0
fi

git add "$MEM_FILE" "$OPEN_LOOPS"
if ! git diff --cached --quiet; then
  git commit -m "chore(para): auto 3-min checkpoint (${WINDOW}) ${TODAY}"
  git push
else
  echo "No changes to commit."
fi
