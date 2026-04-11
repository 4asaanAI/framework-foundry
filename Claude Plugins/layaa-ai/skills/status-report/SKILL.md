---
name: status-report
description: >
  Generate project or operational status reports. Summarizes progress, blockers, risks,
  and next steps for stakeholders. In Layaa AI mode, structures around the 5-stage delivery
  methodology (Discovery/Assessment/Development/Validation/Enablement) and routes to
  stakeholders per org chart.
  Trigger: "status report", "project update", "weekly update", "progress report", "stakeholder update", "project status"
  This skill replaces the generic operations:status-report capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Status Report

Generate project or operational status reports. Summarizes progress, milestones, blockers, risks, and next steps for the appropriate stakeholder audience.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, client engagements, delivery projects, GPT workforce operations, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/delivery-methodology.md — 5-stage delivery methodology and stage gates
- shared-references/org-chart.md — Organizational structure and reporting lines
- shared-references/service-verticals.md — Service offerings context
- shared-references/revenue-model.md — Revenue and pricing context for financial reporting
Only load references relevant to the report scope.

## Execution Steps

### Step 1: Identify Report Scope and Audience
Collect or ask for:
- **Report type:**
  - **Project status:** Single project or engagement update
  - **Portfolio status:** Multiple projects or full delivery pipeline
  - **Operational status:** Internal operations and team health
  - **Executive summary:** High-level overview for founders or strategic stakeholders
- **Audience:**
  - Founders (strategic, financial, risk-focused)
  - Client (progress, deliverables, next steps)
  - Delivery team (technical details, blockers, assignments)
  - Kabir/GPT workforce (cross-functional coordination)
- **Period:** What timeframe does this report cover (this week, this sprint, this month)?
- **Project(s):** Which project(s) or areas to include?

### Step 2: Gather Status Data
Collect information from available sources:

1. **Search workspace** for project-related files:
   - Use Glob to find project documents, trackers, meeting notes
   - Use Grep to find recent mentions of project name, client, or key terms
2. **Review milestones and deliverables:**
   - What was planned for this period?
   - What was actually delivered?
   - What is in progress?
   - What is blocked?
3. **Identify metrics:**
   - Timeline adherence (on schedule, ahead, behind)
   - Budget status (on budget, over, under)
   - Quality indicators (errors, rework, client feedback)
   - For Layaa AI: delivery stage completion percentage

### Step 3: Structure Around Delivery Methodology (Layaa AI Mode)
Map project status to the 5-stage delivery methodology:

**Stage 1 — Discovery:**
- Client requirements gathered?
- Business context documented?
- Stakeholder map complete?
- Pain points and opportunities identified?
- Stage gate: Discovery brief approved by client

