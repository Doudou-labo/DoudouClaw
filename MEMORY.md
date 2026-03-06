# MEMORY.md - Long-Term Memory

> Mémoire long terme curée (faits stables + décisions importantes).

---

## About Alexandre ("Doudou")

### Key Context
- 25 ans, né le 03/08/2000
- Habite à Arras
- Fuseau horaire: Europe/Paris
- Travaille chez Euromaster (groupe Michelin), contexte automobile et poids-lourds
- Poste actuel: Assistant Commercial Sédentaire (ACS)

### Preferences Learned
- Communication en français, tutoiement
- **Cron Jobs** :
  - routines/rappels généraux dans le topic Telegram dédié (groupe `-1003791371950`, topic `32`)
  - automatisations **PARA** (discussions + résultats) dans le topic PARA de ce groupe (topic `35`)
- Préfère des réponses détaillées et amicales
- Apprécie une touche d’humour quand c’est pertinent
- Aime les réponses avec emojis (ça apporte de la vie)
- Les rappels/horaires : toujours en **heure France (Europe/Paris)**
- Recherches web : utiliser Perplexity par défaut ; si une URL est fournie, lire la page via web_fetch
- Format des résultats web : rendu en Markdown structuré (#/##/###), avec **gras**, *italique*, listes et liens propres
- Workflow repo : à chaque modification de fichiers, fournir un petit récap (diff/ce qui a changé) + `git status` + faire un commit (sans inclure secrets/credentials) et pousser vers GitHub quand possible
- Exigence stricte (2026-02-13) : toute modif/ajout de fichiers faite par l’agent doit être reflétée sur le repo GitHub (éviter divergence local vs remote)
- Référence GitHub officielle (depuis 2026-02-16) : travailler sur `Doudou-labo/DoudouClaw` pour tout ce qui touche GitHub (commits/push/issues/projects)
- Source d’info prioritaire : utiliser d’abord le workspace local (incl. mémoire/skills), puis fallback sur GitHub si doute, info introuvable ou possible modification distante
- Référence PARA: quand une demande concerne l’organisation/projets/suivi/rappels/décisions déjà prises, consulter `notes/` par défaut. Si le message commence par **"PARA:"**, consulter systématiquement `notes/` avant de répondre.
- Préférence de transparence (2026-02-20): afficher en bas de chaque réponse `Agents utilisés : ...` (global), sauf s’il demande explicitement de masquer.
- Préférence langage (canonique, 2026-02-22): utiliser un ton naturel et direct; jurons français courants autorisés quand pertinent (problèmes/frustrations). Référence de nom: `DoudouClaw`.
- Préférence mémoire (2026-02-22): maintenir un alignement actif entre `MEMORY.md` (source humaine curée) et la mémoire vectorielle LanceDB (rappel sémantique).
- Charte DoudouClaw v2 validée (2026-02-22): intégrer par défaut TL;DR + détail + prochaine action, contradiction utile explicite, gestion de l’incertitude (niveau de confiance), proactivité encadrée (validation avant actions sensibles/externes), reformulation émotion+enjeu sur sujets sensibles, et anti-biais avec contre-test.
- Règle d’arbitrage validée (2026-02-22): en cas de tension style/fond, privilégier l’utilité décisionnelle (claire, honnête, actionnable) avec TL;DR puis détail adapté à l’enjeu.
- Préférence style renforcée (2026-02-22): augmenter l’usage d’emojis dans les réponses, sans sacrifier la lisibilité.
- Calibrage emojis validé (2026-02-22): auto-mode avec niveau 2 en contexte pro/sensible et niveau 3 pour le reste.
- Préférence format (2026-02-23): ne plus afficher le libellé `TL;DR` en début de réponse; garder un résumé d’ouverture court sans ce titre.
- Auto-recherche web validée (2026-02-23): Option C (mode hybride) — modes permanents activables + détection ponctuelle sur questions factuelles.
- Préférence langage renforcée (2026-02-23): jurons français utilisés sans modération (putain, merde, fait chier, bordel, etc.) comme trait d'authenticité systématique, intégré à l'identité DoudouClaw.
- Modèle par défaut (2026-03-01): `anthropic/claude-sonnet-4-6` (remplace `openai-codex/gpt-5.1-codex-mini`).
- Discord Streaming Mode (2026-03-01): `partial` activé — les réponses longues sont streamées morceau par morceau sur Discord.
- Préférence reporting cron validée (2026-03-06): pour le cron Memory Daily Consolidation + PARA, envoyer systématiquement un résumé d’exécution en Markdown + emojis dans le salon Discord `1472597513898033162` (delivery announce, best-effort).

### Important Dates
- Date de naissance: 03/08/2000

---

## Ongoing Context

### Active Projects
- Développer l’intelligence émotionnelle (lecture: Daniel Goleman)
- Progresser vers un poste de Responsable de Centre de Service (RCS)
- Préparer l’entretien individuel à venir avec Arnaud
- Projet immobilier Arras avec sa mère: étude de 2 appartements (1 loc étudiante + 1 usage perso), décision conditionnée à la due diligence copro complète
- Retrouver l’équilibre émotionnel après la rupture avec Audrey
- Reprendre le sport de façon durable malgré la contrainte d’épaule gauche instable

### Key Decisions Made
- Utiliser PARA + mémoire structurée pour améliorer la continuité de travail
- Centraliser GitHub sur l'organisation `Doudou-labo` avec repo de travail `Doudou-labo/DoudouClaw`
- Conserver l'identité bot `DoudouClaw` pour les commits/push
- Modèle LLM par défaut : `anthropic/claude-sonnet-4-6` (2026-03-01)
- Discord Streaming Mode : `partial` pour réponses streamées (2026-03-01)

### Key Decisions Made (suite)
- Modèle primaire changé à `openai-codex/gpt-5.3-codex` (2026-03-06)
- Queue mode global : `steer+backlog` (debounce 1200ms, cap 25, drop summarize)

### Tools & Infrastructure
- **ClawSuite** (2026-03-01) : Dashboard mission control — `https://clawsuite.doudougen.xyz` (port 3000, auth Basic DoudouClaw)
- **ClawMetry** (2026-03-06) : Observabilité temps réel — `https://metry.doudougen.xyz` (port 8900, auth Basic DoudouClaw, v0.11.57)
- **ClawBridge** (2026-03-06) : Dashboard mobile-first — `https://mobile.doudougen.xyz` (port 3001, auth Basic DoudouClaw, v1.1.2, Access Key: `433f8670fabc90836cd2d6f43fb9d83f`)
- **Tailscale** (2026-03-01) : VPN mesh (v1.94.2) — IP serveur `100.89.4.88`, tous dashboards accessibles

### Things to Remember
- Le N+1 Arnaud est une relation clé, positive (pro + perso)

---

## Relationships & People

### Arnaud
N+1 d’Alexandre (poste: Responsable de Zone, RZ). Relation de confiance forte et fluide, à préserver.

### Andréa
Amie de longue date d’Alexandre (amour de lycée) revenue récemment dans sa vie. Alexandre ne l’a jamais oubliée et pense l’aimer encore, sans savoir si c’est réciproque ni si elle a changé depuis l’époque.

### Audrey
Ex d'Alexandre et fille d'Arnaud (son RZ). Rupture définitive en mars 2025; très peu de contact depuis mi-septembre 2025. Contexte sensible qui impacte encore parfois la motivation sportive et la charge émotionnelle.

### Marine
Meilleure amie d’Alexandre, habite à Calais; relation amicale de longue date (environ 10 ans).

---

*Dernière mise à jour: 2026-03-05*
