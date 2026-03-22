# Analyse Benchmark — MiniMax-M2.7-highspeed

**Tâche :** Analyse de logs serveur  
**Période couverte :** 08:01:12 – 08:43:00  
**Modèle evalué :** MiniMax-M2.7-highspeed  
**Date :** 2026-03-22

---

## 1. Symptômes visibles — Métriques précises

### 1.1 Erreurs HTTP (8 types distincts)

| Type | Code | Count | Premier vu | Dernier vu |
|------|------|-------|------------|------------|
| NullPointerException (PaymentService) | 500 | 7 | 08:02:30 | 08:31:00 |
| Circuit breaker OPEN (payment-gateway) | 503 | 4 | 08:06:00 | 08:36:00 |
| DB pool exhausted (inventory/stock) | 500 | 3 | 08:12:30 | 08:35:00 |
| OutOfMemoryError (reports/monthly) | 500 | 3 | 08:18:15 | 08:40:00 |
| ConstraintViolation orders_pkey | 500 | 2 | 08:26:00 | 08:43:00 |

### 1.2 Dégradations de performance (seuil 2000ms)

| Endpoint | Temps max observé | Count |
|----------|-------------------|-------|
| /api/search | 6200 ms | 3 |
| /api/products/{id} | 4500 ms | 4 |
| /api/orders/{id} | 3500 ms | 2 |
| POST /api/orders | 4100 ms | 2 |

### 1.3 Disponibilité

- **Payment gateway :** 11 requêtes échouées (7 NPE + 4 circuit breaker)
- **Inventory stock :** 3/3 requêtes en 500 (DB pool)
- **Monthly reports :** 3/3 requêtes en 500 (OOM)
- **Search :** 3/3 requêtes lentes mais en 200 (dégradation SLO)
- **Circuits sains :** /api/users, /api/dashboard, /api/health, /api/orders (POST réussi)

---

## 2. Causes probables — Priorisées

### P0 — NullPointerException récurrent (PaymentService.java:142)
- **Impact :** 7 erreurs 500 sur le service de paiement
- **Effet domino :** Déclenchement du circuit breaker après 5 échecs consécutifs
- **Hypothèse :** champ null sur l'objet Payment ou PaymentRequest à la ligne 142 (probable `.getCustomerId()` ou `.getAmount()` non null-checké)

### P0 — Circuit breaker OPEN (payment-gateway)
- **Impact :** 4 requêtes 503 immédiate après ouverture
- **Cause racine :** NPE non résolu en amont
- **État :** Auto-guérison impossible sans fix code

### P1 — DB Connection pool exhausted
- **Impact :** 3 erreurs 500 sur /api/inventory/stock
- **Cause :** pool vraisemblablement < 10 connexions, consumption par requêtes lentes (products, orders)
- **Métrique clé :** Response time products/orders > 2000ms = connexions retenues

### P1 — OutOfMemoryError sur /api/reports/monthly
- **Impact :** 3 erreurs 500, heap space épuisé
- **Cause :** Rapport mensuel chargeant trop de données en mémoire (pas de pagination/batching)
- **Conséquence :** GC pressure → ralentissement global des autres services

### P2 — Slow queries (>2000ms) sur search/products/orders
- **Impact :** SLO violés, pool DB间接ement affecté
- **Cause probable :** absence d'index sur les colonnes query (search), produit category/status, orders created_at/user_id

### P2 — Duplicate key constraintViolation (orders_pkey)
- **Impact :** 2 erreurs 500, commande non créée
- **Cause :** tentative de INSERT avec clé primaire déjà existante (bug applicatif ou retry sans idempotency-key)

---

## 3. Timeline d'escalade

```
08:02:30  [ERROR]   Payment NPE — 1er signal (P0)
08:03:45  [ERROR]   Payment NPE × 2
08:04:20  [WARN]    Search lent 5120ms (P2, bruit)
08:06:00  [ERROR]   Circuit breaker OPEN (domino NPE)
08:06:01  [ERROR]   CB OPEN × 2
08:07:00  [WARN]    Product lent 2340ms (P1, pool stress)
08:12:30  [ERROR]   DB pool exhausted (P1, seuil atteint)
08:18:15  [ERROR]   OOM reports/monthly (P1, heap saturé)
08:25:00  [ERROR]   DB pool exhausted × 2
08:26:00  [ERROR]   Duplicate key orders (P2, retry bug)
08:30:00  [ERROR]   OOM × 2
08:35:00  [ERROR]   DB pool exhausted × 3
08:40:00  [ERROR]   OOM × 3
08:43:00  [ERROR]   Duplicate key × 2
```

**Escalade fonctionnelle :**
- 08:02 → Dev (Paiement) : NPE PaymentService.java:142
- 08:06 → DevOps : CB OPEN, risque disponibilité paiement
- 08:12 → DBA/DevOps : DB pool monitorer
- 08:18 → DevOps (Infra) :OOM, heap/GC alert
- 08:26 → Dev (Commandes) : idempotency / PK collision

