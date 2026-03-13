#!/usr/bin/env bash
# cron-wrapper-unified-sync.sh - Wrapper cron pour unified-memory-para-sync.sh
# Usage: À appeler depuis crontab
# Log: /var/log/openclaw/unified-sync-cron.log
#
# Exemple crontab (tous les soirs à 21h30):
# 30 21 * * * /root/.openclaw/workspace/scripts/cron-wrapper-unified-sync.sh

set -euo pipefail

# ============================================
# Configuration
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="/var/log/openclaw"
LOG_FILE="$LOG_DIR/unified-sync-cron.log"

# Script principal
MAIN_SCRIPT="$SCRIPT_DIR/unified-memory-para-sync.sh"

# Canal Discord pour les notifications
NOTIFY_CHANNEL="1474162917694898181"

# ============================================
# Initialisation
# ============================================
mkdir -p "$LOG_DIR"

START_TIME=$(date +%s)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
RUN_ID=$(date +%Y%m%d-%H%M%S)

# ============================================
# Fonctions de log
# ============================================
log() {
    local level="$1"
    local message="$2"
    echo "[$TIMESTAMP] [$level] $message" | tee -a "$LOG_FILE"
}

log_info() { log "INFO" "$1"; }
log_warn() { log "WARN" "$1"; }
log_error() { log "ERROR" "$1"; }
log_success() { log "SUCCESS" "$1"; }

# ============================================
# Vérification préliminaire
# ============================================
check_prerequisites() {
    log_info "═══════════════════════════════════════════════════"
    log_info "🚀 Démarrage Unified Sync Cron Wrapper"
    log_info "   Run ID: $RUN_ID"
    log_info "═══════════════════════════════════════════════════"
    
    # Vérifier que le script principal existe
    if [[ ! -f "$MAIN_SCRIPT" ]]; then
        log_error "Script principal non trouvé: $MAIN_SCRIPT"
        send_failure_notification "Script principal manquant"
        exit 1
    fi
    
    # Vérifier les droits d'exécution
    if [[ ! -x "$MAIN_SCRIPT" ]]; then
        log_warn "Script principal non exécutable, application des droits..."
        chmod +x "$MAIN_SCRIPT"
    fi
    
    # Vérifier le module error-handler
    local error_handler="$SCRIPT_DIR/modules/error-handler.sh"
    if [[ ! -f "$error_handler" ]]; then
        log_warn "Module error-handler non trouvé: $error_handler"
    fi
    
    log_info "Prérequis OK"
}

# ============================================
# Notification d'échec
# ============================================
send_failure_notification() {
    local reason="$1"
    local session_id="agent:main:discord:channel:${NOTIFY_CHANNEL}"
    
    local message="🚨 **Cron Unified Sync - ÉCHEC CRITIQUE** 🚨

Le wrapper cron a échoué avant même le lancement du script principal.

**Raison:** $reason
**Run ID:** \`$RUN_ID\`
**Timestamp:** $TIMESTAMP
**Log:** \`/var/log/openclaw/unified-sync-cron.log\`

**Action requise:**
- Vérifier le système de fichiers
- S'assurer que tous les scripts sont présents
- Vérifier les permissions"
    
    log_info "Tentative d'envoi notification d'échec..."
    
    # Tentative d'envoi (best-effort)
    if command -v openclaw &> /dev/null; then
        openclaw agent \
            --session-id "$session_id" \
            --message "$message" \
            --deliver \
            --channel discord \
            --reply-to "$NOTIFY_CHANNEL" 2>/dev/null || true
    fi
}

# ============================================
# Exécution principale
# ============================================
run_main_script() {
    log_info "Exécution du script principal..."
    log_info "Commande: $MAIN_SCRIPT"
    
    local exit_code=0
    
    # Exécuter le script principal et capturer output
    if "$MAIN_SCRIPT" >> "$LOG_FILE" 2>&1; then
        exit_code=0
        log_success "Script principal terminé avec succès (exit 0)"
    else
        exit_code=$?
        log_warn "Script principal terminé avec code $exit_code"
        # Note: L'orchestrateur gère déjà les erreurs et les alertes Discord
        # On loggue juste ici pour traçabilité
    fi
    
    return $exit_code
}

# ============================================
# Résumé final
# ============================================
print_summary() {
    local exit_code=$1
    local end_time
    end_time=$(date +%s)
    local duration=$((end_time - START_TIME))
    
    log_info "═══════════════════════════════════════════════════"
    log_info "🏁 Cron wrapper terminé"
    log_info "   Exit code: $exit_code"
    log_info "   Durée: ${duration}s"
    log_info "   Log: $LOG_FILE"
    log_info "═══════════════════════════════════════════════════"
    
    # Séparateur pour lisibilité
    echo "" >> "$LOG_FILE"
    echo "---" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
}

# ============================================
# Fonction principale
# ============================================
main() {
    # Vérifier les prérequis
    check_prerequisites
    
    # Exécuter le script principal
    local exit_code=0
    run_main_script || exit_code=$?
    
    # Afficher le résumé
    print_summary $exit_code
    
    # Toujours exit 0 pour ne pas spammer cron en cas d'erreur gérée
    # (l'orchestrateur envoie déjà les alertes Discord)
    exit 0
}

# Lancer l'exécution
main "$@"
