# Dev — KB — Bug Triage & Release Planning

> Bug severity classification, triage process, release checklist, changelog template, and hotfix procedure. Dev triages bugs against feature work and coordinates releases with the build and documentation teams.

---

## 1. Bug Severity Classification

| Severity | Definition | SLA | Sprint Impact |
|----------|-----------|-----|---------------|
| **S0 — Critical** | System down, data loss risk, security breach, core function non-operational | Fix within hours | Stops current sprint — hotfix immediately |
| **S1 — Major** | Core feature broken, multiple users affected, no workaround | Fix this sprint | Prioritize over P2+ features |
| **S2 — Minor** | Feature degraded but functional, workaround exists | Fix next sprint | Add to backlog at P2 |
| **S3 — Cosmetic** | Visual glitch, minor UX inconsistency, no functional impact | When convenient | Low-priority backlog |

### Severity Decision Tree

```
Is the system down or data at risk?
  Yes → S0
  No  → Is a core feature broken with no workaround?
          Yes → S1
          No  → Is a feature degraded but has a workaround?
                  Yes → S2
                  No  → S3 (cosmetic)
```

### Core Features (for Severity Assessment)
These features, if broken, automatically qualify as S0 or S1:
- User authentication and login
- Message send/receive
- Agent delegation (@mentions)
- Memory write/read (Sage)
- Approval request/approve/reject
- File upload
- Task create/complete
- Budget tracking
- Data backup (Kaiser)

---

## 2. Bug Report Template

```markdown
## Bug: [Short Description]

**Severity:** S[0-3]
**Reported by:** [Who — Founder, user, agent, monitoring]
**Date:** [DD Month YYYY]
**Environment:** [Production / Staging]
**Reproducible:** [Always / Sometimes / Once]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]
**Actual Result:** [What actually happens]

### Screenshots / Logs
[Attach or describe relevant evidence]

### Impact Assessment
- Users affected: [Number or scope]
- Workaround available: [Yes — describe / No]
- Data integrity risk: [Yes / No]

### Root Cause (After Investigation)
[What caused this? Which component, which logic, which data condition?]

### Fix Applied
[What was changed to resolve it?]

### Prevention
[What process or check should prevent recurrence?]
```

---

## 3. Bug Triage Process

### Triage Workflow

```
Bug Reported
    |
[1] Dev assigns severity (S0-S3)
    |
[2] S0/S1? → Notify Shubham immediately → Begin investigation
    S2/S3? → Add to sprint backlog with priority tag
    |
[3] Investigate → Identify root cause → Estimate fix effort
    |
[4] Fix on staging → Verify fix → Run regression on affected area
    |
[5] Deploy to production → Monitor for 30 minutes
    |
[6] Close bug → Update changelog → Save root cause as learning (if pattern)
```

### Triage Rules

- **S0 bugs interrupt everything.** Current sprint work pauses until S0 is resolved.
- **S1 bugs take priority over P2+ features** in the current sprint. P0 and P1 features remain unless capacity requires trade-off.
- **S2 bugs enter the next sprint backlog** at P2 priority unless 3+ S2 bugs accumulate on the same component — then investigate for a systemic issue.
- **S3 bugs are batched.** Collect cosmetic fixes and address them in a dedicated polish pass once per phase.
- **Duplicate bugs are merged.** If the same bug is reported multiple times, merge reports and increase severity if impact is wider than initially assessed.

---

## 4. Release Types

| Type | Trigger | Process | Approver |
|------|---------|---------|----------|
| **Hotfix** | S0/S1 bug in production | Fix → Test → Deploy immediately → Post-mortem | Shubham (verbal OK) |
| **Sprint Release** | End of each sprint | Sprint review → Staging test → Deploy → Changelog | Dev confirms DoD |
| **Phase Release** | End of major phase | Full regression → Staging → Stakeholder demo → Deploy | Shubham + Founders |

---

## 5. Release Checklist

### Pre-Deploy

