# TOOLS.md - Configuration et Notes des Outils

> Référence opérationnelle : configs, IDs critiques, commandes clés, gotchas.

---

## ⚡ Référence Rapide (Usage Quotidien)

| Besoin | Commande/Outil |
|--------|----------------|
| **Commit + push** | `git add . && git commit -m "msg" && git push` |
| **GitHub API** | `mcporter call github.<outil>` |
| **Agents Agence-IA** | `sessions_spawn` avec `~/.openclaw/agency-agents/[agent]/SOUL.md` |
| **Recherche web** | `web_search` tool ou Perplexity skill |
| **Calendrier** | API Maton — Calendar ID OpenClaw ci-dessous |
| **Mémoire LTM** | `memory_store` / `memory_recall` |
| **Memory-PARA Sync** | `scripts/unified-memory-para-sync.sh` (cron 4x/jour) |
| **Recherche mémoire** | `memory_search` tool (memory-core natif OpenClaw) |
| **Inbox Zero** | Pattern detection auto ou `@doudouclaw inbox:` |

**Note workflow mémoire :** ByteRover / `brv` n'est plus utilisé dans le flow normal. Référence canonique = `MEMORY.md` + `memory/YYYY-MM-DD.md` + `notes/**` + `memory_search`.
| **Compression contexte** | `scripts/context-compress-preview.sh` |
| **Status gateway** | `openclaw status` |
| **Navigateur** | `agent-browser open <url>` ou `mcporter call playwright.*` |
| **Recherche fichiers** | `rg -n "pattern"` |

**Rappels critiques :**
- 🚨 **Pas de preuve = Pas fait** → Toujours montrer PID/fichier/output
- 🔒 **Gateway restart** → Prévenir Alexandre AVANT (session coupée)
- 📝 **Modèles** → Changement dans `openclaw.json` ne nécessite PAS restart

---

## 🔧 Git / GitHub

**Auth :**
- Compte bot: `DoudouClaw` | Token: `.credentials/github-token.txt`
- Remote HTTPS uniquement | Login: `gh auth login --with-token < .credentials/github-token.txt`

**Hook post-commit :** auto-push vers `origin main` — refuse si `git user.name` ≠ `DoudouClaw`

**Règle miroir LTM :** chaque `memory_store` important → résumé dans `memory/YYYY-MM-DD.md` → durable → `MEMORY.md` → commit + push.

---

## 🔧 MCPorter (MCP)

**Version:** 0.7.3 | Commande de base: `mcporter list` / `mcporter call <serveur>.<outil>`

**GitHub MCP :**
- ⚠️ Intégration native OpenClaw ABANDONNÉE (corruption JSON) → MCPorter uniquement
- Architecture: HTTP remote `https://api.githubcopilot.com/mcp`
```bash
mcporter call github.search_repositories query:"user:Doudou-labo"
mcporter call github.create_issue owner:Doudou-labo repo:DoudouClaw title:"Bug" body:"Desc"
mcporter call github.get_file_contents owner:Doudou-labo repo:DoudouClaw path:README.md
```

**Obsidian MCP :** ⚠️ Configured (non testé) — `mcporter call obsidian.list_notes`

---

## 🤖 Agence-IA (Agents Spécialisés)

**Location:** `~/.openclaw/agency-agents/` — 112 agents

**Agents clés :**
- `backend-architect`, `frontend-developer`, `security-engineer`, `devops-automator`
- `growth-hacker`, `content-creator`, `agents-orchestrator`

**One-shot :**
```bash
sessions_spawn --task "..." --file ~/.openclaw/agency-agents/backend-architect/SOUL.md --mode run
```
**Session persistante :**
```bash
sessions_spawn --label "backend-venus" --task "..." --file ~/.openclaw/agency-agents/backend-architect/SOUL.md --mode session --thread true
```

**Docs :** `notes/areas/agent-orchestration.md` | `notes/resources/agent-routing-cheatsheet.md`

**Gotchas :**
- SOUL.md en anglais mais agents répondent en français (héritage config)
- `--file` obligatoire pour charger la personnalité
- Sessions persistantes: kill explicite requis (`subagents --action kill --target [label]`)

---

## 📅 Google Calendar

**Calendrier par défaut : OpenClaw**
- **Calendar ID:** `88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com`
- Ne jamais utiliser `primary` sauf demande explicite
- **Base URL:** `https://gateway.maton.ai/google-calendar/calendar/v3/calendars/<calendarId>/events`

**Autres IDs :**
- Perso: `tecknogeek69@gmail.com`
- Famille: `family14830406815357676768@group.calendar.google.com`
- Jours fériés FR: `fr.french#holiday@group.v.calendar.google.com`

