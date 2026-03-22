# 🔬 Benchmark LLM — Analyse Comparative Complète 16 Modèles (README-v11)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (**MiniMax-M2.7, MiniMax-M2.7-highspeed**)
> 
> Cette version **v11** étend le **v10** avec les nouveaux modèles **MiniMax-M2.7** et **MiniMax-M2.7-highspeed**, tout en conservant le niveau de détail narratif du v5 et la base comparative du v9/v10.

---

## Les 16 concurrents

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
| `minimax/MiniMax-M2.7` 🆕 | **MiniMax-M2.7** | MiniMax | 💰 Payant |
| `minimax/MiniMax-M2.7-highspeed` 🆕 | **MiniMax-M2.7-highspeed** | MiniMax | 💰 Payant |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats bruts

| Modèle | Architecture | Lignes impl. | Lignes tests | Tests | Feature bonus |
|--------|-------------|-------------:|-------------:|------:|---------------|
| Healer Alpha | BST augmenté | 192 | 274 | **18** | — |
| **Sonnet 4.6** | **Red-Black Tree** | 438 | 229 | 15 | `queryInterval()` |
| GPT-5.4 | AVL Tree | 242 | 151 | 13 | — |
| Hunter Alpha | Red-Black BST (LLRB) | 238 | 206 | 15 | — |
| k2p5 | AVL Tree | 364 | 282 | 12+ | `searchInterval()` |
| Step-3.5 Flash | AVL Tree | 281 | 267 | 12 | `searchOverlap()` |
| GPT-OSS-120b | AVL Tree | ~250* | ~400* | **57** | `toArray()`, pruning |
| **Haiku 4.5** | **Red-Black Tree** | **556** | **622** | 42 | `verify()`, floats, négatifs |
| Gemini Flash | AVL Tree | 210 | 110 | 8 | — |
| Gemini Pro | AVL Tree | 227 | 98 | 7 | — |
| **Trinity** | **AVL Tree augmenté** | **318** | **466** | **30** | benchmarks, stress, utils |
| Nemotron-3 | ❌ Rate limit | — | — | — | ❌ |
| MiniMax-M2.5 | BST à point médian | 210 | 152 | 18 | exécution 18/18 |
| MiniMax-M2.5-highspeed | AVL augmenté | 326 | 214 | 21 | `overlapsPoint`, `searchOverlap`, `inOrder`, `size`, stress test |
| **MiniMax-M2.7** 🆕 | **AVL Tree** | **223** | **142** | **16** | `height()`, `balance()` exposés |
| **MiniMax-M2.7-highspeed** 🆕 | **AVL avec métriques** | **184** | **209** | **25** | `size`, `isEmpty()`, validation stricte |

*\* Estimé — GPT-OSS-120b a fourni 57/57 tests sans détailler les lignes exactes*

## Analyse et commentaires — focus sur les nouveaux modèles MiniMax M2.7

### 🟡 MiniMax-M2.7 🆕 — L'AVL classique bien exécuté

MiniMax-M2.7 livre une **implémentation AVL Tree standard mais solide**. Avec 223 lignes d’implémentation et 142 lignes de tests répartis sur 16 tests, il ne cherche pas à révolutionner le genre, mais il assure sur les fondamentaux : équilibrage correct, rotations bien implémentées, gestion du `max` pour l’élagage.

Ce qui distingue cette version de la M2.5 standard, c’est le passage d’un BST simple à point médian à une **vraie structure équilibrée**. C’est un saut technique notable : là où la M2.5 prenait le risque de la dégénérescence, la M2.7 adopte la robustesse algorithmique. Les tests couvrent les cas classiques (insert, remove, search) avec une rigueur acceptable, même si la densité de tests reste inférieure à la M2.7-highspeed.

La limite de ce modèle, c’est qu’il reste dans une zone de confort. Pas de features bonus marquantes, pas de stress test, pas de métriques internes exposées. C’est un **bon élève sérieux**, pas un surdoué. Dans un contexte de production réelle, ce code tiendrait la route sans faire de vagues. Mais il ne surprend pas, n’anticipe pas les besoins futurs, et ne démontre pas cette capacité à penser l’API au-delà de la spec minimale.

---

### 🔵 MiniMax-M2.7-highspeed 🆕 — L'AVL pragmatique et mesuré

