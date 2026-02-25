# Mission Control - Configuration Dashboard

## 📍 Localisation
`~/.openclaw/openclaw-mission-control/`

## 🌐 Accès
- **Local:** http://localhost:3333
- **Distant:** Configurer via Cloudflare Tunnel (voir ci-dessous)

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

## 🔒 Cloudflare Tunnel (Accès distant)

### 1. Installer cloudflared
```bash
# Ubuntu/Debian
curl -L https://pkg.cloudflare.com/cloudflare-main.gpg | sudo apt-key add -
echo "deb https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install cloudflared
```

### 2. Créer un tunnel
```bash
cloudflared tunnel login
cloudflared tunnel create openclaw-dashboard
```

### 3. Configurer le tunnel
Fichier: `~/.cloudflared/config.yml`
```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: dashboard.tondomaine.com
    service: http://localhost:3333
  - service: http_status:404
```

### 4. Démarrer le tunnel
```bash
cloudflared tunnel route dns <TUNNEL_ID> dashboard.tondomaine.com
cloudflared tunnel run <TUNNEL_ID>
```

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
