#!/bin/bash
# tdah-reminder-check.sh - Vérifie les tâches à échéance et envoie les rappels
# À exécuter via cron toutes les heures

set -e

DASHBOARD="notes/areas/tdah-matrix-dashboard.md"
CONFIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$CONFIG_DIR/../config/timezone.conf" 2>/dev/null || export TZ=Europe/Paris

# Date actuelle
CURRENT_DATE=$(date +%Y-%m-%d)
CURRENT_HOUR=$(date +%H)
CURRENT_TIME=$(date +%H:%M)

echo "🔍 Scan des rappels Inbox Zero - $CURRENT_DATE $CURRENT_TIME"

# Fonction pour parser le dashboard et trouver les tâches à rappeler
parse_dashboard() {
    local file="$1"
    local reminders=()
    
    # Lire le fichier et extraire les tâches non cochées avec dates
    # Format attendu: - [ ] **Action** (Ajouté YYYY-MM-DD)
    #                   - 📅 Quand : [date/heure]
    
    awk '
        BEGIN { in_item = 0; item_text = ""; when = ""; case_type = ""; }
        /^- \[ \] \*\*/ { 
            in_item = 1; 
            item_text = $0; 
            gsub(/\*\*/, "", item_text);
            next; 
        }
        in_item && /^  - 📅 Quand :/ { 
            when = $0; 
            gsub(/  - 📅 Quand : /, "", when);
            next; 
        }
        in_item && /^  - 🎯 Case :/ {
            case_type = $0;
            gsub(/  - 🎯 Case : /, "", case_type);
            print item_text "|" when "|" case_type;
            in_item = 0;
            item_text = "";
            when = "";
            case_type = "";
        }
        in_item && /^## / { in_item = 0; }
    ' "$file" 2>/dev/null || true
}

# Fonction pour déterminer si une tâche doit être rappelée maintenant
should_remind() {
    local when="$1"
    local current_date="$2"
    local current_hour="$3"
    
    # Patterns supportés:
    # "Demain matin" → rappel à 8h le lendemain
    # "Avant 18h" → rappel à 17h le jour même
    # "Cette semaine" → rappel mercredi
    # "2026-03-18" → rappel à 9h ce jour-là
    
    case "$when" in
        "Demain matin"*)
            # Rappel à 8h le lendemain
            if [[ "$current_hour" == "08" ]]; then
                return 0
            fi
            ;;
        "Avant"*)
            # Extrait l'heure (ex: "Avant 18h" → 17)
            local target_hour=$(echo "$when" | grep -oP '\d+' | head -1)
            if [[ -n "$target_hour" && "$current_hour" -eq $((target_hour - 1)) ]]; then
                return 0
            fi
            ;;
        "Ce soir"*)
            if [[ "$current_hour" == "18" ]]; then
                return 0
            fi
            ;;
        "Cette semaine")
            # Rappel mercredi à 9h
            local day_of_week=$(date +%u)
            if [[ "$day_of_week" == "3" && "$current_hour" == "09" ]]; then
                return 0
            fi
            ;;
        [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*)
            # Date ISO: rappel à 9h ce jour-là
            local task_date=$(echo "$when" | cut -d' ' -f1)
            if [[ "$task_date" == "$current_date" && "$current_hour" == "09" ]]; then
                return 0
            fi
            ;;
    esac
    
    return 1
}

# Fonction pour envoyer le rappel
send_reminder() {
    local action="$1"
    local when="$2"
    local case_type="$3"
    local emoji=""
    
    # Emoji selon la case
    case "$case_type" in
        *Quick*Win*) emoji="🔴" ;;
        *Gros*Morceau*) emoji="🏗️" ;;
        *Remplissage*) emoji="🟡" ;;
        *Planifié*) emoji="📅" ;;
        *) emoji="⏰" ;;
    esac
    
    local message="${emoji} RAPPEL INBOX ZERO

🎯 ${action}
⏱️ C'est prévu : ${when}

Statut : Fait / En cours / Bloqué ?"

    # Envoyer sur Discord (topic routines)
    # Utilise le webhook Discord ou l'API OpenClaw
    echo "$message"
    
    # TODO: Intégrer avec l'API Discord de DoudouClaw
    # openclaw message send --channel discord --target ...
}

# Main
main() {
    if [[ ! -f "$DASHBOARD" ]]; then
        echo "❌ Dashboard non trouvé: $DASHBOARD"
        exit 1
    fi
    
    local found=0
    
    while IFS='|' read -r action when case_type; do
        [[ -z "$action" ]] && continue
        
        # Nettoyer
        action=$(echo "$action" | sed 's/- \[ \] //' | xargs)
        when=$(echo "$when" | xargs)
        case_type=$(echo "$case_type" | xargs)
        
        if should_remind "$when" "$CURRENT_DATE" "$CURRENT_HOUR"; then
            send_reminder "$action" "$when" "$case_type"
            found=1
        fi
    done < <(parse_dashboard "$DASHBOARD")
    
    if [[ $found -eq 0 ]]; then
        echo "✅ Aucun rappel pour $CURRENT_DATE $CURRENT_TIME"
    fi
}

main "$@"
