# RECENT_CONTEXT.md - Highlights récents

**Dernière mise à jour : 2026-05-08 19:50 UTC**

## Highlights du jour (2026-05-08)
- **JOURNÉE TRAVAIL** (vendredi Euromaster) — aucun échange substantiel avec Alexandre
- **API PERPLEXITY — PATTERN ERRATIQUE CONFIRMÉ** : 2ème jour consécutif de panne soir (07/05 + 08/05) après 12+ jours de stabilisation → stable matin/midi, dégradé soir
- **TOKEN OPENAI-CODEX** : expiré ~120h+ → monitoring proactif critique
- **SYSTÈME STABLE** : heartbeat optimal (0 errors), auto-surveillance opérationnelle

## Contexte système
- **Statut optimal** : heartbeat auto-surveillance opérationnelle (0 errors)
- **API Perplexity** : pattern erratique soir confirmé (2 jours consécutifs) — stable matin/midi, panne 19h
- **Action prioritaire** : Régénérer token OpenAI-Codex (120h+ expiré), corriger API Perplexity, implémenter fallback veille IA soir

## Prochaines actions
- 🔴 Régénérer token OpenAI-Codex (120h+ expiré) - monitoring proactif critique
- 🔴 Corriger API Perplexity (vérifier `.credentials/perplexity-api-key.txt` ou config OpenClaw)
- 🔴 Implémenter fallback système veille IA soir (pattern erratique confirmé)
- 🟡 Surveiller API Perplexity pour confirmer pattern hebdomadaire récurrent ou stabilité durable
