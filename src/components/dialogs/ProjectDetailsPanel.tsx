import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Check, X, MessageSquare, Users, BookOpen, FileText } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS, TEAM_LABELS } from "@/constants/agents";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NewConversationDialog } from "./NewConversationDialog";

interface ProjectDetailsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onStartChat?: (agentId: string, projectId: string) => void;
}

export function ProjectDetailsPanel({ open, onOpenChange, project, onStartChat }: ProjectDetailsPanelProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [nameValue, setNameValue] = useState(project?.name ?? "");
  const [descValue, setDescValue] = useState(project?.description ?? "");
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const queryClient = useQueryClient();

  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;

  // Find agents assigned to this project
  const projectAgentIds: string[] = project?.agents ?? [];
  const projectAgents = agents.filter((a) => projectAgentIds.includes(a.id));

  const saveName = async () => {
    if (!nameValue.trim() || nameValue === project?.name) {
      setEditingName(false);
      return;
    }
    const { error } = await supabase
      .from("projects")
      .update({ name: nameValue.trim() })
      .eq("id", project.id);
    if (error) {
      toast.error("Failed to update name");
    } else {
      toast.success("Project name updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
    setEditingName(false);
  };

  const saveDesc = async () => {
    if (descValue === project?.description) {
      setEditingDesc(false);
      return;
    }
    const { error } = await supabase
      .from("projects")
      .update({ description: descValue.trim() })
      .eq("id", project.id);
    if (error) {
      toast.error("Failed to update description");
    } else {
      toast.success("Description updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
    setEditingDesc(false);
  };

  if (!project) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="sr-only">Project Details</DialogTitle>
            {/* Inline editable name */}
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                    if (e.key === "Escape") { setEditingName(false); setNameValue(project.name); }
                  }}
                  className="text-lg font-semibold"
                  autoFocus
                />
                <button onClick={saveName} className="p-1 rounded hover:bg-muted">
                  <Check className="h-4 w-4 text-primary" />
                </button>
                <button onClick={() => { setEditingName(false); setNameValue(project.name); }} className="p-1 rounded hover:bg-muted">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setEditingName(true); setNameValue(project.name); }}
                className="flex items-center gap-2 text-left group"
              >
                <span className="text-lg font-semibold">{project.name}</span>
                <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            {/* Inline editable description */}
            {editingDesc ? (
              <div className="mt-2">
                <Textarea
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveDesc(); }
                    if (e.key === "Escape") { setEditingDesc(false); setDescValue(project.description); }
                  }}
                  className="text-sm"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-1 mt-1">
                  <button onClick={saveDesc} className="p-1 rounded hover:bg-muted">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </button>
                  <button onClick={() => { setEditingDesc(false); setDescValue(project.description); }} className="p-1 rounded hover:bg-muted">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setEditingDesc(true); setDescValue(project.description ?? ""); }}
                className="text-sm text-muted-foreground text-left mt-1 group flex items-start gap-1"
              >
                <span>{project.description || "Click to add a description..."}</span>
                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
              </button>
            )}
          </DialogHeader>

          <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col mt-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="kbs">KBs</TabsTrigger>
              <TabsTrigger value="docs">Docs</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="overflow-y-auto flex-1 space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={project.is_active ? "default" : "secondary"}>
                    {project.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Agents</span>
                  <span>{projectAgents.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : "—"}</span>
                </div>
              </div>
              <Button onClick={() => setShowAgentPicker(true)} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Chat in {project.name}
              </Button>
            </TabsContent>

            <TabsContent value="agents" className="overflow-y-auto flex-1 mt-4">
              {projectAgents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No agents assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {projectAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: agent.avatar_color }}
                      >
                        {agent.avatar_initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{agent.name}</div>
                        <div className="text-xs text-muted-foreground">{agent.canonical_role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="kbs" className="overflow-y-auto flex-1 mt-4">
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Knowledge bases coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="overflow-y-auto flex-1 mt-4">
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Documents coming soon</p>
              </div>
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
