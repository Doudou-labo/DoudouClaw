# Doudou Mini App (MVP)

Mini app Telegram simple (HTML/CSS/JS), sans backend pour démarrer vite.

## Fichiers
- `index.html`
- `styles.css`
- `app.js`

## Déploiement rapide (Cloudflare Pages)
1. Crée un repo GitHub (ou utilise celui-ci)
2. Ajoute le dossier `miniapp/`
3. Va sur Cloudflare Pages → **Create project**
4. Connecte ton repo
5. Build command: *(vide)*
6. Output directory: `miniapp`
7. Deploy
8. Récupère l'URL HTTPS (ex: `https://doudou-mini.pages.dev`)

## Brancher dans BotFather
1. Ouvre `@BotFather` → `/mybots` → ton bot
2. **Bot Settings** → **Menu Button**
3. Colle l'URL HTTPS de la mini app
4. Save

## Test
- Ouvre ton bot Telegram
- Clique `Open`
- Clique un bouton dans la mini app: ça envoie un `sendData` au bot

## Notes
- Ce MVP stocke checklist/note en local (`localStorage`).
- Pour une vraie sync multi-appareils: ajouter un backend API (ou stockage via outils OpenClaw).
