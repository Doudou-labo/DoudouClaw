# 🔬 Benchmark LLM — Analyse Comparative Complète 8 Modèles (README-v7)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5)
> Ce document analyse et commente en profondeur les résultats de chacun des 8 modèles sur les 3 tâches.
> Format inspiré du README-v5 — analyse narrative par modèle, podiums commentés, méta-enseignements.

---

## Les 8 Concurrents

| Modèle | Alias | Provider | Prix |
|--------|-------|----------|------|
| `openrouter/openrouter/healer-alpha` | **Healer Alpha** | OpenRouter | 🆓 Gratuit |
| `anthropic/claude-sonnet-4-6` | **Sonnet 4.6** | Anthropic | 💰 Payant |
| `openai-codex/gpt-5.4` | **GPT-5.4** | OpenAI | 💰 Payant |
| `openrouter/hunter-alpha` | **Hunter Alpha** | OpenRouter | 🆓 Gratuit |
| `kimi-coding/k2p5` | **k2p5** | Moonshot / Kimi | 💰 Payant |
| `openrouter/stepfun/step-3.5-flash:free` | **Step-3.5 Flash** 🆕 | StepFun | 🆓 Gratuit |
| `openrouter/openai/gpt-oss-120b:free` | **GPT-OSS-120b** 🆕 | OpenAI open-source | 🆓 Gratuit |
| `anthropic/claude-haiku-4-5` | **Haiku 4.5** 🆕 | Anthropic | 💰 Payant |

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

*\* Estimé — GPT-OSS-120b a fourni 57/57 tests sans détailler les lignes exactes*

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Champion des Tests Économiques

Healer Alpha adopte un **BST simple augmenté avec maxEnd**, sans équilibrage automatique. C'est la solution la moins sophistiquée architecturalement — mais c'est le modèle qui écrit le **plus de tests parmi les payants originaux** (18) et les plus diversifiés.

Ce choix révèle une philosophie claire : **couvrir les cas limites plutôt que d'optimiser les garanties asymptotiques**. Dans un contexte professionnel, une suite de 18 tests bien pensés a souvent plus de valeur qu'un Red-Black Tree parfait sans couverture.

**Ce que ça dit sur le modèle :** Healer pense "livraison" et "maintenabilité". Il préfère un code compréhensible et testé à un bijou algorithmique difficile à déboguer.

**Limite notable :** Sans équilibrage, l'arbre peut dégénérer en liste liée O(n) sur des données ordonnées. En production réelle avec de gros volumes, ça peut mordre.

---

### 🔵 Sonnet 4.6 — L'Excellence Technique

Sonnet est le seul parmi les originaux à implémenter un **Red-Black Tree complet**, avec toutes les rotations, les cas de rééquilibrage et — détail crucial — la mise à jour correcte de `maxEnd` pendant les rotations. C'est la partie la plus difficile et la plus souvent mal implémentée dans les arbres d'intervalles.

En plus, Sonnet ajoute `queryInterval(qs, qe)` — une méthode bonus pour rechercher les intervalles chevauchant une plage, pas seulement un point. Personne ne l'a demandé. Sonnet l'a ajouté parce que c'est la méthode logiquement complémentaire.

**Ce que ça dit sur le modèle :** Sonnet ne se contente pas du cahier des charges. Il pense à ce que l'utilisateur *voudra* faire après et anticipe. C'est le modèle le plus proche d'un ingénieur senior qui voit au-delà de la spec.

**Limite notable :** 667 lignes pour ce qui est essentiellement une structure de données. Si tu n'as pas besoin des garanties Red-Black, c'est du surpoids.

---

### 🟡 GPT-5.4 — Le Scolaire Solide

GPT choisit un **AVL Tree** — l'arbre équilibré "classique" enseigné en algorithmique. C'est un choix conservateur mais défendable : l'AVL garantit O(log n) et son code est plus simple que le Red-Black Tree.

