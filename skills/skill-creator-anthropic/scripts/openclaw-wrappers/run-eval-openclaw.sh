#!/bin/bash
#
# run-eval-openclaw.sh - Lance une évaluation de skill avec OpenClaw
# 
# Usage: ./run-eval-openclaw.sh <skill-path> <eval-prompt> [options]
#
# Adaptation OpenClaw du workflow Anthropic skill-creator

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="${SCRIPT_DIR}/../../workspace"
ITERATION=1
EVAL_ID=0
RUN_TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

usage() {
    cat << EOF
Usage: $0 [OPTIONS] <skill-path> <eval-prompt>

Lance une évaluation de skill avec OpenClaw (sessions_spawn)

Options:
    -i, --iteration N      Numéro d'itération (défaut: 1)
    -e, --eval-id ID       ID de l'éval (défaut: auto-incrément)
    -n, --eval-name NAME   Nom descriptif de l'éval
    -b, --baseline         Lancer aussi le run baseline (sans skill)
    -o, --output DIR       Répertoire de sortie (défaut: workspace/)
    -t, --timeout SEC      Timeout en secondes (défaut: 300)
    -h, --help             Afficher cette aide

Exemple:
    $0 ../my-skill "Créer un fichier test.txt" -n "test-fichier" -b

EOF
}

# Parse args
SKILL_PATH=""
EVAL_PROMPT=""
BASELINE=false
TIMEOUT=300
EVAL_NAME=""
OUTPUT_DIR=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--iteration)
            ITERATION="$2"
            shift 2
            ;;
        -e|--eval-id)
            EVAL_ID="$2"
            shift 2
            ;;
        -n|--eval-name)
            EVAL_NAME="$2"
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
            elif [[ -z "$EVAL_PROMPT" ]]; then
                EVAL_PROMPT="$1"
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
if [[ -z "$SKILL_PATH" ]] || [[ -z "$EVAL_PROMPT" ]]; then
    log_error "Arguments manquants"
    usage
    exit 1
fi

if [[ ! -f "$SKILL_PATH/SKILL.md" ]]; then
    log_error "SKILL.md non trouvé dans: $SKILL_PATH"
    exit 1
fi

# Auto-generate eval name if not provided
if [[ -z "$EVAL_NAME" ]]; then
    EVAL_NAME="eval-${EVAL_ID}-$(echo "$EVAL_PROMPT" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | cut -c1-30)"
fi

# Setup output directory
if [[ -z "$OUTPUT_DIR" ]]; then
    OUTPUT_DIR="${WORKSPACE_ROOT}/iteration-${ITERATION}/${EVAL_NAME}"
fi
mkdir -p "$OUTPUT_DIR"/{with_skill,without_skill}

log_info "=== OpenClaw Skill Eval ==="
log_info "Skill: $SKILL_PATH"
log_info "Prompt: $EVAL_PROMPT"
log_info "Eval ID: $EVAL_ID"
log_info "Eval Name: $EVAL_NAME"
log_info "Output: $OUTPUT_DIR"
log_info "Baseline: $BASELINE"
echo

# Create eval metadata
cat > "${OUTPUT_DIR}/eval_metadata.json" << EOF
{
  "eval_id": ${EVAL_ID},
  "eval_name": "${EVAL_NAME}",
  "prompt": "${EVAL_PROMPT}",
  "skill_path": "${SKILL_PATH}",
  "timestamp": "${RUN_TIMESTAMP}",
  "timeout": ${TIMEOUT},
  "assertions": []
}
EOF

# Run WITH skill
log_info "Lancement du run AVEC skill..."
WITH_SKILL_DIR="${OUTPUT_DIR}/with_skill"
mkdir -p "$WITH_SKILL_DIR/outputs"

# Create task file for the session
TASK_FILE="${WITH_SKILL_DIR}/task.txt"
cat > "$TASK_FILE" << EOF
Task: ${EVAL_PROMPT}

You have access to the following skill:
- Path: ${SKILL_PATH}
- File: ${SKILL_PATH}/SKILL.md