La version **highspeed** de la M2.7 est une **vraie réussite d’optimisation du rapport qualité/volume**. Avec seulement 184 lignes d’implémentation (moins que la M2.7 standard !), elle parvient à intégrer un `size` et une méthode `isEmpty()`, tout en proposant **25 tests** — soit 9 de plus que la version standard. C’est un modèle qui comprend que la **valeur ajoutée ne réside pas dans la masse de code, mais dans la pertinence des features et la densité de validation**.

L’architecture reste AVL, cohérente avec la série MiniMax, mais l’implémentation est plus épurée. L’ajout du tracking de taille (`_size` privé) et de la validation stricte des intervalles (throw sur start > end) montre une **conscience produit** que la M2.7 standard n’a pas. Ces détails semblent mineurs, mais ils font la différence entre un prototype jetable et une bibliothèque réutilisable.

Ce qui impressionne particulièrement, c’est le **ratio tests/lignes** : 209 lignes de tests pour 184 lignes d’implémentation, soit un ratio de 1.13. Seuls Haiku (1.12) et Trinity (1.46) font mieux dans ce benchmark. Pour un modèle “highspeed”, c’est une démonstration que vitesse ne signifie pas négligence. Au contraire, cette version semble avoir été optimisée pour la **clarté et la maintenabilité**, pas seulement pour la rapidité de génération.

Comparée à la M2.5-highspeed (21 tests), cette M2.7-highspeed progresse significativement. Elle confirme une tendance : chez MiniMax, les versions “highspeed” ne sont pas des versions allégées, ce sont souvent des versions **plus abouties**, où l’effort d’optimisation a été mis sur la qualité plutôt que sur la quantité.

## Verdict code — podium commenté (16 modèles)

```
🥇 Haiku 4.5          → 42 tests, verify(), couverture monstrueuse
🥈 Sonnet 4.6         → Red-Black Tree le plus propre techniquement
🥉 MiniMax-M2.5-highspeed → AVL augmenté, 21/21 tests, première génération
4e MiniMax-M2.7-highspeed 🆕 → AVL avec métriques, 25 tests, ratio qualité/lignes excellent
5e Trinity 🆓         → 30 tests, benchmarks, solidité gratuite exceptionnelle
6e GPT-OSS-120b 🆓    → 57 tests, machine locale de validation
7e Hunter Alpha 🆓    → compact, fiable, propre
8e k2p5              → bon sens d’implémentation + adaptation contexte
9e MiniMax-M2.5      → classique, propre, 18/18 verts
10e MiniMax-M2.7 🆕   → AVL solide, 16 tests, sérieux sans surprise
11e Step-3.5 Flash 🆓 → très bon gratuit de production
12e Healer Alpha 🆓   → couverture > sophistication
13e GPT-5.4           → sérieux mais sans relief
14e Gemini Flash 💰   → standard
15e Gemini Pro 💰     → standard un peu plus sage
❌ Nemotron-3 🆓      → DNF
```

---

# 🔍 TÂCHE 2 — Analyse de logs serveur

## Résultats bruts

| Modèle | Requêtes | Taux erreur | Patterns | Score santé / lecture | Style |
|--------|----------|-------------|----------|------------------------|-------|
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
| **Trinity** | 45 ✅ | **42.2%** | **5** | **3/10** | Diagnosticien rigoureux |
| Nemotron-3 | ❌ | — | — | — | ❌ Rate limit |
| MiniMax-M2.5 | 45 ✅ | cohérent | 5+ | **8/10** | Diagnostic structuré |
| MiniMax-M2.5-highspeed | 45 ✅ | cohérent | 7 | **8/10** | Chronologie + P1/P2/P3 |
| **MiniMax-M2.7** 🆕 | ~50 ✅ | **~58%** | **5 types d'erreurs** | **9/10** | **Forensic structuré avec SQL** |
| **MiniMax-M2.7-highspeed** 🆕 | ~43 ✅ | **~58%** | **8 types d'erreurs** | **9/10** | **Timeline précise + métriques santé** |

## Analyse et commentaires — focus sur les nouveaux modèles MiniMax M2.7

### 🟡 MiniMax-M2.7 🆕 — Le diagnosticien complet

MiniMax-M2.7 livre une **analyse de logs d'une qualité remarquable**, peut-être la meilleure surprise de cette tâche dans tout le benchmark v11. Avec 5 types d'erreurs distincts identifiés, des métriques précises (latences, occurrences, pourcentages), une timeline d'escalade détaillée et surtout un **arsenal SQL diagnostic complet**, ce modèle démontre une compréhension système rare chez les modèles de cette famille de prix.

