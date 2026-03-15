# 🔌 n8n ↔ OpenClaw Integration Guide

> Comment connecter n8n à DoudouClaw pour des automations puissantes

---

## ✅ Statut actuel

| Élément | Statut |
|---------|--------|
| n8n installé | ✅ Oui (Docker) |
| Port | 5678 |
| URL locale | http://localhost:5678 |
| Auth | Basic (doudou / n8n-secure-2026) |
| Data persistée | /root/n8n/data |
| Compose | /root/n8n/docker-compose.yml |

---

## 🌐 Accès Web

### Option 1 : Tailscale Serve (Recommandé - le plus simple)
```bash
# Activer Tailscale serve (nécessite login web)
tailscale serve --bg --https 5678 http://localhost:5678

# URL résultante : https://n8n.doudougen.xyz (ou ton nom de machine Tailscale)
```

**Activation requise :** Visite https://login.tailscale.com/f/serve?node=nqsEmqrgih11CNTRL

### Option 2 : Nginx Reverse Proxy
```bash
# Copier la config Nginx
sudo cp /root/n8n/nginx-n8n.conf /etc/nginx/sites-available/n8n
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Option 3 : Accès direct Tailscale (développement)
```
http://100.89.4.88:5678
```

---

## 🔗 Connexion OpenClaw ↔ n8n

### Méthode 1 : n8n appelle OpenClaw (Webhook entrant)

Dans n8n, utilise le node **HTTP Request** pour appeler OpenClaw :

```
Méthode: POST
URL: https://gateway.maton.ai/message/send
Headers:
  - Authorization: Bearer <GATEWAY_TOKEN>
  - Content-Type: application/json

Body (JSON):
{
  "channel": "discord",
  "target": "1482864757466861618",
  "message": "Message depuis n8n !"
}
```

### Méthode 2 : OpenClaw appelle n8n (Webhook n8n)

Dans n8n, crée un workflow avec le trigger **Webhook** :

1. Ajoute un node "Webhook"
2. Méthode : POST (ou GET)
3. URL générée : `https://n8n.doudougen.xyz/webhook/xxxx-xxxx`
4. Copie cette URL pour l'utiliser dans OpenClaw

Dans OpenClaw (via script ou skill) :
```bash
curl -X POST "https://n8n.doudougen.xyz/webhook/xxxx-xxxx" \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": "hello"}'
```

### Méthode 3 : Plugin OpenClaw pour n8n (Avancé)

Créer un plugin OpenClaw qui expose des tools spécifiques pour n8n :
- `n8n.trigger_workflow`
- `n8n.get_execution_status`
- `n8n.list_workflows`

---

## 🛠️ Workflows exemples

### Workflow 1 : Notification Discord depuis n8n
```
[Schedule Trigger] → [HTTP Request] → [OpenClaw Discord]
     (cron)              (POST gateway)      (message envoyé)
```

### Workflow 2 : Traitement de données par OpenClaw
```
[Webhook n8n] ← [OpenClaw envoie données] → [n8n traite] → [Webhook retour OpenClaw]
```

### Workflow 3 : Backup automatique
```
[Schedule daily] → [Execute Command] → [Compress data] → [HTTP Request → OpenClaw notify]
```

---

## 🔐 Sécurité

### Credentials à stocker dans n8n

Dans n8n : **Settings → Credentials**

1. **OpenClaw Gateway**
   - Name: `OpenClaw Gateway`
   - Type: `HTTP Header Auth`
   - Header: `Authorization`
   - Value: `Bearer <ton_gateway_token>`

2. **Tailscale/Server**
   - Stocke les tokens sécurisés dans les credentials n8n

### Restrictions IP

Pour le webhook n8n, limite l'accès à :
- 127.0.0.1 (local)
- 100.89.4.88 (Tailscale serveur)
- IPs OpenClaw gateway

---

## 📋 Commandes utiles

```bash
# Voir les logs n8n
docker logs n8n-n8n-1 -f

# Redémarrer n8n
cd /root/n8n && docker compose restart

# Mettre à jour n8n
cd /root/n8n && docker compose pull && docker compose up -d

# Backup des données
tar -czf /backup/n8n-$(date +%Y%m%d).tar.gz /root/n8n/data

# Accès base de données SQLite (optionnel)
docker exec -it n8n-n8n-1 sh
sqlite3 /home/node/.n8n/database.sqlite
```

---

## 🚀 Prochaines étapes suggérées

1. **Configurer l'accès HTTPS** via Tailscale serve ou Nginx
2. **Créer un premier workflow** de test (webhook → Discord via OpenClaw)
3. **Migrer des automatisations existantes** (crons, scripts) vers n8n
4. **Créer des templates** réutilisables pour les cas d'usage fréquents

---

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [n8n Workflows Community](https://n8n.io/workflows/)
- [OpenClaw Gateway API](https://docs.openclaw.ai/api)

---

*Installation : 15 mars 2026*
