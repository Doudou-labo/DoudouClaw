#!/bin/bash
# Automatic error analysis script
# Scans logs and memory files for recurring error patterns
# Generates markdown report (no auto-fix)

set -euo pipefail

WORKSPACE="${OPENCLAW_WORKSPACE:-/root/.openclaw/workspace}"
REPORT_DIR="$WORKSPACE/reports"
DATE=$(date +%Y-%m-%d)
REPORT_FILE="$REPORT_DIR/error-analysis-$DATE.md"

mkdir -p "$REPORT_DIR"

echo "🔍 Starting error analysis..."

# Temporary files for analysis
TMP_ERRORS=$(mktemp)
TMP_TOOLS=$(mktemp)
TMP_PATTERNS=$(mktemp)

trap "rm -f $TMP_ERRORS $TMP_TOOLS $TMP_PATTERNS" EXIT

# -------------------------------------------------------------------
# 1. Scan OpenClaw logs
# -------------------------------------------------------------------
echo "📋 Scanning OpenClaw logs..."

if [ -d "/tmp/clawdbot" ]; then
  find /tmp/clawdbot -name "*.log" -mtime -7 -type f 2>/dev/null | while read log; do
    grep -iE "error|fail|exception|timeout" "$log" 2>/dev/null || true
  done > "$TMP_ERRORS"
fi

# -------------------------------------------------------------------
# 2. Scan session logs (last 7 days)
# -------------------------------------------------------------------
echo "📂 Scanning session logs..."

if [ -d "$HOME/.openclaw/sessions" ]; then
  find "$HOME/.openclaw/sessions" -name "*.jsonl" -mtime -7 -type f 2>/dev/null | while read session; do
    jq -r 'select(.role == "tool" and .error != null) | .error' "$session" 2>/dev/null || true
  done >> "$TMP_ERRORS"
fi

# -------------------------------------------------------------------
# 3. Scan memory files for error mentions
# -------------------------------------------------------------------
echo "🧠 Scanning memory files..."

if [ -d "$WORKSPACE/memory" ]; then
  grep -riE "error|échec|fail|bug|broke" "$WORKSPACE/memory" 2>/dev/null >> "$TMP_ERRORS" || true
fi

# -------------------------------------------------------------------
# 4. Analyze error patterns
# -------------------------------------------------------------------
echo "📊 Analyzing error patterns..."

# Count occurrences
sort "$TMP_ERRORS" | uniq -c | sort -rn > "$TMP_PATTERNS"

# Extract tool failures (from tool calls)
if [ -d "$HOME/.openclaw/sessions" ]; then
  find "$HOME/.openclaw/sessions" -name "*.jsonl" -mtime -7 -type f 2>/dev/null | while read session; do
    jq -r 'select(.role == "tool" and .error != null) | .name' "$session" 2>/dev/null || true
  done | sort | uniq -c | sort -rn > "$TMP_TOOLS"
fi

# -------------------------------------------------------------------
# 5. Generate report
# -------------------------------------------------------------------
echo "📝 Generating report..."

cat > "$REPORT_FILE" << EOF
# Error Analysis Report - $DATE

> Automatic analysis of logs and memory files (last 7 days)

## Summary

- **Analysis date:** $DATE
- **Logs scanned:** OpenClaw logs, session logs, memory files
- **Period:** Last 7 days

---

## Recurring Error Patterns

Top 20 most frequent error messages/patterns:

\`\`\`
$(head -20 "$TMP_PATTERNS" || echo "No errors detected")
\`\`\`

---

## Problematic Tools

Tools with highest failure rates:

\`\`\`
$(cat "$TMP_TOOLS" || echo "No tool failures detected")
\`\`\`

---

## Detailed Errors

<details>
<summary>Full error log (click to expand)</summary>

\`\`\`
$(head -100 "$TMP_ERRORS" || echo "No errors")
\`\`\`

</details>

---

## Recommendations

EOF

# Generate recommendations based on patterns
TOTAL_ERRORS=$(wc -l < "$TMP_ERRORS")

if [ "$TOTAL_ERRORS" -eq 0 ]; then
  echo "✅ **No errors detected in the last 7 days.** System appears stable." >> "$REPORT_FILE"
elif [ "$TOTAL_ERRORS" -lt 10 ]; then
  echo "✅ **Low error rate** ($TOTAL_ERRORS total). Monitor for patterns." >> "$REPORT_FILE"
elif [ "$TOTAL_ERRORS" -lt 50 ]; then
  echo "⚠️ **Moderate error rate** ($TOTAL_ERRORS total). Investigation recommended:" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "- Review top patterns above" >> "$REPORT_FILE"
  echo "- Check if specific tools are failing consistently" >> "$REPORT_FILE"
  echo "- Consider creating learnings for recurring issues" >> "$REPORT_FILE"
else
  echo "🚨 **High error rate** ($TOTAL_ERRORS total). Urgent investigation needed:" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "- Identify root cause of top 3 patterns" >> "$REPORT_FILE"
  echo "- Create learnings for each major issue" >> "$REPORT_FILE"
  echo "- Consider filing GitHub issues for systemic problems" >> "$REPORT_FILE"
  echo "- Review recent changes that may have introduced regressions" >> "$REPORT_FILE"
fi

# Check for critical keywords
if grep -iq "segfault\|core dump\|out of memory" "$TMP_ERRORS"; then
  echo "" >> "$REPORT_FILE"
  echo "🔴 **CRITICAL:** Detected crash-level errors (segfault/OOM/core dump). Immediate attention required." >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

---

## Next Steps

1. Review this report
2. For recurring patterns:
   - Create a learning file: \`./skills/self-improving-agent/scripts/create-learning.sh "Error pattern X" "bug" "high"\`
   - Document root cause and fix
   - Log evolution event if significant
3. For tool failures:
   - Check tool configuration
   - Verify dependencies
   - Consider filing upstream bug reports
4. Schedule follow-up analysis next week to measure improvement

---

*This report was auto-generated by \`scripts/analyze-errors.sh\`*
EOF

echo "✅ Report generated: $REPORT_FILE"
echo ""
echo "📊 Summary:"
echo "  - Total errors: $TOTAL_ERRORS"
echo "  - Unique patterns: $(wc -l < "$TMP_PATTERNS")"
echo "  - Problematic tools: $(wc -l < "$TMP_TOOLS")"
echo ""
echo "📄 View report: cat $REPORT_FILE"
