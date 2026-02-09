# OpenClaw + Telegram (rappels & organisation)

**Catégorie :** productivité
**Site :** https://docs.openclaw.ai
**Coût :** gratuit (hors infra si auto-hébergé)

## À quoi ça sert
Avoir un assistant qui peut :
- te rappeler des actions importantes (ex: déployer proactive-agent)
- structurer tes notes (PARA)
- t’aider à garder une routine légère sans charge mentale

## Pourquoi je l’utilise
Parce que Telegram est toujours dans la poche : je peux piloter l’organisation **depuis l’iPhone** sans devoir ouvrir un PC.

## Quand l’utiliser
- Le soir pour planifier le lendemain
- Quand une action est importante mais facile à repousser
- Pour transformer une idée en “next action” immédiatement

## Démarrage rapide
```bash
# Côté agent : programmer un rappel via cron (exemple)
# (Dans OpenClaw, l’agent crée un job cron qui injecte un systemEvent à l’heure voulue)

# Côté toi : tu envoies juste un message du style :
# "Rappelle-moi demain 19h30 de déployer proactive-agent"
```

## Pièges / gotchas
- Les heures : toujours préciser “heure de Paris” si besoin
- Les gros copier-coller sur iPhone : préférer des étapes courtes
- Accès Google (Calendar) : nécessite OAuth + keyring (une fois configuré)

## Liens / Connexes
- notes/resources/para-routine-3min.md
- notes/resources/templates/tool.md

---
*Ajouté : 2026-02-09 | Vérifié le : 2026-02-09*
