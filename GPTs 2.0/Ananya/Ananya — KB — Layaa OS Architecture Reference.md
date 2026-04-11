# Ananya — Layaa OS Architecture Reference

**Owner:** Ananya (Personal Assistant for Shubham)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as architecture evolves

---

## System Overview

Layaa OS is a self-hosted multi-agent AI workforce platform. It replaces 10+ SaaS subscriptions with a unified workspace where 22 AI agents collaborate with persistent memory, approval workflows, budget tracking, and real-time coordination.

---

## Frontend Stack

- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React context + local state (no Redux)
- **Real-time:** PocketBase WebSocket subscriptions for live updates
- **Offline:** IndexedDB for local caching, queue-based sync
- **Key Features:**
  - Conversation UI with branching, regeneration, pinning, starring
  - Approval modals (non-blocking)
  - Agent status indicators (idle, thinking, awaiting_approval, error, budget_exhausted)
  - Context window progress bar
  - Collapsible tool call blocks
  - Drag-drop file upload with paste (Ctrl+V) support
  - Command palette for /skills (fuzzy search)
  - Draft auto-save (every 2 seconds)
  - Input history (last 50 messages, up/down arrow navigation)

---

## Backend: PocketBase

- **Engine:** SQLite-based, self-hosted
- **Hosting:** Indian VPS (data residency requirement)
- **Auth:** Built-in authentication system
- **Real-time:** Native WebSocket subscriptions
- **File Storage:** Built-in file handling
- **Admin:** Web-based admin panel

---

## PocketBase Schema (18 Tables)

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `profiles` | User accounts (founders) | name, email, role, preferences |
| `agents` | Agent definitions | name, canonical_role, team, system_prompt, default_model, budget_tokens, status |
| `conversations` | Chat threads | profile_id, agent_id, title, project_id, is_starred |
| `messages` | Individual messages | conversation_id, role, content, model, tokens_in, tokens_out, parent_message_id |
| `agent_memory` | Agent memories | agent_id, memory_type, category, content, confidence, source_conversation_id |
| `core_context` | Company-wide facts | context_key, content, last_updated_by |
| `tasks` | Task tracking | title, description, assigned_agent_id, project_id, status, due_date, requires_approval |
| `projects` | Project definitions | name, description, client_id, status, instructions |
| `project_kb` | Project knowledge base | project_id, filename, content, file_type, chunk_index |
| `skills` | Skill definitions | name, command, description, content, trigger_keywords, associated_agents |
| `plugins` | Plugin context | name, description, domain_references, detection_rules |
| `approval_queue` | Pending approvals | agent_id, tool_name, tool_params, status, profile_id, timeout_at |
| `notifications` | In-app notifications | profile_id, title, body, category, is_read, source_agent_id, action_url |
| `settings` | System settings | key, value (encrypted for API keys) |
| `audit_log` | Audit trail | action, agent_id, profile_id, collection, record_id, details, timestamp |
| `mention_responses` | @mention results | conversation_id, source_agent_id, target_agent_id, message, response |
| `message_versions` | Regeneration history | message_id, version, content, model |
| `conversation_archives` | Compressed old messages | conversation_id, compressed_content, original_message_count |

---

## n8n Workflow Architecture (7 Core Workflows)

| Workflow | Trigger | Function | Key Logic |
|----------|---------|----------|-----------|
| `sage-extraction` | Conversation inactivity (5 min) | Extract memories from conversations | Checks: 4+ messages, 200+ chars. Uses Haiku for extraction. Stores in agent_memory. |
| `approval-handler` | approval_queue record created | Route approvals to users | Creates notification, starts 30-min timer, handles approve/reject/timeout. |
| `delegation` | Agent delegation request | Route agent-to-agent work | Passes context, creates tasks, manages handoff. |
| `response` | Async agent response needed | Generate agent response | Assembles context (8-step loading sequence), calls LLM, streams response. |
| `scheduled-memory` | Cron (daily) | Memory compression and cleanup | Compresses old memories, updates confidence decay, archives stale entries. |
| `budget` | Cron + on-demand | Budget tracking | Tracks token usage, sends warnings at 80%/90%, blocks at 100%, monthly reset. |
| `notifications` | Webhook | Email and system notifications | Sends emails via Resend API, creates in-app notifications. |

---

## Agent Context Loading Sequence (8 Steps)

1. System prompt
2. Core context documents
3. Personal memories (relevance-ranked)
4. Shared memories (relevance-ranked)
5. Project context (if linked)
6. Skill context (if /command used)
7. Conversation history (last 40 messages)
8. Current user message

---

## Memory System

- **Automatic extraction:** Sage triggers after 5-min inactivity (4+ messages, 200+ chars)
- **Categories:** client_info, decision, market_data, process, preference, company, conversation_handoff
- **Types:** personal (agent-only), shared (all agents)
- **Relevance scoring:** word_score * IDF + recency * 0.3 + category_bonus * 0.2 + confidence * 0.1
- **Dynamic confidence:** thumbs up +0.05, thumbs down -0.1, range 0.1-1.0
- **Compression penalty:** compressed memories score * 0.5
