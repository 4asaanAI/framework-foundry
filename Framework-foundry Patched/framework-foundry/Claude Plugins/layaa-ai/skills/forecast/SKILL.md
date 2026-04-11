---
name: forecast
description: >
  Generate a weighted sales forecast with scenarios.
  In Layaa AI mode, uses Layaa's conversion rates and deal sizing.
  Replaces generic sales:forecast.
  Trigger: "sales forecast", "revenue forecast", "pipeline forecast"
user-invocable: true
allowed-tools: Read, Grep, Glob
---

# Sales Forecast

Generate a weighted sales forecast with scenario analysis, using pipeline data, conversion benchmarks, and deal-level probability assessments.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/sales/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics
- shared-references/icp-and-market.md — ICP profiles and personas
- shared-references/revenue-model.md — Pricing and conversion funnel
- shared-references/service-verticals.md — Services and methodology
- domain-references/sales/sales-playbook.md — Battle cards and objection handling
- domain-references/sales/service-config-matrix.md — Package tiers
- domain-references/sales/pricing-quick-ref.md — Pricing tables
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Collect Pipeline Data
Search the workspace for deal and revenue data:
1. Use Glob to find pipeline trackers, revenue spreadsheets, or deal files
2. Use Grep to find recent proposals, call summaries, and deal status notes
3. Look for historical win/loss data to calibrate predictions

If no structured data exists, ask the user for:
- List of active deals (company, stage, estimated value, expected close date)
- Any target/quota for the forecast period
- Historical close rates if available
- Forecast period (this month, this quarter, this year)

### Step 2: Assign Stage-Based Probabilities (Layaa AI Mode)
Apply default probabilities based on pipeline stage, derived from Layaa AI's conversion benchmarks:

| Stage | Default Probability | Rationale |
|-------|-------------------|-----------|
| MQL | 5% | MQL→SQL (25%) x SQL→Proposal (60%) x Proposal→Won (35%) = ~5% |
| SQL | 21% | SQL→Proposal (60%) x Proposal→Won (35%) = 21% |
| Proposal | 35% | Proposal→Won benchmark |
| Negotiation | 60% | Past the proposal stage, actively discussing terms |
| Verbal Commit | 85% | Agreed but not signed |
| Closed Won | 100% | Signed |

Override with deal-specific probability if the user provides one, but flag significant deviations from stage defaults.

### Step 3: Deal-Level Adjustments
For each deal, adjust the base probability up or down based on:

**Upward adjustments (+5-15%):**
- Champion identified and actively engaged
- Decision maker directly involved in conversations
- Budget explicitly confirmed
- Short, defined decision timeline
- No competitive threat identified
- Strong ICP fit (matches primary ICP exactly)

**Downward adjustments (-5-20%):**
- No champion or champion has gone silent
- Decision maker not yet engaged
- Budget unclear or constrained
- Timeline has slipped more than once
- Active competitive evaluation underway
- Weak ICP fit (edge case or non-standard requirements)
- Legal or procurement process identified as complex

Cap adjusted probability at 95% (never assume 100% until signed).

### Step 4: Revenue Calculation (Layaa AI Mode)
For each deal, calculate both components of revenue:

**Implementation Revenue (one-time):**
- Deal value x adjusted probability = weighted implementation revenue
- Note: 50% deposit on contract signing, remainder on delivery
- Average implementation fee: 2.5L (adjust per deal if specific pricing exists)

**Retainer Revenue (recurring):**
- Estimate monthly retainer based on service package:
  - Starter: 15k/month
  - Growth: 40k/month
  - Enterprise: Custom
- Calculate retainer for the forecast period (months remaining x monthly rate x probability)
- Note: Retainer starts after implementation, so factor in implementation timeline

**Total Weighted Revenue = Weighted Implementation + Weighted Retainer**

### Step 5: Scenario Analysis
Generate three forecast scenarios:

**Best Case (Optimistic):**
- All Tier 1 and Tier 2 deals close
- Apply upward-adjusted probabilities
- New deals from active MQLs convert at benchmark rates
- Include known upcoming opportunities not yet in pipeline

**Expected Case (Realistic):**
- Apply adjusted stage-based probabilities
- No new deals added from MQLs (only current pipeline)
- Standard conversion rates apply

**Worst Case (Conservative):**
- Only Green-status / high-confidence deals close
- Apply downward-adjusted probabilities
- Remove any deal with a known risk factor
- Assume competitive losses for deals in active evaluation

### Step 6: Time-Based Forecast
Break down the forecast by time period:

**Monthly Breakdown:**
For each month in the forecast period:
- Which deals are expected to close
- Weighted revenue per month
- Cumulative revenue vs. target