**Stage 2 — Assessment:**
- Process mapping complete?
- Feasibility analysis done? (Rohit's validation)
- Technical requirements defined?
- Risk assessment complete?
- Stage gate: Assessment report approved, scope finalized

**Stage 3 — Development:**
- Architecture designed? (Ujjwal's output)
- Workflows built and unit tested?
- Integrations connected and verified?
- Internal QA passed?
- Stage gate: Development complete, ready for validation

**Stage 4 — Validation:**
- User acceptance testing complete?
- Performance testing passed?
- Client sign-off received?
- Documentation updated?
- Stage gate: Client acceptance

**Stage 5 — Enablement:**
- Training delivered?
- Documentation handed over?
- Support handoff complete?
- Monitoring configured?
- Stage gate: Project closed, retainer activated (if applicable)

### Step 4: Classify Items as On-Track / At-Risk / Blocked
For each work item, milestone, or stage:

| Status | Color | Definition | Action Required |
|--------|-------|------------|----------------|
| **On Track** | GREEN | Progressing as planned, no issues | Continue as planned |
| **At Risk** | AMBER | May miss target without intervention | Identify mitigation, assign owner |
| **Blocked** | RED | Cannot progress, dependency or issue preventing work | Immediate attention, escalation |
| **Completed** | BLUE | Delivered and accepted | None — archive |
| **Not Started** | GREY | Planned but not yet begun | Verify readiness to start |

### Step 5: Summarize Key Achievements and Blockers
**Achievements this period:**
- List completed deliverables, milestones reached, approvals received
- Quantify where possible (hours completed, integrations built, tests passed)
- Note any ahead-of-schedule items

**Blockers and issues:**
For each blocker:
1. What is blocked?
2. Why is it blocked (root cause)?
3. Since when (duration of the block)?
4. Impact if not resolved (what downstream work is affected)?
5. Required action and owner
6. Expected resolution date

### Step 6: List Upcoming Milestones and Deadlines
**Next period (upcoming week/sprint):**
| Milestone | Due Date | Owner | Dependencies | Status |
|-----------|----------|-------|-------------|--------|
| [milestone] | [date] | [owner] | [dependencies] | [on track/at risk] |

**Upcoming (next 2-4 weeks):**
| Milestone | Due Date | Owner | Status |
|-----------|----------|-------|--------|
| [milestone] | [date] | [owner] | [status] |

### Step 7: Route to Appropriate Stakeholders (Layaa AI Mode)
Determine distribution based on content:

| Report Content | Stakeholder | Format | Frequency |
|---------------|-------------|--------|-----------|
| Project delivery status | Founders | Executive summary | Weekly |
| Technical progress | Delivery team | Detailed report | Per sprint |
| Client-facing update | Client | Client report (polished) | Weekly/bi-weekly |
| Cross-functional issues | Kabir | Coordination brief | As needed |
| Financial/revenue impact | Rishi (Revenue Ops) | Financial summary | Monthly |

### Step 8: Include Action Items
Create specific, assignable action items:
- **What:** Clear description of the action
- **Who:** Named owner (use canonical role titles for Layaa AI)
- **When:** Due date or deadline
- **Priority:** URGENT / HIGH / MEDIUM / LOW
- **Dependencies:** What else must happen first

## Output Format

```
# Status Report — [Project/Scope Name]
**Period:** [date range]
**Report Date:** [date]
**Prepared by:** [name/role]
**Distribution:** [list of stakeholders]
**Classification:** [INTERNAL / CLIENT-FACING / CONFIDENTIAL]

## Executive Summary
**Overall Status:** [ON TRACK / AT RISK / BLOCKED] [GREEN/AMBER/RED indicator]

[2-3 sentence summary of the current state, key achievement, and primary concern]

### Key Numbers
- **Timeline:** [on schedule / X days ahead / X days behind]
- **Budget:** [on budget / X% over / X% under]
- **Deliverables:** [X of Y completed] ([percentage]%)
- **Open Blockers:** [count]
- **Open Risks:** [count] ([HIGH count])

## Delivery Stage Status (Layaa AI Mode)
| Stage | Status | Progress | Key Items | Notes |
|-------|--------|----------|-----------|-------|
| Discovery | [Complete/In Progress/Not Started] | [%] | [items] | [notes] |
| Assessment | [status] | [%] | [items] | [notes] |
| Development | [status] | [%] | [items] | [notes] |
| Validation | [status] | [%] | [items] | [notes] |
| Enablement | [status] | [%] | [items] | [notes] |

## Achievements This Period
1. [achievement with quantification]
2. [achievement]
3. [achievement]

## In Progress
| Item | Owner | Progress | Expected Completion | Status |
|------|-------|----------|-------------------|--------|
| [item] | [owner] | [% or description] | [date] | [GREEN/AMBER/RED] |

## Blockers
| # | Blocker | Since | Impact | Owner | Required Action | Target Resolution |
|---|---------|-------|--------|-------|----------------|------------------|
| 1 | [blocker] | [date] | [impact] | [owner] | [action] | [date] |

## Risks
| # | Risk | Probability | Impact | Mitigation | Owner |
|---|------|------------|--------|------------|-------|
| 1 | [risk] | [L/M/H] | [L/M/H] | [mitigation] | [owner] |

## Upcoming Milestones
### Next Period ([dates])
| Milestone | Due Date | Owner | Dependencies | Confidence |
|-----------|----------|-------|-------------|-----------|
| [milestone] | [date] | [owner] | [deps] | [HIGH/MED/LOW] |

### Coming Up ([next 2-4 weeks])
| Milestone | Due Date | Owner | Status |
|-----------|----------|-------|--------|
| [milestone] | [date] | [owner] | [status] |

## Action Items
| # | Action | Owner | Due | Priority | Status |
|---|--------|-------|-----|----------|--------|
| 1 | [action] | [owner] | [date] | [priority] | [open/in progress] |
| 2 | [action] | [owner] | [date] | [priority] | [status] |

## Client Communication Notes (if applicable)
- **Last client touchpoint:** [date and type]
- **Client sentiment:** [positive / neutral / concerned]
- **Key client feedback:** [summary]
- **Next client meeting:** [date]

## Notes for Next Report
- [items to follow up on next period]
- [questions to resolve]
```

## What Makes This Different from Generic Status Reports
- Structures progress around Layaa AI's 5-stage delivery methodology (Discovery → Enablement)
- Maps stage gates to Layaa AI's validation and quality standards
- Routes reports to appropriate stakeholders per Layaa AI's org chart and governance hierarchy
- Tracks delivery stages specific to AI automation engagements (workflow builds, API integrations, n8n deployments)
- Includes client communication tracking for relationship management
- Aligns action item owners with Layaa AI's GPT workforce using canonical role titles
- Incorporates financial metrics relevant to Layaa AI's revenue model (implementation fee progress, retainer activation)
- Escalation of blockers follows Layaa AI governance: Delivery Team → Kabir → Founders
