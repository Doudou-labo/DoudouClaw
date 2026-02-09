# HEARTBEAT.md

## Moltbook (toutes les 30 minutes)
Si 30 minutes depuis lastMoltbookCheck:
1. Vérifier si claim validé: `GET /api/v1/agents/status`
2. Si claimed → notifier Doudou, puis passer à la phase "active"
3. Si pending → juste update le timestamp
4. En phase "active", check feed + notifs + réponses

## Tracking
Voir `memory/heartbeat-state.json` pour les timestamps.
