# SESSION-STATE.md — Active Working Memory

## Current Task
Synchronisation finale de la mémoire après la session de debug modèle + migration GitHub organisation.

## Immediate Context
- L'utilisateur (Alexandre) a validé la nouvelle cible GitHub: `Doudou-labo/DoudouClaw`.
- Le project org est actif: `https://github.com/orgs/Doudou-labo/projects/1`.
- Les issues utiles ont été migrées/recopiées et liées au project.
- Côté modèles, la sélection Sonnet est stabilisée après retrait des fallbacks `google-antigravity/*` (403).

## Key Decisions
1. Tout ce qui touche GitHub passe désormais par `Doudou-labo/DoudouClaw`.
2. Identité de commit/push conservée: bot `DoudouClaw`.
3. En cas de doute modèle: se fier à `/status` + logs runtime plutôt qu'au seul menu `/models`.

## Key Files
- `memory/2026-02-16.md`
- `MEMORY.md`
- `RECENT_CONTEXT.md`
- `TOOLS.md`

## Open Questions
- Aucune bloquante.

## Last Updated
2026-02-16 23:10 UTC