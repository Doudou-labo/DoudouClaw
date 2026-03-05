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

## 2026-03-05 — Consolidation mémoire quotidienne + PARA

### 5) Memory Daily Consolidation + PARA
- **Cron ID:** `796b145b-d198-4ba2-a6ca-2dd893bf65d8`
- **Schedule:** `50 21 * * *` (Europe/Paris)
- **Session target:** `isolated`
- **Action:** agentTurn de consolidation N1/N2/LTM + MAJ `memory/YYYY-MM-DD.md`, `SESSION-STATE.md`, `RECENT_CONTEXT.md`, `MEMORY.md` (si durable), mise à jour PARA (`notes/*` + `open-loops`) et commit/push.
- **Delivery:** announce Discord `1472597513898033162` (retour après chaque exécution, best-effort)

### 6) Memory Auto-tags Daily
- **Cron ID:** `5aa92d2d-30ed-4903-9729-8eddfd01bf52`
- **Schedule:** `56 21 * * *` (Europe/Paris)
- **Action:** `bash scripts/memory-auto-tags.sh` + commit/push si changement
- **Delivery:** none

### 7) Second Brain Dashboard Reindex
- **Cron ID:** `4faea737-c940-4de3-86f6-e7d926b32bcc`
- **Schedule:** `57 21 * * *` (Europe/Paris)
- **Action:** `./scripts/build-second-brain-dashboard.py` + commit/push si changement
- **Delivery:** announce Discord `1472597513898033162` (best-effort)

### 8) Memory Quality Score Hebdo
- **Cron ID:** `9f452cd4-db73-47e4-bc3f-75a68266bc34`
- **Schedule:** `35 19 * * 0` (Europe/Paris)
- **Action:** `bash scripts/memory-quality-score.sh`
- **Delivery:** announce Discord `1472597513898033162` (best-effort)

## Règle opératoire
- Toute évolution de cron doit être mise à jour ici + commit/push GitHub.
- Rendu attendu de chaque automation: message de synthèse (Résultats + Points à retenir + commit).
- Transport recommandé pour ces crons: `delivery.mode=announce` vers le topic Telegram dédié.
