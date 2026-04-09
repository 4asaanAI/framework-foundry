import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  getSupabaseClient, getUserId, HttpError,
  jsonResponse, errorResponse, parsePathSegments,
} from "../shared/utils.ts";
import { injectKnowledgeContext } from "./knowledge-api.ts";
import { getAvailableAgents } from "./project-agents-api.ts";

/** GET /projects/:id/chats — list conversations scoped to project. */
async function handleListProjectChats(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, created_at, updated_at, messages(content, created_at)")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) throw new HttpError(500, error.message);

  const results = (data ?? []).map((conv: Record<string, unknown>) => {
    const messages = conv.messages as Record<string, unknown>[] | null;
    const lastMsg = messages?.length ? messages[messages.length - 1] : null;
    return {
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      message_count: messages?.length ?? 0,
      last_message_preview: lastMsg
        ? (lastMsg.content as string).slice(0, 120)
        : null,
    };
  });

  return jsonResponse(results);
}

/** Tag a message with a project_id. */
export async function tagMessageWithProject(
  supabase: SupabaseClient,
  messageId: string,
  projectId: string,
): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ project_id: projectId })
    .eq("id", messageId);

  if (error) throw new HttpError(500, error.message);
}

/** Fetch project instructions for system prompt injection. */
export async function getProjectInstructions(
  supabase: SupabaseClient,
  projectId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("projects")
    .select("instructions")
    .eq("id", projectId)
    .single();

  return data?.instructions ?? null;
}

/** Combine project instructions, knowledge context, and agent list into a system prompt prefix. */
export async function buildProjectContext(
  supabase: SupabaseClient,
  projectId: string,
  userMessage: string,
): Promise<string> {
  const [instructions, knowledgeCtx, agents] = await Promise.all([
    getProjectInstructions(supabase, projectId),
    injectKnowledgeContext(supabase, projectId, userMessage),
    getAvailableAgents(supabase, projectId),
  ]);

  const parts: string[] = [];

  if (instructions) {
    parts.push(`[Project Instructions]\n${instructions}`);
  }

  if (knowledgeCtx) {
    parts.push(knowledgeCtx);
  }

  if (agents.length > 0) {
    const agentList = agents
      .map((a) => `- ${a.name} (${a.role}): ${a.description}`)
      .join("\n");
    parts.push(`[Available Agents]\n${agentList}`);
  }

  return parts.join("\n\n---\n\n");
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const segments = parsePathSegments(url, "/projects");
    const method = req.method;

    if (segments.length < 2 || segments[1] !== "chats") {
      throw new HttpError(404, "Not found");
    }

    const projectId = segments[0];

    if (segments.length === 2 && method === "GET") {
      return await handleListProjectChats(req, projectId);
    }

    throw new HttpError(405, "Method not allowed");
  } catch (err) {
    return errorResponse(err);
  }
});
