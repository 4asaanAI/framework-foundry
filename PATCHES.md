# Memory Extraction — Patches for Existing Files

Apply these changes to your existing files in the GitHub repo.

---

## PATCH 1: `src/components/views/ChatView.tsx`

### 1a. Add import at the top (after other imports, around line 17):

```typescript
import { extractMemoriesFromMessage, saveExtractedMemories } from "@/lib/memory";
```

### 1b. Replace the existing sage-extract edge function call (lines 308-311):

**FIND this block** (inside `streamAIResponse`, after saving the agent message):

```typescript
      // Trigger Sage memory extraction in background (fire-and-forget)
      supabase.functions.invoke("sage-extract", {
        body: { conversation_id: conversationId, message_content: fullContent, agent_id: activeAgent.id },
      }).catch(() => {});
```

**REPLACE with:**

```typescript
      // Sage memory extraction — client-side keyword extraction (Phase 0)
      try {
        const memories = extractMemoriesFromMessage(fullContent);
        if (memories.length > 0) {
          saveExtractedMemories(activeAgent.id, memories)
            .then((count) => {
              if (count > 0) {
                toast(`Sage extracted ${count} memory${count > 1 ? "ies" : ""}`, {
                  duration: 2000,
                });
              }
            })
            .catch(() => {}); // fire-and-forget
        }
      } catch {
        // Memory extraction should never block chat
      }
```

---

## PATCH 2: `src/components/layout/AppSidebar.tsx`

### 2a. Add `Brain` to the lucide-react import (line 11-35):

Add `Brain` to the existing lucide-react import list:

```typescript
import {
  MessageSquare,
  Bot,
  FolderKanban,
  CheckSquare,
  LayoutDashboard,
  Shield,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  LogOut,
  History,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Check,
  X,
  MoreHorizontal,
  BarChart3,
  Blocks,
  Kanban,
  Mail,
  Brain,       // ← ADD THIS
} from "lucide-react";
```

### 2b. Add "Sage" to the NAV_ITEMS array (after "messages" / before "customize", around line 56):

```typescript
  { id: "sage", label: "Sage Memory", icon: Brain },
```

So the array becomes:
```typescript
const NAV_ITEMS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "crm", label: "CRM Board", icon: Kanban },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "approvals", label: "Approvals", icon: Shield },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "sage", label: "Sage Memory", icon: Brain },   // ← NEW
  { id: "customize", label: "Customize", icon: Blocks },
  { id: "settings", label: "Settings", icon: Settings },
];
```

---

## PATCH 3: `src/components/layout/AppShell.tsx`

### 3a. Add import for SageView (after other view imports, around line 15):

```typescript
import { SageView } from "@/components/views/SageView";
```

### 3b. Add the "sage" case to the `renderView` switch (before `default:`, around line 52):

```typescript
      case "sage": return <SageView />;
```

So the switch becomes:
```typescript
  const renderView = () => {
    switch (activeView) {
      case "chat": return <ChatView selectedAgentId={selectedAgentId} />;
      case "agents": return <AgentsView onAgentClick={handleAgentClick} />;
      case "projects": return <ProjectsView />;
      case "tasks": return <TasksView />;
      case "dashboard": return <DashboardView />;
      case "analytics": return <AnalyticsView />;
      case "approvals": return <ApprovalsView />;
      case "customize": return <CustomizeView />;
      case "crm": return <CRMView />;
      case "messages": return <DirectMessagesView />;
      case "sage": return <SageView />;         // ← NEW
      case "settings": return <SettingsView />;
      default: return <ChatView selectedAgentId={selectedAgentId} />;
    }
  };
```

---

## Summary of all changes

| Action | File | What |
|--------|------|------|
| CREATE | `src/lib/memory.ts` | Core extraction logic |
| CREATE | `src/components/views/SageView.tsx` | Manual extraction UI |
| PATCH  | `src/components/views/ChatView.tsx` | Replace edge fn with client-side extraction |
| PATCH  | `src/components/layout/AppSidebar.tsx` | Add "Sage Memory" nav item |
| PATCH  | `src/components/layout/AppShell.tsx` | Add SageView route |

No new dependencies needed. No database schema changes.
