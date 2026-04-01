# 🔬 Benchmark LLM — Analyse Comparative Complète 26 Modèles (README-v17)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (MiniMax-M2.7, MiniMax-M2.7-highspeed) · 2026-03-29 (MiMo v2 Omni, MiMo v2 Pro, GLM-4.5-Air, GLM-4.7, GLM-4.7-Flash, GLM-5, GLM-5-Turbo, Qwen3.6-plus) · 2026-03-31 (Step-3.5-Flash payant) · 2026-04-01 (**GLM-5.1**)
>
> Cette version **v17** ajoute le modèle **`zai/glm-5.1`** — la nouvelle itération de Z-AI qui succède à GLM-5. Un modèle qui confirme la montée en puissance de la famille z.ai : propre, rigoureux, chiffré, sans fioritures.

---

## Les 26 concurrents

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
| `openrouter/arcee-ai/trinity-large-preview:free` | **Trinity** | Arcee AI | 🆓 Gratuit |
| `openrouter/nvidia/nemotron-3-super-120b-a12b:free` | **Nemotron-3** | NVIDIA | 🆓 Gratuit |
| `minimax/MiniMax-M2.5` | **MiniMax-M2.5** | MiniMax | 💰 Payant |
| `minimax/MiniMax-M2.5-highspeed` | **MiniMax-M2.5-highspeed** | MiniMax | 💰 Payant |
| `minimax/MiniMax-M2.7` | **MiniMax-M2.7** | MiniMax | 💰 Payant |
| `minimax/MiniMax-M2.7-highspeed` | **MiniMax-M2.7-highspeed** | MiniMax | 💰 Payant |
| `openrouter/xiaomi/mimo-v2-omni` | **MiMo v2 Omni** | Xiaomi | 💰 Payant |
| `openrouter/xiaomi/mimo-v2-pro` | **MiMo v2 Pro** | Xiaomi | 💰 Payant |
| `openrouter/z-ai/glm-4.5-air:free` | **GLM-4.5-Air** | Z-AI | 🆓 Gratuit |
| `openrouter/z-ai/glm-4.7` | **GLM-4.7** | Z-AI | 💰 Payant |
| `openrouter/z-ai/glm-4.7-flash` | **GLM-4.7-Flash** | Z-AI | 💰 Payant |
| `openrouter/z-ai/glm-5` | **GLM-5** | Z-AI | 💰 Payant |
| `openrouter/z-ai/glm-5-turbo` | **GLM-5-Turbo** | Z-AI | 💰 Payant |
| `openrouter/qwen/qwen3.6-plus-preview:free` | **Qwen3.6-plus** | Alibaba / OpenRouter | 🆓 Gratuit |
| `openrouter/stepfun/step-3.5-flash` | **Step-3.5-Flash (payant)** | StepFun | 💰 Payant |
| `zai/glm-5.1` 🆕 | **GLM-5.1** | Z-AI | 💰 Payant |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats bruts

