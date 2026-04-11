# QA & Validation Framework

**Document Owner:** Shubham Sharma, CTO
**Last Updated:** April 2026
**Classification:** Internal Reference

---

## Overview

This document defines Layaa AI's quality assurance and validation framework for all automation systems, AI agents, and client deliverables. Given our lean team structure and AI-assisted development approach, this framework prioritises high-impact testing strategies that catch critical issues without requiring a large QA team.

All testing follows the principle: **catch it before the client sees it.**

---

## 1. Testing Methodology

### 1.1 Functional Testing

Verify that every feature works as specified.

**Scope:**
- Each n8n workflow executes correctly for valid inputs.
- PocketBase CRUD operations produce correct results.
- Frontend components render correctly and respond to user actions.
- LLM integrations return appropriate responses for given prompts.
- Approval flows route correctly based on tier and threshold.
- Notification triggers fire at the right events.

**Approach:**
- Test each workflow independently with known inputs and expected outputs.
- Use PocketBase's API directly to verify data state after workflow execution.
- For UI components, test critical user paths manually (login, primary actions, error states).
- For LLM-dependent features, test with a representative set of inputs (minimum 10 per use case) and verify output quality.

**Test Case Template:**

| Field | Description |
|-------|-------------|
| Test ID | Unique identifier (e.g., FT-001) |
| Feature | Feature or workflow under test |
| Precondition | Required state before test execution |
| Input | Test data / trigger action |
| Expected Output | What should happen |
| Actual Output | What actually happened |
| Status | Pass / Fail / Blocked |
| Notes | Additional observations |

### 1.2 Integration Testing

Verify that components work together correctly across system boundaries.

**Scope:**
- n8n workflow to PocketBase data flow.
- Frontend to PocketBase real-time subscriptions (WebSocket).
- n8n workflow to external APIs (Claude, Google ADK, client systems).
- Workflow-to-workflow chains (e.g., approval-handler triggers notification workflow).
- Authentication flow end-to-end (PocketBase auth to frontend session to n8n webhook validation).

**Approach:**
- Test the complete data path from trigger to final output, crossing all system boundaries.
- Verify data integrity at each boundary (no data loss, no corruption, correct format).
- Test with production-like data volumes and formats.
- Specifically test the 7 core n8n workflows in combination:
  1. sage-extraction + scheduled-memory (memory pipeline)
  2. approval-handler + notification (approval pipeline)
  3. delegation + response (task delegation pipeline)
  4. budget + notification (budget alert pipeline)

### 1.3 Edge Case Testing

Verify graceful handling of unusual, unexpected, or boundary conditions.

**Standard Edge Cases to Test for Every Workflow:**

| Category | Test Cases |
|----------|-----------|
| Empty/Null Data | Missing required fields, null values, empty strings, empty arrays |
| Boundary Values | Maximum string length, zero amounts, negative numbers, future dates, past dates |
| Special Characters | Hindi text (Unicode), emojis, HTML entities, SQL injection patterns, script injection patterns |
| Volume Extremes | Single record, maximum batch size, zero records |
| Timing | Simultaneous requests, requests during deployment, requests at midnight (date boundary) |
| Network | Timeout from external API, partial response, connection drop mid-workflow |
| Authentication | Expired token, invalid token, missing token, token for wrong user |
| Data Conflicts | Duplicate records, concurrent updates to same record, stale data reads |

### 1.4 Performance Testing

Verify the system performs adequately under expected and peak loads.

**Metrics to Measure:**

| Metric | Target (Typical SME) | Method |
|--------|---------------------|--------|
| Webhook response time | < 2 seconds (sync), < 500ms (async acknowledgement) | Timed API calls |
| n8n workflow execution | < 10 seconds for simple, < 30 seconds for complex | n8n execution logs |
| PocketBase query response | < 200ms for single record, < 1 second for list queries | Direct API timing |
| Frontend page load | < 3 seconds on 4G connection | Browser DevTools / Lighthouse |
| LLM response time | < 5 seconds for Haiku, < 15 seconds for Sonnet | API call timing |
| Concurrent users | Support 20 simultaneous users minimum | Load test with concurrent requests |

