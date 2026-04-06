# Task 4: n8n Webhook Stubs + Split-Screen Agent Delegation — Patches

## Files to CREATE (copy as-is):
1. `src/lib/webhooks.ts` ← from `TASK4-webhooks.ts`
2. `src/lib/delegation.ts` ← from `TASK4-delegation.ts`
3. `src/components/views/SplitScreenView.tsx` ← from `TASK4-SplitScreenView.tsx`

## Files to PATCH:

---

### PATCH 1: `src/components/layout/AppShell.tsx` — Add split-screen state + layout

Add these imports at the top:

```ts
import { SplitScreenView } from "@/components/views/SplitScreenView";
import { useLLMConfig } from "@/hooks/use-llm";
```

Inside the `AppShell` function, add this state:

```ts
const [splitScreen, setSplitScreen] = useState<{
  mainConversationId: string;
  delegatedConversationId: string;
  delegatingAgentName: string;
  delegatedAgentId: string;
} | null>(null);
const { config: llmConfig } = useLLMConfig();
```

Add callback to pass to ChatView:

```ts
const handleDelegation = (params: {
  mainConversationId: string;
  delegatedConversationId: string;
  delegatingAgentName: string;
  delegatedAgentId: string;
}) => {
  setSplitScreen(params);
};
```

Modify the renderView to pass delegation handler:

```tsx
case "chat": return <ChatView selectedAgentId={selectedAgentId} onDelegation={handleDelegation} />;
```

Modify the layout JSX to include split-screen panel. Replace the main content area with:

```tsx
<div className="flex flex-1 overflow-hidden">
  <div className={cn("flex-1 min-w-0", splitScreen && "w-1/2")}>
    {renderView()}
  </div>
  {splitScreen && (
    <div className="w-1/2 min-w-0">
      <SplitScreenView
        mainConversationId={splitScreen.mainConversationId}
        delegatedConversationId={splitScreen.delegatedConversationId}
        delegatingAgentName={splitScreen.delegatingAgentName}
        delegatedAgentId={splitScreen.delegatedAgentId}
        onClose={() => setSplitScreen(null)}
        model={llmConfig?.model ?? "google/gemini-3-flash-preview"}
        provider={llmConfig?.provider ?? "lovable"}
        apiKey={llmConfig?.apiKey ?? ""}
      />
    </div>
  )}
</div>
```

---

### PATCH 2: `src/components/views/ChatView.tsx` — Add delegation detection + trigger

**a) Add imports at the top:**

```ts
import { detectDelegation, executeDelegation, synthesizeDelegationResponse, setAgentNameMap } from "@/lib/delegation";
import { onMessageSent } from "@/lib/webhooks";
```

**b) Add `onDelegation` to the props interface:**

```ts
interface ChatViewProps {
  selectedAgentId?: string | null;
  onDelegation?: (params: {
    mainConversationId: string;
    delegatedConversationId: string;
    delegatingAgentName: string;
    delegatedAgentId: string;
  }) => void;
}
```

**c) Initialize the agent name map when agents load.** Add this `useEffect` near other effects:

```ts
useEffect(() => {
  if (agents.length > 0) {
    setAgentNameMap(agents.map((a) => ({ id: a.id, name: a.name })));
  }
}, [agents]);
```

**d) Add delegation detection inside `handleSend`, right after the user message is saved to Supabase and before the LLM streaming call.** Find this section (after the user message insert, around line 496-500):

```ts
const userMsg = message.trim();
setMessage(""); setAttachedFiles([]);
localStorage.removeItem(`draft_${activeAgent.id}`);
queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
```

Add RIGHT AFTER this block:

```ts
// ─── Delegation detection ───
const delegation = detectDelegation(userMsg, activeAgent.name);
if (delegation.shouldDelegate && delegation.targetAgentId && conversationId) {
  // Get recent conversation history for context
  const recentMessages = (messages ?? []).slice(-5).map((m) => 
    `${m.role === "user" ? "User" : activeAgent.name}: ${m.content.slice(0, 200)}`
  );

  try {
    const result = await executeDelegation({
      userId: user.id,
      mainConversationId: conversationId,
      delegatingAgentId: activeAgent.id,
      delegatingAgentName: activeAgent.name,
      targetAgentId: delegation.targetAgentId,
      targetAgentName: delegation.targetAgentName!,
      userMessage: userMsg,
      conversationHistory: recentMessages,
      task: delegation.task ?? userMsg,
      reason: delegation.reason as "explicit_request" | "auto_detected",
      model: activeAgent.default_model || "google/gemini-3-flash-preview",
      provider: activeAgent.llm_provider || "lovable",
      apiKey: "", // Uses default provider
    });

    // Open split-screen
    if (onDelegation) {
      onDelegation({
        mainConversationId: conversationId,
        delegatedConversationId: result.delegatedConversationId,
        delegatingAgentName: activeAgent.name,
        delegatedAgentId: delegation.targetAgentId,
      });
    }

    // Show delegation status in main chat
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "agent" as const,
      content: `Consulting ${delegation.targetAgentName} for specialized input...`,
      model: activeAgent.default_model || "google/gemini-3-flash-preview",
    });
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });

    // Synthesize final answer incorporating delegated response
    const finalAnswer = await synthesizeDelegationResponse({
      delegatingAgentName: activeAgent.name,
      targetAgentName: delegation.targetAgentName!,
      userMessage: userMsg,
      delegatedResponse: result.delegatedResponse,
      model: activeAgent.default_model || "google/gemini-3-flash-preview",
      provider: activeAgent.llm_provider || "lovable",
      apiKey: "",
    });

    // Save final synthesized answer
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "agent" as const,
      content: finalAnswer,
      model: activeAgent.default_model || "google/gemini-3-flash-preview",
    });
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });

    setSending(false);
    return; // Skip normal LLM call since we delegated
  } catch (err) {
    console.error("Delegation failed, falling back to normal response:", err);
    // Fall through to normal LLM call
  }
}
// ─── End delegation detection ───
```

**e) Add webhook call after agent response.** Find the `sage-extract` call (around line 308-311):

```ts
supabase.functions.invoke("sage-extract", {
  body: { conversation_id: conversationId, message_content: fullContent, agent_id: activeAgent.id },
}).catch(() => {});
```

Add RIGHT AFTER it:

```ts
// Fire webhook for n8n (fire-and-forget)
onMessageSent({
  agentId: activeAgent.id,
  conversationId: conversationId!,
  messageContent: fullContent,
  userId: user.id,
}).catch(() => {});
```

---

### PATCH 3: `src/components/layout/AppSidebar.tsx` — No changes needed

The sidebar navigation doesn't need a new item for split-screen since it's triggered contextually from chat, not via navigation.

---

## Environment Variables (Optional)

When n8n is connected later, add to `.env`:

```
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook
```

Until then, all webhook functions log to console and return `{ success: true, stub: true }`.

---

## Testing Checklist

1. ✅ Send a message containing "@Mira" → Split-screen opens showing delegation conversation
2. ✅ Send "What's our marketing strategy?" → Auto-detects and delegates to Mira
3. ✅ In split-screen, type a follow-up → Mira responds in the right panel
4. ✅ Close split-screen → Main chat shows synthesized answer with footnote
5. ✅ Check browser console → Webhook stubs log payloads correctly
6. ✅ Delegated conversation appears in Mira's conversation history
7. ✅ Normal messages (no delegation keywords) → No split-screen, normal LLM flow
