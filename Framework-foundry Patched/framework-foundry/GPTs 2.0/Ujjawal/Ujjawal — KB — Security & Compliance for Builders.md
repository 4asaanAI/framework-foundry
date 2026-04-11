# Ujjawal — KB — Security & Compliance for Builders

> Authentication patterns, PII handling rules, secrets management, and compliance considerations for all workflow implementations.

---

## Authentication Patterns

| Method | When to Use | n8n Implementation |
|--------|-------------|-------------------|
| API Key (Header) | Simple service-to-service | Header Auth credential |
| Bearer Token | OAuth2 protected APIs | OAuth2 credential with auto-refresh |
| Basic Auth | Legacy systems | Basic Auth credential |
| Webhook Secret | Validating incoming webhooks | Check X-Webhook-Secret header in Function node |
| IP Whitelist | Additional layer for critical webhooks | Configure at reverse proxy level |

### Authentication Implementation Guidelines

**For Outbound API Calls:**
- Always use n8n's credential system — never hardcode tokens in Function nodes
- For OAuth2: configure token refresh properly to avoid auth failures at runtime
- For API keys with expiry: set calendar reminders for rotation

**For Inbound Webhooks:**
- Always require authentication — no open webhooks in production
- Prefer Header Auth (X-Api-Key) for simplicity
- For sensitive webhooks: combine Header Auth + IP whitelist
- Log all authentication failures for security monitoring

---

## PII Handling Rules for Builders

### Rule 1: Identify PII at Entry
Mark fields containing PII (name, email, phone, PAN, Aadhaar) in the schema. Common PII fields in Indian context:
- Full name
- Email address
- Phone number
- PAN (Permanent Account Number)
- Aadhaar number
- Bank account details
- Address
- Date of birth

### Rule 2: Encrypt PII at Rest
Use PocketBase's encrypted fields for PII columns. Sensitive data must never be stored in plaintext.

### Rule 3: Minimize PII in Logs
Never log full PII. Use masking patterns:
- Email: `rak***@gmail.com`
- Phone: `98XXXXXX90`
- PAN: `ABCXX1234X` (mask middle characters)
- Aadhaar: `XXXX XXXX 1234` (show only last 4)

### Rule 4: PII in Error Messages
Error payloads sent to monitoring must have PII redacted. The error logging Function node should strip PII before writing to the error table or sending notifications.

### Rule 5: PII in Context Passing
When using `pass_context()`, redact PII unless the receiving agent needs it. Only pass the minimum PII necessary for the downstream task.

---

## Secrets Management

### Storage
- All secrets stored in n8n credential store (AES-256 encrypted)
- Reference in architecture docs as: `credential: [credential_name]`
- Never embed actual secrets in workflow nodes, documents, or memory

### Rotation Schedule
- API keys: every 90 days
- OAuth tokens: auto-refresh configured
- Webhook secrets: every 90 days or when team membership changes
- Database passwords: every 90 days

### Emergency Procedures
If a credential is compromised:
1. Immediately rotate the credential at the source (API provider, database)
2. Update the credential in n8n's credential store
3. Verify all workflows using the credential still function
4. Review audit logs for unauthorized access during exposure window
5. Document the incident

---

## Compliance Considerations

### DPDP Act (India)
All personal data processing needs lawful purpose. Design requirements:
- **Consent checkpoints:** Build consent capture where user data is collected
- **Purpose limitation:** Only process data for the stated purpose
- **Data minimization:** Only collect data actually needed for the workflow
- **Notice requirement:** Ensure the client's system informs data subjects about processing

### Data Residency
- All data stays on Indian VPS. No external cloud storage for client data.
- When using third-party APIs (e.g., Claude API for AI processing), be aware that data may temporarily leave India during processing
- Document all data flows that cross geographic boundaries
- Client must be informed if any data leaves India, even temporarily

### Audit Trail
- Every data access and modification must be loggable
- Design audit fields into every collection:
  - `created_at`, `created_by`
  - `updated_at`, `updated_by`
  - `deleted_at`, `deleted_by` (for soft deletes)
- The `audit_log` PocketBase collection captures system-level audit events

### Right to Deletion
- Design data schemas so individual records can be deleted without breaking system integrity
- Use soft deletes where referential integrity matters
- Implement cascade logic: when a person is deleted, all their PII across all collections must be purged
- Maintain non-PII aggregate data even after individual deletion (for analytics)

### Compliance Checklist for Every Workflow
- [ ] PII fields identified and marked in schema
- [ ] PII encrypted at rest
- [ ] PII masked in logs and error messages
- [ ] Consent checkpoint present (if collecting new data)
- [ ] Audit trail fields included in all collections
- [ ] Data residency requirements met
- [ ] Deletion capability designed into schema
- [ ] Third-party data flows documented

---

*This document is part of Ujjawal's technical knowledge base. Update as compliance requirements evolve and new security patterns emerge.*
