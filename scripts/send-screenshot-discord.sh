#!/bin/bash
# send-screenshot-discord.sh - Helper pour envoyer un screenshot sur Discord
# Usage: ./scripts/send-screenshot-discord.sh <chemin_image> [caption]

set -e

IMAGE_PATH="$1"
CAPTION="${2:-Screenshot}"

if [ -z "$IMAGE_PATH" ]; then
    echo "Usage: $0 <chemin_image> [caption]"
    echo "Exemple: $0 ./screenshot.png 'Page d\\'accueil'"
    exit 1
fi

if [ ! -f "$IMAGE_PATH" ]; then
    echo "Erreur: fichier non trouvé: $IMAGE_PATH"
    exit 1
fi

# Vérifier que c'est un chemin relatif
if [[ "$IMAGE_PATH" == /* ]] || [[ "$IMAGE_PATH" == ~* ]]; then
    echo "Erreur: utiliser un chemin relatif (./image.png), pas absolu ou ~"
    exit 1
fi

echo "Screenshot prêt à être envoyé: $IMAGE_PATH"
echo "Caption: $CAPTION"
echo ""
echo "Méthode recommandée: utiliser le tool 'read' sur l'image"
echo "Ou syntaxe: MEDIA:$IMAGE_PATH"
