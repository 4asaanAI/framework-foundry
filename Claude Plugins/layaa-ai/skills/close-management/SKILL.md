---
name: close-management
description: >
  Manage month-end and year-end financial close processes. Track close tasks, reconciliations,
  adjustments, and reporting deadlines. Supports statutory compliance calendar integration.
  Trigger: "month-end close", "year-end close", "financial close", "close checklist",
  "close process", "period close", "closing entries"
  This skill replaces the generic finance:close-management capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Close Management

Manage month-end and year-end financial close processes. Track close tasks, reconciliations, adjustments, and reporting deadlines with statutory compliance integration.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/finance/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics and entity details
- domain-references/finance/compliance-calendar.md — Filing deadlines, statutory due dates
- domain-references/finance/company-filings.md — Entity details, CIN, PAN, TAN, statutory requirements
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Close Period
Determine the close scope:
- **Period type:** Month-end, quarter-end, or year-end (March 31 for Indian companies)
- **Close month/quarter:** Specific period being closed
- **Deadline:** When the close must be completed
- **Reporting requirements:** Internal reporting, board reporting, statutory filing, or investor update

If unclear, ask the user for the period being closed and any hard deadlines.

### Step 2: Load Compliance Context (Layaa AI Mode)
For Layaa AI tasks:
1. Read `domain-references/finance/compliance-calendar.md` for filing deadlines tied to the close period
2. Read `domain-references/finance/company-filings.md` for statutory requirements:
   - GST filing deadlines (GSTR-1 by 11th, GSTR-3B by 20th of following month)
   - TDS deposit deadline (by 7th of following month)
   - TDS return filing (quarterly — Form 24Q/26Q)
   - Advance tax (quarterly — June 15, Sept 15, Dec 15, March 15)
   - Annual filings (ITR, audit report, AOC-4, MGT-7)
3. Read `shared-references/company-identity.md` for entity details

### Step 3: Generate Close Checklist
Create a comprehensive close checklist organized by category:

**Revenue Close (Days 1-2):**
- [ ] Verify all invoices for the period have been raised
- [ ] Reconcile implementation fee revenue — confirm milestone completion for recognition
- [ ] Reconcile retainer revenue — confirm monthly recognition for active retainers
- [ ] Review deferred revenue — release earned portion of 50% deposits
- [ ] Post revenue accruals for services delivered but not yet invoiced
- [ ] Confirm revenue cutoff — no next-period revenue recorded in current period

**Expense Close (Days 1-3):**
- [ ] Collect and post all vendor invoices received
- [ ] Accrue expenses for services received but not yet invoiced
- [ ] Post payroll entries (salaries, PF, ESI, professional tax)
- [ ] Post depreciation entries for fixed assets
- [ ] Review prepaid expenses — amortize current period portion
- [ ] Post software subscription allocations

**Cash and Bank (Days 2-3):**
- [ ] Complete bank reconciliation for all accounts
- [ ] Post bank charges, interest income/expense
- [ ] Reconcile petty cash (if applicable)
- [ ] Verify all deposits in transit and outstanding checks

**Statutory Compliance (Days 1-5):**
For Layaa AI mode, include specific deadlines:
- [ ] Calculate and deposit TDS (by 7th of following month)
- [ ] Prepare and file GSTR-1 (by 11th of following month)
- [ ] Reconcile GST input tax credit with GSTR-2B
- [ ] Prepare and file GSTR-3B (by 20th of following month)
- [ ] Calculate advance tax liability (if quarter-end: June 15, Sept 15, Dec 15, March 15)
- [ ] Verify PF/ESI deposits made by due date

**Quarter-End Additional Tasks:**
- [ ] File TDS returns (Form 24Q for salaries, 26Q for non-salary)
- [ ] Issue TDS certificates (Form 16A within 15 days of filing return)
- [ ] Prepare quarterly financial summary for founders
- [ ] Review advance tax adequacy — pay installment if due

**Year-End Additional Tasks (March 31):**
- [ ] Complete physical verification of fixed assets
- [ ] Review and write off uncollectable receivables
- [ ] Assess provisions for doubtful debts
- [ ] Calculate deferred tax asset/liability
- [ ] Prepare tax computation and estimate tax liability
- [ ] Review contingent liabilities for disclosure
- [ ] Confirm DPIIT/MSME registration status is current
- [ ] Prepare for statutory audit (auditor coordination)

### Step 4: Track Reconciliation Status (Layaa AI Mode)
Monitor key reconciliations:

| Reconciliation | Owner | Status | Discrepancy | Action |
|---------------|-------|--------|-------------|--------|
| Bank — Account 1 | [name] | [Not Started / In Progress / Complete] | [amount if any] | [action needed] |
| Accounts Receivable | [name] | [status] | [amount] | [action] |
| Accounts Payable | [name] | [status] | [amount] | [action] |
| GST Input Credit | [name] | [status] | [amount] | [action] |
| TDS Receivable | [name] | [status] | [amount] | [action] |
| Deferred Revenue | [name] | [status] | [amount] | [action] |
| Fixed Assets | [name] | [status] | [amount] | [action] |
| Intercompany (if any) | [name] | [status] | [amount] | [action] |

