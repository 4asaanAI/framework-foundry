# Ujjawal — KB — Step-by-Step Workflow Building Method

> For builders — how to implement an Ujjawal architecture document, step by step, from trigger setup through end-to-end testing.

---

## Step-by-Step Workflow Building Method

### For Builders — How to Implement an Ujjawal Architecture Doc

**Step 1: Set Up the Trigger**
- Create the trigger node exactly as specified
- Configure authentication as documented
- Test: can you fire the trigger and see it in n8n execution log?

**Step 2: Build the Validation Layer**
- Add validation nodes (IF, Function) for each check in Stage 2
- Build the error response path for validation failures
- Test: send bad data and verify it's rejected correctly

**Step 3: Build Normalization**
- Add transformation nodes (Set, Function) for data mapping
- Add enrichment calls (database lookups, API calls for additional data)
- Test: verify transformed data matches the internal schema exactly

**Step 4: Build Core Logic**
- Implement each processing step as documented
- Wire up external API calls with proper error handling
- Test each step independently before chaining

**Step 5: Build Decision Branches**
- Implement all branches (including the default/"else" path)
- Verify each branch terminates or merges as documented
- Test: exercise every branch with appropriate test data

**Step 6: Build Outputs**
- Implement primary output (API response, database write, notification)
- Implement all side effects (logs, notifications, cache updates)
- Test: verify all outputs appear where expected

**Step 7: Build Completion Logic**
- Add logging nodes
- Add monitoring/alerting
- Configure the error workflow
- Test: verify logs are written, alerts fire on threshold

**Step 8: End-to-End Test**
- Run the complete workflow with happy-path data
- Run with error-case data for each failure mode
- Run duplicate trigger to test idempotency
- Record test results in the testing checklist

---

## API Integration Patterns

### Standard REST API Integration Pattern

```
HTTP Request Node Configuration:
├── Method: GET/POST/PUT/PATCH/DELETE
├── URL: https://api.example.com/v1/resource
├── Authentication: [credential_name]
├── Headers:
│   ├── Content-Type: application/json
│   └── Accept: application/json
├── Body (for POST/PUT): {{ $json.payload }}
├── Options:
│   ├── Timeout: 30000ms
│   ├── Retry on Fail: true
│   ├── Max Retries: 3
│   └── Wait Between Retries: 2000ms
└── Error Handling: Use Error Output → [Error Handler]
```

### Webhook Receiver Pattern

```
Webhook Node Configuration:
├── HTTP Method: POST
├── Path: /webhook/[workflow-name]
├── Authentication: Header Auth (X-Api-Key)
├── Response Mode: When Last Node Finishes (async) or Immediately (sync)
├── Response Code: 200 (success), 202 (accepted for async)
└── Response Data: { "status": "accepted", "execution_id": "..." }
```

### Pagination Pattern (for APIs returning large datasets)

```
Loop Node:
├── Initialize: page = 1, all_items = []
├── HTTP Request: GET /api/resource?page={{ page }}&limit=100
├── Check: response.has_more === true?
│   ├── Yes: page++, append items, continue loop
│   └── No: append items, exit loop
└── Output: all_items
```

### Webhook-to-Webhook Pattern (System-to-System)

```
System A (n8n workflow 1):
  → Process data
  → HTTP Request POST to System B's webhook URL
  → Handle response

System B (n8n workflow 2):
  → Webhook receives data
  → Process
  → Return response
```

### Rate Limiting Pattern

```
Before API Call:
├── Read rate_limit_tracker from PocketBase
├── If calls_this_minute >= limit:
│   ├── Wait Node: (60 - seconds_elapsed) seconds
│   └── Reset counter
├── Make API call
└── Increment calls_this_minute in tracker
```

---

*This document is part of Ujjawal's technical knowledge base. Update as new building patterns and integration approaches emerge.*
