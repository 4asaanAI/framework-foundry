---
name: process-doc
description: >
  Create process documentation including SOPs, workflows, runbooks, and procedure guides.
  Documents current-state and future-state processes with clear steps, ownership, and metrics.
  In Layaa AI mode, aligns with the 5-stage delivery methodology and automation architecture patterns.
  Trigger: "process doc", "SOP", "standard operating procedure", "process documentation", "workflow document", "procedure guide", "document this process"
  This skill replaces the generic operations:process-doc capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Process Documentation

Create process documentation including SOPs, workflows, runbooks, and procedure guides. Documents current-state and future-state processes with clear steps, ownership, decision points, and metrics.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, internal operations, client delivery, GPT workforce processes, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/delivery-methodology.md — 5-stage delivery methodology
- domain-references/operations/automation-architecture.md — Workflow design patterns and architecture standards
- shared-references/service-verticals.md — Service offerings and methodology
- shared-references/company-identity.md — Company basics
Only load references relevant to the process being documented.

## Execution Steps

### Step 1: Identify Process to Document
Collect or ask for:
- **Process name:** Clear, descriptive title
- **Process type:**
  - SOP (Standard Operating Procedure) — recurring operational task
  - Workflow — multi-step, multi-actor business process
  - Runbook — technical procedure for operators (see runbook skill for detailed runbooks)
  - Playbook — strategic procedure with decision frameworks
  - Checklist — sequential verification steps
- **Scope:** What does this process cover and what is excluded?
- **Current state:** Is this documenting an existing process or designing a new one?
- **Audience:** Who will use this document (technical team, operations, clients, all staff)?
- **For Layaa AI:** Which delivery stage does this process belong to (Discovery / Assessment / Development / Validation / Enablement) or is it cross-cutting (operations, governance)?

### Step 2: Gather Information
Collect process details through:

1. **Existing documentation:** Search workspace for related docs, previous versions, notes
   - Use Glob to find related files (`*[process-name]*`, `*SOP*`, `*procedure*`)
   - Use Grep to find references to the process in other documents
2. **Process observation:** If documenting an existing process, trace the actual steps
3. **Stakeholder input:** Identify who performs each step and interview/consult
4. **Exception cases:** Document what happens when things go wrong
5. **For Layaa AI:** Check if Nia (Campaign & Funnel Execution Coordinator) has existing SOPs related to this process

### Step 3: Map Process Steps
For each step in the process, document:

| Element | Description |
|---------|------------|
| **Step number** | Sequential identifier |
| **Step name** | Clear action verb + object (e.g., "Validate client requirements") |
| **Description** | Detailed instructions for performing the step |
| **Input** | What is needed to start this step (data, documents, approvals) |
| **Output** | What this step produces (deliverable, decision, status change) |
| **Owner** | Who is responsible for executing this step |
| **Tools** | Systems, software, or tools used |
| **Time estimate** | Expected duration |
| **Quality criteria** | How to verify the step was done correctly |

### Step 4: Add Decision Points and Exception Handling
For each decision point in the process:

1. **Decision question:** What question is being answered?
2. **Decision criteria:** What information is used to decide?
3. **Options:** What are the possible outcomes?
4. **Path for each option:** Where does the process go next?
5. **Escalation criteria:** When should the decision be escalated?

For exception handling:
1. **Exception type:** What can go wrong at this step?
2. **Detection method:** How is the exception identified?
3. **Response:** What to do when the exception occurs
4. **Escalation:** When and to whom to escalate
5. **Recovery:** How to get back on the main process path

**For Layaa AI:** Align decision points with governance rules:
- Operational decisions → Process owner
- Cross-functional decisions → Kabir (Executive Strategy Orchestrator)
- Strategic/financial decisions → Founders
- Memory-impacting decisions → Kabir approval + Founder ratification

### Step 5: Build RACI Matrix
For each step, assign roles:

| Step | Responsible | Accountable | Consulted | Informed |
|------|-----------|-------------|-----------|----------|
| [step] | [who does it] | [who owns it] | [who provides input] | [who needs to know] |

**For Layaa AI role mapping:**
- Map to GPT workforce roles using canonical titles
- Map to human stakeholders (Founders, external partners, clients)
- Ensure escalation paths align with org chart hierarchy

### Step 6: Define Metrics and SLAs
For the overall process and key steps:

**Process-level metrics:**
- Cycle time (end-to-end duration)
- Throughput (completions per period)
- Error/rework rate
- Customer satisfaction (if client-facing)
- Cost per execution

