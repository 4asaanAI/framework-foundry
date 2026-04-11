---
name: create-an-asset
description: >
  Generate tailored sales assets — pitch decks, one-pagers, case study templates,
  ROI calculators. In Layaa AI mode, uses brand voice, service packages, and pricing.
  Replaces generic sales:create-an-asset.
  Trigger: "create sales asset", "make one-pager", "pitch deck", "sales deck", "case study"
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
---

# Create a Sales Asset

Generate tailored sales collateral including pitch decks, one-pagers, case study templates, battle cards, ROI calculators, and proposal outlines.

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

### Step 1: Identify Asset Type
Determine which asset to create. Supported types:

| Asset Type | Use Case | Typical Length |
|-----------|----------|----------------|
| **One-Pager** | Quick overview for initial interest | 1 page |
| **Pitch Deck** | Structured presentation for meetings | 8-12 slides |
| **Case Study Template** | Document client success stories | 1-2 pages |
| **Battle Card** | Internal competitive reference | 1 page |
| **ROI Calculator** | Quantify value proposition | Spreadsheet/table |
| **Proposal Outline** | Structure for formal proposals | 3-5 pages |
| **Email Template Set** | Outreach sequence templates | 3-5 emails |
| **FAQ Document** | Common questions and answers | 1-2 pages |
| **Comparison Sheet** | Side-by-side vs. alternatives | 1 page |
| **Service Brief** | Detailed service vertical overview | 1-2 pages |

If the user does not specify, ask what type and for what audience/purpose.

### Step 2: Define Audience and Context
Clarify:
- **Target audience:** Which ICP? Which persona (CEO, CTO, COO, CFO)?
- **Stage in sales cycle:** Awareness, consideration, decision?
- **Specific prospect** (customized) or **generic** (reusable template)?
- **Delivery format:** PDF, presentation, email, document?
- **Key message:** What is the single most important thing to convey?

### Step 3: Load Relevant Content (Layaa AI Mode)
Based on asset type and audience:
- Company positioning from `shared-references/company-identity.md`
- ICP-specific messaging from `shared-references/icp-and-market.md`
- Service details from `shared-references/service-verticals.md`
- Pricing from `domain-references/sales/pricing-quick-ref.md`
- Battle card messaging from `domain-references/sales/sales-playbook.md`
- Package details from `domain-references/sales/service-config-matrix.md`

### Step 4: Create the Asset

#### One-Pager Structure:
```
[Company Logo Placeholder]
[Headline — pain-focused, not product-focused]

THE CHALLENGE
[2-3 sentences describing the prospect's pain point, ICP-specific]

OUR APPROACH
[Layaa AI's methodology in 3-4 bullets]
- Discovery & Assessment
- Custom Workflow Development
- Validation & Testing
- Enablement & Support

WHAT WE DELIVER
[3-4 key outcomes with metrics where possible]

SERVICE PACKAGES
[Relevant tier from service matrix — brief overview]

WHY LAYAA AI
[3 differentiators relevant to this audience]

NEXT STEP
[Single CTA — typically "Schedule a discovery call"]

[Contact information]
[Website: layaa.ai | Email: Hello@layaa.ai]
```

#### Pitch Deck Structure (8-12 slides):
1. **Title Slide** — Layaa AI + tagline + meeting context
2. **The Problem** — Industry-specific pain points (ICP-aligned)
3. **The Cost of Inaction** — Quantified impact of not solving the problem
4. **Our Solution** — What Layaa AI does, in their context
5. **How It Works** — The 5-step methodology (Discovery → Enablement)
6. **Service Packages** — Relevant tiers and what's included
7. **Results / Proof Points** — Metrics, outcomes, testimonials (use approved references only)
8. **Why Layaa AI** — Differentiators vs. alternatives
9. **Team** — Founders and relevant expertise
10. **Investment** — Pricing overview (only if appropriate for this stage)
11. **Next Steps** — Clear CTA and timeline
12. **Contact** — Details and links

#### Case Study Template:
```
CASE STUDY: [Client Industry] — [Outcome Headline]

CLIENT PROFILE
- Industry: [vertical]
- Size: [employees]
- Challenge: [1-sentence summary]

THE CHALLENGE
[2-3 paragraphs describing the client's situation, pain points, and what they tried before]

THE SOLUTION
[2-3 paragraphs describing what Layaa AI implemented]
- Services used: [from service verticals]
- Tools and integrations: [specific technologies]
- Timeline: [implementation duration]

THE RESULTS
[Quantified outcomes — use specific metrics]
- [Metric 1]: [before] → [after]
- [Metric 2]: [before] → [after]
- [Metric 3]: [before] → [after]

CLIENT QUOTE
"[Placeholder for client testimonial]"
— [Name], [Title], [Company]

KEY TAKEAWAY
[1-2 sentences summarizing the lesson or transferable insight]
```