Un point distinctif : GPT implémente un `compareValues()` générique robuste qui gère les types mixtes (number, string, boolean) en les comparant via `String()`. C'est pragmatique et défensif.

**Ce que ça dit sur le modèle :** GPT suit les patterns éprouvés. Il ne prend pas de risques, n'ajoute pas de features non demandées, ne sur-ingénie pas. C'est le modèle "fiable" qui livrera ce qui est spécifié, ni plus ni moins.

**Limite notable :** La suppression utilise un `findByValue()` récursif qui traverse tout l'arbre O(n) — pas O(log n) comme annoncé. Seul modèle à ne pas avoir de feature bonus.

---

### 🟠 Hunter Alpha — L'Efficace Compact

Hunter implémente un **Red-Black Tree** mais de façon plus compacte que Sonnet (444 vs 667 lignes). Il utilise l'approche `_moveRedLeft` / `_moveRedRight` style "Sedgewick LLRB" pour la suppression — élégante et bien connue des gens qui ont lu les algorithmes de Sedgewick.

Un point à noter : Hunter utilise `JSON.stringify` pour l'égalité des valeurs. C'est une astuce pragmatique qui fonctionne pour les types simples et objets sérialisables, mais qui peut casser sur des fonctions, des références circulaires ou des Maps.

**Ce que ça dit sur le modèle :** Hunter cherche l'efficacité d'implémentation — faire le maximum avec le minimum de lignes. La dette technique acceptée (`JSON.stringify`) montre un pragmatisme qui peut être une force ou une faiblesse selon le contexte.

**Limite notable :** Pas de `queryInterval`, moins de tests que Sonnet et Healer. Fonctionne mais ne va pas au-delà.

---

### 🟣 k2p5 — Le Pragmatique Francophone

k2p5 choisit **AVL Tree** comme GPT, mais avec 50% plus de lignes d'implémentation (364 vs 242). Ce surplus s'explique par une **documentation extensive en français** — k2p5 est le seul modèle à avoir adapté ses commentaires à la langue de l'utilisateur, un signal d'intelligence contextuelle.

k2p5 ajoute `searchInterval()` comme méthode bonus — même idée que Sonnet avec `queryInterval()`, mais implémentée sur une base AVL. Il est le seul avec Sonnet à avoir cette vision d'ensemble parmi les originaux.

**Ce que ça dit sur le modèle :** k2p5 est attentif au contexte utilisateur. La documentation française n'était pas demandée, mais c'est une marque d'empathie envers le lecteur.

**Limite notable :** AVL vs Red-Black : l'AVL fait plus de rotations à l'insertion. Sur des workloads write-heavy, c'est un compromis à évaluer.

---

### 🔵 Step-3.5 Flash — Le Pragmatique Gratuit

Step-3.5 Flash choisit un **AVL Tree** avec 281 lignes d'implémentation et 267 lignes de tests — un bon équilibre. Sa convention semi-ouverte `[start, end)` est le standard pour les structures d'intervalle.

Son vrai apport : la méthode bonus `searchOverlap(start, end)` — recherche par chevauchement d'intervalle, fonctionnellement équivalente au `queryInterval()` de Sonnet. Il est le seul modèle gratuit à avoir ajouté cette vision d'ensemble. Il gère aussi les duplications (mêmes bornes, valeurs différentes) et expose des méthodes utilitaires (`getMaxEnd()`, `size`, `height`, `clear()`).

**Ce que ça dit sur le modèle :** Pour un modèle gratuit, le niveau est surprenant. Il pense features, pas juste spec.

**Limite notable :** 12 tests seulement — correct mais loin de l'exhaustivité de Healer (18) ou GPT-OSS-120b (57).

---

### 🟣 GPT-OSS-120b — Le Testeur Production

GPT-OSS-120b (120B paramètres open-source) produit le **plus grand nombre de tests du benchmark entier** : **57 assertions sur 14 suites**. Seul modèle à avoir stress-testé son implémentation avec 1000 inserts séquentiels pour vérifier l'équilibre AVL.

