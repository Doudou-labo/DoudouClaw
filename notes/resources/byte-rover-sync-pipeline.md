# ByteRover → GitHub Sync Pipeline

Pipeline de synchronisation automatique du context-tree ByteRover vers le repo GitHub.

## 🚀 Quick Start

```bash
# Sync manuel (dry-run d'abord)
./scripts/sync-brv-to-github.sh --dry-run

# Sync réelle
./scripts/sync-brv-to-github.sh
```

## 📁 Structure

```
~/.brv/context-tree/          # Source (ByteRover local)
    ├── _index.md
    ├── _manifest.json
    ├── memory/
    └── projects/

.br/context-tree/              # Destination (repo Git)
    └── (mirror de la source)
```

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `sync-brv-to-github.sh` | Script principal de sync avec backup auto |
| `cron-wrapper-brv-sync.sh` | Wrapper pour cron avec logging |

## ⚙️ Configuration

### Sync manuelle
```bash
./scripts/sync-brv-to-github.sh
```

### Sync automatique (cron)

**Option 1 : Crontab utilisateur**
```bash
# Éditer crontab
crontab -e

# Ajouter (toutes les 6h)
0 */6 * * * /root/.openclaw/workspace/scripts/cron-wrapper-brv-sync.sh
```

**Option 2 : Systemd timer** (recommandé pour production)
Voir `config/cron-brv-sync.json` pour la configuration.

### Logs
```bash
# Voir les logs de sync
tail -f /var/log/brv-sync.log
```

## 🛡️ Safety Features

1. **Backup automatique** : Avant chaque sync, le context-tree existant est sauvegardé dans `backups/brv-context-tree-YYYY-MM-DD/`
2. **Dry-run** : Testez avec `--dry-run` avant de sync réel
3. **Exclusions** : Les fichiers temporaires (.snapshot.json, *.tmp, *.bak) sont ignorés
4. **Pas de `rm -rf`** : Jamais de suppression brutale sans confirmation

## 🔐 Auth

Le script utilise la config Git existante :
- **User** : DoudouClaw
- **Token** : `.credentials/github-token.txt`
- **Remote** : HTTPS vers `Doudou-labo/DoudouClaw`

## 📝 Gitignore

Les exclusions sont dans `.gitignore` :
```gitignore
# ByteRover context-tree exclusions
.brv/**/.snapshot.json
.brv/**/*.tmp
.brv/**/*.bak
```

## 🔄 Dernière sync

- **Date** : 2026-03-13 19:28:25
- **Commit** : `b182f28`
- **Fichiers** : 90 fichiers synchronisés
- **URL** : https://github.com/Doudou-labo/DoudouClaw/tree/main/.brv/context-tree
