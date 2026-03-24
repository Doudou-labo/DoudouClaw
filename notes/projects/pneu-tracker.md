# Pneu Tracker

## Objectif
Application web de suivi des sorties de pneumatiques pour Euromaster, avec traçabilité opérationnelle, contrôle des écarts et exports exploitables.

## Statut
**Actif / en production**
- URL : `https://pneus.doudougen.xyz`
- Repo/app : `/root/projects/pneu-tracker/`
- Service : `pneu-tracker.service`
- Stack : Next.js 16 + SQLite (`better-sqlite3`) + recharts + `pdfkit`

## Base livrée
- Formulaire de saisie des sorties pneus
- Historique filtrable + pagination
- Modification / suppression logique
- Import / export CSV
- Audit trail
- Dashboard
- Vue mobile
- Autocomplétion sur référentiel pneus
- Référentiel métier intégré : **12 568 références**

## Travaux récents (2026-03-23 → 2026-03-24)

### 2026-03-23 — Sprint UI/UX + vrai export PDF sorties
- Refonte visuelle palette Euromaster (`#144390` / `#F9E700`)
- Header dégradé pleine largeur
- Améliorations UX : confirmations, spinners, autofocus, aria-labels, toggle avancé plus propre
- Améliorations filtres/dashboard : typeahead immat, tooltip SAP, vues vides, labels FR, raccourcis temps, vue cartes/table
- Export PDF sorties refait proprement côté serveur avec `pdfkit`
- Fix Next.js/Turbopack via `serverExternalPackages`
- Commit clé : `b3f9a89` — export PDF binaire serveur

### 2026-03-24 — Module Inversion complet
#### Fonctionnel livré
- Nouvelle entité métier **`inversions`**
- Bouton **`↔️ Inversion`** sur chaque ligne de l’historique
- Préremplissage depuis la sortie source : immatriculation + quantité verrouillées
- Sélection de la référence facturée via le catalogue pneus
- Nouvel onglet **Inversions**
- Listing + pagination
- Export **CSV + PDF** des inversions

#### Évolutions complémentaires livrées le même jour
- Export PDF inversions corrigé pour afficher **SAP + Description** au lieu de la seule réf fabricant
- Statut **inversion faite / à faire**
- Case à cocher dans la liste pour marquer l’inversion comme faite
- Possibilité de **modifier une inversion** comme une sortie
- Statut ajouté aux exports **PDF + CSV** des inversions

#### Commits clés
- `90eebe1` — module Inversion complet (data model, saisie, listing, exports CSV+PDF)
- `4eb15f4` — export PDF inversions en **SAP + description**
- `d77cc13` — gestion du **statut fait / à faire** + **modification** d’inversion
- `1082f8c` — statut des inversions ajouté aux **exports**

## Règles métier validées
- Une inversion = référence facturée différente de la référence montée/enregistrée
- L’immatriculation reste liée à la sortie source
- La quantité reste identique à la sortie source
- La facture est optionnelle
- L’inversion peut être marquée **faite** ou **à faire**

## Ce qui marche aujourd’hui
### Sorties
- Saisie
- Historique
- Facturation (marquage)
- Export CSV/PDF
- Modification / suppression

### Inversions
- Création depuis l’historique
- Modification
- Marquage faite / à faire
- Export CSV/PDF avec statut

## Backlog restant
- Ajouter une **fiche visuelle du pneu sélectionné** (formulaire + édition)
- Ajouter un **bouton admin de réimport catalogue** depuis l’UI
- Enrichir le **dashboard** avec stats par marque / saison / référence
- Reprendre si besoin les chantiers confort restants : accessibilité, rapidité de saisie, raffinements UX

## Notes d’architecture
- Les inversions sont gérées dans une table dédiée `inversions`
- Le suivi “fait / à faire” utilise un timestamp `done_at` (plus riche qu’un booléen)
- Les exports PDF sont générés côté serveur avec `pdfkit`

## Prochaine action recommandée
Tester en usage réel le flux complet :
1. créer une sortie
2. créer une inversion depuis l’historique
3. modifier l’inversion
4. la marquer faite
5. vérifier les exports CSV/PDF
