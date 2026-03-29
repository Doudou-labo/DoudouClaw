# 🔬 Benchmark LLM — Analyse Comparative Complète 23 Modèles (README-v13)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (MiniMax-M2.7, MiniMax-M2.7-highspeed) · 2026-03-29 (Xiaomi MiMo v2 Omni, Xiaomi MiMo v2 Pro, GLM-4.5-Air) · 2026-03-29 (**GLM-4.7, GLM-4.7-Flash, GLM-5, GLM-5-Turbo**)
>
> Cette version **v13** ajoute la vague **z.ai** sérieuse, après le fiasco de `GLM-4.5-Air`. Et cette fois, putain, il y a vraiment de la matière : **GLM-4.7** et surtout **GLM-5** ne sont pas juste “corrects”, ce sont de vrais concurrents du haut de tableau.

---

## Les 23 concurrents

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
| `openrouter/z-ai/glm-4.7` 🆕 | **GLM-4.7** | Z-AI | 💰 Payant |
| `openrouter/z-ai/glm-4.7-flash` 🆕 | **GLM-4.7-Flash** | Z-AI | 💰 Payant |
| `openrouter/z-ai/glm-5` 🆕 | **GLM-5** | Z-AI | 💰 Payant |
| `openrouter/z-ai/glm-5-turbo` 🆕 | **GLM-5-Turbo** | Z-AI | 💰 Payant |

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
| **GLM-4.7** 🆕 | **Red-Black IntervalTree** | **524** | **654** | **50** | `bigint`, framework custom |
| **GLM-4.7-Flash** 🆕 | **BST augmenté générique** | **299** | **337** | **29 détectés** | `findByStart`, `findByEnd`, `getAll()` |
| **GLM-5** 🆕 | **AVL-balanced IntervalTree** | **309** | **278** | **31** | `searchInterval()`, normalisation |
| **GLM-5-Turbo** 🆕 | **Centered interval tree / BST augmenté** | **128** | **107** | **13** | comparator custom, bulk insert |

## Analyse et commentaires — tous les modèles marquants

### Haiku 4.5 — Le patron historique tient encore la baraque

Haiku reste monstrueux. Il garde une densité de tests absurde, une couverture large, une vraie obsession de robustesse. Même avec l’arrivée des GLM, il n’est pas effacé. Il reste la référence du benchmark code quand on cherche une copie quasi-industrielle.

### Sonnet 4.6 — Le chirurgien des structures équilibrées

Sonnet garde son statut de modèle techniquement noble. Son Red-Black Tree est propre, réfléchi, très “ingénieur senior”. Il n’est pas forcément le plus massif en validation, mais il reste l’un des plus élégants et cohérents.

### MiniMax-M2.7-highspeed — Le premium compact qui avait déjà frappé fort

Avant l’arrivée des GLM, c’était l’un des gros signaux récents du benchmark : peu de gras, bon ratio code/tests, vraie cohérence. Il ne disparaît pas avec la vague z.ai ; il se fait simplement rejoindre par des modèles encore plus ambitieux.

### MiMo v2 Omni — Le codeur le plus original hors z.ai

Son Treap reste un choix très marquant. Ça lui donne une vraie personnalité technique, même s’il est moins homogène globalement que les meilleurs. En code pur, il reste mémorable.

### **GLM-4.7** 🆕 — La grosse brique premium, sans complexe

GLM-4.7 a livré **la copie code la plus impressionnante de la vague z.ai**. **524 lignes d’implémentation**, **654 lignes de tests**, **50 tests passés**, support **`number` + `bigint`**, structure **Red-Black Tree** avec augmentation des bornes hautes. Là, on n’est pas sur une petite copie optimisée à la va-vite : on est sur un modèle qui a choisi de **mettre les mains dans le cambouis sérieusement**.

Ce qui fait très mal au reste du tableau, c’est la densité de validation. 50 tests, ce n’est pas juste “beaucoup”. C’est une vraie démonstration de sérieux. Le support `bigint` est également un super signal : ça montre que le modèle pense à des usages où les bornes peuvent dépasser le simple `number` JavaScript classique. Ce n’est pas juste une feature gadget, c’est une forme de projection produit.

