# CRM léger (local + GitHub, données chiffrées)

Ce dossier fournit un mini-CRM orienté **suivi client / relances / commandes / tâches**.

- Les données sont stockées sous forme de fichiers JSON **chiffrés** (`*.age`) versionnables dans Git.
- La **clé privée** de déchiffrement reste **hors repo** sur le serveur OpenClaw.

## Fichiers

- `crm/data/clients.json.age` — clients (chiffré)
- `crm/data/interactions.json.age` — appels / notes / échanges (chiffré)
- `crm/data/tasks.json.age` — tâches & relances (chiffré)

### Statuts des tâches
- **Réalisé**
- **En attente (externe)**

## Sécurité

- **NE PAS** commit les fichiers en clair (`clients.json`, etc.)
- La clé privée est ici : `/root/.config/crm-age.key` (permissions 600)
- La clé publique (utile pour chiffrer) est copiée dans : `crm/docs/age-public-key.txt`

## Commandes

Scripts:
- `crm/bin/crm-encrypt.sh` — chiffre les JSON -> `*.age` puis supprime les fichiers en clair
- `crm/bin/crm-decrypt.sh` — déchiffre `*.age` -> JSON en clair (à utiliser temporairement)
- `crm/bin/crm-task-set-status.sh` — change le statut d'une tâche (sans laisser de JSON en clair)

Exemples:
```bash
# Déchiffrer (temporairement)
./crm/bin/crm-decrypt.sh

# ... éditer les fichiers crm/data/*.json ...

# Rechiffrer + nettoyer le clair
./crm/bin/crm-encrypt.sh
```

## Prochaines étapes

- Ajouter un petit CLI (ex: `crm add-client`, `crm add-task`, `crm due`) pour que DoudouBot puisse piloter ça via Telegram.
