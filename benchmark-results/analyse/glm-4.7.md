# Analyse de Logs - Serveur API

## Contexte
- **Fichier analysé:** server-log.txt
- **Période:** 08:01:12 - 08:43:00 (42 minutes)
- **Modèle:** openrouter/z-ai/glm-4.7

---

## 1. Symptômes Visibles avec Métriques Précises

### 1.1 Défaillances du Service de Paiement
- **Fréquence:** 5 erreurs 500 (NullPointerException) réparties sur 39 minutes
- **Localisation:** `PaymentService.java:142` - identique pour toutes les occurrences
- **Temps de réponse moyen:** 90ms (89-95ms)
- **Horodatages:** 08:02:30, 08:03:45, 08:11:00, 08:16:00, 08:31:00
- **Impact:** Récurrent mais espacé, suggère un bug code non déterministe

### 1.2 Circuit Breaker - Gateway de Paiement
- **Événements:** 3 ouvertures du circuit breaker (503 Service Unavailable)
- **Burst de requêtes:** 3 requêtes consécutives à 08:06:00-08:06:02 (41-43ms chacune)
- **Temps de réponse pendant outage:** 41-45ms (échec rapide)
- **Horodatages d'ouverture:** 08:06:00, 08:21:00, 08:36:00 (intervalle de 15 minutes)
- **Comportement:** Le circuit breaker se réouvre périodiquement, indiquant des tentatives de restauration infructueuses

### 1.3 Lenteurs Excessives (Response Time > 2000ms)
- **Nombre d'alertes:** 8 incidents
- **Endpoints affectés:**
  - `GET /api/search` (3 occurrences): 5120ms, 6200ms, 5800ms (moyenne: 5707ms)
  - `GET /api/products/*` (3 occurrences): 2340ms, 4500ms, 4200ms (moyenne: 3680ms)
  - `GET /api/orders/*` (2 occurrences): 3200ms, 3500ms (moyenne: 3350ms)
- **Requêtes lentes réussies:** 1 occurrence `POST /api/orders` à 2800ms, 1 à 4100ms

### 1.4 Épuisement du Pool de Connexions DB
- **Nombre d'erreurs:** 4 occurrences
- **Endpoint:** `GET /api/inventory/stock`
- **Horodatages:** 08:12:30, 08:25:00, 08:35:00
- **Temps de réponse:** 105-112ms (échai rapide)
- **Pattern:** Répété toutes les ~13 minutes, suggère une connexion qui n'est pas libérée

### 1.5 OutOfMemoryError - Java Heap Space
- **Nombre d'erreurs:** 3 occurrences
- **Endpoint:** `GET /api/reports/monthly`
- **Horodatages:** 08:18:15, 08:30:00, 08:40:00
- **Temps de réponse:** 108-115ms
- **Pattern:** Répété toutes les ~12 minutes, indique une fuite de mémoire ou allocation massive

### 1.6 Violations de Contrainte - Clé Dupliquée
- **Nombre d'erreurs:** 2 occurrences
- **Endpoint:** `POST /api/orders`
- **Contrainte violée:** `orders_pkey`
- **Horodatages:** 08:26:00, 08:43:00
- **Temps de réponse:** 125-130ms

---

## 2. Causes Probables Priorisées

### Priorité 1 - Critique
1. **NullPointerException dans PaymentService.java:142**
   - **Cause probable:** Variable non initialisée ou null non vérifiée avant utilisation
   - **Impact:** Interruption des paiements, perte de revenus
   - **Récurrence:** Code bug non corrigé

2. **Épuisement du pool de connexions DB**
   - **Cause probable:** Connexions non libérées (resource leak) ou pool trop petit
   - **Impact:** Blocage des requêtes d'inventaire, cascade de lenteurs
   - **Pattern:** Répété à intervalles réguliers

### Priorité 2 - Haute
3. **OutOfMemoryError sur /api/reports/monthly**
   - **Cause probable:** Fuite de mémoire, chargement massif de données sans pagination/streaming
   - **Impact:** Crash du service de reporting, dégradation progressive
   - **Pattern:** Répétition indique allocation continue

4. **Violations de clé dupliquée orders_pkey**
   - **Cause probable:** Race condition dans la création de commandes ou absence de gestion d'unicité
   - **Impact:** Échec de création de commandes, incohérence de données
   - **Pattern:** Suggère un problème de concurrence

### Priorité 3 - Moyenne
5. **Lenteurs excessives sur search/products/orders**
   - **Cause probable:** Requêtes SQL non optimisées, index manquants, ou N+1 query problem
   - **Impact:** Dégradation de l'UX, timeouts côté client
   - **Metrics:** Temps de réponse 2.3x à 3.1x le seuil acceptable

