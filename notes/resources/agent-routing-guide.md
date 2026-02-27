# Agent Routing Guide (plug-and-play)

Guide rapide pour router les demandes vers le bon agent, sans friction.

## Règle simple

- **1 domaine / tâche courte** → `main` ou un `spec-*` direct
- **2 domaines ou plus / dépendances** → `spec-orchestrator`
- **Action sensible** (suppression, sécurité, envoi externe, config critique) → validation `qa-safety` avant exécution

## Tableau de commande

| Agent | Domaine | Quand l’appeler | Exemple de prompt ultra court |
|---|---|---|---|
| `spec-orchestrator` | Coordination multi-domaines | Tâche complexe, plusieurs chantiers | `Coordonne: audit cron + fix + doc + commit.` |
| `memory-curator` | Mémoire (N1/N2/N3, LTM) | Cohérence contexte, reprise après timeout | `Audit N1↔LTM et mets SESSION-STATE à jour.` |
| `ops-guardian` | Ops OpenClaw (gateway, crons, logs, cooldowns) | Instabilité, 429, timeouts, jobs en erreur | `Check santé gateway + top 3 incidents + plan minimal-risk.` |
| `repo-keeper` | Git/GitHub, commits, submodules | Finaliser changements, hygiène repo | `Commit/push ce qui est prêt, signale les blocages.` |
| `qa-safety` | Sécurité/policy/risques | Avant action sensible ou doute injection | `Go/No-Go sécurité sur ce plan avant exécution.` |
| `knowledge-librarian` | PARA, notes, templates, organisation | Ranger, normaliser, réduire la dette documentaire | `Classe ces notes en PARA + standardise les templates.` |

## Playbooks express

### 1) Incident ops + correction + traçabilité
1. `spec-orchestrator`
2. `ops-guardian` (diagnostic)
3. `qa-safety` (validation risques)
4. `repo-keeper` (commit/push de la correction)
5. Synthèse finale utilisateur

### 2) Reprise après timeout / compaction
1. `memory-curator` (état + cohérence)
2. `spec-orchestrator` si plusieurs volets ouverts
3. Replanification courte avec prochaine action unique

### 3) Nettoyage documentaire
1. `knowledge-librarian`
2. `repo-keeper` pour commit/push

## Prompts prêts à coller

- `spec-orchestrator` :
  - `Découpe cette demande en sous-tâches et délègue aux bons spec-*.`
- `ops-guardian` :
  - `Audit openclaw: gateway, crons, 429/cooldowns, erreurs récentes, reco priorisées.`
- `repo-keeper` :
  - `Nettoie l’état git, commit/push les fichiers validés, ne touche pas aux dépôts externes sans accord.`
- `qa-safety` :
  - `Passe ce plan en revue et donne go/no-go + garde-fous avant exécution.`
- `memory-curator` :
  - `Vérifie cohérence SESSION-STATE/MEMORY/journal du jour + LTM recall.`
- `knowledge-librarian` :
  - `Range ces notes dans PARA et propose les archives candidates.`

## Notes opérationnelles

- Éviter de lancer trop de spécialistes en parallèle sur le même provider si charge élevée (risque 429).
- Préférer des lots courts et séquentiels quand les logs montrent des cooldowns.
- Garder une synthèse unique côté utilisateur (pas de bruit multi-réponses).

---
Dernière mise à jour: 2026-02-27
