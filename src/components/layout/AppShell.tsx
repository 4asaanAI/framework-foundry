import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppFooter } from "@/components/layout/AppFooter";
import { RightPanel } from "@/components/layout/RightPanel";
import { ChatView } from "@/components/views/ChatView";
import { AgentsView } from "@/components/views/AgentsView";
import { ProjectsView } from "@/components/views/ProjectsView";
import { TasksView } from "@/components/views/TasksView";
import { ApprovalsView } from "@/components/views/ApprovalsView";
import { SettingsView } from "@/components/views/SettingsView";
import { InsightsView } from "@/components/views/InsightsView";
import { CustomizeView } from "@/components/views/CustomizeView";
import { CRMView } from "@/components/views/CRMView";
import { DirectMessagesView } from "@/components/views/DirectMessagesView";
import { SageView } from "@/components/views/SageView";
import { ProjectWorkspaceView } from "@/components/views/ProjectWorkspaceView";
import { SplitScreenView, type DelegationPanel } from "@/components/views/SplitScreenView";
import { useAuth } from "@/contexts/AuthContext";
import { useAgents } from "@/hooks/use-agents";
import { useSharedRealtime } from "@/hooks/use-shared-realtime";
import { MOCK_AGENTS } from "@/constants/agents";

interface ActiveProject {
  projectId: string;
  projectName: string;
  contextId?: string;
}

