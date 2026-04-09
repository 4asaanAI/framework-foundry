import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface SearchResult {
  file_id: string;
  original_filename: string;
  chunk_index: number;
  snippet: string;
  relevance: number;
  file_type: string;
  project_id: string | null;
}

/** GET /file-search?q=keyword&file_type=pdf&project_id=X — FTS on file_contents. */
export async function handleFileSearch(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const fileType = url.searchParams.get("file_type");
    const projectId = url.searchParams.get("project_id");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10), 50);

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query parameter 'q' is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const filters: string[] = [];
    const params: Record<string, unknown> = { search_query: query, result_limit: limit };

    if (fileType) {
      filters.push("file_type");
      params.filter_file_type = fileType;
    }
    if (projectId) {
      filters.push("project_id");
      params.filter_project_id = projectId;
    }

    const { data, error } = await supabase.rpc("search_file_contents", {
      search_query: query,
      filter_file_type: fileType ?? null,
      filter_project_id: projectId ?? null,
      result_limit: limit,
    });

    if (error) {
      const fallbackResults = await fallbackSearch(supabase, query, fileType, projectId, limit);
      return new Response(
        JSON.stringify({ results: fallbackResults, count: fallbackResults.length, method: "fallback" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ results: data, count: data?.length ?? 0 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function fallbackSearch(
  supabase: ReturnType<typeof createClient>,
  query: string,
  fileType: string | null,
  projectId: string | null,
  limit: number
): Promise<SearchResult[]> {
  let q = supabase
    .from("file_contents")
    .select(`
      id,
      file_id,
      chunk_index,
      content,
      file_type,
      project_id,
      files!inner(filename)
    `)
    .textSearch("content", query, { type: "plain" })
    .limit(limit);

  if (fileType) q = q.eq("file_type", fileType);
  if (projectId) q = q.eq("project_id", projectId);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>, idx: number) => {
    const content = row.content as string;
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const matchIdx = contentLower.indexOf(queryLower);
    const snippetStart = Math.max(0, matchIdx - 100);
    const snippetEnd = Math.min(content.length, matchIdx + query.length + 100);
    const snippet = matchIdx >= 0
      ? `...${content.slice(snippetStart, snippetEnd)}...`
      : content.slice(0, 200);

    return {
      file_id: row.file_id as string,
      original_filename: ((row.files as Record<string, string>)?.filename) ?? "unknown",
      chunk_index: row.chunk_index as number,
      snippet,
      relevance: 1 - idx * 0.01,
      file_type: row.file_type as string,
      project_id: row.project_id as string | null,
    };
  });
}

serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/file-search") {
    return handleFileSearch(req);
  }

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
});
