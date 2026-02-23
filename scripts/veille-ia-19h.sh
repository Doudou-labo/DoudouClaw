#!/bin/bash
# veille-ia-19h.sh - Veille IA du soir (Flash + Deep Dive) - AVEC SYNTHÈSE AUTO
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

# Générer synthèse automatique pour Flash
FLASH_SYNTHESIS="## 🎯 Points Clés à Retenir

- 📰 **Actualités majeures** : Consulter les sources citées pour les annonces du jour
- 🔍 **Tendances** : Veiller à surveiller les évolutions mentionnées dans les articles
- 💡 **À creuser** : Identifier les sujets récurrents dans les actualités

## 🚀 Actions / Réflexions

- [ ] Lire les articles les plus pertinents du flash
- [ ] Identifier les sujets à approfondir pour la veille suivante
- [ ] Partager les informations pertinentes avec l'équipe si nécessaire"

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
echo "*Veille automatique - Perplexity AI*" >> "$FLASH_FILE"

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
        DEEP_SUMMARY="Ce deep dive couvre les défis du Edge AI, la comparaison des puces (GPU vs TPU vs ASIC) et les alternatives aux Transformers (Mamba, MoE, RWKV)."
        ;;
    "produits")
        DEEP_QUERIES=(
            "Plateformes automatisation AI entreprise 2026 : comparatif complet"
            "Intégration AI en entreprise : défis solutions retours expérience"
            "Workflow automation AI : outils leaders marché 2026"
        )
        DEEP_TITLE="Automatisation et Intégration Enterprise"
        DEEP_SUMMARY="Ce deep dive explore les plateformes d'automatisation AI, les défis d'intégration enterprise et les outils de workflow automation."
        ;;
    "regulation")
        DEEP_QUERIES=(
            "Biais algorithmiques régulations 2026 : obligations entreprises"
            "Transparence IA exigences légales : guide conformité"
            "Responsabilité juridique IA : évolutions jurisprudence 2026"
        )
        DEEP_TITLE="Éthique et Responsabilité Algorithmique"
        DEEP_SUMMARY="Ce deep dive analyse les régulations sur les biais algorithmiques, les exigences de transparence et l'évolution de la responsabilité juridique en IA."
        ;;
    "business")
        DEEP_QUERIES=(
            "Marché startup IA 2026 : levées fonds tendances valorisation"
            "Stratégies Big Tech IA 2026 : Google Microsoft Meta Amazon comparaison"
            "Talent IA marché travail : pénuries salaires formations 2026"
        )
        DEEP_TITLE="Écosystème Startup et Talent AI"
        DEEP_SUMMARY="Ce deep dive examine le marché des startups IA, les stratégies des Big Tech et les tendances du marché du talent IA."
        ;;
    "sectoriel")
        DEEP_QUERIES=(
            "IA véhicules connectés 2026 : fonctionnalités acteurs marché"
            "Diagnostic automobile IA : technologies acteurs cas usage"
            "Digitalisation industrie pneumatique : innovations IA Michelin"
        )
        DEEP_TITLE="Digitalisation Automobile et Pneumatique"
        DEEP_SUMMARY="Ce deep dive explore l'IA dans les véhicules connectés, le diagnostic automobile et la digitalisation du secteur du pneumatique."
        ;;
    "emergent")
        DEEP_QUERIES=(
            "Intelligence essaim swarm AI : applications concrètes 2026"
            "Federated learning entreprise : cas usage bénéfices"
            "IA causale causal AI : avancées recherche applications"
        )
        DEEP_TITLE="Paradigmes AI Émergents"
        DEEP_SUMMARY="Ce deep dive présente les technologies émergentes : swarm intelligence, federated learning et IA causale."
        ;;
    "recap")
        DEEP_QUERIES=(
            "Bilan semaine IA : événements majeurs annonces tendances"
            "Actualités IA semaine : synthèse complète faits marquants"
            "Revue hebdo intelligence artificielle : points clés analyses"
        )
        DEEP_TITLE="Analyse Hebdomadaire Complète"
        DEEP_SUMMARY="Ce deep dive fait le bilan de la semaine en IA : événements majeurs, annonces et tendances identifiées."
        ;;
esac

echo "Appel Perplexity pour Deep Dive..."
DEEP_RAW=$(node scripts/search.mjs "${DEEP_QUERIES[@]}" 2>&1 || echo "Erreur Perplexity Deep Dive")

# Générer synthèse contextuelle pour Deep Dive basée sur le thème
DEEP_SYNTHESIS="## 💡 Points Clés à Retenir

### 🎯 Enseignements Principaux

1. **Architecture du sujet** : $DEEP_SUMMARY
2. **Sources prioritaires** : Identifier les articles les plus détaillés dans la liste ci-dessus
3. **Tendances identifiées** : Repérer les évolutions récurrentes mentionnées par plusieurs sources

### 🚀 Actions / Réflexions Recommandées

- [ ] **Lecture prioritaire** : Sélectionner 2-3 articles les plus pertinents pour une lecture approfondie
- [ ] **Veille continue** : Identifier les sources les plus fiables à suivre régulièrement sur ce thème
- [ ] **Application concrète** : Réfléchir à comment ces tendances peuvent impacter ton contexte pro/perso
- [ ] **Partage** : Si pertinent, partager les découvertes avec ton réseau

### 🔮 Perspectives à Surveiller

- Évolutions réglementaires sur ce thème
- Nouveaux acteurs ou technologies émergents
- Adoptions concrètes en entreprise"

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
echo "$DEEP_SUMMARY" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "---" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "## 📚 Analyses et Sources" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "$DEEP_RAW" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "---" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "$DEEP_SYNTHESIS" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "---" >> "$DEEP_FILE"
echo "" >> "$DEEP_FILE"
echo "*Veille automatique - Perplexity AI*" >> "$DEEP_FILE"

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
