# 🔬 Benchmark LLM — Analyse Comparative Complète 5 Modèles (README-v5)

> **Dates :** 2026-03-12 (4 modèles) + 2026-03-13 (k2p5 ajouté)  
> Ce document analyse et commente en profondeur les résultats de chacun des 5 modèles sur les 3 tâches.

---

## Les 5 Concurrents

| Modèle | Alias | Type |
|--------|-------|------|
| `openrouter/openrouter/healer-alpha` | **Healer Alpha** | OpenRouter |
| `anthropic/claude-sonnet-4-6` | **Sonnet 4.6** | Anthropic |
| `openai-codex/gpt-5.4` | **GPT-5.4** | OpenAI |
| `openrouter/hunter-alpha` | **Hunter Alpha** | OpenRouter |
| `kimi-coding/k2p5` | **k2p5** | Moonshot / Kimi |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats Bruts

| Modèle | Archi | Lignes impl. | Lignes tests | Tests | Feature bonus |
|--------|-------|-------------|-------------|-------|---------------|
| Healer Alpha | BST augmenté | 192 | 274 | **18** | — |
| **Sonnet 4.6** | Red-Black Tree | **438** | 229 | 15 | `queryInterval()` |
| GPT-5.4 | AVL Tree | 242 | 151 | 13 | — |
| Hunter Alpha | Red-Black BST | 238 | 206 | 15 | — |
| k2p5 | AVL Tree | 364 | **282** | 12+ | `searchInterval()` |

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Champion des Tests

Healer Alpha adopte un **BST simple augmenté avec maxEnd**, sans équilibrage automatique. Sur le papier, c'est la solution la moins sophistiquée architecturalement — mais c'est le modèle qui écrit le **plus de tests** (18) et les plus diversifiés.

Ce choix révèle une philosophie claire : **couvrir les cas limites plutôt que d'optimiser les garanties asymptotiques**. Dans un contexte professionnel, une suite de 18 tests bien pensés a souvent plus de valeur qu'un Red-Black Tree parfait sans couverture.

**Ce que ça dit sur le modèle :** Healer pense "livraison" et "maintenabilité". Il préfère un code compréhensible et testé à un bijou algorithmique difficile à déboguer.

**Limite notable :** Sans équilibrage, l'arbre peut dégénérer en liste liée O(n) sur des données ordonnées. En production réelle avec de gros volumes, ça peut mordre.

---

### 🔵 Sonnet 4.6 — L'Excellence Technique

Sonnet est le seul à implémenter un **Red-Black Tree complet**, avec toutes les rotations, les cas de rééquilibrage et — détail crucial — la mise à jour correcte de `maxEnd` pendant les rotations. C'est la partie la plus difficile et la plus souvent mal implémentée dans les arbres d'intervalles.

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

k2p5 ajoute `searchInterval()` comme méthode bonus — même idée que Sonnet avec `queryInterval()`, mais implémentée sur une base AVL. Il est le seul avec Sonnet à avoir cette vision d'ensemble.

**Ce que ça dit sur le modèle :** k2p5 est attentif au contexte utilisateur. La documentation française n'était pas demandée, mais c'est une marque d'empathie envers le lecteur. Niveau algorithmique : entre GPT et Sonnet — meilleur que GPT (plus de features), moins audacieux que Sonnet (pas de RB).

**Limite notable :** AVL vs Red-Black : les garanties de hauteur sont légèrement meilleures avec AVL, mais l'AVL fait plus de rotations à l'insertion. Sur des workloads write-heavy, c'est un compromis à évaluer.

## Verdict Code — Podium Commenté

```
🥇 Sonnet 4.6  → Architecture + features + rigueur. Aucun compromis.
🥈 k2p5        → Équilibre features / lisibilité / adaptation contexte.
🥈 Hunter      → Compact, efficace, moins de features.
🥉 Healer      → Tests imbattables, structure moins sophistiquée.
4ème GPT       → Solide mais le plus conventionnel et sans bonus.
```

---

# 🔍 TÂCHE 2 — Analyse de Logs Serveur

## Résultats Bruts

| Modèle | Requêtes comptées | Taux erreur | OOM score | NPE score | Style d'analyse |
|--------|-------------------|-------------|-----------|-----------|-----------------|
| **Sonnet 4.6** | **45** ✅ | 31.1% | 7/10 | 9/10 | Tableau par endpoint |
| **Healer Alpha** | **45** ✅ | 40.0% | 8/10 | 9/10 | Diagnostic médical |
| **k2p5** | **45** ✅ | **44.4%** | **10/10** 🚨 | 9/10 | Orienté business |
| Hunter Alpha | 49 ⚠️ | 42.9% | 8/10 | 9/10 | Détective causal |
| GPT-5.4 | 52 ⚠️ | 40.4% | 7/10 | 9/10 | Quantitatif / métriques |

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Médecin de Garde

