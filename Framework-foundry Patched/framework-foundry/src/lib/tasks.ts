/**
 * Task Enhancement Layer — Layaa OS
 *
 * Adds priority, subtasks, comments, deal values, and contacts to the existing
 * tasks table WITHOUT requiring new DB columns. Uses a structured JSON format
 * within the description field and localStorage for UI-only metadata.
 *
 * Format: Tasks with enhanced data store a JSON block at the start of description:
 * <!--LAYAA_META:{"priority":"P1","subtasks":[...],"dealValue":50000,"contact":{...}}-->
 * Followed by the actual human-readable description.
 *
 * This is transparent — the meta block is stripped before display, and agents
 * see only the clean description. All existing tasks continue to work unchanged.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type TaskPriority = "P0" | "P1" | "P2" | "P3";

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskContact {
  name: string;
  email?: string;
  company?: string;
  phone?: string;
}

export interface TaskMeta {
  priority: TaskPriority;
  subtasks: Subtask[];
  dealValue?: number; // ₹ amount for CRM deals
  contact?: TaskContact;
  comments?: { author: string; text: string; timestamp: string }[];
}

const META_REGEX = /^<!--LAYAA_META:(.*?)-->\n?/;

// ─── Parse / Serialize ──────────────────────────────────────────────────────

/**
 * Extract structured metadata from a task description.
 * Returns the meta object and the clean description (without the meta block).
 */
export function parseTaskMeta(description: string): { meta: TaskMeta; cleanDescription: string } {
  const match = description.match(META_REGEX);
  if (match) {
    try {
      const meta = JSON.parse(match[1]) as TaskMeta;
      const cleanDescription = description.slice(match[0].length);
      return { meta: { priority: "P2", subtasks: [], comments: [], ...meta }, cleanDescription };
    } catch { /* invalid JSON — treat as plain description */ }
  }
  return {
    meta: { priority: "P2", subtasks: [], comments: [] },
    cleanDescription: description,
  };
}

/**
 * Serialize metadata back into a description string.
 */
export function serializeTaskMeta(meta: TaskMeta, cleanDescription: string): string {
  return `<!--LAYAA_META:${JSON.stringify(meta)}-->\n${cleanDescription}`;
}

// ─── Priority Helpers ───────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; sortOrder: number }> = {
  P0: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/30", sortOrder: 0 },
  P1: { label: "High", color: "bg-warning/10 text-warning border-warning/30", sortOrder: 1 },
  P2: { label: "Medium", color: "bg-primary/10 text-primary border-primary/30", sortOrder: 2 },
  P3: { label: "Low", color: "bg-muted text-muted-foreground border-border", sortOrder: 3 },
};

// ─── Subtask Helpers ────────────────────────────────────────────────────────

export function addSubtask(meta: TaskMeta, text: string): TaskMeta {
  return {
    ...meta,
    subtasks: [...meta.subtasks, { id: `st-${Date.now()}`, text, done: false }],
  };
}

export function toggleSubtask(meta: TaskMeta, subtaskId: string): TaskMeta {
  return {
    ...meta,
    subtasks: meta.subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s),
  };
}

export function removeSubtask(meta: TaskMeta, subtaskId: string): TaskMeta {
  return {
    ...meta,
    subtasks: meta.subtasks.filter(s => s.id !== subtaskId),
  };
}

// ─── Comment Helpers ────────────────────────────────────────────────────────

export function addComment(meta: TaskMeta, author: string, text: string): TaskMeta {
  return {
    ...meta,
    comments: [...(meta.comments ?? []), { author, text, timestamp: new Date().toISOString() }],
  };
}

// ─── Task Templates ─────────────────────────────────────────────────────────

export interface TaskTemplate {
  id: string;
  name: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultPriority: TaskPriority;
  suggestedAgent: string; // agent ID
  subtasks?: string[]; // default subtask texts
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "bug-report",
    name: "Bug Report",
    defaultTitle: "Bug: ",
    defaultDescription: "Steps to reproduce:\n1. \n2. \n\nExpected behavior:\n\nActual behavior:\n\nEnvironment:",
    defaultPriority: "P1",
    suggestedAgent: "rohit",
    subtasks: ["Reproduce the issue", "Identify root cause", "Implement fix", "Test fix", "Deploy"],
  },
  {
    id: "feature-request",
    name: "Feature Request",
    defaultTitle: "Feature: ",
    defaultDescription: "User story:\nAs a [user], I want [goal], so that [benefit].\n\nAcceptance criteria:\n- \n\nNotes:",
    defaultPriority: "P2",
    suggestedAgent: "dev",
    subtasks: ["Write spec", "Design review", "Implementation", "QA", "Deploy"],
  },
  {
    id: "client-task",
    name: "Client Task",
    defaultTitle: "Client: ",
    defaultDescription: "Client:\nTask:\nDeadline:\nDeliverables:\n",
    defaultPriority: "P1",
    suggestedAgent: "arjun",
    subtasks: ["Understand requirements", "Execute", "Internal review", "Deliver to client", "Get confirmation"],
  },
  {
    id: "review-task",
    name: "Review / Audit",
    defaultTitle: "Review: ",
    defaultDescription: "What to review:\nScope:\nCriteria:\n",
    defaultPriority: "P2",
    suggestedAgent: "rohit",
    subtasks: ["Initial review", "Document findings", "Recommend actions", "Follow up"],
  },
  {
    id: "content-task",
    name: "Content Creation",
    defaultTitle: "Content: ",
    defaultDescription: "Topic:\nFormat:\nTarget audience:\nChannel:\nDeadline:\n",
    defaultPriority: "P2",
    suggestedAgent: "tara",
    subtasks: ["Research/brief", "First draft", "Brand review", "Final edit", "Publish"],
  },
];

// ─── Due Date Helpers ───────────────────────────────────────────────────────

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < Date.now();
}

export function isDueSoon(dueDate: string | null, hoursThreshold: number = 24): boolean {
  if (!dueDate) return false;
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  return due > now && due - now < hoursThreshold * 60 * 60 * 1000;
}
