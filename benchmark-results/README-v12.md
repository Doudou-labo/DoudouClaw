# 🔬 Benchmark LLM — Analyse Comparative Complète 19 Modèles (README-v12)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (MiniMax-M2.7, MiniMax-M2.7-highspeed) · 2026-03-29 (**Xiaomi MiMo v2 Omni, Xiaomi MiMo v2 Pro, GLM-4.5-Air**)  
> 
> Cette version **v12** étend le **v11** avec trois nouveaux modèles demandés :
> - `openrouter/xiaomi/mimo-v2-omni`
> - `openrouter/xiaomi/mimo-v2-pro`
> - `openrouter/z-ai/glm-4.5-air:free`
>
> **Important :** contrairement aux deux Xiaomi, **GLM-4.5-Air n’a pas pu être benchmarké proprement dans ce setup**. Les trois runs (code, logs, web) ont échoué au lancement ou n’ont pas produit de fichier exploitable. Il est donc classé **DNF / non benchmarkable ici**, ce qui est déjà une information utile, même si c’est frustrant comme un benchmark qui part en couille avant la ligne de départ.

---

## Les 19 concurrents

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
| `openrouter/xiaomi/mimo-v2-omni` 🆕 | **MiMo v2 Omni** | Xiaomi via OpenRouter | 💰 Payant |
| `openrouter/xiaomi/mimo-v2-pro` 🆕 | **MiMo v2 Pro** | Xiaomi via OpenRouter | 💰 Payant |
| `openrouter/z-ai/glm-4.5-air:free` 🆕 | **GLM-4.5-Air** | Z-AI via OpenRouter | 🆓 Gratuit |

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
| MiniMax-M2.7 | AVL Tree | 223 | 142 | 16 | `height()`, `balance()` exposés |
| MiniMax-M2.7-highspeed | AVL avec métriques | 184 | 209 | 25 | `size`, `isEmpty()`, validation stricte |
| **MiMo v2 Omni** 🆕 | **Treap + `maxHigh`** | **265** | **263** | **18 blocs / 41 assertions** | stress 1000+, floats, immutabilité |
| **MiMo v2 Pro** 🆕 | **AVL augmenté avec `maxHigh`** | **231** | **171** | **15** | stress 500, négatifs, `toArray()` |
| **GLM-4.5-Air** 🆕 | ❌ DNF lancement | — | — | — | ❌ |

*\* Estimé — GPT-OSS-120b a fourni 57/57 tests sans détailler les lignes exactes*

## Analyse et commentaires — focus sur les nouveaux modèles Xiaomi + GLM

### 🔵 MiMo v2 Omni 🆕 — Le plus original du lot sur le code

MiMo v2 Omni est probablement le nouveau modèle le plus intéressant de cette itération sur la tâche code, parce qu’il **n’a pas choisi la solution scolaire**. Là où la majorité du benchmark s’empile sur AVL / Red-Black / BST augmenté, Xiaomi balance un **Treap randomisé** avec augmentation `maxHigh` pour le pruning. Ce n’est pas juste une autre variante du même thème : c’est un vrai signal de personnalité algorithmique.

Avec **265 lignes d’implémentation**, **263 lignes de tests**, **18 blocs de tests** et surtout **41 assertions qui passent**, on n’est pas sur un petit exercice élégant mais creux. Le modèle a réellement cherché à sécuriser son implémentation. Les tests d’immutabilité, les cas sur flottants, négatifs, doublons et gros stress test **1000+ inserts** montrent une vraie volonté de casser son propre code avant qu’on le fasse à sa place.

Le point fort du Treap ici, c’est qu’il propose une solution équilibrée probabilistiquement, plus légère conceptuellement qu’un Red-Black Tree complet, tout en restant beaucoup plus ambitieuse qu’un BST basique. Le défaut, évidemment, c’est qu’un Treap reste plus inhabituel dans une base de code business classique qu’un AVL. Donc sur le terrain, ça impressionne techniquement, mais ça peut aussi coûter un poil plus cher en lisibilité pour une équipe moyenne. En clair : **plus original que prudent, mais pas gratuit dans sa sophistication**.

---

### 🟡 MiMo v2 Pro 🆕 — Le bon élève propre et robuste

MiMo v2 Pro joue une partition beaucoup plus classique que l’Omni. Son **AVL Tree augmenté avec `maxHigh`** est sérieux, propre, relisible, et ses **15 tests** montrent une rigueur correcte sans aller chercher la démonstration spectaculaire. Là où l’Omni essaie de marquer les esprits, le Pro essaie de **rassurer**.

