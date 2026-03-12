# Rapport d’analyse des logs serveur — 2026-03-12

## 1. Vue d’ensemble

### Statistiques globales
- **Période couverte** : 08:01:12 → 08:45:00
- **Nombre total de requêtes** : **52**
- **Requêtes nominales (`INFO`)** : **20**
- **Requêtes dégradées (`WARN`)** : **11**
- **Requêtes en erreur (`ERROR`)** : **21**
- **Taux d’erreur** : **40,4 %**
- **Taux de requêtes dégradées** : **21,2 %**
- **Part de trafic non nominal (`WARN` + `ERROR`)** : **61,5 %**
- **Temps moyen de réponse** : **942 ms**
- **Temps médian** : **90 ms**
- **P95 observé** : **4 500 ms**

### Lecture rapide
- La prod est **fortement instable** sur la fenêtre observée.
- Les endpoints simples (`/api/health`, `/api/users`, `/api/dashboard`) restent rapides, ce qui suggère une panne **partielle et ciblée**, pas un effondrement total de l’application.
- Les zones les plus touchées sont : **paiements**, **accès base de données**, **reporting mensuel**, puis **commandes** et **recherche/produits** côté latence.

### Endpoints les plus exposés
| Endpoint | Nb appels | Constat principal |
|---|---:|---|
| `/api/payments` | 12 | endpoint le plus instable : nombreux 500/503, 1 seul succès |
| `/api/orders` | 8 | mélange de lenteurs fortes et d’erreurs d’intégrité |
| `/api/products` | 6 | plusieurs réponses lentes récurrentes |
| `/api/inventory/stock` | 4 | erreurs 500 liées au pool DB |
| `/api/reports/monthly` | 3 | 100 % en erreur, toutes en OutOfMemoryError |

---

## 2. Anomalies détectées

### A. NullPointerException sur le service de paiement
- **Pattern** : `NullPointerException at PaymentService.java:142`
- **Fréquence** : **6 occurrences**
- **Endpoints concernés** : `POST /api/payments`
- **Impact** : échec immédiat du paiement en **HTTP 500** ; impact business direct sur la conversion et le chiffre d’affaires.
- **Lecture** : bug applicatif reproductible, localisé précisément dans le code. Très probablement une cause racine directe sur le flux paiement.
- **Score de sévérité** : **9/10**

### B. Circuit breaker OPEN sur le paiement
- **Pattern** : `Circuit breaker OPEN` / `Circuit breaker OPEN for payment-gateway`
- **Fréquence** : **5 occurrences**
- **Endpoints concernés** : `POST /api/payments`
- **Impact** : refus immédiat des paiements en **HTTP 503** ; indisponibilité fonctionnelle du paiement.
- **Lecture** : la chaîne de paiement bascule en mode protection. Ça indique soit une dépendance paiement externe en vrac, soit un sous-système interne déjà trop dégradé.
- **Score de sévérité** : **10/10**

### C. Épuisement du pool de connexions DB
- **Pattern** : `ConnectionTimeout: DB pool exhausted`
- **Fréquence** : **5 occurrences**
- **Endpoints concernés** : `GET /api/inventory/stock`, `GET /api/users/12`, puis à nouveau `GET /api/inventory/stock`
- **Impact** : erreurs **HTTP 500** sur plusieurs endpoints ; risque systémique de propagation à d’autres fonctionnalités.
- **Lecture** : symptôme classique d’une saturation DB, de connexions non relâchées, de requêtes trop lentes, ou d’un pool sous-dimensionné.
- **Score de sévérité** : **9/10**

### D. OutOfMemoryError sur le reporting mensuel
- **Pattern** : `OutOfMemoryError: Java heap space`
- **Fréquence** : **3 occurrences**
- **Endpoints concernés** : `GET /api/reports/monthly`
- **Impact** : endpoint inutilisable, avec risque de pression mémoire globale sur la JVM.
- **Lecture** : le traitement de reporting charge probablement trop de données en mémoire ou fait un traitement non paginé/non streamé.
- **Score de sévérité** : **8/10**

### E. Violation d’unicité sur les commandes
- **Pattern** : `ConstraintViolation: duplicate key orders_pkey`
- **Fréquence** : **2 occurrences**
- **Endpoints concernés** : `POST /api/orders`
- **Impact** : échec de création de commande en **HTTP 500** ; risque de commandes perdues ou de retry foireux.
- **Lecture** : possible problème de génération d’ID, séquence SQL cassée, ou absence d’idempotence lors des retries.
- **Score de sévérité** : **7/10**