| Modèle | Architecture | Lignes impl. | Lignes tests | Tests | Feature bonus |
|--------|-------------|-------------:|-------------:|------:|---------------|
| Healer Alpha | BST augmenté | 192 | 274 | 18 | — |
| Sonnet 4.6 | Red-Black Tree | 438 | 229 | 15 | `queryInterval()` |
| GPT-5.4 | AVL Tree | 242 | 151 | 13 | — |
| Hunter Alpha | Red-Black BST (LLRB) | 238 | 206 | 15 | — |
| k2p5 | AVL Tree | 364 | 282 | 12+ | `searchInterval()` |
| Step-3.5 Flash (free) | AVL Tree | 281 | 267 | 12 | `searchOverlap()` |
| GPT-OSS-120b | AVL Tree | ~250 | ~400 | 57 | `toArray()`, pruning |
| Haiku 4.5 | Red-Black Tree | 556 | 622 | 42 | `verify()`, floats, négatifs |
| Gemini Flash | AVL Tree | 210 | 110 | 8 | — |
| Gemini Pro | AVL Tree | 227 | 98 | 7 | — |
| Trinity | AVL augmenté | 318 | 466 | 30 | benchmarks, stress, utils |
| Nemotron-3 | ❌ | — | — | — | DNF |
| MiniMax-M2.5 | BST à point médian | 210 | 152 | 18 | — |
| MiniMax-M2.5-highspeed | AVL augmenté | 326 | 214 | 21 | helpers + stress |
| MiniMax-M2.7 | AVL Tree | 223 | 142 | 16 | `height()`, `balance()` |
| MiniMax-M2.7-highspeed | AVL + métriques | 184 | 209 | 25 | `size`, `isEmpty()` |
| MiMo v2 Omni | Treap + `maxHigh` | 265 | 263 | 18 blocs / 41 assertions | stress 1000+, floats |
| MiMo v2 Pro | AVL + `maxHigh` | 231 | 171 | 15 | stress 500, `toArray()` |
| GLM-4.5-Air | ❌ | — | — | — | DNF |
| GLM-4.7 | Red-Black IntervalTree | 524 | 654 | 50 | `bigint`, framework custom |
| GLM-4.7-Flash | BST augmenté générique | 299 | 337 | 29 | `findByStart`, `findByEnd`, `getAll()` |
| GLM-5 | AVL-balanced IntervalTree | 309 | 278 | 31 | `searchInterval()`, normalisation |
| GLM-5-Turbo | Centered / BST augmenté | 128 | 107 | 13 | comparator custom, bulk insert |
| Qwen3.6-plus | AVL augmenté par `maxEnd` | ~200 | ~180 | 15 (15/15 ✅) | `isEmpty`, stress 1000, intervalles invalides |
| Step-3.5-Flash (payant) | ❌ TIMEOUT | — | — | — | DNF |
| **GLM-5.1** 🆕 | **AVL-balanced + `maxHigh` pruning** | **185** | **120** | **10** | `size`, validation `low > high`, stress 10K, négatifs, doublons |

## Analyse et commentaires — GLM-5.1 🆕

### 🔵 GLM-5.1 — L'AVL compact et chirurgicale

GLM-5.1 délivre exactement ce qu'on attend d'un modèle qui a compris la spec : un **AVL Tree augmenté avec `maxHigh`** pour le pruning, propre, typé, commenté, avec **185 lignes d'implémentation** et **120 lignes de tests**. C'est l'une des implémentations les plus **compactes et denses** du benchmark.

Là où GLM-5 (309 lignes) ou GLM-4.7 (524 lignes) cherchaient à démontrer leur ampleur, GLM-5.1 fait un truc plus rare : **il fait exactement ce qu'il faut, ni plus ni moins**. Chaque méthode a sa place, chaque helper sert, pas de gras inutile.

Les **10 tests Vitest** couvrent les bases solides : insert/search, boundary checks, overlapping, remove (found + not found), intervalles négatifs, doublons, validation `low > high` (RangeError), stress test à **10 000 inserts**, et cas limites sur arbre vide. Le stress test à 10K est un vrai signal — il vérifie non seulement l'insertion mais aussi le remove massif (un sur deux) et la cohérence du `size`.

Le pruning via `maxHigh` est bien implémenté dans `searchNode` : si le max high du sous-arbre est inférieur au point cherché, on élague. Et si `point < n.low`, on skippe le sous-arbre droit. C'est efficace, c'est classique, et c'est fait sans fanfaronnade.

**Ce qui manque** : pas de `toArray()`, pas de méthode `verify()` (comme Haiku), pas de support des flottants explicite, pas de benchmark intégré (comme Trinity). C'est un modèle **sérieux mais pas démonstratif**. Il livre du code de production, pas une librairie open-source.

**Comparaison GLM-5 vs GLM-5.1** : là où GLM-5 était plus verbeux (309 lignes) avec `searchInterval()` en bonus et 31 tests, GLM-5.1 est plus resserré (185 lignes) avec seulement 10 tests mais un stress test plus ambitieux (10K vs aucune mention chez GLM-5). Le 5.1 est **plus compact et plus pratique** ; le 5.0 était **plus démonstratif**.

---

## Verdict code — top 26 modèles

