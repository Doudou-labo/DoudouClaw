#!/bin/bash
# sync-to-google-calendar.sh - Synchronise les tâches du dashboard vers Google Calendar
# Supporte les blocs multiples pour les Gros Morceaux (Pomodoro)

set -e

DASHBOARD="notes/areas/tdah-matrix-dashboard.md"
CALENDAR_ID="88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com"
GATEWAY_URL="${GATEWAY_URL:-https://gateway.maton.ai}"
GATEWAY_TOKEN="${GATEWAY_TOKEN:-_vrEGRCgzX7NMzdP_cuodFOndn3eDsqYi_J-DFGHo8Jp7Td71Aoe7g0cnAFsEDyod4qWLFLPtwmv2hoN1du-aFXJ-LBLYuWEhiTbYjyMTA}"

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../config/timezone.conf" 2>/dev/null || export TZ=Europe/Paris

echo "🔄 Sync Dashboard → Google Calendar"
echo "📅 $(date '+%Y-%m-%d %H:%M %Z')"

# --- Fonctions utilitaires ---

parse_when_to_date() {
    local when="$1"
    case "$when" in
        "Demain matin"*|"demain matin"*)
            date -d "tomorrow 09:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Demain après-midi"*|"demain après-midi"*)
            date -d "tomorrow 14:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Demain"*|"demain"*)
            date -d "tomorrow 09:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Aujourd'hui"*|"aujourd'hui"*)
            local hour=$(echo "$when" | grep -oP '\d+' | head -1 || echo "18")
            date -d "today ${hour}:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Ce soir"*|"ce soir"*)
            date -d "today 18:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        "Cette semaine"*)
            date -d "wednesday 09:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
        [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*)
            local task_date=$(echo "$when" | cut -d' ' -f1)
            local task_time=$(echo "$when" | grep -oP '\d{2}:\d{2}' | head -1 || echo "09:00")
            echo "${task_date}T${task_time}:00"
            ;;
        *)
            date -d "tomorrow 09:00" '+%Y-%m-%dT%H:%M:%S'
            ;;
    esac
}

parse_duration_to_minutes() {
    local duration="$1"
    case "$duration" in
        *"5 min"*|*"5min"*) echo "5" ;;
        *"10 min"*|*"10min"*) echo "10" ;;
        *"15 min"*|*"15min"*) echo "15" ;;
        *"30 min"*|*"30min"*) echo "30" ;;
        *"45 min"*|*"45min"*) echo "45" ;;
        *"1h"*|*"1 h"*) echo "60" ;;
        *"1h30"*|*"1h30"*|*"90 min"*) echo "90" ;;
        *"2h"*|*"2 h"*) echo "120" ;;
        *"3h"*|*"3 h"*) echo "180" ;;
        *"4h"*|*"4 h"*) echo "240" ;;
        *"5h"*|*"5 h"*) echo "300" ;;
        *"6h"*|*"6 h"*) echo "360" ;;
        *) echo "30" ;;
    esac
}

get_emoji_for_case() {
    local case_type="$1"
    case "$case_type" in
        *Quick*Win*) echo "🔴" ;;
        *Gros*Morceau*) echo "🏗️" ;;
        *Remplissage*) echo "🟡" ;;
        *Planifié*) echo "📅" ;;
        *Délégable*) echo "🟠" ;;
        *Reportable*) echo "🚫" ;;
        *Poubelle*) echo "🗑️" ;;
        *Archive*) echo "📦" ;;
        *) echo "📌" ;;
    esac
}

