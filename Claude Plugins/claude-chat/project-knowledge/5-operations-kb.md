# Layaa AI — Operations & Delivery Knowledge Base
*Upload as Project Knowledge. Referenced by layaa-operations, layaa-product, layaa-core skills.*

## Delivery Methodology (Full Detail)

### Stage 1: Discovery — Rohit's 5-Phase Framework
- **Phase 1 — Business Context:** Industry, size, revenue model, growth stage, strategic priorities, current biggest pain
- **Phase 2 — Current State:** Tools in use, manual processes, biggest time drains, team workflow, existing integrations
- **Phase 3 — Requirements:** Ideal future state, what's been tried before, success metrics, stakeholder expectations
- **Phase 4 — Feasibility:** Data access, integration complexity, compliance constraints, technical readiness, risk identification
- **Phase 5 — Solution Design:** Scope options (quick win vs full roadmap), implementation approach, pricing ballpark, next steps
- **Output:** Validated scope doc with feasibility verdict: GO / CONDITIONAL GO / NO GO

### Stage 2: Assessment
- Deep process mapping (current → to-be state)
- Automation opportunity scoring (impact vs. effort matrix)
- Technology stack recommendation (which tools, why)
- ROI projection: Conservative / Base / Optimistic with confidence levels
- **Output:** AI Adoption Roadmap document

### Stage 3: Development — Ujjwal's 7-Stage Framework
**Trigger → Validation → Normalization → Logic → Branching → Output → Logging**
- Architecture design before any building (data flows, integrations, error paths)
- Checkpoint reviews at 25%, 50%, 75%, 100% completion
- Test data always before live data
- Every step has a failure path; no silent failures
- **Output:** Working, tested automation system

### Stage 4: Validation
- End-to-end testing against scope document
- Edge case testing (unusual inputs, high volume)
- Performance benchmarking
- Security and DPDP compliance verification
- **Output:** Test report + client sign-off

### Stage 5: Enablement
- User training (how to use day-to-day)
- Admin training (monitor, troubleshoot, update)
- Documentation: runbooks, user guides, architecture diagrams
- Go-live support: 2 weeks post-launch priority response
- **Output:** Trained team + documentation package

---

## Client Onboarding (Post-Deal-Close)

### Within 24 Hours of Signing
1. Contract executed, 50% advance invoice sent
2. Internal project channel created
3. Kickoff meeting scheduled (within 3 business days)
4. Client added to project management tool

### Kickoff Meeting Agenda (60 min)
1. Introductions (10 min) — Layaa AI team + client team
2. Project overview (10 min) — recap scope, timeline, deliverables
3. Expectations (10 min) — communication style, response times, change request process
4. Discovery scheduling (10 min) — book all discovery sessions
5. Access requirements (10 min) — what we need access to and when
6. Q&A (10 min)

### Required Stakeholder Map (Every Project)
- **Client Champion:** Day-to-day contact, project owner
- **Technical Contact:** Who manages their existing tools/IT
- **Approver/Sponsor:** Budget owner, signs off on deliverables
- **End Users:** Who will use the automation being built

### Communication Cadence (Standard)
- Weekly check-in: 30 min video call (Tuesdays or Wednesdays preferred)
- Delivery reviews: At each stage completion
- Urgent issues: WhatsApp/call within 4 hours
- Regular updates: Async via shared project tracker

---

## Risk Framework

### Risk Categories
1. **Data Risk** — Data quality, access permissions, DPDP compliance, sensitive data handling
2. **Technical Risk** — API stability, integration complexity, performance at scale, vendor dependencies
3. **Process Risk** — Change management, user adoption, training gaps, process exceptions
4. **Compliance Risk** — Regulatory requirements, audit trail needs, data residency
5. **Commercial Risk** — Scope creep, payment delays, stakeholder changes, timeline pressure

### Risk Scoring Matrix
| | High Likelihood | Medium Likelihood | Low Likelihood |
|---|---|---|---|
| **High Severity** | Critical | High | Medium |
| **Medium Severity** | High | Medium | Low |
| **Low Severity** | Medium | Low | Monitor |

### Mitigation by Category
- **Data:** Anonymise test data | Audit data access | Get DPDP consent documentation | Build audit trail into workflow
- **Technical:** Build on proven integrations | Design for failure from day 1 | Load test before go-live
- **Process:** Early change management conversation | Identify internal champions | Phased rollout
- **Compliance:** Check DPDP requirements upfront | Build audit trail into workflow | Legal review for regulated industries
- **Commercial:** Fixed-price with change order process | Milestone-based payments | Clear scope document with exclusions

---

## Technology Stack Reference

### Platforms and When to Use Each
| Platform | Best For | Notes |
|----------|---------|-------|
| n8n (self-hosted) | Complex workflows, sensitive data, custom integrations | Preferred for enterprise; client owns instance |
| Make (Integromat) | Mid-complexity, visual design | Good for marketing automations |
| Zapier | Simple automations, quick wins | Higher per-task cost; Starter tier only |
| Relevance AI | AI agent workflows, knowledge bases | Hosts Layaa AI's GPT workforce |
| Bolt AI | Rapid prototyping only | Not for production |

### Integration Principles
1. REST APIs preferred; webhooks for real-time triggers
2. Official integrations > custom API calls > scraping (never scrape)
3. Every integration has error handling and logging — no silent failures
4. API keys and credentials in secure vault, never in workflow code
5. Check rate limits before high-volume workflows

### Data Handling Principles
- Never persist sensitive personal data in workflow tool — pass through only
- Encrypt data in transit and at rest
- Minimum data necessary: only process what's needed
- Audit trail: log all automated actions for debugging and compliance
- Test with anonymised data first; real data only after validation

---

## AI Workforce — Who to Route Work To

| Need | Go To | Role Title |
|------|-------|-----------|
| Strategy or cross-GPT coordination | Kabir | Executive Strategy Orchestrator |
| Market research, data validation | Kshitiz | Master Research and Data Analyst |
| GTM strategy, campaign planning | Mira | Marketing Strategist |
| Content creation, brand voice, founder posts | Tara | Brand Voice & Content Architect |
| Paid channels, performance marketing | Zoya | Performance Marketing & Growth Architect |
| Campaign execution, SOPs, funnel ops | Nia | Campaign & Funnel Execution Coordinator |
| Pipeline, forecasting, revenue ops | Rishi | Revenue Operations Strategist |
| Sales assets, objection handling, proposals | Yuvaan | Sales Enablement Specialist |
| Pricing, unit economics, deal sizing | Veer | Pricing & Unit Economics Specialist |
| MCA filings, compliance calendar | Anne | Chartered Compliance Assistant |
| Contracts, legal clauses, legal risk | Abhay | Legal & Contracts Advisor |
| Regulatory risk, DPDP, audit readiness | Preeti | Regulatory Compliance & Data Governance Advisor |
| Discovery calls, feasibility, scope validation | Rohit | QA & Validation Specialist |
| Workflow architecture, technical design | Ujjwal | Automation Architect |

**Governance:** Escalation path = Department GPT → Kabir → Founders. All memory updates must be approved by Kabir and ratified by Founders.