```
🥇 Haiku 4.5              → toujours monstrueux en robustesse globale
🥈 GLM-4.7                → Red-Black Tree massif, 50 tests, grosse démonstration
🥉 GLM-5                  → AVL premium très équilibré
4e Sonnet 4.6             → pureté technique et élégance d'implémentation
5e MiMo v2 Omni           → Treap original, vraie personnalité technique
6e MiniMax-M2.5-highspeed → premium compact très abouti
7e MiniMax-M2.7-highspeed → ratio qualité/lignes excellent
8e Trinity 🆓             → gratuit ultra-sérieux
9e GLM-4.7-Flash          → meilleur que prévu
10e GPT-OSS-120b 🆓       → énorme couverture sur tâche bornée
11e MiMo v2 Pro           → propre, robuste
12e Hunter Alpha 🆓       → compact, fiable
13e k2p5                  → pragmatique mature
14e Qwen3.6-plus 🆓       → AVL rigoureux, 15/15, propre et fiable
15e GLM-5.1 🆕            → AVL compact, 10 tests, stress 10K, chirurgical
16e GLM-5-Turbo           → compact, propre, peu ambitieux
17e MiniMax-M2.5          → classique et fiable
18e MiniMax-M2.7          → sérieux sans surprise
19e Step-3.5 Flash (free) 🆓 → bon gratuit pragmatique
20e Healer Alpha 🆓       → bonne valeur de prototypage
21e GPT-5.4               → sérieux mais sans relief
22e Gemini Flash 💰       → standard
23e Gemini Pro 💰         → standard un peu plus sage
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air            → DNF
❌ Step-3.5-Flash (payant) → TIMEOUT
```

---

# 🔍 TÂCHE 2 — Analyse de logs serveur

## Résultats bruts

| Modèle | Requêtes | Taux erreur | Patterns | Score | Style |
|--------|----------|-------------|----------|------:|-------|
| Healer Alpha | 45 | 40.0% | 6 | ~4/10 | médical |
| Sonnet 4.6 | 45 | 31.1% | 5 | 3.5/10 | architecte |
| GPT-5.4 | 52 ❌ | 40.4% | 5 | ~4/10 | analyste |
| Hunter Alpha | 49 ❌ | 42.9% | 6 | ~3/10 | causal |
| k2p5 | 45 | 44.4% | 5 | ~3/10 | risque |
| Step-3.5 Flash (free) | 45 | 37.8% | 5 | 2/10 | systémique |
| Step-3.5-Flash (payant) | 45 | 19.5% | 3 | 8/10 | analyste SRE |
| GPT-OSS-120b | 45 | 35.6% | 5 | 6.5/10 | quantitatif |
| Haiku 4.5 | 45 | 37.78% | 5 | 2.5/10 | statisticien |
| Gemini Flash | 45 | 28.9% | 5 | ~3/10 | tableau |
| Gemini Pro | 45 | 40.0% | 6 | 3.2/10 | exécutif |
| Trinity | 45 | 42.2% | 5 | 3/10 | rigoureux |
| Nemotron-3 | ❌ | — | — | — | DNF |
| MiniMax-M2.5 | 45 | cohérent | 5+ | 8/10 | structuré |
| MiniMax-M2.5-highspeed | 45 | cohérent | 7 | 8/10 | P1/P2/P3 |
| MiniMax-M2.7 | ~50 | ~58% | 5 | 9/10 | forensic |
| MiniMax-M2.7-highspeed | ~43 | ~58% | 8 | 9/10 | disponibilité |
| MiMo v2 Omni | 38 | 47.4% | 5 | 7/10 | incident report |
| MiMo v2 Pro | 40 | 30% 5xx + 22.5% warnings | 5 | 8/10 | SRE propre |
| GLM-4.5-Air | ❌ | — | — | — | DNF |
| GLM-4.7 | ~42 | fort | 6 | 9/10 | complet + Java/YAML/SQL |
| GLM-4.7-Flash | ~43 | fort | 7 | 7/10 | complet mais moins conforme |
| GLM-5 | ~35-42 | fort | 6 | 9/10 | priorisé, propre |
| GLM-5-Turbo | 42 | 43% | 6 | 8/10 | synthèse actionnable |
| Qwen3.6-plus | 41 | 19.5% | 3 | 8/10 | structuré P0/P1/P2 |
| **GLM-5.1** 🆕 | **44** ✅ | **40.9%** | **6** | **9/10** | SRE structuré, timeline, P0/P1/P2 |

## Analyse et commentaires — GLM-5.1 🆕

### 🔵 GLM-5.1 — Le SRE qui a tout compris à l'incident

GLM-5.1 livre ici une **copie de très haut niveau** sur l'analyse de logs. Et putain, c'est précisément le genre de tâche où un bon modèle doit montrer qu'il ne compte pas juste les lignes, mais qu'il **comprend la dynamique de dégradation d'un système**.

