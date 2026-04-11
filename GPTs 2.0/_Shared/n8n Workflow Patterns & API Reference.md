# n8n Workflow Patterns & API Reference

> Shared technical reference for all tech agents (Ujjawal, Kaiser, Dev, Ananya, Rohit). Covers n8n orchestration patterns, PocketBase API, Claude API integration, WhatsApp Business API, Resend Email API, and the 7 core Layaa OS workflows.

---

## Common n8n Orchestration Patterns

### Pattern 1: Webhook → Process → Respond (Sync API)

Used when the caller expects an immediate response within 30 seconds.

```
[Webhook] → [Validate Input] → [Process] → [Respond to Webhook]
   POST /webhook/my-endpoint
   Response Mode: "When Last Node Finishes"
```

**Node chain:**

| Step | n8n Node | Configuration |
|------|----------|---------------|
| 1 | **Webhook** | Method: POST, Path: `/webhook/{name}`, Auth: Header Auth (`X-Api-Key`), Response Mode: When Last Node Finishes |
| 2 | **IF** | Validate required fields exist: `{{ $json.body.required_field !== undefined }}` |
| 3 | **Function** or **HTTP Request** | Core processing logic or external API call |
| 4 | **Respond to Webhook** | Status 200, Body: `{ "status": "success", "data": {{ $json }} }` |
| 4b | **Respond to Webhook** (error branch) | Status 400, Body: `{ "status": "error", "message": "Validation failed" }` |

**30-second rule:** If processing might exceed 30 seconds, use the async pattern instead. Webhook timeout is not configurable in n8n.

---

### Pattern 2: Webhook → Queue → Process → Notify (Async)

Used when processing takes longer than 30 seconds or when the caller does not need to wait.

```
[Webhook] → [Write to Queue] → [Respond 202] 
                                     ↓
[Schedule Trigger] → [Read Queue] → [Process] → [Update Queue] → [Notify]
```

**Node chain (Receiver Workflow):**

| Step | n8n Node | Configuration |
|------|----------|---------------|
| 1 | **Webhook** | Method: POST, Response Mode: Immediately |
| 2 | **HTTP Request** (PocketBase) | POST `/api/collections/job_queue/records` with payload + status: `pending` |
| 3 | **Respond to Webhook** | Status 202, Body: `{ "status": "accepted", "job_id": "{{ $json.id }}" }` |

**Node chain (Processor Workflow):**

| Step | n8n Node | Configuration |
|------|----------|---------------|
| 1 | **Schedule Trigger** | Every 1 minute (or use PocketBase Trigger on `job_queue` create) |
| 2 | **HTTP Request** (PocketBase) | GET `/api/collections/job_queue/records?filter=status='pending'&sort=created` |
| 3 | **Split Out** | Split `items` array into individual items |
| 4 | **HTTP Request** (PocketBase) | PATCH status to `processing` |
| 5 | **Function** / **HTTP Request** | Core processing logic |
| 6 | **HTTP Request** (PocketBase) | PATCH status to `completed` with result data |
| 7 | **HTTP Request** (Resend or WhatsApp) | Notify the requester |

---

### Pattern 3: Cron → Check Condition → Act/Skip (Scheduled Job)

Used for periodic tasks: health checks, budget resets, memory compression, backups.

```
[Schedule Trigger] → [Query State] → [IF condition met] → [Act] → [Log Result]
                                            ↓ (else)
                                      [No Operation]
```

**Node chain:**

| Step | n8n Node | Configuration |
|------|----------|---------------|
| 1 | **Schedule Trigger** | Cron expression: `0 3 * * *` (daily 3 AM IST) or interval: every 15 minutes |
| 2 | **HTTP Request** (PocketBase) | GET current state/metrics |
| 3 | **IF** | Evaluate threshold: `{{ $json.usage_percent >= 80 }}` |
| 4a | **Function** → **HTTP Request** | Perform action + store result |
| 4b | **No Operation** | Skip — nothing to do |
| 5 | **HTTP Request** (PocketBase) | POST to `system_logs` collection: `{ "workflow": "...", "action": "...", "timestamp": "..." }` |

**Cron expression reference (IST = UTC+5:30):**

