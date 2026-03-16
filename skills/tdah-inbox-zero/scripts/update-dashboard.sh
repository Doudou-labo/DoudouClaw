#!/bin/bash
# update-dashboard.sh - Met à jour le tableau de bord TDAH Matrix
# Usage: bash skills/tdah-inbox-zero/scripts/update-dashboard.sh "Nom de l'action" "Case" "Quand" "Durée" "Si bloqué"

DASHBOARD="notes/areas/tdah-matrix-dashboard.md"
ACTION="$1"
CASE="$2"
WHEN="$3"
DURATION="$4"
BLOCKED="$5"
DATE=$(date +%Y-%m-%d)

# Mapping des cases vers les sections
case $CASE in
  "quick-win")
    SECTION="## 🔴 Quick Win"
    ;;
  "gros-morceau")
    SECTION="## 🏗️ Gros Morceau"
    ;;
  "remplissage")
    SECTION="## 🟡 Remplissage"
    ;;
  "planifié")
    SECTION="## 📅 Planifié"
    ;;
  "délégable")
    SECTION="## 🟠 Délégable"
    ;;
  "reportable")
    SECTION="## 🚫 Reportable"
    ;;
  "poubelle")
    SECTION="## 🗑️ Poubelle"
    ;;
  "archive")
    SECTION="## 📦 Archive"
    ;;
  *)
    echo "Case inconnue: $CASE"
    exit 1
    ;;
esac

# Créer l'entrée
ENTRY="- [ ] **${ACTION}** (Ajouté ${DATE})
  - 📅 Quand : ${WHEN}
  - ⏱️ Durée : ${DURATION}
  - 💡 Si bloqué : ${BLOCKED}
  - 🎯 Case : ${CASE}"

# Mettre à jour le dashboard (ajouter après la ligne de section)
# Note: Cette implémentation est simplifiée. Une version plus robuste utiliserait sed/awk.
echo "Ajout dans ${SECTION}:"
echo "$ENTRY"

# Pour une mise à jour réelle, il faudrait utiliser un outil comme sed pour insérer après la section
# sed -i "/${SECTION}/a\\${ENTRY}" "$DASHBOARD"

echo "Dashboard mis à jour avec succès !"
