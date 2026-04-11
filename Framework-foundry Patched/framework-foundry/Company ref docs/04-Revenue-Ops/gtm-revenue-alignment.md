# Layaa AI -- GTM-to-Revenue Alignment Framework

**Document Owner:** Abhimanyu Singh, CEO
**Last Updated:** April 2026
**Classification:** Internal -- Marketing, Sales & Revenue Ops
**Version:** 2.0

---

## 1. Purpose

This framework ensures that Layaa AI's go-to-market (GTM) activities are tightly coupled with revenue outcomes. It defines how marketing generates and qualifies leads, how sales receives and converts them, and how both functions are measured against shared revenue targets.

**Core Principle:** Marketing and Sales are not separate departments -- they are two halves of one revenue engine. Misalignment between them is the single biggest revenue leak in B2B companies.

---

## 2. Lead Definitions -- MQL vs SQL

### Marketing Qualified Lead (MQL)

**Definition:** A lead that matches Layaa AI's Ideal Customer Profile and has demonstrated sufficient engagement behaviour to warrant sales outreach.

**MQL Qualification Criteria (ALL must be true):**

| Dimension | Criteria | Source |
|-----------|----------|--------|
| **ICP Match** | Industry matches one of the 4 ICPs (SaaS Startups, Logistics SMEs, Fintech, Professional Services) | Firmographic data |
| **Company Size** | 5-500 employees | Firmographic data |
| **Geography** | India-based (primary); APAC (secondary) | Firmographic data |
| **ICP Score** | ≥ 60/100 on the ICP scoring matrix | Calculated score |
| **Engagement** | At least ONE engagement signal within 14 days of first touch | Behavioural tracking |

**Engagement Signals (any one qualifies):**
- Replied to outbound email or LinkedIn message
- Downloaded a gated content asset (whitepaper, case study, playbook)
- Attended a Layaa AI webinar or event
- Visited the pricing page or product pages (2+ visits)
- Requested a demo or consultation via website
- Referred by an existing client or partner
- Engaged with 3+ social media posts in 7 days

**MQL Disqualifiers:**
- Company size < 5 employees (too small to service profitably)
- Industry outside all 4 ICPs with no strategic rationale
- Contact is a student, job seeker, or non-business inquiry
- Competitor conducting research (flag and exclude)
- Geographic region outside India/APAC with no expansion plan

---

### Sales Qualified Lead (SQL)

**Definition:** An MQL that has been vetted through a live BANT qualification conversation and meets the threshold for active sales pursuit.

**SQL Qualification Criteria (ALL must be true):**

| Dimension | Criteria | Verified By |
|-----------|----------|-------------|
| **Budget** | Confirmed budget ≥ ₹50K; can allocate within decision timeline | BANT call |
| **Authority** | Decision maker identified and accessible (or contacted directly) | BANT call |
| **Need** | Specific, articulated problem that Layaa AI can solve | BANT call |
| **Timeline** | Intent to start within 90 days | BANT call |
| **BANT Score** | ≥ 9/12 | Scoring matrix |

**SQL Disqualifiers:**
- BANT score < 9/12 (return to MQL nurture)
- Budget explicitly < ₹50K with no path to increase
- Decision maker unreachable after 2 attempts
- No articulated need (curiosity-only inquiry)
- Timeline > 6 months with no compelling event

---

### Lead Lifecycle Flow

```
Anonymous Visitor → Known Lead → MQL → SQL → Opportunity → Won/Lost
                         │              │           │
                         │              │           └─→ Lost → Nurture (re-engage at 90 days)
                         │              └─→ Disqualified → Marketing Nurture
                         └─→ Disqualified → Excluded
```

---

## 3. Lead Scoring Model

### Scoring Dimensions

Leads are scored on two axes: **Firmographic Fit** (who they are) and **Behavioural Engagement** (what they do).

#### Firmographic Score (0-50 points)

