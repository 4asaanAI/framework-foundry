# Layaa OS — Platform-Level Agent Capabilities (Backend Implementation Spec)

> **Purpose:** This document lists ONLY the functionalities that must be hard-coded into the Layaa OS platform backend. These are the tools, systems, and infrastructure that agents call or depend on to function. It does NOT include anything that lives in agent prompts, knowledge bases, or memory content — those are loaded from `/seed/` files at runtime.
>
> **For the builder:** Every capability below must exist as a callable function, API endpoint, database operation, or system process. If it's not built into the platform, no agent can use it — regardless of what their prompt says.

---

## 1. AGENT TOOL FUNCTIONS (callable by agents during conversations)

These are the actual tools that the LLM can invoke via tool_use/function_calling. Each tool maps to a real backend operation. The platform must register these tools and execute them when an agent calls them.

### 1.1 Data Tools
- **`read_data(collection, filter, sort, limit)`** — Read records from any PocketBase collection. Returns filtered results. Used by agents to look up clients, tasks, projects, memories, etc.
- **`search_data(query, collections[])`** — Semantic + keyword search across multiple PocketBase collections. Used for cross-module queries like "find everything about client X."

### 1.2 Memory Tools
- **`write_memory(agent_id, memory_type, category, content, confidence)`** — Write a new memory entry to the `agent_memory` table. `memory_type` is either "personal" or "shared". `category` is one of: "client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff". Confidence is 0–1.
- **`read_memory(agent_id, topic, limit)`** — Retrieve relevant memories for an agent on a given topic. Uses the relevance scoring algorithm (see Section 5). Returns ranked memories.
- **`update_core_context(context_key, content)`** — Update a company-wide context document in `core_context` table. Used when agents update shared knowledge.
- **`pass_context(from_agent_id, to_agent_id, context_summary)`** — Write a conversation_handoff memory so one agent can pass context to another for continuity.

### 1.3 Task Tools
- **`create_task(title, description, assigned_agent_id, project_id?, due_date?, requires_approval?)`** — Create a new task in the `tasks` table with status "pending".
- **`update_task(task_id, fields_to_update)`** — Update task status, description, result, etc.
- **`complete_task(task_id, result)`** — Mark task as "completed" and store the result text.
- **`list_tasks(filter?, assigned_agent_id?, status?, project_id?)`** — Query tasks with filters.

### 1.4 Communication Tools
- **`send_email_alert(to_email, subject, body)`** — Send an email via Resend API through n8n webhook. **This is a Tier 2 action — requires human approval before execution.**
- **`create_notification(profile_id, title, body, category, source_agent_id?, action_url?)`** — Create an in-app notification in the `notifications` table. Category is one of: "budget", "health", "task", "approval", "system".
- **`mention_agent(target_agent_id, message, conversation_id)`** — Invoke another agent within the current conversation. The platform must: (a) send the message + conversation context to the target agent's LLM call, (b) return the response as a `mention_response` role message, (c) limit to max 3 mentions per user message, processed sequentially.

### 1.5 File Tools
- **`request_file_save(filename, content, directory?)`** — Request to save a file to the local filesystem via File System Access API. **Tier 2 action — requires approval.**
- **`read_file(filename, directory?)`** — Read a file's content from the filesystem. Tier 1 (auto-approved).
- **`upload_to_project_kb(project_id, filename, content, file_type)`** — Upload content to a project's knowledge base. Triggers chunking automatically (see Section 6).

### 1.6 Agent Management Tools
- **`update_agent_prompt(agent_id, new_prompt)`** — Update another agent's system prompt. Stores previous version in `prompt_history` JSON array, increments `prompt_version`. **Tier 2 action — requires approval.**
- **`create_new_agent(name, canonical_role, team, system_prompt, default_model, budget_tokens)`** — Create a new agent record in the `agents` table. **Tier 2 action — requires approval.**

### 1.7 Workflow Tools
- **`request_workflow_create(workflow_name, workflow_description, trigger_type, steps[])`** — Request creation of an n8n workflow. **Tier 2 action — requires approval.** After approval, the platform sends the workflow definition to n8n via its API.

### 1.8 Draft Tools
- **`create_draft(title, content, draft_type)`** — Save a draft (email draft, document draft, post draft) that the user can review later. Tier 1 (auto-approved). Stored in a drafts area accessible from the UI.

