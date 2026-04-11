---
name: security-audit
description: >
  Perform a security audit on code, infrastructure, or configuration. Checks OWASP Top 10,
  authentication flows, data exposure, and DPDP compliance. In Layaa AI mode, audits against
  Layaa OS security requirements (RLS, JWT, API key protection).
trigger_keywords: [security, audit, vulnerability, owasp, penetration, security check]
agents: [rohit, ujjawal, preeti]
category: engineering
---

## Instructions

Audit checklist:
1. **Authentication** — Token validation, session management, password handling
2. **Authorization** — RLS policies, role checks, privilege escalation risks
3. **Input validation** — SQL injection, XSS, command injection, file upload risks
4. **Data exposure** — API keys in client code, sensitive data in logs, PII handling
5. **DPDP compliance** — Data residency, consent mechanisms, deletion capability
6. **Dependencies** — Known vulnerabilities in packages (npm audit)
7. **Configuration** — CORS, rate limiting, error messages (don't leak internals)

For each finding: severity (critical/high/medium/low), description, remediation, and verification steps.
