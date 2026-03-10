# Agent Routing Guide — Agence-IA

Guide rapide pour router les demandes vers les agents Agence-IA.

---

## Règle simple

- **1 domaine / tâche courte** → `main` ou agent Agence-IA direct
- **2 domaines ou plus / dépendances** → `agents-orchestrator`
- **Projet long** → session persistante dédiée (ex: `backend-venus`)

---

## Tableau de commande

| Agent Agence-IA | Domaine | Quand l'appeler | Exemple de prompt |
|---|---|---|---|
| `backend-architect` | API, microservices, scalabilité | Architecture serveur, base de données | "Conçois l'API REST pour un e-commerce" |
| `frontend-developer` | React/Vue, UI | Interface utilisateur, composants | "Crée une landing page avec React" |
| `security-engineer` | Audit, sécurité | Review code, vulnérabilités | "Audit cette API pour failles OWASP" |
| `devops-automator` | CI/CD, infra, cloud | Pipelines, déploiement, monitoring | "Mets en place un pipeline CI/CD" |
| `growth-hacker` | Acquisition, croissance | Stratégie marketing, viralité | "Plan d'acquisition pour un SaaS" |
| `content-creator` | Contenu, copywriting | Blog, réseaux, newsletters | "Rédige un article de blog SEO" |
| `agents-orchestrator` | Coordination multi-domaines | Tâche complexe, plusieurs experts | "Coordonne backend + frontend + sécurité" |
| `reality-checker` | QA, validation | Vérification avant production | "Cette feature est-elle prod-ready ?" |

---

## Playbooks express

### 1) Feature complète (backend + frontend + sécurité)
1. `agents-orchestrator` (coordination)
2. `backend-architect` (API)
3. `frontend-developer` (UI)
4. `security-engineer` (audit)
5. `reality-checker` (validation finale)
6. Synthèse finale utilisateur

### 2) Projet long (session persistante)
1. `sessions_spawn --label backend-venus --file backend-architect/SOUL.md --mode session`
2. Interactions via `sessions_send --label backend-venus`
3. Kill à la fin du projet: `subagents --action kill --target backend-venus`

### 3) Tâche ponctuelle (one-shot)
1. `sessions_spawn --file [agent]/SOUL.md --mode run`
2. Résultat direct, pas de persistance

---

## Prompts prêts à coller

- **Backend:** `"Conçois l'architecture API pour [projet], avec endpoints REST et modèle de données"`
- **Frontend:** `"Crée les composants React pour [feature], avec design responsive"`
- **Sécurité:** `"Audite ce code pour vulnérabilités et propose des correctifs"`
- **DevOps:** `"Mets en place un pipeline CI/CD avec tests auto et déploiement"`
- **Growth:** `"Propose une stratégie d'acquisition pour [cible] avec canaux et métriques"`
- **Orchestrator:** `"Coordonne [agent1] + [agent2] pour [objectif global]"`

---

## Notes opérationnelles

- Les agents Agence-IA sont dans `~/.openclaw/agency-agents/` (112 agents)
- Spawn avec `--file ~/.openclaw/agency-agents/[agent]/SOUL.md`
- Sessions persistantes: `--mode session --label [nom] --thread true`
- Tâches ponctuelles: `--mode run`
- Synthèse unique obligatoire côté utilisateur

---
Dernière mise à jour: 2026-03-10