| Factor | Criteria | Points |
|--------|----------|--------|
| **Industry** | Primary ICP (Fintech, SaaS) | 15 |
| | Secondary ICP (Logistics, Professional Services) | 10 |
| | Adjacent industry (eCommerce, healthcare) | 5 |
| | Non-target industry | 0 |
| **Company Size** | 50-500 employees | 10 |
| | 10-49 employees | 8 |
| | 5-9 employees | 5 |
| | <5 or >500 | 0 |
| **Revenue** | ₹1Cr - ₹100Cr | 10 |
| | ₹25L - ₹1Cr | 7 |
| | <₹25L or >₹100Cr | 3 |
| **Decision Maker Title** | C-suite / Founder / MD | 10 |
| | VP / Director / Head | 7 |
| | Manager | 4 |
| | Individual contributor | 2 |
| **Geography** | Metro India (Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai) | 5 |
| | Other India | 3 |
| | APAC | 2 |
| | Rest of world | 0 |

#### Behavioural Score (0-50 points)

| Action | Points | Decay |
|--------|--------|-------|
| **Website: Pricing page visit** | 10 | Resets after 30 days of inactivity |
| **Website: Product page visit (2+)** | 5 | Resets after 30 days |
| **Content: Downloaded gated asset** | 8 | Resets after 45 days |
| **Content: Attended webinar** | 10 | Resets after 60 days |
| **Email: Replied to outbound** | 12 | No decay |
| **Email: Opened 3+ emails** | 3 | Resets after 30 days |
| **Social: Engaged with 3+ posts** | 5 | Resets after 14 days |
| **Direct: Requested demo/consultation** | 15 | No decay |
| **Referral: Referred by existing client** | 15 | No decay |
| **Event: Visited booth / attended meetup** | 8 | Resets after 60 days |

#### MQL Threshold

```
MQL = Firmographic Score ≥ 25 AND Behavioural Score ≥ 15 AND Total Score ≥ 50
```

| Total Score | Classification | Action |
|-------------|---------------|--------|
| ≥ 50 | **MQL** | Route to Sales within SLA |
| 35-49 | **Marketing Nurture** | Continue nurture sequence; re-score weekly |
| < 35 | **Cold** | Low-priority nurture; re-score monthly |

#### Score Decay

Lead scores decay over time to reflect waning interest:
- Behavioural scores decay as noted in the table above
- Firmographic scores do not decay (company attributes are stable)
- If a lead's total score drops below 50, they are moved back to Marketing Nurture

---

## 4. SLAs Between Marketing and Sales

### Marketing-to-Sales SLA

Marketing commits to the following for every MQL handed to Sales:

| Commitment | SLA | Measurement |
|-----------|-----|-------------|
| MQL volume | [Target] MQLs per month (set quarterly) | Monthly MQL count |
| MQL quality | ≥ 25% MQL-to-SQL conversion rate | Monthly conversion rate |
| Data completeness | Every MQL has: name, company, email, ICP score, engagement history | Spot-check audit (monthly) |
| Handoff speed | MQLs routed to assigned AE within 4 business hours | CRM timestamp |
| Source attribution | Every MQL tagged with source channel and campaign | CRM field compliance |

### Sales-to-Marketing SLA

Sales commits to the following for every MQL received from Marketing:

| Commitment | SLA | Measurement |
|-----------|-----|-------------|
| First response | Contact MQL within 24 business hours of receipt | CRM activity timestamp |
| Follow-up cadence | Minimum 3 touchpoints within 7 days (call + email + LinkedIn) | CRM activity log |
| BANT qualification | Complete BANT assessment within 5 business days of first contact | CRM BANT fields |
| Disposition | Update MQL status (SQL / Nurture / Disqualified) within 7 business days | CRM status field |
| Feedback | Provide MQL quality feedback to Marketing weekly | Weekly alignment meeting |

### SLA Breach Handling

| Breach | Escalation |
|--------|-----------|
| Marketing misses MQL volume target by >20% | CEO review; marketing strategy adjustment |
| Marketing MQL quality drops below 20% SQL conversion for 2 consecutive months | Joint review; ICP criteria and scoring model recalibration |
| Sales fails to respond to MQLs within 24 hours (>10% of MQLs) | Sales Lead addresses with specific AEs; pattern triggers process review |
| Sales fails to disposition MQLs within 7 days (>15% of MQLs) | Sales Lead review; MQLs reassigned if pattern persists |
| Either team misses SLA for 3 consecutive months | Founder-level intervention; potential team/process restructuring |

---

## 5. Response Time and Follow-Up Cadence

### Inbound Lead Response Protocol

