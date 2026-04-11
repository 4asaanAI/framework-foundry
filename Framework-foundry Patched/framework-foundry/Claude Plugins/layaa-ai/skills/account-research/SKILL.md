---
name: account-research
description: >
  Research a company or person and get actionable sales intel.
  In Layaa AI mode, evaluates ICP fit and identifies relevant service packages.
  Replaces generic sales:account-research.
  Trigger: "research company", "account research", "look up company", "who is"
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---

# Account Research

Research a target company or individual and produce actionable sales intelligence, including ICP fit assessment, pain-point mapping, and recommended approach.

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

### Step 1: Identify the Target
Accept input as:
- Company name and/or website URL
- Person name and company
- LinkedIn profile URL
- Minimal description ("that logistics company in Bangalore")

If insufficient to identify uniquely, ask for clarification.

### Step 2: Company Research
Using WebSearch and WebFetch, gather:

**Core Information:**
- Official company name, website, founding year
- Headquarters and office locations
- Industry vertical and sub-segment
- Product or service description (what they sell, to whom)
- Business model (B2B, B2C, marketplace, SaaS, services)

**Size and Stage Indicators:**
- Employee count (LinkedIn, website team page, job postings)
- Funding history (rounds, amounts, investors) if startup
- Revenue indicators (publicly available or estimated from employee count)
- Growth signals (hiring pace, new office openings, product launches)

**Technology Signals:**
- Tech stack mentions on website or job postings
- Current tools used (CRM, project management, automation)
- Job postings mentioning automation, AI, or operations tools
- API or integration mentions on their site

**Recent News and Events:**
- Last 6 months of press coverage
- Leadership changes
- Product launches or pivots
- Partnerships or acquisitions
- Awards or recognition

**Digital Presence:**
- Website quality and maturity
- Social media activity (LinkedIn company page, Twitter/X)
- Content marketing efforts (blog, case studies, whitepapers)
- Customer reviews on platforms like G2, Trustpilot, Google

### Step 3: Person Research (if applicable)
For a specific contact:
- Current title and tenure at the company
- Previous roles and companies (career trajectory)
- Education background
- Public posts, articles, or speaking engagements
- Topics they engage with on social media
- Mutual connections or shared communities
- Decision-making authority level (Evaluator / Influencer / Decision Maker / Budget Holder)

### Step 4: ICP Fit Assessment (Layaa AI Mode)
Score the prospect against each ICP from `shared-references/icp-and-market.md`:

**SaaS Startups (5-25 employees, post-seed):**
- [ ] Technology/software company
- [ ] 5-25 employees
- [ ] Post-seed funding (Series A or beyond)
- [ ] Signs of scaling challenges (hiring ops roles, manual process complaints)
- [ ] 30-50 day typical sales cycle
- [ ] Medium-High budget capacity

**Logistics & Supply Chain SMEs (50-200 employees):**
- [ ] Logistics, distribution, warehousing, fleet management
- [ ] 50-200 employees
- [ ] Manual tracking or coordination processes visible
- [ ] 60-90 day typical sales cycle
- [ ] ROI-driven budget decisions

**Fintech & Payment Processors (10-100 employees):**
- [ ] Financial services, payments, lending, insurance
- [ ] 10-100 employees
- [ ] Regulatory reporting or compliance burden
- [ ] 45-75 day typical sales cycle
- [ ] Medium-High budget capacity

**Professional Services (10-50 employees):**
- [ ] HR, Legal, Consulting, Accounting firm
- [ ] 10-50 employees
- [ ] Admin overhead or client communication challenges
- [ ] 50-80 day typical sales cycle
- [ ] Variable budget

**Fit Score:** Primary ICP / Secondary ICP / Non-ICP
If Non-ICP, note whether they are still a viable prospect (adjacent industry, matching pain points) or should be deprioritized.

### Step 5: Pain Point Mapping
Based on research, identify likely pain points:

**Operational Pain:**
- Manual processes that could be automated
- Data entry duplication
- Reporting bottlenecks
- Communication gaps between teams

**Growth Pain:**
- Scaling challenges (processes that break at scale)
- Hiring faster than process can support
- Customer experience suffering from manual operations

**Compliance Pain:**
- Regulatory reporting burden
- Data governance gaps
- Audit readiness concerns

**Competitive Pain:**
- Competitors using automation
- Market pressure to modernise
- Client expectations outpacing internal capability

