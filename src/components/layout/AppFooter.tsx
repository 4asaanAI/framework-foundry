import { MOCK_AGENTS } from "@/constants/agents";
import { Wifi } from "lucide-react";

export function AppFooter() {
  const totalBudget = MOCK_AGENTS.filter(a => a.is_active).reduce((s, a) => s + a.budget_tokens, 0);
  const totalUsed = MOCK_AGENTS.filter(a => a.is_active).reduce((s, a) => s + a.budget_used, 0);
  const pct = Math.round((totalUsed / totalBudget) * 100);

  const now = new Date();
  const timeIST = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

  return (
    <footer className="flex items-center justify-between h-[40px] px-6 border-t border-border bg-background text-xs text-muted-foreground shrink-0">
      {/* Budget */}
      <div className="flex items-center gap-2">
        <div className="relative w-5 h-5">
          <svg viewBox="0 0 36 36" className="w-5 h-5 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15" fill="none"
              stroke={pct > 80 ? "hsl(var(--destructive))" : pct > 50 ? "hsl(var(--warning))" : "hsl(var(--success))"}
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="font-mono">{totalUsed} / {totalBudget} tokens ({pct}%)</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <Wifi className="h-3 w-3 text-success" />
        <span>Online</span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2">
        <span>{timeIST} IST</span>
      </div>
    </footer>
  );
}
