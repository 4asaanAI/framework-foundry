/**
 * Project Workspace View — Layaa OS
 *
 * The main view when a user "opens" a project. Shows a split layout:
 * - Left: File tree (from KB or local folder via File System Access API)
 * - Center: Chat with the active agent (scoped to this project)
 * - Right: Project memory panel (context_memories for this project)
 *
 * Available to every agent on the platform. Any agent chatting within this view
 * automatically receives the project's context injection.
 */

import { useState, useEffect, useCallback } from "react";
import { useContextMemories } from "@/hooks/use-work-contexts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  FolderKanban, FileText, ChevronRight, ChevronDown,
  Folder, File, Brain, Plus, Trash2, Pencil, Check, X,
  ArrowLeft, FolderOpen, Loader2, RefreshCw,
} from "lucide-react";
import { getDirectoryHandle, readFileTree, readFileContent, type FileTreeNode } from "@/lib/filesystem";
import { ChatView } from "@/components/views/ChatView";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ProjectWorkspaceViewProps {
  projectId: string;
  projectName: string;
  contextId?: string;
  selectedAgentId?: string | null;
  onBack: () => void;
  onDelegation?: (delegatedConversationId: string, targetAgentId: string, targetAgentName: string) => void;
}

// ─── File Tree Component ────────────────────────────────────────────────────

