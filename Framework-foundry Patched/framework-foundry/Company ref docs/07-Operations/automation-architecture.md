# Automation Architecture Patterns

**Document Owner:** Shubham Sharma, CTO
**Last Updated:** April 2026
**Classification:** Internal Reference

---

## Overview

This document defines the automation architecture patterns used across all Layaa AI projects. These patterns ensure consistency, reliability, and maintainability across client engagements and internal products (Layaa OS, EduFlow, CA AI Agent).

The core automation stack: **n8n (self-hosted)** as the orchestration engine, **PocketBase (self-hosted, SQLite)** as the data layer, **Claude Sonnet 4.6 / Haiku 4.5** as the AI reasoning layer, and **React/TypeScript** as the frontend layer, connected via **WebSockets** for real-time communication.

---

## 1. n8n Orchestration Patterns

All automation workflows fall into one of four core orchestration patterns. Every new workflow must be classified into one of these before design begins.

### Pattern 1: Sync Webhook --> Process --> Respond

**Use case:** Client or frontend needs an immediate response. The caller waits for the result.

```
[HTTP Request] --> [Webhook Trigger] --> [Validate Input] --> [Process] --> [Respond to Webhook]
                                              |                    |
                                              v                    v
                                         [Return 400]        [Log Result]
```

**When to use:**
- API calls from frontend that the user is waiting on (e.g., "Ask an agent a question").
- Integration endpoints where the calling system expects a synchronous response.
- Simple lookups, calculations, or data retrieval operations.

**Implementation rules:**
- Total execution must complete within 30 seconds (webhook timeout).
- If processing may exceed 30 seconds, use Pattern 2 (Async) instead.
- Always return a structured JSON response with `status`, `data`, and `error` fields.
- Always return appropriate HTTP status codes (200 success, 400 bad request, 401 unauthorized, 500 internal error).
- Validate input before processing; reject early with clear error messages.

**Example (Layaa OS):** The `response` workflow -- receives an agent query via webhook, processes through Claude, returns the response to the frontend.

### Pattern 2: Async Webhook --> Queue --> Process --> Notify

**Use case:** Processing takes time, or the result is not needed immediately. Acknowledge receipt, process in background, notify when done.

```
[HTTP Request] --> [Webhook Trigger] --> [Validate] --> [Return 202 Accepted] --> [Continue Processing]
                                                                                        |
                                                                                        v
                                                                                  [Process (LLM, DB, etc.)]
                                                                                        |
                                                                                        v
                                                                                  [Update Status in PocketBase]
                                                                                        |
                                                                                        v
                                                                                  [Notify via WebSocket / Email / Webhook]
                                                                                        |
                                                                                        v
                                                                                  [Log Result]
```

**When to use:**
- Long-running AI operations (complex multi-step reasoning, document analysis).
- Operations that involve multiple external API calls.
- Batch processing jobs.
- Anything that might exceed the 30-second sync timeout.

**Implementation rules:**
- Return HTTP 202 immediately with a `taskId` for status tracking.
- Write a task record to PocketBase with status `pending` before starting processing.
- Update task status as processing progresses (`processing`, `completed`, `failed`).
- Notify the caller via WebSocket (for frontend) or webhook callback (for integrations).
- Implement timeout handling: if processing exceeds maximum allowed time, mark as `failed` and notify.

**Example (Layaa OS):** The `delegation` workflow -- receives a task delegation request, acknowledges immediately, processes the delegation logic (agent selection, task splitting), then notifies via the notification workflow.

### Pattern 3: Cron --> Check --> Act / Skip

**Use case:** Scheduled operations that run at fixed intervals, checking a condition and acting only when needed.

```
[Cron Trigger] --> [Check Condition] --> [Condition Met?]
                                              |
                            +--------Yes------+------No--------+
                            |                                   |
                            v                                   v
                      [Perform Action]                    [Log Skip]
                            |
                            v
                      [Log Result]
                            |
                            v
                      [Notify if needed]
```

**When to use:**
- Scheduled memory consolidation (Sage agent).
- Daily/weekly report generation.
- Budget threshold monitoring.
- Data cleanup and maintenance tasks.
- Backup verification.

**Implementation rules:**
- Always check the condition before acting; do not blindly execute.
- Log even when skipping (for audit trail -- confirms the check ran).
- Include execution time logging for performance monitoring.
- Set appropriate cron intervals (do not over-poll; conserve resources).
- Handle the case where the previous run is still executing (skip with warning, do not stack).

