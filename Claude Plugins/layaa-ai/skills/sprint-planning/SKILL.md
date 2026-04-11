---
name: sprint-planning
description: >
  Plan sprints or work cycles with prioritized tasks, capacity allocation, and clear goals. Supports
  agile and iterative development workflows. In Layaa AI mode, aligns sprint goals with the delivery
  methodology stages and uses the 7-stage workflow pattern for estimation. Trigger: "sprint planning",
  "sprint plan", "work cycle", "iteration planning", "weekly plan", "task prioritization".
  This skill replaces the generic product:sprint-planning capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Sprint Planning

Plan sprints or work cycles with prioritized tasks, capacity allocation, and clear goals for agile and iterative development workflows.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

**Layaa AI product context:** Layaa AI does not have a traditional SaaS product. Sprints are about client delivery work, internal tooling, pre-built module development, and operational improvements. Sprint planning must account for multi-client delivery, not a single product backlog.

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics
- shared-references/service-verticals.md — Services and methodology
- domain-references/operations/delivery-methodology.md — Discovery → Assessment → Development → Validation → Enablement stages
- domain-references/operations/automation-architecture.md — 7-stage workflow pattern for estimation
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Review Backlog and Priorities
Search the workspace for backlog items and priorities:
1. Use Glob to find task lists, backlogs, or project files (`*backlog*`, `*tasks*`, `*todo*`, `*sprint*`, `*project*`)
2. Use Grep to find open action items, pending work, or follow-ups
3. Check for any roadmap documents that define current priorities

If no backlog exists, ask the user for:
- List of work items to be completed
- Current project status for each active client engagement
- Internal improvement tasks or technical debt items
- Any deadlines or commitments for the sprint period

### Step 2: Align Sprint Goals with Delivery Stage (Layaa AI Mode)
For Layaa AI, map each work item to the delivery methodology stage:

**Discovery Stage Tasks:**
- Client interviews, process mapping sessions, pain point documentation
- Estimation: Typically 1-2 days per client process area
- Sprint goal example: "Complete discovery for [Client] covering 3 core processes"

**Assessment Stage Tasks:**
- Workflow assessment reports, AI adoption roadmaps, feasibility analysis
- Estimation: 2-5 days depending on complexity
- Sprint goal example: "Deliver assessment report with 5 automation opportunities ranked by ROI"

**Development Stage Tasks:**
- Workflow builds, API integrations, automation configuration
- Estimation: Use 7-stage workflow pattern for sizing (see Step 4)
- Sprint goal example: "Build and test lead processing automation for [Client]"

**Validation Stage Tasks:**
- Testing, QA, user acceptance testing, performance validation
- Estimation: 20-30% of development effort
- Sprint goal example: "Complete UAT for [Client] with zero critical defects"

**Enablement Stage Tasks:**
- Training sessions, documentation, handover, go-live support
- Estimation: 1-3 days per engagement
- Sprint goal example: "Conduct 2 training sessions and deliver operations guide for [Client]"

### Step 3: Assess Team Capacity
Calculate available capacity for the sprint:
- **Sprint duration:** [1 week / 2 weeks / custom]
- **Team members:** List each person and their available hours
- **Deductions:** Meetings, admin, holidays, on-call, support obligations
- **Buffer:** Reserve 15-20% for unplanned work and interruptions
- **Net capacity:** Total available hours for planned work

For Layaa AI: account for multi-client context switching — each client engagement has overhead for context loading, communication, and coordination. Deduct 10-15% additional capacity for context switching when working across 3+ clients simultaneously.

### Step 4: Select and Size Items
For each candidate item, estimate effort:

**General sizing:**
- Small (S): < 4 hours
- Medium (M): 4-16 hours (0.5-2 days)
- Large (L): 16-40 hours (2-5 days)
- Extra Large (XL): > 40 hours — should be broken down further

**7-Stage Workflow Pattern Estimation (Layaa AI Mode):**
For automation development tasks, estimate each stage:
1. **Trigger setup:** [0.5-2 hours] — Webhook, schedule, or event configuration
2. **Input Validation:** [1-4 hours] — Schema validation, error handling
3. **Data Enrichment:** [2-8 hours] — API calls, lookups, transformations
4. **Processing:** [4-16 hours] — Core logic, business rules, AI model integration
5. **Output Formatting:** [1-4 hours] — Templates, formatting, document generation
6. **Delivery:** [1-4 hours] — Notifications, API calls, CRM updates
7. **Logging:** [1-2 hours] — Audit trail, monitoring, error reporting

Total workflow estimate = Sum of all stages + 20% integration testing overhead.

### Step 5: Define Sprint Goal and Success Criteria
Write a clear sprint goal:
- **Format:** "By the end of this sprint, we will [measurable outcome] for [who]"
- Limit to 1-3 goals — more than 3 means the sprint lacks focus
- Each goal should be independently valuable (if one goal is missed, the others still deliver value)