export function AppShell() {
  const [activeView, setActiveView] = useState("chat");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [delegationPanels, setDelegationPanels] = useState<DelegationPanel[]>([]);
  const [activeProject, setActiveProject] = useState<ActiveProject | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem("layaa_compact_mode") === "true");
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { profile } = useAuth();

  // PWA install prompt capture
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Touch swipe to open/close sidebar on mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      // Only trigger on horizontal swipes (deltaX > 80px, deltaY < 50px)
      if (Math.abs(deltaX) > 80 && deltaY < 50) {
        if (deltaX > 0 && touchStartX < 30) {
          // Swipe right from left edge — open sidebar
          setSidebarOpen(true);
        } else if (deltaX < 0 && sidebarOpen) {
          // Swipe left while sidebar open — close sidebar
          setSidebarOpen(false);
        }
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", handleTouchStart); window.removeEventListener("touchend", handleTouchEnd); };
  }, [sidebarOpen]);

  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;

  // Subscribe to realtime changes on shared tabs (cross-profile sync)
  useSharedRealtime();

  // Focus mode keyboard shortcut (Ctrl+Shift+F)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setFocusMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Session timeout — auto-logout after inactivity
  useEffect(() => {
    const timeoutHours = parseInt(localStorage.getItem("layaa_session_timeout") || "24", 10);
    const timeoutMs = timeoutHours * 60 * 60 * 1000;
    let lastActivity = Date.now();
    const updateActivity = () => { lastActivity = Date.now(); };
    const checkTimeout = setInterval(() => {
      if (Date.now() - lastActivity > timeoutMs) {
        import("@/contexts/AuthContext").then(({ useAuth }) => {
          // Can't call hook here — use supabase directly
          import("@/integrations/supabase/client").then(({ supabase }) => {
            supabase.auth.signOut();
            window.location.reload();
          });
        });
      }
    }, 60000); // check every minute
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    return () => { clearInterval(checkTimeout); window.removeEventListener("mousemove", updateActivity); window.removeEventListener("keydown", updateActivity); window.removeEventListener("click", updateActivity); };
  }, []);

  // Compact mode: apply/remove CSS class on document
  useEffect(() => {
    if (compactMode) {
      document.documentElement.classList.add("compact-mode");
      localStorage.setItem("layaa_compact_mode", "true");
    } else {
      document.documentElement.classList.remove("compact-mode");
      localStorage.setItem("layaa_compact_mode", "false");
    }
  }, [compactMode]);

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
    // If a project workspace is active, show it
    if (activeView === "workspace" && activeProject) {
      return (
        <ProjectWorkspaceView
          projectId={activeProject.projectId}
          projectName={activeProject.projectName}
          contextId={activeProject.contextId}
          selectedAgentId={selectedAgentId}
          onBack={() => { setActiveProject(null); setActiveView("projects"); }}
          onDelegation={handleDelegation}
        />
      );
    }

    switch (activeView) {
      case "chat": return <ChatView selectedAgentId={selectedAgentId} onDelegation={handleDelegation} />;
      case "agents": return <AgentsView />;
      case "projects": return <ProjectsView />;
      case "tasks": return <TasksView />;
      case "insights":
      case "dashboard":
      case "analytics": return <InsightsView />;
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

  const MAX_DELEGATION_PANELS = 4; // + 1 main chat = 5 total screens

  const handleDelegation = useCallback((delegatedConversationId: string, targetAgentId: string, targetAgentName: string, delegationReason?: string) => {
    setDelegationPanels(prev => {
      if (prev.some(p => p.delegatedConversationId === delegatedConversationId)) return prev;
      if (prev.length >= MAX_DELEGATION_PANELS) {
        // Can't add more — show toast from outside setState
        setTimeout(() => {
          import("sonner").then(({ toast }) => {
            toast.error(`Maximum ${MAX_DELEGATION_PANELS} delegation panels reached (5 total including main chat). Close a panel to delegate to another agent.`);
          });
        }, 0);
        return prev;
      }
      const mainAgent = agents.find(a => a.id === selectedAgentId);
      const newPanel: DelegationPanel = {
        id: `panel-${Date.now()}`,
        delegatedConversationId,
        delegatingAgentName: mainAgent?.name || "Agent",
        delegatedAgentId: targetAgentId,
        isPinned: false,
        isMain: prev.length === 0,
        delegationReason,
      };
      return [...prev, newPanel];
    });
  }, [agents, selectedAgentId]);

  const handleClosePanel = useCallback((panelId: string) => {
    setDelegationPanels(prev => {
      const updated = prev.filter(p => p.id !== panelId);
      if (updated.length > 0 && !updated.some(p => p.isMain)) {
        updated[0].isMain = true;
      }
      return updated;
    });
  }, []);

  const handlePinPanel = useCallback((panelId: string) => {
    setDelegationPanels(prev =>
      prev.map(p => p.id === panelId ? { ...p, isPinned: !p.isPinned } : p)
    );
  }, []);

  const handleSetMainPanel = useCallback((panelId: string) => {
    setDelegationPanels(prev =>
      prev.map(p => ({ ...p, isMain: p.id === panelId }))
    );
  }, []);

  // Check for offline conflicts
  const [offlineConflicts, setOfflineConflicts] = useState<any[]>([]);
  useEffect(() => {
    const checkConflicts = () => {
      import("@/lib/offline").then(({ getOfflineConflicts }) => {
        setOfflineConflicts(getOfflineConflicts());
      });
    };
    checkConflicts();
    window.addEventListener("online", checkConflicts);
    return () => window.removeEventListener("online", checkConflicts);
  }, []);

  const hasSplitScreen = delegationPanels.length > 0 && activeView === "chat";
  const showRightPanel = activeView === "chat" && !hasSplitScreen && !activeProject;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {!focusMode && <AppHeader onViewChange={setActiveView} onAgentClick={handleAgentClick} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />}
      <div className="flex flex-1 overflow-hidden">
        {!focusMode && <AppSidebar activeView={activeView} onViewChange={setActiveView} onAgentClick={handleAgentClick} selectedAgentId={selectedAgentId} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />}
        <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {hasSplitScreen ? (
            <>
              <div className="flex-1 overflow-hidden lg:border-r border-b lg:border-b-0 border-border min-h-0">
                {renderView()}
              </div>
              <div className="flex-1 overflow-hidden min-h-0">
                <SplitScreenView
                  panels={delegationPanels}
                  onClosePanel={handleClosePanel}
                  onPinPanel={handlePinPanel}
                  onSetMainPanel={handleSetMainPanel}
                  mainAgentName={agents.find(a => a.id === selectedAgentId)?.name || "Agent"}
                  mainConversationId=""
                />
              </div>
            </>
          ) : (
            <div key={activeView} className="w-full overflow-hidden animate-fade-in">
              {renderView()}
            </div>
          )}
        </main>
        {showRightPanel && !focusMode && <RightPanel selectedAgentId={selectedAgentId} />}
      </div>
      {!focusMode && <AppFooter />}
      {/* Offline Conflict Banner */}
      {offlineConflicts.length > 0 && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 p-3 rounded-xl bg-warning/10 border border-warning/30 shadow-lg max-w-md animate-slide-up">
          <p className="text-xs font-semibold text-warning mb-1">{offlineConflicts.length} sync conflict(s) detected</p>
          <p className="text-xs text-muted-foreground mb-2">Data was modified while you were offline. Choose which version to keep.</p>
          {offlineConflicts.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between py-1 border-t border-border">
              <span className="text-xs text-foreground truncate flex-1">{c.type}: {c.id.slice(0, 8)}...</span>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { import("@/lib/offline").then(({ resolveOfflineConflict, getOfflineConflicts }) => { resolveOfflineConflict(c.id, true); setOfflineConflicts(getOfflineConflicts()); }); }}
                  className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200">Keep mine</button>
                <button onClick={() => { import("@/lib/offline").then(({ resolveOfflineConflict, getOfflineConflicts }) => { resolveOfflineConflict(c.id, false); setOfflineConflicts(getOfflineConflicts()); }); }}
                  className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground hover:bg-muted/80 transition-all duration-200">Keep server</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* PWA Install Prompt */}
      {installPrompt && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-xl bg-card border border-border shadow-xl max-w-xs animate-slide-up">
          <p className="text-sm font-medium text-foreground mb-1">Install Layaa OS</p>
          <p className="text-xs text-muted-foreground mb-3">Add to your home screen for offline access and a native app experience.</p>
          <div className="flex gap-2">
            <button onClick={async () => { await installPrompt.prompt(); setInstallPrompt(null); }} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all duration-200">Install</button>
            <button onClick={() => setInstallPrompt(null)} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-all duration-200">Not now</button>
          </div>
        </div>
      )}
    </div>
  );
}
