import { Search, Bell, Settings, User } from "lucide-react";

interface HeaderProps {
  onViewChange: (view: string) => void;
}

export function AppHeader({ onViewChange }: HeaderProps) {
  return (
    <header className="flex items-center h-[60px] px-6 border-b border-border bg-background shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6">
        <span className="text-primary font-bold text-lg tracking-tight">Layaa OS</span>
        <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-card border border-border">v0.1</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <span>Search agents, conversations...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-background border border-border font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1 ml-6">
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <button
          onClick={() => onViewChange("settings")}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>
        <div className="ml-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
