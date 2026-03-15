# 🔬 Benchmark LLM — Analyse Comparative Complète 10 Modèles (README-v8)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, **Gemini Flash, Gemini Pro**)
> Ce document analyse et commente en profondeur les résultats de chacun des 10 modèles sur les 3 tâches.
> Format : analyse narrative par modèle, podiums commentés, méta-enseignements.

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

Ce choix révèle une philosophie claire : **couvrir les cas limites plutôt que d'optimiser les garanties asymptotiques**. Dans un contexte professionnel, une suite de 18 tests bien pensés a souvent plus de valeur qu'un Red-Black Tree parfait sans couverture.

**Ce que ça dit sur le modèle :** Healer pense "livraison" et "maintenabilité". Il préfère un code compréhensible et testé à un bijou algorithmique difficile à déboguer.

**Limite notable :** Sans équilibrage, l'arbre peut dégénérer en liste liée O(n) sur des données ordonnées.

---

### 🔵 Sonnet 4.6 — L'Excellence Technique

Sonnet est le seul parmi les originaux à implémenter un **Red-Black Tree complet**, avec toutes les rotations, les cas de rééquilibrage et — détail crucial — la mise à jour correcte de `maxEnd` pendant les rotations. C'est la partie la plus difficile et la plus souvent mal implémentée dans les arbres d'intervalles.

En plus, Sonnet ajoute `queryInterval(qs, qe)` — une méthode bonus pour rechercher les intervalles chevauchant une plage, pas seulement un point. Personne ne l'a demandé. Sonnet l'a ajouté parce que c'est la méthode logiquement complémentaire.

**Ce que ça dit sur le modèle :** Sonnet ne se contente pas du cahier des charges. Il pense à ce que l'utilisateur *voudra* faire après et anticipe.

---

### 🟡 GPT-5.4 — Le Scolaire Solide

GPT choisit un **AVL Tree** — l'arbre équilibré "classique" enseigné en algorithmique. C'est un choix conservateur mais défendable : l'AVL garantit O(log n) et son code est plus simple que le Red-Black Tree.

Un point distinctif : GPT implémente un `compareValues()` générique robuste qui gère les types mixtes (number, string, boolean) en les comparant via `String()`. C'est pragmatique et défensif.

**Limite notable :** La suppression utilise un `findByValue()` récursif qui traverse tout l'arbre O(n) — pas O(log n) comme annoncé. Seul modèle à ne pas avoir de feature bonus.

---

### 🟠 Hunter Alpha — L'Efficace Compact

Hunter implémente un **Red-Black Tree** mais de façon plus compacte que Sonnet (444 vs 667 lignes). Il utilise l'approche `_moveRedLeft` / `_moveRedRight` style "Sedgewick LLRB" pour la suppression — élégante et bien connue.

Un point à noter : Hunter utilise `JSON.stringify` pour l'égalité des valeurs. C'est une astuce pragmatique qui fonctionne pour les types simples mais peut casser sur des fonctions ou références circulaires.

---

### 🟣 k2p5 — Le Pragmatique Francophone

k2p5 choisit **AVL Tree** comme GPT, mais avec 50% plus de lignes d'implémentation (364 vs 242). Ce surplus s'explique par une **documentation extensive en français** — k2p5 est le seul modèle à avoir adapté ses commentaires à la langue de l'utilisateur.

k2p5 ajoute `searchInterval()` comme méthode bonus — même idée que Sonnet avec `queryInterval()`. Il est le seul avec Sonnet à avoir cette vision d'ensemble parmi les originaux.

---

### 🔵 Step-3.5 Flash — Le Pragmatique Gratuit

Step-3.5 Flash choisit un **AVL Tree** avec 281 lignes d'implémentation et 267 lignes de tests. Sa méthode bonus `searchOverlap(start, end)` — recherche par chevauchement d'intervalle — montre une vision d'ensemble. Il est le seul modèle gratuit à avoir ajouté cette feature.

**Ce que ça dit sur le modèle :** Pour un modèle gratuit, le niveau est surprenant. Il pense features, pas juste spec.

**Limite notable :** 12 tests seulement — correct mais loin de l'exhaustivité de Healer (18) ou GPT-OSS-120b (57).

---

### 🟣 GPT-OSS-120b — Le Testeur Production

