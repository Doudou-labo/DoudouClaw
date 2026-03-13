# 🔬 Benchmark LLM — Résultats Complets avec k2p5 (README-v4)

> **Date :** 2026-03-13 — Ajout de `kimi-coding/k2p5` au benchmark initial du 2026-03-12

---

## Modèles testés (5 au total)

| Modèle | Provider | Alias |
|--------|----------|-------|
| `openrouter/openrouter/healer-alpha` | OpenRouter | Healer Alpha |
| `anthropic/claude-sonnet-4-6` | Anthropic | Sonnet 4.6 |
| `openai-codex/gpt-5.4` | OpenAI | GPT-5.4 |
| `openrouter/hunter-alpha` | OpenRouter | Hunter Alpha |
| `kimi-coding/k2p5` | Moonshot / Kimi | **k2p5** 🆕 |

---

## 🖥️ Tâche 1 : Code — IntervalTree TypeScript

### Résultats bruts

| Modèle | Implémentation | Tests | Total lignes | Structure | Tests passants |
|--------|----------------|-------|--------------|-----------|----------------|
| **Healer Alpha** | 192 | 274 | 466 | BST augmenté (maxEnd) | 18/18 ✅ |
| **Sonnet 4.6** | 438 | 229 | 667 | Red-Black Tree + `queryInterval` | 15/15 ✅ |
| **GPT-5.4** | 242 | 151 | 393 | AVL Tree | 13/13 ✅ |
| **Hunter Alpha** | 238 | 206 | 444 | Red-Black BST | 15/15 ✅ |
| **k2p5** | 364 | 282 | **646** | AVL Tree + `searchInterval` bonus | 12+ ✅ |

### Analyse k2p5 (code)

k2p5 choisit une **structure AVL** (comme GPT-5.4), mais avec :
- **Plus de lignes d'implémentation** (364 vs 242) → code plus documenté, JSDoc en français
- **Méthode bonus** `searchInterval(start, end)` — recherche par intervalle (comme Sonnet)
- **12+ tests** — solide sans atteindre le niveau de Healer (18 tests)
- Commentaires et docstrings **en français** — style distinctif

**Point notable :** k2p5 est le seul modèle à avoir écrit la documentation en **français**. Signe d'adaptation au contexte utilisateur.

### Classement Code
| Rang | Modèle | Pourquoi |
|------|--------|----------|
| 🥇 | **Sonnet 4.6** | RB complet + queryInterval + 15 tests |
| 🥈 | **k2p5** | AVL solide + searchInterval + JSDoc FR |
| 🥈 | **Hunter Alpha** | RB compact + 15 tests |
| 🥉 | **Healer Alpha** | BST mais 18 tests (le plus exhaustif) |
| 4ème | **GPT-5.4** | AVL correct mais moins de features |

---

## 🔍 Tâche 2 : Analyse de Logs Serveur (45 requêtes)

### Résultats bruts

| Modèle | Requêtes | Taux erreur | Anomalies | Style |
|--------|----------|-------------|-----------|-------|
| **Sonnet 4.6** | 45 ✅ | 31.1% | 6 patterns | Architecte système |
| **Healer Alpha** | 45 ✅ | 40.0% | 6 patterns | Diagnostic médical |
| **k2p5** | 45 ✅ | **44.4%** | 6 patterns | Orienté business |
| **Hunter Alpha** | 49 ⚠️ | 42.9% | 6 patterns | Détective causal |
| **GPT-5.4** | 52 ⚠️ | 40.4% | 6 patterns | Analyste quantitatif |

### Analyse k2p5 (logs)

k2p5 se distingue par :
- **Comptage exact** (45 requêtes) — bonne rigueur comme Sonnet/Healer
- **Scores de sévérité différents** : OutOfMemoryError à **10/10** (plus critique que les autres)
- **Priorité inversée** : commence par la JVM (OOM) avant les paiements (NPE) — approche "stabilité globale" d'abord
- **Distribution par endpoint** très détaillée avec tableau complet
- Détecte `/api/inventory/stock` à 100% d'erreurs et `/api/reports/monthly` à 100% — correct

**Insight unique k2p5 :** *"Redémarrer/réparer la JVM en priorité — risque de crash total"* — seul modèle à prioriser la stabilité JVM globale sur les paiements individuels.

### Classement Analyse
| Rang | Modèle | Pourquoi |
|------|--------|----------|
| 🥇 | **Hunter Alpha** | Cause racine + lecture causale (CB = symptôme NPE) |
| 🥇 | **Sonnet 4.6** | Architecture + priorisation P0/P1/P2 |
| 🥈 | **k2p5** | Comptage exact + angle business + OOM prioritisé |
| 🥉 | **GPT-5.4** | P95 + nuance, mais 7 requêtes fantômes |
| 4ème | **Healer Alpha** | Bon diagnostic mais taux d'erreur surestimé |

---

