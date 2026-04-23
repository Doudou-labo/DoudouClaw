# 🔬 Benchmark LLM — Analyse Comparative Complète 27 Modèles (README-v18)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (MiniMax-M2.5, MiniMax-M2.5-highspeed) · 2026-03-22 (MiniMax-M2.7, MiniMax-M2.7-highspeed) · 2026-03-29 (MiMo v2 Omni, MiMo v2 Pro, GLM-4.5-Air, GLM-4.7, GLM-4.7-Flash, GLM-5, GLM-5-Turbo, Qwen3.6-plus) · 2026-03-31 (Step-3.5-Flash payant) · 2026-04-01 (GLM-5.1) · **2026-04-23 (k2p6)**
>
> Cette version **v18** ajoute le modèle **`kimi/k2p6`** — la dernière itération de Moonshot AI sur la famille Kimi. Un modèle qui confirme la montée en puissance de la gamme k2 : rigoureux, structuré, et très complet.

---

## Les 27 concurrents

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
| `zai/glm-5.1` | **GLM-5.1** | Z-AI | 💰 Payant |
| **`kimi/k2p6`** 🆕 | **k2p6** | Moonshot AI | 💰 Payant |

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
| GLM-5.1 | AVL-balanced + `maxHigh` pruning | 185 | 120 | 10 | `size`, validation `low > high`, stress 10K, négatifs, doublons |
| **k2p6** 🆕 | **AVL Tree + `maxHigh` + doublons par array** | **~230** | **~200** | **16 (16/16 ✅)** | validation, négatifs, doublons, `count()` |

## Analyse et commentaires — k2p6 🆕

### 🟢 k2p6 — L'AVL production-ready

k2p6 livre une implémentation **AVL Tree classique** avec `maxHigh` pour le pruning, proprement typée, avec **16 tests Vitest qui passent tous** (16/16 ✅). C'est une version très proche de ce qu'on attend d'un ingénieur senior en TypeScript.

L'architecture est standard AVL (rotations LR/LL/RL/RR) avec une particularité intéressante : la **gestion des doublons via `intervals: Interval[]`** sur chaque nœud. Quand on insère un intervalle de même `[low, high]`, il est ajouté au tableau `intervals` plutôt que de créer un nouveau nœud. C'est une approche économe en mémoire pour les cas où beaucoup d'intervalles identiques sont stockés. Le `count()` est mis à jour en conséquence.

Le pruning via `maxHigh` est bien implémenté : on explore le sous-arbre gauche si `left.maxHigh >= point`, et le sous-arbre droit uniquement si `node.low <= point` et `right.maxHigh >= point`. C'est correct et efficace.

**Les 16 tests** couvrent : insert/count, search simple, search sans résultat, remove found, remove not found, intervalles négatifs, doublons (insert multiple identiques + remove partiel), validation (`low > high` → Error), boundary (point exactement sur low/high), overlapping multiple, et un cas sur arbre vide.

**Ce qui manque** : pas de `toArray()`, pas de `verify()` arborescent (comme Haiku), pas de stress test explicite avec un grand nombre d'intervalles, pas de support flottants explicite. C'est du code de production sérieux mais pas une démonstration technique poussée.

**Comparaison k2p5 vs k2p6** : k2p5 (364 lignes) avait `searchInterval()` en bonus et 12+ tests. k2p6 (~230 lignes) est plus compact, avec une meilleure couverture test (16/16 vs 12+ non détaillés) et une gestion des doublons plus élégante (array par nœud). Le k2p6 est **plus resserré et plus testé**.

---

## Verdict code — top 27 modèles

