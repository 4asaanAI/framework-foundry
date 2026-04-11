import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export function getSupabaseClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new HttpError(401, "Missing Authorization header");

  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return jsonResponse({ error: err.message }, err.status);
  }
  console.error(err);
  return jsonResponse({ error: "Internal server error" }, 500);
}

export function requireParam(value: string | null | undefined, name: string): string {
  if (!value) throw new HttpError(400, `Missing required parameter: ${name}`);
  return value;
}

export function parsePathSegments(url: URL, basePath: string): string[] {
  const path = url.pathname.replace(basePath, "").replace(/^\/+|\/+$/g, "");
  return path ? path.split("/") : [];
}

export async function getUserId(supabase: SupabaseClient): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new HttpError(401, "Unauthorized");
  return user.id;
}
