---
name: Platform Capabilities Spec
description: Agent tools, approval gate tiers, budget system, memory relevance, /commands, @mentions, conversation features
type: feature
---
Source doc: layaa-os-agent-platform-capabilities.md

Key systems implemented:
- Built-in /commands: /clear, /new, /export, /budget, /status, /help
- Message rating (thumbs up/down), pinning, conversation starring
- Budget enforcement: check before send, exhaustion banner
- Context window usage indicator in chat header
- Draft auto-save to localStorage every 2s
- Input history with up/down arrow keys (50 entries)
- Conversation export as markdown
- @mention split-screen view (max 3 mentions per message)
- Approval gate: Tier 1 (auto) vs Tier 2 (requires human approval)
- Project KB chunking on upload (~8000 char chunks with 200 overlap, top 10 keywords)

DB tables added: message_archives, message_annotations, drafts
Columns added: agents.budget_period_start, tasks.is_trusted_recurring

Still pending from spec:
- LLM proxy integration (n8n webhooks)
- Sage memory extraction (5-min inactivity trigger)
- Kaiser cron jobs (health check, briefing, budget reset, backup, reminders)
- Conversation branching, message regeneration
- PWA/offline support
- GDPR export/delete
- Credential redaction before LLM calls
