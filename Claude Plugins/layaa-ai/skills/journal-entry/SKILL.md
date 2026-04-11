---
name: journal-entry
description: >
  Create, review, and validate journal entries for accounting transactions. Ensures proper
  debits/credits, account coding, and supporting documentation. Handles revenue recognition,
  expense accruals, and statutory entries.
  Trigger: "journal entry", "JE", "debit credit", "accounting entry", "book entry",
  "record transaction", "post entry"
  This skill replaces the generic finance:journal-entry capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Journal Entry

Create, review, and validate journal entries for accounting transactions. Ensures proper debits/credits, account coding, supporting documentation, and tax compliance.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/finance/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/revenue-model.md — Revenue structure, pricing tiers, deposit model
- domain-references/finance/company-filings.md — Entity details, PAN, TAN, GST registration
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify the Transaction or Event
Determine what needs to be recorded:
- **Transaction type:** Revenue, expense, asset purchase, liability, equity, adjusting, closing
- **Source document:** Invoice, receipt, bank statement, contract, memo
- **Date:** Transaction date (not posting date if different)
- **Amount:** Total amount including applicable taxes

If the user provides a narrative description (e.g., "we received 1.25L from client X as a deposit"), parse it into accounting elements. If ambiguous, ask clarifying questions.

### Step 2: Determine Proper Accounts and Classifications
Map the transaction to the correct chart of accounts:

**Revenue Accounts:**
- Implementation Fee Revenue — one-time project fees
- Retainer Revenue — monthly recurring service fees
- Training/Workshop Revenue — education and enablement fees
- Deferred Revenue — deposits received but not yet earned

**Expense Accounts:**
- Salaries and Wages
- Software Subscriptions (n8n, Make, Zapier, cloud services)
- Professional Fees (legal, accounting, consulting)
- Marketing and Advertising
- Rent and Utilities
- Travel and Conveyance
- Depreciation
- Bank Charges
- Interest Expense

**Asset Accounts:**
- Cash and Bank Balances
- Accounts Receivable
- TDS Receivable
- GST Input Credit
- Prepaid Expenses
- Fixed Assets (Computers, Furniture, Equipment)
- Accumulated Depreciation

**Liability Accounts:**
- Accounts Payable
- Deferred Revenue
- GST Output Tax Payable
- TDS Payable
- PF/ESI Payable
- Advance Tax Payable
- Provisions

**Equity Accounts:**
- Share Capital
- Securities Premium
- Retained Earnings

### Step 3: Apply Revenue Model Context (Layaa AI Mode)
For Layaa AI revenue transactions, apply specific recognition rules:

**Implementation Fee (e.g., avg 2.5L):**
- On contract signing (50% deposit received):
  - Debit: Bank / Accounts Receivable
  - Credit: Deferred Revenue (full deposit amount)
- On milestone completion (revenue earned):
  - Debit: Deferred Revenue
  - Credit: Implementation Fee Revenue
- Note: GST applies — separate GST component (18% for IT services)

**Monthly Retainer (Starter 15k / Growth 40k / Enterprise custom):**
- On invoice raised:
  - Debit: Accounts Receivable
  - Credit: Retainer Revenue
  - Credit: GST Output Tax Payable (18%)
- On payment received:
  - Debit: Bank
  - Credit: Accounts Receivable

**TDS Deducted by Client (typically 10% under Section 194J):**
- When client pays net of TDS:
  - Debit: Bank (amount received)
  - Debit: TDS Receivable (TDS amount)
  - Credit: Accounts Receivable (gross invoice amount)

### Step 4: Create the Journal Entry
Format the entry with all required elements:

| Field | Value |
|-------|-------|
| **Date** | [transaction date] |
| **Entry Number** | [JE-YYYY-MM-###] |
| **Description** | [clear narrative of the transaction] |
| **Reference** | [invoice number, contract reference, or source document] |
| **Prepared By** | [name] |
| **Approved By** | [name, if applicable] |

| Account | Account Code | Debit | Credit |
|---------|-------------|-------|--------|
| [account name] | [code] | [amount] | |
| [account name] | [code] | | [amount] |
| **Totals** | | **[total]** | **[total]** |

### Step 5: Validate the Entry
Run validation checks:

**Fundamental Checks:**
- [ ] Total debits equal total credits
- [ ] Entry date falls within the correct accounting period
- [ ] Accounts used are valid and appropriate for the transaction type
- [ ] Amounts match source documents
- [ ] Description is clear and provides audit trail

**Classification Checks:**
- [ ] Revenue is recognized in the correct period (not prematurely)
- [ ] Expenses are matched to the period they relate to
- [ ] Assets and liabilities are properly classified (current vs. non-current)
- [ ] GST treatment is correct (exempt, 18%, reverse charge)

**Authorization Checks:**
- [ ] Entry is within the preparer's authorization limit
- [ ] Unusual or high-value entries are flagged for approval
- [ ] Reversing entries from prior periods are documented

### Step 6: Note Tax Implications
Identify and document tax impact:

**GST:**
- Is GST applicable? If yes, at what rate? (18% for IT/software services)
- Is input credit available?
- Does this affect GSTR-1 or GSTR-3B filing?
- Is reverse charge mechanism applicable? (for certain imported services)

**TDS:**
- Is TDS applicable on this payment? (Section 194J for professional fees at 10%, Section 194C for contracts at 1%/2%)
- Has TDS been deducted before payment?
- Is a TDS certificate needed?

**Income Tax:**
- Does this entry affect taxable income differently from book income?
- Any timing differences creating deferred tax?

### Step 7: Identify Supporting Documentation
List required supporting documents:

| Document | Purpose | Status |
|----------|---------|--------|
| [Invoice / Receipt] | Proof of transaction | [Available / Needed] |
| [Contract / Agreement] | Authority for the transaction | [Available / Needed] |
| [Bank Statement] | Confirmation of cash movement | [Available / Needed] |
| [Approval Email/Memo] | Authorization | [Available / Needed] |
| [GST Invoice] | Tax compliance | [Available / Needed] |
| [TDS Certificate] | Tax credit documentation | [Available / Needed] |

## Output Format

```
# Journal Entry — [Brief Description]
**Date:** [transaction date]
**Entry #:** [JE-YYYY-MM-###]
**Type:** [Standard / Adjusting / Reversing / Closing]
**Prepared:** [date]

## Entry

| # | Account | Code | Debit (INR) | Credit (INR) |
|---|---------|------|-------------|--------------|
| 1 | [account] | [code] | [amount] | |
| 2 | [account] | [code] | | [amount] |
| | **Totals** | | **[total]** | **[total]** |

**Narration:** [Clear description of the transaction and its business purpose]

**Reference:** [source document — invoice #, contract ref, etc.]

## Tax Notes
- **GST:** [applicable / exempt] — [rate] — [input credit eligible: yes/no]
- **TDS:** [applicable / not applicable] — [section] — [rate] — [amount]
- **Income Tax Impact:** [same as book / timing difference — details]

## Supporting Documentation
| Document | Status |
|----------|--------|
| [document] | [Available / Needed] |

## Validation
- [x] Debits = Credits: [amount]
- [x] Period: [correct period confirmed]
- [x] Accounts: [valid and appropriate]
- [ ] Approval: [pending / obtained from [name]]
```

## What Makes This Different from Generic Journal Entry
- Pre-built account mapping for Layaa AI's revenue model (implementation fees, retainers, deferred revenue)
- Handles the 50% deposit recognition pattern (deferred revenue on receipt, revenue on milestone)
- Includes Indian tax treatment (GST at 18%, TDS under Section 194J/194C)
- Separates recurring and one-time revenue for accurate financial reporting
- Documents GST and TDS implications for every entry
- Uses Layaa AI's pricing tiers as reference for amount validation
