# SESSION-STATE.md — Active Working Memory

## Current Task
Verrouiller globalement les règles multi-agents (routage main/spec/orchestrator + transparence) dans les fichiers persistants et fournir un compte rendu complet de la mise en place.

## Immediate Context
- Alexandre veut que toutes les règles définies depuis le début de la création des sous-agents soient respectées dans n’importe quelle session.
- Il demande un verrouillage documentaire + push GitHub + compte rendu global.
- Le routage attendu est explicite: simple=main, moyen/technique mono-domaine=spec direct, complexe multi-domaines=orchestrator.

## Key Decisions
1. Adopter une architecture avancée avec un orchestrateur + 10 spécialistes.
2. Prévoir un registry versionné des rôles et règles de routage.
3. Prévoir une stratégie de résilience post-restart (ensure on-demand + watchdog optionnel).
4. Afficher systématiquement `Agents utilisés : ...` en bas de chaque réponse utilisateur.
5. Routage global verrouillé: simple→main, moyen mono-domaine→spec direct, complexe→orchestrator.

## Key Files
- `config/subagents-registry.json`
- `notes/areas/subagents-orchestration.md`
- `memory/2026-02-20.md`

## Open Questions
- Fréquence exacte du watchdog (ex: 10 min, 30 min, 1h).
- Activer un préchauffage proactif sur les channels prioritaires ou uniquement à la demande.

## Last Updated
2026-02-20 UTC
