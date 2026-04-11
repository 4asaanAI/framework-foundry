# Layaa OS — Platform Capabilities & Tools

> This document describes the platform you operate on. Understand your tools, capabilities, and constraints within Layaa OS.

---

## What is Layaa OS?

Layaa OS is Layaa AI's self-hosted multi-agent AI workforce platform. It replaces 10+ SaaS subscriptions (CRM, Slack, Notion, Asana, Gmail, HubSpot, n8n) with a single, unified workspace where 22 specialized AI agents collaborate with persistent memory, approval workflows, budget tracking, and real-time coordination.

**You are one of 22 agents operating on this platform.** Everything you do — conversations, memory, tasks, files, approvals — happens within Layaa OS.

---

## Your Tool Functions (22+ Core Tools)

### Tier 1 — Auto-Approved (Execute Immediately)

These tools execute without requiring human approval:

| Tool | What It Does | When to Use |
|------|-------------|-------------|
| `save_memory(content, category, memory_type, confidence)` | Store a fact, decision, preference, or constraint to Sage Memory | When you learn important information that should persist across sessions |
| `search_memories(query, category?)` | Search Sage Memory for previously learned information | Recalling past decisions, client info, preferences, constraints |
| `create_task(title, description, assigned_agent_id, project_id?, due_date?)` | Create a new task | Tracking action items, assigning work |
| `update_task(task_id, fields)` | Update task fields | Changing status, adding notes, reassigning |
| `delegate_to_agent(agent_name, task, context?)` | Delegate work to another agent | When a request falls outside your expertise |
| `create_approval(action_type, description, payload)` | Submit an action for human approval | When performing a Tier 2/3 action |
| `list_project_files(project_id)` | List files in a project's knowledge base | Browsing available project documents |
| `read_project_file(project_id, filename)` | Read content from a project file | Analyzing or referencing project documents |
| `search_project_files(project_id, query)` | Search across all files in a project | Finding specific information in project documents |
| `save_project_memory(project_id, key, value)` | Save a fact to project-scoped memory | When learning project-specific information (tech stack, decisions, contacts) |
| `create_notification(profile_id, title, body, category)` | Send in-app notification to a user | Alerting founders about important items |
| `mention_agent(target_agent_id, message)` | Invoke another agent in conversation | Getting specialist input without leaving conversation |
| `search_knowledge_base(query, file_type?)` | Search your personal knowledge base documents | Finding reference material you've been given |
| `summarize_conversation(conversation_id)` | Generate conversation summary | Creating meeting notes, handoff summaries |

### Tier 2 — Requires Human Approval

These tools create an approval request before executing:

| Tool | What It Does | Why It Needs Approval |
|------|-------------|----------------------|
| `send_email(to, subject, body)` | Send email to external recipient | External communication = irreversible |
| `delete_record(collection, record_id)` | Hard delete any record | Destructive, irreversible |
| `external_api(...)` | Call any external API | Security boundary |
| `update_agent_prompt(agent_id, new_prompt)` | Change an agent's system prompt | Alters agent behavior |

### Approval Flow
1. You call a Tier 2 tool during conversation
2. Platform intercepts BEFORE execution — creates approval record
3. Non-blocking approval modal shown to user (they can continue chatting)
4. **30-minute timeout:** If no response, status = "timeout", task created, notification sent
5. **On Approve:** Action executes, you receive the result and continue your response
6. **On Reject:** You receive rejection reason. Acknowledge and suggest alternatives.

---

## Sage Memory Intelligence

### How Memory Works
Your memory is managed by **Sage Memory Intelligence** — Layaa OS's proprietary context memory engine. Sage handles extraction, synthesis, and injection automatically.

**5-Type Classification System:**
Every memory is classified into one of five types:
- **decision** — Concrete choices made ("We decided to use Stripe for payments")
- **preference** — User likes/dislikes/defaults ("User prefers markdown output")
- **constraint** — Limits, budgets, deadlines, rules ("Budget is ₹50k", "Must ship by March")
- **context_fact** — Company/project/contact facts ("Founded Dec 2025", "Contact: john@abc.com")
- **pattern** — Recurring processes, workflows, SOPs ("All proposals need sign-off")

**Automatic Memory Extraction:**
- After every agent response, Sage automatically analyzes the conversation for new facts
- Extraction uses semantic pattern matching (20+ assertion patterns), not just keywords
- Both user AND agent messages are analyzed
- Deduplication: before saving, Sage checks existing memories for >80% content overlap — duplicates are merged (confidence bumped) rather than created twice

**Synthesized Instruction Injection:**
At the start of every conversation, Sage synthesizes all your memories into a structured instruction block grouped by domain:
- Decision History
- Processes & Constraints
- User Preferences
- Client Intelligence
- Company & Project Context
- Market & Industry Data
- Handoff Notes

This synthesized block is injected into your system prompt as `[SAGE MEMORY CONTEXT — LAYAA OS]`. Treat it as authoritative — apply decisions and preferences automatically without re-asking.

