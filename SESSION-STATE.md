# SESSION-STATE.md — Active Working Memory

## Current Task
Documentation et stabilisation du nouveau workflow mémoire `fsxmemory` + `qmd` (2026-03-09 21:41 UTC).

## Immediate Context
- `fsxmemory` installé comme couche mémoire fichier-first pour checkpoint/recover/handoff/search.
- `qmd` installé pour la recherche sémantique locale ; collection active limitée à `memory` uniquement.
- État qmd validé : **43 fichiers** mémoire, **1918 embeddings/chunks**.
- Script `scripts/fsxmemory-vsearch.sh` créé et testé avec succès (exit code 0).
- Préférence utilisateur validée : fonctionnement **naturel + automatisé** du skill mémoire, en mode **niveau 2.5**.
- Niveau 2.5 = auto normal renforcé : capture + remember + checkpoint/handoff quand pertinent, sans sur-structurer comme un bourrin.
- Règle miroir totale validée : tout point conservé dans la mémoire générale doit aussi être ancré dans `fsxmemory`.
- Décision du 2026-03-09 confirmée : **ne pas installer mem0 ni Cognee maintenant** ; les garder pour plus tard et tester d’abord la puissance réelle de `fsxmemory`.
- Références à garder : `mem0` = https://github.com/mem0ai/mem0 ; `Cognee` = https://github.com/topoteretes/cognee
- Reporting cron Memory+PARA → Discord `1472597513898033162` (Markdown + emojis, best-effort).

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
- `memory/2026-03-08.md`
- `notes/projects/venus-beaute-ecommerce.md`
- `notes/areas/open-loops.md`
- `RECENT_CONTEXT.md`

## Last Updated
2026-03-09 21:41 UTC — fsxmemory + qmd stabilisés, script vsearch testé, mode mémoire niveau 2.5 validé.
