/**
 * Project Lifecycle Manager — Layaa OS
 *
 * Manages the complete lifecycle of projects and work contexts on the Layaa AI platform.
 * Every agent on the platform can work within a project context — this module provides
 * the unified API for creating, activating, switching, and archiving projects.
 *
 * Uses existing tables: projects, work_contexts, context_memories, project_knowledge
 * Zero new DB tables required.
 */

import { supabase } from "@/integrations/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface WorkContext {
  context_id: string;
  context_type: "platform_project" | "local_folder";
  display_name: string;
  folder_path: string | null;
  project_id: string | null;
  user_id: string;
  last_used_at: string | null;
  last_refresh_at: string | null;
  created_at: string | null;
}

export interface ProjectWithContext {
  project_id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  visibility: string;
  is_archived: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined data
  agent_count?: number;
  context_id?: string; // linked work_context if exists
  folder_path?: string | null;
}

export interface ContextMemory {
  memory_id: string;
  context_id: string;
  key: string;
  value: string;
  source: string | null;
  updated_at: string | null;
}

// ─── Project Creation ───────────────────────────────────────────────────────

/**
 * Create a new project from scratch.
 * Creates the project row + a work_context entry linking them.
 */
export async function createProject(params: {
  name: string;
  description?: string;
  instructions?: string;
  userId: string;
  folderPath?: string;
}): Promise<{ projectId: string; contextId: string }> {
  // Create the project
  const { data: project, error: projErr } = await supabase
    .from("projects")
    .insert({
      name: params.name,
      description: params.description || "",
      instructions: params.instructions || "",
      created_by: params.userId,
      visibility: "private",
    })
    .select("project_id")
    .single();

  if (projErr || !project) throw new Error(`Failed to create project: ${projErr?.message}`);

  // Create a work context linked to this project
  const { data: ctx, error: ctxErr } = await supabase
    .from("work_contexts")
    .insert({
      context_type: params.folderPath ? "local_folder" : "platform_project",
      display_name: params.name,
      project_id: project.project_id,
      folder_path: params.folderPath || null,
      user_id: params.userId,
      last_used_at: new Date().toISOString(),
    })
    .select("context_id")
    .single();

  if (ctxErr || !ctx) throw new Error(`Failed to create work context: ${ctxErr?.message}`);

  return { projectId: project.project_id, contextId: ctx.context_id };
}

/**
 * Open an existing local folder as a project.
 * Creates a project row + work_context with folder_path.
 */
export async function openFolderAsProject(params: {
  folderPath: string;
  displayName: string;
  userId: string;
  description?: string;
}): Promise<{ projectId: string; contextId: string }> {
  return createProject({
    name: params.displayName,
    description: params.description || `Local folder: ${params.folderPath}`,
    userId: params.userId,
    folderPath: params.folderPath,
  });
}

// ─── Project Activation & Context Switching ─────────────────────────────────

/**
 * Activate a project — sets it as the current working context.
 * Deactivates any previously active context for this user first (isolation).
 */
export async function activateProject(
  projectId: string,
  userId: string
): Promise<WorkContext | null> {
  // Deactivate all current active contexts for this user
  await supabase
    .from("work_contexts")
    .update({ is_active: false } as any)
    .eq("user_id", userId)
    .eq("is_active", true);

  // Find the work_context for this project
  const { data: ctx } = await supabase
    .from("work_contexts")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!ctx) {
    // No work_context exists yet — create one
    const { data: newCtx, error } = await supabase
      .from("work_contexts")
      .insert({
        context_type: "platform_project",
        display_name: projectId,
        project_id: projectId,
        user_id: userId,
        last_used_at: new Date().toISOString(),
      })
      .select("*")
      .single();
    if (error || !newCtx) return null;

    await supabase
      .from("work_contexts")
      .update({ is_active: true, last_used_at: new Date().toISOString() } as any)
      .eq("context_id", newCtx.context_id);

    return newCtx as WorkContext;
  }

  // Activate the found context
  await supabase
    .from("work_contexts")
    .update({ is_active: true, last_used_at: new Date().toISOString() } as any)
    .eq("context_id", ctx.context_id);

  return ctx as WorkContext;
}

/**
 * Deactivate the current project context.
 * Clears active state — agent returns to global (non-project) mode.
 */
export async function deactivateProject(userId: string): Promise<void> {
  await supabase
    .from("work_contexts")
    .update({ is_active: false } as any)
    .eq("user_id", userId)
    .eq("is_active", true);
}

/**
 * Get the currently active work context for a user.
 */
