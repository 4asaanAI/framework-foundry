---
name: audit-support
description: >
  Prepare audit documentation, respond to auditor inquiries, organize supporting schedules,
  and manage the audit process. Supports both statutory and internal audits for Indian companies.
  Trigger: "audit support", "audit preparation", "auditor query", "audit documentation",
  "statutory audit", "internal audit", "audit schedule", "audit readiness"
  This skill replaces the generic finance:audit-support capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Audit Support

Prepare audit documentation, respond to auditor inquiries, organize supporting schedules, and manage the audit process. Supports statutory audits, internal audits, tax audits, and compliance reviews.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/finance/compliance-calendar.md — Audit-related deadlines and filing requirements
- domain-references/finance/company-filings.md — Entity details, CIN, PAN, TAN, registration documents
- domain-references/legal/regulatory-landscape.md — Regulatory requirements and compliance framework
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Audit Type and Scope
Determine the audit parameters:
- **Audit type:**
  - Statutory Audit (mandatory under Companies Act, 2013)
  - Tax Audit (Section 44AB — if turnover exceeds threshold)
  - Internal Audit (voluntary but recommended)
  - GST Audit (GSTR-9C reconciliation)
  - Compliance Audit (specific regulation focus)
- **Audit period:** Financial year or specific period under review
- **Auditor:** Firm name, engagement partner, audit team contacts
- **Timeline:** Fieldwork dates, report deadline, filing deadline

If unclear, ask the user for the audit type, period, and any specific areas of focus.

### Step 2: Load Entity and Compliance Context (Layaa AI Mode)
For Layaa AI tasks:
1. Read `domain-references/finance/company-filings.md` for entity details:
   - Legal name: Layaa AI Private Limited
   - CIN: U62099HR2025PTC139528
   - PAN: AAGCL6342M | TAN: RTKL05493F
   - Date of Incorporation: 2025
   - DPIIT Recognition: Registered startup
   - MSME/Udyam Registration: Active
2. Read `domain-references/finance/compliance-calendar.md` for audit-related deadlines:
   - Statutory audit report: Before AGM
   - AGM deadline: Within 6 months of year-end (September 30)
   - ITR filing (with audit): October 31
   - AOC-4 (financial statements to ROC): Within 30 days of AGM
   - MGT-7 (annual return): Within 60 days of AGM
3. Read `domain-references/legal/regulatory-landscape.md` for regulatory context

### Step 3: Prepare Document Request List
Organize audit documentation requests by area:

**Corporate and Legal:**
- [ ] Certificate of Incorporation
- [ ] Memorandum and Articles of Association (current version)
- [ ] Shareholders' Agreement
- [ ] Board meeting minutes for the audit period
- [ ] AGM minutes from prior year
- [ ] Board resolutions for significant transactions
- [ ] DPIIT recognition certificate
- [ ] Udyam/MSME registration certificate
- [ ] Trademark registration documents

**Financial Records:**
- [ ] Trial balance (opening and closing)
- [ ] General ledger for the audit period
- [ ] Bank statements for all accounts (full year)
- [ ] Bank reconciliation statements (all months)
- [ ] Cash book and petty cash records
- [ ] Fixed asset register with depreciation schedule
- [ ] Accounts receivable aging schedule
- [ ] Accounts payable aging schedule

**Revenue and Contracts:**
- [ ] All client contracts and service agreements
- [ ] Revenue recognition schedule (implementation vs. retainer)
- [ ] Deferred revenue reconciliation
- [ ] Invoice register / sales register
- [ ] Credit notes issued during the period

**Tax and Compliance:**
- [ ] GST returns filed (GSTR-1, GSTR-3B — all months)
- [ ] GST reconciliation (GSTR-2B vs. books)
- [ ] TDS returns filed (24Q, 26Q — all quarters)
- [ ] TDS certificates received (Form 16A from clients)
- [ ] Advance tax challans
- [ ] Prior year ITR and computation
- [ ] PF/ESI registration and payment challans

**Expenses and Payroll:**
- [ ] Payroll register with salary breakup
- [ ] Employment contracts for key employees
- [ ] Vendor invoices (sampled or complete)
- [ ] Expense reimbursement claims with supporting
- [ ] Rent agreement and payment proof
- [ ] Software subscription invoices
- [ ] Insurance policies

### Step 4: Gather and Organize Supporting Schedules
Prepare the following standard audit schedules:

**Schedule 1 — Revenue Analysis:**
- Monthly revenue breakdown by type (implementation, retainer, training)
- Client-wise revenue summary
- Deferred revenue movement schedule (opening + additions - recognized = closing)

**Schedule 2 — Employee Costs:**
- Salary register with gross pay, deductions, net pay
- PF/ESI contribution summary
- Professional tax payments
- Contractor/freelancer payments with TDS deducted

**Schedule 3 — Fixed Assets:**
- Asset-wise listing with purchase date, cost, depreciation method, rate, WDV
- Additions and disposals during the year
- Depreciation computation (as per Companies Act and Income Tax Act)

**Schedule 4 — Related Party Transactions:**
- Director remuneration
- Loans to/from directors or related entities
- Any transactions with entities where directors have interest

**Schedule 5 — Tax Reconciliation:**
- Book profit to taxable income reconciliation
- GST input credit reconciliation
- TDS receivable reconciliation with Form 26AS/AIS

### Step 5: Draft Responses to Auditor Queries
For common audit queries, prepare template responses:

