#!/usr/bin/env bash
set -euo pipefail

ROOT="/root/.openclaw/workspace"
cd "$ROOT"

TODAY="$(date -u +%F)"
NOW="$(date -u +%H:%M)"
MEM_FILE="memory/${TODAY}.md"
TRACKER="notes/areas/proactive-tracker.md"
OPEN_LOOPS="notes/areas/open-loops.md"

mkdir -p memory notes/areas

[[ -f "$MEM_FILE" ]] || echo "# Memory — ${TODAY}" > "$MEM_FILE"
[[ -f "$TRACKER" ]] || cat > "$TRACKER" <<'EOF'
# Proactive Tracker

Suivi des comportements proactifs à exécuter régulièrement.
EOF
[[ -f "$OPEN_LOOPS" ]] || cat > "$OPEN_LOOPS" <<'EOF'
# Open Loops

## En cours
EOF

PROJECTS_COUNT=$(find notes/projects -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
AREAS_COUNT=$(find notes/areas -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
RESOURCES_COUNT=$(find notes/resources -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
ARCHIVE_COUNT=$(find notes/archive -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
OPEN_COUNT=$(grep -E '^- \[ \]' "$OPEN_LOOPS" | wc -l | tr -d ' ')

if ! grep -q '^## Weekly Review Log$' "$TRACKER"; then
  {
    echo ""
    echo "## Weekly Review Log"
  } >> "$TRACKER"
fi

echo "- ${TODAY} ${NOW} UTC | Projects:${PROJECTS_COUNT} Areas:${AREAS_COUNT} Resources:${RESOURCES_COUNT} Archive:${ARCHIVE_COUNT} OpenLoops:${OPEN_COUNT}" >> "$TRACKER"

{
  echo ""
  echo "## ${NOW} UTC — AUTO PARA Weekly Review"
  echo "- Snapshot PARA: Projects=${PROJECTS_COUNT}, Areas=${AREAS_COUNT}, Resources=${RESOURCES_COUNT}, Archive=${ARCHIVE_COUNT}"
  echo "- Open loops actifs: ${OPEN_COUNT}"
  echo "- Action: revue hebdo effectuée + trace ajoutée dans notes/areas/proactive-tracker.md"
} >> "$MEM_FILE"

COMMIT_SHA="none"
git add "$TRACKER" "$MEM_FILE"
if ! git diff --cached --quiet; then
  git commit -m "chore(para): weekly review snapshot ${TODAY}"
  git push
  COMMIT_SHA="$(git rev-parse --short HEAD)"
fi

echo "Résultats PARA (revue hebdo)"
echo "- Snapshot: P=${PROJECTS_COUNT} A=${AREAS_COUNT} R=${RESOURCES_COUNT} Ar=${ARCHIVE_COUNT}"
echo "- Open loops actifs: ${OPEN_COUNT}"
echo "- commit: ${COMMIT_SHA}"
echo "Points à retenir"
echo "- Si OpenLoops > 10: prioriser une purge/tri cette semaine"
echo "- Trace GitHub: synchronisée"
