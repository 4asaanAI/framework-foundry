# Layaa AI -- Pipeline Management Framework

**Document Owner:** Abhimanyu Singh, CEO
**Last Updated:** April 2026
**Classification:** Internal -- Sales & Revenue Ops
**Version:** 2.0

---

## 1. Pipeline Stages Overview

```
Lead → MQL → SQL → Discovery → Proposal → Negotiation → Won / Lost
```

| Stage | Stage # | Probability Weight | Owner | Avg Time in Stage |
|-------|---------|-------------------|-------|-------------------|
| Lead | 0 | 5% | Marketing | 3-5 days |
| MQL (Marketing Qualified Lead) | 1 | 10% | Marketing | 5-7 days |
| SQL (Sales Qualified Lead) | 2 | 20% | Sales (AE) | 3-5 days |
| Discovery | 3 | 35% | Sales (AE) | 5-10 days |
| Proposal | 4 | 55% | Sales (AE) | 7-14 days |
| Negotiation | 5 | 75% | Sales (AE) + Founder | 7-21 days |
| Won | 6 | 100% | Delivery | -- |
| Lost | 6 | 0% | -- | -- |

---

## 2. Stage Definitions, Entry Criteria, and Exit Criteria

### Stage 0: Lead

**Definition:** Any individual or organisation that has expressed initial interest in Layaa AI or matches our ICP profile. Not yet evaluated for fit.

**Entry Criteria:**
- Contact information captured (name, company, email or phone)
- Source channel identified (website, LinkedIn, referral, event, outbound)
- Logged in CRM with creation date and source

**Exit Criteria (to MQL):**
- ICP match score ≥ 60 (industry, company size, geography)
- At least one engagement signal (email open, website visit, content download, reply to outreach)
- Firmographic data confirmed (industry, team size, estimated revenue)

**Required CRM Fields:**
- Contact name, title, company
- Email and/or phone
- Lead source
- ICP match score
- Date created

**Activities:**
- Enrich lead data (LinkedIn, website, news)
- Initial outreach (email or LinkedIn message)
- Score against ICP criteria

---

### Stage 1: MQL (Marketing Qualified Lead)

**Definition:** A lead that matches our ICP and has demonstrated engagement behaviour suggesting potential interest. Marketing has verified basic fit.

**Entry Criteria:**
- ICP match score ≥ 60
- Engagement signal received within 14 days
- Basic firmographic data available

**Exit Criteria (to SQL):**
- BANT qualification call completed (15-20 minutes)
- BANT score ≥ 9/12
- Decision maker identified or accessible
- Prospect agrees to a discovery call

**Required CRM Fields:**
- All Lead fields +
- ICP score (detailed breakdown)
- Engagement history (touchpoints)
- Marketing campaign attribution
- MQL date

**Activities:**
- Personalised outreach (email sequence or LinkedIn)
- Share relevant content/case study
- Schedule BANT qualification call
- Qualify against BANT framework

**Benchmark:** 25% of MQLs should convert to SQL.

---

### Stage 2: SQL (Sales Qualified Lead)

**Definition:** A lead that has been qualified through BANT criteria. Budget exists, authority is identified, need is articulated, and timeline is within 90 days.

**Entry Criteria:**
- BANT score ≥ 9/12
- Budget range confirmed (≥ ₹50K)
- Decision maker identified
- Timeline ≤ 90 days
- Prospect has agreed to discovery call

**Exit Criteria (to Discovery):**
- Discovery call scheduled with confirmed date/time
- Pre-call research completed (company, stakeholders, industry context)
- Discovery agenda shared with prospect

**Required CRM Fields:**
- All MQL fields +
- BANT score (B/A/N/T breakdown)
- Estimated deal size
- Decision maker name and title
- Expected timeline
- SQL date

**Activities:**
- Confirm discovery call logistics
- Prepare discovery call using Arjun's 5-Phase Methodology
- Research client's business, competitors, recent news
- Identify potential solution fit (preliminary)

**Benchmark:** 60% of SQLs should receive a proposal.

---

### Stage 3: Discovery

**Definition:** Active engagement where Layaa AI is conducting in-depth assessment of the prospect's needs, pain points, and technical environment using the 5-Phase Discovery methodology.

**Entry Criteria:**
- Discovery call completed (or first call of multi-call discovery)
- Prospect engaged substantively in the conversation
- At least 2 pain points identified and preliminarily quantified

**Exit Criteria (to Proposal):**
- Discovery summary document completed
- Pain points quantified (annual cost of problem calculated)
- Solution approach mapped to specific Layaa AI services/products
- Prospect confirms interest in receiving a proposal
- Internal deal review completed (deals > ₹3L)
- Stakeholders for proposal presentation identified

