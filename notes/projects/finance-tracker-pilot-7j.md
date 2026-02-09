# Finance Tracker — Pilotage 7 jours 💶

## Statut
- Démarrage: 2026-02-09
- Fin prévue: 2026-02-16
- Devise: EUR

## Installation
- Skill installé: `skills/finance-tracker/`
- CLI activée: `/usr/local/bin/finance` (symlink vers `bin/finance.py`)
- Catégories traduites en français dans `lib/categories.py`

## Routine simple (chaque soir)
1. Saisir les dépenses du jour
   - `finance add 12.50 "déjeuner"`
   - `finance add 35 "carburant"`
2. Vérifier les dernières entrées
   - `finance recent 5`
3. Voir le mini résumé
   - `finance summary`

## Rappels automatiques
- Quotidien 21:15 (Europe/Paris): routine du soir
- One-shot J+7: rappel pour activer objectifs et récurrences avancées

## Prochaine étape (J+7)
- Objectifs: `finance goal add "Coussin sécurité" 3000 --by=2026-12-31`
- Récurrence: `finance recurring add 15 "Spotify" monthly --day=5`
