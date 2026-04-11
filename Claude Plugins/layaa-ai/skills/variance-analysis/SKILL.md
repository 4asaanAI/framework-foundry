---
name: variance-analysis
description: >
  Analyze budget-to-actual variances, period-over-period changes, and forecast accuracy.
  Identifies root causes and provides actionable recommendations with benchmarking.
  Trigger: "variance analysis", "budget vs actual", "variance report", "forecast accuracy",
  "month-over-month", "period comparison", "unfavorable variance", "cost overrun"
  This skill replaces the generic finance:variance-analysis capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Variance Analysis

Analyze budget-to-actual variances, period-over-period changes, and forecast accuracy. Identifies root causes using structured frameworks and provides actionable recommendations.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/revenue-model.md — Pricing, conversion rates, revenue structure
- domain-references/finance/unit-economics.md — Gross margin, CAC, LTV targets and benchmarks
- domain-references/finance/pricing-engine.md — Pricing model details and margin targets
- domain-references/revenue-ops/forecast-methodology.md — Forecast accuracy thresholds and 5-Why framework
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Analysis Scope
Determine the comparison being requested:

**Analysis Types:**
- **Budget vs. Actual:** Compare planned budget against actual results
- **Month-over-Month (MoM):** Compare current month to prior month
- **Quarter-over-Quarter (QoQ):** Compare current quarter to prior quarter
- **Year-over-Year (YoY):** Compare to same period last year
- **Forecast vs. Actual:** Compare forecasted figures to actual results
- **Standard vs. Actual:** Compare standard costs/rates to actual (for unit economics)

**Scope:**
- Full P&L variance
- Specific line item (e.g., marketing spend, salary costs)
- Revenue only (by type, by client, by ICP)
- Cost center or department level

If unclear, ask the user for the comparison type, period, and level of detail needed.

### Step 2: Gather Comparison Data
Collect both sides of the comparison:

**Actuals:**
- Search workspace: Use Glob for `*actual*`, `*financial*`, `*P&L*`, `*revenue*`, `*.xlsx`
- Use Grep for revenue, expense, and financial data
- Extract actual figures by line item and period

**Budget/Forecast/Prior Period:**
- Search workspace: Use Glob for `*budget*`, `*forecast*`, `*plan*`, `*target*`
- Extract comparative figures for the same line items

If no structured data exists, ask the user to provide:
- Actual figures for the analysis period
- Budget, forecast, or prior period figures for comparison
- Any known context for significant changes

### Step 3: Calculate Variances
For each line item, compute:

| Line Item | Budget/Prior | Actual | Variance ($) | Variance (%) | F/U |
|-----------|-------------|--------|-------------|-------------|-----|
| [item] | [amount] | [amount] | [difference] | [%] | [Favorable/Unfavorable] |

**Calculation Rules:**
- Revenue variance: Actual > Budget = Favorable
- Expense variance: Actual < Budget = Favorable
- Margin variance: Actual margin > Budget margin = Favorable
- Use absolute and percentage variance — both matter for different reasons

**Aggregation:**
- Calculate sub-totals for each category (revenue, COGS, operating expenses)
- Calculate overall impact on operating profit and net profit
- Show the cascade: How does each variance flow through to the bottom line?

### Step 4: Benchmark Against Unit Economics (Layaa AI Mode)
Compare key metrics against Layaa AI's established benchmarks:

| Metric | Target/Benchmark | Actual | Variance | Status |
|--------|-----------------|--------|----------|--------|
| Gross Margin | 60-80% | [actual %] | [+/- pp] | [On Track / Below / Above] |
| CAC | <15,000 | [actual] | [+/- amount] | [On Track / Above] |
| Revenue per Client (Impl.) | ~2.5L avg | [actual] | [+/- amount] | [status] |
| Recurring Revenue % | Growing | [actual %] | [trend] | [status] |
| Operating Margin | Positive | [actual %] | [+/- pp] | [status] |

Apply forecast methodology thresholds from `domain-references/revenue-ops/forecast-methodology.md`:
- Current month forecast accuracy target: within ±5%
- Next month forecast accuracy target: within ±10%
- Variances exceeding these thresholds require root cause analysis

### Step 5: Classify Variances
Categorize each variance:

**By Favorability:**
- **Favorable:** Improves profitability (higher revenue or lower costs than planned)
- **Unfavorable:** Reduces profitability (lower revenue or higher costs than planned)

**By Controllability:**
- **Controllable:** Within management's ability to influence (staffing decisions, marketing spend, pricing)
- **Partially Controllable:** Influenced by external factors but manageable (client churn, conversion rates)
- **Uncontrollable:** External forces (regulatory changes, market conditions, currency)

**By Nature:**
- **Price Variance:** Actual price/rate different from budgeted (e.g., average deal size higher/lower)
- **Volume Variance:** Actual volume different from budgeted (e.g., fewer/more deals closed)
- **Mix Variance:** Different product/service mix than planned (e.g., more Starter, fewer Growth retainers)
- **Efficiency Variance:** More/less resources used than planned per unit of output
- **Timing Variance:** Revenue/expense in different period than planned (not a true variance)

### Step 6: Root Cause Analysis for Material Variances
For any variance exceeding 5% (materiality threshold), perform structured root cause analysis:

**5-Why Analysis Framework (from Layaa AI forecast methodology):**
1. **Why** did the variance occur? (Surface-level cause)
2. **Why** did that happen? (Contributing factor)
3. **Why** did that factor arise? (Process or system issue)
4. **Why** was that not prevented? (Control gap)
5. **Why** does that control gap exist? (Root cause)

**Example — Revenue Below Budget:**
1. Why? Revenue was 15% below budget
2. Why? Fewer deals closed (3 vs. 5 budgeted)
3. Why? Two proposals were delayed — clients pushed decisions to next quarter
4. Why? Proposals did not address client-specific concerns raised in discovery
5. Why? Discovery process did not capture all decision criteria → Root cause: Discovery template needs revision

Document the 5-Why chain for each material variance.

### Step 7: Apply 5-Why Analysis Framework (Layaa AI Mode)
For Layaa AI, focus root cause analysis on these common variance drivers:

**Revenue Variances:**
- Deal size: Are implementation fees averaging 2.5L or deviating?
- Conversion rates: MQL→SQL (25%), SQL→Proposal (60%), Proposal→Won (35%) — which stage is off?
- Deal mix: Ratio of Starter vs. Growth vs. Enterprise retainers
- Timing: Deals slipping across period boundaries
- Client concentration: Over-reliance on one ICP segment

**Cost Variances:**
- Headcount: Actual vs. planned team size
- Software/tool costs: New tools added or pricing changes
- Marketing spend: Campaign costs vs. budget allocation
- Delivery costs: More effort than estimated on client projects
- Subcontractor/freelancer costs: Outsourcing vs. in-house delivery

### Step 8: Generate Recommendations
For each unfavorable variance, provide actionable recommendations:

**Revenue Improvement:**
- If conversion below benchmark → Specific stage-by-stage interventions
- If deal size below target → Pricing review, upsell strategy, service packaging changes
- If mix unfavorable → ICP targeting adjustments, sales training on higher-tier packages

**Cost Reduction:**
- If expense growth > revenue growth → Identify discretionary cuts
- If delivery costs above estimate → Scope management, template/process improvements
- If CAC above 15k → Channel optimization, lead quality improvement

**Forecast Improvement:**
- If forecast accuracy outside threshold → Identify systematic bias (optimism/pessimism)
- If timing variances dominate → Improve deal stage definitions and close date estimation

### Step 9: Update Forecast if Systematic Bias Detected
If variance analysis reveals consistent patterns:
- Revenue consistently above/below by >10% → Adjust forecast methodology assumptions
- Costs consistently above by >5% → Revise cost budgets for remaining periods
- Conversion rates consistently different from benchmarks → Update benchmark rates
- Seasonal patterns identified → Incorporate seasonality into future forecasts

Document recommended forecast adjustments with justification.

## Output Format

