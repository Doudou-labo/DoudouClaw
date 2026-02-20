# Orchestration multi-agents (v1)

## Objectif
Avoir des spécialistes utilisables **dans n’importe quel channel** sans les recréer à la main.

## Décision
Architecture retenue:
- 1 orchestrateur logique
- 10 rôles spécialistes
- pool **par channel** (pas un singleton global)
- recréation auto après restart via ensure/recreate

## Pourquoi pool par channel
OpenClaw est session-centric:
- le contexte est lié au channel/session
- un sub-agent d’un channel A n’est pas partagé nativement avec channel B

Donc on standardise le même set de rôles dans chaque channel, et on automatise leur présence.

## Rôles (10)
1. orchestrator — routage + fusion de résultats
2. github — PR/issues/CI/reviews
3. research — web Brave/Perplexity + sources
4. coding — dev/debug/refacto/tests
5. writing — docs/rédaction/reformulation
6. memory-context — consolidation mémoire & continuité
7. planning-coaching — priorisation + coaching RCS
8. finance — suivi comptes/portefeuille/PERCO
9. crm-followup — interactions et relances CRM
10. ops-automation — crons/santé/maintenance OpenClaw

## Routage (règles simples)
- Détection d’intention par mots-clés + type de tâche
- Si tâche **courte/linéaire**: traitement direct en `main`
- Si tâche **moyenne/technique mono-domaine**: routage direct `main -> 1 spécialiste` (sans orchestrateur)
- Si tâche **multi-domaines**: orchestrateur -> 2+ spécialistes -> synthèse
- Si doute: orchestrateur démarre par `research` ou `memory-context`

## Résilience restart
1. Ensure on-demand (obligatoire)
   - Au premier besoin dans un channel:
     - l’orchestrateur vérifie la présence des labels spécialistes
     - s’il en manque, il les recrée
2. Watchdog périodique (optionnel)
   - vérification toutes X minutes sur channels prioritaires
3. Fallback runtime
   - en cas d’échec d’un spécialiste:
     - recreate immédiat
     - retry 1 fois
     - fallback vers spécialiste voisin

## Notes d’exploitation
- `cleanup: keep` pour conserver les sessions de spécialistes
- Même avec keep, un restart peut casser les timers/états => d’où ensure/recreate
- Garder la complexité faible: règles lisibles, logs clairs, labels stables
