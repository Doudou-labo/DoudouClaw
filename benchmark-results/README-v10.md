# 🔬 Benchmark LLM — Analyse Comparative Complète 14 Modèles (README-v10)

> **Dates :** 2026-03-12 (4 modèles) · 2026-03-13 (k2p5) · 2026-03-15 (Step-3.5 Flash, GPT-OSS-120b, Haiku-4-5, Gemini Flash, Gemini Pro, Trinity, Nemotron-3) · 2026-03-19 (**MiniMax-M2.5, MiniMax-M2.5-highspeed**)
> 
> Cette version **v10** reprend bien la continuité du **v9** — donc **les 12 modèles précédents restent analysés et comparés** — mais elle réinjecte le **niveau de détail narratif du v5** : gros paragraphes par modèle, lecture de personnalité technique, limites notables, et verdicts commentés qui ne ressemblent pas à un simple tableau Excel déguisé.

---

## Les 14 concurrents

| Modèle | Alias | Provider | Prix |
|--------|-------|----------|------|
| `openrouter/openrouter/healer-alpha` | **Healer Alpha** | OpenRouter | 🆓 Gratuit |
| `anthropic/claude-sonnet-4-6` | **Sonnet 4.6** | Anthropic | 💰 Payant |
| `openai-codex/gpt-5.4` | **GPT-5.4** | OpenAI | 💰 Payant |
| `openrouter/hunter-alpha` | **Hunter Alpha** | OpenRouter | 🆓 Gratuit |
| `kimi-coding/k2p5` | **k2p5** | Moonshot / Kimi | 💰 Payant |
| `openrouter/stepfun/step-3.5-flash:free` | **Step-3.5 Flash** | StepFun | 🆓 Gratuit |
| `openrouter/openai/gpt-oss-120b:free` | **GPT-OSS-120b** | OpenAI open-source | 🆓 Gratuit |
| `anthropic/claude-haiku-4-5` | **Haiku 4.5** | Anthropic | 💰 Payant |
| `google-gemini-cli/gemini-3-flash-preview` | **Gemini Flash** | Google | 💰 Payant |
| `google-gemini-cli/gemini-3.1-pro-preview` | **Gemini Pro** | Google | 💰 Payant |
| `openrouter/arcee-ai/trinity-large-preview:free` | **Trinity** 🆕 | Arcee AI | 🆓 Gratuit |
| `openrouter/nvidia/nemotron-3-super-120b-a12b:free` | **Nemotron-3** 🆕 | NVIDIA | 🆓 Gratuit |
| `minimax/MiniMax-M2.5` | **MiniMax-M2.5** 🆕 | MiniMax | 💰 Payant |
| `minimax/MiniMax-M2.5-highspeed` | **MiniMax-M2.5-highspeed** 🆕 | MiniMax | 💰 Payant |

---

# 🖥️ TÂCHE 1 — Code TypeScript : IntervalTree

## Résultats bruts

| Modèle | Architecture | Lignes impl. | Lignes tests | Tests | Feature bonus |
|--------|-------------|-------------:|-------------:|------:|---------------|
| Healer Alpha | BST augmenté | 192 | 274 | **18** | — |
| **Sonnet 4.6** | **Red-Black Tree** | 438 | 229 | 15 | `queryInterval()` |
| GPT-5.4 | AVL Tree | 242 | 151 | 13 | — |
| Hunter Alpha | Red-Black BST (LLRB) | 238 | 206 | 15 | — |
| k2p5 | AVL Tree | 364 | 282 | 12+ | `searchInterval()` |
| Step-3.5 Flash | AVL Tree | 281 | 267 | 12 | `searchOverlap()` |
| GPT-OSS-120b | AVL Tree | ~250* | ~400* | **57** | `toArray()`, pruning |
| **Haiku 4.5** | **Red-Black Tree** | **556** | **622** | 42 | `verify()`, floats, négatifs |
| Gemini Flash | AVL Tree | 210 | 110 | 8 | — |
| Gemini Pro | AVL Tree | 227 | 98 | 7 | — |
| **Trinity** 🆕 | **AVL Tree augmenté** | **318** | **466** | **30** | benchmarks, stress, utils |
| Nemotron-3 🆕 | ❌ Rate limit | — | — | — | ❌ |
| **MiniMax-M2.5** 🆕 | **BST à point médian** | **210** | **152** | **18** | exécution 18/18 |
| **MiniMax-M2.5-highspeed** 🆕 | **AVL augmenté** | **326** | **214** | **21** | `overlapsPoint`, `searchOverlap`, `inOrder`, `size`, stress test |

*\* Estimé — GPT-OSS-120b a fourni 57/57 tests sans détailler les lignes exactes*

## Analyse et commentaires par modèle

### 🟢 Healer Alpha — Le champion des tests économiques

Healer Alpha adopte un **BST simple augmenté avec `maxEnd`**, sans équilibrage automatique. Sur le papier, c’est la solution la moins sophistiquée de la bande — et pourtant ça reste l’un des résultats les plus respectables en pratique, parce que le modèle compense sa simplicité architecturale par une vraie obsession du test. Avec **18 tests**, il ne cherche pas à impressionner par la théorie ; il cherche à rassurer par la couverture.

Ce que ça raconte sur le modèle est assez clair : Healer pense d’abord **livraison, lisibilité, maintenance**. Il préfère un algo moins noble mais bien vérifié à une structure de donnée brillante écrite pour flatter l’ego. C’est souvent une très bonne stratégie dans le monde réel. La limite, elle aussi, est limpide : sans équilibrage, l’arbre peut dégénérer en liste chaînée sur des insertions mal ordonnées. Donc oui, c’est propre, oui c’est pragmatique — mais non, ce n’est pas l’option que tu choisis si tu veux dormir tranquille sur de gros volumes ou des patterns d’écriture hostiles.

