import { useState, useEffect } from "react";
import { Server, Key, Database, Globe, Shield, Plug, Plus, Trash2, Power, ChevronDown, ChevronRight, Loader2, CheckCircle2, Clock, User, Coins, Wand2, ScrollText, Download, Upload } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useAgents } from "@/hooks/use-agents";
import { MODEL_TIERS, getAgentDefaultTier, setAgentTierOverride, type ModelTier } from "@/lib/model-tiers";
import { useAgentUsageSummary } from "@/hooks/use-token-usage";
import { MOCK_AGENTS } from "@/constants/agents";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const SECTIONS = [
  { icon: User, label: "Profile", type: null, desc: "Edit your name, email, password, and preferences" },
  { icon: Coins, label: "Token Distribution", type: null, desc: "Set per-agent token budgets with sliders, profile pool, and monthly recharge" },
  { icon: Server, label: "LLM Configuration", type: null, desc: "Switch AI providers, models, and API keys" },
  { icon: Plug, label: "Integrations", type: "integrations", desc: "Credentials, webhooks, MCP connectors, and plugins" },
  { icon: ScrollText, label: "Audit Log", type: null, desc: "View all system actions, approvals, memory changes, and agent activity" },
  { icon: Database, label: "Database", type: null, desc: "Connection status and database info" },
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
            {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
          </div>
          <button
            onClick={() => toggleConnector.mutate({ id: item.id, is_active: !item.is_active })}
            className={cn("p-1 rounded transition-all duration-200", item.is_active ? "text-success hover:bg-success/10" : "text-muted-foreground hover:bg-muted")}
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
            className="p-1 rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
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
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• 13 tables configured (agents, tasks, conversations, etc.)</p>
        <p>• Row Level Security enabled on all tables</p>
        <p>• Realtime enabled for messages, notifications, approvals, tasks</p>
        <p>• Automatic backups managed by Lovable Cloud</p>
      </div>
    </div>
  );
}

