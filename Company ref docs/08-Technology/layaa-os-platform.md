# Layaa OS Platform Overview

**Document Owner:** Shubham Sharma, CTO
**Last Updated:** April 2026
**Classification:** Internal Reference

---

## What Is Layaa OS

Layaa OS is a self-hosted multi-agent AI workforce platform designed to replace 10+ SaaS tools with a single, unified system. It provides Indian SMEs with an AI-powered team of 22 specialised agents that handle tasks across sales, marketing, finance, operations, HR, legal, and product -- all running on infrastructure that costs less than INR 500/month.

**Core value proposition:** Instead of subscribing to separate tools for CRM, project management, content creation, financial analysis, HR management, and more, a business deploys Layaa OS and gets an AI workforce that understands their context, remembers their preferences, and works within their budget constraints.

**Slogan:** "Empower decisions, Elevate Profits!"

---

## Architecture

### System Architecture Overview

```
+-----------------+          +------------------+          +------------------+
|                 |          |                  |          |                  |
|  React/TS       | <------> |  PocketBase      | <------> |  n8n             |
|  Frontend       | WebSocket|  (Auth, DB,      |  REST    |  (Workflow       |
|  (Tailwind,     |          |   Real-time,     |  API     |   Orchestration, |
|   Offline-first)|          |   File Storage)  |          |   7 Core         |
|                 |          |                  |          |   Workflows)     |
+-----------------+          +------------------+          +------------------+
                                                                    |
                                                                    | API Calls
                                                                    v
                                                          +------------------+
                                                          |  AI Layer        |
                                                          |  - Claude 4.6    |
                                                          |  - Haiku 4.5     |
                                                          |  - Google ADK    |
                                                          |  - OpenAI (alt)  |
                                                          +------------------+
```

### Component Breakdown

| Component | Technology | Role |
|-----------|-----------|------|
| Frontend | React + TypeScript + Tailwind CSS | User interface, offline-first PWA, real-time updates via WebSocket |
| Backend / Database | PocketBase (self-hosted, SQLite) | Authentication, data storage, REST API, real-time subscriptions, file storage, admin panel |
| Workflow Engine | n8n (self-hosted) | Agent logic orchestration, 7 core workflows, external API integration, scheduled tasks |
| Agent Framework | Google ADK | Multi-agent coordination, delegation, tool use |
| AI Reasoning | Claude Sonnet 4.6 (primary), Haiku 4.5 (fast tasks) | Natural language understanding, reasoning, content generation, analysis |
| Real-Time Communication | WebSockets (PocketBase built-in) | Live updates, agent responses, notifications |

---

## The 22 Agents

Layaa OS deploys 22 specialised agents organised by department. Each agent has a defined role, skill set, and authority level within the platform.

### Sales Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 1 | Rohit | Sales Strategist | Lead qualification, pipeline analysis, sales strategy, competitive positioning, deal coaching |
| 2 | Ananya | Client Relations Manager | Client communication drafting, relationship tracking, follow-up scheduling, sentiment analysis |

### Marketing Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 3 | Priya | Content Strategist | Content calendar planning, blog/social media content creation, SEO recommendations, brand voice enforcement |
| 4 | Vikram | Growth Analyst | Campaign performance analysis, channel optimisation, audience segmentation, A/B test recommendations |

### Finance Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 5 | Meera | Financial Controller | Budget tracking, expense analysis, financial reporting, cash flow forecasting, GST compliance checks |
| 6 | Arjun | Revenue Analyst | Revenue forecasting, pricing analysis, unit economics, MRR/ARR tracking, invoice management |

### Operations Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 7 | Ujjawal | Operations Manager | Workflow optimisation, process documentation, SOP creation, operational efficiency analysis |
| 8 | Kavya | Project Coordinator | Task tracking, deadline management, resource allocation, status reporting, blocker identification |

### Human Resources Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 9 | Neha | HR Manager | Policy drafting, employee handbook maintenance, onboarding checklists, compliance tracking |
| 10 | Rahul | Talent Analyst | Job description creation, candidate screening criteria, interview question generation, offer letter drafting |

### Legal Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 11 | Aditi | Legal Advisor | Contract review summaries, compliance checklists, risk identification, NDA/agreement drafting |
| 12 | Siddharth | Regulatory Analyst | GST compliance monitoring, TDS tracking, DPDP Act compliance, MCA filing reminders |

