# Pilotage Dashboard

## Statut
En cours

## Objet
Transformer le tableau de pilotage XLSX en application web interne sur `pilotage.doudougen.xyz`.

## Objectif
Avoir un dashboard simple, exploitable au quotidien, qui remplace la consultation manuelle du fichier Excel tout en gardant la possibilité de corriger les données directement dans l’app.

## Périmètre V1 validé
### Scopes conservés
- `AGENCE`
- `VL`
- `PL`

### KPI conservés
- `CA`
- `PS`
- `MARGE`
- `OBJECTIF_EVOLUTION`
- `OBJECTIF_N`
- `OBJECTIF_JOURNALIER`
- `RESTE_A_FAIRE`
- `ATTERRISSAGE_FDM`
- `COMPARAISON_N_1`

### Exclusions V1
- KPI métiers détaillés (`EC`, géométrie, `BEG`, etc.)
- synchro temps réel Google Sheets
- moteur BI générique
- auth complexe

## Décisions produit
- Source d’entrée principale : **import manuel XLSX**
- L’app doit aussi permettre **l’édition manuelle directe** des données après import
- La donnée importée doit rester conservée séparément des corrections manuelles
- La valeur affichée = **override manuel si présent**, sinon **valeur importée**
- L’objectif V1 est un **MVP utilisable vite**, pas une copie totale du classeur Excel

## Implémentation déjà livrée
Projet créé dans : `projects/pilotage-dashboard`

### Stack
- Next.js
- TypeScript
- Tailwind CSS
- SQLite (`better-sqlite3`)
- `xlsx`
- `recharts`
- `zod`

### Pages
- `/`
- `/agence`
- `/vl`
- `/pl`
- `/imports`

### Fonctions déjà codées
- import XLSX réel
- stockage des snapshots importés
- overrides manuels persistés
- affichage des valeurs effectives (import + override)
- build validé localement

## Fichiers clés
- `projects/pilotage-dashboard/README.md`
- `projects/pilotage-dashboard/db/schema.sql`
- `projects/pilotage-dashboard/lib/xlsx.ts`
- `projects/pilotage-dashboard/lib/repository.ts`
- `projects/pilotage-dashboard/app/imports/page.tsx`
- `projects/pilotage-dashboard/components/override-form.tsx`

## Données locales
- DB : `projects/pilotage-dashboard/data/pilotage.sqlite`
- Uploads : `projects/pilotage-dashboard/uploads/`

## Prochaines étapes
1. tester le MVP avec le vrai fichier XLSX métier
2. vérifier le rendu des KPI AGENCE / VL / PL
3. ajuster le mapping XLSX si besoin
4. améliorer l’UX import + édition
5. déployer proprement sur `pilotage.doudougen.xyz`

## Risques
- structure XLSX qui bouge d’un mois à l’autre
- mapping fragile si les libellés changent
- besoin futur de multi-période / historique plus poussé

## Références
- Projet code : `projects/pilotage-dashboard`
- Domaine cible : `pilotage.doudougen.xyz`
- Journaux : `memory/2026-03-27.md`, `SESSION-STATE.md`