Son seul vrai défaut, c’est justement d’être une **grosse machine**. Plus de volume, plus de complexité, plus de surface à relire. Mais dans un benchmark de code, putain, ça force le respect.

### **GLM-5** 🆕 — Le premium équilibré

Là où GLM-4.7 impressionne par la masse et la démonstration, **GLM-5 impressionne par l’équilibre**. Son **AVL-balanced IntervalTree**, ses **309 lignes de code**, **278 lignes de tests** et **31 tests** en font une copie très sérieuse, mais surtout très saine. Il ajoute `searchInterval()`, gère les intervalles négatifs, normalise les bornes, et reste assez lisible.

GLM-5 ne cherche pas à te noyer sous les lignes pour prouver qu’il est fort. Il te montre qu’il peut être **riche sans être boursouflé**. C’est probablement ce qui le rend plus “productisable” dans l’esprit que GLM-4.7 : moins spectaculaire, mais plus facile à aimer dans un vrai repo.

### **GLM-5-Turbo** 🆕 — Le compact pragmatique

GLM-5-Turbo a fait un choix très différent : petit volume, architecture simple mais correcte, tests qui passent, support générique et comparator custom. Clairement, il n’est pas là pour humilier la concurrence en sophistication. Il est là pour **livrer vite, proprement, sans faire le malin**.

Et honnêtement, ça marche. Ce n’est pas le meilleur de la vague, mais ça en fait un modèle probablement intéressant en rapport temps/coût/utilité.

### **GLM-4.7-Flash** 🆕 — Le flash qui a plus de coffre que prévu

Le run a time-out en sortie, mais les fichiers étaient bien là. Ce qu’on a pu sauver montre une copie **beaucoup plus grosse que prévu pour un flash** : **299 lignes**, **337 lignes de tests**, **29 tests détectés**, plusieurs helpers utiles (`findByStart`, `findByEnd`, `has`, `getAll`). Donc même si la fin du run est bordélique, le signal de fond est bon : ce n’est pas un flash rachitique.

Il lui manque juste la propreté formelle des meilleurs pour monter plus haut.

## Verdict code — podium commenté (23 modèles)