function SecuritySection() {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const checks = [
    { label: "Row Level Security", status: true, detail: "Enabled on all tables" },
    { label: "JWT Authentication", status: true, detail: "Required for all data access" },
    { label: "HTTPS", status: true, detail: "Enforced on all endpoints" },
    { label: "CORS", status: true, detail: "Configured for edge functions" },
    { label: "Rate Limiting", status: true, detail: "10 req/min per profile enforced" },
    { label: "DPDP Compliance", status: false, detail: "Migration to Indian VPS planned" },
  ];

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [convos, messages, tasks, approvals, memories, notifications] = await Promise.all([
        supabase.from("conversations").select("*").eq("profile_id", user.id),
        supabase.from("messages").select("*"),
        supabase.from("tasks").select("*"),
        supabase.from("approvals").select("*").eq("profile_id", user.id),
        supabase.from("agent_memories").select("*"),
        supabase.from("notifications").select("*").eq("profile_id", user.id),
      ]);

      const exportData = {
        exported_at: new Date().toISOString(),
        profile_id: user.id,
        conversations: convos.data ?? [],
        messages: messages.data ?? [],
        tasks: tasks.data ?? [],
        approvals: approvals.data ?? [],
        agent_memories: memories.data ?? [],
        notifications: notifications.data ?? [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `layaa-os-data-export-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteData = async () => {
    if (deleteConfirm !== "DELETE" || !user) return;
    setDeleting(true);
    try {
      // Delete personal conversations and their messages
      const { data: userConvos } = await supabase.from("conversations").select("id").eq("profile_id", user.id);
      for (const c of (userConvos ?? [])) {
        await supabase.from("messages").delete().eq("conversation_id", c.id);
      }
      await supabase.from("conversations").delete().eq("profile_id", user.id);
      // Anonymize tasks
      await supabase.from("tasks").update({ created_by_profile: "deleted" } as any).eq("created_by_profile", user.id);
      // Anonymize approvals
      await supabase.from("approvals").update({ profile_id: "deleted" } as any).eq("profile_id", user.id);
      // Delete personal notifications
      await supabase.from("notifications").delete().eq("profile_id", user.id);
      // Log deletion
      await supabase.from("audit_log").insert({
        actor_id: user.id, actor_type: "user", action: "gdpr_delete",
        target_table: "multiple", payload: { type: "full_data_deletion" },
      });
      toast.success("Your data has been deleted");
      setDeleteConfirm("");
    } catch {
      toast.error("Deletion failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 pl-2">
      {/* Security checks */}
      <div className="space-y-2">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", c.status ? "bg-success" : "bg-warning")} />
            <span className="text-xs text-foreground">{c.label}</span>
            <span className="text-xs text-muted-foreground ml-auto">{c.detail}</span>
          </div>
        ))}
      </div>

      {/* Settings Export/Import */}
      <div className="border-t border-border pt-4">
        <h4 className="text-xs font-semibold text-foreground mb-2">Settings Backup</h4>
        <p className="text-xs text-muted-foreground mb-2">Export or import your platform settings — token distribution, thresholds, notification preferences, LLM config.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={async () => {
            const { data: settings } = await supabase.from("settings").select("key, value");
            const localSettings = {
              layaa_profile_token_pool: localStorage.getItem("layaa_profile_token_pool"),
              layaa_notif_prefs: localStorage.getItem("layaa_notif_prefs"),
              layaa_notif_sound: localStorage.getItem("layaa_notif_sound"),
              layaa_compact_mode: localStorage.getItem("layaa_compact_mode"),
              layaa_show_thinking: localStorage.getItem("layaa_show_thinking"),
              layaa_fav_skills: localStorage.getItem("layaa_fav_skills"),
              layaa_approval_rules: localStorage.getItem("layaa_approval_rules"),
            };
            const exportData = { exported_at: new Date().toISOString(), db_settings: settings ?? [], local_settings: localSettings };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `layaa-os-settings-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
            toast.success("Settings exported");
            await supabase.from("audit_log").insert({ actor_id: user?.id || "", actor_type: "user", action: "settings_export", target_table: "settings", payload: { type: "export" } });
          }}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export Settings
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            const input = document.createElement("input"); input.type = "file"; input.accept = ".json";
            input.onchange = async (e: any) => {
              const file = e.target.files?.[0]; if (!file) return;
              const text = await file.text();
              try {
                const data = JSON.parse(text);
                // Restore DB settings
                if (data.db_settings) { for (const s of data.db_settings) { await supabase.from("settings").upsert({ key: s.key, value: s.value }, { onConflict: "key" }); } }
                // Restore local settings
                if (data.local_settings) { for (const [k, v] of Object.entries(data.local_settings)) { if (v !== null) localStorage.setItem(k, v as string); } }
                toast.success("Settings imported — refresh to apply all changes");
                await supabase.from("audit_log").insert({ actor_id: user?.id || "", actor_type: "user", action: "settings_import", target_table: "settings", payload: { type: "import" } });
              } catch { toast.error("Invalid settings file"); }
            };
            input.click();
          }}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Import Settings
          </Button>
        </div>
      </div>

      {/* GDPR — Data Export */}
      <div className="border-t border-border pt-4">
        <h4 className="text-xs font-semibold text-foreground mb-2">Data Export (GDPR)</h4>
        <p className="text-xs text-muted-foreground mb-2">Download all your data as a JSON file — conversations, messages, tasks, approvals, memories, notifications.</p>
        <Button size="sm" variant="outline" onClick={handleExportData} disabled={exporting}>
          <Download className="h-3.5 w-3.5 mr-1" /> {exporting ? "Exporting..." : "Export My Data"}
        </Button>
      </div>

      {/* GDPR — Data Deletion */}
      <div className="border-t border-border pt-4">
        <h4 className="text-xs font-semibold text-destructive mb-2">Delete My Data</h4>
        <p className="text-xs text-muted-foreground mb-2">Permanently delete your conversations and anonymize shared data. This action is irreversible.</p>
        <div className="flex items-center gap-2">
          <Input
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder='Type "DELETE" to confirm'
            className="w-48 h-8 text-xs"
          />
          <Button size="sm" variant="destructive" onClick={handleDeleteData} disabled={deleting || deleteConfirm !== "DELETE"}>
            {deleting ? "Deleting..." : "Delete Data"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  const { profile, user, changePassword } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save password if changed
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          setSaving(false);
          return;
        }
        const result = await changePassword(newPassword);
        if (!result.success) {
          toast.error(result.error || "Failed to change password");
          setSaving(false);
          return;
        }
      }

      // Save display name to profiles table
      if (user) {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase
          .from("profiles")
          .upsert({ user_id: user.id, display_name: displayName }, { onConflict: "user_id" });
      }

      toast.success("Profile settings saved");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to save profile settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pl-2">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
          style={{ backgroundColor: (profile?.color ?? "#E87A2E") + "20", color: profile?.color ?? "#E87A2E" }}
        >
          {profile?.initials ?? "U"}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{profile?.name}</p>
          <p className="text-xs text-muted-foreground">{profile?.email}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Admin / Dev Mode</span>
        </div>
      </div>

      <div>
        <Label className="text-xs">Display Name</Label>
        <Input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Your name"
          className="w-72 h-9 text-xs mt-1"
        />
      </div>

      <div>
        <Label className="text-xs">Email</Label>
        <Input
          value={email}
          disabled
          className="w-72 h-9 text-xs mt-1 opacity-60"
        />
        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-xs font-semibold text-foreground mb-3">Preferences</h4>
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-1.5">Timezone</label>
          <Select defaultValue={getStoredTimezone()} onValueChange={(val) => {
            localStorage.setItem("layaa_timezone", val);
            window.dispatchEvent(new Event("layaa_tz_change"));
          }}>
            <SelectTrigger className="w-72 h-9 text-xs">
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
          <p className="text-xs text-muted-foreground mt-1">Used for timestamps and notifications</p>
        </div>
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-xs font-semibold text-foreground mb-3">Change Password</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-72 h-9 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-72 h-9 text-xs mt-1"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-xs font-semibold text-foreground mb-3">Notification Preferences</h4>
        <div className="space-y-2">
          {[
            { key: "budget", label: "Budget alerts" },
            { key: "task", label: "Task reminders" },
            { key: "approval", label: "Approval requests" },
            { key: "system", label: "System notifications (Kaiser briefings, health)" },
            { key: "memory", label: "Memory extraction updates" },
          ].map(pref => {
            const stored = JSON.parse(localStorage.getItem("layaa_notif_prefs") || "{}");
            const enabled = stored[pref.key] !== false; // default true
            return (
              <label key={pref.key} className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-foreground">{pref.label}</span>
                <button onClick={() => {
                  const updated = { ...stored, [pref.key]: !enabled };
                  localStorage.setItem("layaa_notif_prefs", JSON.stringify(updated));
                  toast.success(`${pref.label} ${!enabled ? "enabled" : "muted"}`);
                }} className={cn("w-9 h-5 rounded-full transition-all duration-200 relative", enabled ? "bg-primary" : "bg-muted")}>
                  <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200", enabled ? "left-[18px]" : "left-0.5")} />
                </button>
              </label>
            );
          })}
        </div>
        {/* Notification sound toggle */}
        <div className="mt-3">
          {(() => {
            const soundEnabled = localStorage.getItem("layaa_notif_sound") !== "false";
            return (
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-foreground">Notification sound</span>
                <button onClick={() => {
                  const next = !soundEnabled;
                  localStorage.setItem("layaa_notif_sound", String(next));
                  toast.success(next ? "Sound enabled" : "Sound muted");
                }} className={cn("w-9 h-5 rounded-full transition-all duration-200 relative", soundEnabled ? "bg-primary" : "bg-muted")}>
                  <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200", soundEnabled ? "left-[18px]" : "left-0.5")} />
                </button>
              </label>
            );
          })()}
        </div>
      </div>

      <div className="pt-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  const [activeType, setActiveType] = useState("credential");
  const [dialogType, setDialogType] = useState<string | null>(null);

  return (
    <div className="space-y-4 pl-2">
      <div className="flex items-center gap-2 mb-3">
        <Label className="text-xs shrink-0">Type</Label>
        <Select value={activeType} onValueChange={setActiveType}>
          <SelectTrigger className="w-52 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credential" className="text-xs">Credential Vault</SelectItem>
            <SelectItem value="webhook" className="text-xs">Webhooks</SelectItem>
            <SelectItem value="mcp" className="text-xs">MCP & Connectors</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={() => setDialogType(activeType)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </div>
      <ConnectorList type={activeType} />
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
      <p className="text-xs text-muted-foreground">
        Layaa OS uses three intelligence tiers. Switch between them in any chat.
      </p>

      {/* Tier overview */}
      <div className="space-y-2 mb-4">
        {MODEL_TIERS.map(tier => (
          <div key={tier.id} className={cn("p-3 rounded-xl border", tier.color)}>
            <div className="flex items-center gap-2 mb-1">
              <span>{tier.icon}</span>
              <span className="text-xs font-semibold text-foreground">{tier.name}</span>
              <span className="text-xs text-muted-foreground ml-auto font-mono">${(tier.costPerToken * 1000000).toFixed(0)}/1M tokens</span>
            </div>
            <p className="text-xs text-muted-foreground">{tier.description}</p>
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {tier.models.map(m => <span key={m.id} className="text-xs px-1.5 py-0.5 rounded bg-background text-muted-foreground">{m.name}</span>)}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Configure the default provider and API key below. The default is Lovable AI (free, no API key needed).
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
          <p className="text-xs text-muted-foreground mt-1">Must be OpenAI-compatible endpoint</p>
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

function AuditLogSection() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const loadLogs = async () => {
    setLoading(true);
    let query = supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(50);
    if (filter !== "all") query = query.eq("action", filter);
    const { data } = await query;
    setLogs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadLogs(); }, [filter]);

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `audit-log-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pl-2">
      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 h-9 text-xs">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Actions</SelectItem>
            <SelectItem value="health_check" className="text-xs">Health Checks</SelectItem>
            <SelectItem value="daily_briefing" className="text-xs">Daily Briefings</SelectItem>
            <SelectItem value="memory_extraction" className="text-xs">Memory Extraction</SelectItem>
            <SelectItem value="auto_recover" className="text-xs">Auto Recovery</SelectItem>
            <SelectItem value="approval" className="text-xs">Approvals</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={exportLogs}>
          <Download className="h-3.5 w-3.5 mr-1" /> Export
        </Button>
      </div>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto my-4" />
      ) : logs.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4">No audit log entries found.</p>
      ) : (
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          {logs.map((log: any) => (
            <div key={log.id} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-muted/40 text-xs transition-all duration-200">
              <div className="w-16 shrink-0 text-muted-foreground font-mono">
                {new Date(log.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">{log.action}</span>
                <span className="text-muted-foreground ml-2">by {log.actor_id} ({log.actor_type})</span>
                {log.target_table && <span className="text-muted-foreground ml-1">→ {log.target_table}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TokenDistributionSection() {
  const { data: dbAgents } = useAgents();
  const { data: usageSummary } = useAgentUsageSummary();
  const queryClient = useQueryClient();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const activeAgents = agents.filter(a => a.is_active);

  // Profile-level total pool (stored in localStorage, shared via settings table)
  const [profilePool, setProfilePool] = useState(() => {
    const stored = localStorage.getItem("layaa_profile_token_pool");
    return stored ? parseInt(stored, 10) : agents.reduce((s, a) => s + a.budget_tokens, 0);
  });
  const [agentBudgets, setAgentBudgets] = useState<Record<string, number>>({});
  const [agentThresholds, setAgentThresholds] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [rolloverEnabled] = useState(true); // Full rollover — unused tokens carry over

  // Initialize budgets and thresholds from current agent data
  useEffect(() => {
    if (activeAgents.length > 0 && !initialized) {
      const budgets: Record<string, number> = {};
      const thresholds: Record<string, number> = {};
      activeAgents.forEach(a => { budgets[a.id] = a.budget_tokens; thresholds[a.id] = 90; });
      setAgentBudgets(budgets);
      setAgentThresholds(thresholds);
      // Load saved thresholds from settings
      supabase.from("settings").select("key, value").like("key", "budget_threshold_%").then(({ data }) => {
        if (data) {
          const saved = { ...thresholds };
          data.forEach((s: any) => { saved[s.key.replace("budget_threshold_", "")] = parseInt(s.value); });
          setAgentThresholds(saved);
        }
      });
      setInitialized(true);
    }
  }, [activeAgents, initialized]);

  const totalAllocated = Object.values(agentBudgets).reduce((s, v) => s + v, 0);
  const remaining = profilePool - totalAllocated;

  // Monthly recharge date (1st of next month)
  const nextRecharge = (() => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return next.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  })();

  const handleSliderChange = (agentId: string, value: number) => {
    setAgentBudgets(prev => {
      const updated = { ...prev, [agentId]: value };
      return updated;
    });
  };

  // Auto-sort: distribute based on usage analytics
  const handleAutoSort = () => {
    const logs = usageSummary ?? [];
    const usages: Record<string, number> = {};
    activeAgents.forEach(a => { usages[a.id] = 0; });
    logs.forEach((l: any) => {
      if (usages[l.agent_id] !== undefined) {
        usages[l.agent_id] += (l.tokens_in || 0) + (l.tokens_out || 0);
      }
    });
    const totalUsage = Object.values(usages).reduce((s, v) => s + Math.max(v, 1), 0);
    const newBudgets: Record<string, number> = {};
    activeAgents.forEach(a => {
      const weight = Math.max(usages[a.id] || 0, 1) / totalUsage;
      newBudgets[a.id] = Math.round(profilePool * weight);
    });
    // Fix rounding errors
    const diff = profilePool - Object.values(newBudgets).reduce((s, v) => s + v, 0);
    if (diff !== 0 && activeAgents.length > 0) {
      newBudgets[activeAgents[0].id] += diff;
    }
    setAgentBudgets(newBudgets);
    toast.success("Token distribution sorted by usage analytics");
  };

  const handleSave = async () => {
    if (remaining < 0) {
      toast.error("Total allocation exceeds profile pool");
      return;
    }
    setSaving(true);
    try {
      for (const [agentId, budget] of Object.entries(agentBudgets)) {
        await supabase.from("agents").update({ budget_tokens: budget }).eq("id", agentId);
      }
      // Save per-agent alert thresholds
      for (const [agentId, threshold] of Object.entries(agentThresholds)) {
        await supabase.from("settings").upsert({ key: `budget_threshold_${agentId}`, value: String(threshold) }, { onConflict: "key" });
      }
      localStorage.setItem("layaa_profile_token_pool", profilePool.toString());
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Token distribution and alert thresholds saved");
    } catch {
      toast.error("Failed to save token distribution");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 pl-2">
      {/* Profile pool setting */}
      <div className="flex items-center gap-4">
        <div>
          <Label className="text-xs">Profile Token Pool</Label>
          <Input
            type="number"
            value={profilePool}
            onChange={e => setProfilePool(parseInt(e.target.value) || 0)}
            className="w-40 h-9 text-xs mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Both profiles get equal pools. Recharges on 1st of every month. Unused tokens roll over.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Next Recharge</p>
          <p className="text-sm font-mono text-foreground">{nextRecharge}</p>
        </div>
      </div>

      {/* Allocation summary */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Allocated</p>
          <p className="text-sm font-bold font-mono">{totalAllocated.toLocaleString()}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className={cn("text-sm font-bold font-mono", remaining < 0 ? "text-destructive" : "text-success")}>{remaining.toLocaleString()}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Pool</p>
          <p className="text-sm font-bold font-mono">{profilePool.toLocaleString()}</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleAutoSort}>
          <Wand2 className="h-3.5 w-3.5 mr-1" />
          Sort by Usage
        </Button>
      </div>

      {/* Per-agent sliders */}
      <div className="space-y-3">
        {activeAgents.map(agent => {
          const budget = agentBudgets[agent.id] ?? agent.budget_tokens;
          const maxVal = profilePool;
          return (
            <div key={agent.id} className="flex items-center gap-3">
              <div className="w-28 flex items-center gap-2 shrink-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: agent.avatar_color }}
                >
                  {agent.avatar_initials}
                </div>
                <span className="text-xs font-medium text-foreground truncate">{agent.name}</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxVal}
                step={10}
                value={budget}
                onChange={e => handleSliderChange(agent.id, parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
              />
              <Input
                type="number"
                value={budget}
                onChange={e => handleSliderChange(agent.id, parseInt(e.target.value) || 0)}
                className="w-20 h-8 text-xs text-right font-mono"
              />
              <div className="flex items-center gap-1 shrink-0" title="Alert threshold %">
                <Input
                  type="number"
                  min={50} max={100}
                  value={agentThresholds[agent.id] ?? 90}
                  onChange={e => setAgentThresholds(prev => ({ ...prev, [agent.id]: parseInt(e.target.value) || 90 }))}
                  className="w-14 h-8 text-xs text-right font-mono"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <select
                value={getAgentDefaultTier(agent.id)}
                onChange={e => { setAgentTierOverride(agent.id, e.target.value as ModelTier); toast.success(`${agent.name} default tier set to ${e.target.value}`); }}
                className="h-8 px-2 rounded-lg border border-border bg-card text-xs shrink-0"
                title="Default model tier"
              >
                {MODEL_TIERS.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-3 sm:px-6 py-4 sm:py-5 border-b border-border bg-background">
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
                  {s.label === "Profile" && <ProfileSection />}
                  {s.label === "Token Distribution" && <TokenDistributionSection />}
                  {s.label === "LLM Configuration" && <LLMConfigSection />}
                  {s.label === "Audit Log" && <AuditLogSection />}
                  {s.label === "Integrations" && <IntegrationsSection />}
                  {s.label === "Database" && <DatabaseSection />}
                  {s.label === "Security" && <SecuritySection />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