---

### 🔵 Sonnet 4.6 — L’excellence technique pure

Sonnet 4.6 reste l’un des modèles les plus impressionnants du benchmark sur le pur terrain algorithmique. Son **Red-Black Tree complet** n’est pas juste “fonctionnel” : il donne l’impression d’être pensé par quelqu’un qui sait exactement où sont les pièges. Les rotations, le rééquilibrage, la mise à jour correcte de `maxEnd` pendant les transformations — c’est précisément là que beaucoup d’implémentations LLM deviennent approximatives. Pas ici.

Le détail qui fait mal au reste du tableau, c’est l’ajout de `queryInterval()`. Personne ne l’avait demandé. Sonnet l’a mis parce qu’un vrai utilisateur d’interval tree finit presque toujours par vouloir cette primitive. C’est une démonstration de **vision produit appliquée à un problème algorithmique**. Son défaut ? Il est cher en complexité. Avec Sonnet, tu n’achètes pas seulement une réponse correcte, tu payes une ambition technique qui dépasse la spec. Parfois c’est exactement ce qu’il faut. Parfois c’est du luxe.

---

### 🟡 GPT-5.4 — Le scolaire solide

GPT-5.4 choisit la route attendue : **AVL Tree**, approche prudente, implémentation claire, zéro panache inutile. C’est la copie du bon élève. Il ne tente pas un Red-Black Tree complet, ne part pas dans des features surprises, ne fait pas semblant d’être plus visionnaire qu’il ne l’est. Il fait quelque chose qui tient debout.

Le souci, c’est que dans un benchmark où les autres modèles se distinguent par la couverture, les bonus ou la finesse algorithmique, GPT finit par donner une impression un peu plate. On sent davantage le respect du cahier des charges que l’intelligence de l’étape d’après. Le fait qu’il soit le seul modèle payant sans vraie feature bonus pèse lourd symboliquement : il donne le minimum sérieux, pas plus. Rien de honteux, mais clairement pas le plus excitant du lot.

---

### 🟠 Hunter Alpha — L’efficace compact

Hunter Alpha joue la carte du **Red-Black Tree compact**, avec une approche LLRB inspirée de Sedgewick. C’est une très belle démonstration de pragmatisme algorithmique : on reste sur une structure techniquement noble, mais avec une implémentation plus resserrée que Sonnet, moins ostentatoire, plus “outil d’ingénieur” que “pièce de concours”.

C’est précisément ce qui rend Hunter attachant dans ce benchmark : il n’essaie pas d’être le plus bavard ni le plus spectaculaire. Il essaie d’être **efficace**. Il ne va pas aussi loin que Sonnet sur les features ou la pureté de démonstration, mais il donne constamment envie de dire : “ok, je peux bosser avec ça”. Ce n’est pas le roi du benchmark code, mais c’est un excellent compromis entre sophistication et sobriété.

---

### 🟣 k2p5 — Le pragmatique francophone

k2p5 reste fidèle à son personnage : **équilibré, contextuel, propre**. Son choix AVL est sage, mais il compense avec une densité d’implémentation supérieure, une vraie attention à la lisibilité, et surtout cette tendance à s’adapter au lecteur plutôt qu’à la seule spec. Dans les itérations précédentes, il s’était déjà distingué par la documentation en français et par un sens de l’empathie technique qui manque souvent aux autres modèles.

Avec `searchInterval()`, il rejoint Sonnet dans la catégorie des modèles qui comprennent que l’API demandée n’est pas l’API complète dont l’utilisateur aura envie demain. C’est une preuve de projection. Là où Sonnet impressionne par sa virtuosité, k2p5 rassure par sa **maturité d’usage**. Il n’a pas toujours la réponse la plus brillante, mais très souvent celle qu’on a le plus envie de relire dans une vraie base de code.

---

### 🔵 Step-3.5 Flash — Le pragmatique gratuit

Step-3.5 Flash continue de jouer un rôle très agaçant pour les modèles payants : celui du gratuit qui fait **vraiment** le taf. Son AVL est sérieux, suffisamment testé, et sa feature bonus `searchOverlap()` montre qu’il ne répond pas juste au cahier des charges brut. Il réfléchit au problème comme un développeur qui veut rendre la structure utilisable, pas seulement “validable”.

Ce qui le rend particulièrement fort, c’est le ratio **qualité / coût**. Quand un modèle gratuit arrive à rester propre, cohérent, et utile sur plusieurs dimensions du benchmark, il devient difficile à ignorer. Step-3.5 Flash n’est pas le plus noble techniquement, ni le plus dominant, mais c’est typiquement le genre de modèle qui finit par devenir un favori d’usage parce qu’il ne te fait pas payer ses efforts au prix fort.

---

### 🟣 GPT-OSS-120b — Le monstre de tests

GPT-OSS-120b a un profil presque caricatural : sur une tâche bornée comme celle-ci, il peut devenir une machine de guerre. **57 tests**, stress à 1000 inserts, vérifications d’équilibre, approche très production dans l’esprit. C’est un score qui écrase tout le monde sur la seule métrique de couverture brute. Si tu ne regardais que la quantité de validation, il monterait instantanément sur le podium.

Mais justement, c’est là qu’il faut garder la tête froide. Le benchmark complet a déjà montré que GPT-OSS-120b pouvait devenir inutilisable dès qu’on l’ouvrait sur des tâches moins cadrées. Donc oui, sur le code, c’est un putain de monstre local. Mais non, ça ne suffit pas à en faire un champion global. Il est brillant dans son couloir, pas forcément ailleurs.

---

### 🔵 Haiku 4.5 — Le rouleau compresseur complet

