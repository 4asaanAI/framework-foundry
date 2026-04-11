# Multi-Agent Workflow Playbooks

> These are the end-to-end workflows that span multiple agents on Layaa OS. Every agent must understand these playbooks so they know their role in each cross-functional process, what they receive, what they produce, and who they hand off to.

---

## How to Read These Playbooks

Each workflow follows this structure:

- **TRIGGER** — What initiates the workflow
- **AGENT CHAIN** — Step-by-step sequence with each agent's responsibility
- **HANDOFF FORMAT** — What context gets passed between agents via `pass_context()`
- **DECISION GATES** — Points where human (Founder) approval is required before proceeding
- **ESCALATION POINTS** — Conditions that pause or redirect the workflow
- **EXPECTED OUTPUT** — What the workflow produces when completed
- **ESTIMATED DURATION** — Typical end-to-end time

### Communication Primitives Used

| Primitive | Purpose |
|-----------|---------|
| `@AgentName` | Mention an agent in conversation (max 3 per message) |
| `pass_context(from, to, summary)` | Hand off context between agents with structured summary |
| `create_task(title, assigned_to, due_date)` | Assign a tracked task to an agent |
| `create_notification(profile_id, title, body)` | Alert founders or agents of pending actions |
| Approval Gate | Tier 2 action requiring founder approval before execution |

---

## Workflow 1: New Client Intake (Lead to Signed Contract)

**TRIGGER:** New lead arrives via WhatsApp, LinkedIn DM, referral, or website inquiry.

**AGENT CHAIN:**

**Step 1 — Arjun (Client Strategy & Discovery Specialist): Lead Qualification + Discovery Prep**
Arjun receives the lead details and performs initial qualification against the ICP matrix (post-revenue SME, Rs.50K+ budget potential, serviceable vertical). He researches the prospect's company, identifies decision-makers, maps their likely pain points, and prepares a structured discovery call agenda using the `/call-prep` skill. If the lead scores below ICP threshold, Arjun flags it with a reason and notifies Rishi for pipeline tracking. If qualified, Arjun proceeds.

`pass_context(Arjun, Yuvaan, {lead_name, company, vertical, ICP_score, pain_points_hypothesis, discovery_agenda})`

**Step 2 — Yuvaan (Sales Enablement Specialist): Sales Asset Preparation**
Yuvaan receives the prospect context and prepares tailored sales assets: a customized one-pager highlighting relevant case studies, a pitch deck variant for the prospect's vertical, and an objection-handling cheat sheet. He pulls from the service configuration matrix and selects the most relevant package tier as a starting frame.

`pass_context(Yuvaan, Arjun, {one_pager_draft, pitch_deck_variant, objection_playbook, suggested_package_tier})`

**Step 3 — Arjun: Discovery Call Execution**
Arjun conducts (or prepares the founder for) the discovery call using the 5-phase framework. Post-call, he uses `/call-summary` to extract key findings: client's current processes, pain points validated, budget signals, timeline expectations, decision-making structure, and blockers. He structures this into a Discovery Summary Document.

`pass_context(Arjun, Rohit, {discovery_summary, client_processes, pain_points_validated, budget_range, timeline, decision_makers, blockers})`

**Step 4 — Rohit (QA & Validation Specialist): Feasibility Validation**
Rohit analyzes the discovery output against Layaa AI's technical capabilities, delivery capacity, and risk thresholds. He validates whether the client's needs are achievable with the current stack (n8n, Relevance AI, Bolt AI), identifies technical risks, flags scope ambiguities, and assigns a feasibility score. If feasibility is below 60%, he escalates to Shubham with a detailed risk brief.

`pass_context(Rohit, Ujjawal, {feasibility_score, validated_scope, technical_risks, constraints, recommended_approach, data_requirements})`

**Step 5 — Ujjawal (Automation Architect): Architecture Design**
Ujjawal takes the validated scope and designs a high-level solution architecture: workflow diagrams, integration points, data flow schemas, technology choices, and estimated build effort (using AI-assisted compression rates). He produces a Solution Architecture Brief that becomes the technical backbone of the proposal.

`pass_context(Ujjawal, Veer, {architecture_brief, tech_stack, integration_points, estimated_hours, complexity_tier})`

**Step 6 — Veer (Pricing & Unit Economics Specialist): Pricing**
Veer applies the hybrid pricing formula using the architecture's estimated hours, complexity tier, and client's vertical benchmarks. He calculates floor price, ceiling price, and proposed price. He validates margins (must exceed 30%) and flags any red-flag thresholds. He produces a Pricing Recommendation with three options (Good/Better/Best).

`pass_context(Veer, Abhay, {pricing_options, margin_analysis, payment_terms_recommendation, discount_authority_notes})`

**Step 7 — Abhay (Legal & Contracts Advisor): Contract Drafting**
Abhay drafts the MSA and SoW using the `/client-agreement` skill, incorporating the pricing options, scope from Ujjawal's architecture, payment terms from Veer, and standard clauses from the clause library. He flags any non-standard terms that need founder attention.

`pass_context(Abhay, Preeti, {MSA_draft, SoW_draft, non_standard_clauses, risk_flags})`

**Step 8 — Preeti (Regulatory Compliance & Data Governance Advisor): Compliance Review**
Preeti reviews the contract for DPDP Act compliance, data handling requirements, regulatory obligations, and any cross-border data risks. She annotates the contract with compliance notes and flags any gaps.

`pass_context(Preeti, Kabir, {compliance_review, annotations, gaps_flagged, approval_recommendation})`

**DECISION GATE 1 — Founders: Contract Approval**
Kabir synthesizes the full deal package (discovery summary, feasibility score, architecture brief, pricing, contract, compliance review) into a Deal Approval Brief and presents it to Founders. Founders approve, request changes, or reject.

**Step 9 — Arjun: Client Communication + Closing**
Upon founder approval, Arjun sends the proposal and contract to the client, handles negotiations (within discount authority), and manages the signing process. Significant negotiation concessions (>10% discount or non-standard terms) loop back through Veer and Abhay respectively.

`pass_context(Arjun, Nia, {signed_contract, client_contact_info, project_start_date, onboarding_requirements})`

