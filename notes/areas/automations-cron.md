# Automations Cron Registry

> Traçabilité repo des automatisations actives (source de référence humaine).

## 2026-02-13 — PARA + Self-Improving

### 1) PARA Auto - 3min midi (git sync)
- **Cron ID:** `024d4e3f-9ecb-4f19-94aa-3d11be363699`
- **Schedule:** `0 12 * * *` (Europe/Paris)
- **Action:** `bash scripts/auto-para-checkpoint.sh midi`
- **Channel:** Telegram `-1003791371950:topic:32`

### 2) PARA Auto - 3min soir (git sync)
- **Cron ID:** `802fc190-41b5-4171-a452-76d9c58c1645`
- **Schedule:** `0 23 * * *` (Europe/Paris)
- **Action:** `bash scripts/auto-para-checkpoint.sh soir`
- **Channel:** Telegram `-1003791371950:topic:32`

### 3) PARA Auto - revue hebdo (git sync)
- **Cron ID:** `fdbe452d-f9b3-4522-8e97-7cc325d6bbb7`
- **Schedule:** `5 18 * * 0` (Europe/Paris)
- **Action:** `bash scripts/auto-para-weekly-review.sh`
- **Channel:** Telegram `-1003791371950:topic:32`

### 4) Self-Improve Auto - revue hebdo (git sync)
- **Cron ID:** `b935bb8c-7eb3-46f0-8275-e11773fbf7b3`
- **Schedule:** `20 18 * * 0` (Europe/Paris)
- **Action:** `bash scripts/auto-self-improve-review.sh`
- **Channel:** Telegram `-1003791371950:topic:32`

## Règle opératoire
- Toute évolution de cron doit être mise à jour ici + commit/push GitHub.
- Rendu attendu de chaque automation: message de synthèse (Résultats + Points à retenir + commit).
- Transport recommandé pour ces crons: `delivery.mode=announce` vers le topic Telegram dédié.
