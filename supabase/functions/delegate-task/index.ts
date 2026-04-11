import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { fromAgentId, toAgentId, task, conversationId, profileId } = await req.json();
    if (!fromAgentId || !toAgentId || !task) {
      return new Response(JSON.stringify({ error: "Missing fromAgentId, toAgentId, or task" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // Get both agents
    const { data: fromAgent } = await sb.from("agents").select("*").eq("id", fromAgentId).single();
    const { data: toAgent } = await sb.from("agents").select("*").eq("id", toAgentId).single();
    if (!fromAgent || !toAgent) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the target agent's memories and synthesize into instruction format (Sage Memory Intelligence)
    const { data: memories } = await sb.from("agent_memories")
      .select("content, category, confidence")
      .eq("agent_id", toAgentId)
      .eq("is_compressed", false)
      .order("confidence", { ascending: false })
      .limit(20);

    const domainMap: Record<string, string> = { decision: "Decisions", preference: "Preferences", process: "Processes & Constraints", company: "Context", client_info: "Client Info", market_data: "Market Data", conversation_handoff: "Handoffs" };
    const groups: Record<string, string[]> = {};
    for (const m of (memories || [])) { const d = domainMap[m.category] || "General"; if (!groups[d]) groups[d] = []; groups[d].push(`- ${m.content}`); }
    const memoryContext = Object.entries(groups).map(([k, v]) => `### ${k}\n${v.join("\n")}`).join("\n") || "";

    // Get agent KB context
    const { data: kbDocs } = await sb.from("agent_kbs")
      .select("filename, content")
      .eq("agent_id", toAgentId)
      .limit(5);
    const kbContext = kbDocs?.map(d => `[KB: ${d.filename}] ${d.content.slice(0, 2000)}`).join("\n") || "";

    // Call the target agent's LLM
    let apiKey = Deno.env.get("LOVABLE_API_KEY");
    let baseUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
    if (toAgent.custom_api_key && toAgent.custom_api_key.trim() !== "") {
      apiKey = toAgent.custom_api_key;
      if (toAgent.custom_api_base_url && toAgent.custom_api_base_url.trim() !== "") {
        baseUrl = toAgent.custom_api_base_url;
      }
    }

    const MODEL_MAP: Record<string, string> = {
      "gpt-5": "openai/gpt-5", "gpt-5-mini": "openai/gpt-5-mini",
      "gpt-5-nano": "openai/gpt-5-nano", "gemini-2.5-pro": "google/gemini-2.5-pro",
      "gemini-2.5-flash": "google/gemini-2.5-flash", "gemini-3-flash-preview": "google/gemini-3-flash-preview",
    };
    const resolvedModel = MODEL_MAP[toAgent.default_model] || toAgent.default_model;

    // Load project context if this conversation belongs to a project
    let projectContext = "";
    if (conversationId) {
      const { data: conv } = await sb.from("conversations").select("project_id").eq("id", conversationId).maybeSingle();
      if (conv?.project_id) {
        const { data: proj } = await sb.from("projects").select("name, instructions").eq("project_id", conv.project_id).single();
        if (proj) {
          projectContext = `\n[PROJECT CONTEXT — LAYAA OS]\nProject: ${proj.name}\n${proj.instructions || ""}\n[END PROJECT CONTEXT]\n`;
        }
      }
    }

    const systemPrompt = `You are ${toAgent.name}, role: ${toAgent.canonical_role}. ${toAgent.system_prompt || ""}
You have been asked by ${fromAgent.name} (${fromAgent.canonical_role}) to help with a task. You are part of the Layaa OS multi-agent workforce.
${projectContext}
[SAGE MEMORY CONTEXT — LAYAA OS]
${memoryContext || "No memories yet."}
[END SAGE MEMORY]

Your knowledge base:
${kbContext}

Respond professionally and thoroughly.`;

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: resolvedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `[Delegated by ${fromAgent.name}]: ${task}` },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("Delegate AI error:", response.status, t);
      return new Response(JSON.stringify({ error: `AI error: ${response.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response generated.";
    const tokensIn = data.usage?.prompt_tokens || 0;
    const tokensOut = data.usage?.completion_tokens || 0;

    // Update budget
    const totalTokens = tokensIn + tokensOut;
    await sb.from("agents").update({ budget_used: toAgent.budget_used + totalTokens }).eq("id", toAgentId);

    // Log usage
    if (profileId) {
      await sb.from("token_usage_log").insert({
        agent_id: toAgentId, conversation_id: conversationId || null,
        profile_id: profileId, model: resolvedModel,
        tokens_in: tokensIn, tokens_out: tokensOut,
        cost_usd: tokensIn * 0.00001 + tokensOut * 0.00003,
      });
    }

    // If there's a conversation, save as mention_response
    if (conversationId) {
      await sb.from("messages").insert({
        conversation_id: conversationId,
        role: "mention_response",
        content: reply,
        model: resolvedModel,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        mention_agent_id: toAgentId,
      });
    }

    return new Response(JSON.stringify({ reply, agent: toAgent.name, tokens: totalTokens }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("delegate-task error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
