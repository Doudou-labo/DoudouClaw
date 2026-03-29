# Analyse du Server Log — 29/03/2026

## 1. Symptômes Visibles

### 1.1 Erreurs de Paiement (NullPointerException)
- **Endpoint**: `POST /api/payments`
- **Code HTTP**: 500
- **Occurrences**: 5
- **Horodatages**: 08:02:30, 08:03:45, 08:11:00, 08:16:00, 08:31:00
- **Localisation**: `PaymentService.java:142`
- **Temps moyen**: ~91ms

### 1.2 Circuit Breaker Ouvert
- **Code HTTP**: 503
- **Occurrences**: 5
- **Horodatages**: 08:06:00, 08:06:01, 08:06:02, 08:21:00, 08:36:00
- **Message**: `Circuit breaker OPEN for payment-gateway`
- **Temps de réponse**: 41-45ms (rejet immédiat)

### 1.3 Temps de Réponse Excessifs (>2000ms)
| Endpoint | Temps max | Temps min | Occurrences |
|----------|-----------|-----------|-------------|
| `GET /api/search` | 6200ms | 5120ms | 3 |
| `GET /api/products/{id}` | 4500ms | 2340ms | 4 |
| `GET /api/orders/{id}` | 3500ms | 3200ms | 2 |
| `POST /api/orders` | 4100ms | 2800ms | 2 |

### 1.4 Épuisement du Pool de Connexions DB
- **Endpoint**: `GET /api/inventory/stock`
- **Code HTTP**: 500
- **Occurrences**: 3
- **Horodatages**: 08:12:30, 08:25:00, 08:35:00
- **Erreur**: `ConnectionTimeout: DB pool exhausted`

### 1.5 Erreur Mémoire (OutOfMemoryError)
- **Endpoint**: `GET /api/reports/monthly`
- **Code HTTP**: 500
- **Occurrences**: 3
- **Horodatages**: 08:18:15, 08:30:00, 08:40:00
- **Erreur**: `OutOfMemoryError: Java heap space`

### 1.6 Violation de Contrainte (Duplicate Key)
- **Endpoint**: `POST /api/orders`
- **Code HTTP**: 500
- **Occurrences**: 2
- **Horodatages**: 08:26:00, 08:43:00
- **Erreur**: `ConstraintViolation: duplicate key orders_pkey`

---

## 2. Causes Probables (Priorisées)

### 🔴 Priorité 1 — NullPointerException dans PaymentService
**Probabilité**: Haute  
**Cause racine**: Un objet non initialisé est accédé à la ligne 142 de `PaymentService.java`. Il s'agit probablement d'une référence `null` sur une entité `Payment`, `User` ou `Order`.

**Hypothèses**:
- L'objet `payment.getUserId()` retourne `null`
- Une injection de dépendance manquante ou un champ non peuplé par l'ORM
- Validation insuffisante des entrées avant traitement

### 🔴 Priorité 2 — Circuit Breaker Déclenché
**Probabilité**: Haute  
**Cause racine**: Conséquence directe des erreurs 500 successives sur `/api/payments`. Le circuit breaker s'ouvre après le seuil d'erreurs (probablement 2-3 échecs).

**Impact**: Toutes les requêtes de paiement sont rejetées pendant la fenêtre d'ouverture (observation: ~15-20 minutes entre réouvertures).

### 🟠 Priorité 3 — Pool de Connexions DB Épuisé
**Probabilité**: Moyenne-Haute  
**Cause racine**: Le pool de connexions est trop petit ou les connexions ne sont pas correctement libérées.

**Hypothèses**:
- Pool size insuffisant pour la charge
- Requêtes lentes bloquant les connexions (cf. temps de réponse sur `/api/search` et `/api/products`)
- Transaction non committée ou connexion non fermée dans le code

### 🟠 Priorité 4 — OutOfMemoryError sur les Rapports
**Probabilité**: Moyenne  
**Cause racine**: Le rapport mensuel charge trop de données en mémoire simultanément.

**Hypothèses**:
- Absence de pagination/streams
- Jointures multiples générant des datasets volumineux
- Fuite mémoire potentielle

### 🟡 Priorité 5 — Duplicate Key sur Orders
**Probabilité**: Moyenne  
**Cause racine**: Le client effectue des retries sans idempotence côté serveur.

**Hypothèses**:
- Timeout côté client déclenchant une nouvelle soumission
- Absence de clé d'idempotence dans le payload

---

## 3. Timeline d'Escalade

```
08:02:30 ─── Première NullPointerException (paiement)
08:03:45 ─── Deuxième NullPointerException (paiement)
08:06:00 ─── ⚡ Circuit Breaker S'OUVRE (3 erreurs consécutives)
08:06:00-02 ─── Requêtes rejetées en rafale (503)
08:07:00 ─── Temps de réponse dégradés sur produits (2340ms)
08:12:30 ─── 🔴 DB Pool exhausted (première occurrence)
08:18:15 ─── 🔴 OutOfMemoryError (rapport mensuel)
08:21:00 ─── Circuit Breaker se rouvre (après tentative de récupération)
08:25:00 ─── DB Pool exhausted (deuxième occurrence)
08:26:00 ─── Duplicate key sur orders
08:30:00 ─── OutOfMemoryError (deuxième occurrence)
08:35:00 ─── DB Pool exhausted (troisième occurrence)
08:40:00 ─── OutOfMemoryError (troisième occurrence)
08:43:00 ─── Duplicate key sur orders (deuxième occurrence)
```