Ce qui distingue GPT-OSS-120b des autres : il ne se contente pas de tester que le code *fonctionne*, il teste que les **garanties algorithmiques** sont respectées. Vérification explicite du pruning `maxEnd`, test de performance sous charge, cas limites `[n,n]`, valeurs négatives, ré-insertion après suppression totale.

**Ce que ça dit sur le modèle :** GPT-OSS pense "production-ready" — il teste ce que les autres oublient. Pour un modèle open-source gratuit, c'est impressionnant.

**Limite notable :** Les lignes exactes d'implémentation ne sont pas fournies. On sait que 57/57 tests passent, mais difficile de juger la qualité du code directement.

---

### 🔵 Haiku 4.5 — Le Polyvalent Complet

Haiku choisit un **Red-Black Tree** (comme Sonnet) avec 556 lignes d'implémentation et 622 lignes de tests. C'est le fichier d'implémentation le plus long du benchmark, et la suite de tests la plus longue parmi les modèles qui ont rapporté leurs métriques.

Ce qui distingue Haiku : la méthode `verify()` — **unique dans ce benchmark**. Elle vérifie les propriétés complètes du Red-Black Tree après chaque opération. Aucun autre modèle n'a exposé une telle méthode de validation. Haiku est aussi le seul à tester explicitement les intervalles flottants et les valeurs négatives dans sa suite.

42 tests en 7 catégories : insertion, suppression, recherche, cas limites, stress 1000 inserts, augmentation maxEnd, scénarios complexes. La couverture est large et méthodique.

**Ce que ça dit sur le modèle :** Haiku combine la rigueur architecturale de Sonnet (RB Tree) avec l'obsession de couverture de GPT-OSS. Il ajoute `verify()` parce qu'un RB Tree est complexe et mérite une validation formelle.

**Limite notable :** 42 tests, c'est bien — mais GPT-OSS reste devant avec 57. Et la verbosité (1178 lignes au total) peut sembler excessive pour ce type de structure.

## Verdict Code — Podium Commenté

