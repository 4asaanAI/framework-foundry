// src/hooks/use-approval-workflow.ts — Hook for triggering & managing approval workflows

import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useApprovals, useUpdateApproval } from "@/hooks/use-approvals";
import {
  requestApproval,
  classifyTier,
  executeApprovedAction,
  isTimedOut,
  getTimeRemaining,
  type ApprovalRequest,
  type ApprovalResult,
  type ApprovalTier,
} from "@/lib/approvals";
import { toast } from "@/hooks/use-toast";

interface UseApprovalWorkflowReturn {
  /** Submit an action for approval — auto-approves Tier 1, queues Tier 2/3 */
  submitForApproval: (request: ApprovalRequest) => Promise<ApprovalResult>;
  /** Preview which tier an action would be classified as */
  previewTier: (actionType: string) => ApprovalTier;
  /** Approve a pending approval */
  approve: (id: string) => void;
  /** Reject a pending approval */
  reject: (id: string) => void;
  /** Whether a submission is in progress */
  isSubmitting: boolean;
}

export function useApprovalWorkflow(): UseApprovalWorkflowReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const updateApproval = useUpdateApproval();

  const submitForApproval = useCallback(
    async (request: ApprovalRequest): Promise<ApprovalResult> => {
      setIsSubmitting(true);
      try {
        const result = await requestApproval(request);

        if (result.autoApproved) {
          toast({
            title: "✅ Auto-Approved",
            description: `"${request.actionDescription}" was auto-approved (Tier 1).`,
          });
          // Execute immediately
          await executeApprovedAction(result.id);
        } else if (result.tier === 3) {
          toast({
            title: "🔴 Escalated to Admin",
            description: `"${request.actionDescription}" requires admin review (Tier 3). 30-min timeout active.`,
          });
        } else {
          toast({
            title: "🟡 Awaiting Approval",
            description: `"${request.actionDescription}" is pending your review (Tier 2). 30-min timeout active.`,
          });
        }

        // Refresh the approvals list
        queryClient.invalidateQueries({ queryKey: ["approvals"] });

        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [queryClient]
  );

  const previewTier = useCallback((actionType: string): ApprovalTier => {
    return classifyTier(actionType);
  }, []);

  const approve = useCallback(
    (id: string) => {
      updateApproval.mutate(
        { id, status: "approved" },
        {
          onSuccess: async () => {
            toast({
              title: "Approved",
              description: "Action has been approved and will be executed.",
            });
            await executeApprovedAction(id);
          },
        }
      );
    },
    [updateApproval]
  );

  const reject = useCallback(
    (id: string) => {
      updateApproval.mutate(
        { id, status: "rejected" },
        {
          onSuccess: () => {
            toast({
              title: "Rejected",
              description: "Action has been rejected.",
            });
          },
        }
      );
    },
    [updateApproval]
  );

  return {
    submitForApproval,
    previewTier,
    approve,
    reject,
    isSubmitting,
  };
}

// ─── Timeout Countdown Hook ─────────────────────────────────────────────────

export function useApprovalCountdown(createdAt: string): {
  timeRemaining: number;
  isExpired: boolean;
  formatted: string;
} {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getTimeRemaining(createdAt)
  );

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(createdAt);
      setTimeRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const formatted =
    timeRemaining <= 0
      ? "Timed out"
      : `${minutes}m ${seconds}s`;

  return {
    timeRemaining,
    isExpired: timeRemaining <= 0,
    formatted,
  };
}
