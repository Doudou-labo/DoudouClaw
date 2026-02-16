# RECENT_CONTEXT.md — Auto-Updated Recent Context

*This file is automatically updated by heartbeat to capture recent conversation highlights.*
*Read this at session start to quickly recover context.*

---

## Latest Session

### Topic
Stabilisation du modèle Sonnet + migration complète GitHub vers organisation `Doudou-labo`.

### Key Points
- Incident de switch modèle diagnostiqué:
  - `google-antigravity/claude-sonnet-4-5` en erreur 403 (service disabled / ToS)
  - failover provoquait des bascules inattendues (opus/codex) et confusion UI.
- Correctifs appliqués:
  - aliases explicites (`sonnet-a`, `sonnet-g`, `haiku`, `opus`, `opus45`)
  - retrait des modèles `google-antigravity/*` des fallbacks.
- GitHub:
  - org créée: `Doudou-labo`
  - repo cible validé: `Doudou-labo/DoudouClaw`
  - project org créé: `https://github.com/orgs/Doudou-labo/projects/1`
  - issues migrées et liées au project.

### Status
- [x] Modèle Sonnet stabilisé après nettoyage fallback
- [x] Repo GitHub cible basculé sur `Doudou-labo/DoudouClaw`
- [x] Project + issues opérationnels sur l'org

---

*Last auto-update: 2026-02-16 23:10 UTC*