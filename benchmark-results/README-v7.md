# 🔬 Benchmark LLM v7 — Haiku-4-5 : Résultats Détaillés Complets

> Date : 2026-03-15 | Modèle : anthropic/claude-haiku-4-5 | 3/3 tâches réussies | ~2 min/tâche | 0 retry

---

## TÂCHE 1 — Code TypeScript : IntervalTree

### Métriques Brutes

| Critère | Valeur |
|---------|--------|
| Architecture | Red-Black Tree augmenté |
| Lignes implémentation | 556 |
| Lignes tests | 622 |
| Total lignes | 1 178 |
| Ratio tests/code | 1.12:1 |
| Tests passés | 42/42 ✅ 100% |
| Catégories de tests | 7 |
| Méthodes publiques | 8 |
| Bonus features | 9 |

### Architecture — Red-Black Tree

| Choix | Justification |
|-------|---------------|
| RBT | O(log n) garanti, auto-équilibrant, standard production |
| MaxEnd Augmentation | Pruning O(log n + k) au lieu de O(n) |
| Générique T | Stockage flexible |
| value? optionnel delete | Désambiguïse les doublons [start, end] |

### 8 Méthodes Publiques
insert, delete, search, getAll, getSize, isEmpty, clear, **verify()** ← unique dans ce benchmark

### 42 Tests — Liste Complète

**Basic Insertion (7/7):** Insert single, multiple non-overlapping, overlapping, nested, identical, same start, invalid interval

**Deletion (10/10):** From empty, non-existent, existing, leaf, one child, two children, by value, sequential, verification after deletion, delete all

**Search (10/10):** Empty tree, inside, outside, start boundary, end boundary, multiple overlapping, partial overlap, nested, before all, between non-overlapping

**Edge Cases (11/11):** Single insert/delete, clear, 1000-interval stress test, delete all stress, negative boundaries, floating-point, 4 autres

**MaxEnd Augmentation (5/5):** After insert, after multiple inserts, delete leaf, delete internal, pruning efficiency

**Complex Scenarios (2/2):** Multi-operation sequence, many overlapping intervals

**GetAll (2/2):** Empty tree, sorted order

### 9 Bonus Features
1. Red-Black Tree balancing O(log n) garanti
2. MaxEnd augmentation avec mise à jour auto pendant rotations
3. verify() — vérification complète des propriétés RB-Tree
4. Floating-point interval support
5. Negative boundary support
6. Search avec pruning automatique
7. Deletion par valeur optionnelle
8. getAll() retourne ordre trié
9. Gestion d'erreurs exhaustive (exceptions typées)

---

## TÂCHE 2 — Analyse de Logs Serveur

### 1. Overview Statistique

**Total requêtes : 45 (exact ✅)**

| Niveau | Count | % |
|--------|-------|---|
| INFO | 17 | 37.78% |
| WARN | 11 | 24.44% |
| ERROR | 17 | 37.78% |

**Taux d'erreur : 37.78%** 🔴

| Métrique | Valeur |
|----------|--------|
| Min | 11 ms |
| Max | 6200 ms |
| Moyenne | 1010.24 ms |
| Médiane | 95 ms |

**Temps par catégorie (stats les plus précises du benchmark) :**

| Catégorie | Moyenne | Médiane | Min | Max |
|-----------|---------|---------|-----|-----|
| INFO | 56.29 ms | 63 ms | 11 ms | 320 ms |
| WARN | 4124.55 ms | 4100 ms | 2340 ms | 6200 ms |
| ERROR | 84.53 ms | 92 ms | 41 ms | 130 ms |

Insight Haiku : "WARN = 73× plus lentes que INFO. Erreurs rapides (84ms) = le service refuse vite = problème SQL/réseau, pas surcharge générale."

### 2. Distribution par Endpoint

