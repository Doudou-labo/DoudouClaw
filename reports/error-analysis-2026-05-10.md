# 🚨 Error Analysis Report - 2026-05-10

> Automatic analysis of logs and memory files (last 7 days)

## Summary

- **Analysis date:** 2026-05-10 (Paris time: 20:02)
- **Total raw occurrences:** 4934
- **Actual unique system errors:** ~3014 patterns (mostly dreaming file noise)
- **Real critical errors:** provider auth/rate limits + cron failures
- **Status:** 🚨 URGENT — provider cascade failures affecting automated crons

---

## 🚨 Résumé Exécutif (4-5 lignes)

- **4934 occurrences** détectées — la grande majorité provient du fichier `short-term-recall.json` (dreaming) qui contient des snippets avec le mot "failed" et des traces d'échecs de sessions passées. Les vraies erreurs système sont plus ciblées mais **récurrentes et critiques**.
- **Top 3 patterns réels :** (1) Abonnement GLM-5-turbo expiré (ZAI) — rate_limit 429 répété, failover en cascade ; (2) Rate limit MiniMax (usage limit exceeded 2056) — bloque les crons matin/soir ; (3) Auth Anthropic 403 — OAuth désactivé pour l'organisation, failure permanente.
- **Outils/fournisseurs problématiques :** ZAI (GLM), MiniMax, Anthropic — tous en échec auth/rate limit. **Seul Kimi/K2P5 reste stable** et prend le relai après 3-4 fallback.
- **Impact :** Les crons "Proactive Observations" (matin 07h, soir 21h) échouent systématiquement en cascade depuis plusieurs jours, avec des stalls de 2-3 minutes par exécution.
- **Recommandation : 🚨 URGENT** — Il faut soit renouveler l'abonnement ZAI, soit retirer GLM/MiniMax/Anthropic de la chaîne de fallback pour éviter les stalls. Ajouter aussi `memory/2026-05-10.md` manquant (ENOENT).

---

## Recurring Error Patterns

Top 20 most frequent error messages/patterns:

```
    607 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "failed",
    586 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "Assistant: [assistant turn failed before producing content]",
    250 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "User: Continue where you left off. The previous model attempt failed or timed out.",
    250 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "failed"
     58 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "échec",
     14 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "Assistant: 🚨 **Veille IA 8h+12h — ÉCHEC** | ✅ **Veille IA 19h00 — SUCCÈS** ⚠️ Cron Discord + market brief | ✅ Tous systèmes OK | Disque 51% 📦 **OpenClaw v2026.4.10** dispo — en attente accord **Agents utilisés : main**",
     14 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "Assistant: 🚨 **Veille IA 8h+12h — ÉCHEC** | ⚠️ Cron Discord + market brief ✅ Tous systèmes OK | Disque 51% **Agents utilisés : main**",
     14 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "learnings/errors.md",
     12 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "16:20 UTC — AUTO Self-Improving Weekly Review: Revue auto exécutée sur: memory/MEMORY.md memory/working-buffer.md; Patterns erreurs détectés: oui; Corrections utilisateur détectées: non; Traces mises à jour: .learnings/ERRORS.md + .learnings/LEARNINGS.md",
     11 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "error",
      9 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "21:50 UTC — Consolidation mémoire quotidienne + PARA: **SYSTÈME OPTIMAL CONFIRMÉ**: heartbeat auto-surveillance opérationnelle (0 errors vs hier!), auto-systèmes complets opérationnels; **API CRITIQUES PERSISTANTES**: Perplexity erreur auth récurrente (10+ jours), OpenAI-Codex ex",
      8 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "Assistant: 🚨 **Veille IA 8h+12h — ÉCHEC** | ⚠️ Cron Discord + market brief ✅ Tous systèmes OK | Disque 51% | 📦 **OpenClaw v2026.4.10** dispo **Agents utilisés : main**",
      8 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "broken",
      7 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "User: [cron:bb5db840-7ffe-4794-9015-e0fd85d903a3 Error Analysis - Rapport hebdo (dimanche 20h)] Lance l'analyse d'erreurs hebdomadaire : 1. Exécute : bash scripts/analyze-errors.sh 2. Lis le rapport généré 3. Résume en 4-5 lignes : - Nombre total d'erreurs - Top 3 patterns les pl",
      7 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "scripts/analyze-errors.sh",
      6 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "Assistant: 🚨 **Veille IA 8h00 — ÉCHEC** : `$SKILL_DIR` incorrect ⚠️ Cron Discord + market brief : erreurs non-critiques ✅ Tous systèmes OK | Disque 51% **Agents utilisés : main**",
      6 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:        "errors",
      5 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "- 1. 🔍 **Investigation scraping**: Tester le script `scrape-urls.py` individuellement 2. 🔧 **Token renewal**: Renouveler le token OpenAI expiré 3. 📊 **Cron diagnostics**: Analyser les crons en erreur systématique 4. 🔄 **Script veille**: Ajouter des timeouts et mécanismes de retry ## Open loops - ❌ Problème de scraping résolu - ❌ Token OpenAI renouvelé - ❌ Crons défaillants diagnostiqués --- *Généré automatiquement par heartbeat - 2026-04-05 10:04 UTC* ## 16:05 UTC — AUTO PARA Weekly Review - Snapshot PARA: Projects=13, Areas=22, Resources=16, Archive=6 - Open loops actifs: 24 - Action: revue hebdo effectuée + trace ajoutée dans notes/areas/proactive-tracker.md ## 16:20 UTC — AUTO Self-I",
      4 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "[decision]: Candidate: 19:50 UTC — Consolidation mémoire quotidienne + PARA: **Points clés identifiés** : heartbeat optimal (0 errors vs 54 hier!), pattern robustesse systèmes confirmé (simples vs complexes), API Perplexity erreur auth récurrente (5+ jours), OpenAI-Codex expiré (",
      4 /root/.openclaw/workspace/memory/.dreams/short-term-recall.json:      "snippet": "User: System (untrusted): [2026-04-28 07:02:43 UTC] Exec failed (clear-sh, signal SIGTERM) :: reas/veille-ia/syntheses-mensuelles/synthese-2026-04-28.md 🔄 Commit et push GitHub... To https://github.com/Doudou-labo/DoudouClaw.git c7793653..ef4a25a4 main -> main [main ef4a2… Syste",
```

---

## Problematic Tools

Tools with highest failure rates:

```
```

*(Aucun outil spécifique identifié — les échecs sont au niveau des providers LLM, pas des outils métier)*

---

## Detailed Errors

Voir le fichier original `reports/error-analysis-2026-05-10.md` pour les logs détaillés OpenClaw.

**Erreurs critiques identifiées dans les logs :**

1. **ZAI / GLM-5-turbo — Package expiré** (2026-05-10 ~05h00-06h00 UTC)
   - `429 Your GLM Coding Plan package has expired`
   - Affecte les crons Morning (59117dfc) + Evening (7015d5f7) + Noon (ae293b73)
   - Failover vers MiniMax → Anthropic → Kimi (4 étapes, ~3 min de stall)

2. **MiniMax — Rate limit exceeded** (2056)
   - `usage limit exceeded (2056)`
   - Seconde étape du failover, échoue aussi

3. **Anthropic — Auth permanent 403**
   - `OAuth authentication is currently not allowed for this organization`
   - Troisième étape du failover, disabled jusqu'à 2026-05-11

4. **Kimi/K2P5 — Seul provider stable**
   - Réussit après 3-4 tentatives de fallback
   - Sauve les crons mais avec latence élevée

5. **ENOENT memory/2026-05-10.md**
   - Fichier journal du jour manquant au moment de l'exécution du cron (05h03 UTC)

---

*Rapport généré automatiquement le dimanche 2026-05-10 à 20:02 UTC*
