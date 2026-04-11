import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  try {
    const { conversation_id, message_content, agent_id } = await req.json();
    if (!conversation_id || !message_content || !agent_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch existing memories to avoid duplicates
    const { data: existingMemories } = await supabase.from("agent_memories")
      .select("content")
      .eq("agent_id", agent_id)
      .eq("is_compressed", false)
      .order("created_at", { ascending: false })
      .limit(20);

    const existingContext = existingMemories?.map(m => m.content).join("\n") || "";

    // Fetch agent's active tasks for context
    const { data: agentTasks } = await supabase.from("tasks")
      .select("title, status, description")
      .eq("assigned_agent_id", agent_id)
      .in("status", ["pending", "running", "awaiting_approval"])
      .limit(5);

    const taskContext = agentTasks?.map(t => `Task: ${t.title} [${t.status}]`).join("\n") || "";

    let extracted: { memories: { content: string; category: string; confidence: number }[] } = { memories: [] };

    if (LOVABLE_API_KEY) {
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content: `You are Sage, the Memory Intelligence agent for Layaa OS — an AI workforce platform by Layaa AI Private Limited. Your job is to extract meaningful, lasting knowledge from conversations that will help agents serve users better in future sessions.

CLASSIFY each extraction into exactly ONE type:
- "decision" → category "decision" — concrete choices made ("We decided to use Stripe", "Going with PostgreSQL")
- "preference" → category "preference" — user likes/dislikes/defaults ("User prefers markdown", "Always use INR")
- "constraint" → category "process" — limits, budgets, deadlines, rules ("Budget is ₹50k", "Must ship by March")
- "context_fact" → category "company" (or "client_info" / "market_data") — company/project/contact/market facts
- "pattern" → category "process" — recurring processes, workflows, SOPs ("Weekly standup on Monday")

QUALITY RULES:
- Each memory MUST be a complete standalone sentence understandable months later without context
- Minimum 25 characters, maximum 500 characters
- NO questions, agent offers, filler, headings, or fragments
- Returning 0 memories is better than saving vague ones

Do NOT extract information already known:
${existingContext}

Current active tasks for context:
${taskContext}

Return ONLY valid JSON: {"memories": [{"content": "...", "category": "decision|client_info|process|preference|company|market_data|conversation_handoff", "type": "decision|preference|constraint|context_fact|pattern", "confidence": 0.0-1.0}]}`,
            },
            { role: "user", content: message_content },
          ],
        }),
      });

      if (aiResp.ok) {
        const aiData = await aiResp.json();
        const content = aiData.choices?.[0]?.message?.content || "";
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            extracted = JSON.parse(jsonMatch[0]);
          }
        } catch {
          console.log("Sage: Could not parse AI response as JSON");
        }
      }
    }

    // Store extracted memories
    const inserted = [];
    for (const mem of (extracted.memories || [])) {
      const validCategories = ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"];
      const category = validCategories.includes(mem.category) ? mem.category : "preference";
      
      const { data, error } = await supabase.from("agent_memories").insert({
        agent_id,
        content: mem.content,
        category,
        confidence: Math.max(0, Math.min(1, mem.confidence || 0.7)),
        memory_type: "personal",
      }).select("id").single();

      if (!error && data) inserted.push(data.id);
    }

    // Log extraction
    await supabase.from("audit_log").insert({
      actor_id: "sage-system", actor_type: "agent",
      action: "memory_extraction", target_table: "agent_memories",
      payload: { conversation_id, memories_extracted: inserted.length },
    });

    return new Response(JSON.stringify({
      memories_extracted: inserted.length,
      memory_ids: inserted,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Sage error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
