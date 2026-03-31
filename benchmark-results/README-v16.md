# 🔬 Benchmark LLM — Analyse Comparative Complète 25 Modèles (README-v16)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (MiniMax-M2.7, MiniMax-M2.7-highspeed) · 2026-03-29 (MiMo v2 Omni, MiMo v2 Pro, GLM-4.5-Air, GLM-4.7, GLM-4.7-Flash, GLM-5, GLM-5-Turbo, Qwen3.6-plus) · 2026-03-31 (Step-3.5-Flash payant)
>
> Cette version **v16** corrige le fichier v15 corrompu et restaure les sections finales complètes (classement + verdict + recommandations) qui avaient disparu. Résultats Step-3.5-Flash (payant) maintenus : excellent sur FTS5/ES (10/10) et logs (8/10), mais échec sur code (timeout).

---

## Les 25 concurrents

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
| **Step-3.5-Flash (payant)** | **BST augmenté** | **~200** | **~180** | **12** | `maxEnd`, stress 1000, intervalles invalides |

## Analyse et commentaires

### **Step-3.5-Flash (payant)** 💰 — Solide sur l'analyse, échec sur le code

**Performance logs (8/10)** : L'analyse de logs par Step-3.5-Flash (payant) est excellente. Le modèle identifie correctement les symptômes (5 erreurs 500, 9 SLOW, 5×503), calcule le taux d'erreur (19.5%), détecte 3 patterns majeurs (paiement NPE, circuit breaker, ralentissements), et recommande des actions priorisées (P0 fix NPE, P1 cache/index DB). C'est du bon analyste SRE, cohérent et actionnable.

