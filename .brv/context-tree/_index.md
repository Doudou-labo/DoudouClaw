---
children_hash: d97ed48326bba16a1d42ef8dd16918bc113e4aa9d8d110b07c7e9079111d7a0e
compression_ratio: 0.9996090695856138
condensation_order: 3
covers: [memory/_index.md, projects/_index.md]
covers_token_total: 2558
summary_level: d3
token_count: 2557
type: summary
---
## memory/_index.md
---
children_hash: dc5b24d1318a3f20a21ce0a7813712a871bc7fb73b2f6603a320310cb2520948
compression_ratio: 0.9992826398852224
condensation_order: 2
covers: [context.md, history/_index.md]
covers_token_total: 1394
summary_level: d2
token_count: 1393
type: summary
---
## context.md
# Domain: memory

## Purpose
Stores historical memory logs and session data for OpenClaw.

## Scope
Included in this domain:
- Daily memory logs
- Session startup logs
- Activity summaries

Excluded from this domain:
- Active workspace files
- Configuration settings

## Usage
Reference for past activities and decisions.


## history/_index.md
---
children_hash: bf2ba9d0a2c7a11e58ac1ed1ddc9102b622f934879daab23fff71ae4f9c515bf
compression_ratio: 0.06361014118718689
condensation_order: 1
covers: [2026_02_17.md, 2026_02_18.md, 2026_02_19.md, 2026_02_20.md, 2026_02_21.md, 2026_02_21_1528.md, 2026_02_22.md, 2026_02_23.md, 2026_02_24.md, 2026_02_25.md, 2026_02_25_veille_scraping.md, 2026_02_26.md, 2026_02_26_agent_browser_skills.md, 2026_02_27.md, 2026_02_27_memory_levels.md, 2026_02_28.md, 2026_03_01.md, 2026_03_01_mcp_setup.md, 2026_03_02.md, 2026_03_02_1254.md, 2026_03_02_2153.md, 2026_03_03.md, 2026_03_04.md, 2026_03_04_1836.md, 2026_03_05.md, 2026_03_05_calendar_event.md, 2026_03_06.md, 2026_03_06_token_loop.md, 2026_03_07.md, 2026_03_08.md, 2026_03_08_2337.md, 2026_03_08_dns_config.md, 2026_03_08_session_startup.md, 2026_03_09.md, 2026_03_09_1742.md, 2026_03_09_1906.md, 2026_03_09_1931.md, 2026_03_09_1947.md, 2026_03_10_kimi_test.md, 2026_03_10_memory_gap.md, 2026_03_11_2015.md, 2026_03_11_agent_orchestration.md, 2026_03_11_heartbeat_alert.md, 2026_03_11_model_switch.md, 2026_03_12_2103.md, 2026_03_12_historique_fix.md, 2026_03_12_session_start.md, 2026_03_12_session_startup.md, 2026_03_13_1751.md, context.md, daily_memory_2026_02_21.md, daily_memory_2026_02_22.md, daily_memory_2026_02_23.md, daily_memory_2026_02_24.md, daily_memory_2026_02_25.md, daily_memory_2026_02_26.md, daily_memory_2026_02_27.md, daily_memory_2026_02_28.md, daily_memory_2026_03_01.md, daily_memory_2026_03_02.md, daily_memory_2026_03_03.md, daily_memory_2026_03_04.md, daily_memory_2026_03_05.md, daily_memory_2026_03_06.md, daily_memory_2026_03_07.md, daily_memory_2026_03_08.md, daily_memory_2026_03_09.md, daily_memory_2026_03_10.md, daily_memory_2026_03_11.md, daily_memory_2026_03_12.md, daily_memory_2026_03_13.md, history_overview.md, working_buffer.md]
covers_token_total: 13174
summary_level: d1
token_count: 838
type: summary
---
# History Structural Summary (Level d1)

This domain contains daily memory logs, session-specific archives, and system state summaries spanning from February 17, 2026, to March 13, 2026. It tracks the evolution of the OpenClaw system, project implementations, and automated maintenance routines.

## System Architecture & Infrastructure
*   **OpenClaw Updates**: Transitioned through versions v2026.3.1 to v2026.3.2. Key features include native PDF tools, extended SecretRef (64 targets), and `openclaw config validate` (`daily_memory_2026_03_01.md`, `daily_memory_2026_03_03.md`).
*   **Heartbeat Automation**: Implementation of six core "auto" functions: heal, commit, optimize, learn, alert, and cleanup (`2026_02_17.md`).
*   **MCP Integration**: Installation of `mcporter` and configuration of GitHub, SQLite (connected to CRM at `/root/.openclaw/workspace/data/crm.sqlite`), and Playwright MCPs (`2026_03_01_mcp_setup.md`, `daily_memory_2026_03_01.md`).
*   **Gateway & Connectivity**: Migration of GitHub webhooks to Discord admin logs and validation of WebSocket gateway connections (`2026_03_06_token_loop.md`, `2026_03_09_1742.md`).
*   **Model Management**: Implementation of fallback routing (e.g., switching to Claude-Sonnet-4.6 when GPT-5.4 tool calls fail) and rate limit handling on Brave search (`2026_02_26_agent_browser_skills.md`, `daily_memory_2026_03_09.md`).

## Project Deliverables
*   **Pneu-tracker**: A Next.js 15 application for tire inventory tracking. Stack: TypeScript, Tailwind, SQLite (`data/pneus.db`), Caddy proxy (`pneus.doudougen.xyz`), and systemd service (`daily_memory_2026_03_11.md`).
*   **Venus Beauté**: Project creation and deployment initiated on 2026-03-07 (`daily_memory_2026_03_07.md`).
*   **Appartement Arras**: Real estate due diligence project including checklists and risk assessment notes (`daily_memory_2026_03_05.md`).

