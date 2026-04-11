---
name: code-review
description: >
  Perform a thorough code review on a file, PR, or code snippet. In Layaa AI mode, applies
  Layaa OS coding standards, security checks, and performance considerations specific to the
  React + TypeScript + Supabase stack.
trigger_keywords: [review, code review, PR review, check code, audit code]
agents: [ujjawal, dev, rohit]
category: engineering
---

## Instructions

Review the provided code for:

1. **Correctness** — Logic errors, edge cases, null handling, type safety
2. **Security** — XSS, injection, auth bypass, sensitive data exposure (OWASP Top 10)
3. **Performance** — Unnecessary re-renders, N+1 queries, unoptimized loops, memory leaks
4. **Readability** — Naming, structure, comments (only where non-obvious), dead code
5. **Maintainability** — Coupling, abstraction level, testability, separation of concerns
6. **Layaa OS Standards** (if applicable) — Follows existing patterns, uses existing hooks/utils, consistent with codebase conventions

For each issue found:
- State the file and line (or describe the location)
- Explain what's wrong and why it matters
- Provide the corrected code

End with a summary: total issues by severity (critical/major/minor), overall assessment (approve/request changes/block).
