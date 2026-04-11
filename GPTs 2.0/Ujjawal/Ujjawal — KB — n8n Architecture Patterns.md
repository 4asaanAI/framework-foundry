# Ujjawal — KB — n8n Architecture Patterns

> Deep reference for mapping the 7-stage workflow design methodology to actual n8n node configurations, sub-workflow patterns, performance tuning, and production readiness.

---

## 7-Stage Workflow Pattern Mapped to n8n Nodes

Every workflow Ujjawal designs follows the 7-stage methodology. Here is how each stage translates to concrete n8n nodes and configuration.

### Stage 1: Trigger (Entry Point)

| Trigger Type | n8n Node | Configuration |
|-------------|----------|---------------|
| API call from frontend | **Webhook** | Method: POST, Path: `/webhook/{name}`, Auth: Header Auth, Response Mode: When Last Node Finishes (sync) or Immediately (async) |
| Database event | **PocketBase Trigger** | Collection: `{name}`, Events: create / update / delete |
| Scheduled job | **Schedule Trigger** | Cron: `0 3 * * *` or Interval: every 5 minutes |
| Another workflow | **Webhook** (called via HTTP Request from parent) | Same as API call — workflows communicate via webhooks |
| Email received | **Email Trigger (IMAP)** | Mailbox, Poll interval: 1 minute |

**Design rule:** One trigger per workflow. If a business process has multiple triggers (e.g., manual + scheduled + event), create separate workflows that call a shared sub-workflow for the core logic.

### Stage 2: Validation (Input Guard)

| Check Type | n8n Node | Configuration |
|-----------|----------|---------------|
| Required fields exist | **IF** | `{{ $json.body.field !== undefined && $json.body.field !== '' }}` |
| Data type check | **IF** | `{{ typeof $json.body.amount === 'number' }}` |
| Enum validation | **IF** | `{{ ['active','pending','closed'].includes($json.body.status) }}` |
| Complex validation | **Function** | JavaScript with early return and error object |
| Auth check | **IF** | `{{ $json.headers['x-api-key'] === 'expected_value' }}` |

**On validation failure:** Route to a Respond to Webhook node returning status 400 with a clear error message. Never let invalid data reach processing nodes.

```
[Webhook] → [IF: required fields] 
               → (false) → [Respond to Webhook: 400, { error: "Missing required field: agent_id" }]
               → (true)  → [Stage 3...]
```

### Stage 3: Normalization (Data Transform)

| Transform Type | n8n Node | Configuration |
|---------------|----------|---------------|
| Rename/restructure fields | **Set** | Map input fields to internal schema names |
| Format dates | **Function** | Convert to IST, standardize format |
| Enrich from database | **HTTP Request** | GET related records from PocketBase |
| Merge data sources | **Merge** | Combine webhook data with DB lookup results by key |
| Default values | **Set** | `{{ $json.priority || 'medium' }}` |

**Design rule:** After Stage 3, data should match your internal schema exactly. All downstream nodes work with normalized field names, never raw input field names.

### Stage 4: Processing (Core Logic)

| Logic Type | n8n Node | Configuration |
|-----------|----------|---------------|
| LLM call | **HTTP Request** | POST to Claude API with assembled prompt |
| External API call | **HTTP Request** | With retry on fail, timeout, error output |
| Data computation | **Function** | JavaScript for calculations, aggregations |
| Batch processing | **Loop Over Items** | Batch size: 10-50, process items in chunks |
| Sequential API calls | **Loop Over Items** → **HTTP Request** | For rate-limited APIs |

### Stage 5: Decision (Branching)

| Decision Type | n8n Node | When to Use |
|--------------|----------|-------------|
| Binary yes/no | **IF** | Single condition: approved vs. rejected |
| Multiple paths | **Switch** | 3+ outcomes: route by status, severity, type |
| Filter items | **Filter** | Keep only items matching criteria |
| Data-driven routing | **Switch** on field value | Route by agent team, category, priority |

**Design rule:** Every Switch/IF must have a default path. Never leave an unhandled case — at minimum, log unexpected values and notify.

### Stage 6: Output (Delivery)

| Output Type | n8n Node | Configuration |
|------------|----------|---------------|
| Sync API response | **Respond to Webhook** | Status: 200/201, JSON body |
| Write to database | **HTTP Request** | POST/PATCH to PocketBase |
| Send email | **HTTP Request** | POST to Resend API |
| Send notification | **HTTP Request** | POST to notifications webhook |
| Call another workflow | **HTTP Request** | POST to target workflow's webhook |