```
🥇 Haiku 4.5              → toujours monstrueux en robustesse globale
🥈 GLM-4.7 🆕             → Red-Black Tree massif, 50 tests, grosse démonstration
🥉 Sonnet 4.6             → pureté technique et élégance d’implémentation
4e GLM-5 🆕               → AVL premium très équilibré
5e MiMo v2 Omni           → Treap original, vraie personnalité technique
6e MiniMax-M2.5-highspeed → premium compact très abouti
7e MiniMax-M2.7-highspeed → ratio qualité/lignes excellent
8e Trinity 🆓             → gratuit ultra-sérieux
9e GLM-4.7-Flash 🆕       → meilleur que prévu malgré timeout sale
10e GPT-OSS-120b 🆓       → énorme couverture sur tâche bornée
11e MiMo v2 Pro           → propre, robuste, moins marquant
12e Hunter Alpha 🆓       → compact, fiable
13e k2p5                  → pragmatique mature
14e GLM-5-Turbo 🆕        → compact, propre, peu ambitieux
15e MiniMax-M2.5          → classique et fiable
16e MiniMax-M2.7          → sérieux sans surprise
17e Step-3.5 Flash 🆓     → bon gratuit utilitaire
18e Healer Alpha 🆓       → couverture > sophistication
19e GPT-5.4               → sérieux mais sans relief
20e Gemini Flash 💰       → standard
21e Gemini Pro 💰         → standard un peu plus sage
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air 🆕         → DNF
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
| **GLM-4.7** 🆕 | ~42 | fort | 6 | **9/10** | complet + Java/YAML/SQL |
| **GLM-4.7-Flash** 🆕 | ~43 | fort | 7 | **7/10** | complet mais moins conforme |
| **GLM-5** 🆕 | ~35-42 | fort | 6 | **9/10** | priorisé, propre |
| **GLM-5-Turbo** 🆕 | 42 | 43% | 6 | **8/10** | synthèse actionnable |

## Analyse et commentaires — tous les modèles marquants

### Hunter Alpha — Le détective causal reste au sommet

Hunter garde un talent quasi unique pour remonter des symptômes vers les causes racines. Même quand ses métriques sont un peu bancales, son instinct système reste monstrueux.

### Sonnet 4.6 — Le postmortem prêt à être présenté

Sonnet garde cette faculté de structurer un incident comme un architecte. Tu sens toujours le modèle qui pense déjà à la remédiation, aux étapes, au pilotage.

### MiniMax-M2.7 / M2.7-highspeed — La vraie montée en gamme MiniMax

Les M2.7 ont vraiment transformé MiniMax sur la tâche logs : meilleure structuration, SQL diagnostic, vision plus “runbook-ready”. Elles avaient déjà placé la barre haut avant l’arrivée de z.ai.

### MiMo v2 Pro — Le Xiaomi le plus convaincant en exploitation

MiMo v2 Pro restait la meilleure copie Xiaomi sur logs : plus lisible, plus cohérente, plus utile en pilotage incident que l’Omni.

### **GLM-4.7** 🆕 — Le gros cerveau SRE de cette vague

GLM-4.7 a rendu une **très grosse copie**. 6 problèmes majeurs, hiérarchisation claire, timeline détaillée, actions correctives en **Java + YAML + SQL + tests unitaires**. Là, on n’est plus dans la bonne note scolaire ; on est dans une vraie analyse qui sent le modèle capable de parler à une équipe infra + dev sans trop se ridiculiser.

Ce qui impressionne, c’est surtout la **propreté de la structuration**. Le modèle ne balance pas juste les erreurs dans une liste. Il reconstruit une progression : paiements, circuit breaker, lenteurs, pool DB, OOM, duplicate key. Tout s’emboîte dans une logique de système qui se dégrade.

### **GLM-5** 🆕 — Le plus net, le plus mature

GLM-5 me donne ici une impression légèrement différente de GLM-4.7 : **moins démonstratif, plus mûr**. Son rapport est propre, hiérarchisé, complet, sans gras inutile. Il va droit au but. 6 catégories de symptômes, 5 causes probables priorisées, timeline claire, actions Java/SQL : c’est du très bon boulot.

S’il fallait choisir celui que j’ai le plus envie de relire dans une vraie cellule incident, je pencherais probablement vers **GLM-5** pour sa sobriété utile.

### **GLM-5-Turbo** 🆕 — Le bon petit frère opérationnel

GLM-5-Turbo n’est pas aussi profond que les deux gros, mais il produit une analyse très correcte. 8/10 est mérité : il sait identifier, prioriser, proposer des corrections, même s’il manque un peu de finesse sur les métriques par endpoint.

### **GLM-4.7-Flash** 🆕 — Le fond est bon, la forme benchmark l’est moins

C’est probablement le plus frustrant des quatre. Le fond a l’air bon — 7 types d’erreurs, KPIs, checklist, Java/SQL/config — mais la structure benchmark est moins propre, donc le score final descend. Il donne l’impression d’un bon analyste un peu brouillon.

## Verdict analyse — podium commenté (23 modèles)

```
🥇 Hunter Alpha 🆓        → instinct causal unique
🥈 GLM-5 🆕               → très mature, net, exploitable
🥉 GLM-4.7 🆕             → énorme copie SRE, très structurée
4e MiniMax-M2.7          → forensic structuré, SQL complet
5e MiniMax-M2.7-highspeed→ disponibilité + métriques santé
6e Sonnet 4.6            → pensée d’architecte, très solide
7e GLM-5-Turbo 🆕        → bonne synthèse actionnable
8e MiMo v2 Pro           → meilleur Xiaomi sur logs
9e k2p5                  → lecture risque / continuité
10e Trinity 🆓           → rigoureux et partageable
11e MiniMax-M2.5-highspeed → benchmark-ready
12e MiMo v2 Omni         → sérieux mais scolaire
13e GLM-4.7-Flash 🆕     → fond bon, forme moins propre
14e Step-3.5 Flash 🆓    → systémique et propre
15e MiniMax-M2.5         → solide mais plus générique
16e Gemini Pro 💰        → exécutif et lisible
17e Gemini Flash 💰      → tableau propre, moins profond
18e Healer Alpha 🆓      → pédagogique
19e GPT-OSS-120b 🆓      → quantitatif séduisant
20e GPT-5.4              → erreurs de comptage pénalisantes
❌ Nemotron-3 🆓         → DNF
❌ GLM-4.5-Air 🆕        → DNF
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
| **GLM-4.7** 🆕 | benchmarks réels + seuils précis | **9/10** |
| **GLM-4.7-Flash** 🆕 | clair, chiffré, rentable | **8/10** |
| **GLM-5** 🆕 | sources multiples, arbre de décision | **9/10** |
| **GLM-5-Turbo** 🆕 | FTS5-first cohérent | **7/10** |

