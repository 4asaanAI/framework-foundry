/**
 * Project Details Panel — Layaa OS
 *
 * Claude "Projects"-level detail panel with:
 * - Inline editable name & description
 * - Prominent drag-drop KB upload area
 * - Rich text instructions editor
 * - Project activity feed
 * - Memory management with auto-extract toggle
 * - Agent assignment
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pencil, Check, X, MessageSquare, Users, BookOpen, FileText,
  Upload, Trash2, FolderKanban, Clock, Brain, Activity,
  GripVertical, Plus, ChevronRight, Loader2, CloudUpload,
  ToggleLeft, Settings2, Bold, Italic, List, Heading2,
  Link as LinkIcon, Code, AlignLeft
} from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS, TEAM_LABELS } from "@/constants/agents";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { NewConversationDialog } from "./NewConversationDialog";

interface ProjectDetailsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onStartChat?: (agentId: string, projectId: string) => void;
}

// ─── Drag-Drop KB Upload ────────────────────────────────────────────────────

function KBUploadArea({
  projectId,
  onUploaded,
}: {
  projectId: string;
  onUploaded: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const text = await file.text();
        const { error } = await supabase.from("project_kbs").insert({
          project_id: projectId,
          filename: file.name,
          content: text,
          file_size: file.size,
        });
        if (error) { toast.error(`Failed: ${file.name}`); continue; }

        // Chunk for search
        const chunkSize = 8000;
        const overlap = 200;
        const { data: kbData } = await supabase
          .from("project_kbs")
          .select("id")
          .eq("project_id", projectId)
          .eq("filename", file.name)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (kbData) {
          for (let i = 0; i < text.length; i += chunkSize - overlap) {
            const chunk = text.slice(i, i + chunkSize);
            const words = chunk.toLowerCase().split(/\W+/).filter(w => w.length > 3);
            const freq: Record<string, number> = {};
            words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
            const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
            await supabase.from("project_kb_chunks").insert({
              project_kb_id: kbData.id,
              chunk_index: Math.floor(i / (chunkSize - overlap)),
              content: chunk,
              keywords,
            });
          }
        }
        toast.success(`Uploaded ${file.name}`);
      } catch {
        toast.error(`Error processing ${file.name}`);
      }
    }
    setUploading(false);
    onUploaded();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [projectId]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
        dragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/40 hover:bg-muted/30",
        uploading && "pointer-events-none opacity-70"
      )}
    >
      <div className="flex flex-col items-center justify-center py-8 px-4">
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm font-medium text-foreground">Uploading & chunking...</p>
          </>
        ) : (
          <>
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-200",
              dragging ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
            )}>
              <CloudUpload className={cn(
                "h-6 w-6 transition-colors",
                dragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )} />
            </div>
            <p className="text-sm font-medium text-foreground mb-0.5">
              {dragging ? "Drop files here" : "Drag & drop files"}
            </p>
            <p className="text-xs text-muted-foreground">
              or <span className="text-primary font-medium">click to browse</span> — PDF, TXT, MD, JSON, CSV
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.txt,.md,.json,.csv,.docx,.doc,.yaml,.yml,.xml"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}

// ─── KB File List ───────────────────────────────────────────────────────────

function KBFileItem({ file, onDelete }: { file: any; onDelete: () => void }) {
  const ext = file.filename?.split(".").pop()?.toLowerCase() ?? "";
  const iconColor = {
    pdf: "text-red-400", md: "text-blue-400", json: "text-yellow-400",
    csv: "text-green-400", txt: "text-muted-foreground",
  }[ext] || "text-muted-foreground";

  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/20 transition-all duration-200">
      <FileText className={cn("h-4 w-4 shrink-0", iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">{file.filename}</p>
        <p className="text-[11px] text-muted-foreground">
          {(file.file_size / 1024).toFixed(1)} KB
          {file.created_at && ` · ${formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}`}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Rich Instructions Editor ───────────────────────────────────────────────

function InstructionsEditor({
  value,
  onChange,
  onSave,
  saving,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const newValue = value.slice(0, start) + replacement + value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Heading2, label: "Heading", action: () => insertMarkdown("## ", "") },
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("_", "_") },
    { icon: List, label: "List", action: () => insertMarkdown("- ", "") },
    { icon: Code, label: "Code", action: () => insertMarkdown("`", "`") },
    { icon: LinkIcon, label: "Link", action: () => insertMarkdown("[", "](url)") },
  ];

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/40 border-b border-border">
        {toolbarButtons.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            title={label}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <div className="flex-1" />
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="h-7 text-xs px-3"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write instructions for agents working on this project...&#10;&#10;Use markdown: **bold**, _italic_, ## headings, - lists, `code`"
        className="w-full min-h-[200px] p-4 text-sm text-foreground bg-background resize-y outline-none font-mono leading-relaxed placeholder:text-muted-foreground/50"
        spellCheck={false}
      />
    </div>
  );
}

// ─── Activity Feed ──────────────────────────────────────────────────────────

function ActivityFeed({ projectId }: { projectId: string }) {
  // Aggregate activity from various sources
  const { data: kbActivity } = useQuery({
    queryKey: ["project-kb-activity", projectId],
    queryFn: async () => {
      const { data } = await supabase
        .from("project_kbs")
        .select("id, filename, created_at, file_size")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(10);
      return (data ?? []).map((kb: any) => ({
        id: `kb-${kb.id}`,
        type: "kb_upload" as const,
        description: `Uploaded "${kb.filename}" (${(kb.file_size / 1024).toFixed(1)} KB)`,
        timestamp: kb.created_at,
        icon: Upload,
        color: "text-blue-400",
      }));
    },
  });

  const { data: taskActivity } = useQuery({
    queryKey: ["project-task-activity", projectId],
    queryFn: async () => {
      const { data } = await supabase
        .from("tasks")
        .select("id, title, status, created_at, updated_at, agents(name)")
        .eq("project_id", projectId)
        .order("updated_at", { ascending: false })
        .limit(10);
      return (data ?? []).map((t: any) => ({
        id: `task-${t.id}`,
        type: "task" as const,
        description: `Task "${t.title}" — ${t.status}${t.agents?.name ? ` (${t.agents.name})` : ""}`,
        timestamp: t.updated_at || t.created_at,
        icon: Activity,
        color: t.status === "completed" ? "text-green-400" : "text-muted-foreground",
      }));
    },
  });

  const { data: convActivity } = useQuery({
    queryKey: ["project-conv-activity", projectId],
    queryFn: async () => {
      const { data } = await supabase
        .from("conversations")
        .select("id, title, created_at, agents(name)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(5);
      return (data ?? []).map((c: any) => ({
        id: `conv-${c.id}`,
        type: "conversation" as const,
        description: `Conversation "${c.title}"${c.agents?.name ? ` with ${c.agents.name}` : ""}`,
        timestamp: c.created_at,
        icon: MessageSquare,
        color: "text-primary",
      }));
    },
  });

  const allActivity = [
    ...(kbActivity ?? []),
    ...(taskActivity ?? []),
    ...(convActivity ?? []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);

  if (allActivity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
        <Activity className="h-8 w-8 mb-2" />
        <p className="text-sm">No activity yet</p>
        <p className="text-xs mt-0.5">Upload files or start conversations to see activity here</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

      <div className="space-y-0">
        {allActivity.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative flex items-start gap-3 py-2.5 px-1 group">
              {/* Dot */}
              <div className={cn("relative z-10 w-[30px] h-[30px] rounded-full bg-card border border-border flex items-center justify-center shrink-0 transition-colors group-hover:border-primary/30")}>
                <Icon className={cn("h-3.5 w-3.5", item.color)} />
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[13px] text-foreground leading-snug">{item.description}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Memory Management ──────────────────────────────────────────────────────

