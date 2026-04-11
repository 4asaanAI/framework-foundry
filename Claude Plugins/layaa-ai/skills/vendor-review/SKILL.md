---
name: vendor-review
description: >
  Evaluate and review vendor or tool performance, costs, and alternatives. Supports vendor
  selection, renewal decisions, and cost optimization. In Layaa AI mode, compares against
  tech stack recommendations and tool selection guide with TCO analysis.
  Trigger: "vendor review", "tool evaluation", "vendor performance", "tool comparison", "renewal review", "vendor cost", "switch vendor"
  This skill replaces the generic operations:vendor-review capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Vendor Review

Evaluate and review vendor/tool performance, costs, and alternatives. Supports vendor selection, renewal decisions, and cost optimization with structured scoring and TCO comparison.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, evaluating tools for delivery (n8n, Make, Zapier, Relevance AI, cloud providers, CRM), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/tech-stack.md — Current tools, platform capabilities, tool selection criteria
- domain-references/finance/pricing-engine.md — Cost structure and margin impact of tool costs
- domain-references/legal/risk-indicators.md — Vendor risk scoring thresholds
- shared-references/service-verticals.md — Service delivery dependencies on tools
Only load references relevant to the vendor type being reviewed.

## Execution Steps

### Step 1: Identify Vendor and Review Purpose
Collect or ask for:
- **Vendor/tool name:** What is being reviewed?
- **Review purpose:**
  - **New selection:** Choosing between vendors for a new need
  - **Renewal decision:** Should we continue with the current vendor?
  - **Performance review:** How well is the vendor performing against expectations?
  - **Cost optimization:** Can we reduce spend while maintaining quality?
  - **Consolidation:** Can we replace multiple tools with one?
- **Current relationship:** How long has Layaa AI used this vendor? Contract terms?
- **Stakeholders:** Who uses this tool/service and who is affected by changes?
- **Budget context:** Current spend and budget constraints
- **For Layaa AI:** Is this tool used for internal operations, client delivery, or both?

### Step 2: Gather Performance Data
Assess current vendor performance:

**Reliability and Uptime:**
- Documented uptime percentage (target vs. actual)
- Downtime incidents in the review period (count, duration, severity)
- Planned maintenance frequency and impact
- Disaster recovery capability

**Support Quality:**
- Average response time for support tickets
- Resolution time for issues
- Support channel availability (chat, email, phone, dedicated account manager)
- Quality of documentation and self-service resources
- Community/ecosystem health (forums, integrations, marketplace)

**Feature and Capability:**
- Features used vs. features available
- Feature gaps — what is missing that is needed?
- Feature roadmap alignment with Layaa AI's needs
- API quality and reliability (for integration-dependent tools)
- Scalability — can it grow with demand?

**Security and Compliance:**
- Security certifications (SOC 2, ISO 27001)
- Data handling practices and data residency
- DPDP Act compliance (for India-specific requirements)
- Vulnerability disclosure and patching cadence
- Access controls and audit logging

### Step 3: Analyze Costs
Break down the full cost picture:

**Direct Costs:**
| Cost Item | Monthly | Annual | Per-User/Unit |
|-----------|---------|--------|--------------|
| Subscription/license | [amount] | [amount] | [amount] |
| Overage charges | [amount] | [amount] | — |
| Support tier | [amount] | [amount] | — |
| Add-ons/modules | [amount] | [amount] | — |
| **Total Direct** | **[amount]** | **[amount]** | — |

**Indirect Costs:**
| Cost Item | Estimated Monthly | Estimated Annual |
|-----------|-----------------|-----------------|
| Internal admin/management time | [amount] | [amount] |
| Training and onboarding | [amount] | [amount] |
| Integration maintenance | [amount] | [amount] |
| Workarounds for limitations | [amount] | [amount] |
| **Total Indirect** | **[amount]** | **[amount]** |

**Total Cost of Ownership (TCO):** Direct + Indirect costs

