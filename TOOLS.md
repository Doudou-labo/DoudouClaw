# TOOLS.md - Configuration et Notes des Outils

> Documentation centralisée des outils, configurations, gotchas et procédures.

---

## 📑 Table des matières

- [⚡ Référence Rapide (Usage Quotidien)](#-référence-rapide-usage-quotidien)
- [🔧 Outils Essentiels](#-outils-essentiels)
  - [Git (Workflow Backup)](#github-backup-automation)
  - [MCPorter (MCP Integration)](#mcporter-mcp-integration)
  - [Google Calendar](#google-calendar)
  - [Web Search (Brave + Perplexity)](#web-search-api-brave--perplexity)
- [🛠️ Outils de Développement](#️-outils-de-développement)
  - [agent-browser (Vercel)](#agent-browser-vercel)
  - [ripgrep](#ripgrep-pour-les-recherches)
- [🖥️ Infrastructure et Déploiement](#️-infrastructure-et-déploiement)
  - [ClawSuite](#clawsuite)
  - [Tailscale](#tailscale)
  - [OpenClaw Gateway](#openclaw-gateway-restart--comportement)
- [🧠 Gestion de Contexte et Mémoire](#-gestion-de-contexte-et-mémoire)
  - [Context Manager](#context-manager-safe-compression)
  - [LanceDB / Memory plugin](#lancedb--memory-plugin-openclaw)
  - [fsxmemory + QMD](#fsxmemory--qmd)
- [🤖 Intégrations Discord](#-intégrations-discord)
  - [Discord Bot](#discord-bot-integration)
  - [Format Discord (Canal legifrance)](#format-discord--canal-legifrance)
- [📊 Automatisations et Monitoring](#-automatisations-et-monitoring)
  - [PARA + Self-Improving](#para--self-improving-automations)
  - [Evolution Protocol](#evolution-protocol-gep-inspired-sans-auto-mutation)
  - [Heartbeats Auto-Scripts](#heartbeats)
- [💰 Préférences Spécifiques](#-préférences-spécifiques)
  - [Finance (Alexandre)](#préférences-finance-alexandre)
  - [Writing Preferences](#writing-preferences)
- [📁 Organisation des Fichiers](#-organisation-des-fichiers)

---

## ⚡ Référence Rapide (Usage Quotidien)

| Besoin | Commande/Outil | Doc détaillée |
|--------|----------------|---------------|
| **Commit + push** | `git add . && git commit -m "msg" && git push` | [Git Workflow](#github-backup-automation) |
| **GitHub API** | `mcporter call github.<outil>` | [MCPorter](#mcporter-mcp-integration) |
| **Recherche web** | `web_search` tool ou Perplexity skill | [Web Search](#web-search-api-brave--perplexity) |
| **Calendrier** | API Maton (calendrier OpenClaw) | [Google Calendar](#google-calendar) |
| **Mémoire LTM** | `memory_store` / `memory_recall` | [LanceDB](#lancedb--memory-plugin-openclaw) |
| **Compression contexte** | `scripts/context-compress-preview.sh` | [Context Manager](#context-manager-safe-compression) |
| **Status gateway** | `openclaw status` | [Gateway](#openclaw-gateway-restart--comportement) |
| **Navigateur** | `agent-browser open <url>` | [Agent Browser](#agent-browser-vercel) |
| **Recherche fichiers** | `rg -n "pattern"` | [ripgrep](#ripgrep-pour-les-recherches) |
| **Playwright MCP** | `mcporter call playwright.browser_navigate` | [Playwright MCP](#playwright-mcp)

**Rappels rapides :**
- 🚨 **Pas de preuve = Pas fait** → Toujours montrer un PID/fichier/output quand je dis "je fais X"
- 🔒 **Gateway restart** → Prévenir Alexandre avant (session coupée)
- 📝 **Modèles** → Changement dans `openclaw.json` ne nécessite PAS restart

---

## 🔧 Outils Essentiels

### GitHub Backup Automation

**Status:** ✅ Active (2026-02-16)

**Workflow systématique (ancré dans AGENTS.md + SOUL.md) :**
- **Toute modification de fichier** → `git add` + `git commit` + `git push`
- Aucune exception (sauf secrets via `.gitignore`)
- Garantit zéro divergence local vs GitHub

**Commande rapide :**
```bash
git add <fichiers> && git commit -m "description" && git push origin main
```

**Hook post-commit automatique :**
- Fichier: `.git/hooks/post-commit`
- Action: auto-push vers `origin main` après chaque commit
- Garde-fous: refuse push si `origin` pas en HTTPS ou si `git user.name` ≠ `DoudouClaw`

**Auth Git :**
- Compte: `DoudouClaw` (bot)
- Token: `.credentials/github-token.txt`
- Remote: HTTPS uniquement (`https://github.com/...`)
- Login: `gh auth login --with-token < .credentials/github-token.txt`

**Règle mémoire (LTM) :**
- Chaque `memory_store` important → miroir dans `memory/YYYY-MM-DD.md` (1-3 lignes)
- Durable → promouvoir vers `MEMORY.md`
- Puis commit + push systématique

---

### MCPorter (MCP Integration)

**Status:** ✅ Installed (2026-03-01) — **Version:** 0.7.3

**Description:** CLI pour gérer les serveurs MCP (Model Context Protocol).

**Commandes de base :**
```bash
mcporter list                          # Lister serveurs
mcporter list github --schema          # Voir outils disponibles
mcporter call github.get_file_contents owner:Doudou-labo repo:DoudouClaw path:README.md
```

**Serveurs configurés :**

#### GitHub MCP (Official Remote)
**Status:** ✅ Working (via MCPorter uniquement)
**Architecture:** HTTP remote vers `https://api.githubcopilot.com/mcp`
**⚠️ Important:** Intégration native OpenClaw ABANDONNÉE (corruption JSON). On reste sur MCPorter.

**Outils disponibles :** 20+
- `github.search_repositories`
- `github.create_issue`
- `github.create_pull_request`
- `github.get_file_contents`
- etc.

**Exemples :**
```bash
mcporter call github.search_repositories query:"user:Doudou-labo"
mcporter call github.create_issue owner:Doudou-labo repo:DoudouClaw title:"Bug" body:"Desc"
mcporter call github.create_pull_request owner:Doudou-labo repo:DoudouClaw title:"Feature" head:branch base:main
```

#### Obsidian MCP
**Status:** ⚠️ Configured (not tested)
```bash
mcporter call obsidian.list_notes
mcporter call obsidian.search query:"PARA"
```

---

### Google Calendar

**Status:** ✅ Active (via Maton API)

**Préférence calendrier:**
- Toujours utiliser le calendrier **OpenClaw** pour toutes opérations
- **Calendar ID:** `88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com`
- Ne jamais utiliser `primary` sauf demande explicite

**Autres calendriers :**
- `tecknogeek69@gmail.com` — calendrier principal perso
- `family14830406815357676768@group.calendar.google.com` — Famille
- `fr.french#holiday@group.v.calendar.google.com` — Jours fériés

**Base URL:** `https://gateway.maton.ai/google-calendar/calendar/v3/calendars/<calendarId>/events`

---

### Web Search API (Brave + Perplexity)

**Status:** ✅ Configured (2026-02-17)

**Clés API :**
- Brave: `.credentials/brave-api-key.txt`
- Perplexity: `.credentials/perplexity-api-key.txt`

**Commandes utiles :**
```bash
# Test Brave Search
openclaw web-search "cours Michelin janvier 2026"

# Test Perplexity via skill
node skills/perplexity/scripts/search.mjs "cours Michelin janvier 2026"
```

**Gotchas:**
- Config patch via `gateway config.patch` nécessite restart
- Perplexity aussi via env var `PERPLEXITY_API_KEY` pour le skill CLI

---

## 🛠️ Outils de Développement

### agent-browser (Vercel)

**Status:** ✅ Installed (2026-02-26) — **Version:** 0.15.0

**Installation:**
```bash
npm install -g agent-browser
agent-browser install  # Télécharge Chromium (~280MB)
```

**Workflow de base :**
```bash
# 1. Ouvrir une page
agent-browser open example.com

# 2. Récupérer l'accessibility tree avec refs
agent-browser snapshot -i
# Output: - link "Learn more" [ref=e1]

# 3. Interagir via les refs
agent-browser click @e1
agent-browser fill @e2 "texte"

# 4. Screenshot annoté
agent-browser screenshot --annotate page.png
```

**Commandes utiles :**
```bash
agent-browser open <url> --headed    # Mode visible (debug)
agent-browser snapshot -i -c -d 5    # Interactif + compact + depth 5
agent-browser pdf output.pdf         # Export PDF
```

**Gotchas:**
- Premier lancement : Chromium se télécharge (~280MB)
- Si erreur librairies : `agent-browser install --with-deps`
- OS pas officiellement supporté → fallback Ubuntu 24.04 (fonctionne)

**Docs:** https://github.com/vercel-labs/agent-browser

---

### Playwright MCP

**Status:** ✅ Configured via MCPorter (2026-03-02)

**Description:** Serveur MCP officiel Microsoft pour l'automatisation navigateur via Playwright. Fournit des capacités de navigation, interaction, screenshot et assertion via le protocole MCP. Alternative à agent-browser avec une intégration native MCP.

**Installation:**
```bash
# Via MCPorter (recommandé)
mcporter add playwright npx @playwright/mcp@latest

# Ou installation globale
npm install -g @playwright/mcp
```

**Commandes utiles :**
```bash
# Lister les outils disponibles
mcporter list playwright --schema

# Navigation
mcporter call playwright.browser_navigate url:"https://example.com"

# Snapshot (accessibility tree)
mcporter call playwright.browser_snapshot

# Cliquer sur un élément
mcporter call playwright.browser_click element:"Sign in button"

# Saisir du texte
mcporter call playwright.browser_type element="Search input" text="query"

# Screenshot
mcporter call playwright.browser_screenshot
```

**Gotchas:**
- Nécessite Chromium/Chrome installé (`npx playwright install chromium`)
- Utilise l'accessibility tree (comme agent-browser) plutôt que des coordonnées
- Mode headless par défaut, ajouter `--headed` pour debug visuel
- Conflit potentiel avec agent-browser si les deux tentent de contrôler le navigateur
- Préférer Playwright MCP pour les workflows MCP natifs, agent-browser pour l'usage CLI direct

**Envoi de screenshots sur Discord:**
Après avoir pris un screenshot avec `browser_take_screenshot`, utiliser l'une de ces méthodes :

1. **Via `read` tool (recommandé)** — attache l'image directement à la réponse :
   ```bash
   # Le tool read sur une image l'attache automatiquement
   read: { "file_path": "./screenshot.png" }
   ```

2. **Via syntaxe `MEDIA:` dans le texte** :
   ```
   MEDIA:./screenshot.png
   Caption optionnel ici
   ```

⚠️ **Contraintes :**
- Utiliser des chemins **relatifs** (`./` ou `../`), jamais absolus (`/...`) ou `~` (bloqués)
- Les images très grandes (>6000px de hauteur) peuvent mettre du temps à s'afficher
- Le tool `message` avec `media` nécessite un token bot Discord configuré (préférer `read`)

**Docs:** https://github.com/microsoft/playwright-mcp

---

### ripgrep pour les recherches

**Status:** ✅ installé (15 février 2026)

**Pourquoi:** Recherche rapide dans les fichiers (alternative à `grep` plus rapide).

**Installation:** `apt-get install ripgrep`

**Commandes utiles :**
```bash
rg -n "pattern"          # Recherche avec numéros de ligne
rg --files               # Lister tous les fichiers
```

**Gotcha historique:**
- Dépot tiers `monarx.list` retournait 404 → renommé en `.disabled`

---

## 🖥️ Infrastructure et Déploiement

### ClawSuite

**Status:** ✅ Installed (2026-03-01) — **Version:** 3.0.0

**Location:** `/root/.openclaw/workspace/clawsuite/`

**Description:** Full-stack mission control platform pour OpenClaw — dashboard web avec orchestration multi-agents, cost analytics, Memory Browser.

**Installation:**
```bash
git clone https://github.com/outsourc-e/clawsuite.git
cd clawsuite
npm install
cp .env.example .env
# Éditer .env avec GATEWAY_URL, GATEWAY_TOKEN, STUDIO_PASSWORD
npm run dev  # Démarre sur http://localhost:3000
```

**Configuration actuelle:**
- Gateway URL: `ws://127.0.0.1:18789`
- Port: 3000
- Bind: `0.0.0.0` (accessible via Tailscale)
- Mot de passe UI: `DoudouClaw2026!`
- Tailscale IP: `100.89.4.88:3000`

**Accès:**
- Local: `http://localhost:3000`
- Tailscale: `http://100.89.4.88:3000`

**Gotchas:**
- Nécessite Gateway OpenClaw actif
- Ne pas modifier `gateway.bind` en `0.0.0.0` sans précaution (risque coupure Gateway)

---

### Tailscale

**Status:** ✅ Installed (2026-03-01) — **Version:** 1.94.2

**Description:** VPN mesh pour accès sécurisé aux services locaux depuis n'importe où.

**Installation:**
```bash
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/noble.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/noble.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list
sudo apt update && sudo apt install -y tailscale
```

**Configuration:**
- IP serveur: `100.89.4.88`
- IP iPhone: `100.111.29.28`
- Auth: via lien `https://login.tailscale.com/a/...`

**Commandes utiles :**
```bash
tailscale status          # Voir devices connectés
tailscale ip -4          # IP Tailscale de cette machine
tailscale serve 3000     # Exposer ClawSuite sur URL Tailscale HTTPS
tailscale serve off      # Arrêter le serve
```

**Gotchas:**
- Nécessite auth web à la première installation
- Utiliser `tailscale serve` (HTTPS) plutôt que bind sur `0.0.0.0`

---

### OpenClaw gateway restart — Comportement

**⚠️ Problème:** Quand `openclaw gateway restart` est lancé, la session WebSocket est coupée → réponse perdue → Alexandre doit renvoyer un message.

**Règle:**
- **Toujours prévenir Alexandre AVANT** : "Je redémarre le gateway, renvoie-moi un message après"
- **Exception:** Modifications modèles dans `openclaw.json` (section `agents.defaults.models`) **ne nécessitent PAS de restart** — config rechargée auto
- Ne redémarrer que si strictement nécessaire (nouvelle clé API, changement port, bug gateway)

---

## 🧠 Gestion de Contexte et Mémoire

### Context Manager (safe compression)

**Status:** ✅ Installed (2026-02-13)

**Source:** `skills/context-manager/` (plgonzalezrx8/context-manager)

**Procédure safe (2 étapes):**
```bash
# 1) Preview (read-only, aucun reset)
bash scripts/context-compress-preview.sh 'agent:main:telegram:group:-1003791371950:topic:37'

# 2) Apply (destructif: reset + inject) avec confirmation explicite
bash scripts/context-compress-apply.sh 'agent:main:telegram:group:-1003791371950:topic:37' RESET_OK
```

**Traçabilité:** Les scripts ajoutent une trace dans `memory/YYYY-MM-DD.md` + commit/push automatique.

---

### LanceDB / Memory plugin (OpenClaw)

**Status:** ✅ Working (corrigé le 2026-02-13)

**Symptôme rencontré:** `memory_store` en erreur: `Cannot find module '@lancedb/lancedb'`

**Diagnostic:**
```bash
openclaw status
openclaw ltm list
```

**Correctif appliqué:**
```bash
cd /usr/lib/node_modules/openclaw
npm i @lancedb/lancedb
openclaw gateway restart
```

**Validation:** Test `memory_store` + `memory_recall` OK

**Note:** `openclaw status` peut afficher `Memory ... unavailable` de façon transitoire malgré des tools mémoire fonctionnels.

---

### fsxmemory + QMD

**Status:** ✅ Installé et opérationnel (2026-03-09)

**Objectif:** Ajouter une couche mémoire fichier-first pour la résilience au context death, les handoffs et la recherche structurée, sans remplacer la mémoire native OpenClaw.

**Décision d’architecture:**
- `fsxmemory` retenu comme couche **checkpoint / recover / handoff / recherche**
- `mem0` et `Cognee` mis de côté pour évaluation future
- Mode d’usage validé: **niveau 2.5** (naturel + semi-automatique, sans sur-structuration)

**Composants installés:**
- Skill: `skills/fsxmemory/`
- Scripts:
  - `scripts/fsxmemory-checkpoint.sh`
  - `scripts/fsxmemory-recover.sh`
  - `scripts/fsxmemory-handoff.sh`
  - `scripts/fsxmemory-recap.sh`
  - `scripts/fsxmemory-remember.sh`
  - `scripts/fsxmemory-capture.sh`
  - `scripts/fsxmemory-search.sh`
  - `scripts/fsxmemory-vsearch.sh`
  - `scripts/fsxmemory-stats.sh`
  - `scripts/fsxmemory-link.sh`
  - `scripts/fsxmemory-migrate.sh`
  - `scripts/fsxmemory-doctor.sh`
  - `scripts/fsxmemory-deathwatch.sh`

**Structure vault créée dans `memory/`:**
```bash
memory/.fsxmemory/
memory/handoffs/
memory/decisions/
memory/lessons/
memory/people/
memory/projects/
memory/procedures/
memory/knowledge/
memory/episodes/
memory/inbox/
```

**QMD:**
- Package global: `@tobilu/qmd`
- Version validée: `qmd 1.1.5`
- Collection active: **`memory` uniquement**
- État validé au 2026-03-09:
  - `43` fichiers indexés
  - `1918` embeddings/chunks
- Script de recherche sémantique:
```bash
bash scripts/fsxmemory-vsearch.sh "décisions importantes"
bash scripts/fsxmemory-vsearch.sh "décisions importantes" --deep
```

**Usage recommandé (mode 2.5):**
- Conversation naturelle côté utilisateur
- Mapping agent côté système :
  - “note ça vite” → `capture`
  - “retiens ça / on a décidé que” → `remember`
  - “si ça coupe on reprend là” → `checkpoint`
  - “on s’arrête là” → `handoff`
  - “tu te rappelles…” → `search` / `vsearch`

**Gotchas:**
- Le package npm original `@foresigxt/foresigxt-cli-memory` n’était pas publiquement disponible → implémentation bash maison des commandes.
- `qmd` tente parfois un backend Vulkan avant de retomber en CPU sur ce VPS; c’est bruyant mais non bloquant.
- Pour l’instant, **ne pas indexer `notes/` ni `workspace/`** dans qmd pour éviter le bruit et les temps de calcul inutiles.
- `fsxmemory-vsearch.sh` fonctionne, mais le premier chargement local du modèle peut être lent sur CPU.

---

## 🤖 Intégrations Discord

### Discord Bot Integration

**Status:** ✅ Working (corrigé le 2026-02-18)

**Configuration:**
- Token: dans config OpenClaw (`channels.discord.token`)
- Guild ID: `1472335329527595038`
- Bot username: `@DoudouClaw`
- Rôles: OWNER + BOT + DoudouClaw (managed)

**Fix majeur (18 fév 2026) — Intents:**
- Activer **Message Content Intent** sur Discord Developer Portal (obligatoire)
- Désactiver `Guild Members` et `Presence` dans config OpenClaw

**Config actuelle (working):**
```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "groupPolicy": "open",
      "guilds": {
        "1472335329527595038": {
          "requireMention": false,
          "reactionNotifications": "all"
        }
      },
      "intents": {
        "presence": false,
        "guildMembers": false
      }
    }
  }
}
```

**Gotchas:**
- Si bot ne reçoit plus de messages → vérifier intents (Developer Portal + config OpenClaw)
- Cross-context messaging bloqué (Discord ↔ Telegram)
- **Commandes "not authorized":** Si `channels.discord.allowFrom` est null ET aucun rôle → refuse tout le monde. Fix: `allowFrom: ["*"]`

**Commandes utiles :**
```bash
openclaw status --deep | grep -A 5 Discord
journalctl -xe --no-pager | grep -i discord | tail -30
```

---

### Format Discord — Canal ⚖️-legifrance

**Règle validée (2026-03-01):**
- Sur Discord, **ne jamais utiliser de tableaux Markdown** (illisibles)
- Format standard pour les textes juridiques :

```
**N**
• Date : JJ/MM
• Type : emoji **TYPE**
• Texte : **Titre** — description courte
• Lien : https://url-complete
```

- URLs en clair (pas de `[texte](url)`)
- Titres en **gras**
- Emojis par type : 🏛️ LOI / 📜 DÉCRET / 📋 ARRÊTÉ / 📢 AVIS / ⚖️ DÉCISION / 📑 ORDONNANCE

---

## 📊 Automatisations et Monitoring

### PARA + Self-Improving Automations

**Status:** ✅ Working (setup 2026-02-13)

**Scripts:**
```bash
scripts/auto-para-checkpoint.sh          # checkpoint PARA 3-min (midi/soir)
scripts/auto-para-weekly-review.sh       # revue hebdo PARA
scripts/auto-self-improve-review.sh      # revue hebdo self-improving
```

**Traçabilité GitHub:** Chaque script fait `git add` ciblé + `git commit` + `git push`

**Crons créés:**
- `PARA Auto - 3min midi (git sync)`
- `PARA Auto - 3min soir (git sync)`
- `PARA Auto - revue hebdo (git sync)`
- `Self-Improve Auto - revue hebdo (git sync)`

---

### Evolution Protocol (GEP-inspired, sans auto-mutation)

**Status:** ✅ Active (2026-02-17)

**Vision:** Emprunter les bonnes idées de `autogame-17/evolver` (protocole structuré, analyse logs) mais **rejeter** l'auto-mutation, mode "Mad Dog", identity injection.

**Composants:**

1. **evolution-log.jsonl** (#14)
   - Log structuré des événements d'évolution
   - Script: `skills/self-improving-agent/scripts/log-evolution.sh`

2. **Métadonnées enrichies .learnings** (#15)
   - YAML frontmatter pour chaque learning
   - Template: `skills/self-improving-agent/.learnings/TEMPLATE.md`
   - Script: `skills/self-improving-agent/scripts/create-learning.sh`

3. **analyze-errors.sh** (#16)
   - Analyse logs + memory files (7 derniers jours)
   - Rapport: `reports/error-analysis-YYYY-MM-DD.md`
   - **Aucune correction auto**, juste alertes

4. **evolution-dashboard.md** (#17)
   - Vue consolidée: `notes/areas/evolution-dashboard.md`
   - Script: `scripts/update-evolution-dashboard.sh`

**Crons:**
- Evolution Dashboard: 08:00 et 19:00 tous les jours
- Error Analysis: 20:00 tous les dimanches

---

### Heartbeats

Scripts automatiques (ajoutés 2026-02-17):

```bash
scripts/heartbeat-auto-heal.sh      # Nettoie cooldowns API, alerte tokens OAuth
scripts/heartbeat-auto-commit.sh    # Auto-commit + push des changements
scripts/heartbeat-auto-optimize.sh  # Ajuste fréquence crons si besoin
scripts/heartbeat-auto-learn.sh     # Détecte patterns d'erreurs nouveaux
scripts/heartbeat-auto-alert.sh     # Alertes GitHub/CRM/Finance/Disk
scripts/heartbeat-auto-cleanup.sh   # Cleanup .tmp, rotation logs
```

---

## 💰 Préférences Spécifiques

### Préférences Finance (Alexandre)

- Quand Alexandre demande l'état/détail de ses comptes: répondre **sans transactions** (soldes uniquement)
- Afficher les comptes **séparés**: Revolut, portefeuille actions, PERCO Natixis
- **Ne pas** donner de total combiné, sauf demande explicite

---

### Writing Preferences

- Répondre en **français** par défaut
- **Tutoiement**
- Style **direct, concret, utile** — pas de langue de bois
- Réponses détaillées par défaut
- Ton **amical**, sans lourdeur
- **Emojis** dans les réponses (préférence explicite) 😄✨
- **Transparence:** `Agents utilisés : ...` à chaque réponse
- **Structure:** TL;DR court → détail structuré → `Prochaine action recommandée`
- **Incertitude:** niveau de confiance (faible/moyen/élevé) quand pertinent
- **Proactivité encadrée:** proposer initiatives, demander validation avant action sensible/externe
- **Jurons français:** utilisés sans modération (putain, merde, fait chier, bordel, etc.)
- **Règle d'arbitrage:** en cas tension style/fond, privilégier utilité décisionnelle

---

## 📁 Organisation des Fichiers

```
/root/.openclaw/workspace/
├── SOUL.md                    # Qui je suis
├── AGENTS.md                  # Règles de fonctionnement
├── USER.md                    # Qui est Alexandre
├── MEMORY.md                  # Mémoire long terme curée
├── TOOLS.md                   # Ce fichier
├── TOOLS.md.backup-*          # Backups (dossier backups/)
├── SESSION-STATE.md           # État session actif
├── RECENT_CONTEXT.md          # Contexte récent auto-updaté
├── memory/
│   ├── YYYY-MM-DD.md         # Notes journalières
│   └── working-buffer.md     # Buffer si contexte >60%
├── notes/
│   ├── projects/             # Projets (travail avec fin)
│   ├── areas/                # Responsabilités continues
│   ├── resources/            # Références, guides
│   └── archive/              # Terminé/inactif
├── images/                   # Screenshots et images (PNG, JPG)
├── pdf/                      # Documents PDF
├── scripts/                  # Scripts utilitaires
├── skills/                   # Skills installés
├── config/                   # Configurations
└── .credentials/             # Secrets (gitignored)
```

**Règles de rangement:**
- 📸 Screenshots/images → `images/` (chemins relatifs: `./images/...`)
- 📄 Documents PDF → `pdf/` (chemins relatifs: `./pdf/...`)
- 🚫 Pas de fichiers binaires à la racine du workspace

---

## 🔄 Changelog

| Date | Changement |
|------|------------|
| 2026-03-02 | Ajout Playwright MCP dans outils développement |
| 2026-03-02 | Réorganisation complète (Option A): TOC, Quick Reference, regroupement par fréquence |
| 2026-03-01 | Ajout MCPorter, ClawSuite, Tailscale |
| 2026-02-26 | Ajout agent-browser |
| 2026-02-24 | Ajout comportement gateway restart |
| 2026-02-22 | Ajout préférences langage, transparence orchestration |
| 2026-02-18 | Fix Discord Bot Integration (intents) |
| 2026-02-17 | Ajout Evolution Protocol, Web Search API |
| 2026-02-16 | Ajout GitHub Backup Automation |
| 2026-02-13 | Ajout Context Manager, LanceDB fix, PARA automations |

---

*Backup original disponible dans `backups/TOOLS.md.backup-2026-03-02`*

Quand je te demande de tester une clé API tu le fais
