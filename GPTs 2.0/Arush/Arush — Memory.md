# Arush — Initial Memory

> These are Arush's foundational memories as of platform launch (April 2026). They represent the starting context Arush needs to operate from day one. Sage will manage ongoing memory updates, but these provide the baseline.

---

## Company Stage

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Layaa AI is a bootstrap-stage startup with zero external funding. Documentation must be lean — no over-engineering. Prioritize the docs that unblock people. | company | 1.0 | Company Context Doc |
| Team consists of 2 founders (Abhimanyu Singh — CEO, Shubham Sharma — CTO) and 22 AI agents. All documentation must be understandable by both a non-coder CEO and a full-stack CTO. | company | 1.0 | Company Context Doc |
| Company incorporated 19 December 2024 as Layaa AI Private Limited. Pre-revenue stage. All client engagements are pilot/early deployments. | company | 1.0 | Company Context |
| Layaa AI brand voice: confident without arrogance, intelligent without jargon, forward-thinking without hype, human-centered not machine-first. Apply this to all client-facing docs. | preference | 1.0 | Brand Strategy |
| Banned words in all docs: synergy, leverage (as verb), disrupt, revolutionary, game-changing, guru, ninja, rockstar, pivot (casually), circle back. | preference | 1.0 | Brand Strategy |

---

## Documentation Inventory Status

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **Layaa OS documentation:** System prompts complete for all 22 agents. KB files created for most agents. Platform-level user documentation does not yet exist — this is the highest priority documentation debt. | process | 0.9 | System audit |
| **EduFlow documentation:** No formal user guide exists yet. The Aaryans School pilot (Apr 13) and SSA pilot (Apr 15) will need onboarding documentation urgently. This is the most time-sensitive documentation need. | process | 0.9 | Founder context |
| **CA AI Agent documentation:** Product is in development. No client-facing documentation exists yet. Product specs and architecture docs should be created as features stabilize. | process | 0.8 | Product Portfolio |
| **Shared governance docs:** 5 shared documents exist in `_Shared` folder (Agent Directory, Governance Rules, Company Context, Platform Capabilities, Skills Directory). These are current and well-maintained. | process | 1.0 | Folder audit |
| **Agent KB files:** Transitioning from monolithic KB files (Ujjawal, Rohit pattern) to separate KB files per topic (Kabir pattern). New agents should follow the separate KB pattern. | decision | 1.0 | Established pattern |

---

## Active Client Documentation Needs

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **The Aaryans School** — Two CBSE-affiliated branches (Joya and Meerut, UP). EduFlow pilot starting ~13 April 2026. Needs: onboarding guide, teacher user guide, admin dashboard guide. School audience — non-technical, patient tone required. | client_info | 1.0 | Founder context |
| **SSA (Akshat Sharma)** — Education client. EduFlow v2 deployment. Pilot starting ~15 April 2026. Needs similar documentation as Aaryans, possibly customized for their specific setup. | client_info | 1.0 | Founder context |
| **CA AI Agent** — Not yet a client engagement. When development reaches beta, will need: setup guide, user guide for CA professionals, API documentation if integrations are offered. | client_info | 0.7 | Product Portfolio |

---

## Style Decisions Made

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Documentation file naming convention: `[Owner] — [Type] — [Topic].md` using em dashes. Established across the GPTs 2.0 folder structure. | process | 1.0 | Established pattern |
| Technical documentation uses `[ACCURACY: VERIFIED / PENDING VERIFICATION / SELF-EVIDENT]` tags instead of the standard evidence tags used by other agents. This is intentional — documentation accuracy differs from market data evidence. | decision | 1.0 | System design |
| Every document includes a Documentation Audit Block at the bottom with DOC TYPE, VERSION, STATUS, SOURCE AGENTS, and AUDIENCE fields. | process | 1.0 | System design |
| Client-facing documents use Rs. currency format with Indian comma notation (Rs.2,50,000 for two lakh fifty thousand). | preference | 1.0 | Style Guide |
| Dates in all documentation: DD Month YYYY format (09 April 2026). | preference | 1.0 | Style Guide |

---

## Collaboration Context

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Ujjawal provides architecture details and technical specs. He designs HOW things work; Arush documents it for human consumption. Handoff is one-directional: Ujjawal → Arush. | process | 1.0 | Org structure |
| Dev provides product specs, feature descriptions, and release decisions. Every sprint completion should trigger a release notes cycle. | process | 1.0 | Org structure |
| Rohit provides validated scope and feasibility assessments. His outputs define what the system can and cannot do — critical for accurate user guides. | process | 1.0 | Org structure |
| Arjun provides client context for documentation customization: industry, technical level, communication preferences, urgency. All onboarding docs start with his input. | process | 1.0 | Org structure |
| Shubham (CTO) is the direct manager. Technical review escalations go to him. He welcomes technical precision in documentation. | preference | 1.0 | Company Context |
| Abhimanyu (CEO) is non-technical. All docs he reviews must be jargon-free and actionable. If he cannot understand it, it is too technical for client-facing use. | preference | 1.0 | Company Context |

---

## Documentation Quality Feedback

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| No client feedback collected yet — pilots have not started. First feedback expected after Aaryans pilot (mid-April 2026). | process | 0.8 | Timeline |
| Documentation debt register is new. Initial high-priority items: EduFlow user guide (missing), Layaa OS platform user guide (missing), client onboarding pack template (created but untested). | process | 0.9 | Self-assessment |
| Review process established: Draft → Technical Review (source agent) → Stakeholder Review (Founder or relevant agent) → Publish. No document published without at least one review pass. | process | 1.0 | System design |

---

## Knowledge Base Structure

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| KB uses 8 top-level categories: Platform, Product, Process, Client, Agent, Governance, Training, Release. Each can have sub-categories. | process | 1.0 | KB Organization doc |
| Shared documents live in `_Shared` folder. Agent-specific docs live in agent folders. Client-specific docs will live in project-scoped KBs. | process | 1.0 | KB Organization doc |
| Version control uses MAJOR.MINOR format (1.0, 1.1, 2.0). Every version change logged. Deprecated docs are archived, never deleted. | process | 1.0 | KB Organization doc |

---

*These memories represent Arush's initial knowledge state. They will be continuously enriched through documentation work, client feedback, agent collaboration, and self-learning. Confidence scores will be dynamically adjusted based on validation and real-world outcomes.*
