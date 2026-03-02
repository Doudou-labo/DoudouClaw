---
date: 2026-03-02
category: new-capability
severity: medium
status: applied
impact: Workflow screenshot Discord fonctionnel et documenté
related: []
evolution_event_id: evt-1771442400-screenshot-discord
---

# Workflow Screenshot Discord via Playwright MCP

## Context

Tentative d'envoi de screenshot pris avec Playwright MCP sur Discord. 
- Première tentative : tool `message` avec paramètre `media` → échec (token non détecté)
- Deuxième tentative : syntaxe `MEDIA:` avec chemin absolu → bloqué par sécurité

## Lesson

Le workflow correct pour envoyer des images/screenshots sur Discord via OpenClaw :
1. **Méthode recommandée** : tool `read` avec chemin relatif (`./screenshot.png`)
2. **Alternative** : syntaxe inline `MEDIA:./screenshot.png` dans le texte
3. **Contraintes** : chemins relatifs obligatoires, absolus (`/...`) et `~` bloqués

## Applied Fix

### Documentation
- Mise à jour `TOOLS.md` : section "Envoi de screenshots sur Discord" ajoutée
- Création `scripts/send-screenshot-discord.sh` : helper pour futurs usages

### Mémoire
- `MEMORY.md` : workflow enregistré en mémoire long terme
- `.learnings/LEARNINGS.md` : learning standard (LRN-20250302-001)
- `.learnings/discord-screenshot-workflow.md` : learning enrichi YAML (ce fichier)

### Configuration
- `config/mcporter.json` : Playwright MCP configuré avec `--no-sandbox`
- Chrome 145 installé avec dépendances

## Impact Measured

- ✅ Démo Playwright MCP complète : navigate → click → screenshot → envoi
- ✅ Screenshot reçu sur Discord (780x6023 px, full page)
- ✅ Workflow documenté et reproductible
- ⚠️ Images très grandes (>6000px) = latence d'affichage sur Discord

## Notes

- Le tool `message` avec `media` nécessite un token bot Discord configuré ET un restart Gateway pour être fonctionnel
- Préférer systématiquement `read` tool pour les images/screenshots
- À noter : images très grandes peuvent être lentes à afficher, mais finissent par apparaître
