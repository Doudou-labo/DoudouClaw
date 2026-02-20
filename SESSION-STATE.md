# SESSION-STATE.md — Active Working Memory

## Current Task
Appliquer globalement la transparence d’orchestration: afficher `Agents utilisés : ...` dans chaque réponse, tous salons/sessions confondus.

## Immediate Context
- Alexandre confirme qu’il veut voir la ligne `Agents utilisés : ...` à chaque réponse.
- Cette préférence doit être persistante et appliquée globalement (pas seulement ce channel).
- Implémentation via règles workspace (AGENTS/TOOLS + mémoire durable).

## Key Decisions
1. Adopter une architecture avancée avec un orchestrateur + 10 spécialistes.
2. Prévoir un registry versionné des rôles et règles de routage.
3. Prévoir une stratégie de résilience post-restart (ensure on-demand + watchdog optionnel).
4. Afficher systématiquement `Agents utilisés : ...` en bas de chaque réponse utilisateur.

## Key Files
- `config/subagents-registry.json`
- `notes/areas/subagents-orchestration.md`
- `memory/2026-02-20.md`

## Open Questions
- Fréquence exacte du watchdog (ex: 10 min, 30 min, 1h).
- Activer un préchauffage proactif sur les channels prioritaires ou uniquement à la demande.

## Last Updated
2026-02-20 UTC
