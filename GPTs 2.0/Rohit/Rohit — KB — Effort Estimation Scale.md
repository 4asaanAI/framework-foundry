# Rohit — KB — Effort Estimation Scale

> Effort estimation framework used during Phase 4 (Feasibility Analysis) to score complexity, guide resource planning, and set realistic expectations for delivery timelines.

---

## The 1-10 Effort Scale

Use this scale when estimating effort for each feasible opportunity identified during discovery. Be honest — underestimation is worse than overestimation. This scale is referenced in Phase 4 of the Discovery Methodology and in the Handover Document's Effort Summary section.

### Scale Definition

| Effort Score | Label | Description | Typical Timeline | Builder Skill Required |
|-------------|-------|-------------|-----------------|----------------------|
| 1 | Trivial | Single-step automation, no integration complexity | Hours | Any builder |
| 2 | Very Simple | 2-3 step workflow, single integration, standard patterns | 1-2 days | Any builder |
| 3 | Simple | Multi-step workflow, 1-2 integrations, basic data transformation | 2-4 days | Any builder |
| 4 | Moderate-Low | Multiple integrations, some branching logic, basic error handling | 1 week | Competent builder |
| 5 | Moderate | Multiple integrations, conditional logic, data transformation, proper error handling | 1-2 weeks | Competent builder |
| 6 | Moderate-High | Complex integrations, AI components, multiple data sources, retry logic | 2-3 weeks | Experienced builder |
| 7 | Complex | Multi-workflow system, AI + automation hybrid, custom data pipelines | 3-4 weeks | Experienced builder |
| 8 | Very Complex | Full system design, multiple AI components, complex state management, cross-system orchestration | 4-6 weeks | Senior builder or team |
| 9 | Highly Complex | Enterprise-grade system, custom backend required for some components, extensive testing needed | 6-8 weeks | Senior builder + team |
| 10 | Maximum | Full custom development, novel architecture, significant R&D component | 8+ weeks | Full team + Shubham oversight |

---

## Estimation Guidelines

### How to Apply the Scale

1. **Score each opportunity independently** — do not average or group
2. **Consider the full scope** — trigger, processing, error handling, testing, deployment
3. **Include integration complexity** — how many external systems? How reliable are their APIs?
4. **Factor in data quality** — clean data reduces effort; messy data increases it significantly
5. **Account for AI uncertainty** — AI components add 1-2 points of effort for prompt engineering and testing
6. **Consider client readiness** — if client systems need setup or cleanup first, add that to the estimate

### Common Estimation Traps

| Trap | Reality | Adjustment |
|------|---------|------------|
| "It's just an API call" | Authentication, error handling, rate limits, data mapping add up | +1-2 points |
| "We've done this before" | Similar is not identical; client-specific nuances always exist | Verify, don't assume |
| "The client said data is clean" | Always verify independently; "clean" is subjective | +1 point until verified |
| "AI will handle the edge cases" | AI adds variability; edge cases need explicit handling | +1-2 points for AI components |
| "We can do it in parallel" | Dependencies and coordination overhead often emerge | Add 20% buffer for multi-workflow projects |

### Effort-to-Pricing Signal

The effort score feeds into Veer's pricing model. Rohit does NOT set prices, but the effort score provides critical input:

| Effort Range | Pricing Signal | Notes |
|-------------|---------------|-------|
| 1-3 | Quick win / included in package | Low standalone value, high bundling value |
| 4-6 | Standard implementation | Core of most client engagements |
| 7-8 | Premium implementation | Requires explicit scope agreement |
| 9-10 | Enterprise / custom engagement | Requires Founder-level approval on scope and pricing |

---

## Aggregating Effort for Multi-Opportunity Engagements

When a discovery surfaces multiple opportunities, aggregate effort in the Handover Document:

```
| Component | Effort (1-10) | Notes |
|-----------|--------------|-------|
| Opportunity 1: [Name] | [Score] | [Key complexity driver] |
| Opportunity 2: [Name] | [Score] | [Key complexity driver] |
| Opportunity 3: [Name] | [Score] | [Key complexity driver] |
| Total | [Sum] | [Context: sequential or parallel delivery?] |
```

**Important:** Total effort is not a simple sum when opportunities can run in parallel. Note whether components are sequential (effort adds up) or parallel (effort overlaps but coordination overhead applies).

---

## Confidence Modifiers

Add a confidence modifier to each estimate to communicate uncertainty:

| Modifier | Meaning | When to Use |
|----------|---------|-------------|
| High confidence | Estimate accurate within +/- 20% | Well-understood scope, familiar tools, clean data |
| Medium confidence | Estimate accurate within +/- 50% | Some unknowns, unfamiliar integrations, data quality uncertain |
| Low confidence | Estimate could vary by 2x+ | Significant unknowns, novel requirements, client data inaccessible |

Always flag low-confidence estimates in the handover. They represent risk that Ujjawal and the delivery team need to plan around.

---

*This document is part of Rohit's operational knowledge base. Update as estimation patterns mature and historical data improves calibration.*
