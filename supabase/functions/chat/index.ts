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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // Resolve which API key + base URL to use
    let apiKey = Deno.env.get("LOVABLE_API_KEY");
    let baseUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";

    // Check if agent has a custom API key
    if (agentId) {
      const { data: agent } = await sb.from("agents").select("custom_api_key, custom_api_base_url").eq("id", agentId).single();
      if (agent?.custom_api_key && agent.custom_api_key.trim() !== "") {
        apiKey = agent.custom_api_key;
        if (agent.custom_api_base_url && agent.custom_api_base_url.trim() !== "") {
          baseUrl = agent.custom_api_base_url;
        }
      }
    }

    if (!apiKey) throw new Error("No API key available — configure LOVABLE_API_KEY or set a custom key on the agent");

    // Fetch agent memories for context
    let memoryContext = "";
    let kbContext = "";
    if (agentId) {
      const { data: memories } = await sb.from("agent_memories")
        .select("content, category, confidence")
        .eq("agent_id", agentId)
        .eq("is_compressed", false)
        .order("created_at", { ascending: false })
        .limit(15);

      if (memories && memories.length > 0) {
        memoryContext = "\n\nYour relevant memories:\n" +
          memories.map(m => `- [${m.category}] (confidence: ${m.confidence}) ${m.content}`).join("\n");
      }

      // Fetch KB docs
      const { data: kbDocs } = await sb.from("agent_kbs")
        .select("filename, content")
        .eq("agent_id", agentId)
        .limit(5);

      if (kbDocs && kbDocs.length > 0) {
        kbContext = "\n\nYour knowledge base documents:\n" +
          kbDocs.map(d => `[${d.filename}] ${d.content.slice(0, 3000)}`).join("\n---\n");
      }

      // Fetch active tasks assigned to this agent
      const { data: tasks } = await sb.from("tasks")
        .select("title, status, description, due_date")
        .eq("assigned_agent_id", agentId)
        .in("status", ["pending", "running", "awaiting_approval"])
        .limit(10);

      if (tasks && tasks.length > 0) {
        memoryContext += "\n\nYour active tasks:\n" +
          tasks.map(t => `- [${t.status}] ${t.title}${t.due_date ? ` (due: ${t.due_date})` : ""}`).join("\n");
      }
    }

    const defaultSystem = `You are ${agentName || "an AI assistant"}, whose role is: ${agentRole || "helpful assistant"}. ${systemPrompt || ""}
Keep answers clear, concise, and professional. Use markdown formatting when helpful.
When you learn important facts, decisions, or preferences from the conversation, remember them — they will be extracted automatically.${memoryContext}${kbContext}`;

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
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: `AI gateway error: ${response.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Intercept stream to capture usage stats
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    (async () => {
      let textBuffer = "";
      let totalIn = 0;
      let totalOut = 0;
      let fullContent = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          textBuffer += chunk;
          
          let newlineIndex: number;
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
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullContent += content;
              } catch { /* partial JSON */ }
            }
          }
          
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
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullContent += content;
              } catch { /* ignore */ }
            }
          }
        }

        // After stream completes, update agent budget and log usage
        if (agentId && (totalIn > 0 || totalOut > 0)) {
          const totalTokens = totalIn + totalOut;
          
          const { data: agent } = await sb.from("agents").select("budget_used").eq("id", agentId).single();
          if (agent) {
            await sb.from("agents").update({ budget_used: agent.budget_used + totalTokens }).eq("id", agentId);
          }
          
          if (profileId) {
            await sb.from("token_usage_log").insert({
              agent_id: agentId,
              conversation_id: conversationId || null,
              profile_id: profileId,
              model: resolvedModel,
              tokens_in: totalIn,
              tokens_out: totalOut,
              cost_usd: (totalIn * 0.00001 + totalOut * 0.00003),
            });
          }
        }

        // Auto-extract memories from the agent's response (self-memory update)
        if (agentId && fullContent && fullContent.length > 50) {
          try {
            const extractKey = Deno.env.get("LOVABLE_API_KEY");
            if (extractKey) {
              const extractResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                method: "POST",
                headers: { Authorization: `Bearer ${extractKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "google/gemini-2.5-flash-lite",
                  messages: [{
                    role: "system",
                    content: `You are a memory extraction agent. Analyze the AI assistant's response and extract important facts, decisions, commitments, or learnings that should be remembered for future conversations. Return ONLY valid JSON: {"memories": [{"content": "...", "category": "decision|client_info|process|preference|company|market_data|conversation_handoff", "confidence": 0.0-1.0}]}. If nothing worth remembering, return {"memories": []}.`,
                  }, {
                    role: "user",
                    content: fullContent,
                  }],
                }),
              });

              if (extractResp.ok) {
                const extractData = await extractResp.json();
                const extractContent = extractData.choices?.[0]?.message?.content || "";
                const jsonMatch = extractContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const extracted = JSON.parse(jsonMatch[0]);
                  const validCats = ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"];
                  for (const mem of (extracted.memories || [])) {
                    if (mem.confidence >= 0.6) {
                      await sb.from("agent_memories").insert({
                        agent_id: agentId,
                        content: mem.content,
                        category: validCats.includes(mem.category) ? mem.category : "preference",
                        confidence: Math.max(0, Math.min(1, mem.confidence)),
                        memory_type: "personal",
                      });
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.error("Memory auto-extract error:", e);
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
