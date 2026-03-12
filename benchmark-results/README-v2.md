# 🔬 Benchmark Modèles LLM — 2026-03-12

Comparaison de 4 modèles sur 3 tâches identiques.

## Modèles testés

| Modèle | Provider | Alias |
|--------|----------|-------|
| `openrouter/openrouter/healer-alpha` | OpenRouter | Healer Alpha |
| `anthropic/claude-sonnet-4-6` | Anthropic | Sonnet 4.6 |
| `openai-codex/gpt-5.4` | OpenAI | GPT-5.4 |
| `openrouter/hunter-alpha` | OpenRouter | Hunter Alpha |

## Tâches

### 🖥️ Code — IntervalTree en TypeScript
Implémentation complète d'un arbre d'intervalles avec tests unitaires.

| Modèle | Implémentation | Tests | Total lignes | Structure | Tests passants |
|--------|----------------|-------|--------------|-----------|----------------|
| **Healer Alpha** | 192 lignes | 274 lignes | 466 | BST augmenté (maxEnd) | 18/18 ✅ |
| **Sonnet 4.6** | 438 lignes | 229 lignes | 667 | **Red-Black Tree** + queryInterval | 15/15 ✅ |
| **GPT-5.4** | 242 lignes | 151 lignes | 393 | AVL augmenté (maxEnd) | 13/13 ✅ |
| **Hunter Alpha** | 238 lignes | 206 lignes | 444 | Red-Black BST (maxEnd) | 15/15 ✅ |

**Gagnant : Sonnet 4.6** — seule implémentation avec Red-Black Tree complet + méthode `queryInterval` en bonus. Code le plus structuré et le plus complet.

### 🔍 Analyse — Logs serveur (45 requêtes)
Détection d'anomalies dans un log Apache-like avec erreurs injectées.

| Modèle | Requêtes détectées | Taux d'erreur | Anomalies trouvées | Rapport |
|--------|--------------------|---------------|--------------------|----|
| **Healer Alpha** | 45 | 40.0% | 6 patterns + médiane 95ms | ✅ Bon |
| **Sonnet 4.6** | 45 | 31.1% | 6 patterns | ✅ Excellent |
| **GPT-5.4** | 52 | 40.4% | 6 patterns + P95 | ✅ Très détaillé |
| **Hunter Alpha** | 49 | 42.9% | 6 patterns + lecture causale | ✅ Bon |

**Note :** GPT et Hunter ont "créé" des requêtes supplémentaires (comptage diff), Sonnet et Healer sont restés sur le count exact (45).

### 🌐 Recherche — FTS5 vs Elasticsearch
Synthèse technique avec recherche web réelle.

| Modèle | Mots | Sources | Contenu |
|--------|------|---------|---------|
| **GPT-5.4** | ~10500 chars | Sources multiples | Le plus détaillé, mentionne le manque de benchmarks apples-to-apples |
| **Sonnet 4.6** | ~9100 chars | 8 sources | Excellent équilibre, tableau comparatif |
| **Hunter Alpha** | ~8900 chars | 7 sources | Lien pratique avec Pneu-Tracker |
| **Healer Alpha** | ~7600 chars | Sources variées | Concis et efficace |

**Gagnant : Sonnet 4.6 / GPT-5.4** — GPT le plus complet, Sonnet le mieux structuré.

## Synthèse globale

| Critère | Healer Alpha | Sonnet 4.6 | GPT-5.4 | Hunter Alpha |
|---------|-------------|------------|---------|-------------|
| Code | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recherche | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Total** | 🥉 | 🥇 | 🥈 | 🥉 |

## Structure des fichiers

```
benchmark-results/
├── README.md                    # Ce fichier
├── code/
│   ├── healer-alpha.ts         # Implémentation
│   ├── healer-alpha.test.ts    # Tests
│   ├── sonnet-46.ts
│   ├── sonnet-46.test.ts
│   ├── gpt-54.ts
│   ├── gpt-54.test.ts
│   ├── hunter-alpha.ts
│   └── hunter-alpha.test.ts
├── analyse/
│   ├── sonnet-46.md            # Rapport analyse logs
│   ├── gpt-54.md
│   └── hunter-alpha.md
└── recherche/
    ├── healer-alpha.md         # Synthèse FTS5 vs ES
    ├── sonnet-46.md
    ├── gpt-54.md
    └── hunter-alpha.md
```
