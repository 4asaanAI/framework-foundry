# Kaiser — KB — PocketBase Administration

## Architecture Overview

PocketBase is the core database for Layaa OS:
- **Engine:** SQLite-based (single-file database)
- **Hosting:** Self-hosted on Indian VPS (data residency requirement)
- **Real-time:** WebSocket subscriptions for live updates
- **Auth:** Built-in auth system with token-based authentication
- **API:** Auto-generated REST API for all collections
- **Admin UI:** Available at `/_/` path (restricted access)

## Core Collections

| Collection | Purpose | Estimated Growth Rate |
|------------|---------|----------------------|
| `profiles` | User and agent profiles | Static (22 agents + founders) |
| `conversations` | Chat conversations | ~50-100/day |
| `messages` | Individual messages | ~500-2000/day |
| `agent_memory` | Agent memories (personal + shared) | ~50-200/day |
| `core_context` | Company-wide context entries | Slow (manual updates) |
| `tasks` | Task tracking | ~20-50/day |
| `approval_queue` | Pending approvals | ~5-20/day |
| `failed_writes` | Failed write retry queue | Ideally near 0 |
| `system_health_log` | Kaiser's health check results | 24/day (hourly) |
| `budget_log` | Budget usage history | ~100/day |
| `audit_log` | Security audit trail | ~200-500/day |
| `notifications` | In-app notifications | ~50-100/day |
| `projects` | Project definitions | Static/slow growth |
| `project_kb` | Project knowledge base documents | ~5-20/day |
| `settings` | Platform settings (encrypted) | Rarely changes |

## Database Size Management

**SQLite Characteristics:**
- Single `.db` file plus WAL (Write-Ahead Logging) file
- WAL can grow large during heavy write periods — PocketBase auto-checkpoints
- Vacuum can be run to reclaim space, but causes brief downtime

**Size Monitoring Thresholds:**

| DB Size % of VPS Disk | Status | Action |
|-----------------------|--------|--------|
| 0-50% | Green | No action needed |
| 50-70% | Yellow | Monitor growth rate. Plan for optimization. |
| 70-85% | Orange | Trigger compression notification. Run `VACUUM`. Archive old conversations. |
| 85-95% | Red | Immediate action: archive old data, increase disk, or prune. Alert Founders. |
| 95%+ | Critical | Risk of write failures. Emergency disk expansion needed. |

**Optimization Actions:**
1. Archive old conversations — Move conversations older than 90 days to archive collection (read-only)
2. Compress memories — Trigger Sage to compress old agent memories (>200 entries per agent)
3. Vacuum — Run `VACUUM` during low-traffic hours (3-4 AM IST)
4. WAL checkpoint — Force WAL checkpoint if WAL file grows >100MB
5. Index review — Ensure indexes exist on frequently queried fields (agent_id, created, status, category)

## Query Performance

**Acceptable Thresholds:**

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Avg query response | <100ms | 100-500ms | >500ms |
| Write success rate | >99% | 95-99% | <95% |
| Connection pool usage | <50% | 50-80% | >80% |
| WAL file size | <50MB | 50-100MB | >100MB |

**Common Slow Query Causes:**
- Missing index on filtered/sorted field
- Large result sets without `LIMIT`
- Full-text search on non-indexed fields
- Concurrent write contention (SQLite uses single-writer model)
