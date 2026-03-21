#!/usr/bin/env bash
# ============================================================
# Script de test — Connexion API Actual Budget
# Usage : bash scripts/test-actual-connection.sh
#
# Teste la connexion à l'API Node.js @actual-app/api
# en vérifiant que le serveur est joignable et que
# les credentials sont valides.
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}   $1"; }
log_error() { echo -e "${RED}[ERR]${NC}  $1"; }

echo ""
echo "========================================"
echo "  Test de connexion — Actual Budget API"
echo "========================================"
echo ""

# ----------------------------------------------------------
# 1. Chargement du .env
# ----------------------------------------------------------
if [ -f "$ENV_FILE" ]; then
    log_info "Chargement des variables depuis .env..."
    set -a
    source "$ENV_FILE"
    set +a
else
    log_error "Fichier .env introuvable : $ENV_FILE"
    echo "Crée le fichier .env avec les variables ACTUAL_*"
    exit 1
fi

# ----------------------------------------------------------
# 2. Vérification des variables
# ----------------------------------------------------------
ERRORS=0

if [ -z "${ACTUAL_SERVER_URL:-}" ]; then
    log_error "ACTUAL_SERVER_URL non défini dans .env"
    ERRORS=$((ERRORS + 1))
else
    log_ok "ACTUAL_SERVER_URL = $ACTUAL_SERVER_URL"
fi

if [ -z "${ACTUAL_PASSWORD:-}" ] || [ "$ACTUAL_PASSWORD" = "CHANGE_MOI" ]; then
    log_error "ACTUAL_PASSWORD non configuré (valeur temporaire ou vide)"
    ERRORS=$((ERRORS + 1))
else
    log_ok "ACTUAL_PASSWORD = [configuré]"
fi

if [ -z "${ACTUAL_SYNC_ID:-}" ] || [ "$ACTUAL_SYNC_ID" = "CHANGE_MOI_APRES_PREMIERE_CONNEXION" ]; then
    log_error "ACTUAL_SYNC_ID non configuré (valeur temporaire ou vide)"
    log_error "→ Crée d'abord un budget dans l'UI https://actual.doudougen.xyz"
    log_error "→ Récupère le SYNC_ID dans les settings du budget"
    ERRORS=$((ERRORS + 1))
else
    log_ok "ACTUAL_SYNC_ID = $ACTUAL_SYNC_ID"
fi

if [ $ERRORS -gt 0 ]; then
    echo ""
    log_error "Variables manquantes ou temporaires — impossible de tester"
    exit 1
fi

# ----------------------------------------------------------
# 3. Test HTTP du serveur
# ----------------------------------------------------------
echo ""
log_info "Test HTTP du serveur Actual Budget..."

if curl -sf "$ACTUAL_SERVER_URL" > /dev/null 2>&1; then
    log_ok "Serveur joignable sur $ACTUAL_SERVER_URL"
else
    log_error "Serveur injoignable sur $ACTUAL_SERVER_URL"
    log_info "Vérifie que Docker tourne et que le conteneur est UP :"
    echo "  docker compose ps"
    exit 1
fi

# ----------------------------------------------------------
# 4. Test Node.js API (@actual-app/api)
# ----------------------------------------------------------
echo ""
log_info "Test de l'API Node.js (@actual-app/api)..."

# Créer un fichier de test temporaire
TEST_FILE=$(mktemp)
trap "rm -f $TEST_FILE" EXIT

cat > "$TEST_FILE" << 'NODEOF'
const { connect, getBudgetMonths, getAccounts, getCategories } = require('@actual-app/api');

async function main() {
    const serverUrl = process.env.ACTUAL_SERVER_URL;
    const password  = process.env.ACTUAL_PASSWORD;
    const syncId    = process.env.ACTUAL_SYNC_ID;

    console.log('Connexion à :', serverUrl);
    console.log('Budget sync ID :', syncId);

    await connect({ url: serverUrl, password, syncId });
    console.log('✅ Connexion établie avec succès !');

    const accounts = await getAccounts();
    console.log('✅ Comptes récupérés :', accounts.length, 'compte(s)');
    if (accounts.length > 0) {
        accounts.forEach(a => console.log('  -', a.name, ':', a.balance));
    }

    const months = await getBudgetMonths();
    console.log('✅ Mois dans le budget :', months.length, 'mois');
    if (months.length > 0) {
        console.log('  Mois les plus récents :', months.slice(-3).join(', '));
    }

    const categories = await getCategories();
    console.log('✅ Catégories :', Object.keys(categories).length, 'groupes');

    console.log('\n✅✅✅ TOUT FONCTIONNE — Prêt pour DoudouClaw !');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Erreur de connexion :', err.message);
    process.exit(1);
});
NODEOF

# Lancer le test Node.js
if node "$TEST_FILE"; then
    echo ""
    log_ok "=== TEST RÉUSSI ==="
    echo ""
else
    EXIT_CODE=$?
    echo ""
    log_error "=== TEST ÉCHOUÉ ==="
    echo ""
    log_error "Causes possibles :"
    echo "  1. Le budget n'existe pas encore → crée-le dans l'UI d'abord"
    echo "  2. ACTUAL_SYNC_ID incorrect → vérifie dans les settings du budget"
    echo "  3. ACTUAL_PASSWORD incorrect → régénère-le dans les settings"
    echo ""
    log_info "Pour réinstaller : bash scripts/install-actual-budget.sh"
    exit $EXIT_CODE
fi
