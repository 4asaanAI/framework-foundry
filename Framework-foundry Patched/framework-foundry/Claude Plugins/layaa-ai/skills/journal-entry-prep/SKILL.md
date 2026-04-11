---
name: journal-entry-prep
description: >
  Prepare batch journal entries from transaction data, recurring entries, and adjusting entries.
  Handles high-volume entry preparation with validation and duplicate detection.
  Trigger: "batch entries", "recurring entries", "adjusting entries", "journal entry prep",
  "accrual entries", "reclassification", "bulk journal entries", "month-end entries"
  This skill replaces the generic finance:journal-entry-prep capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Journal Entry Prep

Prepare batch journal entries from transaction data, recurring entries, and adjusting entries. Handles high-volume entry preparation with validation, duplicate detection, and summary reporting.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/finance/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/revenue-model.md — Revenue structure, pricing tiers, recognition rules
- domain-references/finance/company-filings.md — Entity details, tax registrations
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Entry Type
Classify the batch of entries needed:

**Recurring Entries:**
- Monthly retainer revenue recognition
- Rent expense
- Software subscription allocations
- Depreciation
- Loan EMI payments (principal + interest split)
- Insurance premium amortization

**Adjusting Entries:**
- Accrued revenue (services delivered, not yet invoiced)
- Accrued expenses (services received, not yet invoiced)
- Prepaid expense amortization
- Deferred revenue release

**Accrual Entries:**
- Salary accrual (if pay date differs from period end)
- Interest accrual on borrowings
- Statutory dues accrual (PF, ESI, professional tax)
- Unbilled revenue accrual

**Reclassification Entries:**
- Correct prior misclassifications
- Reclassify between expense categories
- Move items between current and non-current
- Intercompany adjustments

Ask the user which type(s) are needed and for what period.

### Step 2: Gather Source Data
Collect data depending on entry type:

**From Invoices:**
- Search workspace: Use Glob for `*.xlsx`, `*.csv`, `*invoice*`, `*billing*`
- Extract: date, vendor/client, amount, tax, account classification

**From Bank Statements:**
- Search workspace: Use Glob for `*bank*`, `*statement*`
- Extract: date, description, amount, identified payee

**From Contracts:**
- Search workspace: Use Glob for `*contract*`, `*agreement*`, `*SOW*`
- Extract: contract value, milestone schedule, retainer amount, payment terms

**From Prior Period:**
- Search for previous month's entries to identify recurring items
- Use Grep for patterns: `recurring`, `monthly`, `accrual`

If no structured data exists, ask the user to provide source data or describe the transactions.

### Step 3: Apply Revenue Recognition Rules (Layaa AI Mode)
For revenue-related entries, apply Layaa AI's recognition policies:

**Implementation Revenue:**
- Recognition trigger: Milestone completion (not contract signing)
- On contract signing: Record 50% deposit as Deferred Revenue
- On milestone 1 completion: Recognize proportional revenue from Deferred Revenue
- On project completion: Recognize remaining revenue, release full Deferred Revenue balance
- Average implementation fee: 2.5L — validate individual entries against this benchmark

**Retainer Revenue:**
- Recognition trigger: Monthly as services are rendered
- Standard recurring entry per active client:
  - Debit: Accounts Receivable — [Client Name]
  - Credit: Retainer Revenue
  - Credit: GST Output Tax Payable (18%)
- Tier amounts: Starter 15k, Growth 40k, Enterprise custom

**Training/Workshop Revenue:**
- Recognition trigger: On delivery of workshop/session
- If prepaid: Record as Deferred Revenue, recognize on delivery date

### Step 4: Generate Journal Entries in Batch Format
Create entries in a structured batch format:

**Batch Header:**
| Field | Value |
|-------|-------|
| Batch ID | [BATCH-YYYY-MM-###] |
| Period | [month/year] |
| Entry Type | [Recurring / Adjusting / Accrual / Reclassification] |
| Entry Count | [number of entries] |
| Prepared By | [name] |
| Prepared Date | [date] |

**Entry Format (repeated for each entry):**
| Entry # | Date | Description | Account | Debit | Credit | Reference |
|---------|------|-------------|---------|-------|--------|-----------|
| [#] | [date] | [narration] | [account name] | [amount] | | [ref] |
| [#] | [date] | [narration] | [account name] | | [amount] | [ref] |

Group related entries logically:
- Revenue entries together
- Expense accruals together
- Tax entries together
- Depreciation entries together

### Step 5: Apply Validation Rules
Run automated checks on the entire batch:

**Balance Check:**
- [ ] Each individual entry: Debits = Credits
- [ ] Batch total: Sum of all debits = Sum of all credits
- Flag any entry where debits do not equal credits — mark as ERROR

**Duplicate Detection:**
- [ ] Check for entries with same date + same account + same amount
- [ ] Cross-reference against prior month entries to avoid double-posting recurring items
- [ ] Flag potential duplicates — mark as WARNING for review

**Period Check:**
- [ ] All entry dates fall within the target accounting period
- [ ] No entries dated in a closed period
- [ ] Adjusting entries for prior periods are properly marked

**Amount Reasonableness:**
- [ ] Revenue entries align with expected contract values
- [ ] Recurring entries match prior period amounts (flag if >10% different)
- [ ] Large or unusual amounts flagged for review (define threshold based on company size)

**Account Validity:**
- [ ] All accounts used exist in the chart of accounts
- [ ] Revenue accounts are not debited (unless reversal/adjustment)
- [ ] Expense accounts are not credited (unless reversal/adjustment)
- [ ] Balance sheet accounts have appropriate normal balances

### Step 6: Flag Unusual Items for Review
Identify entries requiring additional review:

| Entry # | Flag Type | Description | Action Required |
|---------|-----------|-------------|-----------------|
| [#] | ERROR | Debits do not equal credits | Must fix before posting |
| [#] | WARNING | Potential duplicate | Verify not already posted |
| [#] | REVIEW | Amount exceeds [threshold] | Manager approval needed |
| [#] | REVIEW | New account used for first time | Confirm account selection |
| [#] | INFO | Recurring amount changed from prior period | Verify change is intentional |

### Step 7: Generate Summary
Produce a batch summary with totals by account:

**Account-Level Summary:**
| Account | Total Debits | Total Credits | Net Effect |
|---------|-------------|--------------|------------|
| [account] | [amount] | [amount] | [debit/credit amount] |

**Category Summary:**
| Category | Entry Count | Total Amount |
|----------|------------|-------------|
| Revenue Recognition | [count] | [amount] |
| Expense Accruals | [count] | [amount] |
| Depreciation | [count] | [amount] |
| Tax Entries (GST/TDS) | [count] | [amount] |
| Reclassifications | [count] | [amount] |

**Batch Totals:**
- Total entries: [count]
- Total debits: [amount]
- Total credits: [amount]
- Balance check: [PASS / FAIL]
- Entries with flags: [count] (ERROR: [n], WARNING: [n], REVIEW: [n])

## Output Format

```
# Journal Entry Batch — [Period]
**Batch ID:** [BATCH-YYYY-MM-###]
**Period:** [month/year]
**Entry Type:** [type]
**Prepared:** [date]

## Batch Summary
- **Total Entries:** [count]
- **Total Debits:** INR [amount]
- **Total Credits:** INR [amount]
- **Balance Check:** [PASS]
- **Flags:** [count] ([breakdown by type])

## Journal Entries

### [Category 1 — e.g., Revenue Recognition]

**JE-001: [Description]**
| Date | Account | Debit (INR) | Credit (INR) | Reference |
|------|---------|-------------|--------------|-----------|
| [date] | [account] | [amount] | | [ref] |
| [date] | [account] | | [amount] | [ref] |

**JE-002: [Description]**
| Date | Account | Debit (INR) | Credit (INR) | Reference |
|------|---------|-------------|--------------|-----------|
| [date] | [account] | [amount] | | [ref] |
| [date] | [account] | | [amount] | [ref] |

### [Category 2 — e.g., Expense Accruals]
[entries...]

## Validation Report

### Errors (Must Fix)
| Entry | Issue | Resolution |
|-------|-------|-----------|
| [none or list] | | |

### Warnings (Verify)
| Entry | Issue | Action |
|-------|-------|--------|
| [entry] | [issue] | [verify action] |

### Review Items
| Entry | Flag | Reviewer |
|-------|------|----------|
| [entry] | [flag] | [name] |

## Account Summary
| Account | Total Debits | Total Credits | Net |
|---------|-------------|--------------|-----|
| [account] | [amount] | [amount] | [net] |

## Approval
- [ ] Prepared by: [name] — [date]
- [ ] Reviewed by: [name] — [date]
- [ ] Approved by: [name] — [date]
- [ ] Posted by: [name] — [date]
```

## What Makes This Different from Generic Journal Entry Prep
- Pre-built recurring entry templates for Layaa AI's revenue model (implementation + retainer + deferred)
- Revenue recognition rules embedded (milestone-based for implementation, monthly for retainer)
- Handles the 50% deposit → deferred revenue → recognized revenue lifecycle
- Includes GST (18%) and TDS (Section 194J) in entry templates
- Validates recurring amounts against Layaa AI's pricing tiers (Starter 15k, Growth 40k)
- Duplicate detection cross-references against prior period entries
- Batch summary organized by revenue category matching Layaa AI's service verticals
