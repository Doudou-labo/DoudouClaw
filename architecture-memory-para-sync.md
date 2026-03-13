# Architecture Système Unifié : Memory + PARA + Sync

> **Proposition d'architecture** — DevOps Automator (Agence-IA)  
> Date: 2026-03-13  
> Version: 1.0

---

## TL;DR

Architecture modulaire avec **4 exécutions/jour** (9h, 13h, 18h30, 22h30) orchestrées par un script maître `memory-para-unified-sync.sh`. Séparation claire des responsabilités : consolidation mémoire (3 sources), maintenance PARA, sync GitHub, et reporting Discord. Pas de conflit avec le cron fsxmemory 03:00 (ils sont complémentaires).

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIFIED MEMORY + PARA + SYNC SYSTEM                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│   │  OpenClaw   │    │  LanceDB    │    │  fsxmemory  │                    │
│   │   Native    │    │    LTM      │    │  + QMD      │                    │
│   │             │    │             │    │             │                    │
│   │ • Journal   │    │ • memory_   │    │ • Checkpoints│                   │
│   │   quotidien │    │   store     │    │ • Handoffs   │                   │
│   │ • MEMORY.md │    │ • memory_   │    │ • QMD Search │                   │
│   │             │    │   recall    │    │ • 114 files  │                   │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                    │
│          │                  │                  │                           │
│          └──────────────────┼──────────────────┘                           │
│                             ▼                                              │
│          ┌─────────────────────────────────────┐                          │
│          │   MEMORY-CONSOLIDATOR MODULE        │                          │
│          │   (memory-consolidator.sh)          │                          │
│          │                                     │                          │
│          │ • Agrège les 3 sources              │                          │
│          │ • Génère memory/consolidated-report.md│                        │
│          │ • Met à jour SESSION-STATE.md       │                          │
│          └──────────────────┬──────────────────┘                          │
│                             │                                              │
│                             ▼                                              │
│          ┌─────────────────────────────────────┐                          │
│          │   PARA-SYNC MODULE                  │                          │
│          │   (para-sync.sh)                    │                          │
│          │                                     │                          │
│          │ • Vérifie structure notes/{projects,areas,resources,archive}/  │
│          │ • Détecte projets sans updates      │                          │
│          │ • Met à jour notes/areas/open-loops.md│                        │
│          │ • Archive les projets terminés      │                          │
│          └──────────────────┬──────────────────┘                          │
│                             │                                              │
│                             ▼                                              │
│          ┌─────────────────────────────────────┐                          │
│          │   GITHUB-SYNC MODULE                │                          │
│          │   (github-sync.sh)                  │                          │
│          │                                     │                          │
│          │ • git add/commit/push workspace     │                          │
│          │ • Gère les conflits de merge        │                          │
│          │ • Vérifie le push                   │                          │
│          └──────────────────┬──────────────────┘                          │
│                             │                                              │
│                             ▼                                              │
│          ┌─────────────────────────────────────┐                          │
│          │   DISCORD REPORTER MODULE           │                          │
│          │   (discord-reporter.sh)             │                          │
│          │                                     │                          │
│          │ • Génère rapport Markdown + emojis  │                          │
│          │ • Envoie vers salon 1472597513898033162│                       │
│          │ • Best-effort (pas de blocage)      │                          │
│          └──────────────────┬──────────────────┘                          │
│                             │                                              │
│                             ▼                                              │
│          ┌─────────────────────────────────────┐                          │
│          │   ORCHESTRATOR (maître)             │                          │
│          │   memory-para-unified-sync.sh       │                          │
│          │                                     │                          │
│          │ • Ordonne les 4 modules             │                          │
│          │ • Gère les erreurs                  │                          │
│          │ • Logging structuré                 │                          │
│          └─────────────────────────────────────┘                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stack mémoire : rôles clarifiés