On retrouve dans sa copie un truc assez sain : support générique, stress test à 500 inserts, gestion des nombres négatifs, intervalles nuls, sortie triée via `toArray()`. Rien de fou individuellement, mais tout ça mis ensemble donne une implémentation qui a l’air **utilisable sans honte dans un vrai repo**. Ce n’est pas la copie qui te fait lever un sourcil en disant “putain, intéressant”, mais c’est celle qui te fait penser “ok, ça tient debout, je peux bosser avec”.

Sa limite est justement là : dans un benchmark déjà rempli de très bonnes implémentations AVL, il a du mal à sortir du lot. Il ne fait pas de grosse faute, mais il ne réinvente rien non plus. C’est donc un modèle **solide mais pas iconique** sur la tâche code.

---

### 🔴 GLM-4.5-Air 🆕 — Le fantôme du benchmark

GLM-4.5-Air n’a pas produit de run exploitable sur cette tâche. Pas de fichier code, pas de tests, pas de benchmark. À ce stade, ce n’est pas une question de qualité algorithmique mais de **benchmarkabilité réelle**. Et dans un comparatif pratique, un modèle qui ne lance même pas la course vaut malheureusement zéro signal exploitable.

## Verdict code — podium commenté (19 modèles)

```
🥇 Haiku 4.5              → 42 tests, verify(), couverture monstrueuse
🥈 Sonnet 4.6             → Red-Black Tree le plus propre techniquement
🥉 MiMo v2 Omni 🆕        → Treap original, 41 assertions, vraie personnalité technique
4e MiniMax-M2.5-highspeed → AVL augmenté très abouti
5e MiniMax-M2.7-highspeed → ratio qualité/lignes excellent
6e Trinity 🆓             → 30 tests, benchmarks, sérieux gratuit
7e GPT-OSS-120b 🆓        → monstre de tests sur terrain borné
8e MiMo v2 Pro 🆕         → AVL propre, relisible, peu sexy mais robuste
9e Hunter Alpha 🆓        → compact, fiable, propre
10e k2p5                  → bon sens d’implémentation
11e MiniMax-M2.5          → classique mais propre
12e MiniMax-M2.7          → AVL sérieux sans surprise
13e Step-3.5 Flash 🆓     → bon gratuit pragmatique
14e Healer Alpha 🆓       → couverture > sophistication
15e GPT-5.4               → sérieux mais sans relief
16e Gemini Flash 💰       → standard
17e Gemini Pro 💰         → standard un peu plus sage
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air 🆕         → DNF
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
| **Trinity** | 45 ✅ | **42.2%** | 5 | **3/10** | Diagnosticien rigoureux |
| Nemotron-3 | ❌ | — | — | — | ❌ Rate limit |
| MiniMax-M2.5 | 45 ✅ | cohérent | 5+ | **8/10** | Diagnostic structuré |
| MiniMax-M2.5-highspeed | 45 ✅ | cohérent | 7 | **8/10** | Chronologie + P1/P2/P3 |
| MiniMax-M2.7 | ~50 ✅ | ~58% | 5 types | **9/10** | Forensic structuré avec SQL |
| MiniMax-M2.7-highspeed | ~43 ✅ | ~58% | 8 types | **9/10** | Timeline précise + métriques santé |
| **MiMo v2 Omni** 🆕 | 38 ✅ | **47.4%** | 5 | **7/10** | Incident report structuré |
| **MiMo v2 Pro** 🆕 | 40 ✅ | **30% 5xx + 22.5% warnings** | 5 | **8/10** | SRE propre et pédagogique |
| **GLM-4.5-Air** 🆕 | ❌ DNF | — | — | — | ❌ |

## Analyse et commentaires — focus sur les nouveaux modèles Xiaomi + GLM

### 🟡 MiMo v2 Omni 🆕 — Le rapport d’incident sérieux, mais un peu scolaire

Sur les logs, MiMo v2 Omni fait le taf. Il sort une analyse **complète, propre, structurée**, avec taux d’erreur global, endpoints sains, endpoints cassés, causes priorisées, timeline d’escalade et actions correctives en Java/SQL. Franchement, pour un benchmark, c’est une copie respectable. Tu peux la filer à quelqu’un dans une équipe tech, il comprendra où ça sent le cramé.

Le problème, c’est qu’on reste dans une lecture encore un peu “rapport standard”. Oui, il voit l’OOM. Oui, il voit le NPE PaymentService, le circuit breaker, le DB pool et la séquence `orders_pkey`. Mais il ne dégage pas cette sensation de **forensic haut de gamme** qu’avaient les meilleurs. Il explique correctement ; il dissèque moins profondément.

C’est donc une bonne copie d’exploitation, pas une copie d’expert obsédé par la causalité. En gros : **sérieux, actionnable, mais pas chirurgical**.

---

### 🔵 MiMo v2 Pro 🆕 — Le plus convaincant des deux Xiaomi sur les logs

MiMo v2 Pro fait mieux qu’Omni sur cette tâche, et assez nettement. Sa force, c’est une meilleure **mise en récit de la dégradation système** : il part d’un système nominal, observe les premiers NPE, les premières lenteurs search, puis le circuit breaker, puis le pool DB, puis les OOM, et recompose une véritable **progression vers le point de non-retour**. On sent davantage le modèle qui comprend qu’un incident n’est pas une somme d’erreurs mais une **dynamique de système qui se dégrade**.

Ses tableaux sont propres, ses priorités lisibles, ses hypothèses bien hiérarchisées, et surtout il garde une voix suffisamment pédagogique pour rester utile sans devenir verbeux pour rien. Il lui manque encore un peu de mordant sur la couche monitoring/observabilité pour aller chercher les meilleurs du benchmark, mais il est clairement **au-dessus de l’Omni** sur cette tâche.

---

### 🔴 GLM-4.5-Air 🆕 — Toujours rien de benchmarkable

Le run logs a foiré, puis le retry a foiré aussi. Aucun fichier exploitable. Là encore, le sujet n’est pas la qualité analytique du modèle mais le simple fait qu’on ne peut pas l’évaluer proprement ici.

## Verdict analyse — podium commenté (19 modèles)

```
🥇 Hunter Alpha 🆓        → lecture causale irremplaçable
🥈 Sonnet 4.6             → pensée d’architecte, postmortem-ready
🥉 Haiku 4.5              → stats les plus précises et les plus intelligentes
4e MiniMax-M2.7           → forensic structuré, SQL complet, 9/10
5e MiniMax-M2.7-highspeed → timeline précise, métriques santé, 9/10
6e MiMo v2 Pro 🆕         → propre, pédagogique, bonne dynamique système
7e k2p5                   → lecture risque / continuité de service
8e Trinity 🆓             → rapport gratuit très solide
9e MiniMax-M2.5-highspeed → benchmark-ready, bien structuré
10e MiMo v2 Omni 🆕       → sérieux mais plus scolaire
11e Step-3.5 Flash 🆓     → systémique et propre
12e MiniMax-M2.5          → solide mais plus générique
13e Gemini Pro 💰         → exécutif et lisible
14e Gemini Flash 💰       → tableau propre, moins profond
15e Healer Alpha 🆓       → pédagogique, moins exact métriquement
16e GPT-OSS-120b 🆓       → quantitatif séduisant, score optimiste
17e GPT-5.4               → bonne culture SRE, comptage faux
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air 🆕         → DNF
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
| MiniMax-M2.7 | ~12 000c | benchmarks Reddit + SQLite Forum | < 500K docs | ✅ seuils clairs |
| MiniMax-M2.7-highspeed | ~10 000c | latence 80-150ms → <5ms | <100K-500K docs | ✅ ROI clair |
| **MiMo v2 Omni** 🆕 | structuré | TCO + arbre de décision | **<500K / 1M docs** | ✅ FTS5 largement suffisant |
| **MiMo v2 Pro** 🆕 | structuré | 1–5ms / 1–5M docs / coûts ES | **~1–5M docs** | ✅ FTS5 puis migration si besoin |
| **GLM-4.5-Air** 🆕 | ❌ DNF | ❌ | ❌ | ❌ |

