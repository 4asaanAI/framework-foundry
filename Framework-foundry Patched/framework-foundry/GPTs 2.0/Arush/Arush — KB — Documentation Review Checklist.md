# Arush — KB — Documentation Review Checklist

> Quality checklist for reviewing any document before publication. Every document Arush produces or approves must pass this review. Use this checklist during the Technical Review and Stakeholder Review stages of the documentation lifecycle.

---

## 1. Pre-Review Setup

Before starting a review, confirm:

- [ ] **Document type identified** — Which template was used? (API doc, user guide, SOP, etc.)
- [ ] **Target audience confirmed** — Who is the reader? What is their technical level?
- [ ] **Source agent identified** — Who provided the technical information? Have they reviewed for accuracy?
- [ ] **Version number assigned** — Is this a new document (v1.0) or an update (v1.1+)?

---

## 2. Structure and Completeness Checklist

| Check | Pass? | Notes |
|-------|-------|-------|
| Document has a clear title following naming conventions | | |
| Purpose statement exists (what the reader will learn or do) | | |
| Audience is explicitly stated | | |
| Prerequisites are listed (if applicable) | | |
| All required template sections are present | | |
| Sections follow a logical flow (concept → procedure → troubleshooting) | | |
| Table of contents or clear heading hierarchy exists for docs >1000 words | | |
| Cross-references to related documents are included | | |
| Document audit block is present at the bottom | | |
| Version and status markers are current | | |

---

## 3. Accuracy Verification Checklist

| Check | Pass? | Notes |
|-------|-------|-------|
| All technical claims verified with source agent | | |
| API endpoints, parameters, and responses match current system | | |
| Configuration values and defaults are current | | |
| Screenshots match the current UI (if applicable) | | |
| Code examples have been tested or verified as runnable | | |
| Agent names use canonical role titles per Layaa AI standards | | |
| Product names follow terminology guide (EduFlow, CA AI Agent, Layaa OS) | | |
| Version numbers referenced match the actual release | | |
| No stale dates, outdated links, or deprecated references | | |
| Accuracy tags are applied to all technical claims | | |

**Accuracy Verification Procedure:**
1. Tag every technical claim in the document with an accuracy marker
2. Send claims tagged `[ACCURACY: PENDING VERIFICATION]` to the source agent for confirmation
3. Update tags to `[ACCURACY: VERIFIED]` only after source agent confirms
4. Do not publish until all critical-path claims are verified

---

## 4. Clarity and Readability Checklist

| Check | Pass? | Notes |
|-------|-------|-------|
| No jargon used without definition or glossary link | | |
| Sentences are under 25 words on average | | |
| Active voice is used throughout (not "should be clicked" but "click") | | |
| One idea per paragraph | | |
| Numbered steps for all procedures | | |
| Each step starts with an imperative verb (Open, Click, Configure, Verify) | | |
| Decision points in procedures are clearly marked | | |
| Error scenarios and edge cases are addressed | | |
| Formatting is consistent (headings, lists, code blocks) | | |
| No ambiguous pronouns ("it," "this," "that" without clear antecedent) | | |

---

## 5. Style Guide Compliance Checklist

| Check | Pass? | Notes |
|-------|-------|-------|
| Headings are sentence case | | |
| Code blocks have language identifiers | | |
| Tables have header rows | | |
| Callouts use standard markers (Note, Important, Warning, Tip) | | |
| Numbers follow the style guide (spell out 1-9, digits for 10+) | | |
| Dates use DD Month YYYY format | | |
| Currency uses Rs. prefix with correct comma placement | | |
| Terminology matches the mandatory terms list | | |
| No banned words (synergy, leverage, disrupt, etc.) | | |
| Gender-neutral language throughout | | |

---

## 6. Security and Sensitivity Review

| Check | Pass? | Notes |
|-------|-------|-------|
| No real credentials, API keys, or tokens in examples | | |
| No real PII (names, emails, phone numbers) in examples | | |
| Confidentiality level is marked (Internal Only / Client-Specific / Public) | | |
| Client-specific information is in the correct scope (not in public docs) | | |
| No internal system paths, server addresses, or infrastructure details in client docs | | |
| Password and authentication references use placeholders | | |

---

## 7. Final Publication Checklist

| Check | Pass? | Notes |
|-------|-------|-------|
| All review feedback has been addressed | | |
| Source agent has signed off on accuracy | | |
| Status marker updated from DRAFT → PUBLISHED | | |
| Version number is correct | | |
| Last Updated date is current | | |
| Document saved in the correct KB location and category | | |
| Cross-referenced documents updated if this doc changes their context | | |
| Notification sent to relevant stakeholders about the publication | | |

---

## 8. Post-Publication Review Schedule

| Document Type | Review Frequency | Trigger for Unscheduled Review |
|--------------|-----------------|-------------------------------|
| API Documentation | Every release | API endpoint changes |
| User Guides | Quarterly or on feature change | UI redesign, new feature |
| SOPs & Runbooks | Quarterly | Process change, incident |
| Training Materials | Quarterly | Product update, client feedback |
| Client Onboarding | Per-client | New client, product change |
| KB Articles | Semi-annually | Topic becomes stale or irrelevant |
| Release Notes | Not re-reviewed (point-in-time) | Correction needed |

---

## 9. Common Rejection Reasons (Pattern Log)

Track these to prevent recurring issues:

| Rejection Reason | Prevention |
|-----------------|------------|
| Technical detail unverified | Always send tech claims to source agent before review stage |
| Steps unclear or missing | Test the procedure yourself — can you follow it without additional context? |
| Audience mismatch | Re-read the purpose statement — is the language appropriate for the stated audience? |
| Outdated references | Check all version numbers and dates before submitting for review |
| Missing edge cases | Ask the source agent: "What can go wrong?" Document those scenarios |

---

**Cross-references:**
- For the standards this checklist enforces: see `Arush — KB — Documentation Style Guide.md`
- For templates that should pass this checklist: see `Arush — KB — Document Templates Library.md`
- For KB-specific organization checks: see `Arush — KB — Knowledge Base Organization.md`

*This checklist should be used for every document, every time. Speed is important, but quality is non-negotiable. A fast document that is wrong is worse than a slow document that is right.*
