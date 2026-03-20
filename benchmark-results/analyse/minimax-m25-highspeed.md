# Analyse Benchmark — MiniMax-M2.5-highspeed
## Tâche 2 : Analyse de logs serveur

---

## Symptômes visibles

### 1. NPE récurrentes sur `/api/payments` (500)
- **6 occurrences** de `NullPointerException at PaymentService.java:142`
- Temps de réponse : 87–95 ms → problème au premier appel, pas un timeout
- Hypothèse : champ `null` non nulifiable en base ou objet non initialisé

### 2. Circuit breaker déclenché sur le payment-gateway (503)
- Après 3 NPE consécutives, le circuit breaker s'ouvre
- 4 occurrences 503 supplémentaires sur `/api/payments`
- Effet domino : les appels suivants sont refusés immédiatement (41–45 ms)

### 3. Search lent (WARN threshold dépassé)
- 5 requêtes `/api/search` avec latence 5120–6200 ms (seuil : 2000 ms)
- Searches : `tires`, `pneu`, `stock` → ralentissement persistant
- Hypothèse : index manquant, query non optimisée, ou charge DB

### 4. Temps de réponse élevés sur endpoints divers (WARN)
- `/api/products/*` : 2340–4500 ms (seuil 2000 ms)
- `/api/orders/*` : 2800–4100 ms (POST orders : 201 mais lent)
- `/api/orders/*` : 3200–3500 ms (GET orders : OK mais lent)
- Patron : les produits et commandes subissent des lenteurs régulières

### 5. DB pool épuisé (500)
- 3 occurrences de `ConnectionTimeout: DB pool exhausted` sur `/api/inventory/stock`
- Temps de réponse rapide (105–112 ms) = reject immédiat faute de connexion
- Indique une starvation du pool, probablement causée par les queries lentes

### 6. OOM sur `/api/reports/monthly` (500)
- **3 occurrences** de `OutOfMemoryError: Java heap space`
- Rapport mensuel = génération heavy, dataset trop grand pour le heap alloué
- Crash-and-burn : chaque tentative aggrave la pression mémoire

### 7. Violation de contrainte sur orders (500)
- 2 occurrences `ConstraintViolation: duplicate key orders_pkey`
- Semble indiquer un retry mal géré (même commande soumise deux fois) ou un bug d'ID

---

## Causes probables

| Priorité | Symptôme | Cause racine probable | Confiance |
|----------|----------|----------------------|-----------|
| P1 | NPE /api/payments | Champ null en base ou objet non initialisé dans `PaymentService.java:142` | Élevée |
| P1 | Circuit breaker OPEN | Cascade des NPE sur payments | Élevée |
| P1 | DB pool exhausted | Queries lentes (search, products) qui saturent les connexions | Élevée |
| P2 | OOM /api/reports/monthly | Heap insuffisant pour le volume de données du rapport mensuel | Élevée |
| P2 | Search > 5s | Index FTS manquant ou requête `LIKE %...%` sur table volumineuse | Moyenne |
| P2 | Products/Orders lents | JOIN heavy ou N+1 queries, exacerbé par pool DB saturé | Moyenne |
| P3 | Duplicate key orders | Retry sans idempotency-key, double-submit sur le frontend | Moyenne |

---

## Chronologie d'escalade

```
08:02:30  NPE #1 sur /api/payments
08:03:45  NPE #2 sur /api/payments
08:04:20  Search tires → 5120ms (WARN)
08:06:00  Circuit breaker OPEN (après 3 NPE)
08:07:00  Product 55 → 2340ms (WARN) ← DB pool commence à saturer
08:11:45  Search pneu → 6200ms (WARN)
08:12:30  DB pool exhausted #1 (inventory/stock)
08:18:15  OOM #1 (reports/monthly)
08:23:15  Search stock → 5800ms (WARN)
08:25:00  DB pool exhausted #2
08:26:00  Duplicate key orders #1
08:30:00  OOM #2
08:35:00  DB pool exhausted #3
08:40:00  OOM #3
08:43:00  Duplicate key orders #2
```