**Step 10 — Nia (Campaign & Funnel Execution Coordinator): Onboarding Campaign**
Nia triggers the client onboarding email sequence, sets up the CRM record, creates the welcome kit delivery task, and updates the pipeline status to "Won." She also creates a task for Rishi to update revenue tracking.

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "client_intake", step: N, from: agent_id, to: agent_id, payload: {structured_data}, timestamp, status: "in_progress"}`

**DECISION GATES:**
1. ICP qualification (Step 1) — Arjun can disqualify; founders notified
2. Feasibility threshold (Step 4) — Below 60% escalates to Shubham
3. Margin validation (Step 6) — Below 30% escalates to Founders
4. Contract approval (Step 8-9) — Founders must approve before sending to client
5. Discount >10% — Requires Veer approval; >20% requires Founder approval

**ESCALATION POINTS:**
- Client requests scope outside Layaa AI capabilities — Rohit escalates to Founders with alternatives
- Pricing below minimum viable budget (Rs.50K) — Veer blocks and notifies Kabir
- Legal risk identified in non-standard terms — Abhay escalates to Founders
- Compliance gap in data handling — Preeti blocks until resolved

**EXPECTED OUTPUT:** Signed MSA + SoW, CRM record, onboarding sequence triggered, revenue tracking updated, project created in system.

**ESTIMATED DURATION:** 14-30 days (depending on client responsiveness and complexity).

---

## Workflow 2: Content Publishing Pipeline

**TRIGGER:** Content calendar slot reached, founder request for specific content, or strategic content opportunity identified by Mira.

**AGENT CHAIN:**

**Step 1 — Mira (Marketing Strategist): Strategy Brief + Topic Selection**
Mira reviews the content calendar, current campaign priorities, and market context. She creates a Content Strategy Brief specifying: topic, target audience segment, content pillar (P1-P5), format (LinkedIn post, blog, carousel, email), strategic objective (awareness, engagement, lead gen), key messages, and distribution channels. She validates the topic doesn't violate posting rules (no repeated hooks within 2 weeks, industry rotation, format rotation).

`pass_context(Mira, Kshitiz, {content_brief, topic, target_segment, key_claims_to_validate, competitor_angles_to_check})`

**Step 2 — Kshitiz (Master Research & Data Analyst): Research + Data Validation**
Kshitiz researches the topic, validates any data claims or statistics Mira wants to include, checks competitor content for differentiation, and provides supporting evidence. Every data point gets an evidence tag: `[EVIDENCE: VALIDATED]` or `[EVIDENCE: PENDING]`. He also suggests data-driven angles that could strengthen the piece.

`pass_context(Kshitiz, Tara, {validated_data_points, evidence_tags, competitor_content_gaps, suggested_angles, source_citations})`

**Step 3 — Tara (Brand Voice & Content Architect): Content Drafting**
Tara writes the content using the strategy brief, validated data, and brand voice guidelines. She applies the correct founder voice profile if ghostwriting, follows format templates for the specified channel, and ensures all banned words are avoided. She tags her own evidence usage. The draft includes: headline/hook, body, CTA, and suggested visuals.

`pass_context(Tara, Mira, {content_draft, format_type, evidence_tags_used, visual_suggestions, estimated_read_time})`

**Step 4 — Mira: Strategic Review**
Mira reviews the draft for strategic alignment: Does it serve the campaign objective? Is the messaging consistent with current positioning? Does the CTA align with the funnel stage? She provides specific revision notes — not stylistic edits (that is Tara's domain) but strategic adjustments to messaging, angle, or audience targeting.

`pass_context(Mira, Tara, {strategic_review, revision_notes, approved_elements, change_requests})`

**Step 5 — Tara: Revision**
Tara incorporates Mira's strategic feedback while maintaining brand voice integrity. If there is a conflict between strategic direction and brand voice, Tara flags it for Mira and they resolve collaboratively (or escalate to Kabir if unresolved).

`pass_context(Tara, Founders_or_Nia, {final_draft, revision_notes_addressed, ready_for_publish: true})`

**DECISION GATE — Founders: Approval (High-Visibility Content Only)**
Content tagged as high-visibility (investor communications, press, major announcements, anything mentioning pricing or commitments) requires Founder approval. Standard content (regular LinkedIn posts, blog posts, emails) skips this gate and goes directly to Nia.

**Step 6 — Nia: Schedule + Publish**
Nia receives the approved content, schedules it according to the content calendar timing, sets up UTM parameters for tracking, and publishes across the specified channels. She confirms publication and creates a tracking task with a 48-hour performance check reminder.

`pass_context(Nia, Zoya, {published_content_url, publish_time, channels, UTM_parameters, 48hr_check_due})`

**Step 7 — Zoya (Performance Marketing & Growth Architect): Performance Tracking**
After 48 hours, Zoya pulls performance data (impressions, engagement rate, click-through, conversions if applicable) and compares against channel benchmarks. She produces a Performance Snapshot and flags any content that significantly outperformed or underperformed. Insights are saved as shared memory for future content optimization.

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "content_publishing", step: N, content_id, topic, format, payload, timestamp}`

**DECISION GATES:**
1. High-visibility content requires Founder approval before publishing
2. Content with unvalidated data claims (`[EVIDENCE: PENDING]`) cannot publish until resolved
3. Content mentioning pricing, client names, or legal commitments requires Founder + Abhay review

**ESCALATION POINTS:**
- Brand voice conflict between Mira and Tara — escalate to Kabir
- Data claim cannot be validated by Kshitiz — content must be revised to remove or soften the claim
- Performance significantly below benchmarks (>50% below) — Zoya escalates to Mira for strategy review

**EXPECTED OUTPUT:** Published content piece, UTM-tracked distribution, 48-hour performance snapshot, institutional learnings saved.

**ESTIMATED DURATION:** 2-5 days (standard content), 5-10 days (high-visibility content requiring founder review).

---

## Workflow 3: Monthly Finance & Compliance Close

**TRIGGER:** 1st of each month (automated via Kaiser cron job). Kaiser creates tasks for all agents in the chain with staggered due dates.

**AGENT CHAIN:**

**Step 1 — Aarav (Finance & Accounts Executive): Bank Reconciliation + Expense Tracking (Days 1-3)**
Aarav runs the `/reconciliation` skill to match bank transactions against recorded entries. He categorizes all expenses, flags unrecognized transactions, reconciles GST input credits, and prepares a Cash Flow Statement for the previous month. He also processes any pending invoices and updates receivables/payables.

