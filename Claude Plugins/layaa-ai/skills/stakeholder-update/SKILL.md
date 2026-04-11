---
name: stakeholder-update
description: >
  Create stakeholder update communications for product progress, launches, changes, or decisions.
  Adapts messaging to audience — executives, engineering, clients, or investors. In Layaa AI mode,
  uses org chart for tone calibration and brand voice framework for external communications.
  Trigger: "stakeholder update", "status update", "progress report", "executive summary",
  "client update", "investor update". This skill replaces the generic product:stakeholder-update
  capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Stakeholder Update

Create stakeholder update communications that adapt messaging to the audience, covering progress, launches, changes, decisions, and next steps.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

**Layaa AI product context:** Layaa AI does not have a traditional SaaS product. Stakeholder updates cover service delivery progress, client engagement status, operational improvements, and business development milestones. Updates must reflect the services business model.

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/org-chart.md — Org structure for audience identification and tone calibration
- shared-references/company-identity.md — Company basics and positioning
- shared-references/service-verticals.md — Services and methodology context
- domain-references/brand-voice/tone-framework.md — Brand voice for external communications
- domain-references/operations/delivery-methodology.md — Delivery stages for progress framing
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Audience and Communication Purpose
Determine who the update is for and why:

**Audience Types:**
- **Founders (Abhimanyu/Shubham):** Strategic summary — decisions needed, blockers, revenue impact, resource needs
- **Delivery Team (Internal):** Technical detail — task status, dependencies, blockers, technical decisions
- **Clients:** Outcome-focused — what was delivered, what it means for them, what is next
- **Investors/Board:** High-level — business metrics, growth trajectory, strategic milestones
- **Partners/Vendors:** Collaborative — joint progress, integration status, mutual action items

For Layaa AI: use the org chart to determine the appropriate detail level and communication style:
- Founders = strategic, concise, decision-oriented
- AI Workforce GPTs (internal reference) = structured, role-specific, evidence-tagged
- Clients = outcome-focused, jargon-free, value-driven

### Step 2: Gather Progress Data
Search the workspace for relevant progress information:
1. Use Glob to find status reports, task lists, sprint boards (`*status*`, `*progress*`, `*sprint*`, `*report*`)
2. Use Grep to find completed items, decisions made, blockers encountered
3. Ask the user for any additional context:
   - What was accomplished since the last update?
   - What key decisions were made?
   - What changed (scope, timeline, priorities)?
   - What blocked progress?
   - What is planned next?

### Step 3: Summarize Key Achievements
Highlight what was accomplished:
- Lead with the most impactful achievement
- Frame achievements in terms the audience cares about:
  - Founders: Revenue impact, client satisfaction, strategic progress
  - Delivery team: Technical milestones, velocity, quality metrics
  - Clients: Business outcomes, time saved, processes improved
  - Investors: Growth metrics, market traction, scalability proof points

For Layaa AI: frame achievements within the delivery methodology:
- "Completed Discovery for [Client] — identified 7 automation opportunities"
- "Delivered 3 workflows in Development stage — now entering Validation"
- "Enablement phase complete — client team trained on 5 automations"

### Step 4: Address Decisions and Changes
Document key decisions made and their rationale:
- What was decided and why
- What alternatives were considered
- What the impact is on timeline, scope, or resources
- Who made or needs to make the decision

For scope or timeline changes:
- Be transparent about what changed and why
- Frame the change positively where honest (e.g., "Descoped X to deliver Y faster")
- Note any downstream effects

### Step 5: Apply Brand Voice (Layaa AI Mode — External Communications)
For client-facing or external updates:
- Load the brand voice framework from `domain-references/brand-voice/tone-framework.md`
- Apply appropriate tone: professional but approachable, confident but not arrogant
- Avoid internal jargon — translate technical concepts into business language
- Focus on outcomes and value delivered, not activities performed
- Use the positioning language: empowering, modernizing, practical AI adoption