6. **Circuit breaker récurrent sur payment-gateway**
   - **Cause probable:** Service externe instable ou délais de réponse dépassant les timeouts
   - **Impact:** Perte de fonctionnalité de paiement pendant les périodes d'ouverture
   - **Pattern:** Auto-rétablissement infructueux

---

## 3. Timeline d'Escalade

```
08:01:12 ────────────────────────────────── Début du log
           État normal
           
08:02:30 🚨 Premier NullPointerException payment
08:03:45 🚨 Deuxième NullPointerException payment
           
08:04:20 ⚠️ Première alerte lenteur (search: 5120ms)
           
08:06:00-08:06:02 🔴 Circuit breaker OPEN (burst de 3 503s)
           
08:11:00 🚨 NullPointerException payment persiste
           
08:12:30 💥 Première erreur pool DB épuisé (inventory)
08:16:45 ⚠️ Lenteur création commande (2800ms)
           
08:18:15 💥💥💥 Première OOM Error (reports/monthly)
           
08:21:00 🔴 Circuit breaker OPEN (réouverture)
08:21:45   -> Le système tente de se rétablir mais échoue
           
08:23:15 ⚠️ Lenteur search (5800ms)
08:24:00-08:25:00 💥 Pool DB épuisé (inventory)
08:26:00 💥💥 Première violation clé dupliquée
           
08:28:00 ⚠️ Lenteur produits (3800ms)
           
08:30:00 💥💥💥 OOM Error (reports/monthly) - répétition
           
08:31:00 🚨 NullPointerException payment persiste
08:33:00 ⚠️ Lenteur création commande (4100ms)
           
08:35:00 💥 Pool DB épuisé (inventory) - répétition
08:36:00 🔴 Circuit breaker OPEN - troisième ouverture
           
08:38:00 ⚠️ Lenteur produits (4200ms)
08:40:00 💥💥💥 OOM Error (reports/monthly) - répétition
           
08:43:00 💥💥 Violation clé dupliquée - répétition
           
08:43:00 ────────────────────────────────── Fin du log
           État dégradé avec patterns d'erreurs récurrents
```

**Observations clés:**
- Les erreurs critiques (NPE, OOM, pool DB) se répètent cycliquement
- Les lenteurs s'intensifient progressivement (2340ms → 6200ms)
- Le circuit breaker se réouvre tous les ~15 minutes
- Aucune auto-récupération observable sur la période de 42 minutes

---

## 4. Actions Correctives Concrètes

### 4.1 Correction du NullPointerException (Priorité 1)

**Action immédiate - Code fix:**

```java
// Fichier: PaymentService.java, ligne ~142
public Payment processPayment(PaymentRequest request) {
    // AVANT (code problématique):
    // PaymentGatewayResponse response = gateway.process(request);
    // return response.getTransactionId(); // NPE si response est null

    // APRÈS (correction):
    if (request == null) {
        throw new IllegalArgumentException("PaymentRequest cannot be null");
    }

    PaymentGatewayResponse response = gateway.process(request);
    
    if (response == null) {
        throw new PaymentProcessingException("Payment gateway returned null response");
    }
    
    if (response.getTransactionId() == null) {
        throw new PaymentProcessingException("Transaction ID is null in gateway response");
    }
    
    return response.getTransactionId();
}
```

**Tests unitaires à ajouter:**

```java
@Test
void processPayment_shouldThrow_whenRequestIsNull() {
    assertThrows(IllegalArgumentException.class, 
        () -> paymentService.processPayment(null));
}

@Test
void processPayment_shouldThrow_whenGatewayReturnsNull() {
    when(gateway.process(any())).thenReturn(null);
    assertThrows(PaymentProcessingException.class, 
        () -> paymentService.processPayment(validRequest));
}
```

### 4.2 Correction du Pool de Connexions DB (Priorité 1)

**Action immédiate - Configuration du pool:**

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20        # Augmenté depuis valeur basse (vérifier)
      minimum-idle: 5
      connection-timeout: 30000    # 30 secondes
      idle-timeout: 600000         # 10 minutes
      max-lifetime: 1800000        # 30 minutes
      leak-detection-threshold: 60000  # Détecter les connexions non libérées après 60s
