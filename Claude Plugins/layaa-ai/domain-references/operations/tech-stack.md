# Technology Stack Reference

Platforms, tools, infrastructure, and selection criteria used by Layaa AI for client automation engagements.

---

## Primary Platforms

### n8n (Self-Hosted)
Primary workflow automation platform for complex multi-step automations.
- Full control over execution environment and data
- No per-operation cost (self-hosted licensing)
- Extensive node library with 200+ integrations
- Custom code execution via Function and Code nodes
- Sub-workflow support for modular, reusable components
- Built-in error handling workflows and retry logic
- Credential store for secure API key management
- Best for: complex workflows, high-volume processing, data-sensitive operations

### Make (Integromat)
Secondary platform for mid-complexity integrations.
- Visual workflow builder with strong connector ecosystem
- Good balance of power and ease of use
- Built-in error handling and data routing
- Scenarios can be cloned and templated
- Best for: integrations with well-supported SaaS platforms, moderate complexity workflows

### Zapier
Client-facing platform for simple automations.
- Lowest technical barrier for end users
- Large app directory with pre-built triggers and actions
- Client can self-manage after initial setup
- Limited complexity support (linear workflows, basic branching)
- Best for: simple 2-3 step automations that clients want to own and modify

### Relevance AI
AI agent platform for conversational AI and intelligent document processing.
- Agent builder with knowledge base integration
- Document ingestion and semantic search
- Tool/function calling for agent-driven workflows
- Multi-agent orchestration capability
- Best for: AI-powered chatbots, document Q&A, classification, extraction tasks

### Bolt AI
Rapid prototyping platform for AI-powered applications.
- Fast scaffolding of AI application frontends and backends
- Useful for proof-of-concept and MVP builds
- Best for: when a standalone AI application is needed beyond workflow automation

---

## AI and ML Tools

### Claude API (Anthropic)
Primary large language model for text generation, analysis, and extraction.
- Strong reasoning and instruction-following capabilities
- Long context window for document processing
- Used for: content generation, data extraction from unstructured text, classification, summarization, analysis

### OpenAI API
Secondary LLM and embedding generation.
- GPT models for text tasks where OpenAI-specific features are needed
- Embedding models (text-embedding-ada-002, text-embedding-3-small) for semantic search and similarity
- DALL-E for image generation when required
- Used for: embeddings, specific client requirements, image generation

### Custom Models
Deployed when off-the-shelf models do not meet accuracy, latency, or cost requirements.
- Fine-tuned models for domain-specific classification
- Lightweight models for high-volume, low-latency tasks
- On-premise deployment for data-sensitive clients

---

## Infrastructure

### Cloud Providers
- **AWS:** Primary cloud provider. EC2 for compute, S3 for storage, RDS for managed databases, Lambda for serverless functions.
- **GCP:** Secondary provider, used based on client preference. Compute Engine, Cloud Storage, Cloud SQL.
- Provider selection is driven by client's existing infrastructure and compliance requirements.

### Databases
- **PostgreSQL:** Primary relational database. Used for structured data, transactional workflows, reporting. Reliable, well-supported, strong query capabilities.
- **MongoDB:** Document store for semi-structured and unstructured data. Used when schema flexibility is needed or data is naturally document-shaped.
- **Redis:** In-memory caching and session storage. Used for rate limiting, temporary state management, queue processing, and performance optimization.

### Storage
- **S3-compatible object storage:** Primary file storage for documents, exports, backups. Structured naming: `{client}/{date}/{type}/{filename}`. Lifecycle policies for retention and archival.

### Monitoring
- **Uptime monitoring:** Track availability of all deployed automations and integrations
- **Error alerting:** Real-time notifications for workflow failures via email, Slack, or webhook
- **Performance dashboards:** Execution times, success rates, throughput metrics, API quota usage
- **Log aggregation:** Centralized logging for debugging and audit compliance

---

## Integration Methods

### REST APIs
Most common integration method. Used when the target system provides a documented HTTP API.
- Supports all standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Authentication via API key, OAuth 2.0, Bearer token, or Basic Auth
- JSON is the default data format; XML supported where required
- Pagination and rate limiting handled at the workflow level

### Webhooks
Event-driven integration for real-time processing.
- Target system sends HTTP POST to a registered endpoint when events occur
- Payload validation via HMAC signatures or shared secrets
- Idempotency handling via event IDs to prevent duplicate processing
- Used when near-instant response to external events is required

### Database Direct Connections
Used when API access is unavailable or insufficient.
- Direct SQL queries against client databases (read-only preferred)
- Connection via secure tunnel (SSH, VPN) for on-premise databases
- Parameterized queries to prevent SQL injection
- Connection pooling for performance

### File-Based Integration
Used for batch processing and legacy system integration.
- SFTP for secure file transfer
- S3 for cloud-based file exchange
- Support for CSV, JSON, XML, Excel, and PDF formats
- File watching or scheduled polling for new file detection

### Email Parsing
Used when email is the only available integration point.
- Monitor inbox for specific message patterns
- Parse structured data from email body or attachments
- Extract and process attachments (PDF, CSV, Excel)
- Used sparingly due to fragility; API integration preferred when available

---

## Tool Selection Guide

| Scenario | Recommended Tool | Reason |
|----------|-----------------|--------|
| Simple 2-3 step automation | Zapier or Make | Quick setup, client can manage independently |
| Complex multi-step workflow | n8n | Full control, self-hosted, no per-operation cost, advanced error handling |
| AI-powered document processing | Relevance AI + n8n | AI agent for extraction/classification, n8n for downstream workflow |
| Client-facing chatbot or Q&A | Relevance AI | Purpose-built for conversational AI with knowledge base integration |
| Custom AI application | Bolt AI + custom code | When no-code platforms are insufficient for the user experience required |
| Data pipeline or ETL | n8n + PostgreSQL | Reliable scheduling, transformation nodes, database write support |
| High-volume batch processing | n8n (self-hosted) | No per-operation cost, full control over execution timing and resources |
| Real-time event processing | n8n with webhook trigger | Sub-second response times, reliable webhook handling |
| Client self-service automation | Zapier | Lowest learning curve, client can modify without technical support |
| Multi-system integration (5+ systems) | n8n | Sub-workflow support, credential management, complex branching |

### Decision Factors

When selecting tools for a client engagement, evaluate:

1. **Complexity:** How many steps, branches, and integrations are involved?
2. **Volume:** How many executions per day/hour? High volume favors n8n (no per-operation cost).
3. **Client capability:** Can the client manage the tool? Zapier for self-service, n8n for managed service.
4. **Data sensitivity:** Does data need to stay within controlled infrastructure? n8n self-hosted for maximum control.
5. **AI requirements:** Does the automation require LLM processing? Relevance AI for agent-based, direct API calls via n8n for simpler AI tasks.
6. **Budget:** Zapier/Make have recurring per-operation costs. n8n self-hosted has infrastructure cost but no per-operation fees.
7. **Timeline:** Zapier/Make for rapid deployment. n8n for production-grade solutions requiring more setup time.
