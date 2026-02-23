#!/bin/bash
# veille-ia-19h.sh - Veille IA du soir (Flash + Deep Dive)
# Exécution : 19h00 tous les jours

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_DIR="$BASE_DIR/skills/perplexity"
VEILLE_DIR="$BASE_DIR/notes/areas/veille-ia"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)
DAY_OF_WEEK=$(date +%u) # 1=Lundi, 7=Dimanche
DAY_NAME=$(date +%A)

# Déterminer le thème du jour (complement du matin)
 THEMES=(
    "tech"           # Lundi
    "produits"       # Mardi
    "regulation"     # Mercredi
    "business"       # Jeudi
    "sectoriel"      # Vendredi
    "emergent"       # Samedi
    "recap"          # Dimanche
)
THEME="${THEMES[$((DAY_OF_WEEK - 1))]}"

echo "🌅 Veille IA - 19h00 - $DATE ($DAY_NAME)"
echo "Thème du jour : $THEME"

# Créer le répertoire du jour
mkdir -p "$VEILLE_DIR/daily-flash/$DATE"
mkdir -p "$VEILLE_DIR/deep-dives/$DATE"

# === FLASH 5 MIN ===
echo ""
echo "⚡ Génération du Flash 5 min (soir)..."

# Requêtes flash - actualités de la journée
FLASH_QUERIES=("AI news today roundup" "AI daily summary" "AI trending topics today")

# Lancer les requêtes Perplexity
cd "$SKILL_DIR"
FLASH_OUTPUT=$(node scripts/search.mjs "${FLASH_QUERIES[@]}" 2>&1)

# Générer le fichier Flash
FLASH_FILE="$VEILLE_DIR/daily-flash/$DATE/19h-flash.md"

cat > "$FLASH_FILE" << EOF
# ⚡ Flash IA - $DATE - 19h00 (Soir)

**Thème du jour** : ${THEME^^}  
**Généré le** : $(date '+%d/%m/%Y à %H:%M')

---

## 🔍 Requêtes exécutées

$(for q in "${FLASH_QUERIES[@]}"; do echo "- $q"; done)

---

## 📰 Résultats de la Journée

$FLASH_OUTPUT

---

*Veille automatique - Perplexity AI*
EOF

echo "✅ Flash soir sauvegardé : $FLASH_FILE"

# === DEEP DIVE ===
echo ""
echo "🔬 Génération du Deep Dive (soir)..."

# Requêtes deep dive selon le thème (complémentaire du matin)
case $THEME in
    "tech")
        DEEP_QUERIES=("Edge AI deployment challenges 2026" "AI hardware chips comparison" "Transformer alternatives research")
        DEEP_TITLE="Infrastructure et Hardware AI"
        ;;
    "produits")
        DEEP_QUERIES=("AI automation platforms comparison 2026" "Enterprise AI integration challenges" "AI workflow automation tools")
        DEEP_TITLE="Automatisation et Intégration Enterprise"
        ;;
    "regulation")
        DEEP_QUERIES=("Algorithmic bias detection regulations" "AI transparency requirements" "AI liability legal cases 2026")
        DEEP_TITLE="Éthique et Responsabilité Algorithmique"
        ;;
    "business")
        DEEP_QUERIES=("AI unicorn valuations 2026" "AI startup failure analysis" "AI talent market trends")
        DEEP_TITLE="Écosystème Startup et Talent AI"
        ;;
    "sectoriel")
        DEEP_QUERIES=("Connected car AI features" "AI vehicle diagnostics" "Tire industry digitalization")
        DEEP_TITLE="Digitalisation Automobile et Pneumatique"
        ;;
    "emergent")
        DEEP_QUERIES=("Swarm intelligence AI applications" "Federated learning enterprise use cases" "Causal AI developments")
        DEEP_TITLE="Paradigmes AI Émergents"
        ;;
    "recap")
        DEEP_QUERIES=("AI week highlights analysis" "Key AI trends this week" "AI industry weekly review insights")
        DEEP_TITLE="Analyse Hebdomadaire Complète"
        ;;
esac

# Lancer les requêtes Deep Dive
DEEP_OUTPUT=$(node scripts/search.mjs "${DEEP_QUERIES[@]}" 2>&1)

# Générer le fichier Deep Dive
DEEP_FILE="$VEILLE_DIR/deep-dives/$DATE/19h-deep-dive-${THEME}.md"

cat > "$DEEP_FILE" << EOF
# 🔬 Deep Dive IA - $DATE - 19h00

**Thème** : $DEEP_TITLE  
**Focus** : ${THEME^^}  
**Généré le** : $(date '+%d/%m/%Y à %H:%M')

---

## 🔍 Requêtes exécutées

$(for q in "${DEEP_QUERIES[@]}"; do echo "- $q"; done)

---

## 📚 Analyse Approfondie

$DEEP_OUTPUT

---

## 💡 Points Clés à Retenir

<!-- À compléter manuellement si besoin -->

---

## 🎯 Actions / Réflexions

<!-- À compléter manuellement si besoin -->

---

*Veille automatique - Perplexity AI*
EOF

echo "✅ Deep Dive soir sauvegardé : $DEEP_FILE"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "🌆 Veille IA 19h - $DATE - $THEME" || echo "Rien à committer"
git push origin main || echo "Push impossible (vérifiez la connexion)"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 Veille 19h terminée !"
echo "Thème : $THEME"
echo "Flash : daily-flash/$DATE/19h-flash.md"
echo "Deep Dive : deep-dives/$DATE/19h-deep-dive-${THEME}.md"
echo "==================================="

# Retourner le résumé pour le cron
if [ -f "$FLASH_FILE" ] && [ -f "$DEEP_FILE" ]; then
    echo ""
    echo "📋 RÉSUMÉ VEILLE 19H :"
    echo "- Flash 5 min : $(wc -l < "$FLASH_FILE") lignes"
    echo "- Deep Dive : $(wc -l < "$DEEP_FILE") lignes"
    echo "- Thème : $THEME"
    echo "- Fichiers commités ✅"
fi