**44 requêtes** comptées (correct ✅), **40.9% de taux d'erreur** (18/44), **22.7% de warnings**. Le tableau récapitulatif est propre et immédiatement exploitable. Mais le vrai plus, c'est la **classification des causes racines** :

- **4 causes P0** clairement séparées : NPE PaymentService (6 occurrences), Circuit Breaker (5), OOM reports (3), DB pool exhausted (3)
- **2 causes P2** : ConstraintViolation duplicate key (2) et lenteurs généralisées (10)
- Chaque cause a ses horaires exacts, sa fréquence, son impact et sa cause racine probable

La **timeline de dégradation** est excellente. Pas juste une liste chronologique — une vraie lecture en phases : nominale → premiers crashes → circuit breaker triggered → lenteurs cascade → OOM → triple échec. On sent le modèle qui visualise l'incident comme un **processus dynamique**, pas comme une collection d'erreurs isolées.

Le tableau d'**actions prioritaires** est complet et actionnable : 3 P0 en parallèle (fix NPE, augmenter heap JVM, investiguer pool DB), 2 P1 (optimiser search, ajouter idempotence orders), 2 P2 (monitorer circuit breaker, auditer N+1 queries).

**Comparaison GLM-5 vs GLM-5.1 sur logs** : Les deux sont à 9/10, mais le 5.1 est **plus structuré et plus lisible**. Là où GLM-5 était excellent mais parfois verbeux, le 5.1 va droit au but avec des tableaux propres et une timeline visuelle. Le 5.1 confirme la progression : z.ai affine ce qui marchait déjà.

**Ce qui le distingue des meilleurs** : Il n'a pas l'instinct causal unicum de Hunter Alpha (qui sépare les causes des symptômes comme personne), mais il compense par une **structuration SRE de niveau professionnel**. C'est le rapport que tu peux envoyer à un CTO sans avoir honte.

---

## Verdict analyse — top 26 modèles

```
🥇 Hunter Alpha 🆓        → instinct causal unique, irremplaçable
🥈 GLM-5.1 🆕             → SRE structuré parfait, timeline excellente, P0/P1/P2 net
🥉 GLM-4.7                → énorme copie SRE, très structurée
4e GLM-5                  → très mature, net, exploitable
5e MiniMax-M2.7           → forensic structuré, SQL complet
6e Step-3.5-Flash (payant) → analyste SRE excellent, priorisé
7e MiniMax-M2.7-highspeed → disponibilité + métriques santé
8e Sonnet 4.6             → pensée d'architecte, très solide
9e GLM-5-Turbo            → bonne synthèse actionnable
10e MiMo v2 Pro           → meilleur Xiaomi sur logs
11e Qwen3.6-plus 🆓       → P0/P1/P2 net, bien chiffré
12e k2p5                  → lecture risque / continuité
13e Trinity 🆓            → rigoureux et partageable
14e MiniMax-M2.5-highspeed → benchmark-ready
15e GLM-4.7-Flash         → fond bon, forme moins propre
16e Step-3.5 Flash (free) 🆓 → systémique et propre
17e MiniMax-M2.5          → solide mais plus générique
18e MiniMax-M2.7          → sérieux sans surprise
19e Gemini Pro 💰         → exécutif et lisible
20e Gemini Flash 💰       → tableau propre, moins profond
21e Healer Alpha 🆓       → pédagogique, moins exact
22e GPT-OSS-120b 🆓       → quantitatif séduisant, score optimiste
23e GPT-5.4               → bonne culture SRE, comptage faux
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air            → DNF
```

---

# 🌐 TÂCHE 3 — Recherche web : FTS5 vs Elasticsearch

## Résultats bruts

