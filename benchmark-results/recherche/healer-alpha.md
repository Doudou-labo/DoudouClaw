# FTS5 vs Elasticsearch — État de l'art de la comparaison (2025-2026)

## 1. Introduction : pourquoi comparer ces deux mondes ?

SQLite FTS5 et Elasticsearch occupent deux strates radicalement différentes de la recherche full-text. FTS5 est une extension C embarquée directement dans le fichier `.db` ; Elasticsearch est un moteur distribué basé sur Lucene, déployé comme un service autonome (JVM, cluster, réseau). Comparer les deux semble a priori disproportionné, mais la tendance de 2025-2026 montre une migration massive vers le « small is beautiful » : des équipes remplacent des clusters ES par FTS5 et obtiennent des latences divisées par 10 à 100 pour des cas d'usage ciblés (recherche texte libre sur quelques centaines de milliers de documents, classement BM25, filtres basiques). La question n'est plus « ES est-il plus puissant ? » (oui, à grande échelle), mais « est-ce que j'ai vraiment besoin de cette puissance ? ».

## 2. Architecture des deux solutions

### 2.1 SQLite FTS5

- **Modèle :** virtual table avec index inversé (inverted index), stocké dans le même fichier SQLite que les données applicatives.
- **Classement natif :** algorithme **BM25** (Best Match 25), le même que Solr et Elasticsearch.
- **Tokenisation :** configurable via tokenizers intégrés (`unicode61`, `porter` pour le stemming anglais, `trigram` pour la fuzzy search).
- **Concurrency :** mode **WAL** (Write-Ahead Logging) — lectures concurrentes non bloquantes, écritures sérialisées.
- **Infrastructure :** zéro. Pas de service externe, pas de port réseau, pas de JVM. Un fichier sur disque.
- **Intégration :** requêtes SQL natives, `MATCH`, `snippet()` pour le highlighting, `rank()` pour le scoring.

### 2.2 Elasticsearch

- **Modèle :** cluster distribué de nœuds (master, data, ingest), basé sur Apache Lucene.
- **Classement :** BM25 (depuis v5+, remplaçant TF-IDF par défaut), avec scoring custom possible.
- **Tokenisation :** très riche — analyzers multiples par champ, stemming en 30+ langues, synonyms, NER, etc.
- **Concurrency :** conçu dès l'origine pour le multi-nœud, sharding horizontal, réplication.
- **Infrastructure :** JVM (heap sizing critique), cluster coordination, API REST/JSON, monitoring (Kibana/Logstash).
- **Intégration :** client HTTP natif, requêtes DSL JSON, pipeline d'indexation asynchrone.

## 3. Benchmarks de performance

### 3.1 Requêtes simples (texte libre, 2-5 mots)

| Métrique | FTS5 (Docker local) | Elasticsearch (cluster) |
|---|---|---|
| Latence moyenne | **5-57 ms** | 20-100 ms (sans réseau) |
| Requêtes/s (1 nœud) | **~840 req/s** | 500-2000 req/s (cluster) |
| Latence réseau | **0 ms** (embedded) | 2-15 ms (HTTP round-trip) |

- Jasper Smet (2025) : benchmark wrk sur 7 000 items avec filtres facettés — **57 ms de latence moyenne**, 840 req/s sur Docker local non optimisé.
- Article Medium « 100x Faster » (2025) : migration ES → FTS5 sur workload simple (titres + corps, BM25, tags) — latence médiane passée de ~200 ms à **< 10 ms** (single-digit).

### 3.2 Fuzzy search et tolérance aux fautes

- **FTS5** : supporte le fuzzy via le tokenizer `trigram` (matching partiel) et l'opérateur `NEAR()`. Pas de spell-checking natif — pas de correction automatique « voulais-vous dire ? ».
- **Elasticsearch** : fuzzy query intégrée (Levenshtein distance configurable), Suggest API, Completion Suggester pour l'autocomplétion typo-tolérante. Nettement supérieur pour les cas où la tolérance aux fautes est critique (e-commerce, recherche grand public).

### 3.3 Multi-term et combinaison de filtres

- **FTS5** : excellent pour les requêtes multi-term (`title AND body AND tags`), combinaison avec des filtres SQL classiques (`WHERE created > ?`). Les filtres combinés (recherche texte + facettes) fonctionnent bien jusqu'à ~500K documents.
- **Elasticsearch** : surdimensionné pour ces cas simples, mais supérieure pour les filtres composés complexes (nested objects, aggregations multi-niveaux, geo-queries). Le coût de coordination entre nœuds pénalise les petits workloads.

