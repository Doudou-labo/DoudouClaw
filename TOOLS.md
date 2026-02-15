# TOOLS.md - Tool Configuration & Notes

> Document tool-specific configurations, gotchas, and credentials here.

---

## Credentials Location

All credentials stored in `.credentials/` (gitignored):
- `example-api.txt` — Example API key

---

## [Tool Name]

**Status:** ✅ Working | ⚠️ Issues | ❌ Not configured

**Configuration:**
```
Key details about how this tool is configured
```

**Gotchas:**
- Things that don't work as expected
- Workarounds discovered

**Common Operations:**
```bash
# Example command
tool-name --common-flag
```

---

## Writing Preferences

- Répondre en français par défaut
- Tutoiement
- Style direct, concret, utile
- Réponses détaillées par défaut
- Ton amical, sans lourdeur
- Touche d’humour légère quand pertinent
- Inclure des emojis dans les réponses (préférence explicite utilisateur) 😄✨

---

## GitHub Backup Automation

- Auto-push après chaque commit via hook local: `.git/hooks/post-commit`
- Script de tag hebdo: `scripts/weekly-backup-tag.sh`
- Note: en mode non interactif, un remote HTTPS peut échouer sans identifiants chargés. SSH est plus fiable pour l’automatisation complète.

## LanceDB / Memory plugin (OpenClaw)

**Status:** ✅ Working (corrigé le 2026-02-13)

**Symptôme rencontré:**
- `memory_store` en erreur: `Cannot find module '@lancedb/lancedb'`

**Diagnostic utile:**
```bash
openclaw status
openclaw ltm list
```

**Correctif appliqué:**
```bash
# Installer la dépendance là où OpenClaw la résout
cd /usr/lib/node_modules/openclaw
npm i @lancedb/lancedb

# Redémarrer le gateway
openclaw gateway restart
```

**Validation:**
- Test `memory_store` + `memory_recall` OK
- Note: `openclaw status` peut parfois afficher `Memory ... unavailable` de façon transitoire malgré des tools mémoire fonctionnels.

## Context Manager (safe compression)

**Status:** ✅ Installed (2026-02-13)

**Source:**
- `skills/context-manager/` (importé depuis openclaw/skills: plgonzalezrx8/context-manager)

**Compat patch local:**
- Support des fichiers session suffixés topic (`<sessionId>-topic-<id>.jsonl`)
- Conversion CRLF → LF sur les fichiers shell

**Procédure safe (2 étapes):**
```bash
# 1) Preview (read-only, aucun reset)
bash scripts/context-compress-preview.sh 'agent:main:telegram:group:-1003791371950:topic:37'

# 2) Apply (destructif: reset + inject) avec confirmation explicite
bash scripts/context-compress-apply.sh 'agent:main:telegram:group:-1003791371950:topic:37' RESET_OK
```

**Traçabilité GitHub:**
- Les scripts preview/apply ajoutent une trace dans `memory/YYYY-MM-DD.md`
- Commit + push automatiques des artefacts utiles (summary + backup)

## PARA + Self-Improving automations

**Status:** ✅ Working (setup 2026-02-13)

**Scripts:**
```bash
scripts/auto-para-checkpoint.sh          # checkpoint PARA 3-min (midi/soir)
scripts/auto-para-weekly-review.sh       # revue hebdo PARA (snapshot)
scripts/auto-self-improve-review.sh      # revue hebdo self-improving (.learnings)
```

**Traçabilité GitHub intégrée:**
- Chaque script fait `git add` ciblé + `git commit` + `git push`
- Objectif: aucune perte de trace entre local et GitHub

**Retour utilisateur intégré (Telegram):**
- Chaque automation renvoie désormais un résumé: **Résultats + Points à retenir + commit**
- Mise en œuvre cron: `delivery.mode=announce` (évite les échecs `message.send` sur target topic)

**Crons créés:**
- `PARA Auto - 3min midi (git sync)`
- `PARA Auto - 3min soir (git sync)`
- `PARA Auto - revue hebdo (git sync)`
- `Self-Improve Auto - revue hebdo (git sync)`

## ripgrep pour les recherches

**Status:** ✅ installé (15 février 2026)

**Pourquoi:** On voulait l’utiliser pour chercher rapidement dans les fichiers (`rg -n "finance"`), mais la commande n’était pas disponible par défaut. Je l’ai installée via `apt-get install ripgrep`.

**Gotchas:**
- Le dépôt tiers `https://repository.monarx.com/repository/ubuntu-questing` retournait un 404 et bloquait `apt update`. Pour régler ça, j’ai renommé `/etc/apt/sources.list.d/monarx.list` en `.disabled`, ce qui évite l’erreur à l’avenir.

**Commandes utiles:**
```bash
rg -n "finance"
rg --files
```

## What Goes Here

- Tool configurations and settings
- Credential locations (not the credentials themselves!)
- Gotchas and workarounds discovered
- Common commands and patterns
- Integration notes

## Why Separate?

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

---

*Add whatever helps you do your job. This is your cheat sheet.*
