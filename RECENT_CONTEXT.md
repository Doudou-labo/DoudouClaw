# RECENT_CONTEXT.md — Auto-Updated Recent Context

*This file is automatically updated by heartbeat to capture recent conversation highlights.*

---

## Latest Session — 2026-03-17

### Topic
Refonte système Inbox Zero (TDAH → Inbox Zero) + intégration Google Calendar.

### Key Points
- **Renommage TDAH → Inbox Zero** : scripts, logs (`/tmp/inbox-zero-reminders.log`), AGENTS.md mis à jour
- **Google Calendar sync** : nouveau script `skills/tdah-inbox-zero/scripts/sync-to-google-calendar.sh`
  - API Maton Gateway → calendrier OpenClaw
  - Rappels popup 15 min avant chaque événement
  - Anti-doublons avec marqueur `[S]` dans dashboard
- **Blocs Pomodoro** : Gros Morceaux découpés en 30min/10min, max 3 blocs/jour
- **Emojis priorité** dans titres événements calendrier (🔴🏗️🟡📅🟠🚫)
- **Dashboard** : 🔴 BMW [S] + 🏗️ Inventaire pneus [S] (3 blocs Pomodoro planifiés demain 14h)
- **Processus enrichi** : 9 étapes (ajout sync Google Calendar en étape 8)
- **7 commits poussés** ce matin

### Key Points
- **n8n self-hosted** installé et opérationnel sur `workflow.doudougen.xyz` (port 5678, Docker + Caddy)
- **Workflow RDV Extraction** créé et testé avec succès (ID: `qAH9Z6MYbMvJPydk`)
  - Trigger IMAP Gmail → extraction regex + fix UTF-8 → webhook Discord
  - Architecture validée : Code node (gratuit/offline) plutôt que LLM
  - Test réussi : email ARVAL FLEET SERVICES extrait complètement (type, prestation, immat, date, heure, kilométrage, client, loueur, téléphone)
- Problèmes résolus : encodage UTF-8 (Latin-1 → fix), source contenu (`textPlain`), erreur JS (`const` vs `let`)
- Export JSON généré : `/root/n8n/workflow-rdv-euromaster.json`

### Prochains pas
- [ ] Créer Gmail dédié (doudou.n8n@gmail.com) + activer IMAP + générer App Password
- [ ] Configurer credential IMAP dans n8n
- [ ] Rédiger backlog MVP inventaire physique pneus
- [ ] Préparer visite Marc DR (31/03/2026) — priorité RCS rouge

### Status
- [x] n8n installé et accessible
- [x] Workflow extraction emails fonctionnel
- [x] Test end-to-end réussi (Discord webhook OK)
- [ ] Configuration Gmail dédié à finaliser

---

## Latest Session — 2026-03-15

### Topic
Consolidation mémoire quotidienne + activités techniques du dimanche (benchmark + mises à jour infra).

### Key Points
- **Benchmark LLM v6** exécuté avec succès — 7 modèles sur 3 tâches, compilation dans `benchmark-results/README-v6.md`
  - Top 3 : Sonnet 4.6 (47/50), Hunter Alpha (45/50), k2p5 (45/50)
  - Meilleur gratuit : Step-3.5 Flash (42/50)
  - GPT-OSS-120b inutilisable sur tâches ouvertes (dérive vers shell/filesystem)
- **Mission Control** mis à jour v0.4.6 (provider billing, Security, Doctor, Notifications)
- **ClawSuite** mis à jour v3.2.0 (fix wizard bloquant, compat gateway 2026.3.8)
- Consolidation mémoire/PARA exécutée (cron 20:50 UTC)

### Prochains pas
- [ ] Rédiger backlog MVP inventaire physique pneus
- [ ] Préparer visite Marc DR (31/03/2026) — priorité RCS rouge
- [ ] Reprendre sprint pneu-tracker (FTS5, migrations, ARIA)

### Status
- [x] Consolidation mémoire/PARA du jour exécutée
- [x] N1 synchronisé
- [x] Benchmark LLM v6 terminé
- [x] Mission Control + ClawSuite mis à jour
- [ ] Inventaire pneus : implémentation non démarrée

*Last auto-update: 2026-03-16 20:50 UTC*
