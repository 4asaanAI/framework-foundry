---
name: process-optimization
description: >
  Analyze existing processes for inefficiencies, bottlenecks, and automation opportunities.
  Recommends improvements with expected impact and implementation roadmap.
  In Layaa AI mode, evaluates automation opportunities using the tech stack and feasibility
  assessment framework.
  Trigger: "process optimization", "optimize process", "improve workflow", "bottleneck analysis", "process improvement", "efficiency", "automation opportunity"
  This skill replaces the generic operations:process-optimization capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Process Optimization

Analyze existing processes for inefficiencies, bottlenecks, and automation opportunities. Produces a current vs. future state comparison with quantified impact and a phased implementation roadmap.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, n8n, Make, Zapier, Relevance AI, workflow automation, client delivery, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/delivery-methodology.md — 5-stage delivery methodology
- domain-references/operations/automation-architecture.md — Workflow design patterns, architecture standards
- domain-references/operations/tech-stack.md — Tool selection guide, platform capabilities
- shared-references/service-verticals.md — Service offerings and technology approach
Only load references relevant to the process being optimized.

## Execution Steps

### Step 1: Map Current Process
Document the current state:

1. **Process identification:**
   - Process name and purpose
   - Start trigger and end state
   - Frequency of execution (daily, weekly, per-event)
   - Volume (how many times per period)

2. **Step-by-step mapping:**
   For each step, capture:
   - Step description
   - Actor (who/what performs it)
   - Time taken (average and range)
   - Tools used
   - Inputs and outputs
   - Manual vs. automated
   - Error rate (if known)

3. **Pain points collection:**
   - Where do delays occur?
   - Which steps have the highest error rates?
   - What do people complain about?
   - Where is rework most common?
   - What takes the most time?

4. **Cost estimation:**
   - Personnel time x hourly rate per step
   - Tool and infrastructure costs
   - Error/rework costs
   - Total cost per execution and per period

### Step 2: Identify Bottlenecks and Waste
Analyze the current process for:

**Bottlenecks (throughput constraints):**
- Steps where work queues up or waits
- Resource constraints (single person, limited tool capacity)
- Approval bottlenecks (waiting for sign-off)
- Information bottlenecks (waiting for data or input)
- Sequential steps that could be parallelized

**Waste Categories (Lean framework):**
| Waste Type | Definition | Examples |
|-----------|-----------|---------|
| **Waiting** | Idle time between steps | Approval queues, data requests |
| **Overprocessing** | Doing more than required | Excessive reviews, gold-plating |
| **Rework** | Fixing errors from earlier steps | Data re-entry, correction loops |
| **Motion** | Unnecessary movement between systems | Copy-paste between tools, manual data transfer |
| **Inventory** | Work in progress piling up | Backlog buildup, unprocessed items |
| **Defects** | Errors that reach downstream | Wrong data, missed steps |
| **Overproduction** | Creating more than needed | Reports no one reads, unused outputs |
| **Underutilized talent** | People doing work below their skill | Manual data entry by specialists |

### Step 3: Evaluate Automation Opportunities (Layaa AI Mode)
For each manual or semi-manual step, assess automation potential:

**Automation Readiness Checklist:**
| Criteria | Score (1-5) | Notes |
|----------|------------|-------|
| **Rule-based:** Is the step governed by clear rules/logic? | [score] | [notes] |
| **Repetitive:** Is it performed frequently and consistently? | [score] | [notes] |
| **Data-driven:** Does it process structured data? | [score] | [notes] |
| **API available:** Are the systems involved API-accessible? | [score] | [notes] |
| **Error-prone:** Does manual execution frequently cause errors? | [score] | [notes] |
| **Time-intensive:** Does it consume significant person-hours? | [score] | [notes] |
| **Stable:** Is the process stable (not changing frequently)? | [score] | [notes] |

