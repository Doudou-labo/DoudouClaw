---
title: "Orchestration sous-agents"
date: 2026-03-09
type: semantic
status: active
---

# Connaissance — Orchestration sous-agents

## Architecture
- `main` = conducteur principal
- spécialistes persistants pour mémoire, ops, repo, sécurité, docs
- spécialistes dynamiques pour traitements ponctuels

## Règle simple
- simple/faible risque → `main`
- mono-domaine technique → spécialiste direct
- multi-domaines → orchestrateur

## But
Garder une orchestration lisible, reproductible et sans bruit inutile.
