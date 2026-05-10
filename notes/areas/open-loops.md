# Open Loops - Fils ouverts à suivre

**Dernière mise à jour** : 2026-05-09 19:50 UTC

## Boucles Actives

### 🔴 Priorité Haute (Critique Système)
1. **API Perplexity — PATTERN ERRATIQUE CONFIRMÉ (2 JOURS CONSÉCUTIFS)** - Stabilisation durable cassée : panne soir 07/05 ET 08/05 après 12+ jours de fonctionnement normal
   - **ÉVOLUTION** : API revenue normale le matin/midi, panne récurrente le soir (19h) → **pattern erratique confirmé**
   - **RÉSULTAT** : veille IA 19h fichiers vides, mode dégradé total
   - **SURVEILLER** : confirmer si pattern hebdomadaire récurrent ou anomalie ponctuelle isolée
   - **ACTION** : vérifier `.credentials/perplexity-api-key.txt` ou config OpenClaw, implémenter fallback système veille IA soir

2. **Token OpenAI-Codex expiré** - Expired ~120h+ → régénération URGENTE avant risque blocage total
   - Impact : potentiel blocage dépendances OpenAI-Codex après expiration
   - Pattern : nécessité monitoring proactif tokens API avec alerte préventive à 48h
   - **ACTION** : régénération immédiate toujours prioritaire critique

3. **Scraping SIGKILL multi-URLs** - Session `lucky-ne` tuée OOM pendant veille IA 19h → deep dive bloqué
   - Impact : pertes données scraping, instabilité système complexe
   - Pattern : systèmes complexes (scraping multi-URLs) nécessité timeout/retry robustes
   - **ACTION** : implémentation timeout/retry robustes identifiée comme solution NON implémentée

### 🟡 Priorité Moyenne (Robustesse Système)
4. **API Perplexity — SURVEILLANCE PATTERN ERRATIQUE** - Retour sporadique mode dégradé 19h le 05/06 après 12+ jours de stabilisation
   - **ÉVOLUTION** : stable matin/midi, retour mode dégradé le soir (19h) → pattern erratique intermittent à confirmer
   - **RÉSULTAT** : veille IA maintenue mais contraintes sporadiques possibles
   - **SURVEILLER** : confirmer si pattern hebdomadaire récurrent ou anomalie ponctuelle isolée

5. **Dashboard progression RCS** - Construire tableau de bord compétences managériales (feedback, priorisation, cadrage, rigueur)
   - Contexte : Alexandre progression vers RCS chez Euromaster
   - Priorité : moyenne (développement pro vs urgence système)
   - **STATUT** : outil pilotage déjà opérationnel → se concentrer sur compétences managériales

### 🟢 Priorité Basse (Développement)
6. **Crons systématiquement en erreur** - Diagnostic et correction des tâches cron échouées
   - Pattern identifié : syntaxe Discord channel/to dans crons → déjà corrigé précédemment
   - Statut : surveillance continue

7. **Deep dive tech** - Terminer exécution script en attente (dépend de timeout optimisé appliqué)
   - STATUT : Deep Dive généré avec succès aujourd'hui malgré API contraintes

8. **Monitoring tokens proactif** - Implémenter système alertes tokens expirés (OpenAI, Perplexity)
   - Pattern appris : expiration prédictive nécessaire (OpenAI-Codex 91h+)
   - Action : basé sur pattern robustesse identifié et API instables connues

9. **Inventaire physique pneus** - MVP à implémenter sur `inventaire.doudougen.xyz`
    - Contexte : projet séparé de pneu-tracker actuel
    - Priorité : basse (nouveau développement vs urgence système)

## Actions Concrètes Prochaines
- **AUJOURD'HUI** : Régénérer token OpenAI-Codex (120h+ expiré), corriger API Perplexity (vérifier credentials/config), implémenter fallback veille IA soir
- **Cette semaine** : Implémenter monitoring proactif tokens avec alertes préventives, appliquer pattern robustesse aux nouvelles implémentations, confirmer pattern Perplexity erratique ou stabilité durable
- **Mois prochain** : Simplifier architecture systèmes basée sur pattern robustesse VALIDÉ (simple + résilience) + dashboard RCS compétences managériales

## Actions Todo
- [x] [2026-04-23 19:50] Consolidation mémoire + PARA terminée ✅
- [ ] [2026-04-19 21:01] Test unchecked task for PARA automation
- [x] [2026-04-23 14:51] AUTO PARA 3-min (midi) exécuté ✅
- [x] [2026-04-23 14:23] AUTO PARA 3-min (midi) exécuté ✅
- [x] [2026-04-23 12:00] AUTO PARA 3-min (midi) exécuté ✅
- [x] [2026-04-23 10:01] AUTO PARA 3-min (midi) exécuté ✅
- [x] [2026-04-23 06:03] Heartbeat auto-surveillance opérationnel ✅

## Auto-checkpoints
- [ ] [AUTO 2026-05-10 midi] Checkpoint 3-min fait. Next: [2026-04-19 21:01] Test unchecked task for PARA automation

## Pattern Robustesse VALIDÉ (2026-04-28)
- **Principe** : systèmes simples résilients (heartbeat, Flash) + systèmes complexes avec retry/délai (Deep Dive)
- **Source** : consolidation mémoire 2026-04-28 avec monitoring 12+ jours + preuve empirique aujourd'hui
- **Preuve empirique** : heartbeat 0 errors + Flash IA OK + Deep Dive généré malgré API Perplexity instable + synthèse mensuelle IA générée avec timeout optimisé 45s
- **Impact** : architecture future basée sur preuve robuste, complexité minimale + résilience obligatoire
- **Application immédiate** : timeout/retry scraping robustes, monitoring proactif tokens, fallback système + dashboard pilotage corrigé