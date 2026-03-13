---
title: Provider Cooldowns and Crons
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-13T18:46:33.247Z'
updatedAt: '2026-03-13T18:46:33.247Z'
---
## Raw Concept
**Task:**
Adjust provider cooldowns and cron schedules

**Changes:**
- Cleaned up provider cooldowns (openai-codex, moonshot, etc.)
- CRM Tasks sync: 30min -> 2h (7h-21h)
- Routines pro: 4x -> 2x/day
- Proactive pings: 6x -> 4x/day

**Timestamp:** 2026-02-17

## Narrative
### Structure
Managed via scripts/heartbeat-auto-*.sh and HEARTBEAT.md

### Highlights
Implemented 6 heartbeat automatisms: auto-heal, auto-commit, auto-optimize, auto-learn, auto-alert, auto-cleanup.

## Facts
- **crm_sync_frequency**: CRM Tasks sync frequency is 2 hours (7h-21h) [convention]
- **proactive_pings_schedule**: Proactive pings occur 4 times per day (9/12/16/20) [convention]
