# Arush — KB — Knowledge Base Organization

> Structure, categorization, search optimization, and version control standards for the Layaa AI knowledge base. This document defines how all documentation is organized so that any agent, Founder, or client can find what they need without asking.

---

## 1. Knowledge Base Architecture

The Layaa AI knowledge base is organized in a three-tier hierarchy: **Domain > Category > Document**. Every document lives in exactly one category. Cross-references link related documents across categories.

### Tier 1 — Domains

| Domain | Description | Primary Audience |
|--------|-------------|------------------|
| **Product** | Everything about Layaa OS, EduFlow, CA AI Agent — features, specs, roadmaps | Founders, agents, developers |
| **Client Delivery** | Onboarding guides, project documentation, handoff materials | Clients, delivery team |
| **Operations** | SOPs, runbooks, internal processes, governance | Internal agents, Founders |
| **Technical** | Architecture docs, API references, integration guides, data schemas | Developers, Ujjawal, builders |
| **Training** | Training manuals, workshop content, skill-building materials | New users, clients, onboarding |
| **Reference** | Style guides, templates, checklists, glossaries | Arush, all document creators |

### Tier 2 — Categories (Within Each Domain)

Each domain contains focused categories. Examples:

**Product Domain:**
- Product Roadmap
- Feature Specifications
- Release Notes & Changelogs
- Product Metrics

**Client Delivery Domain:**
- Onboarding Packs (per client)
- Project Documentation
- Handoff Documents
- Client Communication Templates

**Operations Domain:**
- Agent SOPs
- Platform Runbooks
- Governance Documents
- Process Workflows

**Technical Domain:**
- Architecture Documentation
- API References
- Integration Guides
- Data Flow Diagrams

---

## 2. Naming Conventions

### Document Filenames

All KB documents follow a strict naming pattern:

```
[Agent Name] — KB — [Descriptive Title].md
```

Examples:
- `Arush — KB — Documentation Style Guide.md`
- `Dev — KB — Layaa OS Product Roadmap.md`
- `Ujjawal — KB — Error Handling & Debugging.md`

### Rules
- Use em dashes (—) as separators, not hyphens (-) or underscores (_)
- Title should be descriptive enough to understand content without opening the file
- No version numbers in filenames — version tracking lives inside the document
- No dates in filenames — use the document's internal Last Updated field
- Capitalize the first letter of each major word in the title (title case for filenames, sentence case for headings inside)

### Memory Files
```
[Agent Name] — Memory.md
```

### System Prompts
```
[Agent Name] — System Prompt.md
```

---

## 3. Document Metadata Standard

Every KB article must begin with a consistent metadata block. This enables both human scanning and future automated indexing.

```markdown
# [Document Title]

> [One-line summary — what this document covers]

**Domain:** [Product / Client Delivery / Operations / Technical / Training / Reference]
**Category:** [Specific category within the domain]
**Tags:** [Comma-separated searchable keywords]
**Last Updated:** [DD Month YYYY]
**Owner:** [Agent name — who maintains this document]
**Status:** [DRAFT / IN REVIEW / PUBLISHED / ARCHIVED]
**Applies to:** [Product, version, client, or scope]
```

**Tags** are the primary mechanism for cross-category discovery. Every document should have three to eight tags covering:
- The product or project it relates to (EduFlow, Layaa OS, CA AI Agent)
- The document type (guide, SOP, reference, template)
- Key concepts or features covered
- The primary audience (client, developer, Founder, agent)

---

## 4. Search Optimization

### Writing for Findability

Documents should be written so that common search queries return relevant results:

1. **Use natural language headings** — Write headings the way someone would ask the question: "How to configure the webhook" not "Webhook Configuration Parameters"
2. **Front-load keywords** — Put the most important terms in the first sentence of each section
3. **Include synonyms** — If a feature is called "Approval Workflow" internally but clients call it "sign-off process," include both terms
4. **Define acronyms** — First use in every document: "Row-Level Security (RLS)"
5. **Use consistent terminology** — Follow the mandatory terms in the Documentation Style Guide. Inconsistent naming breaks search.

