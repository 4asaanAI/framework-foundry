# GPTs 2.0 — How to Apply Guide

Where each file goes for every agent. Three destinations:

- **System Instructions** — paste content into the agent's system prompt field
- **Knowledge Base** — upload as a file attachment to the agent
- **Memory** — enter as individual memory entries with Type + Confidence %

Memory types available: `client info`, `decision`, `market data`, `process`, `preference`, `company`, `conversation handoff`

---

## Shared Files (Apply to ALL 22 Agents as Knowledge Base)

These 5 files appear in every agent folder. Upload them as Knowledge Base files for each agent:

| File | Destination |
|------|-------------|
| Agent Directory & Collaboration Map.md | Knowledge Base |
| Governance & Communication Rules.md | Knowledge Base |
| Layaa AI — Company Context.md | Knowledge Base |
| Layaa OS — Platform Capabilities.md | Knowledge Base |
| Skills & Plugins Directory.md | Knowledge Base |

These 3 additional shared files are in `_Shared/` — upload to agents that need them (noted per-agent below):

| File | Upload To |
|------|-----------|
| Indian Business Context.md | Aarav, Anne, Abhay, Preeti, Veer, Kabir |
| Multi-Agent Workflow Playbooks.md | Kabir, Kaiser, Sage, Dev |
| n8n Workflow Patterns & API Reference.md | Ujjawal, Kaiser, Ananya, Dev |

---

## Per-Agent File Mapping

### AARAV (Finance & Accounts Executive)

| File | Destination |
|------|-------------|
| Aarav — System Prompt.md | System Instructions |
| Aarav — KB — Bank Reconciliation SOP.md | Knowledge Base |
| Aarav — KB — Budget & Cash Flow Management.md | Knowledge Base |
| Aarav — KB — Financial Reporting Framework.md | Knowledge Base |
| Aarav — KB — GST & TDS Filing Guide.md | Knowledge Base |
| Aarav — KB — Invoice & Billing Templates.md | Knowledge Base |
| Aarav — KB — Output Templates.md | Knowledge Base |
| Aarav — KB — Vendor Payment Process.md | Knowledge Base |
| Aarav — Memory.md | **Memory** (see below) |

**Memory entries from Aarav — Memory.md:**

| Memory Text | Type | Confidence |
|-------------|------|------------|
| Company PAN: AAGCL6342M, TAN: RTKL05493F, CIN: U62099HR2025PTC139528 | company | 100% |
| Bootstrapped. Zero external funding. Infrastructure budget cap Rs.500/month. No cushion. | company | 100% |
| Aaryans School is the primary active client. EduFlow deployment. 2 branches. GST at 18% applied. | client info | 100% |
| SSA (Akshat Sharma) — Education client. Invoice status to be confirmed. | client info | 70% |
| CA AI Agent — Prospect stage. No invoices generated yet. | client info | 60% |
| Standard payment terms: 50% advance before work, 50% on delivery. Non-negotiable for new clients. | process | 100% |
| GST: 18% on all invoices. IGST for inter-state, CGST+SGST for intra-state Haryana. | process | 100% |
| TDS quarterly deadlines: Q1 July 31, Q2 Oct 31, Q3 Jan 31, Q4 May 31. | process | 100% |
| GSTR-1 due 11th of following month. GSTR-3B due 20th of following month. GSTR-9 due Dec 31. | process | 100% |
| Advance Tax: June 15 (15%), Sep 15 (45%), Dec 15 (75%), Mar 15 (100%). ITR Oct 31 for companies. | process | 100% |
| SISFS grant application for Rs.20 Lakhs. Budget: Tech Rs.6-8L, Market Rs.3-4L, Ops Rs.2-3L, Team Rs.4-5L, Contingency Rs.2-3L. | decision | 90% |
| Budget philosophy: Free tier first, always. Paid tools must replace something or enable revenue directly. | preference | 100% |
| Every transaction gets recorded — no exceptions. Receivables chased on day one of overdue. | preference | 100% |
| Rs.500/month infra cap is law until founders explicitly revise it. | preference | 100% |
| SISFS funds (if received) must be segregated and tracked separately. | process | 100% |