| Système | Rôle dans l'archi | Données exploitées | Fréquence sync |
|---------|-------------------|-------------------|----------------|
| **OpenClaw natif** | Journal quotidien + état session | `memory/YYYY-MM-DD.md`, `SESSION-STATE.md`, `MEMORY.md` | Continue (lecture) |
| **LanceDB** | LTM technique (tooling) | `memory_store` / `memory_recall` | Temps réel |
| **fsxmemory** | Checkpoint/recover + QMD recherche | Vault complet (114 fichiers) | 03:00 + consolidation |
| **PARA** | Organisation sémantique | `notes/{projects,areas,resources,archive}/` | 4x/jour |

---

## Scripts et composants

### 1. Orchestrateur principal
**Fichier:** `scripts/memory-para-unified-sync.sh`
**Rôle:** Coordination des 4 modules, gestion des erreurs, logging

```bash
#!/bin/bash
# memory-para-unified-sync.sh
# Orchestrateur unifié Memory + PARA + Sync
# Exécution: 4x/jour (9h, 13h, 18h30, 22h30)

set -euo pipefail

# Configuration
RUN_ID=$(date +%Y%m%d-%H%M%S)
LOG_FILE="/var/log/memory-para-sync-${RUN_ID}.log"
REPORT_FILE="/tmp/memory-para-report-${RUN_ID}.md"
DISCORD_CHANNEL="1472597513898033162"

# Modules
MODULES=(
    "memory-consolidator:Consolidation mémoire"
    "para-sync:Sync PARA"
    "github-sync:Sync GitHub"
    "discord-reporter:Reporting Discord"
)

# État global
declare -A MODULE_STATUS
declare -A MODULE_DURATION
```

### 2. Module Memory Consolidator
**Fichier:** `scripts/modules/memory-consolidator.sh`
**Rôle:** Agréger les données des 3 systèmes

