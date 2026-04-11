# Skills & Plugins Directory

> This document lists all 60+ skills available on Layaa OS. You can invoke any skill relevant to your role using the `/skillname` command. Skills load additional context and domain references to help you perform specialized tasks.

---

## How Skills Work on Layaa OS

1. Type `/` to open the command palette
2. Search by name or trigger keyword
3. Select a skill — it loads its content, associated plugin context, and domain references into your conversation
4. The skill's context appears at position 6 in your context loading sequence
5. Any agent can use any skill if needed, but skills are primarily mapped to specific agents

### Layaa AI Context Detection
All skills automatically detect whether you're working on a Layaa AI task or a general task:
- **Layaa AI Mode:** Loads company-specific references (pricing, ICP, brand voice, etc.)
- **General Mode:** Operates as a generic business skill

---

## Sales Skills (8)

| Skill | Command | What It Does | Primary Agent(s) |
|-------|---------|-------------|-------------------|
| Account Research | `/account-research` | Research target companies, evaluate ICP fit, identify service packages | Yuvaan, Arjun |
| Call Prep | `/call-prep` | Prepare for sales calls with prospect research, agenda, objection playbook | Yuvaan, Arjun |
| Call Summary | `/call-summary` | Extract action items from call notes, draft follow-up emails | Yuvaan, Rishi |
| Competitive Intelligence | `/competitive-intelligence` | Research competitors, build battle cards against DIY tools/enterprise/freelancers | Kshitiz, Yuvaan |
| Daily Briefing | `/daily-briefing` | Morning sales briefing with pipeline status and follow-ups | Rishi, Kabir |
| Draft Outreach | `/draft-outreach` | Research prospects and draft personalized outreach emails | Yuvaan, Tara |
| Forecast | `/forecast` | Generate weighted sales forecast with scenarios | Rishi, Veer |
| Pipeline Review | `/pipeline-review` | Analyze pipeline health, prioritize deals, flag risks | Rishi |

**Trigger Keywords:** Research company, account research, prep for call, sales call, summarize call, post-call, competitive analysis, battlecard, daily briefing, sales brief, draft outreach, cold email, sales forecast, pipeline review, deal status

---

## Marketing & Content Skills (13)

| Skill | Command | What It Does | Primary Agent(s) |
|-------|---------|-------------|-------------------|
| Brand Review | `/brand-review` | Audit content for brand consistency and voice compliance | Tara, Mira |
| Campaign Plan | `/campaign-plan` | Create comprehensive campaigns with objectives, budget, timeline, KPIs | Mira, Zoya |
| Competitive Brief | `/competitive-brief` | Competitive analysis for positioning and differentiation | Mira, Kshitiz |
| Content Creation | `/content-creation` | End-to-end content workflow from ideation to final draft | Tara |
| Create Asset | `/create-an-asset` | Generate sales assets: pitch decks, one-pagers, case studies, ROI calculators | Yuvaan, Tara |
| Discover Brand | `/discover-brand` | Search platforms for brand materials and audit against framework | Tara, Mira |
| Draft Content | `/draft-content` | Draft marketing content with brand voice compliance | Tara |
| Email Sequence | `/email-sequence` | Design multi-step email sequences (nurture, onboarding, re-engagement) | Nia, Mira |
| Enforce Voice | `/enforce-voice` | Apply brand voice guidelines to content | Tara |
| Generate Guidelines | `/generate-guidelines` | Generate brand voice guidelines from documents and examples | Tara, Mira |
| Performance Report | `/performance-report` | Analyze campaign metrics, channel ROI, conversion rates | Zoya, Nia |
| SEO Audit | `/seo-audit` | SEO analysis of content and sites (keywords, on-page, technical) | Zoya, Tara |
| Social Media Calendar | `/social-media-calendar` | Generate weekly social content calendars with draft copy | Tara, Nia |

**Trigger Keywords:** Brand review, brand audit, voice review, tone check, campaign plan, campaign strategy, content brief, content calendar, create sales asset, pitch deck, one-pager, draft content, write blog, social media post, email sequence, nurture campaign, drip campaign, SEO audit, keyword analysis, social media calendar, weekly posts