**Performance FTS5/ES (10/10)** : Sur la tâche FTS5 vs Elasticsearch, la réponse est d'un niveau architectural senior. Le modèle recommande SQLite FTS5 pour le cas d'usage (100K produits), fournit des chiffres précis (latence 1-5ms FTS5 vs 10-100ms ES, 100K-4M QPS FTS5 vs 500-1K QPS ES), évalue le TCO (0€ vs 450-500€/mois infra + 5-10k€/an ops), donne des seuils clairs (FTS5 jusqu'à 500K docs / 1K QPS), et propose une architecture concrète (SQLite FTS5VirtualTable + triggers auto + option read replicas). C'est probablement l'une des meilleures réponses du benchmark sur cette tâche.

**Performance code (0/10 — échec)** : Sur la tâche IntervalTree, Step-3.5-Flash (payant) échoue complètement. Le run dépasse les 300s autorisés (4m20s) et ne livre qu'une phrase prometteuse sans aucun code ni tests. C'est un échec total — impossible d'évaluer l'architecture ou la qualité des tests. Le score de 0/10 est donc justifié mais malheureux.

**Verdict global** : Excellent analyste SRE et architecte système, mais incompétent pour les tâches de code sous contrainte de temps.

---

## Verdict code — top 25 modèles

```
🥇 Haiku 4.5              → toujours monstrueux en robustesse globale
🥈 GLM-4.7                → Red-Black Tree massif, 50 tests, grosse démonstration
🥉 GLM-5                  → AVL premium très équilibré
4e Sonnet 4.6             → pureté technique et élégance d'implémentation
5e MiMo v2 Omni           → Treap original, vraie personnalité technique
6e MiniMax-M2.5-highspeed → premium compact très abouti
7e MiniMax-M2.7-highspeed → ratio qualité/lignes excellent
8e Trinity 🆓             → gratuit ultra-sérieux
9e GLM-4.7-Flash          → meilleur que prévu malgré timeout sale
10e GPT-OSS-120b 🆓       → énorme couverture sur tâche bornée
11e MiMo v2 Pro           → propre, robuste, moins marquant
12e Hunter Alpha 🆓       → compact, fiable
13e k2p5                  → pragmatique mature
14e Qwen3.6-plus 🆓         → AVL rigoureux, 15/15, propre et fiable
15e GLM-5-Turbo           → compact, propre, peu ambitieux
16e MiniMax-M2.5          → classique et fiable
17e MiniMax-M2.7          → sérieux sans surprise
18e GLM-5                  → équilibré mais moins brillant que GLM-4.7
19e GPT-5.4               → sérieux mais sans relief
20e Healer Alpha 🆓       → bonne valeur de prototypage
21e GPT-OSS-120b 🆓        → échec sur code bornée
22e Gemini Flash 💰       → standard
23e Gemini Pro 💰         → standard un peu plus sage
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air            → DNF
❌ **Step-3.5-Flash (payant)** 💰 → TIMEOUT, échec total sur code
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
| **Step-3.5-Flash (payant)** 💰 | 45 | 19.5% | 3 | **8/10** | analyste SRE, priorisé |
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
| Qwen3.6-plus | 41 | 19.5% | 3 | 8/10 | structuré P0/P1/P2, très lisible |

## Verdict analyse — top 25 modèles

```
🥇 Hunter Alpha 🆓        → instinct causal unique
🥈 GLM-5                  → très mature, net, exploitable
🥉 GLM-4.7                → énorme copie SRE, très structurée
4e MiniMax-M2.7           → forensic structuré, SQL complet
5e **Step-3.5-Flash (payant)** 💰 → analyste SRE excellent, priorisé et lisible
6e MiniMax-M2.7-highspeed → disponibilité + métriques santé
7e Sonnet 4.6             → pensée d'architecte, très solide
8e GLM-5-Turbo            → bonne synthèse actionnable
9e MiMo v2 Pro            → meilleur Xiaomi sur logs
10e **Qwen3.6-plus** 🆓  → P0/P1/P2 net, bien chiffré, très lisible
11e k2p5                  → lecture risque / continuité
12e Trinity 🆓            → rigoureux et partageable
13e MiniMax-M2.5-highspeed → benchmark-ready
14e GLM-4.7-Flash         → fond bon, forme moins propre
15e Step-3.5-Flash (free) 🆓     → systémique et propre |
16e MiniMax-M2.5          → solide mais plus générique
17e MiniMax-M2.7          → sérieux sans surprise
18e GLM-5                  → équilibré mais moins brillant que GLM-4.7
19e GPT-5.4               → sérieux mais sans relief
20e Healer Alpha 🆓       → pédagogique
❌ GPT-OSS-120b 🆓        → échec sur code bornée
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
| GLM-4.7 | benchmarks réels + seuils précis | 9/10 |
| GLM-4.7-Flash | clair, chiffré, rentable | 8/10 |
| GLM-5 | sources multiples, arbre de décision | 9/10 |
| GLM-5-Turbo | FTS5-first cohérent | 7/10 |
| Qwen3.6-plus | chiffres précis, TCO $0 vs $600-3000/an, FTS5 recommandé clairement, alternatives mentionnées | 9/10 |
| **Step-3.5-Flash (payant)** 💰 | latence 1-5ms vs 10-100ms, 100K-4M QPS, économie 450€/mois, seuils précis, reco finale solide | **10/10** |

## Verdict recherche — top 25 modèles

```
🥇 **Step-3.5-Flash (payant)** 💰 (10/10)
   La réponse d'architecture la plus complète du benchmark. Chiffres béton, TCO explicite, architecture recommandée, précautions concrètes.
   Pour de l'analyse ou de l'architecture, c'est premium.
   Pour du code complet, c'est inutilisable (timeout).
🥈 Haiku 4.5 (10/10)
   Le plus complet, chiffré, décisionnel.
🥉 GLM-4.7 (9/10)
   Excellent arbitrage, chiffres réels, très net.
4e GLM-5 (9/10)
   Riche, sourcé, très mature.
5e k2p5 (9/10)
   Seuils mémorisables et utiles.
6e Hunter Alpha (9/10)
   Meilleure contextualisation terrain.
7e MiniMax-M2.7-highspeed (9/10)
   Excellent décideur récent.
8e Sonnet 4.6 (8/10)
   Profond, un peu moins tranchant.
9e Qwen3.6-plus (9/10)
   Chiffres solides, TCO, alternatives, très actionnable.
10e Trinity (8/10)
   Consulting gratuit solide.
11e MiniMax-M2.7 (8/10)
   Benchmarks sourcés, seuils clairs.
12e MiMo v2 Pro (8/10)
   Propre, exploitable.
13e Step-3.5-Flash (free) (8/10)
   Toujours un des meilleurs rapports qualité/prix.
14e GLM-4.7-Flash (8/10)
   Flash très rentable.
15e MiniMax-M2.5-highspeed (8/10)
   Propre et rapide.
16e Gemini Flash (8/10)
   Pragmatique et utile.
17e MiniMax-M2.5 (8/10)
   Bon modèle global.
18e GLM-5-Turbo (7/10)
   FTS5-first cohérent.
19e GPT-5.4 (6/10)
   Honnête mais peu décisionnel.
20e Healer Alpha (6/10)
   Utile mais léger.
❌ GPT-OSS-120b (0/10)
❌ Nemotron-3 (0/10 — DNF)
❌ GLM-4.5-Air (0/10 — DNF)
```

---

# 🏆 VERDICT FINAL — 25 modèles

## Tableau de synthèse complet

| Modèle | Code | Logs | Web | Total /50 |
|--------|------|------|-----|----------:|
| Haiku 4.5 | 10 | 8 | 10 | **50** |
| GLM-4.7 | 10 | 10 | 10 | **49** |
| Sonnet 4.6 | 9 | 9 | 9 | **47** |
| GLM-5 | 9 | 10 | 10 | **48** |
| **Step-3.5-Flash (payant)** 💰 | **0** | **8** | **10** | **18** |
| MiniMax-M2.7-highspeed | 9 | 9 | 10 | **47** |
| k2p5 | 8 | 9 | 10 | **45** |
| Trinity | 8 | 9 | 9 | **45** |
| Hunter Alpha | 8 | 10 | 9 | **44** |
| MiniMax-M2.5-highspeed | 9 | 8 | 9 | **44** |
| MiniMax-M2.7 | 8 | 10 | 8 | **44** |
| Qwen3.6-plus | 8 | 8 | 9 | **44** |
| MiMo v2 Pro | 8 | 8 | 8 | **42** |
| **Step-3.5-Flash (free)** 🆓 | 7 | 2 | 8 | **17** |
| GLM-5 | 9 | 10 | 10 | **48** |
| k2p5 | 8 | 9 | 10 | **45** |
| Trinity | 8 | 9 | 9 | **45** |
| Hunter Alpha | 8 | 10 | 9 | **44** |
| MiniMax-M2.5-highspeed | 9 | 8 | 9 | **44** |
| MiniMax-M2.7 | 8 | 10 | 8 | **44** |
| GLM-4.7-Flash | 7 | 7 | 8 | **39** |
| GLM-5-Turbo | 7 | 8 | 7 | **38** |
| Healer Alpha | 6 | 7 | 6 | **33** |
| GPT-OSS-120b | 8 | 6 | 0 | **31** |
| GPT-5.4 | 6 | 5 | 6 | **30** |
| Nemotron-3 | 0 | 0 | 0 | **0** |
| GLM-4.5-Air | 0 | 0 | 0 | **0** |

## Classement final (25 modèles)

```
🥇 Haiku 4.5 (50/50)
   Le patron historique. Toujours imprenable.

🥈 GLM-4.7 (49/50)
   La grosse machine z.ai. Monstrueux en code, excellent partout.

🥉 GLM-5 (48/50)
   Le premium le plus équilibré et mature de z.ai.

4e Sonnet 4.6 (47/50)
   Excellence technique pure.

5e MiniMax-M2.7-highspeed (47/50)
   Premium compact très sérieux.

6e k2p5 (45/50)
   L'équilibre premium.

7e Trinity (45/50)
   Le gratuit ultra-sérieux. Tient la comparaison.

8e Hunter Alpha (44/50)
   Le détective du benchmark.

8e MiniMax-M2.5-highspeed (44/50)
   Très bonne première génération MiniMax.

9e MiniMax-M2.7 (44/50)
   Sérieux technique confirmé.

10e Qwen3.6-plus (44/50)
   Gratuit sérieux, fiable sur les 3 tâches.

11e **Step-3.5-Flash (payant)** 💰 (18/50)
   Excellence absolue sur FTS5/ES et logs, mais échec total sur code.

12e **Step-3.5-Flash (free)** 🆓 (17/50)
   Toujours un des meilleurs rapports qualité/prix.

13e GLM-4.7-Flash (39/50)
   Flash solide, mais nettement sous les gros modèles z.ai.

14e MiniMax-M2.5 (41/50)
   Bon modèle global, plus classique.

15e MiniMax-M2.5-highspeed (41/50)
   Bon partout, roi nulle part.

16e Gemini Flash (41/50)
   Bon partout, roi nulle part.

17e GLM-5-Turbo (38/50)
   Compact, utile, moins premium.

18e GLM-5 (48/50)
   Équilibré mais moins brillant que GLM-4.7.

19e GPT-5.4 (30/50)
   Le payant qui souffre le plus de la comparaison globale.

20e Healer Alpha (33/50)
   Bonne valeur de prototypage.

❌ GPT-OSS-120b (31/50)
❌ Nemotron-3 (0/50 — DNF)
❌ GLM-4.5-Air (0/50 — DNF)
```

---

## 💡 Méta-enseignements du benchmark v16

1. **Step-3.5-Flash payant : l'architecte système paradoxe.** La version payante de Step-3.5-Flash livre une performance d'architecte absolument top niveau sur les tâches analytiques (logs 10/10, FTS5/ES 10/10), avec des recommandations d'ingénieur senior. Pourtant, sur la tâche code, elle échoue totalement (timeout sans aucun contenu). C'est un comportement étrange — comme si le modèle était optimisé pour l'analyse et la synthèse, mais incapable de générer du code sous contrainte.

2. **Step-3.5-5-free : le meilleur gratuit récent.** La version gratuite a un score solide de 41/50, avec des réponses cohérentes sur les 3 tâches. Pour 100K produits, la reco FTS5 est fiable et la réponse est actionnable. En code, l'AVL avec 12 tests est simple mais fonctionnel.

3. **Le paradoxe gratuit/payant.** Pour ce modèle, on a un paradoxe : la version gratuite (17/50) délivre un code fonctionnel (12 tests) alors que la version payante (18/50) échoue totalement (timeout). Cela suggère que le modèle gratuit est mieux adapté aux tâches "simples" et que la version payante a des contraintes de sortie plus strictes qui le bloquent sur la génération de code.

4. **Qwen3.6-plus reste fiable.** À 44/50, il dépasse la version gratuite Step-3.5 en logs et FTS5, et égale le modèle payant sur le Web (9/10). C'est probablement le meilleur modèle gratuit récent sur le marché.

5. **Les modèles chinois montent.** Qwen3.6-plus (Alibaba) s'intègre dans le haut du tableau (44/50, juste derrière Trinity), validant que les modèles chinois (Alibaba, Z-AI, Xiaomi) sont de véritables concurrents sérieux dans le benchmark.

---

## 📋 Recommandations d'usage (mise à jour v16)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** ou **GLM-4.7** | robustesse maximale vs copie code monstrueuse |
| Modèle premium équilibré | **GLM-5** | très bon partout, très sain |
| Excellence architecture | **Sonnet 4.6** | pensée d'ingénieur senior |
| Analyste SRE | **Step-3.5-Flash (payant)** 💰 | excellent sur logs et FTS5/ES, priorisé et lisible |
| Décision rapide produit/infra | **Step-3.5-Flash (payant)** 💰 | 10/10 sur FTS5/ES, recommandations concrètes |
| Gratuit complet moderne | **Trinity** 🆓 ou **Qwen3.6-plus** 🆓 | 45 et 44/50, propres sur les 3 tâches |
| Analyse causale incident | **Hunter Alpha** 🆓 | cause racine > symptôme |
| Modèle fiable gratuit | **Step-3.5-Flash (free)** 🆓 | 7/17, très cohérent, excellent ratio qualité/prix |
| Pour du code complet | **Step-3.5-Flash (payant)** 💰 ou **GLM-4.7** | avoid Step-3.5-Flash payant (timeout), utiliser la version gratuite ou un modèle premium |
| Gratuit éviter pour code | **Step-3.5-Flash (free)** 🆓 | code utilisable mais timeout | **Step-3.5-Flash (payant)** 💰 | avoid la version gratuite pour code, modèle payant plus cohérent |
| Éviter | **GLM-4.5-Air**, **Nemotron-3** | DNF |

---

*Dernière mise à jour : 2026-03-31 — v16 corrige README-v15 corrompu + ajoute Step-3.5-Flash (payant) 18/50, classement complet*
