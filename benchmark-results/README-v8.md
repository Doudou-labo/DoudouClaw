# 🔬 Benchmark LLM — Analyse Comparative Complète 10 Modèles (README-v8)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, **Gemini Flash, Gemini Pro**)
> Ce document analyse et commente en profondeur les résultats de chacun des 10 modèles sur les 3 tâches.
> Format inspiré du README-v5/v7 — analyse narrative par modèle, podiums commentés, méta-enseignements.

---

## Les 10 Concurrents

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
| `google-gemini-cli/gemini-3-flash-preview` | **Gemini Flash** 🆕 | Google | 💰 Payant |
| `google-gemini-cli/gemini-3.1-pro-preview` | **Gemini Pro** 🆕 | Google | 💰 Payant |

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
| **Gemini Flash** 🆕 | **AVL Tree** | 210 | 110 | 8 | — |
| **Gemini Pro** 🆕 | **AVL Tree** | 227 | 98 | 7 | — |

*\* Estimé — GPT-OSS-120b a fourni 57/57 tests sans détailler les lignes exactes*

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Champion des Tests Économiques

Healer Alpha adopte un **BST simple augmenté avec maxEnd**, sans équilibrage automatique. C'est la solution la moins sophistiquée architecturalement — mais c'est le modèle qui écrit le **plus de tests parmi les payants originaux** (18) et les plus diversifiés.

**Ce que ça dit sur le modèle :** Healer pense "livraison" et "maintenabilité". Il préfère un code compréhensible et testé à un bijou algorithmique difficile à déboguer.

**Limite notable :** Sans équilibrage, l'arbre peut dégénérer en liste liée O(n) sur des données ordonnées.

---

### 🔵 Sonnet 4.6 — L'Excellence Technique

Sonnet est le seul parmi les originaux à implémenter un **Red-Black Tree complet**, avec toutes les rotations, les cas de rééquilibrage et — détail crucial — la mise à jour correcte de `maxEnd` pendant les rotations.

**Ce que ça dit sur le modèle :** Sonnet ne se contente pas du cahier des charges. Il pense à ce que l'utilisateur *voudra* faire après et anticipe.

---

### 🟡 GPT-5.4 — Le Scolaire Solide

GPT choisit un **AVL Tree** — l'arbre équilibré "classique" enseigné en algorithmique. C'est un choix conservateur mais défendable : l'AVL garantit O(log n) et son code est plus simple que le Red-Black Tree.

**Limite notable :** La suppression utilise un `findByValue()` récursif qui traverse tout l'arbre O(n) — pas O(log n) comme annoncé. Seul modèle à ne pas avoir de feature bonus.

---

### 🟠 Hunter Alpha — L'Efficace Compact

Hunter implémente un **Red-Black Tree** mais de façon plus compacte que Sonnet (444 vs 667 lignes). Il utilise l'approche `_moveRedLeft` / `_moveRedRight` style "Sedgewick LLRB" pour la suppression — élégante et bien connue.

---

### 🟣 k2p5 — Le Pragmatique Francophone

k2p5 choisit **AVL Tree** comme GPT, mais avec 50% plus de lignes d'implémentation (364 vs 242). Ce surplus s'explique par une **documentation extensive en français** — k2p5 est le seul modèle à avoir adapté ses commentaires à la langue de l'utilisateur.

---

### 🔵 Step-3.5 Flash — Le Pragmatique Gratuit

Step-3.5 Flash choisit un **AVL Tree** avec 281 lignes d'implémentation et 267 lignes de tests. Sa méthode bonus `searchOverlap(start, end)` — recherche par chevauchement d'intervalle — montre une vision d'ensemble.

---

### 🟣 GPT-OSS-120b — Le Testeur Production

GPT-OSS-120b produit le **plus grand nombre de tests du benchmark entier** : **57 assertions sur 14 suites**. Seul modèle à avoir stress-testé son implémentation avec 1000 inserts séquentiels.

