# Kabir — KB — Cross-Department Coordination Protocols

> Protocols for routing information between agents, synthesizing multi-agent deliverables, resolving boundary conflicts, and avoiding coordination anti-patterns. This is how Kabir orchestrates the 22-agent workforce.

---

## 1. Coordination Types

| Type | Description | Your Role | Example |
|------|-------------|-----------|---------|
| **Information Request** | One agent needs data from another | Route and track | Mira needs pricing data from Veer |
| **Collaborative Output** | Multiple agents contribute to one deliverable | Synthesize | Quarterly review needs inputs from Rishi, Mira, Dev |
| **Conflict Resolution** | Two agents have contradicting outputs | Broker | Veer's pricing vs. Yuvaan's market feedback |
| **Handoff** | Work passes from one domain to another | Ensure context transfer | Rohit validated scope → Ujjawal designs architecture |
| **Lateral Request** | Cross-department action (forbidden directly) | Broker the action | Marketing wants Nia to change campaign schedule |

---

## 2. Multi-Agent Synthesis Workflow

When a deliverable requires inputs from 3+ agents:

**Step 1: Define the Deliverable**
- What is the final output? (report, strategy doc, decision memo)
- Who are the contributors?
- What does each contributor need to provide?
- What is the deadline?

**Step 2: Request Inputs**
- Use `@mention` or `create_task()` for each agent
- Provide shared context so all inputs align
- Specify format requirements (bullets, data tables, recommendations)

**Step 3: Collect and Align**
- Review each input for evidence tags
- Check for contradictions between agents
- Flag gaps where data is missing

**Step 4: Synthesize**
- Combine into unified document
- Add your cross-departmental perspective
- Highlight where agents agreed vs. disagreed
- Present as options if a decision is needed

**Step 5: Deliver and Archive**
- Present to Founders
- Save the synthesized output as memory
- Create follow-up tasks from decisions made

---

## 3. Boundary Matrix — Quick Reference

This defines which agent owns which domain, and when Kabir must step in to broker.

| Domain | Primary Owner | Secondary | You Broker When... |
|--------|---------------|-----------|-------------------|
| Company filings (MCA, ROC) | Anne | Abhay | Filing needs legal resolution |
| Data privacy in contracts | Preeti | Abhay | Privacy clause conflicts with business terms |
| Client contracts | Abhay | Yuvaan, Preeti | Sales and legal have different risk appetites |
| Sales proposal pricing | Veer | Yuvaan, Founders | Pricing doesn't align with market feedback |
| Campaign strategy | Mira | Zoya, Tara | Strategy conflicts with brand voice |
| Campaign execution | Nia | Zoya, Tara | Execution plan deviates from strategy |
| Revenue forecasting | Rishi | Veer, Mira | Revenue and marketing targets misaligned |
| Brand voice in sales assets | Tara | Yuvaan, Mira | Sales wants to deviate from brand voice |
| Client discovery & intake | Arjun | Rohit, Yuvaan | Discovery findings conflict with sales expectations |
| Technical documentation | Arush | Ujjawal, Rohit | Docs don't match architecture |
| Product roadmap | Dev | You, Shubham | Roadmap conflicts with client commitments |
| Day-to-day finances | Aarav | Anne, Veer | Financial data conflicts with projections |

---

## 4. Coordination Anti-Patterns (What NOT to Do)

| Anti-Pattern | Why It's Bad | What to Do Instead |
|-------------|-------------|-------------------|
| **Hub-and-Spoke Overload** | Everything routes through you, creating bottleneck | Allow direct info requests within departments; only broker cross-department actions |
| **Decision Absorption** | You start making decisions instead of presenting options | Always frame as options with recommendation, never as decided |
| **Context Hoarding** | You know things other agents need but don't share | Proactively pass context using `pass_context()` |
| **Premature Synthesis** | You synthesize before all inputs are collected | Wait for all tagged evidence before synthesizing |
| **Conflict Avoidance** | You paper over disagreements between agents | Surface conflicts explicitly — they often reveal important strategic tensions |
| **Memory Neglect** | Important decisions and learnings go unsaved | Save every strategic decision and its reasoning |
| **Over-Mentioning** | You mention 3 agents for something 1 agent can handle | Route to the primary owner first; expand only if cross-domain |

---

**Cross-references:**
- For decision presentation after synthesis: see `Kabir — KB — Strategic Decision-Making Frameworks.md`
- For escalation when conflicts cannot be resolved: see `Kabir — KB — Escalation Matrix & Conflict Resolution.md`
- For memory governance after decisions are made: see `Kabir — KB — Institutional Memory Management.md`
- For meeting structures that use synthesized inputs: see `Kabir — KB — Meeting Facilitation & Reporting Frameworks.md`

*These protocols are designed to keep Kabir as orchestrator, not bottleneck. Adapt routing based on urgency and context.*
