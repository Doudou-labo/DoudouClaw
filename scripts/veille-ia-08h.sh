#!/bin/bash
# veille-ia-08h.sh - Veille IA du matin (Flash + Deep Dive)
# Exécution : 8h00 tous les jours

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SKILL_DIR="$BASE_DIR/skills/perplexity"
VEILLE_DIR="$BASE_DIR/notes/areas/veille-ia"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)
DAY_OF_WEEK=$(date +%u) # 1=Lundi, 7=Dimanche
DAY_NAME=$(date +%A)

# Déterminer le thème du jour
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

echo "🌅 Veille IA - 8h00 - $DATE ($DAY_NAME)"
echo "Thème du jour : $THEME"

# Créer le répertoire du jour
mkdir -p "$VEILLE_DIR/daily-flash/$DATE"
mkdir -p "$VEILLE_DIR/deep-dives/$DATE"

# === FLASH 5 MIN ===
echo ""
echo "⚡ Génération du Flash 5 min..."

# Requêtes flash génériques + thème du jour
case $THEME in
    "tech")
        FLASH_QUERIES=("AI news today" "New LLM releases" "AI model benchmarks" "OpenAI Anthropic Google announcements today")
        ;;
    "produits")
        FLASH_QUERIES=("New AI tools launched today" "AI productivity updates" "NoCode AI announcements" "AI agent frameworks releases")
        ;;
    "regulation")
        FLASH_QUERIES=("AI regulation news today" "EU AI Act updates" "AI copyright legal cases" "AI ethics news")
        ;;
    "business")
        FLASH_QUERIES=("AI startup funding today" "AI acquisitions news" "Big tech AI investments" "AI market news")
        ;;
    "sectoriel")
        FLASH_QUERIES=("AI automotive industry news" "Autonomous vehicles updates" "Michelin AI initiatives" "Predictive maintenance AI")
        ;;
    "emergent")
        FLASH_QUERIES=("AI breakthrough news" "AI research papers today" "Emerging AI technologies" "AI science discoveries")
        ;;
    "recap")
        FLASH_QUERIES=("AI week in review" "AI Sunday roundup" "Weekly AI highlights" "AI industry weekly summary")
        ;;
esac

# Lancer les requêtes Perplexity
cd "$SKILL_DIR"
FLASH_OUTPUT=$(node scripts/search.mjs "${FLASH_QUERIES[@]}" 2>&1)

# Générer le fichier Flash
FLASH_FILE="$VEILLE_DIR/daily-flash/$DATE/08h-flash.md"

cat > "$FLASH_FILE" << EOF
# ⚡ Flash IA - $DATE - 8h00

**Thème du jour** : ${THEME^^}  
**Généré le** : $(date '+%d/%m/%Y à %H:%M')

---

## 🔍 Requêtes exécutées

$(for q in "${FLASH_QUERIES[@]}"; do echo "- $q"; done)

---

## 📰 Résultats

$FLASH_OUTPUT

---

*Veille automatique - Perplexity AI*
EOF

echo "✅ Flash sauvegardé : $FLASH_FILE"

# === DEEP DIVE ===
echo ""
echo "🔬 Génération du Deep Dive..."

# Requêtes deep dive selon le thème
case $THEME in
    "tech")
        DEEP_QUERIES=("State of large language models 2026 comparison capabilities" "Multimodal AI models state of the art" "AI inference optimization techniques 2026")
        DEEP_TITLE="État des LLM et Multimodal AI"
        ;;
    "produits")
        DEEP_QUERIES=("Best AI agent frameworks 2026 comparison LangChain CrewAI AutoGPT" "NoCode AI tools enterprise adoption 2026" "AI copilots productivity ROI studies")
        DEEP_TITLE="Frameworks d'Agents IA et NoCode"
        ;;
    "regulation")
        DEEP_QUERIES=("EU AI Act 2026 compliance requirements detailed" "AI copyright law developments 2026" "AI governance frameworks enterprise implementation")
        DEEP_TITLE="Régulation AI Act et Gouvernance"
        ;;
    "business")
        DEEP_QUERIES=("AI startup funding trends 2026 analysis" "Big tech AI strategy comparison" "Enterprise AI adoption statistics 2026")
        DEEP_TITLE="Marché AI et Adoption Enterprise"
        ;;
    "sectoriel")
        DEEP_QUERIES=("AI in automotive industry 2026 trends analysis" "Predictive maintenance AI fleet management" "Autonomous trucking development status 2026")
        DEEP_TITLE="IA dans l'Automobile et la Logistique"
        ;;
    "emergent")
        DEEP_QUERIES=("AI reasoning capabilities 2026" "Neuromorphic computing AI applications" "Quantum machine learning progress")
        DEEP_TITLE="Technologies AI Émergentes"
        ;;
    "recap")
        DEEP_QUERIES=("AI weekly highlights analysis" "Key AI developments this week" "AI industry week in review insights")
        DEEP_TITLE="Récap Hebdomadaire et Insights"
        ;;
esac

# Lancer les requêtes Deep Dive
DEEP_OUTPUT=$(node scripts/search.mjs "${DEEP_QUERIES[@]}" 2>&1)

# Générer le fichier Deep Dive
DEEP_FILE="$VEILLE_DIR/deep-dives/$DATE/08h-deep-dive-${THEME}.md"

cat > "$DEEP_FILE" << EOF
# 🔬 Deep Dive IA - $DATE - 8h00

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

echo "✅ Deep Dive sauvegardé : $DEEP_FILE"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "🌅 Veille IA 8h - $DATE - $THEME" || echo "Rien à committer"
git push origin main || echo "Push impossible (vérifiez la connexion)"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 Veille 8h terminée !"
echo "Thème : $THEME"
echo "Flash : daily-flash/$DATE/08h-flash.md"
echo "Deep Dive : deep-dives/$DATE/08h-deep-dive-${THEME}.md"
echo "==================================="

# Retourner le résumé pour le cron
if [ -f "$FLASH_FILE" ] && [ -f "$DEEP_FILE" ]; then
    echo ""
    echo "📋 RÉSUMÉ VEILLE 8H :"
    echo "- Flash 5 min : $(wc -l < "$FLASH_FILE") lignes"
    echo "- Deep Dive : $(wc -l < "$DEEP_FILE") lignes"
    echo "- Thème : $THEME"
    echo "- Fichiers commités ✅"
fi
