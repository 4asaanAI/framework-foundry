import {
  getSupabaseClient, getUserId, HttpError,
  jsonResponse, errorResponse, parsePathSegments,
} from "../shared/utils.ts";

type ContextType = "platform_project" | "local_folder";

/** POST /work-contexts — create a new work context. */
async function handleCreateContext(req: Request): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);
  const { context_type, project_id, folder_path, display_name } = await req.json();

  if (!display_name) throw new HttpError(400, "display_name is required");
  if (!context_type) throw new HttpError(400, "context_type is required");

  const validTypes: ContextType[] = ["platform_project", "local_folder"];
  if (!validTypes.includes(context_type)) {
    throw new HttpError(400, `context_type must be one of: ${validTypes.join(", ")}`);
  }

  if (context_type === "platform_project" && !project_id) {
    throw new HttpError(400, "project_id is required for platform_project context");
  }
  if (context_type === "local_folder" && !folder_path) {
    throw new HttpError(400, "folder_path is required for local_folder context");
  }

  const { data, error } = await supabase
    .from("work_contexts")
    .insert({
      user_id: userId,
      context_type,
      project_id: context_type === "platform_project" ? project_id : null,
      folder_path: context_type === "local_folder" ? folder_path : null,
      display_name,
    })
    .select()
    .single();

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data, 201);
}

/** GET /work-contexts — list all contexts for user. */
async function handleListContexts(req: Request): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);

  const { data, error } = await supabase
    .from("work_contexts")
    .select("*, projects(name)")
    .eq("user_id", userId)
    .order("last_used_at", { ascending: false, nullsFirst: false });

  if (error) throw new HttpError(500, error.message);

  const results = (data ?? []).map((ctx: Record<string, unknown>) => ({
    ...ctx,
    project_name: (ctx.projects as Record<string, unknown> | null)?.name ?? null,
    projects: undefined,
  }));

  return jsonResponse(results);
}

/** PATCH /work-contexts/:id — update display_name or folder_path. */
async function handleUpdateContext(req: Request, contextId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if ("display_name" in body) updates.display_name = body.display_name;
  if ("folder_path" in body) updates.folder_path = body.folder_path;

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "No valid fields to update");
  }

  const { data, error } = await supabase
    .from("work_contexts")
    .update(updates)
    .eq("id", contextId)
    .select()
    .single();

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

/** DELETE /work-contexts/:id — remove context and associated memories. */
async function handleDeleteContext(req: Request, contextId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  await supabase
    .from("context_memories")
    .delete()
    .eq("context_id", contextId);

  const { error } = await supabase
    .from("work_contexts")
    .delete()
    .eq("id", contextId);

  if (error) throw new HttpError(500, error.message);
  return jsonResponse({ success: true });
}

/** POST /work-contexts/:id/activate — mark context as active. */
async function handleActivateContext(req: Request, contextId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);

  await supabase
    .from("work_contexts")
    .update({ is_active: false })
    .eq("user_id", userId)
    .eq("is_active", true);

  const { data, error } = await supabase
    .from("work_contexts")
    .update({ is_active: true, last_used_at: new Date().toISOString() })
    .eq("id", contextId)
    .select("*, projects(name)")
    .single();

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const segments = parsePathSegments(url, "/work-contexts");
    const method = req.method;

    if (segments.length === 0) {
      if (method === "GET") return await handleListContexts(req);
      if (method === "POST") return await handleCreateContext(req);
      throw new HttpError(405, "Method not allowed");
    }

    const contextId = segments[0];

    if (segments.length === 1) {
      if (method === "PATCH") return await handleUpdateContext(req, contextId);
      if (method === "DELETE") return await handleDeleteContext(req, contextId);
      throw new HttpError(405, "Method not allowed");
    }

    if (segments[1] === "activate" && method === "POST") {
      return await handleActivateContext(req, contextId);
    }

    throw new HttpError(404, "Not found");
  } catch (err) {
    return errorResponse(err);
  }
});
