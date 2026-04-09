import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  getSupabaseClient, getUserId, HttpError,
  jsonResponse, errorResponse, parsePathSegments,
} from "../shared/utils.ts";

const CHUNK_SIZE = 8000;
const CHUNK_OVERLAP = 200;
const STORAGE_BUCKET = "project-knowledge";

/** POST /projects/:id/knowledge — upload and chunk a knowledge file. */
async function handleUploadKnowledge(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  const userId = await getUserId(supabase);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) throw new HttpError(400, "file is required");

  const fileType = detectFileType(file.name);
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const storagePath = `${projectId}/${crypto.randomUUID()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, bytes, { contentType: file.type });

  if (uploadError) throw new HttpError(500, uploadError.message);

  const text = await extractText(bytes, fileType, file.name);
  const chunks = chunkText(text);

  const { data: knowledge, error: insertError } = await supabase
    .from("project_knowledge")
    .insert({
      project_id: projectId,
      filename: file.name,
      file_type: fileType,
      file_size: file.size,
      storage_path: storagePath,
      uploaded_by: userId,
      chunk_count: chunks.length,
    })
    .select()
    .single();

  if (insertError) throw new HttpError(500, insertError.message);

  const chunkRows = chunks.map((content, index) => ({
    knowledge_id: knowledge.id,
    project_id: projectId,
    chunk_index: index,
    content,
  }));

  const { error: chunkError } = await supabase
    .from("project_knowledge_chunks")
    .insert(chunkRows);

  if (chunkError) throw new HttpError(500, chunkError.message);

  return jsonResponse({
    knowledge_id: knowledge.id,
    filename: file.name,
    chunk_count: chunks.length,
  }, 201);
}

/** GET /projects/:id/knowledge — list knowledge files. */
async function handleListKnowledge(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { data, error } = await supabase
    .from("project_knowledge")
    .select("id, filename, file_type, file_size, uploaded_by, created_at, chunk_count")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw new HttpError(500, error.message);
  return jsonResponse(data);
}

/** DELETE /projects/:id/knowledge/:knowledgeId — remove file, chunks, and storage object. */
async function handleDeleteKnowledge(req: Request, projectId: string, knowledgeId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const { data: knowledge } = await supabase
    .from("project_knowledge")
    .select("storage_path")
    .eq("id", knowledgeId)
    .eq("project_id", projectId)
    .single();

  if (!knowledge) throw new HttpError(404, "Knowledge entry not found");

  await Promise.all([
    supabase.from("project_knowledge_chunks").delete().eq("knowledge_id", knowledgeId),
    supabase.storage.from(STORAGE_BUCKET).remove([knowledge.storage_path]),
  ]);

  const { error } = await supabase
    .from("project_knowledge")
    .delete()
    .eq("id", knowledgeId);

  if (error) throw new HttpError(500, error.message);
  return jsonResponse({ success: true });
}

/** GET /projects/:id/knowledge/search?q=keyword — full-text search across chunks. */
async function handleSearchKnowledge(req: Request, projectId: string): Promise<Response> {
  const supabase = getSupabaseClient(req);
  await getUserId(supabase);

  const url = new URL(req.url);
  const query = url.searchParams.get("q");
  if (!query) throw new HttpError(400, "q parameter is required");

  const tsQuery = query.trim().split(/\s+/).join(" & ");

  const { data, error } = await supabase
    .rpc("search_knowledge_chunks", {
      p_project_id: projectId,
      p_query: tsQuery,
    });

  if (error) {
    const { data: fallback, error: fbError } = await supabase
      .from("project_knowledge_chunks")
      .select("id, knowledge_id, chunk_index, content, project_knowledge(filename)")
      .eq("project_id", projectId)
      .ilike("content", `%${query}%`)
      .limit(20);

    if (fbError) throw new HttpError(500, fbError.message);

    const results = (fallback ?? []).map((c: Record<string, unknown>) => ({
      chunk_id: c.id,
      knowledge_id: c.knowledge_id,
      chunk_index: c.chunk_index,
      snippet: truncateSnippet(c.content as string, query),
      filename: (c.project_knowledge as Record<string, unknown>)?.filename,
    }));

    return jsonResponse(results);
  }

  return jsonResponse(data);
}

/** Retrieve top-N relevant chunks for injection into chat context. */
export async function injectKnowledgeContext(
  supabase: SupabaseClient,
  projectId: string,
  userMessage: string,
): Promise<string> {
  const keywords = userMessage
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 8);

  if (keywords.length === 0) return "";

  const likeConditions = keywords.map((k) => `content.ilike.%${k}%`);

  const { data: chunks } = await supabase
    .from("project_knowledge_chunks")
    .select("content, chunk_index, project_knowledge(filename)")
    .eq("project_id", projectId)
    .or(likeConditions.join(","))
    .limit(10);

  if (!chunks || chunks.length === 0) return "";

  let tokenBudget = 4000;
  const selected: string[] = [];

  for (const chunk of chunks) {
    const entry = chunk as Record<string, unknown>;
    const content = entry.content as string;
    const approxTokens = Math.ceil(content.length / 4);
    if (tokenBudget - approxTokens < 0) break;
    tokenBudget -= approxTokens;
    const filename = (entry.project_knowledge as Record<string, unknown>)?.filename ?? "unknown";
    selected.push(`[Source: ${filename}, chunk ${entry.chunk_index}]\n${content}`);
  }

  if (selected.length === 0) return "";
  return `[Project Knowledge]\n${selected.join("\n\n---\n\n")}`;
}

function detectFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "pdf", zip: "zip", png: "image", jpg: "image", jpeg: "image",
    gif: "image", webp: "image", md: "markdown", txt: "text",
    json: "json", csv: "csv",
  };
  return map[ext] ?? "text";
}

async function extractText(bytes: Uint8Array, fileType: string, _filename: string): Promise<string> {
  const decoder = new TextDecoder("utf-8", { fatal: false });

  switch (fileType) {
    case "text":
    case "markdown":
    case "json":
    case "csv":
      return decoder.decode(bytes);

    case "pdf":
      return decoder.decode(bytes).replace(/[^\x20-\x7E\n\r\t]/g, " ");

    case "image":
      return `[Image file — OCR extraction pending]`;

    case "zip": {
      return `[ZIP archive — text extraction pending]`;
    }

    default:
      return decoder.decode(bytes);
  }
}

function chunkText(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text];

  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end));
    start = end - CHUNK_OVERLAP;
    if (start + CHUNK_OVERLAP >= text.length) break;
  }
  return chunks;
}

function truncateSnippet(content: string, query: string, maxLen = 300): string {
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, maxLen);
  const start = Math.max(0, idx - 80);
  return content.slice(start, start + maxLen);
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const segments = parsePathSegments(url, "/projects");
    const method = req.method;

    if (segments.length < 2 || segments[1] !== "knowledge") {
      throw new HttpError(404, "Not found");
    }

    const projectId = segments[0];

    if (segments.length === 2) {
      if (method === "GET") return await handleListKnowledge(req, projectId);
      if (method === "POST") return await handleUploadKnowledge(req, projectId);
      throw new HttpError(405, "Method not allowed");
    }

    if (segments[2] === "search" && method === "GET") {
      return await handleSearchKnowledge(req, projectId);
    }

    const knowledgeId = segments[2];
    if (method === "DELETE") return await handleDeleteKnowledge(req, projectId, knowledgeId);

    throw new HttpError(405, "Method not allowed");
  } catch (err) {
    return errorResponse(err);
  }
});