| Lead Source | Max Response Time | Response Type | Owner |
|------------|------------------|---------------|-------|
| Website demo request | 2 hours (business hours) | Phone call + email | AE |
| Website contact form | 4 hours (business hours) | Email | Marketing → AE |
| Referral from client | 4 hours | Phone call | AE (senior) |
| Webinar attendee (engaged) | 24 hours | Personalised email | Marketing → AE |
| Content download | 48 hours | Nurture email sequence | Marketing (automated) |
| Social media inquiry | 12 hours | Social reply + DM | Marketing → AE |
| Event lead | 48 hours | Email | AE |

### Outbound Follow-Up Cadence

After initial MQL contact, follow this cadence:

| Day | Action | Channel |
|-----|--------|---------|
| Day 0 | First outreach (personalised, reference their engagement signal) | Email + LinkedIn connection request |
| Day 1 | Phone call attempt #1 | Phone |
| Day 2 | Follow-up email (add value -- share relevant content) | Email |
| Day 4 | Phone call attempt #2 | Phone |
| Day 5 | LinkedIn message (engage with their content if possible) | LinkedIn |
| Day 7 | "Closing the loop" email (politely ask if timing is right) | Email |
| Day 14 | Final check-in (if no response, move to nurture) | Email |

**Rules:**
- Each touchpoint must add value. No "just checking in" messages.
- If the lead responds at any point, switch to conversation mode (no more cadence).
- If no response after Day 14, move to Marketing Nurture. Tag as "Attempted -- No Response."
- Re-engage after 90 days with fresh content or a new angle.

---

## 6. Attribution Model

### Multi-Touch Attribution

Layaa AI uses a **multi-touch attribution model** to understand which marketing activities drive revenue.

**Model: Position-Based (U-Shaped)**

| Touchpoint | Attribution Weight | Rationale |
|-----------|-------------------|-----------|
| **First Touch** | 40% | The channel/campaign that first brought the lead to Layaa AI |
| **Middle Touches** | 20% (split equally) | All nurture and engagement touchpoints between first and last |
| **Last Touch (MQL conversion)** | 40% | The action that triggered MQL status and sales handoff |

### Channel Definitions

| Channel | Includes | Tracking Method |
|---------|----------|----------------|
| **Organic Search** | Google/Bing search traffic to website | UTM parameters; Google Analytics |
| **Paid Search** | Google Ads, Bing Ads | UTM parameters; ad platform data |
| **Social Organic** | LinkedIn posts, Twitter/X, Instagram (non-paid) | UTM parameters; social analytics |
| **Social Paid** | LinkedIn Ads, Meta Ads | UTM parameters; ad platform data |
| **Content Marketing** | Blog, whitepapers, case studies, webinars | UTM parameters; gated content forms |
| **Email Marketing** | Newsletter, nurture sequences, one-off campaigns | Email platform tracking |
| **Referral** | Client referrals, partner referrals | Manual tag in CRM by AE |
| **Events** | Conferences, meetups, workshops | Event attendance list; CRM manual entry |
| **Outbound** | AE-initiated cold outreach (email, LinkedIn, phone) | CRM activity log |
| **Direct** | Direct website visit, walk-in, direct email to team | CRM manual entry |

### Attribution Reporting

| Report | Frequency | Key Metrics |
|--------|-----------|-------------|
| Channel Performance | Monthly | MQLs by channel, SQLs by channel, Revenue by channel |
| Campaign ROI | Per campaign (post-campaign) | Spend, MQLs generated, SQLs generated, revenue attributed, ROI |
| Content Performance | Monthly | Asset downloads, MQLs attributed, engagement metrics |
| Attribution Trend | Quarterly | Channel mix shift, emerging high-performers, declining channels |

---

## 7. Revenue Targets by Channel

### Target Allocation (Illustrative -- Adjust Quarterly)

| Channel | % of MQL Target | % of Revenue Target | Cost per MQL (Target) | Notes |
|---------|----------------|--------------------|-----------------------|-------|
| Organic Search | 15% | 15% | ₹500 | Long-term investment; high-quality leads |
| Paid Search | 10% | 8% | ₹2,000 | Quick results; optimise for ICP keywords |
| Social Organic (LinkedIn) | 20% | 20% | ₹300 | Founder-led content; high trust |
| Social Paid (LinkedIn Ads) | 10% | 8% | ₹2,500 | Targeted ICP campaigns |
| Content Marketing | 15% | 18% | ₹800 | Webinars and case studies convert well |
| Referrals | 15% | 20% | ₹0 (excl. referral incentive) | Highest conversion rate; prioritise |
| Events | 5% | 5% | ₹3,000 | Select high-value events only |
| Outbound | 10% | 6% | ₹1,500 | Supplement inbound; target specific accounts |