# Créer un seul événement
create_single_event() {
    local summary="$1"
    local start="$2"
    local duration_min="$3"
    local description="$4"
    local emoji="$5"
    
    local end_datetime=$(date -d "$start + $duration_min minutes" '+%Y-%m-%dT%H:%M:%S')
    
    # Construction JSON sans here-doc (plus robuste)
    local event_json="{"
    event_json+="\"summary\": \"${emoji} ${summary}\","
    event_json+="\"description\": \"${description}\","
    event_json+="\"start\": {\"dateTime\": \"${start}\", \"timeZone\": \"Europe/Paris\"},"
    event_json+="\"end\": {\"dateTime\": \"${end_datetime}\", \"timeZone\": \"Europe/Paris\"},"
    event_json+="\"reminders\": {\"useDefault\": false, \"overrides\": [{\"method\": \"popup\", \"minutes\": 15}]}"
    event_json+="}"
    
    local response=$(curl -s -X POST "${GATEWAY_URL}/google-calendar/calendar/v3/calendars/${CALENDAR_ID}/events" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${GATEWAY_TOKEN}" \
        -d "$event_json" 2>/dev/null)
    
    if echo "$response" | grep -q '"kind": "calendar#event"'; then
        echo "   ✅ ${emoji} ${summary} ($(date -d "$start" '+%H:%M')-$(date -d "$end_datetime" '+%H:%M'))"
        return 0
    else
        local err_msg=$(echo "$response" | grep -o '"message": *"[^"]*"' | head -1)
        echo "   ❌ Erreur: ${err_msg}"
        return 1
    fi
}

# Créer plusieurs blocs pour Gros Morceaux
create_big_chunk_blocks() {
    local summary="$1"
    local start="$2"
    local total_minutes="$3"
    local description="$4"
    local emoji="$5"
    
    local block_duration=30   # Blocs de 30 min (Pomodoro)
    local break_duration=10   # Pauses de 10 min
    local lunch_break=45      # Pause déjeuner
    local current_start="$start"
    local remaining=$total_minutes
    local block_num=1
    local created=0
    
    while [[ $remaining -gt 0 ]]; do
        local this_block=$block_duration
        if [[ $remaining -lt $block_duration ]]; then
            this_block=$remaining
        fi
        
        local block_label="${summary} - Bloc ${block_num}"
        
        if create_single_event "$block_label" "$current_start" "$this_block" "$description" "$emoji"; then
            ((created++)) || true
        fi
        
        # Pause déjeuner après le bloc 6 (12h-12h45)
        if [[ $block_num -eq 6 ]]; then
            echo "   🍽️  Pause déjeuner (45 min)"
            current_start=$(date -d "$current_start + $this_block minutes + $lunch_break minutes" '+%Y-%m-%dT%H:%M:%S')
        else
            current_start=$(date -d "$current_start + $this_block minutes + $break_duration minutes" '+%Y-%m-%dT%H:%M:%S')
        fi
        
        remaining=$((remaining - this_block))
        block_num=$((block_num + 1))
        
        # Max 9 blocs par jour (4h30 de travail effectif: matin 3 + après-midi 3 + soir 3)
        if [[ $block_num -gt 9 ]]; then
            echo "   ⏸️  9 blocs atteints → reste pour le jour suivant"
            break
        fi
    done
    
    return $created
}

# --- Main sync logic ---
sync_dashboard_to_calendar() {
    local file="$1"
    local synced_count=0
    
    awk '
        BEGIN { in_item = 0 }
        /^- \[ \] \*\*/ {
            in_item = 1
            item_text = $0
            gsub(/\*\*/, "", item_text)
            gsub(/- \[ \] /, "", item_text)
            when = ""; duration = ""; case_type = ""
            next
        }
        in_item && /^  - 📅 Quand :/ {
            when = $0
            gsub(/  - 📅 Quand : /, "", when)
            next
        }
        in_item && /^  - ⏱️ Durée :/ {
            duration = $0
            gsub(/  - ⏱️ Durée : /, "", duration)
            next
        }
        in_item && /^  - 🎯 Case :/ {
            case_type = $0
            gsub(/  - 🎯 Case : /, "", case_type)
            print item_text "|" when "|" duration "|" case_type
            in_item = 0
        }
        in_item && /^## / { in_item = 0 }
    ' "$file" | while IFS='|' read -r action when duration case_type; do
        [[ -z "$action" ]] && continue
        
        # Skip si déjà syncé
        if echo "$action" | grep -q '\[S\]'; then
            echo "   ⏭️  Déjà syncé: $(echo "$action" | sed 's/\[S\]//')"
            continue
        fi
        
        # Nettoyer
        action=$(echo "$action" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        when=$(echo "$when" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        duration=$(echo "$duration" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        case_type=$(echo "$case_type" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        
        local start_datetime=$(parse_when_to_date "$when")
        local duration_minutes=$(parse_duration_to_minutes "$duration")
        local description="Case: ${case_type} | Quand: ${when} | Durée: ${duration}"
        local emoji=$(get_emoji_for_case "$case_type")
        
        echo ""
        echo "${emoji} ${action}"
        echo "   🕐 Prévu: ${when} (${duration_minutes} min)"
        
        # Gros Morceau → blocs multiples
        if echo "$case_type" | grep -qi "gros.*morceau"; then
            echo "   🔄 Gros Morceau → découpage en blocs"
            if create_big_chunk_blocks "$action" "$start_datetime" "$duration_minutes" "$description" "$emoji"; then
                ((synced_count++)) || true
            fi
        else
            # Tâche simple → un seul événement
            if create_single_event "$action" "$start_datetime" "$duration_minutes" "$description" "$emoji"; then
                ((synced_count++)) || true
            fi
        fi
    done
    
    echo ""
    echo "📊 Résumé: ${synced_count} tâche(s) synchronisée(s)"
}

main() {
    echo "================================"
    if [[ ! -f "$DASHBOARD" ]]; then
        echo "❌ Dashboard non trouvé: $DASHBOARD"
        exit 1
    fi
    sync_dashboard_to_calendar "$DASHBOARD"
    echo "================================"
    echo "Terminé à $(date '+%H:%M')"
}

main "$@"
