# 🔍 Veille IA - Documentation

> Système de veille automatisée sur l'Intelligence Artificielle via Perplexity

---

## 📅 Calendrier des Veilles

| Horaire | Type | Contenu | Jours |
|---------|------|---------|-------|
| **8h00** | Flash + Deep Dive | Actualités matin + Analyse approfondie | Tous les jours |
| **12h00** | Flash 5 min | Actualités de la matinée | Tous les jours |
| **19h00** | Flash + Deep Dive | Récap journée + Analyse complémentaire | Tous les jours |

**Synthèse stratégique** : 15 et 30 de chaque mois (28 pour février)

---

## 📂 Structure PARA

```
notes/areas/veille-ia/
├── mots-cles-veille.md          # Requêtes Perplexity optimisées
├── sources-trustees.md          # Liste des sources fiables
├── README.md                    # Cette documentation
├── daily-flash/                 # Généré automatiquement
│   └── YYYY-MM-DD/
│       ├── 08h-flash.md
│       ├── 12h-flash.md
│       └── 19h-flash.md
├── deep-dives/                  # Généré automatiquement
│   └── YYYY-MM-DD/
│       ├── 08h-deep-dive-{theme}.md
│       └── 19h-deep-dive-{theme}.md
└── syntheses-mensuelles/        # Généré automatiquement
    └── synthese-YYYY-MM-DD.md
```

---

## 🎯 Thèmes Hebdomadaires

| Jour | Thème Matin | Thème Soir |
|------|-------------|------------|
| Lundi | 🤖 Tech | Infrastructure & Hardware |
| Mardi | 🛠️ Produits | Automatisation Enterprise |
| Mercredi | ⚖️ Régulation | Éthique & Responsabilité |
| Jeudi | 💼 Business | Écosystème Startup |
| Vendredi | 🚗 Sectoriel | Digitalisation Auto |
| Samedi | 🌟 Émergent | Paradigmes Émergents |
| Dimanche | 📊 Récap | Analyse Hebdomadaire |

---

## 🚀 Scripts

### Scripts de Veille Quotidienne

```bash
# Veille 8h (Flash + Deep Dive)
bash scripts/veille-ia-08h.sh

# Veille 12h (Flash uniquement)
bash scripts/veille-ia-12h.sh

# Veille 19h (Flash + Deep Dive)
bash scripts/veille-ia-19h.sh
```

### Script de Synthèse Mensuelle

```bash
# Synthèse stratégique (15 et 30 du mois)
bash scripts/veille-ia-synthese-mensuelle.sh
```

---

## ⚙️ Configuration des Crons

Les crons sont configurés dans OpenClaw avec livraison sur Discord.

### 📬 Canal de livraison

Toutes les veilles sont livrées sur le channel Discord : **🔍-ᴠᴇɪʟʟᴇ-ɪᴀ** (ID: `1475604437505413211`)

### Veille 8h00
```json
{
  "id": "🌅 Veille IA - 8h00",
  "schedule": "0 8 * * *",
  "timezone": "Europe/Paris",
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Exécute le script de veille IA 8h"
  },
  "delivery": {
    "mode": "announce",
    "channel": "discord",
    "to": "1475604437505413211"
  }
}
```

### Veille 12h00
```json
{
  "id": "☀️ Veille IA - 12h00",
  "schedule": "0 12 * * *",
  "timezone": "Europe/Paris",
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Exécute le script de veille IA 12h"
  },
  "delivery": {
    "mode": "announce",
    "channel": "discord",
    "to": "1475604437505413211"
  }
}
```

### Veille 19h00
```json
{
  "id": "🌆 Veille IA - 19h00",
  "schedule": "0 19 * * *",
  "timezone": "Europe/Paris",
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Exécute le script de veille IA 19h"
  },
  "delivery": {
    "mode": "announce",
    "channel": "discord",
    "to": "1475604437505413211"
  }
}
```

### Synthèse Mensuelle (15 du mois)
```json
{
  "id": "📊 Veille IA - Synthèse Mensuelle (15)",
  "schedule": "0 9 15 * *",
  "timezone": "Europe/Paris",
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Exécute le script de synthèse mensuelle IA"
  },
  "delivery": {
    "mode": "announce",
    "channel": "discord",
    "to": "1475604437505413211"
  }
}
```

### Synthèse Mensuelle (30/28 du mois)
```json
{
  "id": "📊 Veille IA - Synthèse Mensuelle (30/28)",
  "schedule": "0 9 28,29,30,31 * *",
  "timezone": "Europe/Paris",
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Exécute le script de synthèse mensuelle IA"
  },
  "delivery": {
    "mode": "announce",
    "channel": "discord",
    "to": "1475604437505413211"
  }
}
```

---

## 📊 Format des Rapports

### Flash 5 min
- ⚡ Titre avec emoji
- Date et heure de génération
- Liste des requêtes exécutées
- Résultats bruts Perplexity
- Footer avec source

### Deep Dive
- 🔬 Titre avec thème
- Contexte et focus
- Requêtes détaillées
- Analyse approfondie
- Points clés à retenir (à compléter)
- Actions/recommandations (à compléter)

### Synthèse Stratégique
- 📊 Titre avec période
- Sommaire avec liens
- 5 sections thématiques
- Insights et recommandations
- Perspectives à surveiller

---

## 🔧 Maintenance

### Mise à jour des requêtes
Modifier `notes/areas/veille-ia/mots-cles-veille.md`

### Ajout de sources
Modifier `notes/areas/veille-ia/sources-trustees.md`

### Changement de thèmes
Éditer les scripts :
- `scripts/veille-ia-08h.sh`
- `scripts/veille-ia-19h.sh`

---

## 💡 Bonnes Pratiques

1. **Vérifier les sources** : Perplexity cite ses sources, toujours les valider
2. **Compléter manuellement** : Les sections "Insights" et "Actions" nécessitent une relecture
3. **Archiver** : Déplacer les synthèses anciennes dans `notes/archive/` après 6 mois
4. **Cross-check** : Croiser avec les sources trustées listées

---

## 🐛 Dépannage

### Perplexity ne répond pas
```bash
# Vérifier la clé API
echo $PERPLEXITY_API_KEY

# Tester manuellement
cd skills/perplexity
node scripts/search.mjs "test query"
```

### Git push en échec
```bash
# Vérifier le statut
git status

# Forcer le push si nécessaire (avec précaution)
git pull origin main --rebase
git push origin main
```

---

*Système de veille IA - Version 1.0*  
*Créé pour DoudouClaw - 2026*