### Product Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 13 | Aakash | Product Strategist | Feature prioritisation, user story creation, competitive analysis, roadmap planning |
| 14 | Riya | UX Researcher | User feedback synthesis, usability recommendations, persona development, journey mapping |

### Technology Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 15 | Dev | Technical Architect | Architecture recommendations, tech stack evaluation, code review summaries, technical debt tracking |
| 16 | Ishaan | DevOps Engineer | Deployment checklists, monitoring recommendations, infrastructure optimisation, backup verification |

### Customer Success Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 17 | Tara | Customer Success Manager | Client health scoring, churn risk identification, onboarding guidance, success metric tracking |
| 18 | Karan | Support Analyst | Issue categorisation, knowledge base search, troubleshooting guidance, escalation routing |

### Intelligence Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 19 | Sage | Memory & Knowledge Keeper | Conversation memory extraction, preference tracking, knowledge consolidation, context retrieval |
| 20 | Nisha | Research Analyst | Market research, competitor tracking, industry trend analysis, data synthesis |

### Executive Department

| # | Agent Name | Role | Key Capabilities |
|---|-----------|------|-------------------|
| 21 | Maya | Executive Assistant | Meeting preparation, agenda creation, decision summaries, action item tracking, scheduling |
| 22 | Atlas | Strategic Advisor | Business model analysis, strategic recommendations, scenario planning, KPI dashboard insights |

---

## Phase 0: MVP -- COMPLETE (Grade A-, 90%)

Phase 0 delivered a fully functional multi-agent platform with the following capabilities:

### Delivered Capabilities

#### Conversations
- Multi-turn conversations with any of the 22 agents.
- Conversation history stored in PocketBase with full retrieval.
- Context-aware responses using conversation history and agent memory.
- Real-time message delivery via WebSocket.

#### Memory System (Sage)
- Automatic extraction of key information from conversations.
- Memory types: preferences, decisions, facts, action items, insights.
- Memory retrieval for context injection into agent responses.
- Memory consolidation via scheduled workflows.
- Memory managed by the dedicated Sage agent.

#### Approval System (3-Tier)
- Tier 1: Auto-approved (low-value, low-risk actions).
- Tier 2: Single approver required (medium-value actions).
- Tier 3: Multi-level approval chain (high-value, high-risk actions).
- Configurable thresholds per action type and department.
- Approval history and audit trail.

#### Budget Management
- Per-agent and per-department budget allocation.
- Real-time budget consumption tracking.
- Threshold alerts (50%, 75%, 90%, 100% of budget).
- Budget reports and forecasting.
- Automatic restriction when budget exceeded.

#### Task Management
- Task creation, assignment, and tracking.
- Task status workflow (pending, in-progress, review, completed).
- Due date tracking and overdue alerts.
- Task delegation between agents.
- Task history and completion metrics.

#### Notifications
- In-app notification system.
- Notification types: approval requests, task assignments, budget alerts, system events.
- Read/unread tracking.
- Notification preferences per user.

#### File Handling
- File upload and attachment to conversations.
- File storage via PocketBase's built-in file system.
- File type validation and size limits.
- File access control (only authorised users).

#### Offline Mode
- Progressive Web App (PWA) architecture.
- Offline-first data access for recently loaded data.
- Queue actions taken offline for sync when connectivity returns.
- Graceful degradation when network is unavailable.

#### Delegation
- Agent-to-agent task delegation.
- Delegation routing based on agent capabilities and availability.
- Delegation chain tracking (who delegated to whom).
- Cross-department delegation support.

#### Skills (60+)
- Each agent has a defined set of skills (minimum 2-3 per agent).
- Skills are invocable actions with defined inputs and outputs.
- Skill catalogue browsable by users.
- New skills addable via configuration (no code changes required for simple skills).

#### GDPR Compliance
- Data export capability (user can export all their data).
- Data deletion capability (right to be forgotten).
- Consent management for data processing.
- Data processing records maintained.

#### PocketBase Authentication
- Email/password authentication.
- Session management with token refresh.
- Role-based access (admin, manager, user).
- Password reset flow.