**Approach:**
- Baseline measurement under normal load (1-5 concurrent users).
- Stress test at 2x expected peak (typically 10-20 concurrent users for SME).
- Identify and document bottlenecks.
- Verify LLM token consumption stays within budget thresholds.

### 1.5 Security Testing

Verify the system is secure against common attack vectors.

**Security Checklist:**

| Check | Description | Pass Criteria |
|-------|-------------|---------------|
| API Key Storage | All API keys in n8n credential store | No keys in code, config files, browser storage, or logs |
| Authentication | All endpoints require valid auth | No unauthenticated access to protected resources |
| Authorisation | Users can only access their own data | Cross-user data access blocked at PocketBase rule level |
| Input Validation | All inputs sanitised | SQL injection, XSS, and command injection patterns rejected |
| Data in Transit | HTTPS enforced | No HTTP endpoints exposed |
| Data at Rest | Sensitive data encrypted or access-controlled | PocketBase files not publicly accessible |
| Logging | Sensitive data not logged | API keys, passwords, and unnecessary PII absent from logs |
| CORS | Restricted to known origins | No wildcard CORS in production |
| Rate Limiting | Abuse prevention on public endpoints | Repeated rapid requests throttled |
| Backup Security | Backups encrypted and access-controlled | Backblaze B2 bucket not publicly accessible |

---

## 2. Bug Severity Classification

### Severity Levels

| Severity | Label | Definition | Examples |
|----------|-------|-----------|----------|
| **S0** | Critical | System is down or data is being corrupted. Client business operations are blocked. | Workflow producing wrong financial calculations; database corruption; authentication completely broken; data loss |
| **S1** | Major | Significant feature is broken with no workaround. Client operations are degraded. | Key workflow failing for specific input types; approval routing sending to wrong person; notifications not firing; performance degraded beyond usable thresholds |
| **S2** | Minor | Feature is broken but a workaround exists, or the impact is limited. | Formatting issue in reports; non-critical field not saving; slow response under edge conditions; error message unclear |
| **S3** | Cosmetic | Visual or UX issue that does not affect functionality. | Misaligned UI element; typo in label; inconsistent colour; minor spacing issue |

### Severity-Based Response Times

| Severity | Response Time | Resolution Target | Escalation |
|----------|--------------|-------------------|------------|
| S0 | 30 minutes | 4 hours | Immediate CTO notification |
| S1 | 2 hours | 1 business day | CTO notified within 4 hours |
| S2 | 1 business day | Next sprint | Included in sprint planning |
| S3 | 2 business days | Backlog (best effort) | No escalation required |

---

## 3. Triage Process

### Bug Triage Workflow

1. **Report:** Bug reported with reproduction steps, expected vs actual behaviour, severity assessment, and screenshots/logs.
2. **Classify:** Assign severity (S0-S3) based on definitions above. Re-classify if reporter's assessment differs from framework criteria.
3. **Assign:** Route to appropriate owner (CTO for S0, project lead for S1, sprint backlog for S2/S3).
4. **Investigate:** Root cause analysis. Document findings.
5. **Fix:** Implement fix. Follow the hotfix procedure for S0/S1 during production.
6. **Verify:** QA verifies the fix resolves the issue and does not introduce regressions.
7. **Close:** Update bug status, notify reporter, update release notes if applicable.

### Triage Meeting

- **Frequency:** Ad-hoc for S0/S1; weekly for S2/S3 backlog review.
- **Attendees:** CTO + project lead (+ client representative for S0 during active engagement).
- **Agenda:** Review new bugs, re-prioritise backlog, review resolution progress.

---

## 4. Release Checklist

### 4.1 Pre-Deploy Checklist

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | All S0 and S1 bugs resolved and verified | QA | |
| 2 | All functional tests passing | QA | |
| 3 | Integration tests passing | QA | |
| 4 | Performance benchmarks within acceptable range | QA | |
| 5 | Security checklist completed | CTO | |
| 6 | Database migration scripts tested (if applicable) | Dev | |
| 7 | Backup taken of current production state | DevOps | |
| 8 | Rollback plan documented and tested | DevOps | |
| 9 | Client notified of deployment window | Project Lead | |
| 10 | n8n workflows exported as backup | Dev | |
| 11 | Environment variables and credentials verified | Dev | |
| 12 | Release notes prepared | Project Lead | |

