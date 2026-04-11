---
name: competitive-brief
description: >
  Create competitive analysis briefs for marketing positioning. Analyzes competitor messaging,
  positioning, pricing, and identifies differentiation opportunities. Supports campaign messaging
  and sales enablement. In Layaa AI mode, uses battle cards and positioning framework.
  Trigger: "competitive brief", "competitor positioning", "competitive messaging",
  "differentiation analysis", "positioning brief". This skill replaces the generic
  marketing:competitive-brief capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Competitive Brief

Create competitive analysis briefs for marketing positioning, analyzing competitor messaging, positioning, pricing, and identifying differentiation opportunities for campaign messaging and sales enablement.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics and positioning
- shared-references/icp-and-market.md — ICP profiles, market context, competitive landscape
- shared-references/service-verticals.md — Services and methodology
- shared-references/revenue-model.md — Pricing model for comparison
- domain-references/sales/sales-playbook.md — Battle cards and competitive positioning
- domain-references/marketing/gtm-strategy.md — GTM strategy and positioning framework
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Competitor(s) to Analyze
Determine scope of the competitive brief:
- **Named competitor:** User specifies a particular company to analyze
- **Category analysis:** User asks about a competitive category (e.g., "no-code automation tools")
- **Deal-specific:** Competitor came up in a specific sales situation
- Ask the user to clarify if the scope is unclear

For Layaa AI mode, competitors typically fall into:
1. **DIY Automation Tools** — Zapier, Make, Power Automate, n8n (self-hosted), Workato
2. **Enterprise Solutions** — Accenture, Deloitte Digital, TCS, Infosys, large consulting firms
3. **Freelancers / Agencies** — Independent developers, boutique agencies, Upwork/Fiverr contractors

### Step 2: Research Competitor Positioning and Messaging
Using WebSearch, gather:
- **Positioning statement:** How they describe themselves (tagline, hero copy, about page)
- **Key messaging themes:** What value propositions they emphasize
- **Target audience:** Who they claim to serve (company sizes, industries, roles)
- **Pricing model:** Public pricing, packaging, or pricing philosophy
- **Content strategy:** What topics they publish about, thought leadership angles
- **Social proof:** Customer logos, testimonials, case studies, review scores
- **Recent moves:** Product launches, pivots, funding, partnerships, hiring patterns

### Step 3: Load Existing Battle Cards (Layaa AI Mode)
For Layaa AI mode:
- Read battle cards from `domain-references/sales/sales-playbook.md` for existing competitive positioning
- Check if the competitor is already covered in existing battle cards
- If covered, use existing positioning as a baseline and update with new research
- If not covered, build the brief from scratch using the research

### Step 4: Analyze Competitor Strengths and Weaknesses
Conduct an honest assessment:

**Strengths (acknowledge genuinely):**
- What they do well — be specific and fair
- Where they have legitimate advantages
- Why a prospect might consider them
- Brand recognition, trust factors, market position

**Weaknesses (focus on ICP relevance):**
- Where they fall short for the target audience
- Hidden costs, complexity, or limitations
- Support gaps or scalability issues
- For Layaa AI: specific weaknesses in serving Indian SMEs

### Step 5: Map Competitive Landscape
Create a positioning matrix:
- **Axes:** Choose two dimensions most relevant to the analysis (e.g., service depth vs. price, customization vs. ease of use, SME focus vs. enterprise focus)
- **Plot:** Position each competitor and Layaa AI on the matrix
- **Identify:** White space opportunities where no competitor is strong
- **Note:** Clusters where competition is dense

### Step 6: Identify Messaging Gaps and Differentiation
Analyze what competitors are NOT saying:
- Topics they avoid or underserve in their content
- Audience segments they ignore
- Value propositions they do not claim
- Pain points they do not address

For Layaa AI mode, frame differentiation using the core positioning:
- "Not a tool vendor, not an enterprise consultancy — the automation team"
- Managed service model vs. self-service or project-based
- SME-focused agility vs. enterprise bloat
- End-to-end methodology (Discovery → Assessment → Development → Validation → Enablement)
- Five service verticals covering the full AI adoption journey

### Step 7: Generate Messaging Recommendations
Provide actionable recommendations for marketing messaging:
- **Positioning adjustments:** How to sharpen positioning against this competitor
- **Messaging angles:** Specific messages that highlight differentiation
- **Content opportunities:** Topics or formats that exploit competitor gaps
- **Campaign hooks:** Ad copy, email subject lines, or social posts that position against the competitor
- **Proof points needed:** Evidence or case studies that would strengthen the competitive position
- **Landmine questions:** Questions to plant in prospect conversations that highlight competitor weaknesses

### Step 8: Compile the Competitive Brief
Assemble all findings into a structured brief for the marketing and sales teams.

## Output Format

```
# Competitive Brief: [Competitor/Category]
**Date:** [date]
**Prepared for:** [marketing/sales/leadership]
**Confidence Level:** [High — multiple verified sources / Medium — limited data / Low — estimates]

## Competitor Overview
**Company:** [name]
**Positioning:** [their stated positioning]
**Target Market:** [who they serve]
**Pricing:** [pricing model and range]
**Key Messaging Themes:** [their main value props]

## Strengths (Honest Assessment)
1. [Strength — specific and factual]
2. [Strength — specific and factual]
3. [Strength — specific and factual]

## Weaknesses (For Our Target Audience)
1. [Weakness — specific to our ICP's needs]
2. [Weakness — specific to our ICP's needs]
3. [Weakness — specific to our ICP's needs]

## Positioning Matrix
[Description or table showing competitive positioning on key dimensions]

| Dimension | [Competitor] | Layaa AI | Advantage |
|-----------|-------------|----------|-----------|
| [dimension] | [rating] | [rating] | [who wins] |

## Messaging Gap Analysis
**What they claim:** [their key messages]
**What they miss:** [gaps in their messaging]
**Our opportunity:** [how to exploit the gap]

## Differentiation Opportunities
1. [Opportunity — specific messaging angle with rationale]
2. [Opportunity — specific messaging angle with rationale]
3. [Opportunity — specific messaging angle with rationale]

## Recommended Messaging Adjustments
| Context | Current Messaging | Recommended Adjustment | Rationale |
|---------|------------------|----------------------|-----------|
| [where] | [current] | [new] | [why] |

## Campaign Hooks
- **Ad copy angle:** [suggested ad messaging]
- **Email subject line:** [suggested email approach]
- **Social post angle:** [suggested social messaging]
- **Content piece:** [suggested blog/whitepaper topic]

## Landmine Questions (For Sales Conversations)
1. "[Question that highlights competitor weakness]"
2. "[Question about hidden costs or limitations]"
3. "[Question about ongoing support and accountability]"

## Proof Points Needed
- [Evidence or case study that would strengthen competitive position]
- [Data point or metric that would support differentiation claim]

## Summary
[2-3 sentence summary of the competitive position and recommended action]
```

## What Makes This Different from Generic Competitive Analysis
- Pre-categorizes competitors into Layaa AI's three competitive segments (DIY tools, enterprise, freelancers)
- Uses existing battle cards from the sales playbook as a baseline for positioning
- Frames differentiation using Layaa AI's core positioning statement and methodology
- Evaluates competitors specifically through the lens of Indian SME needs and budgets
- Generates actionable messaging recommendations tied to Layaa AI's channel strategy
- Produces landmine questions designed for Layaa AI's specific differentiators
- Connects competitive positioning to ICP pain points and service verticals