---

### ABHAY (Legal & Contracts Advisor)

| File | Destination |
|------|-------------|
| Abhay — System Prompt.md | System Instructions |
| Abhay — KB — Contract Templates.md | Knowledge Base |
| Abhay — KB — Investor Mapping Framework.md | Knowledge Base |
| Abhay — KB — Legal Clause Library (Part 1 — Clauses 1-6).md | Knowledge Base |
| Abhay — KB — Legal Clause Library (Part 2 — Clauses 7-12).md | Knowledge Base |
| Abhay — KB — Legal Context Overview — Indian Startup Law.md | Knowledge Base |
| Abhay — KB — Output Templates.md | Knowledge Base |
| Abhay — KB — Scheme Intelligence Tracker.md | Knowledge Base |
| Abhay — Memory.md | **Memory** (break into entries per Kabir-style format if tabular, or extract key facts if narrative) |

---

### ANANYA (Personal Assistant for Shubham)

| File | Destination |
|------|-------------|
| Ananya — System Prompt.md | System Instructions |
| Ananya — KB — DevOps & Infrastructure.md | Knowledge Base |
| Ananya — KB — Email & Communication Templates.md | Knowledge Base |
| Ananya — KB — Layaa OS Architecture Reference.md | Knowledge Base |
| Ananya — KB — Product Technical Overviews.md | Knowledge Base |
| Ananya — KB — Shubham Technical Profile.md | Knowledge Base |
| Ananya — KB — Social Media Content Bank.md | Knowledge Base |
| Ananya — KB — Sprint Planning Framework.md | Knowledge Base |
| Ananya — KB — Technical Documentation & CTO Brand.md | Knowledge Base |
| Ananya — Memory.md | **Memory** |

---

### ANNE (Chartered Compliance Assistant)

| File | Destination |
|------|-------------|
| Anne — System Prompt.md | System Instructions |
| Anne — KB — Company Incorporation Details.md | Knowledge Base |
| Anne — KB — Compliance Calendar.md | Knowledge Base |
| Anne — KB — DPIIT & UDYAM Guide.md | Knowledge Base |
| Anne — KB — Draft Templates.md | Knowledge Base |
| Anne — KB — MCA Filing Guide.md | Knowledge Base |
| Anne — KB — MCA Forms Quick Reference.md | Knowledge Base |
| Anne — KB — Startup Certifications & Grants Tracker.md | Knowledge Base |
| Anne — Memory.md | **Memory** |

---

### ARJUN (Client Strategy & Discovery Specialist)

| File | Destination |
|------|-------------|
| Arjun — System Prompt.md | System Instructions |
| Arjun — KB — Client Discovery Framework.md | Knowledge Base |
| Arjun — KB — Client Onboarding Playbook.md | Knowledge Base |
| Arjun — KB — Handoff Protocols.md | Knowledge Base |
| Arjun — KB — ICP Deep Dives.md | Knowledge Base |
| Arjun — KB — Opportunity Scoring Matrix.md | Knowledge Base |
| Arjun — KB — Output Templates.md | Knowledge Base |
| Arjun — KB — Relationship Management Framework.md | Knowledge Base |
| Arjun — Memory.md | **Memory** (see below) |

**Memory entries from Arjun — Memory.md:**

