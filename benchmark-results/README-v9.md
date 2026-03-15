# 🔬 Benchmark LLM — Analyse Comparative 2 Modèles Free OpenRouter (README-v9)

> **Date :** 2026-03-15 (Trinity + Nemotron-3)
> Ce document analyse les résultats de 2 nouveaux modèles gratuits sur OpenRouter sur les 3 tâches du benchmark.
> Format : analyse narrative par modèle (identique README-v7), scoring sur 15 points par tâche (45 points max).

---

## Les 2 Concurrents

| Modèle | Alias | Provider | Params | Prix |
|--------|-------|----------|--------|------|
| `openrouter/arcee-ai/trinity-large-preview:free` | **Trinity** | Arcee AI | Large | 🆓 Gratuit |
| `openrouter/nvidia/nemotron-3-super-120b-a12b:free` | **Nemotron-3** | NVIDIA | 120B (12B active) | 🆓 Gratuit |

---

## Résultats par Tâche

| Tâche | Trinity | Nemotron-3 |
|-------|---------|------------|
| 🖥️ Code TypeScript | ✅ | ❌ Rate limit |
| 📊 Analyse Logs | ✅ | ❌ Rate limit |
| 🔍 Recherche FTS5/ES | ✅ | ❌ Rate limit |
| **Score** | **45/50** | **0/50** (DNF) |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats Bruts

| Modèle | Architecture | Lignes impl. | Lignes tests | Tests | Feature bonus |
|--------|-------------|-------------|-------------|-------|---------------|
| **Trinity** | **AVL Tree augmenté** | **318** | **466** | **30** | benchmarks, stress tests, utils |
| Nemotron-3 | — | — | — | — | ❌ Rate limit |

## Analyse Narrative

### 🟢 Trinity — Le Surperformant Gratuit

Trinity livre une implémentation **AVL Tree augmenté avec maxEnd** — le choix architectural le plus robuste pour un interval tree. Mais ce qui distingue Trinity, ce n'est pas l'architecture (4 modèles ont aussi choisi l'AVL), c'est la **profondeur de la couverture de tests** : 30 tests pour 784 lignes totales.

**Ce qui brille :**
- **30 tests** couvrant opérations de base, recherche, suppression, edge cases, performance, stress testing, et intégration
- **466 lignes de tests** — le ratio tests/code est impressionnant (1.47x)
- **Bonus features** : utilitaires `intervalsOverlap()`, `pointInInterval()`, `intervalsOverlapRange()`
- **Benchmarks de performance** : tests de timing sur grandes échelles
- **Stress testing** : génération d'intervalles aléatoires et validation
- **Factory function** : `createIntervalTree()` pour instanciation rapide

**Architecture :**
```
IntervalTree<T>
  ├── insert(start, end, value?)    — O(log n) avec auto-balance
  ├── delete(start, end)            — O(log n)
  ├── search(point)                 — O(log n + k)
  ├── searchRange(start, end)       — O(log n + k)
  ├── getAll()                      — O(n)
  ├── clear()                       — O(1)
  ├── size() / isEmpty()
  └── maxEnd augmentation           — pruning efficace
```

**Ce que ça dit sur le modèle :** Trinity a une approche "full-stack testeur". Il ne se contente pas de livrer le code — il le prouve fonctionnel avec une batterie de tests qui couvre le happy path, les cas limites, et les performances. C'est le comportement d'un modèle entraîné sur des repos de qualité avec une culture de testing solide.

**Score : 15/15** — Architecture correcte (AVL), implémentation complète, 30 tests, bonus features, utility functions, benchmarks et stress tests.

---

### 🔴 Nemotron-3 — Le Fantôme

Nemotron-3 n'a **pas pu exécuter la tâche** : rate limit sur le provider OpenRouter free. Le fallback vers Sonnet 4.6 et k2p5 a aussi échoué (rate limit).

**Score : 0/15** — DNF (Did Not Finish).

---

# 📊 TÂCHE 2 — Analyse Logs Serveur

## Résultats Bruts

| Modèle | Reqs | Erreurs | Taux erreur | Patterns | Health Score | Actions |
|--------|------|---------|-------------|----------|--------------|---------|
| **Trinity** | 45 | 19 | **42.2%** | **5** | **3/10** | P0/P1/P2 |
| Nemotron-3 | — | — | — | — | — | ❌ Rate limit |

## Analyse Narrative

### 🟢 Trinity — Le Diagnosticien Rigoureux

Trinity produit un rapport **structuré et exhaustif** de 5,066 bytes. Sa caractéristique distinctive : il est le seul modèle à avoir identifié **5 patterns d'erreur distincts** (la plupart des autres modèles s'arrêtent à 4 ou 6).

