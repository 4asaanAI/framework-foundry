import { Settings as SettingsIcon, Server, Key, Database, Globe, Shield, Plug } from "lucide-react";

const SECTIONS = [
  { icon: Server, label: "LLM Providers", desc: "Configure OpenAI, Google, Anthropic API connections" },
  { icon: Key, label: "Credential Vault", desc: "Manage API keys (stored encrypted)" },
  { icon: Database, label: "Database", desc: "Connection, backups, schema management" },
  { icon: Globe, label: "Webhooks", desc: "Webhook URLs, API key authentication" },
  { icon: Plug, label: "Connectors & MCP", desc: "Manage MCP servers, plugins, and integrations" },
  { icon: Shield, label: "Security", desc: "Rate limiting, CORS, HTTPS, DPDP compliance" },
];

export function SettingsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">System configuration, credentials, and security</p>
      </div>
      <div className="px-6 py-4 space-y-3">
        {SECTIONS.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:glow-border transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <s.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{s.label}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
