---
name: performance-report
description: >
  Generate marketing performance reports analyzing campaign metrics, channel ROI, conversion rates,
  and spend efficiency. Produces executive summaries with data-driven recommendations. In Layaa AI mode,
  benchmarks against defined KPIs and GTM targets. Trigger: "performance report", "campaign report",
  "marketing metrics", "channel ROI", "campaign analysis". This skill replaces the generic
  marketing:performance-report capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Performance Report

Generate marketing performance reports analyzing campaign metrics, channel ROI, conversion rates, and spend efficiency with executive summaries and data-driven recommendations.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics
- shared-references/icp-and-market.md — ICP profiles and personas
- shared-references/revenue-model.md — Pricing and conversion funnel
- domain-references/marketing/gtm-strategy.md — GTM strategy and targets
- domain-references/marketing/channel-playbooks.md — Channel benchmarks and playbooks
- domain-references/revenue-ops/gtm-revenue-alignment.md — GTM-revenue alignment framework
- domain-references/revenue-ops/pipeline-tracker.md — Pipeline tracking and conversion data
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Gather Campaign Data
Collect campaign performance data from the user:
- Ask the user for metrics or read from provided sources (spreadsheets, dashboards, reports)
- Required data points: impressions, clicks, conversions, spend, leads generated, revenue attributed
- Identify the reporting period and channels included
- If data is incomplete, ask the user for the missing metrics before proceeding

### Step 2: Load Benchmarks (Layaa AI Mode)
For Layaa AI mode, read channel playbooks and GTM strategy for benchmark comparison:
- Load channel-specific benchmarks from `domain-references/marketing/channel-playbooks.md`
- Load overall targets from `domain-references/marketing/gtm-strategy.md`
- Load pipeline conversion benchmarks from `domain-references/revenue-ops/pipeline-tracker.md`
- Note target KPIs for comparison in Step 4

### Step 3: Calculate KPIs
Calculate key performance indicators for each channel and overall:
- **CAC (Customer Acquisition Cost):** Total spend / customers acquired
- **ROI per channel:** (Revenue attributed - spend) / spend x 100
- **Conversion rates:** Click-through rate, lead conversion rate, MQL-to-SQL rate
- **Spend vs budget:** Actual spend / allocated budget x 100
- **Cost per lead (CPL):** Channel spend / leads generated
- **Cost per MQL:** Channel spend / MQLs generated
- **Pipeline contribution:** Revenue in pipeline attributed to each channel

### Step 4: Compare Against Benchmarks
Compare calculated KPIs against benchmarks:
- **Layaa AI benchmarks:** MQL-to-SQL conversion 25%, content engagement 3-8%, CAC below Rs.15k, pipeline target Rs.25L+/month, MQL target 50/month
- **General mode:** Use industry-standard benchmarks for the relevant sector
- Flag metrics that are above target (green), near target (yellow), or below target (red)
- Calculate variance from target for each metric

### Step 5: Identify Top Performers and Underperformers
Rank channels and campaigns by performance:
- Identify top 3 performing channels/campaigns by ROI
- Identify bottom 3 underperforming channels/campaigns
- Note any channels with high spend but low conversion (efficiency gaps)
- Highlight any channels showing improving or declining trends
- Flag any anomalies or data quality concerns

### Step 6: Generate Actionable Recommendations
Based on the analysis, provide specific recommendations:
- **Budget reallocation:** Shift spend from underperformers to top performers
- **Optimization actions:** Specific changes to improve underperforming channels
- **Scaling opportunities:** Channels with headroom for increased investment
- **Testing recommendations:** A/B tests or experiments to run next period
- **Risk mitigation:** Actions to address declining trends or efficiency gaps
- Prioritize recommendations by expected impact (high/medium/low)

### Step 7: Format as Executive Summary
Compile findings into a structured executive report with:
- High-level summary (3-5 bullet points of key findings)
- KPI dashboard table with benchmarks and actuals
- Channel comparison table
- Trend analysis (period-over-period changes)
- Prioritized recommendations

## Output Format

```
# Marketing Performance Report
**Period:** [reporting period]
**Prepared:** [date]

## Executive Summary
- [Key finding 1 — most important metric or trend]
- [Key finding 2 — top performer highlight]
- [Key finding 3 — area of concern]
- [Key finding 4 — budget efficiency observation]
- [Key finding 5 — recommendation preview]

## KPI Dashboard

| Metric | Actual | Target | Variance | Status |
|--------|--------|--------|----------|--------|
| Total Spend | [amount] | [budget] | [+/-] | [G/Y/R] |
| Total Leads | [count] | [target] | [+/-] | [G/Y/R] |
| MQLs | [count] | [target] | [+/-] | [G/Y/R] |
| MQL→SQL Rate | [%] | [target%] | [+/-] | [G/Y/R] |
| CAC | [amount] | [target] | [+/-] | [G/Y/R] |
| Pipeline Value | [amount] | [target] | [+/-] | [G/Y/R] |

## Channel Performance Comparison

| Channel | Spend | Leads | CPL | MQLs | ROI | Trend |
|---------|-------|-------|-----|------|-----|-------|
| [channel] | [amount] | [count] | [amount] | [count] | [%] | [up/down/flat] |

## Trend Analysis
[Period-over-period analysis with key trend observations]

## Top Performers
1. [Channel/campaign — why it performed well]
2. [Channel/campaign — why it performed well]
3. [Channel/campaign — why it performed well]

## Underperformers
1. [Channel/campaign — diagnosis of issue]
2. [Channel/campaign — diagnosis of issue]
3. [Channel/campaign — diagnosis of issue]

## Recommendations (Prioritized)
| Priority | Recommendation | Expected Impact | Effort |
|----------|---------------|-----------------|--------|
| High | [action] | [impact] | [effort] |
| Medium | [action] | [impact] | [effort] |
| Low | [action] | [impact] | [effort] |

## Next Steps
1. [Immediate action]
2. [This week]
3. [This month]
```

## What Makes This Different from Generic Performance Reporting
- Benchmarks against Layaa AI's specific KPI targets (MQL 50/mo, CAC <Rs.15k, pipeline Rs.25L+)
- Uses Layaa AI's channel playbook benchmarks for channel-specific comparison
- Connects marketing metrics to revenue pipeline through GTM-revenue alignment framework
- Evaluates performance in context of Layaa AI's ICP segments and funnel stages
- Recommendations align with Layaa AI's budget allocation framework and channel strategy
