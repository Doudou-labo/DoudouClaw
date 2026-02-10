# Telegram — Routing des topics (règles)

## Règles générales
- Les **routines + rappels (cron jobs)** doivent être postés **uniquement** dans le topic Telegram dédié :
  - Groupe `-1003791371950`, **topic 32**.

## CRM
- Tous les messages liés au CRM (sujets/rapports/rappels CRM) → topic :
  - `agent:main:telegram:group:-1003791371950:topic:137`

## Bourse
- Récaps bourse → topic bourse Telegram :
  - `-1003791371950:3`

## Notes
- Si une nouvelle catégorie de messages apparaît, on crée une règle ici (1 ligne) pour éviter de polluer les topics.
