#!/usr/bin/env bash
# unified-memory-para-sync.sh - Orchestrateur maître Memory + PARA Sync
# Usage: ./scripts/unified-memory-para-sync.sh [--dry-run]
# 
# Phases:
#   1. consolidate-memory-stack.sh (lecture)
#   2. sync-para-structure.sh (écriture)
#   3. discord-report-sender.sh (envoi rapport détaillé)
#
# Spécifications:
#   - Retry 1x en cas d'échec d'une phase
#   - Si échec persiste : logger + alerter Discord (séparé du rapport)
#   - Pas de blocage, continuer les phases suivantes
#   - Archivage PARA actif avec demande confirmation avant

set -euo pipefail

# ============================================
# Configuration
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MODULES_DIR="$SCRIPT_DIR/modules"

# Horodatage unique pour cette exécution
RUN_ID=$(date +%Y%m%d-%H%M%S)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE_HUMAN=$(date '+%d/%m/%Y %H:%M')

# Canal Discord pour les rapports (canal mémoire)
REPORT_CHANNEL="1474162917694898181"

# Options
DRY_RUN="${1:-}"
if [[ "$DRY_RUN" == "--dry-run" ]]; then
    DRY_RUN_MODE=true
else
    DRY_RUN_MODE=false
fi

# ============================================
# Charger le module de gestion d'erreurs
# ============================================
source "$MODULES_DIR/error-handler.sh"

# ============================================
# Initialisation
# ============================================
cd "$WORKSPACE_DIR"

log_info "═══════════════════════════════════════════════════"
log_info "🚀 Démarrage Unified Memory + PARA Sync"
log_info "   Run ID: $RUN_ID"
log_info "   Mode: $([[ "$DRY_RUN_MODE" == true ]] && echo 'DRY-RUN' || echo 'PRODUCTION')"
log_info "═══════════════════════════════════════════════════"

# Tableau pour stocker les résultats
declare -A PHASE_STATUS
declare -A PHASE_DETAILS
declare -A PHASE_ERRORS

