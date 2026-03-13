---
title: Physical Inventory App Specs
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-13T18:46:33.249Z'
updatedAt: '2026-03-13T18:46:33.249Z'
---
## Raw Concept
**Task:**
Create separate app for physical tire inventory

**Flow:**
Import XLSX -> List view -> Search/Add via referentiel -> Physical count entry -> Export results

**Timestamp:** 2026-03-12

## Narrative
### Structure
Separate app from pneu-tracker with strict XLSX column order conservation.

### Highlights
Uses ~12.5k tires referentiel. Features: status (conforme/non conforme/reste à contrôler), auto-diff calculation, reset line.

### Rules
Rule 1: Conserve strict order of import from XLSX
Rule 2: Statuses: conforme, non conforme, reste à contrôler
