# Technology Stack Reference

**Document Owner:** Shubham Sharma, CTO
**Last Updated:** April 2026
**Classification:** Internal Reference

---

## Overview

Layaa AI maintains a focused technology stack optimised for AI automation delivery to Indian SMEs. The guiding principles for technology selection are: self-hosted where possible, cost-effective (total infrastructure under INR 500/month), minimal operational complexity for a lean team, and no vendor lock-in on critical components.

**Build approach:** Vibe coding with Lovable 2.0 + Claude Code, achieving significant AI-assisted development compression:
- Architecture design: 60-70% of traditional time estimates
- Core business logic: 30-40% of traditional time estimates
- UI/Frontend: 40-50% of traditional time estimates
- Testing: 70-80% of traditional time estimates

---

## 1. Programming Languages

### JavaScript

| Attribute | Detail |
|-----------|--------|
| Proficiency | Expert |
| Use Cases | n8n workflow scripting (Function nodes, Code nodes), PocketBase hooks, quick automation scripts |
| Version | ES2022+ |
| When to Use | n8n Code nodes, server-side scripts, rapid prototyping, PocketBase server-side hooks |

### TypeScript

| Attribute | Detail |
|-----------|--------|
| Proficiency | Expert |
| Use Cases | Frontend development (React), NestJS backend (CA AI Agent), type-safe API clients |
| Version | 5.x |
| When to Use | All frontend projects, all NestJS projects, any codebase expected to grow beyond prototype stage |

---

## 2. Frontend

### React

| Attribute | Detail |
|-----------|--------|
| Proficiency | Advanced |
| Use Cases | Layaa OS frontend, custom client dashboards, interactive admin panels |
| Version | 18.x |
| Key Libraries | React Router, React Query (TanStack Query), Zustand (state management), PocketBase JS SDK |
| When to Use | Primary frontend framework for all custom applications requiring rich interactivity |

### Next.js

| Attribute | Detail |
|-----------|--------|
| Proficiency | Intermediate-Advanced |
| Use Cases | CA AI Agent frontend, marketing sites, applications requiring SSR/SSG |
| Version | 14.x |
| Key Features Used | App Router, Server Components, API Routes, SSR for SEO-critical pages |
| When to Use | When SEO matters, when server-side rendering is needed, when the project benefits from the Next.js ecosystem (image optimisation, routing) |

### Tailwind CSS

| Attribute | Detail |
|-----------|--------|
| Proficiency | Advanced |
| Use Cases | All frontend styling across projects |
| Version | 3.x |
| Key Patterns | Utility-first approach, component composition with `@apply` for repeated patterns, responsive design with mobile-first breakpoints |
| When to Use | Always. Tailwind is the standard styling approach for all Layaa AI frontend projects |

---

## 3. Backend

### Node.js

| Attribute | Detail |
|-----------|--------|
| Proficiency | Advanced |
| Use Cases | Runtime for n8n, NestJS applications, PocketBase hooks, utility scripts |
| Version | 20.x LTS |
| When to Use | Default server-side runtime for all JavaScript/TypeScript projects |

### Express.js

| Attribute | Detail |
|-----------|--------|
| Proficiency | Advanced |
| Use Cases | Simple API servers, webhook receivers, lightweight middleware |
| When to Use | Quick API endpoints, simple server-side tasks, when NestJS is overkill |

### NestJS

| Attribute | Detail |
|-----------|--------|
| Proficiency | Intermediate-Advanced |
| Use Cases | CA AI Agent backend, complex API services requiring structured architecture |
| Version | 10.x |
| Key Features Used | Modules, dependency injection, guards, interceptors, DTOs with class-validator |
| When to Use | Backend services that require structured architecture, dependency injection, and will grow in complexity. Not for simple automation endpoints (use n8n or Express for those) |

---

## 4. Databases

### PocketBase (SQLite)

| Attribute | Detail |
|-----------|--------|
| Proficiency | Expert |
| Use Cases | Primary database for Layaa OS, EduFlow, and most client projects |
| Deployment | Self-hosted on Indian VPS |
| Key Features | Built-in REST API, real-time subscriptions (WebSocket), authentication system, file storage, admin UI, API rules for access control |
| Strengths | Single binary deployment, zero external dependencies, excellent for SME-scale applications (thousands to tens of thousands of records), real-time out of the box |
| Limitations | Single-server only (no horizontal scaling), SQLite write concurrency limits, not suitable for high-write-throughput applications |
| When to Use | Default database choice for all projects unless a specific requirement disqualifies it. Suitable for most SME applications |

### PostgreSQL

