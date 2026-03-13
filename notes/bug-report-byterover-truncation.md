# Bug Report: ByteRover CLI - File Truncation Issue

## Summary
The `brv curate` command truncates files at approximately 900 bytes, cutting content mid-word. This makes the context-tree unusable for real memory content.

## Environment
- **ByteRover CLI Version**: 2.1.4
- **OS**: Ubuntu 25.10 (x86_64)
- **Node.js**: v22.22.0
- **Installation Method**: `npm install -g byterover-cli`

## Steps to Reproduce
1. Install ByteRover CLI: `npm install -g byterover-cli`
2. Run migration: `brv curate "memory/2026-03-13.md"` (or any file >1KB)
3. Check the generated file in `~/.brv/context-tree/memory/history/`

## Expected Behavior
The curated file should contain the complete, summarized content of the source file.

## Actual Behavior
All files are truncated to ~900 bytes (300-918 bytes observed), cutting off mid-word.

### Examples

**Source file**: `memory/2026-03-13.md` (several KB)
**Generated file**: `~/.brv/context-tree/memory/history/2026_03_13.md`
**Size**: 722 bytes (truncated)

**Daily memory files**: All truncated to ~900-920 bytes
```
918 bytes - daily_memory_2026_02_21.md
917 bytes - daily_memory_2026_02_22.md
921 bytes - daily_memory_2026_02_23.md
916 bytes - daily_memory_2026_02_24.md
```

**Content ends mid-word**, example:
```markdown
## Narrative
### Structure
Memory log from 2026-02-22.md

### Highlights
- **Migration**: ByteRover skill installed via npm
- **Config**: `softThresholdTokens` modified 4000 → 170000
- **Features**: Daily Knowledge Mining + Context Plugin acti  [CUT OFF HERE]
```

## Impact
- Context tree is essentially **empty skeletons** with only YAML frontmatter
- Cannot retrieve meaningful content via `brv query`
- Makes the curation feature **unusable** for real-world memory management

## Configuration
`~/.brv/config.json` (no size limit parameter found):
```json
{
  "createdAt": "2026-03-13T20:34:46.371Z",
  "cwd": "/root",
  "spaceId": "019ce8d4-7861-71dd-b86b-7ab2ced3fca0",
  "spaceName": "friendly-lederberg",
  "teamId": "019ce8d4-758b-7e77-9b92-1b36cb3b9131",
  "teamName": "adoring-ptolemy",
  "version": "0.0.1"
}
```

## Additional Context
- Tried with various file sizes (500 bytes to 50KB)
- All files capped at ~900 bytes regardless of source size
- No error message displayed during curation
- Migration process appeared successful

## Suggested Fix
Either:
1. Document the size limit clearly if it's intentional
2. Provide a `--max-size` flag to configure the limit
3. Remove/fix the truncation logic if it's a bug

## Reporter
- GitHub: @Doudou-labo
- Contact: via GitHub issues

---
**Severity**: High (blocks core functionality)
**Labels**: bug, curation, data-loss
