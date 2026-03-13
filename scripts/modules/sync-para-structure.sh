#!/bin/bash
# =============================================================================
# sync-para-structure.sh — Module DevOps PARA/GitHub Sync
# =============================================================================
# Vérifie la structure PARA, détecte les projets inactifs, fait le git sync
# Usage: ./scripts/modules/sync-para-structure.sh [--dry-run]
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$WORKSPACE_DIR/logs"
LOG_FILE="$LOG_DIR/sync-para.log"
FSXMEMORY_LOG="$LOG_DIR/fsxmemory-sync.log"
LOCK_FILE="/tmp/sync-para-structure.lock"

# Délai anti-doublon (2 heures en secondes)
ANTI_DUP_SECONDS=7200

# Seuil d'inactivité (30 jours en secondes)
INACTIVE_THRESHOLD=$((30 * 24 * 3600))

# Date actuelle
NOW=$(date +%s)
NOW_ISO=$(date -Iseconds)

# -----------------------------------------------------------------------------
# ARGUMENTS
# -----------------------------------------------------------------------------
DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "🔍 MODE DRY-RUN — Aucune modification ne sera faite"
fi

# -----------------------------------------------------------------------------
# UTILITAIRES
# -----------------------------------------------------------------------------
log() {
    local msg="$1"
    local ts
    ts=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$ts] $msg" | tee -a "$LOG_FILE"
}

ensure_dir() {
    if [[ ! -d "$1" ]]; then
        mkdir -p "$1"
    fi
}

# -----------------------------------------------------------------------------
# VERROUILLAGE (anti-conflit)
# -----------------------------------------------------------------------------
acquire_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        local pid
        pid=$(cat "$LOCK_FILE" 2>/dev/null) || true
        if kill -0 "$pid" 2>/dev/null; then
            log "⚠️  Sync déjà en cours (PID: $pid). Abandon."
            exit 1
        else
            rm -f "$LOCK_FILE"
        fi
    fi
    echo $$ > "$LOCK_FILE"
}

release_lock() {
    rm -f "$LOCK_FILE"
}

trap release_lock EXIT

# -----------------------------------------------------------------------------
# ANTI-DOUBLON (vérifie si fsxmemory sync récent)
# -----------------------------------------------------------------------------
check_recent_fsxmemory_sync() {
    local recent_sync=false
    local last_sync_ts=0
    
    if [[ -f "$FSXMEMORY_LOG" ]]; then
        # Cherche la dernière ligne avec timestamp
        local last_line
        last_line=$(tail -1 "$FSXMEMORY_LOG" 2>/dev/null | grep -E '^\[([0-9]{4}-[0-9]{2}-[0-9]{2})' || true)
        
        if [[ -n "$last_line" ]]; then
            local last_date
            last_date=$(echo "$last_line" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}' | head -1)
            if [[ -n "$last_date" ]]; then
                last_sync_ts=$(date -d "$last_date" +%s 2>/dev/null || echo 0)
                local diff=$((NOW - last_sync_ts))
                
                if [[ $diff -lt $ANTI_DUP_SECONDS ]]; then
                    recent_sync=true
                fi
            fi
        fi
    fi
    
    # Vérifie aussi le last-checkpoint.json
    local checkpoint_file="$WORKSPACE_DIR/memory/.fsxmemory/last-checkpoint.json"
    if [[ -f "$checkpoint_file" ]]; then
        local checkpoint_ts
        checkpoint_ts=$(grep -o '"timestamp": *"[^"]*"' "$checkpoint_file" 2>/dev/null | cut -d'"' -f4 | head -1)
        if [[ -n "$checkpoint_ts" ]]; then
            local checkpoint_epoch
            checkpoint_epoch=$(date -d "$checkpoint_ts" +%s 2>/dev/null || echo 0)
            local diff=$((NOW - checkpoint_epoch))
            
            if [[ $diff -lt $ANTI_DUP_SECONDS ]]; then
                recent_sync=true
            fi
        fi
    fi
    
    # Retourne seulement true/false sur stdout
    echo "$recent_sync"
}

