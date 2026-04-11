---
name: architecture-review
description: >
  Review a system architecture proposal or existing architecture for scalability, security,
  maintainability, and cost. In Layaa AI mode, evaluates against Layaa OS constraints
  (bootstrap budget, Indian VPS, DPDP compliance, 2-person team).
trigger_keywords: [architecture, system design, review architecture, design review, scalability]
agents: [ujjawal, kabir, dev]
category: engineering
---

## Instructions

Evaluate the architecture across these dimensions:
1. **Scalability** — Can it handle 10x growth without rewrite?
2. **Security** — Authentication, authorization, data protection, OWASP compliance
3. **Cost** — Does it fit bootstrap constraints? Any hidden costs?
4. **Maintainability** — Can a 2-person team maintain this? Operational complexity?
5. **Compliance** — DPDP, data residency (India), audit requirements
6. **Trade-offs** — What was sacrificed and why? Are the trade-offs acceptable?

Provide: strengths, risks, recommended changes (prioritized), and an overall assessment.
