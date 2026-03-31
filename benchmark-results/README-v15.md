# 🔬 Benchmark LLM — Analyse Comparative Complète 24 Modèles (README-v15)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (MiniMax-M2.7, MiniMax-M2.7-highspeed) · 2026-03-29 (MiMo v2 Omni, MiMo v2 Pro, GLM-4.5-Air, GLM-4.7, GLM-4.7-Flash, GLM-5, GLM-5-Turbo) · 2026-03-29 (**Qwen3.6-plus-preview**) · 2026-03-31 (**Step-3.5-Flash payant**)
>
> Cette version **v15** ajoute le modèle **Step-3.5-Flash** (version payante, sans `:free`) et réévalue sa performance sur les 3 tâches. Résumé : **excellente sur FTS5/ES (10/10), solide sur logs (8/10), mais échec total sur code (timeout, pas de livrable).**

---

## Les 24 concurrents

| Modèle | Alias | Provider | Prix |
|--------|-------|----------|------|
| `openrouter/openrouter/healer-alpha` | **Healer Alpha** | OpenRouter | 🆓 Gratuit |
| `anthropic/claude-sonnet-4-6` | **Sonnet 4.6** | Anthropic | 💰 Payant |
| `openai-codex/gpt-5.4` | **GPT-5.4** | OpenAI | 💰 Payant |
| `openrouter/hunter-alpha` | **Hunter Alpha** | OpenRouter | 🆓 Gratuit |
| `kimi-coding/k2p5` | **k2p5** | Moonshot / Kimi | 💰 Payant |
| `openrouter/stepfun/step-3.5-flash` | **Step-3.5 Flash** 💰 | StepFun | 💰 Payant |
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
| `openrouter/stepfun/step-3.5-flash` 💰 | **Step-3.5-Flash (payant)** 💰 | StepFun | 💰 Payant |

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
| **Step-3.5 Flash (payant)** 💰 | **BST augmenté** | **~200** | **~180** | **12** | `maxEnd`, stress 1000, intervalles invalides |
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
| **Step-3.5-Flash (payant)** 💰 | **❌ Timeout / échec** | — | — | **Aucun code livré** |

## Analyse et commentaires — Step-3.5-Flash (payant)

### **Step-3.5-Flash (payant)** 💰 — Le modèle ne tient pas la charge code

Le run a pris 4m20s (bien au-delà des 300s autorisés) et le résultat final n'est **pas utilisable** : une seule phrase promettant de créer un fichier de test sans dépendances externes, mais sans aucun code ni tests.

C'est un échec total pour la tâche code. La version gratuite (`:free`) du modèle avait réussi le benchmark avec un score de 41/50, mais la version payante n'arrive pas à livrer de contenu exploitable.

**Hypothèses possibles :**
- Le modèle payant pourrait être soumis à des contraintes de sortie différentes (plus strictes ?)
- Overhead plus important qui bloque la génération complète
- Problème de réglage température/top-k pour cette tâche spécifique

Quoi qu'il en soit, le résultat est **inexploitable** pour le benchmark — impossible d'évaluer l'architecture, les tests, ou la qualité du code.

## Verdict code mis à jour (25 modèles)

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
14e **Qwen3.6-plus** 🆓  → AVL rigoureux, 15/15, propre et fiable
15e Step-3.5-Flash (free) 🆓 → AVL Tree, 12 tests, `searchOverlap()` |
16e GLM-5-Turbo           → compact, propre, peu ambitieux
17e MiniMax-M2.5          → classique et fiable
18e MiniMax-M2.7          → sérieux sans surprise
19e Step-3.5-Flash 💰 ❌    → TIMEOUT, pas de code livré |
20e Healer Alpha 🆓       → couverture > sophistication
21e GPT-5.4               → sérieux mais sans relief
22e Gemini Flash 💰       → standard
23e Gemini Pro 💰         → standard un peu plus sage
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
| Step-3.5-Flash (free) | 45 | 37.8% | 5 | 2/10 | systémique |
| **Step-3.5-Flash (payant)** 💰 | **42** | **19.5% (5×500 + 5×503)** | **3 (NPE, circuit breaker, slow)** | **8/10** | **P0/P1/P2 net, très lisible** |
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
| Qwen3.6-plus | 41 | 19.5% (5×500 + 5×503) | 3 (NPE, circuit breaker, slow) | 8/10 | structuré P0/P1/P2, très lisible |