Haiku 4.5 reste la référence absolue du benchmark code. **556 lignes d’implémentation, 622 lignes de tests, 42 tests, méthode `verify()`**, prise en compte des flottants et des négatifs — c’est une démonstration d’endurance, de méthode et de sérieux. Là où d’autres modèles écrivent une solution, Haiku construit presque une petite librairie avec son propre outillage de vérification interne.

Ce qui impressionne le plus, c’est que cette masse n’a pas l’air gratuite. Ce n’est pas un modèle qui gonfle artificiellement la réponse pour faire joli. C’est un modèle qui semble avoir une représentation très nette de ce qu’est une implémentation robuste, maintenable et vérifiable d’un interval tree sérieux. Dans ce benchmark, il ne donne pas juste une bonne copie ; il donne une copie qui humilie doucement la plupart des autres.

---

### 🟢 Gemini Flash — L’AVL standard

Gemini Flash produit un **AVL Tree standard**, propre, lisible, mais sans ambition particulière. Il coche les cases, il ne se vautre pas, mais il ne surprend jamais. On n’a pas l’impression de lire un modèle qui pousse le sujet jusqu’à ses conséquences naturelles ; on lit un modèle qui veut avant tout rester dans la zone du “correct”.

Ce n’est pas rien : beaucoup de modèles n’arrivent déjà pas à être proprement corrects. Mais face à Haiku, Sonnet, Trinity ou même le MiniMax highspeed, Gemini Flash paraît un peu léger. Il est défendable, simplement il ne laisse pas de trace mémorable.

---

### 🔵 Gemini Pro — L’AVL rigueur, sans élan

Gemini Pro est à peu près la même histoire que Flash, avec un poil plus de rigueur apparente, mais pas un bond qualitatif énorme. Il semble plus appliqué, parfois un peu plus prudent sur les erreurs, mais sa faible couverture de tests et l’absence de bonus le maintiennent dans la zone des copies sages.

C’est le genre de résultat que tu peux accepter sans broncher, mais pas celui que tu vas citer comme modèle. En gros : sérieux, propre, mais trop timide pour une compétition de ce niveau.

---

### 🟢 Trinity 🆕 — La meilleure surprise gratuite moderne

Trinity avait déjà frappé fort au v9, et ça ne se dément pas ici. Son **AVL augmenté**, ses **30 tests**, ses benchmarks, ses utilitaires et son stress testing en font un modèle gratuit vraiment impressionnant. Ce n’est pas juste “bon pour du gratuit”. C’est **bon tout court**. Il donne une réponse qui ressemble à un travail d’ingénierie complet, pas à un simple jet de LLM bien calibré.

Là où Trinity devient fascinant, c’est dans sa consistance. Il ne gagne pas par un unique coup d’éclat. Il gagne par accumulation de sérieux. Il comprend très bien ce qui, dans un benchmark de code, fait dire “ok, ce modèle mérite qu’on le garde sous la main”. Il n’atteint pas la domination d’Haiku, mais il force le respect et il massacre la vieille idée selon laquelle gratuit = compromis pénible.

---

### 🔴 Nemotron-3 🆕 — Le fantôme

Sur cette tâche, Nemotron-3 reste ce qu’il était déjà dans le v9 : une présence théorique, pas une contribution réelle. Pas d’exécution, pas de code, pas de signal exploitable. Dans un benchmark pratique, un modèle qui ne livre rien vaut zéro, même s’il a 120B paramètres sur le papier.

---

### 🟡 MiniMax-M2.5 🆕 — Le classique efficace, sans esbroufe

MiniMax-M2.5 n’a pas fait une entrée flamboyante, mais il a fait quelque chose de plus important : **il a livré proprement**. Son **BST à point médian**, avec `maxEnd` pour l’élagage et suppression par successeur inorder, n’a rien de révolutionnaire. C’est une architecture classique, lisible, presque modeste. Et pourtant, cette modestie a une vertu énorme : elle lui permet de rester cohérent, compact et fiable. **18 tests sur 18 passent**, le code reste contenu à 210 lignes, et l’ensemble respire la solution qu’on peut réellement relire sans souffrir.

La faiblesse de cette approche, évidemment, c’est qu’on n’est pas au niveau de robustesse d’un AVL ou d’un Red-Black Tree bien implémenté. Sur des jeux de données défavorables, on sait que ça peut mordre. Mais il faut reconnaître au modèle une qualité souvent sous-estimée : il ne joue pas au plus malin. Il donne un code honnête, bien cadré, proprement validé. Ce n’est pas la star du benchmark code, mais ce n’est sûrement pas un figurant non plus.

---

### 🔵 MiniMax-M2.5-highspeed 🆕 — Le speed model qui bosse vraiment

La version **highspeed** est clairement la meilleure surprise MiniMax de cette édition. Là où on pouvait craindre un modèle “rapide donc expédié”, on se retrouve avec un **AVL augmenté**, **21 tests verts**, plusieurs helpers bonus, un `size`, un `inOrder`, et même un stress test à 500 intervalles. Ce n’est pas du tout le profil d’un modèle speed jetable ; c’est le profil d’un modèle qui a gardé de vraies ambitions malgré sa promesse de vitesse.

Ce qui l’empêche de monter encore plus haut, c’est qu’il y a une légère zone de fragilité sur `searchOverlap`, avec un edge case récursif qui n’a pas été totalement assumé dans la validation finale. Rien de catastrophique, parce que le cœur demandé est bon. Mais juste assez pour rappeler qu’on n’est pas sur l’irréprochabilité clinique d’un Haiku ou la pureté technique d’un Sonnet. Malgré ça, franchement, pour un modèle nommé *highspeed*, c’est une performance qui force le respect.

## Verdict code — podium commenté (14 modèles)

