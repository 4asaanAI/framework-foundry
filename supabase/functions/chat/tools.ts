/**
 * Tool Registry — defines all tools agents can call.
 *
 * Each tool has:
 * - name: unique identifier (used in LLM function calling)
 * - description: what the tool does (sent to LLM)
 * - parameters: JSON Schema (sent to LLM for parameter extraction)
 * - tier: approval tier (1=auto, 2=manual, 3=admin)
 * - handler: server-side function that executes the tool
 *
 * IMPORTANT: Handlers run server-side in the Edge Function with service_role access.
 * The approval system gates execution for tier 2/3 tools.
 */

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
  tier: 1 | 2 | 3;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  tool_call_id: string;
  name: string;
  success: boolean;
  result: string; // human-readable summary
  data?: Record<string, unknown>; // structured data
  approval_required?: boolean;
  approval_id?: string;
}

export interface ToolContext {
  supabase: SupabaseClient;
  agentId: string;
  agentName: string;
  profileId: string;
  conversationId: string;
}

type ToolHandler = (args: Record<string, unknown>, ctx: ToolContext) => Promise<ToolResult>;

interface ToolRegistryEntry extends ToolDefinition {
  handler: ToolHandler;
}

// ─── Tool Definitions ──────────────────────────────────────────────────────────

