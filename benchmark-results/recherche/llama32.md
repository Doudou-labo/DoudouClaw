# Comparaison FTS5 vs Elasticsearch pour Pneu-Tracker

## Résumé Exécutif

Pour **Pneu-Tracker** (12 500 références pneus, pic ~10 req/s), **SQLite FTS5 est la recommandation claire**.

Elasticsearch est un marteau pour écraser une mouche à cette échelle. FTS5 offre:
- **Latence < 10ms** vs 10-50ms pour ES
- **Zéro infrastructure** (fichier SQLite embarqué)
- **Consommation RAM ~50-100MB** vs 1-4GB minimum pour ES
- **Fonctionnalités suffisantes** pour la recherche de pneus (BM25, prefix, phrases)

---

## 1. Architecture Interne

### 1.1 SQLite FTS5

FTS5 (Full-Text Search 5) est un **module de table virtuelle** SQLite qui implémente un index inversé pour la recherche texte.

#### Structure de l'index

```
Document → Tokenization → Index Inversé

"Pneu Michelin 205/55R16" → ["pneu", "michelin", "205", "55r16"]

Index inversé stocké:
"pneu"      → [doc1:pos1, doc5:pos3, doc12:pos1]
"michelin"  → [doc1:pos2, doc8:pos1, doc15:pos4]
"205"       → [doc1:pos3, doc2:pos1, doc7:pos2]
```

#### Tables shadow créées

Pour une table virtuelle `pneus_fts`, FTS5 crée automatiquement:

| Table | Contenu |
|-------|---------|
| `pneus_fts_data` | En-têtes de structure, segments de doclists |
| `pneus_fts_idx` | Index (segment_id, term, page_number) |
| `pneus_fts_content` | Contenu complet des documents (optionnel avec `contentless`) |

#### Tokenizers disponibles

| Tokenizer | Usage |
|-----------|-------|
| `unicode61` (défaut) | Texte général multilingue |
| `ascii` | Caractères ASCII uniquement |
| `porter` | Stemming anglais (run/runs/running → run) |
| `trigram` | Recherche de sous-chaînes (expérimental) |

#### Algorithme de ranking: BM25

FTS5 utilise **BM25** (Best Match 25), standard industriel:

```
BM25(d,q) = Σ IDF(qᵢ) × [tf(qᵢ,d) × (k₁+1)] / [tf(qᵢ,d) + k₁ × (1-b + b × |d|/avgdl)]
```

Paramètres configurables:
- `k₁` (défaut: 1.2): Contrôle la saturation des termes fréquents
- `b` (défaut: 0.75): Normalisation par longueur de document

### 1.2 Elasticsearch

Elasticsearch est un **moteur de recherche distribué** basé sur Apache Lucene.

#### Architecture distribuée

```
Cluster Elasticsearch
├── Node 1 (Master + Data)
│   ├── Shard 0 (Primary)
│   ├── Shard 1 (Replica)
│   └── JVM Heap (50% RAM)
├── Node 2 (Data)
│   ├── Shard 0 (Replica)
│   └── Shard 1 (Primary)
└── Node 3 (Coordinating)
    └── Route les requêtes
```

#### Sharding et répartition

| Concept | Description |
|---------|-------------|
| **Index** | Collection logique de documents |
| **Shard** | Partition physique de l'index (Lucene index indépendant) |
| **Primary** | Shard principal pour écriture |
| **Replica** | Copie pour lecture et failover |
| **Segment** | Sub-partition immuable dans un shard |

#### Index inversé Lucene

Similaire à FTS5 mais avec optimisations avancées:
- **Skip lists** pour recherche rapide
- **Bitsets** pour filtres booléens
- **FST (Finite State Transducers)** pour autocomplete
- **Doc values** pour aggregations (colonnes stockées verticalement)

#### Features avancées

- **Fuzzy search**: Distance Levenshtein avec automates
- **NGrams**: Indexation de sous-chaînes pour recherche partielle
- **Geo-spatial**: Recherche par coordonnées géographiques
- **Aggregations**: Facets, statistiques, histogrammes
- **Scripting**: Scoring personnalisé en Painless

---

## 2. Benchmarks Performance

### 2.1 Latence (temps de réponse)

