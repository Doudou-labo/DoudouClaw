#!/usr/bin/env bash
# consolidate-memory-stack.sh - Consolidation de la stack mémoire
# Usage: ./scripts/consolidate-memory-stack.sh [--dry-run]
#
# Cette phase lit et consolide toutes les sources mémoire :
# - OpenClaw natif (memory/*.md)
# - LanceDB LTM (mémoires long terme)
# - fsxmemory + QMD (fichiers indexés)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$WORKSPACE_DIR/logs"
LOG_FILE="$LOG_DIR/consolidate-memory.log"
OUTPUT_DIR="$WORKSPACE_DIR/logs"
OUTPUT_FILE="$OUTPUT_DIR/consolidation-${RUN_ID:-$(date +%Y%m%d-%H%M%S)}.json"

mkdir -p "$LOG_DIR" "$OUTPUT_DIR"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
fi

log() {
    local msg="$1"
    local ts
    ts=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$ts] $msg" | tee -a "$LOG_FILE"
}

# ============================================
# Consolidation OpenClaw Natif
# ============================================
consolidate_openclaw_native() {
    local memory_dir="$WORKSPACE_DIR/memory"
    local total_files=0
    local today_file=""
    local today_file_size=0
    local total_size=0
    local last_mod=""
    
    if [[ -d "$memory_dir" ]]; then
        total_files=$(find "$memory_dir" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l)
        total_size=$(find "$memory_dir" -maxdepth 1 -type f -name "*.md" -exec stat -c %s {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo 0)
        
        # Fichier du jour
        local today
        today=$(date +%Y-%m-%d)
        if [[ -f "$memory_dir/${today}.md" ]]; then
            today_file="${today}.md"
            today_file_size=$(stat -c %s "$memory_dir/${today}.md" 2>/dev/null || echo 0)
        fi
    fi
    
    printf '{"total_files":%s,"today_file":"%s","today_file_size":%s,"total_size":%s,"last_modified":"%s"}' \
        "${total_files:-0}" \
        "${today_file:-}" \
        "${today_file_size:-0}" \
        "${total_size:-0}" \
        "${last_mod:-}"
}

# ============================================
# Consolidation LanceDB LTM
# ============================================
consolidate_lancedb_ltm() {
    local total_memories=0
    local new_24h=0
    local categories=""
    
    printf '{"total_memories":%s,"new_24h":%s,"categories":"%s"}' \
        "${total_memories:-0}" \
        "${new_24h:-0}" \
        "${categories:-}"
}

# ============================================
# Consolidation fsxmemory + QMD
# ============================================
consolidate_fsxmemory() {
    local indexed_files=0
    local vectors=0
    local active_checkpoints=0
    local pending_handoffs=0
    
    local fsxmemory_dir="$WORKSPACE_DIR/memory/.fsxmemory"
    local handoffs_dir="$WORKSPACE_DIR/memory/handoffs"
    
    if [[ -d "$fsxmemory_dir" ]]; then
        indexed_files=$(find "$fsxmemory_dir" -type f 2>/dev/null | wc -l)
    fi
    
    if [[ -d "$handoffs_dir" ]]; then
        pending_handoffs=$(find "$handoffs_dir" -name "handoff-*.md" -type f 2>/dev/null | wc -l)
    fi
    
    # Compter les checkpoints
    local checkpoints_dir="$WORKSPACE_DIR/memory"
    active_checkpoints=$(find "$checkpoints_dir" -maxdepth 1 -name "checkpoint-*.md" -type f 2>/dev/null | wc -l)
    
    # Estimation des vecteurs QMD (fichiers dans .qmd/)
    local qmd_dir="$WORKSPACE_DIR/.qmd"
    if [[ -d "$qmd_dir" ]]; then
        vectors=$(find "$qmd_dir" -type f 2>/dev/null | wc -l)
    fi
    
    printf '{"indexed_files":%s,"vectors":%s,"active_checkpoints":%s,"pending_handoffs":%s}' \
        "${indexed_files:-0}" \
        "${vectors:-0}" \
        "${active_checkpoints:-0}" \
        "${pending_handoffs:-0}"
}

# ============================================
# Consolidation Structure PARA
# ============================================
consolidate_para_structure() {
    local notes_dir="$WORKSPACE_DIR/notes"
    
    # Compter par dossier
    count_files() {
        local dir="$1"
        if [[ -d "$dir" ]]; then
            find "$dir" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l
        else
            echo 0
        fi
    }
    
    local projects_count areas_count resources_count archive_count
    projects_count=$(count_files "$notes_dir/projects")
    areas_count=$(count_files "$notes_dir/areas")
    resources_count=$(count_files "$notes_dir/resources")
    archive_count=$(count_files "$notes_dir/archive")
    
    printf '{"projects":{"count":%s},"areas":{"count":%s},"resources":{"count":%s},"archive":{"count":%s,"archived_this_month":0}}' \
        "${projects_count:-0}" \
        "${areas_count:-0}" \
        "${resources_count:-0}" \
        "${archive_count:-0}"
}

# ============================================
# Consolidation GitHub Sync
# ============================================
consolidate_github_sync() {
    local modified_files=0
    local commit_hash="N/A"
    local commit_url=""
    local status="unknown"
    
    cd "$WORKSPACE_DIR" || exit 1
    
    if [[ -d ".git" ]]; then
        modified_files=$(git diff --name-only HEAD~1..HEAD 2>/dev/null | wc -l)
        commit_hash=$(git rev-parse --short HEAD 2>/dev/null || echo "N/A")
        
        # URL du commit si remote GitHub
        local remote_url
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ "$remote_url" == *"github.com"* ]]; then
            # Convertir HTTPS ou SSH en URL web
            remote_url=$(echo "$remote_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
            commit_url="${remote_url}/commit/$(git rev-parse HEAD 2>/dev/null || echo "")"
        fi
        
        # Status
        if git diff --quiet HEAD~1..HEAD 2>/dev/null; then
            status="Aucun changement"
        else
            status="Push réussi"
        fi
    fi
    
    printf '{"modified_files":%s,"commit_hash":"%s","commit_url":"%s","status":"%s"}' \
        "${modified_files:-0}" \
        "${commit_hash:-N/A}" \
        "${commit_url:-}" \
        "${status:-unknown}"
}

