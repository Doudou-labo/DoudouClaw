# ByteRover Bug Report - Ready to Submit

## Discord Server
**URL**: https://discord.com/invite/UMRrpNjh5W

## Message à copier-coller

```
🐛 **Bug Report: brv curate truncates files at ~900 bytes**

**Environment:**
- ByteRover CLI v2.1.4
- Ubuntu 25.10 / Node.js v22.22.0
- Installed via npm

**Issue:**
The `brv curate` command truncates all curated files to approximately 900 bytes, cutting content mid-word.

**Examples:**
- Source: 5KB markdown file → Curated: 722 bytes (truncated mid-sentence)
- Daily memory files: all capped at ~900-920 bytes

**Impact:**
Context-tree becomes essentially empty - only YAML frontmatter remains usable. Makes the curation feature unusable for real memory management.

**Steps to reproduce:**
1. `npm install -g byterover-cli`
2. `brv curate "large-file.md"` (any file >1KB)
3. Check `~/.brv/context-tree/` - file is truncated

**Expected:** Complete summarized content
**Actual:** Hard cut at ~900 bytes

**Full report**: https://github.com/Doudou-labo/DoudouClaw/blob/main/notes/bug-report-byterover-truncation.md

cc @byterover-team
```

## Alternative: GitHub Issue
Si le Discord ne fonctionne pas, essayer de créer une issue sur:
- https://github.com/campfirein/cipher (ils mentionnent "Built by https://byterover.dev/")

## Fichier complet
Le rapport complet est sur:
`https://github.com/Doudou-labo/DoudouClaw/blob/main/notes/bug-report-byterover-truncation.md`
