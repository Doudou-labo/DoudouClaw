# SESSION-STATE.md — Active Working Memory

## Current Task
Corriger le mode d’orchestration utilisateur pour éviter les auto-announces bruyants et fiabiliser la ligne `Agents utilisés` avec la vraie chaîne d’agents invoqués.

## Immediate Context
- Alexandre signale encore un échec UX: bruit interne (`<relevant-memories>`, context blocks) visible dans Discord + footer `Agents utilisés : main` alors que des specs ont tourné.
- Cause racine: usage de `sessions_spawn` pour orchestration utilisateur (auto-announce public) + footer non raccordé à la chaîne réelle.
- Action: basculer la politique vers `sessions_send` pour orchestration interactive, réserver `sessions_spawn` au background, et imposer footer avec chaîne réelle des agents appelés.

## Key Decisions
1. Adopter une architecture avancée avec un orchestrateur + 10 spécialistes.
2. Prévoir un registry versionné des rôles et règles de routage.
3. Prévoir une stratégie de résilience post-restart (ensure on-demand + watchdog optionnel).
4. Afficher systématiquement `Agents utilisés : ...` en bas de chaque réponse utilisateur.
5. Routage global verrouillé: simple→main, moyen mono-domaine→spec direct, complexe→orchestrator.
6. Si `spec-orchestrator` est invoqué, il doit déléguer à au moins un spécialiste `spec-*` (sinon traiter directement en `main`).

## Key Files
- `config/subagents-registry.json`
- `notes/areas/subagents-orchestration.md`
- `memory/2026-02-20.md`

## Open Questions
- Fréquence exacte du watchdog (ex: 10 min, 30 min, 1h).
- Activer un préchauffage proactif sur les channels prioritaires ou uniquement à la demande.

## Last Updated
2026-02-20 UTC
