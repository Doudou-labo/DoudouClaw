#!/bin/bash
#
# quick-validate-tdah.sh - Validation rapide du skill TDAH-Inbox-Zero
# 

set -euo pipefail

SKILL_DIR="/root/.openclaw/workspace/skills/tdah-inbox-zero"
SKILL_FILE="$SKILL_DIR/SKILL.md"

echo "=== Quick Validate: TDAH-Inbox-Zero ==="
echo

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

check_error() {
    echo -e "${RED}❌ ERROR${NC}: $1"
    ((ERRORS++)) || true
}

check_warning() {
    echo -e "${YELLOW}⚠️ WARNING${NC}: $1"
    ((WARNINGS++)) || true
}

check_ok() {
    echo -e "${GREEN}✅ OK${NC}: $1"
}

check_info() {
    echo -e "${BLUE}ℹ️ INFO${NC}: $1"
}

# 1. Check file exists
if [[ ! -f "$SKILL_FILE" ]]; then
    check_error "SKILL.md not found at $SKILL_FILE"
    exit 1
fi
check_ok "SKILL.md exists"

# 2. Check YAML frontmatter
if head -1 "$SKILL_FILE" | grep -q '^---$'; then
    check_ok "YAML frontmatter start found"
else
    check_error "Missing YAML frontmatter start (---)"
fi

if head -10 "$SKILL_FILE" | grep -q '^name:'; then
    check_ok "'name' field found in frontmatter"
    NAME_VALUE=$(head -10 "$SKILL_FILE" | grep '^name:' | sed 's/name: //')
    check_info "Skill name: $NAME_VALUE"
else
    check_error "Missing 'name' field in YAML frontmatter"
fi

if head -10 "$SKILL_FILE" | grep -q '^description:'; then
    check_ok "'description' field found in frontmatter"
    DESC_LENGTH=$(head -10 "$SKILL_FILE" | grep '^description:' | sed 's/description: //' | wc -c)
    check_info "Description length: $DESC_LENGTH chars"
else
    check_error "Missing 'description' field in YAML frontmatter"
fi

# 3. Check frontmatter is properly closed
if head -20 "$SKILL_FILE" | grep -q '^---$'; then
    # Check if there's a second --- (end of frontmatter)
    FRONTMATTER_END=$(head -20 "$SKILL_FILE" | grep -n '^---$' | tail -1 | cut -d: -f1)
    if [[ "$FRONTMATTER_END" -gt 1 ]]; then
        check_ok "YAML frontmatter properly closed (line $FRONTMATTER_END)"
    else
        check_error "YAML frontmatter not properly closed (second --- missing)"
    fi
else
    check_error "YAML frontmatter end not found"
fi

# 4. Check skill structure
if [[ -d "$SKILL_DIR/scripts" ]]; then
    check_ok "scripts/ directory exists"
    SCRIPT_COUNT=$(ls -1 "$SKILL_DIR/scripts/" | wc -l)
    check_info "Scripts: $SCRIPT_COUNT files"
else
    check_warning "scripts/ directory missing"
fi

if [[ -d "$SKILL_DIR/config" ]]; then
    check_ok "config/ directory exists"
else
    check_warning "config/ directory missing"
fi

# 5. Check content length
LINE_COUNT=$(wc -l < "$SKILL_FILE")
if [[ $LINE_COUNT -gt 500 ]]; then
    check_warning "SKILL.md is $LINE_COUNT lines (recommend <500 for performance)"
else
    check_ok "SKILL.md length: $LINE_COUNT lines"
fi

# 6. Check for references/ directory (optional but recommended)
if [[ -d "$SKILL_DIR/references" ]]; then
    check_ok "references/ directory exists"
else
    check_warning "references/ directory missing (optional, consider for large content)"
fi

# 7. Check description quality
if head -20 "$SKILL_FILE" | grep -q '^description:'; then
    DESCRIPTION=$(head -20 "$SKILL_FILE" | grep '^description:' | sed 's/description: //')
    if [[ ${#DESCRIPTION} -lt 50 ]]; then
        check_warning "Description is short (${#DESCRIPTION} chars). Consider being more specific."
    elif [[ ${#DESCRIPTION} -gt 300 ]]; then
        check_ok "Description is detailed: ${#DESCRIPTION} chars"
    else
        check_ok "Description length: ${#DESCRIPTION} chars"
    fi
fi

# 8. Check for key sections
if grep -q "## 🎯 Objectif" "$SKILL_FILE"; then
    check_ok "Section 'Objectif' found"
fi

if grep -q "## 📊 Matrice de Priorisation" "$SKILL_FILE"; then
    check_ok "Section 'Matrice de Priorisation' found"
fi

# Summary
echo
echo "=== Summary ==="
if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}✅ Validation passed${NC} ($WARNINGS warnings)"
    echo "Skill is ready for use!"
    exit 0
else
    echo -e "${RED}❌ Validation failed${NC}: $ERRORS errors, $WARNINGS warnings"
    exit 1
fi
