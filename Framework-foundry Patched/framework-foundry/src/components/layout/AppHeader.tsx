import { useState, useEffect } from "react";
import { Search, Bell, Settings, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllRead } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GlobalSearchDialog } from "@/components/dialogs/GlobalSearchDialog";

interface HeaderProps {
  onViewChange: (view: string) => void;
  onAgentClick?: (agentId: string) => void;
  onToggleSidebar?: () => void;
}

export function AppHeader({ onViewChange, onAgentClick, onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();
  const { profile } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearchNavigate = (view: string) => {
    onViewChange(view);
  };

  const handleNotificationClick = (n: any) => {
    // Mark as read
    if (!n.is_read) markRead.mutate(n.id);

    // Navigate to agent chat if there's a source agent
    const agentId = n.source_agent_id;
    if (agentId && onAgentClick) {
      onAgentClick(agentId);
      onViewChange("chat");
      setNotifOpen(false);
    }
  };

  return (
    <>
      <header className="flex items-center h-14 px-3 sm:px-5 border-b border-border bg-background shrink-0">
        {/* Hamburger — mobile only */}
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200 mr-2 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-primary font-bold text-lg tracking-tight">Layaa OS</span>
          <span className="text-xs text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-card border border-border hidden sm:inline">v0.1</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 flex justify-center px-2 sm:px-6">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:border-primary/20 hover:shadow-sm transition-all duration-200 w-full max-w-lg"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Search anything...</span>
            <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded bg-background border border-border font-mono hidden sm:inline">Cmd+K</kbd>
          </button>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200">
                <Bell className="h-4 w-4" />
                {(unreadCount ?? 0) > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {(unreadCount ?? 0) > 0 && (
                  <button onClick={() => markAllRead.mutate()} className="text-xs text-primary hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {(() => {
                  // Filter by user preferences
                  const prefs = (() => { try { return JSON.parse(localStorage.getItem("layaa_notif_prefs") || "{}"); } catch { return {}; } })();
                  const filtered = (notifications ?? []).filter((n: any) => prefs[n.category] !== false);

                  // Group similar notifications (same title within 5 min)
                  const grouped: any[] = [];
                  for (const n of filtered) {
                    const existing = grouped.find(g => g.title === n.title && !g.is_read && Math.abs(new Date(g.created_at).getTime() - new Date(n.created_at).getTime()) < 300000);
                    if (existing) {
                      existing._groupCount = (existing._groupCount || 1) + 1;
                      if (!existing.is_read && n.is_read) existing.is_read = false;
                    } else {
                      grouped.push({ ...n, _groupCount: 1 });
                    }
                  }

                  // Play sound for new unread (only if sound enabled)
                  if (grouped.some(g => !g.is_read) && localStorage.getItem("layaa_notif_sound") !== "false") {
                    try {
                      const ctx = new AudioContext();
                      const osc = ctx.createOscillator();
                      const gain = ctx.createGain();
                      osc.connect(gain); gain.connect(ctx.destination);
                      osc.frequency.value = 800; gain.gain.value = 0.05;
                      osc.start(); osc.stop(ctx.currentTime + 0.1);
                    } catch { /* audio not available */ }
                  }

                  return grouped;
                })().length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No notifications yet</p>
                ) : (
                  (() => {
                    const prefs = (() => { try { return JSON.parse(localStorage.getItem("layaa_notif_prefs") || "{}"); } catch { return {}; } })();
                    const filtered = (notifications ?? []).filter((n: any) => prefs[n.category] !== false);
                    const grouped: any[] = [];
                    for (const n of filtered) {
                      const existing = grouped.find((g: any) => g.title === n.title && !g.is_read && Math.abs(new Date(g.created_at).getTime() - new Date(n.created_at).getTime()) < 300000);
                      if (existing) { existing._groupCount = (existing._groupCount || 1) + 1; }
                      else { grouped.push({ ...n, _groupCount: 1 }); }
                    }
                    return grouped;
                  })().map((n: any) => {
                    const agentInfo = n.agents;
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={cn(
                          "flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-card transition-colors border-b border-border last:border-0",
                          !n.is_read && "bg-primary/5"
                        )}
                      >
                        {/* Agent avatar */}
                        {agentInfo && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                            style={{ backgroundColor: agentInfo.avatar_color || "#666" }}
                          >
                            {agentInfo.avatar_initials || "?"}
                          </div>
                        )}
                        {!agentInfo && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn("text-xs", !n.is_read ? "font-semibold text-foreground" : "text-muted-foreground")}>
                              {n.title}
                            </p>
                            {agentInfo && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                                {agentInfo.name}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                          {n._groupCount > 1 && <span className="text-xs text-primary font-medium">+{n._groupCount - 1} similar</span>}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(n.created_at).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={() => onViewChange("settings")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
          </button>

          <div className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold overflow-hidden">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span style={{ backgroundColor: (profile?.color ?? "#E87A2E") + "20", color: profile?.color ?? "#E87A2E" }} className="w-full h-full flex items-center justify-center">
                {profile?.initials ?? "U"}
              </span>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} onNavigate={handleSearchNavigate} onAgentClick={onAgentClick} />
    </>
  );
}
