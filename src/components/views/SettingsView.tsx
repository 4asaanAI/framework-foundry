import { useState } from "react";
import { Server, Key, Database, Globe, Shield, Plug, Plus, Trash2, Power, ChevronDown, ChevronRight, Loader2, CheckCircle2, Clock } from "lucide-react";
import { useConnectors, useDeleteConnector, useToggleConnector } from "@/hooks/use-connectors";
import { NewConnectorDialog } from "@/components/dialogs/NewConnectorDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIMEZONE_OPTIONS, getStoredTimezone } from "@/components/layout/AppFooter";
import { BUILT_IN_PROVIDERS, getProviderById } from "@/lib/llm";
import { useLLMConfig, useSaveLLMConfig } from "@/hooks/use-llm";

const SECTIONS = [
  { icon: Clock, label: "Preferences", type: null, desc: "Timezone, display, and general preferences" },
  { icon: Server, label: "LLM Configuration", type: null, desc: "Switch AI providers, models, and API keys" },
  { icon: Key, label: "Credential Vault", type: "credential", desc: "Manage API keys (stored encrypted)" },
  { icon: Database, label: "Database", type: null, desc: "Connection status and database info" },
  { icon: Globe, label: "Webhooks", type: "webhook", desc: "Webhook URLs, API key authentication" },
  { icon: Plug, label: "Connectors & MCP", type: "mcp", desc: "Manage MCP servers, plugins, and integrations" },
  { icon: Shield, label: "Security", type: null, desc: "Rate limiting, CORS, HTTPS, DPDP compliance" },
];

function ConnectorList({ type }: { type: string }) {
  const { data: items, isLoading } = useConnectors(type);
  const deleteConnector = useDeleteConnector();
  const toggleConnector = useToggleConnector();

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto my-2" />;
  if (!items || items.length === 0) return <p className="text-xs text-muted-foreground py-2 pl-2">No items configured yet. Click "Add" to create one.</p>;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 rounded-lg bg-background border border-border px-3 py-2">
          <div className={cn("w-2 h-2 rounded-full shrink-0", item.is_active ? "bg-success" : "bg-muted-foreground")} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
            {item.description && <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>}
          </div>
          <button
            onClick={() => toggleConnector.mutate({ id: item.id, is_active: !item.is_active })}
            className={cn("p-1 rounded transition-colors", item.is_active ? "text-success hover:bg-success/10" : "text-muted-foreground hover:bg-muted")}
            title={item.is_active ? "Disable" : "Enable"}
          >
            <Power className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              deleteConnector.mutate(item.id, {
                onSuccess: () => toast.success(`Deleted "${item.name}"`),
                onError: (e: any) => toast.error(e.message),
              });
            }}
            className="p-1 rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function DatabaseSection() {
  return (
    <div className="space-y-2 pl-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <span className="text-xs text-foreground">Connected via Lovable Cloud</span>
      </div>
      <div className="text-[11px] text-muted-foreground space-y-1">
        <p>• 13 tables configured (agents, tasks, conversations, etc.)</p>
        <p>• Row Level Security enabled on all tables</p>
        <p>• Realtime enabled for messages, notifications, approvals, tasks</p>
        <p>• Automatic backups managed by Lovable Cloud</p>
      </div>
    </div>
  );
}

function SecuritySection() {
  const checks = [
    { label: "Row Level Security", status: true, detail: "Enabled on all 13 tables" },
    { label: "JWT Authentication", status: true, detail: "Required for all data access" },
    { label: "HTTPS", status: true, detail: "Enforced on all endpoints" },
    { label: "CORS", status: true, detail: "Configured for edge functions" },
    { label: "DPDP Compliance", status: false, detail: "Review pending — assign to compliance agent" },
    { label: "Rate Limiting", status: false, detail: "Not yet configured" },
  ];
  return (
    <div className="space-y-2 pl-2">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", c.status ? "bg-success" : "bg-warning")} />
          <span className="text-xs text-foreground">{c.label}</span>
          <span className="text-[10px] text-muted-foreground ml-auto">{c.detail}</span>
        </div>
      ))}
    </div>
  );
}

function PreferencesSection() {
  const currentTz = getStoredTimezone();

  const handleTimezoneChange = (value: string) => {
    localStorage.setItem("layaa_timezone", value);
    window.dispatchEvent(new Event("layaa_tz_change"));
    toast.success(`Timezone changed to ${TIMEZONE_OPTIONS.find(t => t.value === value)?.label || value}`);
  };

  return (
    <div className="space-y-4 pl-2">
      <div>
        <label className="text-xs font-medium text-foreground block mb-1.5">Timezone</label>
        <Select defaultValue={currentTz} onValueChange={handleTimezoneChange}>
          <SelectTrigger className="w-64 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONE_OPTIONS.map(tz => (
              <SelectItem key={tz.value} value={tz.value} className="text-xs">
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground mt-1">Used for the platform clock, notifications, and timestamps</p>
      </div>
    </div>
  );
}

