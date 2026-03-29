#!/bin/bash
# Cron Proactive Observations - Analyse profonde + Surprises 4x/jour
# Usage: bash scripts/cron-proactive-observations.sh

set -euo pipefail

WORKSPACE="/root/.openclaw/workspace"
cd "$WORKSPACE"

# Configuration
OBSERVATIONS_FILE="$WORKSPACE/notes/areas/proactive-observations.md"
SESSION_LOG="$WORKSPACE/logs/cron-proactive-observations.log"
ALERT_CHANNEL="1474162917694898181"  # Discord 🧠-mémoire
HEURES_EVEIL=("06" "11" "16" "20")    # 7H, 12H, 17H, 21H France (UTC)
SILENT_MODE=false  # --dry-run pour ne rien envoyer

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction de log
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S UTC') - $1" | tee -a "$SESSION_LOG"
}

# Fonction pour analyser les sessions récentes
analyze_recent_sessions() {
    local hours_back="$1"
    local sessions_output=$(sessions_list --activeMinutes "${hours_back}" --messageLimit 20 2>/dev/null || echo "")

    if [ -z "$sessions_output" ]; then
        return 1
    fi

    echo "$sessions_output"
}

# Fonction pour détecter les patterns de projets
detect_project_patterns() {
    local hours_back="$1"
    local patterns=""

    # Scanner les fichiers de mémoire récents
    local recent_memory=$(find "$WORKSPACE/memory" -name "2026-03-*.md" -mtime -1 -exec cat {} \; 2>/dev/null || echo "")

    if [ -n "$recent_memory" ]; then
        # Compter les mentions de projets
        local pilotage_count=$(echo "$recent_memory" | grep -i "pilotage" | wc -l | tr -d ' ' || true)
        [ -z "$pilotage_count" ] && pilotage_count=0
        local pneu_tracker_count=$(echo "$recent_memory" | grep -i "pneu.*tracker" | wc -l | tr -d ' ' || true)
        [ -z "$pneu_tracker_count" ] && pneu_tracker_count=0
        local venus_count=$(echo "$recent_memory" | grep -i "venus" | wc -l | tr -d ' ' || true)
        [ -z "$venus_count" ] && venus_count=0
        local inventaire_count=$(echo "$recent_memory" | grep -i "inventaire" | wc -l | tr -d ' ' || true)
        [ -z "$inventaire_count" ] && inventaire_count=0

        # Détecter les projets dominants
        local dominant=""
        local max_count=0

        [ "$pilotage_count" -gt "$max_count" ] && { max_count=$pilotage_count; dominant="pilotage"; }
        [ "$pneu_tracker_count" -gt "$max_count" ] && { max_count=$pneu_tracker_count; dominant="pneu-tracker"; }
        [ "$venus_count" -gt "$max_count" ] && { max_count=$venus_count; dominant="venus-beauté"; }
        [ "$inventaire_count" -gt "$max_count" ] && { max_count=$inventaire_count; dominant="inventaire"; }

        if [ "$max_count" -gt 0 ]; then
            patterns="${patterns}🎯 **Projet dominant** : ${dominant} (mentionné ${max_count}x)\n"
        fi

        # Détecter les projets abandonnés
        local abandoned=""
        [ "$pilotage_count" -eq 0 ] && [ "$pneu_tracker_count" -eq 0 ] && abandoned="pas d'activité projets"
        [ "$venus_count" -eq 0 ] && [ "$max_count" -gt 5 ] && abandoned="${abandoned}, venus-beauté en pause"
        [ "$inventaire_count" -eq 0 ] && [ "$max_count" -gt 5 ] && abandoned="${abandoned}, inventaire en pause"

        if [ -n "$abandoned" ]; then
            patterns="${patterns}📉 **Projets en pause** : ${abandoned}\n"
        fi
    fi

    echo -e "$patterns"
}