## Analyse et commentaires — focus sur les nouveaux modèles Xiaomi + GLM

### 🟡 MiMo v2 Omni 🆕 — Le consultant TCO

Sur la recherche web, MiMo v2 Omni prend un angle assez malin : il ne vend pas juste FTS5 par réflexe technique, il le vend comme **arbitrage coût / complexité / performance**. Son tableau de TCO, ses seuils de confort (<500K docs), ses extrapolations de throughput et son arbre de décision donnent une réponse plutôt orientée **choix d’architecture en entreprise**.

Ce qui lui manque, c’est la même chose que sur les logs : plus de mordant empirique. Oui, il fournit des chiffres. Oui, il structure bien. Mais on sent qu’une partie repose sur des extrapolations raisonnables plutôt que sur un socle de benchmarks homogènes et bétonnés. Donc la réponse est bonne, utile, même convaincante — mais pas encore une claque.

---

### 🔵 MiMo v2 Pro 🆕 — Le plus mature des deux sur la partie décisionnelle

MiMo v2 Pro donne ici une copie plus nette que l’Omni. Son grand mérite, c’est d’être **tranchant sans être caricatural**. Il dit clairement : pour **90% des applications**, commence par FTS5. Puis il explique pourquoi : latence locale, coût quasi nul, complexité minimale, migration possible plus tard. C’est une vraie recommandation, pas une dissertation de consultant qui a peur de choisir.