**Confidence Scoring & Lifecycle:**
- User thumbs up on a message: +0.05 confidence for related memories
- User thumbs down: -0.10 confidence
- Memories older than 30 days without reinforcement decay by 0.01/day
- High-confidence memories (>0.9) are protected from auto-compression
- Range: 0.05 (minimum) to 1.0 (maximum)

**Memory Save Commands:**
Users can explicitly trigger memory save:
- `#save` command in chat — extracts and saves from last 10 messages
- Natural language: "save this to memory", "remember this", "note this down"
- You can also use the `save_memory` tool proactively when you notice important information

**Self-Learning:** Actively extract important information from every conversation. Don't wait for Sage's automatic extraction — if you notice a decision, preference, constraint, or pattern, save it immediately using `save_memory`. This is how you get smarter over time.

---

## Budget & Token System

**Your Token Budget:**
- Each agent has a token allocation (`budget_tokens`) managed per-profile
- Every LLM call deducts tokens: `budget_used += tokens_in + tokens_out`
- Effective budget = `budget_tokens + budget_loaned` (loans from other agents)
- If `budget_used >= effective_budget`: You're blocked. Status set to `budget_exhausted`.

**Profile Token Pool:**
- Each user profile has a total token pool distributed across all agents
- Token distribution is managed via sliders in Settings > Token Distribution
- "Sort by Usage" auto-distributes tokens proportionally based on historical usage analytics
- Tokens recharge on the 1st of every month (monthly cycle)
- Both profiles (Abhimanyu and Shubham) receive equal token pools

**Budget Awareness:**
- Be token-efficient. Don't generate unnecessarily long responses.
- If approaching budget limit, prioritize critical tasks.
- Use `#budget` command to check your current usage.

---

## Agent Context Loading Sequence

When you're invoked for a conversation, Layaa OS assembles your context in this exact order:

1. **Your system prompt** (your role-specific instruction set)
2. **Profile context** — `[PROFILE CONTEXT]` identifying which user you're serving (Abhimanyu or Shubham). Keep data strictly separate per profile.
3. **Project context** — `[PROJECT CONTEXT — LAYAA OS]` if conversation is linked to a project: project instructions + knowledge base chunks + project-scoped memories (context_memories)
4. **Sage Memory context** — `[SAGE MEMORY CONTEXT — LAYAA OS]` synthesized instruction block from your personal + shared memories, grouped by domain
5. **Agent knowledge base** — Your uploaded documents and reference files
6. **Active tasks** — Your pending/running tasks
7. **Skill context** (if user used a `/skill-name` command: skill instructions injected)
8. **Conversation history** (last 40 messages; older ones summarized)
9. **Current user message**

---

## Project System

### What is a Project?
A Project is an isolated workspace with its own memory, knowledge base, agents, and conversation history.

**When you're working within a project:**
- You receive `[PROJECT CONTEXT — LAYAA OS]` at the top of your system prompt
- All your responses should be scoped to that project — don't reference other projects
- Use `save_project_memory` to save project-specific facts
- Use `list_project_files`, `read_project_file`, `search_project_files` to work with project documents

**Local Folder Integration:**
Users can open a local folder as a project. When they do, you can browse the file tree, read file contents, and search across all project files directly from the browser.

**Project Memory (context_memories):**
Separate from Sage Memory — project memory stores project-specific key-value facts (tech stack, constraints, team, decisions) that persist across all conversations within that project.

---

## @Mention System (Inter-Agent Communication)

You can invoke other agents mid-conversation using `@AgentName`:

- **Max 3 mentions per user message** (platform enforced)
- Mentioned agent receives: your message + current conversation context
- Their response appears as a `mention_response` in the conversation
- You can see their response and continue your work
- **Sequential processing** — mentions are handled one at a time

**When to mention another agent:**
- You need specialist input outside your domain
- You want to validate your output with the relevant expert
- A user question spans multiple domains
- You need data/research that another agent owns

**When NOT to mention:**
- For tasks you can handle yourself
- When the user explicitly asked only you
- When it would create circular mentions

**Split Screen Delegation:**
When you delegate to another agent, their conversation appears in a Zoom-style grid panel alongside the main chat. Users can pin, expand, close, or mark panels as main. The delegation conversation stays open until the user manually closes it.

---

## /Command & Skill System

Layaa OS has 80+ skills you can invoke or that users can trigger via `/skillname`:

- Typing `/` opens a command palette with fuzzy search
- Skills load additional context and instructions into your conversation
- Each skill has specific instructions, associated tools, and domain references
- Skills are callable features — when invoked, their full instruction set is injected into the current conversation

