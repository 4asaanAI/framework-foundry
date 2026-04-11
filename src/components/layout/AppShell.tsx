import { useState, useEffect } from "react";
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
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { CustomizeView } from "@/components/views/CustomizeView";
import { CRMView } from "@/components/views/CRMView";
import { DirectMessagesView } from "@/components/views/DirectMessagesView";
import { SageView } from "@/components/views/SageView";
import { SplitScreenView } from "@/components/views/SplitScreenView";
import { useAuth } from "@/contexts/AuthContext";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";

export function AppShell() {
  const [activeView, setActiveView] = useState("chat");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [splitScreen, setSplitScreen] = useState<{ delegatedConversationId: string; targetAgentId: string; targetAgentName: string } | null>(null);
  const { profile } = useAuth();
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;

  // Auto-select personal agent on login
  useEffect(() => {
    if (profile && agents.length > 0 && !selectedAgentId) {
      const personalAgent = agents.find((a) => a.name === profile.personalAgentName);
      if (personalAgent) {
        setSelectedAgentId(personalAgent.id);
      }
    }
  }, [profile, agents, selectedAgentId]);

  const renderView = () => {
    switch (activeView) {
      case "chat": return <ChatView selectedAgentId={selectedAgentId} onDelegation={handleDelegation} />;
      case "agents": return <AgentsView />;
      case "projects": return <ProjectsView />;
      case "tasks": return <TasksView />;
      case "dashboard": return <DashboardView />;
      case "analytics": return <AnalyticsView />;
      case "approvals": return <ApprovalsView />;
      case "sage": return <SageView />;
      case "customize": return <CustomizeView />;
      case "crm": return <CRMView />;
      case "messages": return <DirectMessagesView />;
      case "settings": return <SettingsView />;
      default: return <ChatView selectedAgentId={selectedAgentId} />;
    }
  };

  const handleAgentClick = (agentId: string) => {
    setSelectedAgentId(agentId);
    setActiveView("chat");
  };

  const handleDelegation = (delegatedConversationId: string, targetAgentId: string, targetAgentName: string) => {
    setSplitScreen({ delegatedConversationId, targetAgentId, targetAgentName });
  };

  const showRightPanel = activeView === "chat";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onViewChange={setActiveView} onAgentClick={handleAgentClick} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} onAgentClick={handleAgentClick} />
        <main className="flex-1 overflow-hidden flex">
          <div className={splitScreen ? "flex-1 overflow-hidden" : "w-full overflow-hidden"}>
            {renderView()}
          </div>
          {splitScreen && activeView === "chat" && (
            <div className="w-96 flex-shrink-0 overflow-hidden">
              <SplitScreenView
                mainConversationId=""
                delegatedConversationId={splitScreen.delegatedConversationId}
                delegatingAgentName="Kaiser"
                delegatedAgentId={splitScreen.targetAgentId}
                onClose={() => setSplitScreen(null)}
                model="google/gemini-3-flash-preview"
                provider="openrouter"
                apiKey=""
              />
            </div>
          )}
        </main>
        {showRightPanel && !splitScreen && <RightPanel selectedAgentId={selectedAgentId} />}
      </div>
      <AppFooter />
    </div>
  );
}
