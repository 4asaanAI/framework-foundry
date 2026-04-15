import { useState, useMemo, useRef } from "react";
import { Search, Plug, CheckCircle2, Plus, Upload, X, Zap, Puzzle, Star, StarOff, Pencil, Trash2, Globe, Key, Server, Layers, BookOpen, Settings2, ChevronDown, ChevronRight, ToggleLeft, ToggleRight, ExternalLink, Shield, Workflow } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useConnectors } from "@/hooks/use-connectors";
import { useSkills } from "@/hooks/use-skills";
import { usePlugins } from "@/hooks/use-plugins";
import { useAuth } from "@/contexts/AuthContext";
import { NewConnectorDialog } from "@/components/dialogs/NewConnectorDialog";
import { INTEGRATION_APPS, INTEGRATION_CATEGORIES } from "@/constants/integrations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Connector type badges ──────────────────────────────────────────────────
const CONNECTOR_TYPE_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  oauth2: { label: "OAuth 2.0", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Shield },
  api_key: { label: "API Key", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Key },
  mcp: { label: "MCP Server", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Server },
  webhook: { label: "Webhook", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: Globe },
};

// ─── Plugin type labels ─────────────────────────────────────────────────────
const PLUGIN_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  tool: { label: "Tool Plugin", icon: "🔧" },
  wrapper: { label: "Connector Wrapper", icon: "🔌" },
  workflow: { label: "Workflow Plugin", icon: "⚡" },
  ai_capability: { label: "AI Capability", icon: "🧠" },
};

// ─── Built-in Plugin Library ────────────────────────────────────────────────
const LIBRARY_PLUGINS = [
  { name: "Web Search", desc: "Real-time web search, news, and URL content extraction for agent research", icon: "🔍", type: "tool", tools: ["web_search", "search_news", "fetch_url"], status: "live" as const },
  { name: "Code Interpreter", desc: "Sandboxed Python/JS execution for data analysis, scripting, and testing", icon: "🐍", type: "tool", tools: ["execute_code", "analyze_data", "run_tests"], status: "live" as const },
  { name: "Document Parser", desc: "Extract structured data from PDFs, DOCX, spreadsheets, and images", icon: "📋", type: "ai_capability", tools: ["extract_from_pdf", "extract_tables", "ocr_image"], status: "live" as const },
  { name: "PDF Generator", desc: "Create professional PDFs from templates, merge, and watermark documents", icon: "📄", type: "tool", tools: ["pdf_create", "pdf_merge", "pdf_watermark"], status: "live" as const },
  { name: "Email Engine", desc: "Templated emails, drip sequences, scheduling, and tracking", icon: "✉️", type: "wrapper", tools: ["send_templated_email", "schedule_email", "track_opens"], status: "live" as const },
  { name: "Data Analyzer", desc: "Statistical analysis, charting, trend detection, and insight generation", icon: "📊", type: "tool", tools: ["analyze_data", "create_chart", "generate_insights", "detect_anomalies"], status: "live" as const },
  { name: "Memory Manager", desc: "Semantic memory search, compression, and cross-agent knowledge sharing", icon: "🧠", type: "ai_capability", tools: ["search_memories", "compress_memory", "share_memory"], status: "live" as const },
  { name: "Task Orchestrator", desc: "Create, delegate, and track tasks across agents with approval workflows", icon: "⚡", type: "workflow", tools: ["create_task", "delegate_task", "request_approval"], status: "live" as const },
  { name: "CRM Bridge", desc: "Sync leads, contacts, and deals with external CRM systems", icon: "🤝", type: "wrapper", tools: ["sync_contact", "update_deal", "log_activity"], status: "planned" as const },
  { name: "Notification Hub", desc: "Push notifications, in-app alerts, and escalation routing", icon: "🔔", type: "workflow", tools: ["send_notification", "escalate", "schedule_reminder"], status: "live" as const },
  { name: "File Manager", desc: "Upload, organize, and version project files and knowledge bases", icon: "📁", type: "tool", tools: ["upload_file", "organize_kb", "version_doc"], status: "live" as const },
  { name: "Audio Processor", desc: "Meeting transcription, audio summarization, and voice note extraction", icon: "🎙️", type: "ai_capability", tools: ["transcribe_audio", "extract_summary", "detect_action_items"], status: "planned" as const },
];

