import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAgents } from "@/hooks/use-agents";
import { toast } from "sonner";
import { Upload, X, FileText, Users, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
}

export function EditProjectDialog({ open, onOpenChange, project }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();
  const { data: allAgents } = useAgents();

  useEffect(() => {
    if (project) {
      setName(project.name ?? "");
      setDescription(project.description ?? "");
      setInstructions(project.instructions ?? "");
    }
  }, [project]);

  // Fetch KB files for this project
  const { data: kbFiles, refetch: refetchKb } = useQuery({
    queryKey: ["project_kbs", project?.id],
    queryFn: async () => {
      if (!project?.id) return [];
      const { data, error } = await supabase.from("project_kbs").select("*").eq("project_id", project.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!project?.id,
  });

  // Fetch assigned agents
  const { data: assignedAgents, refetch: refetchAssigned } = useQuery({
    queryKey: ["project_agents", project?.id],
    queryFn: async () => {
      if (!project?.id) return [];
      const { data, error } = await supabase.from("project_agents").select("*, agents(id, name, avatar_initials, avatar_color)").eq("project_id", project.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!project?.id,
  });

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("projects").update({
        name: name.trim(), description: description.trim(), instructions: instructions.trim(),
      }).eq("project_id", project.project_id ?? project.id);
      if (error) throw error;
      toast.success("Project updated");
      qc.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally { setLoading(false); }
  };

  const handleKbUpload = async (files: FileList | null) => {
    if (!files || !project?.id) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const text = await file.text();
      const { error } = await supabase.from("project_kbs").insert({
        project_id: project.id, filename: file.name, content: text, file_size: file.size,
      });
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }

      // Simple chunking: ~8000 char chunks with 200 char overlap
      const chunkSize = 8000;
      const overlap = 200;
      const chunks: string[] = [];
      for (let i = 0; i < text.length; i += chunkSize - overlap) {
        chunks.push(text.slice(i, i + chunkSize));
      }
      // Get the KB id
      const { data: kbData } = await supabase.from("project_kbs").select("id").eq("project_id", project.id).eq("filename", file.name).order("created_at", { ascending: false }).limit(1).single();
      if (kbData) {
        for (let idx = 0; idx < chunks.length; idx++) {
          const words = chunks[idx].toLowerCase().split(/\W+/).filter(w => w.length > 3);
          const freq: Record<string, number> = {};
          words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
          const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
          await supabase.from("project_kb_chunks").insert({
            project_kb_id: kbData.id, chunk_index: idx, content: chunks[idx], keywords,
          });
        }
      }
      toast.success(`Uploaded ${file.name}`);
    }
    setUploading(false);
    refetchKb();
  };

  const handleDeleteKb = async (kbId: string) => {
    await supabase.from("project_kb_chunks").delete().eq("project_kb_id", kbId);
    await supabase.from("project_kbs").delete().eq("id", kbId);
    toast.success("KB file removed");
    refetchKb();
  };

  const handleToggleAgent = async (agentId: string) => {
    const existing = assignedAgents?.find((a: any) => a.agent_id === agentId);
    if (existing) {
      await supabase.from("project_agents").delete().eq("id", existing.id);
      toast.success("Agent removed from project");
    } else {
      await supabase.from("project_agents").insert({ project_id: project.id, agent_id: agentId });
      toast.success("Agent added to project");
    }
    refetchAssigned();
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const assignedIds = new Set((assignedAgents ?? []).map((a: any) => a.agent_id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="kb" className="flex-1">Knowledge Base</TabsTrigger>
            <TabsTrigger value="agents" className="flex-1">Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Instructions for agents</Label>
              <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} />
            </div>
          </TabsContent>

          <TabsContent value="kb" className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label>Knowledge Base Files</Label>
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer hover:bg-primary/90 transition-all duration-200">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Upload File"}
                <input type="file" multiple className="hidden" accept=".pdf,.txt,.md,.json,.csv,.docx,.doc"
                  onChange={(e) => handleKbUpload(e.target.files)} disabled={uploading} />
              </label>
            </div>
            {kbFiles && kbFiles.length > 0 ? (
              <div className="space-y-2">
                {kbFiles.map((kb: any) => (
                  <div key={kb.id} className="flex items-center gap-3 rounded-lg bg-background border border-border px-3 py-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{kb.filename}</p>
                      <p className="text-xs text-muted-foreground">{(kb.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => handleDeleteKb(kb.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive/60 hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">No KB files uploaded yet</p>
            )}
          </TabsContent>

          <TabsContent value="agents" className="space-y-2 py-2">
            <Label>Assign Agents</Label>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {(allAgents ?? []).map((agent: any) => (
                <button key={agent.id} onClick={() => handleToggleAgent(agent.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    assignedIds.has(agent.id) ? "bg-primary/10 border border-primary/30" : "hover:bg-card border border-transparent"
                  }`}>
                  <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}>
                    {agent.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.canonical_role}</p>
                  </div>
                  {assignedIds.has(agent.id) && <span className="text-xs text-primary font-medium">Assigned</span>}
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
