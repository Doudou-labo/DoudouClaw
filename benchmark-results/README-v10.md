# 🔬 Benchmark LLM — Analyse Comparative Complète 14 Modèles (README-v10)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (**MiniMax-M2.5, MiniMax-M2.5-highspeed**)
>
> Cette version **v10** reprend la continuité du v9 en y ajoutant les **2 modèles MiniMax**, avec une écriture plus narrative et plus dense, dans l'esprit du **README-v5**.

---

## Les 14 concurrents

| Modèle | Alias | Provider | Prix |
|--------|-------|----------|------|
| `openrouter/healer-alpha` | **Healer Alpha** | OpenRouter | 🆓 Gratuit |
| `anthropic/claude-sonnet-4-6` | **Sonnet 4.6** | Anthropic | 💰 Payant |
| `openai-codex/gpt-5.4` | **GPT-5.4** | OpenAI | 💰 Payant |
| `openrouter/hunter-alpha` | **Hunter Alpha** | OpenRouter | 🆓 Gratuit |
| `kimi-coding/k2p5` | **k2p5** | Moonshot | 💰 Payant |
| `openrouter/step-3.5-flash:free` | **Step-3.5 Flash** | StepFun | 🆓 Gratuit |
| `openrouter/gpt-oss-120b:free` | **GPT-OSS-120b** | OpenAI | 🆓 Gratuit |
| `anthropic/claude-haiku-4-5` | **Haiku 4.5** | Anthropic | 💰 Payant |
| `google-gemini-cli/gemini-3-flash` | **Gemini Flash** | Google | 💰 Payant |
| `google-gemini-cli/gemini-3.1-pro` | **Gemini Pro** | Google | 💰 Payant |
| `openrouter/trinity-large:free` | **Trinity** | Arcee AI | 🆓 Gratuit |
| `openrouter/nemotron-3:free` | **Nemotron-3** | NVIDIA | 🆓 Gratuit |
| `minimax/MiniMax-M2.5` | **MiniMax-M2.5** | MiniMax | 💰 Payant |
| `minimax/MiniMax-M2.5-highspeed` | **MiniMax-M2.5-highspeed** | MiniMax | 💰 Payant |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats bruts

| Modèle | Architecture | Lignes impl. | Lignes tests | Tests | Feature bonus |
|--------|-------------|-------------:|-------------:|------:|---------------|
| Healer Alpha | BST augmenté | 192 | 274 | 18 | — |
| **Sonnet 4.6** | **Red-Black Tree** | 438 | 229 | 15 | `queryInterval()` |
| GPT-5.4 | AVL Tree | 242 | 151 | 13 | — |
| Hunter Alpha | Red-Black BST (LLRB) | 238 | 206 | 15 | — |
| k2p5 | AVL Tree | 364 | 282 | 12+ | `searchInterval()` |
| Step-3.5 Flash | AVL Tree | 281 | 267 | 12 | `searchOverlap()` |
| GPT-OSS-120b | AVL Tree | ~250 | ~400 | **57** | `toArray()`, pruning |
| **Haiku 4.5** | **Red-Black Tree** | **556** | **622** | 42 | `verify()`, floats, négatifs |
| Gemini Flash | AVL Tree | 210 | 110 | 8 | — |
| Gemini Pro | AVL Tree | 227 | 98 | 7 | — |
| **Trinity** | **AVL augmenté** | **318** | **466** | **30** | benchmarks, stress, utils |
| Nemotron-3 | ❌ Rate limit | — | — | — | ❌ |
| **MiniMax-M2.5** 🆕 | **BST à point médian** | **210** | **152** | **18** | exécution 18/18 |
| **MiniMax-M2.5-highspeed** 🆕 | **AVL augmenté** | **326** | **214** | **21** | `overlapsPoint`, `inOrder`, `size`, stress test |

## Analyse des nouveaux modèles

### 🟡 MiniMax-M2.5 🆕 — Le classique efficace