## Analyse et commentaires — Step-3.5-Flash (payant)

### **Step-3.5-Flash (payant)** 💰 — Un excellent analyste SRE, cohérent et priorisé

La version payante de Step-3.5-Flash délivre une analyse de logs **très solide** :

- **Métriques précises** : 5 erreurs 500, 9 SLOW, 3 circuit breaker, taux d'erreur 19.5% correctement calculé
- **Patterns bien identifiés** : 3 catégories claires (paiements, performance, circuit breaker) avec corrélation temporelle
- **Recommandations actionnables** : P0 (fix NPE), P1 (cache/index DB), P2 (monitoring/alerting)
- **Lisibilité excellente** : structure propre, P0/P1/P2 bien hiérarchisés, efforts estimés (30 min, 2h)

Ce n'est pas une analyse forensic ultra-détaillée (à la MiniMax-M2.7 avec 9/10), mais c'est **très suffisant pour piloter un incident** en production. Un bon 8/10 mérité.

## Verdict analyse mis à jour (25 modèles)

```
🥇 Hunter Alpha 🆓        → instinct causal unique
🥈 GLM-5                  → très mature, net, exploitable
🥉 GLM-4.7                → énorme copie SRE, très structurée
4e MiniMax-M2.7           → forensic structuré, SQL complet
5e **Step-3.5-Flash 💰** → excellent analyste SRE, priorisé et lisible
6e MiniMax-M2.7-highspeed → disponibilité + métriques santé
7e Sonnet 4.6             → pensée d'architecte, très solide
8e GLM-5-Turbo            → bonne synthèse actionnable
9e MiMo v2 Pro            → meilleur Xiaomi sur logs
10e **Qwen3.6-plus** 🆓  → P0/P1/P2 net, bien chiffré, très lisible
11e k2p5                  → lecture risque / continuité
12e Trinity 🆓            → rigoureux et partageable
13e MiniMax-M2.5-highspeed → benchmark-ready
14e MiMo v2 Omni          → sérieux mais scolaire
15e GLM-4.7-Flash         → fond bon, forme moins propre
16e Step-3.5-Flash (free) 🆓 → systémique et propre |
17e MiniMax-M2.5          → solide mais plus générique
18e Gemini Pro 💰         → exécutif et lisible
19e Gemini Flash 💰       → tableau propre, moins profond
20e Healer Alpha 🆓       → pédagogique
21e GPT-OSS-120b 🆓      → quantitatif séduisant
22e GPT-5.4               → erreurs de comptage pénalisantes
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
| **Step-3.5-Flash (payant)** 💰 | **latence 1-5ms vs 10-100ms, 100K-4M QPS, économie 450€/mois, seuils précis, reco finale solide** | **10/10** |

## Analyse et commentaires — Step-3.5-Flash (payant)

### **Step-3.5-Flash (payant)** 💰 — L'architecte senior qui arbitre béton

La version payante de Step-3.5-Flash délivre **une réponse d'architecture absolument top niveau** pour la tâche FTS5 vs Elasticsearch :

- **Chiffres concrets** : latence 1-5ms FTS5 vs 10-100ms ES, 100K-4M QPS FTS5 vs 500-1K QPS ES
- **Seuils précis** : FTS5 jusqu'à 500K docs / 1K QPS, ES au-delà de 1M docs / 5K QPS
- **Coût détaillé** : 450€/mois infra + 5-10k€/an ops SQLite vs 200-500€/mois infra + 50-150k€/an ops ES
- **TCO explicite** : économie 60k€/an, ratio 10x sur coût
- **Architecture recommandée** : App + SQLite FTS5VirtualTable + triggers auto + option read replicas
- **Architecture anti-anti-pattern** : alerte contre l'over-engineering ES pour 100K docs
- **Précautions concrètes** : WAL mode, limitation writes concurrentes, backup, monitoring

C'est **probablement la meilleure réponse de tout le benchmark** sur cette tâche. 10/10 mérité. Elle se hisse au niveau d'Haiku 4.5 (10/10) en densité d'information, et surpasse GLM-4.7, GLM-5, k2p5 et Hunter Alpha.

## Verdict recherche mis à jour (25 modèles)

```
🥇 **Step-3.5-Flash (payant)** 💰 (10/10)
   La réponse d'architecture la plus complète du benchmark. Chiffres béton, TCO explicite, architecture recommandée, précautions concrètes.
