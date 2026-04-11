# Dev — KB — Product Metrics & KPIs

> What to track, how to track it, dashboard structure, alert thresholds, and success metrics for Layaa OS and its pilot deployments. Metrics are how Dev knows whether the product is working — not opinions, not feelings, not anecdotes. Data.

---

## 1. Metrics Philosophy

Track what drives decisions, not what looks impressive in a slide. Every metric Dev tracks must answer one of three questions:

1. **Are users actually using the product?** (Adoption & Engagement)
2. **Is the product working correctly?** (System Health & Reliability)
3. **Is the product delivering value?** (Outcomes & Satisfaction)

If a metric does not help answer one of these, it is vanity — drop it.

---

## 2. Core Metrics — Layaa OS

### Adoption & Engagement

| Metric | Definition | Target | Red Flag | Source |
|--------|-----------|--------|----------|--------|
| Daily Active Users (DAU) | Unique users who send at least one message per day | 100% of enrolled users | <50% of enrolled | `profiles` + `conversations` tables |
| Messages per User per Day | Average messages sent across all conversations | >10 | <5 | `messages` table |
| Memories Extracted per Week | New memories created by Sage from conversations | >100 per school | <30 per school | `agent_memory` table |
| Delegations per Day | Number of @agent mentions triggering agent handoff | >5 | <2 | Delegation logs |
| Skills Used per Week | Unique /commands executed by users | >20 | <5 | Skill execution logs |
| Conversations per User per Day | Number of distinct conversations initiated | >3 | <1 | `conversations` table |

### System Health & Reliability

| Metric | Definition | Target | Alert Threshold | Source |
|--------|-----------|--------|-----------------|--------|
| Uptime | Percentage of time system is accessible and responsive | >99% | <99% | Kaiser health checks |
| Response Time (p95) | 95th percentile time from message send to first response token | <3s | >5s | `token_usage_log` |
| Error Rate | Percentage of requests returning errors | <1% | >3% | Error logs |
| Budget Utilization | Percentage of agent token budgets consumed | 60-80% | >95% (exhaustion risk) or <20% (under-use) | `agents` table |
| Failed Workflows | n8n workflow executions that fail | <5% | >10% | n8n execution logs |
| Backup Success Rate | Daily backups completing without errors | 100% | Any failure | Kaiser backup logs |

### Outcomes & Satisfaction

| Metric | Definition | Target | Red Flag | Source |
|--------|-----------|--------|----------|--------|
| Net Promoter Score (NPS) | "Would you recommend Layaa OS?" on a 0-10 scale | >7 | <5 | User feedback survey |
| Task Completion Rate | Tasks created that reach "Done" status | >80% | <60% | `tasks` table |
| Time to First Value | Time from first login to first meaningful agent interaction | <30 min | >2 hours | User activity logs |
| Support Tickets | Number of issues reported by users per week | <5 per school | >15 per school | Support channel |
| Feature Adoption Rate | Percentage of users who try a new feature within 7 days of launch | >50% | <20% | Feature usage logs |

---

## 3. Pilot-Specific Metrics

The April 2026 pilot with Aaryans School (Apr 13) and SSA (Apr 15) has specific success criteria tied to decision gates.

### Pilot Success Criteria

| Criteria | Threshold | Measured At |
|----------|----------|-------------|
| Users sending >10 messages/day | >50% of enrolled users | Gate 1 (Apr 13 evening) |
| Memories extracted | >50 in first week per school | Gate 2 (Apr 20) |
| Delegations working | >5 per day across all users | Gate 2 (Apr 20) |
| Zero S0 bugs | No system-down or data-loss incidents | Gate 1 onwards |
| Uptime >99% | Measured continuously | Gate 2 (Apr 20) |
| NPS >7 | Survey after first week | Gate 2 (Apr 20) |
| Clear ROI demonstrated | Users report time savings or quality improvement | Gate 3 (Apr 30) |

### Decision Gate Outcomes

| Gate | Date | Positive Outcome | Negative Outcome |
|------|------|-----------------|------------------|
| Gate 1 | April 13 evening | Proceed to SSA launch April 15 | Pause SSA, fix critical issues |
| Gate 2 | April 20 | Expand to 3rd school | Pause expansion, debug and iterate |
| Gate 3 | April 30 | Scale to 10 schools by June | Continue iterating or consider market pivot |

