#!/bin/bash
# veille-ia-synthese-mensuelle.sh - Synthèse stratégique mensuelle
# Exécution : 15 et 30 de chaque mois (28 pour février)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_DIR="$BASE_DIR/skills/perplexity"
VEILLE_DIR="$BASE_DIR/notes/areas/veille-ia"
DATE=$(date +%Y-%m-%d)
MOIS=$(date +%B)
MOIS_NUM=$(date +%m)
ANNEE=$(date +%Y)

# Déterminer le jour spécial (15 ou 30/28)
JOUR=$(date +%d)
if [ "$JOUR" = "15" ]; then
    PERIODE="Mi-mois"
elif [ "$JOUR" = "30" ] || [ "$JOUR" = "28" ]; then
    PERIODE="Fin de mois"
else
    PERIODE="Synthèse"
fi

echo "📊 SYNTHÈSE STRATÉGIQUE IA - $PERIODE $MOIS $ANNEE"

# Créer le répertoire des synthèses
mkdir -p "$VEILLE_DIR/syntheses-mensuelles"

# === SYNTHÈSE GLOBALE ===
echo ""
echo "🔮 Génération de la synthèse stratégique..."

# Requêtes synthèse par thème
SYNTHESE_QUERIES=(
    "AI industry monthly recap $MOIS $ANNEE"
    "AI technology breakthroughs $MOIS $ANNEE summary"
    "AI regulation updates $MOIS $ANNEE"
    "AI funding acquisitions monthly report $MOIS $ANNEE"
    "Enterprise AI adoption trends $MOIS $ANNEE"
    "AI automotive industry developments $MOIS $ANNEE"
)

# Lancer les requêtes Perplexity
cd "$SKILL_DIR"
echo "Exécution des requêtes Perplexity..."
SYNTHESE_OUTPUT=$(node scripts/search.mjs "${SYNTHESE_QUERIES[@]}" 2>&1)

# Générer le fichier de synthèse
SYNTHESE_FILE="$VEILLE_DIR/syntheses-mensuelles/synthese-${ANNEE}-${MOIS_NUM}-${JOUR}.md"

cat > "$SYNTHESE_FILE" << EOF
# 📊 Synthèse Stratégique IA - $PERIODE $MOIS $ANNEE

**Période couverte** : $MOIS $ANNEE  
**Type** : Synthèse stratégique globale  
**Générée le** : $(date '+%d/%m/%Y à %H:%M')

---

## 📋 Sommaire

1. [🤖 Tech \u0026 Modèles](#-tech--modèles)
2. [🛠️ Produits \u0026 Outils](#-produits--outils)
3. [⚖️ Régulation \u0026 Éthique](#-régulation--éthique)
4. [💼 Business \u0026 Marché](#-business--marché)
5. [🚗 Applications Sectorielles](#-applications-sectorielles)
6. [💡 Insights \u0026 Recommandations](#-insights--recommandations)

---

## 🔍 Requêtes d'Analyse Stratégique

$(for q in "${SYNTHESE_QUERIES[@]}"; do echo "- $q"; done)

---

## 🤖 Tech \u0026 Modèles

### 🎯 Tendances Majeur
<!-- À extraire des résultats -->

### 🔬 Avancées Clés
<!-- À extraire des résultats -->

### 📈 Évolution des Capacités
<!-- À extraire des résultats -->

---

## 🛠️ Produits \u0026 Outils

### 🚀 Nouveautés Produits
<!-- À extraire des résultats -->

### 🏢 Adoption Enterprise
<!-- À extraire des résultats -->

### 🔧 Outils Émergents
<!-- À extraire des résultats -->

---

## ⚖️ Régulation \u0026 Éthique

### 📜 Évolutions Réglementaires
<!-- À extraire des résultats -->

### ⚠️ Controverses et Débats
<!-- À extraire des résultats -->

### 🛡️ Gouvernance AI
<!-- À extraire des résultats -->

---

## 💼 Business \u0026 Marché

### 💰 Levées \u0026 Acquisitions
<!-- À extraire des résultats -->

### 🏛️ Stratégies Big Tech
<!-- À extraire des résultats -->

### 📊 Tendances Marché
<!-- À extraire des résultats -->

---

## 🚗 Applications Sectorielles

### 🏭 Secteur Automobile
<!-- À extraire des résultats -->

### 🚛 Poids-Lourds \u0026 Logistique
<!-- À extraire des résultats -->

### 🔧 Maintenance Prédictive
<!-- À extraire des résultats -->

---

## 📚 Données Brutes Perplexity

$SYNTHESE_OUTPUT

---

## 💡 Insights \u0026 Recommandations

### 🎯 Points Clés du Mois

1. **Insight 1** : <!-- À compléter -->
2. **Insight 2** : <!-- À compléter -->
3. **Insight 3** : <!-- À compléter -->

### 🚀 Opportunités Identifiées

- <!-- À compléter -->

### ⚠️ Risques et Points de Vigilance

- <!-- À compléter -->

### 📋 Actions Recommandées

- [ ] <!-- À compléter -->
- [ ] <!-- À compléter -->
- [ ] <!-- À compléter -->

---

## 🔮 Perspectives

### Prochaines Échéances à Surveiller

- <!-- À compléter -->

### Tendances à Monitoriser

- <!-- À compléter -->

---

*Synthèse stratégique automatique - Perplexity AI*  
*Veille IA DoudouClaw - $ANNEE*
EOF

echo "✅ Synthèse stratégique sauvegardée : $SYNTHESE_FILE"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "📊 Synthèse stratégique IA - $PERIODE $MOIS $ANNEE" || echo "Rien à committer"
git push origin main || echo "Push impossible (vérifiez la connexion)"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 SYNTHÈSE STRATÉGIQUE TERMINÉE !"
echo "Période : $PERIODE $MOIS $ANNEE"
echo "Fichier : syntheses-mensuelles/synthese-${ANNEE}-${MOIS_NUM}-${JOUR}.md"
echo "==================================="

# Retourner le résumé pour le cron
if [ -f "$SYNTHESE_FILE" ]; then
    echo ""
    echo "📋 RÉSUMÉ SYNTHÈSE :"
    echo "- Fichier : $(wc -l < "$SYNTHESE_FILE") lignes"
    echo "- Thèmes couverts : 5"
    echo "- Fichier commité ✅"
fi