### 1.9 Conversation Tools
- **`summarize_conversation(conversation_id)`** — Call a cheap LLM (Haiku) to generate a summary of a conversation. Return the summary text.
- **`extract_tasks_from_conversation(conversation_id)`** — Call Haiku to extract actionable tasks from conversation messages. Return structured task list for bulk creation.

---

## 2. APPROVAL GATE SYSTEM

Every tool call from an agent is classified into a tier. The platform must intercept tool calls, check the tier, and either auto-execute or queue for human approval.

### 2.1 Tier Classification (hard-coded mapping)

```
TIER 1 — Auto-approved (execute immediately, no human needed):
  read_data
  write_memory
  read_memory
  update_core_context
  pass_context
  create_draft
  create_task (status = "pending")
  update_task
  complete_task
  list_tasks
  read_file
  create_notification
  summarize_conversation
  extract_tasks_from_conversation
  search_data

TIER 2 — Requires human approval before execution:
  send_email_alert
  request_file_save
  request_workflow_create
  update_agent_prompt
  create_new_agent
  mention_agent (when target agent will perform a Tier 2 action)
  upload_to_project_kb
  delete_record (any hard delete from any table)
  external_api (any call to an external API not in the standard stack)
```

### 2.2 Approval Flow (must be built into the platform)

1. Agent calls a Tier 2 tool during a conversation.
2. Platform intercepts the call BEFORE execution.
3. Platform creates a record in `approval_queue` table with:
   - `requesting_agent_id` — which agent made the call
   - `action_type` — mapped from the tool name using TOOL_ACTION_MAP
   - `action_description` — plain English description (generated by the agent)
   - `action_payload` — the actual parameters/data to execute
   - `requested_by_profile` — which user's conversation triggered this
   - `status` — "pending"
   - `conversation_id` — the current conversation
   - `original_messages` — snapshot of the conversation messages up to this point
4. Platform shows a **non-blocking approval modal/toast** in the UI. User can continue chatting while the approval is pending.
5. Platform starts a **30-minute timeout timer**. If no response:
   - Set status to "timeout"
   - Save the action as a task with status "awaiting_approval"
   - Send email notification + in-app notification
6. On **approve**: execute the action, then **resume the conversation** — re-invoke the agent with the original messages + a system message: "The tool you requested has been executed. Result: {result}. Continue your response." Stream the agent's continuation.
7. On **reject**: update status to "rejected", notify the agent in the conversation that the action was rejected with the reason.

### 2.3 Trusted Recurring Tasks

Tasks with `is_trusted_recurring = true` skip the approval gate after their first manual approval. The platform must check this flag before routing to the approval queue.

---

## 3. BUDGET SYSTEM

Every LLM call consumes tokens. The platform must track, enforce, and manage token budgets.

### 3.1 Per-Agent Budget
- Each agent has `budget_tokens` (total allocated), `budget_used` (consumed this period), and `budget_loaned` (net tokens received/given via transfers).
- **Effective budget = budget_tokens + budget_loaned.**
- Before every LLM call, check: if `budget_used >= effective budget`, block the call. Set agent `status` to "budget_exhausted". Show budget exhaustion banner in UI with two options: (a) transfer tokens from another agent, (b) increase this agent's allocation.

### 3.2 Atomic Budget Updates
- After every LLM response, update budget using PocketBase atomic increment:
  ```
  pb.collection("agents").update(agentId, { "budget_used+": tokens_in + tokens_out })
  ```
- This prevents race conditions from concurrent requests.

### 3.3 Loan-Based Transfers
- Transfer tokens between agents by adjusting `budget_loaned` on both agents (positive for recipient, negative for donor).
- Loans reset to 0 at the end of each budget period (monthly).

### 3.4 System Budget Pool
- Stored in `settings` table: `system_budget_total` (default 500,000 tokens) and `system_budget_used`.
- Memory extraction operations (Sage) and Kaiser cron jobs draw from this pool, NOT from individual agent budgets.
- Dashboard must show system budget alongside per-agent budgets.

### 3.5 Budget Period Reset
- `budget_period_start` on each agent tracks when the current period began.
- Kaiser cron resets `budget_used` to 0 and `budget_loaned` to 0 at the start of each new period.
- Effective used tokens = only tokens consumed AFTER `budget_period_start`.

---

## 4. AGENT CONTEXT LOADING SEQUENCE

When a conversation starts or a message is sent, the platform must assemble the full context for the LLM call in this exact order:

```
1. Agent's system prompt        (from agents.system_prompt — seeded from /seed/prompts/)
2. Core context documents       (from core_context where agent_id = this agent OR agent_id = null)
3. Personal memories            (from agent_memory where agent_id = this, memory_type = "personal", ranked by relevance)
4. Shared memories              (from agent_memory where memory_type = "shared", ranked by relevance)
5. Project context              (if conversation has project_id: project instructions + top 5 relevant KB chunks)
6. Skill context                (if user used a / command: the skill's content + plugin context + referenced files)
7. Conversation history         (sliding window of last 40 messages from this conversation)
8. Current user message
```

This assembly is a platform function — agents don't build their own context. The platform does it for them before every LLM call.

### 4.1 Conversation History Truncation
- Keep a sliding window of the most recent 40 messages.
- When messages exceed 40: compress older messages by moving their content to `message_archives` table and replacing the message content with "[Archived — {date}]".
- Never delete messages — always archive.

### 4.2 Project KB Retrieval
- When a conversation is linked to a project:
  - Extract keywords from the user's current message.
  - Match keywords against `project_kb_chunks.keywords` (JSON array).
  - Inject the top 5 most relevant chunks into context.
- Chunking happens on upload: split project KB content into ~2000-token chunks (~8000 chars) with 200-char overlap. Extract top 10 keywords per chunk and store in `project_kb_chunks.keywords`.

---

## 5. MEMORY SYSTEM (Sage — Background Service)

Sage is NOT a chatbot. It is a background service that runs automatically. The platform must trigger Sage at the right times.

### 5.1 Automatic Memory Extraction
- **Trigger:** When a conversation goes inactive for 5 minutes (no new messages).
- **Minimum threshold:** Only extract if conversation has ≥ 4 messages AND total text content ≥ 200 characters.
- **Process:** Call a cheap LLM (Haiku/Gemini Flash) with the conversation content. Prompt it to extract key facts, decisions, preferences, and client info as structured entries.
- **Storage:** Write extracted facts to `agent_memory` table with appropriate category, confidence (default 0.7), and source_conversation_id.
- **Budget:** Memory extraction costs are charged to the system budget pool, not the agent's budget.

### 5.2 Relevance Scoring Algorithm (for read_memory)
When retrieving memories for an agent on a topic:
```
For each memory entry:
  1. Split the query into words.
  2. Split the memory content into words.
  3. matched_words = count of query words found in memory content
  4. word_score = matched_words / total_query_words
  5. IDF_weight = apply inverse document frequency weighting (rarer words score higher)
  6. recency_score = 1 / (1 + days_since_created) — more recent = higher
  7. category_bonus = 0.2 if category matches expected category for this query type
  8. confidence_factor = memory.confidence (0–1)
  9. compression_penalty = 0.5 if is_compressed = true (compressed memories are less reliable)
  
  FINAL SCORE = (word_score * IDF_weight) + (recency_score * 0.3) + (category_bonus * 0.2) + (confidence_factor * 0.1)
  
  If is_compressed: FINAL SCORE *= 0.5

Return top N memories sorted by FINAL SCORE descending.
```

### 5.3 Dynamic Confidence Scoring
- When a user gives **thumbs up** (rating = 1) to a message: increase confidence by +0.05 for all memories that were injected into that conversation's context. Clamp at max 1.0.
- When a user gives **thumbs down** (rating = -1): decrease confidence by -0.1 for those memories. Clamp at min 0.1.

### 5.4 Memory Compression
- When agent_memory exceeds a threshold count per agent (e.g., 200 entries):
  - Group old memories by category.
  - Call cheap LLM to summarize groups into compressed entries.
  - Mark originals with `is_compressed = true`, store combined content in a new compressed entry with `original_entries` JSON pointing to the source IDs.
  - Never delete originals — they remain retrievable.

---

## 6. @MENTION SYSTEM (Inter-Agent Communication)

When a user types `@AgentName` in a message:

1. Platform detects the mention pattern.
2. Platform shows a mention picker dropdown (agents grouped by team).
3. On send, platform processes mentions sequentially (max 3 per message).
4. For each mentioned agent:
   - Build that agent's context (Section 4 loading sequence).
   - Include the mentioning message as the user message.
   - Call the mentioned agent's LLM.
   - Insert the response as a `mention_response` role message in the conversation with `mention_agent_id` set.