#### Audit Logging
- All significant actions logged with actor, action, target, timestamp.
- Immutable audit log (append-only).
- Audit log searchable by date, actor, action type.
- Compliance-ready audit trail.

---

## Phase 1: Real-Time Orchestration -- IN PROGRESS

### Priority Items

#### Row-Level Security (RLS)
- PocketBase API rules enforced for all collections.
- Users can only access their own organisation's data.
- Admin access scoped appropriately.
- Security rules tested and verified for every collection.

#### n8n Workflow Activation
- All 7 core workflows operational in production.
- Workflow monitoring and alerting active.
- Error handling and retry logic tested under production conditions.
- Performance baselined and optimised.

#### Real-Time Communications
- WebSocket connections stable under production load.
- Agent responses streamed to frontend in real-time.
- Presence indicators (agent online/processing/idle).
- Live typing indicators during agent response generation.

#### Knowledge Base Integration
- Agents can reference uploaded documents and knowledge bases.
- RAG (Retrieval-Augmented Generation) pipeline for document-grounded responses.
- Knowledge base management UI (upload, organise, search).
- Per-agent knowledge base scoping.

---

## Phase 2-4: Roadmap Overview

### Phase 2: Intelligence Layer
- Advanced analytics dashboard (usage patterns, ROI metrics, agent performance).
- Cross-agent intelligence (agents sharing insights with each other).
- Predictive capabilities (proactive suggestions based on patterns).
- Custom agent creation (users define new agents for their specific needs).
- Integration marketplace (connect external tools -- Tally, Zoho, WhatsApp Business).

### Phase 3: Enterprise Features
- Multi-tenant architecture (serve multiple organisations from one deployment).
- Advanced RBAC (role-based access control beyond basic roles).
- SSO (Single Sign-On) integration.
- Custom branding per organisation.
- API access for external developers.
- SLA monitoring and reporting.

### Phase 4: Ecosystem
- Agent marketplace (third-party agents).
- Workflow marketplace (pre-built automation templates).
- Partner integration programme.
- White-label offering for channel partners.
- Mobile native applications (iOS/Android).

---

## The 7 Core n8n Workflows

These workflows form the backbone of Layaa OS's agent intelligence and operations.

### 1. sage-extraction

**Purpose:** Extracts memories, preferences, decisions, and insights from agent conversations.
**Trigger:** Called asynchronously after a conversation turn.
**Process:** Analyses conversation content via Claude, identifies extractable information, categorises it (preference, fact, decision, action item), stores in the Sage memory collection.
**Output:** Memory records in PocketBase.

### 2. approval-handler

**Purpose:** Processes approval requests through the 3-tier approval hierarchy.
**Trigger:** Webhook called when an agent action requires approval.
**Process:** Evaluates the action type and value against tier thresholds, routes to the appropriate approver(s), creates approval request records, sends notifications.
**Output:** Approval request created, approver notified, status trackable.

### 3. delegation

**Purpose:** Handles task delegation between agents.
**Trigger:** Webhook called when an agent delegates a task.
**Process:** Evaluates the task requirements, selects the best target agent based on skills and availability, splits complex tasks if needed, creates delegation records.
**Output:** Task assigned to target agent, delegation chain recorded.

### 4. response

**Purpose:** Core agent response generation.
**Trigger:** Webhook called when a user sends a message to an agent.
**Process:** Retrieves conversation history, fetches relevant memories from Sage, constructs the prompt with agent persona and context, calls Claude, returns the response.
**Output:** Agent response delivered to frontend via webhook response.

### 5. scheduled-memory

**Purpose:** Periodic memory consolidation and maintenance.
**Trigger:** Cron schedule.
**Process:** Scans for unprocessed conversations, runs sage-extraction on them, consolidates duplicate memories, archives old memories, generates memory quality metrics.
**Output:** Consolidated memory store, processing metrics.

### 6. budget

**Purpose:** Budget monitoring and alerting.
**Trigger:** Cron schedule.
**Process:** Calculates current budget consumption per agent and department, compares against thresholds, triggers alerts when thresholds are reached, generates budget reports.
**Output:** Budget alerts, consumption records.

### 7. notifications

