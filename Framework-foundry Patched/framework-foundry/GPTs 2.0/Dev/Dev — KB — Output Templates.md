# Dev — Output Templates

> Internal Product Manager — Layaa AI Private Limited
> These templates are the standard output formats Dev uses when generating product management documents. Designed for the Layaa OS development lifecycle.

---

## 1. Product Requirements Document (PRD)

```
──────────────────────────────────────────────────────────────
          LAYAA OS — PRODUCT REQUIREMENTS DOCUMENT
──────────────────────────────────────────────────────────────

PRD ID          : LAI/PRD/[Sequential Number]
Feature Name    : [Feature Name]
Date            : [DD-MMM-YYYY]
Author          : Dev (Product Manager)
Status          : [Draft / In Review / Approved / In Progress / Shipped]
Priority        : [P0 / P1 / P2 / P3]
Phase           : [Phase 0 / 1 / 2 / 3 / 4]

──────────────────────────────────────────────────────────────
A. OVERVIEW
──────────────────────────────────────────────────────────────

Problem Statement:
[2-3 sentences. What problem does this feature solve? Who is
affected? What is the cost of NOT solving it?]

Proposed Solution:
[2-3 sentences. High-level description of what we will build.
Not HOW — that's Ujjawal's job. Focus on WHAT and WHY.]

Success Criteria:
[How do we know this feature is successful? Measurable outcomes.]
- [ ] [Metric 1 — e.g., >90% of users can complete the flow
      without assistance]
- [ ] [Metric 2 — e.g., Reduces manual delegation errors to <5%]
- [ ] [Metric 3 — e.g., <2s response time for real-time updates]

──────────────────────────────────────────────────────────────
B. USER STORIES
──────────────────────────────────────────────────────────────

| ID   | As a...          | I want to...                    | So that...                      |
|------|------------------|----------------------------------|---------------------------------|
| US-1 | [User type]      | [Action]                         | [Benefit / outcome]             |
| US-2 | [User type]      | [Action]                         | [Benefit / outcome]             |
| US-3 | [User type]      | [Action]                         | [Benefit / outcome]             |

──────────────────────────────────────────────────────────────
C. FUNCTIONAL REQUIREMENTS
──────────────────────────────────────────────────────────────

| ID    | Requirement                              | Priority   | Notes                |
|-------|------------------------------------------|------------|----------------------|
| FR-1  | [e.g., System must support WebSocket     | Must Have  | [Technical context]  |
|       |  connections for real-time updates]       |            |                      |
| FR-2  | [e.g., Agent picker must show all 22     | Must Have  | [UX context]         |
|       |  agents with search/filter]               |            |                      |
| FR-3  | [e.g., Switching agents should preserve  | Should Have| [Edge case]          |
|       |  conversation context]                    |            |                      |
| FR-4  | [e.g., Recent agents shown first in      | Nice to Have| [UX improvement]    |
|       |  picker based on usage]                   |            |                      |

──────────────────────────────────────────────────────────────
D. NON-FUNCTIONAL REQUIREMENTS
──────────────────────────────────────────────────────────────

| Category        | Requirement                              |
|-----------------|------------------------------------------|
| Performance     | [e.g., <2s page load, <500ms API response]|
| Security        | [e.g., RLS enforced, no cross-user data] |
| Accessibility   | [e.g., Keyboard navigable, readable fonts]|
| Offline         | [e.g., Must work in offline mode / N/A]  |
| Mobile          | [e.g., Responsive / Not required]        |
| Data            | [e.g., Must handle 10K+ records]         |

──────────────────────────────────────────────────────────────
E. ACCEPTANCE CRITERIA
──────────────────────────────────────────────────────────────

| ID   | Scenario                                 | Expected Result                 |
|------|------------------------------------------|---------------------------------|
| AC-1 | [Given X, when Y]                        | [Then Z happens]                |
| AC-2 | [Given X, when Y]                        | [Then Z happens]                |
| AC-3 | [Edge case — e.g., user is offline]      | [Graceful handling]             |
| AC-4 | [Error case — e.g., budget exhausted]    | [Error message + fallback]      |

──────────────────────────────────────────────────────────────
F. DEPENDENCIES & RISKS
──────────────────────────────────────────────────────────────

Dependencies:
- [e.g., Requires RLS implementation (PRD-003) to be completed]
- [e.g., Requires n8n workflow #4 (response) to be active]
- [e.g., Requires PocketBase collection schema update]

Risks:
| Risk                                | Impact | Mitigation                    |
|-------------------------------------|--------|-------------------------------|
| [e.g., WebSocket compatibility      | Medium | Research PB realtime first    |
|  with PocketBase uncertain]         |        |                               |
| [e.g., May require UI rework if     | Low    | Prototype before full build   |
|  agent count exceeds 30]            |        |                               |

──────────────────────────────────────────────────────────────
G. EFFORT ESTIMATE
──────────────────────────────────────────────────────────────

| Component           | Traditional | AI-Assisted (compressed) |
|---------------------|-------------|--------------------------|
| Architecture/Design | [X hrs]     | [X × 0.65 = Y hrs]      |
| Core Logic          | [X hrs]     | [X × 0.35 = Y hrs]      |
| UI Implementation   | [X hrs]     | [X × 0.45 = Y hrs]      |
| Testing/QA          | [X hrs]     | [X × 0.75 = Y hrs]      |
| **Total**           | [X hrs]     | **[Y hrs]**              |

──────────────────────────────────────────────────────────────
H. HANDOFF CHECKLIST
──────────────────────────────────────────────────────────────

- [ ] PRD reviewed and approved by Shubham
- [ ] User stories validated against real user scenarios
- [ ] Acceptance criteria are testable (not vague)
- [ ] Dependencies identified and unblocked (or scheduled)
- [ ] Effort estimate confirmed with Ujjawal
- [ ] Arush notified if documentation needed
- [ ] Arjun notified if client-facing impact
```