5. After all mention responses are received, the original conversation agent can see them and continue.

**Hard limit: Maximum 3 @mentions per user message.** Platform must enforce this. If more than 3 are detected, show an error and ask the user to reduce.

---

## 7. /COMMAND SYSTEM (Skill Routing)

When a user types `/` in the input:

1. Platform shows a command palette with all skills from the `skills` PocketBase table (60 skills + built-in commands).
2. Skills are filtered by typing (fuzzy match on name + trigger_keywords).
3. On selection, the platform:
   - Loads the skill's `content` (the full SKILL.md markdown).
   - Loads the skill's `plugin` context if specified (from `plugins` table).
   - Loads all `references` listed in the skill's `references` JSON array (from `references` table).
   - Injects all of this into the agent's context for this message (inserted at position 6 in the loading sequence).
4. The agent then responds using the skill context.

### 7.1 Built-in Commands (hard-coded, not from skills table)
These are platform-level commands that execute directly without going through an agent:

```
/clear          — Clear current conversation history (archive, don't delete)
/new            — Start a new conversation with the current agent
/switch [agent] — Switch to a different agent in the current conversation
/export         — Export current conversation as markdown or HTML
/budget         — Show current agent's budget status
/status         — Show all agents' status (idle/thinking/error/etc.)
/help           — Show available commands
```

---

## 8. LLM PROXY SYSTEM (via n8n)

All LLM API calls go through n8n webhooks on the VPS. The browser NEVER makes direct calls to Claude/OpenAI/Google APIs.

### 8.1 Request Flow
```
Browser → POST https://os.layaa.ai/n8n/webhook/llm-call (or /llm-stream)
  Headers: { "X-API-Key": "<n8n_webhook_key>", "Content-Type": "application/json" }
  Body: { provider, model, messages[], tools[]?, temperature?, max_tokens? }

n8n workflow:
  1. Validate X-API-Key header against key in PB settings → 401 if mismatch
  2. Rate limit check (see 8.3) → 429 if exceeded
  3. Read + decrypt LLM API key from PB settings (AES-256, master key in n8n env)
  4. Route to correct provider (Anthropic / OpenAI / Google) based on `provider` field
  5. Make API call
  6. Normalize response to common format: { content, tokens_in, tokens_out, model, provider, cost_usd }
  7. Return to browser
```

### 8.2 Streaming
- `/llm-stream` endpoint returns Server-Sent Events (SSE).
- Client reads the stream and renders tokens as they arrive.
- **Streaming fallback:** If SSE fails (network error, timeout), automatically retry as a non-streaming `/llm-call` request and return the full response at once.

### 8.3 Rate Limiting
- 10 requests per minute per user profile.
- Stored in PB settings as JSON: `rate_limit_{profile_id}` = `{ count: number, window_start: ISO_string }`.
- If `window_start` is > 60 seconds ago: reset count to 1, update window_start.
- If count ≥ 10 within window: return HTTP 429 with `Retry-After` header.
- Client-side: on 429, show toast "Rate limited — wait Ns", auto-retry after delay.

### 8.4 Credential Redaction
- Before sending any message content to the LLM, the platform must run regex-based redaction to catch and replace any accidentally included API keys, passwords, tokens, or secrets with "[REDACTED]".
- Patterns to catch: API key formats (sk-*, key-*, AKIA*, etc.), URLs with embedded credentials, anything matching common secret patterns.

### 8.5 Multi-Provider Support
- The platform must support 3 LLM providers: Anthropic (Claude), OpenAI, Google (Gemini).
- Each agent has a `default_model` and `llm_provider` field.
- Users can switch models mid-conversation via a model selector dropdown.
- Provider configuration (models, pricing per 1M tokens) stored in `llm_providers` table.
- Cost calculation uses cached pricing from this table (refreshed daily).

---

## 9. NOTIFICATION SYSTEM

### 9.1 In-App Notifications
- Real-time via PocketBase realtime subscriptions on the `notifications` collection.
- UI: notification bell icon in header with unread count badge.
- Click to see notification list, click individual to navigate to `action_url`.

### 9.2 Email Notifications
- Sent via Resend API through n8n webhook (`/webhook/send-email`).
- Triggered for: approval timeouts, budget warnings, daily briefings, failed write abandonment, system health alerts.
- On email send failure: write to `failed_writes` table for retry.

---