**Revenue Recognition:**
"Revenue from implementation services is recognized upon completion of delivery milestones as defined in client contracts. Retainer revenue is recognized monthly as services are rendered. Deposits received (typically 50% of implementation fee) are recorded as deferred revenue and recognized upon milestone completion."

**Related Party Disclosures:**
"The company has [number] directors as of [date]. Related party transactions during the period include [list]. All transactions are at arm's length."

**Going Concern:**
"The company has [positive/negative] net worth of [amount] and [positive/negative] cash flow from operations of [amount]. Management assessment supports going concern basis."

**Startup Benefits:**
"The company is recognized under DPIIT Startup India program (Certificate No. [number]). The company is eligible for [applicable benefits — tax holiday under Section 80-IAC if claimed, angel tax exemption, etc.]."

### Step 6: Include DPIIT/MSME Documentation (Layaa AI Mode)
Ensure startup and MSME status documentation is complete:
- [ ] DPIIT recognition certificate — verify still valid
- [ ] Udyam registration certificate — verify classification is current
- [ ] Startup India benefits claimed — document eligibility and compliance
- [ ] Section 80-IAC tax holiday — if claimed, ensure conditions are met (incorporated after April 2016, turnover under threshold, engaged in innovation)
- [ ] Angel tax exemption — if applicable, ensure DPIIT certification for Section 56(2)(viib) exemption

### Step 7: Track Audit Findings and Management Responses
Maintain a findings tracker:

| # | Finding | Area | Severity | Auditor Recommendation | Management Response | Status |
|---|---------|------|----------|----------------------|---------------------|--------|
| 1 | [finding] | [area] | [High/Med/Low] | [recommendation] | [response] | [Open/Resolved] |

For each finding:
- Acknowledge or dispute the finding with supporting evidence
- If acknowledged, provide a remediation plan with timeline
- Identify responsible person for implementation
- Set follow-up date for resolution

### Step 8: Generate Audit Readiness Status Report
Consolidate overall audit preparation status:
- **Document collection:** % complete by area
- **Schedule preparation:** % complete
- **Open queries:** Count and aging
- **Critical gaps:** Items that could delay audit sign-off
- **Timeline risk:** Whether current pace meets audit completion deadline

## Output Format

```
# Audit Support Package — [Audit Type] — [Period]
**Entity:** [Company name]
**CIN:** [number]
**Audit Period:** [start] to [end]
**Auditor:** [firm name]
**Prepared:** [date]

## Readiness Summary
- **Overall Status:** [Ready / Mostly Ready / Significant Gaps]
- **Documents Collected:** [count] / [total required] ([%])
- **Schedules Prepared:** [count] / [total required] ([%])
- **Open Auditor Queries:** [count]
- **Target Completion:** [date]

## Document Index
| # | Document | Category | Status | Location |
|---|----------|----------|--------|----------|
| 1 | [document] | [category] | [Ready / Pending / N/A] | [file path or location] |

## Supporting Schedules

### Revenue Analysis
| Month | Implementation Revenue | Retainer Revenue | Other | Total |
|-------|----------------------|------------------|-------|-------|
| [month] | [amount] | [amount] | [amount] | [amount] |

### Deferred Revenue Movement
| | Amount (INR) |
|---|---|
| Opening Balance | [amount] |
| Add: Deposits Received | [amount] |
| Less: Revenue Recognized | [amount] |
| **Closing Balance** | **[amount]** |

### [Other schedules as needed]

## Auditor Query Tracker
| # | Query | Date Received | Area | Response Status | Due Date |
|---|-------|--------------|------|-----------------|----------|
| 1 | [query] | [date] | [area] | [Draft / Sent / Pending] | [date] |

## Audit Findings Log
| # | Finding | Severity | Response | Remediation Date |
|---|---------|----------|----------|-----------------|
| 1 | [finding] | [H/M/L] | [response summary] | [date] |

## Compliance Checklist
| Registration | Certificate | Valid Until | Status |
|-------------|-------------|-------------|--------|
| DPIIT Startup | [number] | [date] | [Active / Expiring / Expired] |
| Udyam/MSME | [number] | [date] | [Active] |
| GST | [GSTIN] | N/A | [Active] |
| PF | [number] | N/A | [Active / Not Registered] |
| ESI | [number] | N/A | [Active / Not Registered] |

## Critical Gaps and Next Steps
1. **[Gap]** — [action needed] — [responsible] — [deadline]
2. **[Gap]** — [action needed] — [responsible] — [deadline]

## Key Deadlines
| Milestone | Due Date | Status |
|-----------|----------|--------|
| Audit Fieldwork Complete | [date] | [status] |
| Draft Report Issued | [date] | [status] |
| Management Comments Due | [date] | [status] |
| Final Report Signed | [date] | [status] |
| AGM | [date] | [status] |
| AOC-4 Filing | [date] | [status] |
| MGT-7 Filing | [date] | [status] |
| ITR Filing | [date] | [status] |
```

## What Makes This Different from Generic Audit Support
- Includes Indian statutory audit requirements under Companies Act, 2013
- Pre-built document request list for Indian private limited companies
- Handles DPIIT/Startup India and MSME/Udyam documentation requirements
- Includes GST reconciliation (GSTR-2B vs. books) and TDS tracking (Form 26AS/AIS)
- Understands Layaa AI's revenue model for deferred revenue audit schedules
- Knows Indian filing deadlines (AGM, AOC-4, MGT-7, ITR with audit)
- Includes Section 80-IAC tax holiday compliance verification
- Tracks related party transactions as required for Indian companies
