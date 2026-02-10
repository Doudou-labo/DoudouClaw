# Modèles — mode "auto" (discussion vs technique)

## Définition
Un mode de fonctionnement où l’assistant choisit automatiquement le modèle le plus adapté :
- **Kimi** pour les échanges “discussion / coaching / réflexion”
- **Codex** pour les demandes “techniques / code / ops”

## Pourquoi c’est utile
- Réponses plus adaptées (style + précision) sans que tu aies à y penser.
- Optimise les coûts/performances selon le type de tâche.
- Réduit les frictions (“je dois changer de modèle à la main”).

## Comment ça fonctionne
On définit une règle de bascule (simple) + un fallback.

```
Si demande = technique (code, scripts, logs, commandes, debug) → Codex
Sinon → Kimi

Fallback technique si Codex 5.3 indispo → openai-codex/gpt-5.2
```

### Contexte / gotchas (à ne pas oublier)
- Endpoint Moonshot correct : `https://api.moonshot.ai/v1` (et non `api.moonshot.cn` → 401).
- `openai-codex/gpt-5.3-codex` peut ne pas être listé; `openai-codex/gpt-5.2` est généralement dispo.

## Insight clé
Le mode “auto” marche uniquement si la règle est **prévisible** (tu dois pouvoir deviner pourquoi ça a basculé).

## Liens / Connexes
- `notes/resources/routing-telegram-topics.md`

---
*Ajouté : 2026-02-10*
