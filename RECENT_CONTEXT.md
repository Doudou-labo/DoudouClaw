# RECENT_CONTEXT.md - Highlights récents

**Dernière mise à jour : 2026-05-10 19:50 UTC**

## Highlights du jour (2026-05-10)
- **JOURNÉE CALME** (dimanche) — aucun échange substantiel avec Alexandre
- **AUTO PARA WEEKLY REVIEW** : exécutée à 16:06 UTC → snapshot stable (Projects=13, Areas=25, Resources=18, Archive=9, Open loops=2)
- **AUTO SELF-IMPROVING WEEKLY REVIEW** : exécutée à 16:21 UTC → patterns erreurs détectés et tracés
- **SYSTÈME STABLE** : heartbeat optimal (0 errors), auto-surveillance opérationnelle

## Contexte système
- **Statut optimal** : heartbeat auto-surveillance opérationnelle (0 errors)
- **API Perplexity** : pattern erratique soir confirmé (2 jours consécutifs 07-08/05) — stable matin/midi, panne 19h
- **Token OpenAI-Codex** : expiré ~125h+ → monitoring proactif critique maintenu

## Prochaines actions
- 🔴 Régénérer token OpenAI-Codex (125h+ expiré) - monitoring proactif critique
- 🔴 Corriger API Perplexity (vérifier `.credentials/perplexity-api-key.txt` ou config OpenClaw)
- 🔴 Implémenter fallback système veille IA soir (pattern erratique confirmé)
- 🟡 Surveiller API Perplexity pour confirmer pattern hebdomadaire récurrent ou stabilité durable
