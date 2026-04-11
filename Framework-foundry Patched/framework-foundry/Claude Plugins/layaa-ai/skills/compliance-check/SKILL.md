---
name: compliance-check
description: >
  Assess compliance status against regulatory requirements, internal policies, or industry standards.
  Identifies gaps, risks, and remediation actions for business operations.
  In Layaa AI mode, applies Indian regulatory landscape, compliance red flags, and compliance calendar.
  Trigger: "compliance check", "compliance audit", "compliance review", "regulatory compliance", "compliance assessment", "compliance gap", "are we compliant"
  This skill replaces the generic legal:compliance-check capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Compliance Check

Assess compliance status against regulatory requirements, internal policies, or industry standards. Identifies gaps with severity ratings and generates remediation plans with owners and timelines.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, MCA, DPIIT, UDYAM, Startup India, GST, Income Tax, DPDP Act, Companies Act, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/regulatory-landscape.md — Applicable statutes, regulatory bodies, compliance obligations
- domain-references/legal/compliance-red-flags.md — Red flags checklist and severity indicators
- domain-references/finance/compliance-calendar.md — Filing deadlines, annual compliance schedule
- shared-references/company-identity.md — Company registration details, entity type, industry classification
Only load references relevant to the compliance scope being assessed.

## Execution Steps

### Step 1: Define Compliance Scope
Collect or ask for:
- **Compliance domain:**
  - Corporate/MCA compliance (annual filings, board resolutions, statutory registers)
  - Tax compliance (GST, Income Tax, TDS, advance tax)
  - Data protection compliance (DPDP Act 2023, IT Act)
  - Employment/labor compliance (PF, ESI, labor laws)
  - Industry-specific compliance (SEBI, RBI, sector regulators)
  - Contractual compliance (client agreements, vendor terms)
  - Internal policy compliance (company policies, SOPs)
  - Startup scheme compliance (DPIIT, Startup India, SISFS)
- **Time period:** Current status, specific quarter, annual review
- **Trigger:** Routine check, upcoming deadline, incident response, due diligence prep
- **Specific concerns:** Any known issues or areas of worry

### Step 2: Load Layaa AI Compliance Context (Layaa AI Mode)
1. Read `domain-references/legal/regulatory-landscape.md` for the full regulatory framework
2. Read `domain-references/legal/compliance-red-flags.md` for known red flags and watchpoints
3. Read `domain-references/finance/compliance-calendar.md` for upcoming deadlines
4. Read `shared-references/company-identity.md` for entity details:
   - CIN: U62099HR2025PTC139528
   - Entity type: Private Limited Company
   - Registrations: DPIIT, UDYAM, Startup India
   - Industry: IT/Technology Services

### Step 3: Identify Applicable Requirements
For each compliance domain in scope, build a requirements checklist:

**Corporate/MCA Compliance (Layaa AI):**
- [ ] Annual Return (MGT-7/MGT-7A) — within 60 days of AGM
- [ ] Financial Statements (AOC-4) — within 30 days of AGM
- [ ] AGM held within statutory timeline
- [ ] Board meetings — minimum 4 per year, gap not exceeding 120 days
- [ ] DIR-3 KYC — annual by September 30
- [ ] Statutory registers maintained (members, directors, charges)
- [ ] Registered office compliance
- [ ] DIN status active for all directors
- [ ] Commencement of Business Certificate (INC-20A) — if applicable

**Tax Compliance:**
- [ ] GST registration active and returns filed (GSTR-1, GSTR-3B monthly/quarterly)
- [ ] GST annual return (GSTR-9) filed
- [ ] Income Tax return filed by due date
- [ ] TDS returns filed (Form 24Q, 26Q) quarterly
- [ ] Advance tax paid (if applicable)
- [ ] TAN active and TDS deposited by 7th of following month

