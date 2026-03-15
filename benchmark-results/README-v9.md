# 🔬 Benchmark LLM — Analyse Comparative Complète 12 Modèles (README-v9)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro) · 2026-03-15 (**Trinity, Nemotron-3**)
> Ce document analyse et commente en profondeur les résultats de chacun des 12 modèles sur les 3 tâches.
> Format : analyse narrative par modèle, podiums commentés, méta-enseignements.

---

## Les 12 Concurrents

| Modèle | Alias | Provider | Prix |
|--------|-------|----------|------|
| `openrouter/openrouter/healer-alpha` | **Healer Alpha** | OpenRouter | 🆓 Gratuit |
| `anthropic/claude-sonnet-4-6` | **Sonnet 4.6** | Anthropic | 💰 Payant |
| `openai-codex/gpt-5.4` | **GPT-5.4** | OpenAI | 💰 Payant |
| `openrouter/hunter-alpha` | **Hunter Alpha** | OpenRouter | 🆓 Gratuit |
| `kimi-coding/k2p5` | **k2p5** | Moonshot / Kimi | 💰 Payant |
| `openrouter/stepfun/step-3.5-flash:free` | **Step-3.5 Flash** | StepFun | 🆓 Gratuit |
| `openrouter/openai/gpt-oss-120b:free` | **GPT-OSS-120b** | OpenAI open-source | 🆓 Gratuit |
| `anthropic/claude-haiku-4-5` | **Haiku 4.5** | Anthropic | 💰 Payant |
| `google-gemini-cli/gemini-3-flash-preview` | **Gemini Flash** | Google | 💰 Payant |
| `google-gemini-cli/gemini-3.1-pro-preview` | **Gemini Pro** | Google | 💰 Payant |
| `openrouter/arcee-ai/trinity-large-preview:free` | **Trinity** 🆕 | Arcee AI | 🆓 Gratuit |
| `openrouter/nvidia/nemotron-3-super-120b-a12b:free` | **Nemotron-3** 🆕 | NVIDIA | 🆓 Gratuit |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats Bruts

| Modèle | Architecture | Lignes impl. | Lignes tests | Tests | Feature bonus |
|--------|-------------|-------------|-------------|-------|---------------|
| Healer Alpha | BST augmenté | 192 | 274 | **18** | — |
| **Sonnet 4.6** | Red-Black Tree | 438 | 229 | 15 | `queryInterval()` |
| GPT-5.4 | AVL Tree | 242 | 151 | 13 | — |
| Hunter Alpha | Red-Black BST (LLRB) | 238 | 206 | 15 | — |
| k2p5 | AVL Tree | 364 | 282 | 12+ | `searchInterval()` |
| Step-3.5 Flash | AVL Tree | 281 | 267 | 12 | `searchOverlap()` |
| GPT-OSS-120b | AVL Tree | ~250* | ~400* | **57** | `toArray()`, pruning |
| **Haiku 4.5** | **Red-Black Tree** | **556** | **622** | 42 | `verify()`, floats, négatifs |
| Gemini Flash | AVL Tree | 210 | 110 | 8 | — |
| Gemini Pro | AVL Tree | 227 | 98 | 7 | — |
| **Trinity** 🆕 | **AVL Tree augmenté** | **318** | **466** | **30** | benchmarks, stress, utils |
| Nemotron-3 🆕 | ❌ Rate limit | — | — | — | ❌ |

*\* Estimé — GPT-OSS-120b a fourni 57/57 tests sans détailler les lignes exactes*

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Champion des Tests Économiques

Healer Alpha adopte un **BST simple augmenté avec maxEnd**, sans équilibrage automatique. C'est la solution la moins sophistiquée architecturalement — mais c'est le modèle qui écrit le **plus de tests parmi les payants originaux** (18) et les plus diversifiés.

Ce choix révèle une philosophie claire : **couvrir les cas limites plutôt que d'optimiser les garanties asymptotiques**. Dans un contexte professionnel, une suite de 18 tests bien pensés a souvent plus de valeur qu'un Red-Black Tree parfait sans couverture.

**Ce que ça dit sur le modèle :** Healer pense "livraison" et "maintenabilité". Il préfère un code compréhensible et testé à un bijou algorithmique difficile à déboguer.

