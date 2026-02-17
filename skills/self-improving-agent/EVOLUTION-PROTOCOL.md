# Evolution Protocol (GEP-inspired)

> Protocole de traçabilité de l'évolution de l'agent, inspiré du concept GEP mais sans auto-mutation.

## Concept

Ce protocole permet de logger chaque événement d'évolution (bug fix, optimization, nouvelle capacité) dans un format structuré, traçable, et analysable.

## Format

**Fichier** : `evolution-log.jsonl` (JSON Lines)

**Structure d'un événement** :
```json
{
  "timestamp": "2026-02-17T12:15:00Z",
  "id": "evt-001",
  "category": "bug|optimization|new-capability|refactor",
  "context": "Description du contexte",
  "lesson": "Ce qu'on a appris",
  "applied": true|false,
  "impact": "Description de l'impact mesuré",
  "parent_id": "evt-parent-id or null"
}
```

### Catégories

- **bug** : Correction d'erreur
- **optimization** : Amélioration de performance/efficacité
- **new-capability** : Nouvelle fonctionnalité ajoutée
- **refactor** : Restructuration sans changement fonctionnel

### Champs

- `timestamp` : ISO-8601 UTC
- `id` : Identifiant unique de l'événement
- `category` : Type d'évolution (voir ci-dessus)
- `context` : Situation qui a mené à cette évolution
- `lesson` : Ce qu'on a appris (transferable knowledge)
- `applied` : L'évolution a-t-elle été appliquée ?
- `impact` : Impact observé après application
- `parent_id` : Lien vers un événement parent (permet de tracer des chaînes d'évolution)

## Usage

### Méthode 1 : Script helper

```bash
./scripts/log-evolution.sh \
  "bug" \
  "Tool X échouait sur fichiers >10MB" \
  "Ajouter validation taille + chunking pour gros fichiers" \
  "true" \
  "0 échecs sur 20 tests avec fichiers 50MB" \
  "evt-parent-optional"
```

### Méthode 2 : Ajout manuel

Append une ligne au fichier `evolution-log.jsonl` :

```bash
echo '{"timestamp":"2026-02-17T12:00:00Z","id":"evt-xyz","category":"optimization",...}' >> evolution-log.jsonl
```

## Analyse

### Extraire tous les événements d'une catégorie

```bash
jq 'select(.category == "bug")' evolution-log.jsonl
```

### Compter les événements appliqués vs en attente

```bash
jq -s 'group_by(.applied) | map({applied: .[0].applied, count: length})' evolution-log.jsonl
```

### Trouver les événements avec le plus d'impact

```bash
jq -s 'sort_by(.impact | length) | reverse | .[0:5]' evolution-log.jsonl
```

### Tracer une chaîne d'évolution

```bash
# Récupérer un événement et tous ses descendants
EVENT_ID="evt-001"
jq --arg id "$EVENT_ID" 'select(.id == $id or .parent_id == $id)' evolution-log.jsonl
```

## Intégration avec self-improving-agent

Quand un `.learnings/*.md` est créé :
1. Logger l'événement dans `evolution-log.jsonl`
2. Lier l'événement au fichier learning (mention du fichier dans `context`)
3. Mettre à jour `impact` quand le fix est validé

## Différences avec GEP original

❌ **Pas d'auto-mutation** : aucune modification automatique du code
❌ **Pas de "genes"** : pas de composants réutilisables auto-générés
❌ **Pas de "capsules"** : pas de cache de raisonnement pré-calculé

✅ **Conservé** : structure événementielle, traçabilité, liens parent/enfant
✅ **Ajouté** : validation humaine obligatoire, transparence totale

## Maintenance

- Revue mensuelle du log pour identifier patterns
- Archivage annuel (rotation du fichier)
- Backup via Git (commit systématique)

---

**Note** : Ce protocole est un **outil de traçabilité**, pas un système autonome. L'humain reste maître des décisions d'évolution.