Ce qui le distingue immédiatement, c'est la **structuration professionnelle**. L'analyse n'est pas une liste d'observations, c'est un rapport d'incident complet : symptômes visibles avec tableaux de métriques, causes priorisées de P0 à P2, timeline chronologique minute par minute, actions correctives avec code Java et SQL, et même une section de requêtes à exécuter immédiatement pour diagnostic à froid.

La profondeur technique est impressionnante. Le modèle ne se contente pas de dire “DB pool exhausted” — il fournit les requêtes SQL pour vérifier l'état du pool, identifier les connexions bloquantes, et même des pistes d'optimisation. Il ne signale pas juste “NPE PaymentService.java:142” — il propose le code Java corrigé avec null-check et gestion d'erreur.

La seule limite, minime, est une légère prudence sur la corrélation causale. Le lien entre OOM et pool exhaustion est suggéré mais pas formellement prouvé dans les logs seuls. Mais franchement, à ce niveau de fourniture, c'est pinailler. Cette analyse est **directement exploitable par une équipe SRE**.

---

### 🔵 MiniMax-M2.7-highspeed 🆕 — L'expert en disponibilité

La version **highspeed** de la M2.7 confirme et amplie les forces de la version standard. Elle ajoute une dimension **métrique de santé système** avec un tableau comparatif des seuils observés vs acceptables, et une granularité encore supérieure sur la classification des erreurs (8 types distincts contre 5 pour la M2.7 standard).

Ce qui caractérise cette analyse, c'est l'**obsession de la mesure**. Où la M2.7 standard donnait des latences anormales, la highspeed formalise : “Search latency (p95) : 6200 ms observé vs < 500 ms acceptable = 🔴 CRITIQUE”. Cette mise en forme est immédiatement actionnable par un dashboard d'alerting.

La timeline est encore plus précise, avec une granularité quasi-minute par minute et une escalade fonctionnelle claire : “08:02 → Dev (Paiement) : NPE PaymentService.java:142”, “08:06 → DevOps : CB OPEN, risque disponibilité paiement”. C'est du **runbook ready**.

Les actions correctives sont également plus nombreuses et plus détaillées : configuration Resilience4j pour le circuit breaker, création d'index SQL optimisés (avec `CONCURRENTLY` pour éviter le verrouillage), configuration HikariCP complète avec `leak-detection-threshold`, et même une stratégie d'idempotency-key pour les duplicate key.

Sur cette tâche, les deux modèles M2.7 sont **excellents**, avec une légère préférence pour la highspeed sur la précision métrique et l'actionnabilité immédiate. Le score de 9/10 est mérité pour les deux.

## Verdict analyse — podium commenté (16 modèles)

```
🥇 Hunter Alpha 🆓    → lecture causale irremplaçable
🥈 Sonnet 4.6         → pensée d'architecte, postmortem-ready
🥉 Haiku 4.5          → stats les plus précises et les plus intelligentes
4e MiniMax-M2.7 🆕    → forensic structuré, SQL complet, 9/10
5e MiniMax-M2.7-highspeed 🆕 → timeline précise, métriques santé, 9/10
6e k2p5              → lecture risque / continuité de service très forte
7e Trinity 🆓         → rapport de diagnostic gratuit ultra-solide
8e MiniMax-M2.5-highspeed → benchmark-ready, bien structuré
9e Step-3.5 Flash 🆓  → systémique et propre
10e MiniMax-M2.5     → solide mais plus générique
11e Gemini Pro 💰    → exécutif et lisible
12e Gemini Flash 💰  → tableau propre, moins profond
13e Healer Alpha 🆓  → très pédagogique, moins exact métriquement
14e GPT-OSS-120b 🆓  → quantitativement séduisant, score optimiste
15e GPT-5.4          → bonne culture SRE, comptage faux
❌ Nemotron-3 🆓     → DNF
```

---

# 🌐 TÂCHE 3 — Recherche web : FTS5 vs Elasticsearch

## Résultats bruts

