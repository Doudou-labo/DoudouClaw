# Stack de skills OpenClaw actif

**Statut:** En cours
**Mis à jour:** 2026-02-13T20:12:00Z

## Objectif
Avoir une vue claire des skills installés, de leur statut (actif / en attente), et des prochaines actions.

## Skills installés

### ✅ Actifs
- **proactive-agent**
  - Installé et activé en mode safe (backup + merge des éléments utiles)
  - Bootstrap effectué le 2026-02-13 (working-buffer + trackers + crons hebdo proactifs)
  - Point d’attention: rester pragmatique, éviter la surcharge de process

- **para-second-brain**
  - Activé complètement
  - Structure PARA en place (`notes/projects`, `notes/areas`, `notes/resources`, `notes/archive`)
  - Symlink actif: `memory/notes -> notes`
  - Routine 3 min ajoutée: `notes/resources/para-routine-3min.md`

- **self-improving-agent / self-improvement hook**
  - Skill installé
  - Hook `self-improvement` activé côté OpenClaw

### ⏸️ En attente (désactivé volontairement)
- **memory-setup**
  - Installé pour audit
  - Non activé pour le moment (références surtout Clawdbot/Moltbot, à adapter avant usage)

## Décisions prises
- On garde une activation “à la carte”: on prend les bonnes briques, pas l’idéologie complète.
- `memory-setup` reste en pause jusqu’à validation explicite.
- PARA est la base organisationnelle actuelle.
- (2026-02-13) Le déploiement `proactive-agent` est fait en **mode safe** (backup + merge), sans écraser les fichiers cœur personnalisés.
- (2026-02-13) Règle opérationnelle validée: **chaque modif fichier doit être commitée et pushée** vers GitHub pour éviter toute divergence local/remote.

## Prochaines actions
- [ ] **Rattrapage `proactive-agent` (prévu le 10/02, en retard)**
  - [ ] Lire `skills/proactive-agent/SKILL.md` et `SKILL-v3-draft.md`
  - [ ] Décider: garder la version actuelle ou migrer des blocs utiles du draft v3
  - [ ] Mettre à jour `skills/proactive-agent/assets/AGENTS.md` et `HEARTBEAT.md` avec une version courte/pragmatique
  - [ ] Tester 1 cycle complet: heartbeat → capture mémoire → suggestion proactive
  - [ ] Documenter le résultat dans ce fichier (section "Décisions prises")
- [ ] Finaliser le polish FR de `AGENTS.md` et `HEARTBEAT.md` si besoin
- [ ] Compléter `USER.md` (nom, objectifs, projets)
- [ ] Revue hebdo des skills actifs (garder / retirer)

## Références
- `skills/proactive-agent/`
- `skills/para-second-brain/`
- `skills/self-improving-agent/`
- `skills/memory-setup/`
