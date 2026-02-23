#!/bin/bash
# veille-ia-08h.sh - Veille IA du matin (Flash + Deep Dive)
# Exécution : 8h00 tous les jours

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
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

# Requêtes flash génériques + thème du jour EN FRANÇAIS
case $THEME in
    "tech")
        FLASH_QUERIES=(
            "Actualités intelligence artificielle aujourd'hui - résumé détaillé en français"
            "Nouveaux modèles LLM cette semaine - analyse en français"
            "Benchmarks et performances IA récents - synthèse française"
        )
        ;;
    "produits")
        FLASH_QUERIES=(
            "Nouveaux outils IA lancés aujourd'hui - analyse détaillée en français"
            "Mises à jour outils productivité IA - résumé en français"
            "Annonces plateformes NoCode AI - synthèse française"
        )
        ;;
    "regulation")
        FLASH_QUERIES=(
            "Actualités réglementation IA aujourd'hui - analyse juridique en français"
            "Mises à jour AI Act Europe - résumé détaillé en français"
            "Affaires juridiques propriété intellectuelle IA - synthèse française"
        )
        ;;
    "business")
        FLASH_QUERIES=(
            "Levées de fonds startups IA aujourd'hui - analyse en français"
            "Acquisitions et fusions IA cette semaine - résumé détaillé français"
            "Investissements Big Tech en IA - synthèse en français"
        )
        ;;
    "sectoriel")
        FLASH_QUERIES=(
            "Actualités IA dans l'industrie automobile - analyse détaillée en français"
            "Progress véhicules autonomes aujourd'hui - résumé français"
            "Initiatives Michelin et IA - synthèse en français"
        )
        ;;
    "emergent")
        FLASH_QUERIES=(
            "Breakthrough recherche IA aujourd'hui - analyse approfondie en français"
            "Nouveaux papers scientifiques IA - résumé détaillé français"
            "Technologies AI émergentes - synthèse en français"
        )
        ;;
    "recap")
        FLASH_QUERIES=(
            "Bilan semaine intelligence artificielle - récap détaillé en français"
            "Faits marquants IA cette semaine - analyse française"
            "Tendances de la semaine IA - synthèse en français"
        )
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

## 📰 Actualités et Analyses

$FLASH_OUTPUT

---

*Veille automatique - Perplexity AI*
EOF

echo "✅ Flash sauvegardé : $FLASH_FILE"

# === DEEP DIVE ===
echo ""
echo "🔬 Génération du Deep Dive..."

# Requêtes deep dive selon le thème EN FRANÇAIS avec demande d'analyse
case $THEME in
    "tech")
        DEEP_QUERIES=(
            "État des large language models 2026 : comparaison capacités détaillée - analyse en français"
            "Modèles multimodaux IA : état de l'art et cas d'usage - explications approfondies en français"
            "Optimisation inference IA 2026 : techniques et outils - analyse technique en français"
        )
        DEEP_TITLE="État des LLM et Multimodal AI"
        ;;
    "produits")
        DEEP_QUERIES=(
            "Meilleurs frameworks agents IA 2026 : comparaison LangChain CrewAI AutoGPT détaillée - français"
            "Adoption outils NoCode AI en entreprise : état des lieux 2026 - analyse française"
            "ROI des copilotes IA : études et retours d'expérience - synthèse détaillée en français"
        )
        DEEP_TITLE="Frameworks d'Agents IA et NoCode"
        ;;
    "regulation")
        DEEP_QUERIES=(
            "AI Act 2026 : exigences de conformité détaillées pour entreprises - guide français"
            "Évolution droit d'auteur et IA 2026 : ce qui change - analyse juridique française"
            "Frameworks gouvernance IA enterprise : implémentation pratique - guide détaillé en français"
        )
        DEEP_TITLE="Régulation AI Act et Gouvernance"
        ;;
    "business")
        DEEP_QUERIES=(
            "Tendances levées de fonds IA 2026 : analyse marché détaillée en français"
            "Stratégies Big Tech en IA : comparaison approfondie GAFA - analyse française"
            "Statistiques adoption enterprise IA 2026 : chiffres et tendances - synthèse française"
        )
        DEEP_TITLE="Marché AI et Adoption Enterprise"
        ;;
    "sectoriel")
        DEEP_QUERIES=(
            "IA dans l'industrie automobile 2026 : tendances et acteurs - analyse détaillée en français"
            "Maintenance prédictive par IA : état de l'art fleet management - explications en français"
            "Développement camions autonomes 2026 : où en est-on ? - synthèse française"
        )
        DEEP_TITLE="IA dans l'Automobile et la Logistique"
        ;;
    "emergent")
        DEEP_QUERIES=(
            "Capacités de raisonnement IA 2026 : progrès récents - analyse détaillée en français"
            "Computing neuromorphique : applications AI concrètes - explications en français"
            "Machine learning quantique : avancées et perspectives - synthèse française"
        )
        DEEP_TITLE="Technologies AI Émergentes"
        ;;
    "recap")
        DEEP_QUERIES=(
            "Highlights hebdomadaires IA : analyse des événements clés - synthèse détaillée en français"
            "Tendances majeures de la semaine IA : implications stratégiques - analyse française"
            "Revue complète semaine IA : faits marquants et perspectives - français"
        )
        DEEP_TITLE="Analyse Hebdomadaire Complète"
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

## 🔍 Requêtes d'analyse approfondie

$(for q in "${DEEP_QUERIES[@]}"; do echo "- $q"; done)

---

## 📚 Analyse Détaillée

$DEEP_OUTPUT

---

## 💡 Points Clés à Retenir

<!-- À compléter après lecture -->

---

## 🎯 Actions / Réflexions

<!-- À compléter si pertinent -->

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