| Memory Text | Type | Confidence |
|-------------|------|------------|
| Aaryans School — Active client. 2 branches. EduFlow deployment. Flagship engagement and proof of concept. | client info | 100% |
| Schools buy on trust and relationship, not feature lists. Decision-maker is owner/principal. | market data | 90% |
| Schools pricing sensitivity is high. Rs.3,000-8,000/month fee bracket. Implementation must be dead simple — under 30 min training. | market data | 90% |
| SSA — Active/early engagement. Primary contact Akshat Sharma. Discovery details need documentation. | client info | 70% |
| CA AI Agent — Prospect stage. Product targeting CA firms. No paying client yet in this vertical. | client info | 70% |
| CAs are conservative buyers. Need accuracy guarantees and data security. Entry point should be narrow use case. | market data | 85% |
| Target school profile: Private, 2+ branches, Rs.3K-10K/mo fees, 500-3000 students, NCR initially. | market data | 90% |
| Target CA profile: 2-10 professionals, 200+ ITR filings/season, using Tally + Excel + manual. | market data | 85% |
| Warm introductions convert at 3-5x cold outreach. Demo-first conversations. WhatsApp as primary channel. | market data | 90% |
| If not ready to commit after 2 meetings, wrong person or not enough pain. | preference | 85% |
| Never say LLM, RAG, fine-tuning to clients. Say "the system reads the document and fills in the form." | preference | 100% |
| Handoff to Rohit requires: Client Brief, Pain Points (ranked), Scope Agreement, Budget & Terms, Timeline, Relationship Notes, Red Flags. | process | 100% |
| Stay involved through first 2 weeks of delivery after handoff. Do not throw clients over the wall. | process | 100% |

---

### ARUSH (Documentation & Enablement Specialist)

| File | Destination |
|------|-------------|
| Arush — System Prompt.md | System Instructions |
| Arush — KB — Client Enablement Program.md | Knowledge Base |
| Arush — KB — Document Templates Library.md | Knowledge Base |
| Arush — KB — Documentation Review Checklist.md | Knowledge Base |
| Arush — KB — Documentation Style Guide.md | Knowledge Base |
| Arush — KB — Knowledge Base Organization.md | Knowledge Base |
| Arush — KB — Self-Learning Framework.md | Knowledge Base |
| Arush — Memory.md | **Memory** |

---

### ARYA (Personal Assistant for Abhimanyu)

| File | Destination |
|------|-------------|
| Arya — System Prompt.md | System Instructions |
| Arya — KB — Abhimanyu Professional Profile.md | Knowledge Base |
| Arya — KB — Calendar & Daily Management.md | Knowledge Base |
| Arya — KB — Email Response Templates.md | Knowledge Base |
| Arya — KB — Investor Communication Framework.md | Knowledge Base |
| Arya — KB — Meeting Prep & Communication Templates.md | Knowledge Base |
| Arya — KB — Personal Brand & Social Media Strategy.md | Knowledge Base |
| Arya — KB — Productivity & Delegation Protocols.md | Knowledge Base |
| Arya — KB — Social Media Content Bank.md | Knowledge Base |
| Arya — Memory.md | **Memory** |

---

### DEV (Internal Product Manager)

| File | Destination |
|------|-------------|
| Dev — System Prompt.md | System Instructions |
| Dev — KB — Bug Triage & Release Planning.md | Knowledge Base |
| Dev — KB — Feature Backlog & Prioritization.md | Knowledge Base |
| Dev — KB — Layaa OS Product Roadmap.md | Knowledge Base |
| Dev — KB — Output Templates.md | Knowledge Base |
| Dev — KB — Product Metrics & KPIs.md | Knowledge Base |
| Dev — KB — Product Spec Template.md | Knowledge Base |
| Dev — KB — Self-Learning Framework.md | Knowledge Base |
| Dev — KB — Sprint Planning Framework.md | Knowledge Base |
| Dev — Memory.md | **Memory** |

---

### KABIR (Executive Strategy Orchestrator)

| File | Destination |
|------|-------------|
| Kabir — System Prompt.md | System Instructions |
| Kabir — KB — Capacity Planning & Operational Guidelines.md | Knowledge Base |
| Kabir — KB — Cross-Department Coordination Protocols.md | Knowledge Base |
| Kabir — KB — Escalation Matrix & Conflict Resolution.md | Knowledge Base |
| Kabir — KB — Institutional Memory Management.md | Knowledge Base |
| Kabir — KB — Meeting Facilitation & Reporting Frameworks.md | Knowledge Base |
| Kabir — KB — Strategic Decision-Making Frameworks.md | Knowledge Base |
| Kabir — Memory.md | **Memory** (already in tabular format — enter each row directly) |

