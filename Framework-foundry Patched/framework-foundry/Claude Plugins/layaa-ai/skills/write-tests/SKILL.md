---
name: write-tests
description: >
  Write unit tests, integration tests, or E2E tests for code. In Layaa AI mode, uses Vitest for
  unit tests, Testing Library for components, and Playwright for E2E — matching the Layaa OS test setup.
trigger_keywords: [test, write test, unit test, integration test, e2e, test plan]
agents: [rohit, ujjawal]
category: engineering
---

## Instructions

1. Identify what needs testing (function, component, API endpoint, workflow)
2. Write tests that cover: happy path, edge cases, error cases, boundary conditions
3. Use descriptive test names that explain the expected behavior
4. Mock external dependencies (Supabase, LLM calls) — never hit real APIs in tests
5. For components: test user interactions, not implementation details
6. Keep tests focused — one assertion concept per test
