---
name: write-spec
description: >
  Write product specifications, requirements documents, and feature briefs. Translates business
  needs into technical requirements with acceptance criteria and success metrics. In Layaa AI mode,
  frames specs within the delivery methodology and automation architecture patterns.
  Trigger: "write spec", "product spec", "requirements document", "feature brief", "PRD",
  "acceptance criteria". This skill replaces the generic product:write-spec capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Write Spec

Write product specifications, requirements documents, and feature briefs that translate business needs into technical requirements with acceptance criteria and success metrics.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

**Layaa AI product context:** Layaa AI does not have a traditional SaaS product. "Product" means service offerings, pre-built automation modules, AI agent capabilities, and the overall platform/methodology. Specs should reflect this service-as-product model.

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/service-verticals.md — Five service verticals and methodology
- shared-references/company-identity.md — Company basics and positioning
- domain-references/operations/delivery-methodology.md — Discovery → Assessment → Development → Validation → Enablement
- domain-references/operations/automation-architecture.md — 7-stage workflow pattern, n8n/Bolt AI/Relevance AI patterns
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Gather Requirements
Collect requirements from the user:
1. Ask for the business problem or opportunity being addressed
2. Identify the target user/client and their pain points
3. Determine scope — is this a new offering, a feature addition, or an improvement?
4. Identify any constraints (timeline, budget, technology, team capacity)
5. Gather any existing context (client conversations, discovery notes, competitive triggers)

If the user provides incomplete information, ask clarifying questions before proceeding.

### Step 2: Frame Within Delivery Context (Layaa AI Mode)
For Layaa AI, align the spec with the delivery methodology:
- **Which methodology stage does this feature support?** (Discovery, Assessment, Development, Validation, Enablement)
- **Which service vertical does it belong to?** (Education, Consulting, Automation Dev, Maintenance, Pre-built)
- **Is this a reusable module or a custom delivery?** Pre-built modules should be designed for repeatability across ICP segments
- **Does it follow automation architecture patterns?** Reference the 7-stage workflow pattern where applicable (Trigger → Input Validation → Data Enrichment → Processing → Output Formatting → Delivery → Logging)

