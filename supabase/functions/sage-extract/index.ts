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

    // Use AI to extract meaningful facts/decisions from the message
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
              content: `You are Sage, a memory extraction agent. Analyze the message and extract meaningful facts, decisions, client information, or process knowledge. Return a JSON array of memories. Each memory should have: content (the extracted fact), category (one of: client_info, decision, market_data, process, preference, company, conversation_handoff), confidence (0.0-1.0 based on how certain/important it is). Only extract genuinely useful information. If nothing meaningful, return empty array. Respond ONLY with valid JSON: {"memories": [...]}`,
            },
            { role: "user", content: message_content },
          ],
        }),
      });

      if (aiResp.ok) {
        const aiData = await aiResp.json();
        const content = aiData.choices?.[0]?.message?.content || "";
        try {
          // Try to parse JSON from the response
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

    // Compress old memories (>50 per agent → mark oldest as compressed)
    const { count } = await supabase.from("agent_memories")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agent_id).eq("is_compressed", false);

    if (count && count > 50) {
      const { data: oldest } = await supabase.from("agent_memories")
        .select("id").eq("agent_id", agent_id).eq("is_compressed", false)
        .order("created_at", { ascending: true }).limit(count - 40);

      for (const mem of (oldest ?? [])) {
        await supabase.from("agent_memories").update({ is_compressed: true }).eq("id", mem.id);
      }
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