| Modèle | Signal | Score |
|--------|--------|------:|
| Healer Alpha | général, léger | ~6 |
| Sonnet 4.6 | architecte profond | 8 |
| GPT-5.4 | honnête, peu tranché | 6 |
| Hunter Alpha | contextualisé terrain | 9 |
| k2p5 | seuil 1–5M docs | 9 |
| Step-3.5-Flash (free) | très bon gratuit | 8 |
| GPT-OSS-120b | échec | 0 |
| Haiku 4.5 | le plus complet | 10 |
| Gemini Flash | pragmatique | 8 |
| Gemini Pro | sage | 7 |
| Trinity | consultant gratuit | 8 |
| Nemotron-3 | DNF | 0 |
| MiniMax-M2.5 | structuré | 7 |
| MiniMax-M2.5-highspeed | propre | 8 |
| MiniMax-M2.7 | méthodique | 8 |
| MiniMax-M2.7-highspeed | très décisionnel | 9 |
| MiMo v2 Omni | consultant TCO | 7 |
| MiMo v2 Pro | décision nette | 8 |
| GLM-4.5-Air | DNF | 0 |
| GLM-4.7 | benchmarks réels + seuils précis | 9 |
| GLM-4.7-Flash | clair, chiffré, rentable | 8 |
| GLM-5 | sources multiples, arbre de décision | 9 |
| GLM-5-Turbo | FTS5-first cohérent | 7 |
| Qwen3.6-plus | chiffres précis, TCO | 9 |
| Step-3.5-Flash (payant) | le plus complet | 10 |
| **GLM-5.1** 🆕 | **benchmarks granulaires, SQL concret, architecture recommandée** | **9/10** |

## Analyse et commentaires — GLM-5.1 🆕

### 🔵 GLM-5.1 — L'architecte qui donne du SQL et des seuils précis

Sur la tâche FTS5 vs Elasticsearch, GLM-5.1 confirme son profil : **pratique, chiffré, actionnable**. Il ne fait pas dans la dissertation — il donne des tableaux de latence par volume (10K, 100K, 1M, 10M docs), des chiffres de throughput d'indexation, et des QPS comparés.

**Ce qui le distingue** :

1. **Benchmarks granulaires** : latence p50/p99 pour chaque volume, ce que peu de modèles font. À 100K docs : FTS5 p50 1-3ms vs ES p50 5-8ms. À 1M : FTS5 p50 10-30ms vs ES p50 8-15ms. Le croisement est clair : **ES devient plus rapide au-delà d'~1M documents**.

2. **SQL concret** : il fournit le `CREATE VIRTUAL TABLE`, la requête `MATCH` avec filtres, et les **triggers de sync auto**. C'est directement copiable dans un projet. Peu de modèles vont aussi loin dans l'implémentation concrète.

3. **Seuils de bascule clairs** : FTS5 OK jusqu'à 500K docs. Zone grise 500K-1M. ES au-delà de 1M. Et il explique pourquoi : complexité des requêtes, pas juste le volume.

4. **Architecture ASCII** : schéma d'architecture pour le cas 100K produits et le cas 1M+ produits. Simple, lisible, directement exploitable.

5. **Coûts chiffrés** : $0/an FTS5 vs $600-7,200/an ES. Setup 1-2 jours vs 3-5 jours. DevOps nécessaire ou non.

**Comparaison GLM-5 vs GLM-5.1 sur recherche** : Les deux sont à 9/10. GLM-5 avait un arbre de décision et des sources multiples. GLM-5.1 a des benchmarks p50/p99 plus granulaires et du SQL prêt à l'emploi. Le 5.1 est **plus pratique** ; le 5.0 était **plus riche en alternatives**.

**Ce qui lui manque pour un 10/10** : Pas de mention des alternatives (Meilisearch, Typesense, Algolia, PostgreSQL FTS) — ce que GLM-5 faisait. Et pas de sources/références explicites. Mais bon, il mentionne Meilisearch/Typesense/Algolia/PostgreSQL dans ses annexes, donc il y a presque.

---

## Verdict recherche — top 26 modèles

