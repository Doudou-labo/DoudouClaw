# TOOLS.md - Tool Configuration & Notes

> Document tool-specific configurations, gotchas, and credentials here.

---

## agent-browser (Vercel)

**Status:** ✅ Installed (2026-02-26)

**Version:** 0.15.0

**Description:** Browser automation CLI pour agents IA — Rust natif + Playwright. Parfait pour le scraping, l'automation web et les tests.

**Installation:**
```bash
npm install -g agent-browser
agent-browser install  # Télécharge Chromium
```

**Workflow de base (pour agents):**
```bash
# 1. Ouvrir une page
agent-browser open example.com

# 2. Récupérer l'accessibility tree avec refs
agent-browser snapshot -i
# Output: - link "Learn more" [ref=e1]

# 3. Interagir via les refs
agent-browser click @e1
agent-browser fill @e2 "texte"

# 4. Screenshot annoté (avec numéros sur les éléments)
agent-browser screenshot --annotate page.png
```

**Commandes utiles:**
```bash
agent-browser --version
agent-browser --help
agent-browser open <url> --headed  # Mode visible (debug)
agent-browser snapshot -i -c -d 5  # Interactif + compact + depth 5
agent-browser pdf output.pdf       # Export PDF
```

**Gotchas:**
- Premier lancement : Chromium se télécharge (~280MB)
- Si erreur de librairies système : `agent-browser install --with-deps`
- OS pas officiellement supporté → fallback Ubuntu 24.04 (fonctionne quand même)

**Docs:** https://github.com/vercel-labs/agent-browser

---

## Credentials Location

All credentials stored in `.credentials/` (gitignored):
- `example-api.txt` - Example API key

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
- Touche d'humour légère quand pertinent
- Inclure des emojis dans les réponses (préférence explicite utilisateur) 😄✨
- Transparence orchestration: ajouter `Agents utilisés : ...` à chaque réponse (global, sauf demande contraire)
- Routage global: `main` pour simple, `main -> spec-*` pour moyen/technique mono-domaine, `spec-orchestrator` pour multi-domaines
- Règle orchestrator: s’il est utilisé, il doit déléguer à ≥1 spécialiste `spec-*` (sinon rester en `main`)
- Déclencheur hard: si la demande couvre 2+ domaines, ne pas traiter en `main`; passer par orchestrator + specs.
- Déclencheur explicite: si l’utilisateur écrit "utilise les agents nécessaires", forcer le passage orchestrator.
- Orchestration interactive: utiliser `sessions_send` vers les agents persistants pour éviter les auto-announces de `sessions_spawn` dans le channel.
- Transparence exacte: `Agents utilisés` doit lister les agents réellement invoqués (pas uniquement `main`).
- Structure de réponse par défaut: TL;DR (2-3 lignes) → détail structuré → `Prochaine action recommandée`
- UX format: ne pas afficher le titre littéral `TL;DR`; commencer directement par le résumé court
- En cas de désaccord: expliciter le point contesté, le pourquoi, les bases et l’alternative
- Incertitude: afficher le niveau de confiance (faible/moyen/élevé) quand utile; ne jamais inventer
- Proactivité encadrée: proposer des initiatives, mais demander validation avant action externe/sensible/impactante
- Sur sujets sensibles: reformuler émotion + enjeu avant recommandation
- Anti-biais: signaler les biais possibles avec tact + proposer un contre-test simple
- Règle d’arbitrage: en cas de tension style/fond, privilégier l’utilité décisionnelle (clarté, honnêteté, actionnabilité)
- Règle d’arbitrage (format): TL;DR court puis détail proportionné à l’enjeu
- Règle d’arbitrage (sécurité): conserver validation préalable pour actions sensibles/externes
- Emojis: augmenter la densité d’emojis dans les réponses (tout en restant lisible et utile)
- Auto-recherche web (Option C): mode hybride — modes permanents activables + détection ponctuelle sur questions factuelles
- Commande mode: "mode [domaine] on/off" pour activer/désactiver la recherche auto sur un domaine
- Détection implicite: patterns "Qu'est-ce que tu penses de...", "Tu connais...", "C'est quoi...", "Il est sorti quand..."
- Domaines prioritaires auto-recherche: films/séries, tech, actualités, finance, sport
- Seuil déclenchement: uniquement si valeur informationnelle claire pour la conversation
- Langage: jurons français (putain, merde, fait chier, bordel, etc.) utilisés sans modération — authenticité systématique, intégré à l'identité DoudouClaw

