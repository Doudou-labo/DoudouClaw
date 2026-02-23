#!/bin/bash
# veille-ia-19h.sh - Veille IA du soir (Flash + Deep Dive) - AVEC SYNTHÈSE GEMINI
# Exécution : 19h00 tous les jours

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_DIR="$BASE_DIR/skills/perplexity"
VEILLE_DIR="$BASE_DIR/notes/areas/veille-ia"
DATE=$(date +%Y-%m-%d)
DAY_OF_WEEK=$(date +%u)
DAY_NAME=$(date +%A)
DATE_FR=$(date '+%d/%m/%Y à %H:%M')

# Déterminer le thème du jour
THEMES=("tech" "produits" "regulation" "business" "sectoriel" "emergent" "recap")
THEME="${THEMES[$((DAY_OF_WEEK - 1))]}"

echo "🌅 Veille IA - 19h00 - $DATE ($DAY_NAME)"
echo "Thème du jour : $THEME"

mkdir -p "$VEILLE_DIR/daily-flash/$DATE"
mkdir -p "$VEILLE_DIR/deep-dives/$DATE"

# === FLASH 5 MIN ===
echo ""
echo "⚡ Génération du Flash 5 min (soir)..."

FLASH_QUERIES=(
    "Actualités intelligence artificielle aujourd'hui 23 février 2026 - faits marquants et annonces"
    "Nouvelles du jour dans l'IA - résumé complet en français"
)

cd "$SKILL_DIR"
echo "Appel Perplexity pour Flash..."
FLASH_RAW=$(node scripts/search.mjs "${FLASH_QUERIES[@]}" 2>&1 || echo "Erreur Perplexity Flash")

# Générer synthèse Gemini pour Flash
echo "Génération synthèse Gemini pour Flash..."
FLASH_SYNTHESIS=$(echo "$FLASH_RAW" | gemini -p "Tu es un expert en veille technologique. À partir de ce contenu sur l'actualité IA, génère :

## 🎯 Points Clés à Retenir (3 points maximum, en français, bullet points avec emojis)

## 🚀 Actions / Réflexions (2-3 suggestions concrètes de lecture ou d'actions à entreprendre, en français)

Sois concis et percutant." 2>&1 || echo "*Synthèse Gemini indisponible*")

# Générer le fichier Flash
FLASH_FILE="$VEILLE_DIR/daily-flash/$DATE/19h-flash.md"

echo "# ⚡ Flash IA - $DATE - 19h00 (Soir)" > "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "**Thème du jour** : ${THEME^^}" >> "$FLASH_FILE"
echo "**Généré le** : $DATE_FR" >> "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "---" >> "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "## 📰 Faits Marquants du Jour" >> "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "$FLASH_RAW" >> "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "---" >> "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "$FLASH_SYNTHESIS" >> "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "---" >> "$FLASH_FILE"
echo "" >> "$FLASH_FILE"
echo "*Veille automatique - Perplexity AI + Gemini*" >> "$FLASH_FILE"

echo "✅ Flash soir sauvegardé : $FLASH_FILE ($(wc -l < "$FLASH_FILE" | tr -d ' ') lignes)"

# === DEEP DIVE ===
echo ""
echo "🔬 Génération du Deep Dive (soir)..."

# Requêtes deep dive selon le thème
case $THEME in
    "tech")
        DEEP_QUERIES=(
            "Défis déploiement Edge AI 2026 : problèmes techniques solutions cas concrets"
            "Comparaison puces AI 2026 GPU TPU ASIC : avantages inconvénients choix"
            "Alternatives Transformers 2026 : Mamba RWKV Griffin état recherche"
        )
        DEEP_TITLE="Infrastructure et Hardware AI"
        ;;
    "produits")
        DEEP_QUERIES=(
            "Plateformes automatisation AI entreprise 2026 : comparatif complet"
            "Intégration AI en entreprise : défis solutions retours expérience"
            "Workflow automation AI : outils leaders marché 2026"
        )
        DEEP_TITLE="Automatisation et Intégration Enterprise"
        ;;
    "regulation")
        DEEP_QUERIES=(
            "Biais algorithmiques régulations 2026 : obligations entreprises"
            "Transparence IA exigences légales : guide conformité"
            "Responsabilité juridique IA : évolutions jurisprudence 2026"
        )
        DEEP_TITLE="Éthique et Responsabilité Algorithmique"
        ;;
    "business")
        DEEP_QUERIES=(
            "Marché startup IA 2026 : levées fonds tendances valorisation"
            "Stratégies Big Tech IA 2026 : Google Microsoft Meta Amazon comparaison"
            "Talent IA marché travail : pénuries salaires formations 2026"
        )
        DEEP_TITLE="Écosystème Startup et Talent AI"
        ;;
    "sectoriel")
        DEEP_QUERIES=(
            "IA véhicules connectés 2026 : fonctionnalités acteurs marché"
            "Diagnostic automobile IA : technologies acteurs cas usage"
            "Digitalisation industrie pneumatique : innovations IA Michelin"
        )
        DEEP_TITLE="Digitalisation Automobile et Pneumatique"
        ;;
    "emergent")
        DEEP_QUERIES=(
            "Intelligence essaim swarm AI : applications concrètes 2026"
            "Federated learning entreprise : cas usage bénéfices"
            "IA causale causal AI : avancées recherche applications"
        )
        DEEP_TITLE="Paradigmes AI Émergents"
        ;;
    "recap")
        DEEP_QUERIES=(
            "Bilan semaine IA : événements majeurs annonces tendances"
            "Actualités IA semaine : synthèse complète faits marquants"
            "Revue hebdo intelligence artificielle : points clés analyses"
        )
        DEEP_TITLE="Analyse Hebdomadaire Complète"
        ;;
