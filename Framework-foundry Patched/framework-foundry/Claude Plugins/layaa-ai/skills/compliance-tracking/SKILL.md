---
name: compliance-tracking
description: >
  Track compliance requirements, deadlines, and status across regulatory, contractual, and internal
  policy domains. Generates compliance dashboards and alerts with RAG status indicators.
  In Layaa AI mode, pulls from compliance calendar (MCA, GST, TDS, ITR, DPIIT deadlines)
  and applies escalation levels (E1-E4).
  Trigger: "compliance tracking", "compliance dashboard", "compliance status", "filing deadlines", "compliance calendar", "regulatory tracker"
  This skill replaces the generic operations:compliance-tracking capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Compliance Tracking

Track compliance requirements, deadlines, and status across regulatory, contractual, and internal policy domains. Generates compliance dashboards with RAG status indicators and escalation alerts.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, MCA, GST, TDS, ITR, DPIIT, UDYAM, Startup India, Companies Act, DPDP Act, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/finance/compliance-calendar.md — Filing deadlines, annual compliance schedule
- domain-references/legal/regulatory-landscape.md — Applicable statutes, regulatory bodies, compliance obligations
- domain-references/legal/compliance-red-flags.md — Red flags checklist and severity indicators
- shared-references/company-identity.md — Company registration details, entity type
Only load references relevant to the compliance domains being tracked.

## Execution Steps

### Step 1: Identify Compliance Domains
Collect or ask for:
- **Domains to track:**
  - Corporate/MCA compliance (annual filings, board meetings, statutory registers)
  - Tax compliance (GST, Income Tax, TDS, advance tax)
  - Data protection (DPDP Act 2023, IT Act)
  - Employment/labor compliance (PF, ESI, labor laws)
  - Startup scheme compliance (DPIIT, UDYAM, Startup India, SISFS)
  - Contractual obligations (client SLAs, vendor terms, grant conditions)
  - Internal policy compliance (SOPs, security policies, data handling)
- **Tracking period:** Current month, current quarter, annual overview
- **Audience:** Who will use this dashboard (Founders, Anne, Abhay, external CA)?

### Step 2: Load Requirements and Deadlines
For each compliance domain:

1. **Identify all applicable requirements** — statutes, regulations, contractual terms, internal policies
2. **Map each requirement to a specific deadline** — statutory due date, contractual milestone, recurring schedule
3. **Classify deadline type:**
   - **Fixed statutory:** Cannot be changed (e.g., GST filing dates, AGM deadline)
   - **Relative:** Triggered by an event (e.g., 30 days after AGM for AOC-4)
   - **Recurring:** Regular schedule (e.g., monthly TDS deposit by 7th)
   - **Contractual:** Per agreement terms
   - **Internal:** Self-imposed policy deadlines

**For Layaa AI — Key Compliance Calendar Items:**

| Compliance Item | Frequency | Due Date | Owner |
|----------------|-----------|----------|-------|
| GSTR-1 (Sales Return) | Monthly | 11th of following month | Anne |
| GSTR-3B (Summary Return) | Monthly | 20th of following month | Anne |
| TDS Deposit | Monthly | 7th of following month | Anne |
| TDS Return (24Q/26Q) | Quarterly | 31st of month following quarter | Anne |
| Advance Tax | Quarterly | Jun 15, Sep 15, Dec 15, Mar 15 | Anne |
| GSTR-9 (Annual Return) | Annual | Dec 31 | Anne |
| Income Tax Return | Annual | Oct 31 (with audit) / Jul 31 (without) | Anne |
| AGM | Annual | Within 6 months of FY end (Sep 30) | Founders + Anne |
| MGT-7 (Annual Return) | Annual | Within 60 days of AGM | Anne |
| AOC-4 (Financial Statements) | Annual | Within 30 days of AGM | Anne |
| DIR-3 KYC | Annual | Sep 30 | Founders + Anne |
| Board Meetings | Quarterly | Min 4/year, gap ≤ 120 days | Founders |
| DPIIT Recognition Renewal | As required | Per DPIIT terms | Anne |
| UDYAM Registration Update | As required | On change in details | Anne |

### Step 3: Assess Current Status Per Requirement
For each requirement, determine:

| Status | Color | Definition |
|--------|-------|------------|
| COMPLETED | GREEN | Filed/done, acknowledgment received |
| ON TRACK | GREEN | Not yet due, preparation in progress, on schedule |
| AT RISK | AMBER | Due within 15 days, preparation not complete or dependencies unresolved |
| OVERDUE | RED | Past due date, not yet completed |
| NOT STARTED | RED | Due within 30 days but no action taken |
| NOT APPLICABLE | GREY | Does not apply to entity this period |

**Assessment method:**
1. Check available records and filing acknowledgments
2. Verify with compliance calendar for deadline status
3. Confirm preparation status with responsible owner
4. Cross-reference with any regulatory changes (WebSearch if needed)

### Step 4: Flag Overdue and Upcoming Items
Generate two priority lists:

**Overdue Items (Immediate Action Required):**
- List all items past due date
- Calculate days overdue
- Estimate penalty exposure (late filing fees, interest, penalties)
- Identify blocking dependencies
- Assign remediation owner and target completion date

**Upcoming Items (Next 30/60/90 Days):**
- List all items due within the window
- Assess preparation readiness (ready / in progress / not started)
- Identify dependencies and blockers
- Flag items requiring external input (CA, auditor, legal counsel)

### Step 5: Generate Dashboard with RAG Status
Build a visual compliance dashboard:

**RAG Summary:**
- **RED:** [count] items — overdue or not started with approaching deadline
- **AMBER:** [count] items — at risk, needs attention this week
- **GREEN:** [count] items — completed or on track
- **GREY:** [count] items — not applicable this period