**Quarter Breakdown (if applicable):**
- Quarterly totals for all three scenarios
- Quarter-over-quarter growth trajectory

### Step 7: Gap Analysis (Layaa AI Mode)
If a target/quota is provided:
1. Calculate the gap between expected forecast and target
2. Determine how many additional deals are needed to close the gap:
   - Gap / Average deal size (2.5L implementation + 6 months retainer at Growth tier = 2.5L + 2.4L = ~4.9L)
3. Determine how many SQLs are needed to generate those deals:
   - Required deals / Proposal→Won rate (35%) = proposals needed
   - Proposals needed / SQL→Proposal rate (60%) = SQLs needed
   - SQLs needed / MQL→SQL rate (25%) = MQLs needed
4. Assess whether the gap is closable given current pipeline velocity and lead generation capacity

### Step 8: Forecast Risks and Assumptions
Document:
- **Key assumptions** underlying the forecast (conversion rates, deal sizes, timing)
- **Concentration risk** — Is too much revenue dependent on one or two deals?
- **ICP risk** — Is the pipeline over-indexed on one ICP category?
- **Timing risk** — Are many deals expected to close in the same narrow window?
- **Seasonal factors** — Any known seasonality (budget cycles, holidays, fiscal year ends)

### Step 9: Recommendations
Based on the forecast, recommend:
1. **Pipeline building:** If top-of-funnel is thin, recommend outreach campaigns by ICP
2. **Deal acceleration:** Specific actions to speed up high-value, high-probability deals
3. **Risk mitigation:** Actions to de-risk the forecast (backup plans, deal diversification)
4. **Resource allocation:** Where to focus founder time for maximum revenue impact

## Output Format

```
# Sales Forecast — [Period]
**Generated:** [date]
**Period:** [start date] to [end date]
**Target:** [if provided]

## Forecast Summary

| Scenario | Implementation | Retainer (Period) | Total | vs. Target |
|----------|---------------|-------------------|-------|------------|
| Best Case | [amount] | [amount] | [amount] | [+/- amount] |
| Expected | [amount] | [amount] | [amount] | [+/- amount] |
| Worst Case | [amount] | [amount] | [amount] | [+/- amount] |

## Deal-Level Forecast

| Deal | ICP | Stage | Base Prob | Adj. Prob | Impl. Value | Retainer/mo | Weighted Total | Close Date |
|------|-----|-------|-----------|-----------|-------------|-------------|----------------|------------|
| [company] | [icp] | [stage] | [%] | [%] | [amount] | [amount] | [amount] | [date] |

**Pipeline Totals:**
- Unweighted: [total]
- Weighted: [total]
- Deal count: [number]
- Average deal size: [amount]

## Monthly Breakdown

| Month | Expected Revenue | Cumulative | vs. Target | Deals Closing |
|-------|-----------------|------------|------------|---------------|
| [month] | [amount] | [amount] | [+/-] | [list] |

## Gap Analysis
- **Target:** [amount]
- **Expected Forecast:** [amount]
- **Gap:** [amount]
- **Deals Needed:** [number] at average deal size of [amount]
- **SQLs Needed:** [number] (at 60% SQL→Proposal, 35% Proposal→Won)
- **MQLs Needed:** [number] (at 25% MQL→SQL conversion)
- **Assessment:** [closable / stretch / unlikely] given current pipeline velocity

## Risk Assessment
| Risk Type | Description | Impact | Mitigation |
|-----------|-------------|--------|------------|
| Concentration | [description] | [High/Med/Low] | [action] |
| Timing | [description] | [High/Med/Low] | [action] |
| ICP Balance | [description] | [High/Med/Low] | [action] |

## Recommendations
1. **[Priority action]** — [expected impact on forecast]
2. **[Priority action]** — [expected impact on forecast]
3. **[Priority action]** — [expected impact on forecast]

## Assumptions
- Conversion rates: MQL→SQL 25%, SQL→Proposal 60%, Proposal→Won 35%
- Average implementation fee: 2.5L
- Retainer pricing: Starter 15k, Growth 40k, Enterprise custom
- [any other assumptions]
```

## What Makes This Different from Generic Forecast
- Uses Layaa AI's actual conversion benchmarks (25% / 60% / 35%) for probability calibration
- Separates implementation revenue from retainer revenue, reflecting Layaa AI's dual revenue model
- Applies Layaa AI's pricing tiers (Starter/Growth/Enterprise) for retainer forecasting
- Gap analysis calculates backwards through the full funnel using Layaa AI's specific conversion rates
- Understands the 50% deposit model for implementation revenue timing
- Categorizes deals by ICP for concentration risk analysis
- Average deal size based on Layaa AI's actual pricing (2.5L implementation)