| Schedule | Cron Expression | Notes |
|----------|----------------|-------|
| Every 5 minutes | `*/5 * * * *` | Health checks, queue processing |
| Every hour at :00 | `0 * * * *` | Budget warnings |
| Daily at 3:00 AM IST | `30 21 * * *` | Backups (9:30 PM UTC = 3 AM IST) |
| Daily at 8:00 AM IST | `30 2 * * *` | Morning briefings |
| 1st of month at 12:01 AM IST | `31 18 1 * *` | Budget reset (6:31 PM UTC prev day = 12:01 AM IST) |

---

### Pattern 4: Error Trigger → Log → Alert → Retry (Error Handling)

Every production workflow must have a linked error workflow.

```
[Error Trigger] → [Extract Error Info] → [Log to PocketBase] → [Classify Severity] 
      → [IF P1/P2] → [Send Email Alert] + [Send In-App Notification]
      → [IF P3/P4] → [Log Only]
```

**Node chain:**

| Step | n8n Node | Configuration |
|------|----------|---------------|
| 1 | **Error Trigger** | Linked to parent workflow via Settings → Error Workflow |
| 2 | **Set** | Extract: `{{ $json.workflow.name }}`, `{{ $json.execution.error.message }}`, `{{ $json.execution.error.node }}` |
| 3 | **HTTP Request** (PocketBase) | POST `/api/collections/error_logs/records` |
| 4 | **Switch** | Route by error type: timeout → P3, auth_failure → P2, data_loss_risk → P1, other → P4 |
| 5a | **HTTP Request** (Resend) | Send email for P1/P2 |
| 5b | **HTTP Request** (PocketBase) | Create notification record for P3 |
| 5c | **No Operation** | P4 — already logged, no alert needed |

**Error Trigger output structure:**
```json
{
  "execution": {
    "id": "exec_abc123",
    "mode": "trigger",
    "error": {
      "message": "Request failed with status code 429",
      "node": "Claude API Call",
      "timestamp": "2026-04-08T10:30:00.000Z"
    }
  },
  "workflow": {
    "id": "wf_xyz",
    "name": "sage-extraction"
  }
}
```

---

## PocketBase API Patterns

All PocketBase calls go through HTTP Request nodes to `http://127.0.0.1:8090` (local) or `https://db.layaa.ai` (production).

### Authentication

```
POST /api/collections/users/auth-with-password

Headers:
  Content-Type: application/json

Body:
{
  "identity": "admin@layaa.ai",
  "password": "{{ $credentials.pocketbase_password }}"
}

Response:
{
  "token": "eyJhbGc...",
  "record": { "id": "user_id", "email": "admin@layaa.ai", ... }
}
```

Store the token and pass it as `Authorization: Bearer {{ $json.token }}` in all subsequent requests.

### CRUD Operations

**List records with filtering, sorting, and expansion:**
```
GET /api/collections/{collection}/records?filter={filter}&sort={sort}&expand={relations}&page=1&perPage=50

Examples:
  ?filter=status='active'&&agent_id='abc123'
  ?filter=budget_used>50000
  ?filter=name~'layaa'              (partial match / LIKE)
  ?filter=deleted!=null             (not null check)
  ?filter=created>='2026-04-01'
  ?sort=-created                    (descending by created)
  ?sort=priority,-created           (ascending priority, then descending created)
  ?expand=agent_id,project_id       (expand relation fields)
```

**Create a record:**
```
POST /api/collections/{collection}/records

Headers:
  Authorization: Bearer {{ $json.token }}
  Content-Type: application/json

Body:
{
  "field1": "value1",
  "field2": 123,
  "relation_field": "related_record_id"
}
```

**Update a record:**
```
PATCH /api/collections/{collection}/records/{id}

Body:
{
  "status": "completed",
  "result": "Task finished successfully"
}
```

**Atomic increment (budget tracking):**
```
PATCH /api/collections/agents/records/{agent_id}

Body:
{
  "budget_used+": 1500
}
```

The `+` suffix on the field name tells PocketBase to add to the existing value rather than replace it. This prevents race conditions when multiple workflows update budget simultaneously.

**Delete a record:**
```
DELETE /api/collections/{collection}/records/{id}

Headers:
  Authorization: Bearer {{ $json.token }}
```

### Realtime Subscriptions (WebSocket)

