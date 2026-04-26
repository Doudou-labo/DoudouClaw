2026-02-14 | CRM->Google Tasks sync --apply failed with HTTP 404 during tasks_patch (task not found). Action: validate stale Google Task IDs mapping and handle 404 by recreate/skip.
2026-02-16 | CRM->Google Tasks sync --apply failed again with HTTP 404 during tasks_patch(tasklist_id, tid). Action: log exact request URL + IDs; treat 404 as non-fatal (skip/cleanup mapping) and continue.

## 2026-02-15 17:20 UTC
- Findings: aucun pattern d'erreur marquant détecté

## 2026-02-22 17:20 UTC
- Findings: aucun pattern d'erreur marquant détecté

## 2026-03-01 17:20 UTC
- Findings: aucun pattern d'erreur marquant détecté

## [ERR-20260302-002] default-model-patch

**Logged**: 2026-03-02T20:05:00Z
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
Tentative de set du modèle par défaut via `agents.defaults.model.default` — mauvaise clé, a cassé la config.

### Context
- Instruction : définir `anthropic/claude-sonnet-4-6` comme modèle par défaut pour toutes les sessions
- Action fausse : ajout d'une clé `default` dans `agents.defaults.model`
- Bonne action : modifier la clé **primaire** existante (pas en ajouter une nouvelle)
- Alexandre a corrigé manuellement. **Ne pas retoucher.**

### Suggested Fix
Avant tout patch `openclaw.json` : lire la structure EXACTE du nœud cible et ne modifier que les clés existantes.

### Resolution
- **Resolved**: 2026-03-02T20:05:00Z
- **Notes**: Corrigé par Alexandre manuellement.

---

## 2026-03-08 17:20 UTC
- Findings: aucun pattern d'erreur marquant détecté

## 2026-03-22 17:20 UTC
- Findings: erreurs/outils détectés dans les mémoires récentes
- Sources:
  - memory/2026-03-22.md:26:- Timeout par sous-agent : 1200s ; résultats récupérés via auto-announce
- Action: transformer les patterns récurrents en gotchas dans TOOLS.md

## 2026-04-05 16:20 UTC
- Findings: erreurs/outils détectés dans les mémoires récentes
- Sources:
  - memory/2026-04-05.md:11:- **Veille IA 12h**: Échec de scraping - processus tué (SIGKILL) pendant l'extraction de contenu de 5 URLs
  - memory/2026-04-05.md:32:4. 🔄 **Script veille**: Ajouter des timeouts et mécanismes de retry
  - memory/2026-04-05.md:37:- ❌ Crons défaillants diagnostiqués
- Action: transformer les patterns récurrents en gotchas dans TOOLS.md

## 2026-04-12 16:20 UTC
- Findings: erreurs/outils détectés dans les mémoires récentes
- Sources:
  - memory/MEMORY.md:19:- [fact] Heartbeat system optimal : auto-heal ✅, auto-commit ✅, auto-optimize ✅ (0 errors vs 54 hier), auto-learn ✅, auto-alert ✅, auto-cleanup ✅
  - memory/MEMORY.md:20:- [fact] API critique récurrente : Perplexité erreur auth depuis 5+ jours (défaillance pattern ~1/semaine à 14:52, 17:00, 19:03)
- Action: transformer les patterns récurrents en gotchas dans TOOLS.md

## 2026-04-19 16:20 UTC
- Findings: erreurs/outils détectés dans les mémoires récentes
- Sources:
  - memory/MEMORY.md:19:- [fact] Heartbeat system optimal : auto-heal ✅, auto-commit ✅, auto-optimize ✅ (0 errors vs 54 hier), auto-learn ✅, auto-alert ✅, auto-cleanup ✅
  - memory/MEMORY.md:20:- [fact] API critique récurrente : Perplexité erreur auth depuis 5+ jours (défaillance pattern ~1/semaine à 14:52, 17:00, 19:03)
- Action: transformer les patterns récurrents en gotchas dans TOOLS.md

## 2026-04-26 16:20 UTC
- Findings: erreurs/outils détectés dans les mémoires récentes
- Sources:
  - memory/MEMORY.md:19:- [fact] Heartbeat system optimal : auto-heal ✅, auto-commit ✅, auto-optimize ✅ (0 errors vs 54 hier), auto-learn ✅, auto-alert ✅, auto-cleanup ✅
  - memory/MEMORY.md:20:- [fact] API critique récurrente : Perplexité erreur auth depuis 5+ jours (défaillance pattern ~1/semaine à 14:52, 17:00, 19:03)
- Action: transformer les patterns récurrents en gotchas dans TOOLS.md
