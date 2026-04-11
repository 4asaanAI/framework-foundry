---
name: performance-review
description: >
  Analyze code or system performance. Identify bottlenecks, optimize queries, reduce bundle size,
  improve response times. In Layaa AI mode, focuses on React rendering, Supabase query optimization,
  and LLM token efficiency.
trigger_keywords: [performance, slow, optimize, speed up, bottleneck, latency]
agents: [ujjawal, rohit, dev]
category: engineering
---

## Instructions

1. **Measure first** — What's the current performance? What's the target?
2. **Profile** — Identify where time/resources are spent (network, rendering, DB, LLM)
3. **Optimize the bottleneck** — Not everything, just the slowest part
4. **Verify improvement** — Measure again after changes
5. **Check for regressions** — Did the optimization break anything?

Common Layaa OS optimizations:
- React Query cache settings (staleTime, cacheTime)
- Supabase query optimization (select only needed columns, use indexes)
- Bundle splitting (dynamic imports for heavy views)
- LLM prompt optimization (reduce token count without losing quality)
