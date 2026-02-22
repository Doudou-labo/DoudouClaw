# SESSION-STATE.md — Active Working Memory

## Current Task
Ancrer la politique d’accès mémoire N1/N2/N3 dans AGENTS/TOOLS et valider la compatibilité avec les skills mémoire installés.

## Immediate Context
- Alexandre valide l’ajout de la règle N1/N2/N3.
- Politique ajoutée dans `AGENTS.md` (protocole comportemental) et `TOOLS.md` (opérationnel).
- Vérification conceptuelle: les skills mémoire restent compatibles, la règle ne remplace pas les outils (`memory_store`, `memory_recall`, scripts de recall/capture), elle orchestre leur usage.

## Key Decisions
1. N1 par défaut, N2 au besoin, N3 uniquement sur demande explicite/contradiction.
2. Conserver la compatibilité avec rosepuppy-memory + LanceDB + cron sync LTM 22h.
3. Journaliser l’ancrage de règle dans `memory/2026-02-22.md`.

## Key Files
- `AGENTS.md`
- `TOOLS.md`
- `SESSION-STATE.md`
- `memory/2026-02-22.md`

## Open Questions
- Aucune bloquante.

## Last Updated
2026-02-23 00:05 UTC
