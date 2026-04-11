---
name: campaign-plan
description: >
  Create comprehensive marketing campaign plans including objectives, audience targeting, channel
  strategy, messaging, budget allocation, timeline, and success metrics. Supports awareness,
  consideration, conversion, and retention campaigns. In Layaa AI mode, uses GTM strategy, channel
  playbooks, and target segments. Trigger: "campaign plan", "marketing campaign", "campaign strategy",
  "launch campaign", "campaign brief", "media plan". This skill replaces the generic
  marketing:campaign-plan capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Campaign Plan

Create comprehensive marketing campaign plans including objectives, audience targeting, channel strategy, messaging, budget allocation, timeline, and success metrics.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics and positioning
- shared-references/icp-and-market.md — ICP profiles and personas
- shared-references/revenue-model.md — Pricing, conversion benchmarks, and budget
- shared-references/service-verticals.md — Services and methodology
- domain-references/marketing/gtm-strategy.md — GTM strategy and budget allocation framework
- domain-references/marketing/channel-playbooks.md — Channel-specific strategies and benchmarks
- domain-references/marketing/campaign-execution.md — Campaign execution framework, UTM standards, quality checklist
- domain-references/marketing/target-segments.md — Target segment details and personas
- domain-references/brand-voice/tone-framework.md — Brand voice and tone rules
- domain-references/revenue-ops/gtm-revenue-alignment.md — GTM-revenue alignment framework
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Define Campaign Objective and Type
Clarify the campaign purpose:
- **Awareness:** Build brand recognition, reach new audiences, establish thought leadership
- **Consideration:** Drive engagement, educate prospects, generate MQLs
- **Conversion:** Generate SQLs, drive demos/assessments, close deals
- **Retention:** Reduce churn, upsell existing clients, strengthen relationships
- Confirm the specific goal (e.g., "generate 50 MQLs in 30 days" or "launch brand awareness in fintech segment")
- Define the campaign duration and budget constraints

### Step 2: Identify Target Persona and Funnel Stage
Determine who the campaign targets:
- Which ICP segment(s): SaaS startups, logistics SMEs, fintech, professional services
- Which persona(s): Founder/CEO, COO/Operations, CTO/Tech Lead, CFO/Finance
- Current funnel stage of the target audience
- For Layaa AI: load target segments from `domain-references/marketing/target-segments.md` for detailed persona information including pain points, motivations, objections, and preferred channels

### Step 3: Design Channel Mix and Budget Allocation (Layaa AI Mode)
For Layaa AI mode, use the budget allocation framework from GTM strategy:

| Channel | Budget % | Purpose |
|---------|----------|---------|
| LinkedIn (organic + paid) | 30-35% | Primary B2B channel, thought leadership, targeted ads |
| Google (Search + Display) | 20-25% | Intent capture, retargeting, brand awareness |
| Content/SEO | 15-20% | Organic traffic, thought leadership, lead magnets |
| Email | 5-10% | Nurture, re-engagement, announcements |
| Retargeting | 10-15% | Cross-channel retargeting, conversion optimization |
| Experimental | 10% | New channels, partnerships, events, community |

Adjust allocations based on campaign type:
- Awareness: weight towards LinkedIn and Content/SEO
- Consideration: weight towards Content/SEO and Email
- Conversion: weight towards Google, Retargeting, and Email
- Retention: weight towards Email and LinkedIn

### Step 4: Develop Messaging Framework
Create messaging per channel and persona:
- Define the core campaign message (single compelling idea)
- Create a messaging matrix: persona x channel x funnel stage
- For Layaa AI: apply brand voice rules (confident, clear, practical) and avoid banned terms
- Write key copy elements:
  - **Headlines:** 3 options per channel
  - **Value propositions:** Tailored to each persona's pain point
  - **Proof points:** Metrics, outcomes, or social proof to support claims
  - **CTAs:** Appropriate to funnel stage and channel

### Step 5: Create Campaign Timeline
Build a detailed timeline with milestones:
- **Pre-launch (Week -2 to -1):** Creative production, landing page setup, tracking implementation, audience setup
- **Launch (Week 1):** Channel activation, initial monitoring, quick optimizations
- **Ramp (Week 2-3):** Scale performing channels, A/B test results, optimize underperformers
- **Optimize (Week 4+):** Full optimization cycle, budget reallocation, reporting
- Include specific dates for deliverables, approvals, and go-live
- Note dependencies between tasks

### Step 6: Define Success Metrics and KPIs
Set measurable targets for the campaign:

For Layaa AI mode, benchmark against standard KPIs:
- **MQLs:** Target 50/month
- **MQL-to-SQL conversion:** Target 25%
- **CAC:** Below Rs.15,000
- **Pipeline value:** Rs.25L+/month
- **Channel-specific metrics:**
  - LinkedIn: CTR 1-2%, engagement rate 3-5%
  - Google Ads: CTR 3-5%, conversion rate 5-8%
  - Email: Open rate 25-35%, click rate 3-5%
  - Content: Organic traffic growth, time on page, bounce rate