**Compliance Score:** (GREEN items / Total applicable items) x 100 = [score]%

### Step 6: Apply Escalation Levels (Layaa AI Mode)
Route compliance issues through the escalation framework:

| Level | Trigger | Action | Timeline |
|-------|---------|--------|----------|
| **E1 — Routine** | Item on track, standard processing | Anne handles independently | Standard timeline |
| **E2 — Attention** | Item at risk, dependency unresolved, <15 days to deadline | Anne flags to Kabir, coordinates with Abhay/Preeti as needed | Within 48 hours |
| **E3 — Urgent** | Item overdue, penalty risk, blocking dependency | Kabir escalates to Founders, external CA/counsel engaged | Within 24 hours |
| **E4 — Critical** | Regulatory notice received, prosecution risk, DPIIT status at risk | Founders take direct action, external counsel mandatory | Immediate |

### Step 7: Track Trends and Patterns
If historical compliance data is available:
1. Compare current compliance score to previous periods
2. Identify recurring problem areas (same items consistently at risk)
3. Flag process gaps that cause repeated near-misses
4. Propose process improvements for chronic issues
5. Check if any pattern triggers a memory update proposal (3+ occurrences)

## Output Format

```
# Compliance Tracking Dashboard
**Entity:** [Layaa AI Private Limited / other entity]
**Period:** [month/quarter/year being tracked]
**Dashboard Date:** [date generated]
**Prepared by:** [Anne — Chartered Compliance Assistant / General]
**Classification:** CONFIDENTIAL

## Compliance Health Score
- **Overall Score:** [percentage]% ([count] of [total] items compliant)
- **Trend:** [improving / stable / declining] vs. last period

## RAG Summary
| Status | Count | Percentage |
|--------|-------|------------|
| GREEN (Completed/On Track) | [count] | [%] |
| AMBER (At Risk) | [count] | [%] |
| RED (Overdue/Not Started) | [count] | [%] |
| GREY (Not Applicable) | [count] | [%] |

## Overdue Items — Immediate Action Required
| # | Requirement | Due Date | Days Overdue | Penalty Exposure | Owner | Remediation Target |
|---|------------|----------|-------------|-----------------|-------|-------------------|
| 1 | [requirement] | [date] | [days] | [estimated penalty] | [owner] | [target date] |

## At Risk Items — Attention This Week
| # | Requirement | Due Date | Days Remaining | Blocker | Owner | Action Needed |
|---|------------|----------|---------------|---------|-------|--------------|
| 1 | [requirement] | [date] | [days] | [blocker] | [owner] | [action] |

## Upcoming Deadlines (Next 30 Days)
| # | Requirement | Due Date | Preparation Status | Dependencies | Owner |
|---|------------|----------|--------------------|-------------|-------|
| 1 | [requirement] | [date] | [ready/in progress/not started] | [dependencies] | [owner] |

## Upcoming Deadlines (31-60 Days)
| # | Requirement | Due Date | Preparation Status | Owner |
|---|------------|----------|--------------------|-------|
| 1 | [requirement] | [date] | [status] | [owner] |

## Upcoming Deadlines (61-90 Days)
| # | Requirement | Due Date | Preparation Status | Owner |
|---|------------|----------|--------------------|-------|
| 1 | [requirement] | [date] | [status] | [owner] |

## Domain-wise Status

### Corporate/MCA Compliance
| # | Requirement | Status | Due Date | Owner | Notes |
|---|------------|--------|----------|-------|-------|
| 1 | [requirement] | [RAG] | [date] | [owner] | [notes] |

### Tax Compliance
| # | Requirement | Status | Due Date | Owner | Notes |
|---|------------|--------|----------|-------|-------|

### Data Protection
| # | Requirement | Status | Due Date | Owner | Notes |
|---|------------|--------|----------|-------|-------|

### Startup Scheme Compliance
| # | Requirement | Status | Due Date | Owner | Notes |
|---|------------|--------|----------|-------|-------|

## Escalation Items
| Level | Item | Trigger | Action Required | Owner | Deadline |
|-------|------|---------|----------------|-------|----------|
| E4 | [item] | [trigger] | [action] | Founders | Immediate |
| E3 | [item] | [trigger] | [action] | [owner] | [date] |
| E2 | [item] | [trigger] | [action] | [owner] | [date] |

## Compliance Trends (if historical data available)
- **Compliance Score Trend:** [current] vs [last period] vs [2 periods ago]
- **Recurring Issues:** [items that are consistently at risk]
- **Process Improvement Needs:** [recommended changes to prevent recurring issues]

## Next Actions
1. [highest priority action] — [owner] — [deadline]
2. [second priority action] — [owner] — [deadline]
3. [third priority action] — [owner] — [deadline]

## Next Dashboard Update
- **Scheduled:** [date]
- **Trigger for earlier update:** [events warranting immediate refresh]
```

## What Makes This Different from Generic Compliance Tracking
- Pre-loaded with Layaa AI's complete Indian compliance calendar (MCA, GST, TDS, ITR, DPIIT, UDYAM)
- Applies four-tier escalation framework (E1-E4) mapped to Layaa AI's governance hierarchy
- Maps compliance owners to Layaa AI's GPT workforce (Anne for filings, Preeti for regulatory risk, Abhay for legal)
- Tracks startup-specific compliance (DPIIT recognition, UDYAM, SISFS grant conditions)
- Calculates penalty exposure specific to Indian statutory frameworks
- Includes DPDP Act 2023 obligations relevant to AI/technology service providers
- Monitors compliance trends and triggers process improvement proposals at 3+ occurrence threshold
