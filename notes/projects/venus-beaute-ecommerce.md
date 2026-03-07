# Venus Beauté — E-commerce beauté en ligne

## Statut
En cours (MVP déployé pour aperçu)

## Objectif
Mettre en ligne une boutique e-commerce pour **Venus Beauté** avec identité visuelle **vert + blanc**, marché **France**, paiement **PayPal**.

## Décisions validées
- Nom de marque: **Venus Beauté**
- Thématique: **beauté & nature**
- Zone de vente: **France**
- Paiement: **PayPal**
- Domaine utilisé pour aperçu/prod: `venusbeaute.doudougen.xyz`
- DNS: enregistrement A `venusbeaute -> 76.13.32.35` (TTL 300)

## Implémentation réalisée
- Scaffold Next.js créé: `venus-beaute/`
- Pages MVP en place:
  - `/` (home)
  - `/boutique`
  - `/produit/[slug]`
  - `/checkout`
- Data produits de démonstration: `src/data/products.ts`
- Composant carte produit: `src/components/ProductCard.tsx`
- Config déploiement serveur préparée:
  - `deploy/Caddyfile`
  - `deploy/venus-beaute.service`
  - `deploy/nginx.conf`
  - `deploy/DEPLOY.md`
- Reverse proxy + HTTPS validés sur `https://venusbeaute.doudougen.xyz` (HTTP/2 200)

## Commits clés
- `a770065` — scaffold MVP boutique Venus Beauté
- `c4724d5` — configs prod serveur (Caddy/systemd/Nginx + guide)

## Prochaines actions
1. Créer un salon Discord dédié au projet (demande Doudou)
2. Recevoir la liste finale des produits + photos
3. Brancher les vraies données catalogue
4. Intégrer checkout PayPal réel (sandbox puis production)
5. Ajouter pages légales (CGV, mentions légales, politique confidentialité)
6. Activer emails transactionnels de commande
