// LLM Abstraction Layer — supports any OpenAI-compatible provider

export interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  baseUrl: string;
  requiresApiKey: boolean;
}

export const BUILT_IN_PROVIDERS: LLMProvider[] = [
  {
    id: "lovable",
    name: "Lovable AI (Free Default)",
    models: [
      "google/gemini-3-flash-preview",
      "google/gemini-2.5-pro",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-flash-lite",
      "google/gemini-3.1-pro-preview",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano",
      "openai/gpt-5.2",
    ],
    baseUrl: "https://ai.gateway.lovable.dev/v1/chat/completions",
    requiresApiKey: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    models: ["gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", "o1", "o1-mini"],
    baseUrl: "https://api.openai.com/v1/chat/completions",
    requiresApiKey: true,
  },
  {
    id: "google",
    name: "Google Gemini",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    requiresApiKey: true,
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307", "claude-3.5-sonnet-20241022"],
    baseUrl: "https://api.anthropic.com/v1/messages",
    requiresApiKey: true,
  },
  {
    id: "groq",
    name: "Groq",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    requiresApiKey: true,
  },
  {
    id: "together",
    name: "Together AI",
    models: ["meta-llama/Llama-3-70b-chat-hf", "mistralai/Mixtral-8x7B-Instruct-v0.1"],
    baseUrl: "https://api.together.xyz/v1/chat/completions",
    requiresApiKey: true,
  },
  {
    id: "custom",
    name: "Custom (OpenAI-Compatible)",
    models: [],
    baseUrl: "",
    requiresApiKey: true,
  },
];

export function getProviderById(id: string): LLMProvider | undefined {
  return BUILT_IN_PROVIDERS.find((p) => p.id === id);
}

export interface LLMConfig {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
}

export async function callLLM(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  model: string,
  provider: string,
  apiKey: string
): Promise<string> {
  const providerConfig = getProviderById(provider);
  const baseUrl = providerConfig?.baseUrl ?? "https://openrouter.ai/api/v1";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    throw new Error(`LLM call failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
