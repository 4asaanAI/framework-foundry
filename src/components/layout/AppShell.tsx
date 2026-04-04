import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppFooter } from "@/components/layout/AppFooter";
import { RightPanel } from "@/components/layout/RightPanel";
import { ChatView } from "@/components/views/ChatView";
import { AgentsView } from "@/components/views/AgentsView";
import { ProjectsView } from "@/components/views/ProjectsView";
import { TasksView } from "@/components/views/TasksView";
import { DashboardView } from "@/components/views/DashboardView";
import { ApprovalsView } from "@/components/views/ApprovalsView";
import { SettingsView } from "@/components/views/SettingsView";

export function AppShell() {
  const [activeView, setActiveView] = useState("chat");

  const renderView = () => {
    switch (activeView) {
      case "chat": return <ChatView />;
      case "agents": return <AgentsView />;
      case "projects": return <ProjectsView />;
      case "tasks": return <TasksView />;
      case "dashboard": return <DashboardView />;
      case "approvals": return <ApprovalsView />;
      case "settings": return <SettingsView />;
      default: return <ChatView />;
    }
  };

  const showRightPanel = activeView === "chat";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onViewChange={setActiveView} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>
        {showRightPanel && <RightPanel />}
      </div>
      <AppFooter />
    </div>
  );
}
