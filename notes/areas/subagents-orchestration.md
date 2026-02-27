# Orchestration multi-agents (v2)

## Objectif
Assurer une orchestration fiable, lisible et reproductible des sous-agents, quel que soit le channel.

---

## 1) Architecture statique (sessions persistantes)

### Rôle du conducteur
- **`main`** = conducteur principal (point d’entrée user-facing).

### Spécialistes persistants (thread-bound)
- `spec-orchestrator` — coordination multi-domaines
- `memory-curator` — mémoire N1/N2/N3, consolidation
- `ops-guardian` — santé gateway/crons/providers
- `repo-keeper` — git add/commit/push, traçabilité
- `qa-safety` — sécurité/policy/anti-injection
- `knowledge-librarian` — PARA/docs/learnings

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
- Suivi continu d’un même fil

---

## 3) Règles de routage (source opérationnelle)

1. **Simple / linéaire / faible risque** → `main`
2. **Moyenne / technique mono-domaine** → `main -> spécialiste direct`
3. **Multi-domaines / dépendances** → `main -> spec-orchestrator -> spécialistes`
4. Si message contient "utilise les agents nécessaires" → forcer orchestrator
5. Si orchestrator est utilisé, il doit déléguer à au moins 1 spécialiste
6. Transparence obligatoire en sortie: `Agents utilisés : ...`

---

## 4) Exécution pratique

- Orchestration interactive: privilégier sessions persistantes
- Spawn dynamique réservé aux traitements de fond
- En cas d’échec spécialiste persistant:
  1) retry x1
  2) fallback voisin
  3) respawn si nécessaire

---

## 5) Check-list de fiabilité

Avant synthèse finale:
- [ ] Le bon mode de routage a été choisi
- [ ] Les dépendances inter-agents sont couvertes
- [ ] Le résultat est consolidé en une seule réponse claire
- [ ] La ligne `Agents utilisés : ...` reflète la chaîne réelle

---

## 6) Notes d’exploitation

- Config runtime OpenClaw hors repo: `~/.openclaw/openclaw.json`
- Priorité de source: workspace local d’abord, fallback GitHub si doute
- Toute évolution de routage doit être tracée dans AGENTS.md + note d’aire