## Préférences Finance (Alexandre)

- Quand Alexandre demande l’état/détail de ses comptes: répondre **sans transactions** (soldes uniquement).
- Afficher les comptes **séparés**: Revolut, portefeuille actions, PERCO Natixis.
- **Ne pas** donner de total combiné, sauf demande explicite.

---

## GitHub Backup Automation

**Status:** ✅ Active (2026-02-16)

**Workflow systématique (ancré dans AGENTS.md + SOUL.md) :**
- **Toute modification de fichier** → `git add` + `git commit` + `git push`
- Aucune exception (sauf secrets via `.gitignore`)
- Garantit zéro divergence local vs GitHub

**Hook post-commit automatique :**
- Fichier: `.git/hooks/post-commit`
- Action: auto-push vers `origin main` après chaque commit
- Garde-fous actifs: refuse push si `origin` n'est pas en HTTPS ou si `git user.name` ≠ `DoudouClaw`
- Rend le push transparent et systématique

**Scripts additionnels :**
- `scripts/weekly-backup-tag.sh` — tag hebdo pour snapshots
- `scripts/auto-para-checkpoint.sh` — checkpoint PARA avec commit/push
- `scripts/auto-para-weekly-review.sh` — revue hebdo avec commit/push
- `scripts/auto-self-improve-review.sh` — revue self-improving avec commit/push

**Note technique :**
- Mode retenu: **HTTPS + token bot** (compte `DoudouClaw`)
- Token source: `.credentials/github-token.txt` (gitignored)
- Login recommandé: `gh auth login --with-token < .credentials/github-token.txt`
- Le remote Git doit rester en HTTPS (`https://github.com/...`), pas SSH
- Hook fonctionne en mode interactif (sessions agent OpenClaw)

**4 méthodes en place (verrouillage anti-oubli commit/push) :**
1. `AGENTS.md` → workflow Git non négociable
2. `SOUL.md` → principe "documenté ET versionné"
3. `TOOLS.md` → procédure opérationnelle centralisée
4. `.git/hooks/post-commit` → auto-push systématique

**Règle mémoire (ajout 2026-02-16, renforcée 2026-02-22) :**
- Si une mémoire est ajoutée/supprimée via tools (`memory_store` / `memory_forget`), consigner la trace utile dans un fichier mémoire local (`memory/YYYY-MM-DD.md` ou `MEMORY.md`) puis commit + push.
- **Règle miroir opérationnelle :** chaque `memory_store` important doit avoir un miroir lisible Git (1-3 lignes minimum dans `memory/YYYY-MM-DD.md`).
- Si l'information est durable (préférence stable, décision long terme, relation clé), la promouvoir ensuite dans `MEMORY.md`.
- **Politique d'accès mémoire N1/N2/N3 :**
  - N1 actif: `SESSION-STATE.md` + `MEMORY.md` + journal du jour
  - N2 référence: `notes/areas/contexte-personnel-reference.md` (au besoin)
  - N3 archive sensible: `notes/archive/contexte-sensible-rupture.md` (demande explicite ou arbitrage contradiction uniquement)
- Compatibilité: cette politique n'écrase pas les skills mémoire; elle définit seulement *quand* lire/écrire chaque couche.

## Google Calendar

**Status:** ✅ Active (via Maton API)

**Préférence calendrier:**
- Toujours utiliser le calendrier **OpenClaw** pour toutes opérations (ajout, suppression, modification)
- **Calendar ID:** `88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com`
- Ne jamais utiliser `primary` sauf demande explicite d'Alexandre

**Autres calendriers disponibles:**
- `tecknogeek69@gmail.com` — calendrier principal perso
- `family14830406815357676768@group.calendar.google.com` — Famille
- `fr.french#holiday@group.v.calendar.google.com` — Jours fériés

**Base URL:** `https://gateway.maton.ai/google-calendar/calendar/v3/calendars/<calendarId>/events`

