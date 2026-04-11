---
name: reconciliation
description: >
  Perform account reconciliations including bank, intercompany, accounts receivable, accounts
  payable, and general ledger reconciliations. Identifies and resolves discrepancies with
  classification and proposed adjustments.
  Trigger: "reconciliation", "bank reconciliation", "account reconciliation", "AR reconciliation",
  "AP reconciliation", "ledger reconciliation", "balance mismatch", "reconcile accounts"
  This skill replaces the generic finance:reconciliation capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Reconciliation

Perform account reconciliations including bank, intercompany, accounts receivable, accounts payable, and general ledger reconciliations. Identifies discrepancies, classifies root causes, and proposes adjustments.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/finance/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/revenue-model.md — Payment terms, deposit model, retainer structure
- domain-references/finance/company-filings.md — Entity bank accounts, tax registrations
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Reconciliation Type and Accounts
Determine the reconciliation scope:

**Bank Reconciliation:**
- Compare general ledger bank balance with bank statement balance
- Identify timing differences and errors

**Accounts Receivable Reconciliation:**
- Compare AR sub-ledger with client confirmations or payment records
- Age outstanding invoices

**Accounts Payable Reconciliation:**
- Compare AP sub-ledger with vendor statements
- Verify all liabilities are captured

**GST Reconciliation (India-specific):**
- Compare GST as per books with GSTR-1 (outward supplies) and GSTR-3B (summary return)
- Reconcile input tax credit per books vs. GSTR-2B (auto-populated)

**TDS Reconciliation:**
- Compare TDS deducted per books with Form 26AS/AIS
- Identify mismatches in TDS credits

**Intercompany Reconciliation:**
- Match balances between related entities (if applicable)

**General Ledger Reconciliation:**
- Reconcile control accounts with sub-ledgers

Ask the user which reconciliation type and which specific accounts.

### Step 2: Gather Source Data
Collect the two sides of the reconciliation:

**Side A — Internal Records (Books/GL):**
- Search workspace: Use Glob for `*ledger*`, `*trial*`, `*GL*`, `*.xlsx`
- Extract: Date, description, amount, running balance, reference number

**Side B — External/Independent Records:**
- Bank statement (for bank reconciliation)
- Client payment records or confirmations (for AR)
- Vendor statements (for AP)
- GST portal downloads — GSTR-2B, GSTR-1 filed (for GST)
- Form 26AS / AIS from income tax portal (for TDS)
- Sub-ledger detail (for GL reconciliation)

If no data is available in workspace, ask the user to provide both sides of the reconciliation.

### Step 3: Match Transactions and Identify Discrepancies
Perform systematic matching:

**Exact Match:**
- Match transactions by amount + date (within tolerance of 1-2 days for bank)
- Mark matched items as "Reconciled"

**Partial Match:**
- Identify transactions where amount matches but date differs (timing difference)
- Identify transactions where date matches but amount differs (partial payment or error)

**Unmatched Items:**
- Items in books but not in external record → "Outstanding" or "Error in books"
- Items in external record but not in books → "Not yet recorded" or "Error in external"

For large volumes, describe the matching methodology rather than listing every transaction.

### Step 4: Cross-Reference Against Revenue Model (Layaa AI Mode)
For client payment reconciliations, validate against Layaa AI's revenue model:

**Implementation Fee Payments:**
- 50% deposit on contract signing → Should match contract value / 2
- Milestone payments → Should match agreed milestone amounts
- Final payment on completion → Should equal remaining contract balance
- Flag: Any payment that does not match a known contract milestone

**Retainer Payments:**
- Monthly retainer → Should match tier amount (Starter 15k, Growth 40k, Enterprise custom)
- Plus 18% GST → Gross amount should be retainer x 1.18
- Less 10% TDS (Section 194J) → Net receipt should be approximately retainer x 1.18 x 0.90
- Flag: Payments that do not align with expected retainer + GST - TDS calculation

**Payment Pattern Validation:**
- Client paying consistently on time vs. frequently late
- Partial payments or short payments (deducting more TDS than expected)
- Advance payments beyond contract terms

### Step 5: Classify Discrepancies
Categorize each unmatched or mismatched item:

| Classification | Description | Typical Resolution |
|---------------|-------------|-------------------|
| **Timing Difference** | Transaction recorded in different periods | No adjustment needed — will auto-resolve |
| **Deposit in Transit** | Payment sent but not yet credited by bank | Will clear in next period |
| **Outstanding Check** | Check issued but not yet presented | Monitor; stale-date after 3 months |
| **Recording Error** | Wrong amount, date, or account in books | Post correcting entry |
| **Omission** | Transaction exists in one record but not the other | Post missing entry |
| **Bank Error** | Bank posted incorrect amount or duplicate | Contact bank for correction |
| **Cut-off Error** | Transaction recorded in wrong accounting period | Post adjusting entry |
| **Fraud Indicator** | Unexplained discrepancy, unauthorized transaction | Escalate immediately |