```
🥇 Haiku 4.5              → toujours monstrueux en robustesse globale (42 tests)
🥈 GLM-4.7                → Red-Black Tree massif, 50 tests, grosse démonstration
🥉 GLM-5                  → AVL premium très équilibré, 31 tests
4e Sonnet 4.6             → pureté technique et élégance d'implémentation
5e MiMo v2 Omni           → Treap original, vraie personnalité technique
6e MiniMax-M2.5-highspeed → premium compact très abouti
7e MiniMax-M2.7-highspeed → ratio qualité/lignes excellent
8e Trinity 🆓             → gratuit ultra-sérieux
9e GLM-4.7-Flash          → meilleur que prévu
10e GPT-OSS-120b 🆓       → énorme couverture sur tâche bornée
11e MiMo v2 Pro           → propre, robuste
12e Hunter Alpha 🆓       → compact, fiable
13e k2p6 🆕               → 16/16 tests, doublons par array, production-ready
14e k2p5                  → pragmatique mature
15e Qwen3.6-plus 🆓       → AVL rigoureux, 15/15, propre et fiable
16e GLM-5.1              → AVL compact, 10 tests, stress 10K, chirurgical
17e GLM-5-Turbo           → compact, propre, peu ambitieux
18e MiniMax-M2.5          → classique et fiable
19e MiniMax-M2.7          → sérieux sans surprise
20e Step-3.5 Flash (free) 🆓 → bon gratuit pragmatique
21e Healer Alpha 🆓       → bonne valeur de prototypage
22e GPT-5.4               → sérieux mais sans relief
23e Gemini Flash 💰       → standard
24e Gemini Pro 💰         → standard un peu plus sage
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
| GLM-5.1 | 44 ✅ | 40.9% | 6 | 9/10 | SRE structuré, timeline, P0/P1/P2 |
| **k2p6** 🆕 | **45** ✅ | **40%** | **6** | **9/10** | SRE structuré, timeline 4 phases, P0/P1/P2 |

## Analyse et commentaires — k2p6 🆕

### 🟢 k2p6 — Le SRE qui maîtrise l'incident de bout en bout

k2p6 livre un rapport SRE de **très haut niveau**, comparable aux meilleurs du benchmark (GLM-5, GLM-4.7, MiniMax-M2.7). C'est précis, structuré, et actionnable.

**45 requêtes** comptées (correct ✅), **40% d'erreur** (18/45 dont 13×500 + 5×503), **24.4% de warnings** (latence > 2s). Le tableau récapitulatif est immédiatement exploitable.

**6 patterns d'erreur** identifiés : NPE PaymentService (5×), Circuit breaker OPEN (5×), DB pool exhausted (3×), OOM heap (3×), Duplicate key constraint (2×), Latence excessive (11×). Chaque pattern a ses horaires exacts, son endpoint touché, sa fréquence.

La **timeline en 4 phases** est excellente :
- **Phase 1 — Amorçage** (08:02→08:06) : 2 NPE puis circuit breaker s'ouvre
- **Phase 2 — Cascade** (08:06→08:18) : CB reste ouvert, DB pool exhausted à 08:12
- **Phase 3 — Crise** (08:18→08:35) : OOM à 08:18, latences max (6.2s)
- **Phase 4 — Dégradation résiduelle** (08:36→08:43) : dernières erreurs critiques

La **classification P0/P1/P2** est rigoureuse :
- P0 : Circuit breaker OPEN, OOM, DB pool exhausted (3 problèmes)
- P1 : NPE PaymentService, Duplicate key orders (2 problèmes)
- P2 : Latence excessive (1 problème avec 11 cas)

Les **8 actions correctives** sont concrètes et priorisées : redémarrer/scale payment-gateway, augmenter heap JVM, augmenter DB connection pool, corriger NPE ligne 142, implémenter idempotence POST /api/orders, optimiser GET /api/search, mettre en place cache /api/products, ajouter alerting préventif à 1.5s.

**Conclusion SRE** : L'incident démarre par NPE récurrente → circuit breaker → DB pool exhausted → OOM. Système en dégradation avancée avec 40% d'erreurs. k2p6 montre une vraie compréhension de la dynamique d'incident.

---

# 🌐 TÂCHE 3 — Recherche web : FTS5 vs Elasticsearch

## Résultats bruts

| Modèle | Sources | Profondeur | Architecture concrète | Avis tranché | Score |
|--------|---------|-----------|----------------------|--------------|------:|
| Healer Alpha | 4 | superficiel | ❌ | moyennement | 6/10 |
| Sonnet 4.6 | 5 | bonne | SQL + schéma | oui | 8/10 |
| GPT-5.4 | 4 | bonne | SQL + triggers | oui | 7/10 |
| Hunter Alpha | 4 | moyenne | ❌ | oui | 5/10 |
| k2p5 | 4 | bonne | SQL + triggers + sync | oui | 7/10 |
| Step-3.5 Flash (free) | 3 | moyenne | ❌ | oui | 5/10 |
| GPT-OSS-120b | 4 | bonne | SQL complet | oui | 7/10 |
| Haiku 4.5 | 4 | bonne | SQL + exemples | oui | 7/10 |
| Gemini Flash | 4 | moyenne | ❌ | moyennement | 6/10 |
| Gemini Pro | 5 | bonne | SQL + schéma | oui | 7/10 |
| Trinity | 4 | moyenne | ❌ | moyennement | 6/10 |
| Nemotron-3 | ❌ | — | — | — | DNF |
| MiniMax-M2.5 | 4 | moyenne | ❌ | moyennement | 6/10 |
| MiniMax-M2.5-highspeed | 5 | bonne | SQL complet | oui | 8/10 |
| MiniMax-M2.7 | 5 | très bonne | SQL + bench | oui | 9/10 |
| MiniMax-M2.7-highspeed | 5 | très bonne | SQL + bench | oui | 9/10 |
| MiMo v2 Omni | 5 | bonne | SQL + sync | oui | 8/10 |
| MiMo v2 Pro | 4 | bonne | SQL + triggers | oui | 7/10 |
| GLM-4.5-Air | ❌ | — | — | — | DNF |
| GLM-4.7 | 5 | excellente | SQL + benchmark + sizing | oui | 10/10 |
| GLM-4.7-Flash | 4 | bonne | SQL + triggers | oui | 7/10 |
| GLM-5 | 4 | très bonne | SQL + benchmark | oui | 9/10 |
| GLM-5-Turbo | 4 | bonne | SQL + sync | oui | 8/10 |
| Qwen3.6-plus | 3 | bonne | SQL + sync | oui | 8/10 |
| GLM-5.1 | 4 | très bonne | SQL concret, triggers, requêtes | oui | 9/10 |
| **k2p6** 🆕 | **5+** | **excellente** | **SQL FTS5 EXTERNAL CONTENT + triggers + sync queue + conflits** | **FTS5 sans hésitation, hybride ES backend** | **9/10** |

## Analyse et commentaires — k2p6 🆕

### 🟢 k2p6 — L'architecte qui livre du concret

k2p6 livre ici une **analyse architecturale de premier plan**, comparable aux meilleurs du benchmark (GLM-4.7, GLM-5, MiniMax-M2.7).

**Avis tranché immédiat** : "FTS5 sans hésitation. Elasticsearch sur mobile est une aberration architecturale." C'est clair, direct, et argumenté.

**Tableau comparatif complet** : 15 critères comparés (infra, taille, latence, batterie, coût, offline-first, sync, ranking, fuzzy, stemming, langues, prefix/suffix, phrase/proximity, scalabilité, ACID). FTS5 gagne sur 10 critères, ES sur 5. La comparaison est honnête : k2p6 reconnaît les limites de FTS5 (pas de fuzzy natif, stemming limité, CJK difficile).

**Architecture recommandée : hybride FTS5 + ES backend**. C'est la bonne réponse pour un cas offline-first : FTS5 local pour la recherche offline, ES côté backend pour la recherche agrégée cross-users.

**Schéma SQL concret** : table `documents` + `documents_fts` en EXTERNAL CONTENT (économise ~40% d'espace) + triggers `ai/ad/au` pour maintenance auto-index + requête avec ranking BM25 basique + requête avancée `NEAR/5` + colonne spécifique. C'est du SQL prêt à copier-coller.

**Stratégie de synchronisation** : queue locale (`sync_queue`) + API REST vers backend. Pseudocode complet pour `localCreate()` et `processSyncQueue()` avec gestion des conflits 409, retry, et optimistic locking (`If-Match`).

**Gestion des conflits** : 4 stratégies documentées (LWW, merge manuel, server-wins, client-wins) avec tableau de décision. Recommandation : LWW par défaut + merge manuel pour texte long + historique local avant overwrite.

**Ce qui manque** : pas de benchmark chiffré de performance (contrairement à GLM-4.7 qui donnait des chiffres), pas de sizing mémoire explicite. Mais le niveau de détail technique est exceptionnel.

---

# 📊 Synthèse finale — k2p6

## Scores bruts

| Tâche | Score | Commentaire |
|-------|------:|-------------|
| Code TypeScript | **8/10** | AVL propre, 16/16 tests, doublons par array, production-ready |
| Analyse logs | **9/10** | 45 req ✅, 40% erreur, timeline 4 phases, P0/P1/P2 rigoureux, 8 actions |
| Recherche web | **9/10** | FTS5 recommandé, architecture hybride, SQL concret, sync queue, conflits |
| **TOTAL** | **26/30** | **6e ex-æquo avec GLM-5.1** |

## Classement général — 27 modèles

| Rang | Modèle | Code | Logs | Web | **Total** |
|------|--------|------|------|-----|-----------|
| 1 | GLM-4.7 | 10 | 10 | 9 | **29/30** |
| 2 | GLM-5 | 9 | 10 | 9 | **28/30** |
| 3 | MiniMax-M2.7-highspeed | 9 | 9 | 9 | **27/30** |
| 4 | MiniMax-M2.7 | 8 | 9 | 9 | **26/30** |
| **5** | **GLM-5.1** | **8** | **9** | **9** | **26/30** |
| **5** | **k2p6** 🆕 | **8** | **9** | **9** | **26/30** |
| 7 | Sonnet 4.6 | 8 | 4 | 8 | **20/30** |
| 8 | MiniMax-M2.5-highspeed | 8 | 8 | 3 | **19/30** |
| 9 | MiMo v2 Omni | 7 | 7 | 4 | **18/30** |
| 10 | k2p5 | 7 | 3 | 7 | **17/30** |
| 11 | GLM-5-Turbo | 7 | 8 | 2 | **17/30** |
| 12 | Hunter Alpha 🆓 | 7 | 3 | 5 | **15/30** |
| 13 | GPT-5.4 | 6 | 4 | 7 | **17/30** |
| 14 | GPT-OSS-120b 🆓 | 7 | 7 | 3 | **17/30** |
| 15 | MiMo v2 Pro | 7 | 8 | 2 | **17/30** |
| 16 | Qwen3.6-plus 🆓 | 7 | 8 | 3 | **18/30** |
| 17 | Healer Alpha 🆓 | 5 | 4 | 6 | **15/30** |
| 18 | Trinity 🆓 | 7 | 3 | 5 | **15/30** |
| 19 | GLM-4.7-Flash | 7 | 7 | 3 | **17/30** |
| 20 | MiniMax-M2.5 | 6 | 8 | 3 | **17/30** |
| 21 | Step-3.5 Flash (free) 🆓 | 6 | 2 | 5 | **13/30** |
| 22 | Gemini Flash 💰 | 4 | 3 | 6 | **13/30** |
| 23 | Gemini Pro 💰 | 4 | 3 | 7 | **14/30** |
| 24 | Haiku 4.5 | 10 | 3 | 7 | **20/30** |
| — | GLM-4.5-Air | DNF | DNF | DNF | **0/30** |
| — | Nemotron-3 | DNF | DNF | DNF | **0/30** |
| — | Step-3.5-Flash (payant) | DNF | 8 | — | **8/30** |

*(Note : Haiku 4.5 est un cas particulier — 10/10 en code mais très faible en logs, ce qui crée un profil très spécialisé)*

---

## 🏆 Verdict final — k2p6

**k2p6 : 26/30 — 6e ex-æquo avec GLM-5.1**

k2p6 confirme la montée en puissance de la famille Kimi. Par rapport à k2p5 (17/30), c'est une **progression massive de +9 points** :
- **Code** : 7→8 (+1) — meilleure couverture test (16/16 vs 12+), gestion doublons plus élégante
- **Logs** : 3→9 (+6) — passage de moyen à excellent, compréhension profonde de la dynamique d'incident
- **Recherche** : 7→9 (+2) — architecture hybride bien argumentée, SQL concret, sync queue complète

**Profil k2p6** : Un modèle **très équilibré** qui excelle dans l'analyse structurée (logs, recherche) tout en restant solide sur le code. C'est un **SRE-architecte** plus qu'un démonstrateur technique. Il ne cherchera pas à écrire 50 tests ou une librairie open-source, mais il livrera du code de production testé et des analyses actionnables.

**Comparaison avec les leaders** :
- vs GLM-4.7 (29/30) : moins démonstratif en code (16 tests vs 50), mais aussi structuré en logs/web
- vs GLM-5 (28/30) : très proche en profil, k2p6 un peu moins ambitieux en code
- vs GLM-5.1 (26/30) : **profil quasi-identique** — même total, même équilibre code/logs/web

**Recommandation d'usage k2p6** :
- ✅ **Analyse SRE / incident response** — excellent timeline et classification
- ✅ **Architecture technique / recherche** — avis tranché avec schémas concrets
- ✅ **Code de production TypeScript** — propre, testé, sans fioritures
- ❌ **Démonstration technique poussée** — préférer Haiku ou GLM-4.7
- ❌ **Benchmark / librairie open-source** — pas son domaine

---

## 📈 Évolution Kimi à travers le benchmark

| Modèle Kimi | Code | Logs | Web | Total | Rang |
|-------------|------|------|-----|-------|------|
| **k2p5** | 7 | 3 | 7 | 17/30 | 10e |
| **k2p6** 🆕 | **8** | **9** | **9** | **26/30** | **6e** |

**Progression : +9 points**, principalement grâce à une **explosion en logs (+6)** et une **amélioration en recherche (+2)**. Le code reste stable et fiable. Moonshot AI a clairement travaillé sur la structuration et l'analyse pour cette version.

---

*v18 — Benchmark à 27 modèles — ajout k2p6 (26/30, 6e ex-æquo) — 2026-04-23 16:20 UTC*
