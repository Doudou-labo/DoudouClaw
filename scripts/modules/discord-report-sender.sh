#!/usr/bin/env bash
#
# discord-report-sender.sh - Module d'envoi de rapport Memory-PARA sur Discord
# Agence-IA - Frontend Developer
#
# Usage: DISCORD_TOKEN="xxx" DISCORD_CHANNEL="1474162917694898181" \
#        RUN_ID="abc123" ./discord-report-sender.sh
#
# Mode best-effort: ne fait pas fail si Discord est down

set -o pipefail

# Configuration
DISCORD_CHANNEL="${DISCORD_CHANNEL:-1474162917694898181}"
CONSOLIDATION_FILE="${CONSOLIDATION_FILE:-/tmp/consolidation-${RUN_ID}.json}"
DISCORD_API="https://discord.com/api/v10"

# Couleurs pour les logs (pas affichées sur Discord)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1" >&2; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# Vérification des prérequis
if [[ -z "$DISCORD_TOKEN" ]]; then
    log_warn "DISCORD_TOKEN non défini - tentative avec variable d'environnement alternative"
    # Essayer de lire depuis le fichier de credentials si existe
    if [[ -f "$HOME/.openclaw/workspace/.credentials/discord-token.txt" ]]; then
        DISCORD_TOKEN=$(cat "$HOME/.openclaw/workspace/.credentials/discord-token.txt" 2>/dev/null)
        log_info "Token lu depuis le fichier de credentials"
    fi
fi

if [[ -z "$DISCORD_TOKEN" && "${DRY_RUN:-false}" != "true" ]]; then
    log_error "Aucun token Discord disponible - rapport non envoyé"
    exit 0  # Best-effort: pas de fail hard
fi

if [[ ! -f "$CONSOLIDATION_FILE" ]]; then
    log_error "Fichier de consolidation introuvable: $CONSOLIDATION_FILE"
    exit 0  # Best-effort
fi

# Vérifier que jq est disponible
if ! command -v jq &> /dev/null; then
    log_error "jq n'est pas installé - impossible de parser le JSON"
    exit 0
fi

# Lecture du JSON
JSON_DATA=$(cat "$CONSOLIDATION_FILE" 2>/dev/null)
if [[ -z "$JSON_DATA" ]]; then
    log_error "Fichier JSON vide ou illisible"
    exit 0
fi

# Fonction pour extraire une valeur du JSON avec valeur par défaut
json_get() {
    local key="$1"
    local default="${2:-N/A}"
    local value=$(echo "$JSON_DATA" | jq -r "$key // empty" 2>/dev/null)
    if [[ -z "$value" || "$value" == "null" ]]; then
        echo "$default"
    else
        echo "$value"
    fi
}

# Fonction pour formater une durée
format_duration() {
    local seconds="$1"
    if [[ "$seconds" =~ ^[0-9]+\.?[0-9]*$ ]]; then
        if (( $(echo "$seconds < 60" | bc -l 2>/dev/null || echo "1") )); then
            printf "%.1fs" "$seconds"
        else
            local mins=$(echo "scale=0; $seconds / 60" | bc 2>/dev/null || echo "0")
            local secs=$(echo "scale=0; $seconds % 60" | bc 2>/dev/null || echo "$seconds")
            printf "%dm%ds" "$mins" "$secs"
        fi
    else
        echo "${seconds}s"
    fi
}

# Fonction pour formater une taille en MB/KB
format_size() {
    local bytes="$1"
    if [[ "$bytes" =~ ^[0-9]+$ ]]; then
        if (( bytes > 1048576 )); then
            printf "%.1f MB" $(echo "scale=1; $bytes / 1048576" | bc 2>/dev/null || echo "0")
        elif (( bytes > 1024 )); then
            printf "%.1f KB" $(echo "scale=1; $bytes / 1024" | bc 2>/dev/null || echo "0")
        else
            echo "${bytes} B"
        fi
    else
        echo "$bytes"
    fi
}

# Fonction pour formater un timestamp relatif
format_relative() {
    local timestamp="$1"
    if [[ "$timestamp" =~ ^[0-9]+$ ]]; then
        local now=$(date +%s)
        local diff=$((now - timestamp))
        if (( diff < 60 )); then
            echo "il y a ${diff}s"
        elif (( diff < 3600 )); then
            echo "il y a $((diff / 60))min"
        elif (( diff < 86400 )); then
            echo "il y a $((diff / 3600))h"
        else
            echo "il y a $((diff / 86400))j"
        fi
    else
        echo "$timestamp"
    fi
}

