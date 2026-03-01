#!/bin/bash
# veille-ia-12h.sh - Veille IA du midi (Flash 5 min avec scraping)
# Exécution : 12h00 tous les jours

set +e  # On continue même en cas d'erreur partielle

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_DIR="$BASE_DIR/skills/perplexity"
VEILLE_DIR="$BASE_DIR/notes/areas/veille-ia"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)

echo "☀️ Veille IA - 12h00 - $DATE (v2 avec filtre fraîcheur + scraping)"

# Créer le répertoire du jour
mkdir -p "$VEILLE_DIR/daily-flash/$DATE"

# === FLASH 5 MIN (léger, actualités des dernières 72h) ===
echo ""
echo "⚡ Génération du Flash 5 min (filtré 72h)..."

# Requêtes flash orientées fraîcheur - France et USA
FLASH_QUERIES=(
    "Breaking news intelligence artificielle France USA dernières 48h - résumé français"
    "Annonces IA Etats-Unis et Europe aujourd'hui ou hier - synthèse détaillée français"
    "Tendances IA tech américaine dernières 72 heures - analyse rapide français"
)

# Lancer les requêtes Perplexity avec filtre fraîcheur (week = 7 jours)
cd "$SKILL_DIR"
echo "🔍 Recherche Perplexity (freshness=week)..."
FLASH_OUTPUT=$(node scripts/search.mjs --freshness week "${FLASH_QUERIES[@]}" 2>&1 || true)

# Nettoyer les erreurs API pour éviter d'afficher du HTML brut
if echo "$FLASH_OUTPUT" | grep -qiE "401|Authorization Required|Perplexity API error"; then
    FLASH_OUTPUT="⚠️ Perplexity indisponible (erreur d'authentification API). Le flash continue en mode dégradé sans contenu Perplexity. Action requise : vérifier la clé API Perplexity dans la configuration OpenClaw."
fi

# Extraire les URLs pour scraping
echo "🔗 Extraction des URLs pour scraping..."
URLS=$(echo "$FLASH_OUTPUT" | grep -oE 'https?://[^[:space:]]+' | sort -u | head -5)

# Scraper les URLs si on en a trouvé
SCRAPED_CONTENT=""
if [ -n "$URLS" ]; then
    echo "🕷️ Scraping de $(echo "$URLS" | wc -l) URLs avec Scrapling..."
    SCRAPED_JSON=$(echo "$URLS" | python3 "$BASE_DIR/scripts/scrape-urls.py" 2>&1)
    
    # Formater le contenu scrapé en markdown
    SCRAPED_CONTENT="### 📄 Articles scrapés\n\n"
    SCRAPED_CONTENT+=$(echo "$SCRAPED_JSON" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for item in data:
        if item.get('success'):
            title = item.get('title', 'Sans titre')
            url = item.get('url', '')
            content = item.get('content', '')
            domain = item.get('domain', '')
            print(f\"**{title}** ({domain})\n{url}\n\n{content[:400]}...\n\n---\n\n\")
        elif item.get('error'):
            print(f\"⚠️ {item['url']}: erreur de scraping\n\n\")
except Exception as e:
    print(f\"Erreur parsing JSON: {e}\")
" 2>/dev/null || echo "*Scraping en cours...*")
else
    SCRAPED_CONTENT="*Aucune URL extraite pour scraping*"
fi

# Générer le fichier Flash
FLASH_FILE="$VEILLE_DIR/daily-flash/$DATE/12h-flash.md"

cat > "$FLASH_FILE" << EOF
# ⚡ Flash IA - $DATE - 12h00 (Midi) — v2 Fraîcheur + Scraping

**Type** : Flash rapide (contenu des dernières 72h)  
**Filtre** : 7 jours (Perplexity)  
**Généré le** : $(date '+%d/%m/%Y à %H:%M')

---

## 🔍 Requêtes exécutées

$(for q in "${FLASH_QUERIES[@]}"; do echo "- $q"; done)

---

## 📰 Synthèse Perplexity

$FLASH_OUTPUT

---

## 🔗 Contenus Scrapés (détail)

$SCRAPED_CONTENT

---

*Veille automatique — Perplexity AI + Scrapling*
EOF

echo "✅ Flash midi sauvegardé : $FLASH_FILE"

# === COMMIT & PUSH ===
echo ""
echo "🔄 Commit et push GitHub..."
cd "$BASE_DIR"
git add -A
git commit -m "☀️ Veille IA 12h v2 — $DATE — Fraîcheur 72h + scraping" || echo "Rien à committer"
git push origin main || echo "Push impossible (vérifiez la connexion)"

# === RÉSUMÉ ===
echo ""
echo "==================================="
echo "🎉 Veille 12h terminée !"
echo "Filtre fraîcheur : 7 jours"
echo "URLs scrapées : $(echo "$URLS" | wc -l)"
echo "Fichier : daily-flash/$DATE/12h-flash.md"
echo "==================================="

# Retourner le résumé pour le cron
if [ -f "$FLASH_FILE" ]; then
    echo ""
    echo "📋 RÉSUMÉ VEILLE 12H :"
    echo "- Flash 5 min (fraîcheur) : $(wc -l < "$FLASH_FILE") lignes"
    echo "- URLs scrapées : $(echo "$URLS" | wc -l)"
    echo "- Articles enrichis ✅"
    echo "- Fichier commité ✅"
fi
