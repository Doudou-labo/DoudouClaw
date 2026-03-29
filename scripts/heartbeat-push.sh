#!/bin/bash
# Heartbeat Push - Suggestions proactives pendant les heures d'éveil (7H-22H France)
# Usage: bash scripts/heartbeat-push.sh

set -euo pipefail

WORKSPACE="/root/.openclaw/workspace"
cd "$WORKSPACE"

# Configuration
HEARTBEAT_LOG="$WORKSPACE/logs/heartbeat-push.log"
ALERT_CHANNEL="-1003791371950:topic:1495"  # Topic Telegram dédié
HEURE_DEBUT_EVEIL=06  # 7H France = 6H UTC (été)
HEURE_FIN_EVEIL=20    # 22H France = 20H UTC (été)
PUSH_ENABLED=true     # peut être désactivé via flag --dry-run

# Couleurs pour logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S UTC') - $1" | tee -a "$HEARTBEAT_LOG"
}

# Fonction pour vérifier si on est en heure d'éveil
is_awake() {
    local current_hour=$(date -u +%H)
    if [ "$current_hour" -ge "$HEURE_DEBUT_EVEIL" ] && [ "$current_hour" -lt "$HEURE_FIN_EVEIL" ]; then
        return 0  # true
    else
        return 1  # false
    fi
}

# Fonction pour scanner les projets en cours
scan_projects() {
    local projects_section=""

    # Pneu Tracker - issues GitHub
    if cd "$WORKSPACE/projects/pneu-tracker" 2>/dev/null; then
        local issues=$(gh issue list --json number,title,state --jq '.[] | select(.state == "OPEN") | "#\(.number) \(.title)"' 2>/dev/null || echo "")
        if [ -n "$issues" ]; then
            projects_section="${projects_section}\n🚗 **Pneu Tracker** - Issues ouvertes :\n${issues}\n"
        fi
        cd "$WORKSPACE"
    fi

    # Pilotage - issues GitHub
    if cd "$WORKSPACE/projects/pilotage" 2>/dev/null; then
        local issues=$(gh issue list --json number,title,state --jq '.[] | select(.state == "OPEN") | "#\(.number) \(.title)"' 2>/dev/null || echo "")
        if [ -n "$issues" ]; then
            projects_section="${projects_section}\n📊 **Pilotage** - Issues ouvertes :\n${issues}\n"
        fi
        cd "$WORKSPACE"
    fi

    # Venus Beauté
    if [ -d "$WORKSPACE/projects/venus-beaute" ]; then
        local todo_file="$WORKSPACE/projects/venus-beaute/TODO.md"
        if [ -f "$todo_file" ]; then
            local todos=$(grep -E "^- \[ \]" "$todo_file" | head -3 || echo "")
            if [ -n "$todos" ]; then
                projects_section="${projects_section}\n💄 **Venus Beauté** - TODOs en attente :\n${todos}\n"
            fi
        fi
    fi

    echo -e "$projects_section"
}

# Fonction pour scanner la santé des services
scan_services() {
    local services_section=""

    # (services scan - silent)
    local services=("pneu-tracker" "pilotage" "venus-beaute" "clawsuite")

    for service in "${services[@]}"; do
        local port=""
        case "$service" in
            "pneu-tracker") port=3002 ;;
            "pilotage") port=3003 ;;
            "venus-beaute") port=3004 ;;
            "clawsuite") port=3000 ;;
        esac

        if [ -n "$port" ]; then
            local status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" || echo "000")
            if [ "$status" -eq 200 ]; then
                services_section="${services_section}✅ $service (port $port) - OK\n"
            else
                services_section="${services_section}❌ $service (port $port) - DOWN (HTTP $status)\n"
            fi
        fi
    done

    echo -e "$services_section"
}

# Fonction pour scanner les opportunités d'action
scan_opportunities() {
    local opportunities_section=""

    # (opportunities scan - silent)
    local current_hour=$(date -u +%H)

    # Matin (6-10 UTC) : suggestions de démarrage
    if [ "$current_hour" -ge 6 ] && [ "$current_hour" -lt 10 ]; then
        opportunities_section="${opportunities_section}☀️ **Matin** : Prêt à lancer une tâche rapide ?\n"
        opportunities_section="${opportunities_section}   - Avancer sur une issue ouverte\n"
        opportunities_section="${opportunities_section}   - Faire un checkpoint sur un projet\n"
    fi

    # Midi (10-14 UTC) : focus sur les tâches importantes
    if [ "$current_hour" -ge 10 ] && [ "$current_hour" -lt 14 ]; then
        opportunities_section="${opportunities_section}🍽️ **Midi** : Bon moment pour avancer sur du concret\n"
        opportunities_section="${opportunities_section}   - Corriger un bug en cours\n"
        opportunities_section="${opportunities_section}   - Faire un point sur un projet bloquant\n"
    fi

    # Après-midi (14-18 UTC) : suggestions d'avancement
    if [ "$current_hour" -ge 14 ] && [ "$current_hour" -lt 18 ]; then
        opportunities_section="${opportunities_section}⚡ **Après-midi** : Énergie max pour avancer\n"
        opportunities_section="${opportunities_section}   - Lancer une nouvelle feature\n"
        opportunities_section="${opportunities_section}   - Faire une revue de code\n"
    fi

    # Soir (18-20 UTC) : rétrospective et planification
    if [ "$current_hour" -ge 18 ] && [ "$current_hour" -lt 20 ]; then
        opportunities_section="${opportunities_section}🌙 **Soir** : Bilan et planification\n"
        opportunities_section="${opportunities_section}   - Faire un PARA checkpoint\n"
        opportunities_section="${opportunities_section}   - Noter les décisions de la journée\n"
        opportunities_section="${opportunities_section}   - Planifier les priorités demain\n"
    fi

    echo -e "$opportunities_section"
}

