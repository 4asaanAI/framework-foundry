# Kabir — KB — Institutional Memory Management

> Governance processes for how institutional memory is proposed, reviewed, approved, and maintained across the Layaa AI agent workforce. Kabir is the gatekeeper for memory quality and consistency.

---

## 1. Memory Governance Process

```
Any Agent Notices Pattern/Decision/Correction
        |
Agent proposes memory update via write_memory()
        |
Kabir reviews for:
  - Accuracy (is this correct?)
  - Relevance (does this matter long-term?)
  - Impact (does this change how we operate?)
  - Consistency (does this contradict existing memory?)
        |
If company-wide impact --> Escalate to Founders for ratification
If agent-specific learning --> Approve within delegated scope
If contradicts existing memory --> Investigate before approving
        |
Approved memories enter the active memory system
Sage manages storage, retrieval, compression
```

---

## 2. Memory Categories and When to Use Each

| Category | Save When... | Example |
|----------|-------------|---------|
| `client_info` | New fact about a client's business, preferences, or constraints | "The Aaryans School prefers WhatsApp-first communication" |
| `decision` | A strategic choice was made and the reasoning matters | "Chose monthly retainer over project-based for CA AI Agent because of predictable revenue" |
| `market_data` | Competitive intelligence, industry benchmarks, market shifts | "Competitor XYZ launched a free tier for CA software" |
| `process` | A workflow was established, changed, or a lesson was learned about how to do things | "Weekly sync works better on Mondays than Fridays" |
| `preference` | A Founder or stakeholder expressed how they want things done | "Abhimanyu prefers 3 options max — not 5" |
| `company` | Company-wide fact changed (new registration, new product, etc.) | "SISFS grant application submitted to DTU IIF on [date]" |
| `conversation_handoff` | Context that needs to persist across conversations | "This conversation started a pricing discussion — Veer has the latest model" |

---

## 3. Memory Quality Checklist

Before approving a memory update, verify:

- [ ] Is it a fact, not an opinion? (or clearly labeled as a preference/recommendation)
- [ ] Is the source identified?
- [ ] Is the confidence score appropriate? (0.7+ for validated data, 0.4-0.6 for preliminary, 0.1-0.3 for speculative)
- [ ] Does it duplicate an existing memory? (if so, update rather than create)
- [ ] Is it timely? (will this still be relevant in 3 months?)
- [ ] Does it contradict any existing memory? (if so, flag for investigation)
- [ ] Is PII handled correctly? (no credentials, minimal personal data)

---

## 4. Mandatory Memory Proposal Triggers

When any of these patterns emerge, you MUST propose a memory update:

- 3+ occurrences of the same issue across different conversations
- A Founder correction that changes how work should be done
- A new client signed or a client churned
- A strategic pivot or priority change
- A process that repeatedly fails and needs documentation
- A cross-department coordination pattern that works well (or doesn't)

---

**Cross-references:**
- For escalation when memory contradictions are found: see `Kabir — KB — Escalation Matrix & Conflict Resolution.md`
- For coordination patterns worth saving as process memories: see `Kabir — KB — Cross-Department Coordination Protocols.md`
- For decisions made during meetings that require memory archival: see `Kabir — KB — Meeting Facilitation & Reporting Frameworks.md`

*Memory governance is one of Kabir's most critical responsibilities. Bad memory corrupts all downstream decisions. Be rigorous.*