---

### 🔵 Haiku 4.5 — Le Polyvalent Complet

Haiku choisit un **Red-Black Tree** avec 556 lignes d'implémentation et 622 lignes de tests. Sa méthode `verify()` — **unique dans ce benchmark** — vérifie les propriétés complètes du Red-Black Tree après chaque opération.

---

### 🟢 Gemini Flash 🆕 — L'AVL Standard

Gemini Flash implémente un **AVL Tree classique** avec 210 lignes d'implémentation et 110 lignes de tests (8 cas de test). C'est une implémentation propre et fonctionnelle, sans surprises ni bonus.

**Ce que ça dit sur le modèle :** Gemini Flash est pragmatique et efficace. Il livre une solution standard qui fonctionne, sans chercher à impressionner. Le code est bien structuré avec des classes `Interval<T>` et `Node<T>` clairement séparées.

**Limite notable :** Aucune feature bonus, seulement 8 tests — le plus faible nombre de tests du benchmark payant. C'est fonctionnel mais minimaliste.

---

### 🔵 Gemini Pro 🆕 — L'AVL Rigueur

Gemini Pro implémente également un **AVL Tree** avec 227 lignes d'implémentation et 98 lignes de tests (7 cas de test). Légèrement plus verbeux que Flash, avec une attention particulière à la gestion des erreurs (validation des intervalles invalides).

**Ce que ça dit sur le modèle :** Gemini Pro est légèrement plus rigoureux que Flash sur la validation (vérifie `start < end`), mais produit moins de tests. C'est une approche "qualité > quantité".

**Limite notable :** Seulement 7 tests — le minimum viable. Pas de feature bonus, pas de documentation extensive. Fonctionnel mais basique.

## Verdict Code — Podium Commenté (10 modèles)

```
🥇 Sonnet 4.6     → RB Tree complet + queryInterval + mise à jour maxEnd pendant rotations
🥈 GPT-OSS-120b 🆓→ 57 tests, stress test, pruning vérifié. Gratuit et production-ready
🥉 Haiku 4.5      → RB Tree + verify() unique + 42 tests + floats/négatifs
4e k2p5           → AVL solide + searchInterval + docs FR
5e Hunter Alpha 🆓→ RB compact LLRB
6e Step-3.5 Flash 🆓→ AVL + searchOverlap
7e Healer Alpha 🆓→ BST + 18 tests
8e GPT-5.4        → AVL conventionnel, zéro bonus
9e Gemini Flash 💰→ AVL propre mais seulement 8 tests, 0 bonus
10e Gemini Pro 💰→ AVL rigoureux mais seulement 7 tests, 0 bonus
```

---

# 🔍 TÂCHE 2 — Analyse de Logs Serveur

## Résultats Bruts

| Modèle | Requêtes | Taux erreur | Temps moy INFO | Temps moy WARN | Temps moy ERROR | Score santé | Style |
|--------|----------|-------------|---------------|----------------|----------------|-------------|-------|
| Healer Alpha | 45 ✅ | 40.0% | ~63ms | ~3600ms | ~70ms | ~4/10 | Diagnostic médical |
| **Sonnet 4.6** | 45 ✅ | **31.1%** | ~42ms | ~3800ms | ~75ms | 3.5/10 | Architecte système |
| GPT-5.4 | **52** ❌ | 40.4% | N/A | N/A | N/A | ~4/10 | Data analyst |
| Hunter Alpha | **49** ❌ | 42.9% | N/A | N/A | N/A | ~3/10 | Détective causal |
| k2p5 | 45 ✅ | 44.4% | N/A | N/A | N/A | ~3/10 | Business / risque |
| Step-3.5 Flash | 45 ✅ | 37.8% | ~56ms | ~4124ms | ~84ms | 2/10 | Systémique cascade |
| GPT-OSS-120b | 45 ✅ | 35.6% | N/A | N/A | N/A | 6.5/10* | Quantitatif formule |
| **Haiku 4.5** | 45 ✅ | 37.78% | **56.29ms** | **4124.55ms** | **84.53ms** | 2.5/10 | Statisticien précis |
| **Gemini Flash** 🆕 | 45 ✅ | 28.9% | N/A | N/A | N/A | ~3/10 | Tableau endpoint |
| **Gemini Pro** 🆕 | 45 ✅ | 40.0% | N/A | N/A | N/A | **3.2/10** | Vue exécutive |

