# Modèles — mode "auto" (discussion vs technique)

## Besoin
- Mode "auto" souhaité :
  - **Kimi** pour discussion
  - **Codex** pour technique

## Contexte / gotchas
- Endpoint Moonshot correct : `https://api.moonshot.ai/v1` (et non `api.moonshot.cn` → 401).
- Après ajout Moonshot, `openclaw models list` montre `moonshot/kimi-k2.5` comme default + fallbacks.
- Côté openai-codex : `openai-codex/gpt-5.3-codex` peut disparaître; `openai-codex/gpt-5.2` visible.

## À décider
- Critère de bascule (mots-clés, type de demande, ou commande explicite).
- Modèle technique de fallback si 5.3 indisponible.