# Fonction pour détecter les patterns de motivation/mood
detect_motivation_patterns() {
    local hours_back="$1"
    local patterns=""

    # Scanner les sessions récentes
    local sessions=$(analyze_recent_sessions "$hours_back") || echo ""

    if [ -n "$sessions" ]; then
        # Signaux de fatigue
        local fatigue_count=$(echo "$sessions" | grep -iE "claqué|fatigué|crevé|épuisé" | wc -l | tr -d ' ' || true)
        [ -z "$fatigue_count" ] && fatigue_count=0
        if [ "$fatigue_count" -ge 2 ]; then
            patterns="${patterns}😴 **Signal** : Fatigue détectée (${fatigue_count} mentions)\n"
        fi

        # Signaux de stress
        local stress_count=$(echo "$sessions" | grep -iE "stress|angoisse|préoccupation|inquiet" | wc -l | tr -d ' ' || true)
        [ -z "$stress_count" ] && stress_count=0
        if [ "$stress_count" -ge 2 ]; then
            patterns="${patterns}😰 **Signal** : Stress détecté (${stress_count} mentions)\n"
        fi

        # Signaux de motivation
        local motivation_count=$(echo "$sessions" | grep -iE "super|génial|ouais|parfait|nickel" | wc -l | tr -d ' ' || true)
        [ -z "$motivation_count" ] && motivation_count=0
        if [ "$motivation_count" -ge 3 ]; then
            patterns="${patterns}🔥 **Signal** : Motivation haute (${motivation_count} signaux positifs)\n"
        fi
    fi

    echo -e "$patterns"
}

# Fonction pour détecter les opportunités de surprise
detect_surprise_opportunities() {
    local hours_back="$1"
    local opportunities=""

    # Check si un projet est sur-mentionné
    local recent_memory=$(find "$WORKSPACE/memory" -name "2026-03-*.md" -mtime -1 -exec cat {} \; 2>/dev/null || echo "")
    if [ -n "$recent_memory" ]; then
        local pilotage_count=$(echo "$recent_memory" | grep -i "pilotage" | wc -l | tr -d ' ' || true)
        [ -z "$pilotage_count" ] && pilotage_count=0
        local pneu_tracker_count=$(echo "$recent_memory" | grep -i "pneu.*tracker" | wc -l | tr -d ' ' || true)
        [ -z "$pneu_tracker_count" ] && pneu_tracker_count=0

        if [ "$pilotage_count" -gt 8 ]; then
            opportunities="${opportunities}💡 **Surprise possible** : Le pilotage est mentionné ${pilotage_count}x. Tu veux que je lance un agent pour avancer plus vite ?\n"
        fi

        if [ "$pneu_tracker_count" -gt 8 ]; then
            opportunities="${opportunities}💡 **Surprise possible** : Le pneu-tracker est mentionné ${pneu_tracker_count}x. Tu veux que je lance un agent spécialisé debugging ?\n"
        fi
    fi

    # Check les objectifs non suivis
    local today=$(date +%Y-%m-%d)
    local today_file="$WORKSPACE/memory/$today.md"
    if [ -f "$today_file" ]; then
        local ie_mentions=$(grep -i "intelligence émotionnelle\|IE\|lecture.*goleman" "$today_file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$ie_mentions" ] && ie_mentions=0
        if [ "$ie_mentions" -eq 0 ]; then
            opportunities="${opportunities}📚 **Surprise possible** : Pas de mention IE aujourd'hui. Tout va bien ?\n"
        fi

        local sport_mentions=$(grep -i "sport\|séance\|fitness\|musculation\|running" "$today_file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$sport_mentions" ] && sport_mentions=0
        if [ "$sport_mentions" -eq 0 ]; then
            opportunities="${opportunities}🏋️ **Surprise possible** : Pas de sport mentionné. C'est l'épaule ou c'est autre chose ?\n"
        fi
    fi

    echo -e "$opportunities"
}

