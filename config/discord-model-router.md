# Discord Model Router Configuration

> Mapping canal Discord → modèle par défaut pour optimiser les coûts

## 🎯 Principes

- **Discussions légères** (blabla, config) → modèles économes (K2P5, Codex-mini)
- **Code/technique** → K2P5 (bon compromis perf/coût)
- **Tâches complexes** → Sonnet-4-6 ou Codex (uniquement si nécessaire)
- **Fallback** : Si rate limit sur le modèle cible, rester sur le modèle actuel fonctionnel

## 📋 Table de routage complète

| Canal | ID Discord | Modèle par défaut | Usage |
|-------|------------|-------------------|-------|
| 👋-ɢᴇɴᴇʀᴀʟ | 1472335330223980609 | `openai-codex/gpt-5.1-codex-mini` | Bavardage général |
| 📣-ʀᴀᴘᴘᴇʟꜱ-ᴇᴛ-ʀᴏᴜᴛɪɴᴇꜱ | 1472597511838367920 | `kimi-coding/k2p5` | Rappels, routines |
| 📝-ᴘᴀʀᴀ | 1472597512933085299 | `kimi-coding/k2p5` | Organisation PARA |
| 📋-ʟᴏɢꜱ-ᴀᴅᴍɪɴ | 1472597513898033162 | `kimi-coding/k2p5` | Webhooks GitHub |
| 💸-ʙᴏᴜʀꜱᴇ | 1472597514824843419 | `kimi-coding/k2p5` | Bourse, cours actions |
| 🎙️-ᴄᴏɴᴛᴇxᴛᴇ | 1472597958858899596 | `kimi-coding/k2p5` | Discussions contexte |
| 🔎-ᴄʀᴍ | 1472597960222183625 | `kimi-coding/k2p5` | Gestion contacts CRM |
| 🧠-ɪᴇ | 1472597961778135211 | `kimi-coding/k2p5` | Intelligence émotionnelle |
| 🪪-ᴘᴇʀꜱᴏ | 1472597962994483363 | `kimi-coding/k2p5` | Dossier personnel |
| 💼-ᴛʀᴀᴠᴀɪʟ | 1472597964076748852 | `kimi-coding/k2p5` | Travail, pro |
| 📢-ᴀɴɴᴏɴᴄᴇꜱ | 1472599386579275848 | `kimi-coding/k2p5` | Annonces |
| 🗺️-ᴛᴏᴅᴏ-ꜱᴇʀᴠᴇᴜʀ | 1472599388328169544 | `kimi-coding/k2p5` | TODO serveur |
| 💡-ʙᴜɢꜱ-ɪᴅᴇᴀꜱ | 1472599389384998946 | `kimi-coding/k2p5` | Bugs, idées |
| 🧪-ᴛᴇꜱᴛ-ᴄᴏᴍᴍᴀɴᴅᴇꜱ | 1472599466329641084 | `kimi-coding/k2p5` | Tests commandes |
| 🧪-ᴛᴇꜱᴛ-ʙᴏᴛ | 1472599467487134063 | `kimi-coding/k2p5` | Tests bot |
| 📘-ɢᴜɪᴅᴇ-ᴅᴜ-ꜱᴇʀᴠᴇᴜʀ | 1472605358492225578 | `kimi-coding/k2p5` | Documentation |
| 🧑‍💻-ɢɪᴛʜᴜʙ | 1473417623990698206 | `kimi-coding/k2p5` | Code, discussions GitHub |
| 📋-ʟᴏɢꜱ-ꜱᴇʀᴠᴇᴜʀ | 1473419374042939432 | `kimi-coding/k2p5` | Logs serveur |
| 💰-ꜰɪɴᴀɴᴄᴇ | 1473727983607873711 | `kimi-coding/k2p5` | Finance, suivi |
| 🗂️-ɴᴏᴛɪᴏɴ | 1474131846513168425 | `kimi-coding/k2p5` | Notion, notes |
| 🧠-ᴍᴇᴍᴏɪʀᴇ | 1474162917694898181 | `kimi-coding/k2p5` | Mémoire, souvenirs |
| 🤖-sub-agent | 1474468461274071181 | `anthropic/claude-sonnet-4-6` | **Agents techniques** |
| 📘-ᴜᴛɪʟɪꜱᴀᴛɪᴏɴ-ᴀɢᴇɴᴛ | 1474477284705702001 | `kimi-coding/k2p5` | Doc utilisation |
| 🧪-ᴄᴀꜱ-ᴘʀᴀᴛɪqᴜᴇꜱ | 1474478861952618576 | `kimi-coding/k2p5` | Cas d'usage |
| 📋-ʟᴏɢꜱ-ɢɪᴛʜᴜʙ | 1474762493099511888 | `kimi-coding/k2p5` | Logs GitHub |
| #model-router | 1478129852585345164 | `kimi-coding/k2p5` | **Config model router** |

