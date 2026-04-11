---
name: layaa-sales
description: >
  Layaa AI Sales skill group. Use for: prospect outreach, call preparation,
  call summaries, pipeline review, sales forecasting, account research,
  competitive intelligence, sales asset creation, discovery calls, and
  proposal generation. Auto-detects which sub-skill you need from context.
  Works for Layaa AI tasks and general sales tasks.
user-invocable: true
---

# Layaa Sales — Skill Group

## Available Sub-Skills

| Sub-Skill | When to Use |
|-----------|------------|
| **draft-outreach** | Research a prospect and write personalised cold outreach |
| **call-prep** | Prepare for a sales call with research, attendees, and agenda |
| **call-summary** | Process call notes, extract actions, draft follow-up email |
| **pipeline-review** | Analyse pipeline health, prioritise deals, flag risks |
| **forecast** | Generate weighted sales forecast with scenarios |
| **account-research** | Deep research on a company with ICP fit scoring |
| **competitive-intelligence** | Research competitors and build battle cards |
| **create-an-asset** | Generate sales assets (one-pagers, decks, landing pages) |
| **daily-briefing** | Prioritised daily sales briefing with focus areas |
| **discovery-call** | Structured discovery using Rohit's 5-phase framework |
| **proposal-generator** | End-to-end proposal from discovery notes to formatted doc |

## How to Use
Tell me what you need in plain English — I'll use the right sub-skill automatically.
- "Prep me for a call with InnovateTech tomorrow" → **call-prep**
- "Draft cold email to COO of a 50-person logistics firm" → **draft-outreach**
- "Review my pipeline — what should I close this week?" → **pipeline-review**
- "Generate a proposal for a 3-month automation project for an HR firm" → **proposal-generator**

Or invoke explicitly: "Use discovery-call for [Company]"

---

## Context Detection
- **Layaa AI mode:** Mention Layaa AI, the founders (Abhimanyu/Shubham), Indian SMEs, AI automation, or any ICP → apply full Layaa AI context from Project Knowledge
- **General mode:** Different company or industry → standard sales assistant, no Layaa context injected

---

## Layaa AI Sales Context (Quick Reference)

**Company:** Layaa AI Private Limited — AI automation & enablement for Indian SMEs
**4 ICPs:** SaaS Startups (30-50d, ₹2-5L) | Logistics SMEs (60-90d, ROI-driven) | Fintech (45-75d, Med-High budget) | Professional Services (50-80d, Variable)
**Pricing:** ₹50K-10L+ implementation | ₹15K/40K/Custom retainer | Min deal: ₹50K | Discounts >20% need Founder approval
**Conversion:** MQL→SQL 25% | SQL→Proposal 60% | Proposal→Won 35% | End-to-end ~5.25%
**Key rules:** Never unauthorized discounts | Never ROI guarantees without evidence | Never contract terms beyond standard | Escalate: pricing→Veer | feasibility→Rohit | legal→Abhay

---

## Sub-Skill Execution

### draft-outreach
1. Identify prospect company, role, and likely ICP segment
2. Research: size, industry, recent news, likely pain points
3. Match to ICP and select persona-appropriate battle card
4. Draft: personalised opening (specific to them), pain hook, credibility line, clear CTA
5. Under 150 words. No attachments in cold outreach.
6. Provide 3 subject line variants (curiosity / direct / benefit-led)

### call-prep
1. Research company and attendees (LinkedIn, website, recent news)
2. Identify ICP segment and likely pain points
3. Load relevant battle card from Project Knowledge
4. Suggest agenda (5-7 items including discovery questions)
5. Prepare objection responses most likely for this ICP
6. List 3 recommended next steps to propose at call end

### call-summary
1. Process call notes or transcript provided
2. Extract: key pain points, budget signals, timeline, decision-makers, objections raised
3. Score deal: stage, fit, urgency (High/Medium/Low)
4. Draft follow-up email: recap, next steps, attachments to send
5. Suggest CRM fields to update

### pipeline-review
1. Ask for current deal list (company, stage, value, last contact date)
2. Benchmark against conversion rates: SQL→Proposal 60%, Proposal→Won 35%
3. Flag: stalled deals (no contact >7 days), deals below minimum (₹50K), escalations needed
4. Prioritise: rank by (value × probability × urgency)
5. Recommend weekly actions for top 3-5 deals

### account-research
1. Research company: size, industry, tech stack, recent news, leadership
2. Score ICP fit: which segment? How strong a match? (1-10 with reasoning)
3. Identify top 3 automation opportunities for their business type
4. Suggest best persona to approach and opening angle
5. Flag any red flags (regulatory, financial, technical complexity)

### discovery-call (Rohit's 5-Phase Framework)
**Phase 1 — Business Context:** Industry, size, revenue model, growth stage, strategic priorities
**Phase 2 — Current State:** Tools used, manual processes, biggest time drains, team workflow
**Phase 3 — Requirements:** Ideal future state, what's tried before, success metrics
**Phase 4 — Feasibility:** Data access, integration complexity, compliance constraints, technical readiness
**Phase 5 — Solution Design:** Scope options, implementation approach, pricing ballpark, next steps

Output: pre-call question sheet + post-call structured summary template

### proposal-generator
1. Take discovery notes or brief provided
2. Apply Veer's pricing: Fixed + Variable + Value-Based Tier
3. Select package tier (Starter/Growth/Enterprise) based on scope
4. Structure: Executive Summary → Problem → Proposed Solution → Scope of Work → Timeline → Pricing → Payment Terms → Next Steps
5. Standard terms: 50% advance, 50% on delivery, 18% GST separate
6. Flag any non-standard elements for Founder review before sending

### competitive-intelligence
1. Research specified competitor: positioning, pricing (if public), strengths, weaknesses
2. Compare to Layaa AI on: price, delivery model, support, India-specific context
3. Build battle card: how to win against this competitor specifically
4. Identify segments where Layaa AI has clearest advantage

### create-an-asset
1. Identify asset type and target audience (which ICP/persona)
2. Apply brand voice: confident, direct, Indian business context, no jargon
3. Structure: hook (pain) → solution (what we do) → proof (how it works) → CTA
4. Ensure pricing references match current tiers from Project Knowledge

### forecast
1. Take pipeline data (deals × stages × values)
2. Apply weighted probabilities: Proposal stage 35%, SQL 21%, MQL 5.25%
3. Generate three scenarios: Conservative (-10%), Likely (current), Optimistic (+10%)
4. Identify 2-3 deals that will make or break the forecast
5. Flag deals unlikely to close this period

### daily-briefing
1. Ask for today's open deals (or take from context)
2. Prioritise: (a) deals going cold, (b) follow-ups due, (c) proposals to send
3. Flag: any deal with no contact >7 days
4. Suggest 3 priority actions for the day