GPT-OSS-120b (120B paramètres open-source) produit le **plus grand nombre de tests du benchmark entier** : **57 assertions sur 14 suites**. Seul modèle à avoir stress-testé son implémentation avec 1000 inserts séquentiels pour vérifier l'équilibre AVL.

Ce qui distingue GPT-OSS-120b : il ne se contente pas de tester que le code *fonctionne*, il teste que les **garanties algorithmiques** sont respectées. Vérification explicite du pruning `maxEnd`, test de performance sous charge, cas limites `[n,n]`, valeurs négatives.

**Ce que ça dit sur le modèle :** GPT-OSS pense "production-ready" — il teste ce que les autres oublient. Pour un modèle open-source gratuit, c'est impressionnant.

---

### 🔵 Haiku 4.5 — Le Polyvalent Complet

Haiku choisit un **Red-Black Tree** avec 556 lignes d'implémentation et 622 lignes de tests. Ce qui distingue Haiku : la méthode `verify()` — **unique dans ce benchmark**. Elle vérifie les propriétés complètes du Red-Black Tree après chaque opération.

Haiku est aussi le seul à tester explicitement les intervalles flottants et les valeurs négatives. 42 tests en 7 catégories : insertion, suppression, recherche, cas limites, stress 1000 inserts, augmentation maxEnd, scénarios complexes.

**Ce que ça dit sur le modèle :** Haiku combine la rigueur architecturale de Sonnet (RB Tree) avec l'obsession de couverture de GPT-OSS. Il ajoute `verify()` parce qu'un RB Tree est complexe et mérite une validation formelle.

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
🥈 GPT-OSS-120b 🆓→ 57 tests, stress 1000 inserts, pruning vérifié. Gratuit et production-ready
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

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Médecin de Garde

Healer structure son rapport comme un diagnostic médical : **symptômes → causes → traitement**. Il introduit une métrique intéressante : le "Taux problème global" qui additionne erreurs et warnings (57.8%), donnant une vision plus complète de la santé du système.

Sa distinction entre temps moyen (~712ms, biaisé par les outliers) et temps médian (~95ms) est **la plus pédagogique** du benchmark.

**Insight unique :** *"Le temps médian reste correct (95ms) — les endpoints froids marchent bien, les endpoints sous charge s'effondrent."*

**Limite :** Le taux d'erreur annoncé (40%) ne correspond pas exactement au comptage des autres.

---

### 🔵 Sonnet 4.6 — L'Architecte

Sonnet produit le tableau le plus détaillé : **répartition par endpoint** avec nb d'appels, nb d'erreurs, pourcentage et temps moyen. C'est la vue dont un ingénieur a besoin pour comprendre *où* est le problème.

La découverte que `/api/payments` a **80% de taux d'échec** est présentée clairement. La notation P0/P1/P2 des recommandations reflète une pensée en mode incident response.

**Insight unique :** *"Score global de santé : 3.5/10 — intervention immédiate requise."*

**Limite :** Ne distingue pas cause et symptôme — le circuit breaker est traité comme une anomalie indépendante.

---

### 🟡 GPT-5.4 — Le Data Analyst (avec un bug de comptage)

GPT est le seul à mentionner le **P95** (4500ms) — une métrique SRE standard. Il déduit également que la panne est "partielle et ciblée".

**Insight unique :** *"Les endpoints simples restent rapides — panne partielle et ciblée, pas un effondrement total."*

**Limite majeure :** GPT compte **52 requêtes** dans un log de 45 lignes. Erreur de comptage qui invalide ses pourcentages.

---

### 🟠 Hunter Alpha — Le Détective

Hunter fait la **meilleure lecture causale** du benchmark : il identifie que le circuit breaker n'est pas une cause racine mais un **symptôme** de la NullPointerException répétée. Cette distinction cause/symptôme est cruciale.

Il analyse la fréquence temporelle : *"7 occurrences, 1 toutes les ~6 min"* — et en déduit un comportement déterministe.

**Insight unique :** *"Les 7 occurrences identiques → bug déterministe, pas aléatoire. Fix : 1h de travail."*

**Limite :** Hunter compte 49 requêtes au lieu de 45.

---

### 🟣 k2p5 — L'Analyste Business

k2p5 se distingue par une **hiérarchisation différente** : il classe l'OutOfMemoryError à **10/10** (le seul modèle à le faire) — la justification : un OOM peut crasher toute la JVM.

**Insight unique :** *"Redémarrer la JVM en priorité absolue — risque de crash total, pas seulement des paiements."*

