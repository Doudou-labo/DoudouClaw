# Monitoring API Proactif

## Contexte Critique (2026-04-19)

### API Instables Identifiées
- **Perplexity**: erreur auth récurrente (9+ jours) → bloque deep dive veille IA
- **OpenAI-Codex**: token expiré depuis 85h → dépendances potentiellement affectées
- **Pattern**: erreurs récurrentes hebdomadaires → nécessité monitoring proactif

### Monitoring Proactif Requis

#### 1. Token API Tracking
- **Rythme**: vérification toutes les 6h
- **Alertes**: 72h avant expiration
- **Actions**: régénération automatique + notification
- **Fallback**: bascule sur modèles alternatifs si indisponibilité prolongée

#### 2. API Health Check
- **Endpoints critiques**: veille IA, génération contenu
- **Timeouts**: 30s max par appel
- **Retry**: 3 tentatives avec backoff exponentiel
- **Fallback**: système dégradé avec moins de sources

#### 3. Performance Monitoring
- **Latence**: > 5s = alerte
- **Taux erreur**: > 10% = investigation
- **Mémoire usage**: > 80% = alerte OOM
- **CPU usage**: > 90% = scaling nécessaire

### Prochaines Étapes
1. 🟡 Implémenter dashboard monitoring API (dashboard.doudougen.xyz)
2. 🟡 Créer alertes proactives tokens expirés
3. 🟡 Ajouter mécanisme fallback Perplexity (web_search + sources alternatives)
4. 🔧 Configurer retry robustes pour scraping multi-URLs
5. 🔧 Limiter concurrence extractions simultanées

### Métriques Cibles
- **Uptime API**: > 99.5%
- **Temps réponse moyen**: < 2s
- **Taux succès**: > 95%
- **Alertes résolues**: < 2h

---
*Monitoring proactif = facteur critique de stabilité système*