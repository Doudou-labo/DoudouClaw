---
name: crm
description: "Local mini-CRM (contacts, interactions, relances/follow-ups) avec stockage SQLite, commandes CLI `crm`, statuts de relance (PROCHAINEMENT/EN_ATTENTE_EXTERNE/A_FAIRE/FAIT) et exports CSV. Use when user wants to enregistrer des contacts (nom/téléphone/société/loueur), tracer l’historique (appels, emails, visites) ou gérer des relances à faire/programmer."
---

# CRM (local) — workflow

Utiliser la CLI `crm` (script Python) pour gérer :
- Contacts : ajouter/rechercher/voir
- Interactions : journaliser un appel/email/visite
- Relances : ajouter/lister/marquer fait (statuts: PROCHAINEMENT, EN_ATTENTE_EXTERNE, A_FAIRE, FAIT)

## Commandes (rappel)

- `crm help`
- `crm contact add --nom "Dupont" --tel "0612..." [--societe "..."] [--loueur "..."]`
- `crm contact search "dupont"`
- `crm contact show <id>`

- `crm log call --contact "Dupont" --motif "Devis pneus" --resume "..."`

- `crm followup add --contact "Dupont" --motif "Relance devis" [--due "YYYY-MM-DD HH:MM"] [--status A_FAIRE|EN_ATTENTE_EXTERNE]`
- `crm followups today|late|list [--status ...]`
- `crm done <followup_id> [--note "..."]`

## Stockage

Base SQLite : `data/crm.sqlite` (repo local privé). Heure: Europe/Paris.