```
🥇 Sonnet 4.6     → RB Tree complet + queryInterval + mise à jour maxEnd pendant rotations.
                    Le seul à avoir vérifié ce détail crucial. Architecture irréprochable.

🥈 GPT-OSS-120b 🆓→ 57 tests, stress 1000 inserts, pruning vérifié. Gratuit et production-ready.
                    Ce qui manque : pas de feature bonus au-delà du spec.

🥉 Haiku 4.5      → RB Tree + verify() unique + 42 tests + floats/négatifs. Complet.
                    Plus de lignes que Sonnet pour un résultat équivalent côté archi.

4e k2p5           → AVL solide + searchInterval + docs FR. Meilleur équilibre features/lisibilité.
5e Hunter Alpha 🆓→ RB compact LLRB. Efficace, mais JSON.stringify et pas de feature bonus.
6e Step-3.5 🆓    → AVL propre + searchOverlap. Excellent pour un gratuit, couverture légère.
7e Healer Alpha 🆓→ BST + 18 tests bien écrits. Architecture fragile mais tests solides.
8e GPT-5.4        → AVL conventionnel, zéro bonus, suppression O(n). Le plus décevant.
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

*\* GPT-OSS via formule mathématique — résultat plus optimiste que le jugement qualitatif*

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Médecin de Garde

Healer structure son rapport comme un diagnostic médical : **symptômes → causes → traitement**. Il introduit une métrique intéressante : le "Taux problème global" qui additionne erreurs et warnings (57.8%), donnant une vision plus complète de la santé du système.

Sa distinction entre temps moyen (~712ms, biaisé par les outliers) et temps médian (~95ms) est **la plus pédagogique** du benchmark. Cette nuance est souvent manquée en monitoring et c'est une vraie valeur ajoutée.

**Insight unique :** *"Le temps médian reste correct (95ms) — les endpoints froids marchent bien, les endpoints sous charge s'effondrent."*

**Limite :** Le taux d'erreur annoncé (40%) ne correspond pas exactement au comptage des autres. Healer semble avoir compté certains WARN comme erreurs.

---

### 🔵 Sonnet 4.6 — L'Architecte

Sonnet produit le tableau le plus détaillé : **répartition par endpoint** avec nb d'appels, nb d'erreurs, pourcentage et temps moyen. C'est la vue dont un ingénieur a besoin pour comprendre *où* est le problème.

La découverte que `/api/payments` a **80% de taux d'échec** est présentée clairement. La notation P0/P1/P2 des recommandations reflète une pensée en mode incident response.

**Insight unique :** *"Score global de santé : 3.5/10 — intervention immédiate requise."*

**Limite :** Ne distingue pas cause et symptôme — le circuit breaker est traité comme une anomalie indépendante, pas comme la conséquence de la NPE.

---

### 🟡 GPT-5.4 — Le Data Analyst (avec un bug de comptage)

GPT est le seul à mentionner le **P95** (4500ms) — une métrique SRE standard qui capture les pires cas sans être influencée par les outliers extrêmes. Il déduit également que la panne est "partielle et ciblée" — une observation analytique fine.

**Insight unique :** *"Les endpoints simples restent rapides — panne partielle et ciblée, pas un effondrement total."*

**Limite majeure :** GPT compte **52 requêtes** dans un log de 45 lignes. Erreur de comptage qui invalide ses pourcentages. Difficile d'avoir confiance dans une analyse quantitative avec un numérateur erroné.

---

### 🟠 Hunter Alpha — Le Détective

Hunter fait la **meilleure lecture causale** du benchmark : il identifie que le circuit breaker n'est pas une cause racine mais un **symptôme** de la NullPointerException répétée. Cette distinction cause/symptôme est cruciale pour ne pas perdre du temps à corriger des effets plutôt que des causes.

Il analyse la fréquence temporelle : *"7 occurrences, 1 toutes les ~6 min"* — et en déduit un comportement déterministe (code path non couvert) plutôt qu'aléatoire. C'est du debug de haut niveau.

**Insight unique :** *"Les 7 occurrences identiques → bug déterministe, pas aléatoire. Fix : 1h de travail."*

**Limite :** Hunter compte 49 requêtes au lieu de 45. L'analyse qualitative est excellente mais les chiffres absolus sont approximatifs.

---

### 🟣 k2p5 — L'Analyste Business

k2p5 se distingue par une **hiérarchisation différente** : il classe l'OutOfMemoryError à **10/10** (le seul modèle à le faire) — la justification : un OOM peut crasher toute la JVM, ce qui est une menace plus globale qu'une NPE sur un seul service.

k2p5 produit le tableau de distribution par endpoint le plus complet, avec un comptage exact (45 requêtes).

**Insight unique :** *"Redémarrer la JVM en priorité absolue — risque de crash total, pas seulement des paiements."*

**Limite :** La recommandation de prioriser la JVM avant les paiements peut être discutable — les paiements sont souvent plus critiques business.

---

### 🔵 Step-3.5 Flash — Le Penseur Systémique

Step-3.5 Flash produit une **lecture causale en cascade** : il identifie que les requêtes `search` lentes → occupent les connexions DB → épuisement du pool → OOM sur les rapports. C'est une vision systémique qui voit l'interaction entre les composants, pas juste les anomalies isolées.

Il note aussi que *"les erreurs s'agrègent autour de 08:06-08:43, indiquant une dégradation progressive"* — une lecture temporelle que peu d'autres formulent explicitement.

**Insight unique :** *"DB lente → pool épuisé → OOM → cascade. Ce n'est pas une panne multiple, c'est une seule panne qui se propage."*

**Limite :** Score de santé 2/10 — le plus pessimiste du lot. La méthode de calcul n'est pas expliquée, ce qui rend le chiffre difficile à comparer.

---

### 🟣 GPT-OSS-120b — Le Quantitatif à Formule

GPT-OSS-120b fournit une **formule de health score reproductible** — seul modèle transparent sur son scoring :

```
Score = 10 - (error_rate × 5) - ((avg_severity - 5) / 2)
      = 10 - (0.356 × 5) - ((8.0 - 5) / 2) = 6.72 ≈ 6.5/10
