#!/bin/bash
# sync-to-google-calendar.sh - Synchronise les tâches du dashboard vers Google Calendar
# À exécuter après chaque modification du dashboard ou via cron

set -e

DASHBOARD="notes/areas/tdah-matrix-dashboard.md"
CALENDAR_ID="88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com"
GATEWAY_URL="${GATEWAY_URL:-https://gateway.maton.ai}"
GATEWAY_TOKEN="${GATEWAY_TOKEN:-_vrEGRCgzX7NMzdP_cuodFOndn3eDsqYi_J-DFGHo8Jp7Td71Aoe7g0cnAFsEDyod4qWLFLPtwmv2hoN1du-aFXJ-LBLYuWEhiTbYjyMTA}"

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../config/timezone.conf" 2>/dev/null || export TZ=Europe/Paris

echo "🔄 Sync Dashboard → Google Calendar"
echo "📅 $(date '+%Y-%m-%d %H:%M')"

# Vérifier si le dashboard existe
if [[ ! -f "$DASHBOARD" ]]; then
    echo "❌ Dashboard non trouvé: $DASHBOARD"
    exit 1
fi

# Fonction pour parser une date relative en date ISO
parse_when_to_date() {
    local when="$1"
    local current_date=$(date +%Y-%m-%d)
    
    case "$when" in
        "Demain matin"*|"demain matin"*)
            date -d "tomorrow 09:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Aujourd'hui"*|"aujourd'hui"*)
            date -d "today $(echo "$when" | grep -oP '\d+' | head -1):00" '+%Y-%m-%dT%H:%M:%S' 2>/dev/null || date -d "today 18:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Ce soir"*|"ce soir"*)
            date -d "today 18:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Cette semaine"*)
            # Mercredi de cette semaine
            date -d "wednesday 09:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*)
            # Date ISO
            local task_date=$(echo "$when" | cut -d' ' -f1)
            local task_time=$(echo "$when" | grep -oP '\d{2}:\d{2}' | head -1 || echo "09:00")
            echo "${task_date}T${task_time}:00"
            ;;
        *)
            # Par défaut : demain 9h
            date -d "tomorrow 09:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
    esac
}

# Fonction pour déterminer la durée en minutes
parse_duration_to_minutes() {
    local duration="$1"
    
    case "$duration" in
        *"5 min"*|*"5min"*)
            echo "5"
            ;;
        *"10 min"*|*"10min"*)
            echo "10"
            ;;
        *"15 min"*|*"15min"*)
            echo "15"
            ;;
        *"30 min"*|*"30min"*)
            echo "30"
            ;;
        *"45 min"*|*"45min"*)
            echo "45"
            ;;
        *"1h"*|*"1 h"*)
            echo "60"
            ;;
        *"2h"*|*"2 h"*)
            echo "120"
            ;;
        *)
            # Par défaut : 30 min
            echo "30"
            ;;
    esac
}

# Fonction pour vérifier si un événement existe déjà
event_exists() {
    local summary="$1"
    local search_date="$2"
    
    # Rechercher les événements du jour avec le même titre
    local existing=$(curl -s "${GATEWAY_URL}/google-calendar/calendar/v3/calendars/${CALENDAR_ID}/events?q=${summary}&timeMin=${search_date}T00:00:00Z&timeMax=${search_date}T23:59:59Z" \
        -H "Authorization: Bearer ${GATEWAY_TOKEN}" 2>/dev/null | grep -o '"summary": *"[^"]*"' | grep -c "$summary" || echo "0")
    
    if [[ "$existing" -gt 0 ]]; then
        return 0  # Existe
    else
        return 1  # N'existe pas
    fi
}
get_emoji_for_case() {
    local case_type="$1"
    
    case "$case_type" in
        *Quick*Win*|*quick*win*) echo "🔴" ;;
        *Gros*Morceau*|*gros*morceau*) echo "🏗️" ;;
        *Remplissage*|*remplissage*) echo "🟡" ;;
        *Planifié*|*planifié*) echo "📅" ;;
        *Délégable*|*délégable*) echo "🟠" ;;
        *Reportable*|*reportable*) echo "🚫" ;;
        *Poubelle*|*poubelle*) echo "🗑️" ;;
        *Archive*|*archive*) echo "📦" ;;
        *) echo "📌" ;;
    esac
}

