---
children_hash: 1549434eb0eb437dcf270a8893e1f856129f9231df800a01c5951233eb04a6e0
compression_ratio: 0.8312387791741472
condensation_order: 0
covers: [memory_and_para_consolidation.md, provider_cooldowns_and_crons.md, working_buffer_rule.md]
covers_token_total: 557
summary_level: d0
token_count: 463
type: summary
---
# OpenClaw Maintenance and Operational Protocols

This structural overview covers the core maintenance routines, system automation schedules, and context management rules for the OpenClaw infrastructure.

### 1. Memory and PARA Consolidation
The system follows a daily synchronization flow to maintain knowledge integrity across multiple state layers.
*   **Consolidation Flow**: Processes `SESSION-STATE`, `MEMORY`, `journal`, and `RECENT_CONTEXT` into a unified PARA alignment.
*   **Reporting**: Results are formatted in Markdown with emoji indicators and transmitted to Discord channel `1472597513898033162`.
*   **Details**: See `memory_and_para_consolidation.md`.

### 2. Provider Automation and Scheduling
System stability and resource management are handled through adjusted cooldowns and heartbeat scripts.
*   **Heartbeat Framework**: Managed via `scripts/heartbeat-auto-*.sh` and documented in `HEARTBEAT.md`. It includes six primary automatisms: `auto-heal`, `auto-commit`, `auto-optimize`, `auto-learn`, `auto-alert`, and `auto-cleanup`.
*   **Operational Schedules**:
    *   **CRM Tasks Sync**: Frequency set to every 2 hours between 07:00 and 21:00.
    *   **Proactive Pings**: Occur 4 times daily at 09:00, 12:00, 16:00, and 20:00.
    *   **Routines Pro**: Execution reduced to 2 times per day.
*   **Details**: See `provider_cooldowns_and_crons.md`.

### 3. Session Context Management (Working Buffer)
To prevent data loss during high-token sessions, an automated logging mechanism (Danger Zone Log) is utilized.
*   **Activation Trigger**: The Working Buffer activates automatically when session context utilization exceeds ~60%.
*   **Logging Protocol**: Once active, the system logs every exchange—including both human input and agent summaries—until session compaction is performed.
*   **Details**: See `working_buffer_rule.md`.