function MemoryManager({ projectId, contextId }: { projectId: string; contextId?: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [autoExtract, setAutoExtract] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: memories, isLoading } = useQuery({
    queryKey: ["context-memories", contextId],
    enabled: !!contextId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_memories")
        .select("*")
        .eq("context_id", contextId!)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim() || !contextId) return;
    await supabase.from("context_memories").insert({
      context_id: contextId,
      key: newKey.trim(),
      value: newValue.trim(),
      source: "manual",
      user_id: user?.id,
    });
    setNewKey("");
    setNewValue("");
    queryClient.invalidateQueries({ queryKey: ["context-memories", contextId] });
    toast.success("Memory added");
  };

  const handleSaveEdit = async (memoryId: string) => {
    await supabase.from("context_memories").update({ value: editValue, updated_at: new Date().toISOString() }).eq("memory_id", memoryId);
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey: ["context-memories", contextId] });
  };

  const handleDelete = async (memoryId: string) => {
    await supabase.from("context_memories").delete().eq("memory_id", memoryId);
    queryClient.invalidateQueries({ queryKey: ["context-memories", contextId] });
    toast.success("Memory removed");
  };

  return (
    <div className="space-y-4">
      {/* Auto-extract toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-[13px] font-medium text-foreground">Auto-extract memories</p>
            <p className="text-[11px] text-muted-foreground">Automatically extract key facts from KB uploads</p>
          </div>
        </div>
        <Switch checked={autoExtract} onCheckedChange={setAutoExtract} />
      </div>

      {/* Memory list */}
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
      ) : (memories ?? []).length > 0 ? (
        <div className="space-y-2">
          {(memories ?? []).map((mem: any) => (
            <div key={mem.memory_id} className="group rounded-lg border border-border bg-card p-3 hover:border-primary/20 transition-all duration-200">
              {editingId === mem.memory_id ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full text-sm bg-background border border-border rounded-md p-2 outline-none focus:border-primary/50 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => handleSaveEdit(mem.memory_id)} className="p-1 rounded hover:bg-muted text-primary"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setEditingId(null)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <Brain className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-primary">{mem.key}</span>
                    <p className="text-[13px] text-foreground mt-0.5 leading-snug">{mem.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{mem.source || "manual"}</span>
                      {mem.updated_at && (
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(mem.updated_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => { setEditingId(mem.memory_id); setEditValue(mem.value); }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil className="h-3 w-3" /></button>
                    <button onClick={() => handleDelete(mem.memory_id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
          <Brain className="h-6 w-6 mb-2" />
          <p className="text-sm">No memories yet</p>
          <p className="text-xs mt-0.5">Add key facts, decisions, and context below</p>
        </div>
      )}

      {/* Add new memory */}
      {contextId && (
        <div className="space-y-2 p-3 rounded-lg border border-dashed border-border bg-muted/20">
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key (e.g. tech_stack, deadline, client_name)"
            className="text-xs h-8"
          />
          <textarea
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value..."
            rows={2}
            className="w-full text-xs bg-background border border-border rounded-md p-2 outline-none focus:border-primary/50 resize-none"
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!newKey.trim() || !newValue.trim()}
            className="w-full h-8 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Memory
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────────────────

export function ProjectDetailsPanel({ open, onOpenChange, project, onStartChat }: ProjectDetailsPanelProps) {
  const { user } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [nameValue, setNameValue] = useState(project?.name ?? "");
  const [descValue, setDescValue] = useState(project?.description ?? "");
  const [instructions, setInstructions] = useState(project?.instructions ?? "");
  const [savingInstructions, setSavingInstructions] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("knowledge");
  const queryClient = useQueryClient();

  const projectId = project?.project_id ?? project?.id;

  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;

  // KB files
  const { data: kbFiles, refetch: refetchKb } = useQuery({
    queryKey: ["project_kbs", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("project_kbs").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!projectId,
  });

  // Assigned agents
  const { data: assignedAgents, refetch: refetchAssigned } = useQuery({
    queryKey: ["project_agents", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("project_agents").select("*, agents(id, name, avatar_initials, avatar_color, canonical_role)").eq("project_id", projectId);
      return data ?? [];
    },
    enabled: !!projectId,
  });

  // Work context for memories
  const { data: workContext } = useQuery({
    queryKey: ["project-work-context", projectId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("work_contexts")
        .select("context_id")
        .eq("project_id", projectId)
        .eq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!projectId && !!user,
  });

  useEffect(() => {
    if (project) {
      setNameValue(project.name ?? "");
      setDescValue(project.description ?? "");
      setInstructions(project.instructions ?? "");
    }
  }, [project]);

  const saveName = async () => {
    if (!nameValue.trim() || nameValue === project?.name) { setEditingName(false); return; }
    await supabase.from("projects").update({ name: nameValue.trim() }).eq("project_id", projectId);
    toast.success("Name updated");
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setEditingName(false);
  };

  const saveDesc = async () => {
    if (descValue === project?.description) { setEditingDesc(false); return; }
    await supabase.from("projects").update({ description: descValue.trim() }).eq("project_id", projectId);
    toast.success("Description updated");
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setEditingDesc(false);
  };

  const saveInstructions = async () => {
    setSavingInstructions(true);
    await supabase.from("projects").update({ instructions: instructions.trim() }).eq("project_id", projectId);
    toast.success("Instructions saved");
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setSavingInstructions(false);
  };

  const handleDeleteKb = async (kbId: string) => {
    await supabase.from("project_kb_chunks").delete().eq("project_kb_id", kbId);
    await supabase.from("project_kbs").delete().eq("id", kbId);
    toast.success("File removed");
    refetchKb();
  };

  const handleToggleAgent = async (agentId: string) => {
    const existing = assignedAgents?.find((a: any) => a.agent_id === agentId);
    if (existing) {
      await supabase.from("project_agents").delete().eq("id", existing.id);
      toast.success("Agent removed");
    } else {
      await supabase.from("project_agents").insert({ project_id: projectId, agent_id: agentId });
      toast.success("Agent added");
    }
    refetchAssigned();
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  if (!project) return null;

  const assignedIds = new Set((assignedAgents ?? []).map((a: any) => a.agent_id));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogTitle className="sr-only">Project Details</DialogTitle>

          {/* ─── Header ────────────────────────────────────────────────── */}
          <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                {/* Editable name */}
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") { setEditingName(false); setNameValue(project.name); } }}
                      className="text-lg font-semibold h-9"
                      autoFocus
                    />
                    <button onClick={saveName} className="p-1 rounded hover:bg-muted"><Check className="h-4 w-4 text-primary" /></button>
                    <button onClick={() => { setEditingName(false); setNameValue(project.name); }} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                ) : (
                  <button onClick={() => setEditingName(true)} className="flex items-center gap-2 group text-left">
                    <h2 className="text-lg font-semibold text-foreground">{project.name}</h2>
                    <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}

                {/* Editable description */}
                {editingDesc ? (
                  <div className="mt-1.5">
                    <Textarea
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveDesc(); } if (e.key === "Escape") { setEditingDesc(false); setDescValue(project.description); } }}
                      className="text-sm" rows={2} autoFocus
                    />
                    <div className="flex gap-1 mt-1">
                      <button onClick={saveDesc} className="p-1 rounded hover:bg-muted"><Check className="h-3.5 w-3.5 text-primary" /></button>
                      <button onClick={() => { setEditingDesc(false); setDescValue(project.description); }} className="p-1 rounded hover:bg-muted"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setEditingDesc(true); setDescValue(project.description ?? ""); }} className="text-sm text-muted-foreground text-left mt-0.5 group flex items-start gap-1">
                    <span className="line-clamp-2">{project.description || "Add a description..."}</span>
                    <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
                  </button>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <Badge variant={project.is_active !== false ? "default" : "secondary"} className="text-[10px] h-5">
                    {project.is_active !== false ? "Active" : "Inactive"}
                  </Badge>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {assignedIds.size} agents</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {kbFiles?.length ?? 0} files</span>
                  {project.created_at && (
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(project.created_at), "MMM d, yyyy")}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 mt-4">
              <Button size="sm" onClick={() => setShowAgentPicker(true)} className="h-8 text-xs">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> New Chat
              </Button>
            </div>
          </div>

          {/* ─── Tabs ──────────────────────────────────────────────────── */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mx-6 mt-2 grid grid-cols-5 h-9">
              <TabsTrigger value="knowledge" className="text-xs gap-1"><BookOpen className="h-3 w-3" /> Knowledge</TabsTrigger>
              <TabsTrigger value="instructions" className="text-xs gap-1"><AlignLeft className="h-3 w-3" /> Instructions</TabsTrigger>
              <TabsTrigger value="memory" className="text-xs gap-1"><Brain className="h-3 w-3" /> Memory</TabsTrigger>
              <TabsTrigger value="agents" className="text-xs gap-1"><Users className="h-3 w-3" /> Agents</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs gap-1"><Activity className="h-3 w-3" /> Activity</TabsTrigger>
            </TabsList>

            {/* Knowledge Tab */}
            <TabsContent value="knowledge" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="px-6 py-4 space-y-4">
                  <KBUploadArea projectId={projectId} onUploaded={() => refetchKb()} />

                  {(kbFiles ?? []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {kbFiles!.length} file{kbFiles!.length !== 1 ? "s" : ""} uploaded
                      </p>
                      {kbFiles!.map((file: any) => (
                        <KBFileItem key={file.id} file={file} onDelete={() => handleDeleteKb(file.id)} />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Instructions Tab */}
            <TabsContent value="instructions" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="px-6 py-4">
                  <InstructionsEditor
                    value={instructions}
                    onChange={setInstructions}
                    onSave={saveInstructions}
                    saving={savingInstructions}
                  />
                  <p className="text-[11px] text-muted-foreground mt-2">
                    These instructions are injected into every agent conversation scoped to this project. Supports Markdown.
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Memory Tab */}
            <TabsContent value="memory" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="px-6 py-4">
                  <MemoryManager projectId={projectId} contextId={workContext?.context_id} />
                  {!workContext && (
                    <p className="text-xs text-muted-foreground text-center mt-4 py-4 border border-dashed border-border rounded-lg">
                      Open this project in the workspace to enable memory management.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="px-6 py-4 space-y-2">
                  {/* Assigned agents first */}
                  {assignedIds.size > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Assigned</p>
                      <div className="space-y-1">
                        {(agents ?? []).filter(a => assignedIds.has(a.id)).map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => handleToggleAgent(agent.id)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all"
                          >
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}>
                              {agent.avatar_initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-foreground">{agent.name}</p>
                              <p className="text-[11px] text-muted-foreground">{agent.canonical_role}</p>
                            </div>
                            <Badge variant="default" className="text-[10px] h-5">Assigned</Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available agents */}
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Available</p>
                  <div className="space-y-1">
                    {(agents ?? []).filter(a => !assignedIds.has(a.id) && a.is_active).map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => handleToggleAgent(agent.id)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left border border-transparent hover:bg-muted/50 hover:border-border transition-all"
                      >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}>
                          {agent.avatar_initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-foreground">{agent.name}</p>
                          <p className="text-[11px] text-muted-foreground">{agent.canonical_role}</p>
                        </div>
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="px-6 py-4">
                  <ActivityFeed projectId={projectId} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <NewConversationDialog
        open={showAgentPicker}
        onOpenChange={setShowAgentPicker}
        onConversationCreated={() => {
          setShowAgentPicker(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
