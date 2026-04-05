import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, X, Upload, ChevronDown } from "lucide-react";
import { useSkills } from "@/hooks/use-skills";
import { useConnectors } from "@/hooks/use-connectors";
import { usePlugins } from "@/hooks/use-plugins";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Built-in library items
const LIBRARY_CONNECTORS = [
  { name: "Linear", desc: "Manage issues, projects & team workflows in Linear", icon: "📋" },
  { name: "GitHub", desc: "Access repos, PRs, issues across GitHub", icon: "🐙" },
  { name: "Slack", desc: "Send messages and interact with Slack workspaces", icon: "💬" },
  { name: "Google Drive", desc: "Access and manage files in Google Drive", icon: "📁" },
  { name: "Notion", desc: "Access your Notion pages and databases", icon: "📝" },
  { name: "Figma", desc: "Generate diagrams and code from Figma context", icon: "🎨" },
  { name: "Jira", desc: "Access Jira & Confluence from your platform", icon: "🔷" },
  { name: "Amplitude", desc: "Search, access, and get insights on your data", icon: "📊" },
  { name: "Hugging Face", desc: "Access the Hugging Face Hub and Gradio Apps", icon: "🤗" },
  { name: "Cloudflare", desc: "Build applications with compute, storage, and AI", icon: "☁️" },
  { name: "Twilio", desc: "Cloud communications for SMS, voice, messaging", icon: "📱" },
  { name: "Stripe", desc: "Payment processing and billing management", icon: "💳" },
];

const LIBRARY_PLUGINS = [
  { name: "Web Search", desc: "Search the web for real-time information", icon: "🔍" },
  { name: "Code Interpreter", desc: "Execute Python code for data analysis", icon: "🐍" },
  { name: "Image Generator", desc: "Generate images from text prompts", icon: "🖼️" },
  { name: "PDF Reader", desc: "Extract and analyze content from PDFs", icon: "📄" },
  { name: "Calendar", desc: "Manage calendar events and scheduling", icon: "📅" },
  { name: "Email Sender", desc: "Send emails through configured SMTP", icon: "✉️" },
];

interface DirectoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

