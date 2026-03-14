#!/usr/bin/env bash
# error-handler.sh - Module de gestion d'erreurs avec retry et alerte Discord
# Usage: source scripts/modules/error-handler.sh
# Fonctions: retry_command, send_alert, log_error

set -euo pipefail

# Configuration
MAX_RETRIES=1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="/var/log/openclaw"

# Créer le dossier de logs si nécessaire
mkdir -p "$LOG_DIR"

# ============================================
# Fonction: retry_command
# Description: Exécute une commande avec retry 1x en cas d'échec
# Usage: retry_command "description" commande [args...]
# Retourne: 0 si succès, 1 si échec après retry
# ============================================
retry_command() {
    local description="$1"
    shift
    local cmd=("$@")
    local attempt=0
    local exit_code=0
    
    while [[ $attempt -le $MAX_RETRIES ]]; do
        if [[ $attempt -gt 0 ]]; then
            log_info "🔄 Retry $attempt/$MAX_RETRIES pour: $description"
            sleep 2
        fi
        
        if "${cmd[@]}"; then
            return 0
        else
            exit_code=$?
            attempt=$((attempt + 1))
            log_warn "⚠️ Échec (exit $exit_code) pour: $description"
        fi
    done
    
    log_error "❌ Échec définitif après $MAX_RETRIES retry pour: $description"
    return $exit_code
}

# ============================================
# Fonction: send_alert
# Description: Envoie une alerte Discord séparée du rapport
# Usage: send_alert "message" [channel_id]
# ============================================
send_alert() {
    local message="$1"
    local channel_id="${2:-1474162917694898181}"  # Canal mémoire par défaut
    local session_id="agent:main:discord:channel:${channel_id}"
    
    log_info "📨 Envoi alerte Discord vers canal $channel_id"
    
    # Utiliser openclaw agent pour envoyer le message
    if openclaw agent \
        --session-id "$session_id" \
        --message "$message" \
        --deliver \
        --channel discord \
        --reply-to "$channel_id" 2>/dev/null; then
        log_info "✅ Alerte Discord envoyée"
        return 0
    else
        log_error "❌ Impossible d'envoyer l'alerte Discord"
        return 1
    fi
}

# ============================================
# Fonction: send_discord_report
# Description: Envoie un rapport détaillé sur Discord
# Usage: send_discord_report "titre" "contenu" [channel_id]
# ============================================
send_discord_report() {
    local title="$1"
    local content="$2"
    local channel_id="${3:-1472597513898033162}"  # Canal delivery/routines par défaut
    local session_id="agent:main:discord:channel:${channel_id}"
    
    # Formater le rapport avec emojis
    local formatted_report="📊 **${title}**

${content}"
    
    log_info "📨 Envoi rapport Discord vers canal $channel_id"
    
    if openclaw agent \
        --session-id "$session_id" \
        --message "$formatted_report" \
        --deliver \
        --channel discord \
        --reply-to "$channel_id" 2>/dev/null; then
        log_info "✅ Rapport Discord envoyé"
        return 0
    else
        log_error "❌ Impossible d'envoyer le rapport Discord"
        return 1
    fi
}

# ============================================
# Fonction: log_info
# Description: Log un message informatif
# ============================================
log_info() {
    local message="$1"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] ℹ️  $message" | tee -a "$LOG_DIR/unified-sync.log"
}

# ============================================
# Fonction: log_warn
# Description: Log un warning
# ============================================
log_warn() {
    local message="$1"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] ⚠️  $message" | tee -a "$LOG_DIR/unified-sync.log"
}

# ============================================
# Fonction: log_error
# Description: Log une erreur
# ============================================
log_error() {
    local message="$1"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] ❌ $message" | tee -a "$LOG_DIR/unified-sync.log"
}

# ============================================
# Fonction: log_success
# Description: Log un succès
# ============================================
log_success() {
    local message="$1"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] ✅ $message" | tee -a "$LOG_DIR/unified-sync.log"
}

# ============================================
# Export des fonctions si sourced
# ============================================
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    export -f retry_command
    export -f send_alert
    export -f send_discord_report
    export -f log_info
    export -f log_warn
    export -f log_error
    export -f log_success
fi
