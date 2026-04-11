# Arush — KB — Documentation Style Guide

> Writing standards, formatting rules, terminology, and tone guidelines for all Layaa AI documentation. Every document Arush produces — internal or external — follows these rules.

---

## 1. Core Writing Principles

**Write for the reader, not yourself.** Before writing a single word, answer:
- Who is reading this? (developer, client, Founder, agent)
- What do they need to do after reading this? (follow a procedure, understand a concept, make a decision)
- What do they already know? (technical background, product familiarity, industry context)

**Layaa AI documentation voice:**
- Confident but not arrogant — we know our product; we do not oversell it
- Precise but not cold — technical accuracy with human warmth
- Practical but not simplistic — respect the reader's intelligence while ensuring clarity
- Indian context-aware — we serve Indian SMEs; examples, currency, and references should reflect this

---

## 2. Tone by Document Type

| Document Type | Tone | Example Phrasing |
|--------------|------|-------------------|
| Technical API Docs | Precise, neutral, concise | "Returns a JSON object containing the agent profile. Status 200 on success." |
| User Guides | Friendly, step-by-step, encouraging | "Now you are ready to create your first workflow. Let us walk through it together." |
| SOPs & Runbooks | Direct, imperative, no ambiguity | "Open the PocketBase admin panel. Navigate to Collections. Select the target collection." |
| Training Materials | Supportive, progressive, patient | "Do not worry if this seems complex at first. We will break it down step by step." |
| Client Onboarding | Welcoming, professional, reassuring | "Welcome to Layaa AI. This guide will help you get started in under 30 minutes." |
| Release Notes | Clear, factual, impact-focused | "New: Approval workflows now support multi-level chains. This means your team can..." |
| Internal Process Docs | Efficient, collegial, direct | "When a new client signs, trigger the onboarding checklist within 24 hours." |

---

## 3. Formatting Standards

### Headings
- Use H1 (`#`) for document title only — one per document
- Use H2 (`##`) for major sections
- Use H3 (`###`) for subsections
- Never skip heading levels (no H1 → H3 without H2)
- Headings are sentence case ("How to configure the webhook") not title case ("How To Configure The Webhook")

### Lists
- Use numbered lists for sequential steps (procedures, processes)
- Use bullet points for non-sequential items (features, options, notes)
- Each list item starts with a capital letter
- No trailing periods on list items unless they are complete sentences

### Code Examples
- Always use fenced code blocks with language identifiers (```json, ```bash, ```typescript)
- Include comments explaining non-obvious lines
- Use realistic but fictional data — never real credentials or PII
- Provide expected output after code examples where applicable
- Keep examples minimal: show exactly what is needed, no more

```json
// Example: Agent profile response
{
  "id": "agent_arush",
  "role": "Documentation & Enablement Specialist",
  "status": "active",
  "department": "Client Delivery & Product"
}
```

### Tables
- Use tables for structured comparisons, reference data, and quick lookups
- Always include a header row
- Keep cell content concise — if a cell needs more than 2 lines, consider a different format
- Align columns consistently

### Callouts and Alerts
Use these consistently:
- **Note:** Additional context that is helpful but not critical
- **Important:** Information the reader must not miss
- **Warning:** Something that could cause errors or data loss if ignored
- **Tip:** A helpful shortcut or best practice

---

## 4. Terminology Consistency

### Mandatory Terms (Always Use These)

| Correct Term | Never Use |
|-------------|-----------|
| Layaa OS | LayaaOS, Layaa Platform, the platform |
| Layaa AI | LayaaAI, Laya AI, Layaa |
| agent | bot, GPT, AI assistant, chatbot |
| workflow | automation, flow (unless specifically n8n "flow") |
| knowledge base (KB) | wiki, docs repository |
| PocketBase | pocketbase, Pocket Base, PB |
| n8n | N8N, n8n.io |
| Founders | founders, co-founders (capitalize when referring to Abhimanyu and Shubham) |
| CTO | Co-Founder (use CTO for technical context, Co-Founder for business context) |
| Indian SMEs | small businesses, SMBs |
| Rs. | INR, rupees (use Rs. followed by amount: Rs.50,000) |

### Product Names
- **EduFlow** — Always one word, capital E and F
- **CA AI Agent** — Always with spaces, all caps on CA and AI
- **Layaa OS** — Always two words, space between

### Agent References in Documentation
- In technical docs: use canonical role title first, name in parentheses — "the Automation Architect (Ujjawal)"
- In user guides: use the agent name — "ask Arush for help"
- In internal docs: name is sufficient — "coordinate with Ujjawal"
- Never use informal nicknames or abbreviations for agent names

---

## 5. Numbers, Dates, and Measurements

- Spell out numbers one through nine; use digits for 10 and above
- Exception: always use digits in technical contexts (API parameters, configuration values)
- Dates: DD Month YYYY format (09 April 2026)
- Time: 12-hour format with AM/PM and IST timezone (3:00 PM IST)
- Currency: Rs. prefix with commas for lakhs/crores (Rs.2,50,000 not Rs.250,000)
- File sizes: KB, MB, GB (uppercase)

---

## 6. Accessibility and Inclusion

- Use gender-neutral language: "they/their" for singular references
- Avoid idioms that may not translate across Indian regional languages
- Provide alt-text descriptions for all images and diagrams
- Ensure high contrast between text and background in any visual documentation
- Use simple sentence structures: subject-verb-object
- Define acronyms on first use in every document (do not assume the reader has read other docs)

---

## 7. Version and Status Markers

Every document must display its status clearly:

| Status | Marker | Meaning |
|--------|--------|---------|
| Draft | `[STATUS: DRAFT]` | Work in progress, not reviewed |
| In Review | `[STATUS: IN REVIEW]` | Sent to source agent or stakeholder for verification |
| Published | `[STATUS: PUBLISHED]` | Approved and live |
| Archived | `[STATUS: ARCHIVED — Replaced by: {link}]` | No longer current, superseded |

---

**Cross-references:**
- For document templates that implement these standards: see `Arush — KB — Document Templates Library.md`
- For quality verification against these standards: see `Arush — KB — Documentation Review Checklist.md`
- For KB-specific organization standards: see `Arush — KB — Knowledge Base Organization.md`

*The style guide is a living document. When a new formatting decision is made or a Founder expresses a preference, update this guide and save the decision as a memory.*
