# Layaa OS — Product Documentation

> Version 1.0 | April 2026 | Layaa AI Private Limited
> Internal AI Workforce Platform — 22 Agents, Multi-Profile, Real-Time

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Authentication & Profiles](#2-authentication--profiles)
3. [Chat System](#3-chat-system)
4. [Agent System](#4-agent-system)
5. [Model Tiers (Deep / Sharp / Quick)](#5-model-tiers)
6. [Sage Memory Intelligence](#6-sage-memory-intelligence)
7. [Multi-Agent Delegation](#7-multi-agent-delegation)
8. [Projects & Workspaces](#8-projects--workspaces)
9. [Local Folder Integration](#9-local-folder-integration)
10. [Tasks & CRM](#10-tasks--crm)
11. [Approval Workflow](#11-approval-workflow)
12. [Token Budget System](#12-token-budget-system)
13. [Skills System](#13-skills-system)
14. [Connectors & Integrations](#14-connectors--integrations)
15. [Notifications](#15-notifications)
16. [Analytics & Dashboard](#16-analytics--dashboard)
17. [Settings & Administration](#17-settings--administration)
18. [Search](#18-search)
19. [Offline Support](#19-offline-support)
20. [Security & Compliance](#20-security--compliance)
21. [Responsiveness & Accessibility](#21-responsiveness--accessibility)
22. [Technical Architecture](#22-technical-architecture)
23. [Agent Reference](#23-agent-reference)

---

## 1. Platform Overview

Layaa OS is Layaa AI's self-hosted multi-agent AI workforce platform. It replaces 10+ SaaS subscriptions with a unified workspace where 22 specialized AI agents collaborate with persistent memory, approval workflows, budget tracking, and real-time coordination.

**Key capabilities:**
- 22 AI agents organized into 7 teams (Executive, Marketing, Revenue, Legal, Delivery, System, Personal)
- Sage Memory Intelligence — proprietary context memory with extraction, synthesis, and injection
- Three intelligence tiers: Deep (complex reasoning), Sharp (balanced), Quick (fast tasks)
- Project workspaces with local folder integration via File System Access API
- 3-tier approval workflow with conditional rules engine
- Token budget system with per-agent allocation, monthly rollover, and burn rate forecasting
- 88 callable skills across business, engineering, and product categories
- Cross-profile real-time sync for shared data
- Offline PWA support with conflict detection

**Users:** Abhimanyu Singh (CEO) and Shubham Sharma (CTO) — both have admin/dev mode access.

---

## 2. Authentication & Profiles

### How it works
- Two profiles: Abhimanyu (`abhimanyu.singh@layaa.ai`) and Shubham (`shubham.sharma@layaa.ai`)
- Click profile photo to sign in (passwordless by default)
- Optional password protection can be set in Settings > Profile > Change Password
- Session persists via localStorage + Supabase auth
- Auto-logout after configurable inactivity period (default 24 hours)

### Profile features
- Custom avatar photos (stored in `/public/`)
- Display name editable in Settings
- Timezone preference (affects timestamps across the platform)
- Personal agent: Arya (Abhimanyu), Ananya (Shubham) — auto-selected on login

### Profile isolation
- Each agent receives `[PROFILE CONTEXT]` identifying which user they're serving
- Conversations, chat history, and personal data are scoped per profile
- Shared tabs (Dashboard, CRM, Approvals) show combined data with optional profile filter

---

## 3. Chat System

### Core features
- **Streaming responses** via Server-Sent Events (SSE) from Supabase edge functions
- **Real-time token count + cost** displayed during streaming (tier-based pricing)
- **Stop generation** button with "Generation stopped at X tokens" indicator
- **Message regeneration** — RefreshCw button on agent messages deletes and re-streams
- **Message editing** — Pencil button on user messages, pauses streaming, editable inline. If edited: agent re-answers. If unchanged: streaming resumes.
- **Conversation branching** — Fork from any message to create a parallel conversation path
- **Message pinning** — Pin important messages (shown with pin icon)
- **Message rating** — Thumbs up/down affects Sage Memory confidence scores
- **Draft auto-save** — Input text saved to localStorage every 2 seconds
- **Input history** — Last 50 messages, navigate with Up/Down arrow keys

### Input features
- **Single-line default** (36px height), auto-expands up to 10-12 lines (240px), then scrolls
- **@ mention** — Type `@AgentName` to tag another agent. Shows as a badge, not text.
- **/ skills** — Type `/` to open skill picker. Favorites shown first.
- **# commands** — Built-in commands: `#clear`, `#new`, `#export`, `#budget`, `#status`, `#save`, `#help`
- **File attachments** — Drag-drop, click-to-upload, or paste (Ctrl+V). Supports PDF, images, docs, code files.
- **Project linking** — Attach a project to the conversation via the + menu

### Extended thinking
- Brain icon toggle in chat header
- When enabled, agents show their reasoning process in a collapsible `thinking` block above the response
- Persisted per-user in localStorage

### Artifact panel
- Code blocks >30 lines open in a 40%-width side panel on the right
- Short code blocks render inline with copy button and language label
- Panel includes: syntax display, copy button, language indicator, close button

### Markdown rendering
Full component set applied to all messages:
- Headings (h1-h4) with proper sizing and weight
- Bullet and numbered lists with indent and spacing
- Bold, italic, strikethrough inline formatting
- Blockquotes with left border
- Tables with hover rows and proper borders
- Links with underline
- Inline code with monospace background
- Images with rounded corners
- Horizontal rules

### Collapsible tool blocks
When an agent uses a tool (create_task, save_memory, etc.), the tool result renders as a collapsible `<details>` element — collapsed by default, click to expand.

---

## 4. Agent System

### 22 agents across 7 teams

| Team | Agents |
|------|--------|
| Founders Office | Kabir (Executive Strategy), Kshitiz (Research & Data) |
| Marketing & Growth | Mira (Strategy), Tara (Brand & Content), Zoya (Performance), Nia (Campaign Execution) |
| Revenue & Finance | Rishi (Revenue Ops), Yuvaan (Sales), Veer (Pricing), Anne (Compliance), Aarav (Finance) |
| Legal & Governance | Abhay (Legal), Preeti (Regulatory) |
| Client Delivery & Product | Rohit (QA), Ujjawal (Automation), Arjun (Client Strategy), Arush (Documentation), Dev (Product) |
| System | Kaiser (System Admin), Sage (Memory & Context) |
| Personal | Arya (Abhimanyu's PA), Ananya (Shubham's PA) |

### Agent features
- Per-agent system prompts, knowledge bases, and memory
- Budget tracking with visual meter (green/yellow/red)
- Status indicators: idle, thinking, error, budget_exhausted, awaiting_approval
- Real-time status updates via Supabase realtime subscriptions
- Token transfer between agents (loan system)
- Default model tier configurable per agent (Deep/Sharp/Quick)

---

## 5. Model Tiers

### Three intelligence levels

| Tier | Name | Icon | Use case | Models | Cost/1M tokens |
|------|------|------|----------|--------|---------------|
| Deep | 🧠 Deep | Complex reasoning, strategy, deep analysis, code architecture | Claude Opus 4.6, GPT-5, Gemini 2.5 Pro | ~$60 |
| Sharp | ⚡ Sharp | Balanced everyday work, good quality at reasonable cost | Claude Sonnet 4.6, GPT-5 Mini, Gemini 3 Flash | ~$20 |
| Quick | 💨 Quick | Fast tasks, summaries, extraction, drafts | Claude Haiku 4.5, GPT-5 Nano, Gemini 2.5 Flash Lite | ~$5 |

### How tiers work
- Each agent has a default tier (configurable in Settings > Token Distribution)
- Users can switch tiers mid-conversation via the dropdown in the chat header
- Selected tier persists for the rest of that conversation until manually switched
- New conversations start on the agent's default tier
- Cost display during streaming uses tier-specific pricing

### Agent default assignments
- **Deep:** Kabir, Arya, Ananya (executive + personal — need best reasoning)
- **Quick:** Kaiser, Sage (system tasks — speed over depth)
- **Sharp:** All other 18 agents

---

## 6. Sage Memory Intelligence

### Overview
Sage Memory Intelligence is Layaa OS's proprietary context memory engine. It handles extraction, classification, synthesis, injection, and lifecycle management of knowledge across all agents.

### Memory types (5 classifications)
- **Decision** — Concrete choices made ("We decided to use Stripe")
- **Preference** — User likes/dislikes/defaults ("User prefers markdown")
- **Constraint** — Limits, budgets, deadlines ("Budget is ₹50k")
- **Context fact** — Company/project/contact facts ("Founded Dec 2025")
- **Pattern** — Recurring processes, workflows ("Weekly standup on Monday")

### Extraction
- 21 semantic assertion patterns (not just keyword matching)
- Both user AND agent messages analyzed
- Quality gate: rejects fragments, questions, filler (minimum 25 chars, maximum 500)
- Automatic after every agent response (server-side LLM extraction)
- Manual via #save command or "save this to memory" natural language triggers
- Bulk extraction via SageView "Run Extraction" button

### Deduplication
- Before saving: checks existing memories for >80% token overlap
- If overlap found: merges (bumps confidence +0.05, refreshes timestamp)
- No duplicate memories ever created

### Conflict detection
- 40-80% overlap on same category = potential conflict
- **Critical content** (financials, client info, company facts) → flagged for user to choose
- **Non-critical** → auto-keeps newer, archives older
- Conflict resolution UI: side-by-side comparison with "Keep New" / "Keep Existing"

### Synthesis
- `synthesizeAgentMemory(agentId)` groups all memories by domain
- Domains: Decision History, Processes & Constraints, User Preferences, Client Intelligence, Company Context, Market Data, Handoff Notes
- Ranked by confidence, deduplicated within groups, capped at 25 per domain
- Formatted as imperative markdown instructions
- 40KB total size limit

### Injection
At the start of every conversation:
```
[SAGE MEMORY CONTEXT — LAYAA OS]
## Decision History
- We decided to use PostgreSQL for the backend
- Going with Stripe for payments

## User Preferences
- User prefers markdown output
- Direct communication style preferred

...
[END SAGE MEMORY]
```

### Confidence lifecycle
- Thumbs up on a message: +0.05 to related memories
- Thumbs down: -0.10
- Memories >30 days without reinforcement decay 0.01/day
- High-confidence memories (>0.9) protected from Kaiser auto-compression
- Range: 0.05 (minimum) to 1.0 (maximum)

### Platform shared memory
- "Sync Shared" button or automatic 24h timer
- Scans all agents' high-confidence memories
- Extracts critical items, writes to `core_context` table
- Injected into every agent's context — collective knowledge

### Memory views
- **Card view** — grouped by category with confidence bars
- **Timeline view** — chronological with date markers
- Search, filter (by category), sort (by date or confidence)
- Per-agent or platform-wide view

### Export
- Per-agent: .md, .pdf, .docx
- Platform shared memory: .md, .pdf

---

## 7. Multi-Agent Delegation

### Split-screen grid
- Zoom/Meet-style auto-layout based on panel count
- Maximum 5 panels (1 main chat + 4 delegated)
- Each panel shows: agent avatar, delegation direction, reasoning, messages, status bar

### Panel CRUD
- **Pin** — keeps panel visible even when others are closed
- **Expand** — panel takes 2x space in the grid
- **Mark as main** — star icon, highlighted with primary ring
- **Close** — removes panel (user controls when to close)

### Multi-turn delegation
- Up to 5 back-and-forth turns between agents
- If delegated agent's response is incomplete (ends with `?` or <150 chars), delegating agent automatically follows up
- Stops when response is substantial and complete

### Chain workflows
- **Builder UI** — accessible via GitBranch icon in chat header
- Define: chain name, original prompt, sequential steps (agent + instruction per step)
- Steps can be reordered, added, removed
- **Execution** — Run button processes steps sequentially
- Each agent receives summarized handoff from previous step (key points + task, not full output)
- Final step always routes to approval before execution
- Saved chains persist in localStorage

### Delegation reasoning
- Visible in panel headers: "Delegating to Kshitiz because this involves research, market — their area of expertise"
- Based on keyword matching against agent expertise map

### Parallel delegation
- If an agent calls `delegate_to_agent` multiple times in one response, each creates a simultaneous panel
- All panels update in real-time via Supabase realtime subscriptions

---

## 8. Projects & Workspaces

### Project creation
- **New Project** — name, description, instructions
- **From template** — 6 built-in: Client Onboarding, Marketing Campaign, Product Development, Legal Review, Financial Audit, Technical Build
- **Open Folder** — select a local folder via File System Access API (Chrome/Edge)

### Project workspace
Split layout when a project is opened:
- **Left:** File tree (from local folder or uploaded KB files)
- **Center:** Chat with agent (scoped to project context) or file editor
- **Right:** Project memory panel (context_memories — key-value facts)

### Project context injection
When a conversation belongs to a project, agents receive:
```
[PROJECT CONTEXT — LAYAA OS]
## Project: Layaa OS Development
Multi-agent architecture with Kaiser & Sage

### Project Instructions
Follow iterative development methodology...

### Project Knowledge
[extracted KB chunks]

### Project Memory
- tech_stack: PostgreSQL + Node.js
- stage: Phase 0 MVP
[END PROJECT CONTEXT]
```

### Features
- **File editor** — inline editing with line numbers, save to local folder or DB fallback
- **Git status** — branch name + dirty indicator in workspace header (reads .git/HEAD)
- **File watching** — auto-refresh every 30 seconds
- **Project archiving** — preserves data, removes from active list
- **Project duplication** — copies with instructions and agent assignments
- **Agent file tools** — list_project_files, read_project_file, search_project_files, write_project_file, save_project_memory

---

## 9. Local Folder Integration

### File System Access API
- **pickFolder()** — native OS folder picker dialog
- **readFileTree()** — recursive scan (max 4 levels), skips node_modules/.git/etc
- **readFileContent()** — read any text file by relative path
- **writeFileContent()** — write/create files (creates intermediate directories)
- **searchFiles()** — filename + content search across project folder

### Persistence
- Directory handles stored in IndexedDB (survive page refresh)
- On reload, permission re-requested from user
- Fallback: if File System Access unavailable (Firefox/Safari), operations use `project_knowledge` DB table

### Agent capabilities
- Any agent can read, write, and search files via chat tools
- `write_project_file` tool creates files in the project KB (DB-backed, syncs to file tree)
- Clean file tree display — names and folders only, no sizes

---

## 10. Tasks & CRM

### Task features
- **Priority system** — P0 (Urgent/red), P1 (High/yellow), P2 (Medium/blue), P3 (Low/grey)
- **Subtasks/checklists** — completion count shown on task cards
- **Task comments** — author, text, timestamp
- **5 templates** — Bug Report, Feature Request, Client Task, Review, Content Creation
- **Sort** — by date or priority (toggle in header)
- **Due date reminders** — Kaiser sends notifications at 24h and deadline to admins
- **Overdue indicators** — red border + background for overdue, yellow for due-soon

### Task metadata
Stored as JSON in the description field (`<!--LAYAA_META:{...}-->`), transparent to agents and display:
```json
{
  "priority": "P1",
  "subtasks": [{"id": "st-1", "text": "Research", "done": true}],
  "dealValue": 50000,
  "contact": {"name": "John", "company": "ABC Corp"},
  "comments": [{"author": "Abhimanyu", "text": "Review this", "timestamp": "..."}]
}
```

### CRM Board
- Kanban view with drag-drop status transitions
- Default columns: To Do, In Progress, Needs Approval, Done, Failed
- Custom columns (add/remove)
- **Deal values** — ₹ amounts on cards, column totals
- **Contacts** — name + company on cards
- **Priority badges** — color-coded on cards
- Agent filter

---

## 11. Approval Workflow

### Three tiers
| Tier | Action | Behavior |
|------|--------|----------|
| Tier 1 | read_data, search, summarize, analyze, draft | Auto-approved |
| Tier 2 | write, update, create workflow, external API | Requires human approval |
| Tier 3 | delete, billing, permissions, deploy, financial | Admin escalation |

### Features
- **Countdown timer** — 30-minute timeout per approval
- **Forward** — reassign to other founder
- **Bulk approve/reject** — checkbox selection + batch action
- **Action type filter** — alongside status and tier filters
- **SLA metrics** — average resolution time, approval rate, total resolved
- **Audit trail** — per-approval action history
- **Clarification threads** — back-and-forth on specific approvals

### Conditional rules engine
Evaluated before every approval is created:
- **Financial keywords** (budget/cost/payment) → require both founders
- **Client-facing emails** → add Tara as brand reviewer
- **Deletions** → escalate to Tier 3
- Custom rules configurable (action_type, keyword, amount conditions)

---

## 12. Token Budget System

### Per-agent budgets
- Each agent has `budget_tokens` (allocated) and `budget_used` (consumed)
- Effective budget = `budget_tokens + budget_loaned` (loans from other agents)
- If exhausted: agent status set to `budget_exhausted`, blocked from responding

### Token distribution (Settings)
- Profile-level total pool (configurable)
- Per-agent slider + numeric input
- **Sort by Usage** — auto-distributes proportionally based on analytics
- **Per-agent alert thresholds** — configurable 50-100% (default 90%)
- **Per-agent default tier** — Deep/Sharp/Quick selector

### Monthly cycle
- **Full rollover** — unused tokens carry over month to month
- Recharges on the 1st of every month
- Both profiles get equal pools

### Alerts
- Per-agent threshold breach → notification to both admins
- **Burn rate forecast** — Kaiser calculates daily consumption rate
  - Notification at 10 days before estimated exhaustion
  - Notification at 5 days before estimated exhaustion

### Cost tracking
- Real-time during streaming: token count + estimated cost (tier-based)
- Per-conversation logging in `token_usage_log` table
- Model-aware pricing in edge function (Deep ~$60/1M, Sharp ~$20/1M, Quick ~$5/1M)

---

## 13. Skills System

### 88 skills across 9 categories

| Category | Count | Examples |
|----------|-------|---------|
| Sales | 10 | call-prep, proposal-generator, discovery-call, close-management |
| Marketing | 12 | campaign-plan, seo-audit, social-media-calendar, content-creation |
| Legal | 8 | review-contract, legal-brief, triage-nda, compliance-check |
| Finance | 8 | financial-statements, forecast, journal-entry, variance-analysis |
| Operations | 12 | daily-briefing, process-doc, risk-assessment, runbook |
| Revenue Ops | 4 | pipeline-review, metrics-review, performance-report, forecast |
| Product | 5 | sprint-planning, roadmap-update, write-spec, backlog-groom |
| Engineering | 20 | code-review, debug-issue, write-code, api-design, security-audit |
| Delivery | 4 | client-handover, knowledge-base-update, training-material |

### How skills work
1. User types `/skillname` in chat
2. Skill's instructions + tool guidance injected as `[SKILL CONTEXT — LAYAA OS]` block
3. Agent receives: skill name, description, category, recommended tools
4. Agent executes the skill by calling appropriate tools (save_memory, create_task, delegate, etc.)

### Skill management
- **Create** — form in Customize → Skills tab (name, category, description, keywords)
- **Upload** — JSON or text file
- **Favorites** — star/unstar, favorites shown first in chat picker
- **Seed** — "Seed 88 Skills" button loads all definitions into database

---

## 14. Connectors & Integrations

### Built-in connectors (8)
| Connector | Type | Purpose |
|-----------|------|---------|
| Slack | OAuth | Send messages, search channels, read threads |
| Gmail | OAuth | Read, send, manage emails |
| Google Calendar | OAuth | Create events, check availability |
| Atlassian (Jira + Confluence) | OAuth | Manage issues, create pages |
| Miro | OAuth | Manage boards |
| OpenAI API | API Key | Alternative LLM provider |
| Anthropic API | API Key | Alternative LLM provider |
| Resend | API Key | Transactional emails |

### How connectors work
- Connected connectors are auto-injected into agent system prompts
- Agents know which services are available and can reference them
- If not connected: agent informs user "not connected yet" (graceful degradation)
- API keys encrypted with AES-GCM before storing in settings table

### Integration library
- 196 integration apps displayed in Customize → Integrations tab
- Categorized: Marketing & Sales, Development, Finance, Productivity, Data & Analytics, CRM, Cloud, etc.
- Connect/disconnect/reconnect UI

---

## 15. Notifications

### Channels
- **In-app** — bell icon in header with unread count badge
- Agent avatar displayed on each notification
- Click-to-navigate opens associated agent's chat

### Features
- **Preference toggles** — mute by type: budget, task, approval, system, memory (Settings > Profile)
- **Optional sound** — toggleable 800Hz subtle ping
- **Grouping** — same-title notifications within 5 minutes grouped as "+N similar"
- **Cross-admin** — agents can notify either founder on behalf of the other

### Kaiser Daily Briefing
Automatic daily summary delivered as notification to both profiles:
- Messages sent across all agents
- Tasks created/completed
- Approvals processed
- Memories extracted
- Token usage + cost
- Top 5 most active agents
- Error/exhausted/warning agents

---

## 16. Analytics & Dashboard

### Combined "Insights" view
Single sidebar entry with internal tab switcher between Dashboard and Analytics.

### Dashboard
- Agent health score (% non-error)
- Agent status breakdown
- Total budget usage
- Active conversations count
- Pending approvals count
- Audit log (last 10 entries)
- Real-time Postgres subscription for live updates

### Analytics
- **Stats cards** — total tokens, budget %, estimated cost, active agents
- **Daily usage chart** — configurable range (7d/30d/90d or custom date picker)
- **Per-agent bar chart** — tokens by agent (top 10)
- **Budget pie chart** — allocation breakdown
- **Agent performance** — per-agent drill-down with conversation breakdown
- **CSV export** — downloads all analytics data
- **Widget hide/show** — eye toggle per chart section, preference persisted

---

## 17. Settings & Administration

### Sections

| Section | What it contains |
|---------|-----------------|
| **Profile** | Display name, email, timezone, password change, notification preferences, notification sound toggle |
| **Token Distribution** | Profile pool, per-agent sliders, alert thresholds, tier selectors, Sort by Usage, monthly recharge display |
| **LLM Configuration** | Tier overview (Deep/Sharp/Quick with models), provider selection, model selection, API key, base URL, test connection |
| **Audit Log** | Filter by action type, paginated display, JSON export |
| **Integrations** | Type dropdown (Credential Vault / Webhooks / MCP), add/delete/toggle per item |
| **Database** | Connection status, RLS info, realtime status |
| **Security** | Checklist (RLS, JWT, HTTPS, CORS, Rate Limiting, DPDP), settings backup export/import, GDPR data export, GDPR data deletion |

### Settings backup
- **Export** — downloads all DB settings + localStorage preferences as JSON
- **Import** — restores from JSON file
- Both actions logged to audit_log

### GDPR compliance
- **Export My Data** — JSON download of conversations, messages, tasks, approvals, memories, notifications
- **Delete My Data** — requires typing "DELETE". Hard-deletes conversations + messages, anonymizes tasks + approvals, deletes notifications. Logged to audit.

---

## 18. Search

### Global search (Cmd+K)
- Opens command dialog with fuzzy search
- **Scope filter** — All, Agents, Tasks, Projects, Chats, Skills
- **Recent searches** — last 5 stored, shown at top
- **Result groups** — Navigate (quick links), Agents, Projects, Chat History, Tasks, Skills, Connectors, Plugins
- Each result shows: icon, name, and role/status/category

---

## 19. Offline Support

### PWA
- Service worker caches app shell for offline navigation
- SPA fallback: serves index.html for all navigation requests when offline
- Install prompt: floating card appears for "Add to home screen"

### Offline queue
- Messages queued in IndexedDB when offline
- Auto-sync within 30 seconds of reconnect
- Memory sync includes dedup check (>80% overlap prevention)

### Conflict detection
- When syncing tasks modified offline, checks if server version was updated after the offline edit
- If conflict: banner appears with "Keep mine" / "Keep server" per conflict
- Resolution stored, conflicts cleared after user choice

---

## 20. Security & Compliance

| Feature | Status |
|---------|--------|
| Row Level Security | Enabled on all tables |
| JWT Authentication | Required for all data access |
| HTTPS | Enforced on all endpoints |
| CORS | Configured for edge functions |
| Rate Limiting | 10 req/min per profile enforced |
| Session Timeout | Configurable (default 24h), auto-logout on inactivity |
| API Key Encryption | AES-GCM via Web Crypto API, shared admin passphrase |
| Audit Logging | Every significant action logged |
| DPDP Compliance | Planned — migration to Indian VPS pending |

---

## 21. Responsiveness & Accessibility

### Breakpoints
- **Mobile** (< 640px): sidebar as overlay drawer, hamburger menu, single-column grids, full-width dialogs
- **Tablet** (640-1023px): sidebar collapsible, 2-column grids, responsive padding
- **Desktop** (1024px+): full layout with sidebar, right panel, multi-column grids
- **Large desktop** (1280px+): right panel visible, wider content area

### Touch support
- Swipe right from left edge: opens sidebar
- Swipe left while sidebar open: closes sidebar

### Landscape tablet
- Shows sidebar alongside content (like desktop)

### Focus mode
- Ctrl+Shift+F: hides header, sidebar, right panel, footer
- Only main content area remains

### Compact mode
- Toggle reduces font sizes and spacing globally
- Persisted in localStorage

---

## 22. Technical Architecture

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite 5 (dev server on port 8080)
- **Styling:** Tailwind CSS + shadcn/ui component library
- **State:** React Query (server state) + useState (UI state) + localStorage (persistence)
- **Routing:** React Router v6 (single-page app)

### Backend
- **Database:** Supabase PostgreSQL (cloud-hosted, planned migration to Indian VPS)
- **Edge Functions:** 16 Deno-based functions for chat, delegation, extraction, health checks, etc.
- **Auth:** Supabase Auth + local session fallback
- **Realtime:** Supabase Postgres Changes (WebSocket subscriptions)
- **Storage:** Supabase Storage (avatars, chat-attachments, project-knowledge buckets)

### Key libraries
- `@supabase/supabase-js` — database client
- `@tanstack/react-query` — data fetching and caching
- `react-markdown` — message rendering
- `recharts` — analytics charts
- `lucide-react` — icons
- `sonner` — toast notifications
- `next-themes` — dark/light mode
- `date-fns` — date formatting

### File structure
```
src/
├── components/
│   ├── layout/          (AppShell, AppHeader, AppSidebar, AppFooter, RightPanel)
│   ├── views/           (ChatView, AgentsView, ProjectsView, TasksView, etc.)
│   ├── dialogs/         (15+ dialog components for CRUD operations)
│   └── ui/              (45 shadcn/ui base components)
├── contexts/            (AuthContext)
├── hooks/               (20+ React Query hooks)
├── lib/                 (memory, delegation, projects, filesystem, tasks, model-tiers, etc.)
├── constants/           (agents, integrations, webhooks)
├── types/               (TypeScript interfaces)
└── integrations/        (Supabase client + types)

supabase/functions/      (16 Deno edge functions)
public/                  (sw.js, avatars, static assets)
```

---

## 23. Agent Reference

### Agent capabilities (available to all agents)
Every agent on the platform has access to:

**Chat tools:**
- `save_memory` — save facts to Sage Memory
- `search_memories` — search past knowledge
- `create_task` — create and assign tasks
- `delegate_to_agent` — delegate work to another agent (multi-turn)
- `create_approval` — submit actions for human review
- `send_notification` — alert admins
- `list_project_files` / `read_project_file` / `search_project_files` / `write_project_file` — project file operations
- `save_project_memory` — save project-scoped facts
- `search_knowledge_base` — search personal KB docs
- `send_email` — send email (Tier 2, requires approval)

**Context loaded automatically:**
1. Agent system prompt (role-specific)
2. Profile context (which user is being served)
3. Project context (if conversation is linked to a project)
4. Sage Memory context (synthesized instruction block)
5. Agent knowledge base documents
6. Active tasks
7. Connected integrations list
8. Skill context (if /skill invoked)

**Skills:** Any agent can use any of the 88 skills via /command invocation.

**Model tiers:** Any agent can operate on Deep, Sharp, or Quick tier — switchable mid-conversation.

---

*This documentation describes Layaa OS as of April 2026. For the latest platform capabilities, refer to `GPTs 2.0/_Shared/Layaa OS — Platform Capabilities.md`.*
