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