### F. Latence élevée récurrente sur plusieurs endpoints
- **Pattern** : réponses lentes entre **2 340 ms** et **6 200 ms**
- **Fréquence** : **11 occurrences WARN**
- **Endpoints concernés** : `GET /api/products`, `GET /api/search`, `POST /api/orders`
- **Impact** : forte dégradation UX, timeouts potentiels côté client, et probable précurseur des incidents plus graves.
- **Lecture** : ce n’est pas encore toujours fatal, mais ça sent la saturation ou les dépendances lentes. Typiquement un signal avant la casse plus large.
- **Score de sévérité** : **6/10**

---

## 3. Recommandations prioritaires

### Priorité 1 — Stabiliser le paiement tout de suite
1. **Corriger en premier le `NullPointerException` dans `PaymentService.java:142`**.
2. **Auditer le payment-gateway** : disponibilité, timeouts, erreurs upstream, seuils du circuit breaker.
3. Ajouter un **mode dégradé propre** : message métier clair, retry maîtrisé, journalisation enrichie.
4. Vérifier pourquoi un seul appel paiement revient à **200** à 08:27 alors que le reste alterne entre 500 et 503.

**Pourquoi en premier ?**
- `/api/payments` concentre **12 appels**, dont **11 anormaux**.
- C’est l’impact métier le plus direct : paiements perdus = prod réellement cassée.

### Priorité 2 — Résoudre la saturation DB
1. Vérifier la **taille du pool**, le temps d’attente, les connexions actives/idle, et les connexions jamais relâchées.
2. Chercher les **slow queries** corrélées aux endpoints lents (`orders`, `products`, `search`, `inventory`).
3. Contrôler locks, contention, saturation CPU/IO DB.
4. Ajouter ou exploiter des métriques : **pool usage**, **wait time**, **query time**, **error rate**.

**Pourquoi juste après ?**
- `DB pool exhausted` touche plusieurs endpoints et ressemble à une cause racine transverse.

### Priorité 3 — Isoler ou corriger le reporting mensuel
1. Désactiver temporairement `/api/reports/monthly` en journée si possible.
2. Profiler la consommation mémoire du traitement.
3. Revoir l’algorithme : pagination, streaming, batch processing, limitation dataset.
4. Ajuster la heap **seulement après** correction du pattern de consommation.

**Pourquoi ?**
- Un `OutOfMemoryError` n’est jamais anodin : ça peut finir par flinguer la JVM entière si ça se répète.

### Priorité 4 — Sécuriser la création de commandes
1. Vérifier la séquence/génération d’ID de `orders_pkey`.
2. Ajouter une vraie **idempotency key** si des retries sont possibles.
3. Différencier erreur fonctionnelle et erreur technique pour éviter les 500 bruts.

### Priorité 5 — Traiter les lenteurs avant qu’elles explosent
1. Mettre une vue par endpoint sur **P50 / P95 / P99**.
2. Tracer la chaîne `API → DB → dépendance externe`.
3. Cibler d’abord `search`, `products`, `orders`.
4. Corréler les pics de latence avec les erreurs DB et paiement.

---

## 4. Synthèse des scores de sévérité

| Anomalie | Fréquence | Sévérité |
|---|---:|---:|
| NullPointerException sur `PaymentService.java:142` | 6 | **9/10** |
| Circuit breaker OPEN sur paiements | 5 | **10/10** |
| `DB pool exhausted` | 5 | **9/10** |
| `OutOfMemoryError: Java heap space` | 3 | **8/10** |
| `duplicate key orders_pkey` | 2 | **7/10** |
| Latence élevée récurrente (> 2 s) | 11 | **6/10** |

---

## Conclusion

La prod est dans un état **dégradé à critique** sur cette fenêtre, avec **trois foyers majeurs** :
1. **Paiement cassé** (bug applicatif + circuit breaker)
2. **Base de données sous tension** (pool épuisé)
3. **Reporting mensuel dangereux pour la mémoire JVM**

### Ordre d’action recommandé pour stabiliser la prod
1. **Réparer le flux paiement**
2. **Traiter la saturation DB**
3. **Isoler/corriger le reporting mensuel**
4. **Sécuriser l’idempotence et l’intégrité des commandes**
5. **Optimiser les endpoints lents avant qu’ils ne virent tous en 500**
