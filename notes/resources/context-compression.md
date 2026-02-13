# Context Compression — Procédure safe

## Objectif
Réduire le contexte d’une session longue sans perdre l’historique critique.

## Workflow recommandé
1. **Preview** (lecture seule)
2. Vérification du résumé
3. **Apply** avec confirmation explicite
4. Vérification post-compression (session + continuité)

## Commandes
```bash
# Preview (safe)
bash scripts/context-compress-preview.sh 'agent:main:telegram:group:-1003791371950:topic:37'

# Apply (destructif)
bash scripts/context-compress-apply.sh 'agent:main:telegram:group:-1003791371950:topic:37' RESET_OK
```

## Artefacts générés
- `skills/context-manager/memory/compressed/*.ai-summary.md`
- `skills/context-manager/memory/compressed/*.session-backup.jsonl`
- `notes/resources/context-compression/latest-summary.md`

## Rollback
En cas de souci, restaurer le backup JSONL de la session.
