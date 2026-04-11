---
name: daily-briefing
description: >
  Start your day with a prioritized sales briefing. In Layaa AI mode, includes
  pipeline status, follow-ups due, and ICP-aligned priorities. Replaces generic sales:daily-briefing.
  Trigger: "daily briefing", "morning brief", "sales brief", "start my day"
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch
---

# Daily Briefing

Generate a prioritized daily sales briefing covering pipeline status, due follow-ups, market signals, and recommended focus areas.

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

### Step 1: Gather Available Data
Search the workspace for any existing pipeline, CRM, or deal-tracking data:
1. Use Glob to find spreadsheets, CSVs, or tracking files (e.g., `*.xlsx`, `*.csv`, pipeline files, deal trackers)
2. Use Grep to search for recent call summaries, proposals, or outreach logs
3. Check for any pending action items from previous call summaries or notes
4. Look for any calendar or meeting-related files for today's schedule

If no structured data is found, ask the user:
- What deals are currently active?
- Any follow-ups due today?
- Any meetings scheduled?

### Step 2: Pipeline Snapshot
Create a current-state overview of all active deals:

**For each deal, capture:**
- Company name and contact
- ICP category (Layaa AI mode)
- Current pipeline stage (MQL / SQL / Proposal / Negotiation)
- Last touchpoint date and type
- Next action due and owner
- Estimated deal value
- Win probability

**Pipeline health indicators (Layaa AI mode):**
- Total pipeline value (weighted and unweighted)
- Stage distribution — are deals bunched at one stage?
- Velocity check — are deals moving or stalling?
- Conversion rate tracking against benchmarks:
  - MQL → SQL: benchmark 25%
  - SQL → Proposal: benchmark 60%
  - Proposal → Won: benchmark 35%

### Step 3: Prioritize Follow-Ups
Rank all pending follow-ups by urgency:

**Priority 1 — Overdue (action was due yesterday or earlier):**
- List each overdue item with days overdue
- Flag risk of deal decay for items >3 days overdue

**Priority 2 — Due Today:**
- List each item due today with context
- Include suggested action (email, call, send material)

**Priority 3 — Due This Week:**
- List upcoming items for the rest of the week
- Highlight any that need preparation time (proposals, demos)

**Priority 4 — Stalled Deals:**
- Any deal with no activity in >7 days
- Suggest re-engagement approach based on ICP and last conversation

### Step 4: Market & Competitive Signals (Layaa AI Mode)
If WebSearch is available, check for:
1. News about active prospects (funding, leadership changes, expansion)
2. Industry trends relevant to current ICP targets
3. Competitor movements (new offerings, pricing changes, partnerships)
4. Regulatory changes affecting target industries (especially fintech, professional services)

Only include signals that are actionable for today's sales activities.

### Step 5: Revenue Forecast Check (Layaa AI Mode)
Calculate quick metrics:
- **This month's expected revenue:** Sum of (deal value x win probability) for deals expected to close this month
- **Pipeline coverage ratio:** Total qualified pipeline / monthly target (healthy = 3x+)
- **At-risk revenue:** Deals with declining probability or stalled status
- **Gap to target:** If target is known, show shortfall and what it would take to close the gap

### Step 6: Recommended Focus Areas
Based on all gathered data, recommend the day's top 3-5 priorities:
1. **Highest-impact action** — The one thing that will most move the needle today
2. **Quick wins** — Low-effort items that clear the backlog
3. **Strategic plays** — Longer-term actions that set up future wins
4. **Risk mitigation** — Actions to prevent deal loss or slippage

For each recommendation, explain WHY it is prioritized and provide a specific action step.

### Step 7: Talking Points for Internal Standup
If the user has team meetings, prepare:
- 2-3 sentence pipeline update suitable for sharing with founders
- Any asks/blockers that need team support
- Key wins or progress since last briefing

## Output Format

```
# Daily Sales Briefing — [Date]

## Pipeline Snapshot
| Deal | ICP | Stage | Value | Probability | Last Touch | Next Action | Due |
|------|-----|-------|-------|-------------|------------|-------------|-----|
| [company] | [icp] | [stage] | [value] | [%] | [date] | [action] | [date] |

**Pipeline Health:**
- Total Pipeline (weighted): [amount]
- Stage Distribution: [MQL: X | SQL: X | Proposal: X | Negotiation: X]
- Conversion Tracking: [on/below/above benchmark for each stage]
- Pipeline Velocity: [average days per stage]

## Today's Priorities

### Must Do Today
1. **[Action]** — [Company] — [Why this is urgent]
2. **[Action]** — [Company] — [Why this is urgent]

### Follow-Ups Due
| # | Company | Contact | Action | Context |
|---|---------|---------|--------|---------|
| 1 | [company] | [name] | [action] | [context] |

### Overdue Items (Requires Immediate Attention)
| # | Company | Action | Days Overdue | Risk Level |
|---|---------|--------|--------------|------------|
| 1 | [company] | [action] | [days] | [High/Med/Low] |

## Market Signals
- [relevant signal 1]
- [relevant signal 2]

## Revenue Check
- Expected this month: [amount]
- Pipeline coverage: [ratio]
- At-risk deals: [list]

## Recommended Focus (Top 3)
1. **[Priority]** — [specific action and expected outcome]
2. **[Priority]** — [specific action and expected outcome]
3. **[Priority]** — [specific action and expected outcome]

## Standup Talking Points
- [2-3 sentences for team sync]
```

## What Makes This Different from Generic Daily Briefing
- Tracks pipeline against Layaa AI's specific conversion benchmarks (25% / 60% / 35%)
- Categorizes deals by ICP and applies ICP-specific urgency rules (e.g., logistics deals have longer cycles, SaaS deals need faster follow-up)
- Calculates revenue metrics using Layaa AI's pricing model (implementation fees + retainer tiers)
- Surfaces competitive signals relevant to Layaa AI's market position (vs. DIY tools, enterprise solutions, freelancers)
- Prepares founder-ready talking points aligned with Layaa AI's reporting style
- Understands deal sizing based on service packages and minimum viable budget (50k+ implementation)
- Flags deals that may need pricing specialist (Veer) or legal (Abhay) involvement
