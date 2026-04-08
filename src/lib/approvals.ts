// src/lib/approvals.ts — Approval Workflow Engine
// Tier 1: Auto-approve (low-risk actions)
// Tier 2: Manual approval required (default)
// Tier 3: Escalate to admin (high-risk actions)

import { supabase } from "@/integrations/supabase/client";

// Helper to get current user profile_id
async function getCurrentProfileId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || "";
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ApprovalTier = 1 | 2 | 3;

export interface ApprovalRequest {
  agentId: string;
  actionType: string;
  actionDescription: string;
  actionPayload: Record<string, unknown>;
  conversationId?: string;
}

export interface ApprovalResult {
  id: string;
  tier: ApprovalTier;
  status: "pending" | "approved" | "rejected" | "timeout";
  autoApproved: boolean;
}

// ─── Tier Classification ─────────────────────────────────────────────────────

const TIER_1_AUTO_APPROVE: string[] = [
  "read_data",
  "search",
  "summarize",
  "analyze",
  "draft_message",
  "generate_report",
  "lookup",
  "fetch_info",
];

const TIER_3_ESCALATE: string[] = [
  "delete_data",
  "modify_billing",
  "change_permissions",
  "external_api_write",
  "send_email_bulk",
  "modify_user",
  "deploy",
  "database_migration",
  "financial_transaction",
];

export function classifyTier(actionType: string): ApprovalTier {
  const normalized = actionType.toLowerCase().replace(/\s+/g, "_");

  if (TIER_1_AUTO_APPROVE.some((t) => normalized.includes(t))) {
    return 1;
  }

  if (TIER_3_ESCALATE.some((t) => normalized.includes(t))) {
    return 3;
  }

  return 2;
}

export function getTierLabel(tier: ApprovalTier): string {
  switch (tier) {
    case 1:
      return "Auto-Approve";
    case 2:
      return "Manual Review";
    case 3:
      return "Admin Escalation";
  }
}

export function getTierColor(tier: ApprovalTier): string {
  switch (tier) {
    case 1:
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case 2:
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case 3:
      return "bg-red-500/10 text-red-600 border-red-500/20";
  }
}

// ─── Timeout Configuration ───────────────────────────────────────────────────

const APPROVAL_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function getTimeoutDeadline(createdAt: string): Date {
  return new Date(new Date(createdAt).getTime() + APPROVAL_TIMEOUT_MS);
}

export function isTimedOut(createdAt: string): boolean {
  return new Date() > getTimeoutDeadline(createdAt);
}