Please read the skill file before proceeding, then complete the task.
Save all outputs to: ${WITH_SKILL_DIR}/outputs/

Expected outputs: (specify in evals/evals.json)
EOF

# Record start time
START_TIME=$(date +%s%3N)

# Launch session with skill (using sessions_spawn)
log_info "Spawning session with skill..."
SESSION_LABEL="eval-${EVAL_ID}-with-$(date +%s)"

# Note: In practice, this would use sessions_spawn API
# For now, we document the approach
cat > "${WITH_SKILL_DIR}/session_info.json" << EOF
{
  "label": "${SESSION_LABEL}",
  "skill_loaded": true,
  "skill_path": "${SKILL_PATH}",
  "task": "${EVAL_PROMPT}",
  "start_time_ms": ${START_TIME},
  "status": "spawned"
}
EOF

log_warn "Note: Pour exécuter réellement, utiliser:"
log_warn "  sessions_spawn --label ${SESSION_LABEL} --task-file ${TASK_FILE} --mode run"

# Simulate completion for demo
END_TIME=$(date +%s%3N)
DURATION=$((END_TIME - START_TIME))

# Create timing.json
cat > "${WITH_SKILL_DIR}/timing.json" << EOF
{
  "start_time_ms": ${START_TIME},
  "end_time_ms": ${END_TIME},
  "duration_ms": ${DURATION},
  "duration_seconds": $(echo "scale=1; $DURATION / 1000" | bc -l || echo "$((DURATION / 1000))"),
  "note": "Timing estimé - à remplacer par métriques réelles sessions_spawn"
}
EOF

log_success "Run avec skill terminé (simulation)"

# Run WITHOUT skill (baseline) if requested
if [[ "$BASELINE" == true ]]; then
    log_info "Lancement du run SANS skill (baseline)..."
    WITHOUT_SKILL_DIR="${OUTPUT_DIR}/without_skill"
    mkdir -p "$WITHOUT_SKILL_DIR/outputs"
    
    TASK_FILE_BASELINE="${WITHOUT_SKILL_DIR}/task.txt"
    cat > "$TASK_FILE_BASELINE" << EOF
Task: ${EVAL_PROMPT}

Complete the task without any special skills.
Save all outputs to: ${WITHOUT_SKILL_DIR}/outputs/
EOF

    START_TIME_BASELINE=$(date +%s%3N)
    
    SESSION_LABEL_BASELINE="eval-${EVAL_ID}-without-$(date +%s)"
    
    cat > "${WITHOUT_SKILL_DIR}/session_info.json" << EOF
{
  "label": "${SESSION_LABEL_BASELINE}",
  "skill_loaded": false,
  "task": "${EVAL_PROMPT}",
  "start_time_ms": ${START_TIME_BASELINE},
  "status": "spawned"
}
EOF

    END_TIME_BASELINE=$(date +%s%3N)
    DURATION_BASELINE=$((END_TIME_BASELINE - START_TIME_BASELINE))
    
    cat > "${WITHOUT_SKILL_DIR}/timing.json" << EOF
{
  "start_time_ms": ${START_TIME_BASELINE},
  "end_time_ms": ${END_TIME_BASELINE},
  "duration_ms": ${DURATION_BASELINE},
  "duration_seconds": $(echo "scale=1; $DURATION_BASELINE / 1000" | bc -l || echo "$((DURATION_BASELINE / 1000))")
}
EOF

    log_success "Run baseline terminé (simulation)"
fi

# Summary
log_info "=== Résumé ==="
log_info "Output directory: $OUTPUT_DIR"
log_info "Pour lancer la session réelle avec OpenClaw:"
echo
echo "  # Avec skill:"
echo "  sessions_spawn --label ${SESSION_LABEL} --mode run --file ${SKILL_PATH}/SKILL.md"
echo
echo "  # Sans skill (baseline):"
echo "  sessions_spawn --label ${SESSION_LABEL_BASELINE} --mode run"
echo

exit 0