### Channel Health Indicators

| Indicator | Green | Amber | Red |
|-----------|-------|-------|-----|
| MQL volume vs target | ≥ 90% of target | 70-89% | < 70% |
| MQL-to-SQL conversion | ≥ 25% | 15-24% | < 15% |
| Cost per MQL | ≤ Target | Target to 1.5x target | > 1.5x target |
| Cost per SQL | ≤ ₹8,000 | ₹8,000 - ₹15,000 | > ₹15,000 |
| CAC (per won deal) | ≤ ₹25,000 | ₹25,000 - ₹50,000 | > ₹50,000 |
| CAC:LTV ratio | ≥ 5x | 2.5x - 5x | < 2.5x |

**Red Flag:** If CAC:LTV drops below 2.5x for any channel for 2+ consecutive months, pause spending on that channel and investigate.

---

## 8. Monthly Alignment Review

### Meeting Structure

**Name:** GTM-Revenue Alignment Review
**Frequency:** Monthly (first Thursday of each month)
**Duration:** 60 minutes
**Attendees:** CEO, CTO, Marketing Lead, Sales Lead, Revenue Ops

### Agenda Template

```
============================================================
GTM-REVENUE ALIGNMENT REVIEW -- [Month Year]
============================================================

1. SCORECARD REVIEW (10 min)
   Led by: Revenue Ops

   Marketing SLA Performance:
   ┌─────────────────────────┬──────────┬──────────┬────────┐
   │ Metric                  │ Target   │ Actual   │ Status │
   ├─────────────────────────┼──────────┼──────────┼────────┤
   │ MQL volume              │          │          │        │
   │ MQL quality (→SQL %)    │          │          │        │
   │ MQL data completeness   │          │          │        │
   │ Handoff speed           │          │          │        │
   │ Source attribution      │          │          │        │
   └─────────────────────────┴──────────┴──────────┴────────┘

   Sales SLA Performance:
   ┌─────────────────────────┬──────────┬──────────┬────────┐
   │ Metric                  │ Target   │ Actual   │ Status │
   ├─────────────────────────┼──────────┼──────────┼────────┤
   │ Response time (<24 hrs) │          │          │        │
   │ Follow-up cadence       │          │          │        │
   │ BANT completion (<5 d)  │          │          │        │
   │ Disposition (<7 d)      │          │          │        │
   │ Feedback provided       │          │          │        │
   └─────────────────────────┴──────────┴──────────┴────────┘

2. FUNNEL ANALYSIS (15 min)
   Led by: Revenue Ops

   Conversion Rates (this month vs trailing 6-month avg):
   ┌──────────────────────┬──────────┬──────────┬──────────┐
   │ Stage                │ Target   │ Actual   │ Trend    │
   ├──────────────────────┼──────────┼──────────┼──────────┤
   │ Lead → MQL           │ 40-50%   │          │ ↑↓→      │
   │ MQL → SQL            │ 25%      │          │ ↑↓→      │
   │ SQL → Proposal       │ 60%      │          │ ↑↓→      │
   │ Proposal → Won       │ 35%      │          │ ↑↓→      │
   │ End-to-End           │ 5.25%    │          │ ↑↓→      │
   └──────────────────────┴──────────┴──────────┴──────────┘

   Funnel Bottlenecks Identified:
   1. ___________________________
   2. ___________________________

3. CHANNEL PERFORMANCE (10 min)
   Led by: Marketing Lead

   Revenue Attribution by Channel:
   ┌──────────────────────┬──────────┬──────────┬──────────┬──────────┐
   │ Channel              │ MQLs     │ SQLs     │ Revenue  │ ROI      │
   ├──────────────────────┼──────────┼──────────┼──────────┼──────────┤
   │ Organic Search       │          │          │          │          │
   │ Paid Search          │          │          │          │          │
   │ Social Organic       │          │          │          │          │
   │ Social Paid          │          │          │          │          │
   │ Content Marketing    │          │          │          │          │
   │ Referrals            │          │          │          │          │
   │ Events               │          │          │          │          │
   │ Outbound             │          │          │          │          │
   └──────────────────────┴──────────┴──────────┴──────────┴──────────┘

   Top Performing Campaign: ___________________________
   Underperforming Channel: ___________________________
   Budget Reallocation Needed: [Yes/No] → Details: _______

4. PIPELINE HEALTH (10 min)
   Led by: Sales Lead

   Pipeline Summary:
   - Total Weighted Pipeline:    ₹_________
   - Pipeline Coverage:          ____x quarterly target
   - New Deals Added:            ___
   - Deals Closed (Won):         ___ | ₹_________
   - Deals Closed (Lost):        ___ | ₹_________ | Top reason: _______
   - Avg Deal Size (this month): ₹_________
   - Avg Sales Cycle:            ____ days

5. REVENUE FORECAST vs TARGET (5 min)
   Led by: Revenue Ops

   ┌──────────────────────┬──────────┬──────────┬──────────┐
   │                      │ Target   │ Forecast │ Variance │
   ├──────────────────────┼──────────┼──────────┼──────────┤
   │ This Month           │          │          │          │
   │ This Quarter         │          │          │          │
   │ Year-to-Date         │          │          │          │
   └──────────────────────┴──────────┴──────────┴──────────┘

6. MQL QUALITY FEEDBACK (5 min)
   Led by: Sales Lead

   - MQLs received this month: ___
   - MQLs accepted (qualified to SQL): ___
   - MQLs returned (not qualified): ___
   - Common disqualification reasons:
     1. ___________________________
     2. ___________________________
   - Feedback for Marketing:
     ___________________________

7. ACTIONS AND DECISIONS (5 min)
   Led by: CEO

   Decisions Made:
   1. ___________________________
   2. ___________________________

   Action Items:
   ┌─────────────────────────┬──────────┬──────────┐
   │ Action                  │ Owner    │ Due Date │
   ├─────────────────────────┼──────────┼──────────┤
   │                         │          │          │
   │                         │          │          │
   │                         │          │          │
   └─────────────────────────┴──────────┴──────────┘

============================================================
Next Review: [Date]
============================================================
```

