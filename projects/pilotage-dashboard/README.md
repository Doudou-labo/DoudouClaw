# Pilotage Dashboard

MVP local pour `pilotage.doudougen.xyz`.

## Stack
- Next.js 15 + TypeScript
- Tailwind CSS
- SQLite (`better-sqlite3`)
- `xlsx` pour l'import manuel
- `recharts` pour les graphes
- `zod` pour la validation

## Pages
- `/` : vue d'ensemble
- `/agence`
- `/vl`
- `/pl`
- `/imports`

## Format XLSX attendu
Première feuille, avec les colonnes suivantes :

| scope | kpiCode | period | value |
|---|---|---|---|
| AGENCE | CA | 2026-03 | 124000 |
| VL | PS | 2026-03 | 83 |
| PL | MARGE | 2026-03 | 31200 |

Scopes acceptés : `AGENCE`, `VL`, `PL`

KPI acceptés :
- `CA`
- `PS`
- `MARGE`
- `OBJECTIF_EVOLUTION`
- `OBJECTIF_N`
- `OBJECTIF_JOURNALIER`
- `RESTE_A_FAIRE`
- `ATTERRISSAGE_FDM`
- `COMPARAISON_N_1`

## Lancement
```bash
cd projects/pilotage-dashboard
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Notes MVP
- L'import crée un batch dans `imports` et stocke les lignes dans `kpi_snapshots`
- L'affichage utilise le **dernier import**
- Les overrides sont stockés séparément dans `kpi_overrides`
- Les valeurs éditées prennent le dessus dans les pages scope
