import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  getSupabaseClient, getUserId, HttpError,
  jsonResponse, errorResponse, parsePathSegments,
} from "../shared/utils.ts";

/** POST /projects — create a new project. */
async function handleCreateProject(req: Request): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);
  const { name, description, instructions, visibility } = await req.json();

  if (!name) throw new HttpError(400, "name is required");

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, description, instructions, visibility: visibility ?? "private", created_by: userId })
    .select()
    .single();

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data, 201);
}

/** GET /projects — list projects visible to user. */
async function handleListProjects(req: Request): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);
  const url = new URL(req.url);
  const includeArchived = url.searchParams.get("include_archived") === "true";

  let query = supabase
    .from("projects")
    .select("*")
    .or(`created_by.eq.${userId},visibility.eq.shared`)
    .order("updated_at", { ascending: false });

  if (!includeArchived) {
    query = query.eq("is_archived", false);
  }

  const { data, error } = await query;
  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

/** GET /projects/:id — single project with aggregate counts. */
async function handleGetProject(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) throw new HttpError(404, "Project not found");

  const [knowledge, agents, chats] = await Promise.all([
    supabase.from("project_knowledge").select("id", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("project_agents").select("id", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("conversations").select("id", { count: "exact", head: true }).eq("project_id", projectId).order("created_at", { ascending: false }).limit(5),
  ]);

  return jsonResponse({
    ...project,
    knowledge_count: knowledge.count ?? 0,
    agent_count: agents.count ?? 0,
    recent_chat_count: chats.count ?? 0,
  });
}

/** PATCH /projects/:id — update project fields. Creator only. */
async function handleUpdateProject(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);
  await assertProjectOwner(supabase, projectId, userId);

  const body = await req.json();
  const allowed = ["name", "description", "instructions", "visibility"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }
  if (Object.keys(updates).length === 0) throw new HttpError(400, "No valid fields to update");

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

/** DELETE /projects/:id — soft-delete (archive). Creator only. */
async function handleDeleteProject(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);
  await assertProjectOwner(supabase, projectId, userId);

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", projectId);

  if (error) throw new HttpError(500, error.message);
  return jsonResponse({ success: true });
}

/** POST /projects/:id/archive — toggle archive state. */
async function handleArchiveProject(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);
  await assertProjectOwner(supabase, projectId, userId);

  const { archive } = await req.json();
  if (typeof archive !== "boolean") throw new HttpError(400, "archive must be a boolean");

  const { data, error } = await supabase
    .from("projects")
    .update({ is_archived: archive, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

async function assertProjectOwner(supabase: SupabaseClient, projectId: string, userId: string): Promise<void> {
  const { data } = await supabase
    .from("projects")
    .select("created_by")
    .eq("id", projectId)
    .single();

  if (!data) throw new HttpError(404, "Project not found");
  if (data.created_by !== userId) throw new HttpError(403, "Only the project creator can perform this action");
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const segments = parsePathSegments(url, "/projects");
    const method = req.method;

    if (segments.length === 0) {
      if (method === "GET") return await handleListProjects(req);
      if (method === "POST") return await handleCreateProject(req);
      throw new HttpError(405, "Method not allowed");
    }

    const projectId = segments[0];

    if (segments.length === 1) {
      if (method === "GET") return await handleGetProject(req, projectId);
      if (method === "PATCH") return await handleUpdateProject(req, projectId);
      if (method === "DELETE") return await handleDeleteProject(req, projectId);
      throw new HttpError(405, "Method not allowed");
    }

    if (segments[1] === "archive" && method === "POST") {
      return await handleArchiveProject(req, projectId);
    }

    throw new HttpError(404, "Not found");
  } catch (err) {
    return errorResponse(err);
  }
});
