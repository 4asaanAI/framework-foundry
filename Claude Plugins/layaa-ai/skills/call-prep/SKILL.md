---
name: call-prep
description: >
  Prepare for a sales call with account context, attendee research, and suggested agenda.
  In Layaa AI mode, matches prospect to ICP, loads battle card, and prepares objection responses.
  Replaces generic sales:call-prep.
  Trigger: "prep for call", "call prep", "prepare for meeting", "sales call"
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---

# Call Prep

Prepare a comprehensive briefing for an upcoming sales call, including account research, attendee profiles, agenda, objection handling, and talking points.

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

### Step 1: Gather Call Details
Collect or ask for:
- **Company name** and website
- **Attendees** (names, titles if known)
- **Call type:** Discovery / Demo / Follow-up / Proposal / Negotiation / Close
- **Scheduled time and duration**
- **Any prior interaction history** (previous calls, emails, proposals sent)
- **Who from Layaa AI is attending** (founder, sales, technical)

### Step 2: Account Research
Using WebSearch and WebFetch:

**Company Intelligence:**
- What the company does (products/services, target market)
- Company size (employee count, revenue indicators)
- Founding date and stage (startup, growth, established)
- Recent news (funding, expansion, product launches, leadership changes)
- Technology stack signals (job postings, tech mentions on site)
- Industry vertical and sub-segment

**Trigger Events to Reference:**
- Recent funding round → Growing, likely investing in infrastructure
- New leadership hire → Potential process changes, mandate for improvement
- Product launch → Scaling operations, may need automation
- Regulatory change in their industry → Compliance burden increasing
- Competitor move → Need to stay competitive

### Step 3: Attendee Research
For each attendee:
1. Search for their LinkedIn profile and public presence
2. Note their:
   - Title and probable responsibilities
   - Tenure at the company (new = change agent, long = institutional knowledge)
   - Previous companies and roles (context for their perspective)
   - Recent posts or articles (topics they care about)
   - Decision-making authority level (Evaluator / Influencer / Decision Maker / Budget Holder)

**Role-based preparation:**
- **CEO/Founder:** Will care about strategic impact, ROI, competitive edge. Keep high-level.
- **COO/Operations:** Wants specifics on time savings, error reduction, process detail. Be concrete.
- **CTO/Tech Lead:** Concerns about integration, security, maintenance burden. Be technical.
- **CFO/Finance:** Focused on cost, payback period, risk. Have numbers ready.
- **Department Head:** Cares about their team's pain, adoption ease, quick wins. Be empathetic.

### Step 4: ICP Matching and Battle Card Selection (Layaa AI Mode)
1. Read `shared-references/icp-and-market.md` and classify the prospect
2. Load the matching battle card from `domain-references/sales/sales-playbook.md`
3. Identify:
   - **Primary pain points** for this ICP
   - **Value propositions** that resonate
   - **Proof points** and metrics to reference
   - **Common objections** and prepared responses
   - **Recommended service package** from `domain-references/sales/service-config-matrix.md`

### Step 5: Prepare Objection Responses
Based on the call type and prospect profile, prepare for likely objections:

**Pricing Objections:**
- "Too expensive" → Frame as investment, show ROI calculation, compare to cost of manual processes
- "Can we get a discount?" → Refer to package tiers, show value at each level, note minimum viable budget
- "We need to compare with other vendors" → Welcome comparison, highlight differentiation points

**Timing Objections:**
- "Not right now" → Understand the real blocker, offer a lightweight starting point
- "We're too busy to implement" → Emphasize managed service model, minimal client-side effort
- "Next quarter" → Secure a specific follow-up date, stay engaged with value-add content

**Technical Objections:**
- "Will it integrate with our systems?" → Discuss API-first approach, n8n flexibility, custom development option
- "Data security concerns" → Reference security practices, compliance frameworks
- "Our team won't adopt it" → Discuss enablement and training vertical, change management support

**Competitive Objections:**
- "We're already using [DIY tool]" → Acknowledge, position managed service value
- "We're talking to [enterprise vendor]" → Differentiate on agility, cost, SME focus
- "Our developer can build this" → Discuss maintenance burden, opportunity cost, ongoing support

### Step 6: Build the Agenda
Create a suggested agenda based on call type:

**Discovery Call Agenda (30-45 min):**
1. Introductions and context setting (3 min)
2. Understanding their business and current challenges (10-15 min)
3. Exploring current processes and pain points (10 min)
4. Initial solution overview (5-7 min)
5. Questions and next steps (5 min)

**Demo/Presentation Agenda (45-60 min):**
1. Brief recap of previous conversation (3 min)
2. Solution walkthrough tailored to their pain points (20-25 min)
3. Case study or example relevant to their ICP (5 min)
4. Q&A (10-15 min)
5. Next steps and timeline discussion (5 min)

**Proposal Review Agenda (30 min):**
1. Proposal walkthrough (10 min)
2. Scope confirmation (5 min)
3. Pricing and terms discussion (10 min)
4. Decision timeline and next steps (5 min)

**Negotiation Agenda (30 min):**
1. Outstanding concerns recap (5 min)
2. Address each concern (15 min)
3. Terms finalization (5 min)
4. Decision and onboarding discussion (5 min)

### Step 7: Prepare Key Questions to Ask
Generate 5-8 open-ended questions tailored to the prospect, call type, and ICP:

**Discovery questions:**
- "What does your current process look like for [relevant workflow]?"
- "Where do you see the biggest bottleneck in your operations?"
- "What happens when [pain point] occurs — what's the downstream impact?"
- "Have you explored automation before? What was the experience?"
- "What would success look like for you in the next 6 months?"

**Advancing questions:**
- "Who else would need to be involved in evaluating this?"
- "What's your typical decision-making process for a project like this?"
- "Is there a budget allocated for this type of initiative?"
- "What's your ideal timeline for getting started?"

### Step 8: Create the Prep Document
Compile everything into a single, scannable brief.

## Output Format

```
# Call Prep: [Company Name]
**Date/Time:** [scheduled time]
**Call Type:** [Discovery / Demo / Follow-up / Proposal / Negotiation]
**Duration:** [minutes]
**Our Attendees:** [names and roles]

## Account Brief
- **Company:** [name] — [what they do in 1 sentence]
- **Industry:** [vertical] | **Size:** [employees/stage] | **Location:** [city]
- **ICP Match:** [category] — Confidence: [High/Medium/Low]
- **Recent Triggers:** [relevant news/events]
- **Prior History:** [previous interactions summary]

## Attendee Profiles
### [Name] — [Title]
- **Role in decision:** [Decision Maker / Influencer / Evaluator / Champion]
- **Likely priorities:** [based on role research]
- **Communication style:** [based on available signals]
- **Key insight:** [something specific to reference or ask about]

## Agenda (Suggested)
1. [item] — [time] — [who leads]
2. [item] — [time] — [who leads]
3. [item] — [time] — [who leads]

## Talking Points
### Lead With
- [primary value proposition for this prospect]
- [specific pain point to address]

### Key Messages
1. [message aligned to their ICP]
2. [differentiator relevant to their situation]
3. [proof point or metric]

### Questions to Ask
1. [question]
2. [question]
3. [question]
4. [question]
5. [question]

## Objection Playbook
| Likely Objection | Prepared Response |
|-----------------|-------------------|
| [objection] | [response] |
| [objection] | [response] |
| [objection] | [response] |

## Recommended Package
- **Package:** [from service matrix]
- **Estimated Value:** [range]
- **Key Services:** [list relevant services]
- **Do NOT mention:** [any services or prices outside scope]

## Call Goals
- **Primary:** [what must be achieved]
- **Secondary:** [what would be a bonus]
- **Minimum:** [acceptable outcome if call doesn't go well]

## Post-Call Plan
- Send follow-up within [timeframe]
- Prepare [deliverable] if they request it
- Schedule [next step] before ending the call
```

## What Makes This Different from Generic Call Prep
- Matches prospects to Layaa AI's specific ICPs and loads corresponding battle cards
- Prepares objection responses from Layaa AI's sales playbook, not generic templates
- Recommends specific service packages and pricing tiers from the service configuration matrix
- Knows Layaa AI's competitive positioning against DIY tools, enterprise solutions, and freelancers
- Includes Layaa AI's methodology (Discovery → Assessment → Development → Validation → Enablement) as a talking point
- Prepares questions aligned with Layaa AI's discovery framework
- Sets call goals that map to Layaa AI's pipeline stages and conversion benchmarks
