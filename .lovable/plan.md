
## Plan: Full Platform Functionality Pass

### Phase 1 — Backend Tables & Storage
- Create missing tables from the document: `audit_log`, `db_health_log`, `message_annotations`, `failed_writes`
- Add `prompt_history` JSON column to agents table (for version tracking)
- Create a storage bucket `chat-attachments` for file uploads in chat
- Add `attachments` JSON column to `messages` table for file references

### Phase 2 — Dark/Light Theme Toggle
- Add a light mode `:root` theme in `index.css` alongside existing dark theme
- Add theme toggle button in the header using `next-themes`
- Ensure all views, cards, dialogs respect the theme

### Phase 3 — Notification Bell (Functional)
- Wire the Bell icon to show a dropdown/popover with real notifications from the `notifications` table
- Show unread count badge
- Mark as read on click

### Phase 4 — Enhanced Chat Box (per reference image)
- Bottom toolbar with: file attach (+), skills (/), connectors, plugins, project selector
- "+" button opens a menu: "Add files or photos", "Skills →", "Connectors →", "Add plugins..."
- Project selector dropdown ("Work in a project")
- Model selector display (e.g. "Sonnet 4.6")
- File upload: create storage bucket, upload files, attach to message

### Phase 5 — Slash (/) and @ Commands
- `/` mid-sentence shows skill picker (role-specific tools from `skills` table)
- `@` mid-sentence shows agent mention picker (enriched with role info)
- Backend: slash-prefixed keywords from skills `trigger_keywords`

### Phase 6 — Agent Edit: KB, Memory & More
- Expand EditAgentDialog to include:
  - KB management (upload/view/delete files from `project_kbs`)
  - Memory viewer/editor (CRUD on `agent_memories`)
  - Prompt history viewer
  - Status toggle, avatar edit

### Phase 7 — Header Layout (per reference image)
- Match the top bar layout from the uploaded screenshot
- Notification popover, theme toggle, profile avatar

This is a lot of work — I'll implement as much as possible in order of priority.
