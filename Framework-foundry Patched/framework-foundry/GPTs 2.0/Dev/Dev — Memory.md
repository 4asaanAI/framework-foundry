# Dev — Initial Memory

> These are Dev's foundational memories as of platform launch (April 2026). They represent the starting context Dev needs to operate from day one. Sage will manage ongoing memory updates, but these provide the baseline.

---

## Platform State

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **Layaa OS Phase 0 (MVP): COMPLETE** — Grade A- (90% production quality). All 22 agent profiles seeded. Core features working: conversations, memory (Sage), approvals (3-tier), budgets (per-agent + shared pool), tasks, notifications, file handling, offline mode, delegation (@mentions), /commands (60+ skills), GDPR compliance, PocketBase auth, audit logging. | company | 1.0 | Platform Audit |
| **Phase 1: STARTING** — Real-time orchestration phase. Key features: RLS Security (P0 CRITICAL), n8n full activation (7 workflows), real-time agent communication (WebSocket/SSE), advanced approvals (multi-level), KB integration (semantic search/RAG), agent skill execution. | company | 1.0 | Roadmap |
| Two critical patches needed from Phase 0 (both minor): Sage not in sidebar (2 min fix) and DELEGATION_MAP expansion from 6 to 22 agents (30 min fix). | process | 1.0 | Bug triage |
| Tech stack: PocketBase (self-hosted, SQLite) + React/TypeScript + n8n + Google ADK + WebSockets + Claude Sonnet 4.6 / Haiku 4.5. All self-hosted on Indian infrastructure. | decision | 1.0 | Platform Architecture |

---

## Pilot Program

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **The Aaryans School** — Pilot launch April 13, 2026. Two CBSE-affiliated branches: Joya and Meerut, Uttar Pradesh. EduFlow deployment. First real client engagement. | client_info | 1.0 | Founder context |
| **SSA (Akshat Sharma)** — Pilot launch April 15, 2026. Education client. EduFlow v2 deployment. Second pilot — launch contingent on Gate 1 results from Aaryans. | client_info | 1.0 | Founder context |
| **Pilot success criteria:** >10 messages/user/day, >100 memories/school/week, >5 delegations/day, zero S0 bugs, >99% uptime, NPS >7/10, <2s response time, offline sync within 30s. | decision | 1.0 | Product metrics |
| **Decision gates:** Gate 1 (April 13 evening) — go/no-go for SSA. Gate 2 (April 20) — expand to 3rd school or pause. Gate 3 (April 30) — scale to 10 schools, iterate, or pivot market. | decision | 1.0 | Founder directive |

---

## Feature Backlog Priorities

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **P0 CRITICAL: RLS Security Tightening** — 4-6 hours. Must complete before SSA launch. Blocks all multi-user functionality. Currently PocketBase has no row-level isolation between users. | decision | 1.0 | Security assessment |
| **P0: DELEGATION_MAP Expansion** — 30 min fix. Only 6 of 22 agents currently mapped. Delegation broken for 16 agents. | process | 1.0 | Bug report |
| **P0: Sage Sidebar Addition** — 2 min fix. Memory agent not accessible from navigation. | process | 1.0 | Bug report |
| **P1: Conversation Agent Picker** — 3-4 hours. UX improvement for switching between agents without creating new conversations. | decision | 0.9 | User feedback |
| **P1: CRM Board Kanban View** — 4-6 hours. Visual pipeline management with drag-and-drop stage transitions. Depends on CRM data model. | decision | 0.9 | Founder request |
| **P1: Projects Details View** — 6-8 hours. Project context display with task aggregation. Depends on Projects table. | decision | 0.9 | Backlog |
| **P2: Plugins Disconnect** — 1-2 hours. User control to enable/disable integrations. | decision | 0.8 | Backlog |
| **P2: Local Folder Sync** — 4-6 hours. File system access for document management. Depends on browser File API. | decision | 0.8 | Backlog |

---

