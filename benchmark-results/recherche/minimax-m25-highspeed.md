# Benchmark LLM — Recherche: FTS5 vs Elasticsearch

**Modèle:** minimax/MiniMax-M2.5-highspeed  
**Date:** 2026-03-19  
**Tâche:** web (recherche FTS5 vs Elasticsearch pour un moteur de recherche applicatif)

---

## Quand FTS5 suffit amplement

- **Volume < 5-10 millions de documents** : latency en millisecondes, sans infrastructure externe
- **Une seule instance applicative** : pas de besoin de distribuer l'index sur plusieurs serveurs
- **Données mono-serveur** : ton app et ta DB vivent sur la même machine
- **BM25 intégré** : scoring de pertinence natif, qualité de pertinence correcte
- **Zéro ops** : pas de JVM, pas de cluster, pas de maintenance Elasticsearch
- **Cas documentés** : des devs rapportent des latences < 10ms median, 100x plus rapide que ES dans certains contexts

## Quand Elasticsearch devient nécessaire

- **Volume massif** : dizaines de millions+ de documents, index distribué
- **Haute disponibilité** : cluster redondant, failover automatique
- **Recherche vectorielle / sémantique** : embeddings + hybrid search (ES >= 8.x)
- **Analyse en temps réel** : Kibana, agrégations, analytics sur les requêtes
- **Multi-tenancy** : plusieurs clients, index isolés, permissions granulaires
- **Équipes ops matures** : quelqu'un peut maintenir le cluster ES au quotidien

## Compromis coût / complexité / performance

| Critère | FTS5 | Elasticsearch |
|---------|------|---------------|
| **Coût infra** | ~0 (un fichier SQLite) | 2-4 VMs minimum pour un cluster fonctionnel |
| **Complexité ops** | Nulle | Élevée (JVM, heap sizing, shard balancing, upgrades) |
| **Latence** | < 10ms median (rapporté) | 20-100ms selon cluster et taille |
| **Scalabilité horizontale** | Non | Oui, native |
| **Fonctionnalités search** | Basiques à modérées | Avancées (fuzzy, synonyms, faceting, auto-complete) |
| **Ressource CPU/RAM** | Minimal | Considérable (ES = Java, ~4GB RAM minimum) |
| **Facilité de backup** | `.sqlite` = fichier, trivial | Snapshots S3/hdfs, plus complexe |

## Recommandation nette pour une app classique

**FTS5 wins — sauf si tu as une vraie raison d'aller sur ES.**

Une "application classique" (SaaS, e-commerce, dashboard, CRM interne…) avec moins de quelques millions d'enregistrements n'a pas besoin d'Elasticsearch. Tu obtiens:
- BM25 pour la pertinence
- Recherche phrase/exact/préfixe
- Tri par pertinence
- Zéro infrastructure additionnelle

Les cas légitimes pour ES : analytics temps réel, search multi-tenant à grande échelle, hybrid search (vector + keyword), ou déjà une stack qui inclut ES.

---

**Sources:** Articles Technique (2025) — rapportages terrain sur migration ES→FTS5 avec gains de latence mesurés.
