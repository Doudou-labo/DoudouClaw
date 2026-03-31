# 🔬 Benchmark LLM — Analyse Comparative Complète 24 Modèles (README-v14)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (MiniMax-M2.7, MiniMax-M2.7-highspeed) · 2026-03-29 (MiMo v2 Omni, MiMo v2 Pro, GLM-4.5-Air, GLM-4.7, GLM-4.7-Flash, GLM-5, GLM-5-Turbo) · 2026-03-31 (**Qwen3.6-plus-preview**)
>
> Cette version **v14** ajoute le modèle **Qwen3.6-plus-preview** d'Alibaba via OpenRouter (gratuit). Résumé immédiat : un modèle qui frappe fort, avec une copie code très sérieuse (AVL augmenté, 15/15 tests), une analyse logs solide et structurée, et une réponse FTS5 parmi les plus complètes et chiffrées du benchmark.

---

## Les 24 concurrents

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
| `openrouter/qwen/qwen3.6-plus-preview:free` 🆕 | **Qwen3.6-plus** | Alibaba / OpenRouter | 🆓 Gratuit |

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
| Step-3.5 Flash | AVL Tree | 281 | 267 | 12 | `searchOverlap()` |
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
| **Qwen3.6-plus** 🆕 | **AVL augmenté par `maxEnd`** | **~200** | **~180** | **15 (15/15 ✅)** | `isEmpty`, stress 1000, intervalles invalides |

## Analyse et commentaires — Qwen3.6-plus-preview

### **Qwen3.6-plus** 🆕 — L'AVL rigoureux, 100% propre

Qwen3.6-plus a choisi l'approche classique et robuste : un **AVL augmenté par `maxEnd`**, architecture standard et éprouvée pour un IntervalTree. Ce n'est pas la copie la plus spectaculaire du tableau — pas de Red-Black Tree, pas de 600 lignes de tests — mais c'est probablement l'une des plus **propres et rigoureuses**.

Ce qui marque le plus : **15/15 tests passent**. Zéro dépendance externe. Framework de test maison. L'arbre gère les cas limites habituels (intervalle invalide → exception, doublon, arbre vide, stress 1000 nœuds) et ajoute quelques helpers utiles comme `isEmpty`.

L'élagage O(log n + k) est bien implémenté grâce à `maxEnd`, ce qui place le modèle dans les bonnes pratiques algorithmiques, même sans la flamboyance des GLM haut de gamme. En termes de rapport volume/qualité, c'est probablement **le meilleur gratuit récent** sur cette tâche.

## Verdict code mis à jour (24 modèles)

