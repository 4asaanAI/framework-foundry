import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  getSupabaseClient, getUserId, HttpError,
  jsonResponse, errorResponse, parsePathSegments,
} from "../shared/utils.ts";

/** GET /work-contexts/:id/memories — list memories for a context. */
async function handleListMemories(req: Request, contextId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { data, error } = await supabase
    .from("context_memories")
    .select("*")
    .eq("context_id", contextId)
    .order("updated_at", { ascending: false });

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

/** POST /work-contexts/:id/memories — manually add a memory. */
async function handleCreateMemory(req: Request, contextId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { key, value, source } = await req.json();
  if (!key || !value) throw new HttpError(400, "key and value are required");

  const { data, error } = await supabase
    .from("context_memories")
    .insert({
      context_id: contextId,
      key,
      value,
      source: source ?? "manual",
    })
    .select()
    .single();

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data, 201);
}

/** DELETE /work-contexts/:id/memories/:memoryId — remove a memory entry. */
async function handleDeleteMemory(req: Request, contextId: string, memoryId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { error } = await supabase
    .from("context_memories")
    .delete()
    .eq("id", memoryId)
    .eq("context_id", contextId);

  if (error) throw new HttpError(500, error.message);
  return jsonResponse({ success: true });
}

/** Fetch relevant memories for injection into chat context. */
export async function getContextMemories(
  supabase: SupabaseClient,
  contextId: string,
  limit = 10,
): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from("context_memories")
    .select("key, value, source, updated_at")
    .eq("context_id", contextId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const segments = parsePathSegments(url, "/work-contexts");
    const method = req.method;

    if (segments.length < 2 || segments[1] !== "memories") {
      throw new HttpError(404, "Not found");
    }

    const contextId = segments[0];

    if (segments.length === 2) {
      if (method === "GET") return await handleListMemories(req, contextId);
      if (method === "POST") return await handleCreateMemory(req, contextId);
      throw new HttpError(405, "Method not allowed");
    }

    const memoryId = segments[2];
    if (method === "DELETE") return await handleDeleteMemory(req, contextId, memoryId);

    throw new HttpError(405, "Method not allowed");
  } catch (err) {
    return errorResponse(err);
  }
});
