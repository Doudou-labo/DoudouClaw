---
name: context-manager
language: fr
description: Gestionnaire de contexte IA pour les sessions OpenClaw (liste, statut, résumé, compression).
user-invocable: true
source: ./SKILL.md
---

# Skill Context Manager (FR)

Gestion intelligente du contexte des sessions OpenClaw.
Le principe: résumer proprement une session longue, puis (optionnellement) la compresser pour éviter la saturation de contexte.

## Démarrage rapide

```bash
# Lister toutes les sessions + usage
bash skills/context-manager/compress.sh list

# Voir le statut d'une session
bash skills/context-manager/compress.sh status agent:main:main

# Générer un résumé IA (safe, lecture seule)
bash skills/context-manager/compress.sh summarize agent:main:main

# Compression complète (destructif): résumé + reset + injection
bash skills/context-manager/compress.sh summarize agent:main:main --replace
```

## Quand l'utiliser

- Quand une session approche **70–80%+**
- Sur sessions longues (chat actif, nombreux outils)
- Avant une perte de cohérence liée à la compaction
- En maintenance proactive

## Comment ça fonctionne

1. **Résumé IA** de la session
2. **Backup** du JSONL dans `memory/compressed/`
3. **Reset** de la session (suppression JSONL)
4. **Injection** du résumé dans la nouvelle session
5. Résultat: même `sessionKey`, nouveau `sessionId`, contexte allégé

## Commandes principales

### Sessions

- `list` : liste sessions + tokens + usage
- `status [KEY]` : détail d’une session
- `summarize [KEY]` : résumé IA (safe)
- `summarize [KEY] --replace` : résumé + compression (destructif)
- `compress [KEY]` : mode legacy (moins recommandé)
- `check [KEY]` : vérifie seuil sur une session
- `check-all` : vérifie toutes les sessions

### Configuration

- `set-threshold N` : seuil (50–99%, défaut 80)
- `set-depth LEVEL` : niveau (`brief` / `balanced` / `comprehensive`)
- `set-quiet-hours HH` : plage silencieuse (ex `23:00-07:00`)
- `help` : aide complète

## Fichiers générés

Dans `memory/compressed/`:

- `{timestamp}.ai-summary.md` → résumé IA
- `{timestamp}.session-backup.jsonl` → sauvegarde brute session
- `{timestamp}.transcript.md` → extraction transcript (legacy)
- `{timestamp}.summary.md` → résumé grep (legacy)

## Points de sécurité

- `--replace` est **destructif** (reset session), toujours faire d’abord un `summarize` sans replace.
- Vérifier le résumé avant compression sur session critique.
- Le backup permet de restaurer en cas de problème.

## Dépannage rapide

### Résumé vide
- Vérifier les logs/erreurs `openclaw agent --json`
- Éviter que les warnings stderr cassent le parse JSON

### Reset non appliqué
- Vérifier le chemin session:
```bash
ls ~/.openclaw/agents/main/sessions/
```

### Restaurer depuis backup
```bash
cp memory/compressed/{timestamp}.session-backup.jsonl \
   ~/.openclaw/agents/main/sessions/{sessionId}.jsonl
```

## Bonnes pratiques (avec toi)

1. Commencer par `list` puis filtrer `>80%`
2. Priorité: sessions actives (topics + crons base), pas les `:run:` historiques
3. Sur session critique: `summarize` (safe) puis validation humaine
4. Ne lancer `--replace` qu’avec confirmation explicite

---

Si tu veux, je peux aussi te faire un mini alias perso:
- `ctx list`
- `ctx hot` (sessions >80%)
- `ctx safe <sessionKey>`
- `ctx apply <sessionKey> RESET_OK`