**For Layaa AI:** Calculate how tool costs affect:
- Per-project margins (tool cost as % of implementation fee)
- Retainer margins (tool cost as % of monthly retainer revenue)
- Client-facing vs. internal-only cost allocation

### Step 4: Evaluate Alternatives
Research competing vendors/tools:

1. **Identify alternatives** using WebSearch:
   - Direct competitors in the same category
   - Adjacent tools that could serve the same purpose
   - Open-source alternatives
   - Build-vs-buy options

2. **For each alternative, assess:**

| Criteria | Current Vendor | Alternative 1 | Alternative 2 | Alternative 3 |
|----------|---------------|---------------|---------------|---------------|
| **Pricing** | [cost] | [cost] | [cost] | [cost] |
| **Features (fit %)** | [%] | [%] | [%] | [%] |
| **Reliability** | [rating] | [rating] | [rating] | [rating] |
| **Support** | [rating] | [rating] | [rating] | [rating] |
| **Security** | [rating] | [rating] | [rating] | [rating] |
| **Integration ease** | [rating] | [rating] | [rating] | [rating] |
| **Scalability** | [rating] | [rating] | [rating] | [rating] |
| **Community/ecosystem** | [rating] | [rating] | [rating] | [rating] |

**For Layaa AI — Tech Stack Alignment:**
Check each alternative against the tech stack guide for:
- Compatibility with existing integrations (n8n, APIs, databases)
- Alignment with no-code/low-code approach
- Suitability for Indian SME client delivery
- Learning curve for the team

### Step 5: Assess Switching Costs and Risks
If considering a change:

**Switching Costs:**
| Category | Estimated Cost | Time Required |
|----------|---------------|-------------|
| Data migration | [cost] | [time] |
| Integration rebuild | [cost] | [time] |
| Team retraining | [cost] | [time] |
| Parallel running period | [cost] | [time] |
| Client communication/transition | [cost] | [time] |
| Contract termination (early exit fees) | [cost] | — |
| **Total Switching Cost** | **[cost]** | **[time]** |

**Switching Risks:**
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Data loss during migration | [L/M/H] | [L/M/H] | [mitigation] |
| Service disruption during transition | [L/M/H] | [L/M/H] | [mitigation] |
| Feature gaps discovered post-switch | [L/M/H] | [L/M/H] | [mitigation] |
| Team productivity dip during learning | [L/M/H] | [L/M/H] | [mitigation] |
| Client impact | [L/M/H] | [L/M/H] | [mitigation] |

### Step 6: Calculate TCO Comparison
Compare total cost over 1-year and 3-year horizons:

| Cost Component | Current Vendor (1yr) | Alternative 1 (1yr) | Alternative 2 (1yr) |
|---------------|--------------------|--------------------|---------------------|
| Subscription | [amount] | [amount] | [amount] |
| Indirect costs | [amount] | [amount] | [amount] |
| Switching cost | — | [amount] | [amount] |
| **Year 1 Total** | **[amount]** | **[amount]** | **[amount]** |
| **3-Year Total** | **[amount]** | **[amount]** | **[amount]** |
| **3-Year Savings** | **baseline** | **[+/- amount]** | **[+/- amount]** |

### Step 7: Provide Recommendation
Based on the complete analysis:

**RENEW** — if current vendor is performing well, costs are reasonable, and switching costs outweigh benefits
**NEGOTIATE** — if current vendor is acceptable but costs need reduction or terms need improvement
**SWITCH** — if an alternative is clearly superior and switching costs are justified by long-term savings
**CONSOLIDATE** — if multiple tools can be replaced by one, reducing complexity and cost

Include negotiation leverage points if recommending NEGOTIATE:
- Competitive alternatives identified
- Usage data showing underutilization (downgrade opportunity)
- Multi-year commitment in exchange for discount
- Volume pricing thresholds approaching

## Output Format