# Fonction pour créer un événement Google Calendar
create_calendar_event() {
    local summary="$1"
    local start_datetime="$2"
    local duration_minutes="$3"
    local description="$4"
    local case_type="$5"
    
    # Calculer la date de fin
    local end_datetime=$(date -d "$start_datetime + $duration_minutes minutes" '+%Y-%m-%dT%H:%M:%S')
    
    # Obtenir l'emoji de la case
    local emoji=$(get_emoji_for_case "$case_type")
    
    # Construire le JSON de l'événement
    local event_json=$(cat <<EOF
{
  "summary": "${emoji} ${summary}",
  "description": "${description}",
  "start": {
    "dateTime": "${start_datetime}",
    "timeZone": "Europe/Paris"
  },
  "end": {
    "dateTime": "${end_datetime}",
    "timeZone": "Europe/Paris"
  },
  "reminders": {
    "useDefault": false,
    "overrides": [
      {"method": "popup", "minutes": 15}
    ]
  }
}
EOF
)
    
    # Appel API Google Calendar via Maton
    # Note: Nécessite que l'auth Google Calendar soit configurée dans Maton
    # Pour configurer: openclaw gateway config ou via l'UI ClawSuite
    echo "   📌 Création événement: $summary"
    echo "   🕐 $start_datetime → $end_datetime"
    
    # Vérifier si GATEWAY_TOKEN est dispo
    if [[ -z "${GATEWAY_TOKEN:-}" ]]; then
        echo "   ⚠️  GATEWAY_TOKEN non défini - utilisation du calendrier local"
        echo "   💡 Pour activer la sync Google Calendar:"
        echo "      1. Configurer l'auth Google dans Maton/ClawSuite"
        echo "      2. Exporter GATEWAY_TOKEN"
        echo "      3. Relancer le script"
        return 0
    fi
    
    curl -s -X POST "${GATEWAY_URL}/google-calendar/calendar/v3/calendars/${CALENDAR_ID}/events" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${GATEWAY_TOKEN}" \
        -d "$event_json" 2>/dev/null || {
            echo "   ⚠️  Erreur API (auth ou connexion) - événement non créé"
            return 1
        }
    
    echo "   ✅ Créé avec succès"
    return 0
}

# Parser le dashboard et créer les événements
sync_dashboard_to_calendar() {
    local file="$1"
    local synced_count=0
    local error_count=0
    
    # Lire les items non cochés avec leurs détails
    awk '
        BEGIN { in_item = 0; item_text = ""; when = ""; duration = ""; case_type = ""; }
        /^- \[ \] \*\*/ { 
            in_item = 1; 
            item_text = $0; 
            gsub(/\*\*/, "", item_text);
            gsub(/- \[ \] /, "", item_text);
            next; 
        }
        in_item && /^  - 📅 Quand :/ { 
            when = $0; 
            gsub(/  - 📅 Quand : /, "", when);
            next; 
        }
        in_item && /^  - ⏱️ Durée :/ { 
            duration = $0; 
            gsub(/  - ⏱️ Durée : /, "", duration);
            next; 
        }
        in_item && /^  - 🎯 Case :/ {
            case_type = $0;
            gsub(/  - 🎯 Case : /, "", case_type);
            print item_text "|" when "|" duration "|" case_type;
            in_item = 0;
            item_text = "";
            when = "";
            duration = "";
            case_type = "";
        }
        in_item && /^## / { in_item = 0; }
    ' "$file" | while IFS='|' read -r action when duration case_type; do
        [[ -z "$action" ]] && continue
        
        # Vérifier si déjà syncé (marqueur [S])
        if echo "$action" | grep -q '\[S\]'; then
            echo "   ⏭️  Déjà syncé: $action"
            continue
        fi
        
        # Nettoyer (enlever espaces superflus)
        action=$(echo "$action" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        when=$(echo "$when" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        duration=$(echo "$duration" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        case_type=$(echo "$case_type" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        
        # Parser les dates et durées
        local start_datetime=$(parse_when_to_date "$when")
        local duration_minutes=$(parse_duration_to_minutes "$duration")
        local description="Case: ${case_type}\nQuand: ${when}\nDurée: ${duration}"
        
        # Créer l'événement
        if create_calendar_event "$action" "$start_datetime" "$duration_minutes" "$description" "$case_type"; then
            ((synced_count++)) || true
        else
            ((error_count++)) || true
        fi
    done
    
    echo ""
    echo "📊 Résumé:"
    echo "   ✅ Sync: $synced_count"
    echo "   ❌ Erreurs: $error_count"
}

# Main
main() {
    echo "================================"
    sync_dashboard_to_calendar "$DASHBOARD"
    echo "================================"
    echo "Terminé à $(date '+%H:%M')"
}

main "$@"
