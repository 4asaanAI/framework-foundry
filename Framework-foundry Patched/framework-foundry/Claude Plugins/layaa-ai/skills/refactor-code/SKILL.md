---
name: refactor-code
description: >
  Refactor existing code to improve structure, readability, or performance without changing behavior.
  In Layaa AI mode, consolidates duplicated patterns, extracts reusable hooks, and aligns with
  Layaa OS conventions.
trigger_keywords: [refactor, clean up, improve code, restructure, simplify]
agents: [ujjawal, dev]
category: engineering
---

## Instructions

1. **Identify the goal** — What specific improvement is being made? (reduce duplication, improve readability, extract abstraction, fix performance)
2. **Preserve behavior** — The refactored code must produce identical results. No feature changes.
3. **Minimal surface area** — Change only what's necessary. Don't refactor adjacent code "while you're at it."
4. **Verify** — Explain what tests or checks confirm the refactoring didn't break anything.

Common refactoring patterns:
- Extract repeated Supabase queries into custom hooks
- Consolidate duplicated component logic into shared utilities
- Replace verbose conditional logic with cleaner patterns
- Split oversized components into focused sub-components
