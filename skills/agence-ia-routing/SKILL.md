---
name: agence-ia-routing
description: Route les tâches vers les agents spécialisés de l'Agence-IA. Utilise ce skill SYSTÉMATIQUEMENT dès qu'une demande dépasse ~2 minutes de traitement estimé, ou concerne le code, la sécurité, le DevOps, le contenu, la croissance, l'UI/UX, les données, les API, le marketing, la rédaction technique, les tests, ou tout domaine spécialisé. En cas de doute sur quel agent utiliser, utilise ce skill. Ne jamais traiter seul une tâche technique/créative/analytique substantielle quand un agent Agence-IA spécialisé existe — consulter ce routing d'abord.
---

# Agence-IA Routing Skill

Ce skill t'aide à identifier rapidement le bon agent Agence-IA et à le spawner correctement.

## Règle fondamentale

**Seuil de délégation : ~2 minutes** — si tu estimes que la tâche prendrait plus de 2 minutes à traiter, délégue vers l'Agence-IA via l'orchestrateur.

**Règles non négociables au spawn :**
1. Toujours passer par `agents-orchestrator` comme premier agent spawné (sauf instruction explicite contraire)
2. Toujours appeler `sessions_yield` après `sessions_spawn`
3. Le chemin SOUL.md de l'agent : `~/.openclaw/agency-agents/<agent-name>/SOUL.md`

## Arbre de décision rapide

### 🔧 Développement & Code
| Tâche | Agent |
|-------|-------|
| Architecture backend, API, base de données | `backend-architect` |
| Frontend, React, CSS, composants UI | `frontend-developer` |
| App mobile (iOS/Android/React Native) | `mobile-app-builder` |
| Sécurité, vulnérabilités, audit | `security-engineer` |
| DevOps, CI/CD, Docker, infra | `devops-automator` |
| Prototype rapide d'app/tool | `rapid-prototyper` |
| Revue de code, refactoring senior | `senior-developer` |
| Tests API, validation endpoints | `api-tester` |
| Rédaction technique, docs, README | `technical-writer` |
| Performance, benchmarks | `performance-benchmarker` |
| Terminal, intégrations CLI | `terminal-integration-specialist` |

### 📊 Data & Analytics
| Tâche | Agent |
|-------|-------|
| Pipeline de données, ETL | `data-engineer` |
| Analyse, rapports, dashboards | `analytics-reporter` |
| Extraction données ventes/CRM | `sales-data-extraction-agent` |
| Suivi finance/budget | `finance-tracker` |
| Consolidation multi-sources | `data-consolidation-agent` |

### 🎨 Contenu & Marketing
| Tâche | Agent |
|-------|-------|
| Création de contenu, copywriting | `content-creator` |
| SEO, optimisation search | `seo-specialist` |
| Growth hacking, acquisition | `growth-hacker` |
| Social media stratégie | `social-media-strategist` |
| UX/UI design, wireframes | `ux-architect` ou `ui-designer` |
| Recherche utilisateurs | `ux-researcher` |
| Résumé exécutif, rapports | `executive-summary-generator` |

### 🤖 IA & Agents
| Tâche | Agent |
|-------|-------|
| Ingénierie d'agents IA | `ai-engineer` |
| Modèles, QA ML | `model-qa-specialist` |
| Orchestration complexe multi-agents | `agents-orchestrator` |
| Prompts image, Midjourney | `image-prompt-engineer` |

### 🏗️ Gestion Projet
| Tâche | Agent |
|-------|-------|
| Gestion projet, suivi | `project-shepherd` |
| Sprint planning, priorités | `sprint-prioritizer` |
| Optimisation de workflow | `workflow-optimizer` |
| Support utilisateur, réponses | `support-responder` |

## Procédure de spawn

### 1. Identifier l'agent
Utilise l'arbre ci-dessus. Si la tâche couvre plusieurs domaines → utilise `agents-orchestrator` directement.

### 2. Spawner via sessions_spawn

```python
sessions_spawn(
  task="[Description complète de la tâche avec contexte]",
  attachments=[{"name": "SOUL.md", "content": open("~/.openclaw/agency-agents/<agent>/SOUL.md").read()}],
  mode="run",  # ou "session" si persistant
  runtime="subagent",
  label="[agent-name]-[tâche-courte]"
)
```

### 3. sessions_yield OBLIGATOIRE
Immédiatement après `sessions_spawn`, appeler `sessions_yield` pour céder le tour et attendre le résultat.

### 4. Synthèse
Quand le résultat arrive, synthétiser dans le salon courant en une réponse claire.

## Cas d'usage exemples

**Exemple 1 — Tâche code:**
> "Ajoute une fonctionnalité d'export PDF au pneu-tracker"
→ Estimé >2 min → `backend-architect` + `frontend-developer` → passer par `agents-orchestrator`

**Exemple 2 — Tâche contenu:**
> "Rédige un post LinkedIn pour annoncer Venus Beauté"
→ Estimé ~2 min → `content-creator` directement

**Exemple 3 — Tâche multi-domaines:**
> "Crée une landing page avec analytics intégrée"
→ Multi-domaines → `agents-orchestrator` obligatoire

## Agents disponibles (liste complète)

Location : `~/.openclaw/agency-agents/`

Catégories principales :
- **Dev** : backend-architect, frontend-developer, senior-developer, mobile-app-builder, rapid-prototyper, api-tester, devops-automator, security-engineer, terminal-integration-specialist, technical-writer, performance-benchmarker
- **Data** : data-engineer, analytics-reporter, data-consolidation-agent, finance-tracker, sales-data-extraction-agent
- **Contenu/Marketing** : content-creator, seo-specialist, growth-hacker, social-media-strategist, content-creator, visual-storyteller
- **UX/Design** : ux-architect, ui-designer, ux-researcher, accessibility-auditor
- **IA/Agents** : ai-engineer, model-qa-specialist, agents-orchestrator, image-prompt-engineer
- **Projet** : project-shepherd, sprint-prioritizer, workflow-optimizer, support-responder, executive-summary-generator, feedback-synthesizer
- **Jeu/XR** : game-designer, unity-architect, godot-gameplay-scripter, xr-immersive-developer, level-designer
- **Sécurité/Compliance** : security-engineer, compliance-auditor, legal-compliance-checker, threat-detection-engineer, blockchain-security-auditor

Pour la liste exhaustive : `ls ~/.openclaw/agency-agents/`