Define success criteria:
- What must be true for the sprint to be considered successful?
- What is the minimum viable outcome vs. the stretch goal?
- How will completion be verified?

### Step 6: Identify Dependencies and Blockers
For each selected item:
- **Internal dependencies:** Does this need another task completed first?
- **External dependencies:** Client approvals, third-party APIs, data access
- **Blockers:** Known issues that could prevent progress
- **Mitigation:** How to unblock or work around dependencies

Flag any item that has an unresolved external dependency — it may need to be swapped for a lower-risk item.

### Step 7: Create Sprint Board / Task List
Organize selected items into a structured plan:
- **Columns:** To Do → In Progress → In Review → Done
- **Assignments:** Who owns each task
- **Priority order:** What to work on first within each assignment
- **Daily goals:** Optional — what should be completed each day of the sprint

### Step 8: Set Review and Retro Dates
Schedule sprint ceremonies:
- **Daily standup:** Brief check-in on progress, blockers, and plan for the day
- **Mid-sprint check:** Assess velocity — are we on track? Do we need to adjust scope?
- **Sprint review:** Demo completed work, gather feedback
- **Sprint retrospective:** What went well, what to improve, action items for next sprint

## Output Format

```
# Sprint Plan — [Sprint Name/Number]
**Period:** [start date] to [end date]
**Duration:** [1 week / 2 weeks]
**Team:** [team members and roles]

## Sprint Goals
1. **[Goal 1]** — [measurable outcome] — Delivery Stage: [stage] (Layaa AI mode)
2. **[Goal 2]** — [measurable outcome] — Delivery Stage: [stage] (Layaa AI mode)

## Capacity
| Team Member | Available Hours | Allocated | Buffer | Net Available |
|-------------|----------------|-----------|--------|---------------|
| [name] | [hours] | [hours] | [hours] | [hours] |
| **Total** | **[hours]** | **[hours]** | **[hours]** | **[hours]** |

## Sprint Backlog

### Priority 1 — Must Complete
| ID | Task | Client/Project | Size | Estimate | Owner | Delivery Stage | Dependencies |
|----|------|---------------|------|----------|-------|----------------|--------------|
| T-001 | [task] | [client] | [S/M/L] | [hours] | [owner] | [stage] | [dependency] |
| T-002 | [task] | [client] | [S/M/L] | [hours] | [owner] | [stage] | [dependency] |

### Priority 2 — Should Complete
| ID | Task | Client/Project | Size | Estimate | Owner | Delivery Stage | Dependencies |
|----|------|---------------|------|----------|-------|----------------|--------------|
| T-003 | [task] | [client] | [S/M/L] | [hours] | [owner] | [stage] | [dependency] |

### Priority 3 — Stretch Goals
| ID | Task | Client/Project | Size | Estimate | Owner | Delivery Stage | Dependencies |
|----|------|---------------|------|----------|-------|----------------|--------------|
| T-004 | [task] | [client] | [S/M/L] | [hours] | [owner] | [stage] | [dependency] |

## Capacity Allocation
| Client/Project | Hours Allocated | % of Capacity | Tasks |
|---------------|----------------|---------------|-------|
| [client 1] | [hours] | [%] | T-001, T-002 |
| [internal] | [hours] | [%] | T-003 |
| **Total** | **[hours]** | **[%]** | |

## Dependencies and Blockers
| ID | Dependency/Blocker | Status | Owner | Resolution Plan | Due |
|----|-------------------|--------|-------|-----------------|-----|
| D-001 | [dependency] | [open/resolved] | [owner] | [plan] | [date] |

## Success Criteria
- [ ] [Criterion 1 — specific and verifiable]
- [ ] [Criterion 2 — specific and verifiable]
- [ ] [Criterion 3 — specific and verifiable]

## Schedule
| Day | Focus | Key Activities |
|-----|-------|---------------|
| [Day 1] | [focus area] | [activities] |
| [Day 2] | [focus area] | [activities] |
| ... | ... | ... |

## Ceremonies
- **Daily Standup:** [time and format]
- **Mid-Sprint Check:** [date]
- **Sprint Review:** [date and time]
- **Sprint Retrospective:** [date and time]

## Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [risk] | [High/Med/Low] | [High/Med/Low] | [action] |
```

## What Makes This Different from Generic Sprint Planning
- Maps tasks to Layaa AI's 5-stage delivery methodology for clear progress tracking
- Uses the 7-stage workflow pattern for accurate automation task estimation
- Accounts for multi-client context switching overhead in capacity planning
- Separates capacity by client engagement for services business visibility
- Estimates in hours/days rather than story points (more appropriate for client delivery)
- Aligns sprint goals with specific delivery stages per client
- Includes client-specific external dependencies common in consulting/services work
- Considers the services team structure rather than a traditional product engineering team
