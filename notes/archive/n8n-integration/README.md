# 🔌 n8n ↔ OpenClaw Integration Guide

> n8n self-hosted sur https://n8n.doudougen.xyz avec connexion bidirectionnelle à DoudouClaw

---

## ✅ Statut actuel

| Élément | Valeur |
|---------|--------|
| **URL publique** | https://n8n.doudougen.xyz |
| **Port local** | 5678 |
| **Auth** | Basic (DoudouClaw / même mot de passe que ClawSuite) |
| **Data persistée** | /root/n8n/data |
| **Compose** | /root/n8n/docker-compose.yml |
| **Reverse Proxy** | Caddy (SSL auto) |

---

## 🔐 Accès Web

### URL
```
https://n8n.doudougen.xyz
```

### Login
- **Username:** DoudouClaw
- **Password:** *(même que ClawSuite/metry/etc.)*

Ou en local directement (si besoin) :
```
http://localhost:5678
Login: doudou / n8n-secure-2026
```

---

## 🔗 Comment je me connecte à n8n (OpenClaw → n8n)

### Méthode 1 : Webhooks n8n (Recommandée)

Dans n8n, crée un workflow avec le trigger **Webhook** :

1. **Ajoute un node "Webhook"**
2. **Méthode** : POST (ou GET)
3. **Path** : `/webhook/test` (par exemple)
4. **URL complète générée** : `https://n8n.doudougen.xyz/webhook/test`

Cette URL peut être appelée par OpenClaw via un script ou un skill :

```bash
# Exemple d'appel depuis OpenClaw
curl -X POST "https://n8n.doudougen.xyz/webhook/mon-workflow" \
  -H "Content-Type: application/json" \
  -u "DoudouClaw:motdepasse" \
  -d '{"event": "rappel", "message": "Hello depuis OpenClaw"}'
```

### Méthode 2 : API n8n REST (Actions avancées)

L'API n8n permet de :
- Lister les workflows
- Activer/désactiver des workflows
- Voir l'état des exécutions
- Déclencher des workflows programmatiquement

```bash
# Lister les workflows
curl -u "doudou:n8n-secure-2026" \
  "http://localhost:5678/api/v1/workflows"

# Activer un workflow
curl -X PATCH -u "doudou:n8n-secure-2026" \
  "http://localhost:5678/api/v1/workflows/WORKFLOW_ID/activate"

# Déclencher un workflow via l'API (pas webhook)
curl -X POST -u "doudou:n8n-secure-2026" \
  "http://localhost:5678/api/v1/workflows/WORKFLOW_ID/execute"
```

---

## 🔗 Comment n8n me parle (n8n → OpenClaw)

Dans n8n, utilise le node **HTTP Request** pour m'envoyer des messages :

### Configuration

```
Méthode: POST
URL: https://gateway.maton.ai/message/send
Authentication: None (ou Header Auth si tu configures un token)
Headers:
  Content-Type: application/json

Body (JSON):
{
  "channel": "discord",
  "target": "1482864757466861618",
  "message": "🎉 Message depuis n8n !"
}
```

### Exemple de workflow

```
[Schedule Trigger] → [HTTP Request] → [Discord via OpenClaw]
     (tous les     →   (appel API    →   (message reçu)
      jours à 9h)      OpenClaw)
```

---

## 🛡️ Isolation Docker (Réponse à ta question)

**Non, n8n n'altère PAS OpenClaw.** Voici pourquoi :

| Aspect | Protection |
|--------|------------|
| **Processus** | n8n tourne dans son propre container Docker |
| **Réseau** | Port 5678 isolé, pas de conflit avec OpenClaw (18789) |
| **Fichiers** | Data n8n dans `/root/n8n/data`, séparé du workspace |
| **Ressources** | Limites CPU/memory configurées (max 1 CPU, 1GB RAM) |
| **Dépendances** | Aucune dépendance commune avec OpenClaw |

**Tes apps actuelles :**
- OpenClaw Gateway : port 18789
- ClawSuite : port 3000
- ClawBridge : port 3001
- Pneu Tracker : port 3002
- **n8n : port 5678** ← nouveau, aucun conflit

---

## 🛠️ Commandes utiles

```bash
# Voir les logs n8n
docker logs n8n-n8n-1 -f

# Redémarrer n8n
cd /root/n8n && docker compose restart

# Mettre à jour n8n
cd /root/n8n && docker compose pull && docker compose up -d

# Backup des données
tar -czf ~/backup-n8n-$(date +%Y%m%d).tar.gz /root/n8n/data

# Statut du container
docker ps | grep n8n
```

---

## 🚀 Workflows exemples à créer

### 1. Notification quotidienne Discord
```
[Schedule (cron 0 9 * * *)] → [HTTP Request → OpenClaw] → Message Discord
```

### 2. Rappel de tâches CRM
```
[Schedule] → [Query SQLite CRM] → [Filter relances] → [HTTP Request → OpenClaw]
```

### 3. Traitement de données par OpenClaw
```
[Webhook n8n] ← [OpenClaw envoie données] → [n8n traite] → [HTTP Request retour]
```

### 4. Backup automatique + notification
```
[Schedule daily] → [Exec Command backup] → [HTTP Request → OpenClaw notify]
```

---

## 🔧 Créer un skill OpenClaw pour n8n (Option avancée)

Je peux créer un skill qui expose des outils comme :
- `n8n_trigger_workflow` : Déclenche un workflow via webhook
- `n8n_list_workflows` : Liste les workflows disponibles
- `n8n_get_execution` : Vérifie le statut d'une exécution

Tu veux que je le crée ?

---

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [n8n Workflows Community](https://n8n.io/workflows/)
- [API n8n](https://docs.n8n.io/api/)

---

*Installation : 15 mars 2026*
