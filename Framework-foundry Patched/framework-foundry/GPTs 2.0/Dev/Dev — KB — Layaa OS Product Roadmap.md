# Dev — KB — Layaa OS Product Roadmap

> The single source of truth for the Layaa OS product roadmap. Contains all phases, milestones, dependencies, and current status. Dev owns this document and updates it continuously as priorities evolve.

---

## Platform Overview

Layaa OS is Layaa AI's self-hosted multi-agent AI workforce platform. It replaces 10+ SaaS tools with a unified workspace where 22 AI agents collaborate autonomously. It is not a product for sale — it is the internal infrastructure moat powering all of Layaa AI's service delivery.

**Tech Stack:** PocketBase (self-hosted, SQLite) + React/TypeScript (frontend) + n8n (async orchestration) + Google ADK + WebSockets (real-time) + Claude Sonnet 4.6 / Haiku 4.5 (LLMs)

**Architecture Philosophy:** Self-hosted, data sovereign (Indian infrastructure), offline-capable, no vendor lock-in, pluggable LLM providers.

---

## Phase 0: MVP (Weeks 1-6) — COMPLETE

**Grade:** A- (90% production quality) | **Status:** Pilot-ready

### Delivered Capabilities
- 22 agent profiles with system prompts, knowledge bases, and skills
- Conversation system (full persistence, message history, compression, archival)
- Memory system (Sage — automatic extraction, relevance scoring, confidence)
- Approval workflow (3-tier: auto-approve, manual review, escalate to Founders — 30-min timeout)
- Budget management system (per-agent daily limits, atomic increment, monthly reset by Kaiser)
- Task management (create, assign, track, complete)
- Notification system (in-app real-time + email via Resend/n8n)
- File handling (upload, drag-drop, paste, PDF/DOCX/image support)
- Offline mode (IndexedDB caching, write queue, sync on reconnect)
- Agent delegation (@mention system, max 3 per message, sequential processing)
- /Command system (60+ skills with fuzzy search palette)
- GDPR compliance (export + delete my data)
- PocketBase auth (token-based, password gate)
- Audit logging (all significant actions)
- System agents: Kaiser (admin/cron, health checks, backups) and Sage (memory extraction, relevance scoring)
- Daily backup at 3 AM IST to Backblaze B2 via rclone

### Phase 0 Learnings
- SQLite-based PocketBase handles current scale well, but Row-Level Security (RLS) is essential before any multi-user scenario
- Memory extraction via Sage works but needs relevance scoring optimization
- The 500K shared token pool for system agents is adequate at current volume
- Offline-first architecture validated — critical for Indian SME reliability requirements
- Known patches needed: Sage not in sidebar (2 min fix), DELEGATION_MAP only had 6 of 22 agents (30 min fix)

---

## Phase 1: Real-Time Orchestration (Weeks 7-12) — CURRENT

**Status:** IN PROGRESS (Starting)
**Theme:** Make the platform actively useful — real-time, integrated, and intelligent

### Priority Features

| Feature | Effort | Priority | Dependencies | Status |
|---------|--------|----------|-------------|--------|
| RLS Security Tightening | 4-6 hrs | P0 CRITICAL | None | Pre-SSA launch |
| n8n Full Activation (7 workflows) | 6-10 hrs | P0 | n8n instance deployed | Not Started |
| Real-Time Agent Communication | 4-6 hrs | P0 | WebSocket/SSE integration | Not Started |
| Conversation Agent Picker | 3-4 hrs | P1 | Current picker exists | Week 2 |
| Advanced Approval Workflows | 4-6 hrs | P1 | Basic approvals (Phase 0) | Not Started |
| KB Integration (Semantic Search/RAG) | 8-12 hrs | P1 | n8n, embeddings | Not Started |
| Agent Skill Execution (Skills as Functions) | 4-6 hrs | P1 | Skill directory defined | Not Started |

### Phase 1 Milestones

| Milestone | Target | Success Criteria |
|-----------|--------|-----------------|
| RLS rules active on all user-facing collections | Week 8 | No cross-user data leakage possible |
| n8n connected and first workflow live | Week 8 | At least 1 production workflow running |
| Real-time agent responses (no polling) | Week 10 | WebSocket/SSE delivering <2s response visibility |
| Advanced approvals (multi-level, conditional) | Week 11 | At least 2-level approval chain working |
| KB integration: agents read dynamic KB | Week 12 | Agents pull current KB content, not static snapshots |

