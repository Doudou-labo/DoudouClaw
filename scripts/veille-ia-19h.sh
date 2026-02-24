#!/bin/bash
# veille-ia-19h.sh - Veille IA du soir (Flash + Deep Dive) - v2 avec fraîcheur + scraping
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

echo "🌅 Veille IA - 19h00 - $DATE ($DAY_NAME) - v2 Fraîcheur + Scraping"
echo "Thème du jour : $THEME"

mkdir -p "$VEILLE_DIR/daily-flash/$DATE"
mkdir -p "$VEILLE_DIR/deep-dives/$DATE"

# === FLASH 5 MIN ===
echo ""
echo "⚡ Génération du Flash 5 min (soir, fraîcheur 72h)..."

FLASH_QUERIES=(
    "Actualités intelligence artificielle dernières 48h - faits marquants et annonces"
    "Nouvelles IA récentes - résumé complet en français"
)

cd "$SKILL_DIR"
echo "🔍 Recherche Perplexity (freshness=week)..."
FLASH_RAW=$(node scripts/search.mjs --freshness week "${FLASH_QUERIES[@]}" 2>&1)

# Extraire et scraper les URLs
echo "🔗 Extraction des URLs pour scraping..."
FLASH_URLS=$(echo "$FLASH_RAW" | grep -oE 'https?://[^[:space:]]+' | sort -u | head -5)

FLASH_SCRAPED=""
if [ -n "$FLASH_URLS" ]; then
    echo "🕷️ Scraping de $(echo "$FLASH_URLS" | wc -l) URLs..."
    FLASH_SCRAPED_JSON=$(echo "$FLASH_URLS" | python3 "$BASE_DIR/scripts/scrape-urls.py" 2>&1)
    FLASH_SCRAPED=$(echo "$FLASH_SCRAPED_JSON" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for item in data:
        if item.get('success'):
            title = item.get('title', 'Sans titre')
            content = item.get('content', '')
            print(f\"**{title}**\n\n{content[:500]}...\n\n---\n\n\")
except:
    pass
" 2>/dev/null || echo "*Scraping en cours...*")
else
    FLASH_SCRAPED="*Aucune URL extraite*"
fi

# Générer le fichier Flash
FLASH_FILE="$VEILLE_DIR/daily-flash/$DATE/19h-flash.md"

cat > "$FLASH_FILE" << EOF
# ⚡ Flash IA - $DATE - 19h00 (Soir) — v2 Fraîcheur + Scraping

**Thème du jour** : ${THEME^^}  
**Filtre** : 7 jours (Perplexity)  
**Généré le** : $DATE_FR

---

## 📰 Faits Marquants du Jour

$FLASH_RAW

---

## 🔗 Contenus Scrapés (détail)

$FLASH_SCRAPED

---

*Veille automatique — Perplexity AI + Scrapling*
EOF

echo "✅ Flash soir sauvegardé : $FLASH_FILE ($(wc -l < "$FLASH_FILE" | tr -d ' ') lignes)"

# === DEEP DIVE ===
echo ""
echo "🔬 Génération du Deep Dive (soir, fraîcheur 72h)..."

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

echo "🔍 Recherche Perplexity Deep Dive (freshness=week)..."
DEEP_RAW=$(node scripts/search.mjs --freshness week "${DEEP_QUERIES[@]}" 2>&1)

# Extraire et scraper les URLs du deep dive
echo "🔗 Extraction des URLs Deep Dive..."
DEEP_URLS=$(echo "$DEEP_RAW" | grep -oE 'https?://[^[:space:]]+' | sort -u | head -5)

DEEP_SCRAPED=""
if [ -n "$DEEP_URLS" ]; then
    echo "🕷️ Scraping Deep Dive..."
    DEEP_SCRAPED_JSON=$(echo "$DEEP_URLS" | python3 "$BASE_DIR/scripts/scrape-urls.py" 2>&1)
    DEEP_SCRAPED=$(echo "$DEEP_SCRAPED_JSON" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for item in data:
        if item.get('success'):
            title = item.get('title', 'Sans titre')
            content = item.get('content', '')
            print(f\"**{title}**\n\n{content[:600]}...\n\n---\n\n\")
except:
    pass
" 2>/dev/null || echo "*Scraping en cours...*")
else
    DEEP_SCRAPED="*Aucune URL extraite*"
fi

# Générer le fichier Deep Dive
DEEP_FILE="$VEILLE_DIR/deep-dives/$DATE/19h-deep-dive-${THEME}.md"

cat > "$DEEP_FILE" << EOF
# 🔬 Deep Dive IA - $DATE - 19h00 — v2 Fraîcheur + Scraping

**Thème** : $DEEP_TITLE  
**Focus** : ${THEME^^}  
**Filtre** : 7 jours (Perplexity)  
**Généré le** : $DATE_FR

---

## 🎯 Introduction

Deep dive thématique sur $DEEP_TITLE avec contenu récent (72h) et scraping des sources.

---

## 📚 Analyses et Sources

$DEEP_RAW

---

## 🔗 Contenus Scrapés (détail)

$DEEP_SCRAPED

---

*Veille automatique — Perplexity AI + Scrapling*
EOF

echo "✅ Deep Dive soir sauvegardé : $DEEP_FILE ($(wc -l < "$DEEP_FILE" | tr -d ' ') lignes)"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "🌆 Veille IA 19h v2 — $DATE — $THEME — Fraîcheur + scraping" || echo "Rien à committer"
git push origin main || echo "Push impossible"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 Veille 19h v2 terminée !"
echo "Thème : $THEME"
echo "Filtre fraîcheur : 7 jours"
echo "Flash : $(wc -l < "$FLASH_FILE" | tr -d ' ') lignes"
echo "Deep Dive : $(wc -l < "$DEEP_FILE" | tr -d ' ') lignes"
echo "==================================="
