# Monitoring API Proactif

## Contexte Critique et Évolué (2026-04-27)

### API Instables Identifiées (validées sur 12+ jours)
- **Perplexity**: erreur auth récurrente (12+ jours) → deep dive fonctionne avec retry/délai (pattern robustesse validé)
- **OpenAI-Codex**: token expiré depuis 91h → monitoring proactif critique identifié
- **Scraping**: SIGKILL persistant OOM → nécessité timeout/retry robustes
- **Pattern**: erreurs récurrentes hebdomadaires + instabilités systèmes → monitoring proactif obligatoire

### Monitoring Proactif Requis (priorisé par impact)

#### 1. Token API Tracking (URGENT)
- **Rythme**: vérification toutes les 3h (OpenAI-Codex expiré 91h+)
- **Alertes**: 48h avant expiration (réduction délai)
- **Actions**: régénération automatique + notification proactive
- **Fallback**: bascule sur modèles alternatifs si indisponibilité > 24h

#### 2. API Health Check (robustifié)
- **Endpoints critiques**: veille IA (Flash + Deep Dive), génération contenu
- **Timeouts**: 45s max par appel (adapté API lentes)
- **Retry**: 5 tentatives avec backoff exponentiel (adapté instabilité Perplexity)
- **Fallback**: système dégradé avec sources alternatives + deep dive avec délai accepté

#### 3. Performance Monitoring (détection précoce)
- **Latence**: > 5s = alerte, > 10s = fallback automatique
- **Taux erreur**: > 10% = investigation, > 20% = bascule fallback
- **Mémoire usage**: > 70% = alerte, > 85% = limitation flux concurrents
- **CPU usage**: > 80% = scaling, > 95% = limitation services non critiques

### Prochaines Étapes (triées par urgence)
1. 🔴 **Token OpenAI-Codex** : régénération immédiate avant 96h d'expiration
2. 🔴 **Scraping timeout/retry** : implémenter mécanismes robustes éviter SIGKILL OOM
3. 🟡 **Alertes proactives** : dashboard monitoring API avec notifications push
4. 🟡 **Fallback Perplexity** : mécanisme alternatif (web_search + sources alternatives)
5. 🟡 **Monitoring performance** : dashboard实时 monitoring latence/mémoire/CPU

### Métriques Cibles (révisées)
- **Uptime API**: > 99% (adapté instabilité API connue)
- **Temps réponse moyen**: < 3s (avec tolerance API lentes)
- **Taux succès**: > 90% (avec fallback système)
- **Alertes résolues**: < 1h (monitoring proactif rapide)
- **Deep dive disponibilité**: > 80% (avec retry/délai accepté)

---
*Monitoring proactif = facteur critique de stabilité système*