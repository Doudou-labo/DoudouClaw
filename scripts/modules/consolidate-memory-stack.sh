#!/usr/bin/env bash
#
# Module de consolidation mémoire - Agence-IA
# Compile les données des 3 systèmes mémoire en un rapport JSON
#
# Usage: ./consolidate-memory-stack.sh [RUN_ID]
# Output: /tmp/consolidation-${RUN_ID}.json
#

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

RUN_ID="${1:-$(date +%s)}"
OUTPUT_FILE="/tmp/consolidation-${RUN_ID}.json"
MEMORY_DIR="${MEMORY_DIR:-$HOME/.openclaw/workspace/memory}"
FSXMEMORY_DIR="${FSXMEMORY_DIR:-$HOME/.openclaw/workspace/memory/.fsxmemory}"

# Date du jour pour le fichier daily
TODAY_DATE=$(date +%Y-%m-%d)
TODAY_FILE="${TODAY_DATE}.md"

# ============================================================================
# FONCTIONS UTILITAIRES
# ============================================================================

log_error() {
    echo "[ERROR] $(date -Iseconds) - $*" >&2
}

log_info() {
    echo "[INFO] $(date -Iseconds) - $*" >&2
}

# Vérifie si une commande existe
command_exists() {
    command -v "$1" &>/dev/null
}

# Formate un nombre avec décimales
format_number() {
    printf "%.1f" "$1" 2>/dev/null || echo "0"
}

# ============================================================================
# COLLECTE OPENCLAW NATIVE
# ============================================================================

collect_openclaw_native() {
    log_info "Collecting OpenClaw native memory stats..."
    
    local total_files=0
    local today_size_kb=0
    local total_size_kb=0
    local today_file="null"
    local total_size_mb=0
    
    # Vérifier que le dossier existe
    if [[ ! -d "$MEMORY_DIR" ]]; then
        log_error "Memory directory not found: $MEMORY_DIR"
        echo "{\"total_files\":0,\"today_file\":null,\"today_size_kb\":0,\"total_size_mb\":0}"
        return
    fi
    
    # Compter les fichiers .md
    total_files=$(find "$MEMORY_DIR" -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l)
    
    # Calculer la taille totale
    if [[ $total_files -gt 0 ]]; then
        total_size_kb=$(find "$MEMORY_DIR" -maxdepth 1 -name "*.md" -type f -exec stat -c%s {} + 2>/dev/null | awk '{sum+=$1} END {printf "%.0f", sum/1024}')
        total_size_mb=$(echo "scale=2; $total_size_kb / 1024" | bc 2>/dev/null || echo "0")
    fi
    
    # Vérifier le fichier du jour
    if [[ -f "$MEMORY_DIR/$TODAY_FILE" ]]; then
        today_file="\"$TODAY_FILE\""
        today_size_bytes=$(stat -c%s "$MEMORY_DIR/$TODAY_FILE" 2>/dev/null || echo "0")
        today_size_kb=$(echo "scale=1; $today_size_bytes / 1024" | bc 2>/dev/null || echo "0")
    fi
    
    cat <<EOF
{
    "total_files": $total_files,
    "today_file": $today_file,
    "today_size_kb": $(format_number "$today_size_kb"),
    "total_size_mb": $(format_number "$total_size_mb")
}
EOF
}

# ============================================================================
# COLLECTE LANCEDB
# ============================================================================

collect_lancedb() {
    log_info "Collecting LanceDB memory stats..."
    
    local total_memories=0
    local new_24h=0
    
    # Vérifier que openclaw existe
    if ! command_exists openclaw; then
        log_error "openclaw command not found"
        echo "{\"total_memories\":0,\"new_24h\":0}"
        return
    fi
    
    # Récupérer le nombre total de mémoires
    local ltm_output
    if ltm_output=$(openclaw ltm list 2>/dev/null); then
        total_memories=$(echo "$ltm_output" | grep -oP 'Total memories:\s*\K[0-9]+' || echo "0")
        
        # Pour les nouvelles mémoires sur 24h, on n'a pas d'info directe
        # On pourrait parser les dates si disponibles, mais pour l'instant on met 0
        new_24h=0
    else
        log_error "Failed to query openclaw ltm list"
    fi
    
    cat <<EOF
{
    "total_memories": ${total_memories:-0},
    "new_24h": ${new_24h:-0}
}
EOF
}

