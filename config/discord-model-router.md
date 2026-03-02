# Discord Model Router Configuration

> Mapping canal Discord → modèle par défaut pour optimiser les coûts

## 🎯 Principes

- **Discussions légères** (blabla, config) → modèles économes (K2P5, Codex-mini)
- **Code/technique** → K2P5 (bon compromis perf/coût)
- **Tâches complexes** → Sonnet-4-6 ou Codex (uniquement si nécessaire)
- **Fallback** : Si rate limit sur le modèle cible, rester sur le modèle actuel fonctionnel

## 📋 Table de routage

| Canal | ID Discord | Modèle par défaut | Fallback | Usage |
|-------|------------|-------------------|----------|-------|
| #model-router | 1478129852585345164 | `kimi-coding/k2p5` | `openai-codex/gpt-5.1-codex-mini` | Config, discussions meta |
| #blabla | À compléter | `openai-codex/gpt-5.1-codex-mini` | `kimi-coding/k2p5` | Bavardage général |
| #general | À compléter | `openai-codex/gpt-5.1-codex-mini` | `kimi-coding/k2p5` | Discussions variées |
| #coding | À compléter | `kimi-coding/k2p5` | `anthropic/claude-sonnet-4-6` | Code, debug |
| #dev | À compléter | `kimi-coding/k2p5` | `anthropic/claude-sonnet-4-6` | Développement |
| #agents | À compléter | `kimi-coding/k2p5` | `anthropic/claude-sonnet-4-6` | Workflows, automation |
| #automation | À compléter | `kimi-coding/k2p5` | `anthropic/claude-sonnet-4-6` | Scripts, crons |
| #complex-tasks | À compléter | `anthropic/claude-sonnet-4-6` | `openai-codex/gpt-5.3-codex` | Tâches lourdes |
| #deep-research | À compléter | `openai-codex/gpt-5.3-codex` | `anthropic/claude-sonnet-4-6` | Analyses profondes |
| #admin-logs | 1472597513898033162 | `kimi-coding/k2p5` | - | Webhooks GitHub |

## 🛠️ Implémentation

### Option A : Convention manuelle (immédiat)
- Documenter la table ci-dessus
- Appliquer `session_status(model="...")` au début de chaque session selon le canal
- Vérifier `/status` pour confirmer le modèle actif

### Option B : Script de routage automatique (à développer)
Créer un script qui :
1. Lit le `channel_id` depuis les métadonnées inbound
2. Cherche le mapping dans cette config
3. Exécute `session_status(model="...")` automatiquement
4. Log le changement de modèle

```bash
# Exemple d'usage
scripts/discord-model-router.sh "1478129852585345164"
# Output: Switching to model: kimi-coding/k2p5
```

### Option C : Hook OpenClaw (si supporté)
Utiliser la section `hooks` d'OpenClaw pour injecter le modèle selon le canal source.

## 💰 Impact estimé

| Scénario | Coût approximatif |
|----------|-------------------|
| Avant (tout en gpt-5.3-codex) | ~$0.50-1.00 / jour |
| Après (routing optimisé) | ~$0.10-0.30 / jour |
| Économie estimée | **60-80%** |

## 📝 TODO

- [ ] Compléter les IDs Discord des canaux
- [ ] Valider les modèles par canal avec Alexandre
- [ ] Tester le routing manuel sur 24-48h
- [ ] Créer le script automatique si tests concluants
- [ ] Documenter les rate limits et fallback

## 🚨 Rate Limits Connus

| Provider | Limite | Statut |
|----------|--------|--------|
| Anthropic | Variable | ⚠️ Fréquemment en rate limit |
| OpenAI Codex | Élevée | ✅ Stable |
| Kimi (Moonshot) | Élevée | ✅ Stable |

> **Règle** : En cas de rate limit sur le modèle cible, rester sur le modèle actuel plutôt que forcer un autre modèle cher.