```
🥇 Haiku 4.5          → 42 tests, verify(), couverture monstrueuse
🥈 Sonnet 4.6         → Red-Black Tree le plus propre techniquement
🥉 MiniMax-M2.5-highspeed 🆕 → AVL augmenté, 21/21 tests, vraie bonne surprise
4e Trinity 🆓         → 30 tests, benchmarks, solidité gratuite exceptionnelle
5e GPT-OSS-120b 🆓    → 57 tests, machine locale de validation
6e Hunter Alpha 🆓    → compact, fiable, propre
7e k2p5              → bon sens d’implémentation + adaptation contexte
8e MiniMax-M2.5 🆕    → classique, propre, 18/18 verts
9e Step-3.5 Flash 🆓  → très bon gratuit de production
10e Healer Alpha 🆓   → couverture > sophistication
11e GPT-5.4           → sérieux mais sans relief
12e Gemini Flash 💰   → standard
13e Gemini Pro 💰     → standard un peu plus sage
❌ Nemotron-3 🆓      → DNF
```

---

# 🔍 TÂCHE 2 — Analyse de logs serveur

## Résultats bruts

| Modèle | Requêtes | Taux erreur | Patterns | Score santé / lecture | Style |
|--------|----------|-------------|----------|------------------------|-------|
| Healer Alpha | 45 ✅ | 40.0% | 6 | ~4/10 | Diagnostic médical |
| **Sonnet 4.6** | 45 ✅ | **31.1%** | 5 | 3.5/10 | Architecte système |
| GPT-5.4 | **52** ❌ | 40.4% | 5 | ~4/10 | Data analyst |
| Hunter Alpha | **49** ❌ | 42.9% | 6 | ~3/10 | Détective causal |
| k2p5 | 45 ✅ | 44.4% | 5 | ~3/10 | Business / risque |
| Step-3.5 Flash | 45 ✅ | 37.8% | 5 | 2/10 | Systémique cascade |
| GPT-OSS-120b | 45 ✅ | 35.6% | 5 | 6.5/10 | Quantitatif formule |
| **Haiku 4.5** | 45 ✅ | 37.78% | 5 | 2.5/10 | Statisticien précis |
| Gemini Flash | 45 ✅ | 28.9% | 5 | ~3/10 | Tableau endpoint |
| Gemini Pro | 45 ✅ | 40.0% | 6 | 3.2/10 | Vue exécutive |
| **Trinity** 🆕 | 45 ✅ | **42.2%** | **5** | **3/10** | Diagnosticien rigoureux |
| Nemotron-3 🆕 | ❌ | — | — | — | ❌ Rate limit |
| **MiniMax-M2.5** 🆕 | 45 ✅ | cohérent | 5+ | **8/10** | Diagnostic structuré |
| **MiniMax-M2.5-highspeed** 🆕 | 45 ✅ | cohérent | 7 | **8/10** | Chronologie + P1/P2/P3 |

## Analyse et commentaires par modèle

### 🟢 Healer Alpha — Le médecin de garde

Healer lit les logs comme un urgentiste lit un patient : **symptômes, causes, traitement**. C’est une approche extrêmement pédagogique, parfois plus utile dans l’urgence qu’une analyse trop théorique. Sa distinction entre temps moyen et temps médian est l’un des meilleurs apports du benchmark, parce qu’elle évite de se faire piéger par les outliers.

Son angle n’est pas le plus chirurgical, mais il est très humainement exploitable. Tu peux donner sa réponse à quelqu’un qui n’est pas SRE pur et il comprendra vite ce qui déconne. Sa faiblesse, c’est une certaine approximation sur le chiffrage global du taux d’erreur. Bonne lecture du système, moins bonne exactitude métrique.

---

### 🔵 Sonnet 4.6 — L’architecte du diagnostic

Sonnet aborde les logs comme un système qui se désarticule. Il produit la lecture la plus structurée par endpoint, avec hiérarchisation P0/P1/P2, ce qui en fait probablement la réponse la plus opérationnelle pour piloter une vraie remédiation. On sent l’ingénieur qui pense déjà au postmortem et au plan d’action.

Sa grande force, c’est la clarté architecturale. Sa légère limite, c’est qu’il traite parfois certains symptômes comme des entités trop autonomes, là où un Hunter ira plus loin sur la causalité fine. Mais globalement, ça reste une très grosse copie.

---

### 🟡 GPT-5.4 — Le data analyst prudent

GPT se distingue par la mention du **P95**, ce qui montre une culture SRE assez saine. Il raisonne correctement sur une partie des patterns et comprend que la panne est partielle, ciblée, non uniforme. Ça, c’est intelligent.

Malheureusement, l’erreur de comptage des requêtes (52 au lieu de 45) plombe la crédibilité du reste. Et dans une analyse de logs, se planter sur le dénominateur, c’est comme rater une addition au milieu d’un audit financier : tu peux encore avoir des intuitions justes, mais tu perds la confiance de la salle. Dommage, parce qu’il y avait de bonnes idées dans la lecture.

---

### 🟠 Hunter Alpha — Le détective causal

Hunter reste l’un des meilleurs du benchmark pour faire ce que beaucoup de modèles oublient : distinguer la **cause racine** du **symptôme secondaire**. Le fait qu’il lise le circuit breaker comme une conséquence de la NPE répétée et non comme une anomalie indépendante est exactement le type de raisonnement qui fait gagner du temps en incident réel.

C’est ce qui fait sa force : il ne se contente pas de décrire le désordre, il essaie de reconstituer le film. Son problème, là encore, est métrique : le comptage brut est faux. Mais son niveau de lecture causale reste tellement fort qu’il garde une place très haute malgré ce défaut. C’est dire à quel point son intuition système est bonne.

---

### 🟣 k2p5 — L’analyste business-opérationnel