### Step 3: Define User Stories / Jobs-to-Be-Done
Translate requirements into structured user stories:
- **Format:** "As a [user type], I want to [action] so that [outcome]"
- Group user stories by theme or workflow area
- Prioritize using MoSCoW (Must have, Should have, Could have, Won't have this time)
- For Layaa AI: frame from both the client perspective (the SME using the automation) and the delivery team perspective (the builder implementing it)

### Step 4: Specify Functional Requirements
For each user story, detail:
- **Inputs:** What data or actions trigger the feature
- **Processing:** What the system does with the input
- **Outputs:** What the user sees or receives
- **Edge cases:** What happens when inputs are invalid, missing, or unexpected
- **Integrations:** What external systems are involved (APIs, CRMs, databases)
- For Layaa AI: specify which tools in the tech stack handle each function (n8n, Relevance AI, Make, Zapier, custom code)

### Step 5: Specify Non-Functional Requirements
Define quality attributes:
- **Performance:** Response times, throughput, concurrency limits
- **Security:** Authentication, authorization, data handling, encryption requirements
- **Scalability:** Expected load, growth projections, scaling approach
- **Reliability:** Uptime requirements, error handling, recovery procedures
- **Compliance:** Data privacy (DPDP Act for India), regulatory requirements
- **Monitoring:** Logging, alerting, health check requirements
- For Layaa AI: align with the error handling and security patterns from automation architecture

### Step 6: Define Acceptance Criteria
For each functional requirement, write testable acceptance criteria:
- **Given** [precondition], **When** [action], **Then** [expected result]
- Include both happy path and failure scenarios
- Specify data validation rules
- Define performance thresholds where applicable
- For Layaa AI: include criteria for the 7-stage workflow pattern stages where applicable (e.g., "Given an invalid input, when the Input Validation stage runs, then the workflow logs the error and notifies the operator")

### Step 7: Add Technical Constraints and Dependencies
Document:
- **Technology constraints:** Required platforms, languages, or tools
- **Dependencies:** Other features, services, or third-party systems that must be in place
- **API requirements:** Endpoints, authentication, rate limits, data formats
- **Data requirements:** Schema, migration needs, storage considerations
- **Environment requirements:** Hosting, infrastructure, deployment needs
- For Layaa AI: reference the tech stack (n8n for orchestration, Relevance AI for agent logic, etc.)

### Step 8: Define Success Metrics
Establish how success will be measured:
- **Adoption metrics:** Usage rates, activation, feature engagement
- **Performance metrics:** Speed, accuracy, reliability improvements
- **Business metrics:** Revenue impact, cost reduction, time saved
- **Client satisfaction metrics:** NPS, support ticket reduction, renewal rates
- For Layaa AI: tie to delivery methodology outcomes (e.g., "Reduces Discovery phase duration by 30%", "Enables pre-built module deployment in <2 hours")

## Output Format

```
# Product Specification: [Feature/Product Name]
**Version:** [version]
**Date:** [date]
**Author:** [name]
**Status:** [Draft / In Review / Approved]

## Overview
**Problem Statement:** [What problem does this solve?]
**Objective:** [What does success look like?]
**Target User:** [Who benefits from this?]
**Service Vertical:** [Education / Consulting / Automation Dev / Maintenance / Pre-built] (Layaa AI mode)
**Methodology Stage:** [Discovery / Assessment / Development / Validation / Enablement] (Layaa AI mode)
**Scope:** [What is in scope and out of scope]

## User Stories

### Must Have
| ID | User Story | Priority | Notes |
|----|-----------|----------|-------|
| US-001 | As a [user], I want to [action] so that [outcome] | Must | [context] |
| US-002 | As a [user], I want to [action] so that [outcome] | Must | [context] |

### Should Have
| ID | User Story | Priority | Notes |
|----|-----------|----------|-------|
| US-003 | As a [user], I want to [action] so that [outcome] | Should | [context] |

### Could Have
| ID | User Story | Priority | Notes |
|----|-----------|----------|-------|
| US-004 | As a [user], I want to [action] so that [outcome] | Could | [context] |

## Functional Requirements

### [Feature Area 1]
| ID | Requirement | User Story | Details |
|----|------------|------------|---------|
| FR-001 | [requirement] | US-001 | [input/process/output details] |
| FR-002 | [requirement] | US-001 | [input/process/output details] |

### [Feature Area 2]
| ID | Requirement | User Story | Details |
|----|------------|------------|---------|
| FR-003 | [requirement] | US-002 | [input/process/output details] |

## Non-Functional Requirements
| ID | Category | Requirement | Target |
|----|----------|------------|--------|
| NFR-001 | Performance | [requirement] | [threshold] |
| NFR-002 | Security | [requirement] | [standard] |
| NFR-003 | Scalability | [requirement] | [capacity] |
| NFR-004 | Reliability | [requirement] | [uptime %] |
| NFR-005 | Compliance | [requirement] | [regulation] |

## Acceptance Criteria

### FR-001: [Requirement Name]
- [ ] Given [precondition], When [action], Then [expected result]
- [ ] Given [failure condition], When [action], Then [error handling]
- [ ] Given [edge case], When [action], Then [graceful degradation]

### FR-002: [Requirement Name]
- [ ] Given [precondition], When [action], Then [expected result]

## Technical Constraints and Dependencies
| Type | Description | Impact | Status |
|------|------------|--------|--------|
| Dependency | [system/feature required] | [blocker / nice-to-have] | [available / pending] |
| Constraint | [technology limitation] | [how it affects design] | [fixed / negotiable] |
| Integration | [API/service needed] | [data flow description] | [available / to be built] |

## Success Metrics
| Metric | Current Baseline | Target | Measurement Method | Timeline |
|--------|-----------------|--------|-------------------|----------|
| [metric] | [current] | [target] | [how measured] | [when] |
| [metric] | [current] | [target] | [how measured] | [when] |

## Open Questions
1. [Question that needs resolution before development]
2. [Question that needs resolution before development]

## Appendix
- [Links to related documents, mockups, or reference materials]
```

## What Makes This Different from Generic Spec Writing
- Frames specifications within Layaa AI's 5-stage delivery methodology (Discovery → Enablement)
- Maps features to Layaa AI's five service verticals for portfolio alignment
- Incorporates the 7-stage workflow pattern (Trigger → Logging) for automation specs
- Distinguishes between reusable pre-built modules and custom client deliveries
- References Layaa AI's specific tech stack (n8n, Relevance AI, Make, Zapier)
- Includes dual-perspective user stories (client SME and delivery team builder)
- Applies Indian regulatory context (DPDP Act) for compliance requirements
- Ties success metrics to delivery methodology outcomes and service efficiency