---

## Operations & Process Skills (10)

| Skill | Command | What It Does | Primary Agent(s) |
|-------|---------|-------------|-------------------|
| Capacity Plan | `/capacity-plan` | Plan resource capacity, forecast demand, identify gaps | Dev, Kabir |
| Change Request | `/change-request` | Document change requests with impact assessment and approval workflow | Dev, Rohit |
| Compliance Check | `/compliance-check` | Assess compliance against regulatory requirements | Preeti, Anne |
| Compliance Tracking | `/compliance-tracking` | Track compliance deadlines and status with dashboards | Anne, Preeti |
| Process Doc | `/process-doc` | Create SOPs, workflows, runbooks, procedure guides | Arush, Nia |
| Process Optimization | `/process-optimization` | Analyze processes for inefficiencies and automation opportunities | Rohit, Ujjawal |
| Risk Assessment | `/risk-assessment` | Identify, assess, and prioritize operational risks | Rohit, Preeti |
| Runbook | `/runbook` | Create operational runbooks for recurring tasks and incident response | Arush, Ujjawal |
| Sprint Planning | `/sprint-planning` | Plan sprints with prioritized tasks and capacity allocation | Dev |
| Status Report | `/status-report` | Generate project/operational status reports | Dev, Arush |

**Trigger Keywords:** Capacity plan, resource planning, change request, scope change, compliance check, compliance audit, compliance tracking, filing deadlines, process doc, SOP, process optimization, bottleneck analysis, risk assessment, risk register, runbook, incident response, sprint planning, iteration planning, status report, project update

---

## Finance Skills (8)

| Skill | Command | What It Does | Primary Agent(s) |
|-------|---------|-------------|-------------------|
| Audit Support | `/audit-support` | Prepare audit documentation and supporting schedules | Anne, Aarav |
| Close Management | `/close-management` | Manage month-end and year-end financial close | Aarav |
| Financial Statements | `/financial-statements` | Analyze, prepare, or review financial statements | Aarav, Veer |
| Journal Entry | `/journal-entry` | Create and validate journal entries | Aarav |
| Journal Entry Prep | `/journal-entry-prep` | Prepare batch journal entries from transaction data | Aarav |
| Reconciliation | `/reconciliation` | Perform account reconciliations and identify discrepancies | Aarav |
| SOX Testing | `/sox-testing` | Design and execute internal control testing | Aarav, Preeti |
| Variance Analysis | `/variance-analysis` | Analyze budget variances and forecast accuracy | Aarav, Veer, Rishi |

**Trigger Keywords:** Audit support, audit preparation, month-end close, financial close, financial statements, income statement, balance sheet, P&L, journal entry, reconciliation, bank reconciliation, SOX testing, internal controls, variance analysis, budget vs actual

---

## Legal Skills (8)

| Skill | Command | What It Does | Primary Agent(s) |
|-------|---------|-------------|-------------------|
| Client Agreement | `/client-agreement` | Generate complete client MSA + SoW from scope definition | Abhay |
| Legal Brief | `/legal-brief` | Research and draft legal briefs and position papers | Abhay |
| Legal Response | `/legal-response` | Draft responses to legal notices and regulatory inquiries | Abhay, Preeti |
| Legal Risk Assessment | `/legal-risk-assessment` | Evaluate legal risks for business decisions | Abhay, Preeti |
| Meeting Briefing | `/meeting-briefing` | Prepare legal briefing documents for meetings/negotiations | Abhay, Yuvaan |
| Review Contract | `/review-contract` | Comprehensive review of contracts with risk analysis | Abhay |
| Signature Request | `/signature-request` | Prepare documents for signature and manage execution | Abhay |
| Triage NDA | `/triage-nda` | Review and draft Non-Disclosure Agreements | Abhay |

**Trigger Keywords:** Client agreement, draft agreement, MSA, SoW, legal brief, legal memo, legal response, demand letter, legal risk, risk assessment, meeting brief, negotiation prep, review contract, contract review, signature request, NDA, non-disclosure

---

## Delivery & Client Management Skills (7)