```

**Code fix - Assurer la libération des ressources:**

```java
// Fichier: InventoryRepository.java
public StockStatus getStock() {
    // AVANT (risque de leak):
    // Connection conn = dataSource.getConnection();
    // Statement stmt = conn.createStatement();
    // ResultSet rs = stmt.executeQuery("SELECT * FROM stock");
    // ... traitement ...
    // rs.close();
    // stmt.close();
    // conn.close(); // Peut échouer si exception survenue avant

    // APRÈS (try-with-resources garantit la libération):
    try (Connection conn = dataSource.getConnection();
         Statement stmt = conn.createStatement();
         ResultSet rs = stmt.executeQuery("SELECT * FROM stock")) {
        
        StockStatus status = new StockStatus();
        while (rs.next()) {
            // traitement
        }
        return status;
        
    } catch (SQLException e) {
        log.error("Erreur lors de la récupération du stock", e);
        throw new DataAccessException("Impossible de récupérer le stock", e);
    }
}
```

**SQL - Diagnostic du pool:**

```sql
-- PostgreSQL: Vérifier les connexions actives
SELECT 
    pid,
    usename,
    application_name,
    state,
    state_change,
    query_start,
    query
FROM pg_stat_activity
WHERE datname = 'votre_database'
ORDER BY state_change DESC;

-- MySQL: Vérifier les connexions actives
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
```

### 4.3 Correction de l'OutOfMemoryError (Priorité 2)

**Action immédiate - Pagination du reporting:**

```java
// Fichier: MonthlyReportService.java
public MonthlyReport generateMonthlyReport(YearMonth month) {
    // AVANT (charge tout en mémoire):
    // List<Order> allOrders = orderRepository.findAllByMonth(month);
    // return processAllOrders(allOrders);

    // APRÈS (streaming/pagination):
    MonthlyReport report = new MonthlyReport();
    
    int pageSize = 1000;
    int page = 0;
    
    while (true) {
        Page<Order> ordersPage = orderRepository.findByMonth(
            month, 
            PageRequest.of(page, pageSize)
        );
        
        if (!ordersPage.hasContent()) {
            break;
        }
        
        // Traite chaque page et libère la mémoire
        processOrdersBatch(ordersPage.getContent(), report);
        
        page++;
        
        if (!ordersPage.hasNext()) {
            break;
        }
    }
    
    return report;
}

// Alternative avec Stream
public MonthlyReport generateMonthlyReportStream(YearMonth month) {
    MonthlyReport report = new MonthlyReport();
    
    try (Stream<Order> orderStream = orderRepository.streamByMonth(month)) {
        orderStream.forEach(order -> {
            // Traitement individuel - faible empreinte mémoire
            report.addOrder(order);
        });
    }
    
    return report;
}
```

**Configuration JVM:**

```bash
# Augmenter le heap et activer l'analyse de mémoire
JAVA_OPTS="-Xms2g -Xmx4g \
           -XX:+HeapDumpOnOutOfMemoryError \
           -XX:HeapDumpPath=/var/log/app/heapdump.hprof \
           -XX:+PrintGCDetails \
           -XX:+PrintGCTimeStamps"
```

**SQL - Optimisation de la requête:**

```sql
-- AVANT (charge potentiellement des millions de lignes)
SELECT * FROM orders 
WHERE created_at >= '2026-03-01' 
  AND created_at < '2026-04-01';

-- APRÈS (aggrégation côté DB - moins de données transférées)
SELECT 
    COUNT(*) as total_orders,
    SUM(amount) as total_revenue,
    AVG(amount) as avg_order_value,
    DATE_TRUNC('day', created_at) as order_date
FROM orders
WHERE created_at >= '2026-03-01' 
  AND created_at < '2026-04-01'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY order_date;
```

### 4.4 Correction des Violations de Clé Dupliquée (Priorité 2)

**Action - Ajout d'index unique et vérification:**

```sql
-- Vérifier les doublons existants
SELECT order_id, COUNT(*) as duplicate_count
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1;

-- Nettoyer les doublons (adapter selon la logique métier)
WITH duplicates AS (
    SELECT ctid, order_id,
           ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY created_at) as rn
    FROM orders
)
DELETE FROM orders
WHERE ctid IN (
    SELECT ctid FROM duplicates WHERE rn > 1
);
```

**Code - Utilisation d'UPSERT ou vérification préalable:**

```java
// Option 1: Vérification préalable
public Order createOrder(Order order) {
    if (orderRepository.existsByOrderId(order.getOrderId())) {
        throw new DuplicateOrderException(
            "Order ID " + order.getOrderId() + " already exists"
        );
    }
    return orderRepository.save(order);
}

// Option 2: UPSERT (PostgreSQL)
@Modifying
@Query(value = """
    INSERT INTO orders (order_id, amount, customer_id, created_at)
    VALUES (:orderId, :amount, :customerId, :createdAt)
    ON CONFLICT (order_id) 
    DO UPDATE SET 
        amount = EXCLUDED.amount,
        customer_id = EXCLUDED.customer_id,
        updated_at = NOW()
    RETURNING *
    """, nativeQuery = true)