# Extraction des données
timestamp=$(json_get '.meta.timestamp' "$(date -u +%Y-%m-%dT%H:%M:%SZ)")
run_id=$(json_get '.meta.run_id' "${RUN_ID:-unknown}")
run_number=$(json_get '.meta.run_number' "?")
total_runs=$(json_get '.meta.total_runs' "?")
duration=$(json_get '.meta.duration' "0")
status=$(json_get '.meta.status' "Succès")

# Formatage de la date
date_formatted=$(date -d "$timestamp" "+%d/%m/%Y %H:%M UTC" 2>/dev/null || echo "$timestamp")

# Extraction OpenClaw Natif
oc_files=$(json_get '.openclaw_native.total_files' "0")
oc_today_file=$(json_get '.openclaw_native.today_file' "N/A")
oc_today_size=$(json_get '.openclaw_native.today_file_size' "0")
oc_total_size=$(json_get '.openclaw_native.total_size' "0")
oc_last_mod=$(json_get '.openclaw_native.last_modified' "N/A")

# Extraction LanceDB LTM
ltm_total=$(json_get '.lancedb_ltm.total_memories' "0")
ltm_new=$(json_get '.lancedb_ltm.new_24h' "0")
ltm_categories=$(json_get '.lancedb_ltm.categories' "N/A")

# Extraction fsxmemory + QMD
fsx_files=$(json_get '.fsxmemory_qmd.indexed_files' "0")
fsx_vectors=$(json_get '.fsxmemory_qmd.vectors' "0")
fsx_checkpoints=$(json_get '.fsxmemory_qmd.active_checkpoints' "0")
fsx_handoffs=$(json_get '.fsxmemory_qmd.pending_handoffs' "0")

# Extraction PARA Structure
para_projects=$(json_get '.para_structure.projects.count' "0")
para_areas=$(json_get '.para_structure.areas.count' "0")
para_resources=$(json_get '.para_structure.resources.count' "0")
para_archive=$(json_get '.para_structure.archive.count' "0")

# Extraction GitHub
git_files=$(json_get '.github_sync.modified_files' "0")
git_commit=$(json_get '.github_sync.commit_hash' "N/A")
git_url=$(json_get '.github_sync.commit_url' "")
git_status=$(json_get '.github_sync.status' "N/A")

# Extraction Prochaines Actions
next_sync=$(json_get '.prochaines_actions.next_sync' "N/A")
archives_check=$(json_get '.prochaines_actions.archives_to_check' "[]")

