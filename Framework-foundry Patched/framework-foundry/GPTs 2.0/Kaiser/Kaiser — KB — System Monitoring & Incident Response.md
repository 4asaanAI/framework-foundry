# Kaiser — KB — System Monitoring & Incident Response

## System Monitoring Checklists

### Daily (Automated via Cron)
- [ ] Database health check passed
- [ ] Backup completed and verified
- [ ] No failed writes in abandoned state
- [ ] No agents in budget_exhausted state
- [ ] Task reminders sent for due/overdue items
- [ ] Daily briefing generated and passed to Kabir
- [ ] Model update check completed

### Weekly Review (Manual/On-Request)
- [ ] Review backup sizes trend
- [ ] Review budget usage patterns
- [ ] Review failed write history for recurring patterns
- [ ] Check system pool usage trend
- [ ] Review audit log for anomalies
- [ ] Check VPS disk usage and resources

### Monthly Review (After Budget Reset)
- [ ] Budget reset confirmed for all agents
- [ ] Previous month's token usage report generated
- [ ] Backup retention rotation verified
- [ ] Database size trend assessed
- [ ] Performance benchmarks compared month-over-month

---

## Severity Classification

| Severity | Definition | Response Time | Responder |
|----------|-----------|---------------|-----------|
| **P1 — Emergency** | System outage, data loss risk, security breach | Immediate | Kaiser auto-alerts → Founders |
| **P2 — Critical** | Major feature broken, backup failure, data integrity | Within 1 hour | Kaiser alerts → Founders |
| **P3 — Warning** | Performance degradation, budget concerns | Within 4 hours | Kaiser logs + notifies agent |
| **P4 — Info** | Routine observations, optimization opportunities | Next daily briefing | Kaiser logs only |

## Incident Response Template

```markdown
## Incident Report: {Title}
**Severity:** P{1-4} | **Detected:** {timestamp} | **Resolved:** {timestamp or "Ongoing"}

### What Happened
{Description}

### Impact
{What was affected — agents, data, users}

### Root Cause
{Why it happened}

### Response Timeline
- {timestamp}: Detected by {how}
- {timestamp}: {Action taken}
- {timestamp}: {Resolution}

### Prevention
{Changes to prevent recurrence}
```

## Common Incident Playbooks

### Database Write Failures Spike
1. Check disk space immediately
2. Check for WAL file bloat
3. Check for long-running transactions
4. If disk full: alert EMERGENCY, stop non-critical writes
5. If WAL bloat: force checkpoint
6. If transaction lock: identify and kill stalled transaction

### Backup Failure
1. Check VPS disk space
2. Check rclone configuration and B2 credentials
3. Check network connectivity to B2
4. Manual backup attempt
5. If persistent: escalate to Founders

### Agent Budget Exhaustion (Multiple Agents)
1. Check for conversation loop causing excessive tokens
2. Check if a skill loaded unusually large context
3. Review last 24h of token usage per agent
4. If systemic: notify Founders
5. Consider emergency budget loan from underutilized agents

### Unexpected Database Growth
1. Identify which collections grew most
2. Check for duplicate writes or loops
3. Check memory extraction rate (is Sage over-extracting?)
4. Report findings to Founders

---

## Health Scoring System

```
db_score = IF db_size% <= 50: 100 | <= 70: 80 | <= 85: 50 | ELSE: 20
performance_score = IF avg_ms <= 100: 100 | <= 300: 80 | <= 500: 50 | ELSE: 20
write_score = IF rate >= 99%: 100 | >= 95%: 70 | >= 90%: 40 | ELSE: 10
backup_score = IF age_hrs <= 26: 100 | <= 50: 50 | ELSE: 10
budget_score = IF no_exhausted AND pool < 80%: 100 | exhausted <= 2: 70 | ELSE: 40

OVERALL = (db * 0.25) + (perf * 0.25) + (write * 0.20) + (backup * 0.20) + (budget * 0.10)

GREEN >= 85 | YELLOW >= 60 | RED < 60
```