**Step-level SLAs:**
| Step | Target Time | Maximum Time | Escalation if Exceeded |
|------|------------|-------------|----------------------|
| [step] | [target] | [max] | [who to notify] |

**For Layaa AI:** Align metrics with delivery methodology stage expectations and client SLA commitments.

### Step 7: Format as SOP with Version Control
Assemble the complete document with proper structure and version tracking:

1. **Header and metadata** — title, version, dates, owner
2. **Purpose and scope** — why this process exists, what it covers
3. **Prerequisites** — what must be in place before starting
4. **Step-by-step procedure** — the detailed process map
5. **RACI matrix** — role assignments
6. **Decision points** — branching logic
7. **Exception handling** — what-if scenarios
8. **Metrics and SLAs** — performance standards
9. **Appendices** — templates, checklists, reference material
10. **Version history** — change log

## Output Format

```
# [Process Name] — Standard Operating Procedure
**Document ID:** SOP-[domain]-[NNN]
**Version:** [X.Y]
**Effective Date:** [date]
**Last Updated:** [date]
**Owner:** [name/role]
**Approved by:** [name/role]
**Classification:** [INTERNAL / CONFIDENTIAL / CLIENT-FACING]
**Review Cycle:** [quarterly / annually / on change]

## Purpose
[1-2 sentences explaining why this process exists and what business objective it serves]

## Scope
- **In scope:** [what this process covers]
- **Out of scope:** [what this process does NOT cover]
- **Related processes:** [links to related SOPs or workflows]

## Prerequisites
Before starting this process, ensure:
- [ ] [prerequisite 1 — access, tools, knowledge]
- [ ] [prerequisite 2]
- [ ] [prerequisite 3]

## Definitions
| Term | Definition |
|------|-----------|
| [term] | [definition] |

## Process Flow Description
[Text description of the overall process flow — start trigger, major phases, end state]

## Detailed Procedure

### Step 1: [Action Verb + Object]
- **Owner:** [role]
- **Input:** [what is needed]
- **Instructions:**
  1. [detailed instruction]
  2. [detailed instruction]
  3. [detailed instruction]
- **Output:** [what this step produces]
- **Quality check:** [how to verify correctness]
- **Time:** [estimated duration]

> **Decision Point:** [If condition X, go to Step 2a. If condition Y, go to Step 2b.]

### Step 2a: [Action if X]
[Same structure as above]

### Step 2b: [Action if Y]
[Same structure as above]

### Step 3: [Next Step]
[Continue pattern]

## RACI Matrix
| Step | Responsible | Accountable | Consulted | Informed |
|------|-----------|-------------|-----------|----------|
| Step 1 | [role] | [role] | [role] | [role] |
| Step 2 | [role] | [role] | [role] | [role] |
| Step 3 | [role] | [role] | [role] | [role] |

## Exception Handling
### Exception 1: [Exception Name]
- **Trigger:** [what causes this exception]
- **Detection:** [how it is identified]
- **Response:**
  1. [action]
  2. [action]
- **Escalation:** [when and to whom]
- **Recovery:** [how to return to normal flow]

### Exception 2: [Exception Name]
[Same structure]

## Metrics and SLAs
| Metric | Target | Measurement Method | Review Frequency |
|--------|--------|-------------------|-----------------|
| Cycle time | [target] | [how measured] | [frequency] |
| Throughput | [target] | [how measured] | [frequency] |
| Error rate | [target] | [how measured] | [frequency] |

| Step | Target Time | Maximum Time | Escalation |
|------|------------|-------------|------------|
| [step] | [target] | [max] | [who] |

## Templates and Checklists
[Include any templates, forms, or checklists referenced in the procedure]

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| [X.Y] | [date] | [author] | [what changed] |
| [X.0] | [date] | [author] | Initial version |
```

## What Makes This Different from Generic Process Documentation
- Aligns with Layaa AI's 5-stage delivery methodology (Discovery → Assessment → Development → Validation → Enablement)
- Maps RACI roles to Layaa AI's GPT workforce using canonical role titles
- Decision points follow Layaa AI's governance hierarchy and escalation rules
- Exception handling routes through the established escalation path (Process Owner → Kabir → Founders)
- Integrates with Nia's SOP management and campaign execution framework
- Metrics align with Layaa AI's client SLA commitments and delivery standards
- Automation architecture patterns inform process design for workflows involving n8n, Make, or Relevance AI
