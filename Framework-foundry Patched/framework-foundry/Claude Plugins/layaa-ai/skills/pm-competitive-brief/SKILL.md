---
name: pm-competitive-brief
description: >
  Create product-focused competitive analysis for product positioning and feature prioritization.
  Compares capabilities, pricing, and market positioning to inform product strategy. In Layaa AI
  mode, loads battle cards and compares across five service verticals. Trigger: "pm competitive
  brief", "product competitive analysis", "competitive feature comparison", "product positioning
  analysis", "competitive landscape". This skill replaces the generic product:competitive-brief
  capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# PM Competitive Brief

Create product-focused competitive analysis for product positioning and feature prioritization, comparing capabilities, pricing, and market positioning to inform product strategy decisions.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

**Layaa AI product context:** Layaa AI does not have a traditional SaaS product. Competitive analysis compares service delivery models, automation capabilities, pricing structures, and market positioning. The "product" is the end-to-end service offering — education, consulting, automation development, maintenance, and pre-built modules.

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/icp-and-market.md — ICP profiles and market context
- shared-references/service-verticals.md — Five service verticals for comparison framework
- shared-references/company-identity.md — Positioning and vision
- shared-references/revenue-model.md — Pricing model for comparison
- domain-references/sales/sales-playbook.md — Battle cards and competitive positioning
- domain-references/marketing/gtm-strategy.md — GTM strategy and differentiation
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Competitors to Analyze
Determine the scope of the competitive analysis:
- **Direct competitors:** Companies offering similar AI automation services to Indian SMEs
- **Category competitors:** Alternative approaches to the same problem (DIY tools, enterprise consultancies, freelancers)
- **Emerging competitors:** New entrants or adjacent players expanding into this space

For Layaa AI, competitors fall into three categories:
1. **DIY Automation Tools:** Zapier, Make (Integromat), Power Automate, n8n (self-hosted), Workato, Tray.io
2. **Enterprise Solutions:** Accenture, Deloitte Digital, TCS, Infosys, Wipro, large consulting firms
3. **Freelancers / Boutique Agencies:** Independent developers, small agencies, Upwork/Fiverr contractors, boutique AI firms

Ask the user to specify which competitors or which category to focus on.

### Step 2: Research Competitor Offerings and Features
Using WebSearch, gather detailed information:
- **Service/product offerings:** What do they sell? How is it packaged?
- **Feature set:** Specific capabilities, integrations, platforms supported
- **Technology stack:** What tools and platforms do they use?
- **Delivery model:** Self-service, managed service, project-based, retainer-based
- **Pricing:** Published pricing, packaging tiers, custom quotes
- **Target market:** Company sizes, industries, geographies they serve
- **Case studies:** Published results, client outcomes, ROI claims
- **Team/expertise:** Team size, notable hires, technical depth

### Step 3: Load Existing Battle Cards (Layaa AI Mode)
For Layaa AI:
- Read battle cards from `domain-references/sales/sales-playbook.md`
- Identify existing competitive positioning and known differentiators
- Use existing intelligence as a baseline and enhance with new research
- Note any outdated information that needs updating

### Step 4: Create Feature/Capability Comparison Matrix
Build a structured comparison across key dimensions:

**For Layaa AI, compare across the five service verticals:**

| Capability | Layaa AI | [Competitor 1] | [Competitor 2] | [Competitor 3] |
|-----------|----------|---------------|---------------|---------------|
| **Education & Workforce Enablement** | | | | |
| On-site AI training | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| No-code/low-code training | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| Function-specific sessions | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| **Consulting & Process Assessment** | | | | |
| Process mapping | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| AI adoption roadmaps | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| Workflow assessment | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| **Automation Development** | | | | |
| Custom workflows | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| AI conversational interfaces | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| CRM/database integrations | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| **Maintenance & Support** | | | | |
| Ongoing monitoring | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| Subscription support | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| Performance assessments | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| **Pre-built Automations** | | | | |
| Ready-to-deploy modules | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |
| Customizable templates | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] | [Y/N/Partial] |

