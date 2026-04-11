# Layaa OS — Post-Lovable Roadmap

> What to do after Lovable fixes the critical patches, and what remains beyond that.

---

## Phase 1: Immediately After Lovable Fixes (Day 1)

These become possible once Supabase auth works and RLS passes:

### Verify & Test
- [ ] Sign in with both profiles — confirm Supabase session is valid
- [ ] Click "Seed 88 Skills" in Customize → Skills — confirm all 88 load
- [ ] Create a new conversation with any agent — confirm messages stream
- [ ] Create a task — confirm it saves with priority and shows in Tasks view
- [ ] Create a project — confirm it saves and workspace opens
- [ ] Open a local folder (Chrome) — confirm file tree loads
- [ ] Send a message with @mention — confirm delegation panel opens
- [ ] Run #save command — confirm memories save to Sage
- [ ] Click "Sync Shared" in Sage — confirm platform shared memory generates
- [ ] Check Approvals — confirm pending items load
- [ ] Check Dashboard & Analytics — confirm charts render with data
- [ ] Check CRM Board — confirm Kanban cards load
- [ ] Check Notifications bell — confirm notifications appear
- [ ] Test tier switching (Deep/Sharp/Quick) — confirm model changes in response

### Seed Company Docs
- [ ] Build a quick seed script or manually insert company ref docs into `core_context` table via Supabase SQL Editor
- [ ] Verify agents receive company context in their system prompts

### Deploy Updated Edge Functions
All 16 edge functions were modified in this session. Deploy them:
```bash
supabase functions deploy chat
supabase functions deploy delegate-task
supabase functions deploy sage-extract
supabase functions deploy kaiser-health
supabase functions deploy memory-refresh
supabase functions deploy projects
supabase functions deploy project-chats
supabase functions deploy project-knowledge
supabase functions deploy project-agents
supabase functions deploy work-contexts
supabase functions deploy context-memories
supabase functions deploy escalate-tasks
supabase functions deploy upload-file
supabase functions deploy file-search
supabase functions deploy crm-update
```

---

## Phase 2: UI Improvements (Week 1-2 after Lovable)

These are functional but need UI upgrades based on user feedback:

### Tasks Tab → Notion-Style Table
- Rewrite `TasksView.tsx` as a table/spreadsheet layout
- Columns: Name, Assigned To, Assigned By, Status, Priority, Deadline, Created Date
- Inline editing for status and priority
- Column-level filter dropdowns
- Sort by any column
- Row hover actions (edit, delete, status change)
- The data layer already works (`src/lib/tasks.ts` handles priority, subtasks, deal values)

### Projects Tab → Claude Projects Level
- Prominent drag-drop KB upload area in project details
- Manual memory management (toggle auto-extract per project)
- Rich text instructions editor
- Project activity feed (who did what, when)
- The backend is fully built — just needs UI polish

### CRM Board → Linear/Notion Level
- Better card design (deal value, contact, priority prominently displayed)
- Pipeline stage analytics (total value per column)
- Filters: by agent, by priority, by date range, by deal value range
- Contact detail expansion on click
- Card templates for common deal types

### Shared Tabs — Profile View Switcher
- Add dropdown at top of InsightsView, CRMView, ApprovalsView
- Options: "Layaa AI (all)", "Abhimanyu", "Shubham"
- Filter data by `profile_id` when specific profile selected
- Show combined when "Layaa AI" selected

---

## Phase 3: What Remains Even After Lovable & Phase 2 (Month 1-2)

These are larger architectural changes or external dependencies:

### 1. Real OAuth Connectors
**What exists:** OAuth infrastructure (`src/lib/connectors.ts`), credential storage, 8 connector definitions, connected capabilities injected into agents.
**What's missing:** OAuth callback edge function that handles provider redirects and stores tokens.
**To complete:**
- Create `supabase/functions/auth-callback/index.ts`
- Register OAuth apps with Slack (api.slack.com), Google (console.cloud.google.com), Atlassian (developer.atlassian.com)
- Get client IDs and secrets
- Wire the callback to exchange codes for tokens and store in `credential_vault`
- Build per-connector API wrappers so agents can actually call Slack/Gmail/Calendar APIs
**Effort:** 1-2 days per connector

### 2. Database Migration to Indian VPS
**What exists:** Full platform on Supabase cloud (US/EU region).
**What's needed for DPDP:** Data must reside in India.
**Plan:**
- Provision AWS RDS PostgreSQL in Mumbai
- pg_dump from Supabase, pg_restore to RDS
- Build Express.js API layer replacing Supabase PostgREST
- Rewrite edge functions as Lambda functions or Express routes
- Replace Supabase Auth with Cognito or self-hosted JWT
- Replace Supabase Realtime with Socket.io on EC2
- Replace Supabase Storage with S3
- Swap frontend client imports
**Effort:** 7-10 days focused work
**Cost:** ~$35-45/month on AWS

