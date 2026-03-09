#!/usr/bin/env bash
# fsxmemory migrate — migre un vault existant vers le format fsxmemory
# Usage: fsxmemory-migrate.sh --from openclaw [--vault /path] [--dry-run] [--backup] [--rollback]
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
FROM=""
DRY_RUN=false
BACKUP=false
ROLLBACK=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --from) FROM="$2"; shift 2;;
    --vault) VAULT="$2"; shift 2;;
    --dry-run) DRY_RUN=true; shift;;
    --backup) BACKUP=true; shift;;
    --rollback) ROLLBACK=true; shift;;
    *) shift;;
  esac
done

BACKUP_DIR="$VAULT/.fsxmemory/backup-$(date +%Y%m%d-%H%M%S)"

# Rollback
if $ROLLBACK; then
  LAST_BACKUP=$(ls -dt "$VAULT/.fsxmemory/backup-"* 2>/dev/null | head -1 || true)
  if [ -z "${LAST_BACKUP:-}" ]; then
    echo "❌ No backup found to rollback"
    exit 1
  fi
  echo "🔄 Rolling back from: $LAST_BACKUP"
  if ! $DRY_RUN; then
    cp -r "$LAST_BACKUP"/* "$VAULT/"
    echo "✅ Rollback complete"
  else
    echo "[DRY RUN] Would restore from $LAST_BACKUP"
  fi
  exit 0
fi

if [ -z "$FROM" ]; then
  echo "Usage: $0 --from openclaw|obsidian|generic [--vault /path] [--dry-run] [--backup] [--rollback]"
  exit 1
fi

echo "📦 Migration from: $FROM"
echo "📍 Vault: $VAULT"
$DRY_RUN && echo "🔍 DRY RUN — no changes will be made"
echo ""

# Backup first
if $BACKUP && ! $DRY_RUN; then
  mkdir -p "$BACKUP_DIR"
  cp -r "$VAULT"/*.md "$BACKUP_DIR/" 2>/dev/null || true
  for d in decisions lessons people projects procedures knowledge episodes handoffs inbox; do
    [ -d "$VAULT/$d" ] && cp -r "$VAULT/$d" "$BACKUP_DIR/" 2>/dev/null || true
  done
  echo "💾 Backup created: $BACKUP_DIR"
fi

MIGRATED=0
SKIPPED=0

# Process all markdown files
find "$VAULT" -name "*.md" -type f | while read -r file; do
  # Skip internal dirs
  [[ "$file" == *"/.fsxmemory/"* ]] && continue
  [[ "$file" == *"/templates/"* ]] && continue
  
  BASENAME=$(basename "$file")
  
  # Check if already has YAML frontmatter
  FIRST_LINE=$(head -1 "$file" 2>/dev/null || echo "")
  if [ "$FIRST_LINE" == "---" ]; then
    echo "⏭️  Skip (already has frontmatter): $BASENAME"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  # Determine type from directory or filename
  DIR_NAME=$(basename "$(dirname "$file")")
  TYPE="note"
  case "$DIR_NAME" in
    decisions) TYPE="decision";;
    lessons) TYPE="lesson";;
    people) TYPE="relationship";;
    projects) TYPE="project";;
    procedures) TYPE="procedural";;
    knowledge) TYPE="semantic";;
    episodes) TYPE="episodic";;
    handoffs) TYPE="handoff";;
    inbox) TYPE="capture";;
    snapshots) TYPE="snapshot";;
    memory) TYPE="daily";;
  esac
  
  # Check if it's a daily note (YYYY-MM-DD.md)
  if [[ "$BASENAME" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$ ]]; then
    TYPE="daily"
  fi
  
  DATE=$(date +"%Y-%m-%d")
  TITLE="${BASENAME%.md}"
  
  FRONTMATTER="---
title: \"$TITLE\"
date: $DATE
type: $TYPE
migrated: true
source: $FROM
---
"
  
  if $DRY_RUN; then
    echo "📝 Would add frontmatter [$TYPE]: $BASENAME"
  else
    # Prepend frontmatter
    TEMP=$(mktemp)
    echo "$FRONTMATTER" > "$TEMP"
    cat "$file" >> "$TEMP"
    mv "$TEMP" "$file"
    echo "✅ Migrated [$TYPE]: $BASENAME"
  fi
  MIGRATED=$((MIGRATED + 1))
done

echo ""
echo "📊 Migration summary:"
echo "   Migrated: $MIGRATED"
echo "   Skipped: $SKIPPED"
$DRY_RUN && echo "   (dry run — no files were modified)"

# Create config file
if ! $DRY_RUN; then
  cat > "$VAULT/.fsxmemory/.fsxmemory.json" << EOF
{
  "version": "1.3.1",
  "migrated_from": "$FROM",
  "migrated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "vault_path": "$VAULT"
}
EOF
  echo "✅ Config file created: .fsxmemory/.fsxmemory.json"
fi
