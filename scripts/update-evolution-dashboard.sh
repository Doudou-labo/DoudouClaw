#!/bin/bash
# Update evolution dashboard with latest stats
# Aggregates data from learnings + evolution-log.jsonl

set -euo pipefail

WORKSPACE="${OPENCLAW_WORKSPACE:-/root/.openclaw/workspace}"
DASHBOARD="$WORKSPACE/notes/areas/evolution-dashboard.md"
LEARNINGS_DIR="$WORKSPACE/skills/self-improving-agent/.learnings"
EVOLUTION_LOG="$WORKSPACE/skills/self-improving-agent/evolution-log.jsonl"

echo "📊 Updating evolution dashboard..."

# Ensure notes/areas exists
mkdir -p "$WORKSPACE/notes/areas"

# Temporary files
TMP_STATS=$(mktemp)
trap "rm -f $TMP_STATS" EXIT

# -------------------------------------------------------------------
# 1. Count learnings by status/category/severity
# -------------------------------------------------------------------
TOTAL_LEARNINGS=0
APPLIED=0
PENDING=0
REJECTED=0

if [ -d "$LEARNINGS_DIR" ]; then
  # Count files with YAML frontmatter
  for file in "$LEARNINGS_DIR"/*.md; do
    [ -f "$file" ] || continue
    [ "$(basename "$file")" = "TEMPLATE.md" ] && continue
    
    if grep -q "^---$" "$file" 2>/dev/null; then
      # Only count if has proper metadata (status field)
      if grep -q "^status:" "$file" 2>/dev/null; then
        TOTAL_LEARNINGS=$((TOTAL_LEARNINGS + 1))
        
        STATUS=$(grep "^status:" "$file" | head -1 | cut -d: -f2 | tr -d ' ')
        case "$STATUS" in
          applied) APPLIED=$((APPLIED + 1)) ;;
          pending) PENDING=$((PENDING + 1)) ;;
          rejected) REJECTED=$((REJECTED + 1)) ;;
        esac
      fi
    fi
  done
fi

# Count evolution events
EVOLUTION_EVENTS=0
if [ -f "$EVOLUTION_LOG" ]; then
  EVOLUTION_EVENTS=$(wc -l < "$EVOLUTION_LOG")
fi

# -------------------------------------------------------------------
# 2. Breakdown by category
# -------------------------------------------------------------------
declare -A CATEGORY_COUNTS
declare -A CATEGORY_APPLIED

for file in "$LEARNINGS_DIR"/*.md; do
  [ -f "$file" ] || continue
  [ "$(basename "$file")" = "TEMPLATE.md" ] && continue
  
  if grep -q "^---$" "$file" 2>/dev/null && grep -q "^category:" "$file" 2>/dev/null && grep -q "^status:" "$file" 2>/dev/null; then
    CATEGORY=$(grep "^category:" "$file" | head -1 | cut -d: -f2 | tr -d ' ')
    STATUS=$(grep "^status:" "$file" | head -1 | cut -d: -f2 | tr -d ' ')
    
    [ -n "$CATEGORY" ] || continue
    
    CATEGORY_COUNTS[$CATEGORY]=$((${CATEGORY_COUNTS[$CATEGORY]:-0} + 1))
    
    if [ "$STATUS" = "applied" ]; then
      CATEGORY_APPLIED[$CATEGORY]=$((${CATEGORY_APPLIED[$CATEGORY]:-0} + 1))
    fi
  fi
done

# -------------------------------------------------------------------
# 3. Timeline (learnings per month)
# -------------------------------------------------------------------
declare -A MONTHLY_COUNTS

for file in "$LEARNINGS_DIR"/*.md; do
  [ -f "$file" ] || continue
  [ "$(basename "$file")" = "TEMPLATE.md" ] && continue
  
  if grep -q "^---$" "$file" 2>/dev/null && grep -q "^date:" "$file" 2>/dev/null; then
    DATE=$(grep "^date:" "$file" | head -1 | cut -d: -f2 | tr -d ' ')
    [ -n "$DATE" ] || continue
    MONTH="${DATE:0:7}"  # YYYY-MM
    
    MONTHLY_COUNTS[$MONTH]=$((${MONTHLY_COUNTS[$MONTH]:-0} + 1))
  fi
done

# -------------------------------------------------------------------
# 4. Top learnings by impact (files with longest impact descriptions)
# -------------------------------------------------------------------
TOP_LEARNINGS=$(mktemp)

for file in "$LEARNINGS_DIR"/*.md; do
  [ -f "$file" ] || continue
  [ "$(basename "$file")" = "TEMPLATE.md" ] && continue
  
  if grep -q "^---$" "$file" 2>/dev/null && grep -q "^impact:" "$file" 2>/dev/null; then
    IMPACT=$(grep "^impact:" "$file" | head -1 | cut -d: -f2- | xargs)
    TITLE=$(grep "^# " "$file" | head -1 | sed 's/^# //' || echo "Untitled")
    [ -n "$IMPACT" ] || IMPACT="No impact documented"
    IMPACT_LEN=${#IMPACT}
    
    echo "$IMPACT_LEN|$(basename "$file")|$TITLE|$IMPACT" >> "$TOP_LEARNINGS"
  fi
done

# Sort by impact length (longer = more detailed = probably more significant)
sort -t'|' -k1 -rn "$TOP_LEARNINGS" | head -10 > "${TOP_LEARNINGS}.sorted"

# -------------------------------------------------------------------
# 5. Open loops (pending learnings)
# -------------------------------------------------------------------
OPEN_LOOPS=$(mktemp)

for file in "$LEARNINGS_DIR"/*.md; do
  [ -f "$file" ] || continue
  [ "$(basename "$file")" = "TEMPLATE.md" ] && continue
  
  if grep -q "^---$" "$file" 2>/dev/null && grep -q "^status:" "$file" 2>/dev/null; then
    STATUS=$(grep "^status:" "$file" | head -1 | cut -d: -f2 | tr -d ' ')
    
    if [ "$STATUS" = "pending" ]; then
      TITLE=$(grep "^# " "$file" | head -1 | sed 's/^# //' || echo "Untitled")
      SEVERITY=$(grep "^severity:" "$file" | head -1 | cut -d: -f2 | tr -d ' ' || echo "medium")
      DATE=$(grep "^date:" "$file" | head -1 | cut -d: -f2 | tr -d ' ' || date +%Y-%m-%d)
      
      echo "$SEVERITY|$DATE|$(basename "$file")|$TITLE" >> "$OPEN_LOOPS"
    fi
  fi
done

# Sort by severity (critical first) then date
sort -t'|' -k1,1r -k2,2 "$OPEN_LOOPS" > "${OPEN_LOOPS}.sorted"

# -------------------------------------------------------------------
# 6. Generate dashboard
# -------------------------------------------------------------------
cat > "$DASHBOARD" << EOF
# Evolution Dashboard 📈

> Consolidated view of agent evolution (learnings + events)

**Last updated:** $(date +"%Y-%m-%d %H:%M:%S %Z")

---

## 📊 Overview

| Metric | Value |
|--------|-------|
| Total learnings | $TOTAL_LEARNINGS |
| Applied | $APPLIED ($([ $TOTAL_LEARNINGS -gt 0 ] && echo "scale=1; $APPLIED * 100 / $TOTAL_LEARNINGS" | bc || echo "0")%) |
| Pending | $PENDING ($([ $TOTAL_LEARNINGS -gt 0 ] && echo "scale=1; $PENDING * 100 / $TOTAL_LEARNINGS" | bc || echo "0")%) |
| Rejected | $REJECTED |
| Evolution events logged | $EVOLUTION_EVENTS |

---

## 🏷️ Breakdown by Category

| Category | Total | Applied | Pending | Completion % |
|----------|-------|---------|---------|--------------|
EOF

for cat in "${!CATEGORY_COUNTS[@]}"; do
  TOTAL=${CATEGORY_COUNTS[$cat]}
  APPLIED_CAT=${CATEGORY_APPLIED[$cat]:-0}
  PENDING_CAT=$((TOTAL - APPLIED_CAT))
  COMPLETION=$([ $TOTAL -gt 0 ] && echo "scale=1; $APPLIED_CAT * 100 / $TOTAL" | bc || echo "0")
  
  echo "| $cat | $TOTAL | $APPLIED_CAT | $PENDING_CAT | ${COMPLETION}% |" >> "$DASHBOARD"
done

cat >> "$DASHBOARD" << EOF

---

## 📅 Timeline (Learnings per Month)

| Month | Count |
|-------|-------|
EOF

for month in $(printf '%s\n' "${!MONTHLY_COUNTS[@]}" | sort -r); do
  echo "| $month | ${MONTHLY_COUNTS[$month]} |" >> "$DASHBOARD"
done

cat >> "$DASHBOARD" << EOF

---

## 🌟 Top Learnings (by Impact)

| # | Title | Impact |
|---|-------|--------|
EOF

i=1
while IFS='|' read -r len file title impact; do
  echo "| $i | [$title]($LEARNINGS_DIR/$file) | $impact |" >> "$DASHBOARD"
  i=$((i + 1))
done < "${TOP_LEARNINGS}.sorted"

cat >> "$DASHBOARD" << EOF

---

## 🔓 Open Loops (Pending Learnings)

EOF

if [ -s "${OPEN_LOOPS}.sorted" ]; then
  cat >> "$DASHBOARD" << 'EOF'
| Severity | Date | Title | File |
|----------|------|-------|------|
EOF

  while IFS='|' read -r severity date file title; do
    ICON="⚪"
    case "$severity" in
      critical) ICON="🔴" ;;
      high) ICON="🟠" ;;
      medium) ICON="🟡" ;;
      low) ICON="🟢" ;;
    esac
    
    echo "| $ICON $severity | $date | $title | [$file]($LEARNINGS_DIR/$file) |" >> "$DASHBOARD"
  done < "${OPEN_LOOPS}.sorted"
else
  echo "✅ **No pending learnings!** All issues resolved or in progress." >> "$DASHBOARD"
fi

cat >> "$DASHBOARD" << EOF

---

## 🎯 Recommendations

EOF

if [ $PENDING -eq 0 ]; then
  echo "✅ **System stable.** No pending learnings." >> "$DASHBOARD"
elif [ $PENDING -lt 5 ]; then
  echo "🟢 **Low backlog.** $PENDING pending learning(s). Good momentum." >> "$DASHBOARD"
elif [ $PENDING -lt 15 ]; then
  echo "🟡 **Moderate backlog.** $PENDING pending learning(s). Consider prioritizing high-severity items." >> "$DASHBOARD"
else
  echo "🔴 **High backlog.** $PENDING pending learning(s). Prioritization needed:" >> "$DASHBOARD"
  echo "" >> "$DASHBOARD"
  echo "- Focus on critical/high severity items first" >> "$DASHBOARD"
  echo "- Break down complex learnings into smaller tasks" >> "$DASHBOARD"
  echo "- Consider filing GitHub issues for tracking" >> "$DASHBOARD"
fi

cat >> "$DASHBOARD" << EOF

---

## 📚 Resources

- [Evolution Log](../skills/self-improving-agent/evolution-log.jsonl) - Structured event log
- [Learnings Directory](../skills/self-improving-agent/.learnings/) - All learnings
- [Evolution Protocol](../skills/self-improving-agent/EVOLUTION-PROTOCOL.md) - How it works
- [Metadata Guide](../skills/self-improving-agent/METADATA-GUIDE.md) - Learning metadata format

---

*This dashboard is auto-generated by \`scripts/update-evolution-dashboard.sh\`*
*Run manually or schedule via cron for regular updates*
EOF

rm -f "$TOP_LEARNINGS" "${TOP_LEARNINGS}.sorted" "$OPEN_LOOPS" "${OPEN_LOOPS}.sorted"

echo "✅ Dashboard updated: $DASHBOARD"