---

## Web Search API (Brave + Perplexity)

**Status:** ✅ Configured (2026-02-17)

**Brave Search:**
- Clé stockée dans: `.credentials/brave-api-key.txt`
- Config: `tools.web.search.apiKey`
- Provider: Brave Search API

**Perplexity:**
- Clé stockée dans: `.credentials/perplexity-api-key.txt`
- Config: `tools.web.search.perplexity.apiKey` + `env.vars.PERPLEXITY_API_KEY`
- Provider: Perplexity / OpenRouter

**Commandes utiles:**
```bash
# Test Brave Search
openclaw web-search "cours Michelin janvier 2026"

# Test Perplexity via skill
node skills/perplexity/scripts/search.mjs "cours Michelin janvier 2026"
```

**Gotchas:**
- Les deux clés sont dans `.credentials/` (gitignored)
- Config patché via `gateway config.patch` (nécessite restart)
- Perplexity passe aussi via variable d'environnement pour le skill CLI

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

## Evolution Protocol (GEP-inspired, sans auto-mutation)

**Status:** ✅ Active (2026-02-17)

**Vision:**
- Emprunter les bonnes idées du skill `autogame-17/evolver` (protocole structuré, analyse logs)
- **Rejeter** l'auto-mutation, le mode "Mad Dog", l'identity injection
- Garder le contrôle humain total, transparence, rigueur

**Composants installés:**