### 3. Vibe Coding Integration
**What it means:** Lovable/Emergent-style visual app builder within Layaa OS.
**Realistic approach:** Build a "Code Generation" skill where agents write code, create files in project workspace, and user can preview/edit. Not a full drag-and-drop builder.
**What exists already:** write_project_file tool, inline code editor, File System Access API
**To complete:** Build a multi-step agent workflow: describe → generate → review → iterate
**Effort:** 1-2 weeks

### 4. Code Execution Sandbox
**What it means:** Agent writes code AND runs it, sees output, iterates.
**Why it's hard:** Browsers can't run arbitrary code safely. Needs a server-side sandbox.
**Options:**
- WebContainer API (like StackBlitz) — runs Node.js in the browser
- Server-side sandbox via Docker container on AWS
- Integration with Replit/CodeSandbox API
**Effort:** 1-2 weeks depending on approach

### 5. Email Notifications (Resend)
**What exists:** Resend is listed as a connector. No actual API calls.
**To complete:**
- Get Resend API key
- Create edge function for sending emails
- Wire into: approval timeouts, task due dates, Kaiser daily briefing, escalations
- Add email preferences per user
**Effort:** 1 day

### 6. Advanced Task Features
Still missing from the task system:
- Task dependencies (B blocked by A)
- Recurring tasks (daily/weekly/monthly)
- Calendar view for due dates
- Automation rules (when status changes → trigger action)
**Effort:** 3-5 days

### 7. Full Skeleton Loading
Currently only Tasks and Projects have skeleton loading states. Remaining views still show spinners:
- AgentsView, SageView, AnalyticsView, DashboardView, ApprovalsView, CRMView, CustomizeView, DirectMessagesView
**Effort:** 2-3 hours (mechanical — same pattern for each)

### 8. Keyboard Navigation
No keyboard-first navigation beyond Cmd+K search:
- Tab through sidebar items
- Arrow keys through agent cards, task list, approval queue
- Focus trapping in dialogs
- Escape to close panels/dialogs
**Effort:** 1-2 days

### 9. Model Tier Custom Naming
Currently: Deep / Sharp / Quick. Founders may want to rename.
**Effort:** 30 minutes (update `src/lib/model-tiers.ts` constants)

### 10. Vector Embeddings for Memory Search
Current memory retrieval: keyword + confidence scoring.
**Upgrade:** Generate embeddings for each memory, use cosine similarity for semantic search.
**Options:** OpenAI embeddings API, or Supabase pgvector extension
**Effort:** 2-3 days

---

## Phase 4: Long-Term Vision (Quarter 2-3)

### Multi-User Scaling
- Add more team members beyond 2 founders
- Role-based access control (admin, editor, viewer)
- Team-based data scoping
- SSO integration (Google Workspace, Microsoft)
- 2FA/MFA

### Agent Autonomy
- Agents initiate tasks proactively (not just respond)
- Scheduled agent runs (Kabir reviews all projects every Monday at 9am)
- Agent-to-agent autonomous loops without human in the loop
- Agent performance scoring and auto-optimization

### Client-Facing Product
- Multi-tenant architecture for client organizations
- White-label customization
- Client portal with limited agent access
- Usage-based billing per client

### Mobile App
- React Native or PWA with native features
- Push notifications
- Offline-first architecture
- Bottom tab navigation

---

## Priority Order Summary

| Priority | Item | Effort | Blocked by |
|----------|------|--------|-----------|
| **Now** | Lovable patches (auth, RLS, UUIDs) | 30 min | Supabase dashboard access |
| **Now** | Deploy edge functions | 15 min | Supabase CLI |
| **Now** | Seed skills + company docs | 10 min | Auth working |
| **Week 1** | Tasks → Notion table | 1-2 days | Nothing |
| **Week 1** | Projects → Claude level | 1 day | Nothing |
| **Week 1** | CRM → Linear level | 1 day | Nothing |
| **Week 1** | Shared tabs profile switcher | 2-3 hours | Nothing |
| **Week 2** | Real OAuth (Slack, Gmail) | 2-4 days | Provider app registration |
| **Week 2** | Email notifications (Resend) | 1 day | Resend API key |
| **Month 1** | DB migration to AWS Mumbai | 7-10 days | AWS account setup |
| **Month 1** | Code execution sandbox | 1-2 weeks | Architecture decision |
| **Month 2** | Vibe coding integration | 1-2 weeks | Sandbox ready |
| **Quarter 2** | Multi-user scaling | 2-4 weeks | DB migration done |
| **Quarter 2** | Agent autonomy features | 2-3 weeks | Platform stable |

---

*This roadmap should be reviewed and updated after each phase completion.*
