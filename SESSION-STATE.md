# SESSION-STATE.md — Active Working Memory

## Current Task
Formaliser la règle de miroir mémoire: toute mémoire importante stockée via `memory_store` doit aussi être tracée dans les fichiers mémoire Git du workspace.

## Immediate Context
- Alexandre a demandé où sont stockées les mémoires LanceDB (hors repo Git).
- Vérification faite: base OpenClaw locale trouvée dans `~/.openclaw/memory/lancedb/memories.lance`.
- Décision validée par Alexandre: mettre en place la règle "miroir" pour visibilité GitHub.

## Key Decisions
1. Les entrées `memory_store` restent dans LanceDB (runtime local, non versionné Git).
2. Pour les éléments importants, ajouter un miroir court dans `memory/YYYY-MM-DD.md` (et `MEMORY.md` si c'est durable).
3. Documenter la règle dans les fichiers d'exploitation pour la rendre systématique.

## Key Files
- `memory/2026-02-19.md`
- `AGENTS.md`
- `TOOLS.md`
- `MEMORY.md`

## Open Questions
- Faut-il automatiser le miroir via script dédié (optionnel, pas bloquant).

## Last Updated
2026-02-19 22:05 UTC