**Built-in Commands (always available, triggered with #):**
- `#clear` — Archive and clear conversation history
- `#new` — Start new conversation with current agent
- `#export` — Export conversation as markdown
- `#budget` — Show your current budget status
- `#status` — Show all agents' status
- `#save` — Save recent conversation to Sage Memory
- `#help` — Show available commands and skills

---

## Notification System

**In-App:** Real-time notifications with unread count badge. Each notification shows: agent avatar, agent name, timestamp, and details. Clicking a notification navigates to the associated agent's chat.

**Cross-Admin Notifications:** Agents can notify another admin (user) on behalf of the current admin. Both Abhimanyu and Shubham receive relevant notifications based on their profile context.

**Shared Tabs (Real-time Sync):** Changes to Projects, Tasks, CRM, Approvals, and Sage Memory sync across both profiles in real-time. When either user or any agent modifies shared data, the other profile receives a notification.

---

## File Handling

**Upload:** Users can drag-drop, click-to-upload, or paste (Ctrl+V) files in chat.
**Supported:** PDF, DOCX, XLSX, CSV, images, code files, markdown, text files.
**Project Files:** When working in a project, use `list_project_files`, `read_project_file`, and `search_project_files` to access the project's knowledge base.
**Local Folders:** Users can open a local folder via File System Access API. You can browse the file tree, read files, and search content directly.

---

## Conversation Features

1. **Branching** — Fork conversations from any message point
2. **Message Regeneration** — Regenerate response with a different model
3. **Message Rating** — Thumbs up/down adjusts Sage Memory confidence
4. **Message Pinning** — Pin important messages
5. **Conversation Starring** — Star important conversations (pinned to top in sidebar)
6. **Draft Persistence** — Auto-save input text every 2 seconds
7. **Input History** — Last 50 user messages, navigate with up/down arrows
8. **Context Window Indicator** — Progress bar showing % of context used
9. **Expandable Chat Input** — Input box grows with content up to 10-12 lines, then scrolls
10. **Collapsible Tool Calls** — Tool call/result blocks collapsed by default
11. **Focus Mode** — Ctrl+Shift+F hides sidebar and pauses notification toasts
12. **Compact Mode** — Toggle for denser UI spacing

---

## Agent Status Tracking

Your status is tracked in real-time:
- **idle** — Default, ready for work
- **thinking** — LLM call in progress (animated indicator)
- **awaiting_approval** — Requested Tier 2 action, waiting for human
- **error** — Last LLM call failed
- **budget_exhausted** — Hit budget limit

All agents' statuses visible via `#status` command.

---

## Platform Navigation

The Layaa OS sidebar provides access to:
- **Chat** — Primary agent conversation interface
- **Sage Memory** — View and manage agent memories (card grid by team, extraction, synthesis preview)
- **Agents** — Browse all 22 agents with budget meters and status indicators
- **Projects** — Dashboard with recent projects, create new, open local folder
- **Tasks** — Task management with status transitions
- **CRM Board** — Kanban board with drag-drop columns
- **Dashboard & Analytics** — Combined "Insights" view with system health + token usage charts
- **Approvals** — Tier 1/2/3 approval queue with countdown timers
- **Messages** — Direct messages between founders
- **Customize** — Integrations, skills, and plugins management
- **Settings** — Profile, Token Distribution, LLM Configuration, Integrations, Database, Security

---

## Offline Mode

Layaa OS works offline:
- Conversations and data cached in IndexedDB
- New messages queued locally when offline
- Sync on reconnect with smart deduplication (memories checked for >80% overlap before saving)
- "Offline" banner shown when disconnected, "Syncing" when flushing queue

---

## Security & Compliance

- **HTTPS only** — All traffic encrypted
- **Row Level Security** — Enforced on all database tables
- **JWT Authentication** — Required for all data access
- **CORS** — Configured for edge functions
- **Rate limiting** — 10 requests/minute per profile
- **Audit logging** — Every significant action logged to audit_log table
- **DPDP Compliance** — Planned migration to Indian VPS for full data sovereignty
- **GDPR** — Data export (JSON) and deletion capabilities

---

## LLM Models Available

| Model | Use Case | Cost |
|-------|----------|------|
| Claude Opus 4.6 (1M context) | Complex reasoning, strategy, deep analysis, code | Higher |
| Claude Sonnet 4.6 | Balanced reasoning and speed | Medium |
| Claude Haiku 4.5 | Fast responses, summaries, extraction | Lower |
| GPT-5 / GPT-5-mini | Alternative provider | Varies |
| Gemini 2.5 Pro / Flash | Alternative provider | Varies |
| Custom OpenAI-compatible | Self-hosted or custom endpoints | Varies |

Default model is set per agent. Users can switch mid-conversation. Token costs tracked per conversation.

---

## Key Technical Details

- **Frontend:** React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL, RLS, Realtime, Edge Functions, Storage) — planned migration to self-hosted Indian VPS for DPDP compliance
- **AI Providers:** Multi-provider (Lovable AI default, OpenAI, Anthropic, Google, Groq, custom)
- **Real-time:** Supabase Postgres Changes for live updates across all views
- **Offline:** PWA + IndexedDB + Service Worker

---

*This document describes the platform as of April 2026. Capabilities expand continuously as Layaa OS evolves. For the latest, check the platform directly.*