k2p5 lit les logs avec un angle très particulier : celui du **risque systémique**. Là où d’autres voient surtout l’impact immédiat métier du paiement cassé, lui met l’**OOM à 10/10**, parce qu’une JVM qui crashe emporte tout le reste avec elle. C’est une vraie divergence d’approche, pas un détail de présentation.

Ce qui est intéressant, c’est que cette divergence a du sens. k2p5 n’est pas moins bon que les autres ; il optimise simplement une autre fonction objectif. Il pense continuité de service globale, pas uniquement point d’impact métier local. Et comme souvent chez lui, cette lecture s’accompagne d’une réponse lisible, structurée, exploitable.

---

### 🔵 Step-3.5 Flash — Le penseur systémique

Step-3.5 Flash lit bien la **cascade** : search lentes, connexions occupées, pool saturé, mémoire sous pression, effets en chaîne. Il n’a pas la brillance forensic de Hunter ni la rigueur architecte de Sonnet, mais il comprend les interactions entre couches. C’est une qualité très précieuse parce que beaucoup de modèles restent coincés au niveau “liste d’erreurs”.

Sa réponse a donc une vraie valeur d’exploitation : pas forcément celle d’un postmortem final, mais clairement celle d’un bon premier diagnostic pour orienter l’équipe.

---

### 🟣 GPT-OSS-120b — Le quantitatif à formule

GPT-OSS se sent très à l’aise dès qu’il peut transformer le chaos en métrique. Sa formule de health score est un bon exemple de son tempérament : il veut rendre le jugement **reproductible**, presque industrialisable. C’est intellectuellement séduisant.

Le problème, c’est que son score semble un peu optimiste par rapport au contenu réel des logs. Donc oui, il est fort pour structurer et quantifier. Mais parfois, on a l’impression qu’il aime un peu trop sa formule par rapport à la gravité concrète de la situation.

---

### 🔵 Haiku 4.5 — Le statisticien qui pense système

Haiku est encore une fois monstrueux. Ce qui le distingue ici, ce n’est pas seulement la précision, c’est la **précision utile**. Ses timings moyens INFO/WARN/ERROR, sa lecture sur le fait que “les erreurs sont rapides parce que le service refuse vite”, tout ça montre qu’il ne collectionne pas des métriques pour faire joli. Il les interprète.

C’est ce mélange de mesure et de sens qui le rend si fort. Beaucoup de modèles savent compter. Peu savent compter **et comprendre pourquoi ce chiffre est intéressant**. Haiku fait les deux.

---

### 🟢 Gemini Flash — Le tableur propre

Gemini Flash produit un tableau endpoint propre, lisible, défendable. On sent un modèle qui veut faire une fiche de synthèse claire, presque office-friendly. Ce n’est pas un reproche : dans beaucoup d’équipes, ce genre de sortie est exactement ce qu’il faut pour partager vite l’information.

La limite, comme souvent avec Gemini Flash, c’est qu’il ne va pas jusqu’au niveau des meilleurs en causalité ou en profondeur. Bon outil de présentation, pas meilleur outil de compréhension.

---

### 🔵 Gemini Pro — L’exécutif appliqué

Gemini Pro a un vrai style “note de management technique”. Son health score, sa structuration, sa hiérarchie donnent une sortie très lisible pour un public pas forcément ultra-technique. On sent le modèle qui veut résumer proprement sans effrayer inutilement.

Le revers de cette qualité, c’est qu’il perd un peu de mordant forensic. Il est bon pour expliquer, moins pour disséquer. Donc utile, mais pas dominant.

---

### 🟢 Trinity 🆕 — Le diagnosticien rigoureux

Trinity avait déjà montré au v9 qu’il savait produire des analyses très sérieuses, et ça se confirme. Son rapport structuré, ses 5 patterns, sa timeline, les endpoints à 100% d’échec : tout respire le document de diagnostic qu’on pourrait presque copier dans un ticket d’incident. C’est extrêmement solide pour un modèle gratuit.

Ce qui le rend fort, c’est qu’il ne se contente pas de compter. Il **organise**. Il produit quelque chose qui a déjà une forme de rapport professionnel. Il manque peut-être une formalisation plus transparente du calcul de son score global, mais franchement, la copie reste excellente.

---

### 🔴 Nemotron-3 🆕 — Toujours absent

Même sanction que précédemment. Rate limit, zéro matière, zéro usage pratique. Fin de l’histoire.

---

### 🟡 MiniMax-M2.5 🆕 — Le diagnostic solide, mais encore un peu générique

MiniMax-M2.5 a rendu une analyse propre, structurée, et surtout cohérente. Il a identifié les bons gros morceaux : **NPE, OOM, DB pool, circuit breaker**, avec une hiérarchisation raisonnable et des actions correctives concrètes. On n’est pas dans la réponse creuse ; il y a une vraie logique de lecture du système.

Mais il reste un peu dans la zone du “bon SRE pattern matching”. En d’autres termes : il reconnaît correctement les motifs, mais il n’a pas encore le tranchant forensic d’un Hunter ou la précision scorée d’un Haiku. Donc oui, bonne réponse. Non, pas une claque. C’est du solide, pas du magistral.

---

### 🔵 MiniMax-M2.5-highspeed 🆕 — Le benchmark-ready pragmatique

Le highspeed fait ici une vraie bonne perf. Sa reconstruction chronologique, son découpage **P1 / P2 / P3**, et ses propositions d’actions concrètes donnent l’impression d’un document déjà prêt à circuler dans une équipe technique. C’est sans doute ce qui le différencie le plus de sa version standard : il ne se contente pas de comprendre, il **met en scène l’action**.

Sa petite faiblesse, c’est que certaines causes restent formulées avec une confiance plus qualitative que démonstrative. Mais franchement, vu le niveau de vitesse attendu, le résultat est très propre. Ce n’est pas juste une bonne surprise pour un modèle speed. C’est une bonne surprise tout court.