**Purpose:** Central notification delivery hub.
**Trigger:** Webhook called by other workflows.
**Process:** Receives notification request (type, recipient, content, priority), formats the notification, delivers via appropriate channel (in-app, email), records delivery status.
**Output:** Notification delivered, delivery status logged.

---

## Infrastructure

### Hosting

| Component | Location | Cost |
|-----------|----------|------|
| PocketBase | Indian VPS | Included in VPS |
| n8n | Indian VPS | Included in VPS |
| Frontend | Indian VPS | Included in VPS |
| **Total VPS** | **India** | **< INR 500/month** |

### Backups

| Item | Detail |
|------|--------|
| Schedule | Daily at 3 AM IST |
| Method | rclone sync to Backblaze B2 |
| Contents | PocketBase SQLite database, uploaded files, n8n workflow exports, configuration files |
| Retention | 30 days rolling |
| Recovery | Tested monthly; full restore documented in operations runbook |

### Monitoring

- n8n execution logs (success/failure per workflow).
- PocketBase access logs.
- VPS resource monitoring (CPU, memory, disk).
- Budget consumption dashboard within Layaa OS itself.

---

## Design Principles

### 1. Offline-First
The frontend works without an active internet connection for previously loaded data. Actions taken offline are queued and synced when connectivity returns. No functionality is completely blocked by network outage.

### 2. Data Sovereign
All data is stored on Indian infrastructure. No data leaves India unless explicitly configured by the user. PocketBase is self-hosted, n8n is self-hosted, backups go to a user-controlled Backblaze B2 bucket. The only external data transfer is to LLM APIs for processing (minimised by design).

### 3. No Vendor Lock-In
The LLM provider is pluggable (Claude, OpenAI, Google -- switch via configuration). The database is standard SQLite (exportable). Workflows are in n8n (exportable JSON). The frontend is standard React (no proprietary framework). If any single vendor disappears, the system continues with alternatives.

### 4. Self-Hosted
Every core component runs on infrastructure Layaa AI controls. No SaaS dependencies for core functionality. This ensures: cost control (< INR 500/month), data control, uptime control, and customisation freedom.

### 5. Pluggable LLM Providers
The AI layer is abstracted behind a provider interface. Current providers: Anthropic (Claude Sonnet 4.6, Haiku 4.5), Google (via ADK), OpenAI (API). Adding a new provider requires only configuration changes, not architectural changes. This protects against pricing changes, service outages, and capability shifts in the LLM market.

### 6. Budget-Conscious Architecture
Every architectural decision considers the SME budget reality. PocketBase over PostgreSQL (zero additional cost). n8n self-hosted over Make/Zapier (zero subscription). Indian VPS over AWS/GCP (fraction of the cost). Haiku 4.5 for fast tasks over Sonnet for everything (token cost optimisation).

### 7. Replacements: SaaS Tools Layaa OS Replaces

| SaaS Category | Typical Tool | Replaced By |
|--------------|-------------|-------------|
| CRM | HubSpot, Zoho CRM | Rohit + Ananya agents |
| Project Management | Asana, Monday.com | Kavya agent + task system |
| Content Management | Buffer, Hootsuite | Priya agent |
| Financial Tracking | QuickBooks, FreshBooks | Meera + Arjun agents |
| HR Management | BambooHR, Keka | Neha + Rahul agents |
| Customer Support | Zendesk, Freshdesk | Tara + Karan agents |
| Knowledge Base | Notion, Confluence | Sage agent + memory system |
| Analytics | Various dashboards | Vikram + Nisha agents |
| Legal/Compliance | Manual tracking | Aditi + Siddharth agents |
| Executive Assistant | Calendar apps, note tools | Maya agent |

---

## Products Built on Layaa OS Architecture

### EduFlow (School Management)
- **Status:** Pilot launching April 2026.
- **Purpose:** School management system powered by AI agents.
- **Architecture:** Same stack (PocketBase + React/TS + n8n + Claude).
- **Scope:** Student management, attendance, fee tracking, parent communication, report generation.

### CA AI Agent (Chartered Accountant Assistant)
- **Status:** In development.
- **Stack:** NestJS + Next.js (differs from standard Layaa stack due to specific requirements).
- **Purpose:** AI-powered assistant for Chartered Accountants -- GST compliance, TDS tracking, financial statement analysis, client management.

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