## Analyse Gemini 🆕

### Gemini Flash — Le Tableur

Gemini Flash produit un **tableau par endpoint détaillé** avec pourcentage d'erreurs par endpoint. Il identifie correctement que `/api/payments`, `/api/inventory/stock` et `/api/reports/monthly` ont 100% d'erreurs.

**Insight :** *"28.9% error rate global mais 100% sur les endpoints critiques paiement/inventaire/rapports"*

**Limite :** Pas de calcul de temps moyen par catégorie (INFO/WARN/ERROR). Pas de formule de health score expliquée.

---

### Gemini Pro — L'Exécutif

Gemini Pro produit une **vue exécutive** avec Health Score explicite : **3.2/10**. Il fournit un tableau complet par endpoint avec temps de réponse moyen par endpoint.

**Insight :** *"Error rate 40% = 18 erreurs sur 45 requêtes. 6 patterns d'erreur identifiés avec sévérité et recommandations P0/P1/P2."*

**Limite :** Le health score 3.2/10 n'a pas de formule expliquée (contrairement à GPT-OSS ou Haiku).

---

# 🌐 TÂCHE 3 — Recherche Web : FTS5 vs Elasticsearch

## Résultats Bruts

| Modèle | Volume | Latence FTS5 | Latence ES | Seuil bascule | Coût ES | Reco Pneu-Tracker |
|--------|--------|-------------|-----------|---------------|---------|-------------------|
| Healer Alpha 🆓 | ~7 600c | non chiffré | non chiffré | < 500K docs | — | non explicite |
| Sonnet 4.6 💰 | ~9 100c | non chiffré | non chiffré | non chiffré | — | non |
| GPT-5.4 💰 | ~10 500c | non chiffré | non chiffré | non chiffré | — | non |
| Hunter Alpha 🆓 | ~8 900c | 840 req/s (7k docs) | N/A | < 500K docs | — | ✅ Pneu-Tracker |
| k2p5 💰 | ~8 400c | 100× plus rapide | baseline | **1-5M docs** | — | ✅ partiel |
| Step-3.5 Flash 🆓 | ~8 000c | **1-5ms** | **10-30ms** | ~1M docs | 15-30€ | ✅ architecture |
| GPT-OSS-120b 🆓 | ❌ Échec | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Haiku 4.5** 💰 | **~31 500c** | **5-12ms** | **20-50ms** | **2M docs** | **45-90€** | ✅ complet + migration |
| **Gemini Flash** 🆕 | ~16 500c | **<10ms** | **20-100ms** | **1M docs** | **50-200€** | ✅ recommandé |
| **Gemini Pro** 🆕 | ~12 500c | **1-10ms** | **10-50ms** | **100K-1M docs** | **20-100€** | ✅ migration plan |

## Analyse Gemini 🆕

### Gemini Flash — Le Pragmatique

Gemini Flash produit un rapport de **~16 500 caractères** avec architecture en diagrammes ASCII, benchmarks chiffrés et **recommandation explicite** : *"SQLite FTS5 est la solution recommandée pour Pneu-Tracker"*.

**Points forts :**
- Latence FTS5 **<10ms** vs ES **20-100ms**
- Seuil de bascule **1M documents**
- Coût ES estimé **50-200€/mois**
- 3 scénarios de migration détaillés

---

### Gemini Pro — L'Architecte