**Kabir's Memory is already in table format with Category + Confidence. Enter each row as-is.** Key entries include:

- 6 entries type `company` at 90-100%
- 5 entries type `client info` at 60-100%
- 6 entries type `decision` at 80-100%
- 5 entries type `process` at 100%
- 4 entries type `preference` at 100%
- 3 entries type `market data` at 100%

---

### KAISER (System Administrator Agent)

| File | Destination |
|------|-------------|
| Kaiser — System Prompt.md | System Instructions |
| Kaiser — KB — Backup Procedures & Disaster Recovery.md | Knowledge Base |
| Kaiser — KB — Budget Management & Reset.md | Knowledge Base |
| Kaiser — KB — Cron Job Implementation.md | Knowledge Base |
| Kaiser — KB — Failed Write Retry & Notifications.md | Knowledge Base |
| Kaiser — KB — PocketBase Administration.md | Knowledge Base |
| Kaiser — KB — System Monitoring & Incident Response.md | Knowledge Base |
| Kaiser — Memory.md | **Memory** |

---

### KSHITIZ (Master Research & Data Analyst)

| File | Destination |
|------|-------------|
| Kshitiz — System Prompt.md | System Instructions |
| Kshitiz — KB — Data Sources Directory & Cleaning Protocol.md | Knowledge Base |
| Kshitiz — KB — Evidence Validation & Competitive Intelligence.md | Knowledge Base |
| Kshitiz — KB — Industry Benchmarks & KPIs.md | Knowledge Base |
| Kshitiz — KB — Market Research Framework.md | Knowledge Base |
| Kshitiz — KB — Reporting & Technical Reference.md | Knowledge Base |
| Kshitiz — KB — Research Methodology Framework.md | Knowledge Base |
| Kshitiz — KB — Statistical Methods Guide.md | Knowledge Base |
| Kshitiz — Memory.md | **Memory** |

---

### MIRA (Marketing Strategist)

| File | Destination |
|------|-------------|
| Mira — System Prompt.md | System Instructions |
| Mira — KB — Brand Positioning Canvas.md | Knowledge Base |
| Mira — KB — Budget & Performance Benchmarks.md | Knowledge Base |
| Mira — KB — Campaign Playbooks & Content Strategy.md | Knowledge Base |
| Mira — KB — Channel Prioritization Checklist.md | Knowledge Base |
| Mira — KB — GTM Strategy Framework.md | Knowledge Base |
| Mira — KB — Inter-Agent Coordination Protocols.md | Knowledge Base |
| Mira — KB — Market Research Framework.md | Knowledge Base |
| Mira — KB — Messaging Matrix Template.md | Knowledge Base |
| Mira — KB — SME Market Landscape & ICP Deep Dives.md | Knowledge Base |
| Mira — Memory.md | **Memory** |

---

### NIA (Campaign & Funnel Execution Coordinator)

| File | Destination |
|------|-------------|
| Nia — System Prompt.md | System Instructions |
| Nia — KB — Campaign Brief Intake Template.md | Knowledge Base |
| Nia — KB — Coordination Playbook.md | Knowledge Base |
| Nia — KB — Email Automation & CRM Management.md | Knowledge Base |
| Nia — KB — Funnel Execution SOPs.md | Knowledge Base |
| Nia — KB — UTM & Tracking Standards.md | Knowledge Base |
| Nia — Memory.md | **Memory** |

---

### PREETI (Regulatory Compliance & Data Governance)

| File | Destination |
|------|-------------|
| Preeti — System Prompt.md | System Instructions |
| Preeti — KB — Audit Readiness Checklist.md | Knowledge Base |
| Preeti — KB — Compliance Red Flags & Escalation Matrix.md | Knowledge Base |
| Preeti — KB — Data Classification & Governance Guide.md | Knowledge Base |
| Preeti — KB — Policy Templates Library.md | Knowledge Base |
| Preeti — KB — Regulatory Landscape (DPDP Act & IT Act).md | Knowledge Base |
| Preeti — Memory.md | **Memory** |

