#!/bin/bash
# gateway-restart-notify.sh
# Redémarre le gateway OpenClaw et envoie une notification Discord une fois de retour.
# Usage: bash scripts/gateway-restart-notify.sh ["Raison optionnelle"]

CHANNEL_ID="1475147402922033192"
SESSION_ID="agent:main:discord:channel:${CHANNEL_ID}"
REASON="${1:-Redémarrage gateway}"

echo "🔄 Redémarrage du gateway OpenClaw..."
openclaw gateway restart

echo "⏳ Attente du retour du gateway..."
for i in $(seq 1 30); do
    sleep 2
    if openclaw gateway status 2>/dev/null | grep -q "RPC probe: ok"; then
        echo "✅ Gateway de retour après ${i}s"
        # Envoyer une notification dans le channel Discord
        openclaw agent \
            --session-id "$SESSION_ID" \
            --message "🔄 Gateway redémarré et opérationnel. Contexte: ${REASON}. Renvoie ton message si une réponse était en attente !" \
            --deliver \
            --channel discord \
            --reply-to "$CHANNEL_ID" \
            2>&1
        echo "📨 Notification envoyée."
        exit 0
    fi
done

echo "⚠️ Gateway restart OK mais notification impossible (timeout 60s)"
exit 1