esac

echo "Appel Perplexity pour Deep Dive..."
DEEP_RAW=$(node scripts/search.mjs "${DEEP_QUERIES[@]}" 2>&1 || echo "Erreur Perplexity Deep Dive")

# Générer synthèse Gemini pour Deep Dive
echo "Génération synthèse Gemini pour Deep Dive..."
DEEP_SYNTHESIS=$(echo "$DEEP_RAW" | gemini -p "Tu es un expert en veille technologique spécialisé en $DEEP_TITLE. À partir de ce contenu de recherche, génère :

## 💡 Points Clés à Retenir (4-5 points maximum, en français, bullet points avec emojis, focus sur les enseignements stratégiques)

## 🎯 Actions / Réflexions (3-4 suggestions concrètes : quels articles lire en priorité, quelles tendances surveiller, quelles actions entreprendre pour un professionnel de l'IA)

## 🔮 Perspectives (2-3 évolutions à surveiller sur ce thème dans les prochains mois)

Sois percutant, stratégique et actionnable. Évite le jargon superflu." 2>&1 || echo "*Synthèse Gemini indisponible*")

# Générer le fichier Deep Dive
DEEP_FILE="$VEILLE_DIR/deep-dives/$DATE/19h-deep-dive-${THEME}.md"

echo "# 🔬 Deep Dive IA - $DATE - 19h00" > "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "**Thème** : $DEEP_TITLE" >> "$DEEP_FILE"
echo "**Focus** : ${THEME^^}" >> "$DEEP_FILE"
echo "**Généré le** : $DATE_FR" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "---" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "## 🎯 Introduction" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "Ce deep dive explore en profondeur **$DEEP_TITLE** à travers plusieurs angles d'analyse." >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "---" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "## 📚 Analyses Détaillées" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "$DEEP_RAW" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "---" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "$DEEP_SYNTHESIS" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "---" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "*Veille automatique - Perplexity AI + Gemini*" >> "$DEEP_FILE"

echo "✅ Deep Dive soir sauvegardé : $DEEP_FILE ($(wc -l < "$DEEP_FILE" | tr -d ' ') lignes)"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "🌆 Veille IA 19h - $DATE - $THEME" || echo "Rien à committer"
git push origin main || echo "Push impossible"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 Veille 19h terminée !"
echo "Thème : $THEME"
echo "Flash : $(wc -l < "$VEILLE_DIR/daily-flash/$DATE/19h-flash.md" | tr -d ' ') lignes"
echo "Deep Dive : $(wc -l < "$DEEP_FILE" | tr -d ' ') lignes"
echo "==================================="
