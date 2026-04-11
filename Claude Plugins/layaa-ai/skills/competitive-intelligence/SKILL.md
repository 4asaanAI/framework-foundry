---
name: competitive-intelligence
description: >
  Research competitors and build battle cards.
  In Layaa AI mode, positions against DIY tools, enterprise solutions, and freelancers.
  Replaces generic sales:competitive-intelligence.
  Trigger: "competitive analysis", "competitor research", "battlecard", "competitive intel"
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---

# Competitive Intelligence

Research competitors, analyze their positioning, and build actionable battle cards for the sales team.

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

### Step 1: Identify the Competitive Landscape
Determine what type of competitive analysis is needed:

**Option A — Specific Competitor:**
The user names a competitor. Research that company in depth.

**Option B — Category Analysis:**
The user asks about a category of competitors. Map the landscape.

**Option C — Deal-Specific:**
A prospect mentioned a competitor in a sales conversation. Build a targeted response.

In Layaa AI mode, competitors fall into three primary categories:
1. **DIY Automation Tools** — Zapier, Make (Integromat), Power Automate, n8n (self-hosted), Workato
2. **Enterprise Solutions** — Accenture, Deloitte Digital, TCS, Infosys, Wipro, large consulting firms
3. **Freelancers / Agencies** — Independent automation developers, boutique agencies, Upwork/Fiverr contractors

### Step 2: Research the Competitor(s)
Using WebSearch and WebFetch, gather:

**Company Profile:**
- What they offer (products, services, platforms)
- Target market (who they serve, company sizes, industries)
- Pricing model (free tier, per-user, per-automation, project-based, retainer)
- Publicly listed pricing or pricing page information
- Geographic focus and market presence

**Product/Service Analysis:**
- Key features and capabilities
- Integration ecosystem
- Ease of use and learning curve
- Support model (self-service, managed, dedicated)
- Technology approach (no-code, low-code, custom development)

**Market Position:**
- Market share or mindshare indicators
- Customer reviews (G2, Capterra, Trustpilot)
- Notable customers or case studies
- Recent product launches or pivots
- Funding and financial health (if startup)

**Strengths (be honest):**
- What they genuinely do well
- Where they have advantages over Layaa AI
- Why a prospect might choose them
- Brand recognition or trust factors

**Weaknesses (be specific):**
- Where they fall short for Indian SMEs
- Hidden costs or complexity
- Support gaps
- Scalability limitations
- Localization issues (India-specific)

### Step 3: Comparative Analysis

**Feature-by-Feature Comparison:**

| Capability | Layaa AI | [Competitor] | Advantage |
|-----------|----------|-------------|-----------|
| Implementation support | Fully managed | [varies] | [who wins] |
| Ongoing maintenance | Included in retainer | [varies] | [who wins] |
| Customization | Custom workflows | [varies] | [who wins] |
| Training & enablement | Dedicated vertical | [varies] | [who wins] |
| Indian SME focus | Primary market | [varies] | [who wins] |
| Pricing transparency | Clear tiers | [varies] | [who wins] |
| Response time | [SLA] | [varies] | [who wins] |

**TCO (Total Cost of Ownership) Comparison:**
Calculate true cost over 12 months for a typical Layaa AI client scenario:

For DIY tools:
- Tool subscription cost
- Internal employee time to build and maintain (hourly rate x hours)
- Training cost
- Opportunity cost of trial-and-error
- Cost of errors and downtime

For enterprise solutions:
- Consulting fees (daily rates x project days)
- Implementation timeline cost (longer timeline = delayed ROI)
- Change management overhead
- Ongoing support costs
- Vendor lock-in costs

For freelancers:
- Project fees
- No ongoing support (rebuild cost when things break)
- Quality variance risk
- Documentation gaps
- Knowledge loss when freelancer moves on

Compare against Layaa AI's total cost:
- Implementation fee (avg. 2.5L)
- Monthly retainer (15k-40k depending on tier)
- Total Year 1: ~5-7.3L for full managed service

### Step 4: Build the Battle Card (Layaa AI Mode)

**Battle Card Format:**

