# Benchmark: MiniMax-M2.5 — Recherche Web

## Sujet: FTS5 vs Elasticsearch pour un moteur de recherche applicatif

---

## Quand FTS5 suffit

**FTS5 est amplement suffisant quand:**

- **Volume de données modéré** (< 1 million de documents): Les tests montrent des latences en millisecondes simples
- **Architecture monolithique ou microservice simple**: Pas besoin de cluster distribué
- **Recherche within-app**: Le moteur de recherche peut être intégré directement dans l'application (SQLite embarqué)
- **Cas d'usage类型**: Recherche interne, tableaux de bord admin, CMS, blogs, e-commerce petit/moyen
- **Infrastructure limitée**: Équipes sans expertise DevOps Elasticsearch

**Exemples concrets:**
- Applications SaaS avec < 500K produits
- Moteurs de recherche interne d'entreprise
- Portails de documentation
- Blogs/sites媒体的 avec recherche full-text

---

## Quand Elasticsearch est justifié

**Elasticsearch devient nécessaire quand:**

- **Gros volume de données** (> 1-10 millions de documents): Besoin de sharding et réplication
- **Recherche temps réel à haute échelle**: Millions de requêtes/jour avec faible latence
- **Multi-tenant**: Plusieurs clients avec données isolées sur le même cluster
- **Fonctions avancées**: Aggregations complexes, analytics, searchytics temps réel
- **Distribution géographique**: Réplication cross-datacenter
- **Stack ELK existante**: Already using Logstash/Kibana

**Avertissements:**
- Complexité opérationnelle significative (JVM tuning, monitoring, upgrades)
- Coût infrastructure (nodes, RAM, stockage SSD)
- Expertise DevOps requise

---

## Compromis coût/complexité/performance

| Critère | FTS5 (SQLite) | Elasticsearch |
|---------|---------------|---------------|
| **Coût infrastructure** | Minimal (1 serveur, souvent déjà présent) | Élevé (cluster 3+ nodes, RAM importante) |
| **Complexité Ops** | Faible (un fichier .db) | Élevée (monitoring, backups, upgrades) |
| **Performance pure** | Excellente pour volumes moyens | Supérieure pour très gros volumes |
| **Latence** | < 10ms (single digit ms) | 20-50ms en conditions normales |
| **Scalabilité** | Limitée (vertical scaling) | Horizontale (sharding) |
| **Maintenance** | Négligeable | Continue (patches, migrations) |
| **Équipe requise** | 1 développeur | Équipe DevOps dédiée |

**Point clé:** Pour la plupart des applications web classiques, FTS5 offre un rapport coût/complexité/performance **largement meilleur** qu'Elasticsearch. Les cas où ES est nécessaire représentent une minorité de projets.

---

## Recommandation nette pour une app classique

### Pour 90% des applications web:

**→ Utilisez FTS5 (SQLite FTS5 ou PostgreSQL tsvector)**

Raisons:
1. **Simplicité**: Un seul fichier ou extension Postgres, pas de service séparé
2. **Coût**: Zéro coût additionnel, pas de cluster à gérer
3. **Performance**: Suffisant pour > 95% des cas d'usage
4. **Maintenance**: Zéro overhead, intégré à votre DB principale

### Implémentation recommandée:

```sql
-- PostgreSQL (recommandé si déjà sur PG)
CREATE INDEX idx_search ON articles USING GIN (to_tsvector('french', title || ' ' || content));

-- SQLite FTS5
CREATE VIRTUAL TABLE articles_fts USING FTS5(title, content, content=articles, content_rowid=id);
```

### Quand choisir Elasticsearch:

- Volume > 1M de documents avec requêtes complexes
- Besoin d'aggregations/analytics temps réel
- Architecture microservices avec recherche centralisée
- Équipe DevOps disponible et budget infrastructure

---

## Résumé du benchmark

**MiniMax-M2.5** a fourni une analyse correcte et structurée sur FTS5 vs Elasticsearch. La réponse couvre les cas d'usage, les compromis techniques et donne une recommandation claire.

La réponse est en français, bien structurée avec des tableaux comparatifs et du code SQL. La recommandation est cohérente avec les retours communautaires (Medium, HackerNews, Reddit): **FTS5 pour la majorité des cas, ES seulement quand nécessaire**.

---

**SCORE: 8/10** — Réponse pertinente, bien structurée, recommandations cohérentes avec les retours communautaires modernes. Légèrement générique sur certains points techniques mais acceptable pour une task web benchmark.