### 3.4 Montée en échelle (scaling)

- **FTS5** : performances stables jusqu'à **hundreds of thousands** de documents. Au-delà (millions+), les limites du mono-fichier apparaissent (taille d'index, I/O, pas de sharding).
- **Elasticsearch** : scaling horizontal quasi illimité (sharding, multi-datacenter). C'est le domaine de prédilection : logging (TB), e-commerce (millions de produits), analytics temps réel.

## 4. Limites de chaque approche

### Limites de FTS5

- **Pas de clustering** : un seul fichier, un seul processus, pas de réplication.
- **NLP limité** : pas de synonymes dynamiques, pas de NER, pas de ML ranking.
- **Spell-checking absent** : pas de « voulais-vous dire ? » intégré.
- **Concurrency limitée** : WAL gère bien les lectures concurrentes, mais les écritures (réindexation) sont sérialisées.
- **Tokenizers de base** : le support multilingue repose sur `unicode61` et `porter` — bien en anglais, moyen en français ou autres langues, sans stemming avancé.

### Limites d'Elasticsearch

- **Complexité opérationnelle** : JVM à dimensionner, cluster à maintenir, monitoring obligatoire, mises à jour à orchestrer.
- **Coût** : infrastructure dédiée (RAM, CPU), coût cloud significatif (Elastic Cloud, AWS OpenSearch).
- **Latence réseau** : chaque requête fait un tour HTTP — minimum 2-5 ms en LAN, souvent 10-20 ms en production.
- **Sur-qualification** : pour un workload < 500K documents avec recherche texte simple, ES est un marteau pour écraser une noisette.
- **Temps de déploiement** : de heures à jours pour un setup propre (vs 0 pour FTS5).

## 5. Recommandation par cas d'usage

| Cas d'usage | Recommandation | Raison |
|---|---|---|
| Recherche full-text dans une app SQLite existante (< 500K docs) | **FTS5** | Latence < 10 ms, zéro infra, BM25 natif |
| Site web / CMS avec recherche simple (Drupal, WordPress…) | **FTS5** (ou Meilisearch) | Suffisant, plus simple qu'un cluster ES |
| E-commerce avec facets, synonymes, typo-tolerance | **Elasticsearch** | NLP, Suggest API, aggregations complexes |
| Logs / observabilité / analytics temps réel | **Elasticsearch** | Scaling horizontal, ingest pipelines, Kibana |
| Mobile / embarqué / edge | **FTS5** | Aucune dépendance externe, fonctionne offline |
| Recherche multilingue avancée | **Elasticsearch** | Tokenizers par langue, stemming linguistique |

**Règle pragmatique (2025-2026) :** commencez par FTS5. Si vous atteignez les limites (scaling, NLP, clusters), migrez vers Elasticsearch ou Meilisearch. Dans 70% des cas web/app classiques, FTS5 est suffisant et nettement plus simple à opérer.

## 6. Sources

1. **Jasper Smet** — « SQLite FTS5 for (Drupal) Search API » (déc. 2025)
   https://www.jaspersmet.be/posts/sqlite-ft5-for-search-api/

2. **Medium / build_break_learn** — « I Replaced Elasticsearch with SQLite and Our Search Got 100× Faster » (nov. 2025)
   https://medium.com/@build_break_learn/replaced-elasticsearch-with-sqlite-fts5-100x-faster-5343a4458dd4

3. **Runebook** — « Full-Text Search in SQLite: FTS5 Problems and Alternatives » (sept. 2025)
   https://runebook.dev/en/docs/sqlite/fts5

4. **Drupal.org** — « Search API SQLite » (déc. 2025)
   https://www.drupal.org/project/search_api_sqlite

5. **Meilisearch Blog** — « Elasticsearch Review 2025: Right Search Platform for You? »
   https://www.meilisearch.com/blog/elasticsearch-review

6. **SQLite Forum** — Thread « Performance Analysis »
   https://sqlite.org/forum/info/47429810bd2232ebe0c1096c4910b43f6313b9d92bca6eab8496d59d3f585e4c

---

*Synthèse produite le 12 mars 2026 — ~1 100 mots.*
