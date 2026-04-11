// src/components/views/InsightsView.tsx
// Combined Dashboard & Analytics view with profile view switcher

import { useState } from "react";
import { DashboardView } from "@/components/views/DashboardView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileViewSwitcher } from "@/components/ProfileViewSwitcher";

export function InsightsView() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics">("dashboard");
  const [profileFilter, setProfileFilter] = useState("all");

  return (
    <div className="flex flex-col h-full">
      {/* Tab switcher + Profile filter */}
      <div className="flex items-center justify-between px-6 pt-4 pb-0 flex-wrap gap-2">
        <div className="flex items-center gap-1">
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
        <ProfileViewSwitcher selected={profileFilter} onChange={setProfileFilter} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "dashboard" ? <DashboardView /> : <AnalyticsView />}
      </div>
    </div>
  );
}
