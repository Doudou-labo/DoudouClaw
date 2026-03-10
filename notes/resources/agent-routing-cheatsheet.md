# Agent Routing Cheat Sheet — Agence-IA (10 lignes)

1. 1 domaine simple → `main` (ou agent Agence-IA direct)
2. 2+ domaines / dépendances → `agents-orchestrator`
3. Backend/API/bdd → `backend-architect`
4. Frontend/UI/React → `frontend-developer`
5. Sécurité/audit → `security-engineer`
6. CI/CD/DevOps → `devops-automator`
7. Marketing/croissance → `growth-hacker` ou `content-creator`
8. QA/validation → `reality-checker`
9. Projet long → session persistante `--mode session --label [agent]-[projet]`
10. Footer obligatoire: `Agents utilisés : ...`

## Prompts ultra courts
- `backend-architect`: "Architecture API REST + modèle de données."
- `frontend-developer`: "Composants React + design responsive."
- `security-engineer`: "Audit failles OWASP + correctifs."
- `devops-automator`: "Pipeline CI/CD + tests auto."
- `growth-hacker`: "Stratégie acquisition + canaux + métriques."
- `content-creator`: "Article blog SEO + réseaux sociaux."
- `agents-orchestrator`: "Coordonne [agent1] + [agent2] pour [objectif]."
- `reality-checker`: "Cette feature est-elle prod-ready ?"

## Commandes clés
```bash
# One-shot
sessions_spawn --file ~/.openclaw/agency-agents/[agent]/SOUL.md --mode run

# Session persistante
sessions_spawn --label backend-venus --file ~/.openclaw/agency-agents/backend-architect/SOUL.md --mode session --thread true

# Interagir avec session
sessions_send --label backend-venus --message "Conçois l'endpoint /api/products"

# Lister sessions
sessions_list --kinds session

# Kill session
subagents --action kill --target backend-venus
```

Dernière mise à jour: 2026-03-10
