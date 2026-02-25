# Mission Control - Configuration Dashboard

## 📍 Localisation
`~/.openclaw/openclaw-mission-control/`

## 🌐 Accès distant (HTTPS + Auth)
- **URL:** https://dashboard.doudougen.xyz
- **Auth:** Basic Auth (login/pass)
- **SSL:** Let's Encrypt auto (géré par Caddy)

## 🚀 Installation
```bash
cd ~/.openclaw
git clone https://github.com/robsannaa/openclaw-mission-control.git
cd openclaw-mission-control
./setup.sh
```

## 🔧 Service systemd
Le dashboard tourne en background via:
```bash
systemctl --user status openclaw-dashboard
```

## 🌐 Reverse Proxy (Caddy)

### Configuration
Fichier: `/etc/caddy/Caddyfile`
```
dashboard.doudougen.xyz {
    basicauth {
        doudou $2a$14$...hash_bcrypt...
    }

    reverse_proxy 127.0.0.1:3333
}
```

### Générer un nouveau mot de passe
```bash
# Générer le hash
sudo caddy hash-password --plaintext 'TON_MDP'

# Modifier le Caddyfile avec le nouveau hash
sudo nano /etc/caddy/Caddyfile

# Recharger Caddy
sudo caddy reload --config /etc/caddy/Caddyfile
```

### DNS requis (Hostinger)
| Type | Nom | Contenu | TTL |
|------|-----|---------|-----|
| A | dashboard | 76.13.32.35 | 300 |

## 🛠️ Fonctionnalités disponibles
- Dashboard avec stats en temps réel
- Chat avec agents OpenClaw
- Gestion des agents et sous-agents
- Memory (édition journal + LTM)
- Cron Jobs (view/create/edit/trigger)
- Models (runtime/config)
- Skills & ClawHub
- Browser Relay
- Terminal intégré
- Vector DB search
- Logs & Usage analytics

## 📅 Date d'installation
2026-02-25

## ✅ Checklist post-install
- [x] Mission Control installé et démarré
- [x] DNS A record configuré sur Hostinger
- [x] Reverse proxy Caddy configuré
- [x] SSL Let's Encrypt actif
- [x] Authentification Basic Auth activée
- [ ] Changer le mot de passe temporaire
