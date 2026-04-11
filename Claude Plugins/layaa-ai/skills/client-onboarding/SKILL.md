---
name: client-onboarding
description: >
  Create and manage structured client onboarding workflows for new Layaa AI engagements.
  Covers post-deal-close through project kickoff including access setup, team introductions,
  welcome materials, and initial discovery scheduling. Ensures smooth sales-to-delivery handoff.
  Trigger: "client onboarding", "onboard client", "new client setup", "kickoff", "welcome package", "onboarding checklist", "sales handoff"
  This is a new Layaa AI-specific skill.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Client Onboarding

Create and manage structured client onboarding workflows for new Layaa AI engagements. Covers post-deal-close through project kickoff, ensuring a smooth transition from sales to delivery with nothing falling through the cracks.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, new client, deal close, contract signed, kickoff, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/delivery-methodology.md — 5-stage delivery methodology, Discovery stage details
- domain-references/revenue-ops/sales-revenue-handoff.md — Sales-to-delivery transition requirements
- domain-references/legal/contract-templates.md — Contract structure, SLA terms, engagement scope
- shared-references/service-verticals.md — Service offerings, methodology, deliverables
- shared-references/company-identity.md — Company basics for welcome materials
- shared-references/revenue-model.md — Pricing tiers and engagement structures
Only load references relevant to the engagement type.

## Execution Steps

### Step 1: Verify Handoff Conditions Met
Before initiating onboarding, confirm all prerequisites:

**Mandatory Handoff Checklist:**
- [ ] **Contract signed:** Engagement agreement fully executed by both parties
- [ ] **Payment received:** First payment (50% implementation deposit) confirmed
- [ ] **Scope documented:** SOW or scope document finalized and approved
- [ ] **CRM updated:** Deal marked as Won, all contact details current
- [ ] **Client stakeholders identified:** Primary contact, decision maker, technical contact
- [ ] **Internal handoff brief:** Sales team has documented client context, expectations, and any commitments made

**If any item is missing:**
- Flag the gap to the sales/revenue team (Rishi — Revenue Operations Strategist, Yuvaan — Sales Enablement Specialist)
- Do not proceed with onboarding until all mandatory items are confirmed
- Escalate to Founders if handoff has been incomplete for >48 hours after deal close

**For Layaa AI — Additional Validation:**
- Verify engagement type matches a defined service vertical
- Confirm pricing is within standard tiers or has Founder approval for custom pricing
- Check if client is in a known ICP segment (SaaS, logistics, fintech, professional services) for tailored onboarding

### Step 2: Generate Client Welcome Package
Create welcome materials for the new client:

**Welcome Email Contents:**
1. **Congratulations and thank you** — Acknowledge the partnership
2. **Layaa AI team introduction** — Who they will work with:
   - Account lead (typically a Founder for initial engagements)
   - Delivery lead
   - Support contact
3. **What to expect next** — Clear timeline of onboarding steps
4. **Communication channels** — How to reach the team:
   - Primary communication channel (email, Slack, WhatsApp)
   - Escalation contact
   - Response time expectations
5. **Important links** — Any portals, shared drives, or tools the client will use

**Welcome Document Package:**
- Company introduction one-pager (from Layaa AI — Vision, Services, Positioning)
- Engagement scope summary (derived from SOW)
- Team contact sheet
- Communication protocol (response times, meeting cadence, escalation path)
- FAQs for new clients

### Step 3: Create Access Request Checklist
Document everything the client needs to provide:

**Client Access Requirements:**
| # | Item | Purpose | Format | Priority | Status |
|---|------|---------|--------|----------|--------|
| 1 | System access credentials | Connect to client systems | Secure credential share | CRITICAL | [ ] |
| 2 | API keys/tokens | Integration setup | Secure transfer | CRITICAL | [ ] |
| 3 | Database access | Data analysis/migration | Connection string | HIGH | [ ] |
| 4 | Admin access to tools | Configure integrations | Login credentials | HIGH | [ ] |
| 5 | Brand assets | Client-facing outputs | Files/links | MEDIUM | [ ] |
| 6 | Existing documentation | Process understanding | Documents/links | MEDIUM | [ ] |
| 7 | Org chart/team contacts | Stakeholder mapping | Document | MEDIUM | [ ] |
| 8 | Sample data/test accounts | Development and testing | Access credentials | HIGH | [ ] |

**Security Protocol:**
- All credentials shared via secure method (password manager, encrypted channel)
- No credentials sent via plain email
- Access logged and reviewed
- Principle of least privilege applied
- For Layaa AI: follows Preeti's (Regulatory Compliance & Data Governance Advisor) data handling standards

### Step 4: Schedule Kickoff Meeting
Coordinate the project kickoff:

**Kickoff Meeting Details:**
- **Duration:** 60-90 minutes
- **Timing:** Within 5 business days of contract signing
- **Format:** Video call (preferred) or in-person if local

