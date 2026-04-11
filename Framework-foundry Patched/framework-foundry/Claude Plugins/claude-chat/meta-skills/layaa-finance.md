---
name: layaa-finance
description: >
  Layaa AI Finance skill group. Use for: financial statements, journal entries,
  account reconciliation, variance analysis, month-end close management, SOX
  testing, audit support, and journal entry preparation. Applies Indian
  accounting standards and Layaa AI's unit economics framework.
  Works for Layaa AI and general finance tasks.
user-invocable: true
---

# Layaa Finance — Skill Group

## Available Sub-Skills

| Sub-Skill | When to Use |
|-----------|------------|
| **financial-statements** | Generate P&L, balance sheet, cash flow with margin analysis |
| **journal-entry** | Prepare journal entries with debits, credits, and commentary |
| **journal-entry-prep** | Prepare supporting documentation for journal entries |
| **reconciliation** | Reconcile accounts, match transactions, flag discrepancies |
| **variance-analysis** | Decompose variances into drivers with narrative explanations |
| **close-management** | Manage month-end close process with task sequencing |
| **sox-testing** | SOX sample selection, testing workpapers, control assessment |
| **audit-support** | Support audit prep, control documentation, evidence gathering |

## How to Use
- "Prepare a P&L for Q1 with margin analysis" → **financial-statements**
- "Reconcile our accounts receivable against client invoices" → **reconciliation**
- "Why did our costs increase 15% vs last month?" → **variance-analysis**
- "Help me close the books for March" → **close-management**

---

## Context Detection
- **Layaa AI mode:** Mention Layaa AI, our clients, Indian accounting → apply Layaa AI finance context from Project Knowledge
- **General mode:** Standard finance assistant

---

## Layaa AI Finance Context (Quick Reference)

**Accounting:** Indian GAAP (Companies Act 2013) | **GST:** 18% on all services, charged separately
**Financial Year:** April 1 – March 31 | **Revenue:** Implementation (milestone-based) + Retainer (monthly)

**Revenue recognition:** 50% advance = deferred until delivery | 50% on delivery = recognised at delivery | Retainer = recognised monthly as services rendered

**Key metrics:** MRR | Gross margin (target: >35% all verticals) | CAC:LTV (target: ≥2.5x) | DSO (target: <45 days) | Cash runway (target: >6 months)

**Red flags → escalate to Founders:** Margin <30% | CAC:LTV <2.5x | Discount >20% | AR aging >60 days | Cash runway <3 months

---

## Sub-Skill Execution

### financial-statements
1. Take data: revenue, expenses, assets, liabilities
2. Generate: P&L (Revenue → Gross Profit → EBITDA → Net Profit), Balance Sheet (Assets/Liabilities/Equity), Cash Flow (Operating/Investing/Financing)
3. Apply Layaa AI revenue structure: implementation vs. retainer split, GST treatment (exclude from revenue)
4. Add analysis: margin by vertical, MRR growth, key ratios (gross margin, DSO, runway)
5. Flag any red flag metrics against thresholds from Project Knowledge

### journal-entry
1. Identify transaction type and account impact
2. Apply double-entry: Dr/Cr with account codes and descriptions
3. Add: date, description, supporting document reference, GST treatment
4. Note: correct period, authorisation requirements
5. For Layaa AI: apply Indian GAAP revenue recognition — deferred vs. recognised

### journal-entry-prep
1. Identify journal entry to be posted
2. Gather required supporting documents: invoice, receipt, contract, bank statement
3. Prepare: document checklist, narrative explanation, approver requirements
4. Cross-check amounts against source documents before posting

### reconciliation
1. Take data: GL balances, bank statements, or subledger figures
2. Match transactions item by item
3. Categorise unmatched items: timing differences vs. errors vs. missing entries
4. Recommend: entries to book, items to investigate, items to write off
5. Output: reconciliation schedule in table format with status column

### variance-analysis
1. Take: budget vs. actual data by line item
2. Decompose variance: volume effect, price/rate effect, mix effect
3. Identify root causes for each major variance (>5% or >₹10K)
4. Write narrative: plain English explanation suitable for management or investor reporting
5. Recommend: corrective actions where variance is unfavourable

### close-management
1. Build month-end checklist: bank reconciliation, AR aging, accruals, prepayments, GST filing prep, payroll, depreciation
2. Sequence by dependency (what must complete before what)
3. Assign timing: Day 1-3 (transactions close) → Day 3-5 (reconciliations) → Day 5-7 (accruals) → Day 7-10 (review + sign-off)
4. Flag items specific to Indian financial year-end (March 31)
5. Track status per item: Not started / In progress / Complete / Blocked

### sox-testing
1. Define control to test: description, frequency, owner
2. Select sample: methodology (random/risk-based), sample size, document selection rationale
3. Prepare testing workpaper: control description → test procedure → evidence required → results → conclusion
4. Classify: Effective / Ineffective / Needs Remediation
5. Document any exceptions found with detail

### audit-support
1. Identify audit scope and requirements
2. Prepare evidence checklist by audit area
3. Document: control objectives, control descriptions, testing procedures
4. Flag: control gaps, compensating controls needed, areas requiring CA or legal review
5. Organise supporting documents in clear structure for auditor review