### Step 5: Analyze Pricing Models
Compare pricing approaches:
- **Model type:** Per-user, per-workflow, project-based, retainer, consumption-based
- **Entry point:** What is the minimum cost to start?
- **Scalability:** How does pricing scale with usage/growth?
- **Hidden costs:** Implementation fees, training, support tiers, API costs
- **Value alignment:** Does pricing align with value delivered?

For Layaa AI, compare against:
- Implementation fee: Average 2.5L (one-time)
- Retainer tiers: Starter 15k/mo, Growth 40k/mo, Enterprise custom
- Minimum viable budget: 50k+
- Model: Implementation + ongoing retainer (managed service)

### Step 6: Identify Competitive Gaps
Analyze where each competitor wins and loses:

**Where Layaa AI Wins:**
- Areas where Layaa AI has clear advantages (managed service, SME focus, end-to-end methodology)
- Capabilities competitors lack
- Price/value advantages for the target market

**Where Competitors Win:**
- Be honest about competitor strengths
- Identify areas where competitors have genuine advantages
- Note areas where Layaa AI needs to improve

**White Space:**
- Capabilities nobody offers well
- Market segments underserved by all players
- Emerging needs that no competitor has addressed

### Step 7: Apply Positioning Framework (Layaa AI Mode)
Frame the competitive analysis using Layaa AI's positioning:
- **Core positioning:** "Not a tool vendor, not an enterprise consultancy — the automation team"
- **Against DIY tools:** Managed service eliminates the learning curve and maintenance burden; SMEs get results, not software licenses
- **Against enterprise consultancies:** Agility, cost efficiency, and SME-appropriate solutions without enterprise bloat and cost
- **Against freelancers:** Reliability, methodology, ongoing support, and accountability that independent contractors cannot match

Evaluate whether the current positioning holds up against the research, or whether adjustments are needed.

### Step 8: Generate Product Strategy Recommendations
Based on the competitive analysis, recommend:
- **Features to build:** Capabilities that would strengthen competitive position
- **Features to not build:** Areas where competing head-on is inadvisable
- **Positioning refinements:** How to sharpen messaging against specific competitors
- **Pricing adjustments:** Whether pricing is competitive for the target market
- **Partnership opportunities:** Gaps that could be filled through partnerships rather than building
- **Prioritization:** Rank recommendations by competitive impact and feasibility

For Layaa AI: prioritize features that:
- Strengthen the managed service differentiator
- Create reusable pre-built modules (scalability advantage over freelancers)
- Deepen vertical expertise in priority ICP segments
- Increase switching costs for existing clients (NRR improvement)

## Output Format

