# Monthly Investor Update Task — Layaa AI
*Set as a Co-work task. Run manually at month-end, or schedule for the 28th of each month at 10 AM IST (cron: 0 10 28 * *)*

## Task Prompt

Generate the Layaa AI monthly investor update.

**Company:** Layaa AI Private Limited — AI automation for Indian SMEs
**Founders:** Abhimanyu Singh (Strategy) | Shubham Sharma (Technology)
**Email:** Hello@layaa.ai

---

### Step 1 — Gather Data

Ask the user for the following. If they don't have a figure yet, note it as TBD.

**Revenue & Financial:**
- MRR this month vs. last month (in ₹)
- Total revenue this month (implementation + retainer, in ₹)
- Cash position and runway (how many months)
- Key financial milestones hit this month

**Pipeline & Sales:**
- Active pipeline value (₹)
- New clients acquired this month (names/count)
- Deals currently in negotiation
- Deals lost this month (and reasons if known)
- Notable wins, case studies, or testimonials

**Product & Delivery:**
- Key projects delivered or milestones hit
- New capabilities or service offerings launched
- Client satisfaction signals (positive or negative)

**Team:**
- New hires, planned hires, or notable team changes

**Strategic:**
- Key market observations or competitive developments
- Strategic initiatives underway
- Challenges being faced this month and plan to address them
- Specific asks from investors (introductions, advice, connections, feedback)

---

### Step 2 — Draft the Update

Apply these rules:
- Monthly update: under 400 words (1 page)
- Always include specific, actionable investor asks
- Lead with bad news + plan to address it — never hide challenges
- Use ₹ not $ throughout
- Honest and transparent — investors respect candour

---

### Output Format

```
Subject: Layaa AI — [Month] [Year] Update

Hi [Investor names],

[1-2 sentence headline: the most important metric or win this month]

---

## Key Metrics

| Metric | This Month | Last Month | Change |
|--------|-----------|-----------|--------|
| MRR | ₹___ | ₹___ | +/-__% |
| Total Revenue | ₹___ | ₹___ | +/-__% |
| Active Clients | ___ | ___ | +/-___ |
| Pipeline Value | ₹___ | ₹___ | +/-__% |
| Cash Runway | ___ months | ___ months | |

## Wins
- [Key achievement 1]
- [Key achievement 2]
- [Key achievement 3 if applicable]

## Pipeline & Sales
[2-3 sentences on sales momentum, notable prospects, conversion trends]

## Challenges
[1-2 honest challenges and what you're doing about them — never skip this section]

## What's Next
- [Priority 1 for next month]
- [Priority 2]
- [Priority 3]

## Asks
- [Specific ask 1 — e.g., "Introductions to operations leaders in logistics companies in NCR"]
- [Specific ask 2 — e.g., "Feedback on our new Enterprise package pricing"]

---

Best,
[Founder Name]
Layaa AI | Hello@layaa.ai | https://layaa.ai
```
