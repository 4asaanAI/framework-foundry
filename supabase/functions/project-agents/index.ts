import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  getSupabaseClient, getUserId, HttpError,
  jsonResponse, errorResponse, parsePathSegments,
} from "../shared/utils.ts";

/** POST /projects/:id/agents — add agents to project. */
async function handleAddAgents(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { agent_ids } = await req.json();
  if (!Array.isArray(agent_ids) || agent_ids.length === 0) {
    throw new HttpError(400, "agent_ids must be a non-empty array");
  }

  const rows = agent_ids.map((agent_id: string) => ({
    project_id: projectId,
    agent_id,
  }));

  const { data, error } = await supabase
    .from("project_agents")
    .upsert(rows, { onConflict: "project_id,agent_id", ignoreDuplicates: true })
    .select("agent_id, agents(name, role, description)");

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data, 201);
}

/** DELETE /projects/:id/agents/:agentId — remove agent from project. */
async function handleRemoveAgent(req: Request, projectId: string, agentId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { error } = await supabase
    .from("project_agents")
    .delete()
    .eq("project_id", projectId)
    .eq("agent_id", agentId);

  if (error) throw new HttpError(500, error.message);
  return jsonResponse({ success: true });
}

/** GET /projects/:id/agents — list assigned agents. */
async function handleListAgents(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { data, error } = await supabase
    .from("project_agents")
    .select("agent_id, agents(name, role, description)")
    .eq("project_id", projectId);

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

/** If project has assigned agents, return those. Otherwise return all agents (default fallback). */
export async function getAvailableAgents(
  supabase: SupabaseClient,
  projectId: string,
): Promise<Record<string, unknown>[]> {
  const { data: assigned } = await supabase
    .from("project_agents")
    .select("agent_id, agents(id, name, role, description)")
    .eq("project_id", projectId);

  if (assigned && assigned.length > 0) {
    return assigned.map((a: Record<string, unknown>) => a.agents as Record<string, unknown>);
  }

  const { data: allAgents } = await supabase
    .from("agents")
    .select("id, name, role, description");

  return allAgents ?? [];
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const segments = parsePathSegments(url, "/projects");
    const method = req.method;

    if (segments.length < 2 || segments[1] !== "agents") {
      throw new HttpError(404, "Not found");
    }

    const projectId = segments[0];

    if (segments.length === 2) {
      if (method === "GET") return await handleListAgents(req, projectId);
      if (method === "POST") return await handleAddAgents(req, projectId);
      throw new HttpError(405, "Method not allowed");
    }

    const agentId = segments[2];
    if (method === "DELETE") return await handleRemoveAgent(req, projectId, agentId);

    throw new HttpError(405, "Method not allowed");
  } catch (err) {
    return errorResponse(err);
  }
});
