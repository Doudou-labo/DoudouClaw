# DoudouBot Workspace 🤖

Ce dépôt contient le **workspace privé** de DoudouBot (assistant OpenClaw d’Alexandre / Doudou).

## 🎯 À quoi sert ce repo ?

Ce repo sert à :
- sauvegarder la configuration de l’assistant
- conserver la mémoire utile entre les sessions
- versionner les règles de fonctionnement
- garder un historique clair des évolutions (via Git)

En bref : c’est le **cerveau opérationnel** de ton assistant, versionné et sauvegardé sur GitHub privé 🔒

---

## 🧭 Architecture actuelle (vue rapide)

- **Orga/repo GitHub** : `Doudou-labo/DoudouClaw`
- **Branche principale** : `main` (single-branch workflow)
- **Identité de commit/push** : bot **DoudouClaw**
- **Auth Git** : **HTTPS + token** (pas SSH)
- **Notifications push** : GitHub Actions → Discord webhook
- **Runtime agent** : OpenClaw `main` avec mémoire locale versionnée

---

## 📍 Où retrouver les fichiers importants

### Fichiers “racine” (pilotage global)
- `AGENTS.md` → règles d’exécution et workflow de l’agent
- `SOUL.md` → identité / ton / principes
- `USER.md` → profil d’Alexandre (préférences, contexte)
- `MEMORY.md` → mémoire long terme (version synthétique)
- `SESSION-STATE.md` → état de travail actif (le “RAM” de la session)
- `HEARTBEAT.md` → checklist périodique d’amélioration continue
- `TOOLS.md` → configuration outils + gotchas + runbooks

### Mémoire et connaissance
- `memory/YYYY-MM-DD.md` → journal quotidien brut (trace opérationnelle)
- `memory/working-buffer.md` → buffer anti-perte de contexte
- `notes/projects/` → projets avec fin claire
- `notes/areas/` → responsabilités continues (open loops, trackers)
- `notes/resources/` → références, procédures, templates
- `notes/archive/` → éléments terminés/inactifs

### Automatisations / scripts / skills
- `scripts/` → scripts utilitaires et routines
- `skills/` → skills installés
- `crm/` → données et scripts liés au mini-CRM local
- `.github/workflows/` → automatisations CI/CD (dont notif push Discord)

---

## ⚙️ Fonctionnement du repo GitHub

### 1) Principe
Ce repo est la **source de vérité** du workspace :
- tout ce qui doit survivre aux sessions est écrit ici,
- puis versionné avec Git,
- puis sauvegardé sur GitHub privé.

### 2) Flux standard
```bash
# voir ce qui a changé
git status

# commit ciblé (éviter git add . aveugle)
git add <fichiers>
git commit -m "type(scope): message"

# push vers GitHub
git push origin main
```

### 3) Sauvegarde continue
- Auto-push après commit via hook local `.git/hooks/post-commit`
- Tag backup hebdo via `scripts/weekly-backup-tag.sh`

Commande manuelle :
```bash
bash scripts/weekly-backup-tag.sh
```

### 4) Restaurer un état
```bash
git log --oneline -n 30
git checkout <commit>
```

---

## 🔔 Notifications push GitHub → Discord

Un workflow envoie une notification Discord à chaque push sur `main`.

- **Workflow** : `.github/workflows/push-discord-notify.yml`
- **Trigger** : `on: push` sur `main`
- **Secret requis** : `DISCORD_PUSH_WEBHOOK_URL`

### Setup secret
Repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

- Name: `DISCORD_PUSH_WEBHOOK_URL`
- Value: URL du webhook Discord du salon cible

### Payload envoyé
- branche
- auteur
- commit (SHA + lien)
- message
- fichiers modifiés (extrait)
- lien compare

---

## 🔐 Règles de sécurité du repo

- Repo GitHub **privé**
- Remote Git en **HTTPS** (token bot), **pas SSH**
- Jamais de secrets en clair (`.credentials/`, `.secrets/`)
- Données locales sensibles exclues via `.gitignore`

---

## 🛠️ Runbook rapide (dépannage)

### 1) La notif Discord ne tombe plus
1. Vérifier le secret `DISCORD_PUSH_WEBHOOK_URL`
2. Vérifier que le webhook Discord existe encore et pointe sur le bon salon
3. Vérifier l’onglet **Actions** du repo et les logs du run

### 2) Le workflow GitHub échoue
1. Ouvrir le run en erreur dans **Actions**
2. Lire l’étape qui fail (`Build payload` / `Send Discord`)
3. Corriger `.github/workflows/push-discord-notify.yml`, commit, push

### 3) Les commandes exec redemandent approbation sur Discord
Vérifier la config OpenClaw :
- `channels.discord.execApprovals.enabled = false`

---

## ✅ Convention d’écriture (où écrire quoi)

- **Décision ponctuelle / événement du jour** → `memory/YYYY-MM-DD.md`
- **Information durable** → `MEMORY.md`
- **État de tâche en cours** → `SESSION-STATE.md`
- **Process / commande / bug outil** → `TOOLS.md`
- **Tâche à suivre** → `notes/areas/open-loops.md`
- **Connaissance structurée** → `notes/` (PARA)

---

## ℹ️ Note

Ce repo est orienté continuité, fiabilité et réduction de charge mentale.
Moins d’oubli, plus de clarté, plus d’exécution 💪✨
