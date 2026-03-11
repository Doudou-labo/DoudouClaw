# SESSION-STATE.md — Active Working Memory

## Current Task
Projet pneu-tracker livré et live (2026-03-11). Prochaine session : aucune tâche ouverte sur ce projet.

## Dernier travail réalisé (2026-03-11)
- App pneu-tracker créée et enrichie (v2) : Next.js 15 + SQLite + recharts + xlsx
- URL : https://pneus.doudougen.xyz (auth Basic DoudouClaw, port 3002, systemd)
- Features v1 : formulaire 5 champs, historique, export CSV, recherche
- Features v2 : stats header, onglets, filtres avancés, modification entrée (modal), import CSV, export Excel, vue mobile cartes, toasts, dashboard graphique (3 charts)

## Current Task (précédent)
Ajuster l’UI de `second-brain-nextjs` : les journaux récents doivent afficher les fichiers mémoire journaliers du plus récent au plus ancien, pour voir immédiatement les derniers jours en tête (2026-03-10 22:51 Europe/Paris).

## Immediate Context
- Consolidation N1 exécutée ce soir: `SESSION-STATE.md`, `MEMORY.md`, `memory/2026-03-10.md` relus et alignés.
- Retour utilisateur précédent sur `second-brain-nextjs` traité : écart docs vs extraits partiellement clarifié par l’UI et enrichissement dashboard ajouté.
- Nouveau retour utilisateur : dans les “journaux récents”, l’ordre actuel est perçu comme ancien → récent ; il faut inverser pour afficher les plus récents en premier.
- Préférence de reporting cron confirmée et conservée: résumé Memory+PARA en Markdown + emojis vers Discord `1472597513898033162` (best-effort).
- Continuité mémoire inchangée: `fsxmemory` niveau 2.5 actif + règle miroir (mémoire générale ↔ fsxmemory).
- `RECENT_CONTEXT.md` mis à jour avec highlights du 2026-03-10.
- PARA synchronisé via `notes/areas/open-loops.md` (checkpoint auto du soir + prochaine action claire).
- Aucune nouvelle information durable détectée aujourd’hui nécessitant une entrée LTM supplémentaire.
- Nouvelle préférence UI mémoire : les auto-tags heuristiques doivent afficher les **éléments exacts tagués par catégorie**, pas seulement des compteurs.

## Key Decisions (actives)
1. Jurons français sans modération = identité DoudouClaw (trait d'authenticité systématique).
2. Politique accès mémoire N1/N2/N3 active.
3. Commits/push systématiques via bot DoudouClaw (HTTPS, pas SSH).
4. Ne jamais lancer `npm install -g openclaw` avec le gateway actif.
5. Calendrier OpenClaw = `88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com`.
6. Dossier appartement Arras: décision GO/NO-GO uniquement après réception + analyse du pack copro complet.
7. Projet Venus Beauté validé: stack Next.js + déploiement Caddy sur `venusbeaute.doudougen.xyz` comme base de reprise.
8. Décision mémoire (2026-03-09): installer `fsxmemory` v1.3.1 comme couche checkpoint/recover locale ; garder `mem0` et `Cognee` en évaluation future.
9. Mode d’usage mémoire validé: **fsxmemory niveau 2.5** par défaut (naturel, semi-auto, utile, sans sur-structuration).
10. `qmd` ne doit indexer que la collection `memory` pour le moment (pas `notes`, pas `workspace`).

## Key Files
- `memory/2026-03-10.md`
- `MEMORY.md`
- `notes/areas/open-loops.md`
- `RECENT_CONTEXT.md`

## Last Updated
2026-03-10 21:50 Europe/Paris — consolidation mémoire/PARA exécutée, N1 synchronisé, aucun nouvel item LTM durable.
