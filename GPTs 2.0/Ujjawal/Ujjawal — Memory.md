# Ujjawal — Automation Architect | Memory

> This file contains Ujjawal's initial memory context — architecture decisions made, workflow patterns used, integration learnings, and builder feedback. Memories here are seeded from existing engagements and will grow as Ujjawal operates on Layaa OS.

---

## Architecture Decisions Made

### EduFlow — The Aaryans School
- **Decision:** Use Bolt AI for the web portal + n8n for all backend automation
- **Rationale:** School needs a clean, simple UI (Bolt AI strength) and event-driven workflows for attendance, fee tracking, notifications (n8n strength). No need for custom backend — all logic fits within n8n's capability.
- **Architecture Pattern:** Bolt AI frontend → PocketBase (data store) → n8n (automation layer) → WhatsApp Business API (notifications)
- **Key Design Choices:**
  - Attendance workflow: Webhook trigger from Bolt AI → Validate student exists → Check if already marked → Write to PocketBase → If absent, trigger WhatsApp notification workflow
  - Fee tracking: Scheduled daily reconciliation workflow that checks payment status and sends reminders for overdue fees
  - Parent notifications: Separate notification workflow called by other workflows — single point for WhatsApp/SMS logic
- **Confidence:** High
- **Date:** March 2026

### EduFlow v2 — SSA (Akshat Sharma)
- **Decision:** Same core architecture as Aaryans + Relevance AI for AI tutor component
- **Rationale:** Core school management is identical to Aaryans (reuse architecture). AI tutor requires document understanding and natural language — Relevance AI is the right fit.
- **Architecture Pattern:** Same as Aaryans + Relevance AI agent for AI tutor → n8n orchestration for session management
- **Key Design Choices:**
  - AI tutor: Relevance AI agent with school curriculum as knowledge base. Students ask questions via the portal. Agent responds with curriculum-aligned answers.
  - Assignment generation: Relevance AI generates assignments based on topic + difficulty level → n8n formats as PDF → stored in PocketBase
  - Phase 2 feature — kept separate from core MVP
- **Confidence:** Medium (AI tutor accuracy needs real-world validation)
- **Date:** March 2026

### CA AI Agent — Document Intake Workflow
- **Decision:** WhatsApp Business API → n8n (intake orchestration) → Relevance AI (document extraction) → PocketBase (structured data store)
- **Rationale:** CAs receive documents via WhatsApp. We need to extract structured financial data from unstructured documents (images, PDFs). Relevance AI handles the AI extraction; n8n orchestrates the flow.
- **Key Design Choices:**
  - WhatsApp webhook receives new message → n8n checks if it's a document (image/PDF) → Sends to Relevance AI for extraction → Stores structured data in PocketBase linked to client PAN
  - Human review checkpoint before any data is used for tax filing
  - Error path: If Relevance AI confidence < 80%, route to manual review queue instead of auto-processing
- **Confidence:** Medium (document variety is high — extraction accuracy varies)
- **Date:** March 2026

---

## Workflow Patterns Used

### Pattern: Notification Hub
**Problem:** Multiple workflows need to send notifications (WhatsApp, SMS, email). Duplicating notification logic in every workflow is unmaintainable.
**Solution:** Single "Notification Hub" workflow called by all other workflows via Execute Workflow node. Hub handles: channel selection (WhatsApp → SMS fallback → email), template selection, rate limiting, delivery logging.
**Used in:** EduFlow (Aaryans), EduFlow v2 (SSA)
**Confidence:** High — reusable across all projects

### Pattern: Idempotent Webhook Receiver
**Problem:** Webhooks can fire multiple times for the same event (network retries, client bugs).
**Solution:** Generate idempotency key from payload (hash of unique fields). Check against dedup table before processing. If exists, return success without reprocessing. TTL on dedup records = 24 hours for most use cases.
**Used in:** All webhook-triggered workflows
**Confidence:** High — essential pattern

### Pattern: Dead Letter Queue
**Problem:** Critical data cannot be lost even if workflows fail.
**Solution:** Error handler writes failed items to a Dead Letter Queue collection in PocketBase with: original payload, error details, retry count, timestamp. Scheduled "DLQ Processor" workflow retries items. After 5 retries, marks as permanent failure and notifies admin.
**Used in:** CA AI Agent document intake, fee payment processing
**Confidence:** High — required for any financial or compliance-critical workflow

### Pattern: Scheduled Reconciliation
**Problem:** Data drifts between systems over time. Webhooks can be missed.
**Solution:** Scheduled workflow (daily/hourly) that compares records between source and destination systems. Identifies mismatches. Creates tasks for reconciliation. Sends summary to admin.
**Used in:** Fee tracking (EduFlow), payment reconciliation
**Confidence:** High

---

## Tool Selection Rationale

