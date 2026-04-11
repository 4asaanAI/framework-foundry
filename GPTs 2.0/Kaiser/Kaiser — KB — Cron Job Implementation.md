# Kaiser — KB — Cron Job Implementation

> n8n cron patterns for Kaiser's automated monitoring, backup, budget, and notification responsibilities. Includes concrete node configurations, cron expressions, and workflow templates.

---

## Cron Node Configuration Reference

### Schedule Trigger Node Setup

The Schedule Trigger node in n8n supports two modes:

**Mode 1: Cron Expression**
```
Node: Schedule Trigger
Rule Type: Cron
Cron Expression: 30 21 * * *    ← This fires at 3:00 AM IST (21:30 UTC)
```

**Mode 2: Interval**
```
Node: Schedule Trigger
Rule Type: Interval
Every: 5 Minutes
```

### Kaiser's Cron Schedule (All Times in IST)

| Job | Cron (UTC) | IST Equivalent | Frequency |
|-----|-----------|----------------|-----------|
| Health check | `*/5 * * * *` | Every 5 minutes | Continuous |
| Budget warning scan | `0 * * * *` | Every hour at :00 | Hourly |
| Failed write retry | `*/15 * * * *` | Every 15 minutes | Continuous |
| Daily backup | `30 21 * * *` | 3:00 AM IST daily | Daily |
| Task reminders | `30 2 * * *` | 8:00 AM IST daily | Daily |
| Daily briefing generation | `0 3 * * *` | 8:30 AM IST daily | Daily |
| Memory maintenance | `30 20 * * *` | 2:00 AM IST daily | Daily |
| Monthly budget reset | `31 18 1 * *` | 12:01 AM IST, 1st of month | Monthly |

**IST conversion rule:** IST = UTC + 5:30. To get UTC from IST: subtract 5 hours 30 minutes. 3:00 AM IST = 9:30 PM UTC (previous day).

---

## Health Check Workflow Pattern

**Purpose:** Continuously verify that all Layaa OS subsystems are operational.

**Trigger:** Schedule Trigger every 5 minutes.

```
[Schedule Trigger: */5 * * * *]
  → [HTTP Request: GET /api/health from PocketBase]
      Check: response status 200 within 2 seconds
  → [HTTP Request: GET /api/collections/agents/records?perPage=1]
      Check: response returns data (DB read works)
  → [HTTP Request: POST /api/collections/system_logs/records — write test]
      Check: write succeeds
  → [HTTP Request: DELETE the test record just created]
  → [Function: Calculate health scores]
      db_score = based on response time
      write_score = based on write success
      api_score = based on PocketBase availability
  → [IF: overall_score < 60 (RED)]
      → (true)  → [Set: severity = "P1"]
                 → [HTTP Request: POST to /webhook/notify — email + in-app]
      → (false) → [IF: overall_score < 85 (YELLOW)]
          → (true)  → [HTTP Request: POST system_logs — warning]
          → (false) → [No Operation — system healthy]
```

**Health check Function node code:**
```javascript
const items = $input.all();
const pbResponse = items[0].json;
const dbReadMs = items[1].json.responseTime || 0;
const writeSuccess = items[2].json.id !== undefined;

const db_score = dbReadMs <= 100 ? 100 : dbReadMs <= 300 ? 80 : dbReadMs <= 500 ? 50 : 20;
const write_score = writeSuccess ? 100 : 0;
const overall = (db_score * 0.5) + (write_score * 0.5);

return [{
  json: {
    overall_score: overall,
    db_read_ms: dbReadMs,
    write_ok: writeSuccess,
    status: overall >= 85 ? 'GREEN' : overall >= 60 ? 'YELLOW' : 'RED',
    checked_at: new Date().toISOString()
  }
}];
```

---

## Backup Workflow Pattern

**Purpose:** Daily automated backup of PocketBase data to Backblaze B2.

**Trigger:** Schedule Trigger daily at 3:00 AM IST.

