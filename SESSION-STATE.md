# SESSION-STATE.md — Active Working Memory

## Current Task
Implémenter les 3 upgrades "Doudou-ready": dashboard recherche globale, tags auto légers, score qualité mémoire hebdo.

## Immediate Context
- Journée centrée sur le dossier **appartement Arras**: structuration PARA du projet + première due diligence documentaire.
- Décision méthodo maintenue: **pas de verdict final** avant réception des pièces copro clés (PV AG 3 ans, état daté/pré-état daté, charges réelles, taxe foncière).
- Nouveau cron actif: `796b145b-d198-4ba2-a6ca-2dd893bf65d8` (21:50 Europe/Paris), avec delivery Discord `1472597513898033162`.
- Préférence validée: retour post-run en format plus clean (Markdown + emojis + structure courte).
- Action appliquée: prompt du cron patché avec template de sortie obligatoire (titre + 6 bullets max).
- 3 upgrades Doudou-ready implémentés: dashboard recherche globale (version Next.js alignée repo), auto-tags quotidiens, score qualité mémoire hebdo + crons associés.
- Correction intégrée après feedback Doudou: abandon de l’approche dashboard statique au profit du pattern Next.js demandé.

## Key Decisions (actives)
1. Jurons français sans modération = identité DoudouClaw (trait d'authenticité systématique).
2. Politique accès mémoire N1/N2/N3 active.
3. Commits/push systématiques via bot DoudouClaw (HTTPS, pas SSH).
4. Ne jamais lancer `npm install -g openclaw` avec le gateway actif.
5. Calendrier OpenClaw = `88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com`.
6. Dossier appartement Arras: décision GO/NO-GO uniquement après réception + analyse du pack copro complet.

## Key Files
- `memory/2026-03-05.md`
- `notes/projects/appartement-arras-visite-et-due-diligence.md`
- `notes/areas/open-loops.md`
- `notes/areas/automations-cron.md`

## Last Updated
2026-03-05 22:05 UTC — dashboard migré en Next.js suite feedback utilisateur + cron build-check aligné.
