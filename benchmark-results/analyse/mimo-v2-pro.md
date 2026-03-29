# Analyse des logs serveur — openrouter/xiaomi/mimo-v2-pro

**Modèle évalué :** `openrouter/xiaomi/mimo-v2-pro`
**Tâche :** Analyse de logs serveur (server-log.txt)
**Fenêtre analysée :** 08:01:12 → 08:43:00 (~42 min)
**Date :** 2026-03-29

---

## 1. Vue d'ensemble

| Métrique | Valeur |
|---|---|
| Requêtes totales | 40 |
| Requêtes OK (200/201) | 27 (67,5 %) |
| Erreurs 500 | 8 (20 %) |
| Erreurs 503 (Circuit breaker) | 4 (10 %) |
| Warnings (>2 000 ms) | 9 (22,5 %) |
| Temps de réponse moyen (requêtes OK) | ~1 000 ms (médiane ~63 ms sans les lentes) |
| Temps de réponse max | 6 200 ms (`/api/search?q=pneu`) |

---

## 2. Symptômes visibles avec métriques

### 2.1 — Défaillance du paiement (PaymentService)

- **6 occurrences** de `NullPointerException` à `PaymentService.java:142` (08:02:30 → 08:31:00)
- Puis **4 occurrences** de `Circuit breaker OPEN for payment-gateway` (08:06:00 → 08:36:00)
- Le circuit breaker déclenché ~3 min après les premières erreurs indique une cascade d'échecs qui sature la tolerance du breaker.
- **Impact :** 100 % des appels `/api/payments` en échec sur la fenêtre.

### 2.2 — Lenteurs critiques (>2 s)

| Heure | Endpoint | Temps (ms) |
|---|---|---|
| 08:04:20 | `/api/search?q=tires` | 5 120 |
| 08:07:00 | `/api/products/55` | 2 340 |
| 08:09:45 | `/api/orders/2003` | 3 200 |
| 08:11:45 | `/api/search?q=pneu` | 6 200 |
| 08:14:00 | `/api/products/12` | 4 500 |
| 08:16:45 | `POST /api/orders` | 2 800 |
| 08:19:00 | `/api/orders/1004` | 3 500 |
| 08:23:15 | `/api/search?q=stock` | 5 800 |
| 08:28:00 | `/api/products/33` | 3 800 |
| 08:33:00 | `POST /api/orders` | 4 100 |
| 08:38:00 | `/api/products/77` | 4 200 |

- **9 endpoints** dépassent le seuil de 2 000 ms.
- Les endpoints `/api/search` sont les pires (5–6 s), suggérant un problème de requête full-text ou d'index manquant.
- La dégradation est **progressive** : les premiers warnings (08:04) sont à ~5 s, mais les lenteurs se multiplient après 08:16.

### 2.3 — Épuisement du pool de connexions DB

- **3 occurrences** de `ConnectionTimeout: DB pool exhausted` sur `/api/inventory/stock` (08:12:30, 08:25:00, 08:35:00).
- Intervalle régulier (~10 min), indiquant que les connexions ne sont pas libérées correctement (probable fuite de connexions).

### 2.4 — OutOfMemoryError

- **3 occurrences** de `OutOfMemoryError: Java heap space` sur `/api/reports/monthly` (08:18:15, 08:30:00, 08:40:00).
- Récurrence à ~10 min d'intervalle : le GC ne parvient pas à libérer suffisamment de mémoire → le heap est sous-dimensionné ou il y a une fuite mémoire dans la génération de rapports.

### 2.5 — Violation de contrainte DB

- **2 occurrences** de `ConstraintViolation: duplicate key orders_pkey` sur `POST /api/orders` (08:26:00, 08:43:00).
- Absence de `sequence`/`auto-increment` correctement synchronisé, ou logique de retry qui réinsère les mêmes données.

---

## 3. Causes probables (priorisées)

| # | Cause | Gravité | Confiance |
|---|---|---|---|
| 1 | **Fuite mémoire dans `/api/reports/monthly`** — 3 OOMError en 42 min, heap insuffisant | 🔴 Critique | Haute |
| 2 | **Bug `NullPointerException` dans `PaymentService.java:142`** — cascade vers circuit breaker, 100 % de rejet paiements | 🔴 Critique | Haute |
| 3 | **Fuite de connexions DB** — pool épuisé régulièrement, impacte `/api/inventory/stock` et probablement les lenteurs généralisées | 🔴 Critique | Haute |
| 4 | **Recherche sans index** — `/api/search` systématiquement >5 s, probable scan séquentiel | 🟠 Majeur | Moyenne |
| 5 | **Clé primaire dupliquée sur `orders`** — sequence non synchronisée ou logique de retry incorrect | 🟠 Majeur | Moyenne |

