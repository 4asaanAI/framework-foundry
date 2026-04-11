/**
 * Chat Edge Function — with Tool Calling
 *
 * REPLACES: supabase/functions/chat/index.ts
 *
 * Changes from original:
 * 1. Imports tool registry (tools.ts)
 * 2. Passes tools to LLM via function calling
 * 3. Implements tool execution loop (LLM → tool call → execute → feed result back → LLM)
 * 4. Saves tool_result messages to conversation
 * 5. Updated system prompt with formatting rules + no-hallucination rules
 * 6. Streams final text response (non-tool) to client
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getToolDefinitions, executeTool, type ToolCall, type ToolContext } from "./tools.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_TOOL_ROUNDS = 5; // safety: max tool call loops before forcing text response

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, model, agentName, agentRole, systemPrompt, agentId, conversationId, profileId } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // ─── 0. Rate limiting (10 req/min per profile) ──────────────────────────
    if (profileId) {
      const rateLimitKey = `rate_limit_${profileId}`;
      const { data: rlSetting } = await sb.from("settings").select("value").eq("key", rateLimitKey).maybeSingle();
      const now = Date.now();
      let rl = { count: 0, window_start: now };
      if (rlSetting?.value) {
        try { rl = JSON.parse(rlSetting.value); } catch { /* reset */ }
      }
      // Reset window if >60 seconds old
      if (now - rl.window_start > 60000) {
        rl = { count: 1, window_start: now };
      } else {
        rl.count++;
      }
      // Enforce limit
      if (rl.count > 10) {
        const retryAfter = Math.ceil((60000 - (now - rl.window_start)) / 1000);
        return new Response(JSON.stringify({ error: "Rate limited — please wait and try again" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(retryAfter) },
        });
      }
      // Update rate limit counter
      await sb.from("settings").upsert({ key: rateLimitKey, value: JSON.stringify(rl) }, { onConflict: "key" });
    }

    // ─── 1. Resolve API key + model ────────────────────────────────────────
    let apiKey = Deno.env.get("LOVABLE_API_KEY");
    let baseUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
    let resolvedModel = model || "google/gemini-3-flash-preview";

    let agentHasCustom = false;
    if (agentId) {
      const { data: agent } = await sb.from("agents").select("custom_api_key, custom_api_base_url").eq("id", agentId).single();
      if (agent?.custom_api_key && agent.custom_api_key.trim() !== "") {
        apiKey = agent.custom_api_key;
        agentHasCustom = true;
        if (agent.custom_api_base_url && agent.custom_api_base_url.trim() !== "") {
          baseUrl = agent.custom_api_base_url;
        }
      }
    }

    if (!agentHasCustom) {
      const { data: settings } = await sb.from("settings").select("key, value").in("key", ["llm_provider", "llm_model", "llm_api_key", "llm_base_url"]);
      const settingsMap: Record<string, string> = {};
      (settings ?? []).forEach((s: any) => { settingsMap[s.key] = s.value; });
      const globalProvider = settingsMap["llm_provider"] || "lovable";
      if (globalProvider !== "lovable" && settingsMap["llm_api_key"]) {
        apiKey = settingsMap["llm_api_key"];
        if (settingsMap["llm_base_url"]) baseUrl = settingsMap["llm_base_url"];
        if (settingsMap["llm_model"]) resolvedModel = settingsMap["llm_model"];
      }
    }

    if (!apiKey) throw new Error("No API key available");

    // ─── 2. Build context (synthesized memories, KB, tasks) ────────────────
    let memoryContext = "";
    let kbContext = "";

    if (agentId) {
      // Synthesize memories into grouped instruction blocks (Sage Memory Intelligence)
      const { data: memories } = await sb.from("agent_memories")
        .select("content, category, confidence")
        .eq("agent_id", agentId).eq("is_compressed", false)
        .order("confidence", { ascending: false }).limit(40);

      if (memories?.length) {
        // Group by domain for structured injection
        const domainMap: Record<string, string> = {
          decision: "Decision History", preference: "User Preferences",
          process: "Processes & Constraints", company: "Company & Project Context",
          client_info: "Client Intelligence", market_data: "Market & Industry Data",
          conversation_handoff: "Handoff Notes",
        };
        const groups: Record<string, string[]> = {};
        for (const m of memories) {
          const domain = domainMap[m.category] || "General";
          if (!groups[domain]) groups[domain] = [];
          if (groups[domain].length < 15) {
            groups[domain].push(`- ${m.content}`);
          }
        }
        const domainOrder = ["Decision History", "Processes & Constraints", "User Preferences", "Client Intelligence", "Company & Project Context", "Market & Industry Data", "Handoff Notes", "General"];
        const sections = domainOrder
          .filter(d => groups[d]?.length)
          .map(d => `### ${d}\n${groups[d]!.join("\n")}`);

        if (sections.length > 0) {
          memoryContext = `\n\n[SAGE MEMORY CONTEXT — LAYAA OS]\nThe following are synthesized facts, decisions, preferences, and constraints from your conversation history on the Layaa AI platform. Treat these as authoritative context. Apply them automatically — do not re-ask about settled decisions or known preferences.\n\n${sections.join("\n\n")}\n\n_${memories.length} memories | Powered by Sage Memory Intelligence_\n[END SAGE MEMORY]`;
        }
      }

      const { data: kbDocs } = await sb.from("agent_kbs").select("filename, content").eq("agent_id", agentId).limit(5);
      if (kbDocs?.length) {
        kbContext = "\n\nYour knowledge base documents:\n" +
          kbDocs.map((d: any) => `[${d.filename}] ${d.content.slice(0, 3000)}`).join("\n---\n");
      }

      const { data: tasks } = await sb.from("tasks")
        .select("title, status, description, due_date")
        .eq("assigned_agent_id", agentId)
        .in("status", ["pending", "running", "awaiting_approval"]).limit(10);

      if (tasks?.length) {
        memoryContext += "\n\nYour active tasks:\n" +
          tasks.map((t: any) => `- [${t.status}] ${t.title}${t.due_date ? ` (due: ${t.due_date})` : ""}`).join("\n");
      }
    }

    // ─── 2b. Load project context if conversation is scoped to a project ────
    let projectContext = "";
    if (conversationId) {
      const { data: conv } = await sb.from("conversations").select("project_id").eq("id", conversationId).single();
      if (conv?.project_id) {
        const { data: project } = await sb.from("projects").select("name, description, instructions").eq("project_id", conv.project_id).single();
        if (project) {
          const projSections: string[] = [];
          projSections.push(`## Project: ${project.name}`);
          if (project.description) projSections.push(project.description);
          if (project.instructions) projSections.push(`\n### Project Instructions\n${project.instructions}`);

          // Load project knowledge chunks
          const { data: pkChunks } = await sb.from("project_knowledge_chunks")
            .select("content").eq("project_id", conv.project_id).limit(8);
          if (pkChunks?.length) {
            projSections.push(`\n### Project Knowledge\n${pkChunks.map((c: any) => c.content.slice(0, 1500)).join("\n---\n")}`);
          }

          // Load project-scoped context memories
          const { data: workCtx } = await sb.from("work_contexts").select("context_id").eq("project_id", conv.project_id).limit(1).maybeSingle();
          if (workCtx) {
            const { data: ctxMems } = await sb.from("context_memories").select("key, value").eq("context_id", workCtx.context_id).order("updated_at", { ascending: false }).limit(15);
            if (ctxMems?.length) {
              projSections.push(`\n### Project Memory\n${ctxMems.map((m: any) => `- **${m.key}**: ${m.value}`).join("\n")}`);
            }
          }

          projectContext = `\n\n[PROJECT CONTEXT — LAYAA OS]\nYou are working within a specific project on the Layaa AI platform. Scope all responses to this project. Do not reference other projects.\n\n${projSections.join("\n")}\n\n_Project context loaded by Layaa OS_\n[END PROJECT CONTEXT]`;
        }
      }
    }

    // ─── 3. System prompt with formatting + tool rules ─────────────────────
    const defaultSystem = `You are ${agentName || "an AI assistant"}, whose role is: ${agentRole || "helpful assistant"}. ${systemPrompt || ""}

RESPONSE STYLE:
- Be conversational and natural. Write like a knowledgeable colleague, not a report generator.
- Use short paragraphs. Break up walls of text with line breaks.
- Use **bold** for key terms only when it genuinely helps — don't bold everything.
- Use bullet points when listing 3+ items, steps, or options — not for single statements.
- Use headings (## or ###) only for longer responses that cover multiple distinct topics.
- Use tables only for actual comparisons or structured data, not for simple lists.
- Be comprehensive but not verbose. Answer the full question without padding.
- Every response should feel well-thought-out and complete, not rushed or formulaic.

TOOL USAGE RULES (critical):
- You have access to tools for creating tasks, approvals, saving memories, delegating to agents, and more.
- When the user asks you to DO something (create a task, save info, send to approvals, delegate), USE THE APPROPRIATE TOOL. Do not just describe what you would do — actually call the tool.
- When a tool executes successfully, report the result concisely. Do not fabricate task IDs, URLs, or deep links.
- If a tool requires approval (like sending emails), it will be automatically routed to the Approvals board. Inform the user it's pending there.
- Never claim you did something if no tool was called. If you cannot do something, say so clearly.

When you learn important facts, decisions, or preferences from the conversation, use the save_memory tool to store them.${projectContext}${memoryContext}${kbContext}`;

    // ─── 3b. Inject connected connector capabilities ─────────────────────
    let connectorContext = "";
    const { data: connectedConnectors } = await sb.from("credential_vault")
      .select("name, provider").eq("is_configured", true);
    if (connectedConnectors && connectedConnectors.length > 0) {
      const names = connectedConnectors.map((c: any) => c.name).join(", ");
      connectorContext = `\n\nCONNECTED INTEGRATIONS: ${names}. You can reference these services in your responses. If a user asks you to perform an action through one of these services (send email, post to Slack, create calendar event, etc.), acknowledge that the integration is connected and use the appropriate tool or suggest the action. If an integration is NOT in this list, inform the user it's not connected yet.`;
    }
    const fullSystem = defaultSystem + connectorContext;

    // ─── 4. Normalize model ───────────────────────────────────────────────
    const MODEL_MAP: Record<string, string> = {
      "gpt-5": "openai/gpt-5", "gpt-5-mini": "openai/gpt-5-mini",
      "gpt-5-nano": "openai/gpt-5-nano", "gpt-5.2": "openai/gpt-5.2",
      "gemini-2.5-pro": "google/gemini-2.5-pro", "gemini-2.5-flash": "google/gemini-2.5-flash",
      "gemini-2.5-flash-lite": "google/gemini-2.5-flash-lite",
      "gemini-3-flash-preview": "google/gemini-3-flash-preview",
      "gemini-3.1-pro-preview": "google/gemini-3.1-pro-preview",
      // Anthropic models not supported by Lovable AI Gateway — map to supported alternatives
      "claude-sonnet-4-6": "google/gemini-3-flash-preview",
      "claude-opus-4-6": "openai/gpt-5",
      "claude-haiku-4-5": "openai/gpt-5-nano",
      "claude-3-opus-20240229": "openai/gpt-5",
      "claude-3-sonnet-20240229": "google/gemini-3-flash-preview",
      "claude-3-haiku-20240307": "openai/gpt-5-nano",
      "claude-3.5-sonnet-20241022": "google/gemini-3-flash-preview",
    };
    resolvedModel = MODEL_MAP[resolvedModel] || resolvedModel;

    // ─── 5. Tool-calling loop (non-streaming) ─────────────────────────────
    // First, do a non-streaming call with tools to see if the LLM wants to call tools.
    // If it returns tool_calls, execute them and loop.
    // Once it returns a text response (no tool_calls), stream it.

    const toolDefs = getToolDefinitions();
    const toolCtx: ToolContext = {
      supabase: sb, agentId: agentId || "", agentName: agentName || "Assistant",
      profileId: profileId || "", conversationId: conversationId || "",
    };

    // ─── 5b. Conversation history truncation (sliding window: last 40 messages) ──
    const MAX_HISTORY = 40;
    let truncatedMessages = messages;
    if (messages.length > MAX_HISTORY) {
      const oldMessages = messages.slice(0, messages.length - MAX_HISTORY);
      const recentMessages = messages.slice(-MAX_HISTORY);
      // Summarize older messages into a context note
      const oldSummary = oldMessages
        .filter((m: any) => m.role === "user")
        .slice(-5)
        .map((m: any) => m.content.slice(0, 100))
        .join("; ");
      truncatedMessages = [
        { role: "system", content: `[Earlier conversation summary: ${oldSummary || "General discussion"}. ${oldMessages.length} older messages truncated for context window efficiency.]` },
        ...recentMessages,
      ];
    }

    // ─── 5c. Vision: convert image attachments to multi-modal content ───────
    const processedMessages = truncatedMessages.map((msg: any) => {
      if (msg.role === "user" && msg.attachments && Array.isArray(msg.attachments)) {
        const imageAttachments = msg.attachments.filter((a: any) => a.type?.startsWith("image/") && a.url);
        if (imageAttachments.length > 0) {
          const content: any[] = [{ type: "text", text: msg.content || "" }];
          for (const img of imageAttachments) {
            content.push({ type: "image_url", image_url: { url: img.url } });
          }
          return { ...msg, content };
        }
      }
      return msg;
    });

    let conversationMessages = [
      { role: "system", content: fullSystem },
      ...processedMessages,
    ];

    let totalToolTokens = 0;
    let toolCallsMade: { name: string; result: string }[] = [];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      // Non-streaming call with tools
      const toolResponse = await fetch(baseUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: resolvedModel,
          messages: conversationMessages,
          tools: toolDefs,
          tool_choice: "auto",
        }),
      });

      if (!toolResponse.ok) {
        // If tools aren't supported by this provider, fall through to streaming without tools
        if (toolResponse.status === 400 || toolResponse.status === 422) {
          console.log("Provider doesn't support tool calling, falling through to text-only");
          break;
        }
        const errText = await toolResponse.text();
        console.error("Tool call error:", toolResponse.status, errText);
        break;
      }

      const toolData = await toolResponse.json();
      const choice = toolData.choices?.[0];
      totalToolTokens += (toolData.usage?.prompt_tokens || 0) + (toolData.usage?.completion_tokens || 0);

      // Check if LLM wants to call tools
      const toolCalls = choice?.message?.tool_calls;
      if (!toolCalls || toolCalls.length === 0) {
        // No tool calls — LLM returned a text response. We'll stream this.
        // But since we already have the response, we can return it directly.
        const textContent = choice?.message?.content || "";

        if (textContent) {
          // Save tool results as context in the conversation
          if (toolCallsMade.length > 0) {
            // Save a hidden tool_result message summarizing what was done
            await sb.from("messages").insert({
              conversation_id: conversationId,
              role: "tool_result",
              content: toolCallsMade.map((tc) => `**${tc.name}:** ${tc.result}`).join("\n\n"),
              model: resolvedModel,
              tokens_in: 0, tokens_out: 0,
            });
          }

          // Update agent budget
          if (agentId && totalToolTokens > 0) {
            const { data: agent } = await sb.from("agents").select("budget_used").eq("id", agentId).single();
            if (agent) await sb.from("agents").update({ budget_used: agent.budget_used + totalToolTokens }).eq("id", agentId);
            if (profileId) {
              await sb.from("token_usage_log").insert({
                agent_id: agentId, conversation_id: conversationId || null,
                profile_id: profileId, model: resolvedModel,
                tokens_in: toolData.usage?.prompt_tokens || 0,
                tokens_out: toolData.usage?.completion_tokens || 0,
                cost_usd: (() => { const m = resolvedModel.toLowerCase(); const rate = m.includes("opus") || m.includes("gpt-5") && !m.includes("mini") && !m.includes("nano") ? 0.00006 : m.includes("haiku") || m.includes("nano") || m.includes("flash-lite") ? 0.000005 : 0.00002; return ((toolData.usage?.prompt_tokens || 0) + (toolData.usage?.completion_tokens || 0)) * rate; })(),
              });
            }
          }

          // Return as SSE stream (for compatibility with existing frontend)
          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            start(controller) {
              // Send the content as a single SSE chunk
              const chunk = JSON.stringify({
                choices: [{ delta: { content: textContent }, index: 0 }],
              });
              controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));

              // Send usage
              const usageChunk = JSON.stringify({
                choices: [{ delta: {}, index: 0, finish_reason: "stop" }],
                usage: toolData.usage,
              });
              controller.enqueue(encoder.encode(`data: ${usageChunk}\n\n`));
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            },
          });

          return new Response(stream, {
            headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
          });
        }
        break;
      }

      // Execute each tool call
      for (const tc of toolCalls) {
        let args: Record<string, unknown> = {};
        try {
          args = typeof tc.function.arguments === "string" ? JSON.parse(tc.function.arguments) : tc.function.arguments;
        } catch {
          args = {};
        }

        const toolCall: ToolCall = { id: tc.id, name: tc.function.name, arguments: args };
        const result = await executeTool(toolCall, toolCtx);

        toolCallsMade.push({ name: result.name, result: result.result });

        // Add tool result to conversation for next LLM round
        conversationMessages.push({
          role: "assistant",
          content: null as any,
          tool_calls: [{ id: tc.id, type: "function", function: { name: tc.function.name, arguments: typeof tc.function.arguments === "string" ? tc.function.arguments : JSON.stringify(tc.function.arguments) } }],
        } as any);

        conversationMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: result.result,
        } as any);
      }

      // Continue loop — LLM will see tool results and may call more tools or respond with text
    }

    // ─── 6. Fallback: streaming without tools (if tool calling failed or provider doesn't support it) ───
    const streamResponse = await fetch(baseUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: resolvedModel,
        messages: conversationMessages,
        stream: true,
        stream_options: { include_usage: true },
      }),
    });

    if (!streamResponse.ok) {
      if (streamResponse.status === 429) return new Response(JSON.stringify({ error: "Rate limits exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await streamResponse.text();
      console.error("AI gateway error:", streamResponse.status, t);
      return new Response(JSON.stringify({ error: `AI gateway error: ${streamResponse.status}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Stream passthrough with usage capture
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = streamResponse.body!.getReader();
    const decoder = new TextDecoder();

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
                if (parsed.usage) { totalIn = parsed.usage.prompt_tokens || 0; totalOut = parsed.usage.completion_tokens || 0; }
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullContent += content;
              } catch { /* partial JSON */ }
            }
          }
          await writer.write(value);
        }

        // Budget + token logging
        const totalTokens = totalIn + totalOut + totalToolTokens;
        if (agentId && totalTokens > 0) {
          const { data: agent } = await sb.from("agents").select("budget_used").eq("id", agentId).single();
          if (agent) await sb.from("agents").update({ budget_used: agent.budget_used + totalTokens }).eq("id", agentId);
          if (profileId) {
            await sb.from("token_usage_log").insert({
              agent_id: agentId, conversation_id: conversationId || null,
              profile_id: profileId, model: resolvedModel,
              tokens_in: totalIn, tokens_out: totalOut,
              cost_usd: (() => { const m = resolvedModel.toLowerCase(); const rate = m.includes("opus") || (m.includes("gpt-5") && !m.includes("mini") && !m.includes("nano")) ? 0.00006 : m.includes("haiku") || m.includes("nano") || m.includes("flash-lite") ? 0.000005 : 0.00002; return (totalIn + totalOut) * rate; })(),
            });
          }
        }

        // ── Sage Memory Intelligence: auto-extract memories from conversation ──
        if (agentId && fullContent && fullContent.length > 50) {
          try {
            const extractKey = Deno.env.get("LOVABLE_API_KEY");
            if (extractKey) {
              // Fetch existing memories for dedup
              const { data: existingMems } = await sb.from("agent_memories")
                .select("content").eq("agent_id", agentId).eq("is_compressed", false)
                .order("created_at", { ascending: false }).limit(30);
              const existingList = (existingMems || []).map((m: any) => m.content).join("\n");

              const extractResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                method: "POST",
                headers: { Authorization: `Bearer ${extractKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "google/gemini-2.5-flash-lite",
                  messages: [{
                    role: "system",
                    content: `You are Sage, the Memory Intelligence agent for Layaa OS — an AI workforce platform by Layaa AI. Your job is to extract meaningful, lasting knowledge from conversations.

CLASSIFY each extraction into exactly ONE type:
- "decision" — concrete choices made ("We decided to use Stripe", "Going with PostgreSQL")
- "preference" — user likes/dislikes/defaults ("User prefers markdown", "Always use INR pricing")
- "constraint" — limits, budgets, deadlines, rules ("Budget is ₹50k", "Must ship by March", "No external funding")
- "context_fact" — company/project/contact facts ("Founded Dec 2025", "MRR is $12k", "Contact: john@abc.com")
- "pattern" — recurring processes, workflows, SOPs ("All proposals need sign-off", "Weekly standup on Monday")

Map each type to a DB category:
- decision → "decision"
- preference → "preference"
- constraint → "process"
- context_fact → "company" (or "client_info" for client-specific, "market_data" for market facts)
- pattern → "process"

QUALITY RULES:
- Each memory MUST be a complete, standalone sentence understandable months later without context
- Minimum 25 characters, maximum 500 characters
- NO questions, agent offers, filler, headings, or fragments
- Returning 0 memories is better than saving vague ones
- Do NOT extract anything already known:
${existingList || "(no existing memories)"}

Return ONLY valid JSON: {"memories": [{"content": "...", "category": "decision|client_info|process|preference|company|market_data|conversation_handoff", "type": "decision|preference|constraint|context_fact|pattern", "confidence": 0.0-1.0}]}`,
                  }, { role: "user", content: fullContent }],
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
                    if (mem.confidence >= 0.75 && mem.content && mem.content.length >= 25) {
                      // Dedup check: skip if >80% similar to any existing memory
                      const isDuplicate = (existingMems || []).some((e: any) => {
                        const a = mem.content.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ");
                        const b = e.content.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ");
                        const setA = new Set(a); const setB = new Set(b);
                        let overlap = 0; for (const t of setA) { if (setB.has(t)) overlap++; }
                        return (2 * overlap) / (setA.size + setB.size) > 0.8;
                      });
                      if (isDuplicate) continue;

                      await sb.from("agent_memories").insert({
                        agent_id: agentId, content: mem.content,
                        category: validCats.includes(mem.category) ? mem.category : "preference",
                        confidence: Math.max(0, Math.min(1, mem.confidence)), memory_type: "personal",
                      });
                    }
                  }
                }
              }
            }
          } catch (e) { console.error("[Sage] Memory extract error:", e); }
        }
      } catch (e) { console.error("Stream error:", e); }
      finally { await writer.close(); }
    })();

    return new Response(readable, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });

  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