| Attribute | Detail |
|-----------|--------|
| Proficiency | Intermediate |
| Use Cases | Applications requiring complex queries, heavy transactional workloads, or multi-server architecture |
| When to Use | When PocketBase's SQLite limitations are hit: high concurrent writes, complex JOIN-heavy queries, need for PostgreSQL-specific features (JSONB, full-text search, PostGIS). Also when the client already runs PostgreSQL |

### MongoDB

| Attribute | Detail |
|-----------|--------|
| Proficiency | Intermediate |
| Use Cases | Document-heavy applications, flexible schema requirements |
| When to Use | Rarely. Only when the data is truly document-oriented with varying schemas, or when a client's existing system uses MongoDB. PocketBase with JSON fields covers most flexible-schema needs |

---

## 5. Automation Platforms

### n8n (Primary)

| Attribute | Detail |
|-----------|--------|
| Proficiency | Expert |
| Deployment | Self-hosted on Indian VPS |
| Use Cases | All workflow automation, API orchestration, LLM integration, scheduled tasks, webhook handling |
| Key Capabilities | 400+ integration nodes, visual workflow builder, Code/Function nodes for custom logic, credential store for secure API key management, webhook triggers, cron scheduling |
| Core Workflows | 7 core workflows in Layaa OS (sage-extraction, approval-handler, delegation, response, scheduled-memory, budget, notifications) |
| When to Use | Primary automation engine for all projects. First choice for any workflow, integration, or automation requirement |

### Make (formerly Integrobot)

| Attribute | Detail |
|-----------|--------|
| Proficiency | Advanced |
| Use Cases | Client projects where Make is already in use, integrations not available in n8n, visual scenario building for non-technical stakeholders |
| When to Use | When a client specifically requests Make, or when a required integration is available in Make but not in n8n. Secondary to n8n |

### Zapier

| Attribute | Detail |
|-----------|--------|
| Proficiency | Advanced |
| Use Cases | Simple 2-3 step automations, client handovers where the client team will maintain the automation independently |
| When to Use | When the client's team needs to maintain the automation themselves and lacks technical ability for n8n. Zapier's simpler UX makes it suitable for non-technical owners. Not for complex workflows |

### Relevance AI

| Attribute | Detail |
|-----------|--------|
| Proficiency | Intermediate |
| Use Cases | AI agent building, chain-of-thought workflows, knowledge base integrations |
| When to Use | When building AI agents that need a managed platform with built-in LLM orchestration. Alternative to custom n8n + Claude workflows when speed is prioritised over control |

---

## 6. AI / LLM

### Claude Sonnet 4.6 (Default)

| Attribute | Detail |
|-----------|--------|
| Provider | Anthropic |
| Proficiency | Expert |
| Use Cases | Complex reasoning, analysis, content generation, multi-step tasks, structured output generation |
| Typical Latency | 3-15 seconds |
| When to Use | Default model for all AI tasks requiring reasoning, analysis, or high-quality text generation. Start here unless there is a specific reason to use another model |

### Claude Haiku 4.5 (Fast Tasks)

| Attribute | Detail |
|-----------|--------|
| Provider | Anthropic |
| Proficiency | Expert |
| Use Cases | Classification, extraction, simple Q&A, data formatting, routing decisions, quick responses |
| Typical Latency | 0.5-3 seconds |
| When to Use | Tasks where speed matters more than depth. Classification, entity extraction, format conversion, simple question answering. Significantly cheaper than Sonnet |

### Google ADK (Agent Development Kit)

| Attribute | Detail |
|-----------|--------|
| Proficiency | Intermediate-Advanced |
| Use Cases | Multi-agent orchestration in Layaa OS, agent-to-agent communication, tool use |
| When to Use | Layaa OS multi-agent architecture. When agents need to coordinate, delegate, and collaborate. Not for simple single-agent tasks |

### OpenAI API

| Attribute | Detail |
|-----------|--------|
| Proficiency | Intermediate |
| Use Cases | Fallback provider, specific tasks where GPT models perform better, client requests |
| When to Use | When Claude is unavailable (outage, rate limiting), when a specific capability is better served by GPT models (e.g., certain code generation tasks), or when the client specifically requests OpenAI |

### Pluggable Provider Architecture

All LLM integrations use a pluggable architecture. Provider configuration is stored in PocketBase, and n8n workflows read the provider config dynamically. Switching from Claude to OpenAI (or any future provider) requires only a configuration change, not a workflow rebuild.

---

## 7. DevOps & Infrastructure

### Indian VPS (Self-Hosted)

| Attribute | Detail |
|-----------|--------|
| Use Cases | Hosts PocketBase, n8n, and all self-hosted services |
| Cost | < INR 500/month total |
| Location | India (data sovereignty compliance) |
| When to Use | All production and staging deployments. Data stays in India |

### Backblaze B2

