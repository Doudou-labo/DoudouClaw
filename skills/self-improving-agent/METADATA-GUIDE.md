# Learning Metadata Guide

> Comment utiliser les métadonnées enrichies pour les learnings

## Format

Chaque fichier `.learnings/*.md` doit commencer par un bloc YAML frontmatter :

```yaml
---
date: YYYY-MM-DD
category: bug|optimization|new-capability|refactor
severity: low|medium|high|critical
status: applied|pending|rejected
impact: Short measurable impact description
related: [learning-file-1.md, learning-file-2.md]
evolution_event_id: evt-xxx
---
```

## Champs

### `date`
Date de création du learning (YYYY-MM-DD).

### `category`
Type de learning :
- **bug** : Correction d'erreur
- **optimization** : Amélioration perf/efficacité
- **new-capability** : Nouvelle fonctionnalité
- **refactor** : Restructuration sans changement fonctionnel

### `severity`
Gravité (pour bugs) ou importance (pour optimizations/features) :
- **low** : Impact mineur, peut attendre
- **medium** : Impact notable, devrait être traité
- **high** : Impact important, priorité élevée
- **critical** : Bloquant ou risque majeur

### `status`
État d'application :
- **pending** : Learning identifié mais pas encore appliqué
- **applied** : Fix/amélioration implémentée
- **rejected** : Décidé de ne pas appliquer (avec justification dans Notes)

### `impact`
Description courte de l'impact mesuré (quantifiable si possible).
Exemples :
- "Réduit erreurs de 40% (12→7 sur 100 runs)"
- "Accélère traitement de 2.3x (450ms → 195ms avg)"
- "Élimine 100% échecs sur fichiers >10MB"

### `related`
Liste de learnings liés (noms de fichiers).
Permet de tracer les chaînes de cause-effet.

### `evolution_event_id`
ID de l'événement correspondant dans `evolution-log.jsonl` (si loggé).
Crée un lien bidirectionnel entre learning markdown et log structuré.

## Recherche et Analyse

### Tous les learnings en attente

```bash
grep -l "status: pending" skills/self-improving-agent/.learnings/*.md
```

### Learnings critiques non appliqués

```bash
grep -l "severity: critical" skills/self-improving-agent/.learnings/*.md | \
  xargs grep -l "status: pending"
```

### Learnings par catégorie

```bash
grep "category: bug" skills/self-improving-agent/.learnings/*.md | cut -d: -f1 | sort -u
```

### Impact total mesuré

```bash
grep "^impact:" skills/self-improving-agent/.learnings/*.md
```

## Workflow

### 1. Créer un nouveau learning

```bash
./scripts/create-learning.sh "Tool X fails on large files" "bug" "high"
```

### 2. Remplir les détails

Éditer le fichier généré et compléter :
- Context
- Lesson
- Applied Fix (si déjà implémenté)
- Impact Measured (après validation)

### 3. Logger l'événement d'évolution

Si le learning est significatif :

```bash
./scripts/log-evolution.sh \
  "bug" \
  "Tool X échouait sur fichiers >10MB" \
  "Validation taille + chunking" \
  "true" \
  "0 échecs sur 20 tests avec fichiers 50MB"
```

Récupérer l'ID de l'événement et le mettre dans `evolution_event_id`.

### 4. Mettre à jour le statut

Quand le fix est appliqué :
- Changer `status: pending` → `status: applied`
- Documenter `impact` avec mesures concrètes

### 5. Lier les learnings connexes

Si un learning en découle d'un autre, ajouter dans `related`.

## Migration des anciens learnings

Les learnings existants sans frontmatter YAML restent valides.
Migration recommandée mais pas obligatoire.

Pour migrer :
1. Copier le contenu du learning
2. Créer nouveau fichier avec `create-learning.sh`
3. Coller le contenu et ajouter les métadonnées
4. Archiver l'ancien (ou le supprimer après validation)

## Intégration avec evolution-dashboard.md

Le dashboard analyse automatiquement les métadonnées pour générer :
- Statistiques par catégorie/sévérité/statut
- Timeline d'évolution
- Top learnings par impact
- Open loops (pending items)

---

**Note** : Les métadonnées facilitent la recherche, l'analyse et la priorisation. Mais le contenu du learning (Context/Lesson/Fix/Impact) reste le plus important.
