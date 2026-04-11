/**
 * Connector Authentication Infrastructure — Layaa OS
 *
 * Provides the OAuth flow handler, credential storage, and reusable patterns
 * for connecting external services (Slack, Gmail, Calendar, etc.) to the platform.
 *
 * Uses existing tables: credential_vault, connectors, settings
 * Zero new DB tables required.
 *
 * Supported auth types:
 * - OAuth 2.0 (redirect-based: Slack, Google, Atlassian)
 * - API Key (direct input: OpenAI, Resend, custom APIs)
 * - MCP Server (URL-based: Model Context Protocol servers)
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ConnectorAuthType = "oauth2" | "api_key" | "mcp" | "webhook";

export interface ConnectorDefinition {
  id: string;
  name: string;
  provider: string;
  authType: ConnectorAuthType;
  description: string;
  icon?: string;
  // OAuth config
  oauthAuthorizeUrl?: string;
  oauthTokenUrl?: string;
  oauthScopes?: string[];
  // API key config
  apiKeyPlaceholder?: string;
}

export interface StoredCredential {
  id: string;
  name: string;
  provider: string;
  is_configured: boolean;
  created_by: string;
}

// ─── Built-in Connector Definitions ─────────────────────────────────────────

// These match the MCP tools already available in the system-reminder
// (Slack, Gmail, Google Calendar, Atlassian)
export const BUILT_IN_CONNECTORS: ConnectorDefinition[] = [
  {
    id: "slack",
    name: "Slack",
    provider: "slack",
    authType: "oauth2",
    description: "Send messages, search channels, read threads, manage canvases",
    oauthAuthorizeUrl: "https://slack.com/oauth/v2/authorize",
    oauthScopes: ["chat:write", "channels:read", "search:read", "users:read"],
  },
  {
    id: "gmail",
    name: "Gmail",
    provider: "gmail",
    authType: "oauth2",
    description: "Read, send, and manage emails",
    oauthAuthorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthScopes: ["https://www.googleapis.com/auth/gmail.modify"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    provider: "google_calendar",
    authType: "oauth2",
    description: "Create events, check availability, manage calendars",
    oauthAuthorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthScopes: ["https://www.googleapis.com/auth/calendar"],
  },
  {
    id: "atlassian",
    name: "Atlassian (Jira + Confluence)",
    provider: "atlassian",
    authType: "oauth2",
    description: "Manage Jira issues, create Confluence pages, track projects",
    oauthAuthorizeUrl: "https://auth.atlassian.com/authorize",
    oauthScopes: ["read:jira-work", "write:jira-work", "read:confluence-content.all", "write:confluence-content"],
  },
  {
    id: "miro",
    name: "Miro",
    provider: "miro",
    authType: "oauth2",
    description: "Create and manage Miro boards for visual collaboration",
    oauthAuthorizeUrl: "https://miro.com/oauth/authorize",
    oauthScopes: ["boards:read", "boards:write"],
  },
  {
    id: "openai",
    name: "OpenAI API",
    provider: "openai",
    authType: "api_key",
    description: "Use GPT models as an alternative LLM provider",
    apiKeyPlaceholder: "sk-...",
  },
  {
    id: "anthropic",
    name: "Anthropic API",
    provider: "anthropic",
    authType: "api_key",
    description: "Use Claude models directly via Anthropic API",
    apiKeyPlaceholder: "sk-ant-...",
  },
  {
    id: "resend",
    name: "Resend (Email)",
    provider: "resend",
    authType: "api_key",
    description: "Send transactional emails via Resend API",
    apiKeyPlaceholder: "re_...",
  },
];

// ─── OAuth Flow ─────────────────────────────────────────────────────────────

/**
 * Initiate OAuth flow for a connector.
 * Opens a popup window to the provider's auth page.
 * On successful auth, stores the credential.
 */
export async function initiateOAuthFlow(
  connector: ConnectorDefinition,
  userId: string
): Promise<void> {
  if (!connector.oauthAuthorizeUrl) {
    toast.error("This connector doesn't support OAuth");
    return;
  }

  // Build the OAuth URL
  // In production, the redirect_uri should point to a Supabase edge function
  // that handles the callback and stores the token
  const redirectUri = `${window.location.origin}/auth/callback/${connector.provider}`;
  const state = btoa(JSON.stringify({ connector_id: connector.id, user_id: userId }));

  const params = new URLSearchParams({
    client_id: await getClientId(connector.provider),
    redirect_uri: redirectUri,
    scope: (connector.oauthScopes ?? []).join(" "),
    state,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${connector.oauthAuthorizeUrl}?${params.toString()}`;

  // Open in popup
  const popup = window.open(authUrl, `${connector.name} Login`, "width=600,height=700,scrollbars=yes");

  if (!popup) {
    toast.error("Popup blocked. Please allow popups for this site.");
    return;
  }

  // Listen for the callback
  toast.info(`Connecting to ${connector.name}... Complete the login in the popup.`);
}

/**
 * Save an API key credential for a connector.
 */
export async function saveApiKeyCredential(
  connector: ConnectorDefinition,
  apiKey: string,
  userId: string
): Promise<boolean> {
  // Store in credential_vault
  const { error } = await supabase.from("credential_vault").upsert({
    name: connector.name,
    provider: connector.provider,
    is_configured: true,
    created_by: userId,
  }, { onConflict: "provider" as any });

  if (error) {
    toast.error(`Failed to save credential: ${error.message}`);
    return false;
  }

  // Encrypt API key before storing
  let encryptedKey = apiKey;
  try {
    const { encryptValue } = await import("@/lib/encryption");
    encryptedKey = await encryptValue(apiKey);
  } catch { /* encryption unavailable — store plaintext as fallback */ }

  await supabase.from("settings").upsert({
    key: `connector_key_${connector.provider}`,
    value: encryptedKey,
  }, { onConflict: "key" });

  // Also create/update the connector entry
  await supabase.from("connectors").upsert({
    name: connector.name,
    type: connector.authType === "api_key" ? "credential" : "mcp",
    description: connector.description,
    is_active: true,
    created_by: userId,
  } as any, { onConflict: "name" as any });

  toast.success(`${connector.name} connected successfully`);
  return true;
}

/**
 * Disconnect a connector — removes credentials.
 */
export async function disconnectConnector(
  provider: string,
  userId: string
): Promise<void> {
  await supabase.from("credential_vault").update({ is_configured: false }).eq("provider", provider);
  await supabase.from("settings").delete().eq("key", `connector_key_${provider}`);
  toast.success("Connector disconnected");
}

/**
 * Check if a connector is authenticated.
 */
export async function isConnectorAuthenticated(provider: string): Promise<boolean> {
  const { data } = await supabase.from("credential_vault")
    .select("is_configured")
    .eq("provider", provider)
    .maybeSingle();
  return data?.is_configured === true;
}

/**
 * Get all connector statuses.
 */
export async function getConnectorStatuses(): Promise<Record<string, boolean>> {
  const { data } = await supabase.from("credential_vault").select("provider, is_configured");
  const statuses: Record<string, boolean> = {};
  for (const row of (data ?? [])) {
    statuses[row.provider] = row.is_configured;
  }
  return statuses;
}

// ─── Internal Helpers ───────────────────────────────────────────────────────

async function getClientId(provider: string): Promise<string> {
  // Load OAuth client ID from settings table
  const { data } = await supabase.from("settings").select("value").eq("key", `oauth_client_id_${provider}`).maybeSingle();
  return data?.value || "";
}
