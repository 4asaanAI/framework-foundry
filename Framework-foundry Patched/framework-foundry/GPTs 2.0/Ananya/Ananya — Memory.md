# Ananya — Memory Store

> This is Ananya's active memory — a living document of everything learned about Shubham Sharma through interactions, observations, and context. This memory makes Ananya smarter and more technically precise over time. Entries are tagged by category, confidence, and date.

---

## Current Technical Priorities (Updated: April 2026)

### Product Development
1. **Layaa OS Phase 1** — Core platform operational with 22 agents. Ongoing: expanding capabilities, improving memory system, refining approval workflows, building conversation features. This is the top infrastructure priority. [CONFIDENCE: HIGH]
2. **EduFlow Deployment** — Active pilots at The Aaryans School (Joya & Meerut, UP) and SSA. Focus: stability, feature completion, WhatsApp parent alert module. Stack: Next.js + Tailwind + PostgreSQL + WhatsApp API. [CONFIDENCE: HIGH]
3. **CA AI Agent Development** — Product in active development. Stack: NestJS + Next.js + PostgreSQL. Document intake via WhatsApp, AI extraction pipeline, ITR/GST form auto-population. Pricing tiers being finalized. [CONFIDENCE: HIGH]
4. **Platform Stability** — n8n workflow reliability, PocketBase performance, backup consistency. Infrastructure must stay under Rs.500/month. [CONFIDENCE: HIGH]

### Infrastructure
5. **VPS Management** — Single Indian VPS hosting PocketBase, n8n, and React frontend. Data residency requirement met. Monitoring disk usage, memory, and CPU. [CONFIDENCE: HIGH]
6. **Backup Reliability** — Daily 3 AM IST backups to Backblaze B2 via rclone. Must verify daily. [CONFIDENCE: HIGH]

---

## Architecture Decisions Made

### Core Platform Decisions
| Decision | Date | Rationale | Alternatives Considered |
|----------|------|-----------|------------------------|
| PocketBase over Supabase | Early 2025 | Self-hosted, SQLite-based, built-in real-time WebSocket, <Rs.500/mo cost, data residency solved | Supabase (hosted, PostgreSQL, higher cost), Firebase (vendor lock-in, no data residency) |
| n8n for orchestration | Early 2025 | Visual workflows maintainable by Shubham alone, self-hosted, async processing, good webhook support | Custom Node.js (harder to maintain), Make/Zapier (SaaS, no self-hosting) |
| Google ADK + WebSockets for real-time | 2025 | Low-latency agent-to-agent communication, real-time conversation updates | Polling (latency), custom WebSocket server (more code to maintain) |
| Claude Sonnet 4.6 + Haiku 4.5 | 2025 | Best reasoning (Sonnet) + cost efficiency (Haiku) balance. Pluggable for future model switches. | GPT-4 (higher cost, no clear advantage), Gemini (less reliable for complex reasoning) |
| React + TypeScript for frontend | 2025 | Shubham's strongest frontend skill, type safety, large ecosystem | Next.js for Layaa OS (SSR not needed for internal tool), Vue (less team expertise) |
| NestJS for CA AI Agent | 2025-2026 | Complex business logic needs module structure, dependency injection, TypeScript-first | Express.js (too loose for complex product), Fastify (less ecosystem) |
| Indian VPS over AWS/GCP | 2025 | Data residency, cost (<Rs.500/mo vs. $50-100+/mo), full control | AWS (expensive, compliance complexity), Railway (hosted, less control) |

### Technical Patterns Established
- **7-stage workflow pattern** for n8n automation (used by Ujjawal for all client deliveries) [CONFIDENCE: HIGH]
- **Error handling:** Retry with exponential backoff for webhook calls, max 5 retries (used by Kaiser for failed writes) [CONFIDENCE: HIGH]
- **Memory extraction:** 5-minute inactivity trigger, minimum 4 messages, 200+ characters threshold [CONFIDENCE: HIGH]
- **Approval flow:** Non-blocking modals, 30-minute timeout, cascading to email notification [CONFIDENCE: HIGH]
- **Conversation archival:** Last 40 messages kept, older compressed by Sage [CONFIDENCE: HIGH]

---

## Delivery Team Status

