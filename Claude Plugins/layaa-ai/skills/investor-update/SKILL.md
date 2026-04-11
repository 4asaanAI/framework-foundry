---
name: investor-update
description: >
  Generate monthly or quarterly investor update reports for Layaa AI.
  Compiles revenue metrics, pipeline status, key wins, product milestones,
  team updates, and strategic outlook into a professional investor
  communication. This is a new Layaa AI-specific skill.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Investor Update — Layaa AI

## Context Detection

Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham),
  or is clearly working within the Layaa AI workspace.
  → Apply full Layaa AI context from shared-references/ and domain-references/.

- **General mode** if: user mentions a different company or the task has no
  connection to Layaa AI.
  → Operate as a standard investor update generator.

## Reference Loading

For Layaa AI mode, read relevant context from:
- `shared-references/company-identity.md` — Legal details, founders, elevator pitch
- `shared-references/revenue-model.md` — Pricing tiers, conversion funnel
- `shared-references/service-verticals.md` — Service offerings
- `domain-references/finance/unit-economics.md` — CAC, LTV, margins
- `domain-references/finance/company-filings.md` — Entity details, certifications
- `domain-references/revenue-ops/pipeline-tracker.md` — Pipeline health, conversion benchmarks
- `domain-references/revenue-ops/forecast-methodology.md` — Revenue forecast approach

## Execution Steps

### Step 1: Determine Update Type
- Monthly update (shorter, metrics-focused)
- Quarterly update (comprehensive, strategic)
- Ad-hoc update (specific milestone or event)

### Step 2: Gather Data from User
Ask for the following (skip what's already known from recent daily updates):

1. **Revenue & Financial Metrics**
   - MRR (current and change from last period)
   - New implementation revenue this period
   - Total revenue this period
   - Cash position / runway
   - Key financial milestones

2. **Pipeline & Sales**
   - Active pipeline value
   - New clients acquired
   - Deals in negotiation
   - Churn or lost clients (with reasons)
   - Notable wins or case studies

3. **Product & Delivery**
   - Key projects delivered
   - New capabilities or service offerings launched
   - Technology milestones
   - Client satisfaction / NPS data

4. **Team**
   - New hires or planned hires
   - Key team developments
   - Advisory board updates

5. **Strategic**
   - Market observations
   - Strategic initiatives
   - Challenges and how they're being addressed
   - Asks from investors (introductions, advice, capital)

### Step 3: Apply Layaa AI Context

For Layaa AI mode:
- Use unit economics framework for metric presentation
- Compare pipeline against benchmarks (MQL→SQL 25%, end-to-end 5-8%)
- Frame revenue in terms of implementation + retainer split
- Highlight movement toward recurring revenue
- Reference ICP segments when discussing market traction
- Include relevant compliance milestones (DPIIT, filings)

### Step 4: Draft the Update

Structure the update following the output format below. Tone should be:
- **Honest and transparent** — don't hide challenges
- **Data-driven** — lead with numbers
- **Forward-looking** — what's next and why it matters
- **Concise** — investors are busy; respect their time

### Step 5: Review and Finalize
- Verify all numbers are consistent
- Check for sensitive information that shouldn't be shared
- Ensure asks are specific and actionable
- Flag any items needing Founder review before sending

## Output Format

```
Subject: Layaa AI — [Month/Quarter] [Year] Update

Hi [Investors],

[1-2 sentence highlight / headline metric]

---

## Key Metrics

| Metric | This Period | Last Period | Change |
|--------|------------|------------|--------|
| MRR | ₹___  | ₹___  | +/- __% |
| Total Revenue | ₹___  | ₹___  | +/- __% |
| Active Clients | ___ | ___ | +/- ___ |
| Pipeline Value | ₹___  | ₹___  | +/- __% |
| CAC | ₹___  | ₹___  | +/- __% |
| Gross Margin | __% | __% | +/- __pp |
| Cash Runway | __ months | __ months | |

## Wins
- [Key achievement 1]
- [Key achievement 2]
- [Key achievement 3]

## Product & Delivery
[2-3 sentences on what was built/delivered and why it matters]

## Pipeline & Sales
[2-3 sentences on sales momentum, notable prospects, conversion trends]

## Challenges
[1-2 honest challenges and what you're doing about them]

## Team
[Updates if any]

## What's Next
- [Priority 1 for next period]
- [Priority 2 for next period]
- [Priority 3 for next period]

## Asks
- [Specific ask 1 — e.g., "Introductions to logistics SMEs in NCR"]
- [Specific ask 2 — e.g., "Feedback on our enterprise pricing model"]

---

Best,
[Founder Name]
Layaa AI
```

## Notes

- Monthly updates should be 1 page max
- Quarterly updates can be 2-3 pages with deeper strategic context
- Always include specific asks — investors want to help but need direction
- If bad news, lead with it and show the plan to address it
- Save the update to memory so future updates can reference past performance
