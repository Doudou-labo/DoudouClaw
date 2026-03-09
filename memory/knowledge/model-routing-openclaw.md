---
title: "Routage modèles OpenClaw"
date: 2026-03-09
type: semantic
status: active
---

# Connaissance — Routage modèles OpenClaw

## Ordre validé
- Primary: `openai-codex/gpt-5.4`
- Fallback 1: `anthropic/claude-sonnet-4-6`
- Fallback 2: `kimi-coding/k2p5`

## Point d’attention
Un bug a été observé sur `gpt-5.4` : certains tool calls pouvaient s’afficher en texte brut au lieu d’être exécutés.

## Consigne pratique
Sur suspicion de tool-calls cassés, fallback vers `claude-sonnet-4-6`.
