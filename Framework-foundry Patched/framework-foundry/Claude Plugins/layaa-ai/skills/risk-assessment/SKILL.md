---
name: risk-assessment
description: >
  Identify, assess, and prioritize operational risks. Creates risk registers with probability-impact
  scoring, mitigation strategies, and monitoring plans. In Layaa AI mode, uses Rohit's risk scoring
  matrix and delivery methodology risk categories.
  Trigger: "risk assessment", "risk register", "risk analysis", "identify risks", "risk matrix", "risk scoring"
  This skill replaces the generic operations:risk-assessment capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Risk Assessment

Identify, assess, and prioritize operational risks across technical, business, data, dependency, and timeline categories. Produces a scored risk register with mitigation strategies, owners, and monitoring triggers.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), client delivery, n8n workflows, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/qa-validation.md — Rohit's risk scoring matrix, feasibility assessment framework
- domain-references/operations/delivery-methodology.md — 5-stage delivery methodology risk points
- domain-references/legal/risk-indicators.md — Legal and compliance risk thresholds
- shared-references/company-identity.md — Company basics and entity context
- shared-references/service-verticals.md — Service offerings and delivery dependencies
Only load references relevant to the specific risk scope.

## Execution Steps

### Step 1: Define Risk Assessment Scope
Collect or ask for:
- **Subject:** What is being assessed (project, process, system, initiative, client engagement)?
- **Boundaries:** What is in/out of scope?
- **Stakeholders:** Who is affected and who should be consulted?
- **Time horizon:** Near-term (sprint/month), medium-term (quarter), long-term (year)?
- **Trigger:** Why is this assessment being done now (new project, incident, periodic review, client request)?

### Step 2: Identify Risks Across Categories
Systematically identify risks in each category:

**Technical Risks:**
- Architecture complexity, single points of failure
- Integration dependencies (APIs, third-party services)
- Technology maturity and support lifecycle
- Performance and scalability limitations
- Security vulnerabilities and attack surface
- For Layaa AI: n8n workflow failure modes, API rate limits, AI model reliability

**Business Risks:**
- Market and competitive changes
- Revenue concentration (client dependency)
- Pricing and margin pressure
- Regulatory and compliance changes
- Reputational exposure
- For Layaa AI: SME client cash flow sensitivity, scope creep in automation projects

**Data Risks:**
- Data quality and integrity issues
- Data loss or corruption scenarios
- Privacy and regulatory compliance (DPDP Act)
- Data migration and portability
- For Layaa AI: client data handling, cross-system data flow integrity

**Dependency Risks:**
- Vendor/platform lock-in
- Key personnel dependencies
- External service availability
- Supply chain disruptions
- For Layaa AI: platform dependency (n8n, Make, Relevance AI), founder bandwidth

**Timeline Risks:**
- Scope creep and requirement changes
- Resource availability and allocation
- External dependency delays
- Approval bottlenecks
- For Layaa AI: client responsiveness, discovery-to-delivery handoff delays

### Step 3: Score Each Risk — Probability x Impact
Rate each identified risk:

**Probability Scale:**
| Score | Level | Definition |
|-------|-------|------------|
| 1 | RARE | <10% chance of occurring |
| 2 | UNLIKELY | 10-25% chance |
| 3 | POSSIBLE | 25-50% chance |
| 4 | LIKELY | 50-75% chance |
| 5 | ALMOST CERTAIN | >75% chance |

**Impact Scale:**
| Score | Level | Definition |
|-------|-------|------------|
| 1 | NEGLIGIBLE | Minor inconvenience, no material effect |
| 2 | MINOR | Small delays or cost overrun (<10%), workarounds available |
| 3 | MODERATE | Noticeable impact on timeline/budget (10-25%), requires management attention |
| 4 | MAJOR | Significant impact (25-50%), threatens deliverable quality or timeline |
| 5 | SEVERE | Critical failure, project/engagement at risk, reputational damage |

**Risk Score = Probability x Impact** (range 1-25)

### Step 4: Classify Risk Levels
Map risk scores to classification:

| Score Range | Classification | Response Required |
|-------------|---------------|------------------|
| 1-4 | LOW | Accept and monitor — review quarterly |
| 5-9 | MEDIUM | Mitigate — develop response plan, review monthly |
| 10-15 | HIGH | Prioritize — active mitigation required, review weekly |
| 16-25 | CRITICAL | Escalate immediately — cannot proceed without mitigation |

**For Layaa AI escalation:**
- LOW/MEDIUM → Project team handles
- HIGH → Escalate to Kabir (Executive Strategy Orchestrator)
- CRITICAL → Escalate to Founders (Abhimanyu/Shubham) within 24 hours

### Step 5: Develop Mitigation Strategies
For each MEDIUM, HIGH, and CRITICAL risk, define:

1. **Mitigation approach:** Avoid, reduce, transfer, or accept
   - **Avoid:** Eliminate the risk by changing approach
   - **Reduce:** Lower probability or impact through specific actions
   - **Transfer:** Shift risk to another party (insurance, vendor SLA, contractual terms)
   - **Accept:** Acknowledge risk and prepare contingency