`pass_context(Aarav, Aarav_next_step, {reconciliation_report, unrecognized_transactions, expense_summary, cash_flow_statement, pending_invoices})`

**Step 2 — Aarav: P&L Draft + Financial Statements (Days 3-5)**
Using the reconciled data, Aarav prepares the monthly P&L statement, balance sheet snapshot, and expense analysis using `/financial-statements`. He highlights variances against budget (using `/variance-analysis`), flags any expenses exceeding Rs.50K (requires founder awareness), and notes cash runway implications.

`pass_context(Aarav, Anne, {PnL_draft, balance_sheet, variance_report, expense_flags, cash_runway_months})`

**Step 3 — Anne (Chartered Compliance Assistant): Compliance Calendar Check (Days 5-6)**
Anne reviews the compliance calendar for the upcoming month: GST filing deadlines (GSTR-1 by 11th, GSTR-3B by 20th), TDS deposits (7th), any MCA annual return deadlines, DPIIT reporting requirements, and Udyam updates. She checks if all previous month's filings were completed and flags any overdue items. She uses `/compliance-tracking` to generate a Compliance Status Dashboard.

`pass_context(Anne, Preeti, {compliance_dashboard, upcoming_deadlines, overdue_items, filing_readiness_status})`

**Step 4 — Preeti (Regulatory Compliance & Data Governance Advisor): Regulatory Compliance Review (Days 6-7)**
Preeti reviews any regulatory changes from the previous month (DPDP Act updates, RBI circulars, MCA notifications), assesses their impact on Layaa AI operations, and cross-references against the compliance dashboard. She flags any new compliance obligations and updates the risk register.

`pass_context(Preeti, Veer, {regulatory_update_summary, new_obligations, risk_register_updates, compliance_risk_score})`

**Step 5 — Veer (Pricing & Unit Economics Specialist): Unit Economics Update (Days 7-8)**
Veer updates the monthly unit economics: CAC (by channel), LTV (by client segment), gross margins (by service vertical), and revenue per employee equivalent. He compares against previous month and flags any red-flag threshold breaches (CAC:LTV below 2.5x, margins below 30%).

`pass_context(Veer, Rishi, {unit_economics_report, CAC_by_channel, LTV_by_segment, margin_by_vertical, red_flags})`

**Step 6 — Rishi (Revenue Operations Strategist): Revenue Report + Pipeline Update (Days 8-9)**
Rishi generates the Monthly Revenue Report: total revenue, MRR trend, pipeline status (MQL/SQL/Proposal/Won counts and conversion rates), forecast for next month, and deal-level details. He integrates Veer's unit economics to show revenue quality, not just volume. He flags any conversion rate drops or pipeline health concerns.

`pass_context(Rishi, Kabir, {revenue_report, pipeline_health, conversion_rates, forecast_next_month, deal_details, quality_metrics})`

**Step 7 — Kabir (Executive Strategy Orchestrator): Monthly Briefing Synthesis (Days 9-10)**
Kabir pulls together all inputs — financials (Aarav), compliance (Anne + Preeti), unit economics (Veer), revenue (Rishi) — into a single Monthly Executive Briefing. The briefing includes: financial health summary, compliance status, revenue performance, unit economics trends, key risks, and recommended actions. Kabir presents 2-3 strategic options with evidence for any decisions needed.

`create_notification(Founders, "Monthly Executive Briefing Ready", "Review: financials, compliance, revenue, risks", "high")`

**DECISION GATE — Founders: Monthly Review (Day 10)**
Founders review the briefing, approve financial statements for filing, make decisions on flagged items (budget overruns, pricing adjustments, compliance actions), and set priorities for the next month.

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "monthly_close", month: "YYYY-MM", step: N, payload, timestamp}`

**DECISION GATES:**
1. Unrecognized transactions >Rs.10K — Aarav escalates to Founders before proceeding
2. Overdue compliance filings — Anne escalates immediately (do not wait for monthly cycle)
3. Red-flag threshold breaches — Veer escalates to Kabir immediately
4. Financial statements — Founders approve before any external filing

**ESCALATION POINTS:**
- Cash runway below 3 months — Aarav and Kabir escalate to Founders as critical priority
- New regulatory obligation with <30 day compliance window — Preeti escalates immediately
- Revenue decline >20% month-over-month — Rishi escalates to Kabir as urgent

**EXPECTED OUTPUT:** Reconciled books, P&L + balance sheet, compliance dashboard, unit economics report, revenue report, and synthesized Monthly Executive Briefing.

**ESTIMATED DURATION:** 10 business days (1st to 10th of each month).

---

## Workflow 4: Product Sprint Cycle (Layaa OS)

**TRIGGER:** Monday morning each week (automated via Kaiser). Kaiser sends sprint kickoff notification to Dev.

**AGENT CHAIN:**

**Step 1 — Dev (Internal Product Manager): Sprint Planning + Backlog Review (Monday AM)**
Dev reviews the product backlog, prioritizes items based on strategic alignment (from Kabir), technical debt assessments, user feedback, and founder directives. He selects sprint items, estimates story points using AI-assisted compression rates, and creates the Sprint Plan. He uses `/sprint-planning` to structure the output.

`pass_context(Dev, Ujjawal, {sprint_plan, new_feature_specs, architecture_questions, priority_order})`

**Step 2 — Ujjawal (Automation Architect): Architecture for New Features (Monday PM)**
For any new features or significant changes in the sprint, Ujjawal designs the architecture: data models, API endpoints, workflow diagrams, integration points, and error handling strategy. He uses the 7-stage workflow methodology to ensure builder-ready output. He flags any features that require infrastructure changes or new integrations.

`pass_context(Ujjawal, Rohit, {architecture_specs, data_models, API_specs, integration_requirements, infrastructure_flags})`

**Step 3 — Rohit (QA & Validation Specialist): QA Validation of Specs (Tuesday AM)**
Rohit reviews the architecture specs for testability: Can each component be independently validated? Are edge cases covered? Are error states defined? He creates a QA Plan with test scenarios, acceptance criteria, and risk areas. He flags any specs that are untestable or ambiguous.

`pass_context(Rohit, Shubham, {QA_plan, test_scenarios, acceptance_criteria, risk_areas, spec_gaps})`

**Step 4 — Shubham (Co-Founder/CTO) + Build Team: Build (Tuesday-Thursday)**
Shubham oversees the build, implementing features according to Ujjawal's architecture and Rohit's QA plan. This is the human execution step — Ananya assists Shubham with code reviews, technical decisions, and personal productivity during the build phase.

`pass_context(Shubham, Rohit, {completed_features, build_notes, known_issues, ready_for_testing})`

**Step 5 — Rohit: Testing (Thursday-Friday AM)**
Rohit executes the QA plan: runs test scenarios, validates acceptance criteria, checks edge cases, and verifies error handling. He documents all findings in a Test Report: passed/failed/blocked items, bugs found (with severity), and regression check results.

`pass_context(Rohit, Arush, {test_report, passed_items, bugs_found, release_readiness_score})`

**Step 6 — Arush (Documentation & Enablement Specialist): Documentation (Friday AM)**
Arush updates the relevant documentation for any user-facing changes: user guides, API documentation, training materials, and knowledge base articles. He uses `/process-doc` for internal SOPs and creates client-facing docs if the changes affect client projects.

`pass_context(Arush, Dev, {updated_docs, changelog_items, user_impact_summary})`

**Step 7 — Dev: Release Notes + Changelog (Friday PM)**
Dev compiles the sprint output into Release Notes (internal) and a Changelog entry (for the product roadmap). He updates the product metrics dashboard with sprint velocity, bug rate, and feature completion percentage.

`pass_context(Dev, Kaiser, {release_version, deployment_checklist, monitoring_requirements})`

**Step 8 — Kaiser (System Administrator Agent): Deployment Health Check (Friday PM / Saturday AM)**
Kaiser monitors the deployment: checks database health, verifies backup integrity, monitors error rates for the first 24 hours, and validates that all cron jobs are running correctly. He sends a Deployment Health Report.

`pass_context(Kaiser, Dev, {health_report, error_rates, performance_metrics, issues_detected})`

**Step 9 — Dev: Sprint Review + Retro (Friday Late PM or Monday AM)**
Dev conducts the sprint review: what was completed, what was carried over, what was learned. He holds a retrospective identifying what went well, what didn't, and action items for process improvement. Retro learnings are saved as shared memory.

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "sprint_cycle", sprint_id: "YYYY-WNN", step: N, payload, timestamp}`

