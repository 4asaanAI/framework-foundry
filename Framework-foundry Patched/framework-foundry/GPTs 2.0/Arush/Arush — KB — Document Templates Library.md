# Arush — KB — Document Templates Library

> Reusable templates for every document type Arush produces. Use these as starting structures — adapt to the specific context, but preserve the required sections.

---

## 1. API Documentation Template

```markdown
# [API Name] — API Reference

> [One-line description of what this API does]

**Base URL:** `[base_url]`
**Authentication:** [Auth method]
**Version:** [X.Y]
**Last Updated:** [Date]

---

## Endpoints

### [METHOD] /[endpoint]

**Description:** [What this endpoint does]

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |

**Request Parameters:**
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| [param] | [type] | [Yes/No] | [Description] | [default] |

**Request Example:**
[Code block with example request]

**Response (200 OK):**
[Code block with example response]

**Error Responses:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_PARAM | [Description] |
| 401 | UNAUTHORIZED | [Description] |
| 404 | NOT_FOUND | [Description] |

---
DOC TYPE: API Reference
VERSION: [X.Y]
STATUS: [Draft / Published]
SOURCE AGENTS: [Ujjawal]
---
```

---

## 2. User Guide Template

```markdown
# [Feature/Product Name] — User Guide

> [One sentence: what the user will learn to do]

**Audience:** [Who this is for]
**Prerequisites:** [What the user needs before starting]
**Estimated Time:** [How long this takes]

---

## What You Will Learn

- [Outcome 1]
- [Outcome 2]
- [Outcome 3]

---

## Before You Begin

[List prerequisites, required access, initial setup steps]

---

## Step-by-Step Instructions

### Step 1: [Action]
[Explanation]
[Screenshot or code example if needed]

### Step 2: [Action]
[Explanation]

### Step 3: [Action]
[Explanation]

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| [Problem] | [Why it happens] | [How to fix] |

---

## Next Steps

- [Related guide or feature to explore]
- [Where to get help]

---
DOC TYPE: User Guide
VERSION: [X.Y]
STATUS: [Draft / Published]
AUDIENCE: [Primary reader]
---
```

---

## 3. SOP (Standard Operating Procedure) Template

```markdown
# SOP: [Process Name]

> [One-line description of when and why this SOP is used]

**Owner:** [Agent or role responsible]
**Trigger:** [What initiates this process]
**Frequency:** [How often this runs]
**Last Reviewed:** [Date]

---

## Purpose

[2-3 sentences on why this process exists and what it achieves]

---

## Scope

- **Applies to:** [Who follows this SOP]
- **Does not cover:** [What is explicitly out of scope]

---

## Prerequisites

- [Required access, tools, or prior steps]

---

## Procedure

1. [First step — imperative verb]
2. [Second step]
3. [Third step]
   - [Sub-step if needed]
   - [Sub-step if needed]
4. [Fourth step]

**Decision Point:** If [condition], proceed to Step 5a. Otherwise, skip to Step 6.

5a. [Conditional step]
6. [Next step]

---

## Verification

- [ ] [How to confirm the process completed successfully]
- [ ] [What to check]

---

## Exceptions and Escalation

| Scenario | Action |
|----------|--------|
| [Exception case] | [What to do — including who to escalate to] |

---
DOC TYPE: SOP
VERSION: [X.Y]
STATUS: [Draft / Published]
OWNER: [Agent name]
REVIEW CYCLE: [Monthly / Quarterly]
---
```

---

## 4. Training Manual Template

```markdown
# [Training Topic] — Training Manual

> [Who this training is for and what they will be able to do after completing it]

**Audience:** [Role or profile]
**Duration:** [Estimated total time]
**Format:** [Self-paced / Workshop / Blended]
**Prerequisites:** [Required knowledge]

---

## Module 1: [Topic]
**Duration:** [Time]
**Objective:** [What the learner will know or be able to do]

### Concept
[Explanation of the concept]

### Practice Exercise
[Hands-on activity]

### Knowledge Check
- Question 1: [Question]
- Question 2: [Question]

---

## Module 2: [Topic]
[Same structure as Module 1]

---

## Assessment
[Final evaluation criteria]

---

## Resources
- [Link or reference to additional materials]

---
DOC TYPE: Training Manual
VERSION: [X.Y]
STATUS: [Draft / Published]
AUDIENCE: [Primary reader]
---
```

---

## 5. Client Onboarding Guide Template

```markdown
# Welcome to Layaa AI — [Client Name] Onboarding Guide

> Everything you need to get started with [Product/Service Name].

**Your Layaa AI Team:** [Key contacts or agents]
**Onboarding Timeline:** [Expected duration]
**Support Channel:** [How to reach us]

---

## What to Expect

[3-4 sentences setting expectations for the onboarding journey]

---

## Week 1: Setup & Access

- [ ] [Access setup step]
- [ ] [Configuration step]
- [ ] [Initial training session]

## Week 2: Core Training

- [ ] [Feature training]
- [ ] [Workflow walkthrough]
- [ ] [Practice exercises]

## Week 3: Go Live

- [ ] [Final configuration]
- [ ] [Go-live checklist]
- [ ] [Support handoff]

---

## FAQ

**Q: [Common question]**
A: [Answer]

---

## Getting Help

[Support channels, response times, escalation path]

---
DOC TYPE: Client Onboarding Guide
VERSION: [X.Y]
STATUS: [Draft / Published]
CLIENT: [Client name]
---
```

---

## 6. Release Notes Template

```markdown
# Release Notes — [Product Name] v[X.Y.Z]

**Release Date:** [Date]
**Release Type:** [Major / Minor / Patch / Hotfix]

---

## What's New

### [Feature Name]
[1-2 sentences: what it does and why it matters to users]

### [Feature Name]
[1-2 sentences]

---

## Improvements

- [Improvement description — focus on user impact]
- [Improvement description]

---

## Bug Fixes

- **Fixed:** [Bug description and impact] — reported by [source if relevant]
- **Fixed:** [Bug description]

---

## Known Issues

- [Issue description] — workaround: [if available] — fix expected: [timeline]

---

## Breaking Changes

[List any changes that require user action — migration steps, configuration updates, deprecated features]

---

## Upgrade Instructions

[Step-by-step if applicable]

---
DOC TYPE: Release Notes
VERSION: [X.Y.Z]
STATUS: Published
SOURCE AGENTS: [Dev, Ujjawal]
---
```

---

## 7. Changelog Template

```markdown
# Changelog — [Product Name]

All notable changes to this product are documented here. Format follows Keep a Changelog conventions.

---

## [X.Y.Z] — [YYYY-MM-DD]

### Added
- [New feature or capability]

### Changed
- [Modification to existing functionality]

### Fixed
- [Bug fix]

### Removed
- [Deprecated or removed feature]

### Security
- [Security-related change]

---
```

---

## 8. KB Article Template

```markdown
# [Article Title]

> [One sentence summarizing what this article covers]

**Category:** [KB category]
**Tags:** [searchable keywords]
**Last Updated:** [Date]
**Applies to:** [Product, version, or context]

---

## Summary

[2-3 sentence overview]

---

## Details

[Full explanation — use headers, lists, and examples as needed]

---

## Related Articles

- [Link to related KB article]
- [Link to related KB article]

---
```

---

**Cross-references:**
- For writing standards applied to these templates: see `Arush — KB — Documentation Style Guide.md`
- For quality checks before publishing: see `Arush — KB — Documentation Review Checklist.md`

*Templates are starting structures. Adapt section depth, add sections, or merge sections based on the specific document needs. The goal is consistency in structure while allowing flexibility in content.*