| Endpoint | Total | Erreurs | % Erreur | Temps Moy | Codes HTTP |
|----------|-------|---------|----------|-----------|-----------|
| /api/users/* | 7 | 0 | 0% | 39.29 ms | 200 |
| /api/products/* | 6 | 0 | 0% | 2504 ms | 200 |
| /api/payments | 10 | 10 | 100% 🔴 | 69.70 ms | 500, 503 |
| /api/orders | 8 | 2 | 25% | 1190.63 ms | 200, 201, 500 |
| /api/search | 3 | 0 | 0% | 5706.67 ms | 200 |
| /api/dashboard | 3 | 0 | 0% | 67 ms | 200 |
| /api/health | 2 | 0 | 0% | 11.5 ms | 200 |
| /api/inventory/stock | 3 | 3 | 100% 🔴 | 108.33 ms | 500 |
| /api/reports/monthly | 3 | 3 | 100% 🔴 | 111 ms | 500 |

### 3. Patterns (6)

**Pattern #1 — NPE PaymentService.java:142**
- Message : NullPointerException at PaymentService.java:142
- Occurrences : 6 | Timestamps : 08:02:30, 08:03:45, 08:11:00, 08:16:00, 08:31:00
- HTTP : 500 | Temps : 87-95ms | Sévérité : 9/10
- Impact : 100% des paiements bloqués

**Pattern #2 — Circuit Breaker OPEN**
- Messages : "Circuit breaker OPEN for payment-gateway" / "Circuit breaker OPEN"
- Occurrences : 5 | Burst : 3 en 2 secondes (08:06:00-02) ! puis 08:21, 08:36
- HTTP : 503 | Temps : 41-45ms (rejet immédiat) | Sévérité : 9/10
- Relation : SYMPTÔME des NPE

**Pattern #3 — SLA Breach >2000ms**
- Message : Response time exceeded threshold (2000ms)
- Occurrences : 11 | Endpoints : search (3×), products (4×), orders (4×)
- HTTP : 200 | Temps : 2340-6200ms, moyenne 4124.55ms (2.06× seuil) | Sévérité : 6/10

**Pattern #4 — DB Pool Exhausted**
- Message : ConnectionTimeout: DB pool exhausted
- Occurrences : 3 | Timestamps : 08:12:30, 08:25:00, 08:35:00
- HTTP : 500 | Temps : 105-112ms | Sévérité : 8/10

**Pattern #5 — OutOfMemoryError**
- Message : OutOfMemoryError: Java heap space
- Occurrences : 3 | Timestamps : 08:18:15, 08:30:00, 08:40:00
- HTTP : 500 | Temps : 108-115ms | Sévérité : 9/10

**Pattern #6 — ConstraintViolation**
- Message : ConstraintViolation: duplicate key orders_pkey
- Occurrences : 2 | Timestamps : 08:26:00, 08:43:00
- HTTP : 500 | Temps : 125-130ms | Sévérité : 7/10

### 4. Analyse Causale

Timeline :
```
08:01       Système nominal
08:02:30    NPE #1 PaymentService
08:06:00-02 CIRCUIT BREAKER : burst 3×503 EN 2 SECONDES
08:12:30    DB pool KO #1
08:18:15    OOM #1
08:25-35    DB pool KO #2 et #3
08:30-40    OOM #2 et #3
08:26-43    ConstraintViolation #1 et #2
```

Chaîne principale :
NPE [CAUSE RACINE] → erreurs 500 → threshold CB → Circuit Breaker OPEN [SYMPTÔME] → burst 503 → retries → ConstraintViolation [EFFET]

### 5. Recommandations

P0 (< 1h) :
- Fix NPE PaymentService.java:142 (null check + hotfix)
- Augmenter -Xmx JVM + pagination sur /reports/monthly
- Doubler taille DB connection pool

P1 (< journée) :
- Index SQL sur colonnes search/products/orders
- Idempotency key sur POST /api/orders

P2 (< semaine) :
- Cache Redis pour products/orders
- Streaming pour reports
- Load testing post-fix

### 6. Score de Santé

Score : 2.5/10 🔴

Formule :
- Base : 10.00
- Taux erreur 37.78% × 10 = -3.78
- 3 endpoints à 100% erreur = -2.00
- OOM risque JVM = -1.00
- Circuit Breaker = -0.50
- Durée dégradation 41min = -0.22
- Total = 2.50/10

---

## TÂCHE 3 — Recherche : FTS5 vs Elasticsearch

Document complet : benchmark-results/recherche/haiku-45.md (1000 lignes, 31.5 KB)

### Méta-Rapport

| Métrique | Valeur |
|----------|--------|
| Volume | 31 888 caractères (×4 vs autres modèles) |
| Sections couvertes | 7/7 ✅ |
| Feature unique | Colonne "Pertinent Pneu-Tracker?" dans tableau |

### Section 1 — Architecture

BM25 FTS5 : score = IDF × (f×(k1+1)) / (f + k1×(1-b+b×|doc|/avglen)) — k1=1.2, b=0.75

| Aspect | FTS5 | Elasticsearch |
|--------|------|---------------|
| Stockage | Fichier SQLite unique | Cluster distribué |
| Indexation | Single-writer | Multi-nœud |
| Concurrence | Multi-reader/single-writer | Multi-thread/nœud |
| Réplication | Externe | Intégrée (shards auto) |
| Scoring | BM25 fixe | BM25 tunable + boosting |
| Scalabilité | Verticale | Horizontale |
| Tokenisation | 3 tokeniseurs | 50+ analyzers/langues |
| Déploiement | 0 dépendance | JVM + cluster |

### Section 2 — Benchmarks Chiffrés

| Métrique | SQLite FTS5 | Elasticsearch |
|----------|-------------|---------------|
| Requête simple | 5-12 ms | 20-50 ms |
| Requête complexe | 15-35 ms | 40-100 ms |
| Wildcard/fuzzy | 25-80 ms | 60-150 ms |
| Indexation | 3100-5000 docs/sec | 1500-2500 docs/sec |
| Index initial 12.5k docs | ~3-4s | ~6-8s |
| RAM app | 30-50 MB | 1.5-2 GB |
| Scalabilité max pratique | 500k-1M docs | 100M-1B docs |

### Section 3 — Fonctionnalités (11 features + colonne Pneu-Tracker)

| Feature | FTS5 | Elasticsearch | Pertinent PT ? |
|---------|------|---------------|----------------|
| Fuzzy search | ❌ | ✅ | Optionnel |
| Phrase search | ✅ | ✅ | ✅ Oui |
| Highlighting | ⚠️ snippet() | ✅ | Nice-to-have |
| Faceting/Aggregations | ❌ | ✅ | Non requis |
| Synonymes | ❌ | ✅ | Non requis |
| Multi-langue | ⚠️ | ✅ | Non requis |
| Geo-search | ❌ | ✅ | Non requis |
| Schema flexibility | ⚠️ | ✅ | Pas critique |
| Réplication | ❌ | ✅ | Non requis |
| Backup | ✅ copie fichier | ⚠️ snapshots S3 | FTS5 gagne |
| Scoring custom | ❌ | ✅ | Non requis |

### Section 4 — Complexité Opérationnelle

| Aspect | FTS5 | Elasticsearch |
|--------|------|---------------|
| Déploiement | 5 min (0 dépendances) | 15-30 min |
| Maintenance | 5-10 min/mois | 30-60 min/mois |
| Coût infra | 3-8 €/mois | 45-90 €/mois (10-15× plus cher) |

### Section 5 — Seuil de Bascule

| Type | Valeur | Raison |
|------|--------|--------|
| Fonctionnel | ~500k docs | Agrégations + fuzzy nécessaires |
| Performance | ~1M docs | Latence × 2 |
| Critique (Haiku) | 2M docs | B-tree depth → dégradation O(log n) |
| Marge Pneu-Tracker | 160× | 12 500 / 2 000 000 |

### Section 6 — Recommandation Pneu-Tracker

FTS5 ✅ — 1.25% du seuil critique, latence 5-12ms, coût 3-8€/mois, marge 160×

5 conditions pour reconsidérer (aucune remplie) :
1. Volume > 500k docs
2. Fuzzy search critique
3. Analytics temps réel
4. Multi-tenant
5. SLA >99.9% avec géo-réplication

### Section 7 — Plan Migration FTS5 → ES

| Phase | Description | Durée |
|-------|-------------|-------|
| 1. Préparation | Audit + ES single-node + mapping | 8h |
| 2. Indexation | Export SQLite → JSON + bulk API | 4h |
| 3. Testing | Benchmark + failover + régression | 5h |
| 4. Cutover | Feature flag USE_ES + blue/green | 2h |
| 5. Nettoyage | Désactiver FTS5, archiver SQLite | 2h |

Total : 21-23h (3-4 jours) | Downtime : 10-15 min | Rollback : désactiver USE_ES

4 risques + mitigation : divergence data (dual-write 48h), latence ES (benchmark préalable), coût (PoC test), downtime (blue/green)

---

## Tableau Comparatif Global — Haiku-4-5 vs Tous

### Code

| Modèle | Architecture | Impl (L) | Tests (L) | Nb Tests | Bonus | Prix |
|--------|-------------|----------|-----------|----------|-------|------|
| Healer Alpha | BST | 192 | 274 | 18 | — | 🆓 |
| Sonnet 4.6 | Red-Black | 438 | 229 | 15 | queryInterval | 💰 |
| GPT-5.4 | AVL | 242 | 151 | 13 | — | 💰 |
| Hunter Alpha | RB LLRB | 238 | 206 | 15 | — | 🆓 |
| k2p5 | AVL | 364 | 282 | 12+ | searchInterval | 💰 |
| Step-3.5 Flash | AVL | 281 | 267 | 12 | searchOverlap | 🆓 |
| GPT-OSS-120b | AVL | N/A | N/A | 57 | toArray, pruning | 🆓 |
| Haiku 4.5 | Red-Black | 556 | 622 | 42 | verify(), floats, négatifs | 💰 |

### Analyse Logs

| Modèle | Req | Erreur | Moy INFO | Moy WARN | Moy ERROR | Score | Prix |
|--------|-----|--------|----------|----------|-----------|-------|------|
| Healer Alpha | 45 ✅ | 40.0% | ~63ms | ~3600ms | ~70ms | ~4/10 | 🆓 |
| Sonnet 4.6 | 45 ✅ | 31.1% | ~42ms | ~3800ms | ~75ms | 3.5/10 | 💰 |
| GPT-5.4 | 52 ❌ | 40.4% | N/A | N/A | N/A | ~4/10 | 💰 |
| Hunter Alpha | 49 ❌ | 42.9% | N/A | N/A | N/A | ~3/10 | 🆓 |
| k2p5 | 45 ✅ | 44.4% | N/A | N/A | N/A | ~3/10 | 💰 |
| Step-3.5 Flash | 45 ✅ | 37.8% | ~56ms | ~4124ms | ~84ms | 2/10 | 🆓 |
| GPT-OSS-120b | 45 ✅ | 35.6% | N/A | N/A | N/A | 6.5/10* | 🆓 |
| Haiku 4.5 | 45 ✅ | 37.78% | 56.29ms | 4124.55ms | 84.53ms | 2.5/10 | 💰 |

### Recherche FTS5/ES

| Modèle | Volume | FTS5 ms | ES ms | Seuil | Coût ES | Plan migration | Prix |
|--------|--------|---------|-------|-------|---------|----------------|------|
| Healer Alpha | ~7 600c | non chiffré | non chiffré | <500k | — | — | 🆓 |
| Sonnet 4.6 | ~9 100c | non chiffré | non chiffré | — | — | — | 💰 |
| GPT-5.4 | ~10 500c | non chiffré | non chiffré | — | — | — | 💰 |
| Hunter Alpha | ~8 900c | 840 req/s | N/A | <500k | — | — | 🆓 |
| k2p5 | ~8 400c | 100× rapide | baseline | 1-5M | — | — | 💰 |
| Step-3.5 Flash | ~8 000c | 1-5ms | 10-30ms | ~1M | 15-30€ | 8 étapes | 🆓 |
| GPT-OSS-120b | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🆓 |
| Haiku 4.5 | ~31 500c | 5-12ms | 20-50ms | 2M docs | 45-90€ | 5 phases + risques | 💰 |

---

*v7 — Résultats complets Haiku-4-5 — 2026-03-15*