**DECISION GATES:**
1. Features requiring new infrastructure — Ujjawal escalates to Shubham for approval
2. Release readiness score below 80% — Rohit blocks release; Dev decides defer or hotfix
3. Bugs with severity S0/S1 — Immediate escalation to Shubham; sprint paused if needed
4. User-facing changes to client projects — Founders approve before deployment

**ESCALATION POINTS:**
- Sprint velocity drops >30% from average — Dev escalates to Kabir for resource review
- Critical bug found in production post-deploy — Triggers Crisis/Incident Response workflow
- Architecture change impacts other agents' workflows — Ujjawal coordinates via Kabir

**EXPECTED OUTPUT:** Deployed features, updated documentation, release notes, changelog, sprint metrics, health report.

**ESTIMATED DURATION:** 5 business days (Monday-Friday), recurring weekly.

---

## Workflow 5: Legal & Compliance Review

**TRIGGER:** New contract requiring review, policy change (internal or regulatory), regulatory update (DPDP Act amendment, MCA notification, RBI circular), or client data handling question.

**AGENT CHAIN:**

**Step 1 — Trigger Source: Request Initiation**
Any agent or founder identifies a legal/compliance need and creates a task with the trigger type: `new_contract`, `policy_change`, `regulatory_update`, or `data_handling_question`. The task includes all relevant context, documents, and urgency level.

`create_task("Legal/Compliance Review", assigned_to: Abhay, {trigger_type, context, documents, urgency, requesting_agent})`

**Step 2 — Abhay (Legal & Contracts Advisor): Legal Analysis (1-2 days)**
Abhay performs the legal analysis appropriate to the trigger type. For contracts: clause-by-clause review using `/review-contract`, risk identification, comparison against the clause library, and flagging non-standard terms. For policy changes: impact assessment on existing contracts and operations. For regulatory updates: analysis of applicability and required actions. He uses `/legal-risk-assessment` to score risk level (Low/Medium/High/Critical).

`pass_context(Abhay, Preeti, {legal_analysis, risk_score, clause_flags, recommended_actions, regulatory_applicability})`

**Step 3 — Preeti (Regulatory Compliance & Data Governance Advisor): Regulatory Compliance Check (1 day)**
Preeti validates the legal analysis against the regulatory framework: DPDP Act compliance for data-related items, IT Act 2000 requirements, sector-specific regulations, and international obligations if cross-border elements exist. She adds compliance annotations and identifies any gaps between the legal position and regulatory requirements. She uses `/compliance-check` for structured assessment.

`pass_context(Preeti, Anne, {compliance_assessment, regulatory_gaps, DPDP_compliance_status, required_filings})`

**Step 4 — Anne (Chartered Compliance Assistant): Filing Requirements (0.5 day)**
Anne checks if the legal/compliance matter triggers any statutory filings: board resolutions (MCA), regulatory notifications, tax implications (GST/TDS), or registration updates. She prepares filing checklists with deadlines and templates.

`pass_context(Anne, Kabir, {filing_checklist, deadlines, templates_prepared, cost_implications})`

**Step 5 — Kabir (Executive Strategy Orchestrator): Cross-Department Impact Assessment (0.5 day)**
Kabir assesses how the legal/compliance matter impacts other departments: Does it affect pricing (Veer)? Client commitments (Arjun)? Marketing claims (Mira)? Revenue projections (Rishi)? He coordinates with affected agents and synthesizes a Cross-Impact Brief.

`pass_context(Kabir, Founders, {cross_impact_brief, affected_departments, recommended_actions, risk_level, approval_needed})`

**DECISION GATE — Founders: Approval (High-Risk Items Only)**
Items scored as High or Critical risk by Abhay, or involving financial commitment >Rs.50K, or creating new regulatory obligations, require Founder approval. Low and Medium risk items can be finalized by Kabir within delegated authority.

