
## What's currently non-functional (and what we'll fix)

### 1. **Token Transfer Between Agents** (New feature)
- Add a "Transfer Tokens" button on each agent card
- Dialog to select source agent → target agent + amount
- Updates `budget_used` / `budget_tokens` in the database

### 2. **Settings View — Make all 6 sections functional**
- **LLM Providers**: Form to configure provider name, API key reference, default model — stored in a `connectors` table (type = `llm_provider`)
- **Credential Vault**: List secrets by name (we can't store actual keys client-side, but we can track key names + status in `connectors` type = `credential`)
- **Database**: Show current connection status (read-only info panel)
- **Webhooks**: CRUD for webhook URLs stored in `connectors` (type = `webhook`)
- **Connectors & MCP**: CRUD for MCP servers stored in `connectors` table
- **Security**: Read-only security checklist/status panel

### 3. **Chat View — Make functional**
- Wire send button to create a conversation + insert messages in DB
- Display real messages from DB for selected conversation
- Conversation list in sidebar from DB

### 4. **Projects View — Make "New Project" work**
- Dialog to create a new project (name, description, instructions)
- Assign agents to project via `project_agents` table

### 5. **Tasks View — Make task creation work**
- "New Task" button + dialog (title, description, assign agent, due date)
- Status update buttons on each task

### 6. **Agents View — Agent detail/edit**
- Click agent card → detail panel or dialog to edit prompt, model, budget
- Token transfer button here too

### 7. **Sidebar — Use DB agents instead of mock**
- Pull agents from `useAgents()` hook instead of `MOCK_AGENTS`

---

**Recommended approach**: Tackle in this order — Settings → Token Transfer → Projects CRUD → Tasks CRUD → Chat wiring → Sidebar DB agents. Each step makes a visible section functional.
