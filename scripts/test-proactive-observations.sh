#!/bin/bash
# Test script pour Proactive Observations

set -euo pipefail

WORKSPACE="/root/.openclaw/workspace"
cd "$WORKSPACE"

# Définir les fonctions de test (copie depuis cron-proactive-observations.sh)
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S UTC') - $1"
}

detect_project_patterns() {
    local hours_back="$1"
    local patterns=""

    local pilotage_count=0
    local pneu_tracker_count=0
    local venus_count=0
    local inventaire_count=0

    # Scanner tous les fichiers mémoire récents
    for file in $(find "$WORKSPACE/memory" -name "2026-03-*.md" -mtime -1 2>/dev/null); do
        local count=$(grep -i "pilotage" "$file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$count" ] && count=0
        pilotage_count=$((pilotage_count + count))

        count=$(grep -i "pneu.*tracker" "$file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$count" ] && count=0
        pneu_tracker_count=$((pneu_tracker_count + count))

        count=$(grep -i "venus" "$file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$count" ] && count=0
        venus_count=$((venus_count + count))

        count=$(grep -i "inventaire" "$file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$count" ] && count=0
        inventaire_count=$((inventaire_count + count))
    done

    local dominant=""
    local max_count=0

    [ "$pilotage_count" -gt "$max_count" ] && { max_count=$pilotage_count; dominant="pilotage"; }
    [ "$pneu_tracker_count" -gt "$max_count" ] && { max_count=$pneu_tracker_count; dominant="pneu-tracker"; }
    [ "$venus_count" -gt "$max_count" ] && { max_count=$venus_count; dominant="venus-beauté"; }
    [ "$inventaire_count" -gt "$max_count" ] && { max_count=$inventaire_count; dominant="inventaire"; }

    if [ "$max_count" -gt 0 ]; then
        patterns="${patterns}🎯 **Projet dominant** : ${dominant} (mentionné ${max_count}x)\n"
    fi

    local abandoned=""
    [ "$pilotage_count" -eq 0 ] && [ "$pneu_tracker_count" -eq 0 ] && abandoned="pas d'activité projets"
    [ "$venus_count" -eq 0 ] && [ "$max_count" -gt 5 ] && abandoned="${abandoned}, venus-beauté en pause"
    [ "$inventaire_count" -eq 0 ] && [ "$max_count" -gt 5 ] && abandoned="${abandoned}, inventaire en pause"

    if [ -n "$abandoned" ]; then
        patterns="${patterns}📉 **Projets en pause** : ${abandoned}\n"
    fi

    echo -e "$patterns"
}

detect_motivation_patterns() {
    local hours_back="$1"
    local patterns=""

    local sessions=$(sessions_list --activeMinutes "${hours_back}" --messageLimit 20 2>/dev/null || echo "")

    if [ -n "$sessions" ]; then
        local fatigue_count=$(echo "$sessions" | grep -iE "claqué|fatigué|crevé|épuisé" | wc -l | tr -d ' ' || true)
        [ -z "$fatigue_count" ] && fatigue_count=0
        if [ "$fatigue_count" -ge 2 ]; then
            patterns="${patterns}😴 **Signal** : Fatigue détectée (${fatigue_count} mentions)\n"
        fi

        local stress_count=$(echo "$sessions" | grep -iE "stress|angoisse|préoccupation|inquiet" | wc -l | tr -d ' ' || true)
        [ -z "$stress_count" ] && stress_count=0
        if [ "$stress_count" -ge 2 ]; then
            patterns="${patterns}😰 **Signal** : Stress détecté (${stress_count} mentions)\n"
        fi

        local motivation_count=$(echo "$sessions" | grep -iE "super|génial|ouais|parfait|nickel" | wc -l | tr -d ' ' || true)
        [ -z "$motivation_count" ] && motivation_count=0
        if [ "$motivation_count" -ge 3 ]; then
            patterns="${patterns}🔥 **Signal** : Motivation haute (${motivation_count} signaux positifs)\n"
        fi
    fi

    echo -e "$patterns"
}

detect_surprise_opportunities() {
    local hours_back="$1"
    local opportunities=""

    local pilotage_count=0
    local pneu_tracker_count=0

    # Scanner tous les fichiers mémoire récents
    for file in $(find "$WORKSPACE/memory" -name "2026-03-*.md" -mtime -1 2>/dev/null); do
        local count=$(grep -i "pilotage" "$file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$count" ] && count=0
        pilotage_count=$((pilotage_count + count))

        count=$(grep -i "pneu.*tracker" "$file" 2>/dev/null | wc -l | tr -d ' ' || true)
        [ -z "$count" ] && count=0
        pneu_tracker_count=$((pneu_tracker_count + count))
    done

    if [ "$pilotage_count" -gt 8 ]; then
        opportunities="${opportunities}💡 **Surprise possible** : Le pilotage est mentionné ${pilotage_count}x. Tu veux que je lance un agent pour avancer plus vite ?\n"
    fi

    if [ "$pneu_tracker_count" -gt 8 ]; then
        opportunities="${opportunities}💡 **Surprise possible** : Le pneu-tracker est mentionné ${pneu_tracker_count}x. Tu veux que je lance un agent spécialisé debugging ?\n"
    fi

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

echo "=== Test Proactive Observations ==="
echo ""

echo "--- Détecter les patterns de projets ---"
detect_project_patterns 24
echo ""

echo "--- Détecter les patterns de motivation ---"
detect_motivation_patterns 24
echo ""

echo "--- Détecter les opportunités de surprise ---"
detect_surprise_opportunities 24
echo ""
