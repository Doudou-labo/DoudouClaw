#!/bin/bash
# Create a new learning file with enriched metadata
# Usage: ./create-learning.sh "title" "category" "severity"

set -euo pipefail

TITLE="$1"
CATEGORY="${2:-bug}"
SEVERITY="${3:-medium}"

DATE=$(date +%Y-%m-%d)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="$(dirname "$0")/../.learnings/${DATE}-${SLUG}.md"

if [[ -f "$FILENAME" ]]; then
  echo "❌ File already exists: $FILENAME"
  exit 1
fi

cat > "$FILENAME" << EOF
---
date: $DATE
category: $CATEGORY
severity: $SEVERITY
status: pending
impact: TBD
related: []
evolution_event_id: null
---

# $TITLE

## Context

[Describe what happened or what was observed]

## Lesson

[What principle or insight emerged?]

## Applied Fix

[Concrete changes made - files, commands, configs]

## Impact Measured

[How did this improve things? Metrics, examples]

## Notes

[Additional observations, edge cases, future considerations]
EOF

echo "✅ Learning created: $FILENAME"
echo ""
echo "📝 Next steps:"
echo "  1. Edit the file to fill in details"
echo "  2. Update status to 'applied' when implemented"
echo "  3. Measure and document impact"
echo "  4. Log evolution event if significant (./log-evolution.sh)"