Define campaign-specific targets based on budget and duration.

### Step 7: Add UTM Tracking Plan
Create a systematic tracking plan:
- Standard UTM format: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- For Layaa AI: use standard UTM format from `domain-references/marketing/campaign-execution.md`
- Create a UTM tracking spreadsheet template for the campaign
- Specify naming conventions for consistency
- Note any analytics or CRM integration requirements

### Step 8: Include Quality Checklist
Apply the quality checklist from the campaign execution framework:
- All creative assets reviewed for brand compliance
- Landing pages tested (mobile + desktop)
- Tracking pixels and UTMs verified
- Audience targeting confirmed
- Budget caps set
- Approval sign-offs obtained
- Reporting dashboard configured
- Exit criteria defined (when to pause or stop underperforming elements)

### Step 9: Design A/B Testing Plan
Plan tests to optimize campaign performance:
- **What to test:** Headlines, CTAs, images, audience segments, landing pages, send times
- **Test structure:** One variable per test, minimum sample size, test duration
- **Success criteria:** Which metric determines the winner, statistical significance threshold
- **Implementation plan:** When to start tests, when to call winners, how to scale winners
- Recommend 2-3 specific tests for the campaign launch phase

### Step 10: Compile Campaign Plan
Assemble all elements into a comprehensive, actionable campaign plan.

## Output Format

```
# Campaign Plan: [Campaign Name]
**Objective:** [awareness/consideration/conversion/retention]
**Target:** [specific goal — e.g., "Generate 50 MQLs in 30 days"]
**Duration:** [start date — end date]
**Total Budget:** [amount]
**Owner:** [who manages the campaign]

## Campaign Brief
**Core Message:** [single compelling idea]
**Target Persona:** [persona/ICP details]
**Funnel Stage:** [awareness/consideration/decision]
**Key Value Proposition:** [what we are offering and why it matters]

## Channel Strategy

| Channel | Budget | Budget % | Role | Target Metric |
|---------|--------|----------|------|---------------|
| [channel] | [amount] | [%] | [purpose] | [KPI target] |
| **Total** | **[total]** | **100%** | | |

## Messaging Framework

| Persona | Pain Point | Key Message | CTA | Channel |
|---------|-----------|-------------|-----|---------|
| [persona] | [pain] | [message] | [cta] | [channel] |

## Creative Requirements
- [Asset 1: type, dimensions, copy requirements]
- [Asset 2: type, dimensions, copy requirements]
- [Landing page requirements]

## Campaign Timeline

| Week | Phase | Activities | Deliverables | Owner |
|------|-------|-----------|-------------|-------|
| -2 | Pre-launch | [activities] | [deliverables] | [owner] |
| -1 | Pre-launch | [activities] | [deliverables] | [owner] |
| 1 | Launch | [activities] | [deliverables] | [owner] |
| 2-3 | Ramp | [activities] | [deliverables] | [owner] |
| 4+ | Optimize | [activities] | [deliverables] | [owner] |

## Success Metrics

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| [metric] | [target] | [how measured] | [daily/weekly] |

## UTM Tracking Plan

| Channel | Source | Medium | Campaign | Content |
|---------|--------|--------|----------|---------|
| [channel] | [source] | [medium] | [campaign] | [content] |

## A/B Testing Plan

| Test | Variable | Control | Variant | Success Metric | Duration |
|------|----------|---------|---------|---------------|----------|
| [test] | [what] | [A] | [B] | [metric] | [days] |

## Quality Checklist
- [ ] Creative assets brand-compliant
- [ ] Landing pages tested (mobile + desktop)
- [ ] Tracking pixels and UTMs verified
- [ ] Audience targeting confirmed
- [ ] Budget caps set
- [ ] Approvals obtained
- [ ] Reporting dashboard configured
- [ ] Exit criteria defined

## Risk Mitigation
- [Risk 1 — mitigation plan]
- [Risk 2 — mitigation plan]

## Next Steps
1. [Immediate action]
2. [This week]
3. [Before launch]
```

## What Makes This Different from Generic Campaign Planning
- Uses Layaa AI's specific budget allocation framework with channel percentages
- Benchmarks against Layaa AI's defined KPIs (MQL 50/mo, CAC <Rs.15k, pipeline Rs.25L+)
- Messaging framework built on Layaa AI's ICP personas with specific pain points and value props
- Applies Layaa AI's standard UTM tracking format for consistent attribution
- Quality checklist from Layaa AI's campaign execution framework
- Channel strategy informed by Layaa AI's channel playbooks with channel-specific benchmarks
- Connects campaign metrics to revenue pipeline through GTM-revenue alignment framework