```
BATTLE CARD: Layaa AI vs. [Competitor/Category]
Last Updated: [date]

QUICK OVERVIEW
[2-sentence description of competitor and when they come up in sales conversations]

WHEN PROSPECTS CONSIDER THEM
- [Scenario 1: e.g., "Prospect has a developer who knows Zapier"]
- [Scenario 2: e.g., "Prospect got a quote from a consulting firm"]
- [Scenario 3: e.g., "Prospect found a freelancer on Upwork"]

THEIR PITCH
[What the competitor says about themselves — their positioning and value prop]

ACKNOWLEDGE THEIR STRENGTHS (Builds Credibility)
- [Strength 1]
- [Strength 2]
- [Strength 3]
DO: "They're a solid platform for..." / DON'T: "They're terrible at everything"

WHERE THEY FALL SHORT (For Our ICP)
- [Weakness 1 — specific to Indian SME context]
- [Weakness 2 — specific to our ICP's needs]
- [Weakness 3 — specific to our service model advantage]

OUR DIFFERENTIATORS
1. [Differentiator with proof point]
2. [Differentiator with proof point]
3. [Differentiator with proof point]

LANDMINE QUESTIONS
Ask these early in the conversation to frame the evaluation:
1. "[Question that highlights their weakness]"
2. "[Question that makes the prospect think about hidden costs]"
3. "[Question about ongoing support and maintenance]"

OBJECTION HANDLING
| They Say | We Say |
|----------|--------|
| "[Competitor] is cheaper" | "[TCO argument with specifics]" |
| "[Competitor] has more features" | "[Feature vs. outcome argument]" |
| "We can build it ourselves" | "[Time, maintenance, opportunity cost argument]" |
| "We already use [tool]" | "[Complementary positioning or migration value]" |

WIN STRATEGY
- Lead with: [primary angle]
- Prove with: [evidence or demonstration]
- Close with: [final differentiator]

LOSS ANALYSIS
If we've lost deals to this competitor before:
- Common reasons for loss: [list]
- What we should have done differently: [lessons]
```

### Step 5: Category-Level Battle Cards (Layaa AI Mode)
If doing a full landscape analysis, create one battle card per category:

**vs. DIY Tools (Zapier, Make, Power Automate):**
- Lead angle: "You don't have the time or expertise to build and maintain this"
- Key differentiator: Fully managed service vs. self-service tool
- TCO argument: Employee hours + learning curve + maintenance + error cost > Layaa AI retainer
- Landmine: "Who maintains the automations when your developer leaves?"

**vs. Enterprise Solutions (Accenture, TCS, Deloitte):**
- Lead angle: "You'll get the same quality at a fraction of the cost and timeline"
- Key differentiator: SME-focused agility vs. enterprise bloat
- TCO argument: Consulting day rates + long timelines + over-engineered solutions > Layaa AI implementation
- Landmine: "How long was the last consulting project — and did it finish on time and budget?"

**vs. Freelancers (Upwork, Fiverr, independent developers):**
- Lead angle: "What happens when they move to another project?"
- Key differentiator: Ongoing support and accountability vs. one-off delivery
- TCO argument: Rebuild cost + no documentation + no SLA + quality variance > Layaa AI retainer
- Landmine: "What's your plan for maintaining these automations 6 months from now?"

### Step 6: Competitive Monitoring Recommendations
Suggest ongoing monitoring activities:
- Track competitor pricing page changes (quarterly)
- Monitor their job postings for product direction signals
- Set up alerts for competitor mentions in target industries
- Review customer reviews on G2/Capterra monthly
- Track their content marketing topics (reveals positioning shifts)

### Step 7: Deliver and Update
Present the battle card(s) to the user and:
- Offer to save as a file in the workspace for future reference
- Recommend review frequency (monthly for active competitors, quarterly for category)
- Flag any areas where more information is needed (customer interviews, lost deal analysis)

## Output Format

```
# Competitive Intelligence: [Competitor/Category]
**Research Date:** [date]
**Confidence Level:** [High — multiple verified sources / Medium — limited data / Low — estimates]

## Competitor Overview
[Summary paragraph]

## Comparative Analysis
[Feature comparison table]

## TCO Comparison (12-Month Scenario)
| Cost Component | [Competitor] | Layaa AI | Delta |
|----------------|-------------|----------|-------|
| [component] | [cost] | [cost] | [savings/premium] |
| **Total** | **[total]** | **[total]** | **[net]** |

## Battle Card
[Full battle card as structured above]

## Recommended Actions
1. [action to strengthen competitive position]
2. [action to close specific deal]
3. [ongoing monitoring recommendation]
```

## What Makes This Different from Generic Competitive Intelligence
- Pre-categorizes competitors into Layaa AI's three competitive segments (DIY, enterprise, freelancers)
- TCO calculations use Layaa AI's actual pricing model (implementation + retainer tiers)
- Battle card messaging aligns with Layaa AI's brand voice (confident but honest, no competitor bashing)
- Landmine questions are designed for Layaa AI's specific differentiators (managed service, SME focus, methodology)
- Evaluates competitors specifically through the lens of Indian SME needs
- Positions against the full Layaa AI service stack (5 verticals) rather than individual features
- Connects competitive positioning to specific ICP pain points from the battle cards
