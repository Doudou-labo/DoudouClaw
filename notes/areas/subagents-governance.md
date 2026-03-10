# Gouvernance des agents — Agence-IA

## But
Éviter la dérive (sprawl), clarifier les responsabilités, et garantir une orchestration robuste avec les agents Agence-IA.

---

## 1) Modèle de responsabilité

### Niveaux
- **Niveau 0 — main**: interface utilisateur, arbitrage final, qualité de synthèse
- **Niveau 1 — orchestrateur**: `agents-orchestrator` (coordination multi-domaines)
- **Niveau 2 — spécialistes Agence-IA**: 112 experts métiers (backend-architect, frontend-developer, growth-hacker, etc.)
- **Niveau 3 — sessions persistantes**: agents dédiés à un projet long (ex: `backend-venus`)

### RACI simplifié
- **R (responsible)**: agent Agence-IA exécutant
- **A (accountable)**: `main`
- **C (consulted)**: `agents-orchestrator` si multi-domaines
- **I (informed)**: utilisateur via synthèse unique

---

## 2) Critères de création d'une session persistante

Créer un rôle dédié (label custom) seulement si:
1. Projet long (>= 1 semaine)
2. Besoin de continuité contextuelle forte
3. Agent métier identifié (backend-architect, content-creator, etc.)
4. Label clair: `[agent]-[projet]` (ex: `backend-venus`, `growth-launch`)

Sinon: utiliser spawn one-shot avec SOUL.md Agence-IA.

---

## 3) SLA interne (cible)

- Routage initial: < 30s
- Première réponse utile: < 2 min (hors batch long)
- Retry/fallback automatique: < 60s après échec détecté

---

## 4) Politique d'échec

Ordre strict:
1. retry x1 (même agent)
2. fallback vers agent voisin du même domaine (ex: backend-architect → devops-automator)
3. respawn avec contexte réduit
4. escalade `main` avec proposition de contournement

---

## 5) Politique de transparence

Chaque réponse finale doit:
- expliciter les actions réellement effectuées,
- éviter les promesses non exécutées,
- inclure `Agents utilisés : ...`.

---

## 6) Hygiène documentaire

À chaque changement de routing/roles:
- mettre à jour `AGENTS.md` (règles globales),
- mettre à jour `notes/areas/agent-orchestration.md` (vue opératoire),
- journaliser brièvement l'évolution dans `memory/YYYY-MM-DD.md`.

---

## 7) Revue hebdo (10 min)

Checklist:
- [ ] agents Agence-IA peu utilisés à identifier ?
- [ ] sessions persistantes orphelines à kill ?
- [ ] incidents récurrents par type d'agent ?
- [ ] qualité des synthèses finales acceptable ?

---

## 8) Risques principaux + garde-fous

- **Risque:** trop d'agents pour des tâches simples  
  **Garde-fou:** simple -> main

- **Risque:** perte de lisibilité de la chaîne d'exécution  
  **Garde-fou:** footer `Agents utilisés` exact

- **Risque:** divergence docs vs runtime  
  **Garde-fou:** update AGENTS + note d'aire + revue hebdo

- **Risque:** sessions persistantes qui traînent  
  **Garde-fou:** kill explicite à la fin du projet
