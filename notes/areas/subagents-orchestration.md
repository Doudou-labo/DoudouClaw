# Orchestration multi-agents (v2.1 — intégration Agence-IA)

## Objectif
Assurer une orchestration fiable, lisible et reproductible des sous-agents, quel que soit le channel. Intégration des agents Agence-IA (112 spécialistes) dans le routage.

---

## 1) Architecture statique (sessions persistantes)

### Rôle du conducteur
- **`main`** = conducteur principal (point d'entrée user-facing).

### Spécialistes persistants (thread-bound)
- `spec-orchestrator` — coordination multi-domaines
- `memory-curator` — mémoire N1/N2/N3, consolidation
- `ops-guardian` — santé gateway/crons/providers
- `repo-keeper` — git add/commit/push, traçabilité
- `qa-safety` — sécurité/policy/anti-injection
- `knowledge-librarian` — PARA/docs/learnings

### Agents Agence-IA (spécialistes métiers)
Agents riches en personnalité, disponibles dans `~/.openclaw/agency-agents/` :

**Engineering:**
- `backend-architect` — API, microservices, scalabilité
- `frontend-developer` — React/Vue, UI pixel-perfect
- `security-engineer` — audit, threat modeling
- `devops-automator` — CI/CD, infra, monitoring
- `ai-engineer` — ML, pipelines de données

**Design & Product:**
- `ui-designer` — design system, composants
- `ux-researcher` — user testing, insights
- `brand-guardian` — identité, cohérence

**Marketing & Growth:**
- `growth-hacker` — acquisition, viral loops
- `content-creator` — contenu multi-plateforme
- `reddit-community-builder` — engagement authentique

**Project & Ops:**
- `agents-orchestrator` — coordination pipeline multi-agents
- `senior-project-manager` — scope, conversion specs→tâches
- `reality-checker` — validation qualité avant prod
- `evidence-collector` — tests avec preuves visuelles

**Utilisation:** Spawner avec leur SOUL.md pour tâches spécialisées, ou référencer par nom court dans le routage.

### Pourquoi statique
- Réduction du temps de démarrage sur tâches récurrentes
- Continuité contextuelle par rôle
- Responsabilités plus nettes (qui fait quoi)

---

## 2) Architecture dynamique (pool éphémère)

Pool de spécialistes spawn à la demande pour charge ponctuelle:
- `spec-dev-*`
- `spec-data-*`
- `spec-web-research-*`
- `spec-docs-*`
- `spec-finance-*`
- `spec-automation-*`
- `spec-discord-*`
- `spec-comms-*`

### Quand utiliser le dynamique
- Tâche longue/batch
- Besoin parallèle massif
- Expertise ponctuelle non couverte par les persistants

### Quand éviter le dynamique
- Aller-retour interactif court
- Suivi continu d'un même fil

---

## 3) Règles de routage (source opérationnelle)

1. **Simple / linéaire / faible risque** → `main`
2. **Moyenne / technique mono-domaine** → `main -> spécialiste direct`
   - Routage possible vers:
     - `spec-dev-*` (générique)
     - `backend-architect` (API/bdd)
     - `frontend-developer` (UI/React)
     - `security-engineer` (audit/code review)
     - `devops-automator` (CI/CD/infra)
     - `ai-engineer` (ML/intégration IA)
     - `growth-hacker` (acquisition)
     - `content-creator` (rédaction)
3. **Multi-domaines / dépendances** → `main -> spec-orchestrator -> spécialistes`
   - L'orchestrator peut router vers:
     - Agents Agence-IA pour expertise métier
     - `spec-*` pour tâches techniques
4. Si message contient "utilise les agents nécessaires" → forcer orchestrator
5. Si orchestrator est utilisé, il doit déléguer à au moins 1 spécialiste
6. **Nouveaux agents Agence-IA**: privilégier quand la tâche nécessite une personnalité spécialisée forte
7. Transparence obligatoire en sortie: `Agents utilisés : ...`

---

## 4) Exécution pratique

### Routage standard (spec-*)
- Orchestration interactive: privilégier sessions persistantes
- Spawn dynamique réservé aux traitements de fond
- En cas d'échec spécialiste persistant:
  1) retry x1
  2) fallback voisin
  3) respawn si nécessaire

### Routage Agence-IA (agents spécialisés)
Pour utiliser un agent Agence-IA:

```bash
# Spawner avec le SOUL.md attaché
sessions_spawn \
  --task "Crée une architecture API REST..." \
  --file ~/.openclaw/agency-agents/backend-architect/SOUL.md \
  --mode run

# Ou lancer une session persistante dédiée
sessions_spawn \
  --label "backend-venus" \
  --task "Tu es le Backend Architect pour Venus Beauté" \
  --file ~/.openclaw/agency-agents/backend-architect/SOUL.md \
  --mode session \
  --thread true
```

**Mapping domaine → agent:**
| Domaine | Agent Agence-IA | Fichier SOUL.md |
|---------|-----------------|-----------------|
| Backend/API | `backend-architect` | `~/.openclaw/agency-agents/backend-architect/` |
| Frontend/UI | `frontend-developer` | `~/.openclaw/agency-agents/frontend-developer/` |
| Security | `security-engineer` | `~/.openclaw/agency-agents/security-engineer/` |
| DevOps/Infra | `devops-automator` | `~/.openclaw/agency-agents/devops-automator/` |
| Growth/Marketing | `growth-hacker` | `~/.openclaw/agency-agents/growth-hacker/` |
| Content | `content-creator` | `~/.openclaw/agency-agents/content-creator/` |
| QA/Testing | `reality-checker` | `~/.openclaw/agency-agents/reality-checker/` |
| Orchestration | `agents-orchestrator` | `~/.openclaw/agency-agents/agents-orchestrator/` |

**Note:** Les agents Agence-IA répondent en français (héritage de la config utilisateur) malgré le SOUL.md en anglais.

---

## 5) Check-list de fiabilité

Avant synthèse finale:
- [ ] Le bon mode de routage a été choisi
- [ ] Les dépendances inter-agents sont couvertes
- [ ] Le résultat est consolidé en une seule réponse claire
- [ ] La ligne `Agents utilisés : ...` reflète la chaîne réelle

---

## 6) Notes d'exploitation

- Config runtime OpenClaw hors repo: `~/.openclaw/openclaw.json`
- Priorité de source: workspace local d'abord, fallback GitHub si doute
- Toute évolution de routage doit être tracée dans AGENTS.md + note d'aire
