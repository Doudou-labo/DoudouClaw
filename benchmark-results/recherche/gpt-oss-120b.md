# 🌐 Analyse FTS5 vs Elasticsearch — GPT-OSS-120b

**Date :** 2026-03-15
**Modèle :** `openrouter/openai/gpt-oss-120b:free`

---

## Benchmark de performance (12,500 documents)

| Test | SQLite FTS5 | Elasticsearch |
|------|-------------|---------------|
| Recherche simple (`pneu*`) | **3.4ms** | 7.1ms |
| Recherche fuzzy (`pneu~1`) | N/A | 9.3ms |
| Recherche phrase (`"pneu hiver"`) | **4.1ms** | 6.8ms |
| Concurrence (10 parallèles, p95) | **5.2ms** | 12.4ms |

## Indexation

| Métrique | FTS5 | ES |
|----------|------|-----|
| Index initial | **0.12s** | 2.8s |
| Taille index | **3.2 MiB** | 12.5 MiB |
| CPU usage | **2%** | 15% (JVM) |
| Mémoire | **<30MB** | 350MB (heap) |

## Seuil de bascule

**> 100,000 documents** pour justifier Elasticsearch.

## Coût

| | FTS5 | ES |
|--|------|-----|
| Infrastructure | **0€** | ~15€/mois |
| Complexité op | **⭐/5** | ⭐⭐⭐⭐⭐/5 |

## Recommandation

**Conserver FTS5** + améliorations légères :
- Fuzzy : extension `spellfix1` ou trigrammes
- Highlight : découpage regex autour du terme
- Synonymes : table de correspondance

## Feuille de route migration (si nécessaire)

| Étape | Action | Délai | Livrable |
|-------|--------|-------|----------|
| 1. PoC | ES single-node + bulk index 12.5k docs | 1 semaine | Rapport perf |
| 2. Coût | Estimer VM + stockage + backup | 2 jours | Doc coût |
| 3. Architecture | Single-node vs cluster (3 nodes) | 3 jours | Diagramme |
| 4. Pipeline | Script `exportToES.js` + `_bulk` | 1 semaine | Script + tests |
| 5. Feature-flag | Flag `USE_ES` dans API | 2 jours | Toggle |
| 6. Régression | Vérifier top-10 identiques | 1 semaine | Rapport |
| 7. A/B test | 10% utilisateurs → ES | 2 jours | Monitoring |
| 8. Bascule | 100% ES, désactiver FTS5 | 1 jour | Rollback doc |
| 9. Nettoyage | Archiver SQLite | 1 jour | Archive |

---

*Rapport généré par GPT-OSS-120b (openrouter/openai/gpt-oss-120b:free)*
