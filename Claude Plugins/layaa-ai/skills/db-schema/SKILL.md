---
name: db-schema
description: >
  Design or review database schema (tables, columns, relationships, indexes, RLS policies).
  In Layaa AI mode, works with existing Supabase PostgreSQL schema — checks for consistency
  with existing tables and migration patterns.
trigger_keywords: [database, schema, table design, migration, db design, columns, indexes]
agents: [ujjawal, dev]
category: engineering
---

## Instructions

When designing schema:
1. **List all entities** with their columns, types, and constraints
2. **Define relationships** — foreign keys, junction tables for many-to-many
3. **Add indexes** for frequently queried columns
4. **Write RLS policies** — who can read/write what
5. **Consider existing schema** — don't duplicate what already exists
6. **Migration safety** — use additive changes (new columns with defaults), avoid destructive operations on production data
