---
name: roadmap-update
description: >
  Create or update product roadmaps with prioritized features, timelines, and dependencies. Balances
  business value, technical effort, and strategic alignment. In Layaa AI mode, aligns with service
  verticals, revenue model, and GTM strategy. Trigger: "roadmap", "roadmap update", "feature
  prioritization", "product roadmap", "quarterly planning". This skill replaces the generic
  product:roadmap-update capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Roadmap Update

Create or update product roadmaps with prioritized features, timelines, dependencies, and strategic rationale.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

**Layaa AI product context:** Layaa AI does not have a traditional SaaS product. "Roadmap" means the evolution of service offerings, pre-built automation modules, AI agent capabilities, methodology improvements, and go-to-market expansion. Roadmap items are about what Layaa AI can deliver, not features in a software product.

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/service-verticals.md — Five service verticals and methodology
- shared-references/revenue-model.md — Pricing tiers, conversion funnel, revenue targets
- shared-references/company-identity.md — Company positioning and vision
- shared-references/icp-and-market.md — ICP segments and market context
- domain-references/operations/tech-stack.md — Current technology capabilities
- domain-references/marketing/gtm-strategy.md — GTM strategy and channel approach
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Review Current Roadmap State
Search the workspace for existing roadmap documents:
1. Use Glob to find roadmap files (`*roadmap*`, `*plan*`, `*priorities*`, `*backlog*`)
2. Use Grep to find references to planned features, upcoming work, or strategic goals
3. If no existing roadmap exists, start from scratch — ask the user for current priorities and strategic goals

Identify:
- What has been completed since the last update
- What is currently in progress
- What has been deprioritized or removed
- What new items need to be added

### Step 2: Gather New Inputs
Collect inputs that should influence the roadmap:
- **Client feedback:** Feature requests, pain points, churn reasons
- **Market changes:** Competitive moves, new technologies, regulatory shifts
- **Strategic priorities:** Founder directives, revenue goals, positioning shifts
- **Team capacity:** Available resources, skill gaps, hiring plans
- **Technical debt:** Infrastructure needs, platform upgrades, maintenance backlog

Ask the user to provide or confirm these inputs if not available in the workspace.

### Step 3: Align with Service Verticals and Revenue Model (Layaa AI Mode)
For Layaa AI, evaluate every roadmap item against:

**Service Vertical Alignment:**
- Which of the 5 verticals does this item strengthen? (Education, Consulting, Automation Dev, Maintenance, Pre-built)
- Does it deepen an existing vertical or expand into a new one?
- Does it create cross-vertical synergy (e.g., a pre-built module that also serves as an education demo)?

**Revenue Model Alignment:**
- Does it support the shift toward recurring revenue (retainer model)?
- Does it enable pre-built modules that reduce implementation time and increase margin?
- Does it increase average deal size or expand into higher-tier packages?
- Does it reduce delivery cost per client?

**GTM Strategy Alignment:**
- Are we building what we can sell to our ICP segments?
- Does it address a known objection or competitive gap?
- Does it create a new entry point or expansion path for existing clients?

### Step 4: Prioritize Using Impact/Effort Matrix
Score each roadmap item on two dimensions:

**Impact (1-5):**
- Revenue potential (direct or enabling)
- Client satisfaction and retention
- Competitive differentiation
- Strategic positioning
- Scalability (can it serve multiple clients/ICPs?)

**Effort (1-5):**
- Development time and complexity
- Required skills and expertise
- Dependencies on other items or external factors
- Risk and uncertainty
- Maintenance burden after launch

**Priority = Impact / Effort** — Items with highest ratio get prioritized.

For Layaa AI: weight items higher if they:
- Create reusable pre-built modules (serve multiple clients)
- Enable the methodology to be delivered faster
- Unlock a new ICP segment
- Convert one-time implementation into recurring retainer

### Step 5: Define Milestones and Timelines
For each prioritized item, define:
- **Milestone description:** What "done" looks like
- **Estimated effort:** In days/weeks, not story points (more meaningful for services)
- **Start date:** When work can begin (considering dependencies)
- **Target completion:** When it should be delivered
- **Owner:** Who is responsible

Group into time horizons:
- **Now (0-4 weeks):** Actively in progress or starting immediately
- **Next (1-3 months):** Planned and scoped, ready to start when current work completes
- **Later (3-6 months):** Directionally agreed but not yet fully scoped
- **Future (6+ months):** Strategic bets, subject to validation and market signals

