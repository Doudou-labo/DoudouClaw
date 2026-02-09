# DoudouBot Workspace 🤖

Ce dépôt contient le **workspace privé** de DoudouBot (assistant OpenClaw d’Alexandre).

## 🎯 À quoi sert ce repo ?

Ce repo sert à :
- sauvegarder la configuration de l’assistant
- conserver la mémoire utile entre les sessions
- versionner les règles de fonctionnement
- garder un historique clair des évolutions (via Git)

En bref : c’est le **cerveau opérationnel** de ton assistant, versionné et sauvegardé sur GitHub privé 🔒

---

## 🗂️ Structure principale

- `AGENTS.md` → règles d’exécution et workflow interne
- `SOUL.md` → identité, ton, principes de l’assistant
- `USER.md` → profil utilisateur (Alexandre / Doudou)
- `MEMORY.md` → mémoire long terme curée
- `memory/` → journal quotidien (`YYYY-MM-DD.md`)
- `notes/` → second cerveau en PARA :
  - `projects/` (projets actifs)
  - `areas/` (responsabilités continues)
  - `resources/` (références et templates)
  - `archive/` (éléments terminés)
- `skills/` → skills installés/testés

---

## 🚀 Comment s’en servir

### 1) Travailler normalement avec l’assistant
Le repo est mis à jour au fil des changements (mémoire, règles, notes, skills).

### 2) Vérifier l’état Git
```bash
git status
git log --oneline -n 15
```

### 3) Sauvegarder manuellement (si besoin)
```bash
git add .
git commit -m "message clair"
git push
```

### 4) Restaurer une version précédente
```bash
git log --oneline
git checkout <commit>
```

---

## 🔁 Sauvegarde continue

Le workspace est configuré avec :
- **auto-push après commit** (hook local `post-commit`)
- **routine de backup hebdo** via `scripts/weekly-backup-tag.sh`

Créer un tag de backup manuellement :
```bash
bash scripts/weekly-backup-tag.sh
```

---

## 🔐 Sécurité

- Repo **privé** GitHub
- Remote configuré en **SSH**
- Ne pas stocker de secrets en clair dans le repo
- Vérifier avant tout partage externe

---

## ✅ Bonnes pratiques

- Faire des commits fréquents avec messages explicites
- Documenter les décisions importantes dans `memory/YYYY-MM-DD.md`
- Garder `MEMORY.md` propre et synthétique
- Ranger les connaissances dans `notes/` (PARA)

---

## ℹ️ Note

Ce repo est orienté continuité, fiabilité et réduction de charge mentale.
Moins d’oubli, plus de clarté, plus d’exécution 💪✨