### Step 5: Identify Adjusting Entries
Flag entries that need to be posted before the period can be closed:

**Standard Adjusting Entries:**
- Accrued revenue (services delivered, not invoiced)
- Accrued expenses (services received, not invoiced)
- Prepaid expense amortization
- Depreciation
- Deferred revenue release
- Bank charges and interest

**Non-Standard Adjusting Entries:**
- Prior period error corrections
- Write-offs (bad debts, asset impairments)
- Reclassifications
- Provisions (warranties, disputes, contingencies)
- Foreign exchange revaluation (if applicable)

For each entry, note: description, accounts affected, estimated amount, and supporting documentation needed.

### Step 6: Generate Close Status Report
Track progress against the close timeline:

**Day-by-Day Close Timeline:**
- **Day 1:** Revenue recognition, invoice verification, begin expense collection
- **Day 2:** Post expenses, begin bank reconciliation, payroll entries
- **Day 3:** Complete reconciliations, post adjusting entries
- **Day 4:** Review trial balance, investigate variances, final adjustments
- **Day 5:** Generate financial statements, management review
- **Day 7:** TDS deposit deadline (following month)
- **Day 11:** GSTR-1 filing deadline
- **Day 20:** GSTR-3B filing deadline

### Step 7: Flag Overdue Items and Escalations
Identify and escalate:
- **Overdue tasks:** Any checklist item past its target date
- **Blocking items:** Tasks preventing downstream activities from starting
- **Missing information:** Data or approvals needed from team members
- **Statutory risk:** Any filing deadline at risk of being missed
- **Discrepancy alerts:** Reconciliation differences exceeding materiality threshold

Assign severity: **Critical** (statutory deadline at risk), **High** (blocking other tasks), **Medium** (behind schedule but recoverable), **Low** (minor delay, no downstream impact).

## Output Format

```
# Financial Close — [Period] [Year]
**Close Type:** [Month-End / Quarter-End / Year-End]
**Close Deadline:** [target completion date]
**Status:** [On Track / At Risk / Behind Schedule]

## Close Progress Summary
- **Total Tasks:** [count]
- **Completed:** [count] ([%])
- **In Progress:** [count]
- **Not Started:** [count]
- **Overdue:** [count]

## Close Checklist

### Revenue Close
| # | Task | Owner | Due | Status | Notes |
|---|------|-------|-----|--------|-------|
| 1 | [task] | [owner] | [date] | [status] | [notes] |

### Expense Close
| # | Task | Owner | Due | Status | Notes |
|---|------|-------|-----|--------|-------|

### Cash and Bank
| # | Task | Owner | Due | Status | Notes |
|---|------|-------|-----|--------|-------|

### Statutory Compliance
| # | Task | Filing | Due Date | Status | Notes |
|---|------|--------|----------|--------|-------|
| 1 | TDS Deposit | Challan 281 | 7th [month] | [status] | [notes] |
| 2 | GSTR-1 Filing | GST Portal | 11th [month] | [status] | [notes] |
| 3 | GSTR-3B Filing | GST Portal | 20th [month] | [status] | [notes] |

## Reconciliation Summary
| Account | Book Balance | External Balance | Difference | Status |
|---------|-------------|-----------------|------------|--------|
| [account] | [amount] | [amount] | [amount] | [status] |

## Adjusting Entries Required
| # | Description | Debit Account | Credit Account | Amount | Status |
|---|-------------|--------------|----------------|--------|--------|
| 1 | [description] | [account] | [account] | [amount] | [Posted / Pending] |

## Overdue / At-Risk Items
| Item | Original Due | Days Overdue | Severity | Escalation |
|------|-------------|-------------|----------|------------|
| [item] | [date] | [days] | [Critical/High/Med/Low] | [action needed] |

## Statutory Deadline Tracker
| Filing | Due Date | Status | Penalty Risk |
|--------|----------|--------|-------------|
| [filing] | [date] | [status] | [amount if late] |

## Next Steps
1. [immediate action needed]
2. [immediate action needed]
3. [immediate action needed]
```

## What Makes This Different from Generic Close Management
- Integrates Indian statutory deadlines (GST, TDS, advance tax, MCA filings) into the close checklist
- Understands Layaa AI's revenue recognition model (implementation milestones vs. monthly retainer recognition)
- Handles deferred revenue for 50% deposit on contract signing
- Includes DPIIT/MSME registration verification for year-end
- Tracks GST input credit reconciliation as a standard close task
- Knows statutory audit requirements for Indian private limited companies
- Maps close timeline against specific Indian filing deadlines (7th TDS, 11th GSTR-1, 20th GSTR-3B)