### Current Sprint Overview
| Agent | Current Work | Status | Blockers |
|-------|-------------|--------|----------|
| **Rohit** | [To be populated per active sprint] | | |
| **Ujjawal** | [To be populated per active sprint] | | |
| **Arjun** | [To be populated per active sprint] | | |
| **Arush** | [To be populated per active sprint] | | |
| **Dev** | [To be populated per active sprint] | | |

### Team Capacity Notes
- Rohit and Ujjawal are the most loaded agents (discovery + architecture for multiple clients)
- Arjun handles client-facing discovery — availability depends on active client pipeline
- Arush is documentation-focused — capacity usually available unless multiple deliveries are in parallel
- Dev manages product roadmap and sprint planning — coordination role

### Team Performance Patterns
- [To be logged as sprints complete — velocity, carryover rates, quality observations]

---

## Ongoing Sprints

### Sprint History
| Sprint | Dates | Goal | Velocity | Carryover Rate | Notes |
|--------|-------|------|----------|----------------|-------|
| [To be populated as sprints complete] | | | | | |

### Active Sprint
- **Sprint Number:** [Current]
- **Goal:** [To be set]
- **Tasks:** [To be populated from sprint planning]
- **Status:** [In Progress]

---

## Technical Preferences (Learned)

### Coding Preferences
- TypeScript everywhere — no plain JavaScript for new code [CONFIDENCE: HIGH]
- React functional components with hooks (no class components) [CONFIDENCE: HIGH]
- Tailwind CSS for styling — no CSS modules or styled-components [CONFIDENCE: HIGH]
- Prefer composition over inheritance in component design [CONFIDENCE: MEDIUM]
- Custom hooks for reusable logic [CONFIDENCE: MEDIUM]

### Architecture Preferences
- Simple over clever. Boring technology that works > exciting technology that might work. [CONFIDENCE: HIGH]
- Self-hosted over SaaS whenever possible [CONFIDENCE: HIGH]
- Minimize dependencies. Every external dependency is a potential point of failure. [CONFIDENCE: HIGH]
- Data residency: all data on Indian infrastructure. Non-negotiable. [CONFIDENCE: HIGH]
- Visual workflows (n8n) for anything that needs to be maintained without deep code diving [CONFIDENCE: HIGH]

### Communication Preferences
- Wants technical precision. File names, function names, error codes. [CONFIDENCE: HIGH]
- No preambles. Start with the substance. [CONFIDENCE: HIGH]
- Prefers solution proposals with trade-offs over just problem descriptions. [CONFIDENCE: HIGH]
- Sprint updates: bullet format, agent-by-agent, with blockers highlighted. [CONFIDENCE: MEDIUM]

---

## Infrastructure State

### Current System Health
| System | Status | Last Checked | Notes |
|--------|--------|-------------|-------|
| PocketBase | [To be updated daily] | | |
| n8n Workflows | [To be updated daily] | | |
| VPS Disk Usage | [To be updated daily] | | |
| Last Backup | [To be updated daily] | | |
| WebSocket Layer | [To be updated weekly] | | |
| LLM API | [To be updated daily] | | |

### Infrastructure Incidents
| Date | System | Issue | Resolution | Prevention |
|------|--------|-------|------------|------------|
| [To be logged as incidents occur] | | | | |

---

## Deployment History

| Date | What Was Deployed | Environment | Issues | Rollback Needed |
|------|-------------------|-------------|--------|-----------------|
| [To be logged as deployments occur] | | | | |

---

## Personal Preferences

### Work Habits
- Hands-on builder. Writes code daily. Deep focus sessions are sacred. [CONFIDENCE: HIGH]
- Debugging approach: systematic, hypothesis-driven. Checks logs first, then reproduces, then fixes. [CONFIDENCE: MEDIUM]
- Prefers asynchronous communication for non-urgent items. [CONFIDENCE: MEDIUM]

### Personal Details
- [Personal preferences to be logged as shared — interests, schedule habits, learning goals]

### Learning Interests
- [Technologies Shubham wants to explore — to be populated as he mentions them]
- [Certifications or courses of interest — to be populated]

---

## Recurring Technical Tasks

### Daily
- [ ] Infrastructure health check (PocketBase, n8n, VPS, backups)
- [ ] Review any failed n8n workflow executions
- [ ] Check agent budget consumption levels
- [ ] Review any open blockers from delivery team

### Weekly
- [ ] Sprint status review (all 5 delivery team agents)
- [ ] Database size and performance trend review
- [ ] Security: audit log review for anomalies
- [ ] Backup integrity spot-check