```
🥇 Step-3.5-Flash (payant) 💰 (10/10)
   La réponse d'architecture la plus complète du benchmark.
🥈 Haiku 4.5 (10/10)
   Le plus complet, chiffré, décisionnel.
🥉 GLM-4.7 (9/10)
   Excellent arbitrage, chiffres réels.
4e GLM-5 (9/10)
   Riche, sourcé, très mature.
5e GLM-5.1 🆕 (9/10)
   Benchmarks granulaires p50/p99, SQL concret, seuils nets.
6e k2p5 (9/10)
   Seuils mémorisables et utiles.
7e Hunter Alpha (9/10)
   Meilleure contextualisation terrain.
8e MiniMax-M2.7-highspeed (9/10)
   Excellent décideur récent.
9e Qwen3.6-plus (9/10)
   Chiffres solides, TCO, alternatives.
10e Sonnet 4.6 (8/10)
   Profond, un peu moins tranchant.
11e Trinity (8/10)
   Consulting gratuit solide.
12e MiniMax-M2.7 (8/10)
   Benchmarks sourcés, seuils clairs.
13e MiMo v2 Pro (8/10)
   Propre, exploitable.
14e Step-3.5-Flash (free) (8/10)
   Bon rapport qualité/prix.
15e GLM-4.7-Flash (8/10)
   Flash très rentable.
16e MiniMax-M2.5-highspeed (8/10)
   Propre et rapide.
17e Gemini Flash (8/10)
   Pragmatique et utile.
18e MiniMax-M2.5 (7/10)
   Bon modèle global.
19e GLM-5-Turbo (7/10)
   FTS5-first cohérent.
20e Gemini Pro (7/10)
   Sage mais moins impactant.
21e GPT-5.4 (6/10)
   Honnête mais peu décisionnel.
22e Healer Alpha (6/10)
   Utile mais léger.
23e MiMo v2 Omni (7/10)
   TCO utile, plus extrapolé.
❌ GPT-OSS-120b (0/10)
❌ Nemotron-3 (0/10 — DNF)
❌ GLM-4.5-Air (0/10 — DNF)
```

---

# 🏆 VERDICT FINAL — 26 modèles

## Tableau de synthèse complet

| Modèle | Code /10 | Logs /10 | Web /10 | Total /30 |
|--------|---------:|---------:|--------:|----------:|
| Haiku 4.5 | 10 | 8 | 10 | **28** |
| GLM-4.7 | 10 | 10 | 9 | **29** |
| GLM-5 | 9 | 10 | 9 | **28** |
| **GLM-5.1** 🆕 | **8** | **9** | **9** | **26** |
| Sonnet 4.6 | 9 | 9 | 8 | **26** |
| MiniMax-M2.7-highspeed | 9 | 9 | 9 | **27** |
| k2p5 | 8 | 9 | 9 | **26** |
| Trinity 🆓 | 8 | 9 | 8 | **25** |
| Hunter Alpha 🆓 | 8 | 10 | 9 | **27** |
| MiniMax-M2.5-highspeed | 9 | 8 | 8 | **25** |
| MiniMax-M2.7 | 8 | 9 | 8 | **25** |
| Qwen3.6-plus 🆓 | 8 | 8 | 9 | **25** |
| MiMo v2 Pro | 8 | 8 | 8 | **24** |
| Step-3.5-Flash (payant) | 7 | 8 | 10 | **25** |
| GLM-4.7-Flash | 7 | 7 | 8 | **22** |
| GLM-5-Turbo | 7 | 8 | 7 | **22** |
| Step-3.5 Flash (free) 🆓 | 7 | 2 | 8 | **17** |
| Healer Alpha 🆓 | 6 | 7 | 6 | **19** |
| GPT-OSS-120b 🆓 | 8 | 6 | 0 | **14** |
| GPT-5.4 | 6 | 5 | 6 | **17** |
| Gemini Flash | 5 | 5 | 8 | **18** |
| Gemini Pro | 5 | 5 | 7 | **17** |
| MiniMax-M2.5 | 7 | 7 | 7 | **21** |
| MiMo v2 Omni | 8 | 7 | 7 | **22** |
| Nemotron-3 🆓 | 0 | 0 | 0 | **0** |
| GLM-4.5-Air 🆓 | 0 | 0 | 0 | **0** |

## Classement final (26 modèles)

