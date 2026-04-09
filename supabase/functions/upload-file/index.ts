import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const STORAGE_BUCKET = "file-uploads";

function chunkText(text: string, size = 8000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }
  return chunks;
}

async function extractPdfText(buffer: Uint8Array): Promise<string> {
  const text = new TextDecoder().decode(buffer);
  const stripped = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{2,}/g, " ").trim();
  return stripped || "[PDF text extraction requires a dedicated parser — raw content returned]";
}

async function extractZipContents(buffer: Uint8Array): Promise<string> {
  return `[ZIP archive detected — ${buffer.length} bytes. Full extraction requires a ZIP library. Metadata preserved.]`;
}

async function extractImageText(buffer: Uint8Array): Promise<string> {
  return `[Image detected — ${buffer.length} bytes. OCR extraction placeholder. Integrate with a vision API for full text extraction.]`;
}

function readDirectText(buffer: Uint8Array): string {
  return new TextDecoder().decode(buffer);
}

function detectMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    zip: "application/zip",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    md: "text/markdown",
    txt: "text/plain",
    json: "application/json",
    csv: "text/csv",
  };
  return mimeMap[ext] ?? "application/octet-stream";
}

/** POST /upload-file — multipart file upload with auto text extraction and chunking. */
export async function handleUploadFile(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("project_id") as string | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const buffer = new Uint8Array(await file.arrayBuffer());
    const mimeType = detectMimeType(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    const storagePath = `${crypto.randomUUID()}/${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, { contentType: mimeType });

    if (uploadErr) throw uploadErr;

    let extractedText: string;
    if (ext === "pdf") {
      extractedText = await extractPdfText(buffer);
    } else if (ext === "zip") {
      extractedText = await extractZipContents(buffer);
    } else if (["png", "jpg", "jpeg"].includes(ext)) {
      extractedText = await extractImageText(buffer);
    } else {
      extractedText = readDirectText(buffer);
    }

    const { data: fileRecord, error: insertErr } = await supabase
      .from("files")
      .insert({
        filename: file.name,
        mime_type: mimeType,
        storage_path: storagePath,
        project_id: projectId,
        file_size: buffer.length,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertErr) throw insertErr;

    const chunks = chunkText(extractedText);
    const chunkRecords = chunks.map((content, index) => ({
      file_id: fileRecord.id,
      chunk_index: index,
      content,
      file_type: ext,
      project_id: projectId,
      created_at: new Date().toISOString(),
    }));

    if (chunkRecords.length) {
      const { error: chunkErr } = await supabase.from("file_contents").insert(chunkRecords);
      if (chunkErr) throw chunkErr;
    }

    return new Response(
      JSON.stringify({
        file_id: fileRecord.id,
        filename: file.name,
        chunks_created: chunks.length,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** POST /extract-text — extract text from an existing file by file_id. */
export async function handleExtractText(req: Request): Promise<Response> {
  try {
    const { file_id } = await req.json();
    if (!file_id) {
      return new Response(
        JSON.stringify({ error: "file_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: chunks, error } = await supabase
      .from("file_contents")
      .select("content, chunk_index")
      .eq("file_id", file_id)
      .order("chunk_index", { ascending: true });

    if (error) throw error;
    if (!chunks?.length) {
      return new Response(
        JSON.stringify({ error: "No content found for this file" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const fullText = chunks.map((c: { content: string }) => c.content).join("");

    return new Response(
      JSON.stringify({ file_id, extracted_text: fullText, chunk_count: chunks.length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** GET /download-file?file_id=X — download original file or extracted text. */
export async function handleDownloadFile(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const fileId = url.searchParams.get("file_id");
    const format = url.searchParams.get("format") ?? "original";

    if (!fileId) {
      return new Response(
        JSON.stringify({ error: "file_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: fileRecord, error: fetchErr } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fetchErr || !fileRecord) {
      return new Response(
        JSON.stringify({ error: "File not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (format === "text") {
      const { data: chunks } = await supabase
        .from("file_contents")
        .select("content")
        .eq("file_id", fileId)
        .order("chunk_index", { ascending: true });

      const text = (chunks ?? []).map((c: { content: string }) => c.content).join("");
      return new Response(text, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const { data: fileData, error: dlErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(fileRecord.storage_path);

    if (dlErr || !fileData) {
      return new Response(
        JSON.stringify({ error: "File download failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(fileData, {
      status: 200,
      headers: {
        "Content-Type": fileRecord.mime_type,
        "Content-Disposition": `attachment; filename="${fileRecord.filename}"`,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/upload-file") {
    return handleUploadFile(req);
  }
  if (req.method === "POST" && url.pathname === "/extract-text") {
    return handleExtractText(req);
  }
  if (req.method === "GET" && url.pathname === "/download-file") {
    return handleDownloadFile(req);
  }

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
});
