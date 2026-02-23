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

# Requêtes flash - actualités de la journée EN FRANÇAIS avec analyse
FLASH_QUERIES=(
    "Quelles sont les actualités IA majeures aujourd'hui ? Réponds en français avec analyse détaillée."
    "Résumé des annonces intelligence artificielle de la journée en français"
    "Tendances IA du jour - analyse en français"
)

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

## 📰 Actualités et Analyses

$FLASH_OUTPUT

---

*Veille automatique - Perplexity AI*
EOF

echo "✅ Flash soir sauvegardé : $FLASH_FILE"

# === DEEP DIVE ===
echo ""
echo "🔬 Génération du Deep Dive (soir)..."

# Requêtes deep dive selon le thème (complémentaire du matin) EN FRANÇAIS
case $THEME in
    "tech")
        DEEP_QUERIES=(
            "Analyse détaillée des défis du déploiement Edge AI en 2026 - réponds en français avec exemples concrets"
            "Comparaison approfondie des puces AI hardware 2026 : GPU, TPU, ASIC - analyse en français"
            "Alternatives aux Transformers : état de la recherche et implications - explications détaillées en français"
        )
        DEEP_TITLE="Infrastructure et Hardware AI"
        ;;
    "produits")
        DEEP_QUERIES=(
            "Plateformes d'automatisation AI enterprise 2026 : comparaison détaillée en français"
            "Défis d'intégration AI en entreprise - analyse approfondie avec cas d'usage en français"
            "Outils de workflow automation AI : état du marché et tendances - analyse française"
        )
        DEEP_TITLE="Automatisation et Intégration Enterprise"
        ;;
    "regulation")
        DEEP_QUERIES=(
            "Régulations sur la détection des biais algorithmiques - analyse juridique détaillée en français"
            "Exigences de transparence AI : ce que les entreprises doivent savoir - français"
            "Responsabilité juridique de l'IA : évolution des cas récents 2026 - analyse française"
        )
        DEEP_TITLE="Éthique et Responsabilité Algorithmique"
        ;;
    "business")
        DEEP_QUERIES=(
            "Valorisation des licornes AI en 2026 : analyse de marché détaillée en français"
            "Échecs et faillites startups AI 2026 : leçons à tirer - analyse française"
            "Marché du talent AI : tendances salariales et pénuries - étude détaillée en français"
        )
        DEEP_TITLE="Écosystème Startup et Talent AI"
        ;;
    "sectoriel")
        DEEP_QUERIES=(
            "Fonctionnalités AI des véhicules connectés 2026 - analyse détaillée en français"
            "Diagnostic automobile par IA : technologies et acteurs - étude approfondie française"
            "Digitalisation de l'industrie du pneumatique : innovations IA - analyse en français"
        )
        DEEP_TITLE="Digitalisation Automobile et Pneumatique"
        ;;
    "emergent")
        DEEP_QUERIES=(
            "Intelligence en essaim (swarm intelligence) : applications AI concrètes - français"
            "Apprentissage fédéré (federated learning) en entreprise : cas d'usage détaillés - français"
            "IA causale : développements récents et implications - explications approfondies en français"
        )
        DEEP_TITLE="Paradigmes AI Émergents"
        ;;
    "recap")
        DEEP_QUERIES=(
            "Bilan hebdomadaire IA : principales avancées de la semaine - synthèse détaillée en français"
            "Tendances clés de la semaine dans l'intelligence artificielle - analyse française"
            "Revue d'actualité AI hebdomadaire : faits marquants et implications - français"
        )
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