export function DirectoryDialog({ open, onOpenChange, defaultTab = "skills" }: DirectoryDialogProps) {
  const [tab, setTab] = useState(defaultTab);
  const [search, setSearch] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [showUploadSkill, setShowUploadSkill] = useState(false);
  const [showCreateSkill, setShowCreateSkill] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const qc = useQueryClient();

  // Custom form state
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customOAuthId, setCustomOAuthId] = useState("");
  const [customOAuthSecret, setCustomOAuthSecret] = useState("");

  // Skill creation
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillKeywords, setSkillKeywords] = useState("");

  const { data: skills } = useSkills();
  const { data: connectors } = useConnectors();
  const { data: plugins } = usePlugins();

  const filteredSkills = skills?.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())) ?? [];
  const filteredConnectors = connectors?.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) ?? [];
  const filteredPlugins = plugins?.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.display_name.toLowerCase().includes(search.toLowerCase())) ?? [];
  const filteredLibConnectors = LIBRARY_CONNECTORS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()));
  const filteredLibPlugins = LIBRARY_PLUGINS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const addLibraryConnector = async (item: typeof LIBRARY_CONNECTORS[0]) => {
    if (!user) return;
    const { error } = await supabase.from("connectors").insert({
      name: item.name, description: item.desc, type: "mcp", created_by: user.id, is_active: true,
    });
    if (error) toast.error(error.message);
    else { toast.success(`${item.name} added`); qc.invalidateQueries({ queryKey: ["connectors"] }); }
  };

  const addLibraryPlugin = async (item: typeof LIBRARY_PLUGINS[0]) => {
    if (!user) return;
    const { error } = await supabase.from("plugins").insert({
      name: item.name.toLowerCase().replace(/\s+/g, "_"), display_name: item.name, context: item.desc, created_by: user.id, is_active: true,
    });
    if (error) toast.error(error.message);
    else { toast.success(`${item.name} added`); qc.invalidateQueries({ queryKey: ["plugins"] }); }
  };

  const handleAddCustomConnector = async () => {
    if (!customName || !user) return;
    const { error } = await supabase.from("connectors").insert({
      name: customName, description: customDesc, type: "mcp", created_by: user.id, is_active: true,
      config: { url: customUrl, oauth_client_id: customOAuthId || null, oauth_client_secret: customOAuthSecret || null },
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Custom connector "${customName}" added`);
      qc.invalidateQueries({ queryKey: ["connectors"] });
      setShowAddCustom(false);
      setCustomName(""); setCustomUrl(""); setCustomDesc(""); setCustomOAuthId(""); setCustomOAuthSecret("");
    }
  };

  const handleCreateSkill = async () => {
    if (!skillName || !user) return;
    const { error } = await supabase.from("skills").insert({
      name: skillName, description: skillDesc, category: skillCategory || "custom",
      trigger_keywords: skillKeywords.split(",").map(k => k.trim()).filter(Boolean),
      created_by: user.id, is_active: true, is_system: false,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Skill "${skillName}" created`);
      qc.invalidateQueries({ queryKey: ["skills"] });
      setShowCreateSkill(false);
      setSkillName(""); setSkillCategory(""); setSkillDesc(""); setSkillKeywords("");
    }
  };

  const handleUploadSkill = async (files: FileList | null) => {
    if (!files || !user) return;
    for (const file of Array.from(files)) {
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        const { error } = await supabase.from("skills").insert({
          name: parsed.name || file.name.replace(/\.\w+$/, ""),
          description: parsed.description || "",
          category: parsed.category || "imported",
          trigger_keywords: parsed.trigger_keywords || [],
          sub_skills: parsed.sub_skills || [],
          created_by: user.id, is_active: true, is_system: false,
        });
        if (error) toast.error(error.message);
        else toast.success(`Imported "${parsed.name || file.name}"`);
      } catch {
        // Treat as markdown skill
        const { error } = await supabase.from("skills").insert({
          name: file.name.replace(/\.\w+$/, ""),
          description: text.slice(0, 200),
          category: "imported",
          trigger_keywords: [],
          created_by: user.id, is_active: true, is_system: false,
        });
        if (error) toast.error(error.message);
        else toast.success(`Imported "${file.name}"`);
      }
    }
    qc.invalidateQueries({ queryKey: ["skills"] });
    setShowUploadSkill(false);
  };

  const skillCategories = [...new Set(filteredSkills.map(s => s.category))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Directory</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 pt-3 pb-0 flex items-center gap-4">
            <TabsList className="bg-transparent p-0 gap-1">
              <TabsTrigger value="skills" className="data-[state=active]:bg-card rounded-lg px-3 py-1.5 text-sm">📋 Skills</TabsTrigger>
              <TabsTrigger value="connectors" className="data-[state=active]:bg-card rounded-lg px-3 py-1.5 text-sm">🔌 Connectors</TabsTrigger>
              <TabsTrigger value="plugins" className="data-[state=active]:bg-card rounded-lg px-3 py-1.5 text-sm">🧩 Plugins</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${tab}...`}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Skills Tab */}
            <TabsContent value="skills" className="m-0 space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowCreateSkill(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Create skill
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowUploadSkill(true)}>
                  <Upload className="h-3.5 w-3.5 mr-1" /> Upload skill
                </Button>
              </div>

              {showCreateSkill && (
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Create New Skill</h4>
                    <button onClick={() => setShowCreateSkill(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                  <Input placeholder="Skill name" value={skillName} onChange={e => setSkillName(e.target.value)} />
                  <Input placeholder="Category (e.g. sales, marketing)" value={skillCategory} onChange={e => setSkillCategory(e.target.value)} />
                  <Textarea placeholder="Description" value={skillDesc} onChange={e => setSkillDesc(e.target.value)} rows={2} />
                  <Input placeholder="Trigger keywords (comma-separated)" value={skillKeywords} onChange={e => setSkillKeywords(e.target.value)} />
                  <Button size="sm" onClick={handleCreateSkill} disabled={!skillName}>Create</Button>
                </div>
              )}

              {showUploadSkill && (
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Upload Skill File</h4>
                    <button onClick={() => setShowUploadSkill(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                  <p className="text-xs text-muted-foreground">Upload .json or .md skill files from your computer or web</p>
                  <input ref={fileRef} type="file" accept=".json,.md,.txt" multiple className="hidden" onChange={e => handleUploadSkill(e.target.files)} />
                  <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5 mr-1" /> Choose files
                  </Button>
                </div>
              )}

              {skillCategories.map(cat => (
                <div key={cat}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{cat}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSkills.filter(s => s.category === cat).map(skill => (
                      <div key={skill.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{skill.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">{skill.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredSkills.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No skills found</p>}
            </TabsContent>

            {/* Connectors Tab */}
            <TabsContent value="connectors" className="m-0 space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowAddCustom(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add custom connector
                </Button>
              </div>

              {showAddCustom && (
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Add Custom Connector</h4>
                    <button onClick={() => setShowAddCustom(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                  <Input placeholder="Name" value={customName} onChange={e => setCustomName(e.target.value)} />
                  <Input placeholder="Remote MCP server URL" value={customUrl} onChange={e => setCustomUrl(e.target.value)} />
                  <Input placeholder="Description (optional)" value={customDesc} onChange={e => setCustomDesc(e.target.value)} />
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground flex items-center gap-1">
                      <ChevronDown className="h-3 w-3" /> Advanced settings
                    </summary>
                    <div className="mt-2 space-y-2">
                      <Input placeholder="OAuth Client ID (optional)" value={customOAuthId} onChange={e => setCustomOAuthId(e.target.value)} />
                      <Input placeholder="OAuth Client Secret (optional)" value={customOAuthSecret} onChange={e => setCustomOAuthSecret(e.target.value)} />
                    </div>
                  </details>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowAddCustom(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleAddCustomConnector} disabled={!customName}>Add</Button>
                  </div>
                </div>
              )}

              {/* Active connectors */}
              {filteredConnectors.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredConnectors.map(c => (
                      <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                        <div className={cn("w-2.5 h-2.5 rounded-full", c.is_active ? "bg-success" : "bg-muted-foreground")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Library */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Library</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredLibConnectors.map(c => (
                    <div key={c.name} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/30 transition-colors">
                      <span className="text-lg">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.desc}</p>
                      </div>
                      <button onClick={() => addLibraryConnector(c)} className="p-1 rounded hover:bg-card transition-colors">
                        <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Plugins Tab */}
            <TabsContent value="plugins" className="m-0 space-y-4">
              {/* Active plugins */}
              {filteredPlugins.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredPlugins.map(p => (
                      <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{p.display_name || p.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{p.context}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Library */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Library</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredLibPlugins.map(p => (
                    <div key={p.name} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/30 transition-colors">
                      <span className="text-lg">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.desc}</p>
                      </div>
                      <button onClick={() => addLibraryPlugin(p)} className="p-1 rounded hover:bg-card transition-colors">
                        <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
