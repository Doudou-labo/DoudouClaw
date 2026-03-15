# 🔬 Benchmark LLM v6 — 7 Modèles Comparés

> **Date :** 2026-03-15 — Ajout de `openrouter/stepfun/step-3.5-flash:free` et `openrouter/openai/gpt-oss-120b:free`
> **Tâches :** Code (IntervalTree TS) · Analyse (Logs serveur 45 req) · Recherche (FTS5 vs ES)
> **Nouveauté v6 :** 2 modèles **gratuits** (OpenRouter free tier) comparés aux 5 payants

---

## Table des matières

- [Les 7 Concurrents](#les-7-concurrents)
- [🖥️ Tâche 1 — Code TypeScript](#-tâche-1--code-typescript-intervaltree)
- [🔍 Tâche 2 — Analyse de Logs](#-tâche-2--analyse-de-logs-serveur)
- [🌐 Tâche 3 — Recherche Web](#-tâche-3--recherche-web-fts5-vs-elasticsearch)
- [🏆 Verdict Final](#-verdict-final--7-modèles)
- [📊 Méta-Analyse](#-méta-analyse)
- [💡 Recommandations d'Usage](#-recommandations-dusage)

---

## Les 7 Concurrents

| # | Modèle | Alias | Provider | Prix | Context |
|---|--------|-------|----------|------|---------|
| 1 | `openrouter/openrouter/healer-alpha` | **Healer Alpha** | OpenRouter | 🆓 **Gratuit** | v1 (12 mars) |
| 2 | `anthropic/claude-sonnet-4-6` | **Sonnet 4.6** | Anthropic | 💰 Payant | v1 (12 mars) |
| 3 | `openai-codex/gpt-5.4` | **GPT-5.4** | OpenAI | 💰 Payant | v1 (12 mars) |
| 4 | `openrouter/hunter-alpha` | **Hunter Alpha** | OpenRouter | 🆓 **Gratuit** | v1 (12 mars) |
| 5 | `kimi-coding/k2p5` | **k2p5** | Moonshot/Kimi | 💰 Payant | v5 (13 mars) |
| 6 | `openrouter/stepfun/step-3.5-flash:free` | **Step-3.5 Flash** 🆕 | StepFun | 🆓 **Gratuit** | v6 (15 mars) |
| 7 | `openrouter/openai/gpt-oss-120b:free` | **GPT-OSS-120b** 🆕 | OpenAI (open-source) | 🆓 **Gratuit** | v6 (15 mars) |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats Bruts

| Modèle | Architecture | Lignes impl. | Lignes tests | Tests | Feature bonus | Verdict |
|--------|-------------|-------------|-------------|-------|---------------|---------|
| Healer Alpha | BST augmenté | 192 | 274 | 18/18 ✅ | — | ⭐⭐⭐ |
| **Sonnet 4.6** | **Red-Black Tree** | **438** | 229 | 15/15 ✅ | `queryInterval()` | ⭐⭐⭐⭐⭐ |
| GPT-5.4 | AVL Tree | 242 | 151 | 13/13 ✅ | — | ⭐⭐⭐ |
| Hunter Alpha | Red-Black BST (LLRB) | 238 | 206 | 15/15 ✅ | — | ⭐⭐⭐⭐ |
| k2p5 | AVL Tree | 364 | 282 | 12+ ✅ | `searchInterval()` | ⭐⭐⭐⭐ |
| **Step-3.5 Flash** 🆕 | AVL Tree | 281 | 267 | 12 ✅ | `searchOverlap()` | ⭐⭐⭐⭐ |
| **GPT-OSS-120b** 🆕 | AVL Tree | ~250* | ~400* | **57/57** ✅ | `toArray()`, maxEnd pruning | ⭐⭐⭐⭐ |

*\* Estimé — GPT-OSS-120b n'a pas rapporté ses lignes exactes mais a fourni le méta-rapport de tests le plus détaillé.*

---

## Analyse détaillée par modèle (nouveaux modèles en priorité)

### 🆕 Step-3.5 Flash — Le Pragmatique Gratuit

Step-3.5 Flash choisit un **AVL Tree** (comme GPT-5.4 et k2p5) avec 281 lignes d'implémentation et 267 lignes de tests. Architecture propre, bien documentée, convention semi-ouverte `[start, end)`.

**Points forts :**
- Méthode bonus `searchOverlap(start, end)` — recherche par chevauchement d'intervalle
- Gestion des duplications (mêmes bornes, valeurs différentes)
- Méthodes utilitaires : `getMaxEnd()`, `size`, `height`, `clear()`
- 12 scénarios de test couvrant : insertion, suppression, chevauchements, équilibrage AVL, contraintes invalides
- Convention `[start, end)` standard pour les structures d'intervalle

**Ce que ça dit :** Pragmatique — AVL (plus simple que RB), documente bien, ajoute une feature bonus pertinente. Pour un modèle gratuit, le niveau est surprenant.

**Limite :** 12 tests seulement (vs 18 pour Healer ou 57 pour GPT-OSS-120b). Couverture moins exhaustive.

---

### 🆕 GPT-OSS-120b — Le Testeur Open-Source

GPT-OSS-120b produit le **plus grand nombre de tests** du benchmark entier : **57 assertions sur 14 suites**. Seul modèle à avoir stress-testé avec 1000 inserts séquentiels.

**Points forts :**
- 57 assertions / 14 suites — couverture imbattable
- Test de stress : 1000 inserts triés (vérification explicite de l'équilibre AVL)
- Vérification du pruning `maxEnd` — test explicite que l'optimisation marche
- Tests de cas limites : intervalles dégénérés `[n,n]`, valeurs négatives, ré-insertion après suppression totale
- Gestion des erreurs : `RangeError` sur intervalles invalides

**Ce que ça dit :** Pense "production-ready" — teste ce que les autres oublient (pruning maxEnd, équilibre sous charge). Pour un modèle open-source gratuit, c'est impressionnant.

**Limite :** Les lignes exactes d'implémentation ne sont pas fournies. On sait que 57/57 tests passent, mais on ne peut pas juger la qualité du code directement.

---

### Modèles originaux (résumé)

#### 🟢 Healer Alpha — Le Champion des Tests
- **BST simple augmenté** avec maxEnd, sans équilibrage automatique
- **18 tests** — le plus exhaustif des modèles payants
- Philosophie : couvrir les cas limites plutôt que d'optimiser les garanties asymptotiques
- ⚠️ Sans équilibrage, risque de dégénérer en liste liée O(n)

#### 🔵 Sonnet 4.6 — L'Excellence Technique
- Seul **Red-Black Tree complet** du benchmark
- `queryInterval(qs, qe)` bonus — recherche par plage chevauchante
- Mise à jour correcte de `maxEnd` pendant les rotations (partie la plus difficile)
- ⚠️ 667 lignes = surpoids si pas besoin des garanties RB

#### 🟡 GPT-5.4 — Le Scolaire Solide
- **AVL Tree** classique, `compareValues()` générique robuste (types mixtes)
- Fiable, prévisible, ne sur-ingénie pas
- ⚠️ Suppression O(n) au lieu de O(log n). Aucune feature bonus

#### 🟠 Hunter Alpha — L'Efficace Compact
- **Red-Black Tree** style "Sedgewick LLRB" (444 lignes vs 667 pour Sonnet)
- `_moveRedLeft` / `_moveRedRight` — élégant et compact
- ⚠️ `JSON.stringify` pour l'égalité des valeurs — pragmatique mais fragile

#### 🟣 k2p5 — Le Pragmatique Francophone
- **AVL Tree** avec documentation **en français** (JSDoc)
- `searchInterval()` bonus — même idée que Sonnet mais sur base AVL
- ⚠️ AVL fait plus de rotations à l'insertion que RB

---

## Verdict Code — Classement Commenté

```
🥇 Sonnet 4.6       → Architecture RB complète + features + rigueur. Inégalé.
🥈 GPT-OSS-120b 🆓  → 57/57 tests, stress 1000 inserts, maxEnd pruning vérifié.
🥉 k2p5             → AVL solide + searchInterval + docs FR. Équilibre parfait.
4e Hunter Alpha     → RB compact style LLRB. Efficace mais moins de features.
5e Step-3.5 Flash 🆓→ AVL propre + searchOverlap. Excellent pour un gratuit.
6e Healer Alpha 🆓  → 18 tests imbattables, mais BST non équilibré.
7e GPT-5.4          → Conventionnel, aucun bonus, suppression O(n).
```

**💡 Insight :** Les deux modèles gratuits se classent **4e et 6e sur 7** — compétitifs avec les payants sur le code.

---

# 🔍 TÂCHE 2 — Analyse de Logs Serveur

## Résultats Bruts

| Modèle | Requêtes | Taux erreur | Médiane | Patterns | Score santé | Style |
|--------|----------|-------------|---------|----------|-------------|-------|
| Healer Alpha | 45 ✅ | 40.0% | ~95ms | 6 | ~4/10 | Diagnostic médical |
| **Sonnet 4.6** | 45 ✅ | **31.1%** | ~120ms | 6 | 3.5/10 | Architecte système |
| GPT-5.4 | 52 ⚠️ | 40.4% | N/A | 6 | ~4/10 | Data analyst (P95) |
| Hunter Alpha | 49 ⚠️ | 42.9% | N/A | 6 | ~3/10 | Détective causal |
| k2p5 | 45 ✅ | 44.4% | N/A | 7 | ~3/10 | Business / risque |
| **Step-3.5 Flash** 🆕 | 45 ✅ | 37.8% | ~95ms | 6 | **2/10** | Systémique cascade |
| **GPT-OSS-120b** 🆕 | 45 ✅ | 35.6% | N/A | 6 | **6.5/10** | Quantitatif formule |

---

## Analyse détaillée par modèle (nouveaux)

### 🆕 Step-3.5 Flash — L'Analyste Systémique

Step-3.5 Flash produit une **lecture causale en cascade** particulièrement intéressante : search lentes → occupent connexions DB → épuisement pool → OOM sur rapports → circuit breaker.

**Points forts :**
- Comptage exact (45 ✅) — rigueur comme Sonnet/Healer
- Distribution par endpoint détaillée (24 endpoints listés individuellement)
- Sévérité NPE à 9/10, OOM à 9/10 — priorisation forte
- Health score le plus pessimiste : **2/10**
- Lecture causale à 4 niveaux avec dégradation temporelle identifiée

**Insight unique :** *"Les erreurs s'agrègent autour de 08:06-08:43, indiquant une dégradation progressive (DB → mémoire → circuit breaker)."*

**Limite :** Health score de 2/10 semble trop sévère (autres : 3.5-6.5). Méthode de calcul non expliquée.

---

### 🆕 GPT-OSS-120b — Le Quantitatif à Formule

GPT-OSS-120b fournit une **formule de health score reproductible** — seul modèle transparent sur son scoring :

```
Score = 10 - (error_rate × 5) - ((avg_severity - 5) / 2)
      = 10 - (0.356 × 5) - ((8.0 - 5) / 2)
      = 10 - 1.78 - 1.5 = 6.72 ≈ 6.5/10
```

**Points forts :**
- Comptage exact (45 ✅)
- Formule de health score explicite et reproductible
- Tableau de breakdown par type d'erreur avec pourcentages
- Sévérité moyenne calculée : 8.0 sur 16 erreurs
- Recommandations P0/P1/P2 avec délais concrets (≤24h, ≤1 semaine, ≤1 mois)
- 5 catégories d'erreur distinctes identifiées

**Insight unique :** La formule de health score — aucun autre modèle ne rend son scoring aussi transparent.

**Limite :** Score de 6.5/10 semble optimiste (autres : 2-4/10). La formule pénalise moins que le jugement humain.

---

## Verdict Analyse — Classement Commenté

```
🥇 Hunter Alpha      → Lecture causale (CB = symptôme NPE). Cause racine imbattable.
🥈 Sonnet 4.6        → Vue par endpoint + scoring P0/P1/P2. Le plus opérationnel.
🥉 GPT-OSS-120b 🆓  → Formule reproductible + transparence méthodologique. Top 3 !
4e k2p5              → OOM à 10/10 (seul). Angle risque systémique unique.
5e Step-3.5 Flash 🆓→ Lecture cascade intéressante, score trop pessimiste (2/10).
6e Healer Alpha      → Pédagogie moyenne/médiane. Taux d'erreur approximatif.
7e GPT-5.4           → P95 intéressant mais comptage faux (52 vs 45).
```

**💡 Insight :** GPT-OSS-120b (gratuit) entre dans le **top 3** de l'analyse grâce à sa transparence méthodologique. Step-3.5 Flash est solide mais son scoring trop pessimiste le pénalise.

---

# 🌐 TÂCHE 3 — Recherche Web : FTS5 vs Elasticsearch

## Résultats Bruts

| Modèle | Volume | Latence FTS5 | Latence ES | Seuil bascule | Reco Pneu-Tracker | Prix |
|--------|--------|-------------|-----------|---------------|-------------------|------|
| Healer Alpha | ~7 600c | Non chiffré | Non chiffré | < 500K docs | Non explicite | 🆓 |
| **Sonnet 4.6** | ~9 100c | Non chiffré | Non chiffré | Non chiffré | Non | 💰 |
| GPT-5.4 | ~10 500c | Non chiffré | Non chiffré | Non chiffré | Non | 💰 |
| Hunter Alpha | ~8 900c | 840 req/s | N/A | < 500K docs | ✅ Oui (Pneu-Tracker) | 🆓 |
| k2p5 | ~8 400c | 100× plus rapide | Baseline | **1-5M docs** | ✅ Partiel | 💰 |
| **Step-3.5 Flash** 🆕 | ~8 000c | **1-5 ms** | **10-30 ms** | **~1M docs** | ✅ Architecture + plan 8 étapes | 🆓 |
| **GPT-OSS-120b** 🆕 | ❌ Échec | ❌ | ❌ | ❌ | ❌ Tâche non viable | 🆓 |

> ⚠️ **Note GPT-OSS-120b :** 4 tentatives (0 output × 3, listing node_modules × 1). Modèle inutilisable sur la rédaction longue — spécialisé tâches structurées courtes.

---

## Analyse détaillée par modèle (nouveaux)

### 🆕 Step-3.5 Flash — L'Architecte Technique Complet

**Points forts :**
- Internals détaillés : BM25 k1=1.2/b=0.75, Lucene segments, posting lists compressées
- Benchmarks chiffrés : 1-5ms FTS5 vs 10-30ms ES (terme simple), 5-15ms vs 30-100ms (complexe)
- Seuil double : ~50-100K docs si fuzzy/multi-langue requis ; ~1M docs pour performance pure
- Tableau fonctionnel 10 critères dont geo, schema flex, réplication, backup
- Coût : FTS5 = 0€ / <1h maintenance vs ES = 15-30€/mois + 2-4h/mois
- Mention de `spellfix1` et tokenize `trigram` (SQLite ≥ 3.34) comme alternatives légères
- Plan de migration 8 étapes avec feature-flag `USE_ES` et A/B test progressif
- Recommandation claire pour 12,500 refs = 1.25% du seuil performance

**Insight unique :** *"FTS5 fonctionne jusqu'à plusieurs millions de documents, mais les performances se dégradent car les posting lists deviennent longues. Au-delà de 1 million de docs, la latence peut dépasser 100ms pour des requêtes complexes."*

**Limite :** Analyse basée sur connaissance du modèle, pas une vraie recherche web avec sources URL citées.

---

### 🆕 GPT-OSS-120b — Échec total sur la rédaction longue

GPT-OSS-120b est **inutilisable sur cette tâche** malgré 4 tentatives avec des prompts de plus en plus contraints :
- v1 : 0 token output
- v2 : 0 token output  
- v3 : listing de `node_modules/react-dom/cjs/` du projet pneu-tracker
- v4 : 0 token output

**Ce que ça révèle :** GPT-OSS-120b est un modèle "code completion" — fort sur les tâches structurées et prévisibles (57 tests, analyse de logs), incapable de générer du texte analytique long.

---

## Verdict Recherche — Classement Commenté

```
🥇 k2p5 💰          → Seuil 1-5M docs + benchmark 100×. Le plus actionnable en décision archi.
🥈 Hunter Alpha 🆓  → Application directe au projet Pneu-Tracker. Très pratique.
🥉 Step-3.5 Flash 🆓→ Architecture interne solide + seuil 1M + plan migration 8 étapes.
4e Sonnet 4.6 💰    → Le plus exhaustif pour un architecte.
5e GPT-5.4 💰       → Le plus honnête sur les limites des sources.
6e Healer Alpha 🆓  → Concis et correct mais le moins de profondeur.
N/A GPT-OSS-120b 🆓 → ❌ Échec sur 4 tentatives — hors périmètre fonctionnel du modèle.
```

**💡 Insight :** Sur la recherche, Step-3.5 Flash (gratuit) entre dans le **top 3** avec une analyse architecturale solide. GPT-OSS-120b révèle sa limite majeure — spécialisé code/analyse structurée, pas rédaction ouverte.

---

# 🏆 VERDICT FINAL — 7 Modèles

## Tableau de Synthèse par Critère

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35🆓 | GPT-OSS🆓 |
|---------|--------|--------|-----|--------|------|---------|----------|
| Code — Architecture | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Code — Tests | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Code — Features | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Analyse — Rigueur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Analyse — Insight | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Action | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Recherche — Profondeur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ Échec |
| Recherche — Applicabilité | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ Échec |
| Adaptation contexte | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Consistance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **TOTAL** | **34** | **47** | **32** | **45** | **45** | **42** | **38** |

## Classement Final Pondéré

| Rang | Modèle | Score | Prix | Note |
|------|--------|-------|------|------|
| 🥇 | **Sonnet 4.6** | 47/50 | 💰 Payant | Le perfectionniste. Inégalé sur la technicité pure. |
| 🥈 | **Hunter Alpha** | 45/50 | 🆓 Gratuit | Le détective. Meilleure analyse causale + contextualisation projet. |
| 🥈 | **k2p5** | 45/50 | 💰 Payant | Le francophone. Précis, consistant, s'adapte au contexte. |
| 🥉 | **Step-3.5 Flash** 🆕 | 42/50 | 🆓 Gratuit | **GRATUIT et 4e.** Solide sur les 3 tâches, excellent ratio qualité/prix. |
| 5e | **GPT-OSS-120b** 🆕 | 38/50 | 🆓 Gratuit | Fort sur code (57 tests) et analyse, mais **inutilisable sur rédaction longue**. |
| 6e | **Healer Alpha** | 34/50 | 🆓 Gratuit | Tests imbattables (18), mais BST non équilibré et analyse approximative. |
| 7e | **GPT-5.4** | 32/50 | 💰 Payant | Scolaire. Correct mais sans relief ni bonus. Comptage logs erroné. |

## Profils en une phrase

| Modèle | Signature |
|--------|-----------|
| **Sonnet 4.6** | *"Je fais les choses correctement, même si tu n'as pas demandé le détail."* |
| **GPT-OSS-120b** 🆓 | *"Je teste tout sur le code, mais ne me demande pas d'écrire un article."* |
| **Hunter Alpha** | *"Je trouve la cause racine et je te dis quoi faire maintenant."* |
| **k2p5** | *"Je m'adapte à toi, je suis précis, et je ne fais pas de bruit inutile."* |
| **Step-3.5 Flash** 🆓 | *"Je suis pragmatique, je livre, et je suis gratuit."* |
| **Healer Alpha** | *"Je livre vite, je teste tout, je ne sur-ingénie pas."* |
| **GPT-5.4** | *"Je suis fiable, prévisible, honnête sur ce que je ne sais pas."* |

---

# 📊 Méta-Analyse

## Le fait marquant : les gratuits sont compétitifs… avec des limites claires

| Comparaison | Payant moyen | Gratuit moyen | Verdict |
|-------------|-------------|---------------|---------|
| Code (tests) | 14.6 tests | 34.5 tests | 🆓 **Gratuits gagnent** (GPT-OSS 57 tests) |
| Analyse (rigueur) | Comptage approx. | Comptage exact 45/45 | 🆓 **Gratuits gagnent** |
| Recherche (profondeur) | Solide | Step-3.5 solide, GPT-OSS ❌ | 💰 Payants gagnent globalement |
| Code (architecture) | RB/AVL varié | AVL uniquement | 💰 Payants gagnent (RB de Sonnet) |
| Rédaction longue | Tous fonctionnent | GPT-OSS échoue × 4 | 💰 Payants gagnent |

**Conclusion nuancée :** Step-3.5 Flash est **polyvalent** (3/3 tâches) et compétitif avec les payants. GPT-OSS-120b est **spécialisé** (excellent en code/analyse structurée, inutilisable en rédaction longue). Les modèles payants restent plus fiables sur les tâches ouvertes.

## Ce qui change avec les modèles gratuits

1. **Accessibilité** : pas besoin de clé API premium → benchmark reproductible par n'importe qui
2. **Tests** : GPT-OSS-120b (57 assertions) dépasse tous les payants sur la couverture de tests
3. **Transparence** : GPT-OSS-120b seul à fournir une formule de health score reproductible
4. **Polyvalence gratuite** : Step-3.5 Flash rivalise avec les payants sur les 3 tâches

## Ce qui ne change pas

1. **Architecture créative** : Sonnet reste seul sur le Red-Black Tree complet
2. **Features non demandées** : Sonnet et k2p5 ajoutent des bonus que personne n'a demandés
3. **Adaptation contextuelle** : k2p5 (docs FR) et Hunter (projet Pneu-Tracker) restent imbattables
4. **Analyse causale** : Hunter reste seul à distinguer cause racine vs symptôme
5. **Fiabilité sur tâches ouvertes** : les payants fonctionnent toujours — les gratuits peuvent dérailler

## ⚠️ Limites identifiées des modèles free OpenRouter

- **GPT-OSS-120b** : inutilisable sur rédaction longue/analyse ouverte — dérive vers l'exécution de commandes shell
- **Step-3.5 Flash** : timeout si timeout < 5min (1.2M tokens consommés en web search sans output)
- **Les deux** : nécessitent un timeout de 5min minimum pour les tâches complexes

---

# 💡 Recommandations d'Usage

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique (algorithmes) | **Sonnet 4.6** | Garanties RB + features complètes |
| Code avec tests exhaustifs | **GPT-OSS-120b** 🆓 | 57/57 tests, stress test 1000 inserts, gratuit |
| Debug incident production | **Hunter Alpha** 🆓 | Cause racine + délai fix estimé, gratuit |
| Analyse métriques / dashboards | **GPT-OSS-120b** 🆓 | Formule scoring reproductible, gratuit |
| Veille techno + décision archi | **k2p5** 💰 | Seuils précis + docs FR |
| Contextualisation projet | **Hunter Alpha** 🆓 | Relie toujours au use case, gratuit |
| Documentation technique | **Sonnet 4.6** 💰 | Exhaustif, structuré, pro |
| Prototypage rapide (coût zéro) | **Step-3.5 Flash** 🆓 | Solide sur les 3 tâches, gratuit |
| Rapport bilingue | **k2p5** 💰 | S'adapte à la langue |
| Tâche polyvalente gratuite | **Step-3.5 Flash** 🆓 | Fiable partout, pas de dérapage |
| ⚠️ Rédaction/analyse longue | ❌ **Éviter GPT-OSS-120b** | Dérive systématique (4 échecs) |

---

## Note méthodologique

### Conditions d'exécution
- **Date :** 15 mars 2026 pour les nouveaux modèles
- **Timeout :** 5 minutes par tâche (300s) — nécessaire pour les modèles free (v1 avec 3min a timeout)
- **Provider :** OpenRouter free tier
- **Tâches identiques :** mêmes prompts, même log serveur, même contexte Pneu-Tracker

### Problèmes rencontrés avec les modèles free
- **GPT-OSS-120b v1 (3min timeout)** : 3/3 tâches retournées vides (0 tokens output). Le modèle consommait des tokens mais ne produisait rien.
- **Step-3.5 Flash v1 (3min timeout)** : 1/3 réussi (analyse), 2/3 timeout (code, recherche — 1.2M tokens bouffés en web search)
- **Solution v2** : timeout porté à 5min → 5/5 réussites

### Fiabilité des résultats
- **Comptage de requêtes** : Sonnet, Healer, k2p5, Step-3.5, GPT-OSS = exact (45). GPT = 52 (faux), Hunter = 49 (faux).
- **Health scores** : varient de 2/10 (Step-3.5) à 6.5/10 (GPT-OSS) — la méthodologie de scoring est subjective.
- **Benchmarks recherche** : les modèles gratuits fournissent des chiffres plus précis (ms) que les payants.

---

*v6 — Benchmark à 7 modèles (5 payants + 2 gratuits), analyse commentée sur 3 tâches — 2026-03-15*
