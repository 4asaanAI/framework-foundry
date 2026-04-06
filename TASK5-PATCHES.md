# Task 5: Approval Workflow — Patch Instructions

## Files to CREATE (copy as-is)
1. `src/lib/approvals.ts` ← from `src-lib-approvals.ts`
2. `src/hooks/use-approval-workflow.ts` ← from `src-hooks-use-approval-workflow.ts`

## Files to REPLACE (full replacement)
3. `src/components/views/ApprovalsView.tsx` ← from `src-components-views-ApprovalsView.tsx`

## Files to PATCH

### 4. `src/components/views/ChatView.tsx`

Find the section where agent responses are saved (after the message is inserted into Supabase). Add the approval check BEFORE the message is sent, when the agent's action_type warrants it.

**Add this import at the top of ChatView.tsx:**
```typescript
import { useApprovalWorkflow } from "@/hooks/use-approval-workflow";
```

**Inside the ChatView component, add the hook:**
```typescript
const { submitForApproval, previewTier } = useApprovalWorkflow();
```

**In the message send handler, BEFORE calling the LLM, add a check for actions that need approval:**

Find the area where the user message is processed. After detecting action keywords (like "delete", "deploy", "send email"), insert:

```typescript
// Check if this action needs approval
const actionKeywords = [
  { pattern: /delete|remove|drop/i, type: "delete_data" },
  { pattern: /deploy|publish|release/i, type: "deploy" },
  { pattern: /send email|email blast|bulk email/i, type: "send_email_bulk" },
  { pattern: /billing|payment|invoice/i, type: "modify_billing" },
  { pattern: /permission|role|access/i, type: "change_permissions" },
];

const matchedAction = actionKeywords.find((kw) =>
  kw.pattern.test(userMessage)
);

if (matchedAction) {
  const tier = previewTier(matchedAction.type);
  if (tier > 1) {
    // Needs approval — submit and pause execution
    const result = await submitForApproval({
      agentId: currentAgent.id,
      actionType: matchedAction.type,
      actionDescription: `${currentAgent.name}: ${userMessage.slice(0, 100)}`,
      conversationId: conversationId,
    });

    if (result.status === "pending") {
      // Add a system message noting the action is pending approval
      // Don't proceed with LLM call until approved
      return;
    }
  }
}
```

### 5. No sidebar changes needed
ApprovalsView is already in the sidebar navigation. The existing route handles it.

## How It Works

1. **Tier Classification**: When an agent action is triggered, `classifyTier()` checks the action type:
   - **Tier 1** (read_data, search, summarize, etc.) → Auto-approved instantly
   - **Tier 2** (file_write, send_message, create_workflow, etc.) → Queued for manual review
   - **Tier 3** (delete_data, modify_billing, deploy, etc.) → Escalated to admin

2. **30-Minute Timeout**: Pending approvals get a `setTimeout` that fires after 30 mins. If still pending, status changes to "timeout" and a notification is created.

3. **Non-Blocking UI**: The approval modal doesn't block the app. Users can continue chatting while approvals are pending. The ApprovalsView shows a live countdown.

4. **Audit Trail**: Every approval action (requested, auto_approved, approved, rejected, timeout, executed) is logged in-memory and attempted to be written to the `audit_log` table.

5. **Post-Approval Execution**: When approved, `executeApprovedAction()` is called. Currently logs to console — will dispatch to agent tools in Phase 1.