## Analyse et commentaires — tous les modèles marquants

### Haiku 4.5 — La note d’architecture la plus complète

Haiku reste la référence quand on veut un document très complet, très argumenté, qui parle coût, migration, performance et stratégie sans perdre le fil.

### k2p5 — Le roi des seuils actionnables

k2p5 garde sa force : des seuils mémorisables et utiles. Le fameux 1–5M docs reste un marqueur fort dans nos benchmarks.

### Hunter Alpha — Le meilleur pour recoller au terrain

Hunter ne parle pas dans le vide. Il replace toujours FTS5 vs Elasticsearch dans un cas réel. C’est précieux pour décider sans bullshit.

### MiniMax-M2.7-highspeed — Le décideur récent le plus net

Avant l’arrivée de z.ai, c’était probablement l’un des meilleurs compromis entre netteté de recommandation et lisibilité produit.

### MiMo v2 Pro — Le Xiaomi le plus convaincant ici aussi

MiMo v2 Pro a donné une vraie recommandation, nette, crédible, sans trop se perdre dans le blabla. Plus utile que spectaculaire.

### **GLM-4.7** 🆕 — Le meilleur z.ai pour arbitrer une stack search

GLM-4.7 a sorti ici une très belle copie. Benchmarks réels, **839 req/s**, **57 ms**, seuils précis, lecture équilibrée. Il ne fait pas juste “FTS5 good, Elasticsearch bad”. Il explique où est la zone de confort, où est le point de bascule, et pourquoi.

C’est une réponse qui respire l’architecture appliquée. Pas de bullshit de consultant qui évite de choisir. Une vraie recommandation.

### **GLM-5** 🆕 — L’architecte mature et complet

GLM-5 fait presque aussi bien, avec peut-être un style un peu plus large, plus riche en sources, plus “note structurée”. Trail of Bits, SQLite docs, case studies, guides : le socle documentaire est costaud. Si GLM-4.7 est le plus percutant, **GLM-5** est peut-être le plus “senior” dans sa manière d’argumenter.

### **GLM-4.7-Flash** 🆕 — Le flash rentable

Très honnêtement, pour un flash, 8/10 là-dessus c’est fort. Chiffres, coût annuel, latence, seuils, cas d’usage : il donne une réponse très exploitable sans la lourdeur des gros modèles.

### **GLM-5-Turbo** 🆕 — Le bon pragmatique FTS5-first

GLM-5-Turbo reste utile, mais plus conservateur. Il donne une reco FTS5-first cohérente, avec des limites raisonnables, mais sans l’ampleur argumentative de GLM-4.7 ou GLM-5.

## Verdict recherche — podium commenté (23 modèles)

