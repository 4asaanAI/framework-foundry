---
name: pipeline-review
description: >
  Analyze pipeline health — prioritize deals, flag risks, get action plan.
  In Layaa AI mode, uses conversion benchmarks (MQL→SQL 25%, SQL→Proposal 60%, Proposal→Won 35%).
  Replaces generic sales:pipeline-review.
  Trigger: "pipeline review", "deal status", "pipeline health", "weekly pipeline"
user-invocable: true
allowed-tools: Read, Grep, Glob
---

# Pipeline Review

Perform a comprehensive pipeline health analysis with deal prioritization, risk flags, conversion tracking, and a concrete action plan.

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
Search the workspace for pipeline information:
1. Use Glob to find deal trackers, spreadsheets, CRM exports (`*.xlsx`, `*.csv`, `*pipeline*`, `*deals*`)
2. Use Grep to find recent call summaries, proposals, outreach logs
3. Check for any structured deal notes or status files

If no structured data exists, ask the user to provide:
- List of active deals (company, contact, stage, estimated value)
- Last activity date for each deal
- Any known blockers or risks

### Step 2: Pipeline Health Assessment

**Stage Distribution Analysis:**
Map all deals across the pipeline:
- **MQL (Marketing Qualified Lead):** Interest expressed, not yet qualified
- **SQL (Sales Qualified Lead):** Pain confirmed, budget exists, timeline real
- **Proposal:** Active evaluation, proposal sent or in preparation
- **Negotiation:** Terms being discussed, close expected
- **Won / Lost:** Outcomes tracked for learning

Flag imbalances:
- Top-heavy (too many MQLs, not enough SQLs) → Qualification problem
- Middle-heavy (SQLs not converting to Proposals) → Value communication problem
- Bottom-heavy (Proposals not closing) → Pricing or competition problem
- Empty stages → Lead generation or progression problem

**Conversion Rate Analysis (Layaa AI Mode):**
Compare actual conversion rates against benchmarks:

| Stage Transition | Benchmark | Actual | Status |
|-----------------|-----------|--------|--------|
| MQL → SQL | 25% | [calculated] | [On Track / Below / Above] |
| SQL → Proposal | 60% | [calculated] | [On Track / Below / Above] |
| Proposal → Won | 35% | [calculated] | [On Track / Below / Above] |

For each below-benchmark transition, diagnose the likely cause and recommend corrective action.

### Step 3: Deal-by-Deal Analysis
For each active deal, assess:

**Deal Health Score (1-10):**
Weight the following factors:
- **Recency of contact** (last touch <7 days = good, >14 days = risk)
- **Champion identified** (internal advocate exists = +2)
- **Decision maker engaged** (DM on calls / in email = +2)
- **Budget confirmed** (explicit budget or range discussed = +2)
- **Timeline stated** (clear decision date = +2)
- **Competition known** (aware of competitive landscape = +1)
- **Next step scheduled** (concrete next action with date = +1)

**Risk Classification:**
- **Green (8-10):** On track, active engagement, clear path to close
- **Yellow (5-7):** Some risk factors, needs attention this week
- **Red (1-4):** At risk of loss, requires immediate intervention or honest reassessment

### Step 4: Deal Prioritization
Rank deals using a priority matrix:

**Tier 1 — Close This Period:**
- Deals in Proposal/Negotiation stage with clear timeline
- Action: Accelerate — remove blockers, provide requested materials, schedule decision meetings

**Tier 2 — Advance This Week:**
- SQLs ready for proposal, or MQLs showing strong qualification signals
- Action: Progress — send proposals, schedule demos, deepen discovery

**Tier 3 — Nurture:**
- Early-stage or slow-moving deals with genuine potential
- Action: Stay visible — share relevant content, check in periodically

**Tier 4 — Reassess:**
- Stalled deals (>30 days no movement), unclear fit, or no budget
- Action: Qualify out or re-engage with new angle. Do not invest disproportionate time.

### Step 5: Revenue Impact Analysis (Layaa AI Mode)

**Weighted Pipeline Value:**
For each deal: Value x Win Probability = Weighted Value
Sum all weighted values for total expected revenue.

**Revenue at Risk:**
Identify deals where:
- Win probability has decreased since last review
- Competitive threat has emerged
- Champion has gone silent or left the company
- Budget has been questioned or reduced
- Timeline has slipped more than once

