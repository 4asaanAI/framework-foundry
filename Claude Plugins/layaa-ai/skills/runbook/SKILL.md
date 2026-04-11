---
name: runbook
description: >
  Create operational runbooks for recurring tasks, incident response, deployment procedures,
  and system maintenance. Provides step-by-step instructions with expected outputs, troubleshooting,
  and rollback procedures for operators. In Layaa AI mode, includes n8n workflow monitoring,
  error handling, and escalation paths.
  Trigger: "runbook", "create runbook", "operational procedure", "incident response", "deployment procedure", "maintenance guide", "operator guide"
  This skill replaces the generic operations:runbook capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Runbook

Create operational runbooks for recurring tasks, incident response, deployment procedures, and system maintenance. Provides step-by-step instructions with expected outputs at each step, troubleshooting for common issues, rollback procedures, and completion verification.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, n8n, Make, Relevance AI, workflow monitoring, client systems, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/operations/automation-architecture.md — Workflow patterns, error handling standards, architecture decisions
- domain-references/operations/qa-validation.md — Validation procedures and quality gates
- domain-references/operations/tech-stack.md — Tool configurations, platform specifics
- shared-references/service-verticals.md — Service delivery context
Only load references relevant to the runbook subject.

## Execution Steps

### Step 1: Identify Procedure to Document
Collect or ask for:
- **Runbook title:** Clear, action-oriented name
- **Runbook type:**
  - **Operational:** Recurring task performed on a schedule (daily checks, weekly maintenance)
  - **Incident Response:** Steps to follow when something breaks
  - **Deployment:** Steps to deploy or update a system
  - **Maintenance:** Periodic system maintenance or cleanup
  - **Recovery:** Steps to recover from a failure or data loss
  - **Onboarding:** Steps to set up a new system, tool, or environment
- **Audience:** Who will execute this runbook (junior developer, senior engineer, ops team, founder)?
- **Frequency:** How often will this be used (daily, weekly, on-demand, on-incident)?
- **Criticality:** What happens if this procedure is done wrong (LOW/MEDIUM/HIGH/CRITICAL)?

### Step 2: Define Trigger and When to Use
Document clearly when this runbook should be executed:

1. **Trigger conditions:** What event, alert, or schedule initiates this procedure?
   - Scheduled (cron, calendar reminder)
   - Alert-triggered (monitoring system, error notification)
   - Request-triggered (user request, client report)
   - Event-triggered (deployment, configuration change, incident)

2. **When NOT to use:** Conditions where this runbook is not appropriate
3. **Prerequisite conditions:** What must be true before starting
4. **For Layaa AI:** Map triggers to monitoring systems (n8n execution logs, API health checks, error alerts)

### Step 3: List Prerequisites
Document everything needed before starting:

**Access Requirements:**
- [ ] Systems and credentials needed (list each)
- [ ] VPN or network access required
- [ ] Admin/elevated permissions needed
- [ ] API keys or tokens required

**Tool Requirements:**
- [ ] Software that must be installed
- [ ] CLI tools or scripts needed
- [ ] Browser extensions or plugins
- [ ] For Layaa AI: n8n access, cloud provider console, monitoring dashboard

**Knowledge Requirements:**
- [ ] Concepts the operator must understand
- [ ] Related runbooks to review first
- [ ] Documentation to have open

**Environment Requirements:**
- [ ] Environment state (production, staging, test)
- [ ] Maintenance window or change freeze status
- [ ] Backup verification before proceeding

### Step 4: Write Step-by-Step Instructions
For each step, provide:

```
### Step [N]: [Action Verb + Object]
**Time:** [estimated duration]
**Risk Level:** [LOW / MEDIUM / HIGH]

**Instructions:**
1. [Specific instruction with exact commands, URLs, or UI paths]
2. [Next instruction]
3. [Next instruction]

**Expected Output:**
[Exactly what the operator should see/receive if the step succeeds — include sample output, status codes, or UI state]

**If Output Does Not Match:**
- [What to check first]
- [Common cause and fix]
- [When to stop and escalate]
```

**Writing standards:**
- Use imperative mood ("Click", "Run", "Verify" — not "You should click")
- Include exact commands, file paths, URLs, and UI navigation paths
- Show expected output for every step (sample logs, status codes, UI states)
- Mark destructive steps clearly with warnings
- Include time estimates for steps that may take a while
- Note steps that require waiting (and how long)

**For Layaa AI — Common Procedure Types:**

**n8n Workflow Monitoring:**
- Check workflow execution history
- Verify successful completions vs. failures
- Review error logs for failed executions
- Check webhook health and trigger status
- Verify credential expiry dates

**API Health Checks:**
- Test API endpoint connectivity
- Verify authentication tokens are valid
- Check rate limit status
- Review response times and latency

**Error Handling:**
- Identify error type (transient vs. permanent)
- Apply retry logic for transient errors
- Collect diagnostic data for permanent errors
- Notify stakeholders and create incident record

### Step 5: Add Troubleshooting Section
For each common issue that may arise during the procedure:

| Problem | Symptoms | Likely Cause | Solution |
|---------|----------|-------------|----------|
| [problem] | [what the operator sees] | [root cause] | [step-by-step fix] |