**Constat**: Aucune récupération observée sur la fenêtre de 35 minutes. Le système est en dégradation continue.

---

## 4. Actions Correctives

### 4.1 Correction NullPointerException (PaymentService.java:142)

```java
// AVANT (problématique)
public PaymentResult processPayment(Long orderId) {
    Order order = orderRepository.findById(orderId);
    // line 142 - NullPointerException si order.getUser() est null
    return gateway.charge(order.getUser().getPaymentMethod());
}

// APRÈS (corrigé)
public PaymentResult processPayment(Long orderId) {
    Order order = orderRepository.findById(orderId);
    if (order == null) {
        throw new BusinessException("Order not found: " + orderId);
    }
    User user = order.getUser();
    if (user == null) {
        throw new BusinessException("Order has no associated user: " + orderId);
    }
    PaymentMethod method = user.getPaymentMethod();
    if (method == null) {
        throw new BusinessException("User has no payment method: " + user.getId());
    }
    return gateway.charge(method);
}
```

### 4.2 Configuration du Pool de Connexions DB

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20        # Augmenter si nécessaire
      minimum-idle: 5
      idle-timeout: 30000
      max-lifetime: 1800000
      connection-timeout: 30000
      leak-detection-threshold: 60000  # Alerte si connexion non rendue
```

### 4.3 Optimisation du Rapport Mensuel (OutOfMemory)

```java
// Utiliser un Stream au lieu de tout charger en mémoire
@Transactional(readOnly = true)
public void generateMonthlyReport(OutputStream out) {
    try (Stream<Order> orders = orderRepository.streamAllByMonth(YearMonth.now())) {
        orders.forEach(order -> {
            // Traitement ligne par ligne
            writeRow(out, order);
        });
    }
}

// Repository avec streaming
@Query("SELECT o FROM Order o WHERE o.month = :month")
Stream<Order> streamAllByMonth(@Param("month") YearMonth month);
```

**Alternative SQL** (si le traitement peut être fait en base):
```sql
-- Générer le rapport directement via SQL
COPY (
    SELECT o.id, o.date, o.total, u.email 
    FROM orders o 
    JOIN users u ON o.user_id = u.id
    WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
) TO STDOUT WITH CSV HEADER;
```

### 4.4 Idempotence sur les Créations de Commandes

```java
@PostMapping("/api/orders")
public ResponseEntity<Order> createOrder(
    @RequestHeader("Idempotency-Key") String idempotencyKey,
    @RequestBody CreateOrderRequest request
) {
    // Vérifier si la commande existe déjà
    Optional<Order> existing = orderRepository.findByIdempotencyKey(idempotencyKey);
    if (existing.isPresent()) {
        return ResponseEntity.ok(existing.get()); // Retourner l'existante
    }
    
    Order order = orderService.create(request);
    order.setIdempotencyKey(idempotencyKey);
    orderRepository.save(order);
    return ResponseEntity.status(201).body(order);
}
```

```sql
-- Migration pour ajouter la colonne
ALTER TABLE orders ADD COLUMN idempotency_key VARCHAR(255) UNIQUE;
CREATE INDEX idx_orders_idempotency ON orders(idempotency_key);
```

### 4.5 Monitoring et Alerting

```yaml
# Configuration Prometheus/Grafana
alerts:
  - name: PaymentErrorRate
    expr: rate(http_requests_total{endpoint="/api/payments",status=~"5.."}[5m]) > 0.1
    severity: critical
    
  - name: DbPoolExhausted
    expr: hikaricp_connections_active / hikaricp_connections_max > 0.9
    severity: warning
    
  - name: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    severity: warning
```

---

## 5. Résumé Exécutif

| Problème | Impact | Urgence | Complexité |
|----------|--------|---------|------------|
| NullPointerException (paiements) | Critique — Service indisponible | 🔴 Immédiate | Faible |
| Circuit Breaker | Critique — Rejet de 100% des paiements | 🔴 Immédiate | Moyenne |
| DB Pool exhausted | Élevé — Échecs intermittents | 🟠 Courte | Moyenne |
| OutOfMemoryError (rapports) | Élevé — Rapports indisponibles | 🟠 Courte | Moyenne |
| Duplicate key (orders) | Moyen — Erreurs client | 🟡 Moyenne | Faible |
| Temps de réponse lents | Moyen — UX dégradée | 🟡 Moyenne | Élevée |

**Recommandation prioritaire**: Corriger la NullPointerException dans `PaymentService.java:142` avant toute autre action. Cette correction restaurera le service de paiement immédiatement.
