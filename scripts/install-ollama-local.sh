#!/bin/bash
# install-ollama-local.sh - Installe Ollama et configure OpenClaw pour LLM local
# Usage: bash scripts/install-ollama-local.sh [modèle]
# Exemple: bash scripts/install-ollama-local.sh llama3.1:8b

set -e

MODEL="${1:-llama3.1:8b}"
OLLAMA_PORT=11434

echo "🦞 Installation LLM Local pour OpenClaw"
echo "======================================"
echo "Modèle cible: $MODEL"
echo "Port Ollama: $OLLAMA_PORT"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Vérifier les ressources
echo -e "${YELLOW}📊 Vérification des ressources...${NC}"
RAM_GB=$(free -g | awk '/^Mem:/{print $2}')
CPU_CORES=$(nproc)
echo "   RAM: ${RAM_GB}GB"
echo "   CPU: ${CPU_CORES} cœurs"

if [ "$RAM_GB" -lt 7 ]; then
    echo -e "${RED}⚠️  Warning: Moins de 8GB RAM détecté. Un modèle 7B-8B risque d'être lent.${NC}"
    read -p "Continuer quand même? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 2. Installer Ollama
echo -e "${YELLOW}🔧 Installation d'Ollama...${NC}"
if command -v ollama &> /dev/null; then
    echo "   Ollama déjà installé: $(ollama --version)"
else
    echo "   Téléchargement et installation..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo -e "${GREEN}   ✓ Ollama installé${NC}"
fi

# 3. Configurer le service pour écouter sur 0.0.0.0 (pour OpenClaw)
echo -e "${YELLOW}⚙️  Configuration du service Ollama...${NC}"
mkdir -p ~/.config/systemd/user

sudo tee /etc/systemd/system/ollama.service > /dev/null <<EOF
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=root
Group=root
Restart=always
RestartSec=3
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="OLLAMA_HOST=0.0.0.0:$OLLAMA_PORT"
Environment="OLLAMA_ORIGINS=*"

[Install]
WantedBy=default.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl restart ollama

echo -e "${GREEN}   ✓ Service configuré (écoute sur 0.0.0.0:$OLLAMA_PORT)${NC}"

# 4. Attendre que le service démarre
sleep 3

# 5. Télécharger le modèle
echo -e "${YELLOW}📥 Téléchargement du modèle $MODEL...${NC}"
echo "   (Cela peut prendre plusieurs minutes selon la connexion...)"
ollama pull "$MODEL"
echo -e "${GREEN}   ✓ Modèle $MODEL téléchargé${NC}"

# 6. Test rapide
echo -e "${YELLOW}🧪 Test rapide du modèle...${NC}"
curl -s http://localhost:$OLLAMA_PORT/api/generate -d "{
  \"model\": \"$MODEL\",
  \"prompt\": \"Bonjour! Dis-moi en une phrase si tu fonctionnes.\",
  \"stream\": false
}" | jq -r '.response' 2>/dev/null || echo "   (Test manuel: curl http://localhost:$OLLAMA_PORT/api/tags)"

echo -e "${GREEN}   ✓ Test terminé${NC}"

# 7. Créer le fichier de config pour OpenClaw
echo -e "${YELLOW}📝 Génération de la config OpenClaw...${NC}"

CONFIG_SNIPPET="
  // Provider Ollama Local - ajouter dans 'models.providers'
  \"ollama-local\": {
    \"baseUrl\": \"http://localhost:$OLLAMA_PORT/v1\",
    \"apiKey\": \"ollama\",
    \"auth\": \"api-key\",
    \"api\": \"openai-completions\",
    \"models\": [
      {
        \"id\": \"$MODEL\",
        \"name\": \"Local: $MODEL\",
        \"reasoning\": false,
        \"input\": [\"text\"],
        \"cost\": { \"input\": 0, \"output\": 0, \"cacheRead\": 0, \"cacheWrite\": 0 },
        \"contextWindow\": 8192,
        \"maxTokens\": 4096
      }
    ]
  }"

echo "$CONFIG_SNIPPET" > ~/.openclaw/ollama-config-snippet.json
echo -e "${GREEN}   ✓ Snippet de config sauvegardé dans ~/.openclaw/ollama-config-snippet.json${NC}"

# 8. Instructions finales
echo ""
echo -e "${GREEN}🎉 Installation terminée!${NC}"
echo ""
echo "======================================"
echo "📋 Prochaines étapes:"
echo ""
echo "1. Ajouter le provider dans ~/.openclaw/openclaw.json:"
echo "   - Dans 'models.providers', ajouter le bloc ollama-local"
echo "   - (voir ~/.openclaw/ollama-config-snippet.json)"
echo ""
echo "2. Ajouter le profil d'authentification dans 'auth.profiles':"
echo '   "ollama-local:default": { "provider": "ollama-local", "mode": "api_key" }'
echo ""
echo "3. Utiliser le modèle:"
echo "   /model ollama-local/$MODEL"
echo ""
echo "🔗 URLs utiles:"
echo "   API Ollama: http://localhost:$OLLAMA_PORT"
echo "   Liste modèles: curl http://localhost:$OLLAMA_PORT/api/tags"
echo "   Test: ollama run $MODEL"
echo ""
echo "💡 Autres modèles recommandés pour 8GB RAM:"
echo "   - qwen2.5:7b (excellent français)"
echo "   - mistral:7b (rapide)"
echo "   - gemma2:9b (Google, bonne qualité)"
echo "   - llama3.2:3b (léger, très rapide)"
echo ""
echo "   Pour installer: ollama pull <nom:tag>"
echo "======================================"
