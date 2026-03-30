# SESSION-STATE.md — Active Working Memory

## Current Task
Mise à jour de la mémoire journalière du 29/03/2026 à partir de l’activité du jour.

## Today's Work Summary (2026-03-29)
- **17:58 UTC** — Demande reçue : mettre à jour la mémoire journalière avec tout ce qui a été fait aujourd’hui.
- `memory/2026-03-29.md` créé et renseigné avec la consolidation provisoire.
- Aucune autre activité substantielle n’a été détectée dans cette conversation à ce stade.

## Prochains chantiers
1. **Correction dashboard pilotage** : corriger année `2025→2026`, sélecteur mois `AGENCE`, retirer `Objectif N` de l'historique → issue #23
2. **Préparation visite Marc (DR)** — 31/03/2026
3. **Actual Budget** — onboarding catégories à finaliser
4. **Pneu Tracker** — backlog: fiche pneu sélectionnable, stats dashboard, bouton réimport catalogue

## Immediate Context
- Journée calme sur le contexte disponible
- Disque stable
- Visite Marc DR toujours proche
- Mode cinéma activé pour les échanges sur séries/films
- **For All Mankind** en cours : Alexandre a commencé l’épisode 7 de la saison 1, sans spoil
- **Préférence canonique ciné/séries** : utiliser systématiquement `web_search` + Perplexity pour répondre dès qu’on parle de films ou de séries
- **Correction proactive (2026-03-30)** : ne pas répéter toujours les mêmes observations/conseils dans le salon proactive. Objectif attendu = vraie surprise utile + variété + prise d’initiative concrète.
- **Décision proactive (2026-03-30)** : adopter l’Option A pour les observations proactives = cron OpenClaw en `isolated/agentTurn` avec excellent prompt, sans dépendre du script heuristique actuel.
- **Correction prompt proactive (2026-03-30)** : les références aux mémoires journalières doivent être dynamiques et couvrir **3 jours glissants** (`aujourd’hui` + `hier` + `avant-hier`), jamais figées sur des dates en dur.

## Last Updated
2026-03-30 19:02 UTC — Correction proactive ajoutée