```

C'est une approche scientifique : on peut discuter les coefficients, on peut vérifier le calcul, on peut reproduire le résultat avec d'autres données.

**Insight unique :** La formule de scoring reproductible — aucun autre modèle ne rend son scoring aussi transparent.

**Limite :** Score 6.5/10 semble optimiste comparé aux autres (2-4/10). La formule mathématique pénalise moins que le jugement humain qui tient compte du contexte business.

---

### 🔵 Haiku 4.5 — Le Statisticien Précis

Haiku produit les **statistiques les plus précises du benchmark** : temps moyen INFO à 56.29ms, WARN à 4124.55ms, ERROR à 84.53ms. Ces chiffres ne sont pas des approximations — ce sont des moyennes calculées requête par requête.

Son insight le plus original : *"Les WARN sont 73× plus lentes que les INFO. Les erreurs sont RAPIDES (84ms) = le service refuse vite = le problème est SQL/réseau, pas une surcharge CPU."* Cette distinction vitesse-erreurs/vitesse-lenteurs est rarement formulée aussi clairement.

Il fournit aussi une formule de scoring explicite (comme GPT-OSS-120b) et un tableau complet par endpoint avec temps moyen calculé pour chaque groupe.

**Insight unique :** *"Les erreurs sont rapides et les WARN sont lentes. Ce ne sont pas deux symptômes du même problème — ce sont deux problèmes distincts."*

**Limite :** Health score de 2.5/10 — pessimiste comme Step-3.5. Correct qualitativement mais donne une image plus sombre que GPT-OSS-120b pour le même log.

## Verdict Analyse — Podium Commenté

```
🥇 Hunter Alpha 🆓 → Lecture causale irremplaçable. Seul à distinguer cause/symptôme
                     explicitement. "CB = symptôme de NPE, pas cause racine."

🥈 Sonnet 4.6      → Vue par endpoint + P0/P1/P2. Le plus opérationnel en mode incident.
                     Ce qu'un SRE veut voir dans son dashboard.

🥉 Haiku 4.5       → Stats les plus précises (56.29ms / 4124.55ms / 84.53ms).
                     Insight unique sur la vitesse différenciée erreurs/WARN.

4e GPT-OSS-120b 🆓 → Formule scoring reproductible. Transparence méthodologique exemplaire.
5e k2p5            → OOM à 10/10 — seul à prioriser le risque JVM systémique.
6e Step-3.5 Flash 🆓→ Lecture cascade correcte, score non expliqué.
7e Healer Alpha 🆓 → Pédagogie moyenne/médiane. Taux d'erreur approximatif.
8e GPT-5.4         → P95 intéressant mais comptage faux (52 vs 45). Invalide les %.
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

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Praticien Concis

Healer va droit au but avec ~7600 caractères. Sa phrase d'ouverture résume parfaitement l'enjeu : *"La question n'est plus 'ES est-il plus puissant ?' (oui), mais 'est-ce que j'ai besoin de cette puissance ?'"*

**Ce qui manque :** Aucun benchmark chiffré précis. Pas de seuil de bascule chiffré. Pas de contextualisation Pneu-Tracker.

---

### 🔵 Sonnet 4.6 — L'Encyclopédiste

Sonnet fournit le tableau comparatif le plus détaillé avec 5 types de requêtes et leurs caractéristiques pour chaque technologie. Il explique l'architecture de Lucene (segments immutables, merge périodique) mieux que les autres — utile pour comprendre *pourquoi* ES a de meilleures garanties sur de gros volumes.

**Ce qui manque :** Pas de seuil de bascule précis, pas de recommandation pour Pneu-Tracker. Le plus exhaustif pour un architecte, le moins utile pour une décision rapide.

---

### 🟡 GPT-5.4 — L'Honnête Méthodologue

