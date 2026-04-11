---
name: metrics-review
description: >
  Analyze product and business metrics. Reviews KPIs, identifies trends, and provides data-driven
  recommendations for product decisions. In Layaa AI mode, compares against unit economics targets
  and pipeline conversion benchmarks. Trigger: "metrics review", "KPI review", "metrics analysis",
  "performance metrics", "business metrics", "data review". This skill replaces the generic
  product:metrics-review capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Metrics Review

Analyze product and business metrics, review KPIs, identify trends, and provide data-driven recommendations for product and business decisions.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

**Layaa AI product context:** Layaa AI does not have a traditional SaaS product. Metrics focus on service delivery efficiency, client acquisition and retention, revenue per engagement, and operational leverage (how many clients can be served with current capacity).

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/revenue-model.md — Pricing tiers, conversion funnel, revenue targets
- shared-references/company-identity.md — Company basics
- shared-references/icp-and-market.md — ICP profiles for segmentation analysis
- domain-references/finance/unit-economics.md — CAC, LTV, margins, NRR targets
- domain-references/revenue-ops/pipeline-tracker.md — Pipeline stage benchmarks
- domain-references/revenue-ops/forecast-methodology.md — Forecasting approach and assumptions
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Metrics and Time Period
Clarify what is being reviewed:
- Which metrics or KPIs are in scope?
- What time period is being reviewed? (week, month, quarter, year)
- Is there a comparison period? (period-over-period, year-over-year)
- Is there a target or benchmark to compare against?

If the user does not specify, suggest the most relevant metrics based on context.

### Step 2: Gather Data
Search the workspace for metric data:
1. Use Glob to find dashboards, spreadsheets, reports (`*metrics*`, `*dashboard*`, `*report*`, `*analytics*`, `*.xlsx`, `*.csv`)
2. Use Grep to find specific metric values, KPIs, or performance data
3. Ask the user for any data not found in the workspace

If data is limited, note which metrics are based on actual data vs. estimates.

### Step 3: Compare Against Targets (Layaa AI Mode)
For Layaa AI, compare metrics against established targets:

**Unit Economics Targets:**
| Metric | Target | Why It Matters |
|--------|--------|---------------|
| CAC (Customer Acquisition Cost) | < 15k | Must stay below threshold for sustainable growth |
| LTV:CAC Ratio | > 3:1 | Validates that client relationships are profitable |
| Gross Margin | 60-80% | Services business margin range |
| NRR (Net Revenue Retention) | > 100% | Indicates expansion revenue from existing clients |

**Pipeline Conversion Benchmarks:**
| Transition | Benchmark |
|-----------|-----------|
| MQL to SQL | 25% |
| SQL to Proposal | 60% |
| Proposal to Won | 35% |

**Revenue Model Benchmarks:**
| Metric | Benchmark |
|--------|-----------|
| Average Implementation Fee | 2.5L |
| Minimum Viable Budget | 50k+ |
| Deposit on Signing | 50% |
| Starter Retainer | 15k/month |
| Growth Retainer | 40k/month |

Flag any metric that deviates significantly (>20%) from target — both above and below.

### Step 4: Calculate Period-Over-Period Changes
For each metric:
- **Absolute change:** Current value - Previous value
- **Percentage change:** ((Current - Previous) / Previous) x 100
- **Direction:** Improving, declining, or stable (within +/-5%)
- **Trend:** Is the direction consistent over multiple periods or a one-time shift?

Present changes in a clear table with color/status indicators.

### Step 5: Identify Trends
Look beyond single-period changes:
- **3-period trend:** Is the metric consistently improving, declining, or volatile?
- **Acceleration/deceleration:** Is the rate of change increasing or decreasing?
- **Seasonality:** Are there patterns tied to time of year, fiscal cycles, or industry events?
- **Correlation:** Do any metrics move together? (e.g., CAC rising as pipeline volume drops)
- **Leading indicators:** Which metrics predict future performance? (e.g., MQL volume predicts revenue 2-3 months out)

### Step 6: Apply Pipeline Benchmarks (Layaa AI Mode)
For pipeline and funnel metrics, use Layaa AI's conversion benchmarks:

**Funnel Health Check:**
- MQL to SQL at 25% → If below: qualification criteria may be too strict, or lead quality is low
- SQL to Proposal at 60% → If below: discovery calls are not uncovering real pain, or proposals are delayed
- Proposal to Won at 35% → If below: pricing, competition, or proposal quality issues

**Revenue Velocity:**
- Calculate average deal cycle time per ICP
- Compare against ICP benchmarks (SaaS: 30-50 days, Logistics: 60-90 days, Fintech: 45-75 days, Professional Services: 50-80 days)
- Identify bottleneck stages where deals stall

**Pipeline Coverage:**
- Weighted pipeline / Revenue target = Coverage ratio
- Healthy coverage: 3x+ target
- Below 2x: pipeline generation needs immediate attention

