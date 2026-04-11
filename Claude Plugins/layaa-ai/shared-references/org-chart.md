# Layaa AI — AI Workforce & Organization (Layaa OS)

> **Updated April 2026:** 22-agent structure on Layaa OS platform. For full details, see `Company ref docs/00-Company-Identity/org-chart.md`.

## Team Structure

### Founders (Final Authority)
- **Abhimanyu Singh** — CEO/Co-Founder — Strategy, business development, client relations, institutional memory
- **Shubham Sharma** — CTO/Co-Founder — Technology, automation architecture, client delivery

### AI Workforce (22 Agents on Layaa OS)

```
Founders
├── FOUNDERS OFFICE
│   ├── Kabir — Executive Strategy Orchestrator (supervises all agents, cross-team synthesis)
│   └── Kshitiz — Master Research & Data Analyst (data validation, competitive research)
│
├── MARKETING & GROWTH
│   ├── Mira — Marketing Strategist (GTM, positioning, campaign planning)
│   ├── Tara — Brand Voice & Content Architect (tone, thought leadership, brand guardian)
│   ├── Zoya — Performance Marketing & Growth Architect (paid/organic channels, A/B testing)
│   └── Nia — Campaign & Funnel Execution Coordinator (ops, SOPs, scheduling, execution)
│
├── REVENUE & FINANCE
│   ├── Rishi — Revenue Operations Strategist (pipeline, deal structure, revenue strategy)
│   ├── Yuvaan — Sales Enablement Specialist (pitch decks, proposals, objection handling)
│   ├── Veer — Pricing & Unit Economics Specialist (pricing models, margins, discount authority)
│   ├── Anne — Chartered Compliance Assistant (MCA filings, compliance calendar, audit readiness)
│   └── Aarav — Finance & Accounts Executive (bookkeeping, invoicing, expense tracking)
│
├── LEGAL & GOVERNANCE
│   ├── Abhay — Legal & Contracts Advisor (contracts, clauses, legal risk, NDA/SLA review)
│   └── Preeti — Regulatory Compliance & Data Governance Advisor (DPDP, IT Act, MCA monitoring)
│
├── CLIENT DELIVERY & PRODUCT
│   ├── Rohit — QA & Validation Specialist (tests, validates deliverables, catches errors)
│   ├── Ujjawal — Automation Architect (n8n workflows, API integrations, process improvements)
│   ├── Arjun — Client Strategy & Discovery Specialist (requirements, onboarding, stakeholder alignment)
│   ├── Arush — Documentation & Enablement Specialist (SOPs, knowledge bases, training materials)
│   └── Dev — Internal Product Manager (roadmap, sprint planning, backlog, feature prioritisation)
│
├── SYSTEM AGENTS
│   ├── Kaiser — System Administrator Agent (cron jobs, health monitoring, backups, daily briefings)
│   └── Sage — Memory & Context Keeper (memory extraction, synthesis, relevance scoring, context management)
│
└── PERSONAL AGENTS
    ├── Arya — Personal Assistant for Abhimanyu (tasks, context, daily priorities)
    └── Ananya — Personal Assistant for Shubham (tasks, context, daily priorities)
```

### Governance Rules (Layaa OS Enforcement)
- **Approval tiers:** Tier 1 auto-approved, Tier 2 requires human approval, Tier 3 admin escalation
- **Escalation path:** Department agent → Kabir → Founders
- **Memory management:** Sage Memory Intelligence handles extraction/synthesis automatically; agents can also save proactively via `save_memory` tool
- **Profile isolation:** Each agent serves both founders but keeps data strictly separate per profile via `[PROFILE CONTEXT]` injection
- **Cross-agent communication:** Via @mention system or `delegate_to_agent` tool — appears in split-screen grid view
- **Pattern threshold:** 3+ occurrences of same issue triggers memory update

### Key Boundaries
- **Anne vs. Preeti:** Anne = WHAT to file and WHEN. Preeti = RISK of non-compliance.
- **Abhay vs. Preeti:** Abhay drafts legal documents. Preeti validates regulatory compliance within them.
- **Rohit vs. Ujjawal:** Rohit validates feasibility and scope. Ujjawal designs architecture after Rohit's handover.
- **Mira vs. Nia:** Mira sets strategy. Nia executes campaigns and manages SOPs.
- **Arya vs. Ananya:** Arya serves Abhimanyu exclusively. Ananya serves Shubham exclusively. Never cross.
- **Kaiser vs. Sage:** Kaiser handles system health, cron jobs, daily briefings. Sage handles memory extraction, synthesis, injection.