GPT produit le document le plus long (~10 500 caractères) mais son vrai apport est son **honnêteté intellectuelle** : il reconnaît explicitement qu'il n'a pas trouvé de benchmarks "apples-to-apples" 2025-2026 comparant FTS5 et ES sur les mêmes conditions. Cette transparence est rare et précieuse.

**Insight unique :** *"Je n'ai pas trouvé de benchmark apples-to-apples. Voici ce que j'ai trouvé et ses limites."*

**Ce qui manque :** Des conclusions tranchées. GPT présente les faits sans recommander. Pour un décideur, c'est frustrant.

---

### 🟠 Hunter Alpha — L'Applicable

Hunter fait quelque chose qu'aucun autre modèle ne fait : il **contextualise directement pour notre projet**. *"Dataset probablement < 100K enregistrements → FTS5 est le choix évident. Zéro infra ajoutée, intégration native, migration possible plus tard si le dataset explose."*

**Insight unique :** Recommandation directe Pneu-Tracker avec raisonnement. Le plus utile immédiatement.

**Ce qui manque :** Moins d'architecture théorique. Pour quelqu'un qui veut comprendre en profondeur, le document de Sonnet ou Haiku sera plus riche.

---

### 🟣 k2p5 — Le Précis

k2p5 fournit le **seuil de bascule le plus précis** de la première vague : 1-5M documents pour FTS5, au-delà Elasticsearch. Ce chiffre est concret, mémorisable et directement actionnable.

Son benchmark chiffré (100× moins de latence pour FTS5 sur volumes modestes) est le plus cité de la première vague.

**Ce qui manque :** Pas de contextualisation Pneu-Tracker comme Hunter. Pas de chiffres de coût ES.

---

### 🔵 Step-3.5 Flash — L'Architecte Pratique

Step-3.5 Flash produit une analyse architecturale solide basée sur ses connaissances internes (pas une recherche web en temps réel). Il fournit des benchmarks précis : 1-5ms FTS5 vs 10-30ms ES pour les requêtes simples. Son seuil ~1M docs est cohérent avec k2p5.

Le plan de migration en 8 étapes avec feature-flag `USE_ES` est pratique et directement réutilisable.

**Insight unique :** Recommandation FTS5 pour Pneu-Tracker avec les chiffres : *"12 500 refs = 1.25% du seuil performance. FTS5 trivial."*

**Ce qui manque :** Sources non citées (connaissance interne du modèle, pas de recherche web réelle).

---

### 🟣 GPT-OSS-120b — Échec Total

GPT-OSS-120b est **inutilisable sur cette tâche**. Sur 4 tentatives avec des prompts différents, le modèle a soit retourné 0 token output, soit listé les fichiers `node_modules/react-dom` du projet pneu-tracker au lieu d'écrire une analyse.

Ce comportement révèle une limite fondamentale : GPT-OSS-120b est un modèle "code completion" — excellent sur les tâches structurées et prévisibles (code, analyse de logs), incapable de générer du texte analytique long non structuré.

**Ce que ça révèle :** Les modèles open-source gratuits ont souvent des domaines de compétence étroits. GPT-OSS est fort sur les tâches formatées, fragile sur les productions textuelles ouvertes.

---

### 🔵 Haiku 4.5 — Le Plus Complet de Tous

Haiku produit le document le plus long du benchmark entier : **31 888 caractères, 1000 lignes**. C'est ×4 le volume des autres modèles. La profondeur est réelle : formule BM25 avec paramètres exacts, architecture Lucene en détail, benchmarks chiffrés pour les deux solutions, tableau fonctionnel avec colonne "Pertinent Pneu-Tracker?" (unique dans ce benchmark).

Les chiffres : FTS5 **5-12ms** vs ES **20-50ms** pour les requêtes simples. Seuil critique à **2M documents** (justification technique : B-tree depth augmente, posting lists trop longues). Marge pour Pneu-Tracker : **160×**. Coût ES : **45-90€/mois** (10-15× plus cher que FTS5).