**Diagnostic commands/checks:**
- List diagnostic commands or inspection steps for each problem type
- Include how to collect logs or error data for escalation
- For Layaa AI: n8n execution log inspection, API response debugging, database query checks

**Escalation criteria:**
- When to stop troubleshooting and escalate
- Who to escalate to (for Layaa AI: Ujjwal for technical, Kabir for cross-functional, Founders for critical)
- What information to include in the escalation
- Expected response time from escalation target

### Step 6: Include Rollback Procedures
For procedures that make changes, document how to undo them:

```
## Rollback Procedure
**When to Rollback:**
- [conditions that warrant rollback]

**Rollback Steps:**
1. [step to reverse the change]
2. [step to verify reversal]
3. [step to confirm system health]

**Rollback Time Estimate:** [duration]

**Post-Rollback:**
- [ ] Verify system is in pre-change state
- [ ] Notify stakeholders of rollback
- [ ] Document reason for rollback
- [ ] Schedule retry with fixes
```

### Step 7: Add Verification and Completion Criteria
Define how to confirm the procedure was successful:

**Completion Checklist:**
- [ ] All steps executed without errors
- [ ] Expected outputs verified at each step
- [ ] System health check passed post-procedure
- [ ] Monitoring confirms normal operation
- [ ] Stakeholders notified of completion

**Verification tests:**
- List specific checks to perform after completion
- Include automated health check commands if available
- Define "healthy" state criteria

**Post-completion actions:**
- Log the procedure execution (who, when, outcome)
- Update any tracking systems or tickets
- Schedule next execution (if recurring)
- For Layaa AI: update incident log, notify relevant GPT workforce members

## Output Format

```
# Runbook: [Title]
**Document ID:** RB-[domain]-[NNN]
**Version:** [X.Y]
**Last Updated:** [date]
**Author:** [name/role]
**Reviewed by:** [Ujjwal — Automation Architect / General]
**Classification:** [INTERNAL / CONFIDENTIAL]

## Overview
- **Purpose:** [what this runbook accomplishes]
- **Type:** [Operational / Incident Response / Deployment / Maintenance / Recovery / Onboarding]
- **Audience:** [who executes this]
- **Frequency:** [when/how often]
- **Criticality:** [LOW / MEDIUM / HIGH / CRITICAL]
- **Estimated Duration:** [total time to complete]

## Trigger
**Execute this runbook when:**
- [trigger condition 1]
- [trigger condition 2]

**Do NOT use this runbook if:**
- [exclusion condition 1]
- [exclusion condition 2]

## Prerequisites
### Access
- [ ] [system] — [access level needed] — [how to obtain]
- [ ] [system] — [access level needed] — [how to obtain]

### Tools
- [ ] [tool] — [version] — [installation link]

### Knowledge
- [ ] [concept or related runbook to review]

### Environment
- [ ] [environment state required]
- [ ] [backup verified: yes/no]

## Procedure

### Step 1: [Action]
**Time:** [duration] | **Risk:** [LOW/MEDIUM/HIGH]

1. [instruction]
2. [instruction]

**Expected Output:**
```
[sample output]
```

**If Output Does Not Match:**
- Check: [first thing to check]
- Fix: [common resolution]
- Escalate if: [escalation condition]

### Step 2: [Action]
[Same format]

### Step 3: [Action]
[Same format]

[Continue for all steps]

## Troubleshooting
| # | Problem | Symptoms | Cause | Solution |
|---|---------|----------|-------|----------|
| 1 | [problem] | [symptoms] | [cause] | [solution] |
| 2 | [problem] | [symptoms] | [cause] | [solution] |
| 3 | [problem] | [symptoms] | [cause] | [solution] |

### Diagnostic Commands
```
[diagnostic command 1 — description]
[diagnostic command 2 — description]
```

### Escalation
| Condition | Escalate To | Include | Expected Response |
|-----------|------------|---------|------------------|
| [condition] | [person/role] | [info to provide] | [response time] |

## Rollback Procedure
**When to Rollback:** [conditions]

1. [rollback step]
2. [rollback step]
3. [verification step]

**Rollback Time:** [duration]

## Completion Checklist
- [ ] All steps executed successfully
- [ ] Expected outputs verified
- [ ] System health check passed
- [ ] Monitoring confirms normal operation
- [ ] Execution logged (who, when, outcome)
- [ ] Stakeholders notified
- [ ] Next execution scheduled (if recurring): [date]

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| [X.Y] | [date] | [author] | [changes] |
```

## What Makes This Different from Generic Runbooks
- Includes Layaa AI-specific procedure types (n8n workflow monitoring, API health checks, credential rotation)
- Error handling follows Ujjwal's (Automation Architect) error handling and debugging patterns
- Escalation paths map to Layaa AI's governance hierarchy (Ujjwal → Kabir → Founders)
- Verification criteria align with Rohit's (QA & Validation Specialist) validation standards
- Covers common Layaa AI operational scenarios (workflow failures, API rate limits, credential expiry)
- Integrates with Layaa AI's tech stack specifics (n8n, Make, Relevance AI, cloud providers)
- Rollback procedures follow Ujjwal's build handoff and testing checklist patterns