| Attribute | Detail |
|-----------|--------|
| Use Cases | Off-site backup storage |
| Integration | Via rclone, automated daily at 3 AM IST |
| When to Use | All backup storage. Cost-effective S3-compatible object storage |

### rclone

| Attribute | Detail |
|-----------|--------|
| Use Cases | Syncing backups from VPS to Backblaze B2 |
| Schedule | Daily at 3 AM IST (cron job) |
| When to Use | All backup operations. Handles encryption, compression, and incremental sync |

### CI/CD (Basic)

| Attribute | Detail |
|-----------|--------|
| Current Setup | Basic deployment scripts, manual trigger |
| Approach | Script-based deployment to VPS via SSH |
| When to Use | All deployments. Evolving toward more automated pipelines as the team grows |

---

## 8. Web Builders / Rapid Development

### Lovable 2.0

| Attribute | Detail |
|-----------|--------|
| Proficiency | Expert |
| Use Cases | Rapid UI prototyping, full frontend generation, component scaffolding |
| When to Use | Primary tool for rapid frontend development. Generates React + TypeScript + Tailwind code from natural language descriptions. Used alongside Claude Code for the vibe coding approach |

### Bolt AI

| Attribute | Detail |
|-----------|--------|
| Proficiency | Advanced |
| Use Cases | Full-stack app scaffolding, quick prototypes, landing pages |
| When to Use | When a complete full-stack starting point is needed quickly. Alternative to Lovable for certain project types |

---

## 9. APIs & Communication Protocols

### REST API

| Attribute | Detail |
|-----------|--------|
| Use Cases | PocketBase API, n8n webhook endpoints, external service integrations |
| Standards | JSON request/response, proper HTTP status codes, structured error responses |
| When to Use | Default protocol for all API communication. Synchronous request-response patterns |

### WebSocket

| Attribute | Detail |
|-----------|--------|
| Use Cases | PocketBase real-time subscriptions, Layaa OS live updates, agent conversation streaming |
| Implementation | PocketBase built-in WebSocket for real-time collection subscriptions |
| When to Use | When the frontend needs to receive live updates without polling. Agent responses, notification delivery, status changes |

### PocketBase Real-Time API

| Attribute | Detail |
|-----------|--------|
| Use Cases | Subscribe to collection changes, individual record changes |
| Implementation | Built into PocketBase; accessed via PocketBase JS SDK's `subscribe()` method |
| When to Use | Any frontend feature that needs to react to data changes in real-time. Replaces the need for custom WebSocket servers in most cases |

---

## 10. Technology Selection Decision Framework

When evaluating technology for a new project or feature, follow this decision hierarchy:

### Step 1: Can We Use What We Already Have?

Check if the existing stack (PocketBase + n8n + React + Claude) covers the requirement. 90% of the time, it does. Do not add new technology unless there is a clear, justified reason.

### Step 2: Does It Meet Our Constraints?

| Constraint | Question |
|-----------|----------|
| Self-hosted | Can we self-host it on our Indian VPS? |
| Cost | Does it fit within < INR 500/month total infrastructure budget? |
| Complexity | Can it be maintained by a single technical person (CTO)? |
| Data sovereignty | Does data stay in India (or under our control)? |
| Vendor lock-in | Can we switch away without rewriting the system? |

### Step 3: Proficiency Check

Do we have sufficient proficiency to deliver reliably? If proficiency is "Beginner" or "Basic," factor in learning time and risk. For client projects, prefer technologies where proficiency is "Advanced" or "Expert."

### Step 4: Document the Decision

Record why a technology was chosen (or rejected) in the project's architecture documentation. Reference the Architecture Decision Record (ADR) format from the automation-architecture document.

---

## Appendix: Proficiency Scale

| Level | Definition |
|-------|-----------|
| Expert | Deep knowledge, can troubleshoot complex issues, can teach others, has production experience |
| Advanced | Strong working knowledge, comfortable with complex features, production experience |
| Intermediate | Solid fundamentals, comfortable with common patterns, may need reference for advanced features |
| Basic | Understands concepts, can build simple implementations, needs significant reference material |
| Beginner | Learning phase, not suitable for client-facing work |

---

## Appendix: Technology Radar

### Adopt (Use in production)
- PocketBase, n8n, React, TypeScript, Tailwind CSS, Claude Sonnet 4.6, Claude Haiku 4.5, Lovable 2.0, Backblaze B2, rclone

### Trial (Use in pilot projects)
- Google ADK, NestJS, Next.js 14 App Router, Bolt AI

### Assess (Evaluating)
- Deno 2.x, Bun runtime, LangGraph, CrewAI

### Hold (Do not adopt for new projects)
- Firebase (vendor lock-in), AWS Lambda (cost at scale for SME), Django/Python (not in current team skill set)

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
