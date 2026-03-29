# Analyse des Logs Serveur — Benchmark LLM

**Modèle:** `openrouter/xiaomi/mimo-v2-omni`
**Tâche:** Analyse de logs serveur
**Période couverte:** 08:01:12 → 08:43:00 (~42 minutes)
**Total requêtes analysées:** 38

---

## 1. Symptômes visibles avec métriques précises

### 1.1 Erreurs critiques (HTTP 5xx)

| Erreur | Endpoint | Count | Détail |
|--------|----------|-------|--------|
| NullPointerException | `POST /api/payments` | 5 | `PaymentService.java:142` |
| Circuit Breaker OPEN | `POST /api/payments` | 5 | `payment-gateway` down |
| OutOfMemoryError | `GET /api/reports/monthly` | 3 | Java heap space épuisée |
| ConnectionTimeout | `GET /api/inventory/stock` | 3 | DB pool épuisé |
| ConstraintViolation | `POST /api/orders` | 2 | `orders_pkey` duplicate key |

**Taux d'erreur global:** 18/38 = **47.4%** des requêtes en échec.

### 1.2 Latence excessive (dépassant le seuil de 2000ms)

| Endpoint | Latence observée | Nombre d'occurrences |
|----------|-----------------|----------------------|
| `GET /api/search?q=…` | 5 120ms, 6 200ms, 5 800ms | 3 |
| `GET /api/products/{id}` | 2 340ms → 4 500ms | 4 |
| `GET /api/orders/{id}` | 3 200ms, 3 500ms | 2 |
| `POST /api/orders` | 2 800ms, 4 100ms | 2 |

**Moyenne des requêtes lentes:** ~4 000ms (2× le seuil).
**Endpoint le plus lent:** `GET /api/search?q=pneu` à **6 200ms**.

### 1.3 Endpoints sains (temps de réponse normaux)

- `GET /api/users/{id}` : 35–44ms ✅
- `GET /api/dashboard` : 63–71ms ✅
- `GET /api/health` : 11–12ms ✅
- `GET /api/products` (liste) : 89ms ✅

---

## 2. Causes probables (priorisées)

### 🔴 P1 — Fuite mémoire sur le service de rapports
**Impact:** OOM crash sur `/api/reports/monthly` (3 occurrences en 22 min).
**Cause probable:** Requête SQL non paginée chargant tout le mois en mémoire heap. Probablement un `SELECT *` sans `LIMIT` ou un ResultSet entièrement materialisé.
**Corrélation:** L'OOM intervient à 08:18, 08:30, 08:40 — cycle régulier de ~10–12 min, cohérent avec un GC qui ne libère plus.

### 🔴 P1 — NullPointerException récurrent dans PaymentService
**Impact:** 5 échecs HTTP 500 sur `/api/payments` + déclenchement du circuit breaker.
**Cause probable:** Le champ à la ligne 142 de `PaymentService.java` est null. Scénario typique : objet `paymentGateway` non initialisé, ou réponse null d'un service tiers non géré avec `Optional`/null-check.
**Consigne de code:**
```java
// PaymentService.java:142 — ligne problématique probable
// AVANT (crash) :
String transactionId = paymentGateway.charge(request.getAmount()).getId();

// APRÈS (corrigé) :
ChargeResponse response = paymentGateway.charge(request.getAmount());
if (response == null || response.getId() == null) {
    throw new PaymentGatewayException("Empty response from payment gateway");
}
String transactionId = response.getId();
```

### 🟠 P2 — Pool de connexions DB insuffisant
**Impact:** `ConnectionTimeout: DB pool exhausted` sur `/api/inventory/stock` (3 occurrences).
**Cause probable:** Taille du pool HikariCP (ou équivalent) trop petite par rapport au pic de concurrence. Les requêtes `/api/search` et `/api/products` (lentes) maintiennent les connexions occupées trop longtemps, bloquant l'accès au pool.
**Recommandation:** Augmenter `maximumPoolSize` et investiguer les queries lentes.

### 🟠 P2 — Requêtes de recherche et de produits chroniquement lentes
**Impact:** 11 requêtes au total dépassant 2 000ms, jusqu'à 6 200ms.
**Cause probable:**
- **Search :** Absence d'index Elasticsearch/Full-text, ou jointure `LIKE '%…%'` sur grande table.
- **Products (par ID) :** Requête N+1 ou jointure non optimisée (ex. : chargement des variants/catégories en boucle).