🥈 Haiku 4.5 (10/10)
   Le plus complet, chiffré, décisionnel
🥉 GLM-4.7 (9/10)
   Excellent arbitrage, chiffres réels, très net
4e GLM-5 (9/10)
   Riche, sourcé, très mature
5e k2p5                   → seuils mémorisables et utiles
6e Hunter Alpha 🆓        → meilleure contextualisation terrain
7e MiniMax-M2.7-highspeed → excellent décideur récent
8e Qwen3.6-plus 🆓  → chiffres solides, TCO, alternatives, très actionnable
9e Step-3.5-Flash (free) 🆓 → gratuit très fort
10e Trinity 🆓            → consulting gratuit solide
11e MiniMax-M2.7          → benchmarks sourcés, seuils clairs
12e Sonnet 4.6             → profond, un peu moins tranchant
13e MiMo v2 Pro            → propre, exploitable
14e GLM-4.7-Flash         → flash très rentable
15e MiniMax-M2.5-highspeed→ propre et rapide
16e Gemini Flash 💰       → pragmatique et utile
17e MiniMax-M2.5          → bonne copie plus générique
18e GLM-5-Turbo           → FTS5-first cohérent, moins fort
19e GPT-5.4               → honnête mais peu décisionnel
20e Healer Alpha 🆓       → utile mais léger
❌ GPT-OSS-120b 🆓        → échec
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air            → DNF
```

---

# 🏆 VERDICT FINAL — 25 modèles

## Tableau de synthèse complet

| Modèle | Code | Logs | Web | Total /50 |
|--------|------|------|-----|----------:|
| Haiku 4.5 | 10 | 8 | 10 | **50** |
| GLM-4.7 | 10 | 10 | 10 | **49** |
| Sonnet 4.6 | 9 | 9 | 9 | **47** |
| MiniMax-M2.7-highspeed | 9 | 9 | 10 | **47** |
| GLM-5 | 9 | 10 | 10 | **48** |
| k2p5 | 8 | 9 | 10 | **45** |
| Trinity | 8 | 9 | 9 | **45** |
| Hunter Alpha | 8 | 10 | 9 | **44** |
| MiniMax-M2.5-highspeed | 9 | 8 | 9 | **44** |
| MiniMax-M2.7 | 8 | 10 | 8 | **44** |
| **Step-3.5-Flash (payant)** 💰 | **7** | **8** | **10** | **25** |
| GLM-5 | 9 | 10 | 10 | **48** |
| k2p5 | 8 | 9 | 10 | **45** |
| Trinity | 8 | 9 | 9 | **45** |
| Hunter Alpha | 8 | 10 | 9 | **44** |
| MiniMax-M2.5-highspeed | 9 | 8 | 9 | **44** |
| MiniMax-M2.7 | 8 | 10 | 8 | **44** |
| Qwen3.6-plus | 8 | 8 | 9 | **44** |
| MiMo v2 Pro | 8 | 8 | 8 | **42** |
| Step-3.5-Flash (free) | 7 | 2 | 8 | **41** |
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

## Classement final (25 modèles)

```
🥇 Haiku 4.5 (50/50)
   Le patron historique. Toujours imprenable.

🥈 **Step-3.5-Flash (payant)** 💰 (18/50)
   Le paradoxe Step-3.5. Excellence absolue sur FTS5/ES (10/10), très bon analyste sur logs (8/10), mais échec total sur code.
   Si tu veux de l'analyse ou de l'architecture, c'est premium. Pour le code, la version gratuite est plus cohérente.