| Decision | Tool Chosen | Alternative Considered | Why Chosen |
|----------|-------------|----------------------|------------|
| School portal | Bolt AI | Next.js | Faster delivery, school UI is straightforward, no need for framework complexity |
| Automation backbone | n8n | Make, Zapier | Self-hosted (data residency), more flexible error handling, no per-execution pricing |
| Document extraction | Relevance AI | Custom Python + GPT API | No-code setup, built-in document processing, faster iteration |
| Data storage | PocketBase | PostgreSQL | Self-hosted, real-time subscriptions, auth built-in, lightweight for current scale |
| Notifications | WhatsApp Business API via n8n | Twilio | Direct API is cheaper, client's users are on WhatsApp, India-specific |

---

## Integration Challenges Encountered

### WhatsApp Business API
- **Challenge:** 24-hour messaging window — cannot send template messages to users who haven't messaged in 24 hours without using pre-approved templates.
- **Resolution:** All outbound notifications use pre-approved message templates. Template approval takes 24-48 hours — plan ahead.
- **Lesson:** Always factor in template approval time when designing notification workflows.

### PocketBase Trigger Limitations
- **Challenge:** PocketBase triggers (real-time) work via WebSocket. If n8n disconnects, events during the disconnect are lost.
- **Resolution:** Use PocketBase triggers for non-critical real-time features. For critical events, use webhook-based triggers from the application layer. Add scheduled reconciliation as a safety net.
- **Lesson:** Never rely solely on PocketBase triggers for critical workflows. Always have a reconciliation backup.

### Relevance AI Response Time
- **Challenge:** Document extraction via Relevance AI can take 15-45 seconds depending on document complexity.
- **Resolution:** Design all AI processing workflows as asynchronous. Webhook receives the request, returns 202 Accepted immediately, processes in background, sends result via callback.
- **Lesson:** Always design AI-powered workflows as async. Never block a webhook response on AI processing.

---

## Builder Feedback

### From Implementation Team
- **Positive:** 7-stage specs are very clear. Builders can start immediately without asking questions.
- **Improvement:** Include sample n8n node configurations (not just descriptions) for complex Function nodes. Pseudocode is good; actual JS snippets for tricky transformations would be better.
- **Request:** For each workflow, include a "smoke test" — the simplest possible test that proves the workflow is wired correctly before testing edge cases.
- **Action taken:** Added "smoke test" section to builder handoff template. Will include JS snippets for complex transformations going forward.

---

## Error Patterns

| Error | Frequency | Root Cause | Fix |
|-------|-----------|-----------|-----|
| WhatsApp API 429 (rate limit) | Occasional | Burst of notifications after school attendance submission | Added rate limiting node (max 30 messages/minute) before WhatsApp API call |
| PocketBase timeout on large queries | Rare | Querying all students without pagination | Added pagination to all PocketBase read operations (limit: 100 per query) |
| Relevance AI extraction returns empty | Occasional | Document image quality too low or format unrecognized | Added pre-check for image quality (resolution, file size). Route low-quality to manual queue |
| Webhook duplicate processing | Early bug | Idempotency key not implemented in first version | Implemented idempotent webhook receiver pattern (now standard) |

---

## Successful Architecture Patterns

### "Hub and Spoke" Architecture (Reusable)
```
                    ┌── Attendance Workflow
                    │
Bolt AI Portal ─── n8n Hub ─── Fee Workflow
                    │
                    ├── Notification Hub ── WhatsApp/SMS
                    │
                    └── Report Generation
```
**Why it works:** Central n8n instance handles all business logic. Bolt AI is presentation layer only. Each workflow is independent but shares common utilities (notification hub, logging). Easy to add new "spokes" without touching existing workflows.

### "Queue-Process-Confirm" for AI Workflows
```
Intake (webhook) → Queue (PocketBase) → Process (Relevance AI) → Confirm (human review) → Commit (final action)
```
**Why it works:** Decouples intake from processing. AI processing is async and can fail without losing data. Human review checkpoint before any irreversible action. Audit trail at every step.

---

## Self-Learning Log

| Date | Learning | Category | Confidence |
|------|---------|----------|------------|
| Mar 2026 | Bolt AI + n8n + PocketBase is a powerful standard stack for SME web apps | decision | 0.9 |
| Mar 2026 | Always design AI workflows as async — never block on LLM processing | process | 0.95 |
| Mar 2026 | WhatsApp template approval takes 24-48 hours — build into project timeline | company | 0.9 |
| Mar 2026 | PocketBase triggers can miss events during reconnection — add reconciliation | process | 0.9 |
| Mar 2026 | Idempotent webhook receiver is mandatory for all production workflows | decision | 1.0 |
| Mar 2026 | Notification Hub pattern saves significant development time across projects | process | 0.9 |
| Apr 2026 | Builders want smoke tests in addition to full test checklists | preference | 0.85 |
| Apr 2026 | Include JS snippets for complex Function node transformations per builder request | preference | 0.85 |

---

*This memory file initializes Ujjawal's operational context on Layaa OS. As Ujjawal designs more architectures and receives builder feedback, this memory will grow through the `write_memory()` self-learning protocol. Memories here are seeded — all future memories will be added automatically by Ujjawal and Sage.*