# -----------------------------------------------------------------------------
# VÉRIFICATION STRUCTURE PARA
# -----------------------------------------------------------------------------
check_para_structure() {
    log "📁 Vérification structure PARA..."
    
    local para_dirs=("notes/projects" "notes/areas" "notes/resources" "notes/archive")
    local missing_dirs=()
    
    for dir in "${para_dirs[@]}"; do
        local full_path="$WORKSPACE_DIR/$dir"
        if [[ ! -d "$full_path" ]]; then
            missing_dirs+=("$dir")
            log "  ❌ Manquant: $dir"
        else
            local count
            count=$(find "$full_path" -maxdepth 1 -type f -name "*.md" | wc -l)
            log "  ✅ $dir: $count fichiers"
        fi
    done
    
    if [[ ${#missing_dirs[@]} -gt 0 ]]; then
        log "⚠️  Structure PARA incomplète !"
        return 1
    fi
    
    return 0
}

# -----------------------------------------------------------------------------
# EXTRACTION DE DATE DEPUIS FRONTMATTER
# -----------------------------------------------------------------------------
extract_frontmatter_date() {
    local file="$1"
    local field="$2"
    
    # Cherche dans le YAML frontmatter (entre --- et ---)
    local frontmatter
    frontmatter=$(sed -n '/^---$/,/^---$/p' "$file" 2>/dev/null | head -20)
    
    # Extrait le champ demandé (|| true pour éviter exit sur grep vide)
    echo "$frontmatter" | grep -i "^$field:" | head -1 | cut -d: -f2- | sed 's/^[[:space:]]*//' | tr -d '"' || true
}

# -----------------------------------------------------------------------------
# DÉTECTION PROJETS INACTIFS
# -----------------------------------------------------------------------------
detect_inactive_projects() {
    log "🔍 Détection des projets inactifs (>30j ou deadline dépassée)..."
    
    local projects_dir="$WORKSPACE_DIR/notes/projects"
    local total_projects=0
    
    # Reset des variables globales
    INACTIVE_PROJECTS_LIST=""
    INACTIVE_COUNT=0
    ACTIVE_COUNT=0
    
    if [[ ! -d "$projects_dir" ]]; then
        log "  ❌ Dossier projects inexistant"
        return 0
    fi
    
    # Compte total des projets
    total_projects=$(find "$projects_dir" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l)
    
    # Fichier temporaire pour stocker les résultats
    local tmpfile
    tmpfile=$(mktemp /tmp/sync-para-XXXXXX)
    
    # Liste tous les fichiers et traite
    local files
    files=$(find "$projects_dir" -maxdepth 1 -type f -name "*.md" 2>/dev/null || echo "")
    
    # shellcheck disable=SC2086
    for file in $files; do
        [[ -f "$file" ]] || continue
        local filename
        filename=$(basename "$file")
        local mtime
        mtime=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null || echo 0)
        local age=$((NOW - mtime))
        local inactive_reason=""
        
        # 1. Vérification date de modification > 30j
        if [[ $age -gt $INACTIVE_THRESHOLD ]]; then
            local days=$((age / 86400))
            inactive_reason="Dernière modif: ${days}j"
        fi
        
        # 2. Vérification deadline dans frontmatter
        local deadline
        deadline=$(extract_frontmatter_date "$file" "deadline")
        if [[ -n "$deadline" ]]; then
            local deadline_ts
            deadline_ts=$(date -d "$deadline" +%s 2>/dev/null || echo 0)
            if [[ $deadline_ts -gt 0 && $deadline_ts -lt $NOW ]]; then
                if [[ -n "$inactive_reason" ]]; then
                    inactive_reason="$inactive_reason + deadline dépassée"
                else
                    inactive_reason="Deadline dépassée: $deadline"
                fi
            fi
        fi
        
        # 3. Vérification due_date dans frontmatter
        local due_date
        due_date=$(extract_frontmatter_date "$file" "due_date")
        if [[ -n "$due_date" && -z "$inactive_reason" ]]; then
            local due_ts
            due_ts=$(date -d "$due_date" +%s 2>/dev/null || echo 0)
            if [[ $due_ts -gt 0 && $due_ts -lt $NOW ]]; then
                inactive_reason="Due date dépassée: $due_date"
            fi
        fi
        
        # 4. Vérification date dans le contenu (pattern "Dernière mise à jour:")
        if [[ -z "$inactive_reason" ]]; then
            local content_date
            content_date=$(grep -i "Dernière mise à jour" "$file" 2>/dev/null | head -1 | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1 || echo "")
            if [[ -n "$content_date" ]]; then
                local content_ts
                content_ts=$(date -d "$content_date" +%s 2>/dev/null || echo 0)
                if [[ $content_ts -gt 0 ]]; then
                    local content_age=$((NOW - content_ts))
                    if [[ $content_age -gt $INACTIVE_THRESHOLD ]]; then
                        local days=$((content_age / 86400))
                        inactive_reason="Dernière update notée: ${days}j"
                    fi
                fi
            fi
        fi
        
        if [[ -n "$inactive_reason" ]]; then
            # Utilise un délimiteur spécial pour éviter les problèmes d'espaces
            echo -e "${filename}\t${inactive_reason}" >> "$tmpfile"
        fi
    done
    
    # Compte les projets inactifs
    INACTIVE_COUNT=$(wc -l < "$tmpfile" | tr -d ' ')
    ACTIVE_COUNT=$((total_projects - INACTIVE_COUNT))
    
    # Log les projets inactifs trouvés
    if [[ $INACTIVE_COUNT -gt 0 ]]; then
        while IFS=$'\t' read -r name reason; do
            log "  ⚠️  $name — $reason"
        done < "$tmpfile"
    fi
    
    # Export pour le rapport (format: filename<TAB>reason)
    INACTIVE_PROJECTS_LIST=$(cat "$tmpfile" 2>/dev/null || echo "")
    
    log "📊 Projets actifs: $ACTIVE_COUNT | À vérifier: $INACTIVE_COUNT"
    
    log "📊 Projets actifs: $ACTIVE_COUNT | À vérifier: $INACTIVE_COUNT"
    
    # Cleanup
    rm -f "$tmpfile"
    
    return 0
}

# -----------------------------------------------------------------------------
# COMPTAGE FICHIERS MÉMOIRE
# -----------------------------------------------------------------------------
count_memory_files() {
    local memory_dirs=("memory/decisions" "memory/lessons" "memory/people" "memory/projects" "memory/procedures" "memory/knowledge" "memory/episodes" "memory/inbox")
    local total=0
    
    for dir in "${memory_dirs[@]}"; do
        local full_path="$WORKSPACE_DIR/$dir"
        if [[ -d "$full_path" ]]; then
            local count
            count=$(find "$full_path" -maxdepth 1 -type f -name "*.md" | wc -l)
            total=$((total + count))
        fi
    done
    
    # Compte aussi les fichiers .md à la racine de memory/
    local root_count
    root_count=$(find "$WORKSPACE_DIR/memory" -maxdepth 1 -type f -name "*.md" | wc -l)
    total=$((total + root_count))
    
    echo "$total"
}

# -----------------------------------------------------------------------------
# COMPTAGE FICHIERS FSXMEMORY INDEXÉS
# -----------------------------------------------------------------------------
count_fsxmemory_indexed() {
    local qmd_dir="$WORKSPACE_DIR/memory/.fsxmemory"
    local count=0
    
    if [[ -d "$qmd_dir" ]]; then
        # Compte les backups et autres fichiers de données
        count=$(find "$qmd_dir" -type f 2>/dev/null | wc -l)
    fi
    
    echo "$count"
}

# -----------------------------------------------------------------------------
# GIT OPERATIONS
# -----------------------------------------------------------------------------
git_operations() {
    log "🔄 Opérations Git..."
    
    cd "$WORKSPACE_DIR"
    
    # Vérifie si on est dans un repo git
    if [[ ! -d ".git" ]]; then
        log "  ❌ Pas un dépôt git"
        return 1
    fi
    
    # Vérifie le statut
    local has_changes=false
    
    # 1. git add
    log "  ➕ git add memory/ notes/ *.md"
    if [[ "$DRY_RUN" == false ]]; then
        git add memory/ notes/ *.md 2>/dev/null || true
        git add memory/*.md 2>/dev/null || true
    fi
    
    # 2. Vérifie s'il y a des changements à commiter
    local staged_count
    staged_count=$(git diff --cached --numstat | wc -l)
    
    if [[ $staged_count -eq 0 ]]; then
        log "  ℹ️  Aucun changement à commiter"
        export GIT_PUSH_STATUS="nothing_to_commit"
        return 0
    fi
    
    log "  📦 $staged_count fichier(s) en staging"
    
    # 3. Prépare le message de commit
    local memory_count
    memory_count=$(count_memory_files)
    local fsx_count
    fsx_count=$(count_fsxmemory_indexed)
    
    local recent_sync_note=""
    if [[ "$RECENT_FSXMEMORY_SYNC" == "true" ]]; then
        recent_sync_note="
Note: Sync fsxmemory récent détecté ( < 2h )"
    fi
    
    local commit_msg="🧠 Memory-PARA Sync — $(date '+%Y-%m-%d %H:%M')

- Consolidation: $memory_count fichiers mémoire
- PARA: $ACTIVE_COUNT projets actifs, $INACTIVE_COUNT à vérifier
- fsxmemory: $fsx_count fichiers indexés
$recent_sync_note

Auto-sync via sync-para-structure.sh"
    
    # 4. Commit
    log "  📝 git commit"
    if [[ "$DRY_RUN" == false ]]; then
        if git commit -m "$commit_msg" >> "$LOG_FILE" 2>&1; then
            log "  ✅ Commit réussi"
        else
            log "  ❌ Échec du commit"
            export GIT_PUSH_STATUS="commit_failed"
            return 1
        fi
    else
        log "  [DRY-RUN] Commit message:"
        echo "$commit_msg" | sed 's/^/    /'
    fi
    
    # 5. Push
    log "  🚀 git push origin main"
    if [[ "$DRY_RUN" == false ]]; then
        if git push origin main >> "$LOG_FILE" 2>&1; then
            log "  ✅ Push réussi"
            export GIT_PUSH_STATUS="success"
        else
            log "  ❌ Échec du push"
            export GIT_PUSH_STATUS="push_failed"
            return 1
        fi
    else
        log "  [DRY-RUN] git push skipped"
        export GIT_PUSH_STATUS="dry_run"
    fi
    
    return 0
}

# -----------------------------------------------------------------------------
# GÉNÉRATION DU RAPPORT
# -----------------------------------------------------------------------------
generate_report() {
    local report_file="$LOG_DIR/sync-para-report.json"
    
    # Génère le JSON des projets à vérifier
    local projects_json=""
    if [[ ${INACTIVE_COUNT:-0} -gt 0 ]]; then
        while IFS=$'\t' read -r name reason; do
            if [[ -n "$name" ]]; then
                [[ -n "$projects_json" ]] && projects_json="$projects_json,"
                projects_json="$projects_json{\"name\": \"$name\", \"reason\": \"$reason\"}"
            fi
        done <<< "${INACTIVE_PROJECTS_LIST:-}"
    fi
    
    cat > "$report_file" << EOF
{
  "timestamp": "$NOW_ISO",
  "dry_run": $DRY_RUN,
  "para_structure": {
    "projects": $(find "$WORKSPACE_DIR/notes/projects" -maxdepth 1 -type f -name "*.md" | wc -l),
    "areas": $(find "$WORKSPACE_DIR/notes/areas" -maxdepth 1 -type f -name "*.md" | wc -l),
    "resources": $(find "$WORKSPACE_DIR/notes/resources" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l),
    "archive": $(find "$WORKSPACE_DIR/notes/archive" -maxdepth 1 -type f -name "*.md" | wc -l)
  },
  "projects_status": {
    "active": ${ACTIVE_COUNT:-0},
    "to_review": ${INACTIVE_COUNT:-0}
  },
  "git": {
    "push_status": "$GIT_PUSH_STATUS"
  },
  "anti_duplication": {
    "recent_fsxmemory_sync": ${RECENT_FSXMEMORY_SYNC:-false}
  },
  "projects_to_review": [$projects_json]
}
EOF
    
    log "📄 Rapport JSON: $report_file"
}

# -----------------------------------------------------------------------------
# RAPPORT DISCORD (Markdown)
# -----------------------------------------------------------------------------
generate_discord_report() {
    local emoji_status="🟢"
    if [[ "$GIT_PUSH_STATUS" != "success" && "$GIT_PUSH_STATUS" != "nothing_to_commit" ]]; then
        emoji_status="🔴"
    fi
    
    local fsx_note=""
    if [[ "$RECENT_FSXMEMORY_SYNC" == "true" ]]; then
        fsx_note="\n*ℹ️ Sync fsxmemory < 2h — mentionné dans le commit*"
    fi
    
    echo "## 🧠 Memory-PARA Sync $emoji_status

**Date:** $(date '+%Y-%m-%d %H:%M')  
**Mode:** $([[ "$DRY_RUN" == true ]] && echo "Dry-run" || echo "Live")

### 📊 Statut PARA
• Projets: **$ACTIVE_COUNT** actifs | **$INACTIVE_COUNT** à vérifier
• Memory: **$(count_memory_files)** fichiers consolidés
• fsxmemory: **$(count_fsxmemory_indexed)** fichiers indexés

### 🚀 Git Push: $GIT_PUSH_STATUS
$fsx_note

### ⚠️ Projets à vérifier ($INACTIVE_COUNT)"
    
    if [[ $INACTIVE_COUNT -gt 0 ]]; then
        # Utilise le format tab-délimité
        while IFS=$'\t' read -r name reason; do
            [[ -n "$name" ]] && echo "• **$name** — $reason"
        done <<< "$INACTIVE_PROJECTS_LIST"
    else
        echo "_Aucun projet inactif détecté 👍_"
    fi
    
    echo "
---
*Auto-sync via sync-para-structure.sh*"
}

# -----------------------------------------------------------------------------
# MAIN
# -----------------------------------------------------------------------------
main() {
    log "🚀 === Démarrage sync PARA/GitHub ==="
    
    # Crée les dossiers nécessaires
    ensure_dir "$LOG_DIR"
    
    # Verrouillage
    acquire_lock
    
    # Anti-doublon (capture juste la valeur, pas les logs)
    RECENT_FSXMEMORY_SYNC=$(check_recent_fsxmemory_sync 2>/dev/null)
    export RECENT_FSXMEMORY_SYNC
    
    # Log séparé
    if [[ "$RECENT_FSXMEMORY_SYNC" == "true" ]]; then
        log "ℹ️  Sync fsxmemory récent détecté (< 2h)"
    fi
    
    # Vérification structure PARA
    if ! check_para_structure; then
        log "❌ Structure PARA invalide — arrêt"
        exit 1
    fi
    
    # Détection projets inactifs
    detect_inactive_projects
    
    # Git operations
    git_operations
    
    # Génération rapports
    generate_report
    
    # Log la fin
    log "✅ Sync terminé — Status: $GIT_PUSH_STATUS"
    
    # Écrit dans le log fsxmemory pour traçabilité
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] PARA sync completed — $GIT_PUSH_STATUS" >> "$FSXMEMORY_LOG"
    
    # Affiche le rapport Discord sur stdout
    echo ""
    echo "=== RAPPORT DISCORD ==="
    generate_discord_report
    
    return 0
}

main "$@"