### Stage 7: Completion (Logging & Cleanup)

| Action | n8n Node | Configuration |
|--------|----------|---------------|
| Log execution | **HTTP Request** | POST to `system_logs` collection |
| Update status | **HTTP Request** | PATCH source record (e.g., status = completed) |
| Clean up temp data | **HTTP Request** | DELETE temporary records |
| Alert on threshold | **IF** → **HTTP Request** | Check metric → POST to notifications webhook |

---

## Common Node Combinations (Recipes)

### Recipe: PocketBase Query → Process Each → Write Results

```
[HTTP Request: GET /api/collections/tasks/records?filter=status='pending']
  → [Split Out: items array]
  → [Loop Over Items: batch size 10]
      → [Function: process each item]
      → [HTTP Request: PATCH /api/collections/tasks/records/{{ $json.id }}]
  → [Set: { "processed": {{ $json.items.length }} }]
  → [HTTP Request: POST system_logs]
```

### Recipe: Claude API Call with Context Assembly

```
[HTTP Request: GET agent config from PocketBase]
  → [HTTP Request: GET relevant memories from PocketBase]
  → [HTTP Request: GET core_context from PocketBase]
  → [Merge: combine all context sources]
  → [Function: assemble prompt — system + context + memories + user message]
  → [HTTP Request: POST to Claude API]
  → [Function: parse response, extract token counts]
  → [HTTP Request: PATCH agent budget_used+ tokens]
```

### Recipe: Conditional Notification Dispatch

```
[Function: evaluate severity]
  → [Switch: severity level]
      → P1: [HTTP Request: Resend email] + [HTTP Request: PocketBase notification] + [HTTP Request: WhatsApp]
      → P2: [HTTP Request: Resend email] + [HTTP Request: PocketBase notification]
      → P3: [HTTP Request: PocketBase notification]
      → P4: [No Operation — logged already]
```

---

## Error Handling Best Practices in n8n

### Node-Level: Use Error Output

Every HTTP Request node that calls an external API should have "Continue On Fail" set to "Use Error Output." Wire the error output to an error handler path.

```
[HTTP Request: Claude API]
   → (success) → [Continue processing]
   → (error)   → [Set: extract error details] → [IF: retryable?]
                       → (yes) → [Wait: 30s] → [HTTP Request: retry]
                       → (no)  → [HTTP Request: log to error_logs] → [HTTP Request: notify]
```

### Workflow-Level: Error Workflow

Every production workflow must have an Error Workflow set in Settings. The error workflow:

1. Receives execution metadata (workflow name, failed node, error message)
2. Logs to `error_logs` PocketBase collection
3. Classifies severity (P1-P4)
4. Routes notification appropriately

### System-Level: Monitor Failure Rates

Kaiser's health check workflow should query n8n's execution history:
- `>5%` failure rate in last hour → investigate
- `>10%` failure rate → alert
- Any P1 error → immediate notification

---

## Credential Management in n8n

### Rules

1. **Never hardcode** API keys, tokens, or passwords in any node configuration
2. **Use n8n credential store** for all secrets — encrypted at rest with AES-256
3. **Reference credentials by name** in architecture documents (e.g., "Uses credential: `anthropic_api_key`")
4. **Rotate credentials** by updating the credential in n8n — all workflows using it update automatically
5. **One credential per service** — do not create duplicate credentials for the same API
6. **Document credential dependencies** in the architecture spec so the builder knows what to create

### Credential Types Used in Layaa OS

| Service | Credential Type | Auth Method |
|---------|----------------|-------------|
| PocketBase | Header Auth or Bearer Token | `Authorization: Bearer {token}` |
| Claude API | Header Auth | `x-api-key: {key}` |
| Resend | Header Auth | `Authorization: Bearer {key}` |
| WhatsApp Cloud | Bearer Token | `Authorization: Bearer {token}` |
| Backblaze B2 | S3-compatible (via rclone) | Access Key ID + Secret Key |

---

## Sub-Workflow Patterns

### When to Split into Sub-Workflows

Split a large workflow into sub-workflows when:

- **Shared logic:** Multiple parent workflows need the same processing (e.g., "send notification" used by budget, approval-handler, and sage-extraction)
- **Complexity exceeds 15 nodes:** Workflows with more than 15 nodes become hard to debug and maintain
- **Independent retry needs:** A sub-section needs different retry/error handling than the parent
- **Reusable utility:** Data validation, notification dispatch, logging — make these sub-workflows

