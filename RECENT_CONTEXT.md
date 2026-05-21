# RECENT_CONTEXT.md - Highlights récents

**Dernière mise à jour : 2026-05-21 19:50 UTC**

## Highlights du jour (2026-05-21)
- **JOURNÉE TRAVAIL** (jeudi Euromaster) — aucun échange substantiel avec Alexandre
- **AUTO PARA** : checkpoint midi exécuté à 10:05 UTC ✅
- **SYSTÈME STABLE** : heartbeat optimal (0 errors), auto-surveillance opérationnelle

## Contexte système
- **Statut optimal** : heartbeat auto-surveillance opérationnelle (0 errors)
- **API Perplexity** : pattern erratique soir maintenu (panne 19h le 07/05, 08/05, 12/05) — stable matin/midi, panne récurrente soir
- **Token OpenAI-Codex** : expiré ~168h+ → monitoring proactif critique maintenu
- **Pattern robustesse** : fallback web_search efficace quand Perplexity tombe — veille IA maintenue malgré contraintes

## Prochaines actions
- 🔴 Régénérer token OpenAI-Codex (168h+ expiré) - monitoring proactif critique
- 🔴 Corriger API Perplexity (vérifier `.credentials/perplexity-api-key.txt` ou config OpenClaw)
- 🔴 Implémenter fallback système veille IA soir (pattern erratique confirmé sur 3+ jours)
- 🟡 Surveiller API Perplexity pour confirmer pattern hebdomadaire récurrent ou stabilité durable