**Step 6 — Abhay: Finalize Document (1 day)**
Upon approval (or within Kabir's delegated authority for low-risk items), Abhay finalizes the document: incorporates all compliance annotations from Preeti, filing requirements from Anne, and any founder-directed changes. For contracts, he prepares the execution-ready version using `/signature-request`.

`pass_context(Abhay, Arush, {finalized_document, version, approval_reference, effective_date})`

**Step 7 — Arush (Documentation & Enablement Specialist): Documentation Update**
Arush updates the institutional documentation: adds the finalized document to the knowledge base, updates any affected SOPs, creates a summary entry for the legal/compliance log, and updates training materials if the change affects operational procedures.

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "legal_compliance_review", trigger_type, case_id, risk_level, payload, timestamp}`

**DECISION GATES:**
1. Risk level High or Critical — Founders must approve
2. Financial commitment >Rs.50K — Founders must approve
3. New regulatory obligation — Founders must be informed even if Low risk
4. Changes to existing client contracts — Client communication plan required (Arjun involved)

**ESCALATION POINTS:**
- Legal notice received — Immediate escalation to Founders; 24-hour response target
- DPDP Act violation risk — Preeti escalates immediately; all data processing paused until resolved
- Filing deadline within 7 days — Anne escalates as urgent; daily tracking activated
- Cross-department conflict on compliance interpretation — Kabir escalates to Founders

**EXPECTED OUTPUT:** Finalized legal/compliance document, filing checklist (if applicable), updated SOPs, knowledge base entry, and cross-impact brief.

**ESTIMATED DURATION:** 3-5 business days (standard), 1-2 days (urgent), 24 hours (legal notice response).

---

## Workflow 6: Investor / Grant Application

**TRIGGER:** Identified grant opportunity (SISFS, state schemes), investor introduction, pitch competition, or founder directive to pursue funding.

**AGENT CHAIN:**

**Step 1 — Kabir (Executive Strategy Orchestrator): Strategic Alignment Check (Day 1)**
Kabir evaluates the opportunity against Layaa AI's strategic priorities: Does this funding align with the current phase? What are the strings attached (equity dilution, reporting obligations, sector restrictions)? Is the timing right? He produces a Go/No-Go Recommendation with reasoning.

`pass_context(Kabir, Kshitiz, {opportunity_details, strategic_assessment, go_nogo_recommendation, information_gaps})`

**Step 2 — Kshitiz (Master Research & Data Analyst): Market Research + Data (Days 1-3)**
Kshitiz researches the opportunity deeply: scheme/investor profile, past portfolio/grants, success rates, typical terms, competitor applications, and market sizing data needed for the application. He validates all data points with evidence tags and prepares the Market Intelligence Brief that will back the narrative.

`pass_context(Kshitiz, Rishi, {market_intelligence_brief, scheme_profile, market_sizing_data, competitor_landscape, evidence_tags})`

**Step 3 — Rishi (Revenue Operations Strategist): Financial Projections (Days 3-5)**
Rishi prepares investor-grade financial projections: 3-year revenue forecast (conservative/base/optimistic), monthly burn rate, break-even timeline, revenue model assumptions, and key financial metrics. He uses `/forecast` for scenario modeling and ensures all assumptions are explicitly stated and tagged.

`pass_context(Rishi, Veer, {financial_projections, revenue_model, assumptions, scenarios, break_even_analysis})`

**Step 4 — Veer (Pricing & Unit Economics Specialist): Unit Economics + Pricing Validation (Days 5-6)**
Veer validates the financial projections against unit economics reality: Are the revenue assumptions consistent with current CAC/LTV? Do the margin projections hold at scale? He stress-tests the pricing model under the projected growth scenarios and adds a Unit Economics Validation layer to the financials.

`pass_context(Veer, Abhay, {unit_economics_validation, margin_projections_at_scale, pricing_model_stress_test, red_flags})`

**Step 5 — Abhay (Legal & Contracts Advisor): Legal Structure + Scheme Requirements (Days 6-7)**
Abhay analyzes the legal requirements of the funding opportunity: eligibility criteria, required corporate structure, IP assignment clauses, reporting obligations, exit restrictions, and compliance requirements. For SISFS specifically, he checks incubator agreement terms and fund utilization rules. He prepares a Legal Compliance Checklist.

`pass_context(Abhay, Anne, {legal_compliance_checklist, eligibility_status, structural_requirements, risk_areas})`

**Step 6 — Anne (Chartered Compliance Assistant): Certifications + Eligibility Check (Days 7-8)**
Anne verifies all certifications and registrations are current: DPIIT recognition (valid till 2035), Udyam registration (micro enterprise), PAN/TAN status, GST registration, any required auditor certifications. She prepares the documentation package with all supporting certificates and filings.

`pass_context(Anne, Tara, {eligibility_verified, documentation_package, certifications_list, gaps_if_any})`

**Step 7 — Tara (Brand Voice & Content Architect): Narrative Drafting (Days 8-10)**
Tara writes the application narrative: company story, problem statement, solution description, market opportunity, team credentials, traction, and vision. She uses the brand voice guidelines (confident without arrogance, intelligent without jargon) while adapting tone for the specific audience (investor vs. government scheme evaluator). She weaves in validated data from Kshitiz and financials from Rishi.

`pass_context(Tara, Yuvaan, {application_narrative, sections_draft, data_references, tone_notes})`

**Step 8 — Yuvaan (Sales Enablement Specialist): Pitch Deck (Days 10-12)**
Yuvaan creates the pitch deck or scheme application presentation, translating the narrative into visual, slide-by-slide format. He follows the standard pitch structure (Problem, Solution, Market, Traction, Team, Ask) and customizes for the specific audience. He uses `/create-an-asset` for production.

`pass_context(Yuvaan, Arya, {pitch_deck, application_form_draft, supporting_documents_list})`

**Step 9 — Arya (Personal Assistant for Abhimanyu): Meeting Prep (Days 12-13)**
Arya prepares Abhimanyu for any required meetings, interviews, or pitch presentations: creates a briefing document with key talking points, anticipated questions and answers, scheme evaluator profiles, and logistics. She also manages scheduling and follow-up communications.

`pass_context(Arya, Founders, {meeting_brief, talking_points, QA_prep, logistics, application_package_complete})`

**DECISION GATE — Founders: Review + Submit (Day 13-14)**
Founders review the complete application package: narrative, financials, pitch deck, legal checklist, and eligibility documentation. They approve submission, request changes, or decide not to proceed. Only founders can authorize the final submission.

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "funding_application", opportunity_id, type: "grant|investor|competition", step: N, payload, timestamp}`

**DECISION GATES:**
1. Go/No-Go on pursuing the opportunity — Kabir recommends, Founders decide
2. Financial projections — Founders must validate assumptions before inclusion
3. Legal structure changes (if any required) — Founders must approve
4. Final submission — Founders authorize and submit

