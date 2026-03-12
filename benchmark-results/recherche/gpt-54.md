# FTS5 vs Elasticsearch pour une application SQLite — état de l’art 2025–2026

## Introduction

Comparer **SQLite FTS5** et **Elasticsearch** revient à comparer deux philosophies d’architecture plus qu’un simple moteur de recherche. FTS5 est une extension **embarquée** dans SQLite : l’index, les données et l’exécution des requêtes vivent au plus près de l’application. Elasticsearch est au contraire un moteur **séparé**, distribué, pensé pour indexer à grande échelle, absorber du volume, paralléliser sur plusieurs nœuds et offrir un langage de requête riche.

En 2025–2026, la question devient très concrète pour les applications qui utilisent déjà SQLite comme base principale : faut-il garder la recherche “dans le process” avec FTS5, ou ajouter un composant externe de type Elasticsearch ? Le bon choix dépend surtout de quatre facteurs : **latence**, **complexité opérationnelle**, **type de requêtes** et **niveau d’échelle**.

Le point clé qui ressort des sources récentes est le suivant : pour beaucoup de cas “app search” classiques — recherche textuelle sur quelques champs, BM25, préfixes, quelques filtres — **FTS5 couvre une part étonnamment large du besoin**. En revanche, dès qu’on veut du **fuzzy riche**, de la montée en charge horizontale, des volumes massifs ou des pipelines de recherche avancés, Elasticsearch garde une nette avance.

## Architecture des deux solutions

## SQLite FTS5

FTS5 est un module de **virtual table** qui construit un **index inversé** directement dans SQLite. Il supporte nativement :

- recherche par termes ;
- requêtes multi-termes ;
- phrases ;
- requêtes de proximité `NEAR` ;
- préfixes ;
- opérateurs booléens ;
- classement par **BM25** ;
- fonctions utilitaires comme `highlight()` et `snippet()`.

L’énorme avantage architectural, c’est la **localité** : pas de réseau, pas de sérialisation JSON, pas de cluster, pas de service JVM à maintenir. En pratique, ça réduit la latence de base et simplifie énormément l’exploitation. FTS5 peut aussi être configuré avec une table de contenu externe, des options de préfixe et différents tokenizers.

Mais FTS5 reste fondamentalement un moteur **embarqué et mono-fichier**. Il n’est pas conçu pour répartir l’index sur plusieurs machines. Les filtres structurés complexes, facettes avancées et traitements linguistiques sophistiqués demandent souvent une modélisation manuelle autour de l’index FTS.

## Elasticsearch

Elasticsearch repose sur Lucene et fonctionne comme un moteur **séparé** accessible en HTTP. Son architecture repose sur des **indices**, **shards**, **replicas**, caches système, mémoire JVM et fichiers d’index optimisés pour la recherche à grande échelle.

Ses points forts :

- requêtes full-text avancées ;
- **fuzzy query** basée sur la distance de Levenshtein ;
- combinaisons riches avec `bool`, `must`, `should`, `filter`, `must_not` ;
- scaling horizontal ;
- tolérance de panne ;
- écosystème mature pour analytics, logs et recherche distribuée.

Le prix à payer est connu : plus de complexité, plus de tuning, et souvent plus de latence minimale. Elastic rappelle lui-même que la performance dépend fortement du **nombre de shards**, de la mémoire allouée au **filesystem cache**, du matériel, de la modélisation des documents et du coût des requêtes.

## Benchmarks de performance

## 1) Requêtes simples

Sur les requêtes textuelles simples, FTS5 est souvent extrêmement compétitif, voire meilleur, parce qu’il supprime tous les coûts “hors recherche” : appel réseau, parsing JSON, routage vers shard, coordination de nœuds.

Une source terrain de 2025 sur un backend Drupal/CakePHP rapporte environ **57 ms de latence moyenne** et **~840 requêtes/seconde** avec un index d’environ **7 000 documents**, sous charge locale (`wrk`, 8 threads, 50 connexions, 30 s). L’auteur insiste sur le fait que l’environnement n’était pas optimisé production, mais le signal est clair : pour un moteur embarqué, FTS5 n’est pas le goulot d’étranglement.

Une autre source 2025, plus qualitative, décrit le remplacement d’Elasticsearch par SQLite FTS5 avec une chute de la latence médiane vers des **single-digit milliseconds** sur une charge applicative simple (titres, corps, tags, léger biais de fraîcheur). L’article est partiellement verrouillé, donc il faut le prendre comme un retour d’expérience plus que comme un benchmark auditable, mais il va dans le même sens : **quand le besoin reste simple, la proximité gagne**.

## 2) Fuzzy / tolérance aux fautes

C’est ici qu’Elasticsearch prend une avance nette. La **fuzzy query** génère des expansions à partir d’une distance d’édition ; Elastic prévient d’ailleurs qu’un `max_expansions` élevé peut coûter cher en performance. Autrement dit, Elasticsearch sait faire ce type de recherche nativement, mais ce n’est pas “gratuit” : plus la tolérance est large, plus la requête devient chère.

FTS5, lui, n’offre pas un fuzzy équivalent “out of the box” au niveau Lucene/Elasticsearch. Il sait très bien faire du terme, du préfixe, de la proximité et du BM25, mais pour la faute de frappe, l’approximation orthographique ou des expansions avancées, il faut bricoler autour (tokenization spécifique, tables auxiliaires, trigrammes, logique applicative). **Pour le fuzzy sérieux, Elasticsearch reste le choix naturel.**