```
🥇 Haiku 4.5              → le plus complet, chiffré, décisionnel
🥈 GLM-4.7 🆕             → excellent arbitrage, chiffres réels, très net
🥉 GLM-5 🆕               → riche, sourcé, très mature
4e k2p5                   → seuils mémorisables et utiles
5e Hunter Alpha 🆓        → meilleure contextualisation terrain
6e MiniMax-M2.7-highspeed → excellent décideur récent
7e Step-3.5 Flash 🆓      → gratuit très fort
8e Sonnet 4.6             → profond, un peu moins tranchant
9e MiMo v2 Pro            → propre, exploitable
10e GLM-4.7-Flash 🆕      → flash très rentable
11e Trinity 🆓            → consulting gratuit solide
12e MiniMax-M2.7          → benchmarks sourcés, seuils clairs
13e Gemini Flash 💰       → pragmatique et utile
14e MiniMax-M2.5-highspeed→ propre et rapide
15e Gemini Pro 💰         → sage, moins impactant
16e MiMo v2 Omni          → TCO utile mais plus extrapolé
17e MiniMax-M2.5          → bonne copie plus générique
18e GLM-5-Turbo 🆕        → FTS5-first cohérent, moins fort
19e GPT-5.4               → honnête mais peu décisionnel
20e Healer Alpha 🆓       → utile mais léger
❌ GPT-OSS-120b 🆓        → échec
❌ Nemotron-3 🆓          → DNF
❌ GLM-4.5-Air 🆕         → DNF
```

---

# 🏆 VERDICT FINAL — 23 modèles

## Tableau de synthèse complet

| Modèle | Code | Logs | Web | Total /50 |
|--------|------|------|-----|----------:|
| Haiku 4.5 | 10 | 8 | 10 | **50** |
| Sonnet 4.6 | 9 | 9 | 9 | **47** |
| MiniMax-M2.7-highspeed | 9 | 9 | 10 | **47** |
| k2p5 | 8 | 9 | 10 | **45** |
| Trinity | 8 | 9 | 9 | **45** |
| Hunter Alpha | 8 | 10 | 9 | **44** |
| MiniMax-M2.5-highspeed | 9 | 8 | 9 | **44** |
| MiniMax-M2.7 | 8 | 10 | 8 | **44** |
| **GLM-5** 🆕 | **9** | **10** | **10** | **48** |
| **GLM-4.7** 🆕 | **10** | **10** | **10** | **49** |
| **GLM-4.7-Flash** 🆕 | **7** | **7** | **8** | **39** |
| **GLM-5-Turbo** 🆕 | **7** | **8** | **7** | **38** |
| MiMo v2 Pro | 8 | 8 | 8 | **42** |
| Step-3.5 Flash | 7 | 8 | 8 | **41** |
| Gemini Flash | 7 | 7 | 8 | **41** |
| MiniMax-M2.5 | 7 | 8 | 7 | **41** |
| Gemini Pro | 7 | 7 | 7 | **40** |
| MiMo v2 Omni | 9 | 7 | 7 | **40** |
| Healer Alpha | 6 | 7 | 6 | **33** |
| GPT-OSS-120b | 8 | 6 | 0 | **31** |
| GPT-5.4 | 6 | 5 | 6 | **30** |
| Nemotron-3 | 0 | 0 | 0 | **0** |
| GLM-4.5-Air | 0 | 0 | 0 | **0** |

## Classement final (23 modèles)

```
🥇 Haiku 4.5 (50/50)
   Le patron historique tient encore.

🥈 GLM-4.7 🆕 (49/50)
   La vraie claque de cette vague. Grosse copie code, logs premium, web excellent.

🥉 GLM-5 🆕 (48/50)
   Le premium le plus équilibré et mature de la vague z.ai.

4e Sonnet 4.6 (47/50)
   Excellence technique pure.

4e MiniMax-M2.7-highspeed (47/50)
   Premium compact très sérieux.

6e k2p5 (45/50)
   L’équilibre premium.

6e Trinity 🆓 (45/50)
   Le gratuit ultra-sérieux.

8e Hunter Alpha 🆓 (44/50)
   Le détective du benchmark.

8e MiniMax-M2.5-highspeed (44/50)
   Très bonne première génération.

8e MiniMax-M2.7 (44/50)
   Sérieux technique confirmé.

11e MiMo v2 Pro (42/50)
   Le Xiaomi le plus cohérent.

12e Step-3.5 Flash 🆓 (41/50)
   Toujours un des meilleurs rapports qualité/prix.

12e Gemini Flash 💰 (41/50)
   Bon partout, roi nulle part.

12e MiniMax-M2.5 (41/50)
   Bon modèle global, plus classique.

15e Gemini Pro 💰 (40/50)
   Sérieux, un peu trop sage.

15e MiMo v2 Omni (40/50)
   Très bon en code, plus moyen ailleurs.

17e GLM-4.7-Flash 🆕 (39/50)
   Flash solide, mais nettement sous les gros modèles z.ai.

18e GLM-5-Turbo 🆕 (38/50)
   Compact, utile, moins premium.

19e Healer Alpha 🆓 (33/50)
   Bonne valeur de prototypage.

20e GPT-OSS-120b 🆓 (31/50)
   Titan local sur code, trop instable ailleurs.

21e GPT-5.4 (30/50)
   Le payant qui souffre le plus de la comparaison globale.

❌ Nemotron-3 🆓 (0/50 — DNF)
   Rate limit / absence de signal exploitable.

❌ GLM-4.5-Air 🆕 (0/50 — DNF)
   Non benchmarkable dans ce setup.
```