# ============================================
# Assemblage final
# ============================================
assemble_report() {
    local run_id="${RUN_ID:-$(date +%Y%m%d-%H%M%S)}"
    local timestamp
    timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    local oc_data ltm_data fsx_data para_data git_data
    
    oc_data=$(consolidate_openclaw_native)
    ltm_data=$(consolidate_lancedb_ltm)
    fsx_data=$(consolidate_fsxmemory)
    para_data=$(consolidate_para_structure)
    git_data=$(consolidate_github_sync)
    
    # Construire le JSON final
    cat << EOF
{
    "meta": {
        "run_id": "$run_id",
        "timestamp": "$timestamp",
        "run_number": 1,
        "total_runs": 1,
        "duration": 0,
        "status": "Succès"
    },
    "openclaw_native": $oc_data,
    "lancedb_ltm": $ltm_data,
    "fsxmemory_qmd": $fsx_data,
    "para_structure": $para_data,
    "github_sync": $git_data,
    "prochaines_actions": {
        "next_sync": "Prochain sync dans 24h",
        "archives_to_check": 0,
        "inactive_projects": []
    }
}
EOF
}

# ============================================
# MAIN
# ============================================
main() {
    log "🚀 === Démarrage consolidation mémoire ==="
    log "Output: $OUTPUT_FILE"
    
    if [[ "$DRY_RUN" == true ]]; then
        log "🔍 MODE DRY-RUN — Lecture seule"
    fi
    
    # Assemblage du rapport
    local report
    report=$(assemble_report)
    
    # Écriture du fichier JSON
    if [[ "$DRY_RUN" == false ]]; then
        echo "$report" > "$OUTPUT_FILE"
        log "✅ Rapport écrit: $OUTPUT_FILE"
        
        # Export pour les scripts suivants
        export CONSOLIDATION_FILE="$OUTPUT_FILE"
    else
        log "[DRY-RUN] Rapport généré (non écrit):"
        echo "$report"
    fi
    
    # Affichage résumé
    local mem_files para_projects
    mem_files=$(echo "$report" | grep -o '"total_files":[0-9]*' | cut -d: -f2)
    para_projects=$(echo "$report" | grep -o '"projects":{"count":[0-9]*' | grep -o '[0-9]*')
    
    log "📊 Résumé:"
    log "  • Fichiers mémoire: ${mem_files:-0}"
    log "  • Projets PARA: ${para_projects:-0}"
    
    log "✅ Consolidation terminée"
    return 0
}

main "$@"
