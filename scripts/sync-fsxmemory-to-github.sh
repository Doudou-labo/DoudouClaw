#!/bin/bash
#
# sync-fsxmemory-to-github.sh
# Synchronise le vault fsxmemory vers GitHub (repo principal DoudouClaw)
# Usage: ./scripts/sync-fsxmemory-to-github.sh [--dry-run]
#

set -euo pipefail

# Configuration
FSXMEMORY_SOURCE="/root/.openclaw/workspace/memory"
MEMORY_REPO_DIR="/tmp/DoudouClaw-sync"
MEMORY_REPO_URL="https://github.com/Doudou-labo/DoudouClaw.git"
SYNC_DIR="${MEMORY_REPO_DIR}/memory"
DRY_RUN=false

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Parse args
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    log_warn "Mode dry-run activé - aucune modification ne sera faite"
fi

# Vérifications
if [[ ! -d "$FSXMEMORY_SOURCE" ]]; then
    log_error "Source non trouvée: $FSXMEMORY_SOURCE"
    exit 1
fi

# Clone ou pull le repo mémoire
if [[ "$DRY_RUN" == false ]]; then
    if [[ -d "$MEMORY_REPO_DIR/.git" ]]; then
        log_info "Mise à jour du repo mémoire..."
        cd "$MEMORY_REPO_DIR"
        git pull origin main 2>&1 || true
    else
        log_info "Clonage du repo mémoire..."
        rm -rf "$MEMORY_REPO_DIR"
        git clone "$MEMORY_REPO_URL" "$MEMORY_REPO_DIR" 2>&1
        cd "$MEMORY_REPO_DIR"
        git config user.name "DoudouClaw"
        git config user.email "DoudouClaw@users.noreply.github.com"
    fi
fi

# Créer le dossier de destination si besoin
if [[ "$DRY_RUN" == false ]]; then
    mkdir -p "$SYNC_DIR"
fi

# Timestamp pour le commit
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE_ISO=$(date '+%Y-%m-%d')

# Stats QMD avant sync
QMD_STATS="N/A"
if command -v qmd &> /dev/null; then
    QMD_STATS=$(qmd status 2>/dev/null | grep -E "(files indexed|Vectors:)" | tr '\n' ' ' || echo "qmd non disponible")
fi

log_info "Démarrage sync fsxmemory → DoudouClaw"
log_info "Source: $FSXMEMORY_SOURCE"
log_info "Dest: $SYNC_DIR"
log_info "Timestamp: $TIMESTAMP"
log_info "QMD Stats: $QMD_STATS"

# Rsync avec exclusions
RSYNC_OPTS="-av --delete"

# Exclusions (ne pas synchroniser)
EXCLUDES=(
    "--exclude=.fsxmemory/"           # Données internes fsxmemory
    "--exclude=.git/"                 # Git interne (si présent)
    "--exclude=*.tmp"                 # Fichiers temporaires
    "--exclude=*.bak"                 # Backups
    "--exclude=.DS_Store"             # macOS
    "--exclude=Thumbs.db"             # Windows
)

if [[ "$DRY_RUN" == true ]]; then
    RSYNC_OPTS="$RSYNC_OPTS --dry-run"
    log_warn "RSYNC dry-run:"
    rsync $RSYNC_OPTS "${EXCLUDES[@]}" "$FSXMEMORY_SOURCE/" "$SYNC_DIR/" 2>/dev/null || true
    exit 0
fi

# Sync
echo ""
log_info "Synchronisation en cours..."
rsync $RSYNC_OPTS "${EXCLUDES[@]}" "$FSXMEMORY_SOURCE/" "$SYNC_DIR/"

# Compter les changements
CHANGES=$(git -C "$MEMORY_REPO_DIR" status --porcelain "$SYNC_DIR" 2>/dev/null | wc -l)

if [[ "$CHANGES" -eq 0 ]]; then
    log_info "Aucun changement détecté. Sync terminée."
    exit 0
fi

log_info "$CHANGES fichier(s) modifié(s)"

# Git operations
cd "$MEMORY_REPO_DIR"

# Stage
git add "$SYNC_DIR"

# Commit avec message structuré
git commit -m "🔄 Sync fsxmemory vault - ${TIMESTAMP}

- Source: workspace/memory/
- Fichiers: $CHANGES changement(s)
- QMD: $QMD_STATS
- Auto-sync via sync-fsxmemory-to-github.sh

[skip ci]" || {
    log_warn "Pas de changements à commiter (peut-être déjà à jour)"
    exit 0
}

# Push
log_info "Push vers GitHub..."
git push origin main

log_info "✅ Synchronisation terminée avec succès!"
log_info "Timestamp: $TIMESTAMP"
log_info "URL: https://github.com/Doudou-labo/DoudouClaw/tree/main/memory"