## Key Product Decisions Made

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **PocketBase over Supabase** — Chosen for offline capability, self-hosting, data sovereignty, and zero vendor lock-in. Trade-off: no built-in RLS (must implement manually). | decision | 1.0 | Architecture decision |
| **n8n for orchestration** — Open-source, self-hosted, visual workflow builder. 7 core workflows defined: sage-extraction, approval-handler, delegation, response, scheduled-memory, budget, notifications. Not all activated yet. | decision | 1.0 | Architecture decision |
| **Claude Sonnet 4.6 as default LLM** — Best reasoning quality. Haiku 4.5 for fast/cheap tasks. Pluggable provider architecture supports OpenAI and Google as fallbacks. | decision | 1.0 | LLM strategy |
| **Weekly sprints** — 1-week sprints chosen because Shubham's availability is variable (CEO/CTO dual role). Shorter sprints allow faster course correction. | decision | 1.0 | Process decision |
| **AI-assisted development compression** — Build estimates use compressed ratios: Architecture 60-70%, Core logic 30-40%, UI 40-50%, Testing 70-80% of traditional estimates. | decision | 0.9 | Revenue Model |
| **Approval gate system** — Non-blocking modals, 30-min timeout, trusted recurring bypass for repeated approvals. | decision | 1.0 | Feature design |
| **Budget per agent** — Monthly allocation with atomic increment, loan system between agents, 500K shared pool for Kaiser and Sage. | decision | 1.0 | Resource management |
| **Offline-first** — IndexedDB + service worker plumbing installed. Full activation deferred to Phase 1.5. Write queue and sync on reconnect working. | decision | 1.0 | Architecture decision |

---

## Technical Debt Register

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Offline mode plumbing installed but full activation deferred — needs service worker integration testing. | process | 0.9 | Tech audit |
| DELEGATION_MAP currently hardcoded with 6 agents — must expand to 22 for full delegation support. | process | 1.0 | Bug report |
| RLS rules not yet implemented — critical security gap before any multi-user scenario. | process | 1.0 | Security assessment |
| Memory compression not yet triggered — volume too low to test. Will need testing under load. | process | 0.8 | System observation |
| n8n workflows defined but not all activated — need deployment and monitoring setup. | process | 0.9 | Infrastructure status |
| Sage not in sidebar navigation — minor UI omission. | process | 1.0 | Bug report |

---

## Team Context

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **Shubham (CTO)** is primary and currently sole builder. ~20-25 hours/week on Layaa OS. Also handles CEO duties, client calls, and strategy. Capacity is the primary constraint. | company | 1.0 | Operating context |
| Build approach: Vibe coding with Lovable 2.0 + Claude Code. No traditional engineering team. AI-assisted development is core to delivery speed. | process | 1.0 | Company approach |
| **Abhimanyu (CEO)** is non-technical. All product communications to him must be outcome-focused, not implementation-focused. Prefers 3 options max. | preference | 1.0 | Founder context |
| AI agents assist with: Planning and specs (Dev), architecture design (Ujjawal), QA validation (Rohit), documentation (Arush), client context (Arjun). | process | 1.0 | Org structure |
| Infrastructure budget capped at Rs.500/month. Every decision must account for bootstrap constraints. | company | 1.0 | Operating constraints |

---

## Risks Being Tracked

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Shubham unavailable April 13 → Backup runbooks needed for pilot Day 1. | process | 0.8 | Risk assessment |
| SSA requirements may not fully match EduFlow v2 capabilities → Discovery calls scheduled. | process | 0.8 | Risk assessment |
| System crash on pilot Day 1 → Staging test planned April 11, gradual rollout strategy. | process | 0.8 | Risk assessment |
| Users may not understand agent features → Onboarding videos and documentation planned. Arush creating onboarding packs. | process | 0.8 | Risk assessment |
| Delegation routing failures → DELEGATION_MAP fix queued as P0. | process | 1.0 | Bug triage |

---

## Sprint History

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| No formal sprints completed yet under the new sprint framework. Phase 0 was built in a continuous development mode before the sprint cadence was established. Sprint 1 will be the first formal sprint under the weekly framework. | process | 1.0 | Process context |
| Sprint 1 will focus on: P0 patches (Sage sidebar, DELEGATION_MAP), RLS Security, and pilot readiness testing. Target capacity: reduced due to pilot launch support. | decision | 0.9 | Sprint planning |

---

*These memories represent Dev's initial knowledge state. They will be continuously enriched through sprint cycles, user feedback, product decisions, and pilot outcomes. Confidence scores will be dynamically adjusted based on validation and real-world data.*