Le plan de migration est le plus complet : 5 phases avec durées estimées, 4 risques identifiés avec mitigation, rollback plan explicite.

**Insight unique :** *"12 500 refs = 1.25% du seuil critique. 160× de marge. Vous avez du temps avant d'avoir un problème."*

**Limite :** Analyse basée sur la connaissance interne du modèle (comme Step-3.5), pas une vraie recherche web avec sources URL citées. Les chiffres sont cohérents et crédibles, mais pas sourcés.

## Verdict Recherche — Podium Commenté

```
🥇 Haiku 4.5       → 31.5KB, benchmarks chiffrés, seuil 2M docs, 160× marge,
                     coût ES 45-90€/mois, plan migration 5 phases + 4 risques.
                     Le plus complet et le plus utilisable pour une décision.

🥈 k2p5            → Seuil 1-5M docs + benchmark 100×. Le plus actionnable
                     pour une décision d'architecture dans la première vague.

🥉 Hunter Alpha 🆓 → Application directe au projet Pneu-Tracker.
                     Le plus utile si tu veux juste un "go/no-go" rapide.

4e Step-3.5 🆓     → Architecture solide + plan 8 étapes. Bon sans être exceptionnel.
5e Sonnet 4.6      → Le plus exhaustif pour un architecte qui veut comprendre.
6e GPT-5.4         → Le plus honnête sur les limites de ses sources.
7e Healer Alpha 🆓 → Concis et correct mais sans profondeur ni chiffres.
N/A GPT-OSS-120b 🆓→ ❌ Échec × 4. Hors périmètre fonctionnel du modèle.
```

---

# 🏆 VERDICT FINAL — 8 Modèles

## Tableau de Synthèse Complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35 | GPT-OSS | Haiku |
|---------|--------|--------|-----|--------|------|--------|---------|-------|
| Code — Architecture | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Code — Tests | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Code — Features | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Analyse — Rigueur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Analyse — Insight | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Action | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Recherche — Profondeur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ |
| Recherche — Applicabilité | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ |
| Adaptation contexte | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Consistance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **TOTAL /50** | **33** | **47** | **30** | **44** | **45** | **41** | **34** | **49** |

## Profils en une Phrase

| Modèle | Signature | Prix |
|--------|-----------|------|
| **Haiku 4.5** | *"Je fais les choses correctement, en détail, avec verify() pour en être sûr."* | 💰 |
| **Sonnet 4.6** | *"Je fais les choses correctement, même si tu n'as pas demandé le détail."* | 💰 |
| **k2p5** | *"Je m'adapte à toi, je suis précis, et je ne fais pas de bruit inutile."* | 💰 |
| **Hunter Alpha** | *"Je trouve la cause racine et je te dis quoi faire maintenant."* | 🆓 |
| **Step-3.5 Flash** | *"Je suis pragmatique, je livre sur les 3 tâches, et je suis gratuit."* | 🆓 |
| **GPT-OSS-120b** | *"Je teste tout sur le code, mais ne me demande pas d'écrire un article."* | 🆓 |
| **Healer Alpha** | *"Je livre vite, je teste bien, je ne sur-ingénie pas."* | 🆓 |
| **GPT-5.4** | *"Je suis fiable, prévisible, honnête sur ce que je ne sais pas."* | 💰 |

## Classement Final