## 🌐 Tâche 3 : Recherche Web — FTS5 vs Elasticsearch

### Résultats bruts

| Modèle | Volume | Sources | Style |
|--------|--------|---------|-------|
| **GPT-5.4** | ~10 500 chars | Multi-sources | Le Critique |
| **Sonnet 4.6** | ~9 100 chars | 8 sources | L'Encyclopédique |
| **Hunter Alpha** | ~8 900 chars | 7 sources | Le Praticien |
| **k2p5** | ~1 341 mots | 6 sources | **Le Précis** |
| **Healer Alpha** | ~7 600 chars | Variées | Le Concis |

### Analyse k2p5 (recherche)

k2p5 se distingue par :
- **Seuil chiffré clair** : 1-5M documents pour FTS5, au-delà Elasticsearch — le plus précis
- **Benchmark concret** : latences 100× inférieures pour FTS5 sur volumes modestes (source Medium 2025)
- **6 sources** citées dont documentation officielle SQLite + retours terrain
- Structure en 6 sections avec **tableaux comparatifs**
- Conclusion très actionnable

**Point notable :** k2p5 donne le **seuil de bascule le plus précis** (1-5M docs) — information directement opérationnelle pour choisir entre les deux solutions.

### Classement Recherche
| Rang | Modèle | Pourquoi |
|------|--------|----------|
| 🥇 | **k2p5** | Seuil précis 1-5M docs + benchmark chiffré |
| 🥇 | **Hunter Alpha** | Applicable au projet Pneu-Tracker directement |
| 🥈 | **Sonnet 4.6** | Exhaustivité + 8 sources |
| 🥈 | **GPT-5.4** | Honnêteté méthodologique |
| 🥉 | **Healer Alpha** | Concis et correct mais moins de profondeur |

---

## 🏆 Synthèse Globale — 5 Modèles

### Scores par catégorie (⭐ = 5 max)

| Critère | Healer | Sonnet 4.6 | GPT-5.4 | Hunter | **k2p5** |
|---------|--------|------------|---------|--------|----------|
| Code | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recherche | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Consistance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Classement final

| Rang | Modèle | Points forts | Points faibles |
|------|--------|--------------|----------------|
| 🥇 | **Sonnet 4.6** | Excellence tech + exhaustivité | Verbose, overkill parfois |
| 🥈 | **k2p5** | Précision + cohérence + adaptation contexte | Moins de tests, AVL vs RB |
| 🥈 | **Hunter Alpha** | Cause racine + praticité | Comptage logs approximatif |
| 🥉 | **Healer Alpha** | Tests exhaustifs + lisibilité | BST non équilibré |
| 4ème | **GPT-5.4** | Rigueur méthodologique | Conventionnel, comptage logs |

---

## 🆚 k2p5 vs les autres : Profil Distinctif

### Ce qui rend k2p5 unique dans ce benchmark

1. **Adaptation culturelle** : Documentation en français, approche pragmatique "orient é utilisateur"
2. **Précision chiffrée** : Donne des seuils concrets (1-5M docs) là où d'autres restent vagues
3. **Angle business** : Priorise la stabilité système globale (JVM) sur les erreurs localisées
4. **Consistance** : Aucune dérive dans le comptage, résultats méthodiques sur les 3 tâches
5. **Features bonus** : Ajoute `searchInterval` comme Sonnet — signe de créativité

### Comparaison directe k2p5 vs GPT-5.4 (même architecture AVL)

| Critère | GPT-5.4 | k2p5 |
|---------|---------|------|
| Architecture | AVL | AVL |
| Lignes implémentation | 242 | 364 |
| Tests | 13 | 12+ |
| Features bonus | Aucune | `searchInterval` ✅ |
| Docs | Anglais | Français + JSDoc |
| Comptage logs | 52 ⚠️ | 45 ✅ |
| Seuil FTS5/ES | Pas chiffré | **1-5M docs** ✅ |

**Verdict direct : k2p5 > GPT-5.4** sur ce benchmark.

---

## 📁 Fichiers de résultats

```
benchmark-results/
├── README.md          # Vue d'ensemble initiale
├── README-v2.md       # Healer Alpha analyse complète
├── README-v3.md       # Méta-analyse des 4 premiers modèles
├── README-v4.md       # Ce fichier — intégration k2p5 ⬅️
├── code/
│   ├── healer-alpha.ts/test.ts
│   ├── sonnet-46.ts/test.ts
│   ├── gpt-54.ts/test.ts
│   ├── hunter-alpha.ts/test.ts
│   └── k2p5.ts/test.ts        🆕
├── analyse/
│   ├── healer-alpha.md
│   ├── sonnet-46.md
│   ├── gpt-54.md
│   ├── hunter-alpha.md
│   └── k2p5.md               🆕
└── recherche/
    ├── healer-alpha.md
    ├── sonnet-46.md
    ├── gpt-54.md
    ├── hunter-alpha.md
    └── k2p5.md               🆕
```
