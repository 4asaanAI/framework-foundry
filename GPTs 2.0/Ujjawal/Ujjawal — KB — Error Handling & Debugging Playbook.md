# Ujjawal — KB — Error Handling & Debugging Playbook

> Comprehensive error handling strategy (three levels), retry patterns, debugging workflow, and dead letter queue pattern for critical workflows.

---

## Error Handling Strategy (Three Levels)

### Level 1: Node-Level Error Handling
- Configure "On Error" behavior per node: Stop, Continue, or Use Error Output
- For API calls: always use error output path to handle failures gracefully
- For database operations: catch unique constraint violations, connection failures

### Level 2: Workflow-Level Error Handling
- Every workflow must have an Error Trigger workflow
- Error Trigger captures: workflow name, node that failed, error message, input data, timestamp
- Error Trigger sends: notification to appropriate channel + logs to error table

### Level 3: System-Level Monitoring
- Monitor execution failure rate (>5% = investigate, >10% = alert)
- Monitor execution duration (>2x baseline = investigate)
- Monitor queue depth (growing = bottleneck)
- Daily summary of errors to Kaiser (System Administrator Agent)

---

## Retry Strategy Patterns

| Error Type | Retry Strategy | Max Retries | Backoff |
|-----------|---------------|-------------|---------|
| Timeout (API) | Exponential backoff | 3 | 2s, 4s, 8s |
| Rate limit (429) | Wait for Retry-After header | 5 | Header value or 60s |
| Server error (5xx) | Fixed delay | 3 | 30s |
| Auth failure (401/403) | No retry — notify | 0 | N/A |
| Bad request (400) | No retry — log and notify | 0 | N/A |
| Connection refused | Exponential backoff | 5 | 5s, 10s, 20s, 40s, 80s |
| DNS resolution failure | Fixed delay | 3 | 60s |

---

## Debugging Workflow

When a workflow fails:
1. **Check the execution log** — n8n shows exactly which node failed and the error
2. **Check the input data** — Was the data malformed? Missing fields?
3. **Check external dependencies** — Is the API down? Is the database accessible?
4. **Check credentials** — Has the API key expired? Was OAuth token refreshed?
5. **Check rate limits** — Are we hitting volume limits?
6. **Reproduce locally** — Can you trigger the same error with the same input?
7. **Document the fix** — Add to error patterns memory for future reference

---

## Dead Letter Queue Pattern

For critical workflows that cannot lose data:
```
Main Workflow → [fails] → Error Handler → Dead Letter Queue (PocketBase collection)
                                        → Notification to admin
Dead Letter Processor (scheduled) → Retries failed items → Moves to success or permanent failure
```

### Implementation Details

**Dead Letter Collection Schema:**
- `id`: Auto-generated
- `source_workflow`: Name of the workflow that failed
- `failed_node`: Node where failure occurred
- `error_message`: Full error message
- `input_data`: Original payload (JSON)
- `retry_count`: Number of retry attempts
- `max_retries`: Maximum retries before permanent failure
- `status`: pending / retrying / succeeded / permanent_failure
- `created_at`: Timestamp of initial failure
- `last_retry_at`: Timestamp of last retry attempt
- `resolved_at`: Timestamp of resolution (success or permanent failure)

**Dead Letter Processor Workflow:**
1. Schedule Trigger: runs every 15 minutes
2. Query PocketBase: status = "pending" OR (status = "retrying" AND last_retry_at < 15min ago)
3. For each item:
   - If retry_count >= max_retries → mark as permanent_failure → notify admin
   - Else → attempt reprocessing → if success, mark succeeded → if fail, increment retry_count
4. Log results

---

## Error Message Standards

When logging errors, include:
- **Workflow name**: Which workflow failed
- **Node name**: Which specific node
- **Error type**: Timeout, auth, validation, etc.
- **Error message**: The raw error message
- **Input data**: What data was being processed (redact PII)
- **Timestamp**: When it happened (IST)
- **Execution ID**: n8n execution ID for reference

### Error Notification Template
```
WORKFLOW ERROR ALERT
Workflow: [workflow_name]
Node: [node_name]
Error: [error_type] — [error_message]
Time: [timestamp IST]
Execution: [execution_id]
Action Required: [Yes/No — with guidance]
```

---

*This document is part of Ujjawal's technical knowledge base. Update as new error patterns emerge and debugging learnings accumulate.*
