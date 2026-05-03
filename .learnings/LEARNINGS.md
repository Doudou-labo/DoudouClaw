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

## [LRN-20260327-001] correction

**Logged**: 2026-03-27T19:19:00Z
**Priority**: high
**Status**: promoted
**Area**: docs

### Summary
Après réduction du fichier agent, ne pas laisser dériver le style vers un ton trop sobre : maintenir un usage soutenu d’emojis et une autonomie élevée par défaut.

### Details
L’utilisateur a signalé que, depuis la réduction du fichier agent, les réponses contenaient beaucoup moins d’emojis que convenu. Il a aussi réaffirmé qu’il veut une exécution beaucoup plus autonome des tâches, sauf consigne contraire explicite ou action sensible. La bonne réponse n’est donc pas seulement d’« autoriser » les emojis et la proactivité, mais de les appliquer de façon visible et constante par défaut.

### Suggested Action
- Réaugmenter immédiatement la densité d’emojis dans les réponses courantes.
- Éviter le style minimaliste/sec, sauf contexte très sensible.
- Agir par défaut sans attendre de micro-validation, sauf action sensible/externe ou instruction contraire.
- Promouvoir la préférence dans la mémoire persistante et l’état de session.

### Metadata
- Source: user_feedback
- Related Files: MEMORY.md, SESSION-STATE.md, memory/2026-03-27.md
- Tags: emojis, style, autonomy, correction
- See Also: LRN-20260308-001

### Resolution
- **Resolved**: 2026-03-27T19:19:00Z
- **Promoted**: MEMORY.md, SESSION-STATE.md
- **Notes**: Préférence réancrée immédiatement dans la mémoire et le contexte actif.

---

## 2026-03-22 17:20 UTC
- Findings: pas de correction explicite détectée

---
**Date:** 2026-04-02  
**Type:** TOOL_GOTCHA  
**Title:** Message tool Discord syntax error in cron payloads

**What happened:**
Three cron jobs (Routine pro Top 3, Proactive pings, Bedtime reminder) were failing with error `Action send requires a target`. The cron payloads were instructing agents to use the `message` tool with `channel="1472597511838367920"` (passing the Discord channel ID as the `channel` parameter).

**Root cause:**
The `message` tool parameters are:
- `channel`: specifies the PROVIDER (telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|line)
- `to` (or `target`): specifies the DESTINATION (channel ID, user ID, phone number, etc.)

The confusion came from ambiguous wording in cron prompts like "send via Discord to channel X", which could be interpreted as using the `channel` parameter with the channel ID value.

**Fix applied:**
Updated 3 cron payloads to use correct syntax:
- Before: `channel="1472597511838367920"`
- After: `channel=discord to=1472597511838367920`

**Learnings:**
1. When writing cron payloads that use the `message` tool, always use explicit syntax: `channel=<provider> to=<destination>`
2. Avoid ambiguous wording like "via Discord to channel X" in prompts; use "via message tool with channel=discord and to=X"
3. Test cron payloads after creation by running them manually or checking logs for syntax errors

**Status:** APPLIED

## 2026-04-05 16:20 UTC
- Findings: pas de correction explicite détectée

## [LRN-20260412-001] correction

**Logged**: 2026-04-12T09:14:00Z
**Priority**: high
**Status**: resolved
**Area**: docs

### Summary
Le cron de veille des mises à jour OpenClaw doit produire une synthèse explicative du changelog, pas un copier-coller brut de la release.

### Details
L'utilisateur a corrigé explicitement le rendu attendu du cron `OpenClaw Update Check - 7h30`. Le message envoyé reprenait essentiellement le changelog GitHub tel quel, ce qui rate l'objectif du salon : comprendre vite ce qui change vraiment. Le bon comportement est de transformer la release en message lisible avec hiérarchie, points marquants, correctifs utiles et impact concret.

### Suggested Action
- Générer un résumé structuré côté script plutôt qu'un dump brut.
- Formuler le prompt du cron pour interdire le copier-coller du changelog.
- Favoriser un rendu orienté lecture rapide : nouveautés, correctifs, impact, avis.

### Metadata
- Source: user_feedback
- Related Files: scripts/check-openclaw-updates.sh, /root/.openclaw/cron/jobs.json
- Tags: cron, changelog, release-notes, formatting, correction
- See Also: -

### Resolution
- **Resolved**: 2026-04-12T09:18:00Z
- **Notes**: Script changé pour produire une synthèse explicative, prompt cron renforcé, timeout étendu à 180s.

---

## 2026-04-12 16:20 UTC
- Findings: pas de correction explicite détectée

## 2026-04-19 16:20 UTC
- Findings: pas de correction explicite détectée

## 2026-04-26 16:20 UTC
- Findings: pas de correction explicite détectée

## 2026-05-03 16:21 UTC
- Findings: pas de correction explicite détectée
