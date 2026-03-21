# Plan d'intégration Actual Budget — DoudouClaw

> Alexandre veut un tracker financier complet intégré à son assistant IA.
> Ce document détaille l'installation complète de A à Z.

---

## 🎯 Objectif

- **Actual Budget** auto-hébergé sur le VPS (port 5006)
- Accessible via `https://budget.doudougen.xyz` (Caddy reverse proxy)
- **Skill OpenClaw** `thisisjeron/actual-budget` installé pour interaction en langage naturel
- Alexandre pose une question → DoudouClaw interroge Actual → réponse en français

---

## 📋 Prérequis

- VPS avec Docker installé ✅
- Caddy en place ✅
- Nom de domaine `doudougen.xyz` pointing vers le VPS ✅
- Accès SSH root ou sudo au VPS
- Wallet/backup du VPS à jour (toujours faire un snapshot avant)

---

## 🔧 Architecture

```
                              ┌─────────────────┐
                              │  Caddy (443)    │
                              │  actual.doudougen│
                              └────────┬────────┘
                                       │ reverse proxy
                              ┌────────▼────────┐
                              │ Actual Budget   │
                              │ Docker :5006    │
                              │ UI web native   │
                              └────────┬────────┘
                                       │ filesystem
                              ┌────────▼────────┐
                              │ ./actual-data/  │
                              │ (volume Docker) │
                              └─────────────────┘

Alexandre → DoudouClaw → Skill thisisjeron/actual-budget → @actual-app/api (Node.js)
```

---

## 📦 Étapes d'installation

### Étape 1 — Snapshot VPS (sécurité)

> Avant toute modification, faire un snapshot/backup du VPS.

```bash
# ou via ton provider VPS (DigitalOcean, Hetzner, etc.)
```

### Étape 2 — Créer le fichier .env

```bash
# Fichier à créer : /root/.openclaw/workspace/notes/projects/actual-budget-integration/.env
ACTUAL_SERVER_URL=http://localhost:5006
ACTUAL_PASSWORD=TON_MOT_DE_PASSE_FORT
ACTUAL_SYNC_ID=TON_SYNC_ID
```

⚠️ **Ne JAMAIS commiter ce fichier** — il est dans `.gitignore`.

### Étape 3 — Démarrer Actual Budget (Docker Compose)

```bash
cd /root/.openclaw/workspace/notes/projects/actual-budget-integration
docker compose up -d
```

Vérifier :
```bash
docker compose ps
curl -f http://localhost:5006
```

### Étape 4 — Configurer Caddy (reverse proxy HTTPS)

Ajouter le bloc dans `/etc/caddy/Caddyfile` :

```
budget.doudougen.xyz {
    reverse_proxy localhost:5006
    basic_auth DoudouClaw MOT_DE_PASSE_CADDY
}
```

Recharger Caddy :
```bash
sudo caddy reload --config /etc/caddy/Caddyfile
```

### Étape 5 — Récupérer le SYNC_ID

1. Ouvrir `https://budget.doudougen.xyz` dans le navigateur
2. Créer un budget (ou en ouvrir un existant)
3. Le **SYNC_ID** apparaît dans l'URL ou dans les settings du budget
4. Reporter dans le `.env` : `ACTUAL_SYNC_ID=xxx`

### Étape 6 — Installer le skill ClawHub

```bash
clawhub install thisisjeron/actual-budget
```

Vérifier :
```bash
clawhub list
openclaw skills list
```

### Étape 7 — Configurer les variables d'environnement du skill

Le skill lit les variables :
- `ACTUAL_SERVER_URL` → `http://actual:5006` (depuis le réseau Docker)
- `ACTUAL_PASSWORD` → mot de passe du budget
- `ACTUAL_SYNC_ID` → ID du budget

Les ajouter dans la config OpenClaw ou via `gateway config.patch` :
```json
{
  "env": {
    "ACTUAL_SERVER_URL": "http://actual:5006",
    "ACTUAL_PASSWORD": "TON_MOT_DE_PASSE_FORT",
    "ACTUAL_SYNC_ID": "TON_SYNC_ID"
  }
}
```

Puis redémarrer le gateway :
```bash
openclaw gateway restart
```

### Étape 8 — Premier test

```bash
cd /root/.openclaw/workspace/notes/projects/actual-budget-integration
bash scripts/test-actual-connection.sh
```

---

## 🔄 Opérations quotidiennes

### Voir l'état des services
```bash
cd /root/.openclaw/workspace/notes/projects/actual-budget-integration
docker compose ps
```

### Logs
```bash
docker compose logs -f actual
```

### Redémarrer
```bash
docker compose restart actual
```

### Backup des données
```bash
tar czf actual-data-backup-$(date +%Y%m%d).tar.gz actual-data/
```

### Stopper / Supprimer
```bash
docker compose down          # stop
docker compose down -v      # stop + supprime les volumes
```

---

## 🔒 Sécurité

- Le `.env` contient le mot de passe du budget → **jamais commiter**
- Caddy impose `basic_auth` → seul DoudouClaw (user) peut accéder
- Les credentials du budget sont stockés dans les variables d'env du gateway OpenClaw
- Le port 5006 n'est exposé que sur `localhost` (jamais directement sur Internet)

---

## 🚀 Checklist post-installation

- [ ] `docker compose ps` → container "running"
- [ ] `curl http://localhost:5006` → 200 OK
- [ ] `https://budget.doudougen.xyz` → UI Actual Budget accessible (auth Caddy)
- [ ] Skill `thisisjeron/actual-budget` installé → `clawhub list`
- [ ] Variables d'env configurées dans OpenClaw
- [ ] Gateway redémarré après config
- [ ] `bash scripts/test-actual-connection.sh` → connexion API OK
- [ ] Premier test de query : "Quel est mon solde actuel ?"
- [ ] .env créé et non commité
- [ ] Git push des fichiers du projet

---

## 🗂️ Fichiers du projet

```
notes/projects/actual-budget-integration/
├── PLAN.md                          ← Ce fichier
├── docker-compose.yml               ← Docker Compose
├── caddy-actual.conf                ← Bloc Caddy
├── .env.example                     ← Template .env (sans secrets)
├── scripts/
│   ├── install-actual-budget.sh     ← Script d'installation one-shot
│   └── test-actual-connection.sh    ← Test connexion API
├── skill-config/
│   └── actual-budget-env.md         ← Variables d'env du skill
└── USAGE-GUIDE.md                   ← Guide d'utilisation Alexandre
```

---

## 📞 Support / Dépannage

| Symptôme | Cause probable | Solution |
|----------|---------------|----------|
| Container KO | Crash au démarrage | `docker compose logs actual` |
| 502 Bad Gateway | Caddy ne trouve pas le conteneur | Vérifier le port dans docker-compose |
| Auth Caddy échoue | Mauvais mot de passe | Relire `caddy-actual.conf` |
| Skill ne trouve pas le budget | SYNC_ID erroné | Vérifier dans les settings Actual |
| `ACTUAL_SYNC_ID` non trouvé | Budget pas encore créé | Créer le budget dans l'UI d'abord |