Gemini Pro produit un rapport de **~12 500 caractères** avec **plan de migration en 4 phases** et estimation de downtime (2-4 heures).

**Points forts :**
- Latence FTS5 **1-10ms** vs ES **10-50ms**
- Seuil de bascule **100K-1M documents** (plus conservateur que Flash)
- Coût ES **20-100€/mois**
- Downtime estimé pour migration : 2-4h

---

# 🏆 VERDICT FINAL — 10 Modèles

## Tableau de Synthèse Complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35 | GPT-OSS | Haiku | Gem-Flash | Gem-Pro |
|---------|--------|--------|-----|--------|------|--------|---------|-------|-----------|---------|
| Code — Architecture | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Code — Tests | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Code — Features | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Analyse — Rigueur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Insight | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Action | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recherche — Profondeur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recherche — Applicabilité | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Adaptation contexte | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Consistance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **TOTAL /50** | **33** | **47** | **30** | **44** | **45** | **41** | **34** | **49** | **41** | **40** |

## Classement Final (10 modèles)

```
🥇 Haiku 4.5 (49/50)
   RB Tree + verify() + 42 tests + 31.5KB recherche + seuil 2M docs
   Le modèle le plus complet sur les 3 tâches

🥈 Sonnet 4.6 (47/50)
   Excellence technique pure, architecture RB irréprochable

🥉 k2p5 (45/50)
   Équilibre constant, adaptation contexte, docs français

4e Hunter Alpha 🆓 (44/50)
   Meilleur gratuit, analyse causale irremplaçable

5e Step-3.5 Flash 🆓 (41/50)
   Excellence gratuite, 3/3 tâches réussies

5e Gemini Flash 💰 (41/50)
   Solide sur les 3 tâches, recommandations pragmatiques
   Décevant pour un payant — au niveau des gratuits

7e Gemini Pro 💰 (40/50)
   Résultats corrects mais manque de profondeur
   Peu de tests (7), peu de features — cher pour ce que c'est

8e GPT-OSS-120b 🆓 (34/50)
   Spécialiste code (57 tests!), inutilisable recherche

9e Healer Alpha 🆓 (33/50)
   Architecture fragile mais tests solides

10e GPT-5.4 (30/50)
   Seul payant derrière des gratuits — rapport qualité/prix mauvais
```

---

## 💡 Méta-Enseignements du Benchmark v8 (avec Gemini)

1. **Gemini Flash = niveau gratuit** — Pour un modèle payant, Gemini Flash (41/50) est au niveau de Step-3.5 Flash gratuit (41/50). Difficile de justifier le coût.

2. **Gemini Pro = décevant** — Avec 40/50, Gemini Pro est derrière 4 gratuits et 4 payants. Seulement 7 tests, 0 feature bonus, recherche correcte mais pas exceptionnelle.

3. **Le coût ne prédit pas la qualité** — GPT-5.4 (payant, 30/50) finit dernier. Haiku (payant, 49/50) finit premier. Les gratuits Hunter (44) et Step-3.5 (41) battent Gemini Pro (40).

4. **Google n'innove pas sur ce benchmark** — Les modèles Gemini sont "corrects" mais n'apportent aucune feature unique. Ni `verify()`, ni `queryInterval()`, ni analyse causale Hunter-style.

---

## 📋 Recommandations d'Usage (mise à jour v8)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** | verify() + 42 tests |
| Excellence technique | **Sonnet 4.6** | Architecture RB pure |
| Adaptation contexte | **k2p5** | Docs français, précis |
| Analyse causale | **Hunter Alpha** 🆓 | Cause/symptôme, gratuit |
| Budget zéro polyvalent | **Step-3.5 Flash** 🆓 | 41/50, 100% gratuit |
| **Éviter Gemini** | *—* | Prix élevé, résultats moyens |

---

*v8 — Benchmark à 10 modèles — 2026-03-15*
