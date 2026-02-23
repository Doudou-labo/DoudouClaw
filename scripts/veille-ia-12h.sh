#!/bin/bash
# veille-ia-12h.sh - Veille IA du midi (Flash 5 min uniquement)
# Exécution : 12h00 tous les jours

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_DIR="$BASE_DIR/skills/perplexity"
VEILLE_DIR="$BASE_DIR/notes/areas/veille-ia"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)

echo "☀️ Veille IA - 12h00 - $DATE"

# Créer le répertoire du jour
mkdir -p "$VEILLE_DIR/daily-flash/$DATE"

# === FLASH 5 MIN (léger, actualités de la matinée) ===
echo ""
echo "⚡ Génération du Flash 5 min (midi)..."

# Requêtes flash légères EN FRANÇAIS
FLASH_QUERIES=(
    "Breaking news intelligence artificielle ce matin - résumé en français"
    "Annonces IA de ce matin - synthèse détaillée en français"
    "Tendances IA du matin - analyse rapide en français"
)

# Lancer les requêtes Perplexity
cd "$SKILL_DIR"
FLASH_OUTPUT=$(node scripts/search.mjs "${FLASH_QUERIES[@]}" 2>&1)

# Générer le fichier Flash
FLASH_FILE="$VEILLE_DIR/daily-flash/$DATE/12h-flash.md"

cat > "$FLASH_FILE" << EOF
# ⚡ Flash IA - $DATE - 12h00 (Midi)

**Type** : Flash rapide  
**Généré le** : $(date '+%d/%m/%Y à %H:%M')

---

## 🔍 Requêtes exécutées

$(for q in "${FLASH_QUERIES[@]}"; do echo "- $q"; done)

---

## 📰 Actualités de la Matinée

$FLASH_OUTPUT

---

*Veille automatique - Perplexity AI*
EOF

echo "✅ Flash midi sauvegardé : $FLASH_FILE"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "☀️ Veille IA 12h - $DATE - Flash" || echo "Rien à committer"
git push origin main || echo "Push impossible (vérifiez la connexion)"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 Veille 12h terminée !"
echo "Flash : daily-flash/$DATE/12h-flash.md"
echo "==================================="

# Retourner le résumé pour le cron
if [ -f "$FLASH_FILE" ]; then
    echo ""
    echo "📋 RÉSUMÉ VEILLE 12H :"
    echo "- Flash 5 min : $(wc -l < "$FLASH_FILE") lignes"
    echo "- Actualités matinée ✅"
    echo "- Fichier commité ✅"
fi