Healer structure son rapport comme un diagnostic médical : **symptômes → causes → traitement**. Il introduit une métrique intéressante : le "Taux problème global" qui additionne erreurs et warnings (57.8%), donnant une vision plus complète de la santé du système.

Sa distinction entre temps moyen (~712ms, biaisé par les outliers) et temps médian (~95ms) est **la plus pédagogique** du benchmark. Cette nuance est souvent manquée en monitoring et c'est une vraie valeur ajoutée.

**Insight unique :** *"Le temps médian reste correct (95ms) — les endpoints froids marchent bien, les endpoints sous charge s'effondrent."*

**Limite :** Le taux d'erreur annoncé (40%) ne correspond pas à ce que les autres calculent pour 45 requêtes. Healer semble avoir compté différemment certains WARN comme erreurs.

---

### 🔵 Sonnet 4.6 — L'Architecte

Sonnet produit le tableau le plus détaillé : **répartition par endpoint** avec nb d'appels, nb d'erreurs, pourcentage et temps moyen. C'est la vue dont un ingénieur a besoin pour comprendre *où* est le problème, pas juste *qu'il y a* un problème.

La découverte que `/api/payments` a **80% de taux d'échec** (8 erreurs sur 10 appels) est présentée clairement et mise en avant. La notation P0/P1/P2 des recommandations reflète une pensée en mode incident response.

**Insight unique :** *"Score global de santé : 3.5/10 — intervention immédiate requise."* Un KPI synthétique actionnable.

**Limite :** Ne distingue pas cause et symptôme — le circuit breaker est traité comme une anomalie indépendante, pas comme la conséquence de la NPE.

---

### 🟡 GPT-5.4 — Le Data Analyst

GPT est le seul à mentionner le **P95** (4500ms) — une métrique SRE standard qui capture les pires cas sans être influencée par les outliers extrêmes. C'est un signal que GPT a une culture SRE/ops.

GPT déduit également que la panne est "partielle et ciblée" (les endpoints simples restent rapides) — une observation analytique fine sur la nature de l'incident.

**Insight unique :** *"Les endpoints simples restent rapides — panne partielle et ciblée, pas un effondrement total."*

**Limite majeure :** GPT compte **52 requêtes** dans un log de 45 lignes. C'est une erreur de comptage sérieuse qui invalide ses pourcentages. Difficile d'avoir confiance dans des taux d'erreur calculés sur un numérateur erroné.

---

### 🟠 Hunter Alpha — Le Détective

Hunter fait la **meilleure lecture causale** du benchmark : il identifie que le circuit breaker n'est pas une cause racine mais un **symptôme** de la NullPointerException répétée. Cette distinction cause/symptôme est cruciale pour ne pas perdre du temps à corriger des effets plutôt que des causes.

Il analyse aussi la fréquence temporelle : *"7 occurrences, 1 toutes les ~6 min"* — et en déduit un comportement déterministe (code path non couvert) plutôt qu'aléatoire. C'est du debug de haut niveau.

**Insight unique :** *"Les 7 occurrences identiques → bug déterministe, pas aléatoire. Fix : 1h de travail."*

**Limite :** Hunter compte 49 requêtes au lieu de 45. L'analyse est excellente mais les chiffres absolus sont approximatifs.

---

### 🟣 k2p5 — L'Analyste Business

k2p5 se distingue par une **hiérarchisation différente des priorités** : il classe l'OutOfMemoryError à **10/10** (le seul modèle à le faire) alors que les autres le mettent à 7-8/10. La justification : un OOM peut crasher toute la JVM, ce qui est une menace plus globale qu'une NPE sur un seul service.

Cette perspective "risque systémique" vs "impact immédiat" est une vraie différence d'approche qui mérite débat. En prod réelle, les deux arguements sont valides selon le contexte.

k2p5 produit aussi le tableau de distribution par endpoint le plus complet, avec un comptage exact (45 requêtes).

**Insight unique :** *"Redémarrer la JVM en priorité absolue — risque de crash total, pas seulement des paiements."*

**Limite :** La recommandation de priorité #1 (JVM avant NPE) peut être discutable — les paiements sont souvent plus critiques business qu'un crash report mensuel.

## Verdict Analyse — Podium Commenté

