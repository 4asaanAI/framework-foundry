/**
 * Webhook abstraction for n8n integration — Task 5
 */
import { WEBHOOK_URLS } from "@/constants/webhooks";

export async function triggerSageExtraction(
  agentId: string, conversationId: string, messages: any[]
): Promise<any[]> {
  const url = WEBHOOK_URLS.SAGE_EXTRACTION;
  if (!url) { console.warn("[Webhooks] SAGE_EXTRACTION URL not set — skipping"); return []; }
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, conversationId, messages }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (e: any) {
    console.error("[Webhooks] Sage extraction failed:", e.message);
    return [];
  }
}

export async function triggerApprovalCheck(
  agentId: string, actionType: string, actionPayload: any
): Promise<any> {
  const url = WEBHOOK_URLS.APPROVAL_HANDLER;
  if (!url) {
    console.warn("[Webhooks] APPROVAL_HANDLER URL not set — auto-approving");
    return { status: "approved", auto: true };
  }
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, actionType, actionPayload, timestamp: new Date().toISOString() }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (e: any) {
    console.error("[Webhooks] Approval check failed:", e.message);
    return { status: "error", error: e.message };
  }
}

export async function delegateToAgent(
  delegatingAgentId: string, targetAgentId: string, task: string, conversationId: string
): Promise<any> {
  const url = WEBHOOK_URLS.AGENT_DELEGATION;
  if (!url) {
    console.warn("[Webhooks] AGENT_DELEGATION URL not set");
    return { error: "Delegation webhook not configured" };
  }
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delegatingAgentId, targetAgentId, task, conversationId }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (e: any) {
    console.error("[Webhooks] Agent delegation failed:", e.message);
    return { error: e.message };
  }
}

export async function requestAgentResponse(
  agentId: string, prompt: string, context: string, conversationId: string
): Promise<string> {
  const url = WEBHOOK_URLS.AGENT_RESPONSE;
  if (!url) {
    console.warn("[Webhooks] AGENT_RESPONSE URL not set");
    return "";
  }
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, prompt, context, conversationId }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.response || data.content || "";
  } catch (e: any) {
    console.error("[Webhooks] Agent response failed:", e.message);
    return "";
  }
}

export async function validateWebhookUrls(): Promise<boolean> {
  return Object.values(WEBHOOK_URLS).every(url => !!url);
}

export async function onMessageSent(_data: {
  agentId: string; conversationId: string; messageContent: string;
}): Promise<void> {
  // Fire-and-forget webhook for message events — stub for n8n integration
  console.log("[Webhooks] onMessageSent — stub");
}

export async function onAgentDelegation(_data: {
  fromAgentId: string; toAgentId: string; conversationId: string;
  delegatedConversationId: string; task: string; reason: string;
}): Promise<void> {
  // Fire-and-forget webhook for delegation events — stub for n8n integration
  const url = WEBHOOK_URLS.AGENT_DELEGATION;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_data),
    });
  } catch (e) {
    console.error("[Webhooks] onAgentDelegation failed:", e);
  }
}

/**
 * Send a cross-admin notification on behalf of an agent.
 * This creates a notification entry in Supabase that the target admin
 * will see in the notification bell icon. Clicking it opens the agent's chat.
 */
export async function sendCrossAdminNotification(params: {
  sourceAgentId: string;
  sourceAgentName: string;
  targetProfileId: string;
  title: string;
  body: string;
  category?: string;
}): Promise<void> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("notifications").insert({
      source_agent_id: params.sourceAgentId,
      profile_id: params.targetProfileId,
      title: params.title,
      body: `[From ${params.sourceAgentName}] ${params.body}`,
      category: (params.category || "system") as any,
      is_read: false,
    } as any);
  } catch (e) {
    console.error("[Webhooks] Cross-admin notification failed:", e);
  }
}

export function getWebhookStatus() {
  return {
    sageLive: !!WEBHOOK_URLS.SAGE_EXTRACTION,
    approvalLive: !!WEBHOOK_URLS.APPROVAL_HANDLER,
    delegationLive: !!WEBHOOK_URLS.AGENT_DELEGATION,
    agentResponseLive: !!WEBHOOK_URLS.AGENT_RESPONSE,
  };
}
