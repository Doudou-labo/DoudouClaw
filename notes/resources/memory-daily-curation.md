# Curation quotidienne de la mémoire

## Problème
Les dumps bruts de sessions (transcripts complets avec outils, erreurs, messages système) s'accumulent dans `memory/` et créent du bruit :
- Difficile de retrouver ce qui compte vraiment
- Prend de l'espace inutilement
- Rend la relecture des mémoires pénible

## Solution
**Garder uniquement la version curée** de chaque journée :
- ✅ **Conserver** : `memory/YYYY-MM-DD.md` (structuré, distillé, utile)
- ❌ **Supprimer** : les dumps bruts type `memory/YYYY-MM-DD-HHMM.md`

### Workflow quotidien
1. En fin de journée : consolider les événements/décisions/apprentissages dans `memory/YYYY-MM-DD.md`
2. Structurer par sections claires (## Titre de section)
3. Supprimer les dumps bruts une fois le résumé fait
4. Commit + push la version finale

```bash
# Exemple
git add memory/2026-02-11.md
git commit -m "docs(memory): résumé journée du 11/02"
git rm memory/2026-02-11-*.md  # supprimer les dumps bruts
git push
```

## Compromis
**Avantages :**
- Mémoire propre, lisible, facile à relire
- Gain de place (pas de duplication)
- Facilite la recherche sémantique (`memory_search`)
- Évite le bruit dans le repo Git

**Inconvénients :**
- Perd le transcript exact brut (mais pas nécessaire si la curation est bien faite)
- Demande un peu de discipline quotidienne

## Exemple
**Avant** (plusieurs fichiers par jour) :
```
memory/2026-02-11.md           (version curée)
memory/2026-02-11-2157.md      (dump brut session 21h57)
memory/2026-02-11-1430.md      (dump brut session 14h30)
```

**Après** (un seul fichier curé) :
```
memory/2026-02-11.md           (tout est dedans, structuré)
```

## Liens / Connexes
- PARA (structure de classement des notes)
- `notes/resources/para-routine-3min.md` (routine de capture quotidienne)
- Workflow Git (commit/push réguliers)

---
*Ajouté : 2026-02-11*
