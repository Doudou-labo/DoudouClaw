---
title: "CRM V2 Telegram"
date: 2026-03-09
type: project
status: active
---

# Projet — CRM V2 Telegram

## Objectif
Avoir un CRM léger utilisable depuis Telegram avec stockage local sur le serveur OpenClaw.

## Contraintes
- Données CRM versionnées dans un repo GitHub privé
- Si date/heure donnée → rappel
- Sinon → to-do, demander l’heure seulement si nécessaire
- Routage CRM dédié vers le topic Telegram `137`

## État actuel
- Skill/CLI `crm` en place
- Base locale `data/crm.sqlite`
- Parser langage naturel encore à améliorer