**Example (Layaa OS):** The `scheduled-memory` workflow -- runs on a schedule, checks for new conversations that need memory extraction, processes them if found, skips and logs if none.

### Pattern 4: Error --> Log --> Alert --> Retry

**Use case:** Error handling for any workflow. This is not a standalone workflow pattern but a sub-pattern embedded within every workflow.

```
[Error Occurs] --> [Catch Error] --> [Log Error Details] --> [Classify Severity]
                                                                    |
                                          +-------S0/S1-----------+----------S2/S3----------+
                                          |                                                   |
                                          v                                                   v
                                    [Send Alert]                                        [Log Only]
                                          |
                                          v
                                    [Retry Eligible?]
                                          |
                            +------Yes----+------No------+
                            |                             |
                            v                             v
                      [Wait + Retry]              [Mark Failed]
                      (max 3 attempts)             [Notify Admin]
                            |
                            v
                      [All retries failed?]
                            |
                      +--Yes--> [Mark Failed + Alert]
                      |
                      +--No---> [Continue Processing]
```

**When to use:** Every workflow must implement this pattern for all error-prone operations (API calls, database writes, external integrations).

**Implementation rules:**
- Never let errors pass silently. Every error must be caught and logged.
- Retry policy: maximum 3 retries with exponential backoff (1s, 5s, 15s).
- Retryable errors: network timeouts, 429 rate limits, 503 service unavailable.
- Non-retryable errors: 400 bad request, 401 unauthorized, 404 not found, data validation failures.
- Alert routing: S0/S1 to CTO immediately; S2/S3 to daily error summary.
- Include correlation ID in all error logs for end-to-end tracing.

---

## 2. PocketBase Integration Patterns

### 2.1 Data Access Pattern

All PocketBase interactions follow this access hierarchy:

```
Frontend (React/TS)  -->  PocketBase REST API  -->  SQLite Database
                              ^
                              |
n8n Workflows  ---------------+  (via PocketBase Admin API or REST API)
```

**Rules:**
- Frontend accesses PocketBase directly via the JavaScript SDK (real-time subscriptions, CRUD).
- n8n workflows access PocketBase via REST API calls (HTTP Request nodes).
- Never bypass PocketBase API rules by directly accessing the SQLite file.
- All access respects PocketBase's built-in API rules (create, read, update, delete permissions per collection).

### 2.2 Collection Design Patterns

**Naming convention:** `snake_case`, plural (e.g., `conversations`, `agent_memories`, `approval_requests`).

**Standard fields on every collection:**
- `id` (auto-generated by PocketBase, 15-char string)
- `created` (auto-generated timestamp)
- `updated` (auto-generated timestamp)

**Relation pattern:** Use PocketBase's relation field type for foreign key references. Prefer single relation over manual ID storage.

**File storage pattern:** Use PocketBase's built-in file field for file attachments. Files are stored on the server filesystem and served via PocketBase's file API with access control.

### 2.3 Real-Time Subscription Pattern

```
Frontend                     PocketBase                    n8n
   |                             |                           |
   |--- Subscribe to collection -|                           |
   |                             |                           |
   |                             |<-- Create/Update record --|
   |                             |                           |
   |<-- Real-time event ---------|                           |
   |                             |                           |
   |--- Update UI ---------------|                           |
```

**Use case:** Live updates in the Layaa OS frontend when agents complete tasks, approvals are made, or notifications arrive.

**Implementation rules:**
- Subscribe only to collections the user has read access to.
- Handle subscription reconnection on network interruption (PocketBase SDK handles this, but verify).
- Unsubscribe when the component unmounts (prevent memory leaks).
- Use specific record subscriptions where possible (not entire collection subscriptions) to reduce noise.

### 2.4 Authentication Pattern

```
User --> Frontend Login Form --> PocketBase Auth (email/password or OAuth)
                                       |
                                       v
                                 [Auth Token Issued]
                                       |
                  +--------------------+--------------------+
                  |                                         |
                  v                                         v
           [Frontend stores token]                  [Token sent with API calls]
           [in memory / secure storage]             [to PocketBase and n8n webhooks]
```

**Rules:**
- Use PocketBase's built-in authentication (no custom auth layer).
- Store tokens securely (not in localStorage for sensitive applications).
- Refresh tokens before expiry.
- n8n webhooks validate PocketBase tokens for authenticated endpoints.
- Admin API access via n8n uses a dedicated service account, not user tokens.

---

## 3. Claude API Integration Patterns

### 3.1 Model Selection

