# Kaiser — KB — Failed Write Retry & Notification Templates

## How Failed Writes Happen

Writes can fail due to:
- Network interruption during API call
- SQLite write lock contention (single-writer model)
- Validation error (data format issue)
- PocketBase server temporarily unavailable
- Disk space issues

## Retry Algorithm

```
MAX_ATTEMPTS = 5
BACKOFF_BASE = 15 seconds

For each failed_write where status = "failed" AND attempts < MAX_ATTEMPTS:

  1. Retrieve original write payload (collection, data, operation_type)
  2. Attempt the write operation

  IF success:
    → status = "resolved", resolved_at = now()
    → Log INFO: "Resolved on attempt {attempts + 1}"

  IF failure:
    → attempts += 1, last_error = error_message
    → next_retry_at = now() + (BACKOFF_BASE * attempts)  // 15s, 30s, 45s, 60s, 75s

    IF attempts >= MAX_ATTEMPTS:
      → status = "abandoned", abandoned_at = now()
      → Create task: "Abandoned write: {collection}/{record_id}"
      → Send notification + email to Founders
      → Log CRITICAL: "Write abandoned after 5 attempts"
```

## Do NOT Retry
- Delete operations (destructive — require manual intervention)
- Writes that failed due to validation errors (data issue, not transient)
- Writes to collections that no longer exist
- Writes where the originating agent no longer exists

---

## Notification Templates

### Budget Warning (In-App)
```
Title: Budget Alert: {usage_percent}% Used
Body: You've used {budget_used} of your {effective_budget} token budget this month. 
      At current rate, you'll hit the limit by {projected_date}.
Category: budget_warning
```

### Budget Exhausted (Email)
```
Subject: [LAYAA OS] CRITICAL: {Agent Name} Budget Exhausted
Body: Agent: {name} ({canonical_role})
      Budget: {budget_tokens} tokens | Used: {budget_used} ({usage_percent}%)
      Status: BLOCKED
      Action: Wait for reset, loan tokens, or increase allocation
```

### Backup Success (Log Only)
```
[INFO] {timestamp} | BACKUP | Daily backup completed
  File: {filename} | Size: {size_mb}MB | Verified: Yes | Duration: {seconds}s
```

### Backup Failure (Email)
```
Subject: [LAYAA OS] CRITICAL: Daily Backup Failed
Body: Stage: {creation | upload | verification} | Error: {error_message}
      Last successful: {last_backup_date}
      Action: Manual backup required. Check disk space and rclone config.
```

### Task Reminder (In-App)
```
Title: Task Due {Today/Overdue}
Body: "{task_title}" is {due today / overdue by {N} days}. [View Task]
Category: task_reminder
```

### Failed Write Abandoned (Email)
```
Subject: [LAYAA OS] WARNING: Failed Write Abandoned
Body: Collection: {name} | Operation: {create/update}
      Agent: {agent_name} | Attempts: 5/5
      The system has given up retrying. Data may be lost.
```

### Database Health Warning (In-App + Email if Critical)
```
Title: Database Health: {WARNING/CRITICAL}
Body: DB Size: {percent}% | Avg Response: {ms}ms | Write Rate: {percent}%
Category: system_alert
```

### Monthly Budget Reset (In-App)
```
Title: Monthly Budget Reset Complete
Body: All budgets reset for {month}. Last month: {total_tokens_used} tokens across {N} agents.
Category: system_alert
```
