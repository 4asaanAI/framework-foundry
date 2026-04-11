---
name: layaa-core
description: >
  Layaa AI Core skills — unique to Layaa AI, no generic equivalent.
  daily-update: structured daily company check-in that captures updates,
  content feedback, corrections, and upcoming context.
  investor-update: generates monthly or quarterly investor update reports.
  Use these for Layaa AI company operations.
user-invocable: true
---

# Layaa Core — Skill Group

## Available Sub-Skills

| Sub-Skill | When to Use |
|-----------|------------|
| **daily-update** | Daily company check-in — captures updates, content feedback, and upcoming week context |
| **investor-update** | Generate monthly or quarterly investor update report |

## How to Use
- "Run my daily update" or "Morning check-in" → **daily-update**
- "Write my monthly investor update" → **investor-update**

---

## Sub-Skill Execution

### daily-update

Run a structured 5-minute check-in. Ask about each category — if the user says "no updates" for a category, skip it.

**Category 1 — Company Updates:**
- New clients, leads, proposals sent, deals closed or lost?
- Client feedback, complaints, or churn?
- Pricing adjustments or new package configurations?
- Invoices sent, payments received, overdue payments?
- Team changes, new tools, delivery milestones hit?
- New partnerships, competitive intelligence, market developments?
- Strategic pivots, new service offerings, investor conversations?
- Any compliance filings due or legal matters?

**Category 2 — Content Feedback Loop:**
- Was any recently generated content posted or used?
  - YES → Which pieces? Any edits made before posting?
  - NO → Why? (not relevant / needs changes / quality issue / didn't get to it)
- Any corrections on recently generated content? (tone off, facts wrong, too long, wrong audience)
- Content needs for today or this week? (posts, emails, proposals, documents)
- Flag: content not posted for 3+ days as stale — ask if strategy needs adjusting

**Category 3 — Upcoming Context:**
- Meetings, pitches, or demos this week needing prep?
- Deadlines or events approaching (filing deadlines, launch dates, conferences)?

**After gathering updates — output format:**
```
## Daily Update — [Date]

### Changes Captured
- [Update and category for each item]

### Content Status
- Posted: [list if any]
- Pending: [list if any]
- Stale (3+ days): [list if any — flag for strategy review]

### Corrections to Remember
- [Specific feedback to apply next time]

### Action Items
- [Tasks identified from today's check-in]

### Upcoming This Week
- [Meetings, deadlines, events]
```

---

### investor-update

**Step 1 — Determine update type:** Monthly (1 page max, metrics-focused) or Quarterly (2-3 pages, strategic)

**Step 2 — Gather data from user:**

*Revenue & Financial:*
- MRR this period vs. last period
- Total revenue (implementation + retainer split)
- Cash position and runway (months)
- Key financial milestones hit

*Pipeline & Sales:*
- Active pipeline value
- New clients acquired
- Deals in negotiation
- Deals lost (with reasons if known)
- Notable wins or case studies

*Product & Delivery:*
- Key projects delivered or milestones hit
- New capabilities or service offerings launched
- Client satisfaction signals

*Team:* New hires, planned hires, or team changes

*Strategic:* Market observations | Challenges being faced and plan to address | Specific asks from investors (introductions, advice, connections)

**Step 3 — Draft the update:**

Rules:
- Monthly: under 400 words | Quarterly: 2-3 pages with deeper context
- Always include specific, actionable asks
- Lead with bad news + plan to address it — never hide challenges
- Use ₹ not $ | Indian business context throughout

**Output format:**
```
Subject: Layaa AI — [Month/Quarter] [Year] Update

Hi [Investors],

[1-2 sentence headline: key metric or most important win]

---

## Key Metrics

| Metric | This Period | Last Period | Change |
|--------|-----------|-----------|--------|
| MRR | ₹___ | ₹___ | +/-__% |
| Total Revenue | ₹___ | ₹___ | +/-__% |
| Active Clients | ___ | ___ | +/-___ |
| Pipeline Value | ₹___ | ₹___ | +/-__% |
| Cash Runway | ___ months | ___ months | |

## Wins
- [Key achievement 1]
- [Key achievement 2]

## Pipeline & Sales
[2-3 sentences on momentum and notable prospects]

## Challenges
[1-2 honest challenges + what you're doing about them — never skip]

## What's Next
- [Priority 1]
- [Priority 2]

## Asks
- [Specific ask 1 — e.g., "Introductions to logistics SMEs in Delhi NCR"]
- [Specific ask 2]

---
Best,
[Founder Name]
Layaa AI | Hello@layaa.ai
```