## Verdict analyse — podium commenté (14 modèles)

```
🥇 Hunter Alpha 🆓    → lecture causale irremplaçable
🥈 Sonnet 4.6         → pensée d’architecte, postmortem-ready
🥉 Haiku 4.5          → stats les plus précises et les plus intelligentes
4e k2p5              → lecture risque / continuité de service très forte
5e Trinity 🆓         → rapport de diagnostic gratuit ultra-solide
6e MiniMax-M2.5-highspeed 🆕 → benchmark-ready, bien structuré
7e Step-3.5 Flash 🆓  → systémique et propre
8e MiniMax-M2.5 🆕    → solide mais plus générique
9e Gemini Pro 💰      → exécutif et lisible
10e Gemini Flash 💰   → tableau propre, moins profond
11e Healer Alpha 🆓   → très pédagogique, moins exact métriquement
12e GPT-OSS-120b 🆓   → quantitativement séduisant, score optimiste
13e GPT-5.4           → bonne culture SRE, comptage faux
❌ Nemotron-3 🆓      → DNF
```

---

# 🌐 TÂCHE 3 — Recherche web : FTS5 vs Elasticsearch

## Résultats bruts

| Modèle | Volume | Sources / benchmarks | Seuil bascule | Cas pratique / recommandation |
|--------|--------|----------------------|---------------|-------------------------------|
| Healer Alpha 🆓 | ~7 600c | migration 10-100× | < 500K docs | correct mais général |
| Sonnet 4.6 💰 | ~9 100c | tableau comparatif riche | non chiffré | exhaustif architecte |
| GPT-5.4 💰 | ~10 500c | honnêteté méthodo | non chiffré | peu tranché |
| Hunter Alpha 🆓 | ~8 900c | 840 req/s (7K docs) | < 500K docs | ✅ Pneu-Tracker |
| k2p5 💰 | ~8 400c | 100× plus rapide | **1-5M docs** | ✅ précis |
| Step-3.5 Flash 🆓 | ~8 000c | **1-5ms vs 10-30ms** | ~1M docs | ✅ architecture |
| GPT-OSS-120b 🆓 | ❌ Échec | ❌ | ❌ | ❌ |
| **Haiku 4.5** 💰 | **~31 500c** | **5-12ms vs 20-50ms** | **2M docs** | ✅ complet + migration |
| Gemini Flash 💰 | ~16 500c | **<10ms vs 20-100ms** | **1M docs** | ✅ recommandé |
| Gemini Pro 💰 | ~12 500c | **1-10ms vs 10-50ms** | **100K-1M docs** | ✅ migration plan |
| **Trinity** 🆕 🆓 | **~10 800c** | **<1ms vs 5-10ms** | **100K+ docs** | ✅ FTS5 recommandé |
| Nemotron-3 🆕 🆓 | ❌ | ❌ | ❌ | ❌ |
| **MiniMax-M2.5** 🆕 | structuré | comparatif coût / complexité / perf | non précis | ✅ FTS5 majoritaire |
| **MiniMax-M2.5-highspeed** 🆕 | structuré + seuils | tableau comparatif propre | implicite / semi-chiffré | ✅ FTS5 pour app classique |

## Analyse et commentaires par modèle

### 🟢 Healer Alpha — Le praticien concis

Healer pose rapidement la bonne question : pas “est-ce qu’Elasticsearch est plus puissant ?”, mais “est-ce que j’ai réellement besoin de cette puissance ?”. C’est une manière très saine d’aborder le débat. Il coupe court au bullshit techno et ramène l’arbitrage au besoin réel.

Sa faiblesse, c’est le manque de profondeur chiffrée. On comprend le sens général, mais on repart moins armé pour une vraie décision que chez k2p5, Haiku ou Trinity. Donc utile, mais pas décisif.

---

### 🔵 Sonnet 4.6 — L’encyclopédiste

Sonnet traite le sujet comme un architecte qui veut justifier une décision devant d’autres architectes. Son tableau comparatif est riche, sa connaissance de Lucene et de la mécanique sous-jacente est forte, et sa réponse respire la compréhension profonde des technos.

Le reproche à lui faire est presque paradoxal : à force d’être profond, il peut devenir un peu moins directement actionnable. Très bon pour comprendre, un peu moins tranchant pour décider vite.

---

### 🟡 GPT-5.4 — L’honnête méthodologue

Le meilleur truc que GPT apporte ici, c’est son **honnêteté**. Il dit quand il n’a pas trouvé de benchmark apples-to-apples propre. Et putain, c’est précieux, parce que beaucoup de modèles brodent à cet endroit. Sur le plan intellectuel, c’est une qualité rare.

Le problème, c’est qu’un décideur a aussi besoin qu’on tranche. GPT expose, nuance, contextualise, mais pousse moins fort vers une recommandation. Très propre sur la méthode, moins fort sur la décision.

---

### 🟠 Hunter Alpha — L’applicable terrain

Hunter fait quelque chose que peu de modèles font aussi bien : il **ramène la discussion à notre projet réel**. Il ne parle pas seulement de FTS5 et d’Elasticsearch dans l’absolu ; il les fait entrer dans la réalité de Pneu-Tracker et des volumes qu’on a. C’est énorme comme valeur.

C’est le genre de réponse qui ne brille peut-être pas autant en théorie que Sonnet ou Haiku, mais qui vaut de l’or quand il faut prendre une décision maintenant, avec les contraintes du terrain.

---

### 🟣 k2p5 — Le précis

k2p5 reste l’un des meilleurs parce qu’il donne le **seuil de bascule le plus mémorisable** : **1 à 5 millions de documents**. Ça, c’est un chiffre qui sert. Pas un joli paragraphe, pas une intuition floue : un vrai seuil qu’on peut ressortir dans une discussion d’architecture.

