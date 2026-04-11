# Kabir — KB — Capacity Planning & Operational Guidelines

> Framework for assessing agent capacity, identifying bottlenecks, and rebalancing workloads across the Layaa AI agent workforce. Used via the /capacity-plan command and for ongoing operational oversight.

---

## 1. Agent Capacity Assessment

Use this template to evaluate current workforce capacity:

| Agent | Budget (tokens/month) | Current Usage | Primary Workload | Can Take More? |
|-------|----------------------|---------------|------------------|---------------|
| [Name] | [X]K | [X%] | [Description] | [Yes/No] |

---

## 2. Bottleneck Identification

When assessing capacity, systematically check these indicators:

- Which agents are consistently at >80% budget?
- Which agents have idle capacity (<30% usage)?
- Where are tasks queuing up longest?
- Which handoffs create the most delay?

**Key bottleneck patterns to watch for:**
- A single agent blocking multiple downstream workflows
- Cross-department handoffs that consistently stall
- Agents at budget capacity while related agents are underutilized
- Recurring task types consuming disproportionate budget

---

## 3. Rebalancing Options

When bottlenecks are identified, consider these interventions in order of preference:

1. **Redistribute work** — Can tasks be moved to underutilized agents with relevant skills?
2. **Increase budget** — Should a consistently maxed-out agent receive a higher allocation?
3. **Automate via n8n** — Are there recurring tasks that could be handled by automation workflows?
4. **Propose new agent** — Is there a persistent gap that no current agent covers?

---

## 4. Budget Monitoring Integration

Capacity planning connects directly to Kaiser's budget management system:

- **Agent budget usage above 90%**: Triggers a red flag (see `Kabir — KB — Strategic Decision-Making Frameworks.md`)
- **System pool usage**: Kaiser monitors the shared 500K token pool for system operations
- **Monthly reset**: All budgets reset on the 1st — plan capacity assessments for the last week of each month
- **Emergency loans**: Tokens can be loaned from underutilized agents to critical-path agents (coordinate with Kaiser)

---

## 5. Capacity Review Schedule

| Review Type | Frequency | What to Check | Action Output |
|-------------|-----------|---------------|---------------|
| Quick scan | Daily (via daily briefing) | Any agents blocked or exhausted? | Immediate unblock or escalation |
| Trend review | Weekly (via strategy sync) | Usage trends, queuing patterns | Rebalancing recommendations |
| Full assessment | Monthly (after budget reset) | All agents, all metrics | Capacity plan update for Founders |
| Strategic review | Quarterly | Workforce gaps, new agent proposals | Strategic hiring/creation recommendations |

---

**Cross-references:**
- For red flag thresholds on budget usage: see `Kabir — KB — Strategic Decision-Making Frameworks.md`
- For agent status data in daily briefings: see `Kabir — KB — Meeting Facilitation & Reporting Frameworks.md`
- For escalating capacity concerns to Founders: see `Kabir — KB — Escalation Matrix & Conflict Resolution.md`
- For coordinating work redistribution across departments: see `Kabir — KB — Cross-Department Coordination Protocols.md`

*Capacity planning is proactive, not reactive. The goal is to identify bottlenecks before they block critical work.*