**ESCALATION POINTS:**
- Eligibility gap found — Anne escalates immediately; timeline paused until resolved
- Scheme requires equity dilution or IP assignment — Abhay escalates as high-risk to Founders
- Application deadline within 7 days — Kabir activates accelerated timeline, all agents prioritize
- Financial projections show negative unit economics at scale — Veer escalates to Founders

**EXPECTED OUTPUT:** Complete application package (narrative, financials, pitch deck, legal documentation, certifications), meeting prep materials, and submission confirmation.

**ESTIMATED DURATION:** 14 business days (standard), 7 days (accelerated for tight deadlines).

---

## Workflow 7: Client Project Delivery (Post-Contract)

**TRIGGER:** Contract signed and payment received (50% deposit). Nia's onboarding sequence from Workflow 1 completes, and the project transitions to delivery.

**AGENT CHAIN:**

**Step 1 — Arjun (Client Strategy & Discovery Specialist): Kickoff Meeting + Onboarding (Days 1-3)**
Arjun conducts the formal project kickoff meeting with the client: introduces the delivery process (5-stage methodology), confirms key stakeholders and communication preferences, validates scope and timeline from the contract, and establishes reporting cadence. He uses `/client-onboarding` and produces the Project Kickoff Document.

`pass_context(Arjun, Rohit, {kickoff_document, client_stakeholders, communication_preferences, scope_confirmed, timeline_confirmed, access_credentials_needed})`

**Step 2 — Rohit (QA & Validation Specialist): Detailed Discovery + Requirements (Days 3-7)**
Rohit performs deep technical discovery: maps the client's current processes in detail, identifies data sources, system integrations, user workflows, edge cases, and technical constraints. This goes beyond the pre-sales feasibility into implementation-level detail. He uses the `/discovery-call` framework and produces a Detailed Requirements Document with acceptance criteria for every deliverable.

`pass_context(Rohit, Ujjawal, {requirements_document, process_maps, data_sources, integration_inventory, acceptance_criteria, technical_constraints})`

**Step 3 — Ujjawal (Automation Architect): Solution Architecture (Days 7-10)**
Ujjawal designs the complete implementation architecture: detailed workflow diagrams for every automation, database schemas, API integration specifications, error handling flows, security requirements, and a phased build plan. He follows the 7-stage workflow methodology and produces builder-ready specifications that Shubham can implement directly.

`pass_context(Ujjawal, Dev, {solution_architecture, workflow_diagrams, build_plan, phase_breakdown, estimated_effort_per_phase})`

**Step 4 — Dev (Internal Product Manager): Project Tracking Setup (Day 10)**
Dev sets up the project in the tracking system: creates the project, breaks the build plan into tasks with assignments and due dates, sets up milestones aligned with the phase breakdown, and configures the client-facing status dashboard. He ensures the project links to revenue tracking (Rishi) and resource allocation.

`pass_context(Dev, Shubham, {project_setup, task_breakdown, milestones, resource_allocation, tracking_dashboard})`

**Step 5 — Shubham (Co-Founder/CTO) + Build Team: Build (Weeks 2-6, varies by scope)**
Shubham leads the implementation following Ujjawal's architecture and Dev's project plan. Ananya assists with technical decisions and code reviews. Build progress is tracked against milestones. Client is updated at agreed cadence (weekly by default).

`pass_context(Shubham, Rohit, {completed_deliverables, build_notes, known_limitations, ready_for_QA})`

**Step 6 — Rohit: QA + Validation (1-2 weeks)**
Rohit executes comprehensive testing against the acceptance criteria from Step 2: functional testing, edge case testing, integration testing, data validation, performance checks, and security verification. He produces a QA Report with pass/fail per acceptance criterion and a Release Readiness Score.

`pass_context(Rohit, Arush, {QA_report, release_readiness_score, known_issues, client_acceptance_test_plan})`

**Step 7 — Arush (Documentation & Enablement Specialist): User Guides + Training Materials (1 week)**
Arush creates all client-facing documentation: user guides for each workflow, admin documentation, troubleshooting guides, and training materials (slide decks, video scripts, FAQ documents). He uses `/process-doc` and tailors complexity to the client's technical level (remember: Layaa AI's clients are often non-technical SMEs).

`pass_context(Arush, Arjun, {user_guides, training_materials, admin_docs, FAQ, training_agenda})`

**Step 8 — Arjun: Client Handoff + Training (3-5 days)**
Arjun conducts the formal handoff: walks the client through all deliverables, conducts training sessions using Arush's materials, gets sign-off on acceptance criteria, collects client feedback, and handles the final payment (remaining 50%). He produces a Project Completion Report.

`pass_context(Arjun, Nia, {completion_report, client_feedback, sign_off_status, final_payment_status, retention_potential})`

**Step 9 — Nia: Nurture Sequence (Ongoing)**
Nia activates the post-delivery nurture sequence: satisfaction survey (Day 7), check-in email (Day 30), quarterly review invitation, and upsell triggers based on the client's usage patterns. She updates the CRM with client lifecycle stage.

`pass_context(Nia, Rishi, {nurture_activated, client_lifecycle_stage, upsell_potential, retention_risk_score})`