**Limite notable :** Sans équilibrage, l'arbre peut dégénérer en liste liée O(n) sur des données ordonnées.

---

### 🔵 Sonnet 4.6 — L'Excellence Technique

Sonnet est le seul parmi les originaux à implémenter un **Red-Black Tree complet**, avec toutes les rotations, les cas de rééquilibrage et — détail crucial — la mise à jour correcte de `maxEnd` pendant les rotations. C'est la partie la plus difficile et la plus souvent mal implémentée dans les arbres d'intervalles.

En plus, Sonnet ajoute `queryInterval(qs, qe)` — une méthode bonus pour rechercher les intervalles chevauchant une plage, pas seulement un point. Personne ne l'a demandé. Sonnet l'a ajouté parce que c'est la méthode logiquement complémentaire.

**Ce que ça dit sur le modèle :** Sonnet ne se contente pas du cahier des charges. Il pense à ce que l'utilisateur *voudra* faire après et anticipe.

---

### 🟡 GPT-5.4 — Le Scolaire Solide

GPT choisit un **AVL Tree** — l'arbre équilibré "classique" enseigné en algorithmique. C'est un choix conservateur mais défendable : l'AVL garantit O(log n) et son code est plus simple que le Red-Black Tree.

**Limite notable :** La suppression utilise un `findByValue()` récursif qui traverse tout l'arbre O(n). Seul modèle à ne pas avoir de feature bonus.

---

### 🟠 Hunter Alpha — L'Efficace Compact

Hunter implémente un **Red-Black Tree** mais de façon plus compacte que Sonnet (444 vs 667 lignes). Il utilise l'approche LLRB (Left-Leaning Red-Black) style Sedgewick pour la suppression — élégante et bien connue.

---

### 🟣 k2p5 — Le Pragmatique Francophone

k2p5 choisit **AVL Tree** comme GPT, mais avec 50% plus de lignes d'implémentation (364 vs 242). Ce surplus s'explique par une **documentation extensive en français** — k2p5 est le seul modèle à avoir adapté ses commentaires à la langue de l'utilisateur.

k2p5 ajoute `searchInterval()` comme méthode bonus — même idée que Sonnet avec `queryInterval()`.

---

### 🔵 Step-3.5 Flash — Le Pragmatique Gratuit

Step-3.5 Flash choisit un **AVL Tree** avec 281 lignes d'implémentation et 267 lignes de tests. Sa méthode bonus `searchOverlap(start, end)` montre une vision d'ensemble. Il est le seul modèle gratuit à avoir ajouté cette feature.

---

### 🟣 GPT-OSS-120b — Le Testeur Production

GPT-OSS-120b produit le **plus grand nombre de tests du benchmark entier** : **57 assertions sur 14 suites**. Seul modèle à avoir stress-testé son implémentation avec 1000 inserts séquentiels pour vérifier l'équilibre AVL.

---

### 🔵 Haiku 4.5 — Le Polyvalent Complet

Haiku choisit un **Red-Black Tree** avec 556 lignes d'implémentation et 622 lignes de tests. La méthode `verify()` — **unique dans ce benchmark** — vérifie les propriétés complètes du Red-Black Tree après chaque opération.

---

### 🟢 Gemini Flash — L'AVL Standard

Gemini Flash implémente un **AVL Tree classique** avec 210 lignes d'implémentation et 110 lignes de tests (8 cas de test). C'est une implémentation propre et fonctionnelle, sans surprises ni bonus.

**Limite notable :** Aucune feature bonus, seulement 8 tests — le plus faible nombre de tests du benchmark payant.

---

### 🔵 Gemini Pro — L'AVL Rigueur

Gemini Pro implémente également un **AVL Tree** avec 227 lignes d'implémentation et 98 lignes de tests (7 cas de test). Légèrement plus verbeux que Flash, avec une attention particulière à la gestion des erreurs.

**Limite notable :** Seulement 7 tests — le minimum viable. Pas de feature bonus.

---

### 🟢 Trinity 🆕 — Le Surperformant Gratuit