---

## 4. Actions correctives

### 4.1 Fix NPE PaymentService.java:142

```java
// AVANT (ligne ~142)
String customerId = payment.getCustomerId(); // NPE si null

// APRÈS
String customerId = payment.getCustomerId();
if (customerId == null) {
    log.error("CustomerId null for payment request: {}", payment);
    throw new InvalidPaymentRequestException("Customer ID is required");
}
```

### 4.2 Monitoring Circuit Breaker — config Resilience4j

```yaml
# application.yml
resilience4j.circuitbreaker:
  instances:
    payment-gateway:
      registerHealthIndicator: true
      slidingWindowSize: 10
      minimumNumberOfCalls: 5
      failureRateThreshold: 50
      waitDurationInOpenState: 30s
      permittedNumberOfCallsInHalfOpenState: 3
      automaticTransitionFromOpenToHalfOpenEnabled: true
```

### 4.3 Diagnostic DB pool — requête de monitoring

```sql
-- Connexions actives par état
SELECT 
    state,
    COUNT(*) AS conn_count,
    MAX(now() - state_change) AS oldest_duration
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state
ORDER BY conn_count DESC;

-- Requêtes les plus lentes (top 10)
SELECT 
    pid,
    now() - query_start AS duration,
    state,
    LEFT(query, 200) AS query_preview
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC
LIMIT 10;

-- Lock waits
SELECT * FROM pg_locks WHERE NOT granted;
```

### 4.4 Index manquants ( slow queries search/products/orders )

```sql
-- api/search (full-text search)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search 
ON products USING gin(to_tsvector('french', name || ' ' || description));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category 
ON products(category_id) WHERE status = 'active';

-- api/orders (jointure user + tri date)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_created 
ON orders(user_id, created_at DESC);

-- api/products (lecture point)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_id_status 
ON products(id) INCLUDE (status) WHERE status = 'active';
```

### 4.5 Heap / OOM fix — monthly reports pagination

```java
// Limiter la taille du dataset en mémoire
public List<MonthlyReport> generateMonthlyReport(int year, int month, int page, int pageSize) {
    return jdbcTemplate.query(
        """
        SELECT * FROM orders 
        WHERE EXTRACT(YEAR FROM created_at) = ?
          AND EXTRACT(MONTH FROM created_at) = ?
        ORDER BY created_at
        LIMIT ? OFFSET ?
        """,
        new Object[]{year, month, pageSize, page * pageSize},
        rowMapper
    );
}

// Config JVM (recommendation)
# -Xms512m -Xmx2g (min: 512MB, max: 2GB)
# -XX:+UseG1GC -XX:MaxGCPauseMillis=500
```

### 4.6 Idempotency key — fix duplicate key orders

```java
@PostMapping("/api/orders")
public ResponseEntity<OrderResponse> createOrder(
        @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
        @RequestBody OrderRequest request) {
    
    if (idempotencyKey != null) {
        Optional<IdempotencyRecord> existing = idempotencyService.get(idempotencyKey);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get().getResponse());
        }
    }
    
    OrderResponse response = orderService.create(request);
    
    if (idempotencyKey != null) {
        idempotencyService.save(idempotencyKey, response);
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

### 4.7 Connection pool — configuration HikariCP

```properties
# application.properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.leak-detection-threshold=60000
```

---

## 5. Résumé des métriques de santé

| Métrique | Valeur observée | Seuil acceptable | Statut |
|----------|------------------|------------------|--------|
| Taux d'erreur global | ~25/43 requêtes (58%) | < 1% | 🔴 CRITIQUE |
| Paiement dispo | 0/11 réussites (0%) | > 99.9% | 🔴 CRITIQUE |
| Search latency (p95) | 6200 ms | < 500 ms | 🔴 CRITIQUE |
| DB pool errors | 3/3 | 0 | 🔴 CRITIQUE |
| OOM reports | 3/3 | 0 | 🔴 CRITIQUE |
| Dashboard latency | ~67 ms | < 100 ms | ✅ OK |
| Health check | ~11 ms | < 50 ms | ✅ OK |

---

## 6. Recommandations priorisées

1. **Immédiat :** Fix NPE PaymentService.java:142 + restart payment service
2. **< 1h :** Augmenter DB pool size (5→20) + killer les requêtes > 30s
3. **< 4h :** Ajouter les index SQL sur orders/products (requêtes critiques)
4. **< 24h :** Pagination reports/monthly + augment. heap JVM
5. **< 48h :** Implémenter idempotency-key sur POST /orders
6. **Monitoring :** Dashboard Grafana sur circuit breaker state + DB pool usage + OOM count

---

*Analyse générée par MiniMax-M2.7-highspeed — Benchmark LLM — 2026-03-22*