## Memory & Data Management
*   **Memory Tiers**: Documentation of multi-level memory management and nightly Long-Term Memory (LTM) synchronization via LanceDB (`2026_02_27.md`, `daily_memory_2026_02_22.md`).
*   **Working Buffer**: A "Danger Zone Log" mechanism that activates when session context exceeds 60% to prevent information loss during compaction (`working_buffer.md`).
*   **Auto-PARA**: Standardized 3-minute "midi" and "soir" checkpoints to maintain project alignment and suggest next actions (`daily_memory_2026_02_21.md` through `daily_memory_2026_03_13.md`).

## Operational Decisions & Patterns
*   **Discord Integration**: Implementation of session labeling tools and specific workflow for sending Playwright screenshots via relative paths or `MEDIA:` syntax (`daily_memory_2026_03_02.md`, `2026_03_10_memory_gap.md`).
*   **Incident Response**: Documentation of a critical update failure where `npm install` conflicted with a running gateway, requiring manual SSH recovery (`daily_memory_2026_02_26.md`).
*   **Provider Management**: Cleanup of provider cooldowns (OpenAI-Codex, Moonshot, Gemini) due to excessive simultaneous cron jobs (`2026_03_11_heartbeat_alert.md`).

## Key References for Drill-down
*   **Overall History**: `history_overview.md` and `context.md`.
*   **Daily Details**: `daily_memory_YYYY_MM_DD.md` (Structured summaries) or `YYYY_MM_DD.md` (Raw l
[summary compaction; truncated from 1394 tokens]

## projects/_index.md
---
children_hash: c277c2120002b0e8530b0bfb5ca40cc9a1dc9f54bec7485ebf3aef9be7004178
compression_ratio: 0.9990300678952473
condensation_order: 2
covers: [openclaw/_index.md, pneu_tracker/_index.md]
covers_token_total: 1031
summary_level: d2
token_count: 1030
type: summary
---
## openclaw/_index.md
---
children_hash: 75a10603080dc84ab72d88fc934c5970f17c9c63813999e5bdd788c77b18ccf2
compression_ratio: 0.7285067873303167
condensation_order: 1
covers: [infrastructure/_index.md, maintenance/_index.md]
covers_token_total: 884
summary_level: d1
token_count: 644
type: summary
---
# OpenClaw Operations and Infrastructure Structural Summary (Level d1)

This summary integrates the core infrastructure setup and operational maintenance protocols for the OpenClaw ecosystem as of March 2026.

### 1. Environment Infrastructure & System Management
The OpenClaw environment is managed through a centralized dashboard with strict update protocols to ensure session stability.
*   **Mission Control**: The **ClawSuite Dashboard** is the primary interface, located at `/root/.openclaw/workspace/clawsuite/` and accessible via Tailscale at `http://100.89.4.88:3000`.
*   **System Versioning**: Currently operating on **v2026.3.1** (last updated 2026-03-01).
*   **Update Architecture**: Updates are strictly offloaded to the background via `systemd-run` targeting `scripts/update-openclaw.sh`. Direct execution within active sessions is prohibited to prevent service interruption.
*   *Reference: infrastructure/_index.md (covers: clawsuite_setup.md, openclaw_version_and_update.md)*

### 2. Knowledge & State Consolidation (PARA)
Knowledge integrity is maintained through a daily synchronization flow that unifies disparate state layers.
*   **Consolidation Flow**: Synchronizes `SESSION-STATE`, `MEMORY`, `journal`, and `RECENT_CONTEXT` into a standardized PARA alignment.
*   **Reporting**: Results are formatted in Markdown and transmitted to Discord channel `1472597513898033162`.
*   *Reference: maintenance/_index.md (details: memory_and_para_consolidation.md)*

### 3. Automation Framework & Scheduling
System stability and resource management are governed by the Heartbeat Framework and specific task cadences.
*   **Heartbeat Framework**: Defined in `HEARTBEAT.md` and executed via `scripts/heartbeat-auto-*.sh`. It encompasses six core automatisms: `auto-heal`, `auto-commit`, `auto-optimize`, `auto-learn`, `auto-alert`, and `auto-cleanup`.
*   **Operational Cadence**:
    *   **CRM Sync**: Every 2 hours (07:00–21:00).
    *   **Proactive Pings**: 4x daily (09:00, 12:00, 16:00, 20:00).
    *   **Routines Pro**: 2x daily.
*   *Reference: maintenance/_index.md (details: provider_cooldowns_and_crons.md)*

### 4. Context & Buffer Management
To mitigate data loss during high-token utilization, the system employs a "Working Buffer" protocol.
*   **Danger Zone Log**: Automatically activates when session context exceeds **~60% utilization**.
*   **Logging Protocol**: Captures every exchange (human input and agent summaries) continuously until session compaction is executed.
*   *Reference: maintenance/_index.md (details: working_buffer_rule.md)*

## pneu_tracker/_index.md
---
children_hash: 95b04e4567958cf596dde6349dcda94f5928b1746c2bee751058584ce351af5b
compression_ratio: 0.996078431372549
condensation_order: 1
covers: [inventory_app/_index.md]
covers_token_total: 255
summary_level: d1
token_count: 254
type: summary
---
## inventory_app/_index.md
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
*   **Functiona
[summary compaction; truncated from 2558 tokens]