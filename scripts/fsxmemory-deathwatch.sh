#!/usr/bin/env bash
# fsxmemory death-watch — écrit le dirty-death flag au démarrage, supprime au handoff propre
# Destiné à être appelé au début de chaque session pour détecter les morts non propres
# Usage: fsxmemory-deathwatch.sh start|clear
set -euo pipefail

VAULT="${FSXMEMORY_PATH:-/root/.openclaw/workspace/memory}"
STATE_DIR="$VAULT/.fsxmemory"
DEATH_FLAG="$STATE_DIR/dirty-death.flag"
mkdir -p "$STATE_DIR"

ACTION="${1:-start}"

case "$ACTION" in
  start)
    # Si le flag existe déjà → la session précédente est morte
    if [ -f "$DEATH_FLAG" ]; then
      PREV_TIME=$(cat "$DEATH_FLAG")
      echo "💀 PREVIOUS SESSION DIED at $PREV_TIME"
      echo "   Running recover..."
      bash "$(dirname "$0")/fsxmemory-recover.sh"
    fi
    # Écrire le flag pour cette session
    date -u +"%Y-%m-%dT%H:%M:%SZ" > "$DEATH_FLAG"
    echo "🔒 Death watch started — flag set"
    echo "   (will be cleared on clean handoff/shutdown)"
    ;;
  clear)
    rm -f "$DEATH_FLAG"
    echo "✅ Death flag cleared — clean shutdown"
    ;;
  *)
    echo "Usage: $0 start|clear"
    exit 1
    ;;
esac
