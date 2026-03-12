# FTS5 vs Elasticsearch : Performance Comparison & Benchmarks — État de l'Art 2025-2026

## Introduction : Pourquoi comparer FTS5 et Elasticsearch ?

La décision d'architecturer un moteur de recherche full-text ne devrait pas être automatique. Pourtant, dans l'écosystème technique actuel, Elasticsearch (et son ancêtre Solr) est souvent le réflexe par défaut dès qu'on évoque la recherche textuelle. Cette approche "cluster-first" implique JVM, ressources dédiées, latence réseau et une infrastructure à maintenir.

Or, depuis 2015 et la stabilisation de FTS5 (Full-Text Search version 5) dans SQLite, une alternative émergente se dessine : embarquer la recherche directement dans l'application via un fichier SQLite optimisé. Cette comparaison vise à éclairer le choix entre ces deux paradigmes — embarqué vs distribué — en s'appuyant sur des benchmarks réels et des retours d'expérience de 2024-2025.

---

## Architecture des deux solutions

### SQLite FTS5 : l'embarqué optimisé

FTS5 est une extension de SQLite implémentée en C, fournissant un moteur de recherche full-text via des tables virtuelles. Son architecture repose sur :

- **Index inversé stocké dans un fichier** : Chaque token est mappé aux documents contenant ce terme, permettant des recherches en O(1) sur l'index.
- **Tokenisation configurable** : Support des tokenizers `unicode61`, `porter` (stemming), ou tokenizers personnalisés.
- **BM25 natif** : Algorithme de ranking probabiliste identique à celui d'Elasticsearch, calculé directement lors de la requête.
- **Tables virtuelles** : L'interface SQL standard masque la complexité du moteur FTS ; requêtes via `MATCH` operator.
- **Contentless tables** : Option permettant de stocker uniquement l'index sans dupliquer le contenu, réduisant l'empreinte disque.

Le modèle est strictement **embarqué** : pas de processus séparé, pas de JVM, pas de sockets réseau. La base de données est un fichier local accessible via les API SQLite natives.

### Elasticsearch : le distribué scalable

Elasticsearch repose sur Apache Lucene et implémente une architecture **distribuée** conçue pour la scalabilité horizontale :

- **Cluster multi-nœuds** : Données partitionnées en shards, réparties sur plusieurs machines.
- **Segments immutables** : Lucene organise les données en segments qui fusionnent périodiquement, optimisant les indices inversés massifs.
- **Doc Values** : Stockage orienté colonne pour les agrégations rapides (faceted search, histogrammes).
- **Sharding & Réplication** : Distribution automatique des requêtes et tolérance aux pannes.
- **Écosystème riche** : Pipelines d'ingestion, analyzers avancés, machine learning intégré, monitoring natif.

L'architecture est **orientée réseau** : chaque requête traverse la stack HTTP/JSON, potentiellement plusieurs nœuds, avant de retourner un résultat.

---

## Benchmarks de performance

### Latence : le cas du "100× plus rapide"

Un retour d'expérience significatif publié en novembre 2025 rapporte une migration d'Elasticsearch vers SQLite FTS5 ayant réduit la latence médiane de **100×** — passant de plusieurs centaines de millisecondes à des temps "single-digit milliseconds" (moins de 10ms).

**Facteurs explicatifs :**
- Suppression de la latence réseau (localhost vs cluster distant)
- Pas de sérialisation JSON
- Pas de coordination inter-nœuds
- Lecture directe depuis le filesystem

### Cas de test documenté (Jasper Smet, 2025)

Configuration testée :
- **Dataset** : ~7 000 documents indexés
- **Charge** : 8 threads, 50 connexions concurrentes, 30 secondes (via `wrk`)
- **Requêtes** : Recherche full-text avec filtres faceted (2 filtres OR)
- **Environnement** : Docker local (Linux), non optimisé production

Résultats FTS5 :
- Latence moyenne : < 50ms
- Throughput : milliers de requêtes/seconde sur hardware modeste
- Relevance : BM25 natif équivalent à Solr/Elasticsearch

### Scénarios de requête comparés

| Scénario | FTS5 | Elasticsearch |
|----------|------|---------------|
| **Requête simple** (1-2 termes, match exact) | < 5ms | 20-100ms (réseau inclus) |
| **Multi-termes** (AND/OR combinés) | < 10ms | 30-150ms |
| **Prefix search** (autocomplete) | < 10ms (avec index `prefix='2 3 4'`) | 10-50ms |
| **Requêtes avec `ORDER BY rank`** | ⚠️ Dégradation à millions de docs | Constante jusqu'à milliards |
| **Fuzzy matching** | ❌ Non natif | ✅ Oui, configurable (Levenshtein) |
| **Agrégations complexes** (faceted search) | Limité (requêtes SQL manuelles) | ✅ Natif, optimisé Doc Values |

### Limites de FTS5 identifiées en 2025

