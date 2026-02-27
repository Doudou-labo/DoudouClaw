#!/bin/bash
# deploy-agent-bots.sh - Déployer les 6 bots agents Discord
# Usage: bash scripts/deploy-agent-bots.sh

set -e
CONFIG=~/.openclaw/openclaw.json

echo "🤖 Déploiement des 6 bots agents Discord"
echo ""

AGENTS=("spec-orchestrator" "memory-curator" "ops-guardian" "repo-keeper" "qa-safety" "knowledge-librarian")

for agent_id in "${AGENTS[@]}"; do
    echo "Agent: $agent_id"
    read -rp "Token Discord (laisser vide pour ignorer): " token
    if [ -z "$token" ]; then
        echo "  ⏭️  Ignoré"
        continue
    fi
    python3 - "$agent_id" "$token" "$CONFIG" << 'PYEOF'
import json, sys
agent_id, token, config = sys.argv[1], sys.argv[2], sys.argv[3]
with open(config) as f:
    d = json.load(f)
d['channels']['discord']['accounts'][agent_id]['token'] = token
with open(config, 'w') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)
print(f"  ✅ Token {agent_id} mis à jour")
PYEOF
    echo ""
done

echo "🔄 Restart gateway..."
openclaw gateway restart
echo ""
echo "✅ Terminé ! Vérifier avec: openclaw agents list --bindings"
