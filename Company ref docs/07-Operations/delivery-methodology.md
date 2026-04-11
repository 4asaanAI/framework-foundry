# Layaa AI Delivery Methodology

**Document Owner:** Shubham Sharma, CTO
**Last Updated:** April 2026
**Classification:** Internal Reference

---

## Overview

Layaa AI follows a structured 5-stage delivery methodology for all client automation and AI enablement projects. This methodology is designed for Indian SMEs and balances rigour with speed, ensuring clear value delivery at every stage while maintaining budget discipline appropriate to the SME market.

**Stages at a glance:**

| # | Stage | Lead Framework | Duration (Typical) | Primary Output |
|---|-------|---------------|---------------------|----------------|
| 1 | Discovery | Rohit's Framework | 3-5 business days | Validated Scope Document |
| 2 | Assessment | Internal | 3-5 business days | AI Adoption Roadmap |
| 3 | Development | Ujjawal's Framework | 2-6 weeks | Working Automation System |
| 4 | Validation (QA) | Internal QA | 3-5 business days | Test Report + Sign-off |
| 5 | Enablement | Internal | 1-2 weeks | Trained Team + Documentation |

**Total typical timeline:** 4-10 weeks depending on scope complexity.

---

## Stage 1: Discovery (Rohit's Framework)

### Purpose

Understand the client's business deeply before proposing any solution. Prevent the common mistake of jumping to technology before understanding the problem. Every successful engagement begins with genuine business understanding.

### Activities

#### 1.1 Business Context Analysis

- Map the client's industry, competitive landscape, and market position.
- Identify revenue streams, cost centres, and margin pressure points.
- Understand the seasonality and cyclicality of the business.
- Document the organisational structure and decision-making hierarchy.
- Assess the client's current technology maturity level (1-5 scale).

#### 1.2 Stakeholder Interviews

- Conduct structured interviews with 3-5 key stakeholders minimum.
- Interview template covers: daily pain points, time-consuming tasks, error-prone processes, wish-list items, previous automation attempts.
- Separate executive stakeholders (strategic view) from operational stakeholders (ground-level reality).
- Document both stated needs and observed needs (these often differ).
- Identify the internal champion who will drive adoption.

#### 1.3 Current State Mapping

- Document existing workflows as-is, without judgement or optimisation.
- Identify all tools currently in use (Excel, Tally, WhatsApp, email, paper registers, etc.).
- Quantify volumes: transactions per day, reports generated, approvals processed, etc.
- Map data flows between systems (or between people, in manual processes).
- Note integration points, manual handoffs, and information bottlenecks.

#### 1.4 Requirement Validation

- Cross-reference stakeholder inputs against observed processes.
- Separate must-have requirements from nice-to-have enhancements.
- Validate feasibility of each requirement against available data and systems.
- Identify requirements that conflict with each other and resolve through stakeholder discussion.
- Prioritise using an Impact vs Effort matrix.

#### 1.5 Feasibility Assessment

- Technical feasibility: Can the required data be accessed? Are APIs available? Is the data structured?
- Operational feasibility: Will the team adopt this? Is change management needed?
- Financial feasibility: Does the projected ROI justify the investment for an SME budget?
- Timeline feasibility: Can this be delivered within the client's urgency window?

#### 1.6 Risk Identification

- Data quality risks (garbage-in, garbage-out scenarios).
- Integration risks (legacy systems, no APIs, manual data entry dependencies).
- Adoption risks (resistance to change, low digital literacy).
- Dependency risks (single point of failure, key person dependency).
- Regulatory risks (GST compliance, data privacy, industry-specific regulations).

### Checkpoint: Discovery Review

- **Attendees:** Project lead, CTO (for complex engagements), client stakeholders.
- **Gate criteria:** All six activities completed, documented, and reviewed.
- **Decision:** Proceed to Assessment / Revise scope / Decline engagement.

### Output: Validated Scope Document

Contents:
1. Business context summary (1-2 pages)
2. Stakeholder map with roles and influence
3. Current state process maps (visual + narrative)
4. Validated requirement list (prioritised)
5. Feasibility assessment (go/no-go per requirement)
6. Identified risks with preliminary mitigation strategies
7. Recommended engagement scope and boundaries

### Handoff Protocol: Discovery to Assessment

- Scope document shared with client for written acknowledgement.
- Internal handoff meeting (30 min) to transfer context.
- All interview recordings/notes archived in project folder.
- Client confirms the scope document accurately represents their situation before Stage 2 begins.

---

## Stage 2: Assessment

### Purpose

Translate the validated scope into a concrete, actionable plan. This stage answers: "What should we automate, in what order, using what technology, and what return will the client see?"

### Activities

#### 2.1 Deep-Dive Process Mapping

