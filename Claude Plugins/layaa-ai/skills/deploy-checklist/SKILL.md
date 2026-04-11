---
name: deploy-checklist
description: >
  Generate a deployment checklist for a release. Covers code, database, edge functions,
  environment variables, and rollback plan. In Layaa AI mode, follows Layaa OS deployment
  patterns (Supabase migrations, edge function deployment, Vite build).
trigger_keywords: [deploy, release, ship, go live, launch, deployment]
agents: [ujjawal, kaiser, dev]
category: engineering
---

## Instructions

Generate a checklist covering:
1. **Pre-deploy** — All tests pass, build succeeds, no TypeScript errors, environment variables set
2. **Database** — Migrations reviewed, RLS policies verified, no destructive changes without backup
3. **Edge functions** — All functions tested, environment secrets configured
4. **Frontend** — Build output verified, bundle size checked, no console errors
5. **Post-deploy** — Smoke test critical paths (auth, chat, agents, projects), monitor error logs
6. **Rollback plan** — How to revert if something breaks (previous build, migration rollback)