```
🥇 Hunter Alpha → Lecture causale irremplaçable. Seul à distinguer cause/symptôme.
🥇 Sonnet 4.6   → Vue par endpoint + scoring P0/P1/P2. Le plus opérationnel.
🥈 k2p5         → Angle risque systémique unique. Comptage exact. Très solide.
🥉 Healer Alpha → Pédagogie moyenne/médiane. Taux d'erreur approximatif.
4ème GPT-5.4   → P95 intéressant mais comptage faux (52 vs 45 requêtes).
```

---

# 🌐 TÂCHE 3 — Recherche Web : FTS5 vs Elasticsearch

## Résultats Bruts

| Modèle | Volume | Sources | Benchmark chiffré | Seuil FTS5/ES | Cas pratique |
|--------|--------|---------|------------------|---------------|--------------|
| GPT-5.4 | ~10 500c | Multi | Reconnaît limites | Non chiffré | Non |
| Sonnet 4.6 | ~9 100c | 8 | Tableau comparatif | Non chiffré | Non |
| Hunter Alpha | ~8 900c | 7 | 840 req/s (7K docs) | < 500K docs | Pneu-Tracker ✅ |
| k2p5 | ~8 400c | 6 | 100× plus rapide | **1-5M docs** ✅ | Partiel |
| Healer Alpha | ~7 600c | Variées | Migration 10-100× | < 500K docs | Non |

## Analyse et Commentaires par Modèle

### 🟢 Healer Alpha — Le Praticien Concis

Healer va droit au but avec ~7600 caractères — le document le plus court mais pas le plus pauvre. Sa phrase d'ouverture résume parfaitement l'enjeu : *"La question n'est plus 'ES est-il plus puissant ?' (oui), mais 'est-ce que j'ai besoin de cette puissance ?'"*

La synthèse est actionnable mais ne cite pas de benchmark chiffré précis. On sait que FTS5 peut être 10-100× plus rapide, mais sans conditions d'expérimentation claires.

**Ce qui manque :** Seuil de bascule chiffré. Pas d'exemples de cas d'usage concrets liés au projet.

---

### 🔵 Sonnet 4.6 — L'Encyclopédiste

Sonnet fournit le tableau comparatif le plus détaillé avec 5 types de requêtes (simple, multi-termes, prefix, fuzzy, aggregations) et leurs caractéristiques pour chaque technologie. C'est le document le plus utile pour un architecte qui doit trancher.

Il explique aussi l'architecture de Lucene (segments immutables, merge périodique) mieux que les autres — utile pour comprendre *pourquoi* ES a de meilleures garanties sur de gros volumes.

**Ce qui manque :** Pas de seuil de bascule précis non plus. Recommandations un peu génériques ("petits vs grands volumes").

---

### 🟡 GPT-5.4 — L'Honnête Méthodologue

GPT produit le document le plus long (~10 500 caractères) mais son vrai apport est son **honnêteté intellectuelle** : il reconnaît explicitement qu'il n'a pas trouvé de benchmarks "apples-to-apples" 2025-2026 comparant FTS5 et ES sur les mêmes conditions. Cette transparence est rare et précieuse.

Il mentionne aussi la migration Drupal de SQLite FTS5, le forum SQLite avec les pièges de performance (`MATCH` vs `=`), et un retour d'expérience 2025 de migration Elastic → FTS5.

**Ce qui manque :** Des conclusions tranchées. GPT présente les faits sans vraiment recommander. Pour un décideur, c'est frustrant.

---

### 🟠 Hunter Alpha — L'Applicable

Hunter fait quelque chose qu'aucun autre modèle ne fait : il **contextualise la réponse pour notre projet**. La synthèse se conclut par une recommandation directe pour Pneu-Tracker, avec le raisonnement :

*"Dataset probablement < 100K enregistrements → FTS5 est le choix évident. Zéro infra ajoutée, intégration native, migration possible plus tard si le dataset explose."*

C'est la réponse qui a le plus de valeur immédiate pour nous — pas la plus exhaustive, mais la plus utile.

**Ce qui manque :** Moins d'architecture théorique. Pour quelqu'un qui veut comprendre en profondeur, le document de Sonnet sera plus riche.

---

### 🟣 k2p5 — Le Précis

k2p5 fournit le **seuil de bascule le plus précis** du benchmark : 1-5M documents pour FTS5, au-delà Elasticsearch. Ce chiffre est concret, mémorisable et directement actionnable pour choisir une architecture.

Son benchmark chiffré (100× moins de latence pour FTS5 sur volumes modestes, source Medium nov. 2025) est le plus cité. Le tableau comparatif avec les caractéristiques clés est bien structuré.