**Required CRM Fields:**
- All SQL fields +
- Discovery call date and notes
- Pain points (listed and quantified)
- Proposed solution approach
- Estimated deal size (refined)
- Competitors in consideration
- Discovery date

**Activities:**
- Conduct discovery call(s) per Arjun's 5-Phase Methodology
- Document current state and pain quantification
- Map solution approach
- Internal team alignment on solution and pricing
- Prepare proposal

**Benchmark:** Discovery-to-Proposal conversion should be high (80%+); the SQL filter should have already removed poor fits.

---

### Stage 4: Proposal

**Definition:** A formal proposal has been created and presented to the prospect. Layaa AI is awaiting feedback, questions, or decision.

**Entry Criteria:**
- Proposal document completed per Layaa AI template
- Internal review completed (deals > ₹3L: Founder review)
- Proposal presented live to prospect (video call or in-person)
- Q&A session conducted

**Exit Criteria (to Negotiation):**
- Prospect provides substantive feedback on proposal
- Commercial discussion initiated (pricing, scope, terms)
- Prospect indicates intent to proceed (with or without modifications)
- OR prospect declines → move to Lost

**Required CRM Fields:**
- All Discovery fields +
- Proposal sent date
- Proposal amount (implementation + annual retainer value)
- Proposal version
- Feedback received (Y/N)
- Proposal date

**Activities:**
- Present proposal live
- Address questions and concerns
- Document feedback and requested changes
- Prepare revised proposal if needed (within 48 hours)
- Follow up if no response within 5 business days

**Benchmark:** 35% of proposals should result in a Won deal.

---

### Stage 5: Negotiation

**Definition:** Active commercial negotiation. Prospect has expressed intent to proceed but terms are being finalised. Scope, pricing, timeline, or contract terms are under discussion.

**Entry Criteria:**
- Prospect has explicitly stated intent to proceed (verbal or written)
- Commercial discussion is active (not just "we're thinking about it")
- Specific terms being negotiated (price, scope, timeline, payment)

**Exit Criteria (to Won):**
- All commercial terms agreed
- Statement of Work (SoW) drafted and reviewed by both parties
- SoW signed by authorised signatories on both sides
- 50% advance payment received and confirmed

**Exit Criteria (to Lost):**
- Prospect explicitly declines to proceed
- No response for 30+ days after last active contact
- Terms demanded are outside Layaa AI red-flag thresholds

**Required CRM Fields:**
- All Proposal fields +
- Negotiation start date
- Terms under discussion
- Discount applied (if any) with approval reference
- Revised deal amount
- Expected close date
- SoW status (draft/sent/signed)
- Negotiation date

**Activities:**
- Negotiate scope, pricing, and terms per sales playbook guidelines
- Obtain internal approvals for discounts (per discount authority matrix)
- Draft and refine SoW
- Coordinate with legal if non-standard terms requested
- Secure signatures and advance payment

---

### Stage 6a: Won

**Definition:** Deal is closed. SoW signed and advance payment received. Ready for handoff to delivery.

**Entry Criteria:**
- SoW signed by both parties
- 50% advance payment received and cleared
- Handoff package prepared (see sales-revenue-handoff.md)

**Required CRM Fields:**
- All Negotiation fields +
- Won date
- Final deal amount (implementation)
- Monthly retainer amount
- Total contract value (implementation + 12-month retainer)
- Discount applied
- Payment received (amount and date)
- Delivery team assigned

**Activities:**
- Update CRM with final deal details
- Initiate handoff to delivery
- Send client welcome communication
- Celebrate (team notification)

---

### Stage 6b: Lost

**Definition:** Deal did not close. Prospect declined, went with competitor, or became unresponsive.

**Required CRM Fields:**
- All applicable fields +
- Lost date
- Loss reason (mandatory, from dropdown):
  - Budget -- too expensive
  - Budget -- no budget allocated
  - Timing -- not ready now
  - Competition -- chose competitor
  - Competition -- building in-house
  - Scope -- needs don't match our capabilities
  - Relationship -- poor fit/chemistry
  - Unresponsive -- went silent
  - Other (requires free text explanation)
- Competitor name (if applicable)
- Reengagement date (90 days from lost date, auto-set)

**Activities:**
- Document loss reason (mandatory, within 48 hours)
- Conduct internal post-mortem (deals > ₹2L)
- Add to re-engagement nurture sequence (90-day follow-up)
- Share learnings with team in weekly pipeline review

---

## 3. Pipeline Velocity Benchmarks

### Stage Velocity Targets

