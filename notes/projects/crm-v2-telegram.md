# CRM V2 — Telegram + stockage local (repo privé)

## Statut
- En cours
- Dernière mise à jour: 2026-02-10

## Objectif (fin claire)
Avoir un CRM **léger**, utilisable depuis **Telegram**, avec **stockage local** sur le serveur OpenClaw et versionnement sur **GitHub privé** (données sensibles gérées proprement).

## Décisions / contraintes
- Repo **GitHub privé** accepté pour versionner les données CRM (noms / sociétés / téléphones).
- Fonctionnement hybride (naturel) :
  - si une échéance date/heure est fournie → programmer un rappel (heure France / Europe/Paris)
  - si pas d’heure → to-do, demander l’heure seulement si nécessaire
- Rappels/routines via cron : **uniquement** dans le topic Telegram dédié aux rappels (topic 32) — sauf exceptions explicitement demandées.

## Où ça vit (tech)
- Skill/CLI: `skills/crm/` + commande `crm`
- Base locale: `data/crm.sqlite`
- Tables: contacts, interactions, followups (statuts: PROCHAINEMENT / EN_ATTENTE_EXTERNE / A_FAIRE / FAIT)

## Telegram routing (IMPORTANT)
- Tout ce qui touche au CRM (sujets/rapports/rappels CRM) doit être envoyé dans le topic :
  - `agent:main:telegram:group:-1003791371950:topic:137`

## À faire (prochaines étapes)
- Ajouter une couche “phrase naturelle” (parser texte → commandes CRM), soit dans `crm`, soit côté agent.
- Option : brancher les followups PROCHAINEMENT sur un système de rappels automatiques (cron) si demandé.
- Vérifier/valider le routage CRM (topic 137) sur quelques cas réels.