```
# Vendor Review Report
**Vendor:** [vendor name]
**Product/Service:** [what is being provided]
**Review Date:** [date]
**Review Type:** [New Selection / Renewal / Performance / Cost Optimization / Consolidation]
**Prepared by:** [Veer — Pricing & Unit Economics Specialist / General]
**Classification:** CONFIDENTIAL

## Executive Summary
- **Current Spend:** [annual amount]
- **Performance Rating:** [Excellent / Good / Acceptable / Below Expectations / Unacceptable]
- **Recommendation:** [RENEW / NEGOTIATE / SWITCH / CONSOLIDATE]
- **Potential Savings:** [amount if applicable]
- **Key Finding:** [most important insight from the review]

## Performance Scorecard
| Dimension | Score (1-5) | Weight | Weighted Score | Notes |
|-----------|------------|--------|---------------|-------|
| Reliability/Uptime | [score] | 20% | [weighted] | [notes] |
| Feature Fit | [score] | 25% | [weighted] | [notes] |
| Support Quality | [score] | 15% | [weighted] | [notes] |
| Security/Compliance | [score] | 15% | [weighted] | [notes] |
| Cost Effectiveness | [score] | 15% | [weighted] | [notes] |
| Scalability | [score] | 10% | [weighted] | [notes] |
| **Overall** | — | **100%** | **[total]** | — |

## Cost Analysis
### Current Costs
| Item | Monthly | Annual |
|------|---------|--------|
| [line item] | [amount] | [amount] |
| **Total Direct** | **[amount]** | **[amount]** |
| **Total Indirect** | **[amount]** | **[amount]** |
| **TCO** | **[amount]** | **[amount]** |

### Margin Impact (Layaa AI Mode)
- Tool cost as % of average implementation fee: [%]
- Tool cost as % of monthly retainer revenue: [%]
- Assessment: [acceptable / needs optimization / unsustainable]

## Alternative Analysis
| Criteria | Current | [Alt 1] | [Alt 2] | [Alt 3] |
|----------|---------|---------|---------|---------|
| Annual Cost | [cost] | [cost] | [cost] | [cost] |
| Feature Fit | [%] | [%] | [%] | [%] |
| Overall Score | [score] | [score] | [score] | [score] |

## TCO Comparison (3-Year)
| Component | Current | [Alt 1] | [Alt 2] |
|-----------|---------|---------|---------|
| 3-Year TCO | [amount] | [amount] | [amount] |
| Switching Cost | — | [amount] | [amount] |
| Net 3-Year Cost | [amount] | [amount] | [amount] |
| Savings vs Current | — | [amount] | [amount] |

## Switching Assessment (if applicable)
- **Total Switching Cost:** [amount]
- **Switching Time:** [weeks]
- **Break-even Point:** [months after switch]
- **Key Risks:** [top risks]

## Recommendation: [RENEW / NEGOTIATE / SWITCH / CONSOLIDATE]

**Rationale:** [2-3 sentences]

### Action Items
1. [specific action] — [owner] — [deadline]
2. [action] — [owner] — [deadline]
3. [action] — [owner] — [deadline]

### Negotiation Points (if NEGOTIATE)
| Priority | Point | Leverage | Target |
|----------|-------|---------|--------|
| MUST | [point] | [leverage] | [target] |
| SHOULD | [point] | [leverage] | [target] |

## Approval
- [ ] Reviewed by: [Kabir — for strategic tools]
- [ ] Approved by: [Founders — for annual spend > threshold]
```

## What Makes This Different from Generic Vendor Review
- Evaluates vendors against Layaa AI's specific tech stack requirements (n8n compatibility, API quality, no-code approach)
- Calculates margin impact of tool costs against Layaa AI's pricing model (implementation fees and retainer tiers)
- Assesses vendor fitness for Indian SME client delivery context
- Considers DPDP Act compliance and India-specific data residency requirements
- Maps switching decisions to Layaa AI's delivery pipeline to minimize client impact
- Routes approval through Layaa AI governance based on spend thresholds
- Factors in tool ecosystem compatibility with existing Layaa AI integrations