### Step 6: Identify Dependencies and Risks
For each roadmap item, document:
- **Dependencies:** What must be completed first? What external factors are required?
- **Risks:** What could delay or derail this item?
- **Mitigation:** How to reduce the risk or work around the dependency
- **Decision points:** What decisions need to be made and by when?

Flag critical path items — items that, if delayed, delay other items.

### Step 7: Validate GTM Alignment (Layaa AI Mode)
Final check — for each item in Now and Next:
- Can we articulate who will buy this and why?
- Does it map to a known ICP pain point?
- Can sales tell a story about this that resonates with prospects?
- Does it strengthen or dilute our positioning ("Not a tool vendor, not an enterprise consultancy — the automation team")?

If an item passes the technical/impact filter but fails the GTM check, flag it for strategic discussion with Founders.

### Step 8: Format the Roadmap
Present the roadmap in the chosen view:
- **Now/Next/Later** view for strategic communication
- **Quarterly** view for operational planning
- **Kanban** view for execution tracking
- Include both the visual roadmap and the detailed item descriptions

## Output Format

```
# Product Roadmap — [Period/Quarter]
**Last Updated:** [date]
**Owner:** [name]
**Status:** [Draft / In Review / Approved]

## Strategic Context
**Vision:** [What we are building toward]
**Key Goals This Period:**
1. [Goal 1 — tied to revenue/growth/positioning]
2. [Goal 2 — tied to revenue/growth/positioning]
3. [Goal 3 — tied to revenue/growth/positioning]

## Roadmap Overview

### Now (In Progress / Starting This Month)
| Item | Service Vertical | Impact | Effort | Owner | Target Date | Status |
|------|-----------------|--------|--------|-------|-------------|--------|
| [item] | [vertical] | [1-5] | [1-5] | [owner] | [date] | [status] |
| [item] | [vertical] | [1-5] | [1-5] | [owner] | [date] | [status] |

### Next (1-3 Months)
| Item | Service Vertical | Impact | Effort | Owner | Target Date | Dependency |
|------|-----------------|--------|--------|-------|-------------|------------|
| [item] | [vertical] | [1-5] | [1-5] | [owner] | [date] | [dependency] |

### Later (3-6 Months)
| Item | Service Vertical | Impact | Effort | Strategic Rationale |
|------|-----------------|--------|--------|-------------------|
| [item] | [vertical] | [1-5] | [1-5] | [why this matters] |

### Future (6+ Months / Strategic Bets)
| Item | Service Vertical | Strategic Rationale | Validation Needed |
|------|-----------------|-------------------|-------------------|
| [item] | [vertical] | [why this matters] | [what we need to learn first] |

## Detailed Item Descriptions

### [Item Name]
- **Description:** [What this is and what it delivers]
- **Business Case:** [Why it matters — revenue, retention, positioning]
- **Service Vertical:** [which vertical(s)]
- **ICP Target:** [which ICP segments benefit]
- **Milestone:** [what "done" looks like]
- **Effort Estimate:** [days/weeks]
- **Dependencies:** [what must be done first]
- **Risks:** [what could go wrong]
- **Success Metric:** [how we measure impact]

[Repeat for each item...]

## Dependencies Map
| Item | Depends On | Blocks | Risk if Delayed |
|------|-----------|--------|-----------------|
| [item] | [prerequisite] | [downstream items] | [impact] |

## Revenue Impact Assessment (Layaa AI Mode)
| Item | Revenue Type | Estimated Impact | Timeline to Revenue |
|------|-------------|-----------------|-------------------|
| [item] | [implementation / retainer / both] | [amount or %] | [when revenue starts] |

## Decisions Needed
| Decision | Needed By | Who Decides | Options | Recommendation |
|----------|-----------|-------------|---------|----------------|
| [decision] | [date] | [person] | [options] | [recommendation] |

## Changes from Last Roadmap
| Item | Change | Reason |
|------|--------|--------|
| [item] | [added / removed / reprioritized / delayed] | [why] |
```

## What Makes This Different from Generic Roadmap Planning
- Evaluates roadmap items against Layaa AI's five service verticals for portfolio balance
- Aligns priorities with the dual revenue model (implementation + retainer) to maximize recurring revenue
- Validates each item against ICP segments to ensure we are building what we can sell
- Weights pre-built module development higher for scalability and margin improvement
- Uses the GTM strategy as a filter — items that cannot be positioned are flagged
- Frames effort in days/weeks rather than story points (appropriate for a services business)
- Maps items to the delivery methodology stages for operational coherence
- Includes revenue impact assessment tied to Layaa AI's pricing model