## 3) Requêtes multi-termes / proximité

FTS5 est solide sur ce terrain. Sa syntaxe supporte phrases, booléens, préfixes et `NEAR`, ce qui couvre une large partie des besoins de recherche documentaire. Pour un moteur embarqué, c’est franchement costaud.

Elasticsearch gère aussi très bien ces requêtes, mais avec davantage de souplesse pour mixer scoring, champs multiples et logique booléenne complexe. En contrepartie, Elastic recommande explicitement d’éviter les requêtes trop imbriquées et de garder des requêtes “plates” quand possible, parce que la complexité logique dégrade les temps de réponse.

En pratique :

- **FTS5** est excellent pour des requêtes multi-termes classiques sur quelques champs bien choisis.
- **Elasticsearch** devient meilleur quand la requête ressemble à un pipeline de recherche sophistiqué, avec pondérations multi-champs, logique booléenne profonde et enrichissements multiples.

## 4) Filtres combinés

Elasticsearch possède une vraie séparation entre clauses de score (`must`, `should`) et clauses de filtrage (`filter`, `must_not`), avec bénéfice de cache côté filtre. C’est très puissant pour mélanger recherche textuelle + contraintes structurées.

Côté FTS5, la bonne pratique est souvent une **double architecture** :

- table FTS5 pour la pertinence textuelle ;
- table(s) relationnelle(s) SQLite pour les filtres et métadonnées.

Ça marche bien, mais c’est moins natif et demande plus de discipline de modélisation. Pour quelques tags, dates, flags, ça reste nickel. Pour des facettes avancées, agrégations et filtres massifs, Elasticsearch garde un avantage structurel.

## 5) Cas particulier : lookup exact et pièges FTS5

Une discussion du forum SQLite met en évidence un point important : sur de très grosses tables FTS5, `MATCH` peut être **des ordres de grandeur** plus rapide que `=`. Dans l’exemple publié, sur **10 millions** d’enregistrements, `MATCH` tourne autour de **6.254e-05 s** par lookup moyen, contre **1.599 s** avec `=` — soit environ **25 000× plus rapide**. Ce n’est pas un benchmark “FTS5 vs Elasticsearch”, mais c’est un rappel utile : FTS5 peut être redoutablement rapide si on l’utilise avec les bons opérateurs, et très mauvais si on le traite comme une table SQL classique.

## Limites de chaque approche

## Limites de FTS5

- pas de scaling horizontal natif ;
- fuzzy et NLP limités par rapport à Elasticsearch ;
- besoin fréquent de combiner FTS + tables relationnelles pour les filtres ;
- moins d’outillage natif pour analytics/facettes avancées ;
- certaines subtilités de syntaxe et de performance (`MATCH` vs `=`) peuvent piéger.

## Limites d’Elasticsearch

- complexité opérationnelle plus élevée ;
- besoin de tuning (shards, mémoire, stockage, mappings) ;
- latence minimale souvent moins bonne qu’un moteur embarqué local ;
- coût infra + observabilité + maintenance ;
- certaines requêtes riches, notamment fuzzy large ou bool deeply nested, peuvent devenir coûteuses.

## Recommandation selon le cas d’usage

### Choisir FTS5 si :

- l’application est déjà centrée sur SQLite ;
- le corpus va de petit à moyen (jusqu’à quelques centaines de milliers de documents, voire davantage selon le profil) ;
- les requêtes sont surtout : mots-clés, multi-termes, préfixes, proximité, BM25, quelques filtres ;
- tu veux **latence basse**, simplicité de déploiement et zéro service externe.

### Choisir Elasticsearch si :

- tu as besoin de **fuzzy robuste**, analyzers avancés, pipelines linguistiques, scoring complexe ;
- tu combines recherche + gros volume + haute concurrence + scaling horizontal ;
- tu veux des capacités avancées autour d’analytics, agrégations, observabilité, réplication et haute dispo.

### Mon verdict 2025–2026

Pour une application **SQLite-native**, le choix par défaut devrait être **FTS5 d’abord**. Pas par idéologie, mais parce que le ratio **performance / simplicité / coût** est souvent meilleur tant que le besoin reste dans le “sweet spot” du full-text applicatif. Elasticsearch ne devient rentable que quand les besoins dépassent clairement ce sweet spot.

Autrement dit : **si ton problème est local, garde-le local**. N’ajoute Elasticsearch que si tu as une vraie raison produit ou échelle — pas juste par réflexe “enterprise”.

## Sources

1. SQLite Documentation — FTS5 Extension  
   https://www.sqlite.org/fts5.html

2. Elastic Documentation — Fuzzy query  
   https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-fuzzy-query

3. Elastic Documentation — Boolean query  
   https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-bool-query

4. Elastic Documentation — Tune for search speed  
   https://www.elastic.co/docs/deploy-manage/production-guidance/optimize-performance/search-speed

5. Jasper Smet — SQLite FTS5 for (Drupal) Search API  
   https://www.jaspersmet.be/posts/sqlite-ft5-for-search-api/

6. SQLite User Forum — FTS5 tables, = vs. MATCH, index 0, and performance discussion  
   https://sqlite.org/forum/info/4574555168ff4c9d

7. Medium — I Replaced Elasticsearch with SQLite and Our Search Got 100× Faster  
   https://medium.com/@build_break_learn/i-replaced-elasticsearch-with-sqlite-and-our-search-got-100-faster-5343a4458dd4