---

### RISHI (Revenue Operations Strategist)

| File | Destination |
|------|-------------|
| Rishi — System Prompt.md | System Instructions |
| Rishi — KB — Escalation & Self-Learning Tracker.md | Knowledge Base |
| Rishi — KB — GTM-Revenue Alignment Matrix.md | Knowledge Base |
| Rishi — KB — Revenue Forecast Framework.md | Knowledge Base |
| Rishi — KB — Revenue Pipeline Tracker.md | Knowledge Base |
| Rishi — KB — Revenue Reporting & Pipeline Health.md | Knowledge Base |
| Rishi — KB — Sales-to-Revenue Handoff SOP.md | Knowledge Base |
| Rishi — Memory.md | **Memory** |

---

### ROHIT (QA & Validation Specialist)

| File | Destination |
|------|-------------|
| Rohit — System Prompt.md | System Instructions |
| Rohit — KB — Client Intake Questionnaire.md | Knowledge Base |
| Rohit — KB — Discovery Methodology (5 Phases).md | Knowledge Base |
| Rohit — KB — Effort Estimation Scale.md | Knowledge Base |
| Rohit — KB — Output Templates.md | Knowledge Base |
| Rohit — KB — Risk Analysis & Handover Format.md | Knowledge Base |
| Rohit — KB — Tool Stack & Feasibility Frameworks.md | Knowledge Base |
| Rohit — Memory.md | **Memory** |

---

### SAGE (Memory & Context Keeper)

| File | Destination |
|------|-------------|
| Sage — System Prompt.md | System Instructions |
| Sage — KB — Category Classification Guide.md | Knowledge Base |
| Sage — KB — Context Handoff Templates.md | Knowledge Base |
| Sage — KB — Memory Compression Strategy.md | Knowledge Base |
| Sage — KB — Memory Extraction Heuristics.md | Knowledge Base |
| Sage — KB — Memory Hygiene Protocols.md | Knowledge Base |
| Sage — KB — Memory System Architecture & Emergency Procedures.md | Knowledge Base |
| Sage — KB — Personal Productivity Frameworks.md | Knowledge Base |
| Sage — KB — Relevance Scoring Deep Dive.md | Knowledge Base |
| Sage — Memory.md | **Memory** (already tabular — enter each row directly) |

**Sage's Memory is already in table format.** Key sections:

- All 22 agent names and roles → `company` at 100%
- Company identity → `company` at 100%
- Founder profiles → `preference` at 100%
- Active projects → `company` at 90-100%
- Memory system config → `process` at 60-100%
- Founder preferences for memory → `preference` at 90-100%
- Department structure → `company` at 100%

---

### TARA (Brand Voice & Content Architect)

| File | Destination |
|------|-------------|
| Tara — System Prompt.md | System Instructions |
| Tara — KB — Brand Tone & Messaging Framework.md | Knowledge Base |
| Tara — KB — Channel Strategy & Best Practices.md | Knowledge Base |
| Tara — KB — Content Calendar & Messaging History.md | Knowledge Base |
| Tara — KB — Content Format Templates.md | Knowledge Base |
| Tara — KB — Founder Voice Profiles.md | Knowledge Base |
| Tara — Memory.md | **Memory** |

---

### UJJAWAL (Automation Architect)

| File | Destination |
|------|-------------|
| Ujjawal — System Prompt.md | System Instructions |
| Ujjawal — KB — Build Handoff & Testing Checklist.md | Knowledge Base |
| Ujjawal — KB — Data Handling & Schemas.md | Knowledge Base |
| Ujjawal — KB — Error Handling & Debugging Playbook.md | Knowledge Base |
| Ujjawal — KB — n8n Architecture Patterns.md | Knowledge Base |
| Ujjawal — KB — Security & Compliance for Builders.md | Knowledge Base |
| Ujjawal — KB — Step-by-Step Workflow Building Method.md | Knowledge Base |
| Ujjawal — KB — Workflow Execution Fundamentals (n8n).md | Knowledge Base |
| Ujjawal — Memory.md | **Memory** |