# ============================================================================
# COLLECTE FSXMEMORY
# ============================================================================

collect_fsxmemory() {
    log_info "Collecting fsxmemory stats..."
    
    local files_indexed=0
    local vectors=0
    local checkpoints=0
    
    # Vérifier que qmd existe
    if ! command_exists qmd; then
        log_error "qmd command not found"
        echo "{\"files_indexed\":0,\"vectors\":0,\"checkpoints\":0}"
        return
    fi
    
    # Récupérer les stats via qmd status
    local qmd_output
    if qmd_output=$(qmd status 2>/dev/null); then
        # Parser le nombre de fichiers
        files_indexed=$(echo "$qmd_output" | grep -oP 'Total:\s*\K[0-9]+' | head -1 || echo "0")
        
        # Parser le nombre de vecteurs
        vectors=$(echo "$qmd_output" | grep -oP 'Vectors:\s*\K[0-9]+' || echo "0")
    else
        log_error "Failed to query qmd status"
    fi
    
    # Compter les checkpoints
    if [[ -d "$FSXMEMORY_DIR/checkpoints" ]]; then
        checkpoints=$(find "$FSXMEMORY_DIR/checkpoints" -maxdepth 1 -name "*.json" -type f 2>/dev/null | wc -l)
    elif [[ -d "$HOME/.openclaw/workspace/memory/checkpoints" ]]; then
        checkpoints=$(find "$HOME/.openclaw/workspace/memory/checkpoints" -maxdepth 1 -name "*.json" -type f 2>/dev/null | wc -l)
    fi
    
    cat <<EOF
{
    "files_indexed": ${files_indexed:-0},
    "vectors": ${vectors:-0},
    "checkpoints": ${checkpoints:-0}
}
EOF
}

# ============================================================================
# COLLECTE DES CORRÉLATIONS
# ============================================================================

collect_correlations() {
    log_info "Analyzing correlations..."
    
    # Pour l'instant, pas de corrélation détectée automatiquement
    # Ce tableau pourrait être rempli par analyse ultérieure
    echo "[]"
}

# ============================================================================
# GÉNÉRATION DU RAPPORT JSON
# ============================================================================

generate_report() {
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    local openclaw_data lancedb_data fsxmemory_data correlations
    
    # Collecter les données (avec gestion d'erreur pour chaque source)
    openclaw_data=$(collect_openclaw_native 2>/dev/null || echo '{"total_files":0,"today_file":null,"today_size_kb":0,"total_size_mb":0}')
    lancedb_data=$(collect_lancedb 2>/dev/null || echo '{"total_memories":0,"new_24h":0}')
    fsxmemory_data=$(collect_fsxmemory 2>/dev/null || echo '{"files_indexed":0,"vectors":0,"checkpoints":0}')
    correlations=$(collect_correlations 2>/dev/null || echo "[]")
    
    # Générer le JSON final
    cat > "$OUTPUT_FILE" <<EOF
{
  "timestamp": "$timestamp",
  "run_id": "$RUN_ID",
  "openclaw_native": $openclaw_data,
  "lancedb": $lancedb_data,
  "fsxmemory": $fsxmemory_data,
  "correlations": $correlations
}
EOF

    log_info "Report generated: $OUTPUT_FILE"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    log_info "Starting memory stack consolidation (RUN_ID: $RUN_ID)..."
    
    # Vérifier les dépendances critiques
    local missing_tools=()
    
    if ! command_exists bc; then
        missing_tools+=("bc")
    fi
    
    if ! command_exists find; then
        missing_tools+=("find")
    fi
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Générer le rapport
    generate_report
    
    # Afficher un résumé
    log_info "Consolidation complete!"
    log_info "Output: $OUTPUT_FILE"
    
    # Retourner le chemin du fichier pour usage par d'autres scripts
    echo "$OUTPUT_FILE"
}

# Exécuter si appelé directement
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
