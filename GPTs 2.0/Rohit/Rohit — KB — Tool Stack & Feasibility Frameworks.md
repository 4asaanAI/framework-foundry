# Rohit — KB — Tool Stack & Feasibility Frameworks

> Reference guide for Layaa AI's tool stack, tool selection logic, feasibility decision trees, and MVP vs. Phase 2 planning.

---

## Tool Stack Reference

### Bolt AI (Web Applications)

**What it is:** AI-powered web application builder. Generates full-stack web apps from natural language descriptions.

**Best for:**
- Client-facing dashboards and portals
- Internal admin panels
- Simple CRUD applications
- MVPs and rapid prototypes
- Landing pages with dynamic functionality

**When to recommend:**
- Client needs a web interface
- Speed to delivery is critical (days, not weeks)
- The application is relatively straightforward (forms, tables, dashboards)
- Client doesn't have strong opinions on frontend framework

**When NOT to recommend:**
- Complex multi-page applications with heavy state management
- Applications requiring real-time data (WebSocket-heavy)
- When client mandates a specific framework (React/Angular/Vue)
- Performance-critical applications with thousands of concurrent users

---

### n8n (Workflow Automation — PRIMARY)

**What it is:** Open-source workflow automation platform. Visual builder for connecting APIs, databases, and services.

**Best for:**
- Multi-step automations (webhook → process → store → notify)
- API integrations between client systems
- Scheduled tasks (data sync, report generation, cleanup)
- Event-driven workflows (new record → trigger action)
- Data transformation and routing
- Email/messaging automation

**When to recommend:**
- Any workflow with 2+ steps that connects systems
- Client needs integrations between their existing tools
- Scheduled or event-driven processing
- Data pipeline tasks
- Any scenario where visual workflow design aids maintainability

**When NOT to recommend:**
- Sub-second response time requirements
- Extremely high volume (10,000+ executions/minute)
- Complex ML model deployment (use dedicated ML infrastructure)
- Simple single-action tasks (a Zap might suffice)

**Key n8n Concepts for Discovery:**
- **Trigger:** What starts the workflow (webhook, schedule, new record, manual)
- **Nodes:** Individual processing steps
- **Credentials:** API keys and auth tokens stored encrypted
- **Error Workflow:** Separate workflow that runs when main workflow fails

---

### Relevance AI (AI Agents — PRIMARY)

**What it is:** No-code platform for building AI agents and intelligent workflows with LLM capabilities.

**Best for:**
- Document processing and extraction (invoices, contracts, applications)
- AI-powered chatbots and assistants
- Intelligent data classification and routing
- Content generation workflows
- Knowledge base Q&A systems
- Multi-step AI reasoning chains

**When to recommend:**
- Client needs AI judgment or interpretation (not just rule-based logic)
- Document processing at scale
- Natural language interfaces
- When the AI Checklist passes and the problem is pattern-based

**When NOT to recommend:**
- Simple rule-based logic (use n8n instead)
- Client has zero tolerance for AI errors
- No training data or examples available
- Real-time processing requirements with sub-100ms latency

---

### Zapier (Secondary — Use When)

**When to recommend Zapier over n8n:**
- Client already has Zapier subscription and workflows
- The specific integration only exists on Zapier (not n8n)
- Client's team needs self-service modification capability (less technical than n8n)
- Simple 2-3 step automations for non-technical teams

**Limitations:** Pricing scales with volume, less flexible than n8n, vendor lock-in.

---

### Make (Secondary — Use When)

**When to recommend Make over n8n:**
- Complex visual workflows with many branches (Make's visual builder handles this well)
- Specific integrations that Make handles better than n8n
- Client already uses Make

**Limitations:** Also vendor-dependent, pricing can be opaque, less community support than n8n.

---

### Custom Backend — NestJS/Node.js (Secondary)

**When to recommend custom development:**
- Performance requirements exceed what no-code tools can deliver
- Complex business logic that's painful to maintain in a visual builder
- Need for custom algorithms or data processing
- High-volume data processing (ETL pipelines, real-time analytics)
- When security requirements mandate full code control

**Reality check:** Custom development = 3-5x the time and cost. Only recommend when no-code tools genuinely cannot serve the need.

---

## Feasibility Frameworks & Decision Logic

### The Automation Decision Tree

```
Is the task repetitive or event-driven?
├── No → NOT AUTOMATABLE (manual process optimization instead)
└── Yes → Can it be expressed as rules?
    ├── No → Does it need AI judgment?
    │   ├── No → NOT AUTOMATABLE (human judgment required)
    │   └── Yes → Run AI Checklist
    │       ├── Passes → AI-ASSISTED AUTOMATION
    │       └── Fails → NOT READY FOR AI (fix prerequisites first)
    └── Yes → Is the data digital and accessible?
        ├── No → PREREQUISITE WORK NEEDED (digitize/integrate first)
        └── Yes → Is the ROI positive?
            ├── No → NOT WORTH AUTOMATING (low value)
            └── Yes → FEASIBLE — proceed to tool selection
```

### The Tool Selection Matrix

| Scenario | Recommended Tool | Rationale |
|----------|-----------------|-----------|
| Web app needed | Bolt AI | Fastest path to UI |
| Systems integration | n8n | Visual workflow, maintainable |
| Document processing | Relevance AI | AI extraction capability |
| AI chatbot/agent | Relevance AI | Purpose-built for AI agents |
| Simple 2-step integration | Zapier (if client uses) or n8n | Minimal overhead |
| Complex branching logic | n8n or Make | Visual workflow clarity |
| High-performance API | Custom (NestJS) | Raw performance control |
| Data pipeline | n8n | Native data transformation |
| Reporting dashboard | Bolt AI + n8n | UI + data pipeline |

### MVP vs. Phase 2 Decision Framework

Always push for MVP first. A working simple version beats a planned complex one.

**MVP Criteria:**
- Solves the #1 pain point (not all pain points)
- Uses the simplest possible tool
- Can be delivered in 1-4 weeks
- Demonstrates clear value to client
- Serves as proof-of-concept for larger vision

**Phase 2 Triggers:**
- MVP proves value and client wants to expand
- Additional integrations requested
- Advanced features needed (AI, reporting, multi-user)
- Scale requirements increase

---

*This document is part of Rohit's operational knowledge base. Update as tool capabilities evolve and new selection patterns emerge.*