- [ ] All sprint tasks marked Done (meeting Definition of Done)
- [ ] No open S0 or S1 bugs
- [ ] Code reviewed (Shubham self-review or paired with Ananya)
- [ ] Staging deployment successful
- [ ] Core flows smoke-tested on staging:
  - [ ] Login / authentication
  - [ ] Send message / receive agent response
  - [ ] Agent delegation (@mention at least 2 agents)
  - [ ] Memory write and read (Sage extraction)
  - [ ] Approval request / approve / reject
  - [ ] File upload (at least 1 file type)
  - [ ] Task create / complete
- [ ] Database backup verified (Kaiser daily backup current)
- [ ] No pending approval queue items that would break during deploy
- [ ] Arush notified if user-facing changes need documentation

### Deploy

- [ ] Deploy to production
- [ ] Verify deployment completed without errors

### Post-Deploy

- [ ] Production smoke test (same core flows as staging)
- [ ] Monitor error logs for 30 minutes
- [ ] Check system health (Kaiser health score)
- [ ] Verify no budget_exhausted agents caused by deployment
- [ ] Update changelog
- [ ] Notify Founders of release
- [ ] Notify Arush for documentation updates if applicable

---

## 6. Changelog Template

```markdown
## [Version] — [DD Month YYYY]

### Added
- [New feature: what it does and why it matters]

### Changed
- [Modification: what was different before, what is different now]

### Fixed
- [Bug fix: what was broken, what was the impact, how it was resolved]

### Removed
- [Removed feature or deprecated item: why it was removed]

### Security
- [Security-related changes: what was the risk, how it was addressed]

### Known Issues
- [Any known issues in this release: workaround if available]
```

### Changelog Rules
- Written for humans, not machines — explain impact, not just code changes
- Every bug fix references the severity (S0/S1/S2/S3)
- Security changes always get their own section
- Changelogs are permanent records — never edited after publication (corrections go in the next version)

---

## 7. Hotfix Procedure

When an S0 or S1 bug is discovered in production:

1. **Confirm** — Reproduce the issue. Verify it is not a user error or transient failure.
2. **Assess** — What is the blast radius? How many users are affected? Is data at risk?
3. **Notify** — Alert Shubham immediately. If data loss risk: also alert Kaiser and Founders.
4. **Isolate** — Identify the root cause. Determine the minimal change needed.
5. **Fix** — Apply the minimal fix. No feature work bundled into a hotfix — fix only the bug.
6. **Test** — Verify on staging. Run the specific smoke test for the affected area.
7. **Deploy** — Push to production. Monitor closely for 30 minutes.
8. **Communicate** — Notify Founders, update changelog, inform affected users if applicable.
9. **Post-Mortem** — Within 24 hours, document: what happened, root cause, fix applied, how to prevent recurrence. Save as a process memory.

### Hotfix Post-Mortem Template

```markdown
## Hotfix Post-Mortem: [Brief Description]

**Date:** [Date]
**Severity:** S[0/1]
**Duration:** [Time from discovery to fix deployed]
**Users Affected:** [Scope]

### What Happened
[Timeline of events]

### Root Cause
[Technical explanation of why this occurred]

### Fix Applied
[What was changed]

### Prevention
[What process, test, or check would prevent this in the future]

### Action Items
- [ ] [Prevention action] — Owner: [Who] — By: [When]
```

---

**Cross-references:**
- For features being balanced against bug work: see `Dev — KB — Feature Backlog & Prioritization.md`
- For sprint planning that allocates bug capacity: see `Dev — KB — Sprint Planning Framework.md`
- For metrics that trigger bug investigation: see `Dev — KB — Product Metrics & KPIs.md`
- For documentation updates after releases: coordinate with Arush

*Bugs are not failures — they are feedback. The goal is not zero bugs (unrealistic) but fast triage, clean fixes, and learning that prevents recurrence. Every hotfix post-mortem should make the next one less likely.*
