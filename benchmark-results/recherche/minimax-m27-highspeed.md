# FTS5 vs Elasticsearch — Benchmark Applicatif de Recherche

**Modèle** : MiniMax-M2.7-highspeed  
**Date** : 2026-03-22  
**Sujet** : Moteur de recherche applicatif — quand choisir FTS5 vs Elasticsearch

---

## 1. Quand FTS5 suffit amplement

FTS5 (Full-Text Search 5) de SQLite est intégré, embarqué, et ne coûte rien en infrastructure. Pour la majorité des applications, il couvre 80 % des besoins de recherche.

### Seuils chiffrés observés dans la littérature et retours terrain

| Critère | Seuil FTS5 OK | Seuil où ça craque |
|---|---|---|
| **Nombre de documents** | < 100 000 – 500 000 | > 1 million (ralentissements sur ORDER BY rank) |
| **Taille totale indexée** | < 1 Go de texte plein | > 5-10 Go (mémoire RAM limitante) |
| **Latence recherche** | **< 5-10 ms** (embarqué, pas de réseau) | — |
| **Nombre de requêtes/sec** | < 500-1 000 req/s (mono-thread SQLite) | Au-delà → contention |
| **Complexité des requêtes** | Mots-clés, phrases, préfixes, BM25 | Pas de facette, pas d'aggrégats |
| **Opérateurs attendus** | AND, OR, NOT, phrase `"exact match"`, préfixe `mot*` | Requêtes géospatiales, fuzzy/phonétique avancé |
| **Données temps réel** | Faible volume d'inserts (< 100/s) | Volume élevé continu |

**Cas typiques où FTS5 est suffisant :**
- Moteur de blog / CMS (10k–200k articles)
- Catalogue produit e-commerce (50k–500k SKUs)
- Base de connaissances / documentation
- Notes personnelles / moteur de recherche interne
- Applications SaaS mono-tenant avec < 500k enregistrements

**Benchmark concret (source : cas de production rapportés) :**
- Passage de Elasticsearch → FTS5 sur workload classique : **latence médiane réduite de 80-150 ms → < 5 ms** ; throughput multiplié par 5-10× sur la même machine.

---

## 2. Quand Elasticsearch est justifié

Elasticsearch (ES) est un moteur de recherche distribué Java. Il prend tout en charge : indexation massivement parallèle, réplication, faceting, agrégations, ML-based relevance tuning.

### Signaux qui déclenchent le besoin

| Indicateur | Seuil |
|---|---|
| **Documents** | > 2-5 millions |
| **Volume d'indexation** | > 500k documents/jour en continu |
| **Nombre de champs "searchable"** | > 20-30 champs structurés avec types différents |
| **Besoins en facets/filters** | Comptes par catégorie, histogrammes, percentiles |
| **Densité de requêtage** | > 1 000 req/s |
| **Architecture distribuée** | Plusieurs serveurs de和应用, haute disponibilité obligatoire |
| **Fonctionnalités avancées** | Synonymes, fuzzy matching, auto-completion, search-as-you-type, phonetic, stemming multilingue avancé, ML |
| **Données multi-tenant** | Isolation stricte par tenant avec droits différents |

**Cas typiques où ES est nécessaire :**
- Place de marché (eBay, Leboncoin scale)
- Plateforme SaaS B2B multi-tenant avec recherche transversale
- Moteur de recherche "type Google" pour un site à fort trafic (> 100k visites/jour)
-日志/observabilité (ELK stack — ici ES est刷asticsearch naturel)
- Recherche géospatiale (Geo queries)
- BI / analytique sur données de recherche (aggregations)

---

## 3. Compromis coût / complexité / performance — Benchmarks comparatifs

### Coût d'infrastructure (estimations mensuelles 2026)

