# Sage — KB — Context Handoff Templates

> Standardized templates for passing context between agents, including agent-to-agent handoffs, sales-to-delivery handoffs, and cross-department coordination handoffs.

---

## 1. Standard Agent-to-Agent Handoff

```
HANDOFF FROM: {from_agent_name} ({canonical_role})
TO: {to_agent_name} ({canonical_role})
DATE: {YYYY-MM-DD}
CONVERSATION: {conversation_id}

TOPIC: {1-line description}

BACKGROUND:
{2-3 sentences of context the receiving agent needs}

DISCUSSED:
- {Key point 1}
- {Key point 2}
- {Key point 3}

DECIDED:
- {Decision 1 — with reasoning if available}
- {Decision 2}

OPEN ITEMS:
- {Question or issue that needs resolution}
- {Pending input from another agent}

WHAT'S NEEDED NEXT:
{Specific ask for the receiving agent — what they should do with this context}

RELATED AGENTS:
- {Other agents already involved and their contributions}
```

---

## 2. Client Context Handoff (Sales to Delivery)

```
HANDOFF FROM: {Sales agent} TO: {Delivery agent}
CLIENT: {Client name}
DATE: {YYYY-MM-DD}

CLIENT PROFILE:
- Company: {name}
- Industry: {type}
- Size: {employees/revenue if known}
- Location: {city/state}
- Primary Contact: {name, role}

DISCOVERY FINDINGS:
- Pain Points: {list}
- Current Tools: {what they use now}
- Budget Signals: {what was discussed}
- Timeline Expectations: {when they want delivery}
- Decision Makers: {who approves}

AGREED SCOPE:
- {Deliverable 1}
- {Deliverable 2}
- {Deliverable 3}

PRICING:
- Implementation: Rs.{X} (payment terms: {X})
- Monthly: Rs.{X}/mo
- Discounts applied: {if any}

RED FLAGS:
- {Any concerns about scope, timeline, budget, or fit}

WHAT DELIVERY NEEDS TO DO:
- {Specific next steps}
```

---

## 3. Cross-Department Coordination Handoff

```
HANDOFF FROM: {agent} TO: Kabir (Executive Strategy Orchestrator)
TYPE: Cross-department coordination needed
DATE: {YYYY-MM-DD}

REQUEST:
{What needs to happen across departments}

DEPARTMENTS INVOLVED:
- {Department 1}: {What's needed from them}
- {Department 2}: {What's needed from them}

CONTEXT:
{Why this needs cross-department coordination}

URGENCY: {Immediate / This Week / This Quarter}

SUGGESTED APPROACH:
{How the requesting agent thinks this should be handled}
```

---

*This document is part of the Sage Knowledge Base. These templates ensure clean, complete context transfers between agents, preventing information loss during handoffs across the Layaa AI workforce.*