### 🟡 P3 — Clé primaire en doublon sur `orders`
**Impact:** 2 erreurs `ConstraintViolation: duplicate key orders_pkey`.
**Cause probable:** Séquence PostgreSQL `orders_id_seq` désynchronisée avec la colonne `id`. Typique après une restauration de backup ou des inserts manuels avec des IDs statiques.
**Correction SQL :**
```sql
-- Vérifier le décalage
SELECT MAX(id) FROM orders;
SELECT nextval('orders_id_seq');

-- Corriger la séquence
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
```

---

## 3. Timeline d'escalade

| Heure | Événement | Gravité |
|-------|-----------|---------|
| 08:02:30 | Premier NullPointerException `/api/payments` | 🟡 Warning |
| 08:03:45 | 2ᵉ NPE — pattern确认 | 🟠 Critique |
| 08:04:20 | Première latence anormale (search: 5 120ms) | 🟡 Warning |
| 08:06:00 | **Circuit breaker OPEN** — paiements bloqués | 🔴 Critique |
| 08:06:00–02 | 3 rejets 503 en 2 secondes (fallback actif) | 🔴 Escalade |
| 08:12:30 | **DB pool exhausted** — inventory en panne | 🔴 Critique |
| 08:14:00 | Latence produits à 4 500ms | 🟠 Dégradation |
| 08:18:15 | **OutOfMemoryError** — `/api/reports/monthly` | 🔴 Critique |
| 08:25:00 | DB pool exhausted récurrent | 🔴 P2 confirmé |
| 08:26:00 | Duplicate key `orders_pkey` | 🟡 Anomalie |
| 08:30:00 | 2ᵉ OOM — rapport mensuel | 🔴 Fuite mémoire confirmée |
| 08:36:00 | Circuit breaker encore OPEN | 🔴 Pas de rétablissement |
| 08:40:00 | 3ᵉ OOM — dégradation continue | 🔴 Escalade P1 |
| 08:43:00 | Duplicate key récurrent | 🟡 P3 persistent |

**Résumé de l'escalade :** L'incident évolue en cascade — la fuite mémoire (P1) et le NPE payments (P1) dégradent le pool de connexions (P2), ce qui ralentit les endpoints de lecture, créant un cercle vicieux de contention.

---

## 4. Actions correctives

### Immédiates (< 1h)

| # | Action | Détail |
|---|--------|--------|
| 1 | **Fix NPE PaymentService.java:142** | Ajouter null-check sur la réponse du gateway (voir code §2) |
| 2 | **Augmenter le DB pool** | `maximumPoolSize: 20 → 50` dans `application.yml` |
| 3 | **Redémarrer le service** | Libérer la heap fragmentée (OOM en cours actif) |
| 4 | **Corriger la séquence orders** | `SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders))` |

### Courtes termes (< 24h)

| # | Action | Détail |
|---|--------|--------|
| 5 | **Ajouter un index full-text sur search** | `CREATE INDEX idx_products_search ON products USING gin(to_tsvector('french', name || ' ' || description));` |
| 6 | **Pagination du rapport mensuel** | Implémenter `LIMIT/OFFSET` ou streaming de résultats |
| 7 | **Tuning HikariCP** | `connectionTimeout: 30s`, `idleTimeout: 5min`, `maxLifetime: 15min` |
| 8 | **Alerter sur OOM** | Configurer un seuil d'alerte à 85% de heap usage |

### Long terme (< 1 semaine)

| # | Action | Détail |
|---|--------|--------|
| 9 | **Monitoring APM** | Déployer Datadog/New Relic pour traces distribuées |
| 10 | **Circuit breaker tuning** | `failureRateThreshold: 50%`, `waitDurationInOpenState: 30s` pour rétablissement automatique plus rapide |
| 11 | **Tests de charge** | Simuler le pic de 08:06 pour valider le pool sizing |
| 12 | **Health check enrichi** | Inclure l'état du pool de connexions et de la heap dans `/api/health` |

---

## 5. Conclusion

Le serveur présente une **dégradation en cascade** avec un taux d'erreur de **47.4%** sur 42 minutes. Les deux causes racines (NPE payments + OOM rapports) sont identifiées et corrigibles immédiatement. La contention DB est un symptôme secondaire qui se résorbera avec les corrections P1.

**Score de santé estimé :** 3/10 — Service en mode dégradé, intervention urgente requise.