| Modèle | Volume | Sources / benchmarks | Seuil bascule | Cas pratique / recommandation |
|--------|--------|----------------------|---------------|-------------------------------|
| Healer Alpha 🆓 | ~7 600c | migration 10-100× | < 500K docs | correct mais général |
| Sonnet 4.6 💰 | ~9 100c | tableau comparatif riche | non chiffré | exhaustif architecte |
| GPT-5.4 💰 | ~10 500c | honnêteté méthodo | non chiffré | peu tranché |
| Hunter Alpha 🆓 | ~8 900c | 840 req/s (7K docs) | < 500K docs | ✅ Pneu-Tracker |
| k2p5 💰 | ~8 400c | 100× plus rapide | **1-5M docs** | ✅ précis |
| Step-3.5 Flash 🆓 | ~8 000c | **1-5ms vs 10-30ms** | ~1M docs | ✅ architecture |
| GPT-OSS-120b 🆓 | ❌ Échec | ❌ | ❌ | ❌ |
| **Haiku 4.5** 💰 | **~31 500c** | **5-12ms vs 20-50ms** | **2M docs** | ✅ complet + migration |
| Gemini Flash 💰 | ~16 500c | **<10ms vs 20-100ms** | **1M docs** | ✅ recommandé |
| Gemini Pro 💰 | ~12 500c | **1-10ms vs 10-50ms** | **100K-1M docs** | ✅ migration plan |
| **Trinity** 🆓 | **~10 800c** | **<1ms vs 5-10ms** | **100K+ docs** | ✅ FTS5 recommandé |
| Nemotron-3 🆓 | ❌ | ❌ | ❌ | ❌ |
| MiniMax-M2.5 | structuré | comparatif coût/complexité/perf | non précis | ✅ FTS5 majoritaire |
| MiniMax-M2.5-highspeed | structuré + seuils | tableau comparatif propre | implicite / semi-chiffré | ✅ FTS5 pour app classique |
| **MiniMax-M2.7** 🆕 | **~12 000c** | **benchmarks Reddit + SQLite Forum** | **< 500K docs** | ✅ seuils chiffrés clairs |
| **MiniMax-M2.7-highspeed** 🆕 | **~10 000c** | **latence 80-150ms → < 5ms** | **< 100K-500K docs** | ✅ recommandation nette |

## Analyse et commentaires — focus sur les nouveaux modèles MiniMax M2.7

### 🟡 MiniMax-M2.7 🆕 — Le chiffreur méthodique

MiniMax-M2.7 livre une **recherche web structurée et chiffrée**, avec une vraie culture des benchmarks existants et des retours terrain. Sa force première est l'**ancrage dans des sources concrètes** : benchmark Postgres FTS vs Elasticsearch v8 (2026), benchmark Gigasearch sur Wikipedia (2021), et retours d'expérience Reddit / SQLite Forum (2023–2025).

Ce qui distingue cette réponse, c'est la **grille de seuils claire** : < 100K docs (très OK), 100K–500K (compétitif), > 500K (dégradation sur ORDER BY rank). Ces chiffres sont immédiatement utilisables pour une décision d'architecture. Le modèle ne se contente pas de dire “FTS5 suffit souvent” — il dit **quand exactement** ça suffit, et quand ça commence à coincer.

Les cas d'usage typiques sont bien calibrés : moteur de blog/CMS (< 50K), catalogue e-commerce (< 200K), base de connaissances, notes personnelles. C'est une **lecture pragmatique du terrain**, pas une dissertation abstraite.

La section “commandes de diagnostic rapide” est un bonus utile, même si moins développé que sur la tâche d'analyse de logs. La recommandation finale est nette : “FTS5 est amplement suffisant dans la majorité des cas”.

---

### 🔵 MiniMax-M2.7-highspeed 🆕 — Le décideur rapide

La version **highspeed** de la M2.7 adopte une approche plus **synthétique et actionnable**. Elle commence directement par “FTS5 suffit amplement” et justifie immédiatement : intégré, embarqué, zéro infrastructure, 80% des besoins couverts.

Sa grille de seuils est encore plus précise que la M2.7 standard : < 100K–500K docs (OK), > 1M (ralentissements), < 5-10 ms de latence (embarqué), < 500-1000 req/s (mono-thread). Le modèle maîtrise parfaitement les **trade-offs techniques** et les exprime de manière compréhensible.

Le benchmark concret cité est particulièrement percutant : “Passage de Elasticsearch → FTS5 sur workload classique : **latence médiane réduite de 80-150 ms → < 5 ms** ; throughput multiplié par 5-10× sur la même machine”. Ce chiffre est un **argument vendeur** pour FTS5.