- Take the current-state maps from Discovery and decompose to task level.
- For each task, document: frequency, time taken, error rate, dependency, data involved.
- Identify decision points (where human judgement is currently applied).
- Classify each task: fully automatable, partially automatable, human-required.
- Map the ideal future state for automatable processes.

#### 2.2 Automation Opportunity Scoring

Score each automation opportunity on a 1-5 scale across four dimensions:

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Impact | 30% | Time saved, error reduction, revenue impact |
| Feasibility | 25% | Technical difficulty, data availability, integration complexity |
| Urgency | 25% | Client pain level, regulatory deadline, competitive pressure |
| Adoption Likelihood | 20% | User readiness, change management complexity |

Weighted score determines implementation priority:
- **4.0-5.0:** Phase 1 (immediate implementation)
- **3.0-3.9:** Phase 2 (next quarter)
- **2.0-2.9:** Phase 3 (future roadmap)
- **Below 2.0:** Not recommended at this time

#### 2.3 Technology Recommendation

- Select the optimal tech stack for each automation from Layaa AI's toolset.
- Primary automation engine: n8n (self-hosted) for workflow orchestration.
- LLM selection: Claude Sonnet 4.6 for complex reasoning, Haiku 4.5 for fast/simple tasks.
- Frontend: React/TypeScript if a custom UI is needed.
- Database: PocketBase for most SME use cases; PostgreSQL for heavy transactional loads.
- Integration tools: Direct API where available; Make/Zapier as fallback for unsupported connectors.
- Document rationale for every technology choice.

#### 2.4 ROI Projection

For each automation opportunity, calculate:

- **Time savings:** Hours saved per week/month, multiplied by loaded cost of employee time.
- **Error reduction:** Estimated cost of errors (rework, penalties, lost revenue) multiplied by reduction percentage.
- **Speed improvement:** Revenue impact of faster processing (e.g., faster invoicing means faster cash flow).
- **Scalability gain:** Additional volume the client can handle without adding headcount.

Present ROI in terms SME owners understand:
- Payback period (months)
- Monthly savings in INR
- Annual ROI percentage
- Break-even point

### Checkpoint: Assessment Review

- **Attendees:** CTO, project lead, client decision-makers.
- **Gate criteria:** All opportunities scored, technology selected, ROI calculated.
- **Decision:** Approve roadmap / Revise priorities / Descope.

### Output: AI Adoption Roadmap

Contents:
1. Automation opportunity matrix (scored and ranked)
2. Recommended implementation phases with timelines
3. Technology stack per automation
4. ROI projections per phase and cumulative
5. Resource requirements (Layaa AI effort + client-side effort)
6. Risk mitigation plan (updated from Discovery)
7. Investment summary and payment milestones

### Handoff Protocol: Assessment to Development

- Roadmap presented to client; written approval obtained for Phase 1 scope.
- Payment milestone triggered (typically 30-40% advance for Phase 1).
- Development kickoff meeting scheduled within 3 business days of approval.
- All assessment artefacts stored in project repository.

---

## Stage 3: Development (Ujjawal's Framework)

### Purpose

Build the automation system iteratively, with continuous client visibility and frequent checkpoints. Development follows the 7-stage workflow building method for every n8n workflow.

### Activities

#### 3.1 Architecture Design

- Design the overall system architecture before writing any code or building any workflow.
- Define all data models (PocketBase collections, fields, relations).
- Map all integration points and API contracts.
- Design the error handling and retry strategy.
- Plan the security model (authentication, authorisation, API key management).
- Create architecture diagram and get CTO sign-off.

**AI-Assisted Development Compression:**
Layaa AI uses vibe coding with Lovable 2.0 and Claude Code, achieving significant development compression:
- Architecture design: 60-70% of traditional time estimates
- Core business logic: 30-40% of traditional time estimates
- UI/Frontend: 40-50% of traditional time estimates
- Testing: 70-80% of traditional time estimates

#### 3.2 The 7-Stage Workflow Building Method

Every n8n workflow follows this exact structure:

**Stage A: Trigger**
- Define what initiates the workflow (webhook, cron schedule, manual trigger, PocketBase event).
- Configure authentication on webhooks (API key validation, signature verification).
- Document the expected input payload/format.

**Stage B: Validation**
- Validate all incoming data against expected schema.
- Check for required fields, correct data types, acceptable value ranges.
- Return clear error messages for invalid inputs (do not proceed with bad data).
- Log validation failures for monitoring.

**Stage C: Normalisation**
- Transform incoming data into the internal standard format.
- Handle character encoding, date format conversion (DD/MM/YYYY for Indian context), currency formatting.
- Merge data from multiple sources if the workflow requires enrichment.
- Ensure consistent field naming conventions.