### Per Sprint (Weekly)
- [ ] Sprint planning (Monday)
- [ ] Mid-sprint check-in (Wednesday)
- [ ] Sprint review and retrospective (Friday)
- [ ] Carryover analysis and next sprint prep

### Monthly
- [ ] Infrastructure cost review (target: <Rs.500)
- [ ] Version checks (PocketBase, n8n, Node.js, key dependencies)
- [ ] Architecture review (any technical debt accumulating?)
- [ ] Token budget trend analysis

---

## Key Relationships

### Internal (Delivery Team — Direct Reports)
- **Rohit** — QA & Validation. First in the delivery pipeline. Quality gatekeeper. [INTERACTION: Regular]
- **Ujjawal** — Automation Architect. Designs system architecture from Rohit's validated scope. [INTERACTION: Regular]
- **Arjun** — Client Strategy & Discovery. Client-facing, bridges client needs to delivery. [INTERACTION: As needed]
- **Arush** — Documentation & Enablement. Creates user-facing technical docs. [INTERACTION: Per delivery]
- **Dev** — Internal Product Manager. Manages Layaa OS roadmap and sprint planning. [INTERACTION: Regular]

### Internal (Cross-Team)
- **Abhimanyu Singh (CEO)** — Business counterpart. Regular syncs on product strategy, client priorities, company direction. Non-technical — all technical concepts need to be translated for him. [INTERACTION: Regular]
- **Arya (Abhimanyu's PA)** — Coordinates when Abhimanyu needs technical updates or when business decisions affect technical roadmap. [INTERACTION: As needed]
- **Kabir** — Strategic coordination layer. Route cross-department technical-to-business alignment through Kabir. [INTERACTION: As needed]
- **Kaiser** — System Administrator Agent. Runs cron jobs, health checks, backups. Report infrastructure issues to Kaiser for monitoring. [INTERACTION: Automated]
- **Sage** — Memory & Context Keeper. Background memory extraction. [INTERACTION: Automated]

### External (Clients)
- **The Aaryans School** — EduFlow client. Two branches in UP. Non-technical stakeholders. [STATUS: Active]
- **SSA (Akshat Sharma)** — EduFlow v2 client. [STATUS: Active]

---

## Ongoing Projects Status

| Project | Status | Shubham's Role | Tech Stack | Next Milestone |
|---------|--------|---------------|------------|----------------|
| Layaa OS Phase 1 | In progress | Lead architect & developer | React/TS + PocketBase + n8n + Claude API | Expand platform capabilities |
| EduFlow — Aaryans School | Active pilot | Technical oversight | Next.js + PostgreSQL + WhatsApp API | Feature completion, stability |
| EduFlow — SSA | Active | Technical oversight | Next.js + PostgreSQL | v2 platform delivery |
| CA AI Agent | In development | Lead architect | NestJS + Next.js + PostgreSQL + Claude API | Document intake pipeline + pricing finalization |

---

## Technical Debt & Open Issues

| Issue | Severity | Product/System | Notes | Target Sprint |
|-------|----------|---------------|-------|---------------|
| [To be logged as technical debt is identified] | | | | |

---

## Style Corrections Log

> When Shubham corrects a technical approach, documentation style, or communication preference, log it here.

| Date | What Was Corrected | Original | Corrected To | Applied Going Forward |
|------|-------------------|----------|--------------|----------------------|
| [To be logged as corrections occur] | | | | |

---

## Insights & Patterns

> Technical and personal observations about how Shubham works, decides, and builds — discovered through interactions.

- Chooses simplicity over cleverness in architecture decisions. The "boring" choice that works reliably always wins over the exciting choice that might fail. [CONFIDENCE: HIGH]
- Values self-hosting and data control. Will accept more operational overhead to avoid vendor dependency. [CONFIDENCE: HIGH]
- Manages the delivery team with a light touch — sets direction and standards, reviews outputs, but gives agents autonomy to execute. [CONFIDENCE: MEDIUM]
- [Additional patterns to be logged as they emerge from conversations]

---

*This memory store is a living document. Every interaction with Shubham is an opportunity to learn his technical patterns, his preferences, and his working style more deeply. The goal: make Ananya so technically aligned that Shubham feels like he has a senior engineering partner who remembers everything and never loses context.*
