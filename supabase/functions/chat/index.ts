import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, model, agentName, agentRole, systemPrompt, agentId, conversationId, profileId } = await req.json();

    // Resolve which API key + base URL to use
    let apiKey = Deno.env.get("LOVABLE_API_KEY");
    let baseUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
    let customKeyUsed = false;

    // Check if agent has a custom API key
    if (agentId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, serviceKey);
      const { data: agent } = await sb.from("agents").select("custom_api_key, custom_api_base_url").eq("id", agentId).single();
      if (agent?.custom_api_key && agent.custom_api_key.trim() !== "") {
        apiKey = agent.custom_api_key;
        customKeyUsed = true;
        if (agent.custom_api_base_url && agent.custom_api_base_url.trim() !== "") {
          baseUrl = agent.custom_api_base_url;
        }
      }
    }

    if (!apiKey) throw new Error("No API key available — configure LOVABLE_API_KEY or set a custom key on the agent");

    const defaultSystem = `You are ${agentName || "an AI assistant"}, whose role is: ${agentRole || "helpful assistant"}. ${systemPrompt || ""}
Keep answers clear, concise, and professional. Use markdown formatting when helpful.`;

    // Normalize model names
    const MODEL_MAP: Record<string, string> = {
      "gpt-5": "openai/gpt-5",
      "gpt-5-mini": "openai/gpt-5-mini",
      "gpt-5-nano": "openai/gpt-5-nano",
      "gpt-5.2": "openai/gpt-5.2",
      "gemini-2.5-pro": "google/gemini-2.5-pro",
      "gemini-2.5-flash": "google/gemini-2.5-flash",
      "gemini-2.5-flash-lite": "google/gemini-2.5-flash-lite",
      "gemini-3-flash-preview": "google/gemini-3-flash-preview",
      "gemini-3.1-pro-preview": "google/gemini-3.1-pro-preview",
    };
    const rawModel = model || "google/gemini-3-flash-preview";
    const resolvedModel = MODEL_MAP[rawModel] || rawModel;

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: resolvedModel,
        messages: [
          { role: "system", content: defaultSystem },
          ...messages,
        ],
        stream: true,
        // Include usage info in stream for token tracking
        stream_options: { include_usage: true },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: `AI gateway error: ${response.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // We need to intercept the stream to capture usage stats at the end
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    (async () => {
      let textBuffer = "";
      let totalIn = 0;
      let totalOut = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          textBuffer += chunk;
          
          // Parse for usage info
          let newlineIndex: number;
          const processedLines: string[] = [];
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            const line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);
            
            if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
              try {
                const parsed = JSON.parse(line.slice(6).trim());
                if (parsed.usage) {
                  totalIn = parsed.usage.prompt_tokens || 0;
                  totalOut = parsed.usage.completion_tokens || 0;
                }
              } catch { /* partial JSON, pass through */ }
            }
          }
          
          // Pass through to client
          await writer.write(value);
        }
        
        // Process remaining buffer
        if (textBuffer.trim()) {
          for (const line of textBuffer.split("\n")) {
            if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
              try {
                const parsed = JSON.parse(line.slice(6).trim());
                if (parsed.usage) {
                  totalIn = parsed.usage.prompt_tokens || 0;
                  totalOut = parsed.usage.completion_tokens || 0;
                }
              } catch { /* ignore */ }
            }
          }
        }

        // After stream completes, update agent budget and log usage
        if (agentId && (totalIn > 0 || totalOut > 0)) {
          const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
          const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
          const sb = createClient(supabaseUrl, serviceKey);
          
          const totalTokens = totalIn + totalOut;
          
          // Update agent budget_used
          const { data: agent } = await sb.from("agents").select("budget_used").eq("id", agentId).single();
          if (agent) {
            await sb.from("agents").update({ budget_used: agent.budget_used + totalTokens }).eq("id", agentId);
          }
          
          // Log usage
          if (profileId) {
            await sb.from("token_usage_log").insert({
              agent_id: agentId,
              conversation_id: conversationId || null,
              profile_id: profileId,
              model: resolvedModel,
              tokens_in: totalIn,
              tokens_out: totalOut,
              cost_usd: (totalIn * 0.00001 + totalOut * 0.00003), // approximate pricing
            });
          }
        }
      } catch (e) {
        console.error("Stream processing error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