**Lectures clés :**
- Les lenteurs sur `search` et `products` débutent avant l'épuisement du pool → cause, pas conséquence
- L'OOM sur reports commence à saturer la heap, ce qui aggrave les lenteurs GC sur les autres endpoints
- Le circuit breaker sur payments n'empêche pas les NPE de se produire, seulement les appels externes

---

## Priorisation

```
🔴 P1 — Critique (impact direct sur le métier)
  1. Fix NPE PaymentService.java:142          → arrête la cascade
  2. Augmenter DB pool size                  → libère les endpoints bloquants
  3. Fix OOM /api/reports/monthly            → heap ou pagination manquante

🟠 P2 — Élevé (dégradation de service)
  4. Indexer / optimiser /api/search         → reduce I/O DB
  5. Investiguer lenteur products/orders      → N+1 ou missing index

🟡 P3 — Moyen (risque intégrité)
  6. Ajouter idempotency-key sur orders      → supprime les duplicate key
```

---

## Actions correctives concrètes

### Action 1 — NPE PaymentService.java:142
```java
// Ligne 142 : ajouter un null-check sur le champ problématique
// Ex: if (payment.getMethod() == null) { throw new PaymentValidationException(...); }
```
- Vérifier les champs `amount`, `method`, `currency` à l'insertion
- Ajouter une validation pre-persist avec message explicite
- Ajouter un test unitaire couvrant le cas null

### Action 2 — DB Pool Exhausted
```sql
-- Vérifier les connexions actives
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

-- Requêtes les plus lentes (à joiner avec pg_stat_statements si dispo)
SELECT query, calls, mean_time FROM pg_stat_statements
  ORDER BY mean_time DESC LIMIT 10;
```
- Augmenter `max_connections` ou réduire le timeout idle
- Ajouter un index sur les colonnes filtrées de `products` et `orders`
- Mettre en place un connection pool timeout plus court pour fail-fast

### Action 3 — OOM /api/reports/monthly
```java
// Remplacer le chargement complet par un curseur ou pagination
ReportData report = reportService.generateReport(stream: true, pageSize: 1000);
// OU : augmenter -Xmx du JVM (temporaire)
// OU :导出 en streaming CSV/JSON au lieu de tout charger en mémoire
```
- Ajouter une pagination streaming pour les gros datasets
- Augmenter le heap temporairement si le fix streaming prend du temps
- Mettre un cache LRU sur le rapport mensuel (rafraîchir toutes les heures)

### Action 4 — Search lent
```sql
-- Si PostgreSQL :
CREATE INDEX CONCURRENTLY idx_products_name_fts
  ON products USING gin(to_tsvector('french', name));

-- Vérifier les queries :
EXPLAIN ANALYZE SELECT * FROM products WHERE name ILIKE '%tires%';
```
- Passer à une recherche FTS (Full-Text Search) plutôt que `ILIKE %...%`
- Ajouter un cache Redis sur les résultats de search fréquents (TTL 5 min)

### Action 5 — Lenteur Products / Orders
```sql
-- Vérifier les indexes manquants
SELECT tablename, indexname FROM pg_indexes
  WHERE schemaname = 'public'
  AND indexname IS NOT NULL;

-- Index probablement manquant :
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_category ON products(category_id);
```
- Vérifier les N+1 queries dans le service Java
- Activer le batch fetching (hibernate.default_batch_fetch_size = 25)

### Action 6 — Duplicate key orders
- Ajouter un champ `idempotency_key` (UUID côté client)
- Vérifier en base avant insert : `INSERT ... ON CONFLICT (idempotency_key) DO NOTHING`
- Bloquer le double-submit côté frontend (disable button + loading state)

---

## Résumé pour diffusion

> **3 problèmes critiques identifiés** sur la période 08:02–08:43 :
> - **NPE récurrentes** sur le service de paiement (6 occurrences) → cascade vers circuit breaker
> - **DB pool saturé** (3 timeouts) → tous les endpoints受影响
> - **OOM sur le rapport mensuel** (3 crashes) → heap insuffisant
>
> **Actions immédiates** : corriger la NPE (ligne 142), augmenter le pool DB, passer le rapport mensuel en streaming.
> **Actions secondaires** : indexer la recherche, corriger les duplicate key orders.