### Phase 1 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS implementation complexity | High — blocks multi-user | Prioritize as P0, Ujjawal full-time allocation |
| n8n instance stability | Medium — blocks automation | Deploy with monitoring, Kaiser health checks |
| WebSocket compatibility with PocketBase | Medium — affects real-time | Research PocketBase realtime subscriptions first |

---

## Phase 2: External Integrations (Weeks 13-20)

**Status:** PLANNED
**Theme:** Connect Layaa OS to the outside world

### Key Features
- CRM Module (contact management, pipeline tracking)
- CRM Board Kanban View (visual pipeline stages, drag-and-drop)
- Email Integration (send/receive via n8n + MCP servers)
- Slack Integration (slash commands, notifications)
- Zapier/Make Integration (1000+ app connections)
- Document Generation (proposals, reports, content — PDF/DOCX)
- Projects Details View (project context display, task aggregation)
- Plugins Disconnect/Reconnect (user control over integrations)
- Local Folder Sync (file system access for document management)

### Phase 2 Milestones

| Milestone | Target | Criteria |
|-----------|--------|----------|
| CRM module live with contact CRUD | Week 14 | Contacts created, viewed, updated, deleted via UI |
| Kanban board for CRM pipeline | Week 16 | Drag-and-drop pipeline stages working |
| Email send/receive via n8n | Week 17 | At least outbound email from agent actions |
| Document generation (at least PDF) | Week 19 | Agents can generate PDF outputs from templates |

---

## Phase 3: Advanced AI & Learning (Weeks 21-26)

**Status:** PLANNED
**Theme:** Make the platform smarter — learning, predicting, adapting

### Key Features
- Agent Fine-Tuning (per-agent behavior tuning on company conversation data)
- Multi-Turn Complex Workflows (lead-to-deal, onboarding, feedback loops)
- Revenue Forecasting Module (pipeline prediction using CRM + historical data)
- Predictive Task Assignment (auto-routing based on task history)
- Agent Performance Analytics (budget efficiency, task completion, quality scores)
- Memory Relevance Optimization (Sage improvements for better context retrieval)
- Natural Language Programming (generate n8n workflows via conversation)

---

## Phase 4: Enterprise & Scaling (Months 7-12)

**Status:** PLANNED (Long-Term)
**Theme:** Make Layaa OS a platform others can use

### Key Features
- Multi-User Access Control (role-based, team-level permissions)
- Multi-Organization Support (isolated tenants, shared infrastructure)
- White-Label Configuration (custom branding, domain, agent names)
- Agent Marketplace (community-built agents, templates)
- Custom Agent Builder (no-code agent creation)
- Billing & Subscription Management (if commercializing Layaa OS)
- API for External Developers (documented, rate-limited, versioned)
- Advanced Analytics (agent ROI, performance dashboards, usage patterns)

---

## Decision Gates (Pilot-Specific)

| Gate | Date | Criteria | Outcome Options |
|------|------|----------|-----------------|
| Gate 1 | April 13 evening | Aaryans Day 1 results | Continue to SSA April 15 OR fix critical issues first |
| Gate 2 | April 20 | >5 msgs/user + >50 memories/school | Expand to 3rd school OR pause and debug |
| Gate 3 | April 30 | Clear ROI demonstrated | Scale to 10 schools by June OR continue iterating OR pivot market |

---

## Roadmap Change Log

| Date | Change | Rationale | Approved By |
|------|--------|-----------|-------------|
| April 2026 | Phase 0 marked complete, Phase 1 initiated | MVP delivered, pilots starting | Shubham |
| April 2026 | RLS Security elevated to P0 CRITICAL | Required before multi-user and SSA launch | Shubham |

---

**Cross-references:**
- For current backlog priorities: see `Dev — KB — Feature Backlog & Prioritization.md`
- For sprint planning against this roadmap: see `Dev — KB — Sprint Planning Framework.md`
- For product metrics tracking progress: see `Dev — KB — Product Metrics & KPIs.md`
- For release coordination: see `Dev — KB — Bug Triage & Release Planning.md`

*The roadmap is a living document. It changes as we learn from users, discover technical constraints, and evolve our strategy. Every change is logged with a rationale.*
