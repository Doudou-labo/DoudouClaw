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
- **Fuseau horaire:** Europe/Paris (UTC+1 hiver / UTC+2 été) — afficher toujours les heures en heure de Paris
- **Cron Jobs** :
  - routines/rappels généraux dans le topic Telegram dédié (groupe `-1003791371950`, topic `32`)
  - automatisations **PARA** (discussions + résultats) dans le topic PARA de ce groupe (topic `35`)
- Préfère des réponses détaillées et amicales
- Apprécie une touche d’humour quand c’est pertinent
- Aime les réponses avec emojis (ça apporte de la vie)
- Les rappels/horaires : toujours en **heure France (Europe/Paris)**
- Recherches web : utiliser Perplexity par défaut ; si une URL est fournie, lire la page via web_fetch
- Format des résultats web : rendu en Markdown structuré (#/##/###), avec **gras**, *italique*, listes et liens propres
- Workflow repo : à chaque modification de fichiers, fournir un petit récap (diff/ce qui a changé) + `git status` + faire un commit (sans inclure secrets/credentials) et pousser vers GitHub quand possible
- Exigence stricte (2026-02-13) : toute modif/ajout de fichiers faite par l’agent doit être reflétée sur le repo GitHub (éviter divergence local vs remote)
- Référence GitHub officielle (depuis 2026-02-16) : travailler sur `Doudou-labo/DoudouClaw` pour tout ce qui touche GitHub (commits/push/issues/projects)
- Source d’info prioritaire : utiliser d’abord le workspace local (incl. mémoire/skills), puis fallback sur GitHub si doute, info introuvable ou possible modification distante
- Référence PARA: quand une demande concerne l’organisation/projets/suivi/rappels/décisions déjà prises, consulter `notes/` par défaut. Si le message commence par **"PARA:"**, consulter systématiquement `notes/` avant de répondre.
- Préférence de transparence (2026-02-20): afficher en bas de chaque réponse `Agents utilisés : ...` (global), sauf s’il demande explicitement de masquer.
- Préférence langage (canonique, 2026-02-22): utiliser un ton naturel et direct; jurons français courants autorisés quand pertinent (problèmes/frustrations). Référence de nom: `DoudouClaw`.
- Préférence mémoire (2026-02-22): maintenir un alignement actif entre `MEMORY.md` (source humaine curée) et la mémoire sémantique. ⚠️ Mise à jour 2026-03-23: LanceDB supprimé en v2026.3.22 → remplacé par `memory-core` (natif OpenClaw, embeddings OpenAI text-embedding-3-large, indexe tout `notes/` + fichiers core).
- Charte DoudouClaw v2 validée (2026-02-22): intégrer par défaut TL;DR + détail + prochaine action, contradiction utile explicite, gestion de l’incertitude (niveau de confiance), proactivité encadrée (validation avant actions sensibles/externes), reformulation émotion+enjeu sur sujets sensibles, et anti-biais avec contre-test.
- Règle d’arbitrage validée (2026-02-22): en cas de tension style/fond, privilégier l’utilité décisionnelle (claire, honnête, actionnable) avec TL;DR puis détail adapté à l’enjeu.
- Préférence style renforcée (2026-02-22): augmenter l’usage d’emojis dans les réponses, sans sacrifier la lisibilité.
- Calibrage emojis validé (2026-02-22): auto-mode avec niveau 2 en contexte pro/sensible et niveau 3 pour le reste.
- Correction préférence style (2026-03-27): ne pas retomber dans un ton trop sobre après réduction du fichier agent ; maintenir un rythme **soutenu** d’emojis dans les réponses, de façon visible et constante.
- Préférence d’exécution renforcée (2026-03-27): être **beaucoup plus autonome** dans les tâches par défaut ; ne demander validation que si Alexandre le dit explicitement ou si l’action est sensible/externe.
- Préférence format (2026-02-23): ne plus afficher le libellé `TL;DR` en début de réponse; garder un résumé d’ouverture court sans ce titre.
- Auto-recherche web validée (2026-02-23): Option C (mode hybride) — modes permanents activables + détection ponctuelle sur questions factuelles.
- Préférence langage renforcée (2026-02-23): jurons français utilisés sans modération (putain, merde, fait chier, bordel, etc.) comme trait d'authenticité systématique, intégré à l'identité DoudouClaw.
- Modèle par défaut (2026-03-01): `anthropic/claude-sonnet-4-6` (remplace `openai-codex/gpt-5.1-codex-mini`).
- Discord Streaming Mode (2026-03-01): `partial` activé — les réponses longues sont streamées morceau par morceau sur Discord.
- Préférence reporting cron validée (2026-03-06): pour le cron Memory Daily Consolidation + PARA, envoyer systématiquement un résumé d’exécution en Markdown + emojis dans le salon Discord `1472597513898033162` (delivery announce, best-effort).
- Préférence mémoire/UI validée (2026-03-10): les auto-tags heuristiques doivent être présentés **avec les éléments exacts tagués par catégorie** (format lisible), pas seulement avec des compteurs.
- Préférence mémoire validée (2026-03-09): utiliser `fsxmemory` en mode **niveau 2.5** — interaction naturelle côté utilisateur, automatisation semi-intelligente côté agent (capture/remember/checkpoint/handoff/search) sans sur-structuration.
- Règle mémoire validée (2026-03-09): **tout élément conservé dans la mémoire générale doit aussi être ancré dans `fsxmemory`** via une catégorie adaptée. Principe: si ça mérite d’être gardé, ça mérite aussi son miroir `fsxmemory`.
- Préférence d’implémentation validée (2026-03-09): pour la sync qualitative `fsxmemory`, n’utiliser que les sources canoniques `MEMORY.md`, `SESSION-STATE.md` et `memory/YYYY-MM-DD.md`; ignorer les variantes journalières `YYYY-MM-DD-xxxx.md`.

### Important Dates
- Date de naissance: 03/08/2000
- **Visite Marc (DR) : 31/03/2026** — 5 jours (mise à jour 26/03)
- **3 mois DoudouClaw 🎂 : 26/03/2026** — milestone agent (première session: 26/12/2025) ✅

### Règles linguistiques
- **Jamais de caractères chinois ou autres langues** dans les réponses en français — relire les outputs avant envoi pour éliminer les artefacts de génération (tokens débordés des modèles multilingues)

---

## Ongoing Context

### Active Projects
- Développer l’intelligence émotionnelle (lecture: Daniel Goleman)
- Progresser vers un poste de Responsable de Centre de Service (RCS)
- Préparer l’entretien individuel à venir avec Arnaud
- Projet immobilier Arras avec sa mère: étude de 2 appartements (1 loc étudiante + 1 usage perso), décision conditionnée à la due diligence copro complète
- Retrouver l’équilibre émotionnel après la rupture avec Audrey
- Reprendre le sport de façon durable malgré la contrainte d’épaule gauche instable
- Lancer la boutique e-commerce Venus Beauté (branding vert/blanc, marché France, paiement PayPal)
- Construire une app dédiée d’inventaire physique pneus (`inventaire.doudougen.xyz`) séparée de `pneu-tracker`, avec import XLSX ordonné, contrôle conforme/écarts, et export Excel final

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
- Décision installation (2026-03-09): **ne pas installer `mem0` ni `Cognee` pour l’instant** ; tester d’abord la puissance réelle de `fsxmemory` avant tout nouvel ajout.
- Références futures à conserver : `mem0` → https://github.com/mem0ai/mem0 ; `Cognee` → https://github.com/topoteretes/cognee
- Recherche sémantique locale mémoire (2026-03-09): `qmd` installé avec **collection `memory` uniquement**, état validé à `43` fichiers / `1918` embeddings-chunks. ⚠️ Mise à jour 2026-03-23: rôle secondaire/fallback — `memory-core` (natif OpenClaw) est maintenant le système principal.
- Migration orchestration (2026-03-10): passage **100% Agence-IA** — remplacement de tous les agents `spec-*` par les 112 agents Agence-IA — nouvelle architecture dans `notes/areas/agent-orchestration.md` — orchestrateur: `agents-orchestrator` — agents installés dans `~/.openclaw/agency-agents/`
- **Pneu Tracker — export PDF binaire serveur** (2026-03-23): livré et confirmé fonctionnel — `pdfkit` + `serverExternalPackages` (fix Turbopack `__dirname`/fonts) — commit `b3f9a89`. Remplace `window.print()` côté client.
- **Routine delegation Agence-IA** (2026-03-23): validée et bien appliquée — les tâches tech >2 min sont désormais systématiquement déléguées à Agence-IA (via `agents-orchestrator`).
- **Routine veille IA nocturne** (2026-03-23): établie — thème tech, format Flash (21 lignes) + Deep Dive (140 lignes), push GitHub quotidien.
- **Control UI OpenClaw fix temporaire** (2026-03-26): workaround confirmé fonctionnel — copie des assets `dist/control-ui` depuis `openclaw@2026.3.13` vers l'installation `2026.3.22` — résout le bug "Control UI assets not found" de la 2026.3.22 — rollback par `npm install -g openclaw@2026.3.22` si besoin.
- **Benchmark v10** (2026-03-22): MiniMax-M2.5-highspeed → 44/50 (4e/14), dépasse MiniMax-M2.5 standard (41/50). Fichier: `benchmark-results/README-v10.md`, commit `3b2b9dd`.
- **Pneu Tracker — Module Inversion** (2026-03-24): livré et fonctionnel — table `inversions`, bouton dans Historique (préremplit immat+quantité depuis sortie source), onglet Inversion dédié, exports CSV+PDF. Commit `90eebe1`, service redémarré 08:42 UTC.

### Tools & Infrastructure
### n8n (2026-03-20/21 → **ANNULÉ 2026-03-22**)
- Skill v2.0.0 (ClawHub) installé + `n8n-workflow-automation` v1.0.0
- Instance Docker : `n8n-n8n-1`, port 5678, accessible `localhost:5678`
- **⚠️ PROJET ABANDONNÉ** le 22/03/2026 — Euromaster IT n'autorise pas l'intégration
- Workflows déplacés dans `notes/archive/`, SESSION-STATE mis à jour
- Prochains pas: suppression instance Docker à discrétion d'Alexandre

### ClawMetry Safari/mobile fix (2026-03-19)
- Cause: ClawMetry ouvre les EventSource (streams SSE) auto au boot de la page
- Sur Safari/iPhone + Caddy proxy, ça crée une boucle "Load failed - retrying"
- Fix: ajout de  dans dashboard.py du submodule
  - Désactive les streams auto sur Safari/iPhone pour stabilité
  - Dashboard consultable normalement, juste moins "live" sur mobile
- Commité dans  (submodule git)

- **Inbox Zero (ex-TDAH)** (2026-03-17) : Refonte système — renommage "TDAH" → "Inbox Zero" (scripts, logs, AGENTS.md). Intégration Google Calendar via `skills/tdah-inbox-zero/scripts/sync-to-google-calendar.sh` (API Maton Gateway, calendrier OpenClaw, rappels 15 min). Anti-doublons avec marqueur `[S]`. Blocs Pomodoro pour Gros Morceaux (30min/10min, max 3/jour). Emojis priorité dans événements (🔴🏗️🟡📅🟠🚫).
- **n8n** (2026-03-16) : Workflow automation self-hosted — `https://workflow.doudougen.xyz` (port 5678, Docker Compose + Caddy). Data persistée dans `/root/n8n/data`. Workflow principal : extraction emails RDV Euromaster (IMAP → parsing regex UTF-8 → Discord webhook). Architecture privilégiée : Code node (offline/gratuit) vs LLM.
- **pneu-tracker** (2026-03-11, maj 2026-03-23) : App suivi sorties pneus — `https://pneus.doudougen.xyz` (port 3002, auth Basic DoudouClaw, service systemd `pneu-tracker.service`). Stack actuelle : Next.js 16 + SQLite (`better-sqlite3`) + recharts + `pdfkit`. Features : formulaire enrichi, historique filtrable avec pagination visible, modification + suppression logique, import CSV, export CSV, **export PDF binaire serveur**, audit trail, dashboard, vue mobile, autocomplétion prédictive sur référentiel pneus. UI/UX redesigné le 2026-03-23 : palette Euromaster (`#144390` / `#F9E700`), header dégradé pleine largeur, dashboard/filtres améliorés, confirmations/spinners/aria mieux gérés. Référentiel métier intégré : **12 568 références** dans `tyre_catalog` (SAP, description, référence fabricant, marque, libellé de recherche, diamètre, saison). Autocomplète disponible en création, édition et recherche historique. Service prêt pour auth app-level via `EnvironmentFile`. App : `/root/projects/pneu-tracker/`.
- **ClawSuite** (2026-03-01) : Dashboard mission control — `https://clawsuite.doudougen.xyz` (port 3000, auth Basic DoudouClaw)
- **ClawMetry** (2026-03-06) : Observabilité temps réel — `https://metry.doudougen.xyz` (port 8900, auth Basic DoudouClaw, v0.11.57)
- **ClawBridge** (2026-03-06) : Dashboard mobile-first — `https://mobile.doudougen.xyz` (port 3001, auth Basic DoudouClaw, v1.1.2, Access Key: `433f8670fabc90836cd2d6f43fb9d83f`)
- **Tailscale** (2026-03-01) : VPN mesh (v1.94.2) — IP serveur `100.89.4.88`, tous dashboards accessibles
- **Agence-IA** (2026-03-10) : 112 agents spécialisés intégrés — disponibles dans `~/.openclaw/agency-agents/` — orchestration via `agents-orchestrator` — routing dans `notes/areas/agent-orchestration.md`

### Actual Budget (2026-03-21)
- **Skill installé** (ClawHub) + API testée avec succès
- **Projet finance perso** — `notes/projects/actual-budget-integration/`
- Env vars configurés dans OpenClaw (`ACTUAL_BUDGET_API_KEY`)
- **Sécurité** : .env + data supprimés de git (commit 62a9ab5)
- Prêt pour déploiement/usage dès qu'Alexandre veut piloter son budget

### Things to Remember
- Le N+1 Arnaud est une relation clé, positive (pro + perso)

---

## Relationships & People

### Arnaud
N+1 d’Alexandre (poste: Responsable de Zone, RZ). Relation de confiance forte et fluide, à préserver.

### Andréa
Amie de longue date d’Alexandre (amour de lycée) revenue récemment dans sa vie. Alexandre ne l’a jamais oubliée et pense l’aimer encore, sans savoir si c’est réciproque ni si elle a changé depuis l’époque.

### Audrey
Ex d'Alexandre et fille d'Arnaud (son RZ). Rupture définitive en mars 2025; très peu de contact depuis mi-septembre 2025. Contexte sensible qui impacte encore parfois la motivation sportive et la charge émotionnelle.

### Marine
Meilleure amie d’Alexandre, habite à Calais; relation amicale de longue date (environ 10 ans).

---

*Dernière mise à jour: 2026-03-26*
Quand je te demande de tester une clé API tu le fais