```
WebSocket: wss://db.layaa.ai/api/realtime

Subscribe message:
{
  "action": "subscribe",
  "collection": "conversations",
  "filter": "profile_id='user123'"
}

Event format:
{
  "action": "create" | "update" | "delete",
  "record": { ... full record data ... }
}
```

Used by the frontend for live updates. n8n workflows typically use PocketBase Trigger nodes instead, which wrap this WebSocket internally.

### Filter Syntax Quick Reference

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` | Equals | `status='active'` |
| `!=` | Not equals | `status!='deleted'` |
| `>` `>=` `<` `<=` | Comparison | `budget_used>=50000` |
| `~` | Contains (LIKE) | `name~'layaa'` |
| `!~` | Not contains | `name!~'test'` |
| `&&` | AND | `status='active'&&team='marketing'` |
| `\|\|` | OR | `status='active'\|\|status='pending'` |

---

## Claude API Integration via n8n

All LLM calls are proxied through n8n — API keys never reach the browser.

### HTTP Request Node Configuration

```
Method: POST
URL: https://api.anthropic.com/v1/messages

Headers:
  x-api-key: {{ $credentials.anthropic_api_key }}
  anthropic-version: 2023-06-01
  content-type: application/json

Body (JSON):
{
  "model": "claude-sonnet-4-6-20260408",
  "max_tokens": 4096,
  "system": "You are a helpful assistant for Layaa AI.",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.user_message }}"
    }
  ]
}
```

### Model Selection

| Model ID | Use Case | Token Cost (approx) |
|----------|----------|---------------------|
| `claude-sonnet-4-6-20260408` | Complex reasoning, strategy, multi-step analysis | Higher |
| `claude-haiku-4-5-20260408` | Fast extraction, summaries, simple classification | Lower |

Default model is set per agent in the `agents` collection. Use Haiku for high-volume background tasks (memory extraction, summarization). Use Sonnet for user-facing conversations and complex analysis.

### Multi-Turn Conversations

```json
{
  "model": "claude-sonnet-4-6-20260408",
  "max_tokens": 4096,
  "system": "{{ $json.system_prompt }}",
  "messages": [
    { "role": "user", "content": "{{ $json.history[0].content }}" },
    { "role": "assistant", "content": "{{ $json.history[1].content }}" },
    { "role": "user", "content": "{{ $json.current_message }}" }
  ]
}
```

### Streaming (SSE)

```json
{
  "model": "claude-sonnet-4-6-20260408",
  "max_tokens": 4096,
  "stream": true,
  "messages": [...]
}
```

When `stream: true`, the response is Server-Sent Events. n8n HTTP Request node does not natively handle SSE — use a Function node with `fetch()` for streaming, or handle streaming on the frontend and use n8n only for non-streamed background tasks.

### Tool Use (Function Calling)

```json
{
  "model": "claude-sonnet-4-6-20260408",
  "max_tokens": 4096,
  "tools": [
    {
      "name": "read_data",
      "description": "Read records from a PocketBase collection",
      "input_schema": {
        "type": "object",
        "properties": {
          "collection": { "type": "string", "description": "Collection name" },
          "filter": { "type": "string", "description": "PocketBase filter expression" }
        },
        "required": ["collection"]
      }
    }
  ],
  "messages": [
    { "role": "user", "content": "What tasks are overdue?" }
  ]
}
```

When Claude responds with a `tool_use` block, your n8n workflow must:
1. Parse the tool name and input from the response
2. Execute the tool (e.g., query PocketBase)
3. Send the result back as a `tool_result` message
4. Let Claude generate the final response

### Error Handling for Claude API

| Status Code | Meaning | n8n Action |
|-------------|---------|------------|
| 200 | Success | Process response |
| 400 | Bad request (malformed body) | Log error, do not retry, notify developer |
| 401 | Invalid API key | Log error, do not retry, alert Kaiser |
| 429 | Rate limited | Read `retry-after` header, Wait node, then retry |
| 500 | Server error | Retry with 30-second delay, max 3 attempts |
| 529 | API overloaded | Retry with 60-second delay, max 3 attempts |

**n8n retry configuration for Claude API calls:**
```
HTTP Request Node → Options:
  Retry on Fail: true
  Max Retries: 3
  Wait Between Retries: 30000 (ms)
  Retry on Status Codes: 429, 500, 529
