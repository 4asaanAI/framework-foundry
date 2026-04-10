import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/** Inject relevant knowledge context from project KB chunks. */
export async function injectKnowledgeContext(
  supabase: SupabaseClient,
  projectId: string,
  userMessage: string,
): Promise<string | null> {
  const keywords = userMessage
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);

  if (keywords.length === 0) return null;

  const { data: chunks } = await supabase
    .from("project_knowledge_chunks")
    .select("content, chunk_index")
    .eq("project_id", projectId)
    .limit(5);

  if (!chunks || chunks.length === 0) return null;

  const relevant = chunks.filter((c: any) =>
    keywords.some((kw) => c.content.toLowerCase().includes(kw))
  );

  if (relevant.length === 0) return null;

  return (
    "[Project Knowledge Context]\n" +
    relevant.map((c: any) => c.content.slice(0, 2000)).join("\n---\n")
  );
}