---

## 2. Sprint Plan

```
──────────────────────────────────────────────────────────────
          LAYAA OS — SPRINT PLAN
──────────────────────────────────────────────────────────────

Sprint          : Sprint [#] — [Name/Theme]
Phase           : Phase [#]
Duration        : [Start Date] → [End Date] (7 days)
Capacity        : [X] hours available (Shubham: [Y] hrs)
Sprint Goal     : [1-2 sentence goal — what does "done" look
                   like for this sprint?]

──────────────────────────────────────────────────────────────
A. SPRINT BACKLOG
──────────────────────────────────────────────────────────────

| # | Item                          | Type    | Priority | Effort | Owner    | Status      |
|---|-------------------------------|---------|----------|--------|----------|-------------|
| 1 | [e.g., RLS Security Rules]    | Feature | P0       | 5 hrs  | Shubham  | Not Started |
| 2 | [e.g., Sage Sidebar Fix]      | Bug Fix | P0       | 0.5 hr | Shubham  | Not Started |
| 3 | [e.g., DELEGATION_MAP expand] | Bug Fix | P0       | 0.5 hr | Shubham  | Not Started |
| 4 | [e.g., Agent Picker UI]       | Feature | P1       | 4 hrs  | Shubham  | Not Started |
|   |                               |         |          |        |          |             |
|   | **Total Committed**           |         |          | **X hrs**|        |             |
|   | **Buffer (20%)**              |         |          | **Y hrs**|        |             |

──────────────────────────────────────────────────────────────
B. SPRINT RISKS
──────────────────────────────────────────────────────────────

| Risk                                | Probability | Impact | Mitigation             |
|-------------------------------------|-------------|--------|------------------------|
| [e.g., Shubham pulled into client   | Medium      | High   | Protect first 3 P0     |
|  calls — capacity drops]            |             |        | items as non-negotiable|
| [e.g., RLS takes longer than est.]  | Medium      | High   | Time-box to 6 hrs max; |
|                                     |             |        | escalate if stuck      |

──────────────────────────────────────────────────────────────
C. DEFINITION OF DONE (PER ITEM)
──────────────────────────────────────────────────────────────

Every sprint item is "Done" when:
- [ ] Feature/fix implemented on staging
- [ ] Core flow smoke-tested (see Release Checklist)
- [ ] No open S0/S1 bugs related to this item
- [ ] Arush notified if user-facing documentation needed
- [ ] Deployed to production (if applicable)

──────────────────────────────────────────────────────────────
D. CARRY-OVER FROM LAST SPRINT
──────────────────────────────────────────────────────────────

| Item                          | Reason for Carry-Over           | New Priority |
|-------------------------------|---------------------------------|--------------|
| [e.g., CRM Kanban View]      | [Blocked by CRM data model]     | P1 next sprint|
| [None if clean sprint]        |                                 |              |

──────────────────────────────────────────────────────────────
E. SPRINT CEREMONIES
──────────────────────────────────────────────────────────────

| Ceremony          | When                    | Duration | Attendees       |
|-------------------|-------------------------|----------|-----------------|
| Sprint Planning   | [Day 1, time]           | 30 min   | Shubham + Dev   |
| Daily Check-in    | Async (Layaa OS message)| 5 min    | Shubham + Dev   |
| Sprint Review     | [Day 7, time]           | 30 min   | Shubham + Dev   |
| Retrospective     | [Day 7, after review]   | 15 min   | Shubham + Dev   |
```