Ses chiffres restent indicatifs par endroits, mais sa grille de lecture est forte : seuils en documents, cas d’usage réels, coût humain de l’ops Elasticsearch, scénario hybride possible, arbre de décision. En pratique, c’est une réponse qui aide vraiment à décider. Et bordel, c’est précisément ce qu’on attend de cette tâche.

---

### 🔴 GLM-4.5-Air 🆕 — Encore DNF

Le run web a planté au lancement, puis le retry a replanté aussi. Donc pas de benchmark web exploitable, pas de fichier, pas de signal.

## Verdict recherche — podium commenté (19 modèles)

```
🥇 Haiku 4.5              → le plus complet, chiffré, décisionnel
🥈 k2p5                   → seuil 1-5M docs, ultra-actionnable
🥉 Hunter Alpha 🆓        → meilleure contextualisation terrain
4e Step-3.5 Flash 🆓      → gratuit très fort en arbitrage pratique
5e MiniMax-M2.7-highspeed → chiffres percutants, ROI clair
6e MiMo v2 Pro 🆕         → recommandation nette, angle décisionnel solide
7e Sonnet 4.6             → profondeur architecte maximale
8e Trinity 🆓             → consulting gratuit ultra-solide
9e MiniMax-M2.7           → benchmarks sourcés, seuils clairs
10e MiMo v2 Omni 🆕       → TCO utile, un peu plus extrapolé
11e Gemini Flash 💰       → pragmatique, clair, utile
12e Gemini Pro 💰         → sage mais moins impactant
13e MiniMax-M2.5-highspeed → propre, rapide, bien cadré
14e MiniMax-M2.5          → bonne copie, plus générique
15e GPT-5.4               → méthodologie propre, décision moins forte
16e Healer Alpha 🆓       → utile mais léger
❌ GPT-OSS-120b 🆓        → échec
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air 🆕         → DNF
```

---

# 🏆 VERDICT FINAL — 19 modèles

## Tableau de synthèse complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35 | GPT-OSS | Haiku | GemFlash | GemPro | Trinity | Nemotron | M2.5 | M2.5-hs | M2.7 | M2.7-hs | MiMo Omni 🆕 | MiMo Pro 🆕 | GLM Air 🆕 |
|---------|--------|--------|-----|--------|------|--------|---------|-------|----------|--------|---------|----------|------|---------|------|---------|--------------|-------------|-----------|
| Code — Architecture | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Code — Tests | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Code — Features | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Analyse — Rigueur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Analyse — Insight | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Analyse — Action | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Recherche — Profondeur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Recherche — Applicabilité | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| Adaptation contexte | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| Consistance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| **TOTAL /50** | **33** | **47** | **30** | **44** | **45** | **41** | **31** | **50** | **41** | **40** | **45** | **0** | **41** | **44** | **44** | **47** | **40** | **42** | **0** |

## Classement final (19 modèles)

