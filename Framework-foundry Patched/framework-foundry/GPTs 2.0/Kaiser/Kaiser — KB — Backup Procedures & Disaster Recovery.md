# Kaiser — KB — Backup Procedures & Disaster Recovery

## Backup Architecture

```
PocketBase Server (Indian VPS)
  ↓ PocketBase built-in backup (creates .zip)
  ↓ rclone copy
Backblaze B2 (Cloud Storage)
  ├── daily/    ← Last 30 days
  ├── weekly/   ← Last 12 weeks (Sunday copies)
  └── monthly/  ← Last 12 months (1st of month copies)
```

## Daily Backup Procedure (3:00 AM IST)

1. **Trigger PocketBase Backup**
   ```
   POST /_/api/backups
   → Creates timestamped .zip of: pb_data/database.db + pb_data/storage/ (uploads)
   → Stored locally at pb_data/backups/
   ```

2. **Upload to Backblaze B2**
   ```
   rclone copy /path/to/pb_data/backups/ b2:layaa-os-backups/daily/ \
     --transfers 4 --checkers 8 \
     --log-file /var/log/rclone-backup.log --log-level INFO
   ```

3. **Verify Upload**
   ```
   rclone check /path/to/pb_data/backups/ b2:layaa-os-backups/daily/ --one-way
   → Verify file exists, size matches
   ```

4. **Integrity Check** — Compare file size to previous backup (within +/- 20%). If >50% difference: log warning.

5. **Cleanup Local** — Keep last 3 local backup files. Delete older.

6. **Rotation on B2:**
   - Daily: Keep 30 days, delete older
   - Sunday: copy to `weekly/` (keep 12 weeks)
   - 1st of month: copy to `monthly/` (keep 12 months)

## Backup Failure Handling

| Failure Type | Retry? | Alert Level | Action |
|-------------|--------|-------------|--------|
| PocketBase backup creation fails | Yes, once after 15 min | CRITICAL | Could indicate disk issue or DB lock |
| rclone upload fails (network) | Yes, once after 15 min | WARNING → CRITICAL if retry fails | Transient network issue |
| Integrity check fails (size mismatch) | No | WARNING | Investigate; could be data corruption |
| B2 authentication fails | No | CRITICAL | API key may have expired; alert Founders |

## Disaster Recovery

**If PocketBase DB is corrupted:**
1. Stop PocketBase server
2. Download latest verified backup from B2: `rclone copy b2:layaa-os-backups/daily/latest.zip /restore/`
3. Unzip and replace `pb_data/`
4. Restart PocketBase
5. Verify data integrity
6. Log incident and data loss window

**RTO:** <1 hour (manual process) | **RPO:** <24 hours (daily backups)

## rclone Configuration

```
[b2]
type = b2
account = {B2_ACCOUNT_ID}  # Stored encrypted in settings
key = {B2_APPLICATION_KEY}  # Stored encrypted in settings
```

**Bandwidth & Cost:** B2 offers 10GB free storage. Current estimate: ~50-100MB/day, ~1.5-3GB/month. Cost negligible at current scale.