```
🥇 Haiku 4.5              → toujours monstrueux en robustesse globale
🥈 GLM-4.7                → Red-Black Tree massif, 50 tests, grosse démonstration
🥉 Sonnet 4.6             → pureté technique et élégance d'implémentation
4e GLM-5                  → AVL premium très équilibré
5e MiMo v2 Omni           → Treap original, vraie personnalité technique
6e MiniMax-M2.5-highspeed → premium compact très abouti
7e MiniMax-M2.7-highspeed → ratio qualité/lignes excellent
8e Trinity 🆓             → gratuit ultra-sérieux
9e GLM-4.7-Flash          → meilleur que prévu malgré timeout sale
10e GPT-OSS-120b 🆓       → énorme couverture sur tâche bornée
11e MiMo v2 Pro           → propre, robuste, moins marquant
12e Hunter Alpha 🆓       → compact, fiable
13e k2p5                  → pragmatique mature
14e **Qwen3.6-plus 🆓 🆕** → AVL rigoureux, 15/15, propre et fiable
15e GLM-5-Turbo           → compact, propre, peu ambitieux
16e MiniMax-M2.5          → classique et fiable
17e MiniMax-M2.7          → sérieux sans surprise
18e Step-3.5 Flash 🆓     → bon gratuit utilitaire
19e Healer Alpha 🆓       → couverture > sophistication
20e GPT-5.4               → sérieux mais sans relief
21e Gemini Flash 💰       → standard
22e Gemini Pro 💰         → standard un peu plus sage
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air            → DNF
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
| Step-3.5 Flash | 45 | 37.8% | 5 | 2/10 | systémique |
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
| **Qwen3.6-plus** 🆕 | **41** | **19.5% (5×500 + 5×503)** | **3 (NPE, circuit breaker, slow)** | **8/10** | **structuré P0/P1/P2, très lisible** |

## Analyse et commentaires — Qwen3.6-plus-preview

### **Qwen3.6-plus** 🆕 — L'analyste bien calibré, patterns nets

Qwen3.6-plus a rendu une copie **très lisible et bien structurée**. Le calcul du taux d'erreur est correct (5×500 + 5×503 = 10 incidents sur ~51 lignes utiles), le diagnostic NPE est immédiat et pertinent (bug code Java, pas infra), et les recommandations sont priorisées de façon P0/P1/P2 cohérente.

Ce qui le distingue positivement : la **clarté d'action**. La priorisation est nette et actionnable — hotfix urgent, audit transactionnel, puis optimisation SQL/index. Pas de blabla de consultant. Les estimations d'effort (30 min pour le hotfix, 2h pour l'index) ajoutent une vraie valeur pratique.

Ce qui l'empêche de monter au-dessus de 8/10 : il identifie **3 catégories de patterns** quand les meilleurs (MiniMax-M2.7, GLM-4.7) en remontent 6-8 avec des diagnostics croisés plus fins (OOM, pool DB, cascade de défaillances). La réponse est bonne, mais pas au niveau forensic des premiers du classement.

## Verdict analyse mis à jour (24 modèles)

```
🥇 Hunter Alpha 🆓        → instinct causal unique
🥈 GLM-5                  → très mature, net, exploitable
🥉 GLM-4.7                → énorme copie SRE, très structurée
4e MiniMax-M2.7           → forensic structuré, SQL complet
5e MiniMax-M2.7-highspeed → disponibilité + métriques santé
6e Sonnet 4.6             → pensée d'architecte, très solide
7e GLM-5-Turbo            → bonne synthèse actionnable
8e MiMo v2 Pro            → meilleur Xiaomi sur logs
9e **Qwen3.6-plus 🆓 🆕** → P0/P1/P2 net, bien chiffré, très lisible
10e k2p5                  → lecture risque / continuité
11e Trinity 🆓            → rigoureux et partageable
12e MiniMax-M2.5-highspeed → benchmark-ready
13e MiMo v2 Omni          → sérieux mais scolaire
14e GLM-4.7-Flash         → fond bon, forme moins propre
15e Step-3.5 Flash 🆓     → systémique et propre
16e MiniMax-M2.5          → solide mais plus générique
17e Gemini Pro 💰         → exécutif et lisible
18e Gemini Flash 💰       → tableau propre, moins profond
19e Healer Alpha 🆓       → pédagogique
20e GPT-OSS-120b 🆓       → quantitatif séduisant
21e GPT-5.4               → erreurs de comptage pénalisantes
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
| Step-3.5 Flash | très bon gratuit | 8 |
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
| GLM-4.7 | benchmarks réels + seuils précis | 9/10 |
| GLM-4.7-Flash | clair, chiffré, rentable | 8/10 |
| GLM-5 | sources multiples, arbre de décision | 9/10 |
| GLM-5-Turbo | FTS5-first cohérent | 7/10 |
| **Qwen3.6-plus** 🆕 | **chiffres précis, TCO $0 vs $600-3000/an, FTS5 recommandé clairement, alternatives mentionnées** | **9/10** |

## Analyse et commentaires — Qwen3.6-plus-preview

### **Qwen3.6-plus** 🆕 — Le gratuit qui donne une vraie leçon d'architecture

La réponse de Qwen3.6-plus sur FTS5 vs Elasticsearch est **l'une des meilleures du benchmark**. Elle place correctement FTS5 pour le cas d'usage (100K items), donne des **chiffres concrets et pertinents** (latence 2-10ms vs 10-50ms, $0 vs $600-3000/an, 10K QPS FTS5 vs 2-5K QPS ES), identifie le **vrai piège caché** de la sync pipeline, et mentionne les alternatives (MeiliSearch, Typesense).

Ce qui est particulièrement fort : la **métaphore du camion de déménagement pour ranger un studio**, qui résume parfaitement le problème d'over-engineering. Et l'argument de la **sérialisation des writes SQLite** vs le write throughput Elasticsearch est précis et honnête — le modèle ne cache pas les limites de FTS5.

Il atteint le niveau des meilleurs sur cette tâche (GLM-4.7, GLM-5) pour la qualité de recommandation. Légèrement sous Haiku 4.5 qui reste le plus exhaustif, mais franchement très proche.

## Verdict recherche mis à jour (24 modèles)