MiniMax-M2.5 arrive avec une copie franchement plus saine que ce que ses timeouts initiaux pouvaient laisser craindre. Son choix d'un **BST basé sur un point médian**, avec `maxEnd` pour l'élagage et une suppression par successeur inorder, est un choix très classique. Rien de révolutionnaire, mais quelque chose de cohérent, compréhensible et fonctionnel. Surtout, il ne se vautre pas : **18 tests sur 18 passent**, et le code reste relativement compact (210 lignes).

Sa limite est nette : contrairement à la version highspeed, il ne pousse pas jusqu'à une structure équilibrée sophistiquée. On reste sur une approche correcte pour des volumes raisonnables, mais moins robuste si la distribution des insertions devient défavorable. C'est un **bon code pratique**, qui inspire plus confiance que beaucoup de résultats "juste corrects".

---

### 🔵 MiniMax-M2.5-highspeed 🆕 — Le speed model qui bosse vraiment

C'est probablement la meilleure surprise MiniMax de ce benchmark. La version **highspeed** ne s'est pas contentée d'être "moins lente" : elle a produit un **AVL augmenté**, générique, avec **21 tests verts**, plusieurs helpers bonus et même un stress test à 500 intervalles. Elle ne s'est pas comportée comme un modèle speed jetable, mais comme un modèle qui a encore envie de bien faire malgré la contrainte de vitesse.

Ce qui la place juste en dessous du très haut du tableau, c'est qu'elle laisse entrevoir une petite fragilité sur un helper bonus (`searchOverlap`) dont le cas récursif limite n'a pas été assumé jusqu'au bout. Pour un modèle nommé *highspeed*, sortir ce niveau-là, c'est une **vraie perf**.

---

# 🔍 TÂCHE 2 — Analyse de logs serveur

## Résultats bruts

| Modèle | Score |
|--------|-------|
| Haiku 4.5 | 10/10 |
| Sonnet 4.6 | 9.5/10 |
| Hunter Alpha | 9/10 |
| k2p5 | 9/10 |
| Trinity | 9/10 |
| **MiniMax-M2.5-highspeed** 🆕 | **8/10** |
| **MiniMax-M2.5** 🆕 | **8/10** |
| Step-3.5 Flash | 8/10 |
| Gemini Flash | 8/10 |

### 🟡 MiniMax-M2.5 🆕 — Diagnostic solide, mais générique

MiniMax-M2.5 a livré une analyse franchement respectable. Il remonte les bons symptômes (**NPE, OOM, DB pool, circuit breaker**), hiérarchise correctement et propose des remédiations concrètes. On sent parfois un diagnostic formulé à partir de bons patterns SRE génériques plus qu'à partir d'une autopsie impitoyable du système.

---

### 🔵 MiniMax-M2.5-highspeed 🆕 — Benchmark-ready pragmatique

La version highspeed fait ici une performance très propre. Elle reconstruit une chronologie, hiérarchise en **P1 / P2 / P3**, propose des actions correctives concrètes, et donne une vraie impression de document déjà exploitable par une équipe technique. Certaines causes sont formulées avec une confiance un peu plus qualitative que démonstrative, mais le résultat reste franchement bon pour un modèle orienté vitesse.

---

# 🌐 TÂCHE 3 — Recherche Web : FTS5 vs Elasticsearch

## Résultats bruts

| Modèle | Score |
|--------|-------|
| Haiku 4.5 | 10/10 |
| k2p5 | 9/10 |
| Sonnet 4.6 | 9/10 |
| Hunter Alpha | 8.5/10 |
| Step-3.5 Flash | 8.5/10 |
| **MiniMax-M2.5-highspeed** 🆕 | **8/10** |
| **MiniMax-M2.5** 🆕 | **8/10** |
| Trinity | 8/10 |
| Gemini Flash | 8/10 |

### 🟡 MiniMax-M2.5 🆕 — Bonne copie structurée

Réponse claire, bien hiérarchisée, recommandation nette : **FTS5 suffit pour la majorité des applications classiques**. La limite, c'est une légère généralité sur les arguments techniques.

---

### 🔵 MiniMax-M2.5-highspeed 🆕 — Consultant rapide et propre

