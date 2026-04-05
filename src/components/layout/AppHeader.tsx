import { useState, useEffect } from "react";
import { Search, Bell, Settings, Sun, Moon, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllRead } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GlobalSearchDialog } from "@/components/dialogs/GlobalSearchDialog";
import { DirectoryDialog } from "@/components/dialogs/DirectoryDialog";

interface HeaderProps {
  onViewChange: (view: string) => void;
  onAgentClick?: (agentId: string) => void;
}

export function AppHeader({ onViewChange, onAgentClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();
  const { profile } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);

  // ⌘K shortcut
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

  return (
    <>
      <header className="flex items-center h-[56px] px-5 border-b border-border bg-background shrink-0">
        {/* Logo — left */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-primary font-bold text-lg tracking-tight">Layaa OS</span>
          <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-card border border-border">v0.1</span>
        </div>

        {/* Search bar — centered */}
        <div className="flex-1 flex justify-center px-6">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:border-primary/30 transition-colors w-full max-w-lg"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Search anything...</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-background border border-border font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Right icons — right-aligned */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Directory */}
          <button
            onClick={() => setDirectoryOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            title="Directory"
          >
            <BookOpen className="h-4 w-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                <Bell className="h-4 w-4" />
                {(unreadCount ?? 0) > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {(unreadCount ?? 0) > 0 && (
                  <button onClick={() => markAllRead.mutate()} className="text-[10px] text-primary hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {(!notifications || notifications.length === 0) ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No notifications yet</p>
                ) : (
                  notifications.map((n: any) => (
                    <button
                      key={n.id}
                      onClick={() => { if (!n.is_read) markRead.mutate(n.id); }}
                      className={cn(
                        "flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-card transition-colors border-b border-border last:border-0",
                        !n.is_read && "bg-primary/5"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs", !n.is_read ? "font-semibold text-foreground" : "text-muted-foreground")}>{n.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          {new Date(n.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                        </p>
                      </div>
                      {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={() => onViewChange("settings")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>

          <div
            className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold overflow-hidden"
            style={{ backgroundColor: (profile?.color ?? "#E87A2E") + "20", color: profile?.color ?? "#E87A2E" }}
          >
            {profile?.initials ?? "U"}
          </div>
        </div>
      </header>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} onNavigate={handleSearchNavigate} onAgentClick={onAgentClick} />
      <DirectoryDialog open={directoryOpen} onOpenChange={setDirectoryOpen} />
    </>
  );
}