export function getTimeRemaining(createdAt: string): number {
  const deadline = getTimeoutDeadline(createdAt);
  return Math.max(0, deadline.getTime() - Date.now());
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Timed out";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

// ─── Approval Workflow ───────────────────────────────────────────────────────

export async function requestApproval(
  request: ApprovalRequest
): Promise<ApprovalResult> {
  const tier = classifyTier(request.actionType);

  // Tier 1: Auto-approve immediately
  if (tier === 1) {
    const profileId = await getCurrentProfileId();
    const { data, error } = await supabase
      .from("approvals")
      .insert([{
        requesting_agent_id: request.agentId,
        profile_id: profileId,
        action_type: request.actionType,
        action_description: request.actionDescription,
        action_payload: request.actionPayload as any,
        status: "approved" as const,
        conversation_id: request.conversationId || null,
      }])
      .select("id")
      .single();

    if (error) throw error;

    // Log to audit trail
    await logApprovalAudit(data.id, "auto_approved", "Tier 1 auto-approval");

    return {
      id: data.id,
      tier: 1,
      status: "approved",
      autoApproved: true,
    };
  }

  // Tier 2 & 3: Insert as pending, wait for human action
  const profileId2 = await getCurrentProfileId();
  const { data, error } = await supabase
    .from("approvals")
    .insert([{
      requesting_agent_id: request.agentId,
      profile_id: profileId2,
      action_type: request.actionType,
      action_description: request.actionDescription,
      action_payload: request.actionPayload as any,
      status: "pending" as const,
      conversation_id: request.conversationId || null,
    }])
    .select("id")
    .single();

  if (error) throw error;

  const auditMsg =
    tier === 3
      ? "Tier 3 escalation — requires admin review"
      : "Tier 2 manual approval required";
  await logApprovalAudit(data.id, "requested", auditMsg);

  // Schedule timeout check (client-side)
  scheduleTimeoutCheck(data.id);

  return {
    id: data.id,
    tier,
    status: "pending",
    autoApproved: false,
  };
}

// ─── Timeout Handling ────────────────────────────────────────────────────────

function scheduleTimeoutCheck(approvalId: string): void {
  setTimeout(async () => {
    try {
      // Check if still pending
      const { data } = await supabase
        .from("approvals")
        .select("status")
        .eq("id", approvalId)
        .single();

      if (data?.status === "pending") {
        // Mark as timed out
        await supabase
          .from("approvals")
          .update({ status: "timeout" })
          .eq("id", approvalId);

        await logApprovalAudit(
          approvalId,
          "timeout",
          "30-minute timeout reached — escalated"
        );

        // Trigger escalation notification
        await triggerEscalation(approvalId);
      }
    } catch (err) {
      console.error("[Approvals] Timeout check failed:", err);
    }
  }, APPROVAL_TIMEOUT_MS);
}

async function triggerEscalation(approvalId: string): Promise<void> {
  // Fetch approval details for the notification
  const { data: approval } = await supabase
    .from("approvals")
    .select("*, agents!approvals_requesting_agent_id_fkey(name)")
    .eq("id", approvalId)
    .single();

  if (!approval) return;

  const agentName =
    (approval as Record<string, unknown>).agents &&
    typeof (approval as Record<string, unknown>).agents === "object"
      ? ((approval as Record<string, unknown>).agents as { name?: string })
          ?.name ?? "Unknown"
      : "Unknown";

  // Insert a notification for the admin/user
  const notifProfileId = await getCurrentProfileId();
  await supabase.from("notifications").insert([{
    profile_id: notifProfileId,
    title: "⏰ Approval Timed Out",
    body: `${agentName}'s request "${approval.action_description}" timed out after 30 minutes. Please review.`,
    category: "approval" as const,
    is_read: false,
    source_agent_id: approval.requesting_agent_id,
    action_url: `/approvals`,
  }]);

  // n8n webhook stub — will be replaced with real webhook in Task 4 integration
  console.log(
    `[Approvals] Escalation triggered for approval ${approvalId}. Would fire n8n webhook here.`
  );
}

// ─── Audit Trail ─────────────────────────────────────────────────────────────

interface AuditEntry {
  approval_id: string;
  action: string;
  details: string;
  timestamp: string;
}

const auditLog: AuditEntry[] = [];

async function logApprovalAudit(
  approvalId: string,
  action: string,
  details: string
): Promise<void> {
  const entry: AuditEntry = {
    approval_id: approvalId,
    action,
    details,
    timestamp: new Date().toISOString(),
  };

  // Store in memory (persists for session)
  auditLog.push(entry);

  // Also try to log to audit_log table if it exists
  try {
    await supabase.from("audit_log").insert({
      action: `approval_${action}`,
      details: JSON.stringify({ approval_id: approvalId, ...entry }),
    });
  } catch {
    // audit_log table might not have the right schema yet — that's OK
    console.log("[Approvals] Audit logged in-memory:", entry);
  }
}

export function getAuditLog(approvalId?: string): AuditEntry[] {
  if (approvalId) {
    return auditLog.filter((e) => e.approval_id === approvalId);
  }
  return [...auditLog];
}

// ─── Approval Execution (Post-Approval) ─────────────────────────────────────

export async function executeApprovedAction(
  approvalId: string
): Promise<void> {
  const { data: approval } = await supabase
    .from("approvals")
    .select("*")
    .eq("id", approvalId)
    .single();

  if (!approval || approval.status !== "approved") {
    console.warn("[Approvals] Cannot execute — not approved:", approvalId);
    return;
  }

  await logApprovalAudit(approvalId, "executed", "Approved action executed");

  // The actual action execution depends on the action_type.
  // For now, log it. In Phase 1, this will dispatch to the appropriate agent/tool.
  console.log(
    `[Approvals] Executing approved action: ${approval.action_type}`,
    approval.action_payload
  );
}