// ─── Skill category icons ───────────────────────────────────────────────────
const SKILL_CATEGORY_ICONS: Record<string, string> = {
  sales: "💰", marketing: "📣", legal: "⚖️", finance: "📈",
  operations: "⚙️", product: "🎯", brand: "🎨", core: "💎",
  engineering: "🔧", custom: "✨", imported: "📦", "revenue-ops": "📊",
  research: "🔬", delivery: "🚀", support: "🛟",
};

function getFaviconUrl(appName: string): string {
  const domainMap: Record<string, string> = {
    "Gmail": "gmail.com", "Google Calendar": "calendar.google.com", "Google Drive": "drive.google.com",
    "Slack": "slack.com", "Stripe": "stripe.com", "HubSpot": "hubspot.com", "Notion": "notion.so",
    "Figma": "figma.com", "Linear": "linear.app", "GitHub": "github.com", "Jira": "atlassian.com",
    "Zoom": "zoom.us", "Canva": "canva.com", "n8n": "n8n.io", "Miro": "miro.com",
    "Zapier": "zapier.com", "Make": "make.com", "Asana": "asana.com", "Airtable": "airtable.com",
    "Salesforce": "salesforce.com", "Zoho CRM": "zoho.com", "Discord": "discord.com",
    "WhatsApp": "whatsapp.com", "Telegram": "telegram.org", "Twilio": "twilio.com",
  };
  const domain = domainMap[appName];
  if (domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const guess = appName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com";
  return `https://www.google.com/s2/favicons?domain=${guess}&sz=64`;
}

export function CustomizeView() {
  const [tab, setTab] = useState("connectors");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [connectorSubTab, setConnectorSubTab] = useState<"catalog" | "active">("catalog");
  const [connectingApp, setConnectingApp] = useState<string | null>(null);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showCreateSkill, setShowCreateSkill] = useState(false);
  const [showCreatePlugin, setShowCreatePlugin] = useState(false);
  const [expandedSkillCat, setExpandedSkillCat] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: connectors } = useConnectors();
  const { data: skills } = useSkills();
  const { data: plugins } = usePlugins();
  const { user } = useAuth();
  const qc = useQueryClient();

  // Skill form
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillKeywords, setSkillKeywords] = useState("");
  const [skillSubSkills, setSkillSubSkills] = useState("");

  // Plugin form
  const [pluginName, setPluginName] = useState("");
  const [pluginDisplayName, setPluginDisplayName] = useState("");
  const [pluginContext, setPluginContext] = useState("");
  const [pluginType, setPluginType] = useState("tool");

  // ── Connector filters ──
  const connectedNames = useMemo(
    () => new Set((connectors ?? []).filter((c: any) => c.is_active !== false).map((c: any) => c.name.toLowerCase())),
    [connectors]
  );
  const disconnectedNames = useMemo(
    () => new Set((connectors ?? []).filter((c: any) => c.is_active === false).map((c: any) => c.name.toLowerCase())),
    [connectors]
  );
  const activeConnectors = useMemo(
    () => (connectors ?? []).filter((c: any) => c.is_active !== false),
    [connectors]
  );

  const filteredApps = useMemo(() => {
    let apps = INTEGRATION_APPS;
    if (category !== "All") apps = apps.filter((a) => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      apps = apps.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return apps;
  }, [search, category]);

  const filteredSkills = useMemo(() => {
    if (!search.trim()) return skills ?? [];
    const q = search.toLowerCase();
    return (skills ?? []).filter((s: any) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
  }, [skills, search]);

  const filteredPlugins = useMemo(() => {
    if (!search.trim()) return plugins ?? [];
    const q = search.toLowerCase();
    return (plugins ?? []).filter((p: any) => p.name.toLowerCase().includes(q) || p.display_name.toLowerCase().includes(q));
  }, [plugins, search]);

  const filteredLibPlugins = useMemo(() => {
    if (!search.trim()) return LIBRARY_PLUGINS;
    const q = search.toLowerCase();
    return LIBRARY_PLUGINS.filter(p => p.name.toLowerCase().includes(q));
  }, [search]);

  const skillCategories = useMemo(() => [...new Set(filteredSkills.map((s: any) => s.category))].sort(), [filteredSkills]);

  // ── Handlers ──
  const handleConnect = async (appName: string) => {
    setConnectingApp(appName);
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      const { error } = await supabase.from("connectors").insert([{
        name: appName, type: "mcp",
        description: INTEGRATION_APPS.find((a) => a.name === appName)?.description ?? "",
        config: {}, is_active: true, created_by: u?.id,
      }]);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connectors"] });
      toast.success(`${appName} connected`);
    } catch (err: any) { toast.error(err.message || "Failed to connect"); }
    finally { setConnectingApp(null); }
  };

  const handleDisconnect = async (appName: string) => {
    const connector = (connectors ?? []).find((c: any) => c.name.toLowerCase() === appName.toLowerCase());
    if (!connector || !window.confirm(`Disconnect ${appName}? You can reconnect later.`)) return;
    try {
      const { error } = await supabase.from("connectors").update({ is_active: false }).eq("id", connector.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connectors"] });
      toast.success(`${appName} disconnected`);
    } catch (err: any) { toast.error(err.message || "Failed"); }
  };

  const handleReconnect = async (appName: string) => {
    const connector = (connectors ?? []).find((c: any) => c.name.toLowerCase() === appName.toLowerCase());
    if (!connector) return;
    try {
      const { error } = await supabase.from("connectors").update({ is_active: true }).eq("id", connector.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connectors"] });
      toast.success(`${appName} reconnected`);
    } catch (err: any) { toast.error(err.message || "Failed"); }
  };

  const handleCreateSkill = async () => {
    if (!skillName || !user) return;
    const { error } = await supabase.from("skills").insert({
      name: skillName, description: skillDesc, category: skillCategory || "custom",
      trigger_keywords: skillKeywords.split(",").map(k => k.trim()).filter(Boolean),
      sub_skills: skillSubSkills ? skillSubSkills.split("\n").map(s => s.trim()).filter(Boolean) : [],
      created_by: user.id, is_active: true, is_system: false,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Skill "${skillName}" created`);
      qc.invalidateQueries({ queryKey: ["skills"] });
      setShowCreateSkill(false);
      setSkillName(""); setSkillCategory(""); setSkillDesc(""); setSkillKeywords(""); setSkillSubSkills("");
    }
  };

  const handleCreatePlugin = async () => {
    if (!pluginName || !user) return;
    const { error } = await supabase.from("plugins").insert({
      name: pluginName.toLowerCase().replace(/\s+/g, "_"),
      display_name: pluginDisplayName || pluginName,
      context: pluginContext, created_by: user.id, is_active: true,
      skills: [{ type: pluginType }],
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Plugin "${pluginDisplayName || pluginName}" created`);
      qc.invalidateQueries({ queryKey: ["plugins"] });
      setShowCreatePlugin(false);
      setPluginName(""); setPluginDisplayName(""); setPluginContext(""); setPluginType("tool");
    }
  };

  const addLibraryPlugin = async (item: typeof LIBRARY_PLUGINS[0]) => {
    if (!user) return;
    const existing = (plugins ?? []).find((p: any) => p.name === item.name.toLowerCase().replace(/\s+/g, "_"));
    if (existing) { toast.info(`${item.name} is already installed`); return; }
    const { error } = await supabase.from("plugins").insert({
      name: item.name.toLowerCase().replace(/\s+/g, "_"), display_name: item.name,
      context: item.desc, created_by: user.id, is_active: true,
      skills: item.tools.map(t => ({ name: t, type: item.type })),
    });
    if (error) toast.error(error.message);
    else { toast.success(`${item.name} installed`); qc.invalidateQueries({ queryKey: ["plugins"] }); }
  };

  const togglePlugin = async (pluginId: string, currentlyActive: boolean) => {
    const { error } = await supabase.from("plugins").update({ is_active: !currentlyActive }).eq("id", pluginId);
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: ["plugins"] }); toast.success(currentlyActive ? "Plugin disabled" : "Plugin enabled"); }
  };

  const deleteSkill = async (skillId: string, skillName: string) => {
    if (!window.confirm(`Delete skill "${skillName}"?`)) return;
    await supabase.from("agent_skills").delete().eq("skill_id", skillId);
    const { error } = await supabase.from("skills").delete().eq("id", skillId);
    if (error) toast.error(error.message);
    else { toast.success(`Deleted "${skillName}"`); qc.invalidateQueries({ queryKey: ["skills"] }); }
  };

  const removeDuplicateSkills = async () => {
    const allSkills = skills ?? [];
    const seen = new Map<string, string>();
    const dupeIds: string[] = [];
    const sorted = [...allSkills].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    for (const s of sorted) {
      const key = s.name.trim().toLowerCase();
      if (seen.has(key)) dupeIds.push(s.id);
      else seen.set(key, s.id);
    }
    if (dupeIds.length === 0) { toast.info("No duplicates found"); return; }
    let removed = 0;
    for (const id of dupeIds) {
      await supabase.from("agent_skills").delete().eq("skill_id", id);
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (!error) removed++;
    }
    if (removed === 0) {
      toast.error("Could not remove duplicates — checking permissions. Trying deactivation instead...");
      for (const id of dupeIds) {
        await supabase.from("skills").update({ is_active: false }).eq("id", id);
      }
      toast.success(`Deactivated ${dupeIds.length} duplicate skills`);
    } else {
      toast.success(`Removed ${removed} duplicate skills`);
    }
    await qc.invalidateQueries({ queryKey: ["skills"] });
    await qc.refetchQueries({ queryKey: ["skills"] });
  };

  const handleUploadSkill = async (files: FileList | null) => {
    if (!files || !user) return;
    for (const file of Array.from(files)) {
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        await supabase.from("skills").insert({
          name: parsed.name || file.name.replace(/\.\w+$/, ""),
          description: parsed.description || "", category: parsed.category || "imported",
          trigger_keywords: parsed.trigger_keywords || [], sub_skills: parsed.sub_skills || [],
          created_by: user.id, is_active: true, is_system: false,
        });
        toast.success(`Imported "${parsed.name || file.name}"`);
      } catch {
        await supabase.from("skills").insert({
          name: file.name.replace(/\.\w+$/, ""), description: text.slice(0, 500),
          category: "imported", trigger_keywords: [],
          created_by: user.id, is_active: true, is_system: false,
        });
        toast.success(`Imported "${file.name}"`);
      }
    }
    qc.invalidateQueries({ queryKey: ["skills"] });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Customize</h1>
          <p className="text-sm text-muted-foreground">
            Three-tier integration system: <span className="text-primary">Connectors</span> (external bridges) → <span className="text-primary">Plugins</span> (functional modules) → <span className="text-primary">Skills</span> (behavior templates)
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mb-4">
            <TabsTrigger value="connectors" className="gap-1.5">
              <Plug className="h-3.5 w-3.5" /> Connectors
              <Badge variant="secondary" className="ml-1 text-xs">{activeConnectors.length}/{INTEGRATION_APPS.length}</Badge>
            </TabsTrigger>
             <TabsTrigger value="plugins" className="gap-1.5">
               <Puzzle className="h-3.5 w-3.5" /> Plugins
               <Badge variant="secondary" className="ml-1 text-xs">{plugins?.length ?? 0}</Badge>
             </TabsTrigger>
            <TabsTrigger value="skills" className="gap-1.5">
              <Zap className="h-3.5 w-3.5" /> Skills
              <Badge variant="secondary" className="ml-1 text-xs">{skills?.length ?? 0}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${tab}...`} className="pl-9 h-9" />
          </div>

          {/* ═══════════════════ CONNECTORS TAB ═══════════════════ */}
          <TabsContent value="connectors" className="flex-1 overflow-hidden flex flex-col min-h-0 mt-0">
            {/* Sub-tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setConnectorSubTab("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${connectorSubTab === "catalog" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                <Globe className="h-3 w-3 inline mr-1" /> Catalog ({filteredApps.length})
              </button>
              <button onClick={() => setConnectorSubTab("active")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${connectorSubTab === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                <CheckCircle2 className="h-3 w-3 inline mr-1" /> Active ({activeConnectors.length})
              </button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => setShowCustomDialog(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Custom Connector
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {connectorSubTab === "catalog" ? (
                <>
                  {/* Category pills */}
                  <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                    {INTEGRATION_CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredApps.map((app) => {
                      const isConnected = connectedNames.has(app.name.toLowerCase());
                      const isDisconnected = disconnectedNames.has(app.name.toLowerCase());
                      const isConnecting = connectingApp === app.name;
                      return (
                        <div key={app.name} className={`border rounded-xl p-4 transition-all group ${isConnected ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20"}`}>
                          <div className="flex items-start gap-3 mb-2">
                            <img src={getFaviconUrl(app.name)} alt={app.name} className="w-8 h-8 rounded-lg" onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                            }} />
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold hidden">
                              {app.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium truncate flex items-center gap-1.5">
                                {app.name}
                                {isConnected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{app.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">{app.category}</Badge>
                            {isConnected ? (
                              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 text-xs h-7" onClick={() => handleDisconnect(app.name)}>Disconnect</Button>
                            ) : isDisconnected ? (
                              <Button variant="outline" size="sm" className="text-primary text-xs h-7" onClick={() => handleReconnect(app.name)}>Reconnect</Button>
                            ) : (
                              <Button size="sm" className="text-xs h-7" onClick={() => handleConnect(app.name)}>{isConnecting ? "..." : "Connect"}</Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Active connectors view */
                <div className="space-y-3">
                  {activeConnectors.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Plug className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No active connectors. Browse the catalog to connect services.</p>
                    </div>
                  ) : activeConnectors.map((conn: any) => {
                    const typeInfo = CONNECTOR_TYPE_LABELS[conn.type] || CONNECTOR_TYPE_LABELS.mcp;
                    const TypeIcon = typeInfo.icon;
                    return (
                      <div key={conn.id} className="border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium">{conn.name}</h3>
                            <Badge variant="outline" className={`text-[10px] ${typeInfo.color}`}>{typeInfo.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conn.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                          <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => handleDisconnect(conn.name)}>
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ═══════════════════ PLUGINS TAB ═══════════════════ */}
          <TabsContent value="plugins" className="flex-1 overflow-hidden flex flex-col min-h-0 mt-0">
            <div className="flex items-center gap-2 mb-4">
              <Button size="sm" onClick={() => setShowCreatePlugin(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Create Plugin
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {/* Create plugin form */}
              {showCreatePlugin && (
                <div className="border border-primary/30 rounded-xl p-4 mb-4 bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Puzzle className="h-4 w-4 text-primary" /> Create Plugin</h4>
                    <button onClick={() => setShowCreatePlugin(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Plugin ID</Label>
                      <Input placeholder="my-plugin" value={pluginName} onChange={(e) => setPluginName(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Display Name</Label>
                      <Input placeholder="My Plugin" value={pluginDisplayName} onChange={(e) => setPluginDisplayName(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Type</Label>
                      <Select value={pluginType} onValueChange={setPluginType}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(PLUGIN_TYPE_LABELS).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label className="text-xs">Description & Context</Label>
                      <Textarea placeholder="What does this plugin do? What tools does it add?" value={pluginContext} onChange={(e) => setPluginContext(e.target.value)} rows={2} className="text-xs" />
                    </div>
                    <div className="col-span-2">
                      <Button size="sm" onClick={handleCreatePlugin} disabled={!pluginName}>Create</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Plugin Library */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> Plugin Library
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {filteredLibPlugins.map((item) => {
                  const installed = (plugins ?? []).some((p: any) => p.name === item.name.toLowerCase().replace(/\s+/g, "_"));
                  const typeLabel = PLUGIN_TYPE_LABELS[item.type] || PLUGIN_TYPE_LABELS.tool;
                  return (
                    <div key={item.name} className={`border rounded-xl p-4 transition-colors ${installed ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20"}`}>
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-medium">{item.name}</h3>
                            {installed && <CheckCircle2 className="h-3 w-3 text-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px]">{typeLabel.icon} {typeLabel.label}</Badge>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">{item.tools.length} tools</Badge>
                        </div>
                        {installed ? (
                          <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">Installed</Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => addLibraryPlugin(item)}>Install</Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Installed Plugins */}
              {filteredPlugins.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> Installed Plugins ({filteredPlugins.length})
                  </h3>
                  <div className="space-y-2 mb-6">
                    {filteredPlugins.map((plugin: any) => (
                      <div key={plugin.id} className="border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                          <Puzzle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium">{plugin.display_name || plugin.name}</h3>
                            {Array.isArray(plugin.skills) && plugin.skills.length > 0 && (
                              <Badge variant="outline" className="text-[10px]">{plugin.skills.length} tools</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{plugin.context}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => togglePlugin(plugin.id, plugin.is_active)}
                            className="p-1 rounded hover:bg-muted transition-colors" title={plugin.is_active ? "Disable" : "Enable"}>
                            {plugin.is_active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                          </button>
                          <button onClick={async () => {
                            if (!window.confirm(`Delete plugin "${plugin.display_name || plugin.name}"?`)) return;
                            await supabase.from("plugins").delete().eq("id", plugin.id);
                            qc.invalidateQueries({ queryKey: ["plugins"] });
                            toast.success("Plugin removed");
                          }} className="p-1 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ═══════════════════ SKILLS TAB ═══════════════════ */}
          <TabsContent value="skills" className="flex-1 overflow-hidden flex flex-col min-h-0 mt-0">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Button size="sm" onClick={() => setShowCreateSkill(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Create</Button>
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-3.5 w-3.5 mr-1" /> Import</Button>
              <input ref={fileRef} type="file" accept=".json,.txt,.md" multiple className="hidden" onChange={(e) => handleUploadSkill(e.target.files)} />
              <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={removeDuplicateSkills}>
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Deduplicate
              </Button>
              <div className="flex-1" />
              <p className="text-xs text-muted-foreground">{filteredSkills.length} skills across {skillCategories.length} categories • Invoke with <code className="bg-muted px-1 py-0.5 rounded">/skill-name</code></p>
            </div>

            <ScrollArea className="flex-1">
              {/* Create skill form */}
              {showCreateSkill && (
                <div className="border border-primary/30 rounded-xl p-4 mb-4 bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Create Skill</h4>
                    <button onClick={() => setShowCreateSkill(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Skill Name (command)</Label>
                      <Input placeholder="proposal-generator" value={skillName} onChange={(e) => setSkillName(e.target.value)} className="h-8 text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category</Label>
                      <Input placeholder="sales, marketing, legal..." value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label className="text-xs">Instructions (markdown)</Label>
                      <Textarea placeholder="Step-by-step instructions the agent should follow when this skill is invoked..." value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} rows={4} className="text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Trigger Keywords (comma-separated)</Label>
                      <Input placeholder="proposal, pitch, quote" value={skillKeywords} onChange={(e) => setSkillKeywords(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Sub-skills (one per line, optional)</Label>
                      <Textarea placeholder="research-client\ndraft-scope\ncalculate-pricing" value={skillSubSkills} onChange={(e) => setSkillSubSkills(e.target.value)} rows={2} className="text-xs font-mono" />
                    </div>
                    <div className="col-span-2">
                      <Button size="sm" onClick={handleCreateSkill} disabled={!skillName}>Create Skill</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills by category — accordion style */}
              {skillCategories.map((cat: string) => {
                const catSkills = filteredSkills.filter((s: any) => s.category === cat);
                const isExpanded = expandedSkillCat === cat || search.trim().length > 0;
                const catIcon = SKILL_CATEGORY_ICONS[cat] || "📌";
                return (
                  <div key={cat} className="mb-3">
                    <button onClick={() => setExpandedSkillCat(expandedSkillCat === cat ? null : cat)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                      <span className="text-sm">{catIcon}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider">{cat}</span>
                      <Badge variant="secondary" className="text-[10px] ml-auto">{catSkills.length}</Badge>
                    </button>
                    {isExpanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-2">
                        {catSkills.map((skill: any) => {
                          const favs: string[] = JSON.parse(localStorage.getItem("layaa_fav_skills") || "[]");
                          const isFav = favs.includes(skill.name);
                          return (
                            <div key={skill.id} className="border border-border rounded-lg p-3 hover:border-primary/20 transition-all group">
                              <div className="flex items-start gap-2">
                                <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <code className="text-xs font-mono text-primary">/{skill.name}</code>
                                    {skill.is_system && <Badge variant="outline" className="text-[9px]">system</Badge>}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{skill.description}</p>
                                  {skill.trigger_keywords?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {skill.trigger_keywords.slice(0, 4).map((kw: string) => (
                                        <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{kw}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => {
                                    const updated = isFav ? favs.filter((n: string) => n !== skill.name) : [...favs, skill.name];
                                    localStorage.setItem("layaa_fav_skills", JSON.stringify(updated));
                                    toast.success(isFav ? "Unfavorited" : "Favorited");
                                  }} className="p-0.5 rounded" title={isFav ? "Unfavorite" : "Favorite"}>
                                    {isFav ? <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> : <StarOff className="h-3 w-3 text-muted-foreground" />}
                                  </button>
                                  {!skill.is_system && (
                                    <button onClick={() => deleteSkill(skill.id, skill.name)} className="p-0.5 rounded hover:bg-destructive/10">
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredSkills.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No skills found. Create one or import a skill file.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <NewConnectorDialog open={showCustomDialog} onOpenChange={setShowCustomDialog} />
    </div>
  );
}
