#!/usr/bin/env bash
# fsxmemory doctor — vérification de santé du vault
# Usage: fsxmemory-doctor.sh [--vault /path]
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
[[ "${1:-}" == "--vault" ]] && VAULT="${2:-$VAULT}"

echo "🩺 VAULT HEALTH CHECK"
echo "====================="
echo "📍 Vault: $VAULT"
echo ""

ISSUES=0
WARNINGS=0

# Check vault exists
if [ ! -d "$VAULT" ]; then
  echo "❌ CRITICAL: Vault directory does not exist!"
  exit 1
fi

# Check internal state dir
if [ ! -d "$VAULT/.fsxmemory" ]; then
  echo "⚠️  WARNING: .fsxmemory/ directory missing — run checkpoint to create"
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ .fsxmemory/ state directory exists"
fi

# Check required directories
for dir in decisions lessons people projects procedures knowledge episodes handoffs inbox; do
  if [ -d "$VAULT/$dir" ]; then
    echo "✅ $dir/"
  else
    echo "⚠️  WARNING: $dir/ missing — creating..."
    mkdir -p "$VAULT/$dir"
    WARNINGS=$((WARNINGS + 1))
  fi
done

echo ""

# Check for files without frontmatter
echo "📝 Checking YAML frontmatter..."
NO_FM=0
find "$VAULT" -name "*.md" -type f | while read -r file; do
  [[ "$file" == *"/.fsxmemory/"* ]] && continue
  [[ "$file" == *"/templates/"* ]] && continue
  FIRST_LINE=$(head -1 "$file" 2>/dev/null || echo "")
  if [ "$FIRST_LINE" != "---" ]; then
    echo "   ⚠️  No frontmatter: $(basename "$file")"
    NO_FM=$((NO_FM + 1))
  fi
done
[ "$NO_FM" -eq 0 ] 2>/dev/null && echo "   ✅ All files have frontmatter" || true

echo ""

# Check for orphaned files (not in any category dir)
echo "📁 Checking file organization..."
ORPHANS=$(find "$VAULT" -maxdepth 1 -name "*.md" ! -name "????-??-??.md" -type f 2>/dev/null | wc -l)
if [ "$ORPHANS" -gt 0 ]; then
  echo "   ⚠️  $ORPHANS file(s) at vault root (not in category dirs):"
  find "$VAULT" -maxdepth 1 -name "*.md" ! -name "????-??-??.md" -type f -exec basename {} \; | head -10 | sed 's/^/      /'
  WARNINGS=$((WARNINGS + ORPHANS))
else
  echo "   ✅ All files properly categorized"
fi

echo ""

# Check checkpoint age
if [ -f "$VAULT/.fsxmemory/last-checkpoint.json" ]; then
  CP_TIME=$(python3 -c "import json; print(json.load(open('$VAULT/.fsxmemory/last-checkpoint.json')).get('timestamp',''))" 2>/dev/null || echo "")
  if [ -n "$CP_TIME" ]; then
    echo "📌 Last checkpoint: $CP_TIME"
    # Check if older than 1 hour
    CP_EPOCH=$(date -d "$CP_TIME" +%s 2>/dev/null || echo 0)
    NOW_EPOCH=$(date +%s)
    AGE_MIN=$(( (NOW_EPOCH - CP_EPOCH) / 60 ))
    if [ "$AGE_MIN" -gt 60 ]; then
      echo "   ⚠️  Checkpoint is ${AGE_MIN}min old (>60min) — consider running a new one"
      WARNINGS=$((WARNINGS + 1))
    else
      echo "   ✅ Checkpoint is fresh (${AGE_MIN}min old)"
    fi
  fi
else
  echo "⚠️  No checkpoint found"
  WARNINGS=$((WARNINGS + 1))
fi

# Check dirty death flag
if [ -f "$VAULT/.fsxmemory/dirty-death.flag" ]; then
  echo "💀 DIRTY DEATH FLAG detected! Last session may have died unexpectedly."
  echo "   Run: fsxmemory-recover.sh --clear"
  ISSUES=$((ISSUES + 1))
fi

echo ""

# Disk space
SIZE=$(du -sh "$VAULT" 2>/dev/null | cut -f1)
echo "💾 Vault size: $SIZE"

echo ""
echo "================================="
if [ "$ISSUES" -gt 0 ]; then
  echo "🔴 $ISSUES issue(s) found"
elif [ "$WARNINGS" -gt 0 ]; then
  echo "🟡 $WARNINGS warning(s) — vault is functional"
else
  echo "🟢 Vault is healthy!"
fi