# ============================================
# Phase 1: Consolidation de la mémoire
# ============================================
run_phase_1() {
    log_info "📦 Phase 1: Consolidation Memory Stack"
    
    local script_path="$SCRIPT_DIR/consolidate-memory-stack.sh"
    local phase_name="consolidate-memory"
    
    if [[ ! -f "$script_path" ]]; then
        log_warn "Script consolidate-memory-stack.sh non trouvé - utilisation fallback"
        # Fallback: utiliser fsxmemory-checkpoint.sh comme alternative
        script_path="$SCRIPT_DIR/fsxmemory-checkpoint.sh"
        phase_name="fsxmemory-checkpoint"
    fi
    
    if [[ ! -f "$script_path" ]]; then
        PHASE_STATUS["$phase_name"]="SKIPPED"
        PHASE_DETAILS["$phase_name"]="Script non trouvé"
        log_warn "Phase 1: SKIP - aucun script de consolidation disponible"
        return 0
    fi
    
    if [[ ! -x "$script_path" ]]; then
        chmod +x "$script_path"
    fi
    
    local output
    local exit_code=0
    
    # Exécution avec retry 1x
    if [[ "$DRY_RUN_MODE" == true ]]; then
        log_info "[DRY-RUN] Phase 1: $script_path --dry-run"
        output="Mode dry-run - pas d'exécution réelle"
        PHASE_STATUS["$phase_name"]="SUCCESS"
        PHASE_DETAILS["$phase_name"]="Dry-run activé"
    else
        if output=$(retry_command "Phase 1: Consolidation mémoire" "$script_path" 2>&1); then
            PHASE_STATUS["$phase_name"]="SUCCESS"
            PHASE_DETAILS["$phase_name"]="OK"
            log_success "Phase 1: ✅ Succès"
        else
            exit_code=$?
            PHASE_STATUS["$phase_name"]="ERROR"
            PHASE_DETAILS["$phase_name"]="Échec après retry (exit $exit_code)"
            PHASE_ERRORS["$phase_name"]="$output"
            log_error "Phase 1: ❌ Échec (exit $exit_code)"
            
            # Alerte Discord séparée
            send_alert "⚠️ **Alerte Unified Sync** ⚠️

Phase 1 (Consolidation) a échoué après retry.
Run ID: \`$RUN_ID\`
Exit code: $exit_code
Timestamp: $TIMESTAMP

_Les phases suivantes continuent (pas de blocage)._" "$REPORT_CHANNEL"
        fi
    fi
    
    return 0  # Ne jamais bloquer
}

# ============================================
# Phase 2: Synchronisation PARA
# ============================================
run_phase_2() {
    log_info "🗂️  Phase 2: Synchronisation PARA Structure"
    
    local script_path="$SCRIPT_DIR/sync-para-structure.sh"
    local phase_name="sync-para"
    
    if [[ ! -f "$script_path" ]]; then
        log_warn "Script sync-para-structure.sh non trouvé - utilisation fallback"
        # Fallback: utiliser auto-para-checkpoint.sh comme alternative
        script_path="$SCRIPT_DIR/auto-para-checkpoint.sh"
        phase_name="auto-para-checkpoint"
    fi
    
    if [[ ! -f "$script_path" ]]; then
        PHASE_STATUS["$phase_name"]="SKIPPED"
        PHASE_DETAILS["$phase_name"]="Script non trouvé"
        log_warn "Phase 2: SKIP - aucun script PARA disponible"
        return 0
    fi
    
    if [[ ! -x "$script_path" ]]; then
        chmod +x "$script_path"
    fi
    
    local output
    local exit_code=0
    
    # Exécution avec retry 1x
    if [[ "$DRY_RUN_MODE" == true ]]; then
        log_info "[DRY-RUN] Phase 2: $script_path checkpoint --dry-run"
        output="Mode dry-run - pas d'exécution réelle"
        PHASE_STATUS["$phase_name"]="SUCCESS"
        PHASE_DETAILS["$phase_name"]="Dry-run activé"
    else
        if output=$(retry_command "Phase 2: Sync PARA" "$script_path" "checkpoint" 2>&1); then
            PHASE_STATUS["$phase_name"]="SUCCESS"
            PHASE_DETAILS["$phase_name"]="OK"
            log_success "Phase 2: ✅ Succès"
            
            # Note: L'archivage PARA avec confirmation est géré par auto-para-checkpoint.sh
            # ou un script séparé si activé
            handle_para_archive
        else
            exit_code=$?
            PHASE_STATUS["$phase_name"]="ERROR"
            PHASE_DETAILS["$phase_name"]="Échec après retry (exit $exit_code)"
            PHASE_ERRORS["$phase_name"]="$output"
            log_error "Phase 2: ❌ Échec (exit $exit_code)"
            
            # Alerte Discord séparée
            send_alert "⚠️ **Alerte Unified Sync** ⚠️

Phase 2 (Sync PARA) a échoué après retry.
Run ID: \`$RUN_ID\`
Exit code: $exit_code
Timestamp: $TIMESTAMP

_Les phases suivantes continuent (pas de blocage)._" "$REPORT_CHANNEL"
        fi
    fi
    
    return 0  # Ne jamais bloquer
}

# ============================================
# Gestion de l'archivage PARA (optionnel)
# ============================================
handle_para_archive() {
    log_info "🗃️  Vérification archivage PARA"
    
    # Vérifier si des éléments inactifs nécessitent confirmation
    local archive_candidates=""
    
    # Scan des projets potentiellement à archiver (inactifs + deadline dépassée)
    local projects_dir="$WORKSPACE_DIR/notes/projects"
    if [[ -d "$projects_dir" ]]; then
        # Trouver les fichiers .md modifiés il y a plus de 30 jours
        while IFS= read -r -d '' file; do
            local basename
            basename=$(basename "$file" .md)
            archive_candidates="${archive_candidates}- 📁 $basename\n"
        done < <(find "$projects_dir" -name "*.md" -type f -mtime +30 -print0 2>/dev/null | head -5)
    fi
    
    if [[ -n "$archive_candidates" ]]; then
        log_warn "Projets candidats à l'archivage détectés"
        # Note: On ne déplace pas automatiquement, on signale juste
        PHASE_DETAILS["para-archive"]="Candidats détectés (confirmation requise)"
    else
        PHASE_DETAILS["para-archive"]="Aucun candidat"
    fi
    
    return 0
}

# ============================================
# Phase 3: Envoi du rapport Discord
# ============================================
run_phase_3() {
    log_info "📤 Phase 3: Envoi rapport détaillé Discord"
    
    local phase_name="discord-report"
    local report_content
    
    # Construire le rapport
    report_content="$(build_report)"
    
    if [[ "$DRY_RUN_MODE" == true ]]; then
        log_info "[DRY-RUN] Phase 3: Rapport serait envoyé sur canal $REPORT_CHANNEL"
        echo "=== RAPPORT DRY-RUN ==="
        echo -e "$report_content"
        PHASE_STATUS["$phase_name"]="SUCCESS"
        PHASE_DETAILS["$phase_name"]="Dry-run (affiché dans logs)"
        return 0
    fi
    
    # Utiliser send_discord_report du module error-handler
    local report_title="🔄 Unified Sync Report | $DATE_HUMAN"
    
    if send_discord_report "$report_title" "$report_content" "$REPORT_CHANNEL"; then
        PHASE_STATUS["$phase_name"]="SUCCESS"
        PHASE_DETAILS["$phase_name"]="Envoyé sur canal $REPORT_CHANNEL"
        log_success "Phase 3: ✅ Rapport envoyé"
    else
        PHASE_STATUS["$phase_name"]="ERROR"
        PHASE_DETAILS["$phase_name"]="Échec d'envoi Discord"
        log_error "Phase 3: ❌ Échec d'envoi du rapport"
        
        # Alerte séparée pour l'échec du rapport
        send_alert "🚨 **Alerte critique** 🚨

Impossible d'envoyer le rapport détaillé sur Discord !
Run ID: \`$RUN_ID\`
Timestamp: $TIMESTAMP

Vérifiez la connectivité Discord et les logs." "$REPORT_CHANNEL"
    fi
    
    return 0
}

# ============================================
# Construction du rapport
# ============================================
build_report() {
    local report=""
    
    # En-tête
    report="🆔 **Run ID:** \`$RUN_ID\`
⏱️ **Durée:** $(date '+%H:%M:%S')

"
    
    # Résumé des phases
    report="${report}📋 **Résumé des phases**
"
    report="${report}\`\`\`
"
    
    for phase in "consolidate-memory" "sync-para" "auto-para-checkpoint" "discord-report"; do
        local status="${PHASE_STATUS[$phase]:-PENDING}"
        local details="${PHASE_DETAILS[$phase]:-N/A}"
        
        case "$status" in
            SUCCESS)
                report="${report}✅ $phase: $details\n"
                ;;
            ERROR)
                report="${report}❌ $phase: $details\n"
                ;;
            SKIPPED)
                report="${report}⏭️  $phase: $details\n"
                ;;
            *)
                report="${report}⏳ $phase: $details\n"
                ;;
        esac
    done
    
    report="${report}\`\`\`

"
    
    # Détails des erreurs si présentes
    local has_errors=false
    for phase in "${!PHASE_ERRORS[@]}"; do
        if [[ -n "${PHASE_ERRORS[$phase]:-}" ]]; then
            has_errors=true
            break
        fi
    done
    
    if [[ "$has_errors" == true ]]; then
        report="${report}⚠️ **Détails des erreurs**
"
        for phase in "${!PHASE_ERRORS[@]}"; do
            local error_msg="${PHASE_ERRORS[$phase]}"
            # Limiter la taille du message d'erreur
            if [[ ${#error_msg} -gt 500 ]]; then
                error_msg="${error_msg:0:500}... (tronqué)"
            fi
            report="${report}- *$phase:* \`$error_msg\`\n"
        done
        report="${report}
"
    fi
    
    # Actions recommandées
    report="${report}📌 **Actions recommandées**
"
    if [[ "$has_errors" == true ]]; then
        report="${report}- Vérifier les logs dans \`/var/log/openclaw/unified-sync.log\`
"
        report="${report}- Relancer manuellement si nécessaire
"
    else
        report="${report}- Aucune action requise ✅
"
    fi
    
    # Archivage PARA
    if [[ "${PHASE_DETAILS[para-archive]:-}" == *"Candidats"* ]]; then
        report="${report}- 🔍 Projets candidats à l'archivage détectés (confirmation requise)
"
    fi
    
    report="${report}
_Le système continue de fonctionner malgré les erreurs._"
    
    echo -e "$report"
}

# ============================================
# Exécution principale
# ============================================
main() {
    log_info "Démarrage des phases..."
    
    # Phase 1
    run_phase_1
    
    # Phase 2
    run_phase_2
    
    # Phase 3
    run_phase_3
    
    # Résumé final
    log_info "═══════════════════════════════════════════════════"
    log_info "🏁 Exécution terminée"
    log_info "   Run ID: $RUN_ID"
    
    # Compter les erreurs
    local error_count=0
    for status in "${PHASE_STATUS[@]}"; do
        [[ "$status" == "ERROR" ]] && ((error_count++))
    done
    
    if [[ $error_count -gt 0 ]]; then
        log_warn "   $error_count phase(s) en erreur (voir alertes Discord)"
        exit 0  # Exit 0 même en cas d'erreur (pas de blocage)
    else
        log_success "   Toutes les phases ont réussi ✅"
        exit 0
    fi
}

# Lancer l'exécution
main "$@"
