# FTS5 vs Elasticsearch — Synthèse comparative (État de l'art 2025-2026)

## Introduction

Le choix d'un moteur de recherche plein texte est un classique de l'architecture applicative. D'un côté, **Elasticsearch** (basé sur Lucene) domine depuis des années le segment de la recherche distribuée. De l'autre, **FTS5**, l'extension de recherche intégrée à SQLite, attire de plus en plus d'attention — notamment depuis 2025, où plusieurs retours d'expérience documentent des migrations réussies *d'Elasticsearch vers FTS5*.

La question est devenue concrète : pour un projet de taille petite à moyenne (jusqu'à ~500K documents), Elasticsearch est-il encore nécessaire, ou FTS5 suffit-il ? Cette synthèse compare les deux approches sur l'architecture, la performance, les limites, et les cas d'usage.

---

## Architecture des deux solutions

### SQLite FTS5

FTS5 est un **module C intégré** à SQLite, disponible nativement (pas de dépendance externe). Il fonctionne via des **tables virtuelles** qui maintiennent un **index inversé** en interne. Chaque token pointe vers les documents qui le contiennent, avec leur position.

Caractéristiques clés :
- **Embarqué** : pas de processus séparé, pas de réseau. L'index vit dans le même fichier (ou un fichier adjacent) que la base SQLite.
- **WAL Mode** : Write-Ahead Logging permet des lectures concurrentes sans blocage — critique pour les applications web.
- **Ranking BM25 natif** : le même algorithme que Solr/Elasticsearch, intégré dans le moteur.
- **Tokenizers modulaires** : `unicode61` (par défaut), `porter` (stemming anglais), ou tokenizer personnalisé.
- **Fonctions utilitaires** : `snippet()`, `highlight()`, `matchinfo()` intégrées.
- **Fuzzy search** : support des recherches préfixes (`prefix='2 3 4 5'`) et opérateurs OR/AND/NOT.

Architecture type :
```
App → SQLite (fichier local)
        ├── Table données (title, body, tags, created_at)
        └── Table virtuelle FTS5 (index inversé + BM25)
```

### Elasticsearch

Elasticsearch est un **moteur de recherche distribué** basé sur Apache Lucene. Il fonctionne comme un service externe accessible via API REST.

Caractéristiques clés :
- **Architecture distribuée** : sharding, réplication, cluster multi-nœuds.
- **NLP avancé** : analyseurs linguistiques, synonymes, stemming multi-langues, suggesteurs.
- **Facettes et agrégations** : capacités analytiques puissantes (histogrammes, métriques).
- **Sécurité** : authentification, rôles, chiffrement (via X-Pack / OpenSearch Security).

Architecture type :
```
App → API REST → Cluster Elasticsearch (processus JVM séparé)
                    ├── Nœud 1 (shards)
                    ├── Nœud 2 (replicas)
                    └── Nœud N
```

---

## Benchmarks de performance

### Requêtes simples (terme unique)

| Metric | FTS5 (local) | Elasticsearch (cluster) |
|--------|-------------|------------------------|
| Latence médiane | **< 5 ms** (in-process) | 10–50 ms (network + JSON parsing) |
| Throughput | ~840 req/s (1 thread, 7K docs) | Variable selon cluster |
| Overhead réseau | **Zéro** | TCP + HTTP + sérialisation |

Un benchmark local (Jasper Smet, déc. 2025) montre **~57 ms de latence moyenne** et **840 req/s** sur un index de 7K documents avec FTS5, sans aucune couche de cache, dans un environnement Docker non optimisé. Le même test contre Elasticsearch inclurait la latence réseau et le parsing JSON.

L'article Medium de Build Break Learn (nov. 2025) rapporte un passage d'Elasticsearch à FTS5 avec une latence médiane **chute à quelques millisecondes** — qualifié de « 100× faster » — principalement grâce à l'élimination du réseau.

### Requêtes multi-termes et ranking

FTS5 gère naturellement les requêtes multi-termes avec ranking BM25 :
```sql
SELECT title, snippet(docs_fts, 0, '<b>', '</b>', '...', 5), rank
FROM docs_fts
WHERE docs_fts MATCH 'performance AND Solr'
ORDER BY rank
LIMIT 20;
```

Sur des jeux de données < 500K documents, la performance du ranking BM25 est excellente.

**⚠️ Point critique** : sur des datasets de **millions d'enregistrements**, le `ORDER BY rank` devient très lent dans FTS5. Un thread Reddit (nov. 2025) rapporte des performances dégradées lors du tri par rang sur des millions de documents, avec le JOIN vers la table source comme goulot d'étranglement.

### Fuzzy search et recherche préfixe

FTS5 supporte la recherche préfixe native via le paramètre `prefix='2 3 4 5'` (recherche par 2, 3, 4, ou 5 premiers caractères). La recherche fuzzy nécessite des opérateurs OR combinés ou des tokenizers personnalisés.

Elasticsearch offre des capacités plus riches : `fuzziness` paramétrable (distance de Levenshtein), `match_phrase_prefix`, et `multi_match` avec boosting par champ.

### Filtres combinés (facettes)

FTS5 peut combiner recherche plein texte et filtres via des requêtes SQL classiques (JOIN + WHERE). C'est fonctionnel mais moins élégant qu'Elasticsearch pour les facettes complexes (aggrégations multi-niveaux, filtres imbriqués).

Elasticsearch excelle ici : les aggregations sont un pilier de son API et permettent des analyses de données complexes en temps réel.

---

## Limites de chaque approche

### Limites de FTS5

- **Scalabilité verticale uniquement** : pas de sharding, pas de distribution. La limite pratique est ~500K–1M documents.
- **Pas de NLP avancé** : stemming limité (porter pour l'anglais), pas de synonymes natifs, pas de correcteur orthographique.
- **Concurrence en écriture** : WAL améliore les lectures, mais les écritures restent verrouillées (SQLite limitation connue).
- **Pas d'aggrégations analytiques** : pas de facettage natif, pas d'histogrammes.
- **Stemming par défaut absent** : recherche de « run » ne trouve pas « running » sans tokenizer porter ou custom.
- **Pas de monitoring intégré** : pas de métriques, pas de logs de recherche, pas d'UI d'administration.

### Limites d'Elasticsearch

- **Complexité opérationnelle** : JVM, configuration cluster, monitoring, mises à jour.
- **Coût** : ressources serveur, mémoire (JVM heap), stockage doublé (index + données).
- **Latence réseau** : chaque requête traverse HTTP/JSON, ajoute 5–20 ms minimum.
- **Overkill fréquent** : pour 10K–100K documents, le coût de maintenance n'est pas justifié.
- **Consistance** : le refresh interval introduit un délai (1s par défaut) avant que les nouveaux documents ne soient recherchables.

---

## Recommandation selon le cas d'usage

| Critère | Recommandation |
|---------|---------------|
| **< 500K documents** | ✅ **FTS5** — plus simple, plus rapide, zéro infrastructure |
| **Applications embarquées / offline** | ✅ **FTS5** — pas de réseau nécessaire |
| **Prototypage / MVP** | ✅ **FTS5** — démarrage en quelques minutes |
| **Mobile / desktop** | ✅ **FTS5** — intégration native SQLite |
| **500K–5M documents** | ⚠️ **FTS5 possible** mais nécessite des optimisations (contentless tables, index dédiés) |
| **> 5M documents** | ✅ **Elasticsearch** — sharding et distribution nécessaires |
| **NLP avancé / multi-langue** | ✅ **Elasticsearch** — analyseurs linguistiques complets |
| **Analytics / facettes complexes** | ✅ **Elasticsearch** — aggregations natives |
| **Cluster haute disponibilité** | ✅ **Elasticsearch** — réplication et failover intégrés |

### Le cas Pneu-Tracker

Pour un projet comme Pneu-Tracker (SQLite existant, dataset probablement < 100K enregistrements, recherche sur produits/clients), **FTS5 est le choix évident** :
- Zéro dépendance ajoutée
- Intégration directe dans la base existante
- BM25 pour le ranking de pertinence
- Latence < 5 ms pour une expérience utilisateur fluide
- Possibilité de migrer vers Elasticsearch plus tard si le dataset explose

---

## Sources

1. **"I Replaced Elasticsearch with SQLite and Search Got 100× Faster"** — Build Break Learn, nov. 2025
   https://medium.com/@build_break_learn/replaced-elasticsearch-with-sqlite-fts5-100x-faster-5343a4458dd4

2. **"SQLite FTS5 for (Drupal) Search API"** — Jasper Smet, déc. 2025
   https://www.jaspersmet.be/posts/sqlite-ft5-for-search-api/

3. **"FTS5: ORDER BY rank extremely slow with millions of records"** — Reddit r/sqlite, nov. 2025
   https://www.reddit.com/r/sqlite/comments/1p79i0v/fts5_order_by_rank_extremely_slow_with_millions/

4. **"Full-Text Search in SQLite: FTS5 Problems and Alternatives"** — Runebook, sept. 2025
   https://runebook.dev/en/docs/sqlite/fts5

5. **"SQLite Extensions: Full-text search with FTS5"** — SQLite.ai Blog, 2025
   https://blog.sqlite.ai/fts5-sqlite-text-search-extension

6. **fts-benchmark** — Benchmark Postgres/Typesense/Meilisearch/OpenSearch/SQLite — VADOSWARE
   https://github.com/VADOSWARE/fts-benchmark

7. **Official SQLite FTS5 Documentation**
   https://www.sqlite.org/fts5.html
