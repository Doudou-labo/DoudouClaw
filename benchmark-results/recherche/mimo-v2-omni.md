# FTS5 vs Elasticsearch — Benchmark pour un Moteur de Recherche Applicatif

## Résumé Exécutif

Pour la grande majorité des applications classiques (e-commerce SaaS, CMS, ERP, intranet), **FTS5 suffit amplement** et coûte ~100× moins en infrastructure. Elasticsearch n'est justifié que dès lors que le volume dépasse 1M de documents, que la latence inter-réseaux est acceptable, ou que des fonctionnalités avancées (NLP, analytique temps réel, géolocalisation) sont réellement nécessaires.

---

## 1. Quand FTS5 Suffit (Seuils Chiffrés)

### Profil idéal pour FTS5

| Paramètre | Seuil confortable FTS5 | Seuil limite | Au-delà → réfléchir |
|---|---|---|---|
| **Documents indexés** | < 500 000 | 500K – 1M | > 1M |
| **Requêtes simultanées** | < 200 concurrentes | 200 – 500 | > 500 |
| **Taille du corpus** | < 10 Go | 10 – 30 Go | > 30 Go |
| **Latence requise (p95)** | < 100 ms | 100 – 200 ms | < 50 ms exigé |
| **Throughput estimé** | ~800 req/s (mononœud) | ~1 200 req/s (WAL + SSD) | > 2 000 req/s |

### Benchmarks observés

**Test local (wrk, 8 threads, 50 connexions, 30s) — 7 000 documents :**
- Latence moyenne : **57 ms**
- Débit : **840 req/s**
- Latence max : **83 ms**

**Extrapolation raisonnable (WAL mode, SSD, index dédié) :**

| Documents | Latence moyenne | Throughput estimé | Observations |
|---|---|---|---|
| 10 000 | < 10 ms | > 1 500 req/s | Quasi-instantané |
| 100 000 | 20 – 40 ms | 800 – 1 200 req/s | Confortable |
| 500 000 | 40 – 80 ms | 400 – 800 req/s | Limite haute du « sweet spot » |
| 1 000 000 | 80 – 150 ms | 200 – 400 req/s | Fonctionnel mais dégradé |

### Avantages structurels de FTS5

