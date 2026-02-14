# Discord — activer les réponses sans mention (OpenClaw)

## Contexte
Pour que le bot OpenClaw réponde dans un serveur Discord **sans mention**, il faut :
1) Autoriser explicitement le serveur (guild) dans la config
2) Désactiver l’obligation de mention (`requireMention: false`) pour ce guild

> Important : le fichier de config réel (`/root/.openclaw/openclaw.json`) contient des **secrets** (tokens). Il ne doit pas être commité. Ce document trace uniquement les changements effectués.

## Changements appliqués (2026-02-14)
- `channels.discord.groupPolicy` → `allowlist`
- `channels.discord.guilds` → ajout du guild **1472335329527595038**
- `channels.discord.guilds[1472335329527595038].requireMention` → `false`

### Extrait (sans secrets)
```json
{
  "channels": {
    "discord": {
      "groupPolicy": "allowlist",
      "guilds": {
        "1472335329527595038": {
          "requireMention": false
        }
      }
    }
  }
}
```

## Activation
Après modification, redémarrer le gateway :
```bash
openclaw gateway restart
```

## Notes
- Si tu veux limiter à certains salons plus tard : passer sur une allowlist de channels (à définir selon schéma OpenClaw).