**Data Protection (DPDP Act 2023):**
- [ ] Privacy policy published and current
- [ ] Consent mechanisms for data collection
- [ ] Data processing purpose limitation
- [ ] Data retention policy defined
- [ ] Data breach notification process established
- [ ] Data Principal rights request process
- [ ] Cross-border data transfer compliance

**Startup Scheme Compliance:**
- [ ] DPIIT recognition active
- [ ] Startup India benefits utilized/claimed correctly
- [ ] UDYAM registration current
- [ ] SISFS grant conditions met (if applicable)

### Step 4: Assess Current Compliance Status
For each requirement, determine status:

| Status | Definition | Action Required |
|--------|-----------|----------------|
| COMPLIANT | Requirement fully met, documentation available | None — continue monitoring |
| PARTIALLY COMPLIANT | Requirement partially met, gaps exist | Remediation needed |
| NON-COMPLIANT | Requirement not met | Immediate remediation |
| NOT APPLICABLE | Requirement does not apply to the entity | Document rationale |
| UNABLE TO VERIFY | Insufficient information to assess | Investigation needed |
| UPCOMING | Deadline approaching, action not yet taken | Proactive action needed |

**Assessment method:**
1. Review available documentation and records
2. Check filing portals (MCA, GST, IT) if access available
3. Cross-reference with compliance calendar for deadline status
4. Interview stakeholders if needed
5. WebSearch for any regulatory changes affecting requirements

### Step 5: Flag Gaps Using Severity Levels
Score each gap:

| Severity | Definition | Response Time | Escalation |
|----------|-----------|--------------|------------|
| **CRITICAL** | Non-compliance with active penalty risk, regulatory action imminent, or deadline missed | Immediate (24-48 hours) | Founders + External Counsel |
| **HIGH** | Non-compliance with upcoming deadline (<30 days) or significant financial exposure | Within 1 week | Founders + Anne/Abhay |
| **MEDIUM** | Partial compliance, gap identified but no immediate penalty risk | Within 30 days | Kabir + relevant GPT |
| **LOW** | Best practice gap, no regulatory penalty but improvement recommended | Within 90 days | Document and schedule |

**Severity scoring factors:**
- Financial penalty amount (known or estimated)
- Prosecution risk (criminal vs. civil)
- Business impact (license revocation, debarment, blacklisting)
- Reputational impact (public disclosure, media attention)
- Pattern risk (recurring non-compliance escalates severity)

### Step 6: Cross-Reference with Compliance Calendar (Layaa AI Mode)
1. Check `domain-references/finance/compliance-calendar.md` for upcoming deadlines
2. For each upcoming deadline within 60 days:
   - Verify current preparation status
   - Identify dependencies (information, approvals, payments needed)
   - Flag if preparation has not started for deadlines within 30 days
3. Map deadline dependencies (e.g., AGM must happen before MGT-7 filing)
4. Note any compliance items that are prerequisites for others

### Step 7: Generate Remediation Plan
For each gap identified, create an action item:
1. **What:** Specific action needed to achieve compliance
2. **Who:** Owner responsible (Anne for MCA/tax, Preeti for data/regulatory, Abhay for legal, Founders for approvals)
3. **When:** Deadline for completion (working backwards from regulatory deadline)
4. **How:** Steps to complete the action
5. **Cost:** Estimated cost (filing fees, professional fees, penalties if late)
6. **Dependencies:** What else must happen first
7. **Verification:** How to confirm the action is complete

### Step 8: Apply Escalation Decision Tree
For critical findings:

```
IF severity = CRITICAL
  → Notify Founders within 24 hours
  → Engage external counsel/CA if regulatory
  → Create incident response plan
  → Document timeline of discovery and actions

IF severity = HIGH
  → Notify Founders within 48 hours
  → Assign to Anne (compliance) or Abhay (legal)
  → Set weekly progress check-in
  → Block any dependent activities until resolved

IF pattern detected (same gap recurring)
  → Propose process improvement to prevent recurrence
  → Escalate to Kabir for cross-functional review
  → Consider adding to institutional memory
```

## Output Format