```
🥇 Haiku 4.5              → le plus complet, chiffré, décisionnel
🥈 GLM-4.7                → excellent arbitrage, chiffres réels, très net
🥉 GLM-5                  → riche, sourcé, très mature
4e **Qwen3.6-plus 🆓 🆕** → chiffres solides, TCO, alternatives, très actionnable
5e k2p5                   → seuils mémorisables et utiles
6e Hunter Alpha 🆓        → meilleure contextualisation terrain
7e MiniMax-M2.7-highspeed → excellent décideur récent
8e Step-3.5 Flash 🆓      → gratuit très fort
9e Sonnet 4.6             → profond, un peu moins tranchant
10e MiMo v2 Pro           → propre, exploitable
11e GLM-4.7-Flash         → flash très rentable
12e Trinity 🆓            → consulting gratuit solide
13e MiniMax-M2.7          → benchmarks sourcés, seuils clairs
14e Gemini Flash 💰       → pragmatique et utile
15e MiniMax-M2.5-highspeed→ propre et rapide
16e Gemini Pro 💰         → sage, moins impactant
17e MiMo v2 Omni          → TCO utile mais plus extrapolé
18e MiniMax-M2.5          → bonne copie plus générique
19e GLM-5-Turbo           → FTS5-first cohérent, moins fort
20e GPT-5.4               → honnête mais peu décisionnel
21e Healer Alpha 🆓       → utile mais léger
❌ GPT-OSS-120b 🆓        → échec
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air            → DNF
```

---

# 🏆 VERDICT FINAL — 24 modèles

## Tableau de synthèse complet

| Modèle | Code | Logs | Web | Total /50 |
|--------|------|------|-----|----------:|
| Haiku 4.5 | 10 | 8 | 10 | **50** |
| GLM-4.7 | 10 | 10 | 10 | **49** |
| GLM-5 | 9 | 10 | 10 | **48** |
| Sonnet 4.6 | 9 | 9 | 9 | **47** |
| MiniMax-M2.7-highspeed | 9 | 9 | 10 | **47** |
| k2p5 | 8 | 9 | 10 | **45** |
| Trinity | 8 | 9 | 9 | **45** |
| Hunter Alpha | 8 | 10 | 9 | **44** |
| MiniMax-M2.5-highspeed | 9 | 8 | 9 | **44** |
| MiniMax-M2.7 | 8 | 10 | 8 | **44** |
| **Qwen3.6-plus 🆕 🆓** | **8** | **8** | **9** | **44** |
| MiMo v2 Pro | 8 | 8 | 8 | **42** |
| Step-3.5 Flash | 7 | 8 | 8 | **41** |
| Gemini Flash | 7 | 7 | 8 | **41** |
| MiniMax-M2.5 | 7 | 8 | 7 | **41** |
| Gemini Pro | 7 | 7 | 7 | **40** |
| MiMo v2 Omni | 9 | 7 | 7 | **40** |
| GLM-4.7-Flash | 7 | 7 | 8 | **39** |
| GLM-5-Turbo | 7 | 8 | 7 | **38** |
| Healer Alpha | 6 | 7 | 6 | **33** |
| GPT-OSS-120b | 8 | 6 | 0 | **31** |
| GPT-5.4 | 6 | 5 | 6 | **30** |
| Nemotron-3 | 0 | 0 | 0 | **0** |
| GLM-4.5-Air | 0 | 0 | 0 | **0** |

## Classement final (24 modèles)

