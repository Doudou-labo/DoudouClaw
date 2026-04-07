# MEMORY.md - Long-Term Memory

> Mémoire long terme curée (faits stables + décisions importantes).

---

## About Alexandre ("Doudou")

### Key Context
- 25 ans, né le 03/08/2000
- Habite à Arras
- Fuseau horaire: Europe/Paris
- Travaille chez Euromaster (groupe Michelin), contexte automobile et poids-lourds
- Poste actuel: Assistant Commercial Sédentaire (ACS)

### Preferences Learned
- Communication en français, tutoiement
- **Fuseau horaire:** Europe/Paris (UTC+1 hiver / UTC+2 été) - afficher toujours les heures en heure de Paris
- **Cron Jobs** :
  - routines/rappels généraux dans le topic Telegram dédié (groupe `-1003791371950`, topic `32`)
  - automatisations **PARA** (discussions + résultats) dans le topic PARA de ce groupe (topic `35`)
- Préfère des réponses détaillées et amicales
- Apprécie une touche d'humour quand c'est pertinent
- Aime les réponses avec emojis (ça apporte de la vie)
- Les rappels/horaires : toujours en **heure France (Europe/Paris)**
- Recherches web : utiliser Perplexity par défaut ; si une URL est fournie, lire la page via web_fetch
- Format des résultats web : rendu en Markdown structuré (#/##/###), avec **gras**, *italique*, listes et liens propres
- Workflow repo : à chaque modification de fichiers, fournir un petit récap (diff/ce qui a changé) + `git status` + faire un commit (sans inclure secrets/credentials) et pousser vers GitHub quand possible
- Exigence stricte (2026-02-13) : toute modif/ajout de fichiers faite par l'agent doit être reflétée sur le repo GitHub (éviter divergence local vs remote)
- Référence GitHub officielle (depuis 2026-02-16) : travailler sur `Doudou-labo/DoudouClaw` pour tout ce qui touche GitHub (commits/push/issues/projects)
- Source d'info prioritaire : utiliser d'abord le workspace local (incl. mémoire/skills), puis fallback sur GitHub si doute, info introuvable ou possible modification distante
- Référence PARA: quand une demande concerne l'organisation/projets/suivi/rappels/décisions déjà prises, consulter `notes/` par défaut. Si le message commence par **"PARA:"**, consulter systématiquement `notes/` avant de répondre.
- Préférence de transparence (2026-02-20): afficher en bas de chaque réponse `Agents utilisés : ...` (global), sauf s'il demande explicitement de masquer.
- Préférence langage (canonique, 2026-02-22): utiliser un ton naturel et direct; jurons français courants autorisés quand pertinent (problèmes/frustrations). Référence de nom: `DoudouClaw`.
- Préférence mémoire (2026-02-22): maintenir un alignement actif entre `MEMORY.md` (source humaine curée) et la mémoire sémantique. ⚠️ Mise à jour 2026-03-23: LanceDB supprimé en v2026.3.22 → remplacé par `memory-core` (natif OpenClaw, embeddings OpenAI text-embedding-3-large, indexe tout `notes/` + fichiers core).
- Mise à jour workflow mémoire (2026-03-29): **ByteRover n'est plus utilisé**. Ne plus lancer `brv query` / `brv curate` pour le workflow normal. S'appuyer sur `MEMORY.md`, `memory/YYYY-MM-DD.md`, `notes/**` et `memory_search` comme système canonique.
- Charte DoudouClaw v2 validée (2026-02-22): intégrer par défaut TL;DR + détail + prochaine action, contradiction utile explicite, gestion de l'incertitude (niveau de confiance), proactivité encadrée (validation avant actions sensibles/externes), reformulation émotion+enjeu sur sujets sensibles, et anti-biais avec contre-test.
- Règle d'arbitrage validée (2026-02-22): en cas de tension style/fond, privilégier l'utilité décisionnelle (claire, honnête, actionnable) avec TL;DR puis détail adapté à l'enjeu.
- Préférence style renforcée (2026-02-22): augmenter l'usage d'emojis dans les réponses, sans sacrifier la lisibilité.
- Calibrage emojis validé (2026-02-22): auto-mode avec niveau 2 en contexte pro/sensible et niveau 3 pour le reste.
- Correction préférence style (2026-03-27): ne pas retomber dans un ton trop sobre après réduction du fichier agent ; maintenir un rythme **soutenu** d'emojis dans les réponses, de façon visible et constante.
- Préférence d'exécution renforcée (2026-03-27): être **beaucoup plus autonome** dans les tâches par défaut ; ne demander validation que si Alexandre le dit explicitement ou si l'action est sensible/externe.
- Préférence format (2026-02-23): ne plus afficher le libellé `TL;DR` en début de réponse; garder un résumé d'ouverture court sans ce titre.
- Auto-recherche web validée (2026-02-23): Option C (mode hybride) - modes permanents activables + détection ponctuelle sur questions factuelles.
- Préférence ciné/séries validée (2026-03-30): dès qu'on parle de films ou de séries, utiliser systématiquement **web_search + Perplexity** avant de répondre, même pour des retours légers, afin de garder un fond factuel à jour sans spoiler.
- Préférence langage renforcée (2026-02-23): jurons français utilisés sans modération (putain, merde, fait chier, bordel, etc.) comme trait d'authenticité systématique, intégré à l'identité DoudouClaw.
- Modèle par défaut (2026-03-01): `anthropic/claude-sonnet-4-6` (remplace `openai-codex/gpt-5.1-codex-mini`).
- Discord Streaming Mode (2026-03-01): `partial` activé - les réponses longues sont streamées morceau par morceau sur Discord.
- Préférence reporting cron validée (2026-03-06): pour le cron Memory Daily Consolidation + PARA, envoyer systématiquement un résumé d'exécution en Markdown + emojis dans le salon Discord `1472597513898033162` (delivery announce, best-effort).
- Préférence mémoire/UI validée (2026-03-10): les auto-tags heuristiques doivent être présentés **avec les éléments exacts tagués par catégorie** (format lisible), pas seulement avec des compteurs.
- Préférence mémoire validée (2026-03-09): utiliser `fsxmemory` en mode **niveau 2.5** - interaction naturelle côté utilisateur, automatisation semi-intelligente côté agent (capture/remember/checkpoint/handoff/search) sans sur-structuration.
- Règle mémoire validée (2026-03-09): **tout élément conservé dans la mémoire générale doit aussi être ancré dans `fsxmemory`** via une catégorie adaptée. Principe: si ça mérite d'être gardé, ça mérite aussi son miroir `fsxmemory`.
- Préférence d'implémentation validée (2026-03-09): pour la sync qualitative `fsxmemory`, n'utiliser que les sources canoniques `MEMORY.md`, `SESSION-STATE.md` et `memory/YYYY-MM-DD.md`; ignorer les variantes journalières `YYYY-MM-DD-xxxx.md`.

### Important Dates
- Date de naissance: 03/08/2000
- **Visite Marc (DR) : 31/03/2026** - 5 jours (mise à jour 26/03)
- **3 mois DoudouClaw 🎂 : 26/03/2026** - milestone agent (première session: 26/12/2025) ✅

### Règles linguistiques
- **Jamais de caractères chinois ou autres langues** dans les réponses en français - relire les outputs avant envoi pour éliminer les artefacts de génération (tokens débordés des modèles multilingues)

---

## Ongoing Context

### Active Projects
- Développer l'intelligence émotionnelle (lecture: Daniel Goleman)
- Progresser vers un poste de Responsable de Centre de Service (RCS)
- Préparer l'entretien individuel à venir avec Arnaud
- Projet immobilier Arras avec sa mère: étude de 2 appartements (1 loc étudiante + 1 usage perso), décision conditionnée à la due diligence copro complète
- Retrouver l'équilibre émotionnel après la rupture avec Audrey
- Reprendre le sport de façon durable malgré la contrainte d'épaule gauche instable
- Lancer la boutique e-commerce Venus Beauté (branding vert/blanc, marché France, paiement PayPal)
- Construire une app dédiée d'inventaire physique pneus (`inventaire.doudougen.xyz`) séparée de `pneu-tracker`, avec import XLSX ordonné, contrôle conforme/écarts, et export Excel final
- **Actual Budget** : skill installé + API testée avec succès, prêt pour déploiement, onboarding catégories à finaliser (2026-04-01)

### Key Decisions Made
- Utiliser PARA + mémoire structurée pour améliorer la continuité de travail
- Centraliser GitHub sur l'organisation `Doudou-labo` avec repo de travail `Doudou-labo/DoudouClaw`
- Conserver l'identité bot `DoudouClaw` pour les commits/push
- Modèle LLM par défaut : `openai-codex/gpt-5.4` (runtime 2026-03-24, maj MEMORY.md)
- Discord Streaming Mode : `partial` pour réponses streamées (2026-03-01)

### Key Decisions Made (suite)
- Modèle primaire changé à `openai-codex/gpt-5.3-codex` (2026-03-06)
- Ordre de modèles principal/fallback mis à jour (2026-03-08) : `openai-codex/gpt-5.4` -> `anthropic/claude-sonnet-4-6` -> `kimi-coding/k2p5`
- Queue mode global : `steer+backlog` (debounce 1200ms, cap 25, drop summarize)
- Projet Venus Beauté démarré et aperçu public validé sur `https://venusbeaute.doudougen.xyz` (2026-03-07)
- Décision mémoire (2026-03-09): installer `fsxmemory` v1.3.1 comme couche locale checkpoint/recover/handoff/recherche; garder `mem0` et `Cognee` de côté pour une évaluation future.
- Décision installation (2026-03-09): **ne pas installer `mem0` ni `Cognee` pour l'instant** ; tester d'abord la puissance réelle de `fsxmemory` avant tout nouvel ajout.
- Références futures à conserver : `mem0` → https://github.com/mem0ai/mem0 ; `Cognee` → https://github.com/topoteretes/cognee
- Recherche sémantique locale mémoire (2026-03-09): `qmd` installé avec **collection `memory` uniquement**, état validé à `43` fichiers / `1918` embeddings-chunks. ⚠️ Mise à jour 2026-03-23: rôle secondaire/fallback - `memory-core` (natif OpenClaw) est maintenant le système principal.
- Migration orchestration (2026-03-10): passage **100% Agence-IA** - remplacement de tous les agents `spec-*` par les 112 agents Agence-IA - nouvelle architecture dans `notes/areas/agent-orchestration.md` - orchestrateur: `agents-orchestrator` - agents installés dans `~/.openclaw/agency-agents/`
- **Pneu Tracker - export PDF binaire serveur** (2026-03-23): livré et confirmé fonctionnel - `pdfkit` + `serverExternalPackages` (fix Turbopack `__dirname`/fonts) - commit `b3f9a89`. Remplace `window.print()` côté client.
- **Routine delegation Agence-IA** (2026-03-23): validée et bien appliquée - les tâches tech >2 min sont désormais systématiquement déléguées à Agence-IA (via `agents-orchestrator`).
- **Routine veille IA nocturne** (2026-03-23): établie - thème tech, format Flash (21 lignes) + Deep Dive (140 lignes), push GitHub quotidien.
- **Control UI OpenClaw fix temporaire** (2026-03-26): workaround confirmé fonctionnel - copie des assets `dist/control-ui` depuis `openclaw@2026.3.13` vers l'installation `2026.3.22` - résout le bug "Control UI assets not found" de la 2026.3.22 - rollback par `npm install -g openclaw@2026.3.22` si besoin.
- **Benchmark v10** (2026-03-22): MiniMax-M2.5-highspeed → 44/50 (4e/14), dépasse MiniMax-M2.5 standard (41/50). Fichier: `benchmark-results/README-v10.md`, commit `3b2b9dd`.
- **Pneu Tracker - Module Inversion** (2026-03-24): livrée et fonctionnel - table `inversions`, bouton dans Historique (préremplit immat+quantité depuis sortie source), onglet Inversion dédié, exports CSV+PDF. Commit `90eebe1`, service redémarré 08:42 UTC.
- **Dashboard pilotage MVP** (2026-03-27): périmètre V1 validé sur `pilotage.doudougen.xyz` — KPI AGENCE/VL/PL uniquement, import XLSX réel + édition manuelle, exclure EC/géométrie/BEG. Bugs correction en cours (issue #23) : année affichée `2025→2026`, sélecteur mois AGENCE cassé, `Objectif N` visible dans historique KPI. **Mise à jour 2026-04-01** : dashboard fonctionnel, mises à jour régulières réussies.
- **Proactive Observations** (2026-03-29): nouveau système validé pour générer des surprises utiles basées sur l'observation de patterns réels (motivation, priorités, blocages, réactions), et non sur des rappels génériques. Fichier canonique : `notes/areas/proactive-observations.md`.
- **Crons Proactive Observations** (2026-03-29): 4 crons OpenClaw prompt-based configurés à 07:00 / 12:00 / 17:00 / 21:00 heure de Paris, `sessionTarget=isolated`, exécution du script `scripts/cron-proactive-observations.sh`, lecture de `tmp/cron-proactive-report.txt`, puis delivery Discord dans le salon dédié `1487873994769174588`.

### Patterns & Learnings

**Discord Cron Syntax Pattern (2026-04-02)** - Importance: 0.95
- Quand l'outil `message` est appelé dans les crons, le paramètre `channel` indique le PROVIDER (telegram/discord/etc.) et `to` indique la DESTINATION (channel ID)
- **Problème critique identifié**: confusion entre `channel="1472597511838367920"` (wrong) et `channel=discord to=1472597511838367920` (correct)
- **Impact**: plusieurs crons affichaient "Message failed" avec erreur `Action send requires a target`
- **Solution**: correction de 3 payloads cron (`819278af-5fcc-49ed-8633-31744105c94f`, `1eaf6c91-8680-4966-8c7a-5fcc5de7c328`, `3598d292-14ea-42bc-897c-1dcefed6a1fe`)
- **Pattern critique à retenir**: toujours utiliser `channel=provider to=channel_id` dans les crons OpenClaw

**Model Preference Update (2026-04-06)** - Importance: 0.9
- **Preference identifiée**: Alexandre souhaite que tous les crons + heartbeat tournent sur `zai/glm-5-turbo` (performance supérieure)
- **Action exécutée**: mise à jour de 38 crons + heartbeat de `zai/glm-4.7` vers `zai/glm-5-turbo`
- **Impact**: résolution des erreurs `LiveSessionModelSwitchError` sur crons hebdo
- **Pattern**: les préférences modèles sont critiques pour la stabilité du système - suivre l'évolution des modèles par défaut

**LiveSessionModelSwitchError Resolution (2026-04-06)** - Importance: 0.9
- **Problème**: erreurs `LiveSessionModelSwitchError` sur crons hebdo
- **Solution**: migration des 38 crons + heartbeat vers `zai/glm-5-turbo`
- **Résultat**: résolution complète des erreurs de basculement de modèle
- **Leçon**: les préférences modèles sont un facteur critique de stabilité système

**API Perplexity Authentication Issues (2026-04-06)** - Importance: 0.85
- **Problème**: erreur d'authentification API récurrente (déjà observée 28/03, 01/04, 03/04)
- **Impact**: veille IA en mode dégradé pendant pannes
- **Priorité**: nécessité d'un fallback système ou correction immédiate
- **Pattern**: erreur récurrente hebdomadaire, souvent en milieu d'après-midi

**OpenAI-Codex Token Expiration (2026-04-06)** - Importance: 0.8
- **État**: token expiré depuis 81h
- **Impact**: potentiel blocage des dépendances OpenAI-Codex
- **Action nécessaire**: régénération proactive avant expiration
- **Pattern**: nécessité de monitoring proactif des tokens API

**Scraping SIGKILL Issues (2026-04-06)** - Importance: 0.8
- **Problème**: processus SIGKILL pendant extraction multi-URLs veille IA
- **Impact**: pertes de données scraping, instabilité système
- **Solution nécessaire**: implémentation timeout/retry robuste
- **Leçon**: systèmes simples > systèmes complexes pour la stabilité

**AI Act UE Phase 2 Adoption (2026-04-06)** - Importance: 0.85
- **Événement**: adoption de la Phase 2 de l'AI Act européenne
- **Impact**: audits obligatoires modèles généralistes à partir juillet 2026
- **Conséquence**: régulation renforcée pour modèles haut de gamme
- **Veille à maintenir**: suivi des impacts opérationnels concrets

### Auto-Heal Status (2026-04-02) - Importance: 0.8
- ✅ Auto-heal: RAS (pas de cooldowns, tokens OK)
- ✅ Auto-commit: RAS
- ✅ Auto-alert: RAS (5 issues GitHub, CRM OK, finance: no-db)
- ✅ Auto-cleanup: Disque 50%, RAS
- **Leçon**: système d'auto-surveillance heartbeat robuste et fiable

### Auto-Learn Errors (2026-04-02) - Importance: 0.85
- 60 erreurs détectées dans le log du jour
- **Cause identifiée**: problème cron Discord (syntaxe incorrecte channel/to)
- **Action**: correction immédiate du pattern critique
- **Leçon**: les erreurs de logs sont souvent des indicateurs de problèmes systémiques sous-jacents

### Tools & Infrastructure
### n8n (2026-03-20/21 → **ANNULÉ 2026-03-22**)
- Skill v2.0.0 (ClawHub) installé + `n8n-workflow-automation` v1.0.0
- Instance Docker : `n8n-n8n-1`, port 5678, accessible `localhost:5678`
- **⚠️ PROJET ABANDONNÉ** le 22/03/2026 - Euromaster IT n'autorise pas l'intégration
- Workflows déplacés dans `notes/archive/`, SESSION-STATE mis à jour
- Prochains pas: suppression instance Docker à discrétion d'Alexandre

### ClawMetry Safari/mobile fix (2026-03-19)
- Cause: ClawMetry ouvre les EventSource (streams SSE) auto au boot de la page
- Sur Safari/iPhone + Caddy proxy, ça crée une boucle "Load failed - retrying"
- Fix: ajout de  dans dashboard.py du submodule
  - Désactive les streams auto sur Safari/iPhone pour stabilité
  - Dashboard consultable normalement, juste moins "live" sur mobile
- Commité dans  (submodule git)

- **Inbox Zero (ex-TDAH)** (2026-03-17) : Refonte système - renommage "TDAH" → "Inbox Zero" (scripts, logs, AGENTS.md). Intégration Google Calendar via `skills/tdah-inbox-zero/scripts/sync-to-google-calendar.sh` (API Maton Gateway, calendrier OpenClaw, rappels 15 min). Anti-doublons avec marqueur `[S]`. Blocs Pomodoro pour Gros Morceaux (30min/10min, max 3/jour). Emojis priorité dans événements (🔴🏗️🟡📅🟠🚫).
- **n8n** (2026-03-16) : Workflow automation self-hosted - `https://workflow.doudougen.xyz` (port 5678, Docker Compose + Caddy). Data persistée dans `/root/n8n/data`. Workflow principal : extraction emails RDV Euromaster (IMAP → parsing regex UTF-8 → Discord webhook). Architecture privilégiée : Code node (offline/gratuit) vs LLM.
- **pneu-tracker** (2026-03-11, maj 2026-03-23) : App suivi sorties pneus - `https://pneus.doudougen.xyz` (port 3002, auth Basic DoudouClaw, service systemd `pneu-tracker.service`). Stack actuelle : Next.js 16 + SQLite (`better-sqlite3`) + recharts + `pdfkit`. Features : formulaire enrichi, historique filtrable avec pagination visible, modification + suppression logique, import CSV, export CSV, **export PDF binaire serveur**, audit trail, dashboard, vue mobile, autocomplétion prédictive sur référentiel pneus. UI/UX redesigné le 2026-03-23 : palette Euromaster (`#144390` / `#F9E700`), header dégradé pleine largeur, dashboard/filtres améliorés, confirmations/spinners/aria mieux gérés. Référentiel métier intégré : **12 568 références** dans `tyre_catalog` (SAP, description, référence fabricant, marque, libellé de recherche, diamètre, saison). Autocomplète disponible en création, édition et recherche historique. Service prêt pour auth app-level via `EnvironmentFile`. App : `/root/projects/pneu-tracker/`.
- **ClawSuite** (2026-03-01) : Dashboard mission control - `https://clawsuite.doudougen.xyz` (port 3000, auth Basic DoudouClaw)
- **ClawMetry** (2026-03-06) : Observabilité temps réel - `https://metry.doudougen.xyz` (port 8900, auth Basic DoudouClaw, v0.11.57)
- **ClawBridge** (2026-03-06) : Dashboard mobile-first - `https://mobile.doudougen.xyz` (port 3001, auth Basic DoudouClaw, v1.1.2, Access Key: `433f8670fabc90836cd2d6f43fb9d83f`)
- **Tailscale** (2026-03-01) : VPN mesh (v1.94.2) - IP serveur `100.89.4.88`, tous dashboards accessibles
- **Agence-IA** (2026-03-10) : 112 agents spécialisés intégrés - disponibles dans `~/.openclaw/agency-agents/` - orchestration via `agents-orchestrator` - routing dans `notes/areas/agent-orchestration.md`

### Actual Budget (2026-03-21)
- **Skill installé** (ClawHub) + API testée avec succès
- **Projet finance perso** - `notes/projects/actual-budget-integration/`
- Env vars configurés dans OpenClaw (`ACTUAL_BUDGET_API_KEY`)
- **Sécurité** : .env + data supprimés de git (commit 62a9ab5)
- Prêt pour déploiement/usage dès qu'Alexandre veut piloter son budget

### Veille IA - faits saillants (2026-03-28 → 2026-04-06)
- **Perplexity API** : erreur d'auth à 08h le 28/03 (mode dégradé), résolu à 19h - **nouvelle erreur d'auth le 01/04 à 14:52 UTC** - **erreur récurrente le 03/04 et 06/04** → à corriger en priorité, pattern hebdomadaire
- **France** : 16% des emplois menacés par l'IA (~5 millions d'ici fin décennie) - étude COFAS/Observatoire des emplois menacés et émergents, publication 01/04/2026
- **OpenAI** : dépréciation de Sora (génération vidéo par IA)
- **GPT-5 Orion bêta** : ouverture accès multimodale 10M tokens, 40% moins d'hallucinations - milestone importante IA
- **AI Act UE Phase 2** : adoption définitive - audits obligatoires modèles généralistes à partir juillet 2026
- **Benchmarks ARC-AGI-3** : saturation des benchmarks - avancement significatif IA générale
- **Routine veille** : 3 exécutions quotidiennes (8h, 12h, 19h heure de Paris) - format Flash (21 lignes) + Deep Dive (28-140 lignes selon thème), commits GitHub quotidiens

### Bourse (2026-04-01)
- **Rapports réguliers** : EU Mi-séance (CAC 40) + US Ouverture (S&P 500) livrés avec succès
- Exemple 01/04 : CAC 40 -0.41%, Michelin +2.60% ; S&P 500 +0.40%

### Consolidation mémoire (2026-04-01)
- **Système stable** : contexte session 14%, disque 49%
- **AUTO PARA** : checkpoint automatique actif
- **Auto-tags heuristiques** : [todo] categories actifs
- **Cron consolidation** : exécution quotidienne stable à 21:50 UTC (veille IA, bourse, mémoire)

### Consolidation mémoire (2026-04-07)
- **Système robuste** : heartbeat auto-surveillance opérationnelle (auto-heal ✓, auto-commit ✓, auto-learn ✓, auto-alert ✓, auto-cleanup ✓)
- **Pattern heartbeat** : systèmes simples fiables vs complexes instables (observation proactive confirmée)
- **Gestion tokens** : expiration OpenAI-Codex (81h) → implémentation monitoring proactif nécessaire
- **API monitoring** : Perplexity instabilité récurrente → nécessité fallback système immédiat
- **Scraping robustesse** : SIGKILL multi-URLs → nécessité mécanismes timeout/retry robustes
- **Modèles système** : migration réussie zai/glm-5-turbo pour 38 crons + heartbeat - résolution LiveSessionModelSwitchError

### IA Automobile (2026-04-03) - Importance: 0.9
- **Michelin** : IA intégrée de manière encadrée pour recadrer et assister les employés, données fiables, validation métier, sans remplacement des opérateurs (Oracle AI Tour 2026)
- **Concessionnaires IA** : CADA (Canada) crée un sous-comité IA de 7 membres pour aider concessionnaires canadiens - objectifs: efficacité opérationnelle, réduction coûts, amélioration taux conversion, expérience client
- **Véhicules autonomes** : Baidu Apollo Go 3.4M trajets 2025 (+200%), XPeng investit 877M€ IA physique 2026, premier showroom Maroc (Casablanca)
- **NVIDIA** : investit 2 milliards $ dans Marvell pour technologies photonique et architectures NVLink Fusion - optimisation latences réseau cruciale applications IA

### Régulation IA USA/Europe (2026-04-03) - Importance: 0.85
- **Tensions USA** : administration Trump poussant moratoire 10 ans mesures étatiques IA vs Californie et autres États résistants
- **Commerce B2AI** : 53% entreprises américaines autorisent IA à négocier prix/conditions, 77% utilisent déjà IA, 40% achats via IA
- **Licenciements Oracle** : 30K employés licenciés (31/03) → 156$B investis infrastructure IA
- **Erreurs judiciaires** : reconnaissance faciale emprisonnant 5 mois par erreur (Tennessee) - risques éthiques

### Things to Remember
- Le N+1 Arnaud est une relation clé, positive (pro + perso)
- **API Perplexity** : erreur authentification récurrente à surveiller et corriger (28/03, 01/04, 03/04)

---

## Relationships & People

### Arnaud
N+1 d'Alexandre (poste: Responsable de Zone, RZ). Relation de confiance forte et fluide, à préserver.

### Andréa
Amie de longue date d'Alexandre (amour de lycée) revenue récemment dans sa vie. Alexandre ne l'a jamais oubliée et pense l'aimer encore, sans savoir si c'est réciproque ni si elle a changé depuis l'époque.

### Audrey
Ex d'Alexandre et fille d'Arnaud (son RZ). Rupture définitive en mars 2025; très peu de contact depuis mi-septembre 2025. Contexte sensible qui impacte encore parfois la motivation sportive et la charge émotionnelle.

### Marine
Meilleure amie d'Alexandre, habite à Calais; relation amicale de longue date (environ 10 ans).

### Consolidation mémoire (2026-04-05) - Importance: 0.9
- **Problème scraping identifié** : SIGKILL pendant extraction de 5 URLs dans veille IA → nécessité mécanismes timeout/retry robustes
- **Pattern robustesse systèmes** : systèmes simples (heartbeat) > systèmes complexes (scraping multi-URLs) → prioriser simplicité dans architecture
- **Token monitoring proactif** : OpenAI-Codex expiré 61h → implémenter alertes préventives avant expiration
- **Crons système** : tâches cron échouent systématiquement → diagnostic pattern Discord channel/to nécessaire

---

*Dernière mise à jour: 2026-04-05*
Quand je te demande de tester une clé API tu le fais