**Deal Sizing Validation:**
Cross-reference deal values against Layaa AI's pricing model:
- Implementation fee average: 2.5L (50% deposit on signing)
- Monthly retainer tiers: Starter 15k, Growth 40k, Enterprise custom
- Minimum viable budget: 50k+ implementation
- Flag any deals sized below minimum viable budget

### Step 6: Competitive Landscape Check
For each deal in Proposal or Negotiation:
- Is a competitor involved? If yes, which type?
  - **DIY tools** (Zapier, Make users doing it themselves) → Emphasize managed service value, time savings
  - **Enterprise solutions** (large consulting firms) → Emphasize agility, cost efficiency, SME focus
  - **Freelancers** (individual automation developers) → Emphasize reliability, support, methodology
- Load relevant positioning from `domain-references/sales/sales-playbook.md`

### Step 7: Generate Action Plan
Create a specific, time-bound action plan:

**This Week — Must Do:**
- List 3-5 specific actions tied to Tier 1 and Tier 2 deals
- Include who, what, and by when
- Note any resources or approvals needed

**This Month — Should Do:**
- Pipeline building activities to maintain healthy top-of-funnel
- Re-engagement campaigns for stalled deals
- Content or asset creation needs (proposals, case studies)

**Strategic — Plan For:**
- ICP segments underrepresented in pipeline
- New channels or approaches to test
- Process improvements based on conversion analysis

## Output Format

```
# Pipeline Review — [Date/Period]

## Executive Summary
- **Total Active Deals:** [count]
- **Total Pipeline (unweighted):** [amount]
- **Total Pipeline (weighted):** [amount]
- **Deals at Risk:** [count] ([amount] at risk)
- **Expected Closes This Month:** [count] ([amount])

## Conversion Tracking
| Transition | Benchmark | Actual | Delta | Action Needed |
|-----------|-----------|--------|-------|---------------|
| MQL → SQL | 25% | [%] | [+/-] | [recommendation] |
| SQL → Proposal | 60% | [%] | [+/-] | [recommendation] |
| Proposal → Won | 35% | [%] | [+/-] | [recommendation] |

## Deal Priority Matrix

### Tier 1 — Close This Period
| Deal | Value | Stage | Health | Next Action | Due |
|------|-------|-------|--------|-------------|-----|
| [company] | [value] | [stage] | [G/Y/R] | [action] | [date] |

### Tier 2 — Advance This Week
| Deal | Value | Stage | Health | Next Action | Due |
|------|-------|-------|--------|-------------|-----|

### Tier 3 — Nurture
| Deal | Value | Stage | Health | Next Action | Due |
|------|-------|-------|--------|-------------|-----|

### Tier 4 — Reassess
| Deal | Value | Stage | Health | Recommendation |
|------|-------|-------|--------|----------------|

## Risk Register
| Deal | Risk Type | Severity | Mitigation |
|------|-----------|----------|------------|
| [company] | [type] | [High/Med/Low] | [action] |

## Revenue Forecast
- **Best Case:** [amount] (all Tier 1 + Tier 2 close)
- **Expected:** [amount] (weighted probability)
- **Worst Case:** [amount] (only Green-status deals)
- **Gap to Target:** [amount or "on track"]

## Action Plan
### This Week
1. [action] — [deal] — [owner] — [deadline]
2. [action] — [deal] — [owner] — [deadline]
3. [action] — [deal] — [owner] — [deadline]

### This Month
- [strategic action 1]
- [strategic action 2]

## Pipeline Health Indicators
- Stage balance: [healthy / top-heavy / bottom-heavy]
- Velocity trend: [improving / stable / declining]
- ICP coverage: [which ICPs are under/over-represented]
```

## What Makes This Different from Generic Pipeline Review
- Benchmarks against Layaa AI's actual conversion rates (25% / 60% / 35%)
- Validates deal sizes against Layaa AI's pricing model and minimum viable budget
- Categorizes competitive threats into Layaa AI's three competitor types (DIY, enterprise, freelancers)
- Maps deals to ICP categories and flags ICP coverage gaps
- Understands Layaa AI's revenue model (implementation + retainer) for accurate forecasting
- Integrates service package fit into deal health assessment
- Knows the escalation path for pricing, legal, and founder involvement
