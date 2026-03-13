---
title: Working Buffer Rule
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-13T18:46:45.946Z'
updatedAt: '2026-03-13T18:46:45.946Z'
---
## Raw Concept
**Task:**
Document Working Buffer (Danger Zone Log) activation rule

**Timestamp:** 2026-03-09

## Narrative
### Structure
Working buffer is an automated logging mechanism.

### Highlights
Activated when session context exceeds ~60% to log every exchange (human + agent summary) until compaction.

### Rules
Rule 1: Activate automatically when session context exceeds ~60%
Rule 2: Log every exchange until compaction