**Automation score = Average of all criteria** (1-5 scale)
- 4.0-5.0: **Strong candidate** — Automate immediately
- 3.0-3.9: **Good candidate** — Automate in next phase
- 2.0-2.9: **Partial candidate** — Semi-automate or assist
- 1.0-1.9: **Poor candidate** — Keep manual, optimize process instead

**For Layaa AI — Tool Selection:**
Using the tech stack guide, recommend the appropriate tool:
- **n8n:** Complex multi-step workflows, API integrations, data transformations
- **Make/Zapier:** Simple trigger-action automations, SaaS integrations
- **Relevance AI:** AI-powered classification, extraction, content generation
- **Custom code:** When no-code cannot handle the complexity
- **Hybrid:** Combination of tools for different parts of the workflow

### Step 4: Quantify Improvement Potential
For each proposed improvement, calculate:

**Time Savings:**
- Current time per execution x frequency = current total time
- Projected time per execution x frequency = projected total time
- Savings = current - projected
- Percentage improvement

**Error Reduction:**
- Current error rate x volume = current errors
- Projected error rate x volume = projected errors
- Improvement percentage
- Cost of errors avoided

**Cost Savings:**
- Direct labor savings (hours saved x hourly cost)
- Error/rework cost reduction
- Tool cost changes (new tools minus replaced tools)
- Net savings per period

**Capacity Freed:**
- Hours returned to team per period
- FTE equivalent freed
- What this capacity can be redirected to

### Step 5: Design Optimized Process
Create the future-state process:

1. **Eliminate:** Remove steps that add no value
2. **Automate:** Apply automation to qualifying steps
3. **Simplify:** Reduce complexity in remaining manual steps
4. **Parallelize:** Run independent steps concurrently
5. **Standardize:** Create templates and checklists for consistency
6. **Monitor:** Add measurement points for ongoing optimization

For each modified step, document:
- What changed and why
- New tool/automation involved
- New time estimate
- New error expectation
- Dependencies on other changes

### Step 6: Create Implementation Roadmap
Phase the implementation for manageable execution:

**Phase 1 — Quick Wins (Week 1-2):**
- Changes requiring no new tools or infrastructure
- Process eliminations and simplifications
- Template and checklist creation
- Expected to deliver 20-30% of total improvement

**Phase 2 — Core Automation (Week 3-6):**
- Primary automation implementations
- Tool setup and configuration
- Integration development
- Testing and validation
- Expected to deliver 50-60% of total improvement

**Phase 3 — Advanced Optimization (Week 7-10):**
- Complex automations and AI-powered steps
- Cross-system integrations
- Performance tuning
- Expected to deliver remaining 10-20% improvement

**Phase 4 — Monitoring and Iteration (Ongoing):**
- Performance monitoring against targets
- Feedback collection and adjustment
- Continuous improvement cycle

**For Layaa AI:** Apply the feasibility assessment framework from Rohit (QA & Validation Specialist) before committing to automation scope. Validate through the standard delivery methodology stages.

## Output Format

