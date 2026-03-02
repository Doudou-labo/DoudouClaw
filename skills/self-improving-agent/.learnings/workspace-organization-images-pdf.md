---
date: 2026-03-02
category: refactor
severity: low
status: applied
impact: Workspace organisé et documenté
related: []
evolution_event_id: evt-1771442700-workspace-org
---

# Organisation Workspace: Dossiers images/ et pdf/

## Context

Le workspace GitHub contenait des fichiers binaires (PNG, PDF) éparpillés à la racine, créant un "bordel" visuel dans l'interface GitHub mobile et desktop.

Fichiers concernés:
- `OH0951_page_*.png` (4 fichiers)
- `euromaster-crossclimate3-*.png` (2 fichiers)
- `playwright-demo.png`, `tmp-playwright-demo.png`
- `OH0951_manual.pdf`

## Lesson

Organisation claire du workspace:
- 📸 Images (PNG, JPG, JPEG) → `images/`
- 📄 Documents PDF → `pdf/`
- 📝 Fichiers texte/Markdown → racine ou dossiers appropriés

## Applied Fix

### Déplacement des fichiers
```bash
mkdir -p images pdf
mv *.png *.jpg *.jpeg images/
mv *.pdf pdf/
```

### Documentation
- Mise à jour `TOOLS.md` section "Organisation des Fichiers"
- Ajout des règles de rangement dans la doc

## Impact Measured

- ✅ Workspace propre et lisible sur GitHub
- ✅ Structure cohérente pour futurs fichiers
- ✅ Chemins relatifs documentés (`./images/...`, `./pdf/...`)

## Notes

- Les références dans les fichiers mémoire historiques (`memory/*.md`) conservent juste les noms de fichiers (pas besoin de mise à jour, ce sont des archives)
- Les futurs screenshots doivent être sauvegardés dans `images/` avec chemins relatifs

## Metadata
- Source: user_feedback
- Related Files: TOOLS.md
- Tags: workspace, organization, github, cleanup