---

## 3. Sprint Retrospective

```
──────────────────────────────────────────────────────────────
          LAYAA OS — SPRINT RETROSPECTIVE
──────────────────────────────────────────────────────────────

Sprint          : Sprint [#] — [Name/Theme]
Date            : [DD-MMM-YYYY]
Velocity        : [X] hours committed / [Y] hours delivered
Completion Rate : [Z]% ([N] of [M] items shipped)

──────────────────────────────────────────────────────────────
A. WHAT WENT WELL
──────────────────────────────────────────────────────────────

1. [e.g., RLS implementation completed in 4 hrs vs. 6 hrs est.]
2. [e.g., Bug fixes were shipped same day — fast turnaround]
3. [e.g., No S0 bugs reported during the sprint]

──────────────────────────────────────────────────────────────
B. WHAT DIDN'T GO WELL
──────────────────────────────────────────────────────────────

1. [e.g., Agent Picker deferred — Shubham had 3 unplanned
   client calls this week]
2. [e.g., Memory compression testing couldn't run — volume
   too low in staging]
3. [e.g., Sprint started late — planning took until Tuesday]

──────────────────────────────────────────────────────────────
C. ACTION ITEMS
──────────────────────────────────────────────────────────────

| # | Action                              | Owner    | By When   |
|---|-------------------------------------|----------|-----------|
| 1 | [e.g., Block Monday AM for sprint   | Shubham  | Next sprint|
|   |  planning — no client calls]        |          |           |
| 2 | [e.g., Generate synthetic data for  | Kaiser   | Next sprint|
|   |  memory compression testing]        |          |           |
| 3 | [e.g., Reduce sprint commitment     | Dev      | Next sprint|
|   |  by 20% to account for CEO duties]  |          |           |

──────────────────────────────────────────────────────────────
D. METRICS
──────────────────────────────────────────────────────────────

| Metric                    | This Sprint | Last Sprint | Trend |
|---------------------------|-------------|-------------|-------|
| Items Committed           | [N]         | [N]         | [↑↓→] |
| Items Delivered           | [N]         | [N]         | [↑↓→] |
| Completion Rate           | [%]         | [%]         | [↑↓→] |
| P0 Items Open (End)       | [N]         | [N]         | [↑↓→] |
| S0/S1 Bugs This Sprint    | [N]         | [N]         | [↑↓→] |
| Carry-Over Items          | [N]         | [N]         | [↑↓→] |
```

---

## 4. Feature Request Evaluation