const TOOLS: ToolRegistryEntry[] = [

  // ── TASKS ────────────────────────────────────────────────────────────────

  {
    name: "create_task",
    description: "Create a new task and assign it to an agent. Use when the user asks to add a task, to-do, action item, or work item to the task board or CRM board.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short task title (under 80 chars)" },
        description: { type: "string", description: "Detailed task description" },
        assigned_agent_name: { type: "string", description: "Name of the agent to assign (e.g. 'Yuvaan', 'Rohit'). Use your own name if self-assigning." },
        status: { type: "string", enum: ["pending", "running", "completed"], description: "Initial status. Default: pending" },
        due_date: { type: "string", description: "Due date in ISO 8601 format (YYYY-MM-DD). Optional." },
        crm_board_shared: { type: "boolean", description: "Whether to show this task on the CRM Board. Default: false" },
      },
      required: ["title", "description"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      // Resolve agent ID from name
      let assignedAgentId = ctx.agentId; // default: self
      if (args.assigned_agent_name) {
        const { data: agent } = await ctx.supabase
          .from("agents")
          .select("id, name")
          .ilike("name", String(args.assigned_agent_name))
          .limit(1)
          .single();
        if (agent) assignedAgentId = agent.id;
      }

      const { data: task, error } = await ctx.supabase.from("tasks").insert({
        title: String(args.title),
        description: String(args.description || ""),
        assigned_agent_id: assignedAgentId,
        created_by_profile: ctx.profileId,
        created_by_agent_id: ctx.agentId,
        status: String(args.status || "pending"),
        due_date: args.due_date ? new Date(String(args.due_date)).toISOString() : null,
        crm_board_shared: Boolean(args.crm_board_shared ?? false),
      }).select("id, title, status").single();

      if (error) return { tool_call_id: "", name: "create_task", success: false, result: `Failed to create task: ${error.message}` };

      // Audit log
      await ctx.supabase.from("audit_log").insert({
        actor_type: "agent",
        actor_id: ctx.agentId,
        action: "create_task",
        target_table: "tasks",
        target_id: task.id,
        payload: { title: args.title, assigned_to: assignedAgentId, created_via: "tool_call" },
      });

      return {
        tool_call_id: "",
        name: "create_task",
        success: true,
        result: `Task "${task.title}" created (ID: ${task.id}, status: ${task.status})${args.crm_board_shared ? " — visible on CRM Board" : ""}`,
        data: task,
      };
    },
  },

  {
    name: "update_task",
    description: "Update an existing task's status, description, or assignment. Use when asked to mark a task done, reassign it, or change its details.",
    parameters: {
      type: "object",
      properties: {
        task_id: { type: "string", description: "The task ID to update" },
        title: { type: "string", description: "New title (optional)" },
        status: { type: "string", enum: ["pending", "running", "completed", "failed", "awaiting_approval"], description: "New status" },
        description: { type: "string", description: "Updated description" },
        assigned_agent_name: { type: "string", description: "Reassign to this agent" },
        due_date: { type: "string", description: "New due date (YYYY-MM-DD)" },
      },
      required: ["task_id"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      const updates: Record<string, unknown> = {};
      if (args.title) updates.title = String(args.title);
      if (args.status) updates.status = String(args.status);
      if (args.description) updates.description = String(args.description);
      if (args.due_date) updates.due_date = new Date(String(args.due_date)).toISOString();

      if (args.assigned_agent_name) {
        const { data: agent } = await ctx.supabase
          .from("agents").select("id").ilike("name", String(args.assigned_agent_name)).limit(1).single();
        if (agent) updates.assigned_agent_id = agent.id;
      }

      const { data: task, error } = await ctx.supabase
        .from("tasks").update(updates).eq("id", String(args.task_id)).select("id, title, status").single();

      if (error) return { tool_call_id: "", name: "update_task", success: false, result: `Failed: ${error.message}` };
      return { tool_call_id: "", name: "update_task", success: true, result: `Task "${task.title}" updated → ${task.status}`, data: task };
    },
  },

  {
    name: "list_tasks",
    description: "List tasks, optionally filtered by status or assigned agent. Use when asked about current tasks, to-dos, or work items.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["pending", "running", "completed", "failed", "awaiting_approval"], description: "Filter by status" },
        assigned_agent_name: { type: "string", description: "Filter by assigned agent name" },
        limit: { type: "number", description: "Max results (default 10)" },
      },
    },
    tier: 1,
    handler: async (args, ctx) => {
      let query = ctx.supabase.from("tasks").select("id, title, status, due_date, assigned_agent_id, created_at").order("created_at", { ascending: false }).limit(Number(args.limit || 10));

      if (args.status) query = query.eq("status", String(args.status));
      if (args.assigned_agent_name) {
        const { data: agent } = await ctx.supabase.from("agents").select("id").ilike("name", String(args.assigned_agent_name)).limit(1).single();
        if (agent) query = query.eq("assigned_agent_id", agent.id);
      }

      const { data: tasks, error } = await query;
      if (error) return { tool_call_id: "", name: "list_tasks", success: false, result: `Failed: ${error.message}` };

      const summary = (tasks || []).map((t: any) => `- [${t.status}] ${t.title}${t.due_date ? ` (due: ${t.due_date.split('T')[0]})` : ""}`).join("\n");
      return { tool_call_id: "", name: "list_tasks", success: true, result: tasks?.length ? `Found ${tasks.length} tasks:\n${summary}` : "No tasks found matching the criteria.", data: { tasks, count: tasks?.length || 0 } };
    },
  },

  // ── APPROVALS ────────────────────────────────────────────────────────────

  {
    name: "create_approval",
    description: "Submit an action for human approval. Use when an action needs the founder/admin to review and approve before execution. Examples: sending external emails, making commitments, financial decisions, publishing content.",
    parameters: {
      type: "object",
      properties: {
        action_type: { type: "string", description: "Type of action (e.g. 'send_email', 'publish_content', 'financial_decision', 'external_commitment', 'schedule_meeting')" },
        action_description: { type: "string", description: "Clear description of what needs approval" },
        action_payload: { type: "object", description: "Structured data for the action (e.g. email recipients, content draft, meeting details)" },
      },
      required: ["action_type", "action_description"],
    },
    tier: 1, // Creating the approval itself is auto — the CONTENT awaits review
    handler: async (args, ctx) => {
      const { data: approval, error } = await ctx.supabase.from("approvals").insert({
        requesting_agent_id: ctx.agentId,
        profile_id: ctx.profileId,
        action_type: String(args.action_type),
        action_description: String(args.action_description),
        action_payload: args.action_payload || {},
        status: "pending",
        conversation_id: ctx.conversationId,
      }).select("id, action_type, status").single();

      if (error) return { tool_call_id: "", name: "create_approval", success: false, result: `Failed to create approval: ${error.message}` };

      // Create notification
      await ctx.supabase.from("notifications").insert({
        profile_id: ctx.profileId,
        category: "approval",
        title: `Approval needed: ${args.action_type}`,
        message: String(args.action_description),
        reference_id: approval.id,
        is_read: false,
      });

      await ctx.supabase.from("audit_log").insert({
        actor_type: "agent",
        actor_id: ctx.agentId,
        action: "create_approval",
        target_table: "approvals",
        target_id: approval.id,
        payload: { action_type: args.action_type, description: args.action_description },
      });

      return {
        tool_call_id: "", name: "create_approval", success: true,
        result: `Approval request created (ID: ${approval.id}). Action "${args.action_type}" is now pending in the Approvals board for your review.`,
        data: approval,
      };
    },
  },

  // ── CRM / NOTES ──────────────────────────────────────────────────────────

  {
    name: "save_client_note",
    description: "Save important client/prospect information as a structured note. Use when learning about clients, prospects, partners, or business contacts during conversation.",
    parameters: {
      type: "object",
      properties: {
        client_name: { type: "string", description: "Name of the client/company" },
        contact_person: { type: "string", description: "Primary contact person name" },
        contact_role: { type: "string", description: "Their role/title" },
        summary: { type: "string", description: "Summary of what was discussed or learned" },
        next_steps: { type: "string", description: "Agreed next steps or action items" },
        tags: { type: "array", items: { type: "string" }, description: "Tags like 'prospect', 'partner', 'active_client'" },
      },
      required: ["client_name", "summary"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      // Save as a task on CRM board with full context
      const title = `[Client Note] ${args.client_name}${args.contact_person ? ` — ${args.contact_person}` : ""}`;
      const description = [
        args.contact_person ? `**Contact:** ${args.contact_person}${args.contact_role ? ` (${args.contact_role})` : ""}` : "",
        `**Summary:** ${args.summary}`,
        args.next_steps ? `**Next Steps:** ${args.next_steps}` : "",
        args.tags ? `**Tags:** ${(args.tags as string[]).join(", ")}` : "",
      ].filter(Boolean).join("\n");

      const { data: task, error } = await ctx.supabase.from("tasks").insert({
        title,
        description,
        assigned_agent_id: ctx.agentId,
        created_by_profile: ctx.profileId,
        created_by_agent_id: ctx.agentId,
        status: "completed",
        crm_board_shared: true,
      }).select("id, title").single();

      if (error) return { tool_call_id: "", name: "save_client_note", success: false, result: `Failed: ${error.message}` };
      return { tool_call_id: "", name: "save_client_note", success: true, result: `Client note saved for "${args.client_name}" — visible on CRM Board.`, data: task };
    },
  },

  // ── MEMORY ───────────────────────────────────────────────────────────────

  {
    name: "save_memory",
    description: "Save an important fact, decision, preference, or constraint to Sage Memory on the Layaa OS platform. Use when the user tells you something that should be remembered across future conversations. Also use when the user says 'save this', 'remember this', or 'note this down'.",
    parameters: {
      type: "object",
      properties: {
        content: { type: "string", description: "The fact/decision/preference to remember (one complete standalone sentence, understandable months later)" },
        category: { type: "string", enum: ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"], description: "Memory category" },
        memory_type: { type: "string", enum: ["preference", "decision", "constraint", "context_fact", "pattern"], description: "Classification type" },
        confidence: { type: "number", description: "Confidence 0.0-1.0. Use 1.0 for user-stated facts, 0.8 for inferences." },
      },
      required: ["content", "category"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      // Dedup: check if a similar memory already exists
      const { data: existing } = await ctx.supabase.from("agent_memories")
        .select("id, content, confidence")
        .eq("agent_id", ctx.agentId).eq("is_compressed", false);

      const content = String(args.content);
      const tokensNew = new Set(content.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" "));

      const duplicate = (existing || []).find((e: any) => {
        const tokensOld = new Set(String(e.content).toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" "));
        let overlap = 0; for (const t of tokensNew) { if (tokensOld.has(t)) overlap++; }
        return (2 * overlap) / (tokensNew.size + tokensOld.size) > 0.8;
      });

      if (duplicate) {
        // Merge: bump confidence
        const newConf = Math.min(1, Number(duplicate.confidence) + 0.05);
        await ctx.supabase.from("agent_memories")
          .update({ confidence: newConf, last_refreshed_at: new Date().toISOString() })
          .eq("id", duplicate.id);
        return { tool_call_id: "", name: "save_memory", success: true, result: `Sage updated existing memory (confidence now ${Math.round(newConf * 100)}%): "${content}"` };
      }

      const { error } = await ctx.supabase.from("agent_memories").insert({
        agent_id: ctx.agentId,
        content,
        category: String(args.category),
        confidence: Number(args.confidence ?? 0.9),
        memory_type: "personal",
      });

      if (error) return { tool_call_id: "", name: "save_memory", success: false, result: `Failed: ${error.message}` };
      return { tool_call_id: "", name: "save_memory", success: true, result: `Sage saved to memory: "${content}" [${args.category}, ${Math.round(Number(args.confidence ?? 0.9) * 100)}%]` };
    },
  },

  // ── DELEGATION ───────────────────────────────────────────────────────────

  {
    name: "delegate_to_agent",
    description: "Delegate a task or question to another agent in the Layaa OS workforce. Use when a request falls outside your expertise or another agent is better suited. The delegated agent will respond in the same conversation.",
    parameters: {
      type: "object",
      properties: {
        agent_name: { type: "string", description: "Name of the target agent (e.g. 'Kabir', 'Yuvaan', 'Rohit')" },
        task: { type: "string", description: "What you need the other agent to do" },
        context: { type: "string", description: "Relevant context from the current conversation" },
      },
      required: ["agent_name", "task"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      const { data: targetAgent } = await ctx.supabase
        .from("agents").select("id, name, canonical_role, system_prompt, default_model, llm_provider")
        .ilike("name", String(args.agent_name)).limit(1).single();

      if (!targetAgent) return { tool_call_id: "", name: "delegate_to_agent", success: false, result: `Agent "${args.agent_name}" not found.` };

      // Fetch target agent's context
      const { data: memories } = await ctx.supabase.from("agent_memories").select("content, category, confidence")
        .eq("agent_id", targetAgent.id).eq("is_compressed", false).order("created_at", { ascending: false }).limit(10);

      const { data: kbDocs } = await ctx.supabase.from("agent_kbs").select("filename, content")
        .eq("agent_id", targetAgent.id).limit(3);

      // Synthesize memories into grouped instruction format (Sage Memory Intelligence)
      const domainMap: Record<string, string> = { decision: "Decisions", preference: "Preferences", process: "Processes", company: "Context", client_info: "Client Info", market_data: "Market", conversation_handoff: "Handoffs" };
      const groups: Record<string, string[]> = {};
      for (const m of (memories || [])) { const d = domainMap[m.category] || "General"; if (!groups[d]) groups[d] = []; groups[d].push(`- ${m.content}`); }
      const memoryBlock = Object.entries(groups).map(([k, v]) => `**${k}:**\n${v.join("\n")}`).join("\n") || "No memories yet.";
      const kbBlock = (kbDocs || []).map((d: any) => `[${d.filename}] ${d.content?.slice(0, 1500)}`).join("\n---\n");

      const delegationPrompt = `You are ${targetAgent.name}, ${targetAgent.canonical_role}. ${targetAgent.system_prompt || ""}

[SAGE MEMORY CONTEXT — LAYAA OS]
${memoryBlock}
[END SAGE MEMORY]

Your knowledge base:
${kbBlock || "No KB docs."}

RESPONSE FORMAT RULES:
- Use bullet points and short paragraphs. No walls of text.
- Use **bold** for key terms. Use headings (##) for structure.
- Keep under 300 words unless the task requires depth.
- Be direct and actionable.

You have been asked by ${ctx.agentName} to help with the following:

Task: ${args.task}
${args.context ? `Context: ${args.context}` : ""}

Respond directly to the task. Be concise and actionable.`;

      // Generate delegation reasoning
      const taskLower = String(args.task).toLowerCase();
      const expertiseMap: Record<string, string[]> = {
        "strategy": ["kabir"], "research": ["kshitiz"], "marketing": ["mira"], "brand": ["tara"],
        "growth": ["zoya"], "campaign": ["nia"], "revenue": ["rishi"], "sales": ["yuvaan"],
        "pricing": ["veer"], "compliance": ["anne"], "finance": ["aarav"], "legal": ["abhay"],
        "regulatory": ["preeti"], "qa": ["rohit"], "automation": ["ujjawal"], "client": ["arjun"],
        "documentation": ["arush"], "product": ["dev"],
      };
      const matchedExpertise = Object.keys(expertiseMap).filter(kw => taskLower.includes(kw));
      const delegationReason = matchedExpertise.length > 0
        ? `Delegating to ${targetAgent.name} because this involves ${matchedExpertise.slice(0, 3).join(", ")} — their area of expertise as ${targetAgent.canonical_role}.`
        : `${targetAgent.name} (${targetAgent.canonical_role}) is the best role match for this task.`;

      // Create delegated conversation for split-screen
      const { data: delegatedConv } = await ctx.supabase.from("conversations").insert({
        agent_id: targetAgent.id, profile_id: ctx.profileId,
        title: `${ctx.agentName} → ${targetAgent.name}: ${String(args.task).slice(0, 50)}`,
      }).select("id").single();

      const delegatedConversationId = delegatedConv?.id;
      if (!delegatedConversationId) return { tool_call_id: "", name: "delegate_to_agent", success: false, result: "Failed to create delegation conversation." };

      // Multi-turn delegation loop (up to 5 turns)
      const MAX_TURNS = 5;
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) return { tool_call_id: "", name: "delegate_to_agent", success: false, result: "No API key configured for delegation." };

      // Initial message
      await ctx.supabase.from("messages").insert({
        conversation_id: delegatedConversationId, role: "user",
        content: `${ctx.agentName} asks: ${args.task}${args.context ? `\n\nContext: ${args.context}` : ""}`,
        model: "google/gemini-3-flash-preview",
      });

      let finalReply = "";
      let totalTokens = 0;
      const conversationMessages: { role: string; content: string }[] = [{ role: "user", content: delegationPrompt }];

      for (let turn = 0; turn < MAX_TURNS; turn++) {
        const llmResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: conversationMessages }),
        });

        if (!llmResponse.ok) break;

        const llmData = await llmResponse.json();
        const reply = llmData.choices?.[0]?.message?.content || "";
        const turnTokens = (llmData.usage?.prompt_tokens || 0) + (llmData.usage?.completion_tokens || 0);
        totalTokens += turnTokens;

        if (reply) {
          await ctx.supabase.from("messages").insert({
            conversation_id: delegatedConversationId, role: "agent", content: reply,
            mention_agent_id: targetAgent.id, model: "google/gemini-3-flash-preview",
            tokens_in: llmData.usage?.prompt_tokens || 0, tokens_out: llmData.usage?.completion_tokens || 0,
          });
          finalReply = reply;
          conversationMessages.push({ role: "assistant", content: reply });
        }

        // Check if response is complete (doesn't end with question, is substantial)
        if (!reply.endsWith("?") && reply.length > 150) break;
        if (turn >= MAX_TURNS - 1) break;

        // Follow-up from delegating agent
        const followUp = `${ctx.agentName}: Please provide more specific, actionable details.`;
        await ctx.supabase.from("messages").insert({
          conversation_id: delegatedConversationId, role: "user", content: followUp, model: "google/gemini-3-flash-preview",
        });
        conversationMessages.push({ role: "user", content: followUp });
      }

      // Save final response as mention_response in main conversation
      await ctx.supabase.from("messages").insert({
        conversation_id: ctx.conversationId, role: "mention_response", content: finalReply,
        mention_agent_id: targetAgent.id, model: "google/gemini-3-flash-preview",
      });

      // Update target agent budget
      if (totalTokens > 0) {
        const { data: agentBudget } = await ctx.supabase.from("agents").select("budget_used").eq("id", targetAgent.id).single();
        if (agentBudget) {
          await ctx.supabase.from("agents").update({ budget_used: agentBudget.budget_used + totalTokens }).eq("id", targetAgent.id);
        }
      }

      await ctx.supabase.from("audit_log").insert({
        actor_type: "agent", actor_id: ctx.agentId,
        action: "delegate_to_agent", target_table: "agents", target_id: targetAgent.id,
        payload: { from: ctx.agentName, to: targetAgent.name, task: args.task, delegatedConversationId, reason: delegationReason },
      });

      return {
        tool_call_id: "", name: "delegate_to_agent", success: true,
        result: `**${targetAgent.name}** (${targetAgent.canonical_role}) responded:\n\n${finalReply}\n\n_${delegationReason}_\n\n<!--DELEGATION:${delegatedConversationId}:${targetAgent.id}:${targetAgent.name}:${encodeURIComponent(delegationReason)}-->`,
        data: { agent: targetAgent.name, role: targetAgent.canonical_role, tokens: totalTokens, delegatedConversationId, targetAgentId: targetAgent.id },
      };
    },
  },

  // ── NOTIFICATIONS ────────────────────────────────────────────────────────

  {
    name: "send_notification",
    description: "Send an in-app notification to the user. Use for reminders, alerts, or important updates that should appear in the notification bell.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Notification title (short)" },
        message: { type: "string", description: "Notification message" },
        category: { type: "string", enum: ["task", "approval", "budget", "health", "system"], description: "Notification category" },
      },
      required: ["title", "message"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      const { error } = await ctx.supabase.from("notifications").insert({
        profile_id: ctx.profileId,
        category: String(args.category || "system"),
        title: String(args.title),
        message: String(args.message),
        is_read: false,
      });

      if (error) return { tool_call_id: "", name: "send_notification", success: false, result: `Failed: ${error.message}` };
      return { tool_call_id: "", name: "send_notification", success: true, result: `Notification sent: "${args.title}"` };
    },
  },

  // ── SEARCH / READ ────────────────────────────────────────────────────────

  {
    name: "search_knowledge_base",
    description: "Search your knowledge base documents for information. Use when you need to look up specific facts, procedures, or reference material.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
      },
      required: ["query"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      const { data: kbs } = await ctx.supabase.from("agent_kbs")
        .select("filename, content")
        .eq("agent_id", ctx.agentId)
        .textSearch("content", String(args.query), { type: "websearch" });

      if (!kbs?.length) {
        // Fallback: simple ILIKE search
        const { data: fallback } = await ctx.supabase.from("agent_kbs")
          .select("filename, content")
          .eq("agent_id", ctx.agentId)
          .ilike("content", `%${String(args.query)}%`)
          .limit(3);

        if (!fallback?.length) return { tool_call_id: "", name: "search_knowledge_base", success: true, result: `No results found for "${args.query}" in your knowledge base.` };

        const results = fallback.map((d: any) => {
          const idx = d.content.toLowerCase().indexOf(String(args.query).toLowerCase());
          const snippet = d.content.slice(Math.max(0, idx - 100), idx + 300);
          return `**${d.filename}**: ...${snippet}...`;
        }).join("\n\n");

        return { tool_call_id: "", name: "search_knowledge_base", success: true, result: `Found ${fallback.length} results:\n\n${results}` };
      }

      const results = kbs.map((d: any) => {
        const snippet = d.content.slice(0, 500);
        return `**${d.filename}**: ${snippet}...`;
      }).join("\n\n");

      return { tool_call_id: "", name: "search_knowledge_base", success: true, result: `Found ${kbs.length} results:\n\n${results}` };
    },
  },

  {
    name: "search_memories",
    description: "Search Sage Memory for previously learned information on the Layaa OS platform. Use when you need to recall past decisions, client info, preferences, or constraints.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        category: { type: "string", enum: ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"], description: "Filter by category (optional)" },
      },
      required: ["query"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      let query = ctx.supabase.from("agent_memories")
        .select("content, category, confidence, created_at")
        .eq("agent_id", ctx.agentId)
        .eq("is_compressed", false)
        .ilike("content", `%${String(args.query)}%`)
        .order("confidence", { ascending: false })
        .limit(15);

      if (args.category) query = query.eq("category", String(args.category));

      const { data: memories } = await query;
      if (!memories?.length) return { tool_call_id: "", name: "search_memories", success: true, result: `No Sage memories found matching "${args.query}".` };

      // Group results by category for readability
      const groups: Record<string, string[]> = {};
      for (const m of memories) {
        const label = m.category.replace(/_/g, " ");
        if (!groups[label]) groups[label] = [];
        groups[label].push(`- ${m.content} _(${Math.round(m.confidence * 100)}%)_`);
      }
      const results = Object.entries(groups).map(([cat, items]) => `**${cat}:**\n${items.join("\n")}`).join("\n\n");
      return { tool_call_id: "", name: "search_memories", success: true, result: `Sage found ${memories.length} memories:\n\n${results}` };
    },
  },

  // ── SEND EMAIL (TIER 3 — requires approval) ──────────────────────────────

  {
    name: "send_email",
    description: "Draft and send an email. This ALWAYS requires founder approval before sending. Use when asked to send emails, calendar invites, or any external communication.",
    parameters: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient email address" },
        subject: { type: "string", description: "Email subject line" },
        body: { type: "string", description: "Email body (markdown supported)" },
        cc: { type: "string", description: "CC email addresses (comma-separated, optional)" },
      },
      required: ["to", "subject", "body"],
    },
    tier: 3, // Always requires admin approval
    handler: async (args, ctx) => {
      // Create approval instead of sending
      const { data: approval, error } = await ctx.supabase.from("approvals").insert({
        requesting_agent_id: ctx.agentId,
        profile_id: ctx.profileId,
        action_type: "send_email",
        action_description: `Send email to ${args.to}: "${args.subject}"`,
        action_payload: { to: args.to, subject: args.subject, body: args.body, cc: args.cc || null },
        status: "pending",
        conversation_id: ctx.conversationId,
      }).select("id").single();

      if (error) return { tool_call_id: "", name: "send_email", success: false, result: `Failed: ${error.message}` };

      await ctx.supabase.from("notifications").insert({
        profile_id: ctx.profileId, category: "approval",
        title: `Email approval needed`,
        message: `${ctx.agentName} wants to send email to ${args.to}: "${args.subject}"`,
        reference_id: approval?.id, is_read: false,
      });

      return {
        tool_call_id: "", name: "send_email", success: true,
        result: `Email draft created and sent to Approvals board for your review.\n\n**To:** ${args.to}\n**Subject:** ${args.subject}\n**Preview:** ${String(args.body).slice(0, 200)}...`,
        approval_required: true, approval_id: approval?.id,
      };
    },
  },

  // ── PROJECT FILE OPERATIONS (available to every agent when a project is active) ──

  {
    name: "list_project_files",
    description: "List files in the active project's knowledge base on the Layaa OS platform. Use when you need to see what documents or files are available in the current project.",
    parameters: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "The project ID to list files for" },
      },
      required: ["project_id"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      const { data: files } = await ctx.supabase.from("project_knowledge")
        .select("knowledge_id, filename, file_type, chunk_count, created_at")
        .eq("project_id", String(args.project_id))
        .order("created_at", { ascending: false });

      if (!files?.length) return { tool_call_id: "", name: "list_project_files", success: true, result: "No files found in this project's knowledge base." };

      const list = files.map((f: any) => `- **${f.filename}** (${f.file_type || "unknown"}, ${f.chunk_count || 0} chunks)`).join("\n");
      return { tool_call_id: "", name: "list_project_files", success: true, result: `Project files (${files.length}):\n${list}` };
    },
  },

  {
    name: "read_project_file",
    description: "Read the content of a file from the active project's knowledge base on Layaa OS. Use when you need to analyze, reference, or work with a specific project document.",
    parameters: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "The project ID" },
        filename: { type: "string", description: "The filename to read" },
      },
      required: ["project_id", "filename"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      // Find the knowledge entry
      const { data: kb } = await ctx.supabase.from("project_knowledge")
        .select("knowledge_id, filename")
        .eq("project_id", String(args.project_id))
        .ilike("filename", `%${String(args.filename)}%`)
        .limit(1)
        .single();

      if (!kb) return { tool_call_id: "", name: "read_project_file", success: false, result: `File "${args.filename}" not found in project knowledge base.` };

      // Read all chunks for this file
      const { data: chunks } = await ctx.supabase.from("project_knowledge_chunks")
        .select("content, chunk_index")
        .eq("knowledge_id", kb.knowledge_id)
        .order("chunk_index", { ascending: true });

      if (!chunks?.length) return { tool_call_id: "", name: "read_project_file", success: true, result: `File "${kb.filename}" exists but has no content chunks.` };

      const content = chunks.map((c: any) => c.content).join("\n\n");
      const truncated = content.slice(0, 8000);
      return { tool_call_id: "", name: "read_project_file", success: true, result: `**${kb.filename}** (${chunks.length} chunks):\n\n${truncated}${content.length > 8000 ? "\n\n...(truncated)" : ""}` };
    },
  },

  {
    name: "search_project_files",
    description: "Search across all files in the active project's knowledge base on Layaa OS. Use when looking for specific information, code, or content within project documents.",
    parameters: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "The project ID" },
        query: { type: "string", description: "Search query" },
      },
      required: ["project_id", "query"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      const { data: chunks } = await ctx.supabase.from("project_knowledge_chunks")
        .select("content, knowledge_id, chunk_index, project_knowledge(filename)")
        .eq("project_id", String(args.project_id))
        .ilike("content", `%${String(args.query)}%`)
        .limit(5);

      if (!chunks?.length) return { tool_call_id: "", name: "search_project_files", success: true, result: `No results found for "${args.query}" in project files.` };

      const results = chunks.map((c: any) => {
        const fname = c.project_knowledge?.filename || "unknown";
        const idx = c.content.toLowerCase().indexOf(String(args.query).toLowerCase());
        const snippet = c.content.slice(Math.max(0, idx - 100), idx + 300);
        return `**${fname}** (chunk ${c.chunk_index}):\n...${snippet}...`;
      }).join("\n\n---\n\n");

      return { tool_call_id: "", name: "search_project_files", success: true, result: `Found ${chunks.length} matches:\n\n${results}` };
    },
  },

  {
    name: "save_project_memory",
    description: "Save a fact, decision, or note to the active project's memory on Layaa OS. Use when important project-specific information should be remembered across sessions.",
    parameters: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "The project ID" },
        key: { type: "string", description: "Short label for the memory (e.g. 'tech_stack', 'budget', 'decision_auth')" },
        value: { type: "string", description: "The full memory content (complete sentence)" },
      },
      required: ["project_id", "key", "value"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      // Find the work context for this project
      const { data: workCtx } = await ctx.supabase.from("work_contexts")
        .select("context_id")
        .eq("project_id", String(args.project_id))
        .limit(1)
        .maybeSingle();

      if (!workCtx) return { tool_call_id: "", name: "save_project_memory", success: false, result: "No work context found for this project." };

      // Dedup: check if key already exists
      const { data: existing } = await ctx.supabase.from("context_memories")
        .select("memory_id")
        .eq("context_id", workCtx.context_id)
        .eq("key", String(args.key))
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Update existing
        await ctx.supabase.from("context_memories")
          .update({ value: String(args.value), updated_at: new Date().toISOString() })
          .eq("memory_id", existing.memory_id);
        return { tool_call_id: "", name: "save_project_memory", success: true, result: `Updated project memory: **${args.key}** = "${args.value}"` };
      }

      // Insert new
      const { error } = await ctx.supabase.from("context_memories").insert({
        context_id: workCtx.context_id,
        key: String(args.key),
        value: String(args.value),
        source: "agent",
        user_id: ctx.profileId,
      });

      if (error) return { tool_call_id: "", name: "save_project_memory", success: false, result: `Failed: ${error.message}` };
      return { tool_call_id: "", name: "save_project_memory", success: true, result: `Saved to project memory: **${args.key}** = "${args.value}"` };
    },
  },

  // ── FILE WRITING (agent can create/write files in project) ─────────────────

  {
    name: "write_project_file",
    description: "Create or overwrite a file in the active project on Layaa OS. Use when the user asks you to create a document, code file, config, or any file. The file is saved to the project's knowledge base and can be synced to the user's local folder.",
    parameters: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "The project ID" },
        filename: { type: "string", description: "The filename with extension (e.g. 'proposal.md', 'config.json', 'src/utils.ts')" },
        content: { type: "string", description: "The full file content" },
        file_type: { type: "string", description: "MIME type hint (e.g. 'text/markdown', 'application/json', 'text/typescript')" },
      },
      required: ["project_id", "filename", "content"],
    },
    tier: 1,
    handler: async (args, ctx) => {
      const projectId = String(args.project_id);
      const filename = String(args.filename);
      const content = String(args.content);
      const fileType = String(args.file_type || "text/plain");

      // Check if file already exists in project knowledge
      const { data: existing } = await ctx.supabase.from("project_knowledge")
        .select("knowledge_id")
        .eq("project_id", projectId)
        .eq("filename", filename)
        .limit(1).maybeSingle();

      if (existing) {
        // Delete old chunks and update content
        await ctx.supabase.from("project_knowledge_chunks").delete().eq("knowledge_id", existing.knowledge_id);

        // Re-chunk the content
        const CHUNK_SIZE = 8000;
        const chunks: string[] = [];
        for (let i = 0; i < content.length; i += CHUNK_SIZE - 200) {
          chunks.push(content.slice(i, i + CHUNK_SIZE));
        }

        for (let i = 0; i < chunks.length; i++) {
          await ctx.supabase.from("project_knowledge_chunks").insert({
            knowledge_id: existing.knowledge_id, project_id: projectId,
            chunk_index: i, content: chunks[i], token_estimate: Math.ceil(chunks[i].length / 4),
          });
        }

        await ctx.supabase.from("project_knowledge").update({
          file_size: content.length, chunk_count: chunks.length,
        }).eq("knowledge_id", existing.knowledge_id);

        return { tool_call_id: "", name: "write_project_file", success: true, result: `Updated **${filename}** in project (${chunks.length} chunks, ${content.length} chars)` };
      }

      // Create new file entry
      const { data: newKb, error: kbErr } = await ctx.supabase.from("project_knowledge").insert({
        project_id: projectId, filename, file_type: fileType,
        file_size: content.length, uploaded_by: ctx.profileId,
      }).select("knowledge_id").single();

      if (kbErr || !newKb) return { tool_call_id: "", name: "write_project_file", success: false, result: `Failed to create file: ${kbErr?.message}` };

      // Chunk and store content
      const CHUNK_SIZE = 8000;
      const chunks: string[] = [];
      for (let i = 0; i < content.length; i += CHUNK_SIZE - 200) {
        chunks.push(content.slice(i, i + CHUNK_SIZE));
      }

      for (let i = 0; i < chunks.length; i++) {
        await ctx.supabase.from("project_knowledge_chunks").insert({
          knowledge_id: newKb.knowledge_id, project_id: projectId,
          chunk_index: i, content: chunks[i], token_estimate: Math.ceil(chunks[i].length / 4),
        });
      }

      await ctx.supabase.from("project_knowledge").update({ chunk_count: chunks.length }).eq("knowledge_id", newKb.knowledge_id);

      return { tool_call_id: "", name: "write_project_file", success: true, result: `Created **${filename}** in project (${chunks.length} chunks, ${content.length} chars). The file is available in the project workspace file tree.` };
    },
  },
];

// ─── Registry Functions ────────────────────────────────────────────────────────

/** Get tool definitions for LLM (without handlers) */
export function getToolDefinitions(): { type: "function"; function: { name: string; description: string; parameters: Record<string, unknown> } }[] {
  return TOOLS.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
}));
}
}

/** Execute a tool call */
export async function executeTool(toolCall: ToolCall, ctx: ToolContext): Promise<ToolResult> {
  const tool = TOOLS.find((t) => t.name === toolCall.name);
  if (!tool) {
    return { tool_call_id: toolCall.id, name: toolCall.name, success: false, result: `Unknown tool: ${toolCall.name}` };
  }

  try {
    const result = await tool.handler(toolCall.arguments, ctx);
    result.tool_call_id = toolCall.id;
    return result;
  } catch (err: any) {
    return { tool_call_id: toolCall.id, name: toolCall.name, success: false, result: `Tool error: ${err.message}` };
  }
}

/** Get a tool's tier */
export function getToolTier(toolName: string): 1 | 2 | 3 {
  return TOOLS.find((t) => t.name === toolName)?.tier ?? 2;
}
