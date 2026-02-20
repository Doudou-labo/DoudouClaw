# SESSION-STATE.md — Active Working Memory

## Current Task
Finaliser la traçabilité GitHub de la migration hybride persistante, puis publier un compte rendu d’usage/fonctionnement des agents dans le salon Discord dédié.

## Immediate Context
- Alexandre valide d’aller jusqu’au bout pour “être sûr de tout”.
- La config hybride persistante contient déjà 9 agents, il manque `spec-memory` et `spec-crm` en statique.
- Action: ajouter ces 2 agents dans `~/.openclaw/openclaw.json`, redémarrer le gateway, vérifier `agents_list`.

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