**Ce qui manque :** Pas de contextualisation pour notre use case (Pneu-Tracker) comme Hunter. La synthèse est générale.

## Verdict Recherche — Podium Commenté

```
🥇 k2p5         → Seuil précis 1-5M docs. Le plus actionnable pour une décision.
🥇 Hunter Alpha → Application directe au projet Pneu-Tracker.
🥈 Sonnet 4.6   → Le plus exhaustif pour un architecte.
🥈 GPT-5.4      → Le plus honnête sur les limites des sources.
🥉 Healer Alpha → Concis et correct mais le moins de profondeur.
```

---

# 🏆 VERDICT FINAL — 5 Modèles

## Tableau de Synthèse Complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 |
|---------|--------|--------|-----|--------|------|
| **Code — Architecture** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Code — Tests** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Code — Features** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Analyse — Rigueur** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Analyse — Insight** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Analyse — Action** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Recherche — Profondeur** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Recherche — Applicabilité** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Adaptation contexte** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Consistance** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Profils en une Phrase

| Modèle | Phrase signature |
|--------|------------------|
| **Healer Alpha** | *"Je livre vite, je teste tout, je ne sur-ingénie pas."* |
| **Sonnet 4.6** | *"Je fais les choses correctement, même si tu n'as pas demandé le détail."* |
| **GPT-5.4** | *"Je suis fiable, prévisible, honnête sur ce que je ne sais pas."* |
| **Hunter Alpha** | *"Je trouve la cause racine et je te dis quoi faire maintenant."* |
| **k2p5** | *"Je m'adapte à toi, je suis précis, et je ne fais pas de bruit inutile."* |

## Recommandations d'Usage

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique (algorithmes complexes) | **Sonnet 4.6** | Garanties algorithmiques + features complètes |
| Prototypage avec TDD | **Healer Alpha** | Tests exhaustifs, code lisible |
| Debug incident production | **Hunter Alpha** | Cause racine + délai de fix estimé |
| Analyse de métriques / dashboards | **GPT-5.4** | P95, P50, métriques SRE |
| Veille techno + décision architecture | **k2p5** | Seuils précis + synthèse actionnable |
| Contextualisation projet | **Hunter Alpha** | Relie toujours la réponse à ton use case |
| Documentation technique | **Sonnet 4.6** | Exhaustif, structuré, professionnel |
| Rapport bilingue / multi-audience | **k2p5** | S'adapte à la langue de l'utilisateur |

## Classement Final

```
🥇 Sonnet 4.6  — Le perfectionniste indétrônable sur la technicité pure.
                 Imbattable sur le code, très fort sur l'analyse.

🥈 k2p5        — La surprise du benchmark. Adaptable, précis, consistant.
                 Seul modèle à écrire en français sans qu'on lui demande.

🥈 Hunter Alpha — Le détective. Meilleur analyste du lot sur la causalité.
                 Le plus utile dans un contexte projet concret.

🥉 Healer Alpha — Le testeur. Si tu veux un code couvert à 100%, c'est lui.
                 Manque de profondeur architecturale.

4ème GPT-5.4  — Le scolaire. Solide mais sans relief. Erreur de comptage
                 sur les logs qui plombe sa crédibilité en analyse.
```

---

## 💡 Méta-Enseignements du Benchmark

1. **Les architectures "simples" tiennent souvent mieux en tests** (Healer avec BST vs Sonnet avec RB) — la complexité algorithmique n'est pas corrélée à la couverture de tests.

2. **Le contexte utilisateur change tout** — k2p5 et Hunter ont tous les deux adapté leurs réponses à *notre* usage (Pneu-Tracker, langue française). Les modèles généralistes (GPT, Sonnet) répondent à la spec sans l'interpréter.

3. **L'honnêteté sur les limites est une compétence rare** — GPT qui dit "je n'ai pas trouvé de benchmark apples-to-apples" est plus utile que quelqu'un qui invente des chiffres.

4. **Les features bonus révèlent le "modèle mental"** — Sonnet et k2p5 ajoutent `queryInterval/searchInterval` parce qu'ils imaginent l'étape d'après. C'est de l'intelligence proactive.

5. **Un seul chiffre précis vaut mieux qu'une page vague** — Le "1-5M documents" de k2p5 ou le "840 req/s" de Hunter sont immédiatement actionnables là où les analyses générales de Sonnet/Healer ne le sont pas.

---

*v5 — Benchmark à 5 modèles, analyse commentée sur 3 tâches — 2026-03-13*
