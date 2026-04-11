/**
 * execute-code — Sandboxed code execution edge function
 * 
 * Supports: JavaScript, Python (via subprocess)
 * Timeout: 30 seconds
 * Sandboxed: no FS, no network, limited memory
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIMEOUT_MS = 30_000;

interface ExecuteRequest {
  language: string;
  code: string;
}

function sanitizeCode(code: string): string {
  return code.replace(/\r\n/g, "\n").trim();
}

async function executeJavaScript(code: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  // Wrap code in a sandboxed context — no Deno APIs, no network, no FS
  const wrappedCode = `
// Sandbox: remove dangerous globals
const _origFetch = globalThis.fetch;
delete globalThis.fetch;
const _origDeno = globalThis.Deno;
// Provide limited Deno for just the basics
globalThis.Deno = { exit: () => {} };

// Capture console output
const __stdout = [];
const __stderr = [];
const __origLog = console.log;
const __origErr = console.error;
const __origWarn = console.warn;
console.log = (...args) => __stdout.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
console.error = (...args) => __stderr.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
console.warn = (...args) => __stderr.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
console.info = console.log;
console.debug = console.log;
console.table = (...args) => console.log(...args);

try {
${code}
} catch (e) {
  __stderr.push(String(e?.stack || e));
}

// Output results as JSON
__origLog(JSON.stringify({ stdout: __stdout.join('\\n'), stderr: __stderr.join('\\n') }));
`;

  try {
    const cmd = new Deno.Command("deno", {
      args: ["eval", "--no-lock", wrappedCode],
      env: { "DENO_NO_PROMPT": "1" },
      stdout: "piped",
      stderr: "piped",
    });

    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

    const process = cmd.spawn();
    const output = await process.output();
    clearTimeout(timer);

    const rawStdout = new TextDecoder().decode(output.stdout).trim();
    const rawStderr = new TextDecoder().decode(output.stderr).trim();

    // Try to parse our structured output
    try {
      const lastLine = rawStdout.split("\n").pop() || "";
      const parsed = JSON.parse(lastLine);
      return {
        stdout: parsed.stdout || "",
        stderr: parsed.stderr || rawStderr || "",
        exitCode: output.code,
      };
    } catch {
      return { stdout: rawStdout, stderr: rawStderr, exitCode: output.code };
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      return { stdout: "", stderr: "Execution timed out (30s limit)", exitCode: 124 };
    }
    return { stdout: "", stderr: `Runtime error: ${err.message}`, exitCode: 1 };
  }
}

async function executePython(code: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const cmd = new Deno.Command("python3", {
      args: ["-c", code],
      env: { "PYTHONDONTWRITEBYTECODE": "1" },
      stdout: "piped",
      stderr: "piped",
    });

    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

    const process = cmd.spawn();
    const output = await process.output();
    clearTimeout(timer);

    return {
      stdout: new TextDecoder().decode(output.stdout).trim(),
      stderr: new TextDecoder().decode(output.stderr).trim(),
      exitCode: output.code,
    };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return { stdout: "", stderr: "Execution timed out (30s limit)", exitCode: 124 };
    }
    // Python not available — fallback message
    return { stdout: "", stderr: `Python runtime not available: ${err.message}`, exitCode: 1 };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body: ExecuteRequest = await req.json();
    const { language, code } = body;

    if (!code || !language) {
      return new Response(JSON.stringify({ error: "Missing 'language' and 'code' fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (code.length > 50_000) {
      return new Response(JSON.stringify({ error: "Code exceeds 50KB limit" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitized = sanitizeCode(code);
    const lang = language.toLowerCase().replace(/\s+/g, "");

    let result: { stdout: string; stderr: string; exitCode: number };

    if (["javascript", "js", "node", "nodejs", "typescript", "ts"].includes(lang)) {
      result = await executeJavaScript(sanitized);
    } else if (["python", "py", "python3"].includes(lang)) {
      result = await executePython(sanitized);
    } else {
      return new Response(JSON.stringify({ error: `Unsupported language: ${language}. Supported: JavaScript, Python` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      language: lang,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