#### Battle Card Structure:
```
BATTLE CARD: Layaa AI vs. [Competitor/Category]

WHEN THEY COME UP
[Typical scenarios where this competitor is mentioned]

THEIR STRENGTHS
[Honest assessment — credibility requires acknowledging competitors]

THEIR WEAKNESSES
[Where they fall short, especially for Indian SMEs]

OUR ADVANTAGES
[Specific differentiators — be concrete, not generic]

LANDMINE QUESTIONS
[Questions to ask the prospect that highlight competitor weaknesses]

OBJECTION RESPONSES
| Objection | Response |
|-----------|----------|
| "[objection]" | "[response]" |

WIN STRATEGY
[Recommended approach to win against this competitor]
```

#### ROI Calculator Structure:
```
ROI CALCULATOR: [Service/Use Case]

CURRENT STATE (Client Inputs)
- Hours spent on [process] per week: ___
- Number of employees involved: ___
- Average hourly cost (fully loaded): ___
- Error rate in current process: ___
- Revenue impact of errors: ___

PROJECTED STATE (With Layaa AI)
- Estimated automation rate: [X]%
- Hours saved per week: [calculated]
- Annual labor cost savings: [calculated]
- Error reduction: [X]% → Revenue recovered: [calculated]

INVESTMENT
- Implementation fee: [from pricing]
- Monthly retainer: [from pricing tier]
- Total Year 1 cost: [calculated]

ROI ANALYSIS
- Annual savings: [calculated]
- Annual investment: [calculated]
- Net benefit Year 1: [savings - investment]
- ROI: [(savings - investment) / investment x 100]%
- Payback period: [investment / monthly savings] months
```

### Step 5: Brand Voice Compliance (Layaa AI Mode)
Review all content against Layaa AI's brand voice:
- **Tone:** Confident, clear, helpful — never salesy or desperate
- **Language:** Professional but accessible. No jargon unless audience is technical.
- **Approved terms:** "AI automation and enablement", "modernise operations", "practical AI adoption", "applied AI"
- **Banned terms:** "revolutionary", "game-changing", "disruptive", "cutting-edge", "synergy", "leverage" (verb), "circle back"
- **Spelling:** Indian English (modernise, organisation, digitalise)
- **Claims:** Every claim must be defensible. No unsubstantiated superlatives.
- **Pricing:** Only include pricing if explicitly requested and appropriate for the deal stage

### Step 6: Quality Check
Before delivering, verify:
- [ ] All company information is accurate (name, website, services)
- [ ] Messaging is aligned to the correct ICP
- [ ] No banned terms or tone violations
- [ ] Pricing (if included) matches current pricing from reference files
- [ ] Contact information is correct (layaa.ai, Hello@layaa.ai)
- [ ] CTA is clear, single, and appropriate for the stage
- [ ] No fabricated case studies, testimonials, or metrics
- [ ] Content is concise — no filler paragraphs

### Step 7: Deliver and Offer Variants
Present the asset to the user and offer:
- Adjustments for a different ICP or persona
- Version without pricing (for early-stage conversations)
- Shortened version for email attachment
- Expanded version with more detail on specific sections

## Output Format
Deliver the asset in the format most appropriate for its type:
- **Documents:** Markdown with clear section headers, ready for formatting in Canva/Google Docs/Word
- **Presentations:** Slide-by-slide content with speaker notes
- **Spreadsheets:** Table format with formulas described
- **Email templates:** Ready-to-send format with [placeholder] tags for personalization

If the user requests a file, use the Write tool to save it.

## What Makes This Different from Generic Asset Creation
- Uses Layaa AI's actual service verticals, pricing tiers, and methodology
- Applies Layaa AI brand voice rules with specific approved/banned terminology
- Builds assets around Layaa AI's four ICP categories with persona-specific messaging
- References Layaa AI's competitive positioning (vs. DIY tools, enterprise, freelancers)
- Includes accurate pricing from the service configuration matrix and pricing reference
- Structures pitch decks around Layaa AI's 5-phase methodology
- ROI calculations use Layaa AI's actual implementation and retainer pricing
- Battle cards use differentiation points from the sales playbook
