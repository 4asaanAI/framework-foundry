---
name: capacity-plan
description: >
  Plan resource capacity for teams, projects, or systems. Forecasts demand, identifies gaps,
  and recommends allocation strategies. In Layaa AI mode, uses pipeline tracker for project
  forecast and revenue model for growth estimates.
  Trigger: "capacity plan", "resource planning", "capacity forecast", "team allocation", "resource gap", "workload planning", "staffing plan"
  This skill replaces the generic operations:capacity-plan capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Capacity Planning

Plan resource capacity for teams, projects, or systems. Forecasts demand based on pipeline and growth projections, identifies capacity gaps, and recommends allocation strategies with timelines.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, team planning, project allocation, delivery capacity, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/delivery-methodology.md — Delivery stages and effort estimates
- shared-references/revenue-model.md — Pricing tiers, conversion rates, deal structure
- domain-references/revenue-ops/pipeline-tracker.md — Pipeline data and incoming project forecast
- shared-references/service-verticals.md — Service offerings and delivery requirements
- shared-references/icp-and-market.md — ICP profiles and typical engagement complexity
Only load references relevant to the capacity scope.

## Execution Steps

### Step 1: Define Capacity Scope
Collect or ask for:
- **What to plan for:**
  - Team capacity (human resources — delivery, sales, ops)
  - Project capacity (how many concurrent engagements can be handled)
  - System capacity (infrastructure, tool limits, API quotas)
  - GPT workforce capacity (how many concurrent tasks per GPT agent)
- **Planning horizon:** Short-term (1-3 months), medium-term (3-6 months), long-term (6-12 months)
- **Granularity:** Weekly, monthly, or quarterly planning intervals
- **Constraints:** Budget limits, hiring timelines, tool licensing limits

### Step 2: Assess Current Capacity and Utilization
Map existing resources:

**Team Capacity:**
| Resource | Role | Available Hours/Week | Current Allocation | Utilization % | Skills |
|----------|------|--------------------|--------------------|--------------|--------|
| [name] | [role] | [hours] | [project allocation] | [%] | [key skills] |

**For Layaa AI:**
- Founders (Abhimanyu + Shubham): Split between strategy, sales, and delivery oversight
- GPT Workforce: Available 24/7 but limited by API quotas and task complexity
- External contractors: If any, map their availability and specializations

**Utilization benchmarks:**
| Utilization Level | Status | Action |
|------------------|--------|--------|
| <60% | Under-utilized | Seek additional projects or redeploy |
| 60-80% | Healthy | Optimal range — room for ad-hoc tasks |
| 80-90% | High | Monitor closely — limited buffer |
| >90% | Over-utilized | Risk of burnout/quality issues — add capacity |

**Project Capacity:**
| Active Project | Client | Stage | Team Allocated | Hours/Week | End Date |
|---------------|--------|-------|---------------|------------|----------|
| [project] | [client] | [stage] | [team] | [hours] | [date] |

### Step 3: Forecast Demand
Project future capacity needs:

**Pipeline-based Demand (Layaa AI Mode):**
1. Pull pipeline data from tracker
2. Apply conversion rates to estimate incoming projects:
   - MQL → SQL: 25% conversion
   - SQL → Proposal: 60% conversion
   - Proposal → Won: 35% conversion
3. Estimate effort per project by type:
   - **Education/Workshop:** 20-40 hours (1-2 weeks, light delivery)
   - **Consulting/Assessment:** 40-80 hours (2-4 weeks, medium delivery)
   - **Automation Development:** 80-200 hours (4-10 weeks, heavy delivery)
   - **Maintenance/Support:** 10-20 hours/month (ongoing)
   - **Pre-built Automation:** 20-40 hours (1-2 weeks, template-based)

**Growth-based Demand:**
- Historical growth rate (projects per quarter trend)
- Revenue targets and implied project volume
- Seasonal patterns (Q4 budget flush, Q1 new year planning)
- Market expansion plans (new ICP segments, geography)

**For Layaa AI — Demand Forecast Table:**
| Source | Pipeline Value | Win Probability | Expected Projects | Estimated Hours | Timeline |
|--------|-------------|----------------|-------------------|----------------|----------|
| Current proposals | [value] | [%] | [count] | [hours] | [dates] |
| SQLs in progress | [value] | [%] | [count] | [hours] | [dates] |
| MQLs being qualified | [value] | [%] | [count] | [hours] | [dates] |
| **Weighted Total** | **[total]** | — | **[count]** | **[hours]** | — |

### Step 4: Identify Gaps
Compare current capacity to forecasted demand:

**Gap Analysis:**
| Period | Available Hours | Forecasted Demand | Gap (+/-) | Status |
|--------|----------------|------------------|-----------|--------|
| [month 1] | [hours] | [hours] | [gap] | [over/under/balanced] |
| [month 2] | [hours] | [hours] | [gap] | [over/under/balanced] |
| [month 3] | [hours] | [hours] | [gap] | [over/under/balanced] |

**Skill Gap Analysis:**
| Skill Needed | Current Capacity | Forecasted Need | Gap | Critical? |
|-------------|-----------------|-----------------|-----|-----------|
| [skill] | [hours/people] | [hours/people] | [gap] | [yes/no] |

**For Layaa AI — Common Skill Gaps:**
- n8n workflow development (primary delivery skill)
- AI/ML integration expertise
- Frontend development (client-facing dashboards)
- Industry-specific knowledge (per ICP: fintech, logistics, etc.)
- Client communication and project management

