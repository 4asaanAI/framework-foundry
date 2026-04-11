---
name: synthesize-research
description: >
  Synthesize user research, market data, competitive analysis, and customer feedback into actionable
  product insights. Identifies patterns, opportunities, and priorities across qualitative and
  quantitative data sources. In Layaa AI mode, overlays ICP profiles and sales objection data for
  pattern matching. Trigger: "synthesize research", "research synthesis", "insight analysis",
  "customer feedback analysis", "market research summary". This skill replaces the generic
  product:synthesize-research capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Synthesize Research

Synthesize user research, market data, competitive analysis, and customer feedback into actionable product insights with prioritized recommendations.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

**Layaa AI product context:** Layaa AI does not have a traditional SaaS product. "Product" means service offerings, pre-built automation modules, AI agent capabilities, and the overall platform/methodology. Research synthesis should focus on service-market fit, not product-market fit in the traditional sense.

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/icp-and-market.md — ICP profiles, personas, market context
- shared-references/company-identity.md — Company basics and positioning
- shared-references/service-verticals.md — Five service verticals
- domain-references/marketing/target-segments.md — Detailed target segment profiles
- domain-references/marketing/gtm-strategy.md — GTM strategy and channel approach
- domain-references/sales/sales-playbook.md — Objection handling and battle cards
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Gather Research Inputs
Collect all available research data:
1. Use Glob to find research documents, survey results, interview transcripts (`*research*`, `*survey*`, `*interview*`, `*feedback*`, `*insight*`)
2. Use Grep to find customer quotes, objection patterns, feature requests
3. Ask the user for any additional data sources:
   - User interviews or conversation notes
   - Survey responses or NPS data
   - Analytics or usage data
   - Competitive analysis reports
   - Sales call summaries or lost deal analyses
   - Support tickets or common issues

If data is sparse, note the confidence level and recommend additional research.

### Step 2: Overlay ICP Profiles (Layaa AI Mode)
For Layaa AI, map all research inputs against the four ICP segments:
- **SaaS Startups (5-25 employees):** Manual ops slowing scale, 30-50 day cycle, medium-high budget
- **Logistics & Supply Chain SMEs (50-200 employees):** Manual tracking, 60-90 day cycle, ROI-driven
- **Fintech & Payment Processors (10-100 employees):** Regulatory reporting, 45-75 day cycle, medium-high budget
- **Professional Services (10-50 employees):** Admin overhead, 50-80 day cycle, variable budget

Tag each data point with the ICP it relates to. Identify:
- Which ICPs have the most data (and therefore highest confidence)
- Which ICPs are underrepresented in the research (gaps to fill)
- Cross-ICP patterns that apply universally

### Step 3: Identify Themes and Patterns
Analyze the data for recurring themes:
- **Pain point patterns:** What problems come up repeatedly? Group by severity and frequency
- **Desire patterns:** What do users/prospects wish they had? Group by feasibility and impact
- **Behavior patterns:** How are users currently solving problems? What workarounds exist?
- **Objection patterns:** What reasons do prospects give for not buying?
- **Satisfaction patterns:** What do existing clients value most? What drives renewals?

For each theme, note:
- Frequency (how often it appears across data sources)
- Intensity (how strongly respondents feel about it)
- Breadth (does it span ICPs or is it ICP-specific?)

### Step 4: Quantify Insights
Where possible, attach numbers to qualitative findings:
- "7 out of 10 interviewed prospects mentioned manual data entry as their top pain point"
- "Average time spent on manual processes: 15 hours/week across logistics SMEs"
- "3 out of 5 lost deals cited 'too expensive' — but all were below minimum viable budget (50k)"
- Use percentages, averages, and ranges to strengthen the narrative

For Layaa AI: cross-reference with revenue model data (conversion rates, deal sizes) to assess commercial significance.

### Step 5: Cross-Reference Sales Objections (Layaa AI Mode)
Load objections from the sales playbook and compare with research findings:
- Do research insights validate or contradict common sales objections?
- Are there objections that research shows are perception-based vs. reality-based?
- Are there unspoken objections that research reveals but sales has not encountered?
- Which objections point to genuine product/service gaps vs. messaging gaps?

This step connects research to revenue — insights that reduce objections directly impact conversion.

### Step 6: Prioritize Insights by Impact and Confidence
Rank each insight using a 2x2 matrix:

**Impact (potential business value):**
- High: Directly affects revenue, retention, or competitive positioning
- Low: Incremental improvement or nice-to-have

**Confidence (strength of evidence):**
- High: Multiple data sources, quantitative backing, consistent pattern
- Low: Single source, anecdotal, contradictory signals

