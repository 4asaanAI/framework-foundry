import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMOptions {
  messages: LLMMessage[];
  system?: string;
  model?: string;
  maxTokens?: number;
  stream?: boolean;
  agentId?: string;
}

export interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: { input: number; output: number };
}

interface ApiKeys {
  anthropic: string;
  openai: string;
  gemini: string;
}

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 1;

function decrypt(encrypted: string, masterKey: string): string {
  const key = new TextEncoder().encode(masterKey.slice(0, 32));
  const data = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(data.map((b, i) => b ^ key[i % key.length]));
}

/** Fetch and decrypt API keys from Supabase settings table. */
export async function getApiKeys(supabase: SupabaseClient): Promise<ApiKeys> {
  const masterKey = Deno.env.get("MASTER_ENCRYPTION_KEY");
  if (!masterKey) throw new Error("MASTER_ENCRYPTION_KEY not set");

  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["anthropic_api_key", "openai_api_key", "gemini_api_key"]);

  if (error) throw new Error(`Failed to fetch API keys: ${error.message}`);

  const keys: Record<string, string> = {};
  for (const row of data ?? []) {
    keys[row.key] = decrypt(row.value, masterKey);
  }

  return {
    anthropic: keys.anthropic_api_key ?? "",
    openai: keys.openai_api_key ?? "",
    gemini: keys.gemini_api_key ?? "",
  };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callClaude(
  keys: ApiKeys,
  options: LLMOptions,
): Promise<LLMResponse> {
  const model = options.model ?? "claude-sonnet-4-6-20260408";
  const messages = options.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const body: Record<string, unknown> = {
    model,
    max_tokens: options.maxTokens ?? 4096,
    messages,
  };
  if (options.system) body.system = options.system;

  const res = await fetchWithTimeout(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": keys.anthropic,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.content[0]?.text ?? "",
    provider: "anthropic",
    model,
    tokensUsed: {
      input: data.usage?.input_tokens ?? 0,
      output: data.usage?.output_tokens ?? 0,
    },
  };
}

async function callOpenAI(
  keys: ApiKeys,
  options: LLMOptions,
): Promise<LLMResponse> {
  const model = "gpt-4o";
  const messages = options.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  if (options.system) {
    messages.unshift({ role: "system", content: options.system });
  }

  const res = await fetchWithTimeout(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keys.openai}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: options.maxTokens ?? 4096,
      }),
    },
  );

  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0]?.message?.content ?? "",
    provider: "openai",
    model,
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
  };
}

async function callGemini(
  keys: ApiKeys,
  options: LLMOptions,
): Promise<LLMResponse> {
  const model = "gemini-2.0-flash";
  const contents = options.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body: Record<string, unknown> = { contents };
  if (options.system) {
    body.systemInstruction = { parts: [{ text: options.system }] };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keys.gemini}`;
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini API ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const candidate = data.candidates?.[0];
  return {
    content: candidate?.content?.parts?.[0]?.text ?? "",
    provider: "google",
    model,
    tokensUsed: {
      input: data.usageMetadata?.promptTokenCount ?? 0,
      output: data.usageMetadata?.candidatesTokenCount ?? 0,
    },
  };
}

function isRetryable(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message;
    return (
      msg.includes("AbortError") ||
      msg.includes("500") ||
      msg.includes("502") ||
      msg.includes("503") ||
      msg.includes("429")
    );
  }
  return false;
}

/** Call LLM with automatic fallback chain: Claude -> OpenAI -> Gemini. */
export async function callLLM(
  options: LLMOptions,
  supabase: SupabaseClient,
): Promise<LLMResponse> {
  const keys = await getApiKeys(supabase);
  const providers = [callClaude, callOpenAI, callGemini];
  const providerNames = ["Claude", "OpenAI", "Gemini"];

  for (let i = 0; i < providers.length; i++) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await providers[i](keys, options);
        if (i > 0) {
          console.log(`LLM fallback: using ${providerNames[i]} (primary failed)`);
        }
        return result;
      } catch (err) {
        console.error(
          `${providerNames[i]} attempt ${attempt + 1} failed:`,
          err instanceof Error ? err.message : err,
        );
        if (attempt < MAX_RETRIES && isRetryable(err)) continue;
        break;
      }
    }
  }

  throw new Error("All LLM providers failed");
}