### Step 5: Recommend Adjustments
Based on the gap analysis, recommend:

**If Under-Capacity (demand > supply):**

| Option | Timeline | Cost | Pros | Cons |
|--------|----------|------|------|------|
| **Hire full-time** | 4-8 weeks | High (salary + overhead) | Long-term capacity, culture fit | Slow, fixed cost |
| **Hire contractors** | 1-2 weeks | Medium (hourly rate) | Fast, flexible | Less control, knowledge loss |
| **Upskill existing team** | 2-4 weeks | Low (training cost) | Retains talent, multi-skilled | Temporary capacity reduction |
| **Automate internal processes** | 2-6 weeks | Medium (implementation) | Permanent capacity gain | Upfront effort |
| **Defer lower-priority projects** | Immediate | None | Quick relief | Revenue impact |
| **Negotiate timelines** | 1 week | None | Spreads demand | Client relationship risk |

**If Over-Capacity (supply > demand):**

| Option | Timeline | Impact |
|--------|----------|--------|
| **Accelerate pipeline** | Ongoing | Fill capacity with new projects |
| **Internal improvement projects** | Immediate | Build tools, templates, documentation |
| **Training and skill development** | 2-4 weeks | Prepare for future demand |
| **Content creation and marketing** | Ongoing | Build thought leadership and lead generation |

### Step 6: Create Allocation Plan
Build a time-phased resource allocation:

1. **Assign resources to confirmed projects** (Tier 1 — committed)
2. **Reserve capacity for high-probability pipeline** (Tier 2 — 60%+ probability)
3. **Hold buffer for ad-hoc requests** (Tier 3 — 10-15% of total capacity)
4. **Plan for internal/improvement work** (Tier 4 — remaining capacity)

**For Layaa AI:** Ensure founder bandwidth is protected for:
- Strategic decisions and client relationships
- Hiring and team development
- Sales conversations for high-value prospects
- Product/service evolution planning

## Output Format

```
# Capacity Plan
**Scope:** [team / project / system]
**Planning Horizon:** [period]
**Plan Date:** [date]
**Prepared by:** [Rishi — Revenue Operations Strategist / General]
**Classification:** CONFIDENTIAL

## Executive Summary
- **Current Utilization:** [overall percentage]
- **Forecasted Demand:** [hours/projects for planning period]
- **Capacity Gap:** [surplus of X hours / deficit of X hours]
- **Key Recommendation:** [primary action needed]
- **Investment Required:** [if any]

## Current Capacity
### Team Allocation
| Resource | Role | Available Hrs/Wk | Allocated Hrs/Wk | Utilization | Key Skills |
|----------|------|------------------|------------------|------------|-----------|
| [name] | [role] | [hours] | [hours] | [%] | [skills] |
| **TOTAL** | — | **[hours]** | **[hours]** | **[%]** | — |

### Active Projects
| Project | Client | Stage | Hours/Week | Team | End Date |
|---------|--------|-------|------------|------|----------|
| [project] | [client] | [stage] | [hours] | [team] | [date] |

## Demand Forecast
### Pipeline-based Demand
| Source | Expected Projects | Hours Needed | Timeline | Confidence |
|--------|------------------|-------------|----------|-----------|
| [source] | [count] | [hours] | [when] | [high/med/low] |
| **TOTAL** | **[count]** | **[hours]** | — | — |

### Growth Projections
- **Q+1 forecast:** [projects / hours]
- **Q+2 forecast:** [projects / hours]
- **Key assumptions:** [list assumptions]

## Gap Analysis
### Capacity vs. Demand
| Period | Available | Demand | Gap | Status | Action Needed |
|--------|-----------|--------|-----|--------|--------------|
| [month] | [hours] | [hours] | [+/-] | [status] | [action] |

### Skill Gaps
| Skill | Have | Need | Gap | Priority | Recommendation |
|-------|------|------|-----|----------|---------------|
| [skill] | [capacity] | [need] | [gap] | [H/M/L] | [action] |

## Recommendations
### Immediate (This Month)
1. [specific recommendation with owner and timeline]
2. [recommendation]

### Short-term (Next Quarter)
1. [recommendation]
2. [recommendation]

### Long-term (6-12 Months)
1. [recommendation]
2. [recommendation]

## Resource Allocation Plan
### [Month 1]
| Resource | Project 1 | Project 2 | Pipeline Reserve | Internal | Buffer | Total |
|----------|----------|----------|-----------------|---------|--------|-------|
| [name] | [hrs] | [hrs] | [hrs] | [hrs] | [hrs] | [hrs] |

### [Month 2]
[Same format]

### [Month 3]
[Same format]

## Risks and Assumptions
| Risk/Assumption | Impact | Likelihood | Mitigation |
|----------------|--------|-----------|------------|
| [risk] | [impact] | [L/M/H] | [mitigation] |

## Next Review
- **Scheduled:** [date — recommend monthly for active planning]
- **Trigger for earlier review:** [new large deal, team change, market shift]
```

## What Makes This Different from Generic Capacity Planning
- Uses Layaa AI's pipeline conversion rates (25% / 60% / 35%) for demand forecasting
- Maps effort estimates to Layaa AI's five service verticals with typical hour ranges
- Considers founder bandwidth as a critical capacity constraint for a startup
- Integrates GPT workforce capacity alongside human resources
- Projects demand by ICP segment for targeted hiring and skill development
- Aligns with Layaa AI's revenue model (implementation + retainer) for revenue-capacity correlation
- Factors in typical Indian SME engagement cycles and seasonal patterns