| Model | Use Case | Typical Latency | Cost Profile |
|-------|----------|-----------------|-------------|
| Claude Sonnet 4.6 | Complex reasoning, analysis, multi-step tasks, content generation | 3-15 seconds | Higher |
| Claude Haiku 4.5 | Classification, extraction, simple Q&A, formatting, fast tasks | 0.5-3 seconds | Lower |

**Decision rule:** Start with Haiku 4.5. Upgrade to Sonnet 4.6 only when Haiku's output quality is insufficient for the task.

### 3.2 Prompt Architecture Pattern

Every LLM call follows a structured prompt template:

```
System Prompt:
- Role definition (who the agent is)
- Context (what they know, what they have access to)
- Constraints (what they must not do, output format requirements)
- Examples (1-2 few-shot examples for complex tasks)

User Message:
- The actual input / question / task
- Relevant context data (conversation history, memory, etc.)
- Explicit output format instruction (JSON schema, structured text, etc.)
```

**Rules:**
- System prompts are versioned and stored in PocketBase (not hardcoded in n8n).
- Every prompt includes output format instructions (JSON preferred for structured data).
- Include token budget awareness: for long contexts, summarise before sending to avoid unnecessary token consumption.
- Never send raw PII to LLM unless required by the task and permitted by data policy.

### 3.3 LLM Call Pattern in n8n

```
[Prepare Prompt] --> [Call Claude API] --> [Parse Response] --> [Validate Output] --> [Use Result]
                           |                                          |
                           v                                          v
                     [Handle Errors]                           [Retry with
                     (rate limit,                               adjusted prompt
                      timeout,                                  if output invalid]
                      API error)
```

**Implementation rules:**
- Set explicit `max_tokens` for every call (do not use defaults; budget token usage).
- Set `temperature` appropriately: 0 for deterministic tasks (extraction, classification), 0.3-0.7 for creative tasks (content generation).
- Parse JSON responses with error handling (LLMs occasionally return malformed JSON).
- Implement response validation: check that the output contains expected fields and values.
- If output validation fails, retry once with a more explicit prompt before failing.

### 3.4 Pluggable Provider Architecture

The system is designed to switch LLM providers without architectural changes:

```
[Workflow Logic] --> [LLM Abstraction Layer] --> [Provider: Claude / OpenAI / Google]
                            |
                            v
                     [Provider Config in PocketBase]
                     - provider: "anthropic" | "openai" | "google"
                     - model: "claude-sonnet-4-6" | "gpt-4o" | "gemini-pro"
                     - api_key_credential: "n8n-credential-id"
                     - default_max_tokens: N
                     - default_temperature: N
```

**Current providers:**
- **Primary:** Anthropic (Claude Sonnet 4.6, Haiku 4.5)
- **Secondary:** OpenAI API (for specific use cases where needed)
- **Agent Framework:** Google ADK (for multi-agent orchestration in Layaa OS)

**Switching provider:** Change configuration in PocketBase; n8n workflows read provider config dynamically.

---

## 4. Error Handling Strategy

### 4.1 Error Classification

| Category | Examples | Handling |
|----------|----------|---------|
| **Input Errors** | Missing fields, invalid format, wrong data type | Return 400 with clear error message; do not retry |
| **Auth Errors** | Invalid token, expired session, insufficient permissions | Return 401/403; do not retry; log for security monitoring |
| **Transient Errors** | Network timeout, rate limit (429), service unavailable (503) | Retry with exponential backoff (max 3 attempts) |
| **Provider Errors** | LLM API error, external service failure | Retry if transient; fail gracefully with cached/fallback response if available |
| **Data Errors** | Database write failure, constraint violation, concurrent modification | Log with full context; alert for investigation; do not retry blindly |
| **System Errors** | Out of memory, disk full, n8n crash | Alert immediately (S0); require manual intervention |

### 4.2 Error Response Standard

All error responses follow this JSON structure:

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description of what went wrong",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "correlationId": "uuid-for-tracing",
    "timestamp": "2026-04-09T10:30:00Z"
  }
}
```

**Error codes (standardised):**

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| VALIDATION_ERROR | 400 | Input failed validation |
| AUTH_REQUIRED | 401 | Authentication missing or invalid |
| FORBIDDEN | 403 | Authenticated but not authorised |
| NOT_FOUND | 404 | Requested resource does not exist |
| RATE_LIMITED | 429 | Too many requests |
| PROCESSING_ERROR | 500 | Internal processing failure |
| PROVIDER_ERROR | 502 | External service failure |
| TIMEOUT | 504 | Processing exceeded time limit |

### 4.3 Circuit Breaker Pattern

For external service dependencies (Claude API, Google ADK, client APIs):

```
[Normal State] --5 consecutive failures--> [Open State] --30 second wait--> [Half-Open State]
      ^                                                                           |
      |                                                                           v
      +------success------[Half-Open: try 1 request]------failure------>[Open State]