```
# Process Optimization Report
**Process:** [process name]
**Assessment Date:** [date]
**Prepared by:** [Ujjwal — Automation Architect / General]
**Scope:** [what was analyzed]
**Classification:** CONFIDENTIAL

## Executive Summary
- **Current State:** [brief description of current process]
- **Key Problems:** [top 3 issues identified]
- **Proposed Solution:** [high-level description of optimized process]
- **Expected Impact:**
  - Time savings: [hours/period] ([percentage]% reduction)
  - Error reduction: [percentage]% improvement
  - Cost savings: [amount/period]
  - Capacity freed: [hours/period] ([FTE equivalent])
- **Implementation Timeline:** [total weeks]
- **Investment Required:** [total cost of implementation]
- **ROI:** [projected ROI and payback period]

## Current State Analysis

### Process Map
| Step | Description | Actor | Time | Manual/Auto | Error Rate | Pain Point |
|------|-----------|-------|------|-------------|------------|------------|
| 1 | [step] | [who] | [time] | [M/A] | [rate] | [issue] |
| 2 | [step] | [who] | [time] | [M/A] | [rate] | [issue] |

### Current Metrics
- **Cycle time:** [total time end-to-end]
- **Cost per execution:** [cost]
- **Error rate:** [percentage]
- **Volume:** [executions per period]
- **Total cost per period:** [total]

### Bottlenecks Identified
| # | Bottleneck | Type | Impact | Root Cause |
|---|-----------|------|--------|------------|
| 1 | [bottleneck] | [waiting/capacity/info] | [impact] | [cause] |

### Waste Identified
| # | Waste Type | Location | Impact (hours/period) | Root Cause |
|---|-----------|----------|-------------------|-----------|
| 1 | [type] | [where] | [hours] | [cause] |

## Automation Assessment (Layaa AI Mode)
| Step | Automation Score | Recommended Tool | Approach | Effort |
|------|-----------------|-----------------|----------|--------|
| [step] | [score/5] | [tool] | [approach] | [days] |

## Future State Design

### Optimized Process Map
| Step | Description | Actor | Time | Manual/Auto | Expected Error Rate | Change |
|------|-----------|-------|------|-------------|-------------------|--------|
| 1 | [step] | [who/what] | [time] | [M/A] | [rate] | [what changed] |

### Impact Quantification
| Metric | Current | Projected | Improvement | Annual Value |
|--------|---------|-----------|-------------|-------------|
| Cycle time | [current] | [projected] | [% improvement] | [hours saved] |
| Cost per execution | [current] | [projected] | [savings] | [annual savings] |
| Error rate | [current] | [projected] | [% improvement] | [errors avoided] |
| Throughput | [current] | [projected] | [% increase] | [additional capacity] |

## Implementation Roadmap

### Phase 1: Quick Wins (Week 1-2)
| # | Change | Owner | Effort | Expected Impact |
|---|--------|-------|--------|----------------|
| 1 | [change] | [owner] | [days] | [impact] |

### Phase 2: Core Automation (Week 3-6)
| # | Change | Owner | Effort | Expected Impact | Dependencies |
|---|--------|-------|--------|----------------|-------------|
| 1 | [change] | [owner] | [days] | [impact] | [dependencies] |

### Phase 3: Advanced Optimization (Week 7-10)
| # | Change | Owner | Effort | Expected Impact | Dependencies |
|---|--------|-------|--------|----------------|-------------|

### Phase 4: Monitoring (Ongoing)
- [ ] [monitoring action and frequency]
- [ ] [feedback mechanism]
- [ ] [review schedule]

## Investment and ROI
- **Implementation cost:** [total]
  - Phase 1: [cost]
  - Phase 2: [cost]
  - Phase 3: [cost]
- **Ongoing cost:** [monthly/annual]
- **Annual savings:** [amount]
- **Payback period:** [months]
- **3-year ROI:** [percentage]

## Risks and Dependencies
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [risk] | [L/M/H] | [L/M/H] | [mitigation] |

## Recommendations
1. **Immediate:** [top priority actions]
2. **Short-term:** [Phase 1-2 priorities]
3. **Long-term:** [Phase 3+ considerations]
```

## What Makes This Different from Generic Process Optimization
- Evaluates automation opportunities against Layaa AI's tech stack (n8n, Make, Relevance AI) with specific tool selection guidance
- Applies Rohit's feasibility assessment framework before committing to automation scope
- Uses Ujjwal's automation architecture patterns for workflow design
- Quantifies improvements in terms relevant to Layaa AI's pricing model (implementation hours, retainer impact)
- Phases implementation to align with Layaa AI's 5-stage delivery methodology
- Considers Indian SME context (technology maturity, budget constraints, change readiness)
- Maps optimization owners to Layaa AI's GPT workforce and governance hierarchy
