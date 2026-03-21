#!/usr/bin/env bash
# ============================================================
# Script d'installation one-shot — Actual Budget
# Usage : bash scripts/install-actual-budget.sh
#
# Ce script :
#   1. Vérifie les prérequis (Docker, git)
#   2. Crée le fichier .env à partir d'un template
#   3. Démarre le conteneur Docker
#   4. Configure Caddy
#   5. Installe le skill ClawHub
#   6. Teste la connexion
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}   $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERR]${NC}  $1"; }

echo ""
echo "========================================"
echo "  Installation Actual Budget — DoudouClaw"
echo "========================================"
echo ""

# ----------------------------------------------------------
# 1. Prérequis
# ----------------------------------------------------------
log_info "Vérification des prérequis..."

if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé. Installe Docker d'abord."
    exit 1
fi
log_ok "Docker présent"

if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "docker compose n'est pas disponible."
    exit 1
fi
log_ok "docker compose présent"

# ----------------------------------------------------------
# 2. Fichier .env
# ----------------------------------------------------------
log_info "Vérification du fichier .env..."

if [ -f "$ENV_FILE" ]; then
    log_ok "Fichier .env existant trouvé"
else
    log_warn "Fichier .env non trouvé. Création depuis .env.example..."

    if [ -f "$PROJECT_DIR/.env.example" ]; then
        cp "$PROJECT_DIR/.env.example" "$ENV_FILE"
        log_info "Template copié vers .env"
        echo ""
        log_warn "⚠️  Ouvre $ENV_FILE et renseigne tes valeurs !"
        echo ""
        log_info "Valeurs à configurer :"
        echo "  - ACTUAL_PASSWORD      : mot de passe du budget Actual"
        echo "  - ACTUAL_SYNC_ID       : ID du budget (à récupérer après première connexion)"
        echo ""
        read -p "Appuie sur Entrée quand tu as rempli le .env... "
    else
        # Création minimale
        cat > "$ENV_FILE" << 'EOF'
# Variables Actual Budget
# Complète ces valeurs avant de lancer le script
ACTUAL_SERVER_URL=http://localhost:5006
ACTUAL_PASSWORD=CHANGE_MOI
ACTUAL_SYNC_ID=CHANGE_MOI_APRES_PREMIERE_CONNEXION
EOF
        log_info "Fichier .env créé (valeurs temporaires)"
    fi
fi

# ----------------------------------------------------------
# 3. Démarrer Docker Compose
# ----------------------------------------------------------
log_info "Démarrage du conteneur Actual Budget..."
cd "$PROJECT_DIR"

docker compose up -d --pull always

sleep 5

# Health check
log_info "Vérification du health check..."
if docker compose exec -T actual wget --spider -q http://localhost:5006 2>/dev/null; then
    log_ok "Conteneur Actual Budget opérationnel"
else
    log_warn "Le conteneur met du temps à démarrer, on continue..."
fi

# ----------------------------------------------------------
# 4. Afficher l'état
# ----------------------------------------------------------
echo ""
echo "========================================"
echo "  État des services"
echo "========================================"
docker compose ps

echo ""
log_info "Interface web : http://localhost:5006"
log_info "URL accessible : https://actual.doudougen.xyz (après config Caddy)"
echo ""

# ----------------------------------------------------------
# 5. Instructions Caddy
# ----------------------------------------------------------
echo "========================================"
echo "  Configuration Caddy"
echo "========================================"
echo ""
log_info "Ajoute le bloc suivant dans /etc/caddy/Caddyfile :"
echo ""
cat "$PROJECT_DIR/caddy-actual.conf"
echo ""
log_info "Puis recharge Caddy : sudo caddy reload --config /etc/caddy/Caddyfile"
echo ""

# ----------------------------------------------------------
# 6. Skill ClawHub
# ----------------------------------------------------------
if command -v clawhub &> /dev/null; then
    log_info "Installation du skill ClawHub..."
    if clawhub install thisisjeron/actual-budget 2>/dev/null; then
        log_ok "Skill thisisjeron/actual-budget installé"
    else
        log_warn "Échec de l'installation du skill. Installe-le manuellement :"
        echo "  clawhub install thisisjeron/actual-budget"
    fi
else
    log_warn "clawhub non trouvé. Installe-le d'abord ou installe le skill manuellement."
fi

# ----------------------------------------------------------
# 7. Test de connexion
# ----------------------------------------------------------
echo ""
log_info "Lancement du test de connexion..."
if bash "$SCRIPT_DIR/test-actual-connection.sh"; then
    log_ok "Connexion API fonctionnelle !"
else
    log_warn "Test non concluant. Causes possibles :"
    echo "  - Le SYNC_ID n'est pas encore configuré dans .env"
    echo "  - Le mot de passe est incorrect"
    echo "  - Le budget n'a pas encore été créé dans l'UI"
fi

# ----------------------------------------------------------
# 8. Checklist finale
# ----------------------------------------------------------
echo ""
echo "========================================"
echo "  ✅ Installation terminée — Checklist"
echo "========================================"
echo ""
echo "  [ ] Ouvre https://actual.doudougen.xyz dans le navigateur"
echo "  [ ] Crée un budget (ou importe un fichier)"
echo "  [ ] Récupère le SYNC_ID dans les settings du budget"
echo "  [ ] Mets à jour ACTUAL_SYNC_ID dans .env"
echo "  [ ] Redémarre le gateway OpenClaw après mise à jour des variables d'env"
echo "  [ ] Teste : 'Quel est mon solde actuel ?' dans DoudouClaw"
echo ""
echo "========================================"
echo ""
