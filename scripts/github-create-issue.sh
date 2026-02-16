#!/bin/bash
# Helper script to create GitHub issues via API
# Usage: bash scripts/github-create-issue.sh "Issue title" "Issue body" [label1,label2]

TOKEN=$(cat /root/.openclaw/workspace/.credentials/github-token.txt)
REPO="Hadoudoux/doudoubot-workspace"

TITLE="$1"
BODY="$2"
LABELS="${3:-}"

if [ -z "$TITLE" ]; then
  echo "Usage: $0 \"Issue title\" \"Issue body\" [label1,label2]"
  exit 1
fi

# Build JSON payload
JSON=$(jq -n \
  --arg title "$TITLE" \
  --arg body "$BODY" \
  '{title: $title, body: $body}')

# Add labels if provided
if [ -n "$LABELS" ]; then
  JSON=$(echo "$JSON" | jq --arg labels "$LABELS" '. + {labels: ($labels | split(","))}')
fi

# Create issue
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON" \
  "https://api.github.com/repos/$REPO/issues")

# Parse response
ISSUE_NUMBER=$(echo "$RESPONSE" | jq -r '.number')
ISSUE_URL=$(echo "$RESPONSE" | jq -r '.html_url')

if [ "$ISSUE_NUMBER" != "null" ]; then
  echo "✅ Issue #$ISSUE_NUMBER created: $ISSUE_URL"
else
  echo "❌ Error creating issue:"
  echo "$RESPONSE" | jq -r '.message'
  exit 1
fi