# Fonction pour générer le rapport
generate_report() {
    log "📝 Génération du rapport proactif..."

    local current_hour=$(date -u +%H)
    local current_time=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
    local current_france=$(date -d '+2 hours' '+%Y-%m-%d %H:%M:%S France')

    local report=""
    report="${report}🧠 **Proactive Observations** - ${current_france}\n\n"

    # Déterminer la période
    local period_label=""
    if [ "$current_hour" -eq 6 ]; then
        period_label="☀️ **Matin**"
    elif [ "$current_hour" -eq 11 ]; then
        period_label="🍽️ **Midi**"
    elif [ "$current_hour" -eq 16 ]; then
        period_label="⚡ **Après-midi**"
    elif [ "$current_hour" -eq 20 ]; then
        period_label="🌙 **Soir**"
    else
        period_label="📊 **Observation**"
    fi

    report="${report}${period_label} - Analyse des dernières 24h\n\n"

    # Détecter les patterns
    local project_patterns=$(detect_project_patterns 24)
    local motivation_patterns=$(detect_motivation_patterns 24)
    local surprise_opportunities=$(detect_surprise_opportunities 24)

    # Construire le rapport
    if [ -n "$project_patterns" ]; then
        report="${report}📁 **Projets**\n${project_patterns}\n"
    fi

    if [ -n "$motivation_patterns" ]; then
        report="${report}🧘 **État d'esprit**\n${motivation_patterns}\n"
    fi

    if [ -n "$surprise_opportunities" ]; then
        report="${report}💡 **Surprises possibles**\n${surprise_opportunities}\n"
    fi

    # Si rien de pertinent
    if [ -z "$project_patterns" ] && [ -z "$motivation_patterns" ] && [ -z "$surprise_opportunities" ]; then
        report="${report}✅ **Tout semble calme** - Pas de patterns détectés cette fois.\n"
    fi

    # Footer
    report="${report}\n---\n_Proactive Observations - Enrichissement continu_"

    echo -e "$report"
}

# Fonction pour mettre à jour le fichier d'observations
update_observations_file() {
    local patterns="$1"
    local report="$2"

    log "📝 Mise à jour du fichier d'observations..."

    # Ajouter les nouvelles observations dans la section "Observations en cours"
    local temp_file=$(mktemp)
    local today=$(date +%Y-%m-%d)

    # Extraire les observations existantes
    grep -A 50 "## 📊 Observations en cours" "$OBSERVATIONS_FILE" > "$temp_file" || echo "" > "$temp_file"

    # Ajouter les nouvelles observations de today
    echo "" >> "$temp_file"
    echo "### ${today} - Analyse $(date -u '+%H:%M UTC')" >> "$temp_file"
    echo "" >> "$temp_file"
    echo "$patterns" >> "$temp_file"

    log "✅ Fichier d'observations mis à jour"
}

# Fonction pour envoyer le rapport
send_report() {
    local report="$1"

    if [ "$SILENT_MODE" = true ]; then
        log "🔍 Mode dry-run - Rapport ci-dessous :"
        echo -e "$report"
    else
        log "📤 Envoi du rapport vers Discord..."
        # Écrire dans un fichier pour le cron Discord
        local report_file="$WORKSPACE/tmp/cron-proactive-report.txt"
        echo -e "$report" > "$report_file"
        log "✅ Rapport écrit dans $report_file (envoi Discord à configurer)"
    fi
}

# Main
main() {
    log "🚀 Cron Proactive Observations démarré"

    # Vérifier si on est dans les heures programmées
    local current_hour=$(date -u +%H)
    local is_scheduled=false

    for hour in "${HEURES_EVEIL[@]}"; do
        if [ "$current_hour" = "$hour" ]; then
            is_scheduled=true
            break
        fi
    done

    if [ "$is_scheduled" = false ]; then
        log "⏰ Hors créneaux programmés - Pas d'analyse"
        exit 0
    fi

    log "⏰ Créneau programmé détecté - Analyse en cours..."

    # Générer le rapport
    local report=$(generate_report)

    # Envoyer le rapport
    send_report "$report"

    log "✅ Cron Proactive Observations terminé"
}

# Exécuter
main "$@"