export async function getActiveContext(userId: string): Promise<WorkContext | null> {
  const { data } = await supabase
    .from("work_contexts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  return (data as WorkContext) ?? null;
}

// ─── Project Context for Injection ──────────────────────────────────────────

/**
 * Build the complete project context block for injection into an agent's system prompt.
 * Loads: project instructions + KB knowledge + context memories.
 * Returns a formatted markdown block ready for injection.
 *
 * This is the key function that makes ANY agent project-aware.
 */
export async function buildProjectContextInjection(projectId: string): Promise<string> {
  // 1. Load project details
  const { data: project } = await supabase
    .from("projects")
    .select("name, description, instructions")
    .eq("project_id", projectId)
    .single();

  if (!project) return "";

  // 2. Load project knowledge chunks (top 10 by relevance)
  const { data: kbChunks } = await supabase
    .from("project_knowledge_chunks")
    .select("content, keywords")
    .eq("project_id", projectId)
    .limit(10);

  // 3. Load context memories for this project's work context
  const { data: workCtx } = await supabase
    .from("work_contexts")
    .select("context_id")
    .eq("project_id", projectId)
    .limit(1)
    .maybeSingle();

  let contextMemories: ContextMemory[] = [];
  if (workCtx) {
    const { data: mems } = await supabase
      .from("context_memories")
      .select("*")
      .eq("context_id", workCtx.context_id)
      .order("updated_at", { ascending: false })
      .limit(20);
    contextMemories = (mems ?? []) as ContextMemory[];
  }

  // 4. Build the injection block
  const sections: string[] = [];

  // Project identity
  sections.push(`## Project: ${project.name}`);
  if (project.description) sections.push(project.description);

  // Project instructions
  if (project.instructions) {
    sections.push(`\n### Project Instructions\n${project.instructions}`);
  }

  // Knowledge base context
  if (kbChunks && kbChunks.length > 0) {
    const kbText = kbChunks.map((c: any) => c.content.slice(0, 1500)).join("\n---\n");
    sections.push(`\n### Project Knowledge Base\n${kbText}`);
  }

  // Context memories
  if (contextMemories.length > 0) {
    const memLines = contextMemories.map(m => `- **${m.key}**: ${m.value}`).join("\n");
    sections.push(`\n### Project Memory\n${memLines}`);
  }

  const body = sections.join("\n");

  return `\n\n[PROJECT CONTEXT — LAYAA OS]
You are currently working within a specific project on the Layaa AI platform. All your responses, decisions, and file operations should be scoped to this project. Do not reference or use information from other projects.

${body}

_Project context loaded by Layaa OS Project Manager_
[END PROJECT CONTEXT]`;
}

// ─── Context Memory CRUD ────────────────────────────────────────────────────

export async function addContextMemory(
  contextId: string,
  key: string,
  value: string,
  userId: string,
  source: string = "manual"
): Promise<void> {
  await supabase.from("context_memories").insert({
    context_id: contextId,
    key,
    value,
    source,
    user_id: userId,
  });
}

export async function getContextMemories(contextId: string): Promise<ContextMemory[]> {
  const { data } = await supabase
    .from("context_memories")
    .select("*")
    .eq("context_id", contextId)
    .order("updated_at", { ascending: false });
  return (data ?? []) as ContextMemory[];
}

export async function deleteContextMemory(memoryId: string): Promise<void> {
  await supabase.from("context_memories").delete().eq("memory_id", memoryId);
}

// ─── Project List & Search ──────────────────────────────────────────────────

export async function getRecentProjects(userId: string, limit: number = 10): Promise<ProjectWithContext[]> {
  // Get work contexts with project joins, ordered by last used
  const { data: contexts } = await supabase
    .from("work_contexts")
    .select("*, projects(project_id, name, description, instructions, visibility, is_archived, created_by, created_at, updated_at)")
    .eq("user_id", userId)
    .order("last_used_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (!contexts) return [];

  return contexts
    .filter((c: any) => c.projects && !c.projects.is_archived)
    .map((c: any) => ({
      ...c.projects,
      context_id: c.context_id,
      folder_path: c.folder_path,
    }));
}

// ─── Project Templates ──────────────────────────────────────────────────────

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  instructions: string;
  suggestedAgents: string[]; // agent IDs
  initialMemories: { key: string; value: string }[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "client-onboarding",
    name: "New Client Onboarding",
    description: "Onboard a new client — discovery, requirements, proposal, agreement, and kickoff.",
    instructions: "This is a client onboarding project. Follow the Layaa AI methodology: Discovery → Assessment → Development → Validation → Enablement. Document all client requirements, decisions, and deliverables here.",
    suggestedAgents: ["arjun", "rishi", "yuvaan", "abhay", "arush"],
    initialMemories: [
      { key: "methodology", value: "Following Layaa AI 5-stage delivery: Discovery → Assessment → Development → Validation → Enablement" },
      { key: "status", value: "Onboarding in progress — discovery phase" },
    ],
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    description: "Plan, create, and execute a marketing campaign end-to-end.",
    instructions: "This is a marketing campaign project. Define target audience, messaging, channels, timeline, and success metrics. All campaign assets and copy should be stored here.",
    suggestedAgents: ["mira", "tara", "zoya", "nia", "kshitiz"],
    initialMemories: [
      { key: "campaign_type", value: "Define: awareness / lead gen / product launch / content series" },
      { key: "status", value: "Campaign planning phase" },
    ],
  },
  {
    id: "product-development",
    name: "Product Development",
    description: "Build a product feature or new product — from spec to launch.",
    instructions: "This is a product development project. Follow: Spec → Architecture → Build → QA → Deploy. All technical decisions, code references, and architecture docs go here.",
    suggestedAgents: ["dev", "ujjawal", "rohit", "arush", "kabir"],
    initialMemories: [
      { key: "phase", value: "Define: ideation / spec / build / qa / launch" },
      { key: "stack", value: "Define the tech stack for this product" },
    ],
  },
  {
    id: "legal-review",
    name: "Legal Review",
    description: "Review contracts, agreements, or regulatory compliance matters.",
    instructions: "This is a legal review project. All contracts, clauses, risk assessments, and compliance checks should be documented here. Flag any red flags immediately.",
    suggestedAgents: ["abhay", "preeti", "anne", "kabir"],
    initialMemories: [
      { key: "review_type", value: "Define: contract review / regulatory check / NDA / compliance audit" },
      { key: "priority", value: "Define priority level and deadline" },
    ],
  },
  {
    id: "financial-audit",
    name: "Financial Audit & Reporting",
    description: "Prepare financial statements, audits, or compliance filings.",
    instructions: "This is a financial project. All financial data, statements, compliance checks, and filing preparations go here. Maintain accuracy and audit trail.",
    suggestedAgents: ["anne", "aarav", "veer", "preeti"],
    initialMemories: [
      { key: "audit_type", value: "Define: quarterly review / annual audit / tax filing / compliance" },
      { key: "period", value: "Define the financial period being covered" },
    ],
  },
  {
    id: "technical-build",
    name: "Technical Build / Automation",
    description: "Build automations, integrations, or technical infrastructure.",
    instructions: "This is a technical build project. Document architecture decisions, API integrations, workflow designs, and testing results here. All code should reference this project context.",
    suggestedAgents: ["ujjawal", "dev", "rohit", "kaiser", "arush"],
    initialMemories: [
      { key: "build_type", value: "Define: n8n workflow / API integration / platform feature / infrastructure" },
      { key: "stack", value: "Define the technologies and tools being used" },
    ],
  },
];

/**
 * Create a project from a template.
 * Creates the project, work context, assigns suggested agents, and seeds initial memories.
 */
export async function createProjectFromTemplate(
  templateId: string,
  userId: string,
  customName?: string
): Promise<{ projectId: string; contextId: string }> {
  const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
  if (!template) throw new Error("Template not found");

  const name = customName || template.name;
  const { projectId, contextId } = await createProject({
    name,
    description: template.description,
    instructions: template.instructions,
    userId,
  });

  // Assign suggested agents
  for (const agentId of template.suggestedAgents) {
    await supabase.from("project_agents").insert({ project_id: projectId, agent_id: agentId, added_by: userId }).select().maybeSingle();
  }

  // Seed initial memories
  for (const mem of template.initialMemories) {
    await addContextMemory(contextId, mem.key, mem.value, userId, "template");
  }

  return { projectId, contextId };
}

// ─── Project Archiving & Duplication ────────────────────────────────────────

export async function archiveProject(projectId: string): Promise<void> {
  await supabase.from("projects").update({ is_archived: true }).eq("project_id", projectId);
}

export async function duplicateProject(projectId: string, userId: string, newName: string): Promise<string> {
  // Get original project
  const { data: original } = await supabase.from("projects")
    .select("name, description, instructions, visibility")
    .eq("project_id", projectId).single();

  if (!original) throw new Error("Project not found");

  // Create duplicate
  const { data: newProj } = await supabase.from("projects").insert({
    name: newName || `${original.name} (copy)`,
    description: original.description,
    instructions: original.instructions,
    visibility: original.visibility,
    created_by: userId,
  }).select("project_id").single();

  if (!newProj) throw new Error("Failed to create duplicate");

  // Copy agent assignments
  const { data: agents } = await supabase.from("project_agents").select("agent_id").eq("project_id", projectId);
  for (const a of (agents ?? [])) {
    await supabase.from("project_agents").insert({ project_id: newProj.project_id, agent_id: a.agent_id, added_by: userId });
  }

  // Create work context
  await supabase.from("work_contexts").insert({
    context_type: "platform_project", display_name: newName || `${original.name} (copy)`,
    project_id: newProj.project_id, user_id: userId,
  });

  return newProj.project_id;
}