**Entrées:**
- `memory/YYYY-MM-DD.md` (aujourd'hui + hier)
- `SESSION-STATE.md`
- `MEMORY.md`
- `memory/.fsxmemory/last-checkpoint.json`
- `qmd status` (stats QMD)

**Sorties:**
- `memory/consolidated-report.md` (snapshot consolidé)
- Mise à jour `SESSION-STATE.md` avec timestamp consolidation

**Structure du rapport consolidé:**
```markdown
# Consolidation Mémoire — 2026-03-13 22:30

## 📝 Journal Natif OpenClaw
- Fichiers quotidiens: 45
- Dernier: 2026-03-13.md (2.3KB)
- Entrées clés: 3 décisions, 2 TODOs

## 🧠 LanceDB LTM
- Entrées totales: 127
- Nouvelles (24h): 12
- Catégories: decisions (8), preferences (4)

## 📦 fsxmemory + QMD
- Fichiers indexés: 114
- Checkpoints: 23
- Handoffs actifs: 2
- Dirty death flag: ⚠️ présent

## 🔗 Corrélations détectées
- Décision "Migration ByteRover" liée à handoff #12
- TODO "Setup cron unifié" → créé le 2026-03-13
```

### 3. Module PARA Sync
**Fichier:** `scripts/modules/para-sync.sh`
**Rôle:** Maintenance de la structure PARA

**Actions:**
- Vérifier l'intégrité des dossiers `notes/{projects,areas,resources,archive}/`
- Détecter les projets sans mise à jour depuis >30 jours
- Vérifier les liens cassés (fichiers référencés mais manquants)
- Mettre à jour `notes/areas/open-loops.md` avec les projets actifs
- Proposer l'archivage des projets terminés

**Sorties:**
- `notes/areas/para-health-check.md` (rapport de santé)
- Modifications éventuelles dans la structure PARA

### 4. Module GitHub Sync
**Fichier:** `scripts/modules/github-sync.sh`
**Rôle:** Synchronisation vers DoudouClaw/memory/

**Différenciation avec cron 03:00:**
| Aspect | Cron 03:00 (fsxmemory) | Cron Memory+PARA (4x/jour) |
|--------|------------------------|---------------------------|
| **Scope** | Uniquement vault fsxmemory | Workspace complet (mémoire + PARA + configs) |
| **Destination** | `DoudouClaw/memory/` (sous-dossier) | `DoudouClaw/` (racine) |
| **Fichiers** | `memory/*` (sans .fsxmemory/) | `memory/`, `notes/`, `scripts/`, `*.md` |
| **Conflict handling** | Rsync + git | Git natif avec merge |
| **Message commit** | "🔄 Sync fsxmemory vault" | "🧠 Consolidation Memory+PARA — HH:MM" |

**Stratégie anti-doublon:**
- Les deux crons ciblent des **scopes différents**
- Le cron 03:00 fait un rsync vers un sous-dossier `memory/`
- Le cron 4x/jour fait un commit git classique depuis le workspace
- Pas de risque de conflit car git détecte les changements déjà commités

### 5. Module Discord Reporter
**Fichier:** `scripts/modules/discord-reporter.sh`
**Rôle:** Générer et envoyer le rapport

**Format du rapport (Markdown + emojis):**
```markdown
🧠 **Memory+PARA Sync** — 13/03 22:30

📊 **Consolidation**
✅ Journal natif: 45 fichiers
✅ LanceDB: 127 entrées (+12)
✅ fsxmemory: 114 fichiers indexés
⚠️ 2 handoffs actifs

📁 **PARA Health**
✅ Projects: 8 actifs
✅ Areas: 12 à jour
📋 Ressources: 23 fichiers
🗃️ Archive: 5 projets

☁️ **GitHub Sync**
✅ Push réussi (3 fichiers modifiés)
🔗 [Voir commit](https://github.com/Doudou-labo/DoudouClaw/commit/abc123)

⏱️ **Durée**: 12.3s | 🆔 Run: 20260313-223000
```

**Envoi:**
- Utilisation du webhook Discord (via `message` tool ou curl)
- Mode best-effort (erreur silencieuse si indisponible)

---

## Plan de migration

### Étape 1: Préparation (avant mise en prod)
1. ✅ Créer le dossier `scripts/modules/`
2. ✅ Implémenter chaque module individuellement
3. ✅ Tester chaque module en dry-run
4. ⬜ Valider avec l'utilisateur

### Étape 2: Déploiement
1. ⬜ Créer les wrappers cron
2. ⬜ Désactiver l'ancien `brv-sync.sh` (déjà obsolète)
3. ⬜ Garder actif le cron 03:00 fsxmemory (complémentaire)
4. ⬜ Installer les 4 nouveaux crons

### Étape 3: Validation
1. ⬜ Premier run manuel supervisé
2. ⬜ Vérifier le rapport Discord
3. ⬜ Vérifier le push GitHub
4. ⬜ Monitorer 48h

### Gestion des crons existants

```bash
# Crons à garder (complémentaires)
0 3 * * * /root/.openclaw/workspace/scripts/cron-wrapper-fsxmemory-sync.sh

# Crons à créer (nouveaux)
0 9 * * * /root/.openclaw/workspace/scripts/cron-wrapper-memory-para.sh
0 13 * * * /root/.openclaw/workspace/scripts/cron-wrapper-memory-para.sh
30 18 * * * /root/.openclaw/workspace/scripts/cron-wrapper-memory-para.sh
30 22 * * * /root/.openclaw/workspace/scripts/cron-wrapper-memory-para.sh

# Crons obsolètes (à supprimer)
# */30 * * * * /root/.openclaw/workspace/scripts/cron-wrapper-brv-sync.sh  # ByteRover supprimé
```

---

## Dépendances

### Outils requis (déjà installés)
- `git` (version >= 2.30)
- `gh` (GitHub CLI, déjà auth)
- `qmd` (indexation sémantique)
- `jq` (parsing JSON)
- `curl` (envoi Discord)

### Fichiers de config requis
- `.credentials/github-token.txt` (déjà présent)
- `openclaw.json` (pour Discord channel ID)

---

## Spécifications détaillées

### Script principal : memory-para-unified-sync.sh

```bash
#!/bin/bash
# Usage: ./memory-para-unified-sync.sh [--dry-run] [--discord-only]

# Options:
#   --dry-run        Simule l'exécution sans modifier de fichiers
#   --discord-only   N'envoie que le rapport (skip les modules)
#   --module <name>  Exécute un seul module

# Variables d'environnement:
#   DISCORD_CHANNEL_ID    Override du salon (défaut: 1472597513898033162)
#   LOG_LEVEL             debug|info|warn|error (défaut: info)
#   SKIP_GITHUB_PUSH      Si 1, skip le push (pour tests)
```

### Structure des logs
```
/var/log/memory-para-sync/
├── memory-para-sync-20260313-090000.log
├── memory-para-sync-20260313-130000.log
├── memory-para-sync-20260313-183000.log
├── memory-para-sync-20260313-223000.log
└── latest.log -> lien symbolique vers le dernier
```

### Codes de retour
- `0` : Succès complet
- `1` : Échec critique (arrêt)
- `2` : Échec partiel (certains modules KO)
- `3` : Erreur Discord (non bloquant)

---

## Checklist de test avant mise en prod

### Tests unitaires par module
- [ ] `memory-consolidator.sh` dry-run → génère un rapport valide
- [ ] `para-sync.sh` dry-run → détecte les projets actifs
- [ ] `github-sync.sh` dry-run → simule le commit/push
- [ ] `discord-reporter.sh` test → envoie un message de test

### Tests d'intégration
- [ ] Run complet en dry-run → tous les modules passent
- [ ] Run réel sur branche de test → push vers repo test
- [ ] Vérification Discord → message reçu avec formatage correct
- [ ] Vérification temps d'exécution < 30s

### Tests de robustesse
- [ ] Scénario: aucun changement depuis dernier run
- [ ] Scénario: conflit Git (simulation)
- [ ] Scénario: Discord indisponible (doit continuer)
- [ ] Scénario: qmd indisponible (doit continuer avec warning)

### Validation post-déploiement
- [ ] Premier run 09:00 → rapport reçu
- [ ] Premier run 13:00 → rapport reçu
- [ ] Premier run 18:30 → rapport reçu
- [ ] Premier run 22:30 → rapport reçu
- [ ] Vérification GitHub → commits présents avec bons messages
- [ ] Pas d'interférence avec cron 03:00

---

## Calendrier de livraison

| Phase | Livrable | Date estimée |
|-------|----------|--------------|
| 1 | Architecture validée | 2026-03-13 |
| 2 | Modules implémentés | 2026-03-14 |
| 3 | Tests et validation | 2026-03-15 |
| 4 | Déploiement production | 2026-03-16 |

---

## Questions ouvertes pour validation

1. **Format du rapport Discord** : Le template proposé convient-il ? Souhaitez-vous des métriques supplémentaires ?

2. **Scope GitHub** : Le cron 4x/jour doit-il commiter **tout** le workspace ou seulement `memory/` + `notes/` ?

3. **Gestion des erreurs** : En cas d'échec d'un module, faut-il :
   - A) Arrêter tout et alerter immédiatement
   - B) Continuer avec les autres modules et reporter les erreurs
   - C) Retry 1x puis B

4. **Notification d'erreur** : En cas d'échec critique, souhaitez-vous une notification Discord séparée (en plus du rapport) ?

5. **Archivage PARA** : Le script doit-il proposer l'archivage ou l'exécuter automatiquement si un projet est marqué "terminé" ?

---

*Architecture proposée par le DevOps Automator — En attente de validation*
