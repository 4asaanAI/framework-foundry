import { useState, useMemo } from "react";
import { Search, Plug, CheckCircle2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConnectors } from "@/hooks/use-connectors";
import { NewConnectorDialog } from "@/components/dialogs/NewConnectorDialog";
import { INTEGRATION_APPS, INTEGRATION_CATEGORIES } from "@/constants/integrations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function IntegrationsView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [connectingApp, setConnectingApp] = useState<string | null>(null);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const { data: connectors } = useConnectors();
  const qc = useQueryClient();

  const connectedNames = useMemo(
    () => new Set((connectors ?? []).map((c) => c.name.toLowerCase())),
    [connectors]
  );

  const filtered = useMemo(() => {
    let apps = INTEGRATION_APPS;
    if (category !== "All") apps = apps.filter((a) => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      apps = apps.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return apps;
  }, [search, category]);

  const handleConnect = async (appName: string) => {
    setConnectingApp(appName);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("connectors").insert([{
        name: appName,
        type: "mcp",
        description: INTEGRATION_APPS.find((a) => a.name === appName)?.description ?? "",
        config: {},
        is_active: true,
        created_by: user?.id,
      }]);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connectors"] });
      toast.success(`${appName} connected successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to connect");
    } finally {
      setConnectingApp(null);
    }
  };

  const handleDisconnect = async (appName: string) => {
    const connector = (connectors ?? []).find((c) => c.name.toLowerCase() === appName.toLowerCase());
    if (!connector) return;
    try {
      const { error } = await supabase.from("connectors").delete().eq("id", connector.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connectors"] });
      toast.success(`${appName} disconnected`);
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect");
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Integrations</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Connect {INTEGRATION_APPS.length}+ apps to your agents and workflows
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowCustomDialog(true)}>
            <Plug className="h-3.5 w-3.5 mr-1.5" /> Custom Connector
          </Button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="pl-9 h-9"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {INTEGRATION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">{filtered.length} integrations</p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((app) => {
            const isConnected = connectedNames.has(app.name.toLowerCase());
            const isConnecting = connectingApp === app.name;
            return (
              <div
                key={app.name}
                className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                    {app.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-medium text-foreground truncate">{app.name}</h3>
                      {isConnected && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{app.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <Badge variant="secondary" className="text-[10px]">{app.category}</Badge>
                  {isConnected ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleDisconnect(app.name)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      disabled={isConnecting}
                      onClick={() => handleConnect(app.name)}
                    >
                      {isConnecting ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewConnectorDialog
        open={showCustomDialog}
        onOpenChange={setShowCustomDialog}
        defaultType="mcp"
      />
    </div>
  );
}