| Stage Transition | Target Duration | Warning Threshold | Stale Threshold |
|-----------------|----------------|-------------------|-----------------|
| Lead → MQL | 3-5 days | 7 days | 14 days |
| MQL → SQL | 5-7 days | 10 days | 21 days |
| SQL → Discovery | 3-5 days | 7 days | 14 days |
| Discovery → Proposal | 2-5 days | 7 days | 14 days |
| Proposal → Negotiation | 7-14 days | 21 days | 30 days |
| Negotiation → Won/Lost | 7-21 days | 30 days | 45 days |
| **Total (Lead → Won)** | **25-45 days** | **60 days** | **90 days** |

### Velocity Actions

| Threshold | Action |
|-----------|--------|
| **Within target** | No action needed. Continue normal cadence. |
| **Warning** | AE must add a CRM note explaining the delay and next action. Sales Lead reviews in weekly meeting. |
| **Stale** | Mandatory review by Sales Lead. Either re-engage with a new approach within 48 hours or move to Lost. Deals in Stale status for >2 weeks are auto-archived. |

### Velocity by ICP

| ICP | Avg Lead-to-Won (days) | Fastest | Slowest |
|-----|------------------------|---------|---------|
| SaaS Startups | 28 | 14 | 60 |
| Logistics SMEs | 45 | 21 | 90 |
| Fintech | 38 | 21 | 75 |
| Professional Services | 21 | 7 | 45 |

---

## 4. Pipeline Health Metrics

### Core Metrics (Reviewed Weekly)

| Metric | Definition | Target | Red Flag |
|--------|-----------|--------|----------|
| **Pipeline Coverage** | Total weighted pipeline / quarterly revenue target | 3x | <2x |
| **Pipeline Velocity** | Avg days from SQL to Won | <40 days | >60 days |
| **Win Rate** | Won deals / (Won + Lost) | 35%+ | <25% |
| **Average Deal Size** | Total won revenue / number of won deals | ₹2.5L+ | <₹1.5L |
| **Stage Conversion Rates** | Conversion at each stage vs benchmark | Within 5% of benchmark | >10% deviation |
| **Stale Deal %** | Deals past stale threshold / total active pipeline | <10% | >20% |

### Pipeline Shape Health

A healthy pipeline should resemble a funnel -- more deals at the top, fewer at the bottom.

**Ideal Pipeline Distribution:**

| Stage | % of Total Pipeline (by count) |
|-------|-------------------------------|
| MQL | 30-40% |
| SQL | 20-25% |
| Discovery | 15-20% |
| Proposal | 10-15% |
| Negotiation | 5-10% |

**Unhealthy Patterns to Watch For:**

| Pattern | Signal | Action |
|---------|--------|--------|
| Top-heavy (many MQLs, few SQLs) | Qualification is too loose or AEs are not following up | Tighten MQL criteria; review AE activity |
| Bottom-heavy (many proposals, few MQLs) | Lead generation has dried up; living off existing pipeline | Increase marketing spend; activate outbound |
| Bulge at Proposal | Deals are stuck; no negotiation movement | Review follow-up cadence; identify blockers |
| Flat (even distribution) | Not enough new leads entering; pipeline will dry up | Urgent: increase lead generation activities |

---

## 5. Weighted Pipeline Calculation

### Formula

```
Weighted Pipeline Value = Sum of (Deal Value x Stage Probability Weight)
```

### Example Calculation

| Deal | Stage | Deal Value | Weight | Weighted Value |
|------|-------|-----------|--------|----------------|
| Acme SaaS - Workflow Automation | Discovery | ₹3,00,000 | 35% | ₹1,05,000 |
| Beta Logistics - Demand AI | Proposal | ₹4,50,000 | 55% | ₹2,47,500 |
| Gamma Fintech - KYC Auto | Negotiation | ₹6,00,000 | 75% | ₹4,50,000 |
| Delta Prof Svc - CA AI Agent | SQL | ₹1,25,000 | 20% | ₹25,000 |
| Epsilon SaaS - Full Suite | MQL | ₹8,00,000 | 10% | ₹80,000 |
| **Total Pipeline** | | **₹22,75,000** | | **₹9,07,500** |

### Interpreting Weighted Pipeline

| Weighted Pipeline vs Target | Interpretation | Action |
|----------------------------|----------------|--------|
| >3x quarterly target | Strong position; focus on conversion quality | Maintain cadence; be selective on new deals |
| 2x-3x quarterly target | Adequate; some risk | Monitor weekly; identify at-risk deals |
| 1.5x-2x quarterly target | Insufficient coverage | Increase lead gen urgently; accelerate existing deals |
| <1.5x quarterly target | Critical gap | All-hands lead gen; consider pricing promotions; Founder involvement |

### Monthly Weighted Pipeline Report Template