```

**Implementation:** Track failure counts in PocketBase. When a provider exceeds the failure threshold, stop calling it for a cooldown period to prevent cascading failures and wasted API spend.

---

## 5. Security Principles

### 5.1 API Key Management

**Rule: API keys are stored ONLY in n8n's credential store. Period.**

- Never in source code or configuration files.
- Never in browser storage (localStorage, sessionStorage, cookies).
- Never in PocketBase records.
- Never in log files.
- Never in error messages returned to clients.
- Never transmitted in URL query parameters.

**n8n credential store** encrypts credentials at rest and only decrypts them at workflow execution time. This is the single source of truth for all API keys.

### 5.2 Authentication Enforcement

- Every webhook endpoint requires authentication (PocketBase token validation or API key header).
- Internal-only workflows use a shared secret header (`X-Internal-Key`) that is rotated monthly.
- PocketBase API rules enforce row-level access control (users can only read/write their own data).
- Admin operations require PocketBase admin authentication (separate from user authentication).

### 5.3 Data Protection

- Data at rest: PocketBase SQLite database on encrypted volume (server-level encryption).
- Data in transit: HTTPS enforced on all endpoints (TLS 1.2 minimum).
- Data in backups: Backblaze B2 with server-side encryption; bucket is private.
- Data in LLM calls: Minimise PII sent to LLM providers. Never send passwords, API keys, or financial account numbers.
- Data retention: Follow client-specific retention policies; default is 12 months.

### 5.4 Audit Logging

Every significant action is logged with:
- Timestamp (UTC)
- Actor (user ID or system identifier)
- Action (what was done)
- Target (what was affected)
- Result (success/failure)
- Correlation ID (for request tracing)

Audit logs are stored in a dedicated PocketBase collection with append-only access (no delete/update permissions for any user including admin).

---

## 6. Data Flow Patterns

### 6.1 Inbound Data Flow (Client System to Layaa AI)

```
[Client System] --> [HTTPS Webhook] --> [n8n Validation] --> [Normalisation] --> [PocketBase Storage]
                                              |
                                              v
                                        [Reject if invalid]
```

### 6.2 Processing Data Flow (Internal)

```
[PocketBase Read] --> [n8n Logic] --> [Claude API (if AI needed)] --> [n8n Post-processing] --> [PocketBase Write]
```

### 6.3 Outbound Data Flow (Layaa AI to Client/User)

```
[PocketBase Event] --> [n8n Notification Workflow] --> [Destination]
                                                            |
                                          +-----------------+-----------------+
                                          |                 |                 |
                                          v                 v                 v
                                    [WebSocket]       [Email]          [Webhook Callback]
                                    (Frontend)        (User)           (Client System)
```

### 6.4 Real-Time Data Flow (Layaa OS)

```
[User Action in Frontend]
        |
        v
[PocketBase Write] ---------> [PocketBase Real-Time] ---------> [Other Connected Frontends]
        |
        v
