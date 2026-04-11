# Rohit — QA & Validation Specialist | Memory

> This file contains Rohit's initial memory context — client discovery history, feasibility assessment patterns, and operational learnings. Memories here are seeded from existing engagements and will grow as Rohit operates on Layaa OS.

---

## Client Discovery History

### The Aaryans School (EduFlow Deployment)
- **Industry:** Education (CBSE-affiliated, two branches: Joya & Meerut, UP)
- **Discovery Date:** March 2026
- **Key Findings:** Paper-based attendance, manual fee tracking, WhatsApp-only parent communication. Admin staff has low tech literacy. Principal is project champion.
- **Feasibility Result:** GREEN — High feasibility for attendance automation, fee management, parent notifications. All automation checklist criteria passed.
- **Tool Selection:** Bolt AI (web portal), n8n (backend automation for notifications and data sync)
- **Effort Estimate:** 6/10 (moderate — multiple modules but straightforward logic)
- **Handover Status:** Completed to Ujjawal. Architecture designed. Build in progress.
- **Pilot Date:** April 13, 2026
- **Lesson Learned:** School admin staff needs extra training time. Build training into the timeline, not as an afterthought.

### SSA — Akshat Sharma (EduFlow v2)
- **Industry:** Education
- **Discovery Date:** March 2026
- **Key Findings:** Similar to Aaryans but wants more advanced features (assignment generation, AI tutor). Has clearer tech requirements.
- **Feasibility Result:** GREEN for core modules, YELLOW for AI tutor (needs content corpus, error tolerance discussion).
- **Tool Selection:** Bolt AI (web), n8n (automation), Relevance AI (AI tutor component)
- **Effort Estimate:** 7/10 (AI components add complexity)
- **Handover Status:** Completed to Ujjawal.
- **Pilot Date:** April 15, 2026
- **Lesson Learned:** AI components should always be Phase 2, not MVP. Get core working first.

### CA AI Agent (Product Development)
- **Industry:** Professional Services — Chartered Accountancy
- **Discovery Date:** Ongoing (product, not client project)
- **Key Findings:** CAs receive documents via WhatsApp in varied formats. ITR filing has near-zero error tolerance. Client communication is manual and time-consuming. Deadline tracking is critical.
- **Feasibility Result:** GREEN for document intake automation, YELLOW for auto-filling ITR forms (error tolerance concern), GREEN for deadline tracking and notifications.
- **Tool Selection:** Relevance AI (document processing), n8n (workflow orchestration), Bolt AI (client portal)
- **Lesson Learned:** Tax filing has regulatory risk — always include human review checkpoint before any government portal submission. Never fully automate compliance-critical steps.

---

## Feasibility Assessment Results — Patterns

### Most Common Pass Patterns
1. **Notification/alert systems** — Almost always feasible. Digital triggers, rule-based, clear value.
2. **Data sync between two systems** — Feasible if both have APIs. Common quick win.
3. **Report generation** — Feasible if data is structured. n8n + template = fast delivery.
4. **Appointment/booking systems** — Feasible. Well-understood pattern.

### Most Common Fail Patterns
1. **"Automate our decision-making"** — Fails AI checklist: clients expect 100% accuracy, but AI provides 90-95%.
2. **Paper-to-digital conversion** — Fails clean data criterion. Prerequisite: digitize first.
3. **WhatsApp as primary data source** — Fails clean data. WhatsApp messages are unstructured. Requires AI extraction layer.
4. **Government portal automation** — Fails system access. Most Indian government portals lack APIs. Captchas, session management, and frequent UI changes make this fragile.

---

## Common Pain Points by Industry

### Education
- Attendance tracking (manual, error-prone, time-consuming)
- Fee collection and tracking (cash + UPI + bank transfer = reconciliation nightmare)
- Parent communication (one-way WhatsApp broadcasts, no tracking)
- Report card generation (manual data entry per student)
- Admission management (paper forms, lost applications)

### Professional Services (CA/Legal/Consulting)
- Document collection from clients (WhatsApp chaos)
- Deadline management (missed filing dates = penalties)
- Repetitive form filling (same data entered into multiple systems)
- Client communication (manual follow-ups for missing documents)
- Billing and time tracking (undercharging due to poor tracking)

### SaaS Startups
- Manual customer onboarding (could be self-service)
- Support ticket routing (wrong team gets tickets, delays)
- Data silos (CRM, support tool, billing tool don't talk to each other)
- Churn signals not tracked (usage drops go unnoticed)
- Manual reporting (pulling data from 5 tools into one spreadsheet)

---

## Tool Selection Patterns

| Scenario | Tool Chosen | Rationale | Confidence |
|----------|-------------|-----------|------------|
| School web portal | Bolt AI | Fast delivery, straightforward UI needs | High |
| Fee notification automation | n8n | Event-driven, multi-step, integrates with payment data | High |
| WhatsApp document intake | Relevance AI + n8n | AI extraction from unstructured messages, then workflow | Medium |
| Client portal with login | Bolt AI | Standard auth + CRUD pattern | High |
| Bulk report generation | n8n | Scheduled workflow, data query + template | High |
| AI-powered Q&A | Relevance AI | Knowledge base + LLM = native capability | High |

---

## Risk Patterns

### Recurring Risks Across Engagements
1. **Client expects full automation of compliance-critical processes** — Always flag, always require human checkpoint.
2. **Data quality is worse than client reports** — Build in a data assessment step before committing to timeline.
3. **Key stakeholder not involved in discovery** — End users who weren't consulted resist adoption.
4. **WhatsApp dependency** — Indian SMEs use WhatsApp for everything. Factor in WhatsApp Business API costs and limitations.
5. **Internet reliability** — Smaller cities and towns have inconsistent internet. Offline capability matters.

---

## Handover Quality Feedback

### From Ujjawal (Automation Architect)
- **Positive:** Structured format makes architecture design faster. Risk register is especially valuable.
- **Improvement needed:** Include more specific data examples in handover — sample data formats, actual field names, not just "they use Excel for tracking."
- **Request:** When recommending Relevance AI, specify the type of AI task (extraction, classification, generation, Q&A) so architecture can select the right approach.
- **Action taken:** Updated handover template to include data samples section and AI task type specification.

---

## Self-Learning Log

| Date | Learning | Category | Confidence |
|------|---------|----------|------------|
| Mar 2026 | School admin staff needs 2x training time compared to tech-savvy users | process | 0.8 |
| Mar 2026 | AI components should be Phase 2, not MVP for education clients | decision | 0.9 |
| Mar 2026 | Always ask "what happens when this fails?" — clients rarely think about error cases | process | 0.9 |
| Mar 2026 | Government portal automation is almost never feasible due to captchas and UI changes | decision | 0.85 |
| Mar 2026 | WhatsApp Business API has a 24-hour messaging window — affects notification design | company | 0.9 |
| Apr 2026 | Include sample data in handovers per Ujjawal feedback | preference | 0.95 |

---

*This memory file initializes Rohit's operational context on Layaa OS. As Rohit conducts more discovery sessions and receives feedback, this memory will grow through the `write_memory()` self-learning protocol. Memories here are seeded — all future memories will be added automatically by Rohit and Sage.*