2. **Specific actions:** What exactly will be done
3. **Owner:** Who is responsible for executing mitigation
4. **Timeline:** When mitigation must be in place
5. **Cost:** Estimated cost of mitigation
6. **Residual risk:** Expected risk level after mitigation

**For Layaa AI:** Use Rohit's (QA & Validation Specialist) risk scoring matrix to validate feasibility risks. Route technical risks through Ujjwal (Automation Architect). Route legal/compliance risks through Abhay/Preeti. Route pricing impact through Veer.

### Step 6: Create Monitoring Plan
For each risk in the register:
1. **Trigger indicators:** What signals suggest the risk is materializing?
2. **Monitoring frequency:** How often to check (daily, weekly, monthly)?
3. **Monitoring method:** How will it be tracked (dashboard, manual check, automated alert)?
4. **Response protocol:** What happens when a trigger fires?
5. **Review schedule:** When does the full risk register get reassessed?

## Output Format

```
# Risk Assessment Report
**Subject:** [what is being assessed]
**Assessment Date:** [date]
**Assessed by:** [Rohit — QA & Validation Specialist / General]
**Scope:** [boundaries of the assessment]
**Time Horizon:** [near/medium/long-term]
**Classification:** CONFIDENTIAL

## Executive Summary
- **Total Risks Identified:** [number]
- **CRITICAL:** [count] — Immediate escalation required
- **HIGH:** [count] — Active mitigation in progress
- **MEDIUM:** [count] — Mitigation plans defined
- **LOW:** [count] — Accepted and monitored
- **Overall Risk Posture:** [HEALTHY / ELEVATED / HIGH / CRITICAL]

## Risk Register

### CRITICAL Risks
| ID | Risk | Category | Prob | Impact | Score | Owner | Mitigation | Status |
|----|------|----------|------|--------|-------|-------|------------|--------|
| R1 | [description] | [category] | [1-5] | [1-5] | [score] | [owner] | [strategy] | [status] |

### HIGH Risks
| ID | Risk | Category | Prob | Impact | Score | Owner | Mitigation | Status |
|----|------|----------|------|--------|-------|-------|------------|--------|
| R2 | [description] | [category] | [1-5] | [1-5] | [score] | [owner] | [strategy] | [status] |

### MEDIUM Risks
| ID | Risk | Category | Prob | Impact | Score | Owner | Mitigation | Status |
|----|------|----------|------|--------|-------|-------|------------|--------|

### LOW Risks
| ID | Risk | Category | Prob | Impact | Score | Owner | Mitigation | Status |
|----|------|----------|------|--------|-------|-------|------------|--------|

## Risk Heat Map
```
         Impact →
         NEG  MIN  MOD  MAJ  SEV
CERT  |  M  |  H  |  H  |  C  |  C  |
LIKE  |  M  |  M  |  H  |  H  |  C  |
POSS  |  L  |  M  |  M  |  H  |  H  |
UNLI  |  L  |  L  |  M  |  M  |  H  |
RARE  |  L  |  L  |  L  |  M  |  M  |
```

## Mitigation Plans

### [Risk ID]: [Risk Title]
- **Current Score:** [probability] x [impact] = [score] ([classification])
- **Mitigation Approach:** [Avoid / Reduce / Transfer / Accept]
- **Actions:**
  1. [specific action] — [owner] — [deadline]
  2. [specific action] — [owner] — [deadline]
- **Estimated Cost:** [cost of mitigation]
- **Residual Risk:** [expected score after mitigation]
- **Contingency:** [what to do if risk materializes despite mitigation]

## Monitoring Plan
| Risk ID | Trigger Indicator | Frequency | Method | Response Protocol |
|---------|------------------|-----------|--------|------------------|
| R1 | [what to watch for] | [frequency] | [how] | [what to do] |
| R2 | [what to watch for] | [frequency] | [how] | [what to do] |

## Escalation Items
- [ ] **CRITICAL:** [risk] — Founder notification required by [date]
- [ ] **HIGH:** [risk] — Assigned to [owner], mitigation by [date]
- [ ] **PATTERN:** [recurring risk type] — Process improvement proposal needed

## Risk Trends (if repeat assessment)
- **New risks since last review:** [count and summary]
- **Risks resolved:** [count and summary]
- **Risks escalated:** [count and summary]
- **Overall trend:** [improving / stable / deteriorating]

## Next Review
- **Scheduled:** [date]
- **Trigger for earlier review:** [events that warrant immediate reassessment]
```

## What Makes This Different from Generic Risk Assessment
- Uses Rohit's (QA & Validation Specialist) risk scoring matrix calibrated for AI automation project risks
- Includes AI/automation-specific risk categories (workflow failure modes, API dependencies, AI model reliability)
- Maps risk owners to Layaa AI's GPT workforce and escalation hierarchy
- Considers Indian SME client context (cash flow sensitivity, technology maturity, regulatory landscape)
- Integrates with Layaa AI's 5-stage delivery methodology for stage-specific risk identification
- Applies DPDP Act and Indian regulatory requirements to data risk assessment
- Escalation path follows Layaa AI governance: Project Team → Kabir → Founders