### 4.2 Deploy Checklist

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | Put system in maintenance mode (if applicable) | DevOps | |
| 2 | Deploy database changes first | Dev | |
| 3 | Deploy backend/n8n workflow changes | Dev | |
| 4 | Deploy frontend changes | Dev | |
| 5 | Verify all n8n workflows are active and responding | Dev | |
| 6 | Verify PocketBase is accessible and data intact | Dev | |
| 7 | Run smoke tests (critical path verification) | QA | |
| 8 | Remove maintenance mode | DevOps | |

### 4.3 Post-Deploy Checklist

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | Verify all workflows executing correctly in production | QA | |
| 2 | Check error logs for unexpected errors (15-minute watch) | Dev | |
| 3 | Verify monitoring/alerting is active | DevOps | |
| 4 | Confirm client-facing functionality works (smoke test from client perspective) | QA | |
| 5 | Notify client that deployment is complete | Project Lead | |
| 6 | Monitor for 1 hour post-deploy for anomalies | Dev | |
| 7 | Update deployment log with version, time, and changes | DevOps | |
| 8 | Archive release artefacts | DevOps | |

---

## 5. Hotfix Procedure

For S0 and S1 bugs discovered in production.

### Hotfix Workflow

1. **Assess (0-30 min):** Confirm the issue, assess impact, determine if a hotfix is needed or if a workaround can hold.
2. **Communicate (immediately):** Notify affected clients. Provide estimated timeline for fix.
3. **Isolate (30-60 min):** Identify root cause. Determine minimal fix scope.
4. **Fix (1-4 hours):** Implement the narrowest possible fix. Do not bundle other changes.
5. **Test (30-60 min):** Test the fix against the specific failure scenario. Run core regression tests (critical path only for speed).
6. **Deploy:** Follow the deploy checklist (abbreviated for hotfix -- skip maintenance mode if not needed).
7. **Verify (30 min):** Confirm fix in production. Monitor for 30 minutes.
8. **Post-mortem (within 48 hours):** Document root cause, fix applied, prevention measures.

### Hotfix Rules

- Hotfixes are only for S0 and S1 issues in production.
- Every hotfix must have a rollback plan before deployment.
- Hotfixes skip the full QA cycle but must pass targeted regression tests.
- All hotfixes are reviewed by CTO before deployment.
- Post-mortem is mandatory, not optional.

---

## 6. Definition of Done (DoD)

A feature or workflow is "done" when ALL of the following criteria are met:

### For n8n Workflows

- [ ] Workflow follows the 7-stage building method (Trigger, Validation, Normalisation, Logic, Branching, Output, Logging).
- [ ] Workflow handles errors gracefully (no silent failures).
- [ ] Error scenarios trigger appropriate logging and alerts.
- [ ] API keys are stored in n8n credential store.
- [ ] Workflow is tested with valid inputs and produces correct outputs.
- [ ] Workflow is tested with invalid inputs and rejects them gracefully.
- [ ] Workflow handles edge cases documented in the test plan.
- [ ] Workflow execution time is within performance targets.
- [ ] Workflow is documented (purpose, trigger, inputs, outputs, error handling).
- [ ] Workflow naming follows convention: `[project]-[function]-[version]`.

### For Frontend Components

- [ ] Component renders correctly in Chrome and Safari (minimum browser support).
- [ ] Component is responsive (mobile, tablet, desktop).
- [ ] Component handles loading states, error states, and empty states.
- [ ] Form components validate input before submission.
- [ ] Component is accessible (keyboard navigation, sufficient contrast).
- [ ] Component handles offline mode gracefully (where applicable).
- [ ] Component is tested for critical user paths.

### For PocketBase Collections

- [ ] Collection schema matches the architecture design.
- [ ] Validation rules are configured (required fields, type constraints).
- [ ] API rules are configured (create, read, update, delete permissions).
- [ ] Indexes are created for frequently queried fields.
- [ ] Real-time subscriptions work correctly (if applicable).
- [ ] Sample data is available for testing.