```
🥇 Haiku 4.5 (50/50)
   Le rouleau compresseur complet. Toujours patron.

🥈 Sonnet 4.6 (47/50)
   Excellence technique pure.

🥈 MiniMax-M2.7-highspeed (47/50) ← EX-ÆQUO
   La meilleure surprise récente côté MiniMax.

4e k2p5 (45/50)
   L’équilibre premium.

4e Trinity 🆓 (45/50) ← EX-ÆQUO
   Le gratuit ultra-sérieux.

6e Hunter Alpha 🆓 (44/50)
   Le détective du benchmark.

6e MiniMax-M2.5-highspeed (44/50) ← EX-ÆQUO
   Très bonne première génération.

6e MiniMax-M2.7 (44/50) ← EX-ÆQUO
   Le sérieux technique de la famille MiniMax.

9e MiMo v2 Pro 🆕 (42/50)
   Le meilleur des Xiaomi sur le global : propre, équilibré, utile.

10e Step-3.5 Flash 🆓 (41/50)
   Toujours l’un des meilleurs rapports qualité/prix.

10e Gemini Flash 💰 (41/50) ← EX-ÆQUO
   Bon partout, roi nulle part.

10e MiniMax-M2.5 (41/50) ← EX-ÆQUO
   Bon modèle global, plus classique.

13e Gemini Pro 💰 (40/50)
   Sérieux, appliqué, un peu trop sage.

13e MiMo v2 Omni 🆕 (40/50) ← EX-ÆQUO
   Très bon en code, plus moyen ailleurs ; profil plus “spécialiste” que polyvalent.

15e Healer Alpha 🆓 (33/50)
   Très bonne valeur de prototypage.

16e GPT-OSS-120b 🆓 (31/50)
   Titan local sur code, trop instable ailleurs.

17e GPT-5.4 (30/50)
   Le payant qui souffre le plus de la comparaison globale.

❌ Nemotron-3 🆓 (0/50 — DNF)
   Rate limit systématique.

❌ GLM-4.5-Air 🆕 (0/50 — DNF)
   Non benchmarkable dans ce setup : lancement cassé sur les 3 tâches.
```

---

## 💡 Méta-enseignements du benchmark v12

1. **Les Xiaomi ne sont pas ridicules du tout.** `MiMo v2 Pro` finit à **42/50**, donc au-dessus de pas mal de modèles qu’on aurait pu croire plus installés. `MiMo v2 Omni` finit à **40/50**, avec un profil plus inégal mais aussi plus original.

2. **MiMo v2 Omni est un modèle de code plus intéressant que son score global.** Son Treap randomisé le distingue franchement du reste du benchmark. S’il y avait un prix “personnalité technique”, il le jouerait sérieusement.

3. **MiMo v2 Pro est le plus cohérent des deux Xiaomi.** Moins spectaculaire, mais plus régulier : bon en code, bon en logs, bon en recherche. C’est clairement celui qui gagne le match interne Xiaomi si on cherche un modèle polyvalent.

4. **GLM-4.5-Air échoue non pas sur la qualité, mais sur la benchmarkabilité.** Et putain, c’est important de le dire. Un modèle gratuit peut avoir des promesses sur papier ; si dans le setup réel il ne lance même pas ses runs proprement, ça vaut DNF. Pas par méchanceté, juste par honnêteté expérimentale.

5. **Le haut du tableau reste verrouillé par Haiku, Sonnet et MiniMax-M2.7-highspeed.** Les nouveaux entrants Xiaomi sont bons, mais ils n’ont pas mis le benchmark sens dessus dessous.

6. **Le milieu de tableau devient extrêmement dense.** Entre 40 et 44, on a désormais tout un paquet de modèles vraiment utilisables. Le benchmark ne dit plus “il y a 2 bons et le reste est nul”. Il dit plutôt : **il y a plusieurs bons profils, chacun avec ses nerfs, ses angles morts et ses putains de compromis**.

---

## 📋 Recommandations d’usage (mise à jour v12)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** | Couverture, verify(), profondeur technique totale |
| Excellence architecture | **Sonnet 4.6** | RB Tree et pensée d’ingénieur senior |
| Champion polyvalent récent | **MiniMax-M2.7-highspeed** | 47/50, excellent partout |
| Équilibre premium | **k2p5** | Très bon partout, très utile |
| Gratuit complet moderne | **Trinity** 🆓 | 45/50, propre sur les 3 tâches |
| Analyse causale | **Hunter Alpha** 🆓 | Cause racine > symptôme |
| Xiaomi le plus fiable | **MiMo v2 Pro** 🆕 | Plus cohérent et plus polyvalent que l’Omni |
| Xiaomi le plus intéressant en code | **MiMo v2 Omni** 🆕 | Treap original + grosse couverture de tests |
| Budget zéro polyvalent | **Step-3.5 Flash** 🆓 | Rapport qualité/prix excellent |
| Rechercher / arbitrer stack search | **Haiku 4.5** ou **MiMo v2 Pro** | profondeur maximale vs décision nette |
| **Éviter / non benchmarkable ici** | **GLM-4.5-Air** 🆕 | DNF dans ce setup |
| **Éviter** | **Nemotron-3** 🆓 | DNF |
| **Éviter** | **GPT-5.4** | trop en retrait sur le benchmark global |

---

*v12 — Benchmark à 19 modèles — ajout Xiaomi MiMo v2 Omni / Pro + GLM-4.5-Air (DNF) — 2026-03-29 14:35 UTC*