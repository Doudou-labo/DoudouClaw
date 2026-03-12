# Inventaire physique des pneus (app dédiée)

## Objectif
Construire une application dédiée à l’inventaire physique des pneus, séparée de `pneu-tracker`, avec un flux de contrôle opérationnel fiable et un export Excel final.

## Décisions validées
- Domaine ciblé: `inventaire.doudougen.xyz` (DNS déjà créé).
- Vue principale: liste complète affichant toutes les colonnes XLSX (`Article`, `Référence pneu`, `A utilisation libre`, `Stock disponible`, `Stock alloué`, `En cours de commande`).
- Import: conserver **strictement** l’ordre des lignes du fichier (aucun tri automatique).
- Contrôle inventaire: statut conforme/non conforme/reste à contrôler + quantité physique + écart auto (utilisation libre vs physique).
- UX: possibilité de revenir en arrière/réinitialiser une ligne sans blocage d’état.
- Source enrichissement: réutiliser le référentiel ~12.5k pneus pour recherche/ajout (réf fabricant / SAP / description).
- Sortie: export Excel des résultats consolidés de fin d’inventaire.

## Backlog MVP
1. Définir modèle de données import + états de contrôle + colonnes de sortie export.
2. Implémenter import XLSX avec index d’ordre stable (`import_row_order`).
3. Construire table UI avec filtres et action reset ligne.
4. Ajouter recherche/ajout depuis référentiel pneus.
5. Générer export Excel final compatible usage terrain.

## Risques / vigilance
- Toute opération de tri front doit préserver un mode “ordre d’import” explicite.
- Le reset doit restaurer un état neutre complet (statut, quantité, écart, timestamps).
- Vérifier performance sur de gros imports (pagination/virtualisation si nécessaire).
