---
children_hash: 8d1671846adcc875d34ff654b753530a2701ae9dac0fd0a957e69a205519e2cf
compression_ratio: 0.9947368421052631
condensation_order: 0
covers: [physical_inventory_app_specs.md]
covers_token_total: 190
summary_level: d0
token_count: 189
type: summary
---
# Physical Inventory App Structural Overview

### Core Specification
Standalone application for physical tire inventory management (Ref: `physical_inventory_app_specs.md`).

### Architecture & Data Flow
*   **Workflow**: XLSX Import → Referentiel Search/Add → Physical Count Entry → Results Export.
*   **Referentiel**: Integrated dataset of ~12.5k tire records.
*   **Data Integrity**: Strict conservation of original XLSX column ordering (Rule 1).

### Key Features & Logic
*   **Inventory Statuses**: `conforme`, `non conforme`, `reste à contrôler` (Rule 2).
*   **Functionality**: Automated difference calculation, line reset capabilities, and list-based search.
*   **Integration**: Operates as a separate entity from the primary `pneu-tracker` system.