```
# Variance Analysis — [Period]
**Analysis Type:** [Budget vs. Actual / MoM / QoQ / YoY / Forecast vs. Actual]
**Period:** [analysis period]
**Comparison:** [what is being compared]
**Prepared:** [date]

## Executive Summary
- **Total Revenue Variance:** [amount] ([%]) — [Favorable/Unfavorable]
- **Total Expense Variance:** [amount] ([%]) — [Favorable/Unfavorable]
- **Net Profit Impact:** [amount] ([%]) — [Favorable/Unfavorable]
- **Material Variances:** [count] items exceeding 5% threshold
- **Key Driver:** [one-sentence summary of the most impactful variance]

## Detailed Variance Report

### Revenue Variances
| Line Item | Budget/Prior | Actual | Variance ($) | Variance (%) | F/U | Classification |
|-----------|-------------|--------|-------------|-------------|-----|---------------|
| Implementation Revenue | [amt] | [amt] | [amt] | [%] | [F/U] | [Price/Volume/Mix] |
| Retainer Revenue | [amt] | [amt] | [amt] | [%] | [F/U] | [Price/Volume/Mix] |
| Training Revenue | [amt] | [amt] | [amt] | [%] | [F/U] | [Price/Volume/Mix] |
| **Total Revenue** | **[amt]** | **[amt]** | **[amt]** | **[%]** | **[F/U]** | |

### Expense Variances
| Line Item | Budget/Prior | Actual | Variance ($) | Variance (%) | F/U | Controllability |
|-----------|-------------|--------|-------------|-------------|-----|-----------------|
| [expense] | [amt] | [amt] | [amt] | [%] | [F/U] | [C/PC/UC] |
| **Total Expenses** | **[amt]** | **[amt]** | **[amt]** | **[%]** | **[F/U]** | |

### Margin Analysis
| Metric | Budget/Prior | Actual | Variance (pp) | Status |
|--------|-------------|--------|-------------|--------|
| Gross Margin | [%] | [%] | [+/- pp] | [vs. 60-80% target] |
| Operating Margin | [%] | [%] | [+/- pp] | [status] |
| Net Margin | [%] | [%] | [+/- pp] | [status] |

## Unit Economics Check (Layaa AI)
| Metric | Target | Actual | Variance | Action |
|--------|--------|--------|----------|--------|
| Gross Margin | 60-80% | [%] | [pp] | [action if off-target] |
| CAC | <15k | [amount] | [amount] | [action if off-target] |
| Avg Deal Size | ~2.5L | [amount] | [amount] | [action if off-target] |

## Root Cause Analysis — Material Variances

### Variance 1: [Description] ([amount], [%])
**5-Why Analysis:**
1. Why? [surface cause]
2. Why? [contributing factor]
3. Why? [process issue]
4. Why? [control gap]
5. Why? [root cause]

**Root Cause:** [concise statement]
**Recommendation:** [specific action]

### Variance 2: [Description]
[repeat format]

## Variance Waterfall
```
Budget Net Profit:         [amount]
+ Favorable Revenue:      +[amount]
- Unfavorable Revenue:     -[amount]
+ Favorable Expenses:     +[amount]
- Unfavorable Expenses:    -[amount]
= Actual Net Profit:       [amount]
```

## Recommendations
| # | Action | Expected Impact | Priority | Owner |
|---|--------|----------------|----------|-------|
| 1 | [action] | [impact on variance] | [High/Med/Low] | [name] |
| 2 | [action] | [impact] | [priority] | [name] |
| 3 | [action] | [impact] | [priority] | [name] |

## Forecast Adjustments (if applicable)
| Item | Current Forecast | Recommended Adjustment | Justification |
|------|-----------------|----------------------|---------------|
| [item] | [amount] | [new amount] | [why] |

## Assumptions and Notes
- Materiality threshold: 5% of line item
- [other assumptions]
```

## What Makes This Different from Generic Variance Analysis
- Benchmarks against Layaa AI's unit economics targets (gross margin 60-80%, CAC <15k)
- Uses forecast methodology accuracy thresholds (±5% current month, ±10% next month)
- Applies the 5-Why root cause analysis framework from Layaa AI's forecast methodology
- Decomposes revenue variances by Layaa AI's revenue types (implementation, retainer, training)
- Validates conversion rates against Layaa AI's funnel benchmarks (25% / 60% / 35%)
- Classifies deal mix variances by retainer tier (Starter/Growth/Enterprise)
- Recommends forecast adjustments when systematic bias is detected
- Understands pricing engine context for deal size variance analysis