---

## 4. Dashboard Structure

### Daily Dashboard (Check Every Morning)

```
LAYAA OS — DAILY HEALTH
[Date]

USERS:      [X] active / [Y] total enrolled    [OK / WARNING]
MESSAGES:   [X] today, [Y] avg/user            [OK / WARNING]
UPTIME:     [X]%                                [OK / WARNING]
RESPONSE:   [X]s p95                            [OK / WARNING]
ERRORS:     [X] in last 24h                     [OK / WARNING]
BUDGETS:    [X] agents >90%, [Y] agents <20%    [OK / WARNING]
BUGS:       S0: [X]  S1: [X]  S2: [X]          [OK / WARNING]
```

### Weekly Dashboard (Friday Sprint Review)

```
LAYAA OS — WEEKLY SUMMARY
[Week of Date]

ENGAGEMENT:
  Messages/user/day (avg):  [X]  (target: >10)
  Memories extracted:       [X]  (target: >100/school)
  Delegations/day (avg):    [X]  (target: >5)
  Skills used:              [X]  (target: >20)

RELIABILITY:
  Uptime:                   [X]% (target: >99%)
  p95 response time:        [X]s (target: <3s)
  Error rate:               [X]% (target: <1%)
  Failed workflows:         [X]  (target: <5%)

DELIVERY:
  Sprint velocity:          [X]% (target: 75-90%)
  Tasks completed:          [X] / [Y] planned
  Bugs fixed:               [X]
  Features shipped:         [X]

FEEDBACK:
  Support tickets:          [X]
  Feature requests:         [X]
  NPS (if collected):       [X]
```

---

## 5. Alert Thresholds and Escalation

When metrics cross alert thresholds, the following escalation rules apply:

| Alert | Threshold | Immediate Action | Escalate To |
|-------|----------|------------------|-------------|
| System down | Uptime <95% for 15+ minutes | Check server, restart services, notify Founders | Shubham + Kaiser |
| Response degradation | p95 >5s for 1+ hour | Check LLM API status, check PocketBase load | Shubham |
| Budget exhaustion | Any agent >95% budget | Pause non-essential requests, check for loops | Kaiser |
| Data loss indicator | Error log shows failed writes with no recovery | Stop affected workflow, check DLQ, manual recovery | Shubham + Kaiser |
| User adoption drop | DAU drops >30% day-over-day | Investigate cause (bug? confusion? holiday?) | Dev + Arjun |
| Pilot failure signal | Any Gate criteria missed by >50% | Emergency review with Founders | Shubham + Abhimanyu |

---

## 6. Metrics Anti-Patterns (What NOT to Track)

| Vanity Metric | Why It Is Misleading | Better Alternative |
|--------------|---------------------|-------------------|
| Total messages ever sent | Always goes up, says nothing about current engagement | Messages per user per day (current engagement) |
| Number of agents created | Static after setup | Agents actively used per day |
| Page views | Measures curiosity, not value | Task completion rate |
| Total conversations | Users create new ones instead of continuing — inflated | Conversations per user per day + conversation depth |
| Sign-ups | Means nothing without activation | Time to first value + 7-day retention |

---

## 7. Metrics Review Cadence

| Frequency | Review | Participants | Action |
|-----------|--------|-------------|--------|
| Daily | Health dashboard scan | Dev (automated check) | Flag anomalies |
| Weekly | Sprint metrics review | Dev + Shubham | Adjust sprint priorities based on data |
| Bi-weekly (Pilot) | Pilot progress review | Dev + Shubham + Abhimanyu | Evaluate gate criteria |
| Monthly | Product metrics deep dive | Dev + Kabir + Shubham | Strategic product direction adjustments |
| Quarterly | KPI target review | Founders + Dev | Revise targets based on maturity |

---

**Cross-references:**
- For sprint planning driven by metrics: see `Dev — KB — Sprint Planning Framework.md`
- For bugs revealed by metrics: see `Dev — KB — Bug Triage & Release Planning.md`
- For roadmap decisions influenced by metrics: see `Dev — KB — Layaa OS Product Roadmap.md`
- For product learning from metrics: see `Dev — KB — Self-Learning Framework.md`

*Metrics are Dev's compass. Without them, product decisions are guesses. With them, every sprint is informed by what users actually do, not what we assume they do.*