### Step 6: Propose Adjusting Entries
For each discrepancy requiring a book entry:

| # | Description | Debit Account | Credit Account | Amount | Classification |
|---|-------------|--------------|----------------|--------|---------------|
| 1 | [description] | [account] | [account] | [amount] | [error/omission/cutoff] |

Include:
- Clear narration explaining why the adjustment is needed
- Reference to the source discrepancy
- Supporting documentation required

### Step 7: Flag Unresolved Items
Items requiring investigation or escalation:

| # | Description | Amount | Age (Days) | Severity | Action Required |
|---|-------------|--------|-----------|----------|-----------------|
| 1 | [item] | [amount] | [days] | [High/Med/Low] | [investigation needed] |

**Severity Guidelines:**
- **High:** Amount exceeds materiality threshold, or fraud indicators present
- **Medium:** Aged item (>30 days) without explanation, or recurring discrepancy
- **Low:** Small amount, likely timing difference, will self-resolve

### Step 8: Generate Reconciliation Summary
Produce the final reconciliation statement:

**Bank Reconciliation Format:**
```
Balance per Bank Statement: [amount]
Add: Deposits in Transit
  [date] - [description] - [amount]
Less: Outstanding Checks
  [date] - [check #] - [amount]
Add/Less: Bank Errors
  [description] - [amount]
Adjusted Bank Balance: [amount]

Balance per Books (GL): [amount]
Add: Credits not yet recorded
  [date] - [description] - [amount]
Less: Charges not yet recorded
  [date] - [description] - [amount]
Add/Less: Book Errors
  [description] - [amount]
Adjusted Book Balance: [amount]

Difference: [should be zero]
```

## Output Format

```
# Account Reconciliation — [Account/Type]
**Period:** [as of date]
**Prepared:** [date]
**Reviewed:** [name, if applicable]

## Reconciliation Summary
| | Amount (INR) |
|---|---|
| Balance per [Source A — e.g., Bank Statement] | [amount] |
| Add: [Adjustments to Source A] | [amount] |
| Less: [Adjustments to Source A] | ([amount]) |
| **Adjusted Balance (Source A)** | **[amount]** |
| | |
| Balance per [Source B — e.g., General Ledger] | [amount] |
| Add: [Adjustments to Source B] | [amount] |
| Less: [Adjustments to Source B] | ([amount]) |
| **Adjusted Balance (Source B)** | **[amount]** |
| | |
| **Reconciling Difference** | **[amount — should be zero]** |

## Reconciling Items Detail

### Timing Differences (No Action Required)
| # | Date | Description | Amount | Expected Resolution |
|---|------|-------------|--------|-------------------|
| 1 | [date] | [item] | [amount] | [when it will clear] |

### Adjusting Entries Required
| # | Description | Debit | Credit | Amount | Reference |
|---|-------------|-------|--------|--------|-----------|
| 1 | [entry] | [account] | [account] | [amount] | [ref] |

### Unresolved Items (Investigation Needed)
| # | Description | Amount | Age | Severity | Assigned To |
|---|-------------|--------|-----|----------|-------------|
| 1 | [item] | [amount] | [days] | [H/M/L] | [name] |

## Statistics
- **Total Transactions Reviewed:** [count]
- **Matched:** [count] ([%])
- **Timing Differences:** [count] (INR [amount])
- **Errors Found:** [count] (INR [amount])
- **Unresolved:** [count] (INR [amount])

## Aging of Unreconciled Items
| Age Bucket | Count | Amount |
|-----------|-------|--------|
| 0-30 days | [count] | [amount] |
| 31-60 days | [count] | [amount] |
| 61-90 days | [count] | [amount] |
| >90 days | [count] | [amount] |

## Recommendations
1. [action to resolve unreconciled items]
2. [process improvement to prevent future discrepancies]
3. [escalation if needed]
```

## What Makes This Different from Generic Reconciliation
- Cross-references client payments against Layaa AI's revenue model (50% deposit, milestone payments, monthly retainer)
- Validates payment amounts against pricing tiers (Starter 15k, Growth 40k) including GST and TDS
- Includes Indian-specific reconciliation types (GST GSTR-2B vs. books, TDS Form 26AS vs. books)
- Understands net payment calculation (retainer + 18% GST - 10% TDS = expected receipt)
- Flags payment pattern anomalies against expected contract terms
- Knows Indian banking conventions (check stale-dating at 3 months, NEFT/RTGS timing)
