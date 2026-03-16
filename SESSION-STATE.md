# SESSION-STATE.md — Active Working Memory

## Current Task
Consolidation mémoire quotidienne exécutée. Prochains chantiers prioritaires :
1. **Configuration n8n** — créer Gmail dédié + activer IMAP + configurer credential
2. **Inventaire physique pneus** — rédiger puis implémenter le backlog MVP technique
3. **Préparation visite Marc (DR)** — 31/03/2026, priorité RCS rouge
4. **Pneu-tracker** — reprendre sprint FTS5/migrations/ARIA quand bande-passante dispo

## Dernier travail réalisé (2026-03-16)
- **n8n self-hosted** — installation complète sur `workflow.doudougen.xyz` (Docker + Caddy)
- **Workflow extraction RDV** — création et test du workflow `qAH9Z6MYbMvJPydk`
  - Extraction emails Euromaster (pneus/entretien) via IMAP
  - Parsing regex avec fix UTF-8 (Latin-1 → caractères accentués)
  - Webhook Discord fonctionnel (test ARVAL FLEET SERVICES réussi)
  - Export JSON : `/root/n8n/workflow-rdv-euromaster.json`
- Architecture validée : Code node (offline/gratuit) vs LLM (trop complexe/costly)

## Immediate Context
- N1 synchronisé : `memory/2026-03-16.md`, `SESSION-STATE.md`, `RECENT_CONTEXT.md`
- Aucun échange utilisateur direct aujourd'hui
- n8n opérationnel, en attente de configuration Gmail dédié
- Projets stables

## Key Decisions (actives)
1. Jurons français sans modération = identité DoudouClaw.
2. Politique accès mémoire N1/N2/N3 active.
3. Commits/push systématiques via bot DoudouClaw.
4. Calendrier OpenClaw = `88b14e5c160f914b9743cf46d6ff857ed6baedc24449bccee0cb56c531ac20a0@group.calendar.google.com`.
5. Projet Venus Beauté validé : stack Next.js + Caddy sur `venusbeaute.doudougen.xyz`.
6. Mode mémoire **fsxmemory niveau 2.5** + règle miroir active.
7. `qmd` indexe uniquement la collection `memory`.
8. Migration 100% Agence-IA validée (2026-03-10).
9. **n8n** : architecture Code node privilégiée vs LLM pour workflows internes.

## Key Files
- `memory/2026-03-16.md`
- `MEMORY.md`
- `notes/areas/open-loops.md`
- `RECENT_CONTEXT.md`
- `notes/projects/n8n-extraction-pneus-mail.md`

## Last Updated
2026-03-16 20:50 UTC — consolidation mémoire/PARA exécutée. N1 synchronisé.
