# LEARNINGS

## 2026-02-15 17:20 UTC
- Findings: pas de correction explicite détectée

## [LRN-20260215-001] best_practice
**Logged**: 2026-02-15T17:40:00Z
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
L’usage des questions financières doit systématiquement passer par le skill `finance-tracker` et être formalisé.

### Details
Après que l’utilisateur ait souligné le besoin d’un usage systématique du skill `finance-tracker` pour les sujets d’argent, j’ai documenté une procédure et commitée dans `notes/areas/finance-tracker-procedure.md`.
Cette règle mérite d’être visible et non oubliée pour les prochains échanges.

### Suggested Action
Maintenir la procédure à jour, éventuellement la copier dans la PARA ou la tracker des règles, et vérifier que chaque conversation financière déclenche au moins une commande `finance-tracker`.

### Metadata
- Source: conversation
- Related Files: notes/areas/finance-tracker-procedure.md
- Tags: finance-tracker, process

## 2026-02-22 17:20 UTC
- Findings: corrections utilisateur détectées
- Sources:
  - memory/2026-02-22.md:12:- Objectif du cron: aligner LTM avec `MEMORY.md` + mémoire du jour (points importants), corriger formulations obsolètes, tracer le bilan quotidien dans `memory/YYYY-MM-DD.md`.
  - memory/2026-02-22.md:14:## 22:22 UTC — Correction immédiate sync LTM (retour utilisateur)
  - memory/2026-02-22.md:21:- Règle appliquée: en cas d’écart détecté, correction immédiate + traçabilité Git (sans attendre le cron).
- Action: promouvoir les patterns stables dans AGENTS.md/MEMORY.md

## [LRN-20260228-001] correction
**Logged**: 2026-02-28T22:23:00Z
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
Dérive mémoire détectée: des échanges films/séries discutés avec l’utilisateur n’étaient pas retrouvés en recall.

### Details
L’utilisateur a corrigé explicitement un manque de mémoire sur un sujet déjà discuté (Marty Supreme, B.R.I S2, Control Z). La cause principale est l’absence de capture systématique minimale en journal quotidien au moment de l’échange.

### Suggested Action
Appliquer strictement la règle opérationnelle suivante:
1. Après chaque échange substantiel: écrire au minimum 1 entrée dans `memory/YYYY-MM-DD.md`.
2. Si l’info est durable: promotion immédiate vers N2/N1 selon criticité.
3. Si préférence/fait clé: `memory_store` le même tour.
4. Vérifier en fin de tour: "journal + couche durable + LTM" cochés.

### Metadata
- Source: user_feedback
- Related Files: memory/2026-02-28.md, notes/areas/contexte-personnel-reference.md, SESSION-STATE.md
- Tags: memory, correction, n1-n2, recall, protocol

---