- **Zéro infrastructure supplémentaire** : pas de processus séparé, pas de réseau
- **Latence nulle** (in-process) : pas de SPOF réseau
- **BM25 natif** : même algorithme de ranking que Solr/ES
- **`snippet()` intégré** : highlighting sans config
- **WAL mode** : concurrence lecture sans blocage
- **Coût** : 0 € (inclut dans SQLite, déjà dans votre runtime)
- **Maintenance** : ~0 (vacuum occasionnel, compactage d'index)
- **Déploiement** : un fichier `.db`, c'est tout

### Cas concrets où FTS5 est suffisant

- Recherche interne dans un SaaS (< 100K produits/clients)
- Moteur de recherche blog/CMS (< 50K articles)
- Annuaire interne d'entreprise
- Recherche dans documentation technique
- Autocomplétion locale (prefix matching natif)
- ERP / CRM avec recherche multi-champs

---

## 2. Quand Elasticsearch est Justifié

### Profil nécessitant Elasticsearch

| Critère | Seuil | Raison |
|---|---|---|
| **Documents** | > 1 – 5M | FTS5 se dégrade au-delà de ~1M |
| **Requêtes concurrentes** | > 500 – 1 000 | Single-writer bottleneck de SQLite |
| **Distribution** | Multi-région / multi-datacenter | FTS5 = mononœud |
| **Latence p99** | < 20 ms exigé | ES caching + shard distribution |
| **Facettes complexes** | > 10 dimensions, agrégations temps réel | FTS5 supporte basiquement |
| **NLP / Analyse sémantique** | Synonymes, stemming multi-langue, typo-tolerant | ES >> FTS5 |
| **Géolocalisation** | Recherche par rayon, scoring géographique | Plugin natif ES |
| **Log analytics** | Time-series, Kibana dashboards | Cas d'usage ES natif |
| **ML intégré** | Learning-to-rank, anomaly detection | Fonctionnalités ES Platinum |

### Benchmarks Elasticsearch (références publiques)

| Documents | Latence p50 | Latence p99 | Throughput (3 nœuds) |
|---|---|---|---|
| 100 000 | 5 – 15 ms | 30 – 60 ms | > 5 000 req/s |
| 1 000 000 | 10 – 30 ms | 50 – 100 ms | 3 000 – 8 000 req/s |
| 10 000 000 | 20 – 50 ms | 80 – 200 ms | 2 000 – 5 000 req/s |
| 100 000 000 | 30 – 80 ms | 150 – 500 ms | 1 000 – 3 000 req/s |

*Les performances ES varient énormément selon la config (shards, RAM heap, SSD NVMe).*

---

## 3. Compromis Coût / Complexité / Performance

### Matrice de comparaison détaillée

| Dimension | FTS5 | Elasticsearch |
|---|---|---|
| **Coût infrastructure** | **0 €** (fichier local) | **100 – 2 000 €/mois** (1 – 3 nœuds, 16 – 64 Go RAM) |
| **Coût ops (FTE)** | **0 FTE** (dev gère) | **0.25 – 0.5 FTE** (DevOps dédié) |
| **Temps de déploiement** | **< 1 heure** | **2 – 5 jours** (config, tuning, security) |
| **Temps de dev (API)** | **2 – 5 jours** (requêtes SQL) | **5 – 15 jours** (REST API, mapping, analyzers) |
| **Latence typique (100K docs)** | 20 – 40 ms | 5 – 15 ms |
| **Throughput max (mononœud)** | ~1 200 req/s | ~5 000 req/s (heap 32 Go) |
| **Scalabilité horizontale** | ❌ Impossible | ✅ Sharding natif |
| **Disponibilité** | Limite du serveur app | ✅ Replication, failover |
| **Fonctionnalités search** | BM25, prefix, snippet | BM25, NLP, facets, geo, ML, synonyms |
| **Maintenance** | Vacuum / compactage auto | JVM tuning, shard rebalancing, upgrades |
| **Dépendances** | Aucune (stdlib) | Java 17+, heap tuning, disques rapides |
| **Migration** | Trivial (fichier .db) | Mapping JSON, reindexation, testing |

### Coût total de possession (TCO) — Scénario typique

**Application SaaS, 200K documents, 100 req/s en pic :**

| | FTS5 | Elasticsearch |
|---|---|---|
| Infrastructure annuelle | 0 € | 3 600 – 24 000 € |
| Coût ops annuel (0.25 FTE à 80K€) | 0 € | 20 000 € |
| Coût dev initial | ~3 000 € | ~12 000 € |
| **TCO année 1** | **~3 000 €** | **~35 000 – 56 000 €** |
| **TCO année 2+** | **~500 €/an** (maintenance) | **~24 000 – 44 000 €/an** |

**Rapport coût : FTS5 coûte ~10× à ~20× moins cher.**

### Scénario où ES devient rentable

Si votre application a :
- > 5M documents avec croissance > 200K/mois
- > 500 req/s soutenu
- Besoin de géolocalisation, NLP, ou analytics temps réel
- Équipe DevOps de 2+ personnes déjà en place

→ L'investissement ES est alors amorti par la valeur ajoutée fonctionnelle.

---

## 4. Recommandation Nette pour une App Classique

### 🏆 Verdict : FTS5, sauf raison contraire explicite

**Pour 90% des applications classiques** (SaaS, CMS, e-commerce < 500K produits, ERP, intranet, app mobile backend) :

> **Commencez par FTS5.** Vous aurez un moteur de recherche avec BM25, highlighting, autocomplétion, et des performances confortables — le tout sans déployer, maintenir, ou payer un service supplémentaire.

### Arbre de décision simplifié

```
Votre app a-t-elle > 1M de documents ?
├── Non → FTS5
└── Oui → Avez-vous besoin de NLP/geo/analytics ?
         ├── Non → FTS5 (ou Meilisearch/T Typesense si besoin de perf)
         └── Oui → Elasticsearch
```

```
Votre app a-t-elle > 500 req/s soutenu ?
├── Non → FTS5
└── Oui → Avez-vous une équipe DevOps ?
         ├── Non → FTS5 + cache (Redis) + éventuellement Meilisearch
         └── Oui → Elasticsearch
```

### Migration progressive recommandée

1. **Phase 1 (lancement → 100K docs)** : FTS5, simple, zéro coût
2. **Phase 2 (100K → 500K)** : FTS5 + WAL tuning + éventuellement Redis en cache
3. **Phase 3 (500K → 1M)** : Évaluer — FTS5 peut encore tenir ou passer à Typesense/Meilisearch
4. **Phase 4 (> 1M)** : Elasticsearch ou solution distribuée dédiée

### Alternatives intermédiaires à considérer

Si FTS5 commence à être juste mais ES est overkill :

| Solution | Coût | Perf (1M docs) | Complexité |
|---|---|---|---|
| **Typesense** | ~0 (open-source) | 10 – 30 ms | Faible (binaire unique) |
| **Meilisearch** | ~0 (open-source) | 5 – 20 ms | Faible (binaire unique) |
| **SQLite FTS5** | 0 € | 80 – 150 ms | Nulle |
| **Elasticsearch** | 100+ €/mois | 10 – 30 ms | Élevée |

---

## Sources & Méthodologie

- Benchmarks FTS5 : Jasper Smet (2025), test wrk sur 7K documents, extrapolation raisonnable basée sur la complexité O(log n) de l'inverted index
- Benchmarks ES : synthèse de benchmarks communautaires et documentation Elastic
- TCO : estimation basée sur tarifs AWS/GCP 2024-2025, salaire DevOps France
- Recommandations : synthèse d'expériences pratiques et de l'article de Smet sur FTS5 en production Drupal

**Avertissement** : les benchmarks sont des ordres de grandeur. Les performances réelles dépendent du hardware, de la structure des données, des requêtes, et du tuning. Toujours benchmarker avec vos propres données.
