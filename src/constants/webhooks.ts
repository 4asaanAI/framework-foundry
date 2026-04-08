/**
 * Webhook URL configuration — Task 5
 * When n8n is ready, fill in the actual webhook URLs here or set via settings table
 */

export const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || "";

export const WEBHOOK_URLS = {
  SAGE_EXTRACTION: import.meta.env.VITE_N8N_SAGE_WEBHOOK || "",
  APPROVAL_HANDLER: import.meta.env.VITE_N8N_APPROVAL_WEBHOOK || "",
  AGENT_DELEGATION: import.meta.env.VITE_N8N_DELEGATION_WEBHOOK || "",
  AGENT_RESPONSE: import.meta.env.VITE_N8N_AGENT_RESPONSE_WEBHOOK || "",
};
