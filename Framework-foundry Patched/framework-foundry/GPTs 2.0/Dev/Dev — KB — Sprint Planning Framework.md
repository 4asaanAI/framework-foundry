# Dev — KB — Sprint Planning Framework

> Sprint structure, capacity planning, velocity tracking, definition of done, and retrospective format for Layaa OS development. This is the operational rhythm that keeps the build cycle predictable and productive.

---

## 1. Sprint Structure

**Sprint Duration:** 1 week (Monday to Friday)
**Builder:** Shubham (CTO) — primary and currently sole builder
**Planning Support:** Dev (product specs, prioritization), Ujjawal (architecture), Rohit (validation)
**Capacity:** 20-25 focused build hours per sprint (Shubham has CEO, client, and strategy responsibilities beyond building)

### Weekly Rhythm

| Day | Activity |
|-----|----------|
| **Monday** | Sprint planning — Dev proposes sprint backlog, Shubham approves/adjusts, tasks assigned |
| **Tuesday-Thursday** | Build cycle — Shubham executes, Dev monitors progress, Rohit validates completed items |
| **Friday** | Sprint review — Demo completed work, update backlog, retrospective |

### Sprint Planning Inputs

Before sprint planning, Dev prepares:
1. **Backlog status** — Current priority ordering from `Dev — KB — Feature Backlog & Prioritization.md`
2. **Capacity estimate** — How many hours Shubham has available this week (check for meetings, client calls, travel)
3. **Carry-over items** — Tasks not completed last sprint that need to continue
4. **Blockers** — Any dependencies that must resolve before tasks can start
5. **Pilot feedback** — Any urgent user feedback from active pilots that affects priorities

---

## 2. Sprint Template

Every sprint is documented using this format:

```markdown
# Sprint [N]: [Theme] — [Start Date] to [End Date]

## Sprint Goal
[1-2 sentences — the single most important outcome for this sprint]

## Capacity
- Shubham: [X] focused hours available
- Known blockers: [List or "None"]
- Carry-over from Sprint [N-1]: [List or "None"]

## Sprint Backlog

| # | Task | Priority | Estimate | Status | Notes |
|---|------|----------|----------|--------|-------|
| 1 | [Task name] | P0 | [X]hrs | Todo | [Dependencies or context] |
| 2 | [Task name] | P1 | [X]hrs | Todo | |
| 3 | [Task name] | P1 | [X]hrs | Todo | |

**Total estimated hours:** [X] / [Capacity] available
**Buffer:** [15-20% of capacity reserved for unplanned work]

## Definition of Done (per task)
- [ ] Feature works as specified in the product spec
- [ ] No console errors or unhandled exceptions
- [ ] Tested on staging environment
- [ ] Core user flows verified (login, primary action, error handling)
- [ ] Documentation updated if user-facing change (Arush notified)
- [ ] Pushed to main branch
- [ ] Changelog entry drafted

## Sprint Review Notes
[Filled Friday — what was completed, what carried over, what was learned]

## Retrospective
- **What went well:** [List]
- **What did not go well:** [List]
- **Action items for next sprint:** [List]
```

---

## 3. Capacity Planning

### Capacity Calculation

Shubham's weekly capacity is not fixed. Calculate each sprint:

```
Available hours = Total work hours - Meetings - Client calls - Admin - Buffer
                = 40 - [meetings] - [client] - [admin] - [20% buffer]
                = Typically 20-25 hours for build work
```

### Capacity Rules

1. **Never plan above 80% capacity.** The 20% buffer absorbs unplanned work, S0 bugs, and context-switching costs.
2. **Carry-over penalty:** If a task carries over from the previous sprint, add 20% to its original estimate (context reload cost).
3. **Pilot weeks get reduced capacity.** During active pilot launches (Aaryans Apr 13, SSA Apr 15), plan for 50-60% capacity — support will consume the rest.
4. **No more than one large task per sprint.** A "large" task is anything estimated at 8+ hours. Large tasks dominate the sprint and leave no room for urgent items.

### AI-Assisted Development Compression

Layaa AI uses AI-assisted development (Claude Code, Lovable 2.0), which compresses traditional estimates:

| Component | Traditional Hours | AI-Compressed Hours | Compression Ratio |
|-----------|------------------|--------------------|--------------------|
| Architecture | 10 hrs | 6-7 hrs | 60-70% |
| Core Logic | 10 hrs | 3-4 hrs | 30-40% |
| UI/Frontend | 10 hrs | 4-5 hrs | 40-50% |
| Testing | 10 hrs | 7-8 hrs | 70-80% |

Apply these ratios when estimating new features. Testing compression is lowest because validation requires real human judgment.

---

## 4. Velocity Tracking

Track sprint-over-sprint performance to improve estimation accuracy:

```markdown
## Velocity Log

| Sprint | Planned Hrs | Completed Hrs | Velocity % | Carry-Over | Notes |
|--------|-------------|---------------|------------|------------|-------|
| 1 | [X] | [Y] | [Y/X * 100] | [Tasks] | [Context] |
| 2 | [X] | [Y] | [Y/X * 100] | [Tasks] | |
```

### Velocity Guidelines

- **Target velocity:** 75-90% of planned hours completed
- **Below 60%:** Sprint was overloaded or hit major blockers — reduce next sprint scope
- **Above 100%:** Sprint was underloaded or estimates were too generous — increase scope or tighten estimates
- **Trend matters more than single sprints.** Three sprints of declining velocity signals a systemic issue (scope creep, technical debt, burnout).

### Estimation Calibration

After each sprint, compare estimated vs. actual hours per task:

| Task | Estimated | Actual | Delta | Reason |
|------|-----------|--------|-------|--------|
| [Task] | [X]hrs | [Y]hrs | [+/-Z] | [Why the difference] |

When estimates are consistently off by more than 30%, recalibrate using actual data rather than gut feel. Save calibration learnings to memory.

---

## 5. Definition of Done

The Definition of Done (DoD) applies to every task that closes in a sprint. A task is not Done until all criteria are met.

### Standard DoD

- [ ] Feature works as described in the product spec
- [ ] No console errors, no unhandled promise rejections
- [ ] Tested on staging — primary happy path and at least one error case
- [ ] PocketBase data integrity verified (no orphaned records, correct collection writes)
- [ ] UI responsive on desktop (mobile optimization deferred unless specified)
- [ ] No regressions in existing functionality (smoke test core flows)
- [ ] Pushed to production branch
- [ ] Changelog entry prepared

### Extended DoD (for user-facing features)

All standard DoD items plus:
- [ ] Arush notified for documentation update
- [ ] Release note drafted by Dev
- [ ] User guide impact assessed (new guide needed, existing guide updated, no change)

---

## 6. Retrospective Format

Every sprint ends with a short retrospective. Keep it focused — 15 minutes maximum.

### Template

```markdown
## Sprint [N] Retrospective — [Date]

### What went well (Keep doing)
- [Item 1]
- [Item 2]

### What did not go well (Stop or change)
- [Item 1]
- [Item 2]

### Action items (Specific, assigned, time-bound)
- [ ] [Action] — Owner: [Who] — By: [When]
- [ ] [Action] — Owner: [Who] — By: [When]

### Sprint health score: [1-5]
(1 = terrible, 5 = excellent)
```

### Retrospective Rules

1. Focus on process, not people. "Estimates were off" not "Shubham was slow."
2. Every problem gets an action item. Complaining without action is venting, not improving.
3. Action items from last retro are reviewed first. Did we follow through?
4. If the same issue appears three retros in a row, escalate — the current approach is not working.

---

**Cross-references:**
- For what to build each sprint: see `Dev — KB — Feature Backlog & Prioritization.md`
- For product specs that define sprint tasks: see `Dev — KB — Product Spec Template.md`
- For metrics tracked during and after sprints: see `Dev — KB — Product Metrics & KPIs.md`
- For release process after sprint completion: see `Dev — KB — Bug Triage & Release Planning.md`
- For the overall roadmap driving sprint themes: see `Dev — KB — Layaa OS Product Roadmap.md`

*Sprints are the heartbeat of Layaa OS development. A well-planned sprint delivers predictable progress. A poorly planned sprint delivers chaos and carry-over. Dev's job is to make every sprint count.*
