# SESSION-STATE.md — Active Working Memory

This file is the agent's "RAM" — the hot transaction log for the current active task.
Chat history is a BUFFER. This file is STORAGE.

**Read this FIRST at every session start.**
**Update it whenever the active task changes.**

---

## Current Task
Déployer proprement le skill **proactive-agent** (mode safe: backup + merge) sans casser la config personnalisée existante.

## Immediate Context
- L’utilisateur (.Hadoux / Alexandre) a validé explicitement: **"On lance ton plan"** (2026-02-13 19:32 UTC).
- Le skill est déjà installé dans `skills/proactive-agent/` (v3.1.0).
- Les fichiers cœur (`AGENTS.md`, `SOUL.md`, `USER.md`, `MEMORY.md`, `HEARTBEAT.md`, `TOOLS.md`) existent déjà et sont personnalisés.
- Fichiers manquants détectés côté proactive stack: `memory/working-buffer.md`, `notes/areas/proactive-tracker.md`, `notes/areas/recurring-patterns.md`, `notes/areas/outcome-journal.md`.

## Key Decisions
- Exécution en **mode safe**: backup horodaté avant changements.
- Pas d’écrasement brut des fichiers d’identité/préférences.
- Initialisation des fichiers manquants de la stack proactive.

## Key Files
- `backups/proactive-agent-20260213-193228/`
- `memory/working-buffer.md`
- `notes/areas/proactive-tracker.md`
- `notes/areas/recurring-patterns.md`
- `notes/areas/outcome-journal.md`

## Open Questions
- Aucune bloquante sur la mise en place proactive de base.

## New Decisions (2026-02-13 19:35 UTC)
- Alexandre a confirmé: **"Va s’y également"** → activation immédiate des 2 crons proactifs hebdo.
- Cron ajouté: `Proactive - Reverse prompting hebdo` (mercredi 19:10 Europe/Paris) → topic Telegram `-1003791371950:topic:32`.
- Cron ajouté: `Proactive - Revue outcomes hebdo (>7j)` (dimanche 18:00 Europe/Paris) → topic Telegram `-1003791371950:topic:32`.

## Latest Actions (2026-02-13 19:51 UTC)
- Correctif LanceDB appliqué et validé via `memory_store` + `memory_recall`.
- Demande utilisateur: push GitHub + ajout doc repo sans suppression.
- Documentation ajoutée/complétée: `README.md`, `TOOLS.md`, `.gitignore`, `memory/2026-02-13.md`.

## New Input (2026-02-13 20:01 UTC)
- Exigence utilisateur explicite: **toute modification/ajout de fichiers faite par l’agent doit être reflétée sur le repo GitHub**.
- Exigence utilisateur explicite: **utiliser le repo comme source de vérité pour récupérer les infos/contexte** quand nécessaire.

## Operational Rule (active)
- Après chaque changement fichier: `git status` → commit ciblé → `git push` → confirmation à l’utilisateur.
- Éviter toute divergence locale non expliquée.
- Recherche d’info: prioriser local (workspace + memory/skills), puis **fallback GitHub** en cas de doute / info manquante / possible modif distante par Alexandre.

## New Input (2026-02-13 20:05 UTC)
- Clarification utilisateur: utiliser d’abord le local (notamment memory skills), mais vérifier GitHub si doute ou info introuvable car des changements peuvent être faits directement côté GitHub.

## Last Updated
2026-02-13 20:05 UTC