### How to Call Sub-Workflows

**Option A: Execute Workflow node (direct)**
```
[Execute Workflow]
  Workflow ID: "sub_notify_v2"
  Input Data: { "channel": "email", "to": "admin@layaa.ai", "subject": "...", "body": "..." }
```
Returns the sub-workflow's output directly. Execution is synchronous — parent waits.

**Option B: HTTP Request to sub-workflow's webhook (decoupled)**
```
[HTTP Request]
  POST http://localhost:5678/webhook/notify
  Body: { "channel": "email", "to": "...", "subject": "...", "body": "..." }
```
Decoupled — sub-workflow runs independently. Use when you do not need the sub-workflow's result.

**Recommendation:** Use Execute Workflow for shared logic where you need the result. Use webhook calls for fire-and-forget notifications and logging.

---

## Performance Considerations

### Batch Processing

n8n processes items sequentially by default. For high-volume workflows:

- **Loop Over Items** with batch size 10-50 to control memory usage
- **Never load all records at once** — use pagination: `?page=1&perPage=50`
- **Limit Claude API batch calls** — Anthropic rate limits apply per-minute

### Pagination Pattern

```
[Function: Initialize]
  Set: page = 1, allItems = []
  → [Loop]
      → [HTTP Request: GET ?page={{ page }}&perPage=50]
      → [Function: Append items, check hasMore]
      → [IF: hasMore]
          → (yes) → page++, continue loop
          → (no)  → exit loop with allItems
```

### Timeout Awareness

| Context | Timeout | Implication |
|---------|---------|-------------|
| Webhook sync response | 30 seconds | Use async pattern if processing is slow |
| HTTP Request node default | 30 seconds | Increase for Claude API calls (set to 120s) |
| n8n execution timeout | 60 minutes (default) | Increase for batch jobs in n8n settings |
| PocketBase request | 10 seconds | Rarely an issue for local calls |

### Memory Efficiency

- Avoid storing large payloads in item data — fetch only needed fields using PocketBase `fields` parameter: `?fields=id,name,status`
- Use `Split Out` before heavy processing so you work with one item at a time
- Clear large intermediate data with `Set` nodes that output only what downstream nodes need

---

## Testing Workflows Before Production

### Step 1: Manual Trigger Test

Use the "Test Workflow" button in n8n. For webhook-triggered workflows, use a tool like `curl` or the n8n built-in test webhook:

```bash
curl -X POST http://localhost:5678/webhook-test/response \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: test-key" \
  -d '{"agent_id": "test_agent", "message": "Hello", "conversation_id": "conv_test"}'
```

### Step 2: Happy Path Verification

Confirm: trigger fires, all nodes execute, output is correct, database records are created/updated.

### Step 3: Error Path Verification

Test each failure scenario:
- Missing required fields (validation rejects)
- Invalid data types (type checks catch)
- External API down (error handler activates)
- Rate limit hit (retry logic works)
- Budget exhausted (guard clause blocks)

### Step 4: Idempotency Check

Fire the same trigger twice with the same data. Verify:
- No duplicate records created
- No duplicate notifications sent
- Processing result is the same

### Step 5: Load Test (for high-volume workflows)

Send 50-100 requests in quick succession. Check:
- No dropped requests
- No memory exhaustion
- Response times remain acceptable
- Rate limits on external APIs are respected

---

## Monitoring Execution History

n8n stores execution history for every workflow run. Use this for debugging and monitoring:

- **n8n UI:** Executions tab shows all runs, filterable by status (success/error/waiting)
- **Execution detail:** Click any execution to see node-by-node data flow and errors
- **Retention:** Configure execution data retention in n8n settings (default: keep last 500)
- **Production setting:** Set `EXECUTIONS_DATA_PRUNE=true` and `EXECUTIONS_DATA_MAX_AGE=168` (hours = 7 days) to prevent disk bloat

### Key Metrics to Watch

| Metric | Where to Check | Alert Threshold |
|--------|---------------|-----------------|
| Execution failure rate | n8n Executions tab | >5% in 1 hour |
| Execution duration | n8n Executions tab | >2x baseline |
| Queue depth (pending jobs) | PocketBase `job_queue` collection | Growing over time |
| Error log volume | PocketBase `error_logs` collection | >10 errors in 1 hour |
| Budget consumption rate | PocketBase `agents` collection | >50% in first week |

---

*This document is part of Ujjawal's technical knowledge base. Update as n8n capabilities evolve, new workflow patterns emerge, or Layaa OS architecture changes.*