---

### 🔵 Step-3.5 Flash — Le Penseur Systémique

Step-3.5 Flash produit une **lecture causale en cascade** : les requêtes `search` lentes → occupent les connexions DB → épuisement du pool → OOM.

**Insight unique :** *"DB lente → pool épuisé → OOM → cascade. Ce n'est pas une panne multiple, c'est une seule panne qui se propage."*

---

### 🟣 GPT-OSS-120b — Le Quantitatif à Formule

GPT-OSS-120b fournit une **formule de health score reproductible** :
```
Score = 10 - (error_rate × 5) - ((avg_severity - 5) / 2)
```
C'est une approche scientifique : on peut discuter les coefficients, vérifier le calcul, reproduire le résultat.

**Limite :** Score 6.5/10 semble optimiste comparé aux autres (2-4/10).

---

### 🔵 Haiku 4.5 — Le Statisticien Précis

Haiku produit les **statistiques les plus précises du benchmark** : temps moyen INFO à 56.29ms, WARN à 4124.55ms, ERROR à 84.53ms.

Son insight le plus original : *"Les WARN sont 73× plus lentes que les INFO. Les erreurs sont RAPIDES (84ms) = le service refuse vite = le problème est SQL/réseau, pas une surcharge CPU."*

---

### 🟢 Gemini Flash 🆕 — Le Tableur

Gemini Flash produit un **tableau par endpoint détaillé** avec pourcentage d'erreurs par endpoint. Il identifie correctement que `/api/payments`, `/api/inventory/stock` et `/api/reports/monthly` ont 100% d'erreurs.

**Insight :** *"28.9% error rate global mais 100% sur les endpoints critiques paiement/inventaire/rapports"*

**Limite :** Pas de calcul de temps moyen par catégorie (INFO/WARN/ERROR). Pas de formule de health score expliquée.

---

### 🔵 Gemini Pro 🆕 — L'Exécutif

Gemini Pro produit une **vue exécutive** avec Health Score explicite : **3.2/10**. Il fournit un tableau complet par endpoint avec temps de réponse moyen.

**Insight :** *"Error rate 40% = 18 erreurs sur 45 requêtes. 6 patterns d'erreur identifiés avec sévérité et recommandations P0/P1/P2."*

**Limite :** Le health score 3.2/10 n'a pas de formule expliquée (contrairement à GPT-OSS ou Haiku).

## Verdict Analyse — Podium Commenté (10 modèles)

```
🥇 Hunter Alpha 🆓 → Lecture causale irremplaçable. "CB = symptôme de NPE"
🥈 Sonnet 4.6      → Vue par endpoint + P0/P1/P2. Le plus opérationnel
🥉 Haiku 4.5       → Stats les plus précises (56.29ms/4124.55ms/84.53ms)
4e GPT-OSS-120b 🆓 → Formule scoring reproductible
5e k2p5            → OOM à 10/10 — priorité risque JVM
6e Gemini Pro 💰   → Vue exécutive avec health score 3.2/10
7e Step-3.5 Flash 🆓→ Lecture cascade correcte
8e Gemini Flash 💰 → Tableau endpoint détaillé
9e Healer Alpha 🆓 → Pédagogie moyenne/médiane
10e GPT-5.4        → P95 intéressant mais comptage faux (52 vs 45)
```

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

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Praticien Concis

Healer va droit au but avec ~7600 caractères. Sa phrase d'ouverture résume parfaitement l'enjeu : *"La question n'est plus 'ES est-il plus puissant ?' (oui), mais 'est-ce que j'ai besoin de cette puissance ?'"*

**Ce qui manque :** Aucun benchmark chiffré précis. Pas de seuil de bascule chiffré.

---

### 🔵 Sonnet 4.6 — L'Encyclopédiste

Sonnet fournit le tableau comparatif le plus détaillé avec 5 types de requêtes. Il explique l'architecture de Lucene (segments immutables, merge périodique) mieux que les autres.

**Ce qui manque :** Pas de seuil de bascule précis, pas de recommandation pour Pneu-Tracker.

---

### 🟡 GPT-5.4 — L'Honnête Méthodologue

GPT produit le document le plus long (~10 500 caractères) mais son vrai apport est son **honnêteté intellectuelle** : il reconnaît explicitement qu'il n'a pas trouvé de benchmarks "apples-to-apples".