```

---

## WhatsApp Business API via n8n

### Send a Text Message

```
Method: POST
URL: https://graph.facebook.com/v19.0/{phone_number_id}/messages

Headers:
  Authorization: Bearer {{ $credentials.whatsapp_token }}
  Content-Type: application/json

Body:
{
  "messaging_product": "whatsapp",
  "to": "919876543210",
  "type": "text",
  "text": {
    "body": "Hello from Layaa AI! Your task has been completed."
  }
}
```

### Send a Template Message

Template messages are required for initiating conversations (outside the 24-hour session window).

```json
{
  "messaging_product": "whatsapp",
  "to": "919876543210",
  "type": "template",
  "template": {
    "name": "task_notification",
    "language": { "code": "en" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Budget Report" },
          { "type": "text", "text": "April 2026" }
        ]
      }
    ]
  }
}
```

### Send a Media Message (Document/Image)

```json
{
  "messaging_product": "whatsapp",
  "to": "919876543210",
  "type": "document",
  "document": {
    "link": "https://os.layaa.ai/files/report.pdf",
    "caption": "Monthly Budget Report — April 2026",
    "filename": "budget-report-april-2026.pdf"
  }
}
```

### Webhook for Incoming Messages

Configure a Webhook node to receive WhatsApp incoming message events:

```
Webhook Path: /webhook/whatsapp-incoming
Method: GET (for verification) + POST (for messages)

Verification (GET):
  Return query param hub.challenge when hub.verify_token matches your token.

Incoming message payload (POST):
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919876543210",
          "type": "text",
          "text": { "body": "User's message here" },
          "timestamp": "1712567890"
        }]
      }
    }]
  }]
}
```

**Session vs Template rules:**
- Within 24 hours of last user message: send any message (session message)
- Outside 24-hour window: must use pre-approved template message
- Media messages work in both session and template contexts

---

## Resend Email API via n8n

### Send an Email

```
Method: POST
URL: https://api.resend.com/emails

Headers:
  Authorization: Bearer {{ $credentials.resend_api_key }}
  Content-Type: application/json

Body:
{
  "from": "Layaa OS <notifications@layaa.ai>",
  "to": ["abhimanyu@layaa.ai"],
  "subject": "[LAYAA OS] Budget Warning: Kabir at 85%",
  "html": "<h2>Budget Warning</h2><p>Agent <strong>Kabir</strong> has used 85% of monthly allocation...</p>"
}
```

### Send with CC/BCC and Reply-To

```json
{
  "from": "Layaa OS <notifications@layaa.ai>",
  "to": ["abhimanyu@layaa.ai"],
  "cc": ["shubham@layaa.ai"],
  "reply_to": "support@layaa.ai",
  "subject": "Monthly Report",
  "html": "<p>Report attached.</p>"
}
```

### Error Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 200 | Sent | Log success |
| 401 | Invalid API key | Do not retry, alert Kaiser |
| 422 | Validation error (bad email, missing fields) | Do not retry, log and fix data |
| 429 | Rate limited | Wait 60 seconds, retry max 3 times |
| 500 | Server error | Retry with 30-second delay, max 3 attempts |

**n8n retry configuration for Resend:**
```
HTTP Request Node → Options:
  Retry on Fail: true
  Max Retries: 3
  Wait Between Retries: 30000 (ms)
```

---

## 7 Core Layaa OS Workflows — Architecture

These 7 n8n workflows power all background operations on Layaa OS. Each workflow is a separate n8n workflow linked to the others via webhook calls or shared PocketBase collections.

---

### 1. sage-extraction

**Purpose:** Extract memories from conversations after inactivity.

**Trigger:** Schedule Trigger (every 5 minutes) OR PocketBase Trigger on conversation update.

**Flow:**
```
[Schedule Trigger: */5 * * * *]
  → [HTTP Request: GET conversations where last_message_at < 5min ago 
      AND message_count >= 4 AND total_chars >= 200 AND extracted = false]
  → [Split Out: individual conversations]
  → [HTTP Request: GET conversation messages]
  → [HTTP Request: POST to Claude API (Haiku)]
      System: "Extract facts, decisions, preferences, client info, patterns from this conversation."
      Body: conversation messages as context
  → [Function: Parse extraction into memory records]
  → [Loop Over Items: each memory]
      → [HTTP Request: POST /api/collections/agent_memory/records]
  → [HTTP Request: PATCH conversation — set extracted = true]
  → [Log result to system_logs]
