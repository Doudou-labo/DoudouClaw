#!/usr/bin/env bash
# fsxmemory remember — stocker une mémoire typée avec template auto-rempli
# Usage: fsxmemory-remember.sh <type> "title" [--content "description"]
# Types: fact, feeling, decision, lesson, commitment, preference, relationship, project, procedural, semantic, episodic
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
TEMPLATES="/root/.openclaw/workspace/skills/fsxmemory/templates"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE=$(date +"%Y-%m-%d")

TYPE="${1:-}"
TITLE="${2:-}"
CONTENT=""

shift 2 2>/dev/null || true
while [[ $# -gt 0 ]]; do
  case $1 in
    --content) CONTENT="$2"; shift 2;;
    *) shift;;
  esac
done

if [ -z "$TYPE" ] || [ -z "$TITLE" ]; then
  echo "Usage: $0 <type> \"title\" [--content \"description\"]"
  echo "Types: fact, feeling, decision, lesson, commitment, preference, relationship, project, procedural, semantic, episodic"
  exit 1
fi

# Map type to directory and template
case "$TYPE" in
  fact|feeling|commitment|preference)
    DIR="$VAULT/inbox"
    TEMPLATE=""
    ;;
  decision)
    DIR="$VAULT/decisions"
    TEMPLATE="$TEMPLATES/decision.md"
    ;;
  lesson)
    DIR="$VAULT/lessons"
    TEMPLATE="$TEMPLATES/lesson.md"
    ;;
  relationship)
    DIR="$VAULT/people"
    TEMPLATE="$TEMPLATES/person.md"
    ;;
  project)
    DIR="$VAULT/projects"
    TEMPLATE="$TEMPLATES/project.md"
    ;;
  procedural)
    DIR="$VAULT/procedures"
    TEMPLATE="$TEMPLATES/procedure.md"
    ;;
  semantic)
    DIR="$VAULT/knowledge"
    TEMPLATE="$TEMPLATES/knowledge.md"
    ;;
  episodic)
    DIR="$VAULT/episodes"
    TEMPLATE="$TEMPLATES/episode.md"
    ;;
  *)
    DIR="$VAULT/inbox"
    TEMPLATE=""
    ;;
esac

mkdir -p "$DIR"

# Sanitize title for filename
SAFE_TITLE=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
FILENAME="$DIR/${SAFE_TITLE}.md"

# Avoid overwrite
if [ -f "$FILENAME" ]; then
  FILENAME="$DIR/${SAFE_TITLE}-$(date +%H%M%S).md"
fi

# Generate content from template or generic
if [ -n "$TEMPLATE" ] && [ -f "$TEMPLATE" ]; then
  # Replace placeholders in template
  sed -e "s/{{title}}/$TITLE/g" -e "s/{{date}}/$DATE/g" "$TEMPLATE" > "$FILENAME"
  # Append content if provided
  if [ -n "$CONTENT" ]; then
    echo "" >> "$FILENAME"
    echo "## Details" >> "$FILENAME"
    echo "$CONTENT" >> "$FILENAME"
  fi
else
  # Generic format for types without template
  cat > "$FILENAME" << EOF
---
title: "$TITLE"
date: $DATE
type: $TYPE
created: $TIMESTAMP
---

# $TITLE

$CONTENT
EOF
fi

echo "✅ Remembered [$TYPE]: $TITLE"
echo "   → $FILENAME"