La section sur “Quand Elasticsearch est justifié” est également bien calibrée : > 2-5 millions de docs, > 500K docs/jour en indexation, facets/filters, > 1000 req/s, multi-tenant. Les cas typiques sont pertinents : place de marché, SaaS B2B multi-tenant, ELK stack, recherche géospatiale.

Le compromis coût/complexité/performance est particulièrement bien traité : estimation mensuelle 0 $ vs 500 $–8000 $+, RAM 1-4 Go vs 16-64 Go × 3 nœuds, équipe “développeur standard” vs “Ops + développeur ES expérimenté”. C'est une **analyse business-technique** rarement aussi complète chez des modèles de cette gamme.

## Verdict recherche — podium commenté (16 modèles)

```
🥇 Haiku 4.5          → le plus complet, le plus chiffré, le plus décisionnel
🥈 k2p5               → seuil 1-5M docs, très actionnable
🥉 Hunter Alpha 🆓    → meilleure contextualisation projet
4e Step-3.5 Flash 🆓  → gratuit très fort en arbitrage pratique
5e MiniMax-M2.7-highspeed 🆕 → chiffres percutants, ROI clair, recommandation nette
6e Sonnet 4.6         → profondeur architecte maximale
7e Trinity 🆓         → consulting gratuit ultra-solide
8e MiniMax-M2.7 🆕    → benchmarks sourcés, seuils clairs
9e Gemini Flash 💰    → pragmatique, clair, utile
10e Gemini Pro 💰    → sage mais moins impactant
11e MiniMax-M2.5-highspeed → propre, rapide, bien cadré
12e MiniMax-M2.5     → bonne copie, un peu plus générique
13e GPT-5.4          → méthodologie propre, décision moins forte
14e Healer Alpha 🆓  → utile mais léger
❌ GPT-OSS-120b 🆓   → échec
❌ Nemotron-3 🆓     → DNF
```

---

# 🏆 VERDICT FINAL — 16 modèles

## Tableau de synthèse complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35 | GPT-OSS | Haiku | GemFlash | GemPro | Trinity | Nemotron | M2.5 | M2.5-hs | M2.7 🆕 | M2.7-hs 🆕 |
|---------|--------|--------|-----|--------|------|--------|---------|-------|----------|--------|---------|----------|------|---------|---------|-----------|
| Code — Architecture | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Code — Tests | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Code — Features | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Rigueur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Analyse — Insight | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Analyse — Action | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Recherche — Profondeur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Recherche — Applicabilité | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Adaptation contexte | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Consistance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **TOTAL /50** | **33** | **47** | **30** | **44** | **45** | **41** | **31** | **50** | **41** | **40** | **45** | **0** | **41** | **44** | **44** | **47** |

## Classement final (16 modèles)

```
🥇 Haiku 4.5 (50/50)
   Le rouleau compresseur complet. Le seul modèle qui peut légitimement prétendre au sans-faute.

🥈 Sonnet 4.6 (47/50)
   Excellence technique pure. Toujours la référence quand la qualité d'architecture prime.

🥉 MiniMax-M2.7-highspeed 🆕 (47/50) ← EX-ÆQUO
   La meilleure surprise de cette itération. Excellent partout, ratio qualité/lignes imbattable,
   analyses forensiques de haut niveau, recommandations web chiffrées et actionnables.

🥉 k2p5 (45/50)
   L'équilibre premium. Pas le plus flamboyant, mais l'un des plus constamment utiles.

🥉 Trinity 🆓 (45/50) ← EX-ÆQUO
   La meilleure surprise gratuite moderne. Très sérieux sur les 3 tâches.

5e Hunter Alpha 🆓 (44/50)
   Le meilleur détective du benchmark. Causalité et pragmatisme terrain.

5e MiniMax-M2.5-highspeed (44/50) ← EX-ÆQUO
   Vraie bonne surprise première génération. Homogène, rapide, solide.

5e MiniMax-M2.7 🆕 (44/50) ← EX-ÆQUO
   Le sérieux technique de la famille MiniMax. AVL propre, forensic excellent, web sourcé.

8e Step-3.5 Flash 🆓 (41/50)
   Toujours l'un des meilleurs rapports qualité/prix du benchmark.

8e Gemini Flash 💰 (41/50) ← EX-ÆQUO
   Bon partout, roi nulle part, mais jamais ridicule.

8e MiniMax-M2.5 (41/50) ← EX-ÆQUO
   Bon modèle global, plus classique et moins ambitieux que highspeed, mais fiable.

11e Gemini Pro 💰 (40/50)
   Sérieux, appliqué, un peu trop sage.

12e Healer Alpha 🆓 (33/50)
   Tests solides, architecture fragile, très bonne valeur de prototypage.

13e GPT-OSS-120b 🆓 (31/50)
   Titan local sur le code, mais trop instable hors terrain borné.

14e GPT-5.4 (30/50)
   Le payant qui souffre le plus de la comparaison globale.

❌ Nemotron-3 🆓 (0/50 — DNF)
   Rate limit systématique. Théorie sans pratique.
```

