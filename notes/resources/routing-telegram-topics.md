# Routing Telegram — topics (règles)

## Définition
Règles simples qui déterminent **dans quel topic Telegram** chaque type de message doit être posté, pour garder les conversations propres (et éviter le spam au mauvais endroit).

## Pourquoi c’est utile
- Réduit la charge mentale : tu sais où retrouver chaque info.
- Évite les notifications inutiles dans les mauvais topics.
- Rend l’automatisation (cron/rappels/rapports) plus fiable.

## Comment ça fonctionne
On associe 1 **catégorie** → 1 **destination** (topic). Puis on applique la règle systématiquement.

```
Catégorie → Topic cible

Routines & rappels (cron) → groupe -1003791371950 / topic 32
CRM (sujets/rapports/rappels CRM) → agent:main:telegram:group:-1003791371950:topic:137
Bourse (récaps) → -1003791371950:3
```

## Insight clé
Une règle de routing = **une promesse** : “si c’est de ce type, ça va toujours au même endroit”.

## Liens / Connexes
- `notes/projects/crm-v2-telegram.md`
- `notes/resources/examples/tool-openclaw-telegram-rappels.md`

---
*Ajouté : 2026-02-10*
