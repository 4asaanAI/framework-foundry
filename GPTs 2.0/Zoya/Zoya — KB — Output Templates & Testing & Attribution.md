# Zoya — KB — Output Templates & Testing & Attribution

**Owner:** Zoya (Performance Marketing & Growth Architect)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026

> Standardized output templates, A/B testing framework, and attribution model guidelines for Layaa AI's marketing operations.

---

## 1. Output Templates

### Campaign Strategy Blueprint

```
CAMPAIGN STRATEGY BLUEPRINT
Campaign: [Name]
Prepared by: Zoya (Performance Marketing & Growth Architect)
Date: [Date]

CAMPAIGN OBJECTIVE: [Specific, measurable goal]
TARGET AUDIENCE SEGMENT: [From ICP definitions]
CHANNEL STRATEGY: [Primary, secondary, supporting channels]
MESSAGING HOOKS: [3-5 messaging directions for Tara to develop]
CREATIVE REQUIREMENTS: [Format, specs, quantity needed]
FUNNEL STAGE TARGETED: [Which funnel stage(s)]
METRICS TO TRACK: [Specific KPIs]
BENCHMARKS REFERENCED: [Source and evidence tag]
BUDGET PROPOSAL: [Amount, allocation, justification]
CONFIDENCE LEVEL: [High/Medium/Low — percentage]
FOUNDER APPROVAL REQUIRED: [Yes/No — specify what]
```

### Funnel Optimization Report

```
FUNNEL OPTIMIZATION REPORT
Period: [Date range]
Prepared by: Zoya

FUNNEL STAGE: [Which stage is underperforming]
DROP-OFF POINT: [Specific point where drop-off occurs]
DROP-OFF RATE: [%]
PROBABLE CAUSES: [Ranked by likelihood]
SUGGESTED FIXES: [Ranked by expected impact and effort]
SUPPORTING DATA: [Evidence with tags]
CONFIDENCE: [%]
ESCALATION NEEDED: [Yes/No]
```

### Budget & Forecast Summary

```
BUDGET PROPOSAL
Period: [Duration]
Prepared by: Zoya

CHANNEL(S): [Which channels]
PROPOSED SPEND: Rs.[Amount]
FORECASTED CAC: Rs.[Amount]
FORECASTED ROAS: [X]x
ASSUMPTIONS: [Listed with evidence tags]
DEPENDENCIES: [What else needs to happen]
RISK FACTORS: [What could go wrong]
MINIMUM VIABLE BUDGET: Rs.[Amount] (smallest meaningful test)
APPROVED BY MIRA: [Yes/No]
FOUNDER APPROVAL REQUIRED: [Yes/No]
```

### Growth Loop Analysis

```
GROWTH LOOP ANALYSIS
Loop Type: [Viral / Paid Flywheel / Referral / Content / Retention]
Entry Trigger: [What starts the loop]
CONVERSION DRIVERS: [What keeps it going]
BOTTLENECKS: [Where it breaks down]
LEVERS TO TEST: [What we can pull to improve]
RISK SCORE: [Low/Medium/High]
INSTITUTIONAL MEMORY UPDATE: [Recommended? Yes/No]
```

---

## 2. A/B Testing Framework

### Test Design Template

```
A/B TEST: [Test Name]
Hypothesis: "If we [change X], then [metric Y] will [improve/decrease] because [reason]"
Test Element: [What is being tested — headline, image, CTA, targeting, landing page]
Control (A): [Current version]
Variant (B): [New version]
Primary Metric: [What we are measuring]
Sample Size Needed: [Minimum for statistical significance]
Test Duration: [How long to run]
Confidence Threshold: 95% (do not call a test before this)
Decision: [If B wins by X%, implement. If not, keep A.]
```

### Testing Priorities
1. Landing page headline and CTA (highest impact on conversion)
2. Ad creative and messaging (highest impact on CTR)
3. Email subject lines (highest impact on open rate)
4. Targeting parameters (highest impact on lead quality)
5. Offer and lead magnet (highest impact on form completion)

### Testing Rules
- Only test one variable at a time
- Run tests to statistical significance (95% confidence minimum)
- Document every test result in memory (win or lose)
- Share winning patterns with Tara (for content) and Nia (for execution)

---

## 3. Attribution Models

### Recommended Attribution for Layaa AI's Stage

**Current (Pre-Scale):** Last-touch attribution
- Simple, easy to implement
- Sufficient when volume is low
- Gives credit to the final touchpoint before conversion

**Future (When Multi-Channel):** Linear attribution or Position-based
- Linear: Equal credit to all touchpoints in the journey
- Position-based: 40% first touch, 40% last touch, 20% distributed to middle touches
- Required when running multiple channels simultaneously

### UTM Standards

All campaign links must use consistent UTM parameters:

```
utm_source = [platform] (linkedin, google, meta, email, whatsapp)
utm_medium = [type] (cpc, organic, email, social, referral)
utm_campaign = [campaign-name] (lowercase, hyphens, descriptive)
utm_content = [ad-variant] (for A/B testing — a, b, c)
utm_term = [keyword] (for search campaigns only)
```

**Example:** `?utm_source=linkedin&utm_medium=cpc&utm_campaign=ca-firm-awareness-q3&utm_content=variant-a`

---

*This document is part of the Zoya Knowledge Base. It provides the standardized output formats, testing methodology, and attribution frameworks that ensure consistent, data-driven marketing operations.*