### Corrélation

La fuite de connexions DB (#3) explique probablement les lenteurs progressives sur `/api/products`, `/api/orders` et `/api/search` — ces endpoints attendent une connexion disponible, ce qui dégrade le temps de réponse. L'OOM (#1) est indépendant mais ajoute de la pression sur le système.

---

## 4. Timeline d'escalade

```
08:01 — Système nominal (35-89 ms)
08:02 — Premier NPE PaymentService → paiements KO
08:04 — Premières lenteurs search (5 s) → indice de dégradation DB
08:06 — Circuit breaker paiements OUVERT → paiements totalement bloqués
08:07 — Lenteurs produits apparaissent (2,3 s)
08:12 — Pool DB épuisé (première occurrence) → impacte inventory
08:18 — Premier OOM reports/monthly
08:26 — Première violation de clé dupliquée orders
08:35 — Troisième épuisement pool DB → dégradation systémique
08:40 — Troisième OOM reports → situation ingérable sans restart
08:43 — Dernière violation clé orders → fin de fenêtre
```

**Durée de dégradation avant impact systémique :** ~5 min (08:02 → 08:06 circuit breaker).
**Point de non-retour estimé :** ~08:35 (3e pool exhaustion + 3e OOM).

---

## 5. Actions correctives

### Immédiat (hotfix)

#### 5.1 — PaymentService NullPointerException
```java
// PaymentService.java:142 — Ajouter null-check et fallback
if (paymentRequest == null || paymentRequest.getOrderId() == null) {
    log.warn("Requête de paiement invalide: {}", paymentRequest);
    throw new PaymentValidationException("Données de paiement manquantes");
}
```

#### 5.2 — Reset du circuit breaker (après correction NPE)
```java
// Forcer le reset une fois le bug corrigé
circuitBreaker.reset("payment-gateway");
```

#### 5.3 — Redémarrage avec heap augmenté (workaround OOM)
```bash
java -Xmx4g -Xms2g -jar reports-service.jar  # passer de ~512m (défaut) à 4g
```

### Court terme (1-2 jours)

#### 5.4 — Fuite de connexions DB
```java
// Vérifier que chaque connexion est fermée dans finally/try-with-resources
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    // ...
} // auto-close garanti
```
Vérifier aussi la config du pool :
```yaml
# application.yml
spring.datasource.hikari.maximum-pool-size: 20
spring.datasource.hikari.leak-detection-threshold: 30000  # alerte si connexion >30s non rendue
```

#### 5.5 — Index de recherche
```sql
-- Créer un index GIN pour la recherche full-text si PostgreSQL
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('french', name || ' ' || description));

-- Ou index simple si MySQL
CREATE INDEX idx_products_name ON products(name);
```

#### 5.6 — Séquence orders
```sql
-- Vérifier l'état de la séquence vs max(id)
SELECT MAX(id) FROM orders;
SELECT last_value FROM orders_id_seq;

-- Réaligner si nécessaire
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
```

### Moyen terme (1-2 semaines)

- **Monitoring :** Ajouter des alertes Prometheus/Grafana sur heap usage, pool connections actives, circuit breaker state.
- **Tests de charge :** Valider la correction avec un test reproduisant le scénario de lenteurs.
- **OOM reports/monthly :** Profiler avec VisualVM/JFR pour identifier la fuite mémoire (probable chargement en mémoire de datasets trop volumineux → pagination ou streaming).

---

## 6. Résumé

Le serveur présente **5 problèmes interconnectés** dont le plus critique est la combinaison PaymentService NPE + circuit breaker qui rend 100 % des paiements indisponibles. La fuite de connexions DB explique la dégradation progressive des temps de réponse. L'OOM sur les rapports indique un problème structurel de mémoire. La violation de clé primaire est un bug applicatif mineur mais récurrent.

**Score de santé du système : 3/10** — fonctionnel pour les lectures simples, totalement dégradé pour paiements, rapports et opérations sous charge.