### Cross-Reference Standards

Every document should include a "Related Documents" or "Cross-references" section at the bottom:

```markdown
**Cross-references:**
- For [related topic]: see `[Document Name].md`
- For [related topic]: see `[Document Name].md`
```

When a document is updated, check all documents that cross-reference it for accuracy.

### Index Documents

Each domain should have an index document listing all articles in that domain with one-line descriptions. Format:

```markdown
# [Domain] — Document Index

| Document | Description | Status | Last Updated |
|----------|-------------|--------|--------------|
| [Link/Name] | [One-line summary] | Published | [Date] |
```

Index documents are updated whenever a new article is added, archived, or renamed.

---

## 5. Version Control

### Document Versioning

All documents use MAJOR.MINOR version numbering:

| Version Type | When to Increment | Example |
|-------------|-------------------|---------|
| MAJOR (X.0) | Significant restructuring, new audience, major content overhaul | 1.0 → 2.0 |
| MINOR (X.Y) | Corrections, small updates, section additions | 1.0 → 1.1 |

### Changelog Within Documents

Every document with version 1.1 or higher must include a changelog section:

```markdown
## Changelog

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.1 | 09 April 2026 | Added troubleshooting section based on client feedback | Arush |
| 1.0 | 01 April 2026 | Initial publication | Arush |
```

### Archival Protocol

When a document is superseded:
1. Add `[STATUS: ARCHIVED — Replaced by: {new document name}]` to the top
2. Move the document to an `_Archived` subfolder if one exists
3. Update all cross-references in other documents to point to the replacement
4. Do not delete archived documents — they may contain historical decisions or context

---

## 6. Knowledge Base Maintenance

### Scheduled Reviews

| Frequency | Action |
|-----------|--------|
| Weekly | Check for documents stuck in DRAFT or IN REVIEW for more than five business days |
| Monthly | Review document index for completeness — any new features or processes missing documentation? |
| Quarterly | Full freshness audit — review all PUBLISHED documents for accuracy and relevance |
| Per Release | Update all documents affected by the release before or alongside the release |

### Staleness Detection

A document is considered stale when:
- It references a product version that is two or more versions behind current
- It describes a process that has changed since the Last Updated date
- It has not been reviewed in more than six months (for active topics)
- A Founder or agent reports that the content is incorrect

Stale documents are flagged with `[STATUS: STALE — Review Required]` until updated.

### Documentation Debt Tracking

Maintain a running list of known documentation gaps:

```markdown
## Documentation Debt Register

| Gap | Priority | Reason | Target Date | Owner |
|-----|----------|--------|-------------|-------|
| [Missing doc or outdated doc] | [High/Medium/Low] | [Why it matters] | [When to fix] | [Agent] |
```

This register is reviewed weekly during documentation planning and shared with Dev and Shubham when documentation gaps block other work.

---

## 7. Access and Confidentiality

### Confidentiality Levels

Every document must be tagged with one of three levels:

| Level | Who Can See | Examples |
|-------|-------------|---------|
| **Public** | Anyone, including prospects and external readers | Marketing content, public product descriptions |
| **Client-Specific** | Only the named client and Layaa AI internal team | Onboarding guides, project documentation, custom configurations |
| **Internal Only** | Layaa AI agents and Founders only | Architecture docs, SOPs, agent prompts, pricing models, governance rules |

Never mix confidentiality levels within a single document. If a document has both internal and client-facing content, split it into two documents.

---

**Cross-references:**
- For writing standards applied to KB articles: see `Arush — KB — Documentation Style Guide.md`
- For KB article template: see `Arush — KB — Document Templates Library.md` (Section 8)
- For quality checks before publishing KB articles: see `Arush — KB — Documentation Review Checklist.md`
- For training material organization within the KB: see `Arush — KB — Client Enablement Program.md`

*The knowledge base is only as good as its organization. A well-written document that nobody can find is the same as no document. Structure is not overhead — it is the multiplier that makes every other document more valuable.*
