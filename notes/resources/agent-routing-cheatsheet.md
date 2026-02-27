# Agent Routing Cheat Sheet (10 lignes)

1. 1 domaine simple → `main` (ou `spec-*` direct)
2. 2+ domaines / dépendances → `spec-orchestrator`
3. Action sensible (suppression/sécurité/config/envoi externe) → `qa-safety` avant exécution
4. Santé OpenClaw (gateway/crons/429/logs) → `ops-guardian`
5. Git/commit/push/submodule → `repo-keeper`
6. Mémoire (N1/N2/N3, reprise timeout, cohérence LTM) → `memory-curator`
7. Notes PARA/templates/archives → `knowledge-librarian`
8. Si charge provider élevée (429): réduire parallélisme, batch court, séquencer
9. Une seule synthèse finale côté utilisateur (pas de bruit multi-réponses)
10. Footer obligatoire: `Agents utilisés : ...`

## Prompts ultra courts
- `spec-orchestrator`: "Coordonne audit + fix + doc + commit."
- `ops-guardian`: "Check gateway+crons+429, top 3 incidents + plan."
- `repo-keeper`: "Commit/push ce qui est prêt, signale blocages."
- `qa-safety`: "Go/No-Go sécurité avant exécution."
- `memory-curator`: "Audit cohérence N1↔LTM + maj SESSION-STATE."
- `knowledge-librarian`: "Classe en PARA + propose archives candidates."

Dernière mise à jour: 2026-02-27
