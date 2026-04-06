# Task 3: Offline Mode — Patches to Apply

## Files to CREATE (copy as-is):
1. `src/lib/offline-db.ts` ← from `TASK3-offline-db.ts`
2. `src/lib/sync-queue.ts` ← from `TASK3-sync-queue.ts`
3. `src/hooks/use-offline.ts` ← from `TASK3-use-offline.ts`

## Files to PATCH:

---

### PATCH 1: `src/main.tsx` — Start auto-sync on app boot

Replace the entire file with:

```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startAutoSync } from "@/lib/sync-queue";

// Start offline sync queue processor
startAutoSync();

createRoot(document.getElementById("root")!).render(<App />);
```

---

### PATCH 2: `src/hooks/use-conversations.ts` — Add offline fallback

Replace the entire file with:

```ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  cacheConversationsFromServer,
  cacheMessagesFromServer,
  getCachedConversations,
  getCachedMessages,
} from "@/hooks/use-offline";

export type ConversationRow = Tables<"conversations"> & { agent_name?: string };
export type MessageRow = Tables<"messages">;

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!navigator.onLine) {
        // Serve from IndexedDB cache when offline
        const cached = await getCachedConversations();
        return cached as unknown as ConversationRow[];
      }

      const { data, error } = await supabase
        .from("conversations")
        .select("*, agents!conversations_agent_id_fkey(name, avatar_initials, avatar_color)")
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });
      if (error) throw error;

      // Cache for offline use (fire-and-forget)
      if (data) {
        cacheConversationsFromServer(data).catch(console.error);
      }

      return data ?? [];
    },
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      if (!navigator.onLine) {
        const cached = await getCachedMessages(conversationId!);
        return cached as unknown as MessageRow[];
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;

      // Cache for offline use
      if (data && conversationId) {
        cacheMessagesFromServer(conversationId, data).catch(console.error);
      }

      return (data ?? []) as MessageRow[];
    },
  });
}
```

---

### PATCH 3: `src/hooks/use-agents.ts` — Add offline fallback

Replace the entire file with:

```ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { cacheAgentsFromServer, getCachedAgents } from "@/hooks/use-offline";

export type AgentRow = Tables<"agents">;

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      if (!navigator.onLine) {
        const cached = await getCachedAgents();
        return cached as unknown as AgentRow[];
      }

      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("team")
        .order("name");
      if (error) throw error;

      if (data) {
        cacheAgentsFromServer(data).catch(console.error);
      }

      return data as AgentRow[];
    },
  });
}

export function useAgent(id: string | undefined) {
  return useQuery({
    queryKey: ["agents", id],
    enabled: !!id,
    queryFn: async () => {
      if (!navigator.onLine) {
        const cached = await getCachedAgents();
        const agent = cached.find((a) => a.id === id);
        return agent as unknown as AgentRow;
      }

      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as AgentRow;
    },
  });
}
```

---

### PATCH 4: `src/components/views/ChatView.tsx` — Offline message queueing

In the `handleSend` function, find this block (around line 480-498):

```ts
let conversationId = activeConversation?.id;
if (!conversationId) {
  const { data: newConv, error: convErr } = await supabase
    .from("conversations")
    .insert({ agent_id: activeAgent.id, profile_id: user.id, title: message.slice(0, 60) || "File attachment", project_id: selectedProject?.id ?? null })
    .select("id").single();
  if (convErr) throw convErr;
  conversationId = newConv.id;
  queryClient.invalidateQueries({ queryKey: ["conversations"] });
}

await supabase.from("messages").insert({
  conversation_id: conversationId, role: "user" as const, content: message.trim(),
  attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
  mention_agent_id: mentionedAgent?.id ?? null,
});
```

Replace with:

```ts
import { createConversationOffline, createMessageOffline } from "@/hooks/use-offline";

// ... inside handleSend:

let conversationId = activeConversation?.id;

if (!navigator.onLine) {
  // OFFLINE PATH: queue locally
  if (!conversationId) {
    conversationId = await createConversationOffline({
      agentId: activeAgent.id,
      profileId: user.id,
      title: message.slice(0, 60) || "File attachment",
      projectId: selectedProject?.id ?? undefined,
    });
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }

  await createMessageOffline({
    conversationId,
    role: "user",
    content: message.trim(),
    mentionAgentId: mentionedAgent?.id,
    attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
  });

  const userMsg = message.trim();
  setMessage(""); setAttachedFiles([]);
  localStorage.removeItem(`draft_${activeAgent.id}`);
  queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });

  toast.info("You're offline. Message saved and will sync when you're back online.");
  setSending(false);
  return; // Skip LLM call when offline
} else {
  // ONLINE PATH: original Supabase logic
  if (!conversationId) {
    const { data: newConv, error: convErr } = await supabase
      .from("conversations")
      .insert({ agent_id: activeAgent.id, profile_id: user.id, title: message.slice(0, 60) || "File attachment", project_id: selectedProject?.id ?? null })
      .select("id").single();
    if (convErr) throw convErr;
    conversationId = newConv.id;
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId, role: "user" as const, content: message.trim(),
    attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
    mention_agent_id: mentionedAgent?.id ?? null,
  });
}
```

---

### PATCH 5: `src/components/layout/AppShell.tsx` — Add offline status indicator

Add this import at the top:

```ts
import { useOfflineSync } from "@/hooks/use-offline";
```

Inside the `AppShell` function, add:

```ts
const { isOnline, pendingCount, syncing, triggerSync } = useOfflineSync();
```

Then pass these as props to `AppHeader`:

```tsx
<AppHeader
  activeView={activeView}
  isOnline={isOnline}
  pendingCount={pendingCount}
  syncing={syncing}
  onSync={triggerSync}
/>
```

In `AppHeader.tsx`, add an offline indicator to the header bar:

```tsx
{/* Add after existing header content */}
{!isOnline && (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
    Offline {pendingCount > 0 && `(${pendingCount} pending)`}
  </div>
)}
{isOnline && pendingCount > 0 && (
  <button
    onClick={onSync}
    disabled={syncing}
    className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors"
  >
    {syncing ? "Syncing..." : `Sync ${pendingCount} items`}
  </button>
)}
```

---

## Testing Checklist

1. ✅ Go online → Send messages → Conversations and messages cached in IndexedDB
2. ✅ Go offline (DevTools → Network → Offline) → App still loads, conversations visible
3. ✅ Type a message offline → Message appears locally with toast notification
4. ✅ Go back online → Queued messages auto-sync to Supabase
5. ✅ Refresh page after sync → Messages persist with server IDs
6. ✅ Header shows "Offline" indicator when disconnected