---

## 9. Shared Metrics Dashboard

### Metrics That Both Marketing and Sales Own

| Metric | Definition | Target | Reviewed |
|--------|-----------|--------|----------|
| **Revenue** | Total implementation + retainer revenue | Quarterly target | Weekly |
| **MQL-to-Revenue Conversion** | Revenue generated / MQLs created | ₹[Target] per MQL | Monthly |
| **Customer Acquisition Cost (CAC)** | Total sales + marketing spend / new clients won | ≤ ₹25,000 | Monthly |
| **CAC Payback Period** | CAC / monthly gross profit per client | ≤ 4 months | Monthly |
| **CAC:LTV Ratio** | Customer lifetime value / CAC | ≥ 2.5x (red flag below) | Monthly |
| **Pipeline Coverage** | Weighted pipeline / quarterly target | 3x | Weekly |
| **Time to Revenue** | Days from first touch to first payment received | ≤ 60 days | Monthly |
| **Net Revenue Retention** | (Revenue from existing clients this period) / (Revenue from same clients last period) | ≥ 100% | Quarterly |

### Marketing-Owned Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Website traffic | Monthly unique visitors | Growth MoM |
| Content engagement | Downloads, webinar attendance, social engagement | Growth MoM |
| MQL volume | Number of MQLs generated per month | [Set quarterly] |
| Cost per MQL | Total marketing spend / MQLs generated | ≤ Channel targets |
| Brand awareness | Social followers, media mentions, search volume | Growth QoQ |

### Sales-Owned Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| SQL volume | Number of SQLs per month | [Set quarterly] |
| Win rate | Won deals / (Won + Lost) | ≥ 35% |
| Average deal size | Total won revenue / number of deals | ≥ ₹2.5L |
| Sales cycle length | Avg days from SQL to Won | ≤ 40 days |
| Pipeline velocity | Weighted pipeline added per month | [Set quarterly] |

---

## 10. Escalation and Conflict Resolution

### Common Misalignment Scenarios

