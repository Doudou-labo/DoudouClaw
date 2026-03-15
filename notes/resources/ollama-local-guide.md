# 🦞 Guide d'utilisation - LLM Local avec Ollama

> Installation complète d'un modèle LLM local (Llama 3.1 8B) sur VPS Hostinger KVM2

---

## 📊 Résumé de l'installation

| Ressource | Valeur |
|-----------|--------|
| **VPS** | Hostinger KVM2 |
| **RAM** | 8 GB |
| **CPU** | 2 cœurs |
| **Modèle** | Llama 3.1 8B (Q4_K_M) |
| **Port** | 11434 |
| **Service** | Ollama (systemd) |

---

## ✅ État de l'installation

- [x] Ollama installé
- [x] Service systemd configuré
- [x] API exposée sur `0.0.0.0:11434`
- [x] Modèle Llama 3.1 8B en cours de téléchargement
- [ ] Config OpenClaw à ajouter
- [ ] Test de l'API

---

## 🔧 Configuration OpenClaw

### 1. Ajouter le provider dans `~/.openclaw/openclaw.json`

Dans la section `models.providers`, ajouter :

```json
"ollama-local": {
  "baseUrl": "http://localhost:11434/v1",
  "apiKey": "ollama",
  "auth": "api-key",
  "api": "openai-completions",
  "models": [
    {
      "id": "llama3.1:8b",
      "name": "Local: Llama 3.1 8B",
      "reasoning": false,
      "input": ["text"],
      "cost": {
        "input": 0,
        "output": 0,
        "cacheRead": 0,
        "cacheWrite": 0
      },
      "contextWindow": 8192,
      "maxTokens": 4096
    }
  ]
}
```

### 2. Ajouter le profil d'authentification

Dans la section `auth.profiles`, ajouter :

```json
"ollama-local:default": {
  "provider": "ollama-local",
  "mode": "api_key"
}
```

### 3. (Optionnel) Définir comme modèle par défaut

Dans la section `agents.defaults.models`, remplacer ou ajouter :

```json
"default": "ollama-local/llama3.1:8b"
```

---

## 🚀 Utilisation

### Commandes Ollama (CLI)

```bash
# Lancer une conversation interactive
ollama run llama3.1:8b

# Voir les modèles installés
ollama list

# Supprimer un modèle
ollama rm llama3.1:8b

# Télécharger un autre modèle
ollama pull qwen2.5:7b
ollama pull mistral:7b
ollama pull gemma2:9b
```

### API REST

```bash
# Génération de texte
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "Explique le machine learning en 3 phrases",
  "stream": false
}'

# Chat (format conversation)
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.1:8b",
  "messages": [
    {"role": "user", "content": "Bonjour !"}
  ],
  "stream": false
}'

# Liste des modèles
curl http://localhost:11434/api/tags
```

### Dans OpenClaw

```bash
# Changer de modèle pour une session
/model ollama-local/llama3.1:8b

# Ou utiliser l'alias
/model local-llama
```

---

## 🧠 Autres modèles recommandés pour 8GB RAM

| Modèle | Taille | Usage |
|--------|--------|-------|
| `qwen2.5:7b` | ~4.5 GB | Excellent en français, bon raisonnement |
| `mistral:7b` | ~4.1 GB | Très rapide, bon pour du code |
| `gemma2:9b` | ~5.0 GB | Google, qualité proche Llama |
| `llama3.2:3b` | ~2.0 GB | Ultra-léger, très rapide |
| `phi4` | ~4.5 GB | Microsoft, bon rapport qualité/perf |

Installation :
```bash
ollama pull qwen2.5:7b
```

---

## 📈 Performance attendue (CPU only)

| Tâche | Tokens/sec | Latence |
|-------|-----------|---------|
| Chat simple | 15-25 t/s | ~1-2s |
| Génération longue | 20-30 t/s | fluide |
| Code | 10-20 t/s | acceptable |

> 💡 **Note** : En CPU pur (pas de GPU sur le VPS), c'est plus lent que les API cloud mais **gratuit et privé**.

---

## 🔒 Sécurité

Par défaut, Ollama écoute sur `0.0.0.0:11434` (toutes interfaces). Pour restreindre :

```bash
# Éditer le service
sudo systemctl edit ollama

# Ajouter :
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"

# Recharger
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Avec Tailscale, tu peux aussi restreindre à l'interface Tailscale :
```
Environment="OLLAMA_HOST=100.89.4.88:11434"
```

---

## 🛠️ Dépannage

### Le service ne démarre pas
```bash
sudo journalctl -u ollama -f
```

### Out of memory
- Utiliser un modèle plus petit (`llama3.2:3b`)
- Réduire `contextWindow` dans la config OpenClaw
- Ajouter du swap (déconseillé sur SSD)

### Lenteur excessive
- Normal en CPU pur pour les premiers tokens ("time to first token")
- Une fois le cache chaud, ça s'améliore
- Utiliser `ollama run` pour pré-charger le modèle en mémoire

---

## 📝 Créé le
2026-03-15 par DoudouClaw
