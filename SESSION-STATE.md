# SESSION-STATE.md — Active Working Memory

## Current Task
Nettoyage/synchronisation mémoire LanceDB et mise en place d’un cron quotidien de sync LTM à 22h.

## Immediate Context
- Alexandre a demandé un alignement entre `MEMORY.md` et la mémoire vectorielle LanceDB.
- Nettoyage LTM réalisé: suppression des entrées de test + suppression de la formulation obsolète `DoudouBot`.
- Réinjection d’une entrée canonique avec `DoudouClaw`.
- Cron créé: `Memory Sync LTM 22h` (Europe/Paris, session isolée, sans delivery) pour synchronisation quotidienne.

## Key Decisions
1. Considérer `MEMORY.md` + `memory/YYYY-MM-DD.md` comme source de vérité humaine.
2. Maintenir LanceDB alignée quotidiennement via cron (ajouts manquants + correction formulations obsolètes).
3. Éviter l’accumulation d’entrées de test dans LTM.

## Key Files
- `SESSION-STATE.md`
- `memory/2026-02-22.md`

## Open Questions
- Aucune bloquante.

## Last Updated
2026-02-22 22:18 UTC
