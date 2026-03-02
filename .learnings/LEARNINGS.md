# Learnings - Self-Improvement Log

> Log des apprentissages, corrections et meilleures pratiques pour amélioration continue.

---

## [LRN-20250302-001] best_practice

**Logged**: 2026-03-02T22:18:00Z
**Priority**: high
**Status**: promoted
**Area**: config

### Summary
Workflow correct pour envoyer des screenshots sur Discord via OpenClaw : utiliser `read` tool avec chemin relatif, pas `message` tool.

### Details
**Problème initial :** Tentative d'envoi de screenshot via `message` tool avec paramètre `media` → erreur "Discord bot token missing".

**Investigation :** Le token Discord est bien configuré dans `~/.openclaw/openclaw.json`, mais le tool `message` ne le détecte pas (probablement besoin de restart Gateway).

**Solution trouvée :** Utiliser le tool `read` sur le fichier image avec un chemin relatif :
```json
{ "file_path": "./screenshot.png" }
```
L'image est alors automatiquement attachée à la réponse Discord.

**Alternative :** Syntaxe inline `MEDIA:./screenshot.png` dans le texte de réponse.

### Contraintes importantes
- ✅ Chemins relatifs uniquement (`./`, `../`)
- ❌ Chemins absolus (`/...`) et `~` bloqués par sécurité
- ⚠️ Images très grandes (>6000px hauteur) peuvent mettre du temps à s'afficher

### Suggested Action
- Toujours préférer `read` tool pour les screenshots/images
- Documenter dans TOOLS.md (fait ✓)
- Créer helper script (fait ✓)

### Metadata
- Source: user_feedback
- Related Files: TOOLS.md, scripts/send-screenshot-discord.sh
- Tags: discord, screenshot, playwright, mcp
- See Also: -

### Resolution
- **Resolved**: 2026-03-02T22:20:00Z
- **Promoted**: TOOLS.md (section Playwright MCP), MEMORY.md
- **Notes**: Workflow documenté et automatisable dorénavant

---