```
[Schedule Trigger: 30 21 * * *]
  → [Function: Generate backup filename]
      filename = `layaa-backup-${date}-${timestamp}.zip`
  → [Execute Command: Create PocketBase backup]
      Command: pb backup create {{ filename }}
      (Or HTTP Request: POST /api/backups — PocketBase admin API)
  → [IF: backup file exists and size > 0]
      → (false) → [Set: stage = "creation_failed"]
                 → [Jump to error handler]
      → (true)  → [Execute Command: Upload via rclone]
          Command: rclone copy /pb_data/backups/{{ filename }} b2:layaa-backups/daily/
  → [IF: rclone exit code === 0]
      → (false) → [Set: stage = "upload_failed"]
                 → [Jump to error handler]
      → (true)  → [Execute Command: Verify remote file]
          Command: rclone ls b2:layaa-backups/daily/{{ filename }}
  → [IF: remote file size matches local]
      → (false) → [Set: stage = "verification_failed"]
                 → [Jump to error handler]
      → (true)  → [Execute Command: Cleanup old local backups]
          Command: find /pb_data/backups -name "*.zip" -mtime +7 -delete
  → [HTTP Request: POST system_logs — backup success]
      Body: { "type": "backup", "status": "success", "filename": "...", "size_mb": ..., "duration_s": ... }

[Error Handler Branch:]
  → [HTTP Request: POST to /webhook/notify]
      Body: {
        "channel": "email",
        "to": ["abhimanyu@layaa.ai", "shubham@layaa.ai"],
        "subject": "[LAYAA OS] CRITICAL: Daily Backup Failed",
        "html": "Stage: {{ stage }} | Error: {{ error_message }} | Last successful: {{ last_backup_date }}"
      }
  → [HTTP Request: POST system_logs — backup failure]
```

**Backup retention policy:**
- Local: keep last 7 days (cleanup step above)
- Remote (B2): keep last 30 days (configure via B2 lifecycle rules)
- Monthly snapshots: keep indefinitely (copy 1st-of-month backup to `b2:layaa-backups/monthly/`)

---

## Budget Warning Workflow

**Purpose:** Hourly scan of all agent budgets, send warnings at thresholds.

**Trigger:** Schedule Trigger every hour.

```
[Schedule Trigger: 0 * * * *]
  → [HTTP Request: GET /api/collections/agents/records?fields=id,name,canonical_role,budget_tokens,budget_used,budget_loaned,status&perPage=50]
  → [Function: Calculate usage for each agent]
      For each agent:
        effective_budget = budget_tokens + budget_loaned
        usage_percent = (budget_used / effective_budget) * 100
        daily_rate = budget_used / days_elapsed_this_month
        projected_exhaustion = effective_budget / daily_rate (days)
  → [Filter: usage_percent >= 80]
  → [Switch: usage_percent range]
      → 80-94% (warning):
          [HTTP Request: POST /api/collections/notifications/records]
            Body: {
              "profile_id": "{{ agent.profile_id }}",
              "title": "Budget Alert: {{ usage_percent }}% Used",
              "body": "You've used {{ budget_used }} of {{ effective_budget }} tokens. Projected exhaustion: {{ projected_date }}.",
              "category": "budget_warning",
              "source_agent_id": "kaiser_id"
            }
      → 95-99% (critical):
          [HTTP Request: POST notification — same as above with "CRITICAL" prefix]
          [HTTP Request: POST to /webhook/notify — email to Founders]
            Body: {
              "channel": "email",
              "to": ["abhimanyu@layaa.ai", "shubham@layaa.ai"],
              "subject": "[LAYAA OS] CRITICAL: {{ agent.name }} at {{ usage_percent }}% budget",
              "html": "Agent {{ name }} ({{ canonical_role }}) is at {{ usage_percent }}%. Action needed."
            }
      → 100% (exhausted):
          [HTTP Request: PATCH /api/collections/agents/records/{{ agent.id }}]
            Body: { "status": "budget_exhausted" }
          [HTTP Request: POST notification + email — same as critical]
  → [HTTP Request: POST system_logs — budget scan complete]
```

**Budget calculation Function node:**
```javascript
const agents = $input.first().json.items;
const now = new Date();
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const daysElapsed = Math.max(1, (now - monthStart) / (1000 * 60 * 60 * 24));

return agents.map(agent => {
  const effective = agent.budget_tokens + (agent.budget_loaned || 0);
  const pct = effective > 0 ? (agent.budget_used / effective) * 100 : 0;
  const dailyRate = agent.budget_used / daysElapsed;
  const daysLeft = dailyRate > 0 ? (effective - agent.budget_used) / dailyRate : 999;

  return {
    json: {
      ...agent,
      effective_budget: effective,
      usage_percent: Math.round(pct * 10) / 10,
      daily_rate: Math.round(dailyRate),
      projected_days_left: Math.round(daysLeft),
      projected_exhaustion_date: new Date(now.getTime() + daysLeft * 86400000).toISOString().split('T')[0]
    }
  };
});
```