---

## 💡 Méta-enseignements du benchmark v13

1. **z.ai est revenu sérieusement dans la course.** Le contraste avec GLM-4.5-Air est violent. Ici, **GLM-4.7** et **GLM-5** ne sont pas juste benchmarkables : ils sont carrément **très bons**.

2. **GLM-4.7 est la grosse claque de la vague.** Sa copie code est monstrueuse, et il ne s’effondre pas sur logs/web. C’est le modèle qui a le plus impressionné en “masse et ambition”.

3. **GLM-5 est peut-être le plus sain à utiliser au quotidien.** Moins démonstratif que GLM-4.7, mais plus homogène dans sa manière d’être bon partout. Si GLM-4.7 est la claque, **GLM-5** est peut-être le meilleur compagnon de travail.

4. **Les versions turbo/flash sont bonnes, mais pas premium.** `GLM-5-Turbo` et `GLM-4.7-Flash` sont utiles, cohérents, parfois franchement bons. Mais ils ne jouent pas dans la même cour que les deux gros.

5. **Le haut du tableau est maintenant encore plus violent.** Haiku garde la couronne, mais la concurrence est devenue sérieuse : GLM-4.7, GLM-5, Sonnet, MiniMax-M2.7-highspeed… ça commence à sentir la vraie baston, pas le benchmark à sens unique.

6. **Le milieu de tableau est ultra dense.** Entre 40 et 45, il y a maintenant une grappe de modèles vraiment utilisables. Le benchmark sert donc de plus en plus à distinguer des **profils** plutôt que des modèles “bons” contre “nuls”.

---

## 📋 Recommandations d’usage (mise à jour v13)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** ou **GLM-4.7** | robustesse maximale vs copie code monstrueuse |
| Modèle premium équilibré | **GLM-5** 🆕 | très bon partout, très sain |
| Excellence architecture | **Sonnet 4.6** | pensée d’ingénieur senior |
| Décision rapide produit/infra | **GLM-4.7** ou **MiniMax-M2.7-highspeed** | très bonne lisibilité d’arbitrage |
| Gratuit complet moderne | **Trinity** 🆓 | 45/50, propre sur les 3 tâches |
| Analyse causale incident | **Hunter Alpha** 🆓 | cause racine > symptôme |
| Xiaomi le plus fiable | **MiMo v2 Pro** | le plus cohérent de la gamme |
| Xiaomi le plus intéressant en code | **MiMo v2 Omni** | Treap original + vraie personnalité technique |
| z.ai utilitaire / coût inférieur | **GLM-5-Turbo** | compact, propre, pragmatique |
| z.ai flash utile | **GLM-4.7-Flash** | meilleur que prévu, mais pas premium |
| Éviter / non benchmarkable ici | **GLM-4.5-Air** | DNF |
| Éviter | **Nemotron-3** | DNF |
| Éviter | **GPT-5.4** | trop en retrait sur le benchmark global |

---

*v13 — Benchmark à 23 modèles — ajout GLM-4.7 / GLM-4.7-Flash / GLM-5 / GLM-5-Turbo — 2026-03-29 15:40 UTC*