**Stage D: Core Logic**
- Implement the actual business logic / AI processing.
- LLM calls go here (Claude Sonnet 4.6 for complex tasks, Haiku 4.5 for simple ones).
- Database reads/writes (PocketBase operations).
- Calculations, comparisons, decision-making.
- Keep this stage focused: one workflow, one responsibility.

**Stage E: Branching**
- Handle conditional paths based on logic outcomes.
- Route to different outputs based on success/failure/edge cases.
- Implement approval routing if human review is needed.
- Handle rate limiting and quota management.

**Stage F: Output**
- Format the response/output for the destination system.
- Send webhook responses, update databases, trigger notifications.
- Ensure idempotency where possible (safe to retry).
- Include correlation IDs for traceability.

**Stage G: Logging**
- Log the workflow execution result (success/failure/partial).
- Record execution time, input summary, output summary.
- Log errors with full context for debugging.
- Trigger alerts for failures (via notification workflow).
- Never log sensitive data (API keys, passwords, PII beyond what is necessary).

#### 3.3 Iterative Builds with Checkpoints

Development proceeds in 1-week sprints:

- **Sprint Planning (Monday):** Define sprint goals, assign tasks, identify blockers.
- **Daily Check-in (async):** Brief status update on progress and blockers.
- **Mid-Sprint Review (Wednesday/Thursday):** Demo progress to client stakeholders; gather feedback.
- **Sprint Review (Friday):** Demonstrate completed work; get client sign-off on deliverables.
- **Sprint Retrospective:** What went well, what to improve, carry-forward items.

Each sprint delivers a working, testable increment. No "big bang" deliveries.

### Checkpoint: Development Milestone Reviews

- At 25% completion: Architecture validated, first workflow operational.
- At 50% completion: Core functionality working end-to-end in staging.
- At 75% completion: All workflows built, integration testing underway.
- At 100% completion: All development complete, ready for Validation stage.

### Output: Working Automation System

Deliverables:
1. All n8n workflows built, tested, and documented.
2. PocketBase collections configured with proper validation rules.
3. Frontend components (if applicable) functional in staging.
4. Integration with client systems verified in staging.
5. Technical documentation (architecture, data flow, API contracts).
6. Code/workflow repository with version history.

### Handoff Protocol: Development to Validation

- All workflows deployed to staging environment.
- Development documentation package compiled.
- Known issues list prepared (with severity classification).
- QA kickoff meeting scheduled; test scenarios reviewed.

---

## Stage 4: Validation (QA)

### Purpose

Ensure the automation system works correctly, handles edge cases gracefully, performs adequately, and meets security and compliance requirements before going live.

### Activities

#### 4.1 End-to-End Testing

- Test every workflow from trigger to output using realistic data.
- Verify data flows correctly across all integration points.
- Confirm all PocketBase CRUD operations work as expected.
- Test the complete user journey (if a frontend is involved).
- Validate output accuracy against manual calculations/known-good results.

#### 4.2 Edge Case Testing

- Test with missing/null/empty data fields.
- Test with maximum and minimum value boundaries.
- Test with special characters, long strings, Unicode (Hindi, etc.).
- Test with concurrent requests (simultaneous triggers).
- Test with network interruptions and timeout scenarios.
- Test with invalid authentication credentials.

#### 4.3 Performance Benchmarking

- Measure response times under normal load.
- Test with 2x and 5x expected peak load.
- Identify bottlenecks (slow API calls, database queries, LLM response times).
- Verify the system stays within budget constraints (LLM token usage, API call limits).
- Document performance baselines for ongoing monitoring.

#### 4.4 Security and Compliance Verification

- Verify API keys are stored in n8n credential store (never in browser, never logged).
- Confirm authentication is enforced on all external endpoints.
- Validate that PII handling complies with DPDP Act 2023 requirements.
- Check audit logging captures all required events.
- Verify data backup procedures are functional.
- Confirm GDPR compliance where applicable.

### Checkpoint: QA Sign-off

- **Attendees:** CTO, project lead, client representative.
- **Gate criteria:** All S0 and S1 bugs resolved; no open S0/S1 issues.
- **Decision:** Approve for production / Fix and re-test / Major rework needed.

### Output: Test Report + Sign-off

Contents:
1. Test execution summary (tests run, passed, failed, blocked).
2. Bug report with severity classification and resolution status.
3. Performance benchmark results.
4. Security checklist completion.
5. Known limitations and accepted risks.
6. Client sign-off for production deployment.

### Handoff Protocol: Validation to Enablement

- All S0 and S1 bugs resolved and verified.
- S2/S3 bugs documented with planned resolution timeline.
- Production deployment plan prepared.
- Enablement materials drafted (training agendas, user guides).

---

## Stage 5: Enablement

### Purpose

Ensure the client's team can use, manage, and maintain the automation system independently. A delivered system that nobody uses is a failed project.

