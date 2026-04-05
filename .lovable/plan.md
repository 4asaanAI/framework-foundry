
## Phase 1: Edit Dialogs (Projects & Tasks)
1. **EditProjectDialog** — Edit name, description, instructions, KB file upload, manage assigned agents
2. **EditTaskDialog** — Edit title, description, status, due date, assigned agent

## Phase 2: Key Platform Capabilities (from spec)
3. **Built-in /commands** — `/clear`, `/new`, `/export`, `/budget`, `/status`, `/help` as hard-coded commands in chat
4. **Approval gate improvements** — Add approval insert policy, wire approval flow for tier-2 actions
5. **Budget enforcement** — Check budget before sending, show exhaustion banner, system budget pool in settings
6. **Message features** — Rating (thumbs up/down), pinning, starring conversations
7. **Context window indicator** — Progress bar showing context usage in chat header
8. **Draft auto-save** — Save input to localStorage, restore on reload
9. **Input history** — Up/down arrow to cycle previous messages
10. **Conversation export** — Export as markdown/HTML download

## Phase 3: Database additions needed
- `message_archives` table for conversation truncation
- `message_annotations` table for comments
- `drafts` table for draft persistence
- Add `is_trusted_recurring` to tasks
- Add `budget_period_start` to agents
- System budget settings seeding