**Insight unique :** *"Je n'ai pas trouvé de benchmark apples-to-apples. Voici ce que j'ai trouvé et ses limites."*

---

### 🟠 Hunter Alpha — L'Applicable

Hunter **contextualise directement pour notre projet** : *"Dataset probablement < 100K → FTS5 est le choix évident. Zéro infra ajoutée."*

**Insight unique :** Recommandation directe Pneu-Tracker avec raisonnement.

---

### 🟣 k2p5 — Le Précis

k2p5 fournit le **seuil de bascule le plus précis** : 1-5M documents pour FTS5. Son benchmark chiffré (100× moins de latence pour FTS5) est le plus cité.

**Ce qui manque :** Pas de contextualisation Pneu-Tracker comme Hunter.

---

### 🔵 Step-3.5 Flash — L'Architecte Pratique

Step-3.5 Flash fournit des benchmarks précis : 1-5ms FTS5 vs 10-30ms ES. Son seuil ~1M docs est cohérent avec k2p5.

**Insight unique :** *"12 500 refs = 1.25% du seuil performance. FTS5 trivial."*

---

### 🟣 GPT-OSS-120b — Échec Total

GPT-OSS-120b est **inutilisable sur cette tâche**. Sur 4 tentatives, le modèle a soit retourné 0 token, soit listé les fichiers `node_modules` au lieu d'écrire une analyse.

**Ce que ça révèle :** GPT-OSS est un modèle "code completion" — excellent sur les tâches structurées, incapable de générer du texte analytique long.

---

### 🔵 Haiku 4.5 — Le Plus Complet de Tous

Haiku produit le document le plus long : **31 888 caractères, 1000 lignes**. Formule BM25 avec paramètres exacts, benchmarks chiffrés, tableau avec colonne "Pertinent Pneu-Tracker?".

Les chiffres : FTS5 **5-12ms** vs ES **20-50ms**. Seuil **2M documents**. Marge Pneu-Tracker : **160×**. Coût ES : **45-90€/mois**. Plan de migration : 5 phases, 4 risques, rollback explicite.

**Insight unique :** *"12 500 refs = 1.25% du seuil critique. 160× de marge."*

---

### 🟢 Gemini Flash 🆕 — Le Pragmatique

Gemini Flash produit un rapport de **~16 500 caractères** avec architecture en diagrammes ASCII, benchmarks chiffrés et **recommandation explicite** : *"SQLite FTS5 est la solution recommandée pour Pneu-Tracker"*.

**Points forts :**
- Latence FTS5 **<10ms** vs ES **20-100ms**
- Seuil de bascule **1M documents**
- Coût ES estimé **50-200€/mois**
- 3 scénarios de migration détaillés

---

### 🔵 Gemini Pro 🆕 — L'Architecte

Gemini Pro produit un rapport de **~12 500 caractères** avec **plan de migration en 4 phases** et estimation de downtime (2-4 heures).

**Points forts :**
- Latence FTS5 **1-10ms** vs ES **10-50ms**
- Seuil de bascule **100K-1M documents**
- Coût ES **20-100€/mois**
- Downtime estimé : 2-4h

## Verdict Recherche — Podium Commenté (10 modèles)

```
🥇 Haiku 4.5       → 31.5KB, seuil 2M docs, 160× marge, coût 45-90€, plan 5 phases
🥈 k2p5            → Seuil 1-5M docs + benchmark 100×
🥉 Hunter Alpha 🆓 → Application directe au projet Pneu-Tracker
4e Step-3.5 Flash 🆓→ Architecture solide + plan 8 étapes
5e Gemini Flash 💰 → 16.5KB, <10ms vs 20-100ms, recommandation explicite
6e Gemini Pro 💰  → 12.5KB, plan migration 4 phases, downtime 2-4h
7e Sonnet 4.6      → Le plus exhaustif pour un architecte
8e GPT-5.4         → Le plus honnête sur les limites de ses sources
9e Healer Alpha 🆓 → Concis et correct mais sans profondeur
N/A GPT-OSS-120b 🆓→ ❌ Échec × 4
```

---

# 🏆 VERDICT FINAL — 10 Modèles

## Tableau de Synthèse Complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35 | GPT-OSS | Haiku | GemFlash | GemPro |
|---------|--------|--------|-----|--------|------|--------|---------|-------|----------|--------|
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
   RB Tree + verify() + 42 tests + stats précises + 31.5KB recherche
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
   Seul payant derrière des gratuits
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
