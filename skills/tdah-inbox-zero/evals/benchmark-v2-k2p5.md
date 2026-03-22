# Benchmark Inbox Zero v2 — k2p5 — 2026-03-22

**Modèle :** kimi-coding/k2p5
**Date :** 2026-03-22 22h Paris
**Score global :** 9/10 — 90%

---

## Résultats détaillés

| # | Cas | Score | Détail |
|---|-----|-------|--------|
| 1 | Rappel simple | ✅ | Template parfait, classification Planifié correcte |
| 2 | Blocage/procrastination | ✅ | Template + micro-action, légère anticipation "prochaine étape" (acceptable) |
| 3 | Fausse urgence | ✅ | Question de challenge posée AVANT classification — canonique |
| 4 | Brain dump | ✅* | Tableau au lieu du template — l'information est bien structurée et utile, trade-off acceptable |
| 5 | Idée de nuit | ✅ | "Noté. On en parle demain" + template + protection sommeil |
| 6 | Quick Win urgent | ✅ | Urgence réelle validée, template, découpage ok |
| 7 | Gros morceau | ✅ | Découpage Pomodoro en 6 blocs + template |
| 8 | Protection émotionnelle | ✅ | "Tu veux en parler ou on actionne un truc léger ?" — canonique |
| 9 | Interruption focus | ✅ | "Idée notée, on y revient après" — canonique |
| 10 | Capture brute | ✅ | Template + a même fait commit + push réel |

---

## Évolution depuis v1 (benchmark 2026-03-20)

**Améliorations apportées ce soir :**
- ACTIVATION PROTOCOL ajouté au début du SKILL.md
- Exemples ❌/✅ concrets anti-coaching drift
- Règle 4 émotionnelle clarifiée avec exemple
- "Audrey" retiré (signaux émotionnels génériques)
- Description frontmatter optimisée

**Résultat :** Les cas émotionnels, interruption et idée de nuit sont maintenant parfaitement traités. Le brain dump est légèrement mieux structuré (tableau) mais au prix du template strict — trade-off assumé.

## Sessions subagents (10x k2p5)

```
eval2-1-rappel    → 19s  | 22.5k tokens
eval2-2-blocage   → 36s  | 24.8k tokens
eval2-3-fausse-urg→ 17s  | 15.6k tokens
eval2-4-brain-dump→ 84s  | 23.0k tokens (le plus long)
eval2-5-idee-nuit → 24s  | 16.5k tokens
eval2-6-quick-win → 35s  | 16.0k tokens
eval2-7-gros-morc→ 21s  | 16.1k tokens
eval2-8-emotion   → 58s  | 22.0k tokens
eval2-9-focus     → 14s  | 15.9k tokens
eval2-10-capture  → 53s  | 22.5k tokens
```

**Conclusion :** k2p5 est capable d'appliquer le skill avec 90% de fidélité. Le skill est validé pour la production.
