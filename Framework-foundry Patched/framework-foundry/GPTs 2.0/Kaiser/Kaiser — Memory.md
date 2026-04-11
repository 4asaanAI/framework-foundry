# Kaiser — Initial Memory

> These are Kaiser's foundational system memories as of platform launch (April 2026). They represent the infrastructure state Kaiser needs to know from day one.

---

## Platform Launch State

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Layaa OS launched April 2026. Phase 0 (core infrastructure) complete. Phase 1 (agent orchestration) in progress. | company | 1.0 | Platform docs |
| 22 agents operational on the platform. All have system prompts, knowledge bases, and initial memory. | company | 1.0 | Agent Directory |
| Platform is self-hosted on an Indian VPS for data residency compliance (DPDP Act, IT Act 2000). | company | 1.0 | Data Governance |
| Infrastructure budget capped at Rs.500/month. Bootstrap constraints. Every resource must be optimized. | company | 1.0 | Operating Constraints |

---

## Infrastructure Details

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **Database:** PocketBase (SQLite-based, self-hosted). Single-file DB with WAL mode. Real-time WebSocket subscriptions for live updates. Admin UI at `/_/` path. | process | 1.0 | Platform Architecture |
| **Hosting:** Indian VPS. Exact provider and specs to be confirmed after launch. Data must stay within India. | process | 0.9 | Infra config |
| **Orchestration:** Google ADK + WebSockets for real-time agent coordination. n8n for async background workflows. | process | 1.0 | Platform Architecture |
| **LLM Providers:** Claude Sonnet 4.6 (complex reasoning), Claude Haiku 4.5 (fast/cheap). Pluggable providers support OpenAI and Google as fallbacks. API keys encrypted with AES-256 in settings table. | process | 1.0 | Platform Capabilities |
| **Backup Destination:** Backblaze B2 cloud storage. Bucket: `layaa-os-backups`. Organized into daily/, weekly/, monthly/ directories. | process | 1.0 | Backup config |
| **Backup Tool:** rclone (command-line cloud storage sync). Config stored on VPS. | process | 1.0 | Backup config |
| **Frontend:** React + TypeScript. Served from the same VPS. | process | 1.0 | Platform Architecture |
| **Real-time:** PocketBase WebSocket subscriptions for live conversation updates, notifications, and agent status tracking. | process | 1.0 | Platform Capabilities |

---

## n8n Workflow Configuration

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| 7 core n8n workflows power Layaa OS background operations. | process | 1.0 | Platform Capabilities |
| **sage-extraction** — Triggers on conversation inactivity (5 min, min 4 messages, 200+ chars). Calls Haiku to extract facts. | process | 1.0 | Sage's docs |
| **approval-handler** — Processes approval queue items. Routes Tier 2 tool requests to user. Handles 30-min timeout. | process | 1.0 | Platform Capabilities |
| **delegation** — Routes agent-to-agent delegation requests. Handles @mention context passing. | process | 1.0 | Platform Capabilities |
| **response** — Handles async agent response generation (for background tasks, not real-time chat). | process | 1.0 | Platform Capabilities |
| **scheduled-memory** — Periodic memory compression and cleanup. Triggers when agent exceeds ~200 memory entries. | process | 1.0 | Sage's docs |
| **budget** — Budget tracking, warnings, and resets. Kaiser's budget check cron hooks into this. | process | 1.0 | Platform Capabilities |
| **notifications** — Email alerts via Resend API. Triggered by: approval timeouts, budget warnings, daily briefings, failed writes, system health alerts. | process | 1.0 | Platform Capabilities |

---

## Budget Allocations

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **System Budget Pool:** 500,000 tokens/month shared between Kaiser and Sage. Separate from individual agent budgets. | process | 1.0 | Budget System |
| Kaiser should primarily use Haiku 4.5 for routine cron operations to conserve tokens. Only use Sonnet 4.6 for complex diagnostics or detailed conversational responses. | preference | 1.0 | Cost optimization |
| Individual agent budgets are configured per-agent in the settings table. Exact allocations may vary and should be queried from the database. | process | 0.9 | Budget System |
| Budget resets happen on the 1st of every month at 12:01 AM IST. Kaiser is responsible for executing this. | process | 1.0 | Cron Schedule |
| Budget_loaned allows agents to borrow tokens from other agents. This is rare and typically done manually by Founders via admin panel. | process | 0.8 | Budget System |

---

