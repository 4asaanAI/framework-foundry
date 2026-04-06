// src/lib/webhooks.ts
// n8n webhook stub functions — ready for real n8n integration in Phase 1
// These functions define the interface; they currently log and return mock responses.
// When n8n is connected, replace the body of each function with actual fetch() calls.

export interface WebhookPayload {
  event: string;
  agentId: string;
  conversationId?: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface WebhookResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

// Base URL — will be set via env var when n8n is connected
const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL ?? "";

async function callWebhook(endpoint: string, payload: WebhookPayload): Promise<WebhookResponse> {
  if (!N8N_BASE_URL) {
    console.log(`[webhook-stub] ${endpoint}`, payload);
    return { success: true, data: { stub: true, endpoint } };
  }

  try {
    const response = await fetch(`${N8N_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook ${endpoint} returned ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[webhook] ${endpoint} failed:`, message);
    return { success: false, error: message };
  }
}

// ─── Specific webhook stubs ───

/**
 * Triggered when a user sends a message to an agent.
 * n8n can use this to log analytics, trigger follow-ups, etc.
 */
export async function onMessageSent(params: {
  agentId: string;
  conversationId: string;
  messageContent: string;
  userId: string;
}): Promise<WebhookResponse> {
  return callWebhook("message-sent", {
    event: "message.sent",
    agentId: params.agentId,
    conversationId: params.conversationId,
    data: { content: params.messageContent, userId: params.userId },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Triggered when an agent delegates to another agent.
 * n8n can orchestrate complex multi-agent workflows.
 */
export async function onAgentDelegation(params: {
  fromAgentId: string;
  toAgentId: string;
  conversationId: string;
  delegatedConversationId: string;
  task: string;
  reason: "explicit_request" | "auto_detected";
}): Promise<WebhookResponse> {
  return callWebhook("agent-delegation", {
    event: "agent.delegation",
    agentId: params.fromAgentId,
    conversationId: params.conversationId,
    data: {
      toAgentId: params.toAgentId,
      delegatedConversationId: params.delegatedConversationId,
      task: params.task,
      reason: params.reason,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Triggered when Sage extracts memories from a conversation.
 * n8n can run deeper analysis, cross-reference with CRM, etc.
 */
export async function onMemoryExtracted(params: {
  agentId: string;
  conversationId: string;
  memoriesCount: number;
  categories: string[];
}): Promise<WebhookResponse> {
  return callWebhook("memory-extracted", {
    event: "memory.extracted",
    agentId: params.agentId,
    conversationId: params.conversationId,
    data: {
      memoriesCount: params.memoriesCount,
      categories: params.categories,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Triggered when an approval request is created.
 * n8n can send Slack/email notifications, escalate, etc.
 */
export async function onApprovalRequested(params: {
  agentId: string;
  actionType: string;
  actionDescription: string;
  conversationId?: string;
}): Promise<WebhookResponse> {
  return callWebhook("approval-requested", {
    event: "approval.requested",
    agentId: params.agentId,
    conversationId: params.conversationId,
    data: {
      actionType: params.actionType,
      actionDescription: params.actionDescription,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Triggered when an agent's budget crosses a threshold (80%, 100%).
 * n8n can alert admins, auto-loan tokens, etc.
 */
export async function onBudgetAlert(params: {
  agentId: string;
  budgetUsed: number;
  budgetTotal: number;
  percentUsed: number;
}): Promise<WebhookResponse> {
  return callWebhook("budget-alert", {
    event: "budget.alert",
    agentId: params.agentId,
    data: {
      budgetUsed: params.budgetUsed,
      budgetTotal: params.budgetTotal,
      percentUsed: params.percentUsed,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Scheduled: periodic conversation summary generation.
 * Called by client-side timer or n8n cron.
 */
export async function onScheduledSummary(params: {
  agentId: string;
  conversationIds: string[];
  period: "daily" | "weekly";
}): Promise<WebhookResponse> {
  return callWebhook("scheduled-summary", {
    event: "schedule.summary",
    agentId: params.agentId,
    data: {
      conversationIds: params.conversationIds,
      period: params.period,
    },
    timestamp: new Date().toISOString(),
  });
}
