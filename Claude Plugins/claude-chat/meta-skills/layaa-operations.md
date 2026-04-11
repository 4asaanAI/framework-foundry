---
name: layaa-operations
description: >
  Layaa AI Operations skill group. Use for: risk assessment, process documentation,
  process optimization, operational runbooks, status reports, client onboarding,
  vendor review, capacity planning, compliance tracking, and change requests.
  Applies Layaa AI's delivery methodology. Works for Layaa AI and general ops tasks.
user-invocable: true
---

# Layaa Operations — Skill Group

## Available Sub-Skills

| Sub-Skill | When to Use |
|-----------|------------|
| **risk-assessment** | Identify, assess, and mitigate operational risks |
| **process-doc** | Document a business process — flowcharts, RACI, SOPs |
| **process-optimization** | Analyse and improve business processes |
| **runbook** | Create or update an operational runbook |
| **status-report** | Generate status report with KPIs, risks, and action items |
| **client-onboarding** | Structured client onboarding workflow post-deal-close |
| **vendor-review** | Evaluate a vendor — cost, risk, recommendation |
| **capacity-plan** | Plan resource capacity and workload analysis |
| **compliance-tracking** | Track compliance requirements and audit readiness |
| **change-request** | Create a change management request with impact analysis |

## How to Use
- "Document our client onboarding process as an SOP" → **process-doc**
- "Onboard new client TechFlow Logistics" → **client-onboarding**
- "Review our dependency on Make (Integromat)" → **vendor-review**
- "Create a runbook for our monthly n8n workflow check" → **runbook**

---

## Context Detection
- **Layaa AI mode:** Mention Layaa AI, our clients/projects, delivery methodology → apply Layaa AI ops context from Project Knowledge
- **General mode:** Different company → standard operations assistant

---

## Layaa AI Operations Context (Quick Reference)

**Delivery Methodology:** Discovery → Assessment → Development → Validation → Enablement
**Tech stack:** n8n, Make, Zapier, Relevance AI, Bolt AI (prototyping only)
**Risk categories:** Data | Technical | Process | Compliance | Commercial
**Client onboarding:** Contract signed + 50% advance → kickoff within 3 business days → discovery scheduling → stakeholder map → access setup → communication cadence

---

## Sub-Skill Execution

### client-onboarding
1. Take: client name, project type, contract value, key contacts
2. Generate onboarding checklist:
   - Contract signed, 50% advance invoice sent
   - Internal project channel created
   - Kickoff meeting scheduled (within 3 business days)
   - Client added to project management tool
   - Discovery sessions booked
   - Stakeholder map created (client champion / technical contact / approver / end users)
   - Access requirements identified
   - Communication cadence agreed (weekly check-in, delivery reviews)
3. Draft kickoff meeting agenda (60 min: intros, overview, expectations, discovery scheduling, access, Q&A)
4. Draft welcome email with next steps
5. Set up project timeline with milestones

### risk-assessment
1. Identify scope (project, process, or organisational)
2. List risks across 5 categories: Data | Technical | Process | Compliance | Commercial
3. Score each: Severity (H/M/L) × Likelihood (H/M/L) → Risk Rating
4. Build risk register: risk → impact → likelihood → rating → mitigation → owner → review date
5. Flag: immediate actions for HIGH risks, monitoring plan for MEDIUM

### process-doc
1. Identify: process name, purpose, frequency, owner, trigger
2. Map: inputs → steps → decision points → outputs → exceptions
3. Create: process flowchart (described), RACI matrix (Responsible/Accountable/Consulted/Informed), SOP (numbered steps with conditions and examples)
4. Flag: manual steps that could be automated, bottlenecks, single points of failure

### process-optimization
1. Map current process (as-is) from input provided
2. Identify: bottlenecks, handoff failures, redundancies, automation opportunities
3. Design to-be process with specific improvements
4. Estimate impact: time saved, error reduction, cost impact
5. Recommend implementation sequence (quick wins first, then structural changes)

### runbook
1. Define: process name, trigger conditions, frequency, owner
2. Build structure: Purpose → Prerequisites → Step-by-step instructions (numbered) → Decision trees (IF/THEN) → Error handling → Escalation paths → Version history
3. Include: common errors and fixes, key contacts for escalation, rollback steps if applicable
4. Format: numbered steps, bold key actions, clear conditionals

### status-report
1. Gather: project/period, KPIs, milestones, risks, issues, upcoming tasks
2. Structure: Executive summary (1 para) → KPI table with RAG status → Milestones (completed/upcoming) → Risks & Issues → Actions → Next period plan
3. RAG status: 🟢 On track | 🟡 At risk | 🔴 Off track
4. Keep concise — executive-readable in under 2 minutes

### vendor-review
1. Identify vendor and context for review
2. Assess: cost (total cost of ownership), reliability (uptime, SLAs), risk (vendor concentration, data handling, switching cost), alternatives available
3. Score: cost efficiency, reliability, strategic fit, switching cost, compliance posture
4. Recommend: retain / renegotiate / replace (with timeline and transition steps)

### capacity-plan
1. Gather: team members, roles, current projects, hours available per week
2. Map: workload per person (current + upcoming commitments)
3. Identify: over-utilised (>80% capacity), under-utilised (<40%), upcoming bottlenecks (next 4-8 weeks)
4. Recommend: rebalancing, hiring signal, outsource options

### compliance-tracking
1. Build compliance calendar: GST returns, TDS, MCA filings, DPIIT reporting, MSME Form I
2. Status for each: Compliant / Due soon (within 30 days) / Overdue
3. Assign owners and due dates
4. Flag: overdue (immediate action), due within 30 days (urgent), due within 90 days (plan)
5. Reference Project Knowledge for Layaa AI-specific filing calendar

### change-request
1. Define: change description, reason/business case, scope, requested by, urgency
2. Impact analysis: who is affected, what changes operationally, timeline impact, cost impact, risk introduced
3. Approval requirements: who needs to sign off based on scope and cost
4. Rollback plan: how to reverse if the change causes issues
5. Communication plan: who needs to be notified and when