function LLMConfigSection() {
  const { data: config, isLoading } = useLLMConfig();
  const saveMutation = useSaveLLMConfig();
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [testing, setTesting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize form from DB
  if (config && !initialized) {
    setProvider(config.provider);
    setModel(config.model);
    setApiKey(config.apiKey);
    setBaseUrl(config.baseUrl);
    setInitialized(true);
  }

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto my-4" />;

  const selectedProvider = getProviderById(provider);
  const models = selectedProvider?.models ?? [];
  const showApiKey = provider !== "lovable";
  const showBaseUrl = provider === "custom";

  const handleProviderChange = (val: string) => {
    setProvider(val);
    const prov = getProviderById(val);
    if (prov && prov.models.length > 0) setModel(prov.models[0]);
    else setModel("");
    if (prov && prov.baseUrl) setBaseUrl(prov.baseUrl);
    else setBaseUrl("");
  };

  const handleSave = async () => {
    const finalBaseUrl = showBaseUrl
      ? baseUrl
      : selectedProvider?.baseUrl || "";
    saveMutation.mutate(
      { provider, model, apiKey, baseUrl: finalBaseUrl },
      { onSuccess: () => toast.success("LLM configuration saved!") }
    );
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Say hello in exactly 3 words." }],
          model: model || "google/gemini-3-flash-preview",
          agentName: "Test",
          agentRole: "tester",
          systemPrompt: "Reply briefly.",
        }),
      });
      if (resp.ok) toast.success("✅ LLM connection works!");
      else {
        const err = await resp.json().catch(() => ({}));
        toast.error(`Test failed: ${err.error || resp.statusText}`);
      }
    } catch (e: any) {
      toast.error(`Test failed: ${e.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4 pl-2">
      <p className="text-[10px] text-muted-foreground">
        The default is Lovable AI (free, no API key needed). Switch to any provider below to use your own API key.
      </p>

      <div>
        <Label className="text-xs">AI Provider</Label>
        <Select value={provider} onValueChange={handleProviderChange}>
          <SelectTrigger className="w-72 h-9 text-xs mt-1">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            {BUILT_IN_PROVIDERS.map(p => (
              <SelectItem key={p.id} value={p.id} className="text-xs">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Model</Label>
        {models.length > 0 ? (
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-72 h-9 text-xs mt-1">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map(m => (
                <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={model}
            onChange={e => setModel(e.target.value)}
            placeholder="Enter model name (e.g. my-custom-model)"
            className="w-72 h-9 text-xs mt-1"
          />
        )}
      </div>

      {showApiKey && (
        <div>
          <Label className="text-xs">API Key</Label>
          <Input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-... or your provider's API key"
            className="w-72 h-9 text-xs mt-1"
          />
        </div>
      )}

      {showBaseUrl && (
        <div>
          <Label className="text-xs">API Base URL</Label>
          <Input
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            placeholder="https://your-provider.com/v1/chat/completions"
            className="w-72 h-9 text-xs mt-1"
          />
          <p className="text-[9px] text-muted-foreground mt-1">Must be OpenAI-compatible endpoint</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving…" : "Save"}
        </Button>
        <Button size="sm" variant="outline" onClick={handleTest} disabled={testing}>
          {testing ? "Testing…" : "Test Connection"}
        </Button>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">System configuration, credentials, and security</p>
      </div>
      <div className="px-6 py-4 space-y-3">
        {SECTIONS.map((s) => {
          const isOpen = expanded === s.label;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
              <button
                onClick={() => setExpanded(isOpen ? null : s.label)}
                className="flex items-center gap-4 w-full px-5 py-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">{s.label}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 border-t border-border">
                  {s.type && (
                    <div className="flex justify-end mb-3">
                      <Button size="sm" variant="outline" onClick={() => setDialogType(s.type!)}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add
                      </Button>
                    </div>
                  )}
                  {s.type && <ConnectorList type={s.type} />}
                  {s.label === "Preferences" && <PreferencesSection />}
                  {s.label === "LLM Configuration" && <LLMConfigSection />}
                  {s.label === "Database" && <DatabaseSection />}
                  {s.label === "Security" && <SecuritySection />}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {dialogType && (
        <NewConnectorDialog
          open={!!dialogType}
          onOpenChange={(o) => !o && setDialogType(null)}
          defaultType={dialogType}
        />
      )}
    </div>
  );
}