Comme souvent, il réussit à être à la fois synthétique et utile. Il ne fait pas le rapport le plus long, mais souvent l’un des plus actionnables. C’est une de ses grandes forces dans ce benchmark.

---

### 🔵 Step-3.5 Flash — L’architecte pratique

Step-3.5 Flash apporte des chiffres, un plan, une vraie comparabilité. Il ne traite pas le sujet comme une dissertation mais comme un arbitrage d’architecture qu’il faut rendre exploitable. Ses benchmarks de latence et son discours sur la proportion réelle du dataset par rapport aux seuils critiques en font une copie très intelligente pour un modèle gratuit.

Encore une fois, sa force principale est sa **rentabilité intellectuelle** : il donne beaucoup pour zéro coût.

---

### 🟣 GPT-OSS-120b — L’échec révélateur

Ici, le benchmark le casse net. Sur la recherche ouverte, GPT-OSS-120b n’a pas su rester dans la tâche. C’est presque l’image inverse de son comportement sur le code : quand le terrain est ouvert et demande de la synthèse orientée décision, il peut devenir inutilisable.

Et c’est très important à dire, parce que ça évite de mythifier un modèle sur une seule tâche où il est fort.

---

### 🔵 Haiku 4.5 — Le plus complet de tous

Haiku explose encore la concurrence. Son rapport est gigantesque, chiffré, précis, architecturalement mature, avec marges de sécurité, coûts, plan de migration, et projection sur le cas concret. C’est quasiment une note d’architecture senior prête à être relue par un CTO.

Ce qui le rend encore plus fort, c’est qu’il ne s’arrête pas au “FTS5 est suffisant”. Il explique **pourquoi**, **jusqu’où**, **à quel coût**, et **comment migrer** si un jour ça ne suffit plus. C’est la différence entre une bonne réponse et une réponse qui sert vraiment à piloter une stack.

---

### 🟢 Gemini Flash — Le pragmatique

Gemini Flash fait un bon boulot : chiffres, architecture ASCII, recommandation claire, arbitrage compréhensible. Il ne domine pas, mais il reste très lisible et utile. On sent le modèle qui veut donner une réponse de terrain, pas juste réciter Wikipédia.

Sa limite est la profondeur ultime : il reste un cran en dessous des meilleurs dans la densité stratégique.

---

### 🔵 Gemini Pro — L’architecte sage

Gemini Pro a ce côté consultant calme. Plan de migration, chiffrage raisonnable, vue architecturale ordonnée. C’est propre et crédible. Mais ça manque un peu d’impact face à ceux qui amènent soit plus de chiffres, soit plus de netteté de recommandation.

En résumé : sérieux, utile, mais pas un roi de l’exercice.

---

### 🟢 Trinity 🆕 — Le consultant méthodique

Trinity confirme ce qu’on avait déjà commencé à voir : c’est un gratuit qui sait produire un **vrai rapport de consulting technique**. Architecture comparée, benchmarks, seuils de migration, plan en phases — ça sent le document que quelqu’un pourrait vraiment partager à une équipe produit ou infra.

Il lui manque quelques raffinements de plus pour aller chercher Haiku, notamment sur la granularité économique et contextuelle. Mais franchement, pour un gratuit, c’est sale. Très sale.

---

### 🔴 Nemotron-3 🆕 — Toujours rate limit

Toujours la même blague, toujours pas drôle : rien à exploiter. Modèle théorique, valeur pratique nulle dans ce benchmark.

---

### 🟡 MiniMax-M2.5 🆕 — La bonne copie structurée

MiniMax-M2.5 donne une réponse bien rangée, claire, intelligible, avec une reco nette : **FTS5 suffit pour la majorité des apps classiques**. Ce n’est pas un détail, parce que beaucoup de modèles se perdent dans des comparaisons vagues au lieu de répondre franchement à la question. Lui tranche.

Ce qui lui manque pour rejoindre les meilleurs, c’est davantage de profondeur et de seuils vraiment marquants. Tu sens qu’il connaît bien le débat, mais pas encore qu’il l’écrase. Donc bonne réponse, utile, mais pas référence.

---

### 🔵 MiniMax-M2.5-highspeed 🆕 — Le consultant rapide et propre

Le highspeed fait grosso modo la même recommandation, mais avec une forme plus affirmée. Il ose davantage les seuils, structure mieux son tableau comparatif, et donne l’impression d’un modèle qui veut **faire gagner du temps de décision**. Ça colle parfaitement à son branding.

Sa limite reste la profondeur sur certaines contraintes plus sales de FTS5, notamment autour des écritures concurrentes ou des cas d’usage un peu tordus. Mais pour une majorité d’usages applicatifs, sa réponse reste très bonne. Et surtout : très utilisable.

## Verdict recherche — podium commenté (14 modèles)

```
🥇 Haiku 4.5          → le plus complet, le plus chiffré, le plus décisionnel
🥈 k2p5               → seuil 1-5M docs, très actionnable
🥉 Hunter Alpha 🆓    → meilleure contextualisation projet
4e Step-3.5 Flash 🆓  → gratuit très fort en arbitrage pratique
5e Sonnet 4.6         → profondeur architecte maximale
6e Trinity 🆓         → consulting gratuit ultra-solide
7e Gemini Flash 💰    → pragmatique, clair, utile
8e MiniMax-M2.5-highspeed 🆕 → propre, rapide, bien cadré
9e MiniMax-M2.5 🆕    → bonne copie, un peu plus générique
10e Gemini Pro 💰     → sage mais moins impactant
11e GPT-5.4           → méthodologie propre, décision moins forte
12e Healer Alpha 🆓   → utile mais léger
❌ GPT-OSS-120b 🆓    → échec
❌ Nemotron-3 🆓      → DNF
```

---