**Required Attendees — Client Side:**
- Decision maker / sponsor
- Primary point of contact
- Technical lead (if technical engagement)
- End users who will be affected (optional but recommended)

**Required Attendees — Layaa AI Side:**
- Account lead (Founder)
- Delivery lead
- Technical specialist (if applicable)

### Step 5: Prepare Kickoff Agenda
Create a structured kickoff meeting agenda:

```
KICKOFF MEETING AGENDA — [Client Name]
Date: [date] | Time: [time] | Duration: 60-90 min

1. INTRODUCTIONS (10 min)
   - Layaa AI team introductions and roles
   - Client team introductions and roles
   - Establish primary contacts on both sides

2. SCOPE AND OBJECTIVES REVIEW (20 min)
   - Review engagement scope (from SOW)
   - Confirm business objectives and success criteria
   - Identify any changes since proposal stage
   - Clarify what is in scope and out of scope

3. TIMELINE AND MILESTONES (15 min)
   - Present delivery timeline
   - Walk through key milestones and stage gates
   - Discuss dependencies on client (access, approvals, data)
   - Set realistic expectations on delivery dates

4. COMMUNICATION AND WORKING CADENCE (10 min)
   - Communication channels and tools
   - Meeting frequency (weekly sync, monthly review)
   - Reporting format and frequency
   - Escalation process
   - Response time expectations (both directions)

5. NEXT STEPS AND DISCOVERY PLANNING (15 min)
   - Access requirements (review checklist)
   - Discovery session scheduling
   - Immediate action items for both teams
   - Questions from client team

6. Q&A AND CLOSE (10 min)
   - Open questions
   - Confirm next meeting date
   - Distribute meeting notes within 24 hours
```

### Step 6: Create Project Folder Structure and Tracking
Set up project organization:

**Folder Structure:**
```
[Client Name]/
├── 01-Sales/
│   ├── Proposal
│   ├── Contract
│   └── Handoff Brief
├── 02-Discovery/
│   ├── Meeting Notes
│   ├── Process Maps
│   └── Requirements
├── 03-Assessment/
│   ├── Feasibility Report
│   ├── Risk Assessment
│   └── Technical Specs
├── 04-Development/
│   ├── Architecture
│   ├── Workflows
│   └── Test Cases
├── 05-Validation/
│   ├── UAT Results
│   ├── Client Feedback
│   └── Sign-off
├── 06-Enablement/
│   ├── Documentation
│   ├── Training Materials
│   └── Handover
└── Project-Tracker
```

**Project Tracking Setup:**
- Create milestone tracker with dates from the timeline
- Set up status reporting schedule
- Configure any project management tools
- Establish document sharing method with client

### Step 7: Initiate Discovery Phase
Transition into the first stage of delivery methodology:

1. **Schedule Discovery sessions:**
   - Stakeholder interviews (1-2 hours each, key personnel)
   - Process observation sessions (if applicable)
   - System walkthrough (existing tools and workflows)
   - Data audit (what data exists, quality, access)

2. **Discovery objectives:**
   - Map current business processes
   - Identify pain points and manual workarounds
   - Understand data flows and system integrations
   - Define success metrics from client perspective
   - Validate assumptions made during sales phase

3. **For Layaa AI:** Rohit (QA & Validation Specialist) conducts feasibility validation during Discovery. Output feeds into Ujjwal (Automation Architect) for architecture design.

### Step 8: Set Up Ongoing Communication Cadence
Establish the recurring rhythm:

| Meeting Type | Frequency | Duration | Attendees | Purpose |
|-------------|-----------|----------|-----------|---------|
| **Weekly Sync** | Weekly | 30 min | Delivery lead + Client POC | Progress update, blockers, next steps |
| **Monthly Review** | Monthly | 60 min | Account lead + Client sponsor | Overall progress, strategic alignment, satisfaction |
| **Ad-hoc Technical** | As needed | 30-60 min | Technical teams | Technical deep-dives, issue resolution |
| **Quarterly Business Review** | Quarterly | 90 min | Founders + Client leadership | Strategic review, ROI assessment, expansion |

**Reporting cadence:**
- Weekly status report (sent day before weekly sync)
- Monthly summary report (sent before monthly review)
- Incident reports (within 4 hours of any service disruption)

### Step 9: Configure Monitoring and Reporting
Set up ongoing monitoring for the engagement:

1. **Project health monitoring:**
   - Timeline adherence tracking
   - Budget tracking (hours consumed vs. allocated)
   - Deliverable completion tracking
   - Client satisfaction pulse checks

2. **Technical monitoring (once systems are live):**
   - Workflow execution monitoring
   - Error rate tracking
   - Performance metrics
   - API health and availability

3. **For Layaa AI:** Configure monitoring per Ujjwal's architecture standards and create runbooks for common operational procedures.

### Step 10: Transition from Sales to Delivery Team
Complete the handoff:

**Sales-to-Delivery Handoff Document:**
| Item | Details | Source |
|------|---------|--------|
| Client company overview | [industry, size, key people] | Sales/CRM |
| Business problem | [what problem are we solving] | Proposal |
| Solution proposed | [what we committed to deliver] | SOW |
| Pricing and terms | [deal structure, payment schedule] | Contract |
| Client expectations | [any specific commitments or concerns] | Sales notes |
| Relationship notes | [communication preferences, decision style] | Sales team |
| Competitive context | [did they evaluate alternatives?] | Sales notes |
| Growth potential | [future engagement opportunities] | Sales team |

**Handoff meeting:** 30-minute internal meeting between sales and delivery team to transfer context, answer questions, and officially transition ownership.

**CRM update:** Mark deal as "In Delivery", assign delivery owner, update next activity.

## Output Format

```
# Client Onboarding Package — [Client Name]
**Engagement:** [project name/description]
**Service Vertical:** [Education / Consulting / Automation / Maintenance / Pre-built]
**Contract Date:** [date signed]
**Onboarding Lead:** [name/role]
**Classification:** CONFIDENTIAL

## Onboarding Status
| Step | Status | Date | Owner | Notes |
|------|--------|------|-------|-------|
| 1. Handoff verification | [Complete/Pending] | [date] | [owner] | [notes] |
| 2. Welcome package sent | [Complete/Pending] | [date] | [owner] | [notes] |
| 3. Access requests issued | [Complete/Pending] | [date] | [owner] | [notes] |
| 4. Kickoff scheduled | [Complete/Pending] | [date] | [owner] | [notes] |
| 5. Kickoff completed | [Complete/Pending] | [date] | [owner] | [notes] |
| 6. Project setup | [Complete/Pending] | [date] | [owner] | [notes] |
| 7. Discovery initiated | [Complete/Pending] | [date] | [owner] | [notes] |
| 8. Communication cadence set | [Complete/Pending] | [date] | [owner] | [notes] |
| 9. Monitoring configured | [Complete/Pending] | [date] | [owner] | [notes] |
| 10. Sales-delivery handoff | [Complete/Pending] | [date] | [owner] | [notes] |

## Client Information
- **Company:** [name]
- **Industry/ICP:** [segment]
- **Primary Contact:** [name, title, email, phone]
- **Decision Maker:** [name, title]
- **Technical Contact:** [name, title, email]

## Engagement Overview
- **Service Vertical:** [which vertical]
- **Scope Summary:** [brief description from SOW]
- **Contract Value:** [implementation fee + retainer tier]
- **Timeline:** [expected duration]
- **Key Deliverables:** [list]
- **Success Criteria:** [client-defined success metrics]

## Access Checklist
| # | Item | Status | Received Date | Notes |
|---|------|--------|--------------|-------|
| 1 | [access item] | [Received/Pending/Not Needed] | [date] | [notes] |

## Kickoff Meeting
- **Date:** [date]
- **Attendees:** [list]
- **Agenda:** [attached/linked]
- **Key Decisions:** [decisions from kickoff]
- **Action Items:** [from kickoff]

## Communication Plan
| Meeting | Frequency | Next Date | Attendees |
|---------|-----------|----------|-----------|
| [type] | [frequency] | [date] | [who] |

## Project Timeline
| Phase | Start | End | Key Milestone |
|-------|-------|-----|--------------|
| Discovery | [date] | [date] | Discovery brief approved |
| Assessment | [date] | [date] | Assessment report approved |
| Development | [date] | [date] | Development complete |
| Validation | [date] | [date] | Client acceptance |
| Enablement | [date] | [date] | Project close / retainer start |

## Immediate Action Items
| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | [action] | [owner] | [date] | [status] |
| 2 | [action] | [owner] | [date] | [status] |
| 3 | [action] | [owner] | [date] | [status] |

## Sales-to-Delivery Handoff Summary
- **Business problem:** [summary]
- **Solution proposed:** [summary]
- **Client expectations:** [key expectations and commitments]
- **Relationship notes:** [communication preferences, decision style]
- **Growth potential:** [future opportunities]
```

## What Makes This Different from Generic Client Onboarding
- Integrates directly with Layaa AI's 5-stage delivery methodology (Discovery through Enablement)
- Validates handoff conditions against Layaa AI's sales-revenue process (50% deposit, SOW, CRM update)
- Maps onboarding to Layaa AI's service verticals for type-appropriate welcome materials
- Includes ICP-specific tailoring (SaaS, logistics, fintech, professional services)
- Routes handoff through Layaa AI's GPT workforce (Rishi for revenue ops, Rohit for discovery, Ujjwal for architecture)
- Sets up communication cadence aligned with Layaa AI's client relationship model
- Applies Layaa AI's data governance standards (via Preeti) to access and credential handling
- Initiates Discovery phase with Rohit's feasibility validation built into the process
- Considers Indian SME client context (technology maturity, communication preferences, decision-making patterns)