## 10. KAISER — SYSTEM ADMINISTRATOR AGENT (Cron Jobs)

Kaiser is a special agent with system-level tools. The platform must implement these as scheduled n8n cron workflows that Kaiser triggers:

### 10.1 Hourly Health Check
- Check database size vs capacity → log to `db_health_log`
- Trigger memory compression if DB occupancy > 70%
- Retry failed writes (from `failed_writes` table, max 5 retries per record)
- Send budget warning notifications if any agent is > 80% budget consumed

### 10.2 Daily Briefing (8am IST)
- Summarize previous day's activity: conversations held, tasks completed, tasks created, approvals processed, budget consumed
- Generate briefing via cheap LLM call
- Deliver as in-app notification + email to both founders

### 10.3 Monthly Budget Reset
- Set `budget_used = 0` and `budget_loaned = 0` for all agents
- Update `budget_period_start` to now
- Reset `system_budget_used = 0`
- Log to audit_log

### 10.4 Daily Backup (3am IST)
- Copy PocketBase data directory
- Upload to Backblaze B2 via rclone
- Delete local backups older than 7 days
- Verify upload succeeded
- On failure: send email alert

### 10.5 Task Reminders
- Check for tasks past `due_date` with status still "pending" or "running"
- Send notification to assigned agent's conversation and to the user

---

## 11. AGENT STATUS TRACKING

The platform must maintain real-time status for each agent and update it automatically:

```
"idle"              — Default state, no active request
"thinking"          — LLM call in progress (set BEFORE calling LLM, clear AFTER response)
"awaiting_approval" — Agent requested a Tier 2 action, waiting for human
"error"             — Last LLM call failed
"budget_exhausted"  — Agent has hit budget limit
```

Status updates must use PocketBase realtime so the UI reflects changes instantly (e.g., agent avatar shows a spinner when "thinking").

---

## 12. OFFLINE / PWA SYSTEM

### 12.1 Service Worker + IndexedDB
- Cache all conversations, messages, and agent data in IndexedDB via Service Worker.
- When offline: user can read all cached conversations and compose new messages.

### 12.2 Write Queue
- New messages, memory writes, task creations done offline are stored in a local write queue.
- When connection returns: flush the queue to PocketBase in order.
- Show "offline" banner in UI when disconnected.
- Show "syncing" indicator when flushing queued writes.

### 12.3 Failed Write Retry
- If a write fails (even when online), store in `failed_writes` table.
- Kaiser's hourly health check retries these (max 5 attempts).
- After 5 failures: abandon and send notification.

---

## 13. AUDIT LOGGING

Every significant platform action must be logged to the `audit_log` table:

```
Actions to log:
  - approval_granted / approval_rejected / approval_timeout
  - prompt_updated (with before/after versions)
  - budget_transfer
  - agent_created / agent_deactivated
  - file_write
  - workflow_created
  - email_sent
  - memory_compressed
  - gdpr_export / gdpr_delete
  - backup_completed / backup_failed
  - budget_reset
```

Each log entry has: `action`, `actor` (user or agent name), `target` (what was acted on), `details` (JSON payload with specifics), `created` (timestamp).

---

## 14. CONVERSATION FEATURES (Platform-Level)

These are UI/backend features that affect how conversations work, independent of any agent's prompt:

### 14.1 Conversation Branching
- Any message can be a branch point. User can fork a conversation from any message.
- `branch_id` (default "main") and `parent_message_id` track the tree.
- UI shows a branch selector to switch between branches.

### 14.2 Message Regeneration
- User can regenerate any agent response with a different model.
- Previous versions stored in `messages.versions` JSON array.
- Regenerate button + model selector dropdown.

### 14.3 Message Rating
- Thumbs up / thumbs down on any agent message.
- Stored in `messages.rating` (1 or -1).
- Triggers dynamic confidence adjustment in memory system (Section 5.3).

### 14.4 Message Pinning
- Toggle `is_pinned` on any message.
- Pinned messages appear in a dedicated sidebar section for quick reference.

### 14.5 Conversation Starring
- Toggle `is_starred` on conversations.
- Starred conversations appear in a filtered view in the sidebar.

### 14.6 Draft Persistence
- Auto-save the user's current input text to localStorage every 2 seconds.
- Restore on page reload or conversation switch.

### 14.7 Input History
- Store last 50 user messages in localStorage.
- Up/down arrow keys cycle through previous inputs (like terminal history).