Priority order:
1. High Impact + High Confidence → Act now
2. High Impact + Low Confidence → Validate further (targeted research)
3. Low Impact + High Confidence → Plan for later
4. Low Impact + Low Confidence → Deprioritize

### Step 7: Generate Recommendations
For each priority insight, recommend specific actions:
- **Service/product improvements:** Changes to offerings, new modules, process improvements
- **Messaging improvements:** How to better communicate existing value
- **Sales enablement:** New objection handlers, battle cards, or proof points
- **Research follow-ups:** What additional data would strengthen low-confidence insights
- For Layaa AI: map recommendations to specific service verticals and delivery methodology stages

### Step 8: Link to Product/Service Improvements
Connect insights to concrete next steps:
- Which user stories or specs should be created?
- Which existing offerings should be modified?
- Which pre-built modules address the identified pain points?
- What new capabilities would unlock the opportunities identified?

## Output Format

```
# Research Synthesis: [Topic/Period]
**Date:** [date]
**Data Sources:** [list of sources analyzed]
**Confidence Level:** [High — rich data across ICPs / Medium — partial coverage / Low — limited data]
**ICP Coverage:** [which ICPs are represented and which have gaps]

## Executive Summary
[2-3 paragraph summary of key findings, most important insight, and top recommendation]

## Key Findings

### Finding 1: [Title]
- **Insight:** [What the data shows]
- **Evidence:** [Specific data points, quotes, or metrics]
- **ICP Relevance:** [Which ICPs this affects]
- **Impact:** [High/Medium/Low]
- **Confidence:** [High/Medium/Low]

### Finding 2: [Title]
- **Insight:** [What the data shows]
- **Evidence:** [Specific data points, quotes, or metrics]
- **ICP Relevance:** [Which ICPs this affects]
- **Impact:** [High/Medium/Low]
- **Confidence:** [High/Medium/Low]

[Continue for all findings...]

## Insight Themes
| Theme | Frequency | Intensity | ICPs Affected | Priority |
|-------|-----------|-----------|---------------|----------|
| [theme] | [count/percentage] | [High/Med/Low] | [list] | [1-4] |
| [theme] | [count/percentage] | [High/Med/Low] | [list] | [1-4] |

## Opportunity Matrix

### Act Now (High Impact + High Confidence)
| Opportunity | Evidence Strength | Expected Impact | Recommended Action |
|-------------|------------------|-----------------|-------------------|
| [opportunity] | [data points] | [revenue/retention/positioning] | [specific action] |

### Validate Further (High Impact + Low Confidence)
| Opportunity | Evidence Gap | Validation Method | Timeline |
|-------------|-------------|------------------|----------|
| [opportunity] | [what is missing] | [how to get the data] | [timeframe] |

### Plan for Later (Low Impact + High Confidence)
| Opportunity | Evidence | Expected Impact | When to Revisit |
|-------------|----------|-----------------|-----------------|
| [opportunity] | [data points] | [incremental gain] | [trigger/timeline] |

## Sales Objection Cross-Reference (Layaa AI Mode)
| Objection | Research Finding | Implication | Recommended Response Update |
|-----------|-----------------|-------------|---------------------------|
| [objection] | [what research shows] | [validates/contradicts] | [new messaging] |

## Prioritized Recommendations
1. **[Recommendation]** — [rationale and expected impact]
   - Service vertical: [which vertical]
   - Action type: [service improvement / messaging / sales enablement / further research]
   - Effort: [Low/Medium/High]

2. **[Recommendation]** — [rationale and expected impact]
   - Service vertical: [which vertical]
   - Action type: [service improvement / messaging / sales enablement / further research]
   - Effort: [Low/Medium/High]

[Continue for all recommendations...]

## Research Gaps
| Gap | Why It Matters | Recommended Method | Priority |
|-----|---------------|-------------------|----------|
| [what data is missing] | [impact of not knowing] | [interview/survey/analytics] | [High/Med/Low] |

## Appendix
- [Raw data summaries, full quote banks, or detailed methodology notes]
```

## What Makes This Different from Generic Research Synthesis
- Maps all findings against Layaa AI's four ICP segments with coverage gap identification
- Cross-references customer insights with actual sales objections from the playbook
- Connects research insights to Layaa AI's five service verticals for actionable routing
- Evaluates commercial significance using Layaa AI's revenue model and conversion benchmarks
- Identifies minimum viable budget misalignment (prospects below 50k threshold)
- Recommends pre-built module opportunities based on recurring cross-ICP pain points
- Frames product improvements within the service-as-product model rather than SaaS feature development