Structure mieux, ose des seuils chiffrés, et formule la recommandation de manière plus ferme. Une réponse pensée pour **aider à décider vite**.

---

# 🏆 VERDICT FINAL — 14 modèles

## Tableau de synthèse

| Modèle | Total | Position |
|--------|-------|----------|
| Haiku 4.5 | 49/50 | 🥇 |
| Sonnet 4.6 | 47/50 | 🥈 |
| k2p5 | 45/50 | 🥉 |
| Hunter Alpha 🆓 | 44/50 | 4e |
| Trinity 🆓 | 44/50 | 4e |
| **MiniMax-M2.5-highspeed** 🆕 | **44/50** | **4e** |
| Step-3.5 Flash 🆓 | 41/50 | 7e |
| Gemini Flash 💰 | 41/50 | 7e |
| **MiniMax-M2.5** 🆕 | **41/50** | **7e** |
| Gemini Pro 💰 | 40/50 | 10e |
| GPT-OSS-120b 🆓 | 34/50 | 11e |
| Healer Alpha 🆓 | 33/50 | 12e |
| GPT-5.4 | 30/50 | 13e |
| Nemotron-3 🆓 | 0/50 | ❌ DNF |

## Classement final (14 modèles)

```
🥇 Haiku 4.5 (49/50)
🥈 Sonnet 4.6 (47/50)
🥉 k2p5 (45/50)
4e Hunter Alpha 🆓 (44/50)
4e Trinity 🆓 (44/50)
4e MiniMax-M2.5-highspeed 🆕 (44/50) ← EX-ÆQUO
7e Step-3.5 Flash 🆓 (41/50)
7e Gemini Flash 💰 (41/50)
7e MiniMax-M2.5 🆕 (41/50) ← EX-ÆQUO
10e Gemini Pro 💰 (40/50)
11e GPT-OSS-120b 🆓 (34/50)
12e Healer Alpha 🆓 (33/50)
13e GPT-5.4 (30/50)
❌ Nemotron-3 🆓 (0/50 — DNF)
```

---

## 💡 Méta-enseignements v10

1. **MiniMax-M2.5-highspeed est la vraie surprise** — On s'attendait à un modèle rapide mais superficiel ; on obtient un modèle **homogène**, crédible en code (21 tests verts), propre en logs, correct en recherche. 44/50, à égalité avec Hunter Alpha et Trinity.

2. **La version "highspeed" > version standard** — Le modèle rapide est plus ambitieux (AVL vs BST simple) et plus complet. Leçon : "highspeed" ne veut pas dire "bâclé".

3. **Les MiniMax s'intègrent bien dans le haut du tableau** — Sans détrôner Haiku (49), Sonnet (47) ou k2p5 (45), mais en rivalisant sérieusement avec les meilleurs gratuits.

4. **Le marché des LLM devient de plus en plus compétitif** — Entre Hunter Alpha, Trinity, Step-3.5 Flash et maintenant MiniMax-M2.5-highspeed, difficile de justifier un modèle payant "par réflexe".

---

## 📋 Recommandations d'usage v10

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** | 42 tests, rigueur monstrueuse |
| Excellence technique | **Sonnet 4.6** | Red-Black Tree irréprochable |
| Équilibre premium | **k2p5** | Très bon partout |
| Gratuit redoutable | **Hunter Alpha** 🆓 | Causalité + pragmatisme |
| Surprise polyvalente | **MiniMax-M2.5-highspeed** 🆕 | 44/50, rapide sans être bâclé |
| Bon payant sage | **MiniMax-M2.5** 🆕 | 41/50, fiable, classique |
| Budget zéro | **Step-3.5 Flash** 🆓 ou **Trinity** 🆓 | Excellent rapport qualité/prix |
| **Éviter** | **Nemotron-3** 🆓 | Rate limit systématique |
| **Éviter** | **GPT-5.4** | 30/50, derrière 6 gratuits |

---

*v10 — Benchmark à 14 modèles — 2026-03-19 22:00 UTC*