| Scénario | SQLite FTS5 | Elasticsearch | Notes |
|----------|-------------|---------------|-------|
| Recherche simple (1 terme) | **< 5ms** | 10-30ms | FTS5: accès direct B-tree |
| Recherche multi-termes | **< 10ms** | 15-40ms | FTS5: intersection en mémoire |
| Recherche préfixe | **< 10ms** | 15-35ms | FTS5: range scan B-tree |
| Phrase exacte | **< 15ms** | 20-50ms | FTS5: vérification positions |
| Agrégations | N/A | 30-100ms | FTS5: pas d'agrégations natives |

**Pour 12 500 documents:**
- FTS5 maintient une latence quasi-constante quel que soit le nombre de docs
- ES a un overhead fixe (JVM, networking) qui domine à petite échelle

### 2.2 Débit (throughput)

| Configuration | SQLite FTS5 | Elasticsearch |
|---------------|-------------|---------------|
| **Single-node, 1 cœur** | 1 000 - 10 000 QPS | 5 000 - 15 000 QPS |
| **Single-node, 4 cœurs** | 3 000 - 20 000 QPS | 15 000 - 50 000 QPS |
| **Cluster 3 nodes** | N/A | 50 000 - 200 000+ QPS |

**Analyse pour Pneu-Tracker (10 req/s pic):**
- FTS5: utilisation ~0.1% capacité (surcharge massive)
- ES: utilisation ~0.02% capacité (surcharge encore plus massive)

### 2.3 Consommation ressources

| Ressource | SQLite FTS5 | Elasticsearch (mini) | Elasticsearch (prod) |
|-----------|-------------|---------------------|---------------------|
| **RAM** | 10-100 MB | 1-2 GB | 8-64 GB |
| **CPU** | 1 cœur suffit | 2 cœurs | 4+ cœurs |
| **Disque** | ~2x taille données | 10-50 GB SSD | 100 GB+ SSD |
| **Réseau** | Local uniquement | 1 Gbps recommandé | 10 Gbps |

**Pour 12 500 références pneus (~10 MB données):**
- FTS5: ~20-30 MB RAM, ~20 MB disque
- ES: ~1.5 GB RAM minimum, ~5 GB disque + logs

### 2.4 Temps d'indexation

| Opération | SQLite FTS5 | Elasticsearch |
|-----------|-------------|---------------|
| Indexation initiale (12 500 docs) | **< 1 seconde** | 5-15 secondes |
| Mise à jour incrémentale | **< 10ms** | 50-200ms |
| Rebuild complet | **< 2 secondes** | N/A (pas nécessaire) |

---

## 3. Comparaison Fonctionnalités

### 3.1 Recherche floue (Fuzzy Search)

| Aspect | SQLite FTS5 | Elasticsearch |
|--------|-------------|---------------|
| **Support natif** | ❌ Non | ✅ Oui (Levenshtein) |
| **Workaround FTS5** | Tokenizer trigram (expérimental) | N/A |
| **Précision** | Moyenne (trigrams) | Élevée (distance édit) |
| **Performance** | Lente (scan) | Rapide (automates FST) |

**Recommandation Pneu-Tracker:**
La recherche floue n'est pas critique pour des références pneus précises ("205/55R16" doit matcher exactement). Si besoin, utiliser le tokenizer trigram de FTS5 ou implémenter une suggestion d'autocomplétion.

### 3.2 Recherche par phrase

| Aspect | SQLite FTS5 | Elasticsearch |
|--------|-------------|---------------|
| **Syntaxe** | `"pneu hiver"` | `"pneu hiver"` |
| **Proximity search** | `NEAR/5` | `slop` parameter |
| **Performance** | ✅ Rapide | ✅ Rapide |
| **Positions stockées** | ✅ Oui | ✅ Oui |

**Verdict:** Équivalent pour Pneu-Tracker.

### 3.3 Recherche préfixe

| Aspect | SQLite FTS5 | Elasticsearch |
|--------|-------------|---------------|
| **Syntaxe** | `mich*` | `mich*` |
| **Implementation** | Range scan B-tree | FST traversal |
| **Performance** | ✅ < 10ms | ✅ < 5ms |

**Verdict:** Équivalent pour Pneu-Tracker.

### 3.4 Agrégations et facets