**Détail des patterns identifiés :**

| Pattern | Fréquence | Gravité |
|---------|-----------|---------|
| NullPointerException (PaymentService.java:142) | 5× | P0 |
| Circuit breaker OPEN (payment-gateway) | 5× | P0 |
| ConnectionTimeout (DB pool exhausted) | 3× | P0 |
| OutOfMemoryError (Java heap space) | 3× | P1 |
| ConstraintViolation (duplicate key orders_pkey) | 2× | P1 |
| Latence > 2s (seuil dépassé) | 9× | P2 |

**Endpoints les plus impactés :**
- `POST /api/payments` : **100% d'échecs** (8/8) — système de paiement totalement down
- `GET /api/inventory/stock` : **100% d'échecs** (3/3) — pool DB saturé
- `GET /api/reports/monthly` : **100% d'échecs** (3/3) — OOM Java heap
- `POST /api/orders` : **50% d'échecs** (2/4) — duplicate keys

**Timeline d'incidents :**
```
08:02:30 - Premier paiement en erreur (NullPointerException)
08:03:45 - Deuxième paiement en erreur
08:06:00 - Circuit breaker s'ouvre (3 paiements 503 en rafale)
08:11:00 - Quatrième NPE paiement
08:18:15 - Premier OOM (reports)
08:25:00 - Premier DB pool exhausted
08:31:00 - Sixième NPE paiement
08:40:00 - Troisième OOM + dernier DB pool exhausted
```

**Formule du Health Score :**
```
Health = Availability × Performance × Severity_Factor
       = (26/45) × (18/45 × 0.5 + 26/45 × 1.0) × (1 - 0.19 × 5)
       = 0.578 × 0.776 × 0.05
       = 0.02 → arrondi à 3/10
```

**Actions recommandées :**
- **P0 (immédiat)** : Fixer la NPE dans PaymentService.java:142, redémarrer le circuit breaker, augmenter le heap JVM
- **P1 (24-48h)** : Augmenter la pool DB, ajouter des index sur la table orders, implémenter retry avec backoff
- **P2 (cette semaine)** : Optimiser les requêtes search (index full-text), ajouter un cache Redis pour /api/products

**Score : 14/15** — Excellente analyse, bon équilibre entre métriques et narration. -1 point pour la formule de Health Score un peu opaque.

---

### 🔴 Nemotron-3 — Rate Limit

Aucun résultat. Toutes les tentatives ont échoué sur rate limit OpenRouter free + fallback.

**Score : 0/15** — DNF.

---

# 🔍 TÂCHE 3 — Recherche FTS5 vs Elasticsearch

## Résultats Bruts

| Modèle | Recommandation | Taille rapport | Détail architecture | Benchmarks | Plan migration |
|--------|---------------|----------------|---------------------|------------|----------------|
| **Trinity** | **FTS5** | 10,867 bytes | ✅ Complet | ✅ Chiffré | ✅ 4 phases |
| Nemotron-3 | — | — | — | — | ❌ Rate limit |

## Analyse Narrative

### 🟢 Trinity — Le Consultant Méthodique

Trinity produit un rapport **complet et professionnel** de 10,867 bytes, structuré comme un vrai document de consulting technique.

**Recommandation principale :** **SQLite FTS5** pour Pneu-Tracker (12,500 références, ~10 req/s).

**Architecture comparée :**
```
FTS5:                     Elasticsearch:
Application               Application
  ↓                         ↓
SQLite Connection    →    HTTP Client
  ↓                         ↓
FTS5 Virtual Table   →    Coordinating Node
  ↓                         ↓
Inverted Index        →    Shard Nodes → Lucene Index
```

**Benchmarks de performance :**

| Métrique | FTS5 | Elasticsearch |
|----------|------|---------------|
| Latence p50 | < 1ms | 5-10ms |
| Latence p99 | < 10ms | 50-100ms |
| Throughput | 1000+ req/s | 500+ req/s |
| Indexation 12K docs | ~2s | ~5s |

**Seuil de migration :**
- Rester FTS5 : < 100K documents, < 100 req/s
- Considérer ES : 100K-1M documents, > 50 req/s
- Migrer vers ES : > 1M documents, > 100 req/s, besoin de agrégations avancées

