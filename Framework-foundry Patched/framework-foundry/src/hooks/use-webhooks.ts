/**
 * Webhooks hook — Task 5
 */
import { triggerSageExtraction, triggerApprovalCheck, delegateToAgent, requestAgentResponse, validateWebhookUrls, getWebhookStatus } from "@/lib/webhooks";

export function useWebhooks() {
  return {
    triggerSageExtraction,
    triggerApprovalCheck,
    delegateToAgent,
    requestAgentResponse,
    validateWebhookUrls,
    webhookStatus: getWebhookStatus(),
  };
}
