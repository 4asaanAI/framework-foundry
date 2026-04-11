---
name: api-design
description: >
  Design a REST or edge function API endpoint. Define routes, request/response schemas, error
  handling, and authentication. In Layaa AI mode, follows Supabase edge function patterns with
  RLS-aware queries.
trigger_keywords: [api design, endpoint, api spec, route design, api schema]
agents: [ujjawal, dev]
category: engineering
---

## Instructions

For each endpoint, define:
1. **Route** — HTTP method + path (e.g., `POST /functions/v1/chat`)
2. **Request schema** — Required and optional fields with types
3. **Response schema** — Success and error response shapes
4. **Authentication** — What auth is required (JWT, API key, service role)
5. **RLS considerations** — What row-level security policies apply
6. **Error handling** — Standard error codes and messages
7. **Rate limiting** — Any limits that should apply