### 14.8 Context Window Usage Indicator
- Progress bar in the chat header showing how much of the model's context window is currently used by the assembled context (Section 4).
- Visual warning when approaching 80% capacity.

### 14.9 Collapsible Tool Call Blocks
- When an agent response contains tool calls or reasoning blocks, render them in collapsible `<details>` elements.
- Collapsed by default, expandable on click.

### 14.10 Shareable Conversation Snapshots
- Generate a self-contained HTML file of the conversation.
- Download as a single file that can be opened in any browser.

### 14.11 Conversation-to-Task Extraction
- "Extract Tasks" button on any conversation.
- Calls Haiku to identify actionable items.
- Shows extracted tasks in a modal for review.
- User selects which to create → bulk insert into `tasks` table.

### 14.12 Annotations / Comments
- Any message can have annotations/comments from users.
- Stored in `message_annotations` table.
- Shown via a comment icon on the message.

---

## 15. FILE HANDLING

### 15.1 Upload
- Drag-and-drop + click-to-upload in the chat input area.
- Paste-to-upload (Ctrl+V image from clipboard).
- Supported extraction: PDF (via PDF.js), DOCX, XLSX, images (OCR if needed), code files (plain text).
- Extracted text is included in the message context sent to the LLM.
- Images resized before upload: max 1024px on longest side, compressed to < 1MB.

### 15.2 File System Access API
- Platform uses the browser-native File System Access API (Chrome/Edge).
- Agents can request to read/write files on the user's local machine.
- File writes are Tier 2 (require approval). File reads are Tier 1.

---

## 16. GDPR COMPLIANCE (Platform Functions)

### 16.1 Export My Data
- JSON download containing all data associated with a profile_id across: conversations, messages, message_archives, message_annotations, agent_memory, tasks, approval_queue, notifications, audit_log.

### 16.2 Delete My Data
- Hard delete: conversations, messages (cascade), message_archives (cascade), message_annotations, notifications, personal agent_memory.
- Anonymize (set profile to "deleted"): tasks, approval_queue, shared agent_memory, audit_log.
- Requires user to type "DELETE" as confirmation.
- Logs the deletion to audit_log (actor = "system"), then logs user out.

---

## 17. SECURITY REQUIREMENTS (Platform-Level)

These are non-negotiable and must be baked into the platform infrastructure:

- **HTTPS only** — all traffic via nginx with Let's Encrypt SSL. No plain HTTP.
- **API keys never reach the browser** — all LLM calls proxied through n8n on VPS.
- **n8n webhook authentication** — every webhook validates X-API-Key header. Mismatch = 401.
- **PocketBase auth required** — all collection API rules require a valid auth token (from `users` table).
- **Credential redaction** — regex scrub of secrets before any text is sent to LLM.
- **CORS** — allow only `https://os.layaa.ai`.
- **Rate limiting** — 10 requests/minute per profile, enforced at n8n layer.
- **AES-256 encryption** — LLM API keys stored encrypted in PB settings. Master key only in n8n environment variable.

---

## SUMMARY: What Must Be Built vs. What Is Content

| Must Be Built (Hard-Coded in Platform) | Content (Loaded from /seed/ or PocketBase at Runtime) |
|---|---|
| All 18 agent tool functions (Section 1) | Agent system prompts (22 .md files) |
| Approval gate system + tier mapping | Skill definitions (60 .md files) |
| Budget system (atomic, loans, pool) | Plugin contexts (8 .md files) |
| Context loading sequence (8-step assembly) | Reference documents (32 .md files) |
| Memory relevance scoring algorithm | Company documents (14 .md files) |
| Memory extraction trigger (5-min inactivity) | Core context entries |
| @Mention routing + 3-mention limit | Agent descriptions, avatars, colors |
| /Command palette + skill injection | Budget allocations per agent |
| LLM proxy (n8n webhooks, streaming, fallback) | Model/provider configuration |
| Notification system (in-app + email) | |
| Kaiser cron jobs (5 scheduled tasks) | |
| Agent status tracking (realtime) | |
| Offline PWA (IndexedDB, write queue, sync) | |
| Audit logging (all 12 action types) | |
| All 12 conversation features (Section 14) | |
| File upload + extraction pipeline | |
| GDPR export + delete | |
| Security layer (HTTPS, auth, CORS, rate limit, encryption, redaction) | |
