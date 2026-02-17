# analyze-errors.sh - Automatic Error Analysis

> Scans logs and memory files for recurring error patterns, generates actionable reports

## Purpose

Automatically detect and analyze errors across:
- OpenClaw daemon logs (`/tmp/clawdbot/*.log`)
- Session logs (`~/.openclaw/sessions/*.jsonl`)
- Memory files (`memory/*.md`, `MEMORY.md`)

**Key principle:** This script **detects and reports** errors, it does NOT auto-fix them. Human review required.

## Usage

### One-time run

```bash
bash scripts/analyze-errors.sh
```

### Scheduled via cron (recommended)

Add weekly analysis:

```bash
cron add \
  --name "Error Analysis - Weekly Report" \
  --schedule "0 9 * * 1" \
  --sessionTarget isolated \
  --payload.kind agentTurn \
  --payload.message "Run error analysis: bash scripts/analyze-errors.sh, then summarize findings and recommendations" \
  --delivery.mode announce
```

## Output

Generates: `reports/error-analysis-YYYY-MM-DD.md`

Report includes:
- **Summary:** Total errors, analysis period
- **Recurring patterns:** Top 20 most frequent errors
- **Problematic tools:** Tools with highest failure rates
- **Detailed errors:** Full error log (collapsible)
- **Recommendations:** Severity-based action items
- **Next steps:** Concrete actions (create learnings, file issues, etc.)

## Severity Levels

The script automatically classifies based on error count:

| Errors | Severity | Recommendation |
|--------|----------|----------------|
| 0 | ✅ None | System stable |
| 1-9 | ✅ Low | Monitor for patterns |
| 10-49 | ⚠️ Moderate | Investigation recommended |
| 50+ | 🚨 High | Urgent investigation needed |

**Critical keywords:** segfault, core dump, out of memory → immediate flag

## Integration with Self-Improvement

When errors are found:

1. **Review the report** - understand patterns
2. **Create learnings** - document root causes
   ```bash
   ./skills/self-improving-agent/scripts/create-learning.sh \
     "Error pattern description" \
     "bug" \
     "high"
   ```
3. **Log evolution** - track the fix
   ```bash
   ./skills/self-improving-agent/scripts/log-evolution.sh \
     "bug" \
     "Context" \
     "Lesson learned" \
     "true" \
     "Impact measured"
   ```
4. **File GitHub issue** - for systemic problems
   ```bash
   # Via curl or gh CLI
   gh issue create --title "Bug: X" --body "Details"
   ```

## What It Scans

### 1. OpenClaw Logs
- `/tmp/clawdbot/*.log` (last 7 days)
- Searches for: error, fail, exception, timeout

### 2. Session Logs
- `~/.openclaw/sessions/*.jsonl` (last 7 days)
- Extracts tool errors from JSONL structure

### 3. Memory Files
- `memory/*.md`, `MEMORY.md`
- Searches for: error, échec, fail, bug, broke

## False Positives

The script may flag:
- Mentions of errors in documentation (e.g., "fixed error X")
- Error messages in learning files (intentional documentation)
- External content (emails, web scrapes mentioning errors)

**Solution:** Review the report manually, focus on patterns (high count = likely real issue).

## Customization

Edit the script to:
- Change lookback period (default: 7 days)
- Add custom error patterns
- Adjust severity thresholds
- Add tool-specific checks

## Example Workflow

```bash
# 1. Run analysis
bash scripts/analyze-errors.sh

# 2. Review report
cat reports/error-analysis-$(date +%Y-%m-%d).md

# 3. If patterns found, create learning
./skills/self-improving-agent/scripts/create-learning.sh \
  "Tool X times out on large files" \
  "bug" \
  "high"

# 4. Document fix
# Edit the learning file, apply fix, measure impact

# 5. Log evolution
./skills/self-improving-agent/scripts/log-evolution.sh \
  "bug" \
  "Tool X timeout fixed" \
  "Added retry logic + timeout config" \
  "true" \
  "0 timeouts in 50 runs post-fix"

# 6. File issue if systemic
gh issue create --title "Tool X timeout on large files" \
  --body "See learning: .learnings/2026-02-17-tool-x-timeout.md"
```

## Benefits

- **Proactive detection** - catch issues before they accumulate
- **Pattern recognition** - identify systemic problems vs one-offs
- **Prioritization** - severity-based recommendations
- **Traceability** - links to learnings, evolution log, GitHub issues
- **Continuous improvement** - weekly analysis drives steady quality gains

---

*Part of the evolution protocol inspired by GEP (without auto-mutation)*
