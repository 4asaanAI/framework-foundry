# Sage — KB — Category Classification Guide

> Definitive reference for classifying memories into the correct category, including detailed definitions, boundary rules, and guidance on ambiguous cases.

---

## 1. Category Definitions and Boundaries

### `client_info`
**Definition:** Facts about external clients, their businesses, preferences, constraints, and relationship status.

**Includes:**
- Client company name, industry, size, location
- Key contacts and their roles
- Pain points and needs expressed
- Feature requests and feedback
- Contract terms and pricing agreed
- Communication preferences
- Project status and milestones

**Does NOT include:**
- Internal strategy about how to handle a client (-> `decision`)
- General market data that mentions a client's industry (-> `market_data`)

### `decision`
**Definition:** Strategic or operational choices made, with the reasoning if available.

**Includes:**
- Technology choices ("Chose PocketBase because of data residency")
- Pricing decisions ("SMS module priced as add-on to protect margins")
- Process changes ("Weekly syncs moved to Mondays")
- Strategy shifts ("Focus on education sector first")
- Hiring/resource decisions

**Does NOT include:**
- Decisions that are purely about a client's own business (-> `client_info`)
- Market trends that influenced a decision (-> `market_data`)

### `market_data`
**Definition:** External intelligence about markets, competitors, industries, benchmarks, and trends.

**Includes:**
- Competitor moves (pricing changes, product launches)
- Industry statistics and projections
- Benchmark data (conversion rates, industry averages)
- Regulatory changes affecting the market
- Technology trends relevant to service delivery

### `process`
**Definition:** How things are done — workflows, procedures, SOPs, and operational learnings.

**Includes:**
- Established workflows and their steps
- Lessons learned about execution
- Tool configurations and usage patterns
- Best practices discovered through experience
- Meeting cadences and communication protocols

### `preference`
**Definition:** How people want things done — communication style, format preferences, workflow preferences.

**Includes:**
- Abhimanyu prefers non-technical language
- Shubham welcomes technical detail
- Client X prefers WhatsApp over email
- Weekly reports should be in bullet format
- Specific formatting preferences for outputs

### `company`
**Definition:** Facts about Layaa AI itself — registrations, certifications, financial status, organizational changes.

**Includes:**
- Registration numbers and dates
- Certifications and their validity
- Financial milestones (first revenue, funding events)
- Organizational changes (new agent, role change)
- Legal entity information

### `conversation_handoff`
**Definition:** Context that needs to persist when a conversation or topic moves between agents.

**Includes:**
- What was discussed and decided
- What the receiving agent should do next
- Relevant background the receiving agent needs
- Open questions or pending items
- Who else has been involved

---

## 2. Ambiguous Cases

| Scenario | Correct Category | Why |
|----------|-----------------|-----|
| "Client X wants feature Y" | `client_info` | About the client's needs |
| "We decided to build feature Y for Client X" | `decision` | About our strategic choice |
| "The education market in India is growing 15% YoY" | `market_data` | External market intelligence |
| "We should target education sector first" | `decision` | Our strategic choice |
| "Abhimanyu said he wants simpler reports" | `preference` | Communication style preference |
| "SISFS application deadline extended to May 15" | `company` | About our own filing |
| "Rohit validated the scope; Ujjawal should design next" | `conversation_handoff` | Work transition context |

---

*This document is part of the Sage Knowledge Base. It provides the definitive classification taxonomy for all memory entries in Layaa AI's institutional memory system.*
