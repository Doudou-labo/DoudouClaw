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

## [LRN-20260308-001] correction

**Logged**: 2026-03-08T16:52:00Z
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
La mémoire vectorielle (`memory_recall` / `memory_store`) est sous-utilisée par l’agent en pratique, même sans demande explicite de l’utilisateur.

### Details
L’utilisateur a signalé à juste titre que le nombre d’utilisations des outils `memory_*` sur 24h et 7 jours est très faible. En pratique, l’agent s’appuie souvent sur les fichiers N1 (`SESSION-STATE.md`, `MEMORY.md`, journaux du jour) et sur le contexte injecté, mais ne déclenche pas assez spontanément les outils de mémoire sémantique. Le comportement attendu est pourtant d’utiliser `memory_recall` avant les questions de contexte passé, et `memory_store` / miroir local après décisions, préférences, corrections et faits durables.

### Suggested Action
- Déclencher plus systématiquement `memory_recall` sur les questions de contexte, d’historique, de préférences et de décisions passées.
- Déclencher `memory_store` après corrections utilisateur, préférences stables, décisions et faits durables, puis faire le miroir local requis.
- Vérifier régulièrement les compteurs d’usage mémoire pour éviter une dérive silencieuse.

### Metadata
- Source: user_feedback
- Related Files: AGENTS.md, MEMORY.md, SESSION-STATE.md
- Tags: memory, recall, ltm, correction
- See Also: -

---

## [LRN-20260322-001] correction

**Logged**: 2026-03-22T17:00:00Z
**Priority**: high
**Status**: pending
**Area**: research

### Summary
Ne jamais répondre de mémoire sur des faits vérifiables — toujours faire une recherche web d'abord. Ça inclut (mais pas limité à) les specs de modèles LLM, prix, actu, stats, comparatifs, infos techniques.

### Details
Question posée : quels modèles supportent 1M tokens de contexte ?
Réponse initiale incorrecte : j'ai dit que Sonnet 4.6 était à 200k et GPT-5.4 à 128k, sans vérifier.
Réalité : Sonnet 4.6 et Opus 4.6 ont bien 1M tokens (sorti mars 2026), GPT-5.4 a 1.05M tokens.
Cause : réponse de mémoire statique sur des infos qui évoluent très rapidement.

### Suggested Action
- **Règle obligatoire** : toute question sur les capacités/specs/pricing de modèles LLM → `web_search` en premier, pas de réponse de mémoire
- Pattern de détection : "contexte de X", "tokens", "fenêtre de contexte", "capacités de [modèle]", "combien de tokens", etc.
- Appliquer même si la réponse semble évidente

### Metadata
- Source: user_feedback
- Related Files: AGENTS.md
- Tags: llm, specs, context-window, web-search, correction
- See Also: -

---

## 2026-03-08 17:20 UTC
- Findings: pas de correction explicite détectée
