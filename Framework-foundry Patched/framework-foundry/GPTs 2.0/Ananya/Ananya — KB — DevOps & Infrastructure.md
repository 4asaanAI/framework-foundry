# Ananya — DevOps & Infrastructure

**Owner:** Ananya (Personal Assistant for Shubham)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as infrastructure evolves

---

## Infrastructure Setup

- **VPS Provider:** Indian hosting provider (data residency requirement)
- **Budget:** <Rs.500/month total infrastructure cost
- **Components on VPS:** PocketBase, n8n, React frontend (static build), any custom APIs

---

## Backup Strategy

- **Schedule:** Daily at 3 AM IST
- **Method:** rclone sync to Backblaze B2
- **Scope:** PocketBase database file, n8n workflow exports, uploaded files
- **Retention:** [To be documented based on Shubham's policy]
- **Recovery procedure:** Download from B2, restore PocketBase data file, reimport n8n workflows

---

## Deployment Process

- **Current approach:** Manual deployment to VPS (SSH + build + restart)
- **Build:** `npm run build` for React frontend, PocketBase binary update for backend
- **Rollback:** Keep previous build artifacts, restore from backup if needed
- **Zero-downtime:** Not yet implemented (acceptable at current scale)

---

## Infrastructure Monitoring Checklist

### Daily Checks
- [ ] PocketBase health (admin panel responsive, queries executing normally)
- [ ] n8n dashboard (all 7 core workflows: last execution status)
- [ ] VPS resource usage (disk, memory, CPU)
- [ ] Backup verification (today's backup exists on Backblaze B2)
- [ ] Agent budget consumption (any agent above 80%?)
- [ ] Error logs (any 500s or unexpected errors in last 24 hours?)

### Weekly Checks
- [ ] PocketBase database size (growth trend)
- [ ] n8n workflow execution history (error rate over the week)
- [ ] WebSocket connection stability
- [ ] Memory system health (are memories being extracted correctly by Sage?)
- [ ] Token budget usage trend (are we on track for the month?)

### Monthly Checks
- [ ] VPS cost review (still under Rs.500?)
- [ ] Backblaze B2 storage growth (cost implications)
- [ ] Security: any unusual access patterns in audit_log?
- [ ] PocketBase version check (any security updates?)
- [ ] n8n version check (any important updates?)
- [ ] SSL certificate expiry check

---

## Monitoring Quick Reference

| Check | Frequency | How | Red Flag |
|-------|-----------|-----|----------|
| VPS disk usage | Daily | SSH check or monitoring agent | >80% |
| PocketBase responsiveness | Daily | Health endpoint ping | >2s response |
| n8n workflow execution | Daily | n8n execution history | Any failed core workflow |
| Backup completion | Daily | Backblaze B2 file listing | Missing today's backup |
| WebSocket connections | Weekly | Connection count in PocketBase | Unexpected disconnects |
| LLM API errors | Daily | n8n execution logs | >5% error rate |
| Budget consumption | Daily | Budget system check | Any agent above 80% |