| Aspect | SQLite FTS5 | Elasticsearch |
|--------|-------------|---------------|
| **Agrégations** | ❌ Non supporté | ✅ Buckets, metrics, pipelines |
| **Faceted search** | ❌ Non | ✅ Native |
| **Histogrammes** | ❌ Non | ✅ Date/number histograms |
| **Workaround FTS5** | GROUP BY SQL manuel | N/A |

**Impact Pneu-Tracker:**
Si besoin de filtres par marque/dimension avec compteurs (`Michelin (45)`, `Continental (32)`), FTS5 nécessite des requêtes SQL additionnelles. C'est gérable pour 12 500 refs.

### 3.5 Autocomplétion

| Aspect | SQLite FTS5 | Elasticsearch |
|--------|-------------|---------------|
| **Prefix suggest** | `LIKE 'prefix%'` ou table auxiliaire | ✅ Completion suggester |
| **Fuzzy suggest** | ❌ Difficile | ✅ Fuzzy + context |
| **Performance** | ✅ < 5ms | ✅ < 2ms |

### 3.6 Tableau récapitulatif

| Fonctionnalité | SQLite FTS5 | Elasticsearch | Priorité Pneu-Tracker |
|----------------|-------------|---------------|----------------------|
| Recherche full-text | ✅ | ✅ | Élevée |
| Ranking BM25 | ✅ | ✅ | Élevée |
| Prefix search | ✅ | ✅ | Élevée |
| Phrase search | ✅ | ✅ | Moyenne |
| Fuzzy search | ⚠️ Limité | ✅ | Faible |
| Aggregations | ❌ | ✅ | Moyenne |
| Autocompletion | ⚠️ Manuel | ✅ | Moyenne |
| Géo-spatial | ❌ | ✅ | Nulle |
| Multi-langue | ⚠️ Tokenizers | ✅ Analyzers | Faible |
| Horizontal scaling | ❌ | ✅ | Nulle |

---

## 4. Complexité Opérationnelle

### 4.1 Déploiement

#### SQLite FTS5
```bash
# Déjà inclus dans SQLite ≥ 3.9.0
# Aucune installation requise

# Création table virtuelle
CREATE VIRTUAL TABLE pneus USING fts5(
    reference, 
    marque, 
    dimension,
    description
);
# C'est tout.
```

**Avantages:**
- Zero-config
- Aucune dépendance externe
- Fonctionne sur n'importe quel OS
- Emplacement: fichier `.db` dans le projet

#### Elasticsearch

```bash
# Installation (Ubuntu)
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
sudo apt update && sudo apt install elasticsearch

# Configuration
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch

# Vérification
curl localhost:9200
```

**Complexités:**
- Configuration JVM (heap size, GC)
- Gestion des versions Java
- Sécurisation (TLS, auth)
- Monitoring (cluster health, disk space)
- Backup (snapshots)

### 4.2 Maintenance

| Tâche | SQLite FTS5 | Elasticsearch |
|-------|-------------|---------------|
| **Sauvegarde** | Copier fichier .db | Snapshot API + repository |
| **Mise à jour** | Remplacer fichier | Rolling upgrade cluster |
| **Monitoring** | Optionnel (taille fichier) | Obligatoire (heap, CPU, disk) |
| **Scaling** | Vertical uniquement | Horizontal (ajout nodes) |
| **Recovery** | Restaurer fichier | Rebalancer shards |

### 4.3 Coûts

| Coût | SQLite FTS5 | Elasticsearch |
|------|-------------|---------------|
| **Licence** | Domaine public (SQLite) | SSPL (open source) ou Elastic License |
| **Hébergement** | Inclus dans app | Serveur dédié min 2-4 GB RAM |
| **Cloud managed** | N/A | Elastic Cloud (~$20-50/mois mini) |
| **Temps ops** | ~0h/mois | ~2-5h/mois |
| **Coût total (année 1)** | €0 | €500-2000 (infra + temps) |

---

## 5. Seuil de Basculement FTS5 → Elasticsearch

### 5.1 Quand rester sur FTS5

✅ **Restez sur FTS5 si:**

- < 100 000 documents
- < 100 requêtes/seconde
- Pas besoin d'agrégations complexes
- Équipe sans ops dédié
- Besoin de zéro infrastructure
- App embarquée/mobile/desktop

**Cas d'usage typiques:**
- Apps mobiles (recherche locale)
- Outils desktop
- Prototypes/MVP
- PME avec données modestes
- **Pneu-Tracker** ✓

