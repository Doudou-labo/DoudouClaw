---
title: "Workflow fsxmemory"
date: 2026-03-09
type: semantic
status: active
---

# Connaissance — Workflow fsxmemory

## Décision d’architecture
- `fsxmemory` est la couche locale de checkpoint/recover/handoff/recherche.
- `mem0` et `Cognee` sont gardés pour plus tard, pas installés maintenant.
- `qmd` sert à la recherche sémantique locale.
- `qmd` doit indexer **uniquement** la collection `memory`.

## Mode d’usage
Mode par défaut : **niveau 2.5**
- interaction naturelle côté utilisateur
- capture / remember / checkpoint / handoff / search / vsearch côté agent
- pas de sur-structuration inutile

## État technique validé
- qmd installé
- collection active : `memory`
- 43 fichiers mémoire indexés
- 1918 embeddings/chunks validés
