# Ujjawal — KB — Data Handling & Schemas

> Schema definition standards, state management patterns, and data transformation best practices for all workflow designs.

---

## Schema Definition Standard

Every data schema must specify:

```json
{
  "field_name": {
    "type": "string | number | boolean | date | array | object",
    "required": true,
    "description": "What this field contains",
    "example": "Actual example value",
    "constraints": "max_length: 255, min: 0, enum: ['a','b','c']",
    "source": "Where this data comes from"
  }
}
```

### Schema Documentation Rules
- Every field must have a type, description, and example
- Required fields must be explicitly marked
- Constraints should be specific and testable
- Source attribution helps with debugging data issues
- Use consistent naming conventions: snake_case for field names

---

## State Management Patterns

### Stateless Workflows (Preferred)
- Each execution is independent
- All needed data comes from the trigger or is fetched during execution
- No shared state between executions
- Ideal for: notifications, data sync, report generation

### Stateful Workflows (When Necessary)
- State stored in PocketBase between executions
- Each execution reads state, processes, writes updated state
- MUST handle concurrent access (use record locking or version numbers)
- Use for: multi-step processes, approval workflows, progressive data collection

### State Storage Patterns

| Pattern | When to Use | Storage |
|---------|-------------|---------|
| Execution-scoped | State needed only during one run | In-memory (n8n data) |
| Short-lived state | State needed across hours/days | PocketBase with TTL |
| Long-lived state | Permanent records | PocketBase collection |
| Cross-workflow state | Multiple workflows share state | Dedicated PocketBase collection |

### Concurrent Access Handling

When multiple workflow executions may access the same state:
1. **Optimistic locking** — Read version number, process, write with version check. If version changed, re-read and retry.
2. **Record-level locking** — Set a "locked_by" field before processing, clear after. Include a timeout for stale locks.
3. **Queue-based serialization** — Write requests to a queue, process sequentially with a scheduled workflow.

---

## Data Transformation Best Practices

1. **Transform once, use everywhere** — normalize data at the entry point, not at each consumption point
2. **Preserve raw data** — store the original input alongside the transformed version
3. **Explicit type conversion** — never rely on implicit type coercion. `parseInt("10")` not `"10" + 0`
4. **Handle null/undefined explicitly** — define behavior for missing data, don't let it crash
5. **Timestamps in IST** — all user-facing timestamps in IST. Internal processing can use UTC with conversion

### Common Transformation Patterns

**Date/Time Normalization:**
- Accept multiple input formats (ISO 8601, DD/MM/YYYY, MM/DD/YYYY)
- Convert to ISO 8601 internally
- Display in IST with explicit timezone indicator
- Store raw input for debugging

**Phone Number Normalization:**
- Strip all non-numeric characters
- Add country code if missing (default: +91 for India)
- Validate length (10 digits for Indian numbers)
- Store in E.164 format

**Name Normalization:**
- Trim whitespace
- Title case (unless client specifies otherwise)
- Handle single-name entries (common in India)

**Currency Handling:**
- Store as integer (paise, not rupees) to avoid floating-point issues
- Display with proper formatting (Rs.1,00,000 not Rs.100000)
- Always specify currency code in schemas (INR)

---

## Data Validation Rules

### At Entry Point (Validation Layer)
Every workflow's entry point must validate:
1. **Presence** — All required fields exist
2. **Type** — Fields match expected types
3. **Format** — Fields match expected patterns (email, phone, PAN, etc.)
4. **Range** — Numeric fields within acceptable range
5. **Referential** — Foreign keys reference existing records

### Validation Response Format
```json
{
  "valid": false,
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT",
      "message": "Email must be a valid email address",
      "received": "not-an-email"
    }
  ]
}
```

---

*This document is part of Ujjawal's technical knowledge base. Update as new data patterns and schema requirements emerge.*
