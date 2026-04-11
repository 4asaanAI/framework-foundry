// src/components/views/InsightsView.tsx
// Combined Dashboard & Analytics view — frontend-only wrapper
// Does not change any logic or definitions of the underlying views

import { useState } from "react";
import { DashboardView } from "@/components/views/DashboardView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function InsightsView() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics">("dashboard");

  return (
    <div className="flex flex-col h-full">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 px-6 pt-4 pb-0">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2",
            activeTab === "dashboard"
              ? "border-primary text-primary bg-card"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2",
            activeTab === "analytics"
              ? "border-primary text-primary bg-card"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "dashboard" ? <DashboardView /> : <AnalyticsView />}
      </div>
    </div>
  );
}