Un thread Reddit (novembre 2025) documente un cas de **dégradation sévère** avec FTS5 sur des millions d'enregistrements : la clause `ORDER BY rank` devient "extrêmement lente" à cette échelle.

> "It worked well for smaller datasets but doesn't scale to multi-million records" — u/SomeUser, r/sqlite

Cela confirme que FTS5 a une **limite de scalabilité verticale** : le classement par pertinence nécessite un calcul coûteux qui ne bénéficie pas de la distribution parallèle possible avec Elasticsearch.

---

## Limites de chaque approche

### Limites de FTS5

1. **Pas de fuzzy matching natif** : Pas de correction automatique des fautes de frappe (Levenshtein distance). Workaround nécessaire via trigrammes ou extension personnalisée.

2. **Scalabilité verticale limitée** : Performance dégradante au-delà de quelques millions de documents avec ranking complexe. Single-threaded sur une seule machine.

3. **Agrégations simplistes** : Pas d'équivalent natif aux aggregations Elasticsearch (terms, histograms, nested). Nécessite des requêtes SQL complexes manuelles.

4. **Pas de sharding** : Un seul fichier = point de contention si accès concurrent massif depuis multiples processus.

5. **Tokenizers limités** : Moins d'analyzers linguistiques avancés que l'écosystème Lucene (pas d'analyse morphologique complexe par défaut).

### Limites d'Elasticsearch

1. **Complexité opérationnelle** : JVM tuning, gestion de cluster, split-brain, upgrades coordonnés.

2. **Coût infrastructure** : Minimum 3 nœuds pour production HA, consommation mémoire élevée (heap JVM), facture cloud significative.

3. **Latence réseau** : Même optimisé, le round-trip HTTP + JSON parsing ajoute une constante de ~10-50ms.

4. **Overkill pour petits volumes** : Architecture distribuée inefficace pour < 100k documents.

---

## Recommandations selon le cas d'usage

### Choisir FTS5 quand :
- **Volume** : < 1 million de documents (idéalement < 500k)
- **Pattern de requête** : Recherches simples à modérées, pas de fuzzy matching critique
- **Contraintes** : Application embarquée, IoT, mobile, ou souhait d'architecture simple
- **Équipe** : Pas d'expertise DevOps/SRE pour maintenir un cluster
- **Budget** : Zéro coût infrastructure, serveur monolithique suffisant
- **Latence critique** : Besoin de < 10ms garanti

### Choisir Elasticsearch quand :
- **Volume** : > 1 million de documents, croissance prévisible massive
- **Pattern de requête** : Fuzzy matching, agrégations complexes, analytics temps réel
- **Contraintes** : Multi-tenant, haute disponibilité requise, équipes distribuées
- **Équipe** : Expertise ops disponible pour maintenir le cluster
- **Fonctionnalités avancées** : ML ranking, synonymes dynamiques, géospatial + texte
- **Écosystème** : Intégration ELK, besoin de monitoring natif

### Zone grise (hybridation possible)

Pour les cas intermédiaires (500k-5M docs), des solutions émergent :
- **Turso** : SQLite distribué avec FTS5 préchargé
- **sqlite-vec + FTS5** : Hybrid search (vectoriel + full-text) pour la recherche sémantique
- **Cache layer** : Elasticsearch pour l'indexation massive, FTS5 pour les requêtes fréquentes en edge cache

---

## Sources

1. **"I Replaced Elasticsearch with SQLite and Search Got 100× Faster"** — Medium, nov. 2025  
   https://medium.com/@build_break_learn/replaced-elasticsearch-with-sqlite-fts5-100x-faster-5343a4458dd4

2. **"SQLite FTS5 for (Drupal) Search API"** — Jasper Smet, déc. 2025  
   https://www.jaspersmet.be/posts/sqlite-ft5-for-search-api/

3. **"SQLite FTS5 Extension"** — Documentation officielle SQLite  
   https://www.sqlite.org/fts5.html

4. **"SQLite Extensions: Full-text search with FTS5"** — SQLite Cloud Blog  
   https://blog.sqlite.ai/fts5-sqlite-text-search-extension

5. **"FTS5: ORDER BY rank extremely slow with millions of records"** — Reddit r/sqlite, nov. 2025  
   https://www.reddit.com/r/sqlite/comments/1p79i0v/fts5_order_by_rank_extremely_slow_with_millions/

6. **"Comparing Native Postgres, ElasticSearch, and pg_search"** — Neon Blog, août 2025  
   https://neon.com/blog/postgres-full-text-search-vs-elasticsearch

7. **"Apache Lucene 2025 improvements"** — Elasticsearch Labs, jan. 2026  
   https://www.elastic.co/search-labs/blog/apache-lucene-wrapped-2025

8. **"Understanding Lucene: The Engine Behind Elasticsearch's Magic"** — DEV Community, oct. 2025  
   https://dev.to/heisenberg60/understanding-lucene-the-engine-behind-elasticsearchs-magic-4ke8

---

*Document généré le 12 mars 2026 — synthèse de benchmarks et retours d'expérience 2024-2025.*
