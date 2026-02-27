# Gouvernance des sous-agents

## But
Éviter la dérive (sprawl), clarifier les responsabilités, et garantir une orchestration robuste.

## 1) Modèle de responsabilité

### Niveaux
- **Niveau 0 — main**: interface utilisateur, arbitrage final, qualité de synthèse
- **Niveau 1 — persistants**: rôles cœur (orchestrator, mémoire, ops, repo, safety, knowledge)
- **Niveau 2 — dynamiques**: experts jetables, créés à la demande

### RACI simplifié
- **R (responsible)**: spécialiste exécutant
- **A (accountable)**: `main`
- **C (consulted)**: `spec-orchestrator` si multi-domaines
- **I (informed)**: utilisateur via synthèse unique

## 2) Critères de création d’un nouveau spécialiste

Créer un nouveau rôle seulement si:
1. volume récurrent (>= 3 usages/semaine),
2. frontière fonctionnelle claire,
3. bénéfice mesurable (temps, qualité, fiabilité),
4. owner identifié.

Sinon: rester sur pool dynamique.

## 3) SLA interne (cible)

- Routage initial: < 30s
- Première réponse utile: < 2 min (hors batch long)
- Retry/fallback automatique: < 60s après échec détecté

## 4) Politique d’échec

Ordre strict:
1. retry x1 (même agent)
2. fallback voisin
3. respawn
4. escalade `main` avec proposition de contournement

## 5) Politique de transparence

Chaque réponse finale doit:
- expliciter les actions réellement effectuées,
- éviter les promesses non exécutées,
- inclure `Agents utilisés : ...`.

## 6) Hygiène documentaire

À chaque changement de routing/roles:
- mettre à jour `AGENTS.md` (règles globales),
- mettre à jour `notes/areas/subagents-orchestration.md` (vue opératoire),
- journaliser brièvement l’évolution dans `memory/YYYY-MM-DD.md`.

## 7) Revue hebdo (10 min)

Checklist:
- [ ] rôles peu utilisés à déclasser ?
- [ ] incidents récurrents par agent ?
- [ ] prompts systèmes trop verbeux/ambigus ?
- [ ] besoin de fusion/split de rôles ?
- [ ] qualité des synthèses finales acceptable ?

## 8) Risques principaux + garde-fous

- **Risque:** trop d’agents pour des tâches simples  
  **Garde-fou:** simple -> main

- **Risque:** perte de lisibilité de la chaîne d’exécution  
  **Garde-fou:** footer `Agents utilisés` exact

- **Risque:** divergence docs vs runtime  
  **Garde-fou:** update AGENTS + note d’aire + revue hebdo
