#!/bin/bash
# Hook pour Proactive Observations - Appelé par cron OpenClaw
# Usage: bash scripts/hook-proactive-observations.sh

set -euo pipefail

WORKSPACE="/root/.openclaw/workspace"
cd "$WORKSPACE"

# Exécuter le script principal d'observations
bash scripts/cron-proactive-observations.sh

# Renvoyer le résultat vers Discord si un rapport a été généré
REPORT_FILE="$WORKSPACE/tmp/cron-proactive-report.txt"
if [ -f "$REPORT_FILE" ]; then
    # Envoyer le rapport sur Discord
    DISCORD_CHANNEL="1472597513898033162"  # 🧠-mémoire

    # Lire le rapport et l'envoyer
    REPORT_CONTENT=$(cat "$REPORT_FILE")

    # Utiliser l'outil message pour envoyer sur Discord
    # Note: cela nécessite que le hook soit exécuté dans un contexte où message est disponible
    if command -v message &> /dev/null; then
        echo "$REPORT_CONTENT" | message action=send to="$DISCORD_CHANNEL"
    else
        # Fallback: écrire dans un fichier pour traitement manuel
        echo "$REPORT_CONTENT" > "$WORKSPACE/tmp/discord-report-pending.txt"
    fi

    # Nettoyer le fichier temporaire
    rm -f "$REPORT_FILE"
fi

exit 0
