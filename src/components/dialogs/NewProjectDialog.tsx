import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PROJECT_TEMPLATES } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("projects").insert({
        name: name.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        created_by: user?.id,
      });
      if (error) throw error;
      toast.success(`Project "${name}" created`);
      qc.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
      setName("");
      setDescription("");
      setInstructions("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Template selector */}
          <div>
            <Label className="mb-2 block">Start from template (optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { setName(t.name); setDescription(t.description); setInstructions(t.instructions); }}
                  className={cn("p-2 rounded-xl border text-left transition-all duration-200 hover:border-primary/30", name === t.name ? "border-primary bg-primary/5" : "border-border")}>
                  <p className="text-xs font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{t.description}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. EduFlow" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this project about?" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Instructions for agents</Label>
            <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Guidelines agents should follow..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
