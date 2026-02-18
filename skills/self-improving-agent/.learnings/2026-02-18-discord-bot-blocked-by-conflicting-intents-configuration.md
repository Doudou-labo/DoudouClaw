---
date: 2026-02-18
category: bug
severity: high
status: applied
impact: Discord bot fully operational - messages received and processed
related: []
evolution_event_id: null
---

# Discord bot blocked by conflicting intents configuration

## Context

Discord bot was connected (status OK, ping working) but completely unable to receive messages from Alexandre. Symptoms:
- No Discord sessions created in OpenClaw
- Commands returned "You are not authorized to use this command"
- Logs showed: `Discord Message Content Intent is limited`
- Messages sent to #admin-logs were invisible to the bot

Initially suspected role-based access control (wrong role IDs in config), but that was a red herring.

## Lesson

**Discord bot intents must be aligned between Developer Portal AND OpenClaw config.**

When OpenClaw requests privileged intents (Guild Members, Presence) that aren't authorized on the Developer Portal, Discord creates a silent conflict that blocks ALL message processing—not just the privileged features.

The fix isn't to enable more intents, but to **disable the ones you don't need** in OpenClaw config to match what's actually authorized.

## Applied Fix

1. **Discord Developer Portal:**
   - Enabled `Message Content Intent` (required to read message text)

2. **OpenClaw web UI (openclaw.doudougen.xyz):**
   - Channels → Discord → Intents
   - Disabled `Discord Guild Members Intent` ✅
   - Disabled `Discord Presence Intent` ✅

3. **Config cleanup:**
   - Removed obsolete `roles` restriction from guild config
   - Verified `groupPolicy: "open"` (no channel filters)

4. **Restart:**
   ```bash
   openclaw gateway restart
   ```

Result: Messages immediately started flowing, bot fully operational.

## Impact Measured

**Before:** 0 Discord messages received, 100% failure rate  
**After:** All messages received, commands working, reactions functional

**Time to fix:** ~40 minutes (30 min debugging, 10 min solution)  
**User impact:** High (Discord channel completely broken → fully working)

## Notes

**Key diagnostic indicators:**
- `openclaw status --deep` showing Discord OK but no sessions
- Logs containing "Discord Message Content Intent is limited"
- Cross-context messaging errors are expected (can't send to Discord from Telegram session)

**Preventive measures:**
- Documented in TOOLS.md with exact config working
- Added to troubleshooting playbook for future Discord issues
- If Discord breaks again, check intents FIRST before diving into permissions/roles

**Discord intent hierarchy:**
- **Basic (always available):** Read messages in allowed channels
- **Message Content (needs approval <100 guilds):** Read message text/attachments
- **Privileged (needs verification >100 guilds):** Guild Members, Presence, Message Content

Our bot: <100 guilds → Message Content OK, but Privileged intents need explicit authorization (or disable in config).
