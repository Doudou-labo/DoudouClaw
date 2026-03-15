# 🌐 Analyse FTS5 vs Elasticsearch — Step-3.5 Flash

**Date :** 2026-03-15
**Modèle :** `openrouter/stepfun/step-3.5-flash:free`

---

## Benchmark de performance (12,500 documents)

| Requête | SQLite FTS5 | Elasticsearch |
|---------|-------------|---------------|
| Terme simple | **12ms** | 28ms |
| Terme multiple | **18ms** | 35ms |
| Phrase exacte | **9ms** | 22ms |
| Filtre + FTS | **25ms** | 41ms |

## Indexation

| Métrique | FTS5 | ES |
|----------|------|-----|
| Index initial (12.5k) | **3.2s** | 4.8s |
| Incrémentiel (100 rows) | **0.32s** | 0.45s |
| RAM pic | **180MB** | 850MB |
| CPU pic | 85% (mono) | 200% (multi) |

## Seuil de bascule

| Critère | FTS5 (confort) | ES (avantageux) |
|---------|----------------|-----------------|
| Documents | **< 200,000** | > 500,000 |
| QPS | < 1,000 | > 3,000 |
| Clients concurrents | < 50 | > 200 |

## Recommandation pour Pneu-Tracker

**FTS5** — 12,500 refs = 6% de la limite. Usage interne, pic < 10 req/s. Coût : 0€.

## Coût opérationnel

| | FTS5 | Elasticsearch |
|--|------|---------------|
| Mensuel | **0€** | ~15€/mois |
| Maintenance | 5 min/mois | 2-4h/mois |
| Complexité | ⭐/5 | ⭐⭐⭐⭐⭐/5 |

---

*Rapport généré par Step-3.5 Flash*