## 🎨 Règles de routing

### Niveau 1 : Économe (Codex-mini)
- **Canaux** : #general uniquement
- **Usage** : Bavardage, discussions légères
- **Pourquoi** : Le moins cher possible pour le chat sans enjeu

### Niveau 2 : Standard (K2P5)
- **Canaux** : Tous sauf #general, #sub-agent
- **Usage** : Travail quotidien, organisation, code léger
- **Pourquoi** : Bon compromis perf/coût, supporte le code et le texte

### Niveau 3 : Puissant (Sonnet-4-6)
- **Canaux** : #sub-agent uniquement
- **Usage** : Développement d'agents, tâches complexes, architecture
- **Pourquoi** : Besoin de capacités avancées pour les agents techniques

### Niveau 4 : Exceptionnel (Codex)
- **Canaux** : Aucun par défaut (à demander explicitement)
- **Usage** : Tâches très lourdes, deep research, architecture critique
- **Pourquoi** : Coûteux, réservé aux vrais besoins

## 🛠️ Implémentation

### Option A : Convention manuelle (immédiat)
Documenter la table ci-dessus et appliquer `session_status(model="...")` au début de chaque session selon le canal.

**Exemple :**
```
# Dans #general
session_status(model="codex-mini")

# Dans #sub-agent  
session_status(model="sonnet")

# Partout ailleurs (déjà actif)
# Reste sur k2p5
```

### Option B : Script de routage automatique (à développer)
Créer un script qui lit le canal depuis les métadonnées et injecte le bon modèle.

```bash
scripts/discord-model-router.sh 1478129852585345164
# Output: Channel #model-router → Model: kimi-coding/k2p5
```

### Option C : Hook OpenClaw (si supporté)
Utiliser les hooks d'OpenClaw pour injecter le modèle automatiquement selon le canal source.

## 💰 Impact estimé

| Scénario | Coût approximatif |
|----------|-------------------|
| Avant (tout en gpt-5.3-codex) | ~$0.50-1.00 / jour |
| Après (routing optimisé) | ~$0.10-0.30 / jour |
| Économie estimée | **60-80%** |

## 🚨 Rate Limits Connus

| Provider | Limite | Statut |
|----------|--------|--------|
| Anthropic | Variable | ⚠️ Fréquemment en rate limit |
| OpenAI Codex | Élevée | ✅ Stable |
| Kimi (Moonshot) | Élevée | ✅ Stable |

> **Règle** : En cas de rate limit sur le modèle cible, rester sur le modèle actuel plutôt que forcer un autre modèle cher.

## 📝 Actions immédiates

- [x] Backup openclaw.json avant modifs
- [x] Créer la table de routing complète
- [ ] Tester le routing manuel sur 24-48h
- [ ] Créer le script automatique si tests concluants
- [ ] Documenter les exceptions et ajustements

## 🔧 Commandes utiles

```bash
# Vérifier le modèle actuel
session_status

# Changer manuellement de modèle
session_status(model="haiku")
session_status(model="k2p5")
session_status(model="sonnet")
session_status(model="codex-mini")

# Voir les modèles disponibles
openclaw models list
```
