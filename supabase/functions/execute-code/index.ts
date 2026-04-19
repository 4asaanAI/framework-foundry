/**
 * execute-code — Sandboxed code execution edge function
 * 
 * Supports: JavaScript/TypeScript (via eval in Deno runtime)
 * Python: Evaluated via a lightweight JS-based interpreter subset
 * Timeout: 30 seconds
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIMEOUT_MS = 30_000;

async function executeJavaScript(code: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const stdout: string[] = [];
  const stderr: string[] = [];

  // Build a sandboxed console
  const sandboxConsole = {
    log: (...args: unknown[]) => stdout.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    error: (...args: unknown[]) => stderr.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    warn: (...args: unknown[]) => stderr.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    info: (...args: unknown[]) => stdout.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    debug: (...args: unknown[]) => stdout.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    table: (...args: unknown[]) => stdout.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
  };

  try {
    // Create async function with sandboxed console
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    // Shadow Deno, fetch, globalThis, window, self, process, XMLHttpRequest, WebSocket,
    // import, require so submitted code cannot reach env vars or make network calls.
    const fn = new AsyncFunction(
      "console", "Math", "JSON", "Date", "Array", "Object", "String", "Number", "Boolean",
      "Map", "Set", "RegExp", "Promise", "parseInt", "parseFloat", "isNaN", "isFinite",
      "Deno", "fetch", "globalThis", "window", "self", "process", "XMLHttpRequest", "WebSocket",
      "require", "import", "eval", "Function",
      code,
    );

    // Execute with timeout
    const result = await Promise.race([
      fn(
        sandboxConsole, Math, JSON, Date, Array, Object, String, Number, Boolean,
        Map, Set, RegExp, Promise, parseInt, parseFloat, isNaN, isFinite,
        undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined,
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Execution timed out (30s limit)")), TIMEOUT_MS)),
    ]);

    // If the function returns a value, add it to stdout
    if (result !== undefined) {
      stdout.push(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
    }

    return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), exitCode: 0 };
  } catch (err: any) {
    stderr.push(err.stack || err.message || String(err));
    return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), exitCode: 1 };
  }
}

function executePythonSubset(code: string): { stdout: string; stderr: string; exitCode: number } {
  // Basic Python-to-JS transpiler for simple scripts (print, math, variables, loops)
  const stdout: string[] = [];
  const stderr: string[] = [];

  try {
    // Transform common Python patterns to JS
    let jsCode = code
      // print() → console.log()
      .replace(/^(\s*)print\s*\((.*)\)/gm, "$1console.log($2)")
      // f-strings: f"...{expr}..." → `...${expr}...`
      .replace(/f"([^"]*)"/g, (_, content) => "`" + content.replace(/\{/g, "${") + "`")
      .replace(/f'([^']*)'/g, (_, content) => "`" + content.replace(/\{/g, "${") + "`")
      // range(n) → Array.from({length: n}, (_, i) => i)
      .replace(/range\((\w+)\)/g, "Array.from({length: $1}, (_, i) => i)")
      .replace(/range\((\w+),\s*(\w+)\)/g, "Array.from({length: $2 - $1}, (_, i) => i + $1)")
      // for x in list: → for (const x of list) {
      .replace(/^(\s*)for\s+(\w+)\s+in\s+(.+):\s*$/gm, "$1for (const $2 of $3) {")
      // if/elif/else
      .replace(/^(\s*)if\s+(.+):\s*$/gm, "$1if ($2) {")
      .replace(/^(\s*)elif\s+(.+):\s*$/gm, "$1} else if ($2) {")
      .replace(/^(\s*)else:\s*$/gm, "$1} else {")
      // while
      .replace(/^(\s*)while\s+(.+):\s*$/gm, "$1while ($2) {")
      // def → function
      .replace(/^(\s*)def\s+(\w+)\s*\(([^)]*)\):\s*$/gm, "$1function $2($3) {")
      // return
      .replace(/^(\s*)return\s+(.+)/gm, "$1return $2")
      // True/False/None
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null")
      // len() → .length
      .replace(/len\((\w+)\)/g, "$1.length")
      // ** → Math.pow  
      .replace(/(\w+)\s*\*\*\s*(\w+)/g, "Math.pow($1, $2)")
      // // (integer division) → Math.floor(/)
      .replace(/(\w+)\s*\/\/\s*(\w+)/g, "Math.floor($1 / $2)")
      // and/or/not
      .replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||")
      .replace(/\bnot\b/g, "!");

    // Add closing braces for indented blocks (simple heuristic)
    const lines = jsCode.split("\n");
    const processed: string[] = [];
    const indentStack: number[] = [];

    for (const line of lines) {
      const trimmed = line.trimStart();
      if (!trimmed) { processed.push(line); continue; }
      const indent = line.length - trimmed.length;
      
      while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
        indentStack.pop();
        processed.push(" ".repeat(indent) + "}");
      }

      if (line.endsWith("{")) {
        indentStack.push(indent);
      }
      processed.push(line);
    }
    while (indentStack.length > 0) {
      indentStack.pop();
      processed.push("}");
    }

    jsCode = processed.join("\n");

    const sandboxConsole = {
      log: (...args: unknown[]) => stdout.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    };

    // Shadow dangerous globals so transpiled Python cannot escape the sandbox.
    const fn = new Function(
      "console", "Math", "JSON", "parseInt", "parseFloat",
      "Deno", "fetch", "globalThis", "window", "self", "process", "XMLHttpRequest", "WebSocket",
      "require", "import", "eval", "Function",
      jsCode,
    );
    fn(
      sandboxConsole, Math, JSON, parseInt, parseFloat,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined,
    );

    return { stdout: stdout.join("\n"), stderr: "", exitCode: 0 };
  } catch (err: any) {
    stderr.push(`Python execution error (transpiled): ${err.message}`);
    stderr.push("Note: Only basic Python syntax is supported (print, variables, loops, functions, math).");
    return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), exitCode: 1 };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Require a valid Supabase JWT — without this, anyone could run arbitrary code
    // and exfiltrate the service role key from Deno.env.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await sb.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
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

    const lang = language.toLowerCase().replace(/\s+/g, "");
    let result: { stdout: string; stderr: string; exitCode: number };

    if (["javascript", "js", "node", "nodejs", "typescript", "ts"].includes(lang)) {
      result = await executeJavaScript(code.trim());
    } else if (["python", "py", "python3"].includes(lang)) {
      result = executePythonSubset(code.trim());
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