---

## 🔍 Web Search

- Brave: `.credentials/brave-api-key.txt`
- Perplexity: `.credentials/perplexity-api-key.txt` (aussi env var `PERPLEXITY_API_KEY`)

**Gotcha :** config patch via `gateway config.patch` nécessite restart gateway.

---

## 🖥️ Navigateur (agent-browser + Playwright MCP)

**agent-browser (CLI direct) :**
```bash
agent-browser open <url>
agent-browser snapshot -i          # Accessibility tree avec refs
agent-browser click @e1            # Interagir via ref
agent-browser fill @e2 "texte"
agent-browser screenshot --annotate page.png
```
**Gotchas:** OS pas officiellement supporté → fallback Ubuntu 24.04 OK. Erreur librairies → `agent-browser install --with-deps`

**Playwright MCP (via MCPorter) :**
```bash
mcporter call playwright.browser_navigate url:"https://example.com"
mcporter call playwright.browser_snapshot
mcporter call playwright.browser_click element:"Sign in button"
mcporter call playwright.browser_screenshot
```
**Gotchas:**
- Nécessite `npx playwright install chromium`
- Mode headless par défaut
- Préférer Playwright MCP pour workflows MCP natifs, agent-browser pour CLI direct

**Envoi screenshot Discord :**
- Via `read` tool sur le fichier image (attache automatiquement) — recommandé
- Chemins **relatifs** obligatoires (`./images/...`), jamais absolus ou `~`

---

## 🖥️ Infrastructure

### ClawSuite
- **URL:** `http://localhost:3000` | Tailscale: `http://100.89.4.88:3000`
- **Gateway URL:** `ws://127.0.0.1:18789` | **MDP:** `DoudouClaw2026!`
- **Gotcha:** Ne pas modifier `gateway.bind` en `0.0.0.0` sans précaution

### Tailscale
- **IP serveur:** `100.89.4.88` | **IP iPhone:** `100.111.29.28`
```bash
tailscale status
tailscale ip -4
tailscale serve 3000    # Exposer via HTTPS Tailscale
```

### OpenClaw Gateway — Règle restart
- ⚠️ Restart = session WebSocket coupée → **prévenir Alexandre avant**
- Exception: modifs modèles dans `openclaw.json` → **PAS de restart nécessaire**
- Ne redémarrer que si : nouvelle clé API, changement port, bug gateway

---

## 🧠 Mémoire

### Memory-PARA-Sync (4x/jour)
**Crons UTC :** 09:00 / 13:00 / 18:30 / 22:30
```bash
scripts/unified-memory-para-sync.sh           # Exécution réelle
scripts/unified-memory-para-sync.sh --dry-run # Test sans effets
```
**Modules :** `scripts/modules/consolidate-memory-stack.sh` | `sync-para-structure.sh` | `discord-report-sender.sh`
**Rapport :** canal Discord `1474162917694898181` (🧠-mémoire)

### Proactive Observations (4x/jour — cron OpenClaw)
**Principe :** ne pas utiliser `crontab` système pour un reporting Discord de ce type. Utiliser des **crons OpenClaw prompt-based** qui exécutent un script, lisent le résultat, puis publient un compte rendu dans Discord comme les autres crons (veille IA, bourse, etc.).

**Script source :**
```bash
bash scripts/cron-proactive-observations.sh
```
Ce script produit un rapport intermédiaire dans :
```bash
tmp/cron-proactive-report.txt
```

**Crons actifs (heure Paris) :** 07:00 / 12:00 / 17:00 / 21:00

**Jobs OpenClaw :**
- `59117dfc-a0ec-4933-8435-5c1ed75d5c5d` — Morning
- `c784b13c-8a05-4bda-85b3-276bddc0417b` — Noon
- `f6c6f552-1153-4753-930c-3b504bee0363` — Afternoon
- `ee31cff3-1ece-478c-93a1-6f31a214e794` — Evening

**Salon Discord dédié :** `1487873994769174588`

**Gotchas :**
- Ne pas forcer un modèle de cron si ça déclenche un `LiveSessionModelSwitchError` ; laisser `default` si besoin.
- Le prompt du cron doit faire 3 choses : exécuter le script, lire `tmp/cron-proactive-report.txt`, reformuler proprement pour Discord.
- Si tu veux changer le salon, éditer les jobs via `openclaw cron edit <id> --channel discord --to <channelId>`.

### Context Manager (compression safe)
```bash
bash scripts/context-compress-preview.sh 'agent:main:...'   # Preview (read-only)
bash scripts/context-compress-apply.sh 'agent:main:...' RESET_OK  # Apply (destructif)
```

