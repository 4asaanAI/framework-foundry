---
name: debug-issue
description: >
  Systematically debug a reported issue or error. Follows a structured diagnosis approach:
  reproduce → isolate → root cause → fix → verify. In Layaa AI mode, understands the Layaa OS
  architecture (Supabase, edge functions, React Query, realtime subscriptions).
trigger_keywords: [debug, fix bug, error, broken, not working, crash, issue]
agents: [ujjawal, rohit, dev]
category: engineering
---

## Instructions

Follow this structured debugging process:

1. **Reproduce** — Understand the exact steps, inputs, and conditions that trigger the issue
2. **Isolate** — Determine which layer is responsible (frontend component, hook, edge function, DB query, LLM call)
3. **Root Cause** — Read the relevant code, trace the data flow, identify the exact failure point
4. **Fix** — Write the minimal correct fix. Don't refactor surrounding code unless it's the cause.
5. **Verify** — Explain how to confirm the fix works. Check for regressions.

Always check: Is this a data issue, a logic issue, a timing issue, or a configuration issue?