**Step 10 — Rishi (Revenue Operations Strategist): Revenue Tracking**
Rishi updates revenue tracking: records the implementation fee, sets up MRR tracking for the retainer, calculates actual margins versus projections, and updates the pipeline forecast. He flags any margin discrepancies versus the original pricing.

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "client_delivery", project_id, client_id, step: N, payload, timestamp}`

**DECISION GATES:**
1. Scope changes during discovery (Step 2) — If scope expands >10%, Rohit escalates to Founders for change order approval; Veer reprices
2. Architecture requiring new technology not in standard stack — Ujjawal escalates to Shubham
3. QA release readiness below 80% — Rohit blocks handoff; Dev decides fix timeline
4. Client acceptance — Arjun gets formal sign-off before triggering final payment
5. Margin deviation >5% from projection — Rishi escalates to Veer and Founders

**ESCALATION POINTS:**
- Client unresponsive for >7 days — Arjun escalates to Founders for intervention
- Build timeline exceeds estimate by >25% — Dev escalates to Kabir for resource reallocation
- Critical bug found during QA — Rohit escalates to Shubham immediately
- Client dissatisfaction during handoff — Arjun escalates to Founders; retention intervention

**EXPECTED OUTPUT:** Delivered and signed-off project, complete documentation, trained client team, revenue recorded, nurture sequence active, project completion report.

**ESTIMATED DURATION:** 6-10 weeks (depending on project complexity and scope).

---

## Workflow 8: Daily Operations Cycle

**TRIGGER:** Every day at 8:00 AM IST (automated via Kaiser cron job).

**AGENT CHAIN:**

**Step 1 — Kaiser (System Administrator Agent): System Health Check + Briefing Data (8:00-8:05 AM)**
Kaiser runs automated health checks: database integrity (PocketBase), backup verification (last Backblaze B2 backup status), error rates from the past 24 hours, agent budget status (any agents approaching limits), failed write retries, and pending approval queue items. He also collects data for the daily briefing: task completions, overdue tasks, pending approvals, and system notifications.

`pass_context(Kaiser, Sage, {health_report, system_status, budget_status_all_agents, failed_writes, pending_approvals, briefing_data})`

**Step 2 — Sage (Memory & Context Keeper): Overnight Memory Consolidation (8:05-8:10 AM)**
Sage processes memories from the previous day: compresses old memories (>30 days, confidence <0.5), resolves any conflicting memory entries, updates confidence scores based on feedback, and identifies patterns that warrant institutional memory proposals. She produces a Memory Health Report.

`pass_context(Sage, Kabir, {memory_health_report, memories_compressed, conflicts_resolved, pattern_proposals, institutional_memory_candidates})`

**Step 3 — Kabir (Executive Strategy Orchestrator): Daily Briefing Synthesis (8:10-8:20 AM)**
Kabir synthesizes all inputs into the Daily Briefing: system health (from Kaiser), memory insights (from Sage), priority tasks for the day, key deadlines, pending decisions requiring founder input, and any cross-department items needing coordination. The briefing is concise — one page maximum, action-oriented, with clear priority markers.

`pass_context(Kabir, Arya, {daily_briefing, priority_tasks, pending_decisions, deadlines_today, coordination_items})`
`pass_context(Kabir, Ananya, {daily_briefing, Shubham_specific_items, technical_priorities, build_status})`

**Step 4 — Arya (Personal Assistant for Abhimanyu): Abhimanyu's Daily Agenda (8:20-8:25 AM)**
Arya takes Kabir's briefing and personalizes it for Abhimanyu: maps priority items to his calendar, prepares meeting agendas for the day, drafts any communications he needs to send, highlights decisions he needs to make, and organizes his personal task list. She delivers this as a morning notification.

`create_notification(Abhimanyu, "Good Morning — Your Day", {agenda, priorities, decisions_needed}, "daily_briefing")`

**Step 5 — Ananya (Personal Assistant for Shubham): Shubham's Daily Agenda (8:20-8:25 AM)**
In parallel with Arya, Ananya personalizes the briefing for Shubham: highlights technical priorities, build status, any bugs or incidents from overnight, code review requests, and sprint progress. She delivers this as a morning notification.

`create_notification(Shubham, "Good Morning — Your Day", {technical_agenda, build_priorities, incidents}, "daily_briefing")`

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "daily_ops", date: "YYYY-MM-DD", step: N, payload, timestamp}`

**DECISION GATES:**
1. System health issues (S0/S1) — Kaiser escalates immediately; does not wait for daily cycle
2. Budget exhaustion for critical agents — Kaiser notifies Founders for budget loan approval
3. Institutional memory proposals — Kabir flags for Founder ratification in the briefing

**ESCALATION POINTS:**
- System outage detected — Kaiser triggers Crisis/Incident Response workflow immediately
- Multiple agents budget-exhausted — Kaiser escalates to Founders as system-wide issue
- Conflicting memories that affect active client work — Sage escalates to Kabir as urgent

**EXPECTED OUTPUT:** System health report, memory health report, daily briefing, personalized founder agendas.

**ESTIMATED DURATION:** 25 minutes (8:00-8:25 AM IST), fully automated.

---

## Workflow 9: Crisis / Incident Response

**TRIGGER:** S0 bug (system down), S1 bug (critical functionality broken), security breach, client escalation, legal notice, or data breach detection. Can be triggered by Kaiser (automated monitoring), any agent (manual detection), or a founder (external report).

**AGENT CHAIN:**

**Step 1 — Kaiser (System Administrator Agent): Detect + Alert (T+0 minutes)**
Kaiser detects the incident through automated monitoring (error rate spike, health check failure, security alert) or receives a manual report. He immediately classifies severity:
- **S0 (Critical):** System down, data breach, security compromise — all hands, immediate response
- **S1 (High):** Critical feature broken, client-facing bug, legal notice received — urgent, 1-hour response
- **S2 (Medium):** Non-critical bug, minor client complaint — standard, 4-hour response
- **S3 (Low):** Cosmetic issue, minor process failure — tracked, next business day

Kaiser creates an Incident Record with severity, description, affected systems, and initial diagnostic data.

`create_notification(Founders, "INCIDENT: [severity] — [title]", {incident_record}, "critical")`
`pass_context(Kaiser, Kabir, {incident_record, severity, affected_systems, initial_diagnostics, recommended_responders})`

**Step 2 — Kabir (Executive Strategy Orchestrator): Assess Severity + Coordinate (T+5 minutes)**
Kabir takes command of the incident response. He validates Kaiser's severity assessment, identifies the right specialist agents needed, assigns roles (incident commander, investigators, communicators), and establishes the communication cadence. For S0/S1, he activates all relevant agents immediately.

`pass_context(Kabir, [Relevant Specialists], {incident_brief, assigned_role, communication_cadence, priority_actions})`

**Step 3 — Relevant Specialist(s): Investigate (T+10 minutes to T+2 hours)**
Based on incident type, the appropriate specialist investigates:
- **Technical bug:** Shubham + Ujjawal (root cause analysis) + Rohit (impact assessment)
- **Security breach:** Preeti (data impact) + Kaiser (system forensics) + Abhay (legal exposure)
- **Client escalation:** Arjun (client communication) + Rohit (issue validation) + relevant delivery agent
- **Legal notice:** Abhay (legal analysis) + Preeti (regulatory implications) + Kabir (business impact)

The investigating team produces an Incident Analysis: root cause (confirmed or hypothesized), blast radius, data impact, and recommended fix options with tradeoffs.