---

## 💡 Méta-enseignements du benchmark v11

1. **MiniMax-M2.7-highspeed est une vraie révélation.** Avec 47/50, il rejoint **ex-aequo Sonnet 4.6** sur le podium. Ce n'est plus une “bonne surprise pour un modèle speed” — c'est un **modèle premium légitime** qui rivalise avec les meilleurs payants du benchmark.

2. **La famille MiniMax progresse significativement entre générations.** Passage de la M2.5 (41/50) à la M2.7 (44/50) à la M2.7-highspeed (47/50). C'est une **courbe d'apprentissage visible** et rassurante pour l'écosystème MiniMax.

3. **Les versions “highspeed” de MiniMax sont systématiquement meilleures que les versions standard.** C'est devenu une constante : M2.5-highspeed > M2.5, M2.7-highspeed > M2.7. Le mot “highspeed” semble désigner une **architecture d'optimisation**, pas une réduction de qualité.

4. **MiniMax-M2.7 (standard) est excellent en analyse de logs et recherche web.** Sur ces deux tâches, il égale ou dépasse beaucoup de modèles établis. Sa relative modestie en code (16 tests vs 25 pour la highspeed) est compensée par une **excellence en compréhension système**.

5. **Le haut du tableau se resserre considérablement.** Avec Haiku (50), Sonnet (47), M2.7-highspeed (47), k2p5 (45), Trinity (45), Hunter (44), M2.5-highspeed (44), M2.7 (44), on a **8 modèles dans une fourchette de 6 points**. La compétition est féroce.

6. **Le gratuit continue de s'imposer comme une option crédible.** Hunter Alpha, Trinity, Step-3.5 Flash restent des références. MiniMax est payant mais son rapport qualité/prix (si le prix est raisonnable) semble excellent.

7. **GPT-5.4 est de plus en plus isolé dans le bas du tableau payant.** À 30/50, il est derrière des gratuits (Trinity 45, Hunter 44, Step-3.5 41) et même derrière des modèles “speed” comme M2.5 (41). Difficile de justifier son coût dans ce benchmark.

---

## 📋 Recommandations d’usage (mise à jour v11)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** | Couverture, verify(), profondeur technique totale |
| Excellence architecture | **Sonnet 4.6** | RB Tree et pensée d'ingénieur senior |
| **Nouveau champion polyvalent** | **MiniMax-M2.7-highspeed** 🆕 | 47/50, excellent partout, ratio qualité/prix potentiel |
| Équilibre premium | **k2p5** | Très bon partout, très relisible, très utile |
| Gratuit complet moderne | **Trinity** 🆓 | 45/50, propre sur les 3 tâches |
| Analyse causale | **Hunter Alpha** 🆓 | Cause racine > symptôme, très fort en incident |
| Analyse logs / recherche web | **MiniMax-M2.7** 🆕 | 9/10 sur les deux tâches, forensic de qualité |
| Bon payant sage | **MiniMax-M2.5** | 41/50, fiable, lisible, classique |
| Budget zéro polyvalent | **Step-3.5 Flash** 🆓 | Rapport qualité/prix excellent |
| Recherche / décision d’archi | **Haiku 4.5** ou **MiniMax-M2.7-highspeed** | profondeur maximale vs chiffres percutants |
| Prototypage orienté tests | **Healer Alpha** 🆓 | couverture généreuse, code simple |
| **Éviter** | **Nemotron-3** 🆓 | rate limit, DNF |
| **Éviter** | **GPT-5.4** | trop en retrait sur le benchmark global |

---

*v11 — Benchmark à 16 modèles — ajout MiniMax-M2.7 et M2.7-highspeed — 2026-03-22 14:00 UTC*