# Agent Orchestration — Agence-IA

## Objectif
Orchestration des agents **Agence-IA** uniquement. Architecture complète basée sur les 112 agents spécialisés.

---

## 1) Architecture

### Rôle du conducteur
- **`main`** = point d'entrée unique, routing initial

### Orchestrateur central
- **`agents-orchestrator`** — coordination multi-domaines, dispatch vers spécialistes

### Spécialistes métiers (Agence-IA)

**Engineering:**
| Agent | Rôle | Quand l'utiliser |
|-------|------|------------------|
| `backend-architect` | API, microservices, scalabilité | Architecture serveur, base de données |
| `frontend-developer` | React/Vue, UI pixel-perfect | Interface utilisateur, composants |
| `security-engineer` | Audit, threat modeling | Review sécurité, vulnérabilités |
| `devops-automator` | CI/CD, infra, monitoring | Pipelines, déploiement, cloud |
| `ai-engineer` | ML, pipelines de données | Intégration IA, modèles |
| `api-tester` | Tests API, validation | Validation endpoints, contrats |

**Design & Product:**
| Agent | Rôle | Quand l'utiliser |
|-------|------|------------------|
| `ui-designer` | Design system, composants | Création interface, cohérence visuelle |
| `ux-researcher` | User testing, insights | Recherche utilisateur, tests |
| `ux-architect` | Architecture UX technique | Flux utilisateur, navigation |
| `brand-guardian` | Identité, cohérence | Charte graphique, positionnement |

**Marketing & Growth:**
| Agent | Rôle | Quand l'utiliser |
|-------|------|------------------|
| `growth-hacker` | Acquisition, viral loops | Stratégie croissance, expérimentation |
| `content-creator` | Contenu multi-plateforme | Blog, réseaux, newsletters |
| `reddit-community-builder` | Engagement authentique | Communauté Reddit |
| `social-media-strategist` | Stratégie cross-platform | Plan éditorial, campagnes |

**Project & QA:**
| Agent | Rôle | Quand l'utiliser |
|-------|------|------------------|
| `senior-project-manager` | Scope, specs→tâches | Planification, conversion besoins |
| `reality-checker` | Validation qualité | Certification prod-ready |
| `evidence-collector` | Tests avec preuves | QA visuelle, screenshots |
| `experiment-tracker` | A/B tests, métriques | Validation hypothèses |

---

## 2) Règles de routage

```
main
├── Simple / linéaire → main (pas de spawn)
├── Technique mono-domaine → main → [agent-métier]
└── Multi-domaines / complexe → main → agents-orchestrator → [agents-métier]
```

### Décision tree

1. **Simple / linéaire / faible risque** → `main` répond directement
2. **Technique mono-domaine** → `main` spawne l'agent spécialisé Agence-IA :
   - API/backend → `backend-architect`
   - Frontend/UI → `frontend-developer`
   - Sécurité → `security-engineer`
   - DevOps → `devops-automator`
   - Marketing → `growth-hacker` ou `content-creator`
   - QA → `reality-checker` ou `evidence-collector`
3. **Multi-domaines / dépendances** → `main` → `agents-orchestrator` → délégation aux agents métier
4. **Si message contient** "utilise les agents nécessaires" → forcer `agents-orchestrator`
5. **Si orchestrator utilisé** → doit déléguer à minimum 1 spécialiste
6. **Transparence obligatoire** → `Agents utilisés : ...` en fin de réponse

---

## 3) Exécution

### Spawn one-shot (tâche ponctuelle)

```bash
sessions_spawn \
  --task "Crée une architecture API REST pour un e-commerce" \
  --file ~/.openclaw/agency-agents/backend-architect/SOUL.md \
  --mode run
```

### Session persistante (projet long)

```bash
sessions_spawn \
  --label "backend-venus" \
  --task "Tu es le Backend Architect pour Venus Beauté" \
  --file ~/.openclaw/agency-agents/backend-architect/SOUL.md \
  --mode session \
  --thread true
```

### Interagir avec une session persistante

```bash
# Envoyer un message
sessions_send --label "backend-venus" --message "Conçois l'endpoint /api/products"

# Lister les sessions
sessions_list --kinds session

# Historique
sessions_history --sessionKey "backend-venus"

# Terminer
subagents --action kill --target "backend-venus"
```

---

## 4) Mapping projet → agents

| Projet | Agents suggérés | Labels |
|--------|-----------------|--------|
| Venus Beauté (e-commerce) | `backend-architect`, `frontend-developer`, `growth-hacker` | `backend-venus`, `frontend-venus`, `growth-venus` |
| Refonte SEO | `growth-hacker`, `content-creator` | `seo-venus`, `content-venus` |
| Audit sécurité | `security-engineer` | `security-audit` |
| CI/CD & Infra | `devops-automator` | `devops-pipeline` |
| Feature complexe multi-domaines | `agents-orchestrator` → équipe complète | `orchestrator-[projet]` |

---

## 5) Check-list fiabilité

Avant chaque réponse :
- [ ] Bon agent choisi selon le domaine
- [ ] Mode approprié (run vs session)
- [ ] Dépendances inter-agents couvertes si multi-domaines
- [ ] Résultat consolidé en une réponse claire
- [ ] `Agents utilisés : [agent1] → [agent2]` en fin de réponse

---

## 6) Notes

- **Langue** : Agents Agence-IA répondent en français (config utilisateur), SOUL.md reste en anglais
- **Source** : Agents disponibles dans `~/.openclaw/agency-agents/` (112 agents)
- **Config** : Runtime OpenClaw dans `~/.openclaw/openclaw.json`
- **Mémoire** : Sessions persistantes conservent contexte jusqu'à kill explicite