| Skill | Command | What It Does | Primary Agent(s) |
|-------|---------|-------------|-------------------|
| Client Onboarding | `/client-onboarding` | Structured onboarding from deal close through kickoff | Arjun, Arush |
| Discovery Call | `/discovery-call` | Prepare for discovery calls using 5-phase framework | Arjun, Rohit |
| Proposal Generator | `/proposal-generator` | Generate complete proposals from discovery notes | Yuvaan, Arjun |
| Roadmap Update | `/roadmap-update` | Create/update product roadmaps with prioritized features | Dev |
| Stakeholder Update | `/stakeholder-update` | Create stakeholder communications for product progress | Dev, Kabir |
| Synthesize Research | `/synthesize-research` | Synthesize research and customer feedback into insights | Kshitiz, Dev |
| Write Spec | `/write-spec` | Write product specs and requirements documents | Dev, Ujjawal |

**Trigger Keywords:** Client onboarding, new client setup, kickoff, discovery call, discovery session, create proposal, write proposal, roadmap update, feature prioritization, stakeholder update, progress report, synthesize research, insight analysis, write spec, product spec, requirements document

---

## Company Management Skills (6)

| Skill | Command | What It Does | Primary Agent(s) |
|-------|---------|-------------|-------------------|
| Daily Update | `/daily-update` | Daily Layaa AI check-in and feedback loop | Kabir, Arya |
| Investor Update | `/investor-update` | Generate monthly/quarterly investor update reports | Kabir, Aarav |
| Metrics Review | `/metrics-review` | Analyze product and business metrics against KPIs | Dev, Rishi |
| PM Competitive Brief | `/pm-competitive-brief` | Product-focused competitive analysis | Dev, Kshitiz |
| Vendor Check | `/vendor-check` | Evaluate vendors and third-party providers for risk | Aarav, Preeti |
| Vendor Review | `/vendor-review` | Evaluate vendor performance, costs, and alternatives | Aarav, Dev |

**Trigger Keywords:** Daily update, company check-in, investor update, investor report, metrics review, KPI review, PM competitive brief, product competitive analysis, vendor check, vendor assessment, vendor review, tool evaluation

---

## Domain References Available

When skills are invoked, they can load these domain reference libraries:

### Brand Voice
- Tone framework (DO/DON'T rules, vocabulary, banned words)
- Founder voice profiles for ghostwriting
- Content templates by channel (LinkedIn, blog, email, website, ad copy)

### Sales
- Sales playbook with battle cards by persona
- Service configuration matrix (packages by tier)
- Pricing quick reference tables

### Operations
- 5-stage delivery methodology (Discovery → Enablement)
- Technology stack details
- QA validation requirements
- Automation architecture patterns (7-stage workflow)

### Revenue Operations
- Pipeline tracker and project forecast
- Revenue forecasting methodology
- Sales-to-delivery handoff SOP
- GTM-revenue alignment framework

### Marketing
- GTM strategy with budget allocation (LinkedIn 30-35%, Google 20-25%, Content/SEO 15-20%, Email 5-10%, Retargeting 10-15%, Experimental 10%)
- Channel-specific strategies and benchmarks
- Campaign execution framework with UTM standards
- Target segment details and personas

### Finance
- Pricing engine (hybrid formula, complexity multipliers, tiers)
- Company filings details (CIN, PAN, TAN, statutory requirements)
- Compliance calendar (GST, TDS, ITR, AGM deadlines)
- Unit economics framework (CAC, LTV, margins)

### Legal
- Clause library (12+ standard contract clauses with negotiation guidance)
- Contract templates (MSA, SoW)
- Regulatory landscape and compliance framework
- Risk indicators and assessment framework
- Compliance red flags checklist

---

## Plugin Context

All skills operate within the **Layaa AI Business Intelligence Plugin** which provides:
- Automatic Layaa AI context detection
- Domain reference loading based on skill type
- Smart routing between Layaa-specific and general-purpose modes
- Consistent output formatting with evidence tagging

---

*Skills are continuously being added and refined. Use `/help` to see the latest available skills on the platform.*
