import { useState, useEffect, useCallback } from "react";
import { MOCK_AGENTS } from "@/constants/agents";
import { useAgents } from "@/hooks/use-agents";
import { Wifi } from "lucide-react";

const TIMEZONE_OPTIONS = [
  { label: "IST (Kolkata)", value: "Asia/Kolkata" },
  { label: "UTC", value: "UTC" },
  { label: "EST (New York)", value: "America/New_York" },
  { label: "CST (Chicago)", value: "America/Chicago" },
  { label: "PST (Los Angeles)", value: "America/Los_Angeles" },
  { label: "GMT (London)", value: "Europe/London" },
  { label: "CET (Berlin)", value: "Europe/Berlin" },
  { label: "JST (Tokyo)", value: "Asia/Tokyo" },
  { label: "AEST (Sydney)", value: "Australia/Sydney" },
  { label: "SGT (Singapore)", value: "Asia/Singapore" },
  { label: "GST (Dubai)", value: "Asia/Dubai" },
];

function getStoredTimezone(): string {
  return localStorage.getItem("layaa_timezone") || "Asia/Kolkata";
}

export { TIMEZONE_OPTIONS, getStoredTimezone };

export function AppFooter() {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const totalBudget = agents.filter(a => a.is_active).reduce((s, a) => s + a.budget_tokens, 0);
  const totalUsed = agents.filter(a => a.is_active).reduce((s, a) => s + a.budget_used, 0);
  const pct = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

  const [timeStr, setTimeStr] = useState("");
  const [tz, setTz] = useState(getStoredTimezone);

  const updateTime = useCallback(() => {
    const now = new Date();
    setTimeStr(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: tz }));
  }, [tz]);

  useEffect(() => {
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, [updateTime]);

  // Listen for timezone changes from settings
  useEffect(() => {
    const handler = () => setTz(getStoredTimezone());
    window.addEventListener("layaa_tz_change", handler);
    return () => window.removeEventListener("layaa_tz_change", handler);
  }, []);

  const tzLabel = TIMEZONE_OPTIONS.find(t => t.value === tz)?.label?.split(" ")[0] || tz;

  return (
    <footer className="flex items-center justify-between h-[40px] px-6 border-t border-border bg-background text-xs text-muted-foreground shrink-0">
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
        <span className="font-mono">{totalUsed.toLocaleString()} / {totalBudget.toLocaleString()} tokens ({pct}%)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Wifi className="h-3 w-3 text-success" />
        <span>Online</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono">{timeStr}</span>
        <span>{tzLabel}</span>
      </div>
    </footer>
  );
}
