---
name: model-router
description: "Routage entre modèles économes (Haiku / K2P5 / Codex-mini) pour les discussions légères, et modèles puissants (GPT-5.3-Codex / Sonnet-4-6 / K2P5) pour le code ou l’analyse lourde. Déclenche ce skill dès que l’utilisateur mentionne un changement de modèle, ou qu’il faut arbitrer coût vs capacité."
---

# Routage des modèles selon l’intensité

## Objectif
Garder les coûts bas pour les échanges légers tout en déléguant les tâches complexes aux modèles les plus puissants disponibles. Ce skill documente la table de correspondance, la logique de bascule et les commandes à utiliser.

## Table de correspondance

| Situation | Modèle souhaité | Commande à exécuter |
|-----------|-----------------|----------------------|
| Situation | Ordre de modèles recommandé | Commande à exécuter |
|-----------|----------------------------|----------------------|
| Discussion courte, rappel rapide, réponse factuelle / brainstorming léger | `anthropic/claude-haiku-4-5` → `kimi-coding/k2p5` → `openai-codex/gpt-5.1-codex-mini` | `session_status(model="haiku")` (puis fallback si nécessaire) |
| Question un peu plus longue, rédaction structurée légère sans gros calcul | même ordre `Haiku → K2P5 → Codex-mini` (solo ou avec transition) | `session_status(model="codex-mini")` (retour sur `haiku` selon le niveau) |
| Débogage, génération de code, architecture, analyse de logs, conception de workflow | `openai-codex/gpt-5.3-codex` → `anthropic/claude-sonnet-4-6` → `kimi-coding/k2p5` | `session_status(model="codex")` (ou `sonnet`, selon l’étape) |
| Code critique (vérification, refactor, architecture) | même ordre `Codex → Sonnet → K2P5` avec priorité forte sur `gpt-5.3-codex` | `session_status(model="codex")` |

> Si la commande retourne un modèle non autorisé, basculer sur le proxie le plus proche (p. ex. Haiku → Codex-mini) et documenter la limitation dans la réponse.

## Processus détaillé

1. **Évaluer l’intention** : le flux commence par analyser la requête. Si l’utilisateur demande un résumé, une réponse courte ou des conseils légers, rester en Haiku/codex-mini.
2. **Détection de la complexité** : dès qu’une tâche implique de la programmation, de la transformation de données, de l’analyse d’une API, une hypothèse rigoureuse ou un plan d’action long, préparer la bascule vers Sonnet/ Codex.
3. **Basculer explicitement** : utiliser `session_status(model="<alias>")` pour fixer le modèle. Si tu dois garder la discussion en économes mais coder dans une sous-session, tu peux appeler `sessions_spawn` avec `model="sonnet"` et transférer les consignes critiques vers cette session.
4. **Automatisation** : exécuter `scripts/model-router.py --text "<demande>" --json` puis appliquer `session_status(model="<model>")` avant de répondre. Le script retourne le modèle recommandé + le motif, ce qui évite toute frappe manuelle. Pour une version encore plus rapide, le script peut s'intégrer dans un alias `./scripts/model-router.py --json <<< "$(cat message.txt)"` ou être invoqué automatiquement dans tes workflows de préparation de réponse.
5. **Clarifier auprès de l’utilisateur** : mentionne toujours quel modèle tu utilises pour la réponse si l’utilisateur le demande ou si le changement a un impact perceptible (temps de latence, coût). Exemple : « Je passe sur Sonnet-4-6 pour le debug, je te remets sur Haiku ensuite. »
6. **Retour à l’économe** : dès que la partie complexe est terminée, revenir à Haiku/codex-mini pour les échanges de suivi.

## Rappels opérationnels

- Si la commande `session_status` n’est pas disponible, émuler la bascule via `sessions_spawn` et préciser dans le message : « nouveau canal Sonnet actif ». Une fois la tâche finie, tu peux fermer la sous-session.
- Pour les scénarios mixtes (ex : on discute puis on code), on peut garder la conversation principale en Haiku et ouvrir une réponse dédiée par `sessions_spawn` en Sonnet, puis copier la synthèse dans la session principale.
- Toujours documenter tout changement de modèle important dans le résumé final, avec un impact (latence / coût) si c’est pertinent.
- En cas de demande explicite de modèle précis, respecter la demande et signaler si elle n’est pas autorisée (modèle refusé, indisp.).
