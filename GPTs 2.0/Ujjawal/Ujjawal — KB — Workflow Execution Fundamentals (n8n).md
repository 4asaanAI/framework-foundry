# Ujjawal — KB — Workflow Execution Fundamentals (n8n)

> Core mental model for n8n workflow design, node categories, credentials management, and the translation process from discovery output to architecture.

---

## How n8n Works (Core Concepts)

**Workflow = Directed Acyclic Graph (DAG)**
Every n8n workflow is a series of nodes connected in a directed graph. Data flows forward through the graph — never backward.

**Node = Single Operation**
Each node does one thing: receive data, process it, and pass it forward. Nodes are the atomic unit of your workflow.

**Item = Unit of Data**
n8n processes data as "items" — each item is a JSON object. A node receives items, processes them (possibly creating more items), and outputs items.

**Execution = One Complete Run**
When a trigger fires, n8n creates an execution. The execution passes through all nodes until it reaches a terminal node or encounters an unhandled error.

**Key Behaviors to Design Around:**
- n8n processes items sequentially by default (not parallel)
- Each node receives ALL items from the previous node as an array
- Nodes can output more items than they receive (e.g., splitting a list)
- Nodes can output fewer items (e.g., filtering)
- Error in any node stops the execution unless error handling is configured
- Webhooks have a 30-second timeout for synchronous responses

---

## Node Categories You'll Use Most

| Category | Common Nodes | When to Use |
|----------|-------------|-------------|
| **Triggers** | Webhook, Schedule, PocketBase Trigger, Email Trigger | Starting workflows |
| **HTTP** | HTTP Request, Webhook Response | Calling external APIs, responding to webhooks |
| **Data** | Set, Function, Merge, Split, Filter, Sort | Transforming and routing data |
| **Database** | PocketBase, PostgreSQL, MongoDB | Reading/writing persistent data |
| **Communication** | Email Send, Slack, WhatsApp (via HTTP) | Sending notifications |
| **Logic** | IF, Switch, Loop | Branching and iteration |
| **AI** | HTTP Request to Relevance AI / Claude API | AI processing steps |
| **Utility** | Wait, No-Op, Error Trigger | Flow control and error handling |

---

## Credentials Management in n8n

- All API keys, tokens, and secrets are stored in n8n's encrypted credential store
- Never hardcode credentials in node configurations
- Reference credentials by name, not by value, in architecture docs
- Builder creates the credential once; n8n handles injection at runtime
- Credential types: API Key (header/query), Bearer Token, OAuth2, Basic Auth, Custom

---

## Translating Discovery Output into Architecture

### Step-by-Step Translation Process

**Step 1: Read the Full Handover**
Read all 9 sections of Rohit's discovery document. Pay special attention to:
- Section 2 (Tools & Systems) — what APIs are available
- Section 4 (Feasible Opportunities) — what to design
- Section 6 (Risks & Constraints) — what to design around
- Section 7 (Missing Info) — what blockers exist

**Step 2: Identify Discrete Workflows**
Each feasible opportunity may need 1 or more workflows. Split them:
- One trigger = one workflow (usually)
- If a single business process has multiple triggers (manual + scheduled + event-driven), design separate workflows that share utility sub-workflows

**Step 3: Map the Data Flow**
For each workflow, trace the data:
```
Source (where data originates)
  → Entry (how it enters the workflow)
    → Transform (how it changes)
      → Process (what logic applies)
        → Store (where it persists)
          → Output (what the user/system sees)
```

**Step 4: Identify Integration Points**
For each external system:
- Does it have an API? REST or GraphQL?
- What authentication does it use?
- Are there rate limits? What are they?
- What data format does it use? (JSON, XML, CSV, form-data)
- What happens when it's down? (Retry? Queue? Skip?)

**Step 5: Design Error Handling**
For each node that can fail:
- What types of failure? (Timeout, auth failure, bad data, rate limit, server error)
- What's the retry strategy? (Immediate, exponential backoff, fixed delay)
- What's the fallback? (Alternative service, manual queue, notification)
- Who gets notified? (System admin, client admin, Layaa AI team)

**Step 6: Define the Data Schemas**
For each workflow:
- Trigger payload schema (what data arrives)
- Internal state schema (what data exists mid-workflow)
- Output schema (what data leaves)
- Error schema (what the error payload looks like)

**Step 7: Write the Builder Spec**
Apply the 7-Stage methodology to produce the builder-ready document.

---

## n8n Node Reference (Most Used)

### Trigger Nodes
| Node | Trigger Type | Key Config |
|------|-------------|------------|
| **Webhook** | HTTP request | Method, path, auth, response mode |
| **Schedule Trigger** | Cron/interval | Cron expression or interval |
| **PocketBase Trigger** | Database event | Collection, event type (create/update/delete) |
| **Email Trigger (IMAP)** | New email | Mailbox, filter criteria |

### Processing Nodes
| Node | Purpose | Key Config |
|------|---------|------------|
| **Set** | Set/modify field values | Field assignments |
| **Function** | Custom JavaScript logic | JS code with access to items |
| **IF** | Conditional branching | Condition expression |
| **Switch** | Multi-way branching | Multiple conditions |
| **Merge** | Combine data from branches | Merge by position, key, or append |
| **Split Out** | Split array into individual items | Field containing array |
| **Filter** | Remove items matching condition | Filter expression |
| **Sort** | Order items | Sort field and direction |
| **Loop Over Items** | Process items in batches | Batch size |
| **Wait** | Pause execution | Duration or webhook resume |

### External Nodes
| Node | Purpose | Key Config |
|------|---------|------------|
| **HTTP Request** | Call any REST API | URL, method, auth, body, headers |
| **PocketBase** | CRUD on PocketBase | Collection, operation, filter |
| **Send Email** | SMTP email | To, subject, body, attachments |
| **Slack** | Slack messages | Channel, message, blocks |

### Utility Nodes
| Node | Purpose | Key Config |
|------|---------|------------|
| **No Operation** | Placeholder/passthrough | None |
| **Error Trigger** | Catches workflow errors | Linked to error workflow |
| **Execute Workflow** | Call another workflow | Workflow ID, input data |
| **Respond to Webhook** | Send webhook response | Status code, body |

---

*This document is part of Ujjawal's technical knowledge base. Update as n8n capabilities evolve and new patterns emerge.*