Order upsertOrder(
    @Param("orderId") String orderId,
    @Param("amount") BigDecimal amount,
    @Param("customerId") Long customerId,
    @Param("createdAt") Instant createdAt
);
```

### 4.5 Optimisation des Requêtes Lentes (Priorité 3)

**Diagnostic - Activer le slow query log:**

```sql
-- PostgreSQL
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- loguer les > 1s
SELECT pg_reload_conf();

-- MySQL
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

**Actions d'optimisation:**

```sql
-- Ajouter des indexes sur les champs de recherche et filtrage
CREATE INDEX idx_products_category_status ON products(category_id, status);
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Pour la recherche full-text (si applicable)
CREATE INDEX idx_products_name_search ON products USING gin(to_tsvector('english', name));
```

**Code - Pagination côté API:**

```java
@GetMapping("/api/search")
public Page<Product> search(
    @RequestParam String q,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size
) {
    // Limiter la page max à 100 pour éviter les requêtes massives
    size = Math.min(size, 100);
    
    return productService.search(
        q, 
        PageRequest.of(page, size, Sort.by("name"))
    );
}
```

### 4.6 Configuration du Circuit Breaker (Priorité 3)

**Action - Ajustement de la configuration:**

```yaml
# application.yml
resilience4j:
  circuitbreaker:
    instances:
      payment-gateway:
        sliding-window-size: 10        # Nombre d'appels à évaluer
        failure-rate-threshold: 50    # % d'échecs pour ouvrir (ex: 5/10)
        wait-duration-in-open-state: 60s  # Temps avant réessai (actuel: trop court?)
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
  timelimiter:
    instances:
      payment-gateway:
        timeout-duration: 5s           # Timeout acceptable
```

**Monitoring - Ajouter des métriques:**

```java
@Bean
public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
    return registry -> {
        registry.config().meterFilter(new MeterFilter() {
            @Override
            public DistributionStatisticConfig configure(
                Meter.Id id, 
                DistributionStatisticConfig config
            ) {
                if (id.getName().startsWith("resilience4j.circuitbreaker")) {
                    return DistributionStatisticConfig.builder()
                        .percentiles(0.5, 0.95, 0.99)
                        .build()
                        .merge(config);
                }
                return config;
            }
        });
    };
}
```

---

## 5. Checklist d'Action Immédiate

- [ ] **Urgence (0-2h):**
  - [ ] Déployer le fix NullPointerException dans PaymentService.java
  - [ ] Augmenter le pool de connexions DB et ajouter leak detection
  - [ ] Désactiver temporairement le endpoint `/api/reports/monthly` ou appliquer pagination

- [ ] **Court terme (24h):**
  - [ ] Ajouter les indexes manquants sur products et orders
  - [ ] Implémenter la pagination sur tous les endpoints retournant des listes
  - [ ] Configurer le slow query log et analyser les requêtes problématiques

- [ ] **Moyen terme (semaine):**
  - [ ] Implémenter l'UPSERT ou la vérification de doublons sur la création de commandes
  - [ ] Ajouter des tests unitaires et d'intégration pour les cas d'erreur identifiés
  - [ ] Configurer une alerte sur le circuit breaker et le pool de connexions

- [ ] **Long terme:**
  - [ ] Mise en place d'un observatoire complet (Prometheus + Grafana)
  - [ ] Load testing pour valider la capacité du système
  - [ ] Révision de l'architecture du reporting (batch jobs vs temps réel)

---

## 6. Indicateurs de Succès

Après application des corrections, surveiller:

- **PaymentService NPE:** 0 occurrences sur 24h
- **Circuit breaker ouvert:** < 1 fois par heure (vs toutes les 15 min)
- **Response time > 2000ms:** < 5% des requêtes (vs 25% actuel)
- **Pool DB épuisé:** 0 occurrences
- **OOM Error:** 0 occurrences
- **Violations de clé dupliquée:** 0 occurrences

---

## 7. Conclusion

Le système présente **6 problèmes majeurs** répartis en 3 niveaux de priorité:

1. **Critique (2):** NullPointerException payment, épuisement pool DB
2. **Haute (2):** OOM sur reporting, violations clé dupliquée
3. **Moyenne (2):** Lenteurs requêtes, circuit breaker récurrent

Les patterns cycliques indiquent des **bugs code non corrigés** (NPE, OOM) et des **problèmes de configuration** (pool DB, indexes). Les actions correctives proposées ciblent chaque problème avec des solutions immédiates et durables.

**Score de stabilité actuel:** 3/10 - Système instable avec dégradation continue

**Score de stabilité cible:** 9/10 - Après application complète des corrections