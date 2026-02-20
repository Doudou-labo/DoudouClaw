# SESSION-STATE.md — Active Working Memory

## Current Task
Mettre en place une architecture multi-agents spécialisée (orchestrateur + rôles dédiés) utilisable dans les channels Discord, avec stratégie d’auto-recréation après restart.

## Immediate Context
- Alexandre valide l’approche “orchestrateur qui appelle les agents nécessaires”.
- Il veut des rôles complets selon ses usages habituels (pas juste 4 rôles basiques).
- Contrainte OpenClaw: sessions sub-agents non globales par défaut; pattern recommandé = pool spécialisé par channel + ensure/recreate automatique.

## Key Decisions
1. Adopter une architecture avancée avec un orchestrateur + 10 spécialistes.
2. Prévoir un registry versionné des rôles et règles de routage.
3. Prévoir une stratégie de résilience post-restart (ensure on-demand + watchdog optionnel).

## Key Files
- `config/subagents-registry.json`
- `notes/areas/subagents-orchestration.md`
- `memory/2026-02-20.md`

## Open Questions
- Fréquence exacte du watchdog (ex: 10 min, 30 min, 1h).
- Activer un préchauffage proactif sur les channels prioritaires ou uniquement à la demande.

## Last Updated
2026-02-20 UTC
