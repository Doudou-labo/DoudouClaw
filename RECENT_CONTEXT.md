# RECENT_CONTEXT.md - Highlights récents

**Dernière mise à jour : 2026-05-22 19:50 UTC**

## Highlights du jour (2026-05-22)
- **JOURNÉE TRAVAIL** (vendredi Euromaster) — aucun échange substantiel avec Alexandre
- **VEILLE IA 12h/19h** : générées avec succès malgré Perplexity API down (Google I/O, Meta -8000, OpenAI IPO, AI Act UE)
- **API PERPLEXITY** : pattern erratique soir **confirmé et aggravé** — 5ème panne en 3 semaines, fallback web_search efficace
- **AUTO PARA** : checkpoint midi exécuté à 10:05 UTC ✅
- **SYSTÈME STABLE** : heartbeat optimal (0 errors)

## Contexte système
- **Statut optimal** : heartbeat auto-surveillance opérationnelle (0 errors)
- **API Perplexity** : pattern erratique structurel confirmé (panne 12h ET 19h le 22/05) — investigation credentials nécessaire
- **Token OpenAI-Codex** : expiré ~168h+ → monitoring proactif critique maintenu
- **Pattern robustesse** : fallback web_search efficace quand Perplexity tombe — veille IA maintenue malgré contraintes

## Prochaines actions
- 🔴 Régénérer token OpenAI-Codex (168h+ expiré) - monitoring proactif critique
- 🔴 Corriger API Perplexity (vérifier `.credentials/perplexity-api-key.txt` ou config OpenClaw — 5 pannes en 3 semaines)
- 🔴 Implémenter fallback système veille IA soir (pattern structurel confirmé)
- 🟡 Surveiller API Perplexity pour confirmer pattern hebdomadaire récurrent