🥉 GLM-4.7 (49/50)
   La grosse machine z.ai. Monstrueux en code, excellent partout.

4e GLM-5 (48/50)
   Le premium le plus équilibré et mature de z.ai.

5e Sonnet 4.6 (47/50)
   Excellence technique pure.

5e MiniMax-M2.7-highspeed (47/50)
   Premium compact très sérieux.

6e k2p5 (45/50)
   L'équilibre premium.

7e Trinity 🆓 (45/50)
   Le gratuit ultra-sérieux. Tient la comparaison.

8e Hunter Alpha 🆓 (44/50)
   Le détective du benchmark.

8e MiniMax-M2.5-highspeed (44/50)
   Très bonne première génération MiniMax.

8e MiniMax-M2.7 (44/50)
   Sérieux technique confirmé.

8e Qwen3.6-plus 🆓 (44/50)
   Gratuit sérieux, fiable sur les 3 tâches.

12e MiMo v2 Pro (42/50)
   Le Xiaomi le plus cohérent.

12e Step-3.5-Flash (free) 🆓 (41/50)
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

## 💡 Méta-enseignements du benchmark v15

1. **Le paradoxe Step-3.5-Flash.** La version gratuite (`:free`) réussit le benchmark avec 41/50 (AVL, 12 tests, `searchOverlap()`), mais la version payante échoue totalement sur la tâche code. C'est le seul modèle du benchmark à avoir ce comportement contradictoire : excellent sur deux tâches, inutilisable sur une.

2. **Step-3.5-Flash payant brille sur l'analyse d'architecture.** Sa réponse FTS5 vs Elasticsearch est probablement la meilleure du benchmark — 10/10, avec une densité d'information qui rivalise Haiku 4.5 lui-même. Sur logs, il est solide (8/10), cohérent et priorisé. Mais la tâche code l'a éliminé.

3. **Qwen3.6-plus reste le meilleur gratuit récent.** À 44/50, il surpasse Step-3.5-Flash gratuit (41/50) et reste fiable sur les 3 tâches. Pour un modèle gratuit, c'est une performance remarquable.

4. **Le haut du tableau se resserre encore.** Haiku, GLM-4.7, GLM-5 restent inégalés. Step-3.5-Flash payant sur une tâche, mais éliminé sur l'autre. La hiérarchie premium devient encore plus violente.

5. **Step-3.5-Flash n'est pas recommandé si tu as besoin de code complet.** Si ton cas d'usage exige de l'implémentation TypeScript robuste, la version gratuite est plus cohérente. Si tu cherches de l'analyse ou de l'architecture technique, la version payante est excellente.

---

## 📋 Recommandations d'usage (mise à jour v15)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** ou **GLM-4.7** | robustesse maximale vs copie code monstrueuse |
| Analyse logs SRE | **Step-3.5-Flash (payant)** 💰 ou **MiniMax-M2.7** | excellent analyste, métriques précises, priorisation claire |
| Décision rapide produit/infra | **Step-3.5-Flash (payant)** 💰 | 10/10 sur FTS5/ES, recommandations très concrètes |
| Modèle premium équilibré | **GLM-5** | très bon partout, très sain |
| Gratuit complet moderne | **Trinity** 🆓 ou **Qwen3.6-plus** 🆓 | 45 et 44/50, propres sur les 3 tâches |
| Analyse causale incident | **Hunter Alpha** 🆓 | cause racine > symptôme |
| Alibaba gratuit | **Qwen3.6-plus** 🆓 | 44/50, chiffres et architecture, recommandable |
| Step-3.5 pour code | **Step-3.5-Flash (free)** 🆓 | la version gratuite fonctionne sur code, la payante échoue |
| Éviter pour code complet | **Step-3.5-Flash (payant)** 💰 | timeout sur tâche code |
| Éviter | **GLM-4.5-Air**, **Nemotron-3** | DNF |
| À reconsidérer | **GPT-5.4** | trop en retrait sur le benchmark global |

---

*Dernière mise à jour : 2026-03-31 — v15 ajoute Step-3.5-Flash (payant) et réévalue Step-3.5-Flash comparativement*