```
LAYAA AI -- WEIGHTED PIPELINE REPORT
Month: [Month Year]
Prepared by: [Name]
Date: [Date]

SUMMARY
-------
Total Pipeline (unweighted): ₹_________
Total Pipeline (weighted):   ₹_________
Quarterly Target:            ₹_________
Pipeline Coverage Ratio:     ___x

STAGE BREAKDOWN
---------------
MQL:          ₹_________ (unweighted) → ₹_________ (weighted) | ___ deals
SQL:          ₹_________ (unweighted) → ₹_________ (weighted) | ___ deals
Discovery:    ₹_________ (unweighted) → ₹_________ (weighted) | ___ deals
Proposal:     ₹_________ (unweighted) → ₹_________ (weighted) | ___ deals
Negotiation:  ₹_________ (unweighted) → ₹_________ (weighted) | ___ deals

TOP 5 DEALS
-----------
1. [Company] | [Stage] | ₹[Amount] | [Expected Close Date] | [Risk Level]
2.
3.
4.
5.

AT-RISK DEALS (past warning threshold)
--------------------------------------
1. [Company] | [Stage] | [Days in Stage] | [Issue] | [Action Plan]

NEW DEALS ADDED THIS MONTH
---------------------------
Count: ___
Value: ₹_________

DEALS CLOSED THIS MONTH
------------------------
Won: ___ deals | ₹_________
Lost: ___ deals | ₹_________ | Top loss reason: ___________

NOTES / ACTIONS
---------------
[Free text for commentary, escalations, strategy adjustments]
```

---

## 6. CRM Hygiene Rules

### Mandatory Fields by Stage

Every deal must have the following fields completed before progressing to the next stage. CRM should enforce these as required fields on stage transitions.

| Field | Lead | MQL | SQL | Discovery | Proposal | Negotiation | Won |
|-------|------|-----|-----|-----------|----------|-------------|-----|
| Contact name | X | X | X | X | X | X | X |
| Company name | X | X | X | X | X | X | X |
| Email/Phone | X | X | X | X | X | X | X |
| Lead source | X | X | X | X | X | X | X |
| ICP score | | X | X | X | X | X | X |
| BANT score | | | X | X | X | X | X |
| Decision maker | | | X | X | X | X | X |
| Discovery notes | | | | X | X | X | X |
| Pain points (quantified) | | | | X | X | X | X |
| Deal amount | | | X | X | X | X | X |
| Proposal document | | | | | X | X | X |
| Proposal sent date | | | | | X | X | X |
| Discount (if any) | | | | | | X | X |
| SoW signed | | | | | | | X |
| Payment received | | | | | | | X |

### CRM Update Rules

| Rule | Requirement | Consequence of Violation |
|------|------------|------------------------|
| **Daily updates** | Every active deal must have a CRM note/activity logged daily (if touched) or weekly (if in waiting state) | Deal flagged in weekly pipeline review |
| **Next action date** | Every deal must have a "next action" date and description | Pipeline review focuses on deals without next actions |
| **Amount accuracy** | Deal amount must be updated within 24 hours of any scope/price change | Pipeline reporting becomes unreliable; AE accountability |
| **Stage movement** | Stage changes must happen within 24 hours of the qualifying event | Velocity metrics become inaccurate |
| **Loss documentation** | Lost deals require loss reason within 48 hours | Cannot close the deal record without it |
| **No ghost deals** | Deals with no activity for 30 days must be reviewed and either reactivated (with a plan) or moved to Lost | Auto-flagged by CRM; reviewed in pipeline meeting |

### Weekly Pipeline Review Agenda

**Timing:** Every Monday, 30 minutes
**Attendees:** All AEs, Sales Lead, CEO (optional)

1. **Pipeline summary** (5 min) -- total weighted pipeline, coverage ratio, new/closed this week
2. **Deal-by-deal review** (15 min) -- focus on Proposal and Negotiation stages; stale deals
3. **At-risk deals** (5 min) -- any deal past warning threshold
4. **Wins and losses** (3 min) -- celebrate wins; share loss learnings
5. **Action items** (2 min) -- specific follow-ups for the week

---

## 7. Pipeline Reporting Cadence

| Report | Frequency | Audience | Owner |
|--------|-----------|----------|-------|
| Pipeline Snapshot | Daily (automated) | Sales team | CRM (automated) |
| Weekly Pipeline Review | Weekly (Monday) | Sales team + Sales Lead | Sales Lead |
| Weighted Pipeline Report | Monthly | Sales + Founders | Revenue Ops |
| Pipeline Health Scorecard | Monthly | Founders | Revenue Ops |
| Quarterly Pipeline Analysis | Quarterly | Founders + Advisory | CEO |

---

*This framework is the operating system for Layaa AI's sales pipeline. Every AE is expected to know it, follow it, and maintain CRM hygiene accordingly. Deviations are addressed in the weekly pipeline review.*

**Layaa AI Private Limited**
*Empower decisions, Elevate Profits!*