```
──────────────────────────────────────────────────────────────
          LAYAA OS — FEATURE REQUEST EVALUATION
──────────────────────────────────────────────────────────────

Request ID      : LAI/FR/[Sequential Number]
Feature Name    : [Short Name]
Requested By    : [Who — Founder, client, agent, internal]
Date Requested  : [DD-MMM-YYYY]
Source Context   : [Why they want this — direct quote or paraphrase]

──────────────────────────────────────────────────────────────
A. PROBLEM STATEMENT
──────────────────────────────────────────────────────────────

[What problem does this solve? Who is affected? What is the
cost of not solving it? 3-4 sentences.]

──────────────────────────────────────────────────────────────
B. PROPOSED SOLUTION
──────────────────────────────────────────────────────────────

[High-level description of how this would work. Not architecture
— just the user-facing behavior. 2-3 sentences.]

──────────────────────────────────────────────────────────────
C. PRIORITY SCORING
──────────────────────────────────────────────────────────────

| Factor               | Score (1-5) | Weight | Weighted | Rationale              |
|----------------------|-------------|--------|----------|------------------------|
| Impact               | [1-5]       | 0.35   | [X.XX]   | [Brief justification]  |
| Strategic Alignment  | [1-5]       | 0.25   | [X.XX]   | [Brief justification]  |
| Effort Inverse       | [1-5]       | 0.20   | [X.XX]   | [5=<2h, 3=4-8h, 1=>12h]|
| Risk Reduction       | [1-5]       | 0.10   | [X.XX]   | [Brief justification]  |
| Dependency Score     | [1-5]       | 0.10   | [X.XX]   | [Brief justification]  |
| **TOTAL**            |             |        | **[X.XX]**|                        |

Priority Assignment: [P0 / P1 / P2 / P3]
(>=3.5 → P0/P1 | 2.5-3.5 → P2 | <2.5 → P3)

──────────────────────────────────────────────────────────────
D. EFFORT ESTIMATE
──────────────────────────────────────────────────────────────

| Component           | Hours (AI-compressed) |
|---------------------|-----------------------|
| Architecture/Design | [X hrs]               |
| Core Logic          | [X hrs]               |
| UI                  | [X hrs]               |
| Testing             | [X hrs]               |
| **Total**           | **[X hrs]**           |

──────────────────────────────────────────────────────────────
E. DEPENDENCIES
──────────────────────────────────────────────────────────────

Requires:
- [What must exist before this can be built?]

Unblocks:
- [What does building this enable?]

──────────────────────────────────────────────────────────────
F. DECISION
──────────────────────────────────────────────────────────────

[ ] APPROVED — Scheduled for Sprint [#] / Phase [#]
[ ] DEFERRED — Reason: [Why not now?]
[ ] REJECTED — Reason: [Why not at all?]

Approved By: [Shubham / Founders]
Date: [DD-MMM-YYYY]
```

---

## 5. Release Notes

```
──────────────────────────────────────────────────────────────
          LAYAA OS — RELEASE NOTES
──────────────────────────────────────────────────────────────

Version         : [X.Y.Z]
Release Date    : [DD-MMM-YYYY]
Release Type    : [Sprint Release / Hotfix / Phase Release]
Sprint          : Sprint [#]

──────────────────────────────────────────────────────────────
WHAT'S NEW
──────────────────────────────────────────────────────────────

ADDED:
• [Feature 1 — what it does and why it matters to users]
• [Feature 2 — what it does and why it matters to users]

CHANGED:
• [Change 1 — what was different before, what is different now]

FIXED:
• [S1] [Bug fix 1 — what was broken, how it affected users]
• [S2] [Bug fix 2 — what was broken, how it affected users]

SECURITY:
• [Security change — what was the risk, how it was addressed]

──────────────────────────────────────────────────────────────
KNOWN ISSUES
──────────────────────────────────────────────────────────────

• [Issue 1 — workaround if available]
• [Issue 2 — expected fix in Sprint [#]]

──────────────────────────────────────────────────────────────
UPGRADE NOTES
──────────────────────────────────────────────────────────────

• [Any action required by users or admins after this update]
• [e.g., Clear browser cache for UI updates to take effect]
• [e.g., Kaiser will run a data migration at 3 AM IST]

──────────────────────────────────────────────────────────────
METRICS SNAPSHOT
──────────────────────────────────────────────────────────────

| Metric                     | Before Release | Target       |
|----------------------------|----------------|--------------|
| [e.g., Delegation success] | [85%]          | [>95%]       |
| [e.g., Response time]      | [3.2s]         | [<2s]        |
| [e.g., Open S0/S1 bugs]   | [2]            | [0]          |
```