For each identified pain point, link to a specific Layaa AI service vertical from `shared-references/service-verticals.md`.

### Step 6: Service Package Recommendation (Layaa AI Mode)
Based on pain points and company profile:
1. Read `domain-references/sales/service-config-matrix.md`
2. Recommend the most relevant service package(s)
3. Estimate deal size based on:
   - Implementation complexity (simple, moderate, complex)
   - Number of workflows or integrations likely needed
   - Retainer tier appropriate for their size and needs
4. Note the recommended entry point (which service to lead with)

### Step 7: Competitive Landscape
Identify what the prospect might be using or considering:
- **Current solutions:** What tools or processes are they using now?
- **Likely alternatives they'd evaluate:**
  - DIY automation tools (Zapier, Make, Power Automate)
  - Enterprise consulting firms
  - Freelance developers on Upwork/Fiverr
  - In-house development team
- **Layaa AI differentiation** for each alternative (from sales playbook)

### Step 8: Approach Recommendation
Based on all gathered intelligence, recommend:
- **Best entry point:** Which person to reach out to and why
- **Messaging angle:** Which pain point to lead with
- **Channel:** Email, LinkedIn, referral, event
- **Timing:** Any urgency factors (funding just raised, fiscal year end, regulation deadline)
- **Risk factors:** What could make this prospect difficult to close
- **Estimated deal cycle:** Based on ICP typical cycle time

## Output Format

```
# Account Research: [Company Name]
**Research Date:** [date]
**Source Quality:** [High — multiple verified sources / Medium — limited public data / Low — minimal information]

## Company Overview
- **Name:** [company name]
- **Website:** [URL]
- **Industry:** [vertical] — [sub-segment]
- **Founded:** [year]
- **Location:** [HQ and offices]
- **Business Model:** [B2B/B2C/etc.]
- **What They Do:** [2-3 sentence description]

## Size & Stage
- **Employees:** [count or range]
- **Funding:** [total raised, last round, investors]
- **Stage:** [Startup / Growth / Established]
- **Revenue Estimate:** [if available]

## ICP Fit Assessment
- **Primary ICP Match:** [category or "None"]
- **Fit Score:** [Strong / Moderate / Weak / Non-ICP]
- **Matching Criteria:** [which criteria are met]
- **Gaps:** [which criteria are not met]

## Key Contact(s)
### [Name] — [Title]
- **Authority Level:** [Decision Maker / Influencer / Evaluator]
- **Tenure:** [time in role]
- **Background:** [relevant career history]
- **Engagement Hook:** [what to reference in outreach]

## Pain Point Map
| Pain Point | Category | Severity | Service Vertical | Evidence |
|-----------|----------|----------|-------------------|----------|
| [pain] | [Operational/Growth/Compliance/Competitive] | [High/Med/Low] | [vertical] | [source] |

## Technology Landscape
- **Current Tools:** [known tools and platforms]
- **Automation Maturity:** [None / Basic / Intermediate / Advanced]
- **Integration Opportunities:** [systems that could be connected]

## Competitive Context
- **Current Solution:** [what they use now]
- **Likely Alternatives:** [what they'd compare Layaa AI to]
- **Our Differentiation:** [key advantages for this specific prospect]

## Recommended Approach
- **Package:** [from service matrix] — Est. value: [range]
- **Lead With:** [which pain point / value prop]
- **Entry Point:** [who to contact, via which channel]
- **Messaging Angle:** [1-sentence description]
- **Timing:** [urgency factors]
- **Expected Cycle:** [days based on ICP benchmark]

## Risk Factors
- [risk 1]
- [risk 2]

## Recent News & Triggers
| Date | Event | Relevance |
|------|-------|-----------|
| [date] | [event] | [why it matters for the sale] |
```

## What Makes This Different from Generic Account Research
- Evaluates prospects against Layaa AI's four specific ICP categories with defined criteria
- Maps pain points directly to Layaa AI's five service verticals
- Recommends specific service packages and estimates deal size using Layaa AI's pricing model
- Positions against Layaa AI's three competitor types (DIY, enterprise, freelancers) with specific differentiation
- Understands Layaa AI's minimum viable budget (50k+) and flags prospects below threshold
- Uses ICP-specific sales cycle estimates for realistic timeline planning
- Links approach recommendations to Layaa AI's battle cards and messaging from the sales playbook