---

### VEER (Pricing & Unit Economics Specialist)

| File | Destination |
|------|-------------|
| Veer — System Prompt.md | System Instructions |
| Veer — KB — Margin Sensitivity Guidelines.md | Knowledge Base |
| Veer — KB — Price Adjustment SOP.md | Knowledge Base |
| Veer — KB — Pricing Tiering Frameworks.md | Knowledge Base |
| Veer — KB — Product Pricing Reference (EduFlow + CA AI).md | Knowledge Base |
| Veer — KB — Unit Economics Template.md | Knowledge Base |
| Veer — Memory.md | **Memory** |

---

### YUVAAN (Sales Enablement Specialist)

| File | Destination |
|------|-------------|
| Yuvaan — System Prompt.md | System Instructions |
| Yuvaan — KB — Battle Card Vault.md | Knowledge Base |
| Yuvaan — KB — Collaboration Directory & CRM Standards.md | Knowledge Base |
| Yuvaan — KB — Objection Handling Playbook.md | Knowledge Base |
| Yuvaan — KB — Output Templates.md | Knowledge Base |
| Yuvaan — KB — Pricing & Legal Escalation Guide.md | Knowledge Base |
| Yuvaan — KB — Sales Asset Templates & Quality Checklist.md | Knowledge Base |
| Yuvaan — KB — Sales Enablement SOP & Service Configuration.md | Knowledge Base |
| Yuvaan — Memory.md | **Memory** |

---

### ZOYA (Performance Marketing & Growth Architect)

| File | Destination |
|------|-------------|
| Zoya — System Prompt.md | System Instructions |
| Zoya — KB — Growth Loops & Referral Frameworks.md | Knowledge Base |
| Zoya — KB — Growth Strategy Templates.md | Knowledge Base |
| Zoya — KB — Output Templates & Testing & Attribution.md | Knowledge Base |
| Zoya — KB — Performance Channel Playbooks.md | Knowledge Base |
| Zoya — KB — Performance Risk Signals & Marketing Funnel.md | Knowledge Base |
| Zoya — KB — Target Segments & Messaging Grid.md | Knowledge Base |
| Zoya — Memory.md | **Memory** |

---

## Memory Entry Guide for Narrative-Format Memory Files

Some Memory files (Aarav, Arjun, Arya, Ananya, Arush, etc.) are written as narrative prose. To convert them into memory entries:

**Step 1:** Read each section heading and identify the category:

| Section Topic | Memory Type |
|---------------|-------------|
| Company info, PAN, CIN, funding status, stage | `company` |
| Client names, details, engagement status | `client info` |
| Decisions made, priorities set, tools chosen | `decision` |
| Industry insights, benchmarks, funnel metrics, pricing data | `market data` |
| SOPs, workflows, deadlines, handoff protocols, filing dates | `process` |
| Communication style, banned words, formatting rules, tools | `preference` |
| Context passed between agents for ongoing work | `conversation handoff` |

**Step 2:** Extract standalone facts (one per memory entry). Each should be understandable without reading the source doc.

**Step 3:** Assign confidence:

| Source | Confidence |
|--------|------------|
| Official documents (CoI, PAN, registrations) | 100% |
| Founder-stated facts or explicit directives | 100% |
| Confirmed from company context docs | 90-100% |
| Observed from client interactions | 80-90% |
| Estimates, projections, assumptions | 60-80% |
| Unconfirmed or to-be-verified items | 50-70% |

---

## Quick Stats

| Item | Count |
|------|-------|
| Agents | 22 |
| System Prompts (→ System Instructions) | 22 |
| KB files (→ Knowledge Base) | ~140 unique + 5 shared per agent |
| Memory files (→ Memory entries) | 22 |
| Total files to process | ~309 |
