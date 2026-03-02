#!/bin/bash
# Discord Model Router - Route automatiquement vers le bon modèle selon le canal
# Usage: source scripts/discord-model-router.sh <channel_id>

CHANNEL_ID="$1"

# Mapping canal → modèle
declare -A CHANNEL_MODELS=(
    # Niveau 1 : Économe (Codex-mini)
    ["1472335330223980609"]="openai-codex/gpt-5.1-codex-mini"  # general
    
    # Niveau 3 : Puissant (Sonnet-4-6)
    ["1474468461274071181"]="anthropic/claude-sonnet-4-6"       # sub-agent
    
    # Niveau 2 : Standard (K2P5) - tous les autres
    ["1478129852585345164"]="kimi-coding/k2p5"                  # model-router
    ["1472597511838367920"]="kimi-coding/k2p5"                  # rappels-routines
    ["1472597512933085299"]="kimi-coding/k2p5"                  # para
    ["1472597513898033162"]="kimi-coding/k2p5"                  # logs-admin
    ["1472597514824843419"]="kimi-coding/k2p5"                  # bourse
    ["1472597958858899596"]="kimi-coding/k2p5"                  # contexte
    ["1472597960222183625"]="kimi-coding/k2p5"                  # crm
    ["1472597961778135211"]="kimi-coding/k2p5"                  # ie
    ["1472597962994483363"]="kimi-coding/k2p5"                  # perso
    ["1472597964076748852"]="kimi-coding/k2p5"                  # travail
    ["1472599386579275848"]="kimi-coding/k2p5"                  # annonces
    ["1472599388328169544"]="kimi-coding/k2p5"                  # todo-serveur
    ["1472599389384998946"]="kimi-coding/k2p5"                  # bugs-ideas
    ["1472599466329641084"]="kimi-coding/k2p5"                  # test-commandes
    ["1472599467487134063"]="kimi-coding/k2p5"                  # test-bot
    ["1472605358492225578"]="kimi-coding/k2p5"                  # guide-serveur
    ["1473417623990698206"]="kimi-coding/k2p5"                  # github
    ["1473419374042939432"]="kimi-coding/k2p5"                  # logs-serveur
    ["1473727983607873711"]="kimi-coding/k2p5"                  # finance
    ["1474131846513168425"]="kimi-coding/k2p5"                  # notion
    ["1474162917694898181"]="kimi-coding/k2p5"                  # memoire
    ["1474477284705702001"]="kimi-coding/k2p5"                  # utilisation-agent
    ["1474478861952618576"]="kimi-coding/k2p5"                  # cas-pratiques
    ["1474762493099511888"]="kimi-coding/k2p5"                  # logs-github
)

# Récupérer le modèle pour ce canal
MODEL="${CHANNEL_MODELS[$CHANNEL_ID]}"

if [ -z "$MODEL" ]; then
    # Canal inconnu → K2P5 par défaut
    MODEL="kimi-coding/k2p5"
fi

echo "📍 Canal: $CHANNEL_ID"
echo "🤖 Modèle: $MODEL"

# Retourner le modèle (pour usage dans d'autres scripts)
export DISCORD_ROUTER_MODEL="$MODEL"
