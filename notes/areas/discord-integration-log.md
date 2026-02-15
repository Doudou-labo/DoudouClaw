# Discord gateway update log (2026-02-15)

## Objectif
- Rendre le bot réactif dans `#général` (ID `1472335330223980609`) sans mention.
- Stabiliser le modèle utilisé côté agent (préférer `openai-codex/gpt-5.1-codex-mini`).

## Actions
1. Ajout du salon `1472335330223980609` dans `channels.discord.guilds[1472335329527595038].channels` avec `allow: true` et `requireMention: false`.
2. Défini `openai-codex/gpt-5.1-codex-mini` comme `agents.defaults.model.primary` + fallback pour éviter les basculements Spark liés aux crédits.
3. Restart du gateway (pid 255424) pour appliquer la config.

## Résultat
- Le bot répond désormais dans le salon général sans être mentionné.
- Les tests Discord/Telegram confirment la restauration du service sur la `main`.
