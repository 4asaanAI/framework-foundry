# Automation Architecture Reference

Core architecture patterns, workflow design principles, and technical standards used by Layaa AI's Automation Architect for building client automations.

---

## 7-Stage Workflow Pattern

Every automation workflow follows this 7-stage structure. No stage should be skipped, even for simple workflows.

### Stage 1: Trigger
The event that initiates workflow execution.

- **Webhook:** External system sends HTTP request to start the workflow. Used for real-time, event-driven automations.
- **Schedule:** Cron-based execution at defined intervals. Used for batch processing, periodic syncs, report generation.
- **Manual:** User-initiated execution via button or API call. Used for on-demand tasks and testing.
- **Event-based:** Triggered by a change in a connected system (new record, file upload, status change). Used for reactive automations.

Design considerations:
- Every workflow must have exactly one primary trigger
- Document the trigger source, expected payload, and frequency
- Implement deduplication at the trigger level to prevent double-processing

### Stage 2: Input Validation
Verify incoming data before any processing occurs.

- Check that all required fields are present
- Verify data types match expected schema (string, number, date, array)
- Validate value ranges and formats (email format, date format, enum values)
- Reject invalid inputs early with clear error messages
- Log validation failures for monitoring and debugging

### Stage 3: Data Transformation
Convert input data into the format needed by downstream logic.

- Map source fields to target fields explicitly
- Apply formatting rules (date conversion, string normalization, number formatting)
- Enrich data with lookups from reference tables or external APIs
- Flatten nested structures or restructure as needed
- Document every transformation rule for maintainability

### Stage 4: Core Logic
Execute the business rules that deliver the automation's value.

- Implement decision trees and conditional branching
- Execute AI/LLM calls for classification, extraction, or generation
- Apply business rules (calculations, filtering, routing, matching)
- Handle multi-step processing with intermediate state management
- Keep logic modular: each decision point should be a separate node

### Stage 5: Output Formatting
Structure the results for consumption by downstream systems or users.

- Format response payloads according to destination API requirements
- Generate files (CSV, PDF, JSON) with correct encoding and structure
- Compose notifications (email, Slack, WhatsApp) with appropriate content
- Ensure output data types match destination expectations
- Include metadata (timestamp, workflow ID, version) in outputs

### Stage 6: Error Handling
Manage failures gracefully at every stage.

- **Try-catch:** Wrap risky operations (API calls, data parsing) in error handlers
- **Retry logic:** Implement exponential backoff for transient failures (network timeouts, rate limits). Default: 3 retries with 1s, 2s, 4s delays.
- **Fallback actions:** Define what happens when retries are exhausted (queue for manual review, use cached data, skip and continue)
- **Alerting:** Send notifications for failures that require human intervention
- **Circuit breaker:** Disable workflow temporarily if failure rate exceeds threshold

### Stage 7: Logging
Track execution for debugging, auditing, and performance monitoring.

- Log workflow start, completion, and duration
- Record key data points at each stage (input counts, transformation results, output counts)
- Capture error details with full context (stage, input data, error message, stack trace)
- Build audit trail for compliance-sensitive operations
- Track performance metrics (execution time per stage, API response times, throughput)

---

## n8n Mental Model

### Core Concepts

**Nodes** are individual operations within a workflow. Each node performs one action:
- HTTP Request: Call external APIs
- Function/Code: Execute custom JavaScript
- IF/Switch: Branch logic based on conditions
- Set: Create or modify data fields
- Merge: Combine data from multiple branches
- Wait: Pause execution for time or webhook response

**Connections** define data flow between nodes. Data passes from one node's output to the next node's input. A node can have multiple outputs (branching) or multiple inputs (merging).

**Workflows** are complete automation sequences. Each workflow has one trigger and one or more execution paths. Workflows should be self-contained and focused on a single business process.

**Sub-workflows** are reusable components called by other workflows. Use sub-workflows for:
- Shared logic used by multiple workflows (e.g., data validation, notification sending)
- Complex operations that benefit from isolation and independent testing
- Reducing duplication across the automation suite

**Error workflows** are dedicated flows triggered when a main workflow fails. They handle:
- Logging failure details to a central error store
- Sending alerts to the operations team
- Queuing failed items for retry or manual review