### 5.2 Quand migrer vers Elasticsearch

🔄 **Envisagez Elasticsearch si:**

- > 500 000 documents
- > 500 req/s
- Besoin d'agrégations temps réel (analytics)
- Recherche multi-tenant complexe
- Équipe ops disponible
- Besoin de HA (high availability)
- Scaling horizontal nécessaire

**Cas d'usage typiques:**
- E-commerce (millions de produits)
- Logs/métriques (ELK stack)
- Réseaux sociaux
- Recherche documentaire entreprise

### 5.3 Zone grise (100K - 500K docs)

Alternatives à considérer:
- **Meilisearch**: Container unique, plus simple qu'ES
- **Typesense**: Open source, performant, cloud-native
- **Quickwit**: Pour logs, très économique

---

## 6. Recommandation Spécifique Pneu-Tracker

### 6.1 Contexte

| Paramètre | Valeur | Analyse |
|-----------|--------|---------|
| Documents | 12 500 | Très faible |
| Requêtes/s | 10 pic | Très faible |
| Type données | Références pneus | Structuré, précis |
| Recherche | Marque, dimension, modèle | Prefix + exact |
| Équipe | Sûrement limitée | Pas d'ops dédié |

### 6.2 Recommandation: SQLite FTS5 ✅

**Verdict: FTS5 sans hésitation.**

Elasticsearch serait:
- **Over-engineering** extrême (100x la capacité nécessaire)
- **Coût injustifié** (temps + infrastructure)
- **Complexité** non nécessaire

### 6.3 Schéma recommandé

```sql
-- Table principale
CREATE TABLE pneus (
    id INTEGER PRIMARY KEY,
    reference TEXT UNIQUE NOT NULL,
    marque TEXT NOT NULL,
    dimension TEXT NOT NULL,
    type TEXT, -- été, hiver, 4 saisons
    description TEXT,
    prix DECIMAL(10,2),
    stock INTEGER DEFAULT 0
);

-- Index FTS5
CREATE VIRTUAL TABLE pneus_fts USING fts5(
    reference,
    marque,
    dimension,
    description,
    content='pneus',
    content_rowid='id'
);

-- Trigger pour synchro automatique
CREATE TRIGGER pneus_ai AFTER INSERT ON pneus BEGIN
    INSERT INTO pneus_fts(rowid, reference, marque, dimension, description)
    VALUES (new.id, new.reference, new.marque, new.dimension, new.description);
END;

CREATE TRIGGER pneus_ad AFTER DELETE ON pneus BEGIN
    INSERT INTO pneus_fts(pneus_fts, rowid) VALUES('delete', old.id);
END;

CREATE TRIGGER pneus_au AFTER UPDATE ON pneus BEGIN
    INSERT INTO pneus_fts(pneus_fts, rowid) VALUES('delete', old.id);
    INSERT INTO pneus_fts(rowid, reference, marque, dimension, description)
    VALUES (new.id, new.reference, new.marque, new.dimension, new.description);
END;
```

### 6.4 Requêtes exemples

```sql
-- Recherche simple avec ranking
SELECT p.*, rank 
FROM pneus p
JOIN pneus_fts fts ON p.id = fts.rowid
WHERE pneus_fts MATCH 'michelin'
ORDER BY rank;

-- Recherche préfixe (autocomplétion)
SELECT DISTINCT reference 
FROM pneus_fts 
WHERE reference MATCH '205*'
LIMIT 10;

-- Recherche multi-critères
SELECT p.*, rank
FROM pneus p
JOIN pneus_fts fts ON p.id = fts.rowid
WHERE pneus_fts MATCH 'michelin AND hiver'
ORDER BY rank;

-- Filtres avec compteurs (facet-like)
SELECT marque, COUNT(*) as count 
FROM pneus 
WHERE id IN (
    SELECT rowid FROM pneus_fts WHERE pneus_fts MATCH 'hiver'
)
GROUP BY marque;
```

### 6.5 Optimisations suggérées

1. **Tokenizer personnalisé** pour dimensions:
```sql
-- Permet recherche "205" ou "55" ou "R16"
CREATE VIRTUAL TABLE pneus_fts USING fts5(
    reference,
    marque,
    dimension,
    tokenize='unicode61 "tokenchars=/"'
);
```