[n8n Webhook Triggered] ----> [Agent Processing] ----> [PocketBase Write] ----> [Real-Time Update to Frontend]
```

---

## 7. The 7-Stage Workflow Building Method

Every n8n workflow built at Layaa AI follows these seven stages in order. This is the standard, non-negotiable.

### Stage 1: Trigger

Define what starts the workflow.

| Trigger Type | When to Use | Configuration Notes |
|-------------|-------------|-------------------|
| Webhook | External system or frontend calls the workflow | Set method (POST/GET), path, authentication |
| Cron/Schedule | Time-based execution | Use cron expression; document the schedule |
| PocketBase Event | React to database changes | Subscribe via webhook or polling |
| Manual | Testing or one-off execution | Remove before production deployment |

### Stage 2: Validation

Validate all incoming data before any processing.

**Validation checklist:**
- Required fields present
- Data types correct (string, number, boolean, date)
- Values within acceptable ranges
- Format correct (email format, phone format, date format)
- Referential integrity (referenced IDs exist in PocketBase)

**On validation failure:** Return immediately with a 400 error. Do not proceed to Stage 3.

### Stage 3: Normalisation

Transform data into internal standard format.

**Standard transformations:**
- Dates to ISO 8601 format (store in UTC, display in IST)
- Currency amounts as integers in paisa (to avoid floating point issues)
- Phone numbers in E.164 format (+91XXXXXXXXXX)
- Names trimmed and properly cased
- Enum values mapped to internal codes
- Null/undefined unified to consistent representation

### Stage 4: Core Logic

The business logic or AI processing. This is the "what the workflow actually does" stage.

**Rules:**
- One workflow, one responsibility (Single Responsibility Principle).
- If the logic requires multiple distinct responsibilities, split into multiple workflows connected via internal webhooks.
- Keep LLM calls in this stage (not scattered across other stages).
- Database reads and writes happen here.
- Business rule evaluation happens here.

### Stage 5: Branching

Handle conditional paths based on logic outcomes.

**Common branching patterns:**
- Success vs. failure paths
- Approval routing (Tier 1 / Tier 2 / Tier 3 based on thresholds)
- Content routing (different handling based on data classification)
- Feature flags (enable/disable features without workflow changes)

### Stage 6: Output

Format and deliver the result.

**Output types:**
- Webhook response (sync pattern)
- PocketBase record create/update (all patterns)
- Notification trigger (call the notification workflow)
- File generation (reports, exports)
- External API call (update client system)

### Stage 7: Logging

Record the execution for auditing and debugging.

**Mandatory log fields:**
- Workflow name and execution ID
- Trigger timestamp and completion timestamp
- Input summary (not full payload -- avoid logging PII)
- Output summary
- Success/failure status
- Error details (if failed)
- Execution duration in milliseconds

---

## 8. Reference: The 7 Core n8n Workflows (Layaa OS)

| # | Workflow | Pattern | Purpose |
|---|---------|---------|---------|
| 1 | `sage-extraction` | Async (Pattern 2) | Extracts memories, preferences, and insights from agent conversations and stores in Sage memory system |
| 2 | `approval-handler` | Sync (Pattern 1) | Processes approval requests through 3-tier approval hierarchy; routes to correct approver based on amount/type |
| 3 | `delegation` | Async (Pattern 2) | Handles task delegation between agents; includes agent selection, task splitting, and status tracking |
| 4 | `response` | Sync (Pattern 1) | Core agent response workflow; receives user query, retrieves context/memory, calls Claude, returns response |
| 5 | `scheduled-memory` | Cron (Pattern 3) | Periodic memory consolidation and cleanup; runs on schedule to process accumulated conversation data |
| 6 | `budget` | Cron (Pattern 3) | Monitors budget consumption against thresholds; triggers alerts when approaching or exceeding limits |
| 7 | `notifications` | Async (Pattern 2) | Central notification hub; receives notification requests from all other workflows and delivers via appropriate channel |

Each of these workflows follows the 7-stage building method and implements the Error handling pattern (Pattern 4) internally.

---

## Appendix: Architecture Decision Records

### ADR-001: n8n as Primary Orchestration Engine

**Decision:** Use self-hosted n8n for all workflow orchestration.
**Rationale:** Visual workflow builder accelerates development, self-hosted meets data sovereignty requirements, extensive node library covers most integrations, and the cost is zero (open-source self-hosted).
**Alternatives considered:** Make (SaaS, data leaves India), Zapier (expensive at scale, data sovereignty concerns), custom Node.js (slower to build and maintain).

### ADR-002: PocketBase as Primary Database

**Decision:** Use self-hosted PocketBase (SQLite) for all data storage.
**Rationale:** Single binary deployment, built-in REST API eliminates need for custom backend, real-time subscriptions via WebSocket, built-in authentication, file storage, and admin UI. Perfect for SME-scale applications. Infrastructure cost near zero.
**Alternatives considered:** PostgreSQL (more complex to manage for small team), Firebase (data sovereignty, vendor lock-in), Supabase (SaaS dependency).

### ADR-003: Claude as Default LLM Provider

**Decision:** Claude Sonnet 4.6 as default reasoning model, Haiku 4.5 for fast tasks.
**Rationale:** Superior instruction following, strong structured output (JSON), excellent reasoning quality, competitive pricing. Pluggable architecture allows switching if needed.
**Alternatives considered:** GPT-4o (available as secondary), Gemini (used via Google ADK for agent orchestration).

### ADR-004: Self-Hosted Everything

**Decision:** Self-host all core infrastructure on Indian VPS.
**Rationale:** Data sovereignty (Indian data stays in India), cost control (< INR 500/month for all infrastructure), no vendor lock-in, full control over uptime and configuration.
**Trade-offs accepted:** Higher operational burden on CTO, single point of failure risk (mitigated by Backblaze B2 backups).

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