1. **evolution-log.jsonl** (#14)
   - Log structuré des événements d'évolution (bug/optimization/new-capability/refactor)
   - Format JSONL avec timestamp, category, context, lesson, applied, impact, parent_id
   - Script helper: `skills/self-improving-agent/scripts/log-evolution.sh`
   - Doc: `skills/self-improving-agent/EVOLUTION-PROTOCOL.md`

2. **Métadonnées enrichies .learnings** (#15)
   - YAML frontmatter pour chaque learning (date, category, severity, status, impact, related)
   - Template: `skills/self-improving-agent/.learnings/TEMPLATE.md`
   - Script création: `skills/self-improving-agent/scripts/create-learning.sh`
   - Doc: `skills/self-improving-agent/METADATA-GUIDE.md`

3. **analyze-errors.sh** (#16)
   - Analyse automatique logs + memory files (derniers 7 jours)
   - Détecte patterns récurrents, outils problématiques
   - Génère rapport markdown: `reports/error-analysis-YYYY-MM-DD.md`
   - **Aucune correction auto**, juste alertes et recommandations
   - Doc: `scripts/README-analyze-errors.md`

4. **evolution-dashboard.md** (#17)
   - Vue consolidée de l'évolution (stats, timeline, top learnings, open loops)
   - Généré par: `scripts/update-evolution-dashboard.sh`
   - Localisation: `notes/areas/evolution-dashboard.md`
   - Agrège données de learnings + evolution-log.jsonl

**Workflow:**

1. **Quand un problème survient:**
   ```bash
   # Créer learning avec métadonnées
   ./skills/self-improving-agent/scripts/create-learning.sh \
     "Tool X fails on large files" "bug" "high"
   
   # Éditer le fichier pour compléter Context/Lesson/Fix/Impact
   ```

2. **Après correction:**
   ```bash
   # Logger événement d'évolution
   ./skills/self-improving-agent/scripts/log-evolution.sh \
     "bug" "Tool X timeout fixed" "Added retry logic" "true" "0 timeouts in 50 runs"
   
   # Mettre à jour learning: status=applied, impact mesuré
   ```

3. **Analyses périodiques:**
   ```bash
   # Erreurs hebdo
   bash scripts/analyze-errors.sh
   
   # Dashboard mis à jour
   bash scripts/update-evolution-dashboard.sh
   ```

4. **Traçabilité GitHub:**
   - Créer Issues pour améliorations structurelles (workflow validé avec Alexandre)
   - Référencer issues dans commits (`fixes #123`)
   - Commits systématiques via identité bot DoudouClaw

**GitHub Issues associées:**
- #13 : [Meta] Workflow d'évolution structurée
- #14 : evolution-log.jsonl ✅
- #15 : Métadonnées .learnings ✅
- #16 : analyze-errors.sh ✅
- #17 : evolution-dashboard.md ✅

**Différences vs autogame-17/evolver:**

| Aspect | Evolver original | Notre implémentation |
|--------|------------------|---------------------|
| Auto-mutation | ✅ Oui (Mad Dog mode) | ❌ Non |
| Validation humaine | ⚠️ Optionnelle (--review) | ✅ Obligatoire |
| Identity injection | ✅ "Recursive Self-Improving" | ❌ Identité standard |
| Protocole événements | ✅ GEP (genes/capsules/events) | ✅ Events only (simplifié) |
| Analyse logs | ✅ Oui | ✅ Oui (amélioré) |
| Reporting | ⚠️ Limité | ✅ Dashboards détaillés |
| Traçabilité GitHub | ❌ Non | ✅ Issues + commits |

**Alignment avec objectifs Alexandre:**
- ✅ Rigueur : workflow formalisé, métadonnées structurées
- ✅ Transparence : tout documenté + versionné Git
- ✅ Contrôle : humain décide, agent propose
- ✅ Apprentissage : learnings tracés, dashboard d'évolution

**Crons automatiques (ajoutés 2026-02-17) :**

1. **Evolution Dashboard - Mise à jour 8h**
   - ID: `ae293b73-ee13-403f-a034-81e0569e9fae`
   - Horaire: 08:00 (Europe/Paris) - tous les jours
   - Action: Lance `update-evolution-dashboard.sh` + résumé (learnings total, pending, changements)
   - Delivery: Telegram (mode announce)

2. **Evolution Dashboard - Mise à jour 19h**
   - ID: `a156a993-1c6a-4675-8856-c80310cc69da`
   - Horaire: 19:00 (Europe/Paris) - tous les jours
   - Action: Lance `update-evolution-dashboard.sh` + résumé (learnings total, pending, changements)
   - Delivery: Telegram (mode announce)

**Objectif :** Suivi continu de l'évolution de l'agent, visibilité quotidienne des learnings et backlog.

**Cron automatique analyse d'erreurs (ajouté 2026-02-17) :**

- **Error Analysis - Rapport hebdo (dimanche 20h)**
  - ID: `bb5db840-7ffe-4794-9015-e0fd85d903a3`
  - Horaire: 20:00 (Europe/Paris) - tous les dimanches
  - Action: Lance `analyze-errors.sh` + résumé (total erreurs, top patterns, recommandations)
  - Alerte intelligente: 🚨 si >50 erreurs OU keywords critiques (segfault/crash/OOM)
  - Commit automatique du rapport sur GitHub
  - Delivery: Telegram (mode announce)

**Objectif :** Détection proactive patterns d'erreurs récurrents, suivi hebdomadaire de la stabilité système.

## ripgrep pour les recherches

**Status:** ✅ installé (15 février 2026)

**Pourquoi:** On voulait l'utiliser pour chercher rapidement dans les fichiers (`rg -n "finance"`), mais la commande n'était pas disponible par défaut. Je l'ai installée via `apt-get install ripgrep`.

**Gotchas:**
- Le dépôt tiers `https://repository.monarx.com/repository/ubuntu-questing` retournait un 404 et bloquait `apt update`. Pour régler ça, j'ai renommé `/etc/apt/sources.list.d/monarx.list` en `.disabled`, ce qui évite l'erreur à l'avenir.

**Commandes utiles:**
```bash
rg -n "finance"
rg --files
```

## OpenClaw gateway restart — Comportement (leçon 2026-02-24)

**Problème:** Quand `openclaw gateway restart` est lancé, la session WebSocket est coupée → la réponse en attente est perdue → Alexandre doit renvoyer un message pour relancer.

**Règle:**
- Prévenir Alexandre AVANT tout restart : "Je redémarre le gateway, renvoie-moi un message après"
- Les modifications de modèles dans `openclaw.json` (section `agents.defaults.models` et `agents.defaults.model`) **ne nécessitent pas de restart** — la config est rechargée automatiquement
- Ne redémarrer que si strictement nécessaire (nouvelle clé API, changement de port, bug gateway)

---

## OpenClaw editing policy (stabilité)

**Status:** ✅ Active (2026-02-15)

**Contrainte validée avec Alexandre:**
- Ne pas utiliser/installer `apply_patch` dans cet environnement.
- Utiliser uniquement les outils natifs `edit` et `write` pour les modifications de fichiers.

**Pourquoi:**
- `apply_patch` n'est pas disponible ici (`command not found`) et son installation n'est pas nécessaire.
- Le flux `edit`/`write` est plus stable et réduit le risque de casser le setup.

---

## What Goes Here

- Tool configurations and settings
- Credential locations (not the credentials themselves!)
- Gotchas and workarounds discovered
- Common commands and patterns
- Integration notes

## Why Separate?

Skills define *how* tools work. This file is for *your* specifics - the stuff that's unique to your setup.

---

*Add whatever helps you do your job. This is your cheat sheet.*

## GitHub API Access

**Status:** ✅ Active (2026-02-16)

**Configuration:**
- Token stocké dans `.credentials/github-token.txt` (gitignored)
- Accès API REST/GraphQL via `curl` ou `gh`
- Permissions : repo, project, workflow, admin:repo_hook, admin:org_hook, write:discussion
- Compte bot actif pour opérations GitHub: `DoudouClaw`
- Politique validée avec Alexandre: commits/push code via identité bot (`git user.name=DoudouClaw`)
- Repo de référence (depuis 2026-02-16): `https://github.com/Doudou-labo/DoudouClaw`
- Organisation de référence: `Doudou-labo` (issues/projects/kanban centralisés)

**Test de connexion:**
```bash
curl -s -H "Authorization: token $(cat .credentials/github-token.txt)" https://api.github.com/user | jq -r '.login'
# Output attendu: Hadoudoux
```

**Créer une issue:**
```bash
curl -X POST -H "Authorization: token $(cat .credentials/github-token.txt)" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test issue","body":"Description"}' \
  https://api.github.com/repos/Hadoudoux/doudoubot-workspace/issues
```

**Note:** gh CLI pas utilisé (exige read:org non nécessaire), API REST directe préférée.

## Discord Bot Integration

**Status:** ✅ Working (corrigé le 2026-02-18)

**Configuration:**
- Token stocké dans config OpenClaw (`channels.discord.token`)
- Guild ID: `1472335329527595038`
- Bot username: `@DoudouClaw`
- Rôles bot: OWNER + BOT + DoudouClaw (managed)

**Fix majeur (18 fév 2026) — Intents Discord:**

**Symptôme rencontré:**
- Messages Discord n'arrivaient pas à OpenClaw (aucune session créée)
- Commandes Discord retournaient "You are not authorized"
- Logs: `Discord Message Content Intent is limited`

**Cause racine:**
OpenClaw demandait des intents privilégiés (`Guild Members` + `Presence`) dans la config, mais Discord ne les autorisait pas → conflit → bot bloqué.

**Solution:**
1. Activer **Message Content Intent** sur Discord Developer Portal (obligatoire pour lire le texte des messages)
2. Désactiver les intents `Guild Members` et `Presence` dans l'interface web OpenClaw (`openclaw.doudougen.xyz` → Channels → Discord → Intents)

**Config actuelle (working) :**
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
- Si le bot ne reçoit plus de messages Discord, vérifier d'abord les intents (Developer Portal + config OpenClaw)
- La restriction `roles` dans la config guild était un red herring (retirée, mais pas la vraie cause)
- Cross-context messaging bloqué : on ne peut pas envoyer sur Discord depuis une session Telegram (by design OpenClaw)
- **Commandes "not authorized" :** Si `channels.discord.allowFrom` est null ET aucun rôle configuré dans la guild → OpenClaw refuse **tout le monde**. Fix : mettre `allowFrom: ["*"]` pour une guild privée.

**Commandes utiles:**
```bash
# Status Discord
openclaw status --deep | grep -A 5 Discord

# Logs Discord
journalctl -xe --no-pager | grep -i discord | tail -30

# Restart après changement config
openclaw gateway restart
```

## Format Discord — Canal ⚖️-legifrance

**Règle validée (2026-03-01):**
- Sur Discord, **ne jamais utiliser de tableaux Markdown** (illisibles)
- Format standard pour les listes de textes juridiques :

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
