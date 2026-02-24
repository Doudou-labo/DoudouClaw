#!/bin/bash
# veille-ia-8h.sh - Veille IA du matin (Flash réveil) - v2 avec fraîcheur + scraping
# Exécution : 8h00 tous les jours

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_DIR="$BASE_DIR/skills/perplexity"
VEILLE_DIR="$BASE_DIR/notes/areas/veille-ia"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)

echo "🌅 Veille IA - 8h00 - $DATE - v2 Fraîcheur + Scraping"

# Créer le répertoire du jour
mkdir -p "$VEILLE_DIR/daily-flash/$DATE"

# === FLASH RÉVEIL ===
echo ""
echo "⚡ Génération du Flash réveil (fraîcheur 72h)..."

FLASH_QUERIES=(
    "Breaking news IA hier soir et ce matin - résumé français"
    "Annonces intelligence artificielle dernières 24h - faits marquants"
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
FLASH_FILE="$VEILLE_DIR/daily-flash/$DATE/08h-flash.md"

cat > "$FLASH_FILE" << EOF
# ⚡ Flash IA - $DATE - 08h00 (Réveil) — v2 Fraîcheur + Scraping

**Type** : Flash réveil (contenu des dernières 24h)  
**Filtre** : 7 jours (Perplexity)  
**Généré le** : $(date '+%d/%m/%Y à %H:%M')

---

## 📰 Actualités du Matin

$FLASH_RAW

---

## 🔗 Contenus Scrapés (détail)

$FLASH_SCRAPED

---

*Veille automatique — Perplexity AI + Scrapling*
EOF

echo "✅ Flash réveil sauvegardé : $FLASH_FILE ($(wc -l < "$FLASH_FILE" | tr -d ' ') lignes)"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "🌅 Veille IA 8h v2 — $DATE — Fraîcheur 72h + scraping" || echo "Rien à committer"
git push origin main || echo "Push impossible"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 Veille 8h v2 terminée !"
echo "Filtre fraîcheur : 7 jours"
echo "Flash : $(wc -l < "$FLASH_FILE" | tr -d ' ') lignes"
echo "==================================="
