---
title: "Différer mem0 et Cognee"
date: 2026-03-09
type: decision
status: decided
---

# Decision: Différer mem0 et Cognee

## Context
Après l’analyse comparative de `fsxmemory`, `mem0` et `Cognee`, le besoin immédiat est d’avoir une mémoire locale fiable pour checkpoint/recover/handoff sans ajouter une couche plus lourde ou plus coûteuse trop tôt.

## Options
1. **Installer mem0 maintenant** — extraction auto intéressante, mais ajout de complexité/coût avant même d’avoir testé `fsxmemory`
2. **Installer Cognee maintenant** — knowledge graph puissant, mais clairement surdimensionné à ce stade
3. **Différer mem0 et Cognee** — tester d’abord `fsxmemory` en conditions réelles puis réévaluer ensuite

## Decision
Différer l’installation de `mem0` et `Cognee`, et tester d’abord la puissance réelle de `fsxmemory` comme couche mémoire locale principale.

## Outcome
Références conservées pour plus tard :
- mem0 → https://github.com/mem0ai/mem0
- Cognee → https://github.com/topoteretes/cognee

#decision

## Details
Ne pas installer mem0 (https://github.com/mem0ai/mem0) ni Cognee (https://github.com/topoteretes/cognee) pour l'instant. Tester d'abord la puissance réelle de fsxmemory avant tout nouvel ajout.