# Construction du rapport Markdown
build_report() {
    local report=""
    
    # Header
    report+="🧠 **Memory-PARA Sync** — ${date_formatted} | Run #${run_number}/${total_runs}"
    report+=$'\n\n'
    
    # Section Consolidation Mémoire
    report+="## 📊 Consolidation Mémoire"
    report+=$'\n\n'
    
    # OpenClaw Natif
    report+="### 📝 OpenClaw Natif"
    report+=$'\n'
    report+="• Fichiers totaux: **${oc_files}**"
    report+=$'\n'
    report+="• Fichier du jour: **${oc_today_file}** ($(format_size "$oc_today_size"))"
    report+=$'\n'
    report+="• Taille totale: **$(format_size "$oc_total_size")**"
    report+=$'\n'
    report+="• Dernière modification: ${oc_last_mod}"
    report+=$'\n\n'
    
    # LanceDB LTM
    report+="### 🧠 LanceDB LTM"
    report+=$'\n'
    report+="• Mémoires totales: **${ltm_total}**"
    report+=$'\n'
    report+="• Nouvelles (24h): **${ltm_new}**"
    report+=$'\n'
    report+="• Catégories: ${ltm_categories}"
    report+=$'\n\n'
    
    # fsxmemory + QMD
    report+="### 📦 fsxmemory + QMD"
    report+=$'\n'
    report+="• Fichiers indexés: **${fsx_files}**"
    report+=$'\n'
    report+="• Vecteurs QMD: **${fsx_vectors}**"
    report+=$'\n'
    report+="• Checkpoints actifs: **${fsx_checkpoints}**"
    report+=$'\n'
    report+="• Handoffs en attente: **${fsx_handoffs}**"
    report+=$'\n\n'
    
    # Section PARA Structure
    report+="## 🗂️ Structure PARA"
    report+=$'\n\n'
    
    # Projects
    report+="### 📁 Projects (${para_projects} fichiers)"
    report+=$'\n'
    
    # Liste des projets (jusqu'à 5 max)
    local projects_list=$(echo "$JSON_DATA" | jq -r '.para_structure.projects.items[]? | "\(.name): \(.status) (modifié \(.last_modified))"' 2>/dev/null | head -5)
    if [[ -n "$projects_list" ]]; then
        while IFS= read -r line; do
            report+="• ${line}"
            report+=$'\n'
        done <<< "$projects_list"
    else
        report+="• _Aucun projet actif signalé_"
        report+=$'\n'
    fi
    
    if (( para_projects > 5 )); then
        report+="• _...et $((para_projects - 5)) autres_"
        report+=$'\n'
    fi
    report+=$'\n'
    
    # Areas
    report+="### 🗃️ Areas (${para_areas} fichiers)"
    report+=$'\n'
    local areas_list=$(echo "$JSON_DATA" | jq -r '.para_structure.areas.items[]? | "• \(.name): \(.status)"' 2>/dev/null | head -5)
    if [[ -n "$areas_list" ]]; then
        report+="${areas_list}"
        report+=$'\n'
    else
        report+="• _Toutes à jour_"
        report+=$'\n'
    fi
    report+=$'\n'
    
    # Resources
    report+="### 📚 Resources (${para_resources} fichiers)"
    report+=$'\n'
    report+="• Tous à jour"
    report+=$'\n\n'
    
    # Archive
    report+="### 🗄️ Archive (${para_archive} fichiers)"
    report+=$'\n'
    local archived_this_month=$(echo "$JSON_DATA" | jq -r '.para_structure.archive.archived_this_month // 0')
    report+="• ${archived_this_month} projet(s) archivé(s) ce mois"
    report+=$'\n\n'
    
    # Section GitHub
    report+="## 🔄 Sync GitHub"
    report+=$'\n'
    report+="• Fichiers modifiés: **${git_files}**"
    report+=$'\n'
    report+="• Commit: **${git_commit}**"
    report+=$'\n'
    if [[ -n "$git_url" ]]; then
        report+="• URL: ${git_url}"
        report+=$'\n'
    fi
    
    # Status avec emoji
    local status_emoji="✅"
    [[ "$git_status" != *"Push réussi"* && "$git_status" != *"succès"* && "$git_status" != "N/A" ]] && status_emoji="⚠️"
    report+="• Status: ${status_emoji} ${git_status}"
    report+=$'\n\n'
    
    # Section Prochaines Actions
    report+="## ⏭️ Prochaines Actions"
    report+=$'\n'
    report+="• Prochain sync: **${next_sync}**"
    report+=$'\n'
    
    # Archives à vérifier (projets inactifs >30j)
    local archives_count=$(echo "$JSON_DATA" | jq '.prochaines_actions.archives_to_check // 0' 2>/dev/null)
    local inactive_details=$(echo "$JSON_DATA" | jq -r '.prochaines_actions.inactive_details[]? // empty' 2>/dev/null)
    
    if [[ "$archives_count" -gt 0 ]]; then
        report+="• Archives à vérifier: **${archives_count} projet(s) inactif(s)**"
        report+=$'\n'
        if [[ -n "$inactive_details" ]]; then
            report+="${inactive_details}"
            report+=$'\n'
        fi
    else
        report+="• Archives à vérifier: _Aucun projet inactif détecté_"
        report+=$'\n'
    fi
    
    # Footer
    report+=$'\n'
    local duration_fmt=$(format_duration "$duration")
    local final_status="✅ Succès"
    [[ "$status" != "Succès" && "$status" != "success" ]] && final_status="⚠️ ${status}"
    report+="⏱️ **Durée totale**: ${duration_fmt} | **${final_status}**"
    
    echo "$report"
}

