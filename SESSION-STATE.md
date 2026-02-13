# SESSION-STATE.md — Active Working Memory

This file is the agent's "RAM" — the hot transaction log for the current active task.
Chat history is a BUFFER. This file is STORAGE.

**Read this FIRST at every session start.**
**Update it whenever the active task changes.**

---

## Current Task
Fiabiliser les points de séance bourse avec une stack **API-first gratuite** (anti-bot), puis brancher tous les crons bourse dessus.

## Immediate Context
- Alexandre a signalé des erreurs d’accès sources (anti-bot, JS, 401) + timeouts récurrents en cron.
- Objectif validé: option B sans coût initial (0€), plus robuste que le scraping de pages web.
- Les 6 crons bourse doivent continuer d’envoyer dans le topic Telegram `-1003791371950:3`.

## Key Decisions
- Nouveau script local: `scripts/market_brief.py` (sources API/flux légers: Stooq CSV + Yahoo Finance API + RSS).
- Tous les crons bourse EU/US (ouverture, mi-séance, clôture) appellent désormais ce script.
- Timeout réduit à 120s et fallback explicite `non disponible` quand une donnée échoue.
- Demande utilisateur ajoutée: enrichir le commentaire analytique (biais, leadership, volatilité, plan de séance).

## Key Files
- `scripts/market_brief.py`
- `SESSION-STATE.md`

## Open Questions
- Ajouter ensuite une API news/quotes dédiée (clé optionnelle) pour encore plus de stabilité/latence.

## Last Updated
2026-02-13 19:22 UTC