### For the Overall Deliverable

- [ ] All functional requirements from the scope document are implemented.
- [ ] All S0 and S1 bugs are resolved.
- [ ] Technical documentation is complete.
- [ ] Client-facing documentation is complete (user guides, runbooks).
- [ ] Client has reviewed and approved the deliverable.

---

## 7. Acceptance Criteria Standards

Every user story or feature must have acceptance criteria defined before development begins.

### Format

Use the Given-When-Then format:

```
Given [precondition]
When [action]
Then [expected result]
```

### Examples

**Approval Workflow:**
```
Given a budget request exceeds Tier 1 threshold (INR 10,000)
When the request is submitted
Then the workflow routes to the Tier 2 approver and sends a notification
```

**Memory Extraction (Sage):**
```
Given a conversation contains a client preference ("prefers email over WhatsApp")
When the sage-extraction workflow processes the conversation
Then the preference is stored in the memory collection with correct tags and source reference
```

**Error Handling:**
```
Given the Claude API returns a 429 (rate limit) error
When the workflow encounters the error
Then the workflow retries after 30 seconds (up to 3 retries) and logs the rate limit event
```

### Acceptance Criteria Rules

1. Every story has at least 3 acceptance criteria (happy path, error path, edge case).
2. Criteria are testable (specific, measurable, unambiguous).
3. Criteria are agreed upon by the developer and reviewer before development starts.
4. Criteria include performance expectations where relevant ("response within 2 seconds").
5. Criteria explicitly state what should NOT happen where ambiguity exists.

---

## 8. Regression Testing Approach

### What Is Regression Testing

Verify that new changes have not broken existing functionality. Critical in our architecture because n8n workflows, PocketBase rules, and frontend components are interconnected.

### Regression Test Suite

Maintain a core regression test suite covering:

| Category | Tests | Run Frequency |
|----------|-------|---------------|
| Authentication | Login, logout, token refresh, permission checks | Every release |
| Core Workflows | All 7 core n8n workflows (sage-extraction, approval-handler, delegation, response, scheduled-memory, budget, notifications) | Every release |
| Data Integrity | CRUD operations on all primary PocketBase collections | Every release |
| Critical User Paths | Top 5 most-used frontend features | Every release |
| Integration Points | API calls to external services (Claude, Google ADK) | Every release |
| Security | Authentication bypass attempts, API key exposure checks | Every release |

### Regression Test Execution

- **Full regression:** Run before every production release.
- **Targeted regression:** Run for hotfixes (only tests related to the changed area + critical path tests).
- **Automated checks:** Where possible, use n8n workflows to automate regression checks (webhook trigger, run test, verify response, log result).

### Regression Test Maintenance

- Add new regression tests whenever a bug is found and fixed (prevent recurrence).
- Review and prune the regression suite quarterly (remove obsolete tests, update for changed features).
- Document each regression test with: what it covers, why it exists (linked to original bug or feature), expected result.

---

## Appendix: QA Templates

### Bug Report Template

```
Bug ID: [Auto-generated or manual]
Reported By: [Name]
Date: [DD/MM/YYYY]
Severity: [S0 / S1 / S2 / S3]
Component: [n8n workflow / PocketBase / Frontend / Integration]
Environment: [Staging / Production]

Summary: [One-line description]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Behaviour: [What should happen]
Actual Behaviour: [What actually happens]

Screenshots/Logs: [Attach or link]

Additional Context: [Browser, device, data used, etc.]
```

### Test Execution Report Template

```
Release: [Version / Date]
Tested By: [Name]
Test Period: [Start Date] to [End Date]

Summary:
- Total Tests: [N]
- Passed: [N]
- Failed: [N]
- Blocked: [N]
- Not Executed: [N]

S0 Bugs: [Count] (all resolved: Yes/No)
S1 Bugs: [Count] (all resolved: Yes/No)
S2 Bugs: [Count]
S3 Bugs: [Count]

Go/No-Go Recommendation: [Go / No-Go]
Rationale: [Brief explanation]
```

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