# Fonction d'envoi Discord
send_to_discord() {
    local message="$1"
    local max_length=2000  # Limite Discord pour un message
    
    # Tronquer si nécessaire (avec indication)
    if [[ ${#message} -gt $max_length ]]; then
        local truncate_msg="\n\n_... (message tronqué, trop long pour Discord)_"
        message="${message:0:$((max_length - ${#truncate_msg} - 10))}${truncate_msg}"
        log_warn "Message tronqué (${#message} chars > ${max_length} limit)"
    fi
    
    # Construction du payload JSON
    local payload=$(jq -n \
        --arg content "$message" \
        '{
            content: $content,
            flags: 0
        }')
    
    # Envoi via API Discord
    local response
    local http_code
    
    response=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: Bot ${DISCORD_TOKEN}" \
        -H "Content-Type: application/json" \
        -X POST \
        "${DISCORD_API}/channels/${DISCORD_CHANNEL}/messages" \
        -d "$payload" 2>&1)
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Vérification de la réponse
    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        log_info "✅ Rapport envoyé avec succès (HTTP $http_code)"
        local msg_id=$(echo "$body" | jq -r '.id // empty' 2>/dev/null)
        [[ -n "$msg_id" ]] && log_info "Message ID: $msg_id"
        return 0
    else
        log_error "❌ Échec de l'envoi (HTTP $http_code)"
        log_error "Réponse: $body"
        return 1
    fi
}

# Fonction pour détecter les projets inactifs (bonus)
# Retourne le nombre de projets inactifs et écrit les détails dans un fichier
detect_inactive_projects() {
    local output_file="$1"
    local para_dir="${PARA_DIR:-$HOME/.openclaw/workspace/notes/projects}"
    local inactive_threshold_days="${INACTIVE_THRESHOLD:-30}"
    local threshold_seconds=$((inactive_threshold_days * 86400))
    local now=$(date +%s)
    local count=0
    
    > "$output_file"
    
    if [[ -d "$para_dir" ]]; then
        for file in "$para_dir"/*.md; do
            [[ -f "$file" ]] || continue
            local mod_time=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null)
            if [[ -n "$mod_time" ]]; then
                local age=$((now - mod_time))
                if (( age > threshold_seconds )); then
                    local name=$(basename "$file" .md)
                    local last_mod=$(date -d "@$mod_time" "+%Y-%m-%d" 2>/dev/null || echo "unknown")
                    local age_days=$((age / 86400))
                    printf '  - %s (dernière modif: %s, %s jours)\n' "$name" "$last_mod" "$age_days" >> "$output_file"
                    ((count++))
                fi
            fi
        done
    fi
    
    echo "$count"
}

# MAIN
main() {
    log_info "📤 Génération du rapport Discord..."
    log_info "Fichier source: $CONSOLIDATION_FILE"
    
    # Si le fichier JSON n'a pas de données sur les projets inactifs, les générer
    local inactive_array=$(echo "$JSON_DATA" | jq '.prochaines_actions.inactive_projects // empty' 2>/dev/null)
    local has_inactive=$(echo "$inactive_array" | jq 'length' 2>/dev/null)
    local inactive_temp_file="/tmp/discord-sender-inactive-$$.txt"
    local inactive_count=0
    
    if [[ -z "$inactive_array" || "$has_inactive" == "0" ]] && "${AUTO_DETECT_INACTIVE:-true}" == "true"; then
        log_info "🔍 Détection des projets inactifs (>${INACTIVE_THRESHOLD:-30}j)..."
        inactive_count=$(detect_inactive_projects "$inactive_temp_file")
        if [[ "$inactive_count" -gt 0 ]]; then
            log_info "  → ${inactive_count} projet(s) inactif(s) détecté(s)"
            # Injecter dans le JSON pour usage dans build_report
            local inactive_json=$(jq -R -s 'split("\n") | map(select(length > 0))' "$inactive_temp_file" 2>/dev/null || echo "[]")
            JSON_DATA=$(echo "$JSON_DATA" | jq --argjson count "$inactive_count" --argjson list "$inactive_json" '
                .prochaines_actions.archives_to_check = $count |
                .prochaines_actions.inactive_details = $list
            ')
        fi
    fi
    
    # Génération du rapport
    local report=$(build_report)
    
    # Log du rapport (pour debug)
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo "--- RAPPORT GÉNÉRÉ ---" >&2
        echo "$report" >&2
        echo "--- FIN RAPPORT ---" >&2
    fi
    
    # Envoi
    if [[ "${DRY_RUN:-false}" == "true" ]]; then
        log_info "🧪 Mode DRY RUN - rapport généré mais non envoyé"
        echo ""
        echo "========== RAPPORT DISCORD =========="
        echo "$report"
        echo "========== FIN RAPPORT =========="
        exit 0
    fi
    
    log_info "📨 Envoi vers Discord (channel: ${DISCORD_CHANNEL})..."
    
    # Sauvegarder le rapport dans un fichier pour usage externe (OpenClaw)
    local report_file="/tmp/discord-report-${RUN_ID}.md"
    echo "$report" > "$report_file"
    log_info "💾 Rapport sauvegardé dans: $report_file"
    
    if send_to_discord "$report"; then
        log_info "✨ Rapport Discord envoyé avec succès"
        exit 0
    else
        log_warn "⚠️ Envoi échoué mais on continue (mode best-effort)"
        log_info "💡 Rapport disponible dans: $report_file"
        exit 0  # Best-effort: pas de fail hard
    fi
}

# Exécution
main "$@"