---

## Error Notification Workflow

**Purpose:** Detect errors across all workflows, classify severity, and route notifications.

**Trigger:** Error Trigger (linked as the error workflow for all 7 core workflows).

```
[Error Trigger]
  → [Set: Extract error details]
      workflow_name = {{ $json.workflow.name }}
      failed_node = {{ $json.execution.error.node }}
      error_message = {{ $json.execution.error.message }}
      execution_id = {{ $json.execution.id }}
      timestamp = {{ $now.toISO() }}
  → [HTTP Request: POST /api/collections/error_logs/records]
      Body: { workflow_name, failed_node, error_message, execution_id, timestamp, severity: "pending" }
  → [Switch: Classify severity by workflow + error type]
      → Backup failure OR data loss risk → P1:
          [HTTP Request: PATCH error_log — severity = "P1"]
          [HTTP Request: POST /webhook/notify — email + in-app + WhatsApp to Founders]
      → Auth failure OR budget system error → P2:
          [HTTP Request: PATCH error_log — severity = "P2"]
          [HTTP Request: POST /webhook/notify — email + in-app]
      → API timeout OR rate limit → P3:
          [HTTP Request: PATCH error_log — severity = "P3"]
          [HTTP Request: POST /api/collections/notifications/records — in-app to Kaiser]
      → All other errors → P4:
          [HTTP Request: PATCH error_log — severity = "P4"]
          (Already logged — no additional notification)
```

**Severity classification rules:**

| Error Pattern | Severity | Routing |
|--------------|----------|---------|
| Backup workflow failure | P1 | Email + in-app + WhatsApp to Founders |
| PocketBase write failure (any workflow) | P1 | Email + in-app to Founders |
| Claude API auth failure (401) | P2 | Email to Founders (API key issue) |
| Budget reset failure | P2 | Email + in-app to Founders |
| Claude API rate limit (429) | P3 | In-app to Kaiser (monitor, auto-retry handles it) |
| External API timeout | P3 | In-app to Kaiser |
| Non-critical node failure | P4 | Logged only |

---

## Retry Pattern for Failed Operations

For operations that Kaiser needs to retry (failed writes, failed notifications, failed backups):

```
[Schedule Trigger: */15 * * * *]
  → [HTTP Request: GET /api/collections/failed_operations/records?filter=status='pending'&&attempts<5]
  → [IF: any items returned]
      → (false) → [No Operation]
      → (true)  → [Split Out: individual items]
          → [Loop Over Items: batch size 5]
              → [Function: Determine operation type and execute]
              → [IF: operation succeeded]
                  → (true)  → [HTTP Request: PATCH status = "resolved", resolved_at = now()]
                  → (false) → [Function: Calculate next retry time]
                      next_attempt = attempts + 1
                      backoff = 15 * next_attempt (seconds: 15, 30, 45, 60, 75)
                      → [HTTP Request: PATCH attempts = next_attempt, next_retry_at = ...]
                      → [IF: next_attempt >= 5]
                          → (true) → [HTTP Request: PATCH status = "abandoned"]
                                   → [HTTP Request: POST /webhook/notify — email to Founders]
                          → (false) → [No Operation — will retry next cycle]
  → [HTTP Request: POST system_logs — retry cycle complete]
```

**Backoff schedule:**

| Attempt | Wait Before Retry | Total Elapsed |
|---------|------------------|---------------|
| 1 | 15 seconds | 15 seconds |
| 2 | 30 seconds | 45 seconds |
| 3 | 45 seconds | 1.5 minutes |
| 4 | 60 seconds | 2.5 minutes |
| 5 | 75 seconds (then abandon) | 3.75 minutes |

**Do NOT retry:**
- Delete operations (destructive)
- Validation errors (400 status — data problem, not transient)
- Auth failures (401/403 — credential problem, needs manual fix)
- Operations on deleted collections or agents

---

*This document is part of Kaiser's technical knowledge base. Update as new cron jobs are added, thresholds change, or monitoring requirements evolve.*