```
🥇 Haiku 4.5 (49/50)
   RB Tree + verify() + 42 tests + stats précises + 31.5KB recherche.
   Le modèle le plus complet sur les 3 tâches. Nouveau roi du benchmark.

🥈 Sonnet 4.6 (47/50)
   L'excellence technique sur le code (RB Tree, queryInterval).
   Légèrement dépassé sur la recherche par Haiku, mais reste inégalé
   sur la qualité pure du code.

🥉 k2p5 (45/50)
   La surprise constante. Seuil 1-5M docs, docs en français, adaptable.
   Le meilleur payant accessible.

4e Hunter Alpha 🆓 (44/50)
   Le meilleur gratuit de la première vague. Analyse causale irremplaçable.
   Démontre que "gratuit" ne veut pas dire "inférieur".

5e Step-3.5 Flash 🆓 (41/50)
   Le meilleur gratuit polyvalent. 3/3 tâches réussies, aucun dérapage.
   Excellent ratio qualité/prix pour un usage général.

6e GPT-OSS-120b 🆓 (34/50)
   Spécialiste code et analyse structurée (57 tests !). Inutilisable sur
   la recherche/rédaction longue. À utiliser sur des tâches ciblées.

7e Healer Alpha 🆓 (33/50)
   Le testeur de la première vague. Bon code, architecture fragile.
   Cohérent mais sans surprises.

8e GPT-5.4 (30/50)
   Le scolaire. Correct sur tout, excellent sur rien. Erreur de comptage
   sur les logs qui plombe sa crédibilité. Le seul modèle payant derrière
   des gratuits.
```

---

## 💡 Méta-Enseignements du Benchmark v7

1. **Le payant n'est pas toujours meilleur** — GPT-5.4 (payant) finit dernier, derrière 4 modèles gratuits. La catégorie de prix n'est pas un prédicteur de performance.

2. **Les architectures complexes méritent une validation** — Haiku est le seul à avoir `verify()`. Sonnet a un RB Tree parfait mais aucun test de cohérence post-opération. Un RB Tree sans vérification, c'est de la confiance aveugle.

3. **Les modèles gratuits ont des domaines de compétence** — GPT-OSS-120b : imbattable sur les tests de code (57 assertions), inutilisable sur la rédaction (4 échecs). Step-3.5 Flash : polyvalent mais moins profond. Il faut choisir le bon outil pour chaque tâche.

4. **La précision des stats révèle l'attention** — Haiku calcule 56.29ms / 4124.55ms / 84.53ms. GPT-5.4 ne compte même pas correctement (52 vs 45). La rigueur dans les chiffres est un signal de fiabilité générale.

5. **Un chiffre précis + une marge = une décision** — Le "2M docs, marge 160×" de Haiku est plus utile que le "volumes modestes vs grands" de Sonnet. La précision permet d'arrêter de se poser la question.

6. **La taille de l'output ne garantit pas la qualité** — GPT-OSS-120b peut produire 0 token sur une tâche ouverte après avoir produit 57 assertions parfaites sur une tâche structurée. Le modèle n'est pas uniformément "bon" — il est bon sur certains types de tâches.

7. **La lecture causale est une compétence rare** — Hunter Alpha est le seul à formuler explicitement "le circuit breaker est un symptôme, pas une cause". Cette distinction sauve des heures de debug. Sur 8 modèles, un seul le fait clairement.

---

## 📋 Recommandations d'Usage (mise à jour)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique avec validation | **Haiku 4.5** | RB Tree + verify() + 42 tests + features |
| Code prod élégant et compact | **Sonnet 4.6** | Architecture pure, queryInterval bonus |
| Tests exhaustifs (budget zéro) | **GPT-OSS-120b** 🆓 | 57 assertions, stress test, gratuit |
| Debug incident production | **Hunter Alpha** 🆓 | Cause racine + délai fix estimé, gratuit |
| Analyse logs précise | **Haiku 4.5** | Stats par catégorie les plus précises |
| Décision architecture recherche | **Haiku 4.5** | Benchmark complet + seuil + coût + migration |
| Seuil de bascule FTS5/ES | **k2p5** ou **Haiku** | 1-5M docs / 2M docs selon source |
| Contextualisation projet | **Hunter Alpha** 🆓 | Relie toujours la réponse au use case |
| Polyvalence (budget zéro) | **Step-3.5 Flash** 🆓 | 3/3 tâches réussies, aucun dérapage |
| Documentation technique | **Sonnet 4.6** | Exhaustif, structuré, professionnel |

---

*v7 — Benchmark à 8 modèles (5 payants + 3 gratuits), analyse commentée sur 3 tâches — 2026-03-15*
