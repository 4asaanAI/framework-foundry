---
name: layaa-product
description: >
  Layaa AI Product Management skill group. Use for: writing feature specs/PRDs,
  synthesizing user research, updating roadmaps, sprint planning, stakeholder
  updates, metrics review, and competitive briefs for product strategy.
  Works for Layaa AI and general product management tasks.
user-invocable: true
---

# Layaa Product — Skill Group

## Available Sub-Skills

| Sub-Skill | When to Use |
|-----------|------------|
| **write-spec** | Write a feature spec or PRD from a problem statement or feature idea |
| **synthesize-research** | Synthesize user research from interviews, surveys, and feedback |
| **roadmap-update** | Update, create, or reprioritize the product roadmap |
| **sprint-planning** | Plan a sprint with scope, capacity, goals, and ownership |
| **stakeholder-update** | Generate a stakeholder update tailored to audience and cadence |
| **metrics-review** | Review product/project metrics with trend analysis and insights |
| **pm-competitive-brief** | Competitive analysis for product features or strategy |

## How to Use
- "Write a spec for a client-facing reporting dashboard" → **write-spec**
- "Synthesize feedback from our last 5 discovery calls" → **synthesize-research**
- "Plan our next 2-week sprint for the CA AI Agent project" → **sprint-planning**
- "Send a project update to the client" → **stakeholder-update**

---

## Context Detection
- **Layaa AI mode:** Mention Layaa AI, our products/projects, client engagements → apply Layaa AI product context
- **General mode:** Standard product management assistant

---

## Layaa AI Product Context (Quick Reference)

**Current products/projects:** Custom AI automation workflows for Indian SMEs | CA AI Agent (chartered accountant-focused platform)
**Delivery cycle:** 4-12 weeks development | 2-4 weeks assessment | 1-2 weeks pre-built
**Key stakeholders:** Abhimanyu Singh (Strategy), Shubham Sharma (Technology), Rohit (QA/Discovery), Ujjwal (Architecture), clients
**Tech:** n8n, Relevance AI, Bolt AI | **Methodology:** Discovery → Assessment → Development → Validation → Enablement

---

## Sub-Skill Execution

### write-spec
1. Take: problem statement or feature idea
2. Identify: user need, business goal, success metrics
3. Structure spec:
   - **Overview:** Problem, context, goals
   - **User Stories:** As a [user], I want [action] so that [benefit]
   - **Acceptance Criteria:** Specific, testable conditions for completion
   - **Out of Scope:** What this spec explicitly does NOT include
   - **Technical Notes:** Constraints, dependencies, integration requirements
   - **Open Questions:** Decisions still needed
   - **Success Metrics:** How we'll measure if this worked
4. Keep concise — one page for small features, two pages max for complex

### synthesize-research
1. Take: raw inputs (interview notes, survey responses, feedback, discovery call notes)
2. Identify key themes (aim for 3-5 major themes)
3. For each theme: supporting evidence, frequency, severity, affected user segment
4. Prioritise insights by: frequency × impact on decision-making
5. Recommended actions: what should the team do differently based on this research?
6. For Layaa AI: frame in terms of ICP segments and delivery methodology

### roadmap-update
1. Take: current roadmap (or describe starting point) + items to add/change
2. Score each item: impact (High/Medium/Low) × effort (High/Medium/Low) → Priority quadrant
3. Apply strategic alignment: does this support our ICP, methodology, or revenue goals?
4. Check dependencies: what must be completed before this?
5. Output: updated roadmap with priorities, rough timelines, and reasoning for changes

### sprint-planning
1. Gather: team capacity (members × hours available this sprint), sprint length, candidate backlog items
2. Select sprint goal (one clear objective)
3. Select items: by priority and capacity fit
4. Assign ownership for each item
5. Flag: risks to sprint completion, dependencies on external parties
6. Define: definition of done for each item

### stakeholder-update
1. Identify: audience (client / exec / technical team / investor), update cadence (weekly/monthly/milestone)
2. Format based on audience:
   - Client: progress, next steps, anything needed from them
   - Exec: metrics, risks, decisions needed
   - Technical: what's built, blockers, next sprint plan
3. Structure: Summary (1 para) → Progress → Upcoming → Risks/Issues → Requests/Decisions Needed
4. Keep appropriate length: client = brief and visual | exec = 1 page max | technical = detailed

### metrics-review
1. Take: metrics data for the period
2. Identify: improving trends, declining trends, stagnant metrics
3. Root cause analysis for notable changes (>10% variance)
4. Compare to targets or benchmarks
5. Recommendations: actions for declining metrics, opportunities to double down on improving ones

### pm-competitive-brief
1. Define: feature area or product strategy to analyse
2. Research specified competitors: what they offer, how they position it, strengths, weaknesses
3. Build comparison matrix: Layaa AI vs. competitors across key dimensions
4. Identify: gaps in competitor offering Layaa AI can claim | areas where we're behind
5. Recommend: product response (build / position differently / deprioritize)