# Fonction pour scanner les rappels contextuels
scan_reminders() {
    local reminders_section=""

    # (reminders scan - silent)
    local today=$(date +%Y-%m-%d)
    local today_file="$WORKSPACE/memory/$today.md"

    if [ -f "$today_file" ]; then
        # Extraire les tâches en attente
        local pending_tasks=$(grep -E "^\- \[ \]" "$today_file" | head -3 || echo "")
        if [ -n "$pending_tasks" ]; then
            reminders_section="${reminders_section}📌 **Tâches en attente** (aujourd'hui) :\n${pending_tasks}\n"
        fi
    fi

    # Check SESSION-STATE pour les tâches actives
    if [ -f "$WORKSPACE/SESSION-STATE.md" ]; then
        local active_task=$(grep -E "^## Tâche actuelle" "$WORKSPACE/SESSION-STATE.md" -A 2 | tail -1 || echo "")
        if [ -n "$active_task" ]; then
            reminders_section="${reminders_section}🎯 **Tâche active** : ${active_task}\n"
        fi
    fi

    # Vérifier les deadlines proches (visite Marc DR : 31/03/2026)
    local visit_date="2026-03-31"
    local today_date=$(date +%Y-%m-%d)
    local days_until=$(python3 -c "from datetime import datetime; print((datetime.strptime('$visit_date', '%Y-%m-%d') - datetime.strptime('$today_date', '%Y-%m-%d')).days)" 2>/dev/null || echo "")

    if [ -n "$days_until" ] && [ "$days_until" -le 7 ] && [ "$days_until" -ge 0 ]; then
        reminders_section="${reminders_section}📅 **Rappel** : Visite Marc DR dans $days_until jours ($visit_date)\n"
    fi

    echo -e "$reminders_section"
}

# Fonction principale de génération du rapport
generate_report() {
    log "📝 Génération du rapport heartbeat push..."

    local current_time=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
    local current_france=$(date -d '+2 hours' '+%Y-%m-%d %H:%M:%S France')

    local report=""
    report="${report}🤖 **Heartbeat Push** - ${current_france}\n\n"

    # Scanner toutes les sections
    local projects=$(scan_projects)
    local services=$(scan_services)
    local opportunities=$(scan_opportunities)
    local reminders=$(scan_reminders)

    # Construire le rapport final
    if [ -n "$projects" ]; then
        report="${report}📁 **Projets en cours**\n${projects}\n"
    fi

    if [ -n "$services" ]; then
        report="${report}🔧 **État des services**\n${services}\n"
    fi

    if [ -n "$reminders" ]; then
        report="${report}📌 **Rappels contextuels**\n${reminders}\n"
    fi

    if [ -n "$opportunities" ]; then
        report="${report}💡 **Opportunités d'action**\n${opportunities}\n"
    fi

    # Footer
    report="${report}\n---\n_Heartbeat Push - Mode proactif activé_"

    echo -e "$report"
}

# Fonction d'envoi du rapport
send_report() {
    local report="$1"

    if [ "$PUSH_ENABLED" = true ]; then
        # Pour l'instant, on écrit le rapport dans un fichier temporaire
        # Le cron principal pourra l'envoyer via Discord
        local report_file="$WORKSPACE/tmp/heartbeat-push-report.txt"
        echo -e "$report" > "$report_file"
        log "📤 Rapport écrit dans $report_file (envoi via Discord à configurer)"
    else
        log "🔍 Mode dry-run - Rapport ci-dessous :"
        echo -e "$report"
    fi
}

# Main
main() {
    log "🚀 Heartbeat Push démarré"

    # Vérifier si on est en heure d'éveil
    if ! is_awake; then
        log "😴 Hors heures d'éveil - Pas de push"
        exit 0
    fi

    log "⏰ Heures d'éveil - Génération du rapport..."

    # Générer et envoyer le rapport
    local report=$(generate_report)
    send_report "$report"

    log "✅ Heartbeat Push terminé"
}

# Exécuter
main "$@"