```
# PM Competitive Brief: [Competitor(s) / Category]
**Date:** [date]
**Scope:** [specific competitor / category analysis / market landscape]
**Confidence Level:** [High — verified data / Medium — partial data / Low — estimates and inference]

## Executive Summary
[3-4 sentence summary: competitive landscape, Layaa AI's position, top strategic insight, key recommendation]

## Competitor Profiles

### [Competitor 1]
- **What they offer:** [brief description]
- **Target market:** [who they serve]
- **Pricing:** [model and range]
- **Strengths:** [honest assessment]
- **Weaknesses (for our ICP):** [specific to Indian SME needs]
- **Threat level:** [High / Medium / Low]

### [Competitor 2]
[Same structure...]

## Capability Comparison Matrix
| Capability | Layaa AI | [Comp 1] | [Comp 2] | [Comp 3] | Gap Owner |
|-----------|----------|----------|----------|----------|-----------|
| [capability] | [rating] | [rating] | [rating] | [rating] | [who wins] |

**Rating Scale:** Strong / Adequate / Weak / Absent

## Service Vertical Comparison (Layaa AI Mode)
| Vertical | Layaa AI | Best Competitor | Gap | Opportunity |
|----------|----------|----------------|-----|-------------|
| Education & Enablement | [assessment] | [who and rating] | [gap description] | [what to do] |
| Consulting & Assessment | [assessment] | [who and rating] | [gap description] | [what to do] |
| Automation Development | [assessment] | [who and rating] | [gap description] | [what to do] |
| Maintenance & Support | [assessment] | [who and rating] | [gap description] | [what to do] |
| Pre-built Automations | [assessment] | [who and rating] | [gap description] | [what to do] |

## Pricing Comparison
| Dimension | Layaa AI | [Comp 1] | [Comp 2] | [Comp 3] |
|-----------|----------|----------|----------|----------|
| Entry Price | [amount] | [amount] | [amount] | [amount] |
| Monthly Cost | [range] | [range] | [range] | [range] |
| Pricing Model | [type] | [type] | [type] | [type] |
| Hidden Costs | [list] | [list] | [list] | [list] |
| Value/Price | [assessment] | [assessment] | [assessment] | [assessment] |

## Positioning Analysis
**Current Position:** [where Layaa AI sits in the market]
**Defensible Advantages:** [what competitors cannot easily replicate]
**Vulnerable Areas:** [where competitors could erode position]
**Positioning Statement Validation:** [does "Not a tool vendor, not an enterprise consultancy — the automation team" hold up?]

## Gap Analysis
### Where We Win
| Advantage | Evidence | How to Amplify |
|-----------|----------|---------------|
| [advantage] | [data point] | [action] |

### Where They Win
| Competitor Advantage | Impact on Us | Response Options |
|---------------------|-------------|-----------------|
| [advantage] | [how it affects deals] | [build / partner / position around] |

### White Space Opportunities
| Opportunity | Why No One Owns It | Feasibility for Layaa AI | Priority |
|-------------|-------------------|------------------------|----------|
| [gap] | [reason] | [High/Med/Low] | [1-5] |

## Product Strategy Recommendations

### Features to Build (Strengthen Position)
| Feature | Competitive Impact | Effort | Priority | ICP Segments |
|---------|-------------------|--------|----------|-------------|
| [feature] | [how it changes competitive dynamic] | [L/M/H] | [1-5] | [which ICPs] |

### Features to NOT Build (Avoid Head-on Competition)
| Area | Why Not | Better Approach |
|------|---------|----------------|
| [area] | [rationale] | [alternative strategy] |

### Positioning Refinements
| Context | Current Positioning | Recommended Adjustment | Rationale |
|---------|-------------------|----------------------|-----------|
| [vs. competitor type] | [current] | [recommended] | [why] |

### Partnership Opportunities
| Gap | Potential Partner Type | Value to Layaa AI |
|-----|----------------------|-------------------|
| [gap] | [partner type] | [how it helps] |

## Monitoring Plan
| Competitor | Watch For | Check Frequency | Trigger for Update |
|-----------|-----------|-----------------|-------------------|
| [competitor] | [signals] | [weekly/monthly] | [what triggers re-analysis] |

## Summary
[2-3 sentences: overall competitive position, most important action, strategic priority]
```

## What Makes This Different from Generic Competitive Analysis
- Compares competitors across Layaa AI's five service verticals for structured capability assessment
- Uses existing battle cards from the sales playbook as the competitive intelligence baseline
- Validates the positioning statement ("Not a tool vendor, not an enterprise consultancy") against research
- Categorizes competitors into three segments (DIY tools, enterprise, freelancers) matching Layaa AI's competitive framework
- Evaluates competitive pricing against Layaa AI's specific pricing model (implementation + retainer)
- Prioritizes features that strengthen the managed service differentiator and pre-built module scalability
- Assesses competitive impact on specific ICP segments rather than a generic market
- Recommends partnership strategies where building is inadvisable, appropriate for a services company
