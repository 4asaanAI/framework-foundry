import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: string;
}

export function NewConnectorDialog({ open, onOpenChange, defaultType = "mcp" }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState(defaultType);
  const [description, setDescription] = useState("");
  const [configJson, setConfigJson] = useState("{}");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    let config: Record<string, unknown>;
    try {
      config = JSON.parse(configJson);
    } catch {
      toast.error("Config must be valid JSON");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("connectors").insert([{
        name: name.trim(),
        type,
        description: description.trim(),
        config,
        is_active: isActive,
        created_by: user?.id,
      }]);
      if (error) throw error;
      toast.success(`${type === "llm_provider" ? "LLM Provider" : type === "webhook" ? "Webhook" : "Connector"} "${name}" added`);
      qc.invalidateQueries({ queryKey: ["connectors"] });
      onOpenChange(false);
      setName("");
      setDescription("");
      setConfigJson("{}");
    } catch (err: any) {
      toast.error(err.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {type === "llm_provider" ? "Add LLM Provider" : type === "webhook" ? "Add Webhook" : type === "credential" ? "Add Credential" : "Add Connector / MCP Server"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={type === "llm_provider" ? "e.g. OpenAI" : type === "webhook" ? "e.g. Slack Notifications" : "e.g. My MCP Server"} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="llm_provider">LLM Provider</SelectItem>
                <SelectItem value="mcp">MCP Server</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="credential">Credential</SelectItem>
                <SelectItem value="plugin">Plugin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this connector do?" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Config (JSON)</Label>
            <Textarea value={configJson} onChange={(e) => setConfigJson(e.target.value)} className="font-mono text-xs" rows={4} placeholder='{"api_key_name": "OPENAI_API_KEY", "base_url": "https://api.openai.com/v1"}' />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
