# FTS5 vs Elasticsearch : Comparatif pour un Moteur de Recherche Applicatif

## Résumé Exécutif

**Recommandation principale** : Pour une application classique ( < 10M documents, < 1000 requêtes/sec), **FTS5 est le meilleur choix** dans 80% des cas. Elasticsearch devient justifié au-delà de ces seuils ou pour des besoins avancés (cluster distribué, recherche vectorielle, analytics temps réel).

---

## 1. Quand FTS5 Suffit

### Seuils de Performance

| Critère | Seuil FTS5 | Notes |
|---------|------------|-------|
| Volume de documents | < 10 millions | Au-delà, les performances déclinent |
| Requêtes/seconde | < 1 000 | Latence stable jusqu'à cette limite |
| Taille base de données | < 50 Go | FTS5 reste en mémoire efficace |
| Latence acceptable | 10-50 ms | Typique pour datasets modérés |

### Benchmarks Concrets FTS5

- **10-30 ms** : Latence typique pour datasets modérés (50k-500k documents) sur hardware développeur
- **Simple-digit ms** : Médiane observée après migration depuis Elasticsearch (étude Medium, nov. 2025)
- **100x plus rapide** : Cas rapporté vs Elasticsearch pour workloads simples (même étude)

### Cas d'Usage Idéaux FTS5

1. **Applications mobiles/embarquées** - Aucun serveur requis, SQLite intégré
2. **Dashboards internes** - Recherche simple sur tickets, notes, documents
3. **Applications offline-first** - Recherche locale sans dépendance réseau
4. **Startup/MVP** - Zéro infrastructure, déploiement immédiat
5. **Recherche produit e-commerce** - Jusqu'à ~100k produits avec temps de réponse < 50ms

### Points Forts FTS5

- **Coût** : 0€ d'infrastructure (pas de serveur dédié)
- **Complexité** : 0 ligne de config cluster, pas de DevOps
- **Latence** : Accès disque local, pas de saut réseau
- **Ranking BM25** : Support natif et performant
- **Recherche préfixe** : Prise en charge avec indexes optimisés

---

## 2. Quand Elasticsearch est Justifié

### Seuils de Déclenchement

| Critère | Seuil ES | Justification |
|---------|----------|---------------|
| Volume de documents | > 10-50 millions | Distribution sur plusieurs nœuds |
| Requêtes/seconde | > 1 000 | Load balancing et scalabilité horizontale |
| Haute disponibilité | 99.9% uptime | Réplication multi-nœuds |
| Recherche vectorielle | Nécessaire | Support natif KNN/ANN |
| Analytics temps réel | Nécessaire | Aggregations distribuées |

### Benchmarks Elasticsearch

D'après les tests Trail of Bits (2024-2025) :

| Métrique | OpenSearch | Elasticsearch 8.15 |
|----------|------------|---------------------|
| Text queries (p90) | 16-18 ms | 7-8 ms |
| Term aggregations (p90) | 105 ms | 355 ms |
| Date histograms (p90) | 125 ms | 2 065 ms |
| Vector search (p90) | Variable | Baseline Lucene |

### Exigences Infrastructure Elasticsearch

| Composant | Minimum Prod | Recommandé |
|-----------|--------------|------------|
| RAM par nœud | 8 Go | 16-64 Go |
| Heap JVM | 4 Go (50% RAM) | 8-31 Go |
| CPU | 2 cœurs | 4-8 cœurs |
| Stockage | SSD obligatoire | NVMe |
| Nœuds cluster | 3 (HA) | 5+ |

**Coût estimé** : 150-500€/mois minimum pour un cluster 3 nœuds production (cloud ou bare metal).

### Cas d'Usage Elasticsearch

1. **Logs et métriques** - Volume massif, ingestion continue
2. **E-commerce géant** - > 1M produits, facettes dynamiques
3. **Recherche vectorielle/IA** - RAG, embeddings, similarité
4. **Multi-tenant** - Isolation par index, sécurité avancée
5. **Analytics temps réel** - Dashboards Kibana, alerting

---

## 3. Compromis Coût/Complexité/Performance

### Tableau Comparatif

| Dimension | FTS5 | Elasticsearch |
|-----------|------|---------------|
| **Coût infrastructure** | 0€ | 150-500€+/mois |
| **Setup initial** | 5 min | 1-3 jours |
| **Maintenance DevOps** | Aucune | Continue |
| **Latence p50** | 5-20 ms | 10-50 ms (réseau inclus) |
| **Latence p90** | 30-100 ms | 50-300 ms |
| **Scalabilité** | Verticale | Horizontale illimitée |
| **Haute disponibilité** | Non (single node) | Oui (réplication) |
| **Recherche vectorielle** | Non native | Native (KNN) |
| **Facettes/aggregations** | Limitées | Très puissantes |
| **Multilingue** | unicode61 basique | Analyseurs riches |

### Trade-offs Clés

**FTS5 gagne sur** :
- Simplicité de déploiement
- Coût total de possession
- Latence (accès local)
- Scénarios offline/embedded

**Elasticsearch gagne sur** :
- Scalabilité horizontale
- Haute disponibilité
- Fonctionnalités avancées
- Écosystème (Kibana, Beats)

---

## 4. Recommandation Nette pour une App Classique

### Arbre de Décision

```
Volume < 10M docs ET QPS < 1000 ?
├── OUI → Besoin de HA/recherche vectorielle ?
│   ├── NON → FTS5 ✅
│   └── OUI → Elasticsearch
└── NON → Elasticsearch
```

### Règle Simple

> **"Commencez par FTS5. Migrez vers Elasticsearch si et seulement si vous atteignez les limites."**

### Configuration FTS5 Recommandée

```sql
CREATE VIRTUAL TABLE search_index USING fts5(
    title,
    content,
    tags,
    content='main_table',
    content_rowid='id',
    tokenize='unicode61 remove_diacritics 2',
    prefix='2 3 4'  -- Pour l'autocomplétion
);

-- Triggers pour sync automatique
CREATE TRIGGER sync_insert AFTER INSERT ON main_table BEGIN
    INSERT INTO search_index(rowid, title, content, tags)
    VALUES (new.id, new.title, new.content, new.tags);
END;
```

### Quand Migrer ?

Migrez vers Elasticsearch si vous observez :
- Latence > 100ms sur 90% des requêtes
- Volume dépassant 10M documents
- Besoin de faceting/aggregations complexes
- Nécessité de cluster multi-nœuds

---

## 5. Sources et Références

1. **Trail of Bits Benchmark (2025)** - OpenSearch vs Elasticsearch, tests sur 15 jours
2. **SQLite FTS5 Documentation** - https://www.sqlite.org/fts5.html
3. **Medium Case Study (2025)** - Migration ES → FTS5, 100x improvement
4. **Opster Guides** - Elasticsearch hardware requirements
5. **TheLinuxCode (2026)** - FTS5 performance patterns

---

## Conclusion

Pour une **application classique** avec des volumes raisonnables et des besoins de recherche texte standard, **FTS5 offre le meilleur ratio performance/coût/complexité**. Elasticsearch reste l'outil de choix pour les workloads distribués, les volumes massifs, ou les fonctionnalités avancées (vectorielle, analytics temps réel).

**Le choix n'est pas binaire** : beaucoup d'applications réussissent avec FTS5 puis migrent progressivement vers Elasticsearch quand les volumes le nécessitent. L'architecture avec FTS5 en "content-less" mode permet de garder les données principales dans des tables relationnelles, facilitant une future migration.