| Poste | FTS5 | Elasticsearch |
|---|---|---|
| **Infrastructure** | 0 $ (embarqué dans l'app) | **500 $ – 8 000 $+/mois** (3 nœuds minimum prod) |
| **RAM recommandée** | 1-4 Go au-delà du OS | 16-64 Go par nœud × 3 minimum |
| **CPU** | 1-2 cœurs suffisent | 4-8 cœurs par nœud |
| **Ops / DevOps** | Nul | 0.5 à 2 ETC dédiée (setup, monitoring, upgrade, recovery) |
| **Coût total 1 an** | ~0 $ | **6 000 $ – 100 000 $+** |
| **Équipe requise** | Développeur standard | Ops + développeur ES expérimenté |

### Complexité de mise en œuvre

| Étape | FTS5 | Elasticsearch |
|---|---|---|
| **Setup initial** | 1-2 jours (migration du schéma + création table FTS) | 1-4 semaines (cluster, mapping, indexing pipeline) |
| **Intégration applicative** | Requête SQL simple, pas de réseau | Client HTTP/SDK, gestion des erreurs réseau, retry, timeout |
| **Sync données** | Automatique (ACID avec la DB) | Pipeline d'indexation (logstash, Beats, ou custom) — dette technique |
| **Monitoring** | Rien de spécifique | Kibana, métriques JVM, health checks cluster, rollover |
| **Résilience** | Automatique (DB locale) | Master election, shard replication, split-brain awareness |
| **Sauvegarde** | .sqlite file = 1 fichier à backuper | SnapshotsRepository, rotation, restore multi-step |
| **Dégradation (= crash)** | None (pas de service externe) | 1 nœud down → rééquilibrage → latence spike |
| **Time to production** | **Minutes** | **Jours à semaines** |

### Performance pure

| Métrique | FTS5 | Elasticsearch | Delta |
|---|---|---|---|
| **Latence P50** | **1-5 ms** | 10-30 ms | ES +5-25 ms (network + serialization) |
| **Latence P99** | 10-50 ms | 50-200 ms | ES × 3-5× |
| **Indexation (docs/sec)** | 5 000-20 000/s (embarqué) | 50 000-200 000/s (cluster distribué) | ES × 10-30× en mode distribué |
| **Recherche (requêtes/sec)** | 500-2 000 (mono-core) | 5 000-50 000 (cluster) | ES × 10-50× si cluster complet |
| **Passage à l'échelle** | Vertical uniquement | Horizontal (sharding) | — |
| **Score de pertinence** | BM25 (excellent pour la taille), personnalisable | BM25 + Boosting + function_score + ML | ES plus flexible |

> **Note critique** : les chiffres de débit ES sont sur cluster complet (3+ nœuds). Un seul nœud ES ne dépasse souvent pas FTS5 sur des workloads < 1M docs.

### Tableau comparatif condensé

| Critère | FTS5 ✅ | Elasticsearch ✅ |
|---|---|---|
| Coût | ★★★★★ (gratuit) | ★☆☆☆☆ (cher) |
| Simplicité Ops | ★★★★★ | ★★☆☆☆ |
| Latence | ★★★★★ | ★★★☆☆ |
| Volume docs | ★★☆☆☆ (>1M) | ★★★★★ |
| Fonctionnalités recherche | ★★☆☆☆ (basique) | ★★★★★ (avancé) |
| Haute disponibilité | ★☆☆☆☆ | ★★★★★ |
| Scalabilité horizontale | ★☆☆☆☆ | ★★★★★ |
| Temps de mise en prod | Heures | Semaines |

---

## 4. Recommandation nette pour une application classique

### 🎯 Recommandation par défaut : **FTS5 d'abord**

Pour **95 % des applications** (SaaS classique, e-commerce, app mobile, back-office, API) :

```
FTS5 = choix par défaut
```

**Pourquoi :**
1. **Zéro infrastructure** — pas de service à ops, pas de facture cloud
2. **Latence imbattable** — < 5 ms vs 20-50 ms pour ES sur petit volume
3. **Simplicité de sync** — les données et l'index vivent dans la même transaction SQLite
4. **Compétences largement disponibles** — SQL + un peu de FTS5 = tout le monde peut maintenir
5. **Performance WRAM** pour < 500k docs — vous ne verrez jamais la différence avec ES

### 🚨 Passer à Elasticsearch seulement si (et quand) :

1. **Vous dépassez objectivement** les seuils : > 2M docs, > 500 req/s, besoin de facets
2. **Votre CTO/DevOps confirme** qu'il peut assumer la charge ES
3. **Le coût est budgété** (comptez 1 000-5 000 $/mois pour un cluster raisonable)

### Stratégie migratoire

```
Phase 1 (J+0)     → FTS5 en place, fonctionnel
Phase 2 (si croissance) → Ajouter Redis/Lua cache devant FTS5
Phase 3 (seuils atteints) → Migrer vers Elasticsearch
```

Cette approche "FTS5 → cache → ES" permet de gagner des mois/années avant de payer la complexité ES.

---

## 5. Cas limite et erreurs courantes

| Erreur | Pourquoi |
|---|---|
| **Choisir ES pour 20k produits** | Surcharge absurde ; FTS5 fait tout pour 0 $ |
| **Ne pas utiliser le tokenizer `porter`** | FTS5 basique ne fait pas de stem ; "courir" ne matche pas "course" |
| **Indexer tout en FTS5** | Stocker les champs "filter only" (catégorie, date) en SQL normal |
| **Utiliser FTS5 pour des logs** | Logs = ES (volume, age,rotate) ; FTS5 n'est pas fait pour ça |
| **Ne pasbacker l'historique ES** | Un cluster ES sans snapshot régulier = catastrophe |

---

## Sources et références

- D. Zolnai, *Speed up searching in your app by using SQLite and FTS* (Medium, 2024)
- build_break_learn, *I Replaced Elasticsearch with SQLite FTS5 and Search Got 100× Faster* (Medium, Nov 2025)
- Jasper Smet, *SQLite FTS5 for (Drupal) Search API* (Dec 2025)
- runebook.dev, *Full-Text Search in SQLite: FTS5 Problems and Alternatives* (2025)
- sqlite.org, *FTS5 Extension Documentation*
- Reddit r/sqlite : FTS5 ORDER BY rank performance sur millions d'enregistrements (Nov 2025)
- phiresky/sql.js-httpvfs GitHub : cas 6M rows avec latence croissante

---

*Document généré dans le cadre du benchmark LLM v6 — MiniMax-M2.7-highspeed, tâche recherche*