For internal updates:
- Be direct and specific
- Use technical terminology appropriate for the audience
- Include numbers, metrics, and evidence
- Flag items that need attention with clear severity levels

### Step 6: Address Risks and Blockers
Be transparent about challenges:
- **Active blockers:** What is currently preventing progress, who owns resolution, target resolution date
- **Risks:** What could go wrong, probability, impact, mitigation plan
- **Escalations:** What needs the audience's attention or decision

Frame risks constructively:
- State the risk clearly
- Provide a recommended mitigation
- Specify what you need from the audience (decision, resource, approval)

### Step 7: Outline Next Steps and Timeline
Provide clear forward-looking guidance:
- What will be worked on next
- Key milestones and their target dates
- What the audience should expect to hear about next
- Any action items for the audience

For Layaa AI: map next steps to delivery methodology stages so stakeholders understand where each engagement stands.

### Step 8: Include Action Items
If the update requires action from the audience:
- List action items explicitly
- Assign each to a specific person
- Include a due date
- Mark urgency (immediate, this week, this month)

## Output Format

The format adapts based on audience:

### For Founders / Executive Audience:
```
# [Update Type] — [Date/Period]

## TL;DR
[2-3 sentence summary of the most important points]

## Key Highlights
- [Achievement 1 — with business impact]
- [Achievement 2 — with business impact]
- [Achievement 3 — with business impact]

## Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|
| [decision] | [why] | [effect on timeline/scope/revenue] |

## Attention Needed
| Item | Urgency | What Is Needed | Deadline |
|------|---------|---------------|----------|
| [item] | [High/Med] | [decision/approval/resource] | [date] |

## Risks
| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| [risk] | [H/M/L] | [H/M/L] | [plan] | [person] |

## Next Period
- [Key focus 1]
- [Key focus 2]
- [Expected milestone]

## Metrics Snapshot (if applicable)
| Metric | Last Period | This Period | Trend |
|--------|-----------|------------|-------|
| [metric] | [value] | [value] | [up/down/stable] |
```

### For Clients:
```
# Project Update — [Client Name] — [Date]

## Summary
[Brief, outcome-focused summary of progress]

## What We Delivered
- [Deliverable 1 — stated in business terms]
- [Deliverable 2 — stated in business terms]

## Current Stage
**[Discovery / Assessment / Development / Validation / Enablement]** (Layaa AI mode)
[Brief description of where the project stands and what this stage means for the client]

## What Is Next
- [Next step 1 — with expected date]
- [Next step 2 — with expected date]

## Action Items for You
- [ ] [Action — by date]
- [ ] [Action — by date]

## Questions or Feedback
[Invitation to provide feedback or raise questions]
```

### For Delivery Team / Internal:
```
# Sprint/Week Update — [Period]

## Completed
| Task | Client/Project | Status | Notes |
|------|---------------|--------|-------|
| [task] | [client] | Done | [notes] |

## In Progress
| Task | Client/Project | % Complete | Blockers | ETA |
|------|---------------|-----------|----------|-----|
| [task] | [client] | [%] | [blocker] | [date] |

## Blocked
| Task | Blocker | Owner | Resolution Plan | Target Date |
|------|---------|-------|-----------------|-------------|
| [task] | [blocker] | [owner] | [plan] | [date] |

## Decisions Made
- [Decision and rationale]

## Next Sprint/Week Focus
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## Capacity Check
| Person | Utilization | Available Hours Next Period |
|--------|------------|---------------------------|
| [name] | [%] | [hours] |
```

## What Makes This Different from Generic Stakeholder Updates
- Uses Layaa AI's org chart to calibrate tone and detail level per audience
- Frames progress within the 5-stage delivery methodology for consistent project tracking
- Applies brand voice framework for client-facing communications
- Provides three distinct output formats (executive, client, internal) with appropriate framing
- Maps next steps to delivery stages so all stakeholders share a common language
- Understands the multi-client services context rather than single-product updates
- Includes capacity checks relevant to a services team managing multiple engagements
- Uses the Layaa AI positioning language for external communications