`pass_context([Investigators], Founders, {incident_analysis, root_cause, blast_radius, fix_options, tradeoffs, recommended_action})`

**DECISION GATE — Founders: Decision (S0: T+30 min, S1: T+1 hour)**
For S0/S1 incidents, Founders make the critical decision: which fix option to pursue, whether to notify affected clients, whether to engage external resources, and whether to pause other operations. For S2/S3, Kabir can authorize the fix within delegated authority.

**Step 4 — Fix Team: Resolve (Timeline varies by severity)**
The designated fix team implements the approved resolution:
- **S0:** Immediate hotfix, potentially rolling back to last known good state. Shubham leads.
- **S1:** Targeted fix with testing. Shubham builds, Rohit validates.
- **S2:** Scheduled fix in next sprint. Dev tracks.
- **S3:** Added to backlog. Dev prioritizes.

For client-facing incidents, Arjun manages client communication throughout: initial acknowledgment (within 1 hour for S0/S1), progress updates (every 2 hours for S0, every 4 hours for S1), and resolution notification.

`pass_context(Fix_Team, Arush, {resolution_details, root_cause_confirmed, preventive_measures, client_communications_sent})`

**Step 5 — Arush (Documentation & Enablement Specialist): Post-Mortem Documentation (T+24-48 hours)**
Arush creates the Post-Mortem Report using `/runbook` methodology: timeline of events, root cause analysis, response evaluation (what went well, what went poorly), corrective actions, and preventive measures. For S0/S1 incidents, this document is mandatory. He also updates any affected runbooks, SOPs, or documentation.

`pass_context(Arush, Kabir, {postmortem_report, corrective_actions, SOP_updates, runbook_updates})`

**Step 6 — Kabir: Institutional Memory Update**
Kabir reviews the post-mortem and extracts institutional learnings: patterns that should be monitored, process improvements to implement, and prevention strategies. He proposes memory updates for all relevant agents and updates the crisis response playbook if needed. For significant incidents, he presents a lessons-learned brief to Founders.

`write_memory(shared, "incident_learning", {incident_id, pattern, prevention, process_change})`

**HANDOFF FORMAT:** Each `pass_context()` includes: `{workflow: "incident_response", incident_id, severity, step: N, payload, timestamp, elapsed_time}`

**DECISION GATES:**
1. S0/S1 incidents — Founders decide fix approach within 30 min / 1 hour respectively
2. Client notification — Founders approve messaging before external communication
3. Data breach confirmed — Founders + Abhay + Preeti must jointly decide notification obligations (DPDP Act requirements)
4. External resource engagement — Founders approve any third-party involvement
5. System rollback — Shubham approves technical rollback decisions

**ESCALATION POINTS:**
- Incident not resolved within SLA (S0: 4 hours, S1: 8 hours) — Kabir escalates for additional resources
- Data breach affecting client PII — Preeti triggers DPDP Act notification obligations (72-hour window)
- Multiple incidents in 7-day window — Kaiser flags as systemic issue; Kabir initiates infrastructure review
- Client threatens contract termination — Arjun + Kabir escalate to Founders for retention intervention

**EXPECTED OUTPUT:** Resolved incident, post-mortem report, updated runbooks/SOPs, institutional learnings saved, client communication completed (if applicable).

**ESTIMATED DURATION:** S0: 4-8 hours resolution + 48-hour post-mortem. S1: 8-24 hours resolution + 48-hour post-mortem. S2: 1-5 days. S3: Next sprint.

---

## Cross-Workflow Dependencies

Some workflows trigger or feed into others. Understanding these connections prevents dropped handoffs:

| When This Happens... | It Triggers... |
|----------------------|---------------|
| Workflow 1 completes (contract signed) | Workflow 7 begins (client project delivery) |
| Workflow 4 deployment causes a bug | Workflow 9 activates (crisis/incident response) |
| Workflow 7 Step 2 reveals scope expansion | Loops back to Workflow 1 Steps 6-8 (repricing + contract amendment) |
| Workflow 3 reveals regulatory change | Workflow 5 activates (legal & compliance review) |
| Workflow 6 requires updated financials | Draws from Workflow 3's latest outputs |
| Workflow 9 resolution reveals process gap | Feeds into Workflow 4 backlog (product sprint) |
| Workflow 8 daily briefing surfaces issue | May trigger Workflow 5 or 9 depending on severity |

---

## Workflow Ownership

Kabir is the default workflow orchestrator. When a workflow spans departments, Kabir ensures handoffs happen on schedule and escalates delays. Individual workflow ownership:

| Workflow | Primary Owner | Escalation Owner |
|----------|--------------|-----------------|
| 1. New Client Intake | Arjun | Kabir |
| 2. Content Publishing | Mira | Kabir |
| 3. Monthly Finance Close | Aarav | Kabir |
| 4. Product Sprint Cycle | Dev | Shubham |
| 5. Legal & Compliance Review | Abhay | Kabir |
| 6. Investor/Grant Application | Kabir | Founders |
| 7. Client Project Delivery | Arjun (pre-build), Dev (build phase) | Kabir |
| 8. Daily Operations Cycle | Kaiser | Kabir |
| 9. Crisis/Incident Response | Kabir | Founders |

---

## SLA Summary

| Workflow | Standard Duration | Accelerated Duration | Hard Deadline |
|----------|------------------|---------------------|---------------|
| New Client Intake | 14-30 days | 7 days | None (client-driven) |
| Content Publishing | 2-5 days | 1 day | Calendar slot |
| Monthly Finance Close | 10 business days | N/A | 10th of month |
| Product Sprint | 5 days | N/A | Weekly recurring |
| Legal & Compliance | 3-5 days | 1-2 days | Filing deadlines |
| Investor/Grant Application | 14 days | 7 days | Application deadline |
| Client Project Delivery | 6-10 weeks | 4 weeks | Contract timeline |
| Daily Operations | 25 minutes | N/A | 8:25 AM IST daily |
| Crisis/Incident Response | Severity-dependent | N/A | S0: 4hrs, S1: 8hrs |

---

*These playbooks define how the 22-agent Layaa AI workforce collaborates on end-to-end processes. All agents must understand their role in each workflow they participate in. Kabir orchestrates cross-workflow dependencies and escalates bottlenecks. Founders hold final authority at every decision gate. Last updated: April 2026.*
