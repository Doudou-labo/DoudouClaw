#!/usr/bin/env bash
#
# Template de script OpenClaw avec timezone Paris
# Usage: Copier et adapter pour nouveau script
#

set -euo pipefail

# ============================================
# Configuration
# ============================================
SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"

# Charger la config timezone (Europe/Paris)
source "$SCRIPT_DIR/../config/timezone.conf"

# Maintenant toutes les commandes `date` utilisent Europe/Paris
RUN_ID=$(date +%Y%m%d-%H%M%S)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE_HUMAN=$(date '+%d/%m/%Y %H:%M')

echo "Heure actuelle Paris: $DATE_HUMAN"
echo "Heure UTC: $(TZ=UTC date '+%H:%M:%S')"
