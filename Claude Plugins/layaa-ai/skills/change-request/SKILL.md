---
name: change-request
description: >
  Document and manage change requests for projects, processes, or systems. Includes impact
  assessment, approval workflow, and implementation tracking. In Layaa AI mode, re-prices
  scope changes using the pricing engine and routes approvals through governance hierarchy.
  Trigger: "change request", "scope change", "change order", "CR", "modification request", "change impact"
  This skill replaces the generic operations:change-request capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Change Request

Document and manage change requests for projects, processes, or systems. Includes structured impact assessment, approval workflow, and implementation tracking.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, client engagements, automation projects, scope changes, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/delivery-methodology.md — 5-stage delivery methodology and stage gates
- domain-references/operations/qa-validation.md — Validation requirements for scope changes
- domain-references/finance/pricing-engine.md — Pricing model for re-scoping
- shared-references/revenue-model.md — Implementation fees, retainer tiers, minimum viable budget
- shared-references/service-verticals.md — Service offerings and methodology
Only load references relevant to the change request type.

## Execution Steps

### Step 1: Document the Change Request
Collect or ask for:
- **CR Identifier:** Auto-generate (CR-[YYYY]-[NNN])
- **Requested by:** Name, role, organization (internal or client)
- **Date submitted:** When the request was made
- **Project/engagement:** Which project or process this affects
- **Current delivery stage:** Where in the lifecycle is the project? (For Layaa AI: Discovery / Assessment / Development / Validation / Enablement)
- **Change description:** What is being requested — be specific
- **Reason for change:** Why is this change needed (new requirement, defect, improvement, external factor)?
- **Priority:** URGENT (blocking progress) / HIGH (needed this sprint) / MEDIUM (next sprint) / LOW (backlog)

### Step 2: Classify the Change Type
Categorize the change:

| Type | Definition | Typical Impact | Approval Level |
|------|-----------|---------------|---------------|
| **Scope Addition** | New feature, workflow, or integration not in original scope | Timeline + cost increase | Technical → Pricing → Founders |
| **Scope Reduction** | Removing planned features or simplifying requirements | Potential cost reduction | Technical → Client agreement |
| **Scope Modification** | Changing how an existing requirement is implemented | Variable | Technical review |
| **Defect Fix** | Correcting something that does not work as specified | Covered under warranty/SLA | Technical only |
| **Process Change** | Altering internal procedures or workflows | Operational impact | Process owner → Kabir |
| **Timeline Change** | Extending or compressing delivery schedule | Resource reallocation | Technical → Founders if >1 week |
| **Technology Change** | Switching tools, platforms, or architecture approach | Technical risk + potential cost | Technical → Founders |

### Step 3: Assess Impact
Evaluate the change across all dimensions:

**Scope Impact:**
- What deliverables are added, removed, or modified?
- How does this affect the project scope document or SOW?
- Are there downstream effects on other deliverables?

**Timeline Impact:**
- How many additional days/sprints are required?
- Does this shift the project end date?
- Are there milestone dependencies affected?
- For Layaa AI: does this affect the current delivery stage or require revisiting a previous stage?

**Cost Impact:**
- What is the estimated additional cost (or savings)?
- For Layaa AI: use pricing engine to calculate
  - Additional implementation hours x rate
  - Any new tool/platform costs
  - Impact on monthly retainer tier
  - Calculate cost impact as percentage of original engagement value

**Risk Impact:**
- Does this introduce new technical risks?
- Does this affect data handling or compliance?
- Are there dependency risks (new integrations, third-party services)?
- For Layaa AI: run through Rohit's (QA & Validation Specialist) feasibility checklist

**Resource Impact:**
- Does this require additional skills or expertise?
- Does this affect team allocation or availability?
- Are external resources needed?

**Quality Impact:**
- Does this affect testing requirements?
- Are additional validation steps needed?
- Does this change acceptance criteria?

### Step 4: Re-Price if Scope Change Affects Implementation (Layaa AI Mode)
For scope additions or modifications that affect cost:

1. **Calculate additional effort:**
   - Discovery/Assessment hours needed for new scope
   - Development hours for implementation
   - Testing/validation hours
   - Enablement/documentation hours

2. **Apply pricing model:**
   - Implementation fee adjustment = additional hours x applicable rate
   - Retainer tier reassessment (does the change push into a higher tier?)
   - Minimum viable budget check (is the change below the minimum threshold of 50k?)

3. **Prepare commercial proposal:**
   - Original contract value
   - Change request value (additional or reduction)
   - Revised total contract value
   - Payment terms for the change (50% upfront for additions, as per standard)

### Step 5: Route for Approval
Follow the approval workflow:

**Approval Matrix:**
| Change Type | Cost Impact | Approval Required |
|-------------|------------|------------------|
| Defect fix | None | Technical lead only |
| Any change | <5% of contract value | Technical lead + Project manager |
| Scope change | 5-10% of contract value | Technical + Pricing (Veer) + Kabir |
| Scope change | >10% of contract value | Technical + Pricing + Founders |
| Technology change | Any | Technical + Founders |
| Timeline extension | >1 week | Technical + Founders |
| Client-facing change | Any | Client approval required |

**For Layaa AI approval flow:**
1. **Technical review:** Ujjwal (Automation Architect) assesses technical feasibility
2. **Feasibility validation:** Rohit (QA & Validation Specialist) validates scope
3. **Pricing review:** Veer (Pricing & Unit Economics Specialist) validates commercial impact
4. **Strategic review:** Kabir (Executive Strategy Orchestrator) for cross-functional impact
5. **Founder approval:** Required for >10% cost impact or technology changes
6. **Client approval:** Required for all client-facing changes, scope additions, or timeline extensions

### Step 6: Track Implementation
Once approved, track the change through implementation:

1. **Update project documentation:**
   - Revised scope document / SOW amendment
   - Updated timeline and milestones
   - Revised resource allocation
   - Updated risk register

2. **Implementation tracking:**
   - Break change into tasks
   - Assign to team members
   - Set intermediate checkpoints
   - Track against estimated effort

3. **Validation:**
   - Verify change is implemented as specified
   - Confirm acceptance criteria are met
   - Get sign-off from requestor
   - Update project status

## Output Format

```
# Change Request
**CR ID:** CR-[YYYY]-[NNN]
**Date Submitted:** [date]
**Project/Engagement:** [project name]
**Current Stage:** [Discovery / Assessment / Development / Validation / Enablement]
**Requested by:** [name, role, organization]
**Priority:** [URGENT / HIGH / MEDIUM / LOW]

## Change Description
**What:** [clear description of the requested change]
**Why:** [business justification and reason for change]
**Type:** [Scope Addition / Reduction / Modification / Defect / Process / Timeline / Technology]

## Impact Assessment

### Scope Impact
- **Deliverables affected:** [list]
- **New deliverables:** [list or "None"]
- **Removed deliverables:** [list or "None"]
- **Downstream effects:** [description]

### Timeline Impact
- **Additional time required:** [days/sprints]
- **Original end date:** [date]
- **Revised end date:** [date]
- **Milestone changes:** [list affected milestones]

### Cost Impact
- **Original contract value:** [amount]
- **Change value:** [+/- amount]
- **Revised contract value:** [amount]
- **Cost impact percentage:** [%]
- **Payment terms:** [terms for the change]

### Risk Impact
| New Risk | Probability | Impact | Mitigation |
|----------|------------|--------|------------|
| [risk] | [L/M/H] | [L/M/H] | [mitigation] |

### Resource Impact
- **Additional resources needed:** [description]
- **Reallocation required:** [yes/no, details]

## Approval Workflow
| Step | Approver | Status | Date | Comments |
|------|----------|--------|------|----------|
| Technical Review | [name/role] | [Pending/Approved/Rejected] | [date] | [comments] |
| Feasibility Validation | [name/role] | [Pending/Approved/Rejected] | [date] | [comments] |
| Pricing Review | [name/role] | [Pending/Approved/Rejected] | [date] | [comments] |
| Strategic Review | [name/role] | [Pending/Approved/Rejected] | [date] | [comments] |
| Founder Approval | [name] | [Pending/Approved/Rejected] | [date] | [comments] |
| Client Approval | [name] | [Pending/Approved/Rejected] | [date] | [comments] |

**Overall Status:** [PENDING / APPROVED / REJECTED / DEFERRED]

## Implementation Plan (if approved)
| Task | Owner | Start | End | Status |
|------|-------|-------|-----|--------|
| [task] | [owner] | [date] | [date] | [status] |

## SOW Amendment Required
- [ ] Yes — draft amendment attached / to be prepared
- [ ] No — within existing scope tolerance

## Sign-off
- [ ] Change implemented as specified
- [ ] Acceptance criteria met
- [ ] Requestor sign-off received
- [ ] Project documentation updated
```

## What Makes This Different from Generic Change Request
- Integrates with Layaa AI's 5-stage delivery methodology to assess stage-specific impact
- Re-prices scope changes using Layaa AI's pricing engine (implementation fees, retainer tiers, minimum viable budget)
- Routes approvals through Layaa AI's governance hierarchy with cost-based escalation thresholds
- Uses Rohit's feasibility validation for scope changes and Ujjwal's technical assessment
- Applies standard Layaa AI commercial terms (50% upfront for additions)
- Maps change types to Layaa AI's service verticals and delivery methodology
- Tracks changes through implementation with stage-gate validation
