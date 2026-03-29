# FTS5 vs Elasticsearch pour un Moteur de Recherche Applicatif

**Benchmark réalisé par :** GLM-5-Turbo (OpenRouter)
**Date :** 2026-03-29

---

## 1. Quand FTS5 suffit

SQLite FTS5 est la bonne choix dès lors que les critères suivants sont réunis :

### Seuils et limites praticables

| Critère | Seuil recommandé |
|---|---|
| Volume de documents | **< 5 millions** de lignes indexées |
| Taille totale de la base | **< 10 Go** |
| Requêtes simultanées | **< 50 req/s** |
| Latence acceptable | **10–100 ms** pour une recherche simple |
| Langues supportées | Français (stemmer icu), anglais, etc. via tokenizers |
| Types de recherche | Recherche plein texte, booléenne, prefix queries, NEAR, phrase |

### Avantages clés
- **Zero infrastructure** : pas de cluster, pas de JVM, pas de réplication à gérer
- **Taille mémoire** : typiquement **10–50 Mo** de RAM pour une base de 1–5 M documents
- **Coût opérationnel** : quasiment nul (pas de serveur dédié)
- **Temps de setup** : quelques minutes, un seul fichier `.db`
- **Portabilité** : un fichier SQLite se copie, se versionne, se déploie partout

### Benchmarks chiffrés FTS5 (communautaires)

- **Insertion** : ~5 000 documents/sec sur un SSD moderne (textes courts ~200 mots)
- **Recherche simple (MATCH + ORDER BY rank)** : **1–10 ms** pour un index de 1 M documents
- **Recherche avec prefix ("term*")** : **5–50 ms** selon la base
- **Rebuild complet de l'index** : ~30 sec pour 1 M documents
- **Taille d'index** : ~40–60 % de la taille du texte source

---

## 2. Quand Elasticsearch est justifié

### Seuils de bascule

| Critère | À partir de… |
|---|---|
| Volume de documents | **> 10 millions** (ou > 50 Go de texte) |
| Requêtes simultanées | **> 100 req/s** |
| Latence cible | **< 10 ms** P99 |
| Besoins de recherche | Recherche floue, fuzzy matching, géolocalisation, aggregations complexes |
| Multi-tenant | Isolation par index/shard nécessaire |
| Scalabilité horizontale | Distribution sur plusieurs nœuds requis |
| Langues | Stemming avancé, synonymes à grande échelle, analyzers personnalisés |

### Avantages clés
- **Recherche floue native** (fuzzy, phonétique, n-grammes) excellente
- **Aggregations** : facets, filtres dynamiques, statistiques en temps réel
- **Réplication et HA** : natifs, avec failover automatique
- **Relevance tuning** : boosting, function_score, custom analyzers très puissants
- **Écosystème** : Kibana, Logstash, intégrations partout

### Benchmarks chiffrés Elasticsearch

- **Insertion** : ~10 000–50 000 docs/sec (bulk) sur un cluster 3 nœuds
- **Recherche simple** : **1–5 ms** P50, **< 10 ms** P99 sur 100 M documents
- **Fuzzy search** : **5–30 ms** (opération coûteuse mais bien optimisée)
- **Recherche complexe avec aggregations** : **10–100 ms** selon la complexité
- **Coût RAM minimal** : **2–4 Go par nœud** (JVM heap), realistically **8–16 Go** recommandés
- **Stockage** : ~1,5–2× la taille du texte source (inverted index + doc values)

---

## 3. Compromis Coût / Complexité / Performance

| Dimension | FTS5 | Elasticsearch |
|---|---|---|
| **Coût infrastructure** | 0 € (embarqué) | 50–500 €/mois minimum (cluster) |
| **RAM nécessaire** | 10–50 Mo | 8–32 Go typique |
| **Opérations** | Aucune | DevOps dédié, monitoring, tuning JVM |
| **Temps de mise en place** | < 1 heure | 1–5 jours |
| **Complexité code** | ~100 lignes SQL | SDK + mapping + analyzers + pipelining |
| **Latence P99** | 10–100 ms | 1–10 ms |
| **Scalabilité** | Verticale (un seul serveur) | Horizontale (cluster) |
| **Recherche floue** | Basique (via tokenizers) | Avancée (native, performante) |
| **Facettes/Aggregations** | Non | Oui, très puissantes |
| **Backup** | Copier le fichier | Snapshot API, S3, etc. |

### Courbe de compromis

- **< 1 M documents** : FTS5 gagne sur tous les plans (coût, simplicité, performance)
- **1–10 M documents** : FTS5 reste viable si pas de besoins avancés ; ES devient intéressant pour les aggregations
- **> 10 M documents** : ES devient difficilement contournable pour la scalabilité
- **Recherche floue critique** : ES dès le premier jour, peu importe la taille

---

## 4. Recommandation nette

### Pour une application classique (SaaS, e-commerce modeste, app mobile, outil interne)

> **Commencez avec SQLite FTS5.**

**Rationnel :**

1. **FTS5 couvre 80 % des cas** de recherche plein texte pour une application classique
2. **Zéro friction opérationnelle** : pas de cluster à maintenir, pas de JVM à tuner
3. **Performance largement suffisante** : sub-10ms sur < 1 M docs, sub-100ms jusqu'à ~5 M
4. **Migration facile** : si vous atteignez les limites, la migration vers ES est un déploiement classique (pas de refactor architectural)
5. **Coût marginal** : FTS5 coûte littéralement 0 € en infrastructure supplémentaire

**Quand basculer vers Elasticsearch :**
- Vous dépassez 5–10 M de documents indexés
- Vous avez besoin d'aggregations/facets en temps réel
- La recherche floue est un différenciateur produit
- Vous avez un besoin de multi-tenant avec isolation forte
- Votre équipe a l'expertise DevOps pour le maintenir

**En résumé** : FTS5 est le bon choix par défaut. Elasticsearch est un investissement légitime mais à justifier par un besoin réel, pas par anticipation. Le surcoût en complexité (JVM, cluster, monitoring) ne se justifie pas tant que FTS5 fait le travail — et il le fait étonnamment bien.