```
🥇 Haiku 4.5 (50/50)
   Le patron historique. Toujours imprenable.

🥈 GLM-4.7 (49/50)
   La grosse machine z.ai. Monstrueux en code, excellent partout.

🥉 GLM-5 (48/50)
   Le premium le plus équilibré et mature de z.ai.

4e Sonnet 4.6 (47/50)
   Excellence technique pure.

4e MiniMax-M2.7-highspeed (47/50)
   Premium compact très sérieux.

6e k2p5 (45/50)
   L'équilibre premium.

6e Trinity 🆓 (45/50)
   Le gratuit ultra-sérieux. Tient encore la comparaison.

8e Hunter Alpha 🆓 (44/50)
   Le détective du benchmark.

8e MiniMax-M2.5-highspeed (44/50)
   Très bonne première génération MiniMax.

8e MiniMax-M2.7 (44/50)
   Sérieux technique confirmé.

8e **Qwen3.6-plus 🆕 🆓 (44/50)**
   La vraie surprise de la vague Alibaba. Gratuit, 44/50, fiable sur les 3 tâches.
   Meilleur gratuit récent après Trinity. Difficile à ignorer.

12e MiMo v2 Pro (42/50)
   Le Xiaomi le plus cohérent.

13e Step-3.5 Flash 🆓 (41/50)
   Toujours un des meilleurs rapports qualité/prix.

13e Gemini Flash 💰 (41/50)
   Bon partout, roi nulle part.

13e MiniMax-M2.5 (41/50)
   Bon modèle global, plus classique.

16e Gemini Pro 💰 (40/50)
   Sérieux, un peu trop sage.

16e MiMo v2 Omni (40/50)
   Très bon en code, plus moyen ailleurs.

18e GLM-4.7-Flash (39/50)
   Flash solide, mais nettement sous les gros modèles z.ai.

19e GLM-5-Turbo (38/50)
   Compact, utile, moins premium.

20e Healer Alpha 🆓 (33/50)
   Bonne valeur de prototypage.

21e GPT-OSS-120b 🆓 (31/50)
   Titan local sur code, trop instable ailleurs.

22e GPT-5.4 (30/50)
   Le payant qui souffre le plus de la comparaison globale.

❌ Nemotron-3 🆓 (0/50 — DNF)
❌ GLM-4.5-Air (0/50 — DNF)
```

---

## 💡 Méta-enseignements du benchmark v14

1. **Qwen3.6-plus-preview est une vraie découverte.** Gratuit, 44/50, fiable sur les 3 tâches. Il rejoint le cluster des meilleurs gratuits avec Trinity (45) et Hunter Alpha (44), voire dépasse certains modèles payants comme MiMo v2 Pro et Step-3.5 Flash dans la praticité.

2. **La gratuit tier est en train de devenir monstrueuse.** Trinity 🆓, Hunter Alpha 🆓, Qwen3.6-plus 🆓, Step-3.5 Flash 🆓 : on a maintenant **4 modèles gratuits dans le top 15**, tous à 41/50 ou plus. La justification d'utiliser un modèle payant intermédiaire se réduit.

3. **Qwen sur FTS5/Elasticsearch : réponse d'architecte senior gratuit.** C'est la tâche où il brille le plus. La lisibilité, les chiffres, le TCO, les alternatives — c'est une réponse qui ferait passer une code review sans problème.

4. **En code, il reste propre mais pas spectaculaire.** AVL augmenté, 15/15 tests, bonne rigueur. Il ne cherche pas à impressionner comme GLM-4.7 ou Haiku, mais il ne rate pas non plus. Pour un projet prod, c'est une copie utilisable telle quelle.

5. **Sur logs, il est bon mais pas forensic.** 3 patterns identifiés vs 6-8 pour les leaders. C'est la tâche où il y a le plus de marge de progression. Mais le P0/P1/P2 est actionnable et juste.

6. **Le rapport qualité/coût de Qwen est imbattable dans ce benchmark.** Gratuit + 44/50 + cohérent sur les 3 tâches. À utiliser sans hésitation pour du code, des analyses, ou des questions d'architecture applicative.

---

## 📋 Recommandations d'usage (mise à jour v14)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** ou **GLM-4.7** | robustesse maximale vs copie code monstrueuse |
| Modèle premium équilibré | **GLM-5** | très bon partout, très sain |
| Excellence architecture | **Sonnet 4.6** | pensée d'ingénieur senior |
| Décision rapide produit/infra | **GLM-4.7** ou **MiniMax-M2.7-highspeed** | très bonne lisibilité d'arbitrage |
| Gratuit complet moderne | **Trinity** 🆓 ou **Qwen3.6-plus** 🆓 🆕 | 45 et 44/50, propres sur les 3 tâches |
| Analyse causale incident | **Hunter Alpha** 🆓 | cause racine > symptôme |
| Xiaomi le plus fiable | **MiMo v2 Pro** | le plus cohérent de la gamme |
| Alibaba gratuit | **Qwen3.6-plus** 🆓 🆕 | 44/50, chiffres et architecture, recommandable |
| z.ai utilitaire / coût inférieur | **GLM-5-Turbo** | compact, propre, pragmatique |
| Éviter | **GLM-4.5-Air**, **Nemotron-3** | DNF |
| À reconsidérer | **GPT-5.4** | trop en retrait sur le benchmark global |

---

*Dernière mise à jour : 2026-03-31 — v14 ajoute Qwen3.6-plus-preview (Alibaba/OpenRouter, gratuit)*