function FileTreeItem({ node, depth = 0, onSelect }: { node: FileTreeNode; depth?: number; onSelect: (path: string) => void }) {
  const [expanded, setExpanded] = useState(depth < 1);

  return (
    <div>
      <button
        onClick={() => {
          if (node.kind === "directory") setExpanded(!expanded);
          else onSelect(node.path);
        }}
        className={cn(
          "flex items-center gap-1.5 w-full px-2 py-1 rounded-lg text-xs hover:bg-muted/60 transition-all duration-150 text-left",
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {node.kind === "directory" ? (
          <>
            {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
            <Folder className="h-3.5 w-3.5 text-primary/70 shrink-0" />
          </>
        ) : (
          <>
            <span className="w-3" />
            <File className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </>
        )}
        <span className="truncate text-foreground">{node.name}</span>
      </button>
      {node.kind === "directory" && expanded && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeItem key={child.path} node={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Project Memory Panel ───────────────────────────────────────────────────

function ProjectMemoryPanel({ contextId }: { contextId: string }) {
  const { data: memories, isLoading } = useContextMemories(contextId);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    await supabase.from("context_memories").insert({
      context_id: contextId, key: newKey.trim(), value: newValue.trim(), source: "manual", user_id: user?.id,
    });
    setNewKey(""); setNewValue("");
    queryClient.invalidateQueries({ queryKey: ["context-memories", contextId] });
    toast.success("Project memory added");
  };

  const handleSaveEdit = async (memoryId: string) => {
    await supabase.from("context_memories").update({ value: editValue, updated_at: new Date().toISOString() }).eq("memory_id", memoryId);
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey: ["context-memories", contextId] });
  };

  const handleDelete = async (memoryId: string) => {
    await supabase.from("context_memories").delete().eq("memory_id", memoryId);
    queryClient.invalidateQueries({ queryKey: ["context-memories", contextId] });
    toast.success("Memory deleted");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Brain className="h-3 w-3" /> Project Memory
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
        ) : (memories ?? []).length > 0 ? (
          (memories ?? []).map((mem: any) => (
            <div key={mem.memory_id} className="group p-2 rounded-lg bg-card border border-border text-xs hover:border-primary/20 transition-all duration-200">
              {editingId === mem.memory_id ? (
                <div className="space-y-1.5">
                  <Textarea value={editValue} onChange={e => setEditValue(e.target.value)} rows={2} className="text-xs" />
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => handleSaveEdit(mem.memory_id)} className="p-1 text-success hover:bg-success/10 rounded"><Check className="h-3 w-3" /></button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded"><X className="h-3 w-3" /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-1">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-primary">{mem.key}</span>
                    <p className="text-foreground mt-0.5 leading-snug">{mem.value}</p>
                    <span className="text-muted-foreground mt-1 block">{mem.source || "manual"}</span>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => { setEditingId(mem.memory_id); setEditValue(mem.value); }} className="p-0.5 text-muted-foreground hover:text-foreground rounded"><Pencil className="h-3 w-3" /></button>
                    <button onClick={() => handleDelete(mem.memory_id)} className="p-0.5 text-muted-foreground hover:text-destructive rounded"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic py-6 text-center">No project memory yet. Add facts, decisions, and context here.</p>
        )}
      </div>

      {/* Add new memory */}
      <div className="px-3 py-3 border-t border-border space-y-2">
        <Input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="Key (e.g. tech_stack)" className="text-xs h-8" />
        <Textarea value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Value (e.g. PostgreSQL + Node.js)" rows={2} className="text-xs" />
        <button
          onClick={handleAdd}
          disabled={!newKey.trim() || !newValue.trim()}
          className="flex items-center gap-1 w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 justify-center"
        >
          <Plus className="h-3 w-3" /> Add Memory
        </button>
      </div>
    </div>
  );
}

// ─── Main Workspace View ────────────────────────────────────────────────────

export function ProjectWorkspaceView({
  projectId, projectName, contextId, selectedAgentId, onBack, onDelegation,
}: ProjectWorkspaceViewProps) {
  const { user } = useAuth();
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [kbFiles, setKbFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileEdited, setFileEdited] = useState(false);
  const [loadingTree, setLoadingTree] = useState(false);
  const [gitStatus, setGitStatus] = useState<{ isGitRepo: boolean; branch: string | null; isDirty: boolean } | null>(null);

  // Load file tree from File System Access handle OR from project KB
  const loadFileTree = useCallback(async () => {
    setLoadingTree(true);
    try {
      // Try local folder handle first
      if (contextId) {
        const handle = getDirectoryHandle(contextId);
        if (handle) {
          const tree = await readFileTree(handle);
          setFileTree(tree);
          setLoadingTree(false);
          return;
        }
      }

      // Fall back to project KB files
      const { data: kbs } = await supabase
        .from("project_knowledge")
        .select("knowledge_id, filename, file_type, chunk_count")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      setKbFiles(kbs ?? []);
      // Convert KB files to a flat tree
      setFileTree((kbs ?? []).map((f: any) => ({
        name: f.filename,
        path: f.filename,
        kind: "file" as const,
      })));
    } catch (err) {
      console.error("[Layaa OS] Failed to load file tree:", err);
    } finally {
      setLoadingTree(false);
    }
  }, [projectId, contextId]);

  useEffect(() => { loadFileTree(); }, [loadFileTree]);

  // Load git status (lazy — only on mount)
  useEffect(() => {
    if (!contextId) return;
    const handle = getDirectoryHandle(contextId);
    if (!handle) return;
    import("@/lib/filesystem").then(({ getGitStatus }) => {
      getGitStatus(handle).then(setGitStatus);
    });
  }, [contextId]);

  // Periodic file tree refresh (every 30s when workspace is open)
  useEffect(() => {
    const interval = setInterval(() => { loadFileTree(); }, 30000);
    return () => clearInterval(interval);
  }, [loadFileTree]);

  // Save file — tries File System Access API first, falls back to project_knowledge DB
  const handleSaveFile = async () => {
    if (!selectedFile || fileContent === null) return;

    // Try local file system first
    if (contextId) {
      const handle = getDirectoryHandle(contextId);
      if (handle) {
        try {
          const { writeFileContent } = await import("@/lib/filesystem");
          await writeFileContent(handle, selectedFile, fileContent);
          setFileEdited(false);
          toast.success(`Saved ${selectedFile} to local folder`);
          return;
        } catch { /* fall through to DB save */ }
      }
    }

    // Fallback: save to project_knowledge table in DB
    try {
      const kb = kbFiles.find((f: any) => f.filename === selectedFile);
      if (kb) {
        // Update existing chunks
        await supabase.from("project_knowledge_chunks").delete().eq("knowledge_id", kb.knowledge_id);
        const CHUNK_SIZE = 8000;
        for (let i = 0; i < fileContent.length; i += CHUNK_SIZE - 200) {
          await supabase.from("project_knowledge_chunks").insert({
            knowledge_id: kb.knowledge_id, project_id: projectId,
            chunk_index: Math.floor(i / (CHUNK_SIZE - 200)),
            content: fileContent.slice(i, i + CHUNK_SIZE),
          });
        }
        toast.success(`Saved ${selectedFile} to project knowledge base`);
      } else {
        // Create new file in KB
        const { data: newKb } = await supabase.from("project_knowledge").insert({
          project_id: projectId, filename: selectedFile, file_type: "text/plain",
          file_size: fileContent.length, uploaded_by: user?.id,
        }).select("knowledge_id").single();
        if (newKb) {
          await supabase.from("project_knowledge_chunks").insert({
            knowledge_id: newKb.knowledge_id, project_id: projectId,
            chunk_index: 0, content: fileContent,
          });
        }
        toast.success(`Saved ${selectedFile} to project knowledge base`);
      }
      setFileEdited(false);
      loadFileTree();
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    }
  };

  const handleFileSelect = async (path: string) => {
    setFileEdited(false);
    setSelectedFile(path);

    // Try local file first
    if (contextId) {
      const handle = getDirectoryHandle(contextId);
      if (handle) {
        try {
          const file = await readFileContent(handle, path);
          setFileContent(file.content);
          return;
        } catch { /* fall through */ }
      }
    }

    // Fall back to KB chunks
    const kb = kbFiles.find((f: any) => f.filename === path);
    if (kb) {
      const { data: chunks } = await supabase
        .from("project_knowledge_chunks")
        .select("content, chunk_index")
        .eq("knowledge_id", kb.knowledge_id)
        .order("chunk_index", { ascending: true });
      setFileContent(chunks?.map((c: any) => c.content).join("\n\n") ?? "");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-muted transition-all duration-200">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FolderKanban className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">{projectName}</h2>
          <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">Project workspace — Layaa OS</p>
          {gitStatus?.isGitRepo && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
              {gitStatus.branch || "detached"}
              {gitStatus.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-warning" />}
            </span>
          )}
          </div>
        </div>
        <button onClick={loadFileTree} className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-all duration-200" title="Refresh file tree">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: File Tree */}
        <div className="hidden sm:block w-56 border-r border-border bg-sidebar overflow-y-auto shrink-0">
          <div className="px-3 py-3 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="h-3 w-3" /> Files
            </h3>
          </div>
          <div className="py-1">
            {loadingTree ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : fileTree.length > 0 ? (
              fileTree.map(node => <FileTreeItem key={node.path} node={node} onSelect={handleFileSelect} />)
            ) : (
              <p className="text-xs text-muted-foreground italic px-3 py-6 text-center">No files yet. Upload via project settings or open a local folder.</p>
            )}
          </div>
        </div>

        {/* Center: Chat or File Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedFile && fileContent !== null ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border bg-card/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground truncate">{selectedFile}</span>
                  {fileEdited && <span className="text-xs text-warning">unsaved</span>}
                </div>
                <div className="flex items-center gap-2">
                  {fileEdited && (
                    <button onClick={handleSaveFile} className="text-xs text-primary hover:text-primary/80 px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200">
                      Save
                    </button>
                  )}
                  <button onClick={() => { setSelectedFile(null); setFileContent(null); setFileEdited(false); }} className="text-xs text-muted-foreground hover:text-foreground transition-all duration-200">
                    Close &rarr; Chat
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                {/* Line numbers + editor */}
                <div className="h-full flex overflow-auto">
                  <div className="py-4 px-2 text-xs font-mono text-muted-foreground/50 select-none text-right leading-relaxed shrink-0 bg-muted/20">
                    {fileContent.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <textarea
                    value={fileContent}
                    onChange={(e) => { setFileContent(e.target.value); setFileEdited(true); }}
                    className="flex-1 p-4 text-xs font-mono text-foreground bg-background leading-relaxed resize-none outline-none"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <ChatView selectedAgentId={selectedAgentId} onDelegation={onDelegation} />
          )}
        </div>

        {/* Right: Project Memory */}
        {contextId && (
          <div className="w-64 border-l border-border bg-background overflow-hidden shrink-0 hidden xl:block">
            <ProjectMemoryPanel contextId={contextId} />
          </div>
        )}
      </div>
    </div>
  );
}