2. **Contentless table** pour économiser l'espace:
```sql
-- Si données source déjà dans table principale
CREATE VIRTUAL TABLE pneus_fts USING fts5(
    reference, marque, dimension,
    content='',
    content_rowid='id'
);
-- 30-50% d'économie d'espace
```

3. **Index préfixe** pour autocomplétion rapide:
```sql
-- Crée index pour préfixes jusqu'à 3 caractères
INSERT INTO pneus_fts(pneus_fts) VALUES('prefix=3');
```

---

## 7. Plan de Migration (si passage à ES un jour)

### 7.1 Quand envisager la migration

- Dépassement 100 000 références
- Besoin d'analytics avancés
- Multi-centre de service (réplication)

### 7.2 Étapes de migration

```
Phase 1: Préparation (1 semaine)
├── Audit requêtes FTS5 existantes
├── Mapping schéma ES
├── Setup cluster ES (1 node pour débuter)
└── Tests de charge

Phase 2: Double écriture (2 semaines)
├── Écriture simultanée SQLite + ES
├── Validation cohérence données
├── Shadow traffic (ES en lecture, pas utilisé)
└── Monitoring comparaison latence

Phase 3: Bascule (1 jour)
├── Switch lecture vers ES
├── Rollback plan prêt
└── Monitoring intensif

Phase 4: Cleanup (1 semaine)
├── Suppression triggers SQLite
├── Archive données SQLite
└── Documentation runbooks ES
```

### 7.3 Outils de migration

```python
# Exemple script migration Python
import sqlite3
from elasticsearch import Elasticsearch

es = Elasticsearch(['localhost:9200'])
conn = sqlite3.connect('pneu_tracker.db')

# Création index ES avec mapping
es.indices.create(
    index='pneus',
    body={
        'mappings': {
            'properties': {
                'reference': {'type': 'keyword'},
                'marque': {'type': 'keyword'},
                'dimension': {'type': 'text', 'analyzer': 'standard'},
                'description': {'type': 'text', 'analyzer': 'french'},
                'prix': {'type': 'float'}
            }
        }
    }
)

# Migration batch
batch_size = 1000
cursor = conn.execute('SELECT * FROM pneus')
while True:
    rows = cursor.fetchmany(batch_size)
    if not rows:
        break
    
    actions = [
        {'_index': 'pneus', '_id': r[0], '_source': {
            'reference': r[1], 'marque': r[2], ...
        }}
        for r in rows
    ]
    es.bulk(body=actions)
```

---

## 8. Conclusion

| Critère | Gagnant | Écart |
|---------|---------|-------|
| Performance (latence) | FTS5 | 3-5x plus rapide |
| Simplicité | FTS5 | Écrasant |
| Coût | FTS5 | 100% gratuit |
| Fonctionnalités | ES | Mais overkill |
| Scalabilité | ES | Inutile ici |

**Décision finale pour Pneu-Tracker:**

> Utilisez **SQLite FTS5**. C'est la solution la plus simple, rapide et économique pour votre échelle. Vous avez 12 500 références et 10 req/s — FTS5 gère ça dans son sommeil sans consommer plus de 50 MB RAM.
> 
> Gardez Elasticsearch en tête si vous dépassez 100 000 références ou si vous avez besoin d'analytics complexes, mais pour l'instant ce serait comme utiliser un camion semi-remorque pour livrer une pizza.

---

## Références

1. [SQLite FTS5 Official Documentation](https://www.sqlite.org/fts5.html)
2. [Structure of FTS5 Index](https://darksi.de/13.sqlite-fts5-structure/)
3. [SQLite Cloud - FTS5 Extension](https://blog.sqlite.ai/fts5-sqlite-text-search-extension)
4. [Full-Text Search in SQLite: A Practical Guide](https://medium.com/@johnidouglasmarangon/full-text-search-in-sqlite-a-practical-guide-80a69c3f42a4)
5. [Elasticsearch Minimum Requirements](https://opster.com/guides/elasticsearch/capacity-planning/elasticsearch-minimum-requirements/)
6. [Elasticsearch from the Bottom Up](https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up)
7. [Perplexity AI - FTS5 vs ES Comparisons](perplexity.ai)

---

*Document généré le 15 mars 2026 pour le projet Pneu-Tracker*
*Volume de données: 12 500 références, 10 req/s pic*
*Recommandation: SQLite FTS5*