---

## 6. Product Metrics Dashboard (Weekly)

```
──────────────────────────────────────────────────────────────
          LAYAA OS — WEEKLY PRODUCT METRICS
──────────────────────────────────────────────────────────────

Week            : [Week #] ([Start Date] — [End Date])
Phase           : Phase [#]
Reported By     : Dev (Product Manager)

──────────────────────────────────────────────────────────────
A. USAGE METRICS
──────────────────────────────────────────────────────────────

| Metric                        | This Week | Last Week | Trend | Target  |
|-------------------------------|-----------|-----------|-------|---------|
| Daily Active Users            | [N]       | [N]       | [↑↓→] | [N]     |
| Messages Sent                 | [N]       | [N]       | [↑↓→] | [N]     |
| Messages per User per Day     | [N]       | [N]       | [↑↓→] | >10     |
| Agent Delegations             | [N]       | [N]       | [↑↓→] | >5/day  |
| Tasks Created                 | [N]       | [N]       | [↑↓→] | [N]     |
| Memories Extracted (Sage)     | [N]       | [N]       | [↑↓→] | >100/wk |
| Approval Requests             | [N]       | [N]       | [↑↓→] | [N]     |
| Files Uploaded                | [N]       | [N]       | [↑↓→] | [N]     |

──────────────────────────────────────────────────────────────
B. SYSTEM HEALTH
──────────────────────────────────────────────────────────────

| Metric                        | This Week | Target   | Status      |
|-------------------------------|-----------|----------|-------------|
| Uptime                        | [99.X%]   | >99%     | [GREEN/RED] |
| Avg Response Time             | [X.Xs]    | <2s      | [GREEN/RED] |
| Error Rate                    | [X%]      | <1%      | [GREEN/RED] |
| Budget Utilization (total)    | [X%]      | <80%     | [GREEN/RED] |
| Offline Sync Success Rate     | [X%]      | >95%     | [GREEN/RED] |

──────────────────────────────────────────────────────────────
C. DEVELOPMENT VELOCITY
──────────────────────────────────────────────────────────────

| Metric                        | This Week | Last Week | Trend |
|-------------------------------|-----------|-----------|-------|
| Sprint Items Completed        | [N/M]     | [N/M]     | [↑↓→] |
| Bugs Found                    | [N]       | [N]       | [↑↓→] |
| Bugs Fixed                    | [N]       | [N]       | [↑↓→] |
| Open S0/S1 Bugs               | [N]       | [N]       | [↑↓→] |
| Hours Spent (Shubham)         | [N]       | [N]       | [↑↓→] |

──────────────────────────────────────────────────────────────
D. PILOT METRICS (IF ACTIVE)
──────────────────────────────────────────────────────────────

| School / Client    | Users | Msgs/Day | Memories/Wk | Delegations/Day | NPS  |
|--------------------|-------|----------|-------------|-----------------|------|
| [e.g., Aaryans]    | [N]   | [N]      | [N]         | [N]             | [N]  |
| [e.g., SSA]        | [N]   | [N]      | [N]         | [N]             | [N]  |

──────────────────────────────────────────────────────────────
E. KEY INSIGHTS & ACTIONS
──────────────────────────────────────────────────────────────

Insights:
1. [e.g., Delegation usage dropped — investigate if DELEGATION_MAP
   fix resolved the issue or if users aren't discovering the feature]
2. [e.g., Memory extraction rate is healthy — Sage threshold tuning
   appears to be working]

Actions for Next Week:
1. [Action — Owner — By When]
2. [Action — Owner — By When]
```

---

*These templates ensure Dev produces consistent, data-driven product management artifacts. Every PRD leads to a buildable spec. Every sprint has a plan and a retro. Every release has notes. The goal is predictability and accountability across the product lifecycle.*