# 🏆 VERDICT FINAL — 14 modèles

## Tableau de synthèse complet

| Critère | Healer | Sonnet | GPT | Hunter | k2p5 | Step35 | GPT-OSS | Haiku | GemFlash | GemPro | Trinity | Nemotron | M2.5 | M2.5-highspeed |
|---------|--------|--------|-----|--------|------|--------|---------|-------|----------|--------|---------|----------|------|----------------|
| Code — Architecture | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Code — Tests | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Code — Features | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Rigueur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Insight | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Analyse — Action | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recherche — Profondeur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recherche — Applicabilité | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Adaptation contexte | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Consistance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **TOTAL /50** | **33** | **47** | **30** | **44** | **45** | **41** | **31** | **50** | **41** | **40** | **45** | **0** | **41** | **44** |

## Classement final (14 modèles)

```
🥇 Haiku 4.5 (50/50)
   Le rouleau compresseur complet. Le seul modèle qui peut légitimement prétendre au sans-faute.

🥈 Sonnet 4.6 (47/50)
   Excellence technique pure. Toujours la référence quand la qualité d’architecture prime.

🥉 k2p5 (45/50)
   L’équilibre premium. Pas le plus flamboyant, mais l’un des plus constamment utiles.

🥉 Trinity 🆕 🆓 (45/50) ← EX-ÆQUO
   La meilleure surprise gratuite moderne. Très sérieux sur les 3 tâches.

5e Hunter Alpha 🆓 (44/50)
   Le meilleur détective du benchmark. Causalité et pragmatisme terrain.

5e MiniMax-M2.5-highspeed 🆕 (44/50) ← EX-ÆQUO
   La vraie surprise MiniMax. Homogène, rapide, et beaucoup plus solide que prévu.

7e Step-3.5 Flash 🆓 (41/50)
   Toujours l’un des meilleurs rapports qualité/prix du benchmark.

7e Gemini Flash 💰 (41/50) ← EX-ÆQUO
   Bon partout, roi nulle part, mais jamais ridicule.

7e MiniMax-M2.5 🆕 (41/50) ← EX-ÆQUO
   Bon modèle global, plus classique et moins ambitieux que highspeed, mais fiable.

10e Gemini Pro 💰 (40/50)
   Sérieux, appliqué, un peu trop sage.

11e Healer Alpha 🆓 (33/50)
   Tests solides, architecture fragile, très bonne valeur de prototypage.

12e GPT-OSS-120b 🆓 (31/50)
   Titan local sur le code, mais trop instable hors terrain borné.

13e GPT-5.4 (30/50)
   Le payant qui souffre le plus de la comparaison globale.

❌ Nemotron-3 🆓 (0/50 — DNF)
   Rate limit systématique. Théorie sans pratique.
```

---

## 💡 Méta-enseignements du benchmark v10

1. **MiniMax-M2.5-highspeed est la vraie surprise de cette itération.** Son nom laissait craindre un modèle rapide mais superficiel ; on obtient au contraire un modèle **homogène**, crédible en code, très propre en logs, utile en recherche, et capable de rivaliser avec les bons gratuits comme les bons payants intermédiaires.

2. **MiniMax-M2.5 standard est plus sage, plus classique, plus modeste.** Il ne donne pas l’impression de vouloir écraser la concurrence, mais il reste bon partout. C’est le modèle qui rassure sans faire rêver.

3. **Le haut du tableau se resserre, mais Haiku reste le patron.** Sonnet reste la référence d’architecture, k2p5 la référence d’équilibre, Trinity la référence gratuite moderne, mais Haiku continue de donner l’impression d’être un cran au-dessus quand on regarde les trois tâches ensemble.

4. **Le gratuit continue de casser les vieux réflexes.** Hunter Alpha, Trinity et Step-3.5 Flash rendent de plus en plus difficile le réflexe “payant = forcément meilleur”. Le coût ne prédit toujours pas la qualité. Et bordel, c’est une bonne nouvelle.

5. **Les tâches ouvertes restent le vrai juge de paix.** GPT-OSS-120b est un excellent rappel qu’un modèle peut être spectaculaire dans un environnement borné et se casser la gueule dès qu’on lui demande de rester cohérent sur de la recherche ou de la synthèse ouverte.

---

## 📋 Recommandations d’usage (mise à jour v10)

| Situation | Modèle recommandé | Pourquoi |
|-----------|-------------------|----------|
| Code prod critique | **Haiku 4.5** | Couverture, verify(), profondeur technique totale |
| Excellence architecture | **Sonnet 4.6** | RB Tree et pensée d’ingénieur senior |
| Équilibre premium | **k2p5** | Très bon partout, très relisible, très utile |
| Gratuit complet moderne | **Trinity** 🆕 🆓 | 45/50, propre sur les 3 tâches |
| Analyse causale | **Hunter Alpha** 🆓 | Cause racine > symptôme, très fort en incident |
| Surprise polyvalente | **MiniMax-M2.5-highspeed** 🆕 | 44/50, rapide sans être bâclé |
| Bon payant sage | **MiniMax-M2.5** 🆕 | 41/50, fiable, lisible, classique |
| Budget zéro polyvalent | **Step-3.5 Flash** 🆓 | Rapport qualité/prix excellent |
| Recherche / décision d’archi | **Haiku 4.5** ou **k2p5** | profondeur maximale vs seuils hyper-actionnables |
| Prototypage orienté tests | **Healer Alpha** 🆓 | couverture généreuse, code simple |
| **Éviter** | **Nemotron-3** 🆓 | rate limit, DNF |
| **Éviter** | **GPT-5.4** | trop en retrait sur le benchmark global |

---

*v10 — Benchmark à 14 modèles — version refaite avec niveau de détail v5 + base comparative v9 — 2026-03-19 22:20 UTC*