```
# Compliance Assessment Report
**Entity:** [Layaa AI Private Limited / other entity]
**Assessment Date:** [date]
**Scope:** [compliance domains assessed]
**Period:** [time period covered]
**Prepared by:** [Anne — Chartered Compliance Assistant / General]
**Classification:** CONFIDENTIAL

## Executive Summary
- **Overall Status:** [COMPLIANT / PARTIALLY COMPLIANT / NON-COMPLIANT]
- **Total Requirements Assessed:** [number]
- **Compliant:** [number] ([percentage])
- **Gaps Identified:** [number]
- **Critical/High Gaps:** [number]
- **Upcoming Deadlines (30 days):** [number]

## Status Matrix

### [Domain 1: e.g., Corporate/MCA Compliance]
| # | Requirement | Status | Severity | Deadline | Owner |
|---|------------|--------|----------|----------|-------|
| 1 | [requirement] | [status] | [severity] | [date] | [owner] |
| 2 | [requirement] | [status] | [severity] | [date] | [owner] |

### [Domain 2: e.g., Tax Compliance]
| # | Requirement | Status | Severity | Deadline | Owner |
|---|------------|--------|----------|----------|-------|
| 1 | [requirement] | [status] | [severity] | [date] | [owner] |

## Gap Analysis

### CRITICAL Gaps
#### Gap C1: [Title]
- **Requirement:** [what is required]
- **Current Status:** [what is the current state]
- **Risk:** [what happens if not addressed]
- **Financial Exposure:** [estimated penalty/cost]
- **Root Cause:** [why this gap exists]

### HIGH Gaps
#### Gap H1: [Title]
[Same structure as above]

### MEDIUM Gaps
#### Gap M1: [Title]
[Same structure as above]

### LOW Gaps
#### Gap L1: [Title]
[Same structure as above]

## Upcoming Deadlines (Next 60 Days)
| Deadline | Requirement | Status | Preparation Started | Owner |
|----------|------------|--------|-------------------|-------|
| [date] | [requirement] | [ready/in progress/not started] | [yes/no] | [owner] |

## Remediation Plan
| Priority | Gap | Action Required | Owner | Deadline | Est. Cost | Dependencies | Status |
|----------|-----|----------------|-------|----------|-----------|-------------|--------|
| CRITICAL | [C1] | [action] | [owner] | [date] | [cost] | [deps] | Pending |
| HIGH | [H1] | [action] | [owner] | [date] | [cost] | [deps] | Pending |
| MEDIUM | [M1] | [action] | [owner] | [date] | [cost] | [deps] | Pending |

## Escalation Items
- [ ] **CRITICAL:** [item] — Founder notification required by [date]
- [ ] **HIGH:** [item] — Assigned to [owner], review by [date]
- [ ] **PATTERN:** [recurring issue] — Process improvement proposal needed

## Recommendations
1. **Immediate:** [actions for CRITICAL/HIGH gaps]
2. **Short-term (30 days):** [actions for MEDIUM gaps and upcoming deadlines]
3. **Long-term (90 days):** [process improvements, automation, monitoring]

## Next Review
- **Scheduled:** [date for next compliance check]
- **Scope:** [what to reassess]
- **Trigger:** [any event that should trigger an earlier review]
```

## What Makes This Different from Generic Compliance Checks
- Pre-loaded with Layaa AI's specific regulatory obligations (Private Limited Company, IT services, DPIIT-registered startup)
- Uses Indian compliance calendar with actual filing deadlines and statutory timelines
- Applies Layaa AI's compliance red flags framework for pattern detection across assessments
- Maps remediation owners to Layaa AI's GPT workforce (Anne for MCA/tax, Preeti for data/regulatory, Abhay for legal)
- Tracks startup scheme compliance (DPIIT, UDYAM, SISFS) which generic tools miss
- Cross-references DPDP Act 2023 obligations specific to AI/technology service providers
- Escalation path follows Layaa AI governance: Anne/Abhay → Kabir → Founders → External Counsel
