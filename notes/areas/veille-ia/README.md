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
├── daily-flash/                 # Captures quotidiennes
│   └── YYYY-MM-DD/
│       ├── 08h-flash.md
│       ├── 12h-flash.md
│       └── 19h-flash.md
├── deep-dives/                  # Analyses approfondies
│   └── YYYY-MM-DD/
│       ├── 08h-deep-dive-{theme}.md
│       └── 19h-deep-dive-{theme}.md
└── syntheses-mensuelles/        # Rapports stratégiques
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

Les crons sont configurés dans OpenClaw avec les paramètres suivants :

### Veille 8h00
```json
{
  "id": "veille-ia-08h",
  "schedule": "0 8 * * *",
  "timezone": "Europe/Paris",
  "command": "bash /root/.openclaw/workspace/scripts/veille-ia-08h.sh",
  "delivery": {
    "mode": "announce",
    "target": "telegram",
    "topic": "veille-ia"
  }
}
```

### Veille 12h00
```json
{
  "id": "veille-ia-12h",
  "schedule": "0 12 * * *",
  "timezone": "Europe/Paris",
  "command": "bash /root/.openclaw/workspace/scripts/veille-ia-12h.sh",
  "delivery": {
    "mode": "announce",
    "target": "telegram",
    "topic": "veille-ia"
  }
}
```

### Veille 19h00
```json
{
  "id": "veille-ia-19h",
  "schedule": "0 19 * * *",
  "timezone": "Europe/Paris",
  "command": "bash /root/.openclaw/workspace/scripts/veille-ia-19h.sh",
  "delivery": {
    "mode": "announce",
    "target": "telegram",
    "topic": "veille-ia"
  }
}
```

### Synthèse Mensuelle (15 du mois)
```json
{
  "id": "veille-ia-synthese-15",
  "schedule": "0 9 15 * *",
  "timezone": "Europe/Paris",
  "command": "bash /root/.openclaw/workspace/scripts/veille-ia-synthese-mensuelle.sh",
  "delivery": {
    "mode": "announce",
    "target": "telegram",
    "topic": "veille-ia"
  }
}
```

### Synthèse Mensuelle (30 du mois - 28 pour février)
```json
{
  "id": "veille-ia-synthese-30",
  "schedule": "0 9 28-31 * *",
  "timezone": "Europe/Paris",
  "command": "bash /root/.openclaw/workspace/scripts/veille-ia-synthese-mensuelle.sh",
  "condition": "test $(date +\%d) -eq 30 || (test $(date +\%m) -eq 2 \&\& test $(date +\%d) -eq 28)",
  "delivery": {
    "mode": "announce",
    "target": "telegram",
    "topic": "veille-ia"
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