### memory-core (v2026.3.22+)
**Plugin natif OpenClaw** — remplace LanceDB depuis la v2026.3.22.
- Recherche via `memory_search` tool (embeddings OpenAI `text-embedding-3-large`)
- Sources indexées : `MEMORY.md`, `memory/YYYY-MM-DD.md`, `AGENTS.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `notes/**`
- Coût : ~$0.065/M tokens, négligeable (~$0.02/mois max)
- **Données LanceDB historiques** : toujours présentes dans `/root/.openclaw/memory/lancedb/` (3 Mo) — orphelines, inaccessibles sans migration manuelle

**Diagnostic:** `openclaw plugins list | grep memory`

### fsxmemory + QMD (⚠️ secondaire / legacy)
**Vault:** `memory/.fsxmemory/` + sous-dossiers `decisions/ lessons/ people/ projects/ procedures/ knowledge/ episodes/ inbox/ handoffs/`
- Utilisé comme fallback de recherche complémentaire si besoin
- **QMD :** version `1.1.5` | collection `memory` uniquement
```bash
qmd query "architecture mémoire agent"   # Hybride BM25 + vecteurs
qmd status / qmd update / qmd embed     # Maintenance
```
**Gotchas :**
- `qmd` peut tenter backend Vulkan avant fallback CPU — bruyant mais non bloquant

### TDAH Inbox Zero
**Location:** `skills/tdah-inbox-zero/SKILL.md`
**Principe:** "Je classe, tu exécutes" — une seule action suggérée.
**Déclencheurs :** message confus, brain dump 3+ items, heure tardive + anxiété, blocage/procrastination.
**Matrice :** Urgent+Important/Rapide → Quick Win | Long → Gros Morceau | Important/Rapide → Batch | Long → Planifier
**Guardrails :** pas de listes, une action max, idée de nuit → noter seulement, ne jamais laisser tout en "Urgent/Important" sans challenge.

---

## 🤖 Discord Bot

**Guild ID:** `1472335329527595038` | Bot: `@DoudouClaw`

**Config working :**
```json
{
  "channels": { "discord": {
    "enabled": true, "groupPolicy": "open",
    "guilds": { "1472335329527595038": { "requireMention": false, "reactionNotifications": "all" } },
    "intents": { "presence": false, "guildMembers": false }
  }}
}
```
**Gotchas :**
- Bot muet → vérifier **Message Content Intent** sur Discord Developer Portal
- `allowFrom: null` + aucun rôle → refuse tout le monde → fix: `allowFrom: ["*"]`
- Cross-context messaging bloqué (Discord ↔ Telegram)

**Diagnostic :**
```bash
openclaw status --deep | grep -A 5 Discord
journalctl -xe --no-pager | grep -i discord | tail -30
```

### Format Discord — Canal legifrance
Pas de tableaux Markdown. Format standard :
```
**N**
• Date : JJ/MM
• Type : emoji **TYPE**
• Texte : **Titre** - description courte
• Lien : https://url-complete
```
Emojis : 🏛️ LOI / 📜 DÉCRET / 📋 ARRÊTÉ / 📢 AVIS / ⚖️ DÉCISION / 📑 ORDONNANCE

---

## 💰 Préférences Finance

- Répondre **sans transactions** (soldes uniquement)
- Comptes **séparés** : Revolut | Portefeuille actions | PERCO Natixis
- Pas de total combiné sauf demande explicite

---

## 📁 Organisation des Fichiers

```
workspace/
├── SOUL.md / AGENTS.md / USER.md / MEMORY.md / TOOLS.md
├── SESSION-STATE.md / RECENT_CONTEXT.md
├── memory/YYYY-MM-DD.md / working-buffer.md
├── notes/projects/ areas/ resources/ archive/
├── images/     ← screenshots (chemins relatifs ./images/...)
├── pdf/        ← documents
├── scripts/    ← scripts utilitaires
├── skills/     ← skills installés
└── .credentials/ ← gitignored
```

---

*Backup local: `backups/TOOLS.md.backup-2026-03-22-*` | Dernière mise à jour: 2026-04-02*

## 🔍 Web Search

- Brave: `.credentials/brave-api-key.txt`
- Perplexity: `.credentials/perplexity-api-key.txt` (aussi env var `PERPLEXITY_API_KEY`)

**Gotcha :** config patch via `gateway config.patch` nécessite restart gateway.
**⚠️ Gotcha 2026-04-02:** API Perplexity en erreur d'auth récurrente → surveiller pattern défaillance régulière (~1/semaine)