```
🥇 GLM-4.7 (29/30)
   La machine z.ai. Monstrueux en code (50 tests), excellent en logs, très bon en recherche.
   Le modèle le plus complet du benchmark sur les 3 tâches.

🥈 GLM-5 (28/30)
   Le premium z.ai le plus équilibré. Très mature partout.

🥈 Haiku 4.5 (28/30) ← EX-ÆQUO
   Le patron historique. Toujours imprenable en code.

🥈 Hunter Alpha 🆓 (27/30) ← EX-ÆQUO
   Le détective. Instinct causal irremplaçable sur les logs.

5e MiniMax-M2.7-highspeed (27/30)
   Premium compact très sérieux.

6e GLM-5.1 🆕 (26/30)
   Compact, chirurgical, actionnable. Le meilleur ratio densité/lignes de z.ai.

6e Sonnet 4.6 (26/30) ← EX-ÆQUO
   Excellence technique pure.

6e k2p5 (26/30) ← EX-ÆQUO
   L'équilibre premium.

9e Step-3.5-Flash (payant) 💰 (25/30)
   Excellence absolue sur FTS5/ES et logs, code correct (7/10). Très bon profil analyste/architecte.

9e Trinity 🆓 (25/30) ← EX-ÆQUO
   Le gratuit ultra-sérieux. Tient la comparaison avec les payants.

9e MiniMax-M2.5-highspeed (25/30) ← EX-ÆQUO
   Très bonne première génération MiniMax.

9e MiniMax-M2.7 (25/30) ← EX-ÆQUO
   Sérieux technique confirmé.

9e Qwen3.6-plus 🆓 (25/30) ← EX-ÆQUO
   Gratuit sérieux, fiable sur les 3 tâches.

14e MiMo v2 Pro (24/30)
   Propre, équilibré, sans surprise.

15e GLM-4.7-Flash (22/30)
   Flash solide, mais nettement sous les gros modèles z.ai.

15e MiMo v2 Omni (22/30) ← EX-ÆQUO
   Très bon en code, plus moyen ailleurs.

15e GLM-5-Turbo (22/30) ← EX-ÆQUO
   Compact, utile, moins premium.

18e MiniMax-M2.5 (21/30)
   Bon modèle global, plus classique.

19e Healer Alpha 🆓 (19/30)
   Bonne valeur de prototypage.

20e Gemini Flash (18/30)
   Bon partout, roi nulle part.

21e GPT-5.4 (17/30)
   Le payant qui souffre le plus de la comparaison.

21e Gemini Pro (17/30) ← EX-ÆQUO
   Trop sage pour son propre bien.

21e Step-3.5 Flash (free) 🆓 (17/30) ← EX-ÆQUO
   Bon rapport qualité/prix malgré le score logs bas.

24e GPT-OSS-120b 🆓 (14/30)
   Titan local sur code, fragile ailleurs.

❌ Nemotron-3 🆓 (0/30 — DNF)
❌ GLM-4.5-Air 🆓 (0/30 — DNF)
```

---

## 💡 Méta-enseignements du benchmark v17

### 1. GLM-5.1 confirme la montée en gamme de z.ai

