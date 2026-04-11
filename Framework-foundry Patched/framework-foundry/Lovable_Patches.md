# Layaa OS — Lovable Platform Patches Required

> These items need to be applied via the Lovable platform (https://lovable.dev) or directly in the Supabase dashboard because they require database-level changes or Supabase Auth modifications that cannot be done from code alone.

---

## CRITICAL — Must Fix Before Platform Is Usable

### 1. Supabase Auth — Delete Old Users & Re-create with New Emails

**Problem:** Users `abhimanyu@layaa.local` and `shubham@layaa.local` exist in Supabase Auth with unknown passwords (created by Lovable). The code now uses `abhimanyu.singh@layaa.ai` and `shubham.sharma@layaa.ai`. Sign-in fails because the old accounts have passwords we can't derive.

**Fix (Supabase Dashboard):**
1. Go to Authentication → Users
2. Delete users: `abhimanyu@layaa.local` , `shubham@layaa.local`
3. Refresh Layaa OS — it will auto-create new accounts with the correct emails
4. Alternatively: create users manually with emails `abhimanyu.singh@layaa.ai` and `shubham.sharma@layaa.ai` having the names, roles and authorities same as before respectively

**Impact if not fixed:** Login works via local session bypass, but ALL Supabase queries that depend on `auth.uid()` for RLS will fail — meaning conversations, messages, tasks, approvals, memories, and skills won't load from the database.

---

### 2. MOCK_AGENTS Use String IDs — Database Expects UUIDs

**Problem:** `src/constants/agents.ts` defines agents with string IDs like `"kabir"`, `"mira"`, `"arya"`. The Supabase `agents` table uses UUID primary keys. When the platform falls back to MOCK_AGENTS (because the agents query returns empty due to RLS), any database operation (create conversation, assign task, etc.) fails with `invalid input syntax for type uuid: "kabir"`.

**Fix (Lovable Platform or Supabase Dashboard):**
- Option A: Ensure the `agents` table in Supabase is seeded with all 22 agents (with real UUIDs). The frontend will then use DB agents instead of mocks.
- Option B: Update MOCK_AGENTS in `src/constants/agents.ts` to use valid UUIDs that match the agents in the database.
- Option C: Disable RLS on the `agents` table so the anon key can read agents without auth.

**Impact if not fixed:** Clicking any agent for a new conversation shows "invalid input syntax for type uuid" error. No conversations can be created.

---

### 3. RLS Blocking Data Queries for Local Session Users

**Problem:** The local session bypass (needed because Supabase auth fails) means `auth.uid()` returns null for all RLS policies. Every table with RLS enabled returns empty results or blocks inserts.

**Tables affected:** agents, conversations, messages, tasks, approvals, skills, agent_memories, notifications, projects, project_agents, token_usage_log, audit_log, settings, credential_vault, connectors, plugins, direct_messages, escalations, core_context, work_contexts, context_memories

**Fix (Supabase Dashboard):**
- Option A (recommended): Fix Supabase Auth (item #1 above) so users have valid sessions and RLS works correctly
- Option B (temporary): Disable RLS on all tables from Table Editor → each table → RLS toggle off
- Option C: Add a permissive RLS policy to each table: `CREATE POLICY "allow_anon" ON table_name FOR ALL USING (true);`

**Impact if not fixed:** Platform UI loads and navigation works, but all data is empty — no agents, no conversations, no tasks, no skills, no memories.

---

## HIGH PRIORITY — Functionality Completion

### 4. Skills Table — Seed 88 Skills

**Problem:** The skills table is empty (Skills: 0 shown in Customize tab). The "Seed 88 Skills" button exists but fails due to RLS blocking inserts.

**Fix:** After fixing auth (item #1) or RLS (item #3), click the "Seed 88 Skills" button in Customize → Skills tab. It will insert all 88 skill definitions.

**Alternative:** Run this in Supabase SQL Editor:
```sql
-- Disable RLS temporarily
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
-- Then click "Seed 88 Skills" button in the UI
-- Re-enable after seeding
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
```

---

### 5. New Conversation Dialog — UUID Mismatch

**Problem:** `NewConversationDialog` tries to insert a conversation with `agent_id` from the agent list. If using MOCK_AGENTS (string IDs), the insert fails. If using DB agents (UUIDs), it works.

**Fix:** Dependent on item #2 — once agents table has real data, this works automatically.

---

### 6. Fork/Branch Feature — Requires Valid Conversation

**Problem:** The branch/fork feature on messages creates a new conversation with `branch_parent_id` pointing to the current conversation. With no valid conversations (due to auth/RLS issues), there's nothing to fork.

**Fix:** Dependent on items #1 and #3 — once conversations can be created, forking works.

---

### 7. Direct Messages Tab — Requires Both Users Authenticated

**Problem:** DMs require both user profiles to exist in Supabase Auth with valid sessions. Currently broken because auth is bypassed.

**Fix:** Dependent on item #1.

---

## MEDIUM PRIORITY — UI/Feature Improvements

### 8. Tasks Tab — Upgrade to Notion-Style Table Layout

**Status:** Currently displays as a list. User requested Notion-style table with columns: Assigned To, Assigned By, Status, Name, Priority, Deadline, Date of Creation.

**What needs to be done:**
- Rewrite `TasksView.tsx` as a table/spreadsheet layout
- Add column headers with sort on each column
- Add inline editing for status and priority
- Add filter dropdowns per column
- The data layer (priority, subtasks, etc.) is already built in `src/lib/tasks.ts`

---

### 9. Projects Tab — Upgrade to Claude Projects Level

**Status:** Basic project cards with create/edit. User wants Claude-style project experience.

**What needs to be done:**
- Prominent KB upload area in project details (drag-drop, multi-file)
- Manual memory management per project (toggle auto-extract on/off)
- Project instructions editor (rich text)
- The backend is fully built (`src/lib/projects.ts`, `ProjectWorkspaceView.tsx`, all edge function tools)
- Blocked by auth/RLS for actual data operations

---

### 10. CRM Board — Upgrade to Linear/Notion Level

**Status:** Basic Kanban with drag-drop. User wants Linear/Notion-level features.

**What needs to be done:**
- Better card design with deal value, contact, priority prominently displayed
- Pipeline stage analytics (total value per stage)
- Filters: by agent, by priority, by date range
- The data layer (deal values, contacts) is already built in `src/lib/tasks.ts`

---

### 11. Shared Tabs — Profile View Switcher

**Status:** Dashboard & Analytics, CRM Board, and Approvals should show combined view with a dropdown to switch between: "Layaa AI (all)", "Abhimanyu", "Shubham".

**What needs to be done:**
- Add a dropdown at the top of InsightsView, CRMView, and ApprovalsView
- Filter data by profile_id when a specific profile is selected
- Show combined (no filter) when "Layaa AI" is selected

---

## LOW PRIORITY — Polish

### 12. OAuth Connector Callbacks

**Status:** OAuth infrastructure built (`src/lib/connectors.ts`) but no callback edge function exists.

**What needs to be done:**
- Create `supabase/functions/auth-callback/index.ts` that handles OAuth redirects
- Register OAuth apps with Slack, Google, Atlassian to get client IDs
- Wire the callback to store tokens in credential_vault

---

### 13. Company Docs Seeding into core_context

**Status:** `seedCompanyDoc()` function exists but no UI to trigger it. Company ref docs are in the repo but not in the database.

**What needs to be done:**
- Add a "Seed Company Docs" button in Settings
- Or build a script that reads files from `Company ref docs/` and calls `seedCompanyDoc()` for each

---

### 14. Database Migration to Indian VPS

**Status:** Parked. Supabase is current backend. Migration planned to AWS Mumbai for DPDP compliance.

**Estimated effort:** 7-10 days (see detailed plan in chat history)

---

### 15. Vibe Coding Integration

**Status:** Parked. Lovable/Emergent-style visual builder on Layaa OS.

**What's realistic:** Build a code generation skill that agents use — describe a feature, agent writes code, creates files in project workspace.

---

## Quick Reference — What Works Right Now (Without Fixes)

| Feature | Status |
|---------|--------|
| Profile picker with photos | Works |
| Sidebar navigation | Works |
| All view UIs render | Works |
| Theme toggle (dark/light) | Works |
| Focus mode (Ctrl+Shift+F) | Works |
| Compact mode | Works |
| Cmd+K global search UI | Works |
| Settings UI (all sections) | Works |
| Chat input (type, expand) | Works |
| Tier selector UI | Works |
| Extended thinking toggle | Works |
| File System Access (Open Folder) | Works (Chrome/Edge) |

| Feature | Blocked By |
|---------|-----------|
| Creating conversations | Auth/RLS + UUID mismatch |
| Sending messages to agents | Auth/RLS |
| Loading tasks/projects/approvals | Auth/RLS |
| Skills seeding and /command | Auth/RLS |
| Memory extraction/synthesis | Auth/RLS |
| Notifications loading | Auth/RLS |
| Direct messages | Auth (both users needed) |
| Agent delegation | Auth/RLS |

---

*Fix items #1 and #3 first — that unblocks 90% of the platform.*
