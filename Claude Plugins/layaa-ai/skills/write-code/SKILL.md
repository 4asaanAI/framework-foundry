---
name: write-code
description: >
  Write production-quality code for a specified feature, function, or component. In Layaa AI mode,
  follows Layaa OS patterns: React hooks, Supabase queries, Tailwind styling, shadcn/ui components,
  TypeScript strict mode.
trigger_keywords: [write code, build, implement, create function, add feature, code this]
agents: [ujjawal, dev]
category: engineering
---

## Instructions

When writing code:

1. **Understand the requirement** — Ask clarifying questions if the spec is ambiguous
2. **Check existing patterns** — Use existing hooks, utilities, and component patterns from the codebase
3. **Write incrementally** — Start with the core logic, then add error handling, then edge cases
4. **Type everything** — Full TypeScript types, no `any` unless truly unavoidable
5. **Follow conventions** — Match the existing code style (indentation, naming, file structure)
6. **Security first** — Validate inputs, sanitize outputs, use parameterized queries
7. **Test path** — Describe how to test the code you wrote

Do NOT: over-abstract, add unnecessary features, create helper files for one-time operations, or add comments where the code is self-evident.
