#!/bin/bash
#
# run-batch-eval.sh - Lance un batch d'évaluations complet
#
# Usage: ./run-batch-eval.sh <skill-path> <evals-json> [options]
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_EVAL_SCRIPT="${SCRIPT_DIR}/run-eval-openclaw.sh"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

usage() {
    cat << EOF
Usage: $0 [OPTIONS] <skill-path> <evals-json>

Lance un batch complet d'évaluations pour un skill

Arguments:
    skill-path      Chemin vers le skill à évaluer
    evals-json      Fichier JSON avec les prompts de test

Options:
    -i, --iteration N      Numéro d'itération (défaut: 1)
    -b, --baseline         Lancer aussi les runs baseline
    -o, --output DIR       Répertoire de sortie
    -t, --timeout SEC      Timeout par éval (défaut: 300)
    -p, --parallel N       Nombre d'évals parallèles (défaut: 1)
    -h, --help             Afficher cette aide

Exemple:
    $0 ../my-skill ../my-skill/evals/evals.json -b -i 2

EOF
}

# Parse args
SKILL_PATH=""
EVALS_JSON=""
ITERATION=1
BASELINE=false
TIMEOUT=300
PARALLEL=1
OUTPUT_DIR=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--iteration)
            ITERATION="$2"
            shift 2
            ;;
        -b|--baseline)
            BASELINE=true
            shift
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -p|--parallel)
            PARALLEL="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            log_error "Option inconnue: $1"
            usage
            exit 1
            ;;
        *)
            if [[ -z "$SKILL_PATH" ]]; then
                SKILL_PATH="$1"
            elif [[ -z "$EVALS_JSON" ]]; then
                EVALS_JSON="$1"
            else
                log_error "Trop d'arguments"
                usage
                exit 1
            fi
            shift
            ;;
    esac
done

# Validation
if [[ -z "$SKILL_PATH" ]] || [[ -z "$EVALS_JSON" ]]; then
    log_error "Arguments manquants"
    usage
    exit 1
fi

if [[ ! -f "$EVALS_JSON" ]]; then
    log_error "Fichier evals non trouvé: $EVALS_JSON"
    exit 1
fi

# Setup output directory
WORKSPACE_ROOT="${SCRIPT_DIR}/../../workspace"
if [[ -z "$OUTPUT_DIR" ]]; then
    OUTPUT_DIR="${WORKSPACE_ROOT}/iteration-${ITERATION}"
fi
mkdir -p "$OUTPUT_DIR"

log_info "=== Batch Eval OpenClaw ==="
log_info "Skill: $SKILL_PATH"
log_info "Evals: $EVALS_JSON"
log_info "Output: $OUTPUT_DIR"
log_info "Baseline: $BASELINE"
log_info "Parallel: $PARALLEL"
echo

# Parse evals and run them
EVAL_INDEX=0

# Use jq if available, otherwise fallback
if command -v jq > /dev/null 2>&1; then
    log_info "Utilisation de jq pour parser les évals"
    
    NUM_EVALS=$(jq '.evals | length' "$EVALS_JSON")
    log_info "Nombre d'évaluations: $NUM_EVALS"
    
    for ((i=0; i<NUM_EVALS; i++)); do
        EVAL_PROMPT=$(jq -r ".evals[$i].prompt" "$EVALS_JSON")
        EVAL_NAME=$(jq -r ".evals[$i].id // empty" "$EVALS_JSON")
        
        if [[ -z "$EVAL_NAME" ]] || [[ "$EVAL_NAME" == "null" ]]; then
            EVAL_NAME="eval-${i}"
        fi
        
        log_info "[$((i+1))/$NUM_EVALS] Lancement: $EVAL_NAME"
        
        BASELINE_FLAG=""
        [[ "$BASELINE" == true ]] && BASELINE_FLAG="-b"
        
        "$RUN_EVAL_SCRIPT" \
            -i "$ITERATION" \
            -e "$i" \
            -n "$EVAL_NAME" \
            -o "${OUTPUT_DIR}/${EVAL_NAME}" \
            -t "$TIMEOUT" \
            $BASELINE_FLAG \
            "$SKILL_PATH" \
            "$EVAL_PROMPT"
        
        log_success "Éval $EVAL_NAME terminée"
        echo
    done
else
    log_warn "jq non disponible - mode manuel"
    log_warn "Veuillez lancer les évals manuellement avec run-eval-openclaw.sh"
fi

# Generate summary
log_info "Génération du résumé..."
SUMMARY_FILE="${OUTPUT_DIR}/batch_summary.json"

cat > "$SUMMARY_FILE" << EOF
{
  "iteration": ${ITERATION},
  "skill_path": "${SKILL_PATH}",
  "evals_file": "${EVALS_JSON}",
  "timestamp": "$(date -Iseconds)",
  "baseline_enabled": ${BASELINE},
  "output_dir": "${OUTPUT_DIR}"
}
EOF

log_success "Batch terminé!"
log_info "Résumé: $SUMMARY_FILE"
log_info "Prochaine étape: lancer les sessions avec sessions_spawn, puis agréger avec aggregate-benchmark.py"

exit 0
