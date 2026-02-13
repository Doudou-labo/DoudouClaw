#!/usr/bin/env bash
set -euo pipefail

ROOT="/root/.openclaw/workspace"
cd "$ROOT"

TODAY="$(date -u +%F)"
NOW="$(date -u +%H:%M)"
MEM_FILE="memory/${TODAY}.md"
LEARN_DIR=".learnings"
ERRORS_FILE="${LEARN_DIR}/ERRORS.md"
LEARNINGS_FILE="${LEARN_DIR}/LEARNINGS.md"
FEATURES_FILE="${LEARN_DIR}/FEATURE_REQUESTS.md"

mkdir -p memory "$LEARN_DIR"
[[ -f "$MEM_FILE" ]] || echo "# Memory — ${TODAY}" > "$MEM_FILE"
[[ -f "$ERRORS_FILE" ]] || echo "# ERRORS" > "$ERRORS_FILE"
[[ -f "$LEARNINGS_FILE" ]] || echo "# LEARNINGS" > "$LEARNINGS_FILE"
[[ -f "$FEATURES_FILE" ]] || echo "# FEATURE_REQUESTS" > "$FEATURES_FILE"

mapfile -t RECENT_MEMORY < <(ls -1 memory/*.md 2>/dev/null | sort | tail -n 2)
if [[ ${#RECENT_MEMORY[@]} -eq 0 ]]; then
  RECENT_MEMORY=("$MEM_FILE")
fi

ERROR_HITS=$(grep -HnEi 'error|fail|failed|timeout|échec|exception' "${RECENT_MEMORY[@]}" | head -n 8 || true)
CORRECTION_HITS=$(grep -HnEi 'correction|corrig|pas ça|non c|actually|wrong' "${RECENT_MEMORY[@]}" | head -n 8 || true)

{
  echo ""
  echo "## ${TODAY} ${NOW} UTC"
  if [[ -n "$ERROR_HITS" ]]; then
    echo "- Findings: erreurs/outils détectés dans les mémoires récentes"
    echo "- Sources:"
    echo "$ERROR_HITS" | sed 's/^/  - /'
    echo "- Action: transformer les patterns récurrents en gotchas dans TOOLS.md"
  else
    echo "- Findings: aucun pattern d'erreur marquant détecté"
  fi
} >> "$ERRORS_FILE"

{
  echo ""
  echo "## ${TODAY} ${NOW} UTC"
  if [[ -n "$CORRECTION_HITS" ]]; then
    echo "- Findings: corrections utilisateur détectées"
    echo "- Sources:"
    echo "$CORRECTION_HITS" | sed 's/^/  - /'
    echo "- Action: promouvoir les patterns stables dans AGENTS.md/MEMORY.md"
  else
    echo "- Findings: pas de correction explicite détectée"
  fi
} >> "$LEARNINGS_FILE"

{
  echo ""
  echo "## ${NOW} UTC — AUTO Self-Improving Weekly Review"
  echo "- Revue auto exécutée sur: ${RECENT_MEMORY[*]}"
  if [[ -n "$ERROR_HITS" ]]; then
    echo "- Patterns erreurs détectés: oui"
  else
    echo "- Patterns erreurs détectés: non"
  fi
  if [[ -n "$CORRECTION_HITS" ]]; then
    echo "- Corrections utilisateur détectées: oui"
  else
    echo "- Corrections utilisateur détectées: non"
  fi
  echo "- Traces mises à jour: .learnings/ERRORS.md + .learnings/LEARNINGS.md"
} >> "$MEM_FILE"

COMMIT_SHA="none"
git add "$ERRORS_FILE" "$LEARNINGS_FILE" "$FEATURES_FILE" "$MEM_FILE"
if ! git diff --cached --quiet; then
  git commit -m "chore(self-improve): weekly auto review ${TODAY}"
  git push
  COMMIT_SHA="$(git rev-parse --short HEAD)"
fi

ERR_FLAG="non"
CORR_FLAG="non"
[[ -n "$ERROR_HITS" ]] && ERR_FLAG="oui"
[[ -n "$CORRECTION_HITS" ]] && CORR_FLAG="oui"

echo "Résultats Self-Improving (revue hebdo)"
echo "- Patterns erreurs: ${ERR_FLAG}"
echo "- Corrections utilisateur: ${CORR_FLAG}"
echo "- commit: ${COMMIT_SHA}"
echo "Points à retenir"
echo "- Si erreurs=oui: ajouter/mettre à jour un gotcha TOOLS.md"
echo "- Si corrections=oui: promouvoir une règle AGENTS.md"
echo "- Trace GitHub: synchronisée"