## Backup Schedule

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **Daily backup:** 3:00 AM IST. PocketBase .zip → Backblaze B2 via rclone. | process | 1.0 | Cron Schedule |
| **Retention:** Daily copies kept 30 days. Sunday copies kept 12 weeks. 1st-of-month copies kept 12 months. | process | 1.0 | Backup procedures |
| **Verification:** After each backup, verify file exists on B2 and size is within 20% of previous backup. | process | 1.0 | Backup procedures |
| **Failure protocol:** Retry once after 15 minutes. If retry fails: email alert, task creation, log CRITICAL. | process | 1.0 | Error handling |
| No backup has been run yet as of system launch. First backup will be the next 3:00 AM IST after launch. | company | 1.0 | Launch state |

---

## Known Issues at Launch

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| This is a fresh platform launch. No historical performance data exists. First few days of health checks will establish baselines. | process | 1.0 | Launch state |
| Database size baseline not yet established. First health check will set the initial reference point. | process | 1.0 | Launch state |
| Budget usage patterns not yet known. First month of operation will reveal which agents are heavy/light consumers. | process | 1.0 | Launch state |
| rclone configuration needs to be verified on first backup run. B2 credentials and bucket access should be tested. | process | 0.9 | Launch prep |
| Health check scoring system will need calibration after first week of operation. Thresholds may need adjustment based on actual VPS specs. | process | 0.8 | Launch prep |

---

## System Configuration

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **CORS Policy:** Only `https://os.layaa.ai` is allowed origin for API requests. | process | 1.0 | Security config |
| **Rate Limiting:** 10 requests/minute per profile. Platform-enforced. | process | 1.0 | Security config |
| **Auth:** PocketBase built-in auth. All API calls require valid auth token. | process | 1.0 | Security config |
| **Encryption:** AES-256 for LLM API keys in settings table. HTTPS for all traffic. | process | 1.0 | Security config |
| **Audit Logging:** Every significant action logged to audit_log collection. Kaiser can query this for anomaly detection. | process | 1.0 | Security config |
| **Offline Mode:** Platform supports offline operation. Messages queue locally in IndexedDB. Sync within 30 seconds of reconnect. Failed writes during offline period will appear in Kaiser's retry queue. | process | 1.0 | Platform Capabilities |

---

## Cron Job Reference (Quick Access)

| Job | Time | Frequency | Collection/Tool |
|-----|------|-----------|----------------|
| DB Health Check | :00 | Hourly | checkDatabaseHealth() → system_health_log |
| Retry Failed Writes | :15 | Hourly | retryFailedWrites() → failed_writes |
| Budget Warnings | :30 | Hourly | sendBudgetWarnings() → profiles, notifications |
| Model Update Check | 6:00 AM | Daily | checkModelUpdates() → tasks |
| Daily Briefing | 8:00 AM | Daily | generateDailyBriefing() → pass_context to Kabir |
| Task Reminders | 9:00 AM | Daily | checkTaskReminders() → notifications |
| Daily Backup | 3:00 AM | Daily | runDailyBackup() → B2 |
| Budget Reset | 12:01 AM, 1st | Monthly | resetMonthlyBudget() → profiles |
| Period Start Update | 12:01 AM, 1st | Monthly | updateBudgetPeriodStart() → profiles |

All times are IST (Indian Standard Time, UTC+5:30).

---

## Agent Roster (For Status Tracking)

| Agent | Role | Department |
|-------|------|-----------|
| Kabir | Executive Strategy Orchestrator | Executive |
| Kshitiz | Master Research & Data Analyst | Research |
| Mira | Marketing Strategist | Marketing & Growth |
| Tara | Brand Voice & Content Architect | Marketing & Growth |
| Zoya | Performance Marketing & Growth Architect | Marketing & Growth |
| Nia | Campaign & Funnel Execution Coordinator | Marketing & Growth |
| Rishi | Revenue Operations Strategist | Revenue & Finance |
| Yuvaan | Sales Enablement Specialist | Revenue & Finance |
| Veer | Pricing & Unit Economics Specialist | Revenue & Finance |
| Anne | Chartered Compliance Assistant | Revenue & Finance |
| Aarav | Finance & Accounts Executive | Revenue & Finance |
| Abhay | Legal & Contracts Advisor | Legal & Governance |
| Preeti | Regulatory Compliance & Data Governance Advisor | Legal & Governance |
| Rohit | QA & Validation Specialist | Client Delivery |
| Ujjawal | Automation Architect | Client Delivery |
| Arjun | Client Strategy & Discovery Specialist | Client Delivery |
| Arush | Documentation & Enablement Specialist | Client Delivery |
| Dev | Internal Product Manager | Client Delivery |
| Kaiser | System Administrator Agent | System |
| Sage | Memory & Context Keeper | System |
| Arya | Personal Assistant for Abhimanyu | Personal |
| Ananya | Personal Assistant for Shubham | Personal |

---

*These memories represent Kaiser's initial knowledge state. As the system operates, Kaiser will accumulate performance baselines, learn failure patterns, and optimize monitoring thresholds. First week of operation is critical for establishing baselines.*
