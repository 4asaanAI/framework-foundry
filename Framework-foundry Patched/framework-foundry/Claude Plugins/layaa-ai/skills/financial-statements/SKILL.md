---
name: financial-statements
description: >
  Analyze, prepare, or review financial statements including income statements, balance sheets,
  cash flow statements, and financial ratios. Supports quarterly and annual financial reporting.
  Trigger: "financial statements", "income statement", "balance sheet", "cash flow", "financial ratios",
  "P&L", "profit and loss", "financial reporting"
  This skill replaces the generic finance:financial-statements capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Financial Statements

Analyze, prepare, or review financial statements including income statements, balance sheets, cash flow statements, and financial ratios. Supports quarterly and annual financial reporting with ratio analysis and trend commentary.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/finance/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/revenue-model.md — Pricing tiers, conversion funnel, revenue structure
- domain-references/finance/unit-economics.md — CAC, LTV, gross margin targets, unit economics benchmarks
- domain-references/finance/company-filings.md — Entity details, CIN, PAN, TAN, statutory context
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Statement Type and Period
Determine what the user needs:
- **Statement type:** Income statement (P&L), balance sheet, cash flow statement, or all three
- **Period:** Monthly, quarterly, annual, or comparative (multi-period)
- **Purpose:** Internal review, investor reporting, statutory filing, bank submission, or ad-hoc analysis
- **Basis:** Accrual or cash basis (default to accrual for Indian companies)

If unclear, ask the user to specify the statement type, reporting period, and intended audience.

### Step 2: Load Layaa AI Context (Layaa AI Mode)
For Layaa AI tasks:
1. Read `domain-references/finance/company-filings.md` for entity details:
   - Legal name: Layaa AI Private Limited
   - CIN: U62099HR2025PTC139528
   - PAN: AAGCL6342M | TAN: RTKL05493F
   - Location: Gurgaon, Haryana
2. Read `domain-references/finance/unit-economics.md` for performance benchmarks:
   - Target gross margin: 60-80%
   - Target CAC: <15k
   - Average implementation fee: 2.5L
   - Monthly retainer tiers: Starter 15k, Growth 40k, Enterprise custom
3. Read `shared-references/revenue-model.md` for revenue classification guidance:
   - Implementation fees → one-time revenue
   - Monthly retainers → recurring revenue
   - 50% deposit → deferred revenue until earned

### Step 3: Gather Financial Data
Search the workspace for financial data:
1. Use Glob to find financial files (`*.xlsx`, `*.csv`, `*financial*`, `*revenue*`, `*expense*`, `*ledger*`)
2. Use Grep to find revenue entries, expense records, bank statements
3. Look for prior period statements for comparative analysis

If no structured data exists, ask the user for:
- Revenue figures by category (implementation fees, retainers, other income)
- Cost of goods sold / direct costs
- Operating expenses by category (salaries, rent, software, marketing, etc.)
- Assets, liabilities, and equity balances (for balance sheet)
- Cash receipts and payments (for cash flow)

### Step 4: Prepare or Analyze the Statement
Build the statement with proper format and classifications:

**Income Statement (P&L):**
- Revenue: Segregate implementation revenue (one-time) from retainer revenue (recurring)
- Cost of Revenue: Direct costs attributable to service delivery
- Gross Profit: Revenue minus cost of revenue
- Operating Expenses: Salaries, rent, software subscriptions, marketing, travel, professional fees
- EBITDA: Earnings before interest, taxes, depreciation, amortization
- Net Profit: After all deductions including tax provisions

**Balance Sheet:**
- Current Assets: Cash, bank balances, accounts receivable, deposits, prepaid expenses
- Non-Current Assets: Fixed assets (net of depreciation), intangible assets
- Current Liabilities: Accounts payable, deferred revenue, statutory dues, short-term borrowings
- Non-Current Liabilities: Long-term borrowings, provisions
- Shareholders' Equity: Share capital, reserves, retained earnings

**Cash Flow Statement:**
- Operating Activities: Net profit adjusted for non-cash items and working capital changes
- Investing Activities: Asset purchases, disposals
- Financing Activities: Equity infusion, borrowings, repayments

### Step 5: Calculate Key Ratios
Compute and present relevant financial ratios:

**Profitability Ratios:**
- Gross Margin: Gross Profit / Revenue
- Operating Margin: Operating Profit / Revenue
- Net Margin: Net Profit / Revenue
- EBITDA Margin: EBITDA / Revenue

**Liquidity Ratios:**
- Current Ratio: Current Assets / Current Liabilities
- Quick Ratio: (Current Assets - Inventory) / Current Liabilities
- Cash Ratio: Cash & Equivalents / Current Liabilities

**Efficiency Ratios:**
- Revenue per Employee
- Days Sales Outstanding (DSO): (Accounts Receivable / Revenue) x Days
- Days Payable Outstanding (DPO): (Accounts Payable / COGS) x Days

**Growth Ratios (if comparative):**
- Revenue Growth Rate (period-over-period)
- Expense Growth Rate
- Net Profit Growth Rate

### Step 6: Benchmark Against Targets (Layaa AI Mode)
Compare actual performance against Layaa AI unit economics targets:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Gross Margin | 60-80% | [calculated] | [On Track / Below / Above] |
| CAC | <15k | [calculated] | [On Track / Above] |
| Revenue Mix (recurring %) | Growing | [calculated] | [Trend direction] |
| Average Deal Size | ~2.5L impl | [calculated] | [On Track / Below / Above] |
| Operating Margin | Positive | [calculated] | [Status] |

Flag any metrics significantly below target and provide context.

### Step 7: Highlight Notable Items, Trends, and Concerns
Identify and comment on:
- **Unusual items:** One-time gains or losses, write-offs, prior period adjustments
- **Trends:** Revenue trajectory, expense growth vs. revenue growth, margin trends
- **Concerns:** Negative cash flow, high DSO, declining margins, concentration risk
- **Positive signals:** Improving margins, growing recurring revenue, declining CAC
- **Statutory items:** GST input credit balances, TDS receivable/payable, advance tax provisions

### Step 8: Provide Commentary and Recommendations
Deliver actionable insights:
1. **Revenue quality:** Is recurring revenue growing as a percentage of total? Is there client concentration risk?
2. **Cost structure:** Are costs scaling proportionally with revenue? Any cost categories growing faster than revenue?
3. **Cash management:** Is the company generating positive operating cash flow? What is the cash runway?
4. **Working capital:** Are receivables being collected on time? Is the 50% deposit policy being enforced?
5. **Specific recommendations:** 2-3 concrete actions to improve financial performance

## Output Format

```
# Financial Statement Analysis — [Period]
**Entity:** [Company name]
**Period:** [reporting period]
**Prepared:** [date]
**Basis:** [Accrual / Cash]

## [Statement Type — e.g., Income Statement]

| Line Item | Current Period | Prior Period | Change (%) |
|-----------|---------------|-------------|------------|
| [item] | [amount] | [amount] | [+/- %] |

## Key Financial Ratios

| Ratio | Current Period | Prior Period | Benchmark | Status |
|-------|---------------|-------------|-----------|--------|
| Gross Margin | [%] | [%] | [target] | [status] |
| Operating Margin | [%] | [%] | [target] | [status] |
| Current Ratio | [x] | [x] | [>1.5x] | [status] |
| DSO | [days] | [days] | [<45 days] | [status] |

## Trend Analysis
- **Revenue:** [trend description with growth rate]
- **Margins:** [trend description]
- **Cash Position:** [trend description]

## Notable Items
1. [item and explanation]
2. [item and explanation]

## Recommendations
1. **[Action]** — [expected impact]
2. **[Action]** — [expected impact]
3. **[Action]** — [expected impact]

## Assumptions and Limitations
- [any assumptions made in the analysis]
- [data limitations or caveats]
```

## What Makes This Different from Generic Financial Statements
- Separates implementation revenue from retainer revenue reflecting Layaa AI's dual revenue model
- Benchmarks against Layaa AI's specific unit economics targets (gross margin 60-80%, CAC <15k)
- Understands deferred revenue treatment for 50% deposit model
- Includes Indian statutory context (GST, TDS, advance tax provisions)
- Tracks recurring revenue percentage as a key health indicator for service businesses
- Uses Layaa AI entity details for statutory statement headers