```

**Key nodes:** Schedule Trigger, HTTP Request (x6), Split Out, Function, Loop Over Items

---

### 2. approval-handler

**Purpose:** Process the approval queue — execute approved actions, handle rejections and timeouts.

**Trigger:** PocketBase Trigger on `approval_queue` update (status change) + Schedule Trigger every 5 minutes (timeout check).

**Flow:**
```
[PocketBase Trigger: approval_queue updated]
  → [Switch: status]
      → "approved": 
          [Function: Parse action payload]
          → [HTTP Request: Execute the original Tier 2 action]
          → [HTTP Request: PATCH approval_queue — status = "executed", result = ...]
          → [HTTP Request: POST notification to agent — "Action executed"]
      → "rejected":
          [HTTP Request: POST notification to agent — "Action rejected: {reason}"]
      → (timeout check via Schedule):
          [HTTP Request: GET approval_queue where status='pending' AND created < 30min ago]
          → [Split Out]
          → [HTTP Request: PATCH status = "timeout"]
          → [HTTP Request: POST task for follow-up]
          → [HTTP Request: POST notification + send email via Resend]
```

**Key nodes:** PocketBase Trigger, Schedule Trigger, Switch, Function, HTTP Request (x7)

---

### 3. delegation

**Purpose:** Route agent-to-agent delegation requests with context handoff.

**Trigger:** Webhook (POST from frontend when user @mentions another agent).

**Flow:**
```
[Webhook: POST /webhook/delegation]
  → [IF: validate from_agent, to_agent, context exist]
  → [HTTP Request: GET from_agent's recent conversation context]
  → [Function: Build context summary for target agent]
  → [HTTP Request: POST pass_context record to PocketBase]
  → [HTTP Request: POST to response workflow webhook — trigger target agent]
  → [Respond to Webhook: 202 Accepted, { "delegation_id": "..." }]
```

**Key nodes:** Webhook, IF, Function, HTTP Request (x3), Respond to Webhook

---

### 4. response

**Purpose:** Handle async agent response generation (the core LLM call pipeline).

**Trigger:** Webhook (POST from frontend or from delegation workflow).

**Flow:**
```
[Webhook: POST /webhook/response]
  → [HTTP Request: GET agent config (system_prompt, model, budget)]
  → [IF: budget check — budget_used < effective_budget]
      → (over budget): [Respond to Webhook: 429, "Budget exhausted"]
  → [HTTP Request: GET core_context documents]
  → [HTTP Request: GET agent_memory (ranked by relevance)]
  → [HTTP Request: GET project context if project_id present]
  → [Function: Assemble full prompt — system + context + memories + history + message]
  → [HTTP Request: POST to Claude API (agent's default model)]
  → [HTTP Request: PATCH agent budget_used+ with tokens consumed]
  → [HTTP Request: POST assistant message to conversation_messages]
  → [Respond to Webhook: 200, { "message": "...", "tokens_used": ... }]
```

**Key nodes:** Webhook, HTTP Request (x8), IF, Function, Respond to Webhook

---

### 5. scheduled-memory

**Purpose:** Compress old memories, merge duplicates, decay low-confidence entries.

**Trigger:** Schedule Trigger (daily at 2:00 AM IST).

**Flow:**
```
[Schedule Trigger: 30 20 * * * (2 AM IST)]
  → [HTTP Request: GET memories where created < 30 days ago AND compressed = false]
  → [Split Out: individual memories]
  → [HTTP Request: POST to Claude API (Haiku) — "Compress this memory to key facts only"]
  → [HTTP Request: PATCH memory — content = compressed, compressed = true]
  → [HTTP Request: GET memories where confidence < 0.3 AND created < 60 days ago]
  → [Loop Over Items: delete or archive low-confidence stale memories]
  → [HTTP Request: GET memories with duplicate content hashes]
  → [Function: Merge duplicates — keep highest confidence, combine sources]
  → [Log: "Memory maintenance complete — compressed: N, decayed: N, merged: N"]
```

**Key nodes:** Schedule Trigger, HTTP Request (x6), Split Out, Loop Over Items, Function

---

### 6. budget

**Purpose:** Track token usage, send warnings, perform monthly resets.

**Trigger:** Schedule Trigger (hourly for warnings) + Schedule Trigger (1st of month for reset).

**Flow (Hourly Warning Check):**
```
[Schedule Trigger: 0 * * * *]
  → [HTTP Request: GET all agents with budget data]
  → [Function: Calculate usage_percent for each agent]
  → [Filter: usage_percent >= 80]
  → [Switch: 80-94% → warning, 95-99% → critical, 100% → exhausted]
      → warning: [HTTP Request: POST in-app notification]
      → critical: [HTTP Request: POST notification + POST email via Resend]
      → exhausted: [HTTP Request: PATCH agent status = "budget_exhausted"]
                    [HTTP Request: POST notification + POST email]
```

**Flow (Monthly Reset):**
```
[Schedule Trigger: 31 18 1 * * (12:01 AM IST on 1st)]
  → [HTTP Request: GET all agents]
  → [Function: Log current budget_used per agent for historical record]
  → [HTTP Request: POST historical budget records]
  → [Loop Over Items: each agent]
      → [HTTP Request: PATCH budget_used = 0, budget_loaned = 0, 
          budget_period_start = now(), status → idle (if was budget_exhausted)]
  → [HTTP Request: POST notification to Founders — "Budget reset complete"]
  → [Log result]
```

**Key nodes:** Schedule Trigger (x2), HTTP Request (x8), Function (x2), Filter, Switch, Loop Over Items

---

### 7. notifications

**Purpose:** Central notification dispatch — email alerts, in-app notifications, daily briefings.

**Trigger:** Webhook (POST from any workflow that needs to send a notification) + Schedule Trigger (daily briefing at 8 AM IST).

**Flow (On-Demand Notification):**
```
[Webhook: POST /webhook/notify]
  → [Switch: channel]
      → "email": 
          [HTTP Request: POST to Resend API]
      → "in_app":
          [HTTP Request: POST /api/collections/notifications/records]
      → "whatsapp":
          [HTTP Request: POST to WhatsApp Cloud API]
      → "all":
          [Execute all three branches above via Merge]
  → [HTTP Request: POST to notification_logs — record delivery status]
  → [Respond to Webhook: 200]
```

**Flow (Daily Briefing):**
```
[Schedule Trigger: 30 2 * * * (8 AM IST)]
  → [HTTP Request: GET overdue tasks, pending approvals, budget status, system health]
  → [HTTP Request: POST to Claude API (Haiku) — "Generate concise daily briefing"]
  → [HTTP Request: POST briefing as in-app notification to Founders]
  → [HTTP Request: POST briefing email via Resend]
  → [Log: "Daily briefing sent"]
```

**Key nodes:** Webhook, Schedule Trigger, Switch, HTTP Request (x6), Respond to Webhook

---

## Cross-Workflow Communication

The 7 workflows communicate through two mechanisms:

1. **Webhook calls:** One workflow calls another's webhook endpoint using HTTP Request nodes. Example: `response` workflow calls `notifications` webhook to send a budget warning.

2. **Shared PocketBase collections:** Workflows read/write to shared collections (`approval_queue`, `job_queue`, `notifications`, `system_logs`) and react to changes via PocketBase Trigger nodes.

**Do not** create circular webhook chains (A calls B calls A). If bidirectional communication is needed, use a shared PocketBase collection as the intermediary.

---

## Credential References

All credentials are stored in n8n's encrypted credential store. Reference by name in node configurations:

| Credential Name | Type | Used By |
|----------------|------|---------|
| `pocketbase_auth` | API Key / Bearer Token | All workflows |
| `anthropic_api_key` | API Key (Header: `x-api-key`) | sage-extraction, response |
| `resend_api_key` | API Key (Header: `Authorization: Bearer`) | notifications, budget, approval-handler |
| `whatsapp_token` | Bearer Token | notifications |
| `backblaze_b2` | S3-compatible (rclone) | backup workflow (Kaiser) |

Never hardcode these values. Never log them. Never send them to the LLM.

---

*This document is part of the shared Layaa OS technical reference. Update as APIs evolve, new workflows are added, or integration patterns change.*