**Credentials** are secure storage for API keys, OAuth tokens, and authentication details. Credentials are:
- Stored encrypted in n8n's credential store
- Referenced by name in nodes, never hardcoded
- Scoped to specific node types for security
- Rotatable without modifying workflows

---

## Integration Patterns

### REST API Integration
- **Authentication:** Support API key (header/query), OAuth 2.0 (authorization code, client credentials), Bearer token, and Basic Auth
- **Pagination:** Implement cursor-based or offset-based pagination. Always paginate; never assume all data fits in one response.
- **Rate limiting:** Track rate limit headers (X-RateLimit-Remaining, Retry-After). Implement backoff when approaching limits. Queue requests if necessary.
- **Response handling:** Parse response bodies, check HTTP status codes, handle non-200 responses as errors

### Webhook Receivers
- **Validation:** Verify webhook signatures using HMAC or other methods provided by the sender
- **Security:** Restrict accepted source IPs where possible. Validate payload structure before processing.
- **Idempotency:** Use webhook event IDs to detect and skip duplicate deliveries
- **Acknowledgment:** Return 200 status immediately, then process asynchronously if processing is slow

### Database Connections
- **Query optimization:** Use parameterized queries. Select only needed columns. Apply filters at the database level, not in the workflow.
- **Connection pooling:** Reuse connections where possible. Close connections after use in one-off scripts.
- **Transactions:** Use transactions for multi-step writes to maintain data consistency
- **Timeouts:** Set query timeouts to prevent long-running queries from blocking workflows

### File Processing
- **Upload:** Validate file type and size before processing. Store in S3-compatible storage.
- **Parse:** Handle encoding variations (UTF-8, Latin-1). Support CSV, JSON, XML, PDF, Excel formats.
- **Transform:** Apply transformations row-by-row for large files. Stream processing for files exceeding memory limits.
- **Store:** Use structured naming conventions (client/date/type/filename). Set retention policies.

### AI/LLM Integration
- **Prompt management:** Store prompts as versioned templates. Separate prompt logic from workflow logic.
- **Response parsing:** Define expected output structure. Parse and validate LLM responses before using downstream. Handle refusals and unexpected formats.
- **Cost control:** Track token usage per workflow execution. Set budget alerts. Use appropriate model sizes (smaller models for simple tasks).
- **Fallback:** Define behavior when AI response is unusable (retry with modified prompt, fall back to rule-based logic, queue for human review)

---

## Data Handling Principles

### Schema-First Design
Define the expected data structure before building any workflow logic. Document:
- Field names, types, and descriptions
- Required vs. optional fields
- Allowed values and ranges
- Nested structure and array formats

### Validate at Boundaries
Check data integrity when it enters the workflow (from trigger or external API) and when it leaves (to destination system or output). Never trust data from external sources without validation.

### Transform Explicitly
Never assume data format. If a field should be a date, explicitly parse it. If a field should be a number, explicitly convert it. Document every transformation rule.

### Handle Nulls and Empties
Every field in incoming data could be null, undefined, empty string, or missing entirely. Build defensive logic:
- Default values for optional fields
- Conditional logic for nullable fields
- Empty array handling (skip processing, not error)
- Distinguish between "field is null" and "field is missing"

### Preserve Originals
Keep raw incoming data alongside transformed versions. This enables:
- Debugging when transformations produce unexpected results
- Reprocessing with corrected transformation logic
- Audit trail showing original source data

---

## Security Fundamentals

### Secrets Management
- Store all API keys, passwords, and tokens in environment variables or the platform's credential store
- Never include secrets in workflow definitions, logs, or error messages
- Use separate credential sets for staging and production environments
- Rotate credentials on a regular schedule and immediately after any suspected compromise

### Access Control
- Apply principle of least privilege: each integration should have the minimum permissions needed
- Use service accounts rather than personal accounts for API access
- Document all access grants and review quarterly
- Revoke access immediately when no longer needed

### Data Protection
- Encrypt sensitive data at rest (database encryption, encrypted file storage)
- Use HTTPS/TLS for all data in transit
- Mask or redact sensitive fields in logs (PII, financial data, credentials)
- Apply data retention policies: delete data that is no longer needed

### Audit and Monitoring
- Log all data access operations with user/service identity and timestamp
- Monitor for unusual patterns (bulk data access, off-hours activity, failed authentication)
- Maintain audit trail for compliance-sensitive workflows
- Set up alerts for security-relevant events