### Step 7: Perform Root Cause Analysis
For each significantly changed metric:
1. **State the observation:** "[Metric] changed by [X%] from [previous] to [current]"
2. **Identify potential causes:** List 3-5 plausible reasons
3. **Evaluate evidence:** Which causes are supported by other data?
4. **Determine root cause:** The most likely explanation based on evidence
5. **Assess persistence:** Is this a one-time effect or an ongoing trend?

Use the "5 Whys" technique for critical metrics:
- Why did [metric] decline? → Because [immediate cause]
- Why did [immediate cause] happen? → Because [deeper cause]
- Continue until the actionable root cause is reached

### Step 8: Generate Recommendations
For each finding, provide actionable recommendations:
- **What to do:** Specific action with clear ownership
- **Why it matters:** Tie to business impact (revenue, efficiency, growth)
- **Expected impact:** Quantify where possible
- **Effort required:** Low/Medium/High
- **Priority:** Based on impact and urgency

### Step 9: Prioritize by Impact
Rank recommendations:
1. **Critical (act immediately):** Metrics significantly below target with revenue impact
2. **Important (act this period):** Declining trends that will become critical if unchecked
3. **Monitor (watch closely):** Metrics within range but showing early warning signs
4. **Optimize (when capacity allows):** Metrics on target but with room for improvement

## Output Format

```
# Metrics Review — [Period]
**Date:** [date]
**Period:** [start] to [end]
**Comparison:** [vs. previous period / vs. target / vs. same period last year]

## Executive Summary
[2-3 sentence summary: overall health, most significant finding, top recommendation]

## KPI Dashboard

### Primary Metrics
| Metric | Target | Previous | Current | Change | Trend | Status |
|--------|--------|----------|---------|--------|-------|--------|
| [metric] | [target] | [value] | [value] | [+/-%] | [arrow] | [On Track / Warning / Critical] |
| [metric] | [target] | [value] | [value] | [+/-%] | [arrow] | [On Track / Warning / Critical] |

### Unit Economics (Layaa AI Mode)
| Metric | Target | Actual | Status | Notes |
|--------|--------|--------|--------|-------|
| CAC | < 15k | [value] | [status] | [context] |
| LTV:CAC | > 3:1 | [ratio] | [status] | [context] |
| Gross Margin | 60-80% | [%] | [status] | [context] |
| NRR | > 100% | [%] | [status] | [context] |

### Pipeline Conversion (Layaa AI Mode)
| Transition | Benchmark | Actual | Delta | Diagnosis |
|-----------|-----------|--------|-------|-----------|
| MQL to SQL | 25% | [%] | [+/-%] | [finding] |
| SQL to Proposal | 60% | [%] | [+/-%] | [finding] |
| Proposal to Won | 35% | [%] | [+/-%] | [finding] |

## Trend Analysis

### [Metric 1 — Most Critical]
- **Observation:** [what the data shows]
- **Trend:** [3-period direction and acceleration]
- **Root Cause:** [evidence-based explanation]
- **Implication:** [what this means for the business]

### [Metric 2]
- **Observation:** [what the data shows]
- **Trend:** [3-period direction and acceleration]
- **Root Cause:** [evidence-based explanation]
- **Implication:** [what this means for the business]

[Continue for significant metrics...]

## Root Cause Analysis
| Metric | Observation | Root Cause | Evidence | Confidence |
|--------|------------|------------|----------|------------|
| [metric] | [change] | [cause] | [supporting data] | [High/Med/Low] |

## Prioritized Recommendations

### Critical — Act Immediately
1. **[Recommendation]** — [expected impact]
   - Owner: [who]
   - Effort: [Low/Med/High]
   - Metric affected: [which KPI]

### Important — Act This Period
2. **[Recommendation]** — [expected impact]
   - Owner: [who]
   - Effort: [Low/Med/High]
   - Metric affected: [which KPI]

### Monitor — Watch Closely
3. **[Metric to watch]** — [trigger for action]
   - Threshold: [when to escalate]
   - Check frequency: [daily/weekly/monthly]

### Optimize — When Capacity Allows
4. **[Recommendation]** — [expected impact]
   - Effort: [Low/Med/High]
   - Metric affected: [which KPI]

## Data Quality Notes
- [Which metrics are based on actual data vs. estimates]
- [Any data gaps or collection issues]
- [Recommendations for improving data quality]
```

## What Makes This Different from Generic Metrics Review
- Compares metrics against Layaa AI's specific unit economics targets (CAC <15k, LTV:CAC >3:1, margin 60-80%, NRR >100%)
- Uses Layaa AI's pipeline conversion benchmarks (25%/60%/35%) for funnel health diagnosis
- Evaluates pipeline coverage ratio against the 3x target for revenue predictability
- Compares deal cycle times against ICP-specific benchmarks (SaaS 30-50 days, Logistics 60-90 days)
- Understands the dual revenue model (implementation + retainer) for revenue analysis
- Applies minimum viable budget threshold (50k) for deal quality assessment
- Segments analysis by ICP category for targeted recommendations
- Measures operational leverage relevant to a services business (clients per team member)