GLM-5.1 est le **3e modèle z.ai dans le top 10** (après GLM-4.7 #1 et GLM-5 #2). Sa particularité : il n'a pas cherché à impressionner par le volume (comme GLM-4.7 et ses 50 tests / 524 lignes), mais par la **densité et l'utilisabilité**. 185 lignes d'implémentation, 10 tests ciblés, des réponses SRE immédiatement exploitables, du SQL concret pour FTS5. C'est un modèle de **productivité**, pas de démonstration.

### 2. La famille z.ai domine le benchmark

GLM-4.7 (29/30), GLM-5 (28/30), GLM-5.1 (26/30), GLM-4.7-Flash (22/30), GLM-5-Turbo (22/30). **Cinq modèles z.ai dans les 15 premiers**. Aucun autre provider n'a cette profondeur. Anthropic a Haiku + Sonnet (2 modèles dans le top). MiniMax en a 3. Mais z.ai a la couverture la plus large du benchmark, du monstre démonstratif (GLM-4.7) au compact chirurgical (GLM-5.1) en passant par l'équilibré premium (GLM-5).

### 3. GLM-5.1 vs GLM-5 : un pas de plus vers la maturité

La comparaison est intéressante car les deux modèles scorent différemment :
- **GLM-5** : 309 lignes, 31 tests, plus démonstratif → 28/30
- **GLM-5.1** : 185 lignes, 10 tests, plus ciblé → 26/30

GLM-5 gagne sur le score brut parce qu'il en fait plus. Mais GLM-5.1 est probablement **plus utilisable en production** : moins de code à maintenir, des tests plus ciblés, des réponses plus directes. C'est le choix du dev qui veut shipper, pas celui du dev qui veut benchmarker.

### 4. Le milieu de tableau reste ultra-dense

Entre 22 et 27 points, on a **14 modèles**. Le benchmark ne dit plus "il y a 2 bons et le reste est nul". Il dit : **il y a 14 modèles viables, chacun avec un profil distinct**. GLM-5.1 s'inscrit parfaitement dans cette logique de spécialisation : il ne sera pas ton choix pour une librairie open-source (Haiku) ou une démonstration technique (GLM-4.7), mais il sera peut-être ton choix pour **du code de production dense et des analyses SRE actionnables**.

### 5. Les anciens enseignements restent valides

- **Les modèles gratuits tiennent toujours la route** : Hunter Alpha (27/30), Trinity (25/30), Qwen3.6-plus (25/30) — trois gratuits dans le top 12.
- **Step-3.5-Flash payant reste un paradoxe** : 10/10 en recherche, 8/10 en logs, mais DNF en code.
- **GPT-5.4 continue de couler** : 17/30, dépassé par la plupart des modèles récents.
- **Nemotron-3 et GLM-4.5-Air restent des DNF** : zéro signal exploitable.

---

## 📋 Recommandations d'usage (mise à jour v17)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** ou **GLM-4.7** | robustesse maximale vs copie code monstrueuse |
| Code prod dense et maintenable | **GLM-5.1** 🆕 | compact, chirurgical, directement utilisable |
| Modèle premium équilibré | **GLM-5** | très bon partout, très sain |
| Analyste SRE structuré | **GLM-5.1** 🆕 ou **Hunter Alpha** 🆓 | structuration pro vs instinct causal |
| Architecture FTS5/ES | **Step-3.5-Flash (payant)** 💰 ou **GLM-5.1** 🆕 | le plus complet vs SQL concret |
| Excellence architecture | **Sonnet 4.6** | pensée d'ingénieur senior |
| Champion polyvalent récent | **MiniMax-M2.7-highspeed** | 27/30, excellent partout |
| Gratuit complet moderne | **Trinity** 🆓 ou **Qwen3.6-plus** 🆓 | 25/30 chacun, propres sur les 3 tâches |
| Analyse causale incident | **Hunter Alpha** 🆓 | cause racine > symptôme |
| Détective因果 unique | **Hunter Alpha** 🆓 | personne ne lit les causes comme lui |
| SQL concret + benchmarks | **GLM-5.1** 🆕 | donne du code copiable, pas de la théorie |
| Éviter | **GLM-4.5-Air**, **Nemotron-3** | DNF |
| Éviter pour code | **Step-3.5-Flash (payant)** 💰 | timeout systématique |

---

## 📊 Évolution des scores z.ai à travers le benchmark

| Modèle z.ai | Code | Logs | Web | Total | Rang |
|-------------|------|------|-----|-------|------|
| GLM-4.5-Air | DNF | DNF | DNF | 0/30 | — |
| GLM-4.7-Flash | 7 | 7 | 8 | 22/30 | 14e |
| GLM-5-Turbo | 7 | 8 | 7 | 22/30 | 14e |
| **GLM-5.1** 🆕 | **8** | **9** | **9** | **26/30** | **6e** |
| GLM-5 | 9 | 10 | 9 | 28/30 | 2e |
| GLM-4.7 | 10 | 10 | 9 | 29/30 | 1er |

**Observation** : GLM-5.1 se positionne clairement entre les modèles Flash/Turbo et les modèles premium (GLM-5, GLM-4.7). C'est le **sweet spot** de la gamme : plus abordable que GLM-4.7, plus complet que les versions Flash/Turbo. Un positionnement tarifaire/qualité intelligent.

---

## 🔮 Focus GLM-5.1 — Portrait robot du modèle

**Points forts :**
- 🔥 **Densité exceptionnelle** : chaque ligne sert, pas de gras
- 🔥 **SRE de niveau pro** : timeline de dégradation, P0/P1/P2, actions concrètes
- 🔥 **SQL prêt à l'emploi** : FTS5 avec triggers, requêtes, optimisations
- 🔥 **Stress testing ambitieux** : 10K inserts/removes en test

**Points faibles :**
- ⚠️ **Pas démonstratif** : pas de `verify()`, pas de benchmarks intégrés, pas de lib-like features
- ⚠️ **10 tests seulement** : suffisant pour la prod, pas suffisant pour un benchmark de couverture
- ⚠️ **Pas d'alternatives mentionnées en FTS5/ES** : se concentre sur le duel, ignore Meilisearch/Algolia/Typesense

**Profil idéal :** Dev senior qui veut du code propre et des analyses actionnables. Pas un show-off, pas un minimalist, un **pragmatique**.

---

*v17 — Benchmark à 26 modèles — ajout GLM-5.1 (26/30, 6e) — 2026-04-01 19:30 UTC*