Trinity livre une implémentation **AVL Tree augmenté avec maxEnd** — le choix architectural le plus robuste pour un interval tree. Mais ce qui distingue Trinity, ce n'est pas l'architecture (4 modèles ont aussi choisi l'AVL), c'est la **profondeur de la couverture de tests** : 30 tests pour 784 lignes totales.

**Ce qui brille :**
- **30 tests** couvrant opérations de base, recherche, suppression, edge cases, performance, stress testing, et intégration
- **466 lignes de tests** — le ratio tests/code est impressionnant (1.47x)
- **Bonus features** : utilitaires `intervalsOverlap()`, `pointInInterval()`, `intervalsOverlapRange()`
- **Benchmarks de performance** : tests de timing sur grandes échelles
- **Stress testing** : génération d'intervalles aléatoires et validation

**Ce que ça dit sur le modèle :** Trinity a une approche "full-stack testeur". Il ne se contente pas de livrer le code — il le prouve fonctionnel avec une batterie de tests qui couvre le happy path, les cas limites, et les performances. Pour un modèle gratuit, c'est au niveau de Healer Alpha (18 tests) et approche GPT-OSS-120b (57 tests).

**Limite notable :** Architecture AVL standard (pas de RB Tree), pas de méthode de vérification formelle comme `verify()` de Haiku.

---

### 🔴 Nemotron-3 🆕 — Le Fantôme

Nemotron-3 n'a **pas pu exécuter la tâche** : rate limit systématique sur le provider OpenRouter free. Le fallback vers Sonnet 4.6 et k2p5 a aussi échoué (rate limit). Score : 0/15.

**Ce que ça révèle :** Un modèle 120B (12B actifs via MoE) théoriquement puissant mais **inutilisable en pratique** sur le tier free d'OpenRouter.

## Verdict Code — Podium Commenté (12 modèles)

```
🥇 Sonnet 4.6       → RB Tree complet + queryInterval + mise à jour maxEnd pendant rotations
🥈 GPT-OSS-120b 🆓  → 57 tests, stress 1000 inserts, pruning vérifié
🥉 Haiku 4.5        → RB Tree + verify() unique + 42 tests + floats/négatifs
4e Trinity 🆕 🆓     → AVL + 30 tests + benchmarks + stress + utils. Meilleur ratio qualité/gratuit
5e k2p5             → AVL solide + searchInterval + docs FR
6e Hunter Alpha 🆓  → RB compact LLRB
7e Step-3.5 Flash 🆓→ AVL + searchOverlap
8e Healer Alpha 🆓  → BST + 18 tests
9e GPT-5.4          → AVL conventionnel, zéro bonus
10e Gemini Flash 💰 → AVL propre mais seulement 8 tests, 0 bonus
11e Gemini Pro 💰   → AVL rigoureux mais seulement 7 tests, 0 bonus
❌ Nemotron-3 🆓    → Rate limit. DNF.
```

---

# 🔍 TÂCHE 2 — Analyse de Logs Serveur

## Résultats Bruts

| Modèle | Requêtes | Taux erreur | Patterns | Score santé | Style |
|--------|----------|-------------|----------|-------------|-------|
| Healer Alpha | 45 ✅ | 40.0% | 6 | ~4/10 | Diagnostic médical |
| **Sonnet 4.6** | 45 ✅ | **31.1%** | 5 | 3.5/10 | Architecte système |
| GPT-5.4 | **52** ❌ | 40.4% | 5 | ~4/10 | Data analyst |
| Hunter Alpha | **49** ❌ | 42.9% | 6 | ~3/10 | Détective causal |
| k2p5 | 45 ✅ | 44.4% | 5 | ~3/10 | Business / risque |
| Step-3.5 Flash | 45 ✅ | 37.8% | 5 | 2/10 | Systémique cascade |
| GPT-OSS-120b | 45 ✅ | 35.6% | 5 | 6.5/10 | Quantitatif formule |
| **Haiku 4.5** | 45 ✅ | 37.78% | 5 | 2.5/10 | Statisticien précis |
| Gemini Flash | 45 ✅ | 28.9% | 5 | ~3/10 | Tableau endpoint |
| Gemini Pro | 45 ✅ | 40.0% | 6 | 3.2/10 | Vue exécutive |
| **Trinity** 🆕 | 45 ✅ | **42.2%** | **5** | **3/10** | Diagnosticien rigoureux |
| Nemotron-3 🆕 | ❌ | — | — | — | ❌ Rate limit |

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Médecin de Garde

Healer structure son rapport comme un diagnostic médical : **symptômes → causes → traitement**. Sa distinction entre temps moyen et temps médian est la plus pédagogique du benchmark.

---

### 🔵 Sonnet 4.6 — L'Architecte

Sonnet produit le tableau le plus détaillé : **répartition par endpoint** avec nb d'appels, nb d'erreurs, pourcentage et temps moyen. La notation P0/P1/P2 des recommandations reflète une pensée en mode incident response.

---

### 🟡 GPT-5.4 — Le Data Analyst (avec un bug de comptage)

GPT est le seul à mentionner le **P95** (4500ms) — une métrique SRE standard. **Limite majeure :** GPT compte **52 requêtes** dans un log de 45 lignes.

---

### 🟠 Hunter Alpha — Le Détective

Hunter fait la **meilleure lecture causale** : il identifie que le circuit breaker n'est pas une cause racine mais un **symptôme** de la NullPointerException répétée.

**Insight unique :** *"Les 7 occurrences identiques → bug déterministe, pas aléatoire. Fix : 1h de travail."*

---

### 🟣 k2p5 — L'Analyste Business

k2p5 classe l'OutOfMemoryError à **10/10** — un OOM peut crasher toute la JVM. Seul modèle à hiérarchiser ainsi.

---

### 🔵 Step-3.5 Flash — Le Penseur Systémique

Step-3.5 Flash produit une **lecture causale en cascade** : search lentes → connexions DB occupées → pool épuisé → OOM.

---

### 🟣 GPT-OSS-120b — Le Quantitatif à Formule

GPT-OSS fournit une **formule de health score reproductible** : `Score = 10 - (error_rate × 5) - ((avg_severity - 5) / 2)`. Score 6.5/10 semble optimiste comparé aux autres.

---

### 🔵 Haiku 4.5 — Le Statisticien Précis

Haiku produit les **statistiques les plus précises** : temps moyen INFO à 56.29ms, WARN à 4124.55ms, ERROR à 84.53ms. *"Les WARN sont 73× plus lentes que les INFO. Les erreurs sont RAPIDES = le service refuse vite."*

---

### 🟢 Gemini Flash — Le Tableur

Gemini Flash produit un **tableau par endpoint détaillé**. Error rate global 28.9% mais 100% sur paiement/inventaire/rapports.

---

### 🔵 Gemini Pro — L'Exécutif

Gemini Pro produit une **vue exécutive** avec Health Score explicite : **3.2/10**, 6 patterns d'erreur, recommandations P0/P1/P2.

---

### 🟢 Trinity 🆕 — Le Diagnosticien Rigoureux

Trinity produit un rapport **structuré et exhaustif** de 5,066 bytes avec **5 patterns d'erreur distincts**.

**Patterns identifiés :**

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

**Timeline d'incidents :**
```
08:02:30 - Premier paiement en erreur (NullPointerException)
08:06:00 - Circuit breaker s'ouvre (3 paiements 503 en rafale)
08:18:15 - Premier OOM (reports)
08:25:00 - Premier DB pool exhausted
08:40:00 - Troisième OOM + dernier DB pool exhausted
```

**Ce que ça dit sur le modèle :** Trinity est rigoureux et méthodique. Il ne se contente pas de compter les erreurs — il les catégorise par gravité, identifie les endpoints critiques à 100% d'échec, et fournit une timeline détaillée. Son rapport est le plus proche d'un vrai post-mortem SRE parmi les modèles gratuits.

**Limite notable :** Le health score 3/10 est cohérent avec les autres modèles, mais la formule de calcul n'est pas explicitée (contrairement à GPT-OSS-120b ou Haiku).

---

### 🔴 Nemotron-3 🆕 — Rate Limit

Aucun résultat. Toutes les tentatives ont échoué sur rate limit OpenRouter free.

## Verdict Analyse — Podium Commenté (12 modèles)

```
🥇 Hunter Alpha 🆓 → Lecture causale irremplaçable. "CB = symptôme de NPE"
🥈 Sonnet 4.6      → Vue par endpoint + P0/P1/P2. Le plus opérationnel
🥉 Haiku 4.5       → Stats les plus précises (56.29ms/4124.55ms/84.53ms)
4e GPT-OSS-120b 🆓 → Formule scoring reproductible
5e k2p5            → OOM à 10/10 — priorité risque JVM
6e Trinity 🆕 🆓   → 5 patterns, timeline, endpoints à 100% échec. Solide
7e Gemini Pro 💰   → Vue exécutive avec health score 3.2/10
8e Step-3.5 Flash 🆓→ Lecture cascade correcte
9e Gemini Flash 💰 → Tableau endpoint détaillé
10e Healer Alpha 🆓 → Pédagogie moyenne/médiane
11e GPT-5.4        → P95 intéressant mais comptage faux (52 vs 45)
❌ Nemotron-3 🆓   → Rate limit. DNF.
```

---

# 🌐 TÂCHE 3 — Recherche Web : FTS5 vs Elasticsearch

## Résultats Bruts

| Modèle | Volume | Latence FTS5 | Latence ES | Seuil bascule | Coût ES | Reco Pneu-Tracker |
|--------|--------|-------------|-----------|---------------|---------|-------------------|
| Healer Alpha 🆓 | ~7 600c | non chiffré | non chiffré | < 500K docs | — | non explicite |
| Sonnet 4.6 💰 | ~9 100c | non chiffré | non chiffré | non chiffré | — | non |
| GPT-5.4 💰 | ~10 500c | non chiffré | non chiffré | non chiffré | — | non |
| Hunter Alpha 🆓 | ~8 900c | 840 req/s | N/A | < 500K docs | — | ✅ Pneu-Tracker |
| k2p5 💰 | ~8 400c | 100× plus rapide | baseline | **1-5M docs** | — | ✅ partiel |
| Step-3.5 Flash 🆓 | ~8 000c | **1-5ms** | **10-30ms** | ~1M docs | 15-30€ | ✅ architecture |
| GPT-OSS-120b 🆓 | ❌ Échec | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Haiku 4.5** 💰 | **~31 500c** | **5-12ms** | **20-50ms** | **2M docs** | **45-90€** | ✅ complet + migration |
| Gemini Flash 💰 | ~16 500c | **<10ms** | **20-100ms** | **1M docs** | **50-200€** | ✅ recommandé |
| Gemini Pro 💰 | ~12 500c | **1-10ms** | **10-50ms** | **100K-1M docs** | **20-100€** | ✅ migration plan |
| **Trinity** 🆕 🆓 | **~10 800c** | **<1ms** | **5-10ms** | **100K+ docs** | **—** | ✅ FTS5 recommandé |
| Nemotron-3 🆕 🆓 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Praticien Concis

Healer va droit au but avec ~7600 caractères. Sa phrase d'ouverture résume parfaitement l'enjeu : *"La question n'est plus 'ES est-il plus puissant ?' (oui), mais 'est-ce que j'ai besoin de cette puissance ?'"*

---

### 🔵 Sonnet 4.6 — L'Encyclopédiste

Sonnet fournit le tableau comparatif le plus détaillé avec 5 types de requêtes. Il explique l'architecture de Lucene mieux que les autres.

---

### 🟡 GPT-5.4 — L'Honnête Méthodologue

GPT produit le document le plus long (~10 500 caractères) mais son vrai apport est son **honnêteté intellectuelle** : il reconnaît explicitement qu'il n'a pas trouvé de benchmarks "apples-to-apples".

---

### 🟠 Hunter Alpha — L'Applicable

Hunter **contextualise directement pour Pneu-Tracker** : *"Dataset probablement < 100K → FTS5 est le choix évident. Zéro infra ajoutée."*

---

### 🟣 k2p5 — Le Précis

k2p5 fournit le **seuil de bascule le plus précis** : 1-5M documents. Son benchmark chiffré (100× moins de latence pour FTS5) est le plus cité.

---

### 🔵 Step-3.5 Flash — L'Architecte Pratique

Step-3.5 Flash fournit des benchmarks précis : 1-5ms FTS5 vs 10-30ms ES. *"12 500 refs = 1.25% du seuil performance. FTS5 trivial."*

---

### 🟣 GPT-OSS-120b — Échec Total

GPT-OSS-120b est **inutilisable sur cette tâche**. Sur 4 tentatives, le modèle a soit retourné 0 token, soit listé les fichiers `node_modules` au lieu d'écrire une analyse.

---

### 🔵 Haiku 4.5 — Le Plus Complet de Tous

Haiku produit **31 888 caractères, 1000 lignes**. Formule BM25 avec paramètres exacts, benchmarks chiffrés, plan de migration 5 phases. *"12 500 refs = 1.25% du seuil critique. 160× de marge."*

---

### 🟢 Gemini Flash — Le Pragmatique

Gemini Flash produit un rapport de **~16 500 caractères** avec architecture en diagrammes ASCII, benchmarks chiffrés et **recommandation explicite** : *"SQLite FTS5 est la solution recommandée pour Pneu-Tracker"*.

---

### 🔵 Gemini Pro — L'Architecte

Gemini Pro produit un rapport de **~12 500 caractères** avec **plan de migration en 4 phases** et estimation de downtime (2-4 heures).

---

### 🟢 Trinity 🆕 — Le Consultant Méthodique

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
- Migrer vers ES : > 1M documents, > 100 req/s

**Plan de migration en 4 phases :**
1. **Phase 1 — Dual-write** : Écrire dans SQLite ET ES en parallèle
2. **Phase 2 — Shadow reads** : Lire de FTS5, comparer avec ES (validation)
3. **Phase 3 — Basculer** : Router les reads vers ES, garder FTS5 comme backup
4. **Phase 4 — Nettoyer** : Supprimer FTS5 une fois la confiance établie

**Ce que ça dit sur le modèle :** Trinity produit un rapport qui ressemble à un vrai document de consulting. Architecture comparée, benchmarks chiffrés, plan de migration phasé — tout y est. C'est le type de rapport qu'un tech lead pourrait présenter à sa direction pour justifier une décision technique.

**Limite notable :** Les benchmarks sont plus génériques que ceux de Haiku (qui fournit des chiffres Pneu-Tracker spécifiques). Pas d'estimation de coût ES.

---

### 🔴 Nemotron-3 🆕 — Rate Limit

Aucun résultat.

## Verdict Recherche — Podium Commenté (12 modèles)

```
🥇 Haiku 4.5       → 31.5KB, seuil 2M docs, 160× marge, coût 45-90€, plan 5 phases
🥈 k2p5            → Seuil 1-5M docs + benchmark 100×
🥉 Hunter Alpha 🆓 → Application directe au projet Pneu-Tracker
4e Step-3.5 Flash 🆓→ Architecture solide + plan 8 étapes
5e Gemini Flash 💰 → 16.5KB, <10ms vs 20-100ms, recommandation explicite
6e Trinity 🆕 🆓   → 10.8KB, benchmarks chiffrés, plan 4 phases. Solide
7e Gemini Pro 💰   → 12.5KB, plan migration 4 phases, downtime 2-4h
8e Sonnet 4.6      → Le plus exhaustif pour un architecte
9e GPT-5.4         → Le plus honnête sur les limites de ses sources
10e Healer Alpha 🆓 → Concis et correct mais sans profondeur
N/A GPT-OSS-120b 🆓→ ❌ Échec × 4
❌ Nemotron-3 🆓   → Rate limit. DNF.
```

---

# 🏆 VERDICT FINAL — 12 Modèles

## Tableau de Synthèse Complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35 | GPT-OSS | Haiku | GemFlash | GemPro | Trinity | Nemotron |
|---------|--------|--------|-----|--------|------|--------|---------|-------|----------|--------|---------|----------|
| Code — Architecture | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Code — Tests | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| Code — Features | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Analyse — Rigueur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Analyse — Insight | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Analyse — Action | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Recherche — Profondeur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Recherche — Applicabilité | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| Adaptation contexte | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Consistance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| **TOTAL /50** | **33** | **47** | **30** | **44** | **45** | **41** | **34** | **49** | **41** | **40** | **44** | **0** |

## Classement Final (12 modèles)

```
🥇 Haiku 4.5 (49/50)
   RB Tree + verify() + 42 tests + stats précises + 31.5KB recherche
   Le modèle le plus complet sur les 3 tâches

🥈 Sonnet 4.6 (47/50)
   Excellence technique pure, architecture RB irréprochable

🥉 k2p5 (45/50)
   Équilibre constant, adaptation contexte, docs français

4e Hunter Alpha 🆓 (44/50)
   Meilleur gratuit original, analyse causale irremplaçable

4e Trinity 🆕 🆓 (44/50) ← EX-ÆQUO
   30 tests + benchmarks + analyse rigoureuse + recherche structurée
   Meilleur nouveau modèle gratuit. Rivalise avec les payants.

6e Step-3.5 Flash 🆓 (41/50)
   Excellence gratuite, 3/3 tâches réussies

7e Gemini Flash 💰 (41/50)
   Solide sur les 3 tâches mais au niveau des gratuits

8e Gemini Pro 💰 (40/50)
   Corrects résultats mais manque de profondeur

9e GPT-OSS-120b 🆓 (34/50)
   Spécialiste code (57 tests!), inutilisable recherche

10e Healer Alpha 🆓 (33/50)
   Architecture fragile mais tests solides

11e GPT-5.4 (30/50)
   Seul payant derrière des gratuits

❌ Nemotron-3 🆓 (0/50 — DNF)
   Rate limit systématique. Inutilisable malgré 120B params.
```

---

## 💡 Méta-Enseignements du Benchmark v9 (avec Trinity + Nemotron-3)

1. **Trinity = meilleure surprise du v9** — Un modèle gratuit qui score 44/50, à égalité avec Hunter Alpha. 30 tests, benchmarks de performance, analyse SRE structurée, rapport de consulting technique. C'est le modèle gratuit le plus complet depuis Hunter Alpha.

2. **Nemotron-3 = le piège des gros modèles free** — 120B paramètres (12B actifs via MoE) mais rate limit systématique sur OpenRouter free. La puissance théorique ne garantit pas l'exécution. C'est le même problème que les Ollama 3B : inutilisable en pratique.

3. **Le top 4 gratuit est maintenant serré** — Hunter Alpha (44) = Trinity (44) > Step-3.5 Flash (41). Le paysage des modèles gratuits s'est considérablement amélioré — deux modèles free rivalisent maintenant avec k2p5 (payant, 45) et surpasse Gemini Flash/Pro (payants).

4. **Rate limit = score zéro (et c'est juste)** — Un modèle qui ne peut pas exécuter la tâche mérite 0/50, peu importe sa puissance théorique. Nemotron-3 a beau être un 120B, s'il rate limit systématiquement, il est inutile pour un benchmark pratique.

5. **Le coût ne prédit toujours pas la qualité** — Dans le classement global : 4 gratuits (Hunter, Trinity, Step-3.5, GPT-OSS) battent 3 payants (Gemini Flash, Gemini Pro, GPT-5.4). Le meilleur rapport qualité/prix reste **Trinity** (gratuit, 44/50).

---

## 📋 Recommandations d'Usage (mise à jour v9)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** | verify() + 42 tests |
| Excellence technique | **Sonnet 4.6** | Architecture RB pure |
| Budget zéro complet | **Trinity** 🆕 🆓 | 44/50, 30 tests, analyse SRE, consulting |
| Analyse causale | **Hunter Alpha** 🆓 | Cause/symptôme, gratuit |
| Adaptation contexte | **k2p5** | Docs français, précis |
| Budget zéro polyvalent | **Step-3.5 Flash** 🆓 | 41/50, 100% gratuit |
| Tests exhaustifs | **GPT-OSS-120b** 🆓 | 57 tests (code seulement) |
| **Éviter** | **Nemotron-3** 🆓 | Rate limit, DNF |
| **Éviter** | **GPT-5.4** | 30/50, derrière 4 gratuits |

---

*v9 — Benchmark à 12 modèles — 2026-03-15 18:45 Paris*
*2 nouveaux modèles : Trinity (44/50) 🆕, Nemotron-3 (DNF) 🆕*