### Activities

#### 5.1 User Training

- Hands-on training sessions for end users (the people who will interact with the system daily).
- Training covers: how to trigger workflows, how to interpret outputs, what to do when something looks wrong, how to escalate issues.
- Use real data and real scenarios from the client's business.
- Provide quick-reference guides (laminated cards or single-page PDFs).
- Conduct training in the language the team is comfortable with (Hindi/English).

#### 5.2 Admin Training

- Deeper training for the designated admin (usually 1-2 people).
- Covers: n8n dashboard navigation, workflow monitoring, error log interpretation, basic troubleshooting, PocketBase admin panel usage.
- How to update configurations (e.g., change a threshold, add a new category).
- When to escalate to Layaa AI support vs. handle internally.
- Backup verification and data export procedures.

#### 5.3 Handover with Runbooks

Provide a complete handover package:

- **Operations Runbook:** Day-to-day operational procedures, monitoring checklist, common issues and resolutions.
- **Troubleshooting Guide:** Decision tree for diagnosing issues, contact information for escalation.
- **Architecture Document:** System overview, data flow diagrams, integration points, credentials inventory (locations, not values).
- **Change Management Guide:** How to request changes, enhancement process, versioning approach.

#### 5.4 Go-Live Support (2 Weeks)

- **Week 1 (High-touch):** Layaa AI team monitors the system actively, responds to issues within 2 hours during business hours (9 AM - 7 PM IST), daily check-in calls with the client team.
- **Week 2 (Transition):** Client team takes primary operational responsibility, Layaa AI available for escalations within 4 hours, every-other-day check-in calls.
- **Post Go-Live:** Transition to standard support terms (as per contract).

### Checkpoint: Enablement Completion

- **Attendees:** CTO, project lead, client admin, client sponsor.
- **Gate criteria:** Training completed, runbooks delivered, 2-week go-live support completed without S0/S1 incidents.
- **Decision:** Project closed / Extended support needed.

### Output: Trained Team + Documentation

Deliverables:
1. Trained end users (attendance records + feedback forms).
2. Trained admin(s) with advanced knowledge.
3. Complete runbook package (operations, troubleshooting, architecture, change management).
4. Quick-reference guides for daily use.
5. Project closure report (scope delivered, outcomes achieved, lessons learned).
6. Transition to ongoing support (if contracted).

### Handoff Protocol: Project Closure

- Final invoice triggered upon project closure sign-off.
- All project artefacts archived.
- Lessons learned documented for internal knowledge base.
- Client satisfaction survey sent (NPS + detailed feedback).
- 30-day follow-up call scheduled to check on adoption and outcomes.

---

## Cross-Stage Protocols

### Communication Standards

- **Client updates:** Minimum twice per week during active stages.
- **Internal sync:** Daily async updates; weekly team sync.
- **Escalation path:** Project lead to CTO to client sponsor.
- **Documentation language:** English for technical documents; bilingual (English/Hindi) for user-facing materials where needed.

### Change Management

- All scope changes go through a formal Change Request (CR) process.
- CR must document: what is changing, why, impact on timeline, impact on cost.
- CTO approval required for CRs that impact timeline by more than 1 week or cost by more than 10%.
- Client approval required for all CRs before implementation.

### Quality Gates

No stage can begin until the previous stage's checkpoint has been passed. This is non-negotiable. Skipping stages creates technical debt and client dissatisfaction.

| From | To | Gate Requirement |
|------|----|-----------------|
| Discovery | Assessment | Validated Scope Document signed |
| Assessment | Development | AI Adoption Roadmap approved + advance payment received |
| Development | Validation | All workflows built + development documentation complete |
| Validation | Enablement | Test Report signed + all S0/S1 bugs resolved |
| Enablement | Closure | Go-live support complete + project closure sign-off |

### Risk Monitoring

- Risk register maintained from Discovery through Closure.
- Risks reviewed at every checkpoint.
- New risks added as they are identified.
- Risk owners assigned and accountable.
- Mitigation actions tracked to completion.

---

## Appendix: Typical Timelines by Project Size

| Project Size | Discovery | Assessment | Development | Validation | Enablement | Total |
|-------------|-----------|------------|-------------|------------|------------|-------|
| Small (1-2 workflows) | 2-3 days | 2-3 days | 1-2 weeks | 2-3 days | 1 week | 3-5 weeks |
| Medium (3-5 workflows) | 3-5 days | 3-5 days | 3-4 weeks | 3-5 days | 1-2 weeks | 6-8 weeks |
| Large (6+ workflows) | 5-7 days | 5-7 days | 5-6 weeks | 5-7 days | 2 weeks | 8-10 weeks |

These are typical ranges. Actual timelines are estimated during Assessment based on specific scope complexity.

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