| Scenario | Root Cause | Resolution Protocol |
|----------|-----------|-------------------|
| "Marketing sends us junk leads" | ICP criteria too loose; scoring model not calibrated | Joint review of MQL criteria and scoring thresholds; recalibrate with recent SQL data |
| "Sales isn't following up on our leads" | AE workload; lead volume too high; poor routing | Review SLA compliance data; adjust routing or hire; AE-level accountability |
| "We don't know what's working" | Attribution gaps; CRM hygiene issues | Attribution model audit; mandatory CRM field enforcement |
| "Our CAC is too high" | Wrong channels; low conversion rates; high spend | Channel-by-channel CAC analysis; pause underperformers; double down on winners |
| "Revenue target is unrealistic" | Target set without pipeline data; market conditions changed | Quarterly target recalibration using pipeline coverage and conversion data |

### Conflict Resolution Process

```
Step 1: Data first. Pull the numbers. No anecdotes.
Step 2: Joint analysis in the monthly alignment review.
Step 3: Root cause identified and agreed by both teams.
Step 4: Action plan with owners and deadlines.
Step 5: Review results in next month's meeting.
Step 6: If unresolved after 2 months → CEO arbitration.
```

---

## 11. Quarterly GTM-Revenue Planning

At the start of each quarter, Marketing and Sales jointly set targets:

### Quarterly Planning Inputs

| Input | Source | Owner |
|-------|--------|-------|
| Annual revenue target | Board/Founders | CEO |
| Quarterly revenue target (seasonally adjusted) | Annual target x seasonal factor | Revenue Ops |
| Required pipeline coverage (3x) | Quarterly target x 3 | Revenue Ops |
| Required SQLs (based on win rate and avg deal size) | Pipeline / avg deal size / win rate | Revenue Ops |
| Required MQLs (based on MQL→SQL conversion) | Required SQLs / 25% | Revenue Ops |
| Marketing budget allocation by channel | MQL targets x cost-per-MQL by channel | Marketing Lead |
| Sales capacity | Number of AEs x deals-per-AE capacity | Sales Lead |

### Quarterly Target-Setting Template

```
QUARTER: Q_ FY[Year]

REVENUE TARGET: ₹_________
  Implementation: ₹_________
  Retainer (new): ₹_________
  Retainer (existing): ₹_________

PIPELINE REQUIREMENT: ₹_________ (3x target)

CONVERSION ASSUMPTIONS:
  MQL → SQL: ___%
  SQL → Proposal: ___%
  Proposal → Won: ___%
  Avg Deal Size: ₹_________

VOLUME TARGETS:
  MQLs needed: ___
  SQLs needed: ___
  Proposals needed: ___
  Wins needed: ___

MARKETING BUDGET: ₹_________
  Channel 1: ₹_________ → ___ MQLs expected
  Channel 2: ₹_________ → ___ MQLs expected
  Channel 3: ₹_________ → ___ MQLs expected

SALES CAPACITY:
  AEs: ___
  Deals per AE (target): ___
  Revenue per AE (target): ₹_________

AGREED BY:
  Marketing Lead: _____________ Date: _______
  Sales Lead:     _____________ Date: _______
  CEO:            _____________ Date: _______
```

---

## 12. Alignment Maturity Model

Use this model to assess and improve GTM-Revenue alignment over time.

| Level | Stage | Characteristics | Actions to Advance |
|-------|-------|----------------|-------------------|
| **1** | **Ad Hoc** | No shared definitions; leads passed informally; no SLAs; no shared metrics | Define MQL/SQL; implement lead scoring; set initial SLAs |
| **2** | **Defined** | MQL/SQL defined; basic lead scoring; SLAs exist but not enforced; monthly meetings started | Enforce SLAs with accountability; implement CRM hygiene; start attribution |
| **3** | **Measured** | SLAs tracked and reported; attribution model in place; shared dashboard; regular reviews | Optimise conversion rates; refine scoring model; channel-level ROI tracking |
| **4** | **Optimised** | Continuous optimisation; predictive lead scoring; real-time pipeline visibility; tight feedback loops | Automate lead routing; predictive analytics; account-based marketing |
| **5** | **Unified** | Marketing and Sales operate as one revenue team; shared OKRs; seamless handoffs; revenue predictability >90% | Scale what works; expand to new markets; build a revenue machine |

**Current Target:** Level 3 (Measured) by Q3 FY2027

---

*When GTM and Revenue are aligned, every rupee spent on marketing converts predictably into pipeline, and every lead received by sales gets the follow-up it deserves. This framework is how we get there.*

**Layaa AI Private Limited**
*Empower decisions, Elevate Profits!*