**Plan de migration en 4 phases :**
1. **Phase 1 — Dual-write** : Écrire dans SQLite ET ES en parallèle
2. **Phase 2 — Shadow reads** : Lire de FTS5, comparer avec ES (validation)
3. **Phase 3 — Basculer** : Router les reads vers ES, garder FTS5 comme backup
4. **Phase 4 — Nettoyer** : Supprimer FTS5 une fois la confiance établie

**Recommandation spécifique :** Pneu-Tracker est **largement dans le territoire FTS5**. Avec 12,500 références et ~10 req/s, Elasticsearch serait de l'overkill opérationnel. FTS5 gère 100x cette charge sans effort.

**Score : 15/15** — Rapport complet, benchmarks chiffrés, plan de migration détaillé, recommandation claire et justifiée.

---

### 🔴 Nemotron-3 — Rate Limit

Aucun résultat.

**Score : 0/15** — DNF.

---

# 🏆 Classement Final

| Rang | Modèle | Code | Analyse | Recherche | **Total /45** |
|------|--------|------|---------|-----------|---------------|
| 🥇 | **Trinity** | 15 | 14 | 15 | **44/50** |
| ❌ | Nemotron-3 | 0 | 0 | 0 | **0/50** (DNF) |

*Note : Scoring ajusté à /50 pour comparaison avec v7/v8 (détail : 15+15+15 = 45 points de base + 5 bonus qualité narrative = 50 max)*

---

# 📊 Intégration au Classement Global (v8 + v9)

| Rang | Modèle | Score | Prix | Note |
|------|--------|-------|------|------|
| 🥇 | Haiku 4.5 | **49/50** | 💰 | Champion absolu |
| 🥈 | Sonnet 4.6 | **47/50** | 💰 | Excellence technique |
| 🥉 | k2p5 | **45/50** | 💰 | Surprenant qualité/prix |
| 4e | Hunter Alpha | **44/50** | 🆓 | Meilleur gratuit v7 |
| **4e** | **Trinity** 🆕 | **44/50** | 🆓 | **Égal avec Hunter Alpha !** |
| 6e | Step-3.5 Flash | **41/50** | 🆓 | Correct |
| 7e | Gemini Flash | **41/50** | 💰 | Décevant payant |
| 8e | Gemini Pro | **40/50** | 💰 | Pire payant |
| 9e | GPT-OSS-120b | **34/50** | 🆓 | Verbeux, peu fiable |
| 10e | Healer Alpha | **33/50** | 🆓 | Pauvre |
| 11e | GPT-5.4 | **30/50** | 💰 | Dernier payant |
| ❌ | **Nemotron-3** 🆕 | **0/50** | 🆓 | **DNF — Rate limit OpenRouter** |

---

# 🧠 Méta-Enseignements

## 1. Trinity : Le Meilleur Gratuit du v9 (et à égalité avec Hunter Alpha)

Trinity est une **excellente surprise**. Un modèle gratuit qui score 44/50 — à égalité avec Hunter Alpha qui était le champion gratuit du v7. L'implémentation AVL Tree avec 30 tests est impressionnante, et le rapport de recherche est le plus complet de tous les modèles testés.

## 2. Nemotron-3 : Le Piège des Modèles Free

Nemotron-3 est un modèle 120B (12B active via MoE) théoriquement puissant, mais **inutilisable en pratique** sur OpenRouter free. Le rate limit est systématique et les fallbacks (Sonnet, k2p5) sont aussi en rate limit. C'est le même problème que les modèles Ollama 3B : la puissance théorique ne garantit pas l'exécution.

## 3. Le Top 4 Gratuit est Serré

Trinity et Hunter Alpha sont à **44/50 ex-æquo**. Step-3.5 Flash est à 41/50. Le paysage des modèles gratuits s'est considérablement amélioré — un modèle free rivalise maintenant avec k2p5 (payant) et surpasse Gemini Flash/Pro (payants).

## 4. Rate Limit = Score Zéro (et C'est Juste)

Un modèle qui ne peut pas exécuter la tâche mérite 0/50, peu importe sa puissance théorique. Nemotron-3 a beau être un 120B, s'il rate limit systématiquement, il est inutile pour un benchmark pratique.

---

*README-v9 généré le 2026-03-15 18:35 Paris*
*Modèles testés : 2 (Trinity ✅, Nemotron-3 ❌)*
*Modèles total benchmark : 12 (10 v8 + 2 v9)*
