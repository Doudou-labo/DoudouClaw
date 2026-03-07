# Déploiement serveur — Venus Beauté

Domaine cible: `venusbeaute.doudougen.xyz`

## 1) Pré-requis DNS

Créer l'entrée DNS:
- Type: `A`
- Nom: `venusbeaute`
- Cible: `76.13.32.35`
- TTL: `300`

Pas besoin de `www` pour que le site fonctionne.

---

## 2) Build de l'app Next.js

```bash
cd /root/.openclaw/workspace/venus-beaute
npm install
npm run build
```

---

## 3) Service systemd (app)

```bash
cp /root/.openclaw/workspace/venus-beaute/deploy/venus-beaute.service /etc/systemd/system/venus-beaute.service
systemctl daemon-reload
systemctl enable --now venus-beaute
systemctl status venus-beaute --no-pager
```

L'app écoute en local sur `127.0.0.1:3100`.

---

## 4A) Reverse proxy + SSL auto (recommandé): Caddy

```bash
cp /root/.openclaw/workspace/venus-beaute/deploy/Caddyfile /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
systemctl status caddy --no-pager
```

Caddy générera le certificat Let's Encrypt automatiquement.

---

## 4B) Alternative Nginx (si tu n'utilises pas Caddy)

```bash
cp /root/.openclaw/workspace/venus-beaute/deploy/nginx.conf /etc/nginx/sites-available/venus-beaute
ln -s /etc/nginx/sites-available/venus-beaute /etc/nginx/sites-enabled/venus-beaute
nginx -t
systemctl reload nginx
```

Pour SSL avec Nginx, ajoute Certbot ensuite.

---

## 5) Vérifications

```bash
curl -I http://127.0.0.1:3100
curl -I https://venusbeaute.doudougen.xyz
```

---

## 6) Mise à jour du site

```bash
cd /root/.openclaw/workspace/venus-beaute
git pull
npm install
npm run build
systemctl restart venus-beaute
```
