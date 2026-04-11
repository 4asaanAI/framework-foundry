/**
 * Offline detection, caching, and sync — Task 4
 */
import {
  cacheConversation, cacheMessage, cacheAgent,
  getCachedConversations, getCachedMessages, getCachedAgents,
  getQueuedItems, removeQueuedItem, setLastSync,
  queueMessage as idbQueueMessage,
  type QueuedItem,
} from "./indexeddb";
import { supabase } from "@/integrations/supabase/client";

export type OfflineStatus = "online" | "offline" | "syncing";

let currentStatus: OfflineStatus = navigator.onLine ? "online" : "offline";
const onlineCallbacks: (() => void)[] = [];
const offlineCallbacks: (() => void)[] = [];

// ─── Detection ───

export function isOnline(): boolean {
  return navigator.onLine;
}

export function getOfflineStatus(): OfflineStatus {
  return currentStatus;
}

export function onOnline(callback: () => void): () => void {
  onlineCallbacks.push(callback);
  return () => {
    const idx = onlineCallbacks.indexOf(callback);
    if (idx > -1) onlineCallbacks.splice(idx, 1);
  };
}

export function onOffline(callback: () => void): () => void {
  offlineCallbacks.push(callback);
  return () => {
    const idx = offlineCallbacks.indexOf(callback);
    if (idx > -1) offlineCallbacks.splice(idx, 1);
  };
}

// ─── Caching ───

export { cacheConversation, cacheMessage, cacheAgent };
export { getCachedConversations, getCachedMessages, getCachedAgents };

// ─── Queueing ───

export async function queueMessage(message: any): Promise<void> {
  await idbQueueMessage(message);
}

// ─── Syncing ───

export async function syncOnlineWhenReady(): Promise<{ synced: number; failed: number; errors: Error[] }> {
  if (!navigator.onLine) return { synced: 0, failed: 0, errors: [] };

  currentStatus = "syncing";
  const items = await getQueuedItems();
  let synced = 0;
  let failed = 0;
  const errors: Error[] = [];

  for (const item of items) {
    try {
      await syncItem(item);
      if (item.id != null) await removeQueuedItem(item.id);
      synced++;
    } catch (e: any) {
      failed++;
      errors.push(e);
    }
  }

  await setLastSync();
  currentStatus = "online";
  return { synced, failed, errors };
}

async function syncItem(item: QueuedItem): Promise<void> {
  switch (item.type) {
    case "message": {
      const { error } = await supabase.from("messages").insert(item.payload);
      if (error) throw new Error(`Failed to sync message: ${error.message}`);
      break;
    }
    case "memory": {
      // Sage Memory Intelligence: dedup check on offline sync
      const payload = item.payload as any;
      if (payload.agent_id && payload.content) {
        const { data: existing } = await supabase.from("agent_memories")
          .select("id, content, confidence")
          .eq("agent_id", payload.agent_id).eq("is_compressed", false);
        const newTokens = new Set(String(payload.content).toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" "));
        const dup = (existing ?? []).find((e: any) => {
          const oldTokens = new Set(String(e.content).toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" "));
          let overlap = 0; for (const t of newTokens) { if (oldTokens.has(t)) overlap++; }
          return (2 * overlap) / (newTokens.size + oldTokens.size) > 0.8;
        });
        if (dup) {
          // Merge instead of insert
          await supabase.from("agent_memories")
            .update({ confidence: Math.min(1, Number(dup.confidence) + 0.05), last_refreshed_at: new Date().toISOString() })
            .eq("id", dup.id);
          break;
        }
      }
      const { error } = await supabase.from("agent_memories").insert(payload);
      if (error) throw new Error(`Failed to sync memory: ${error.message}`);
      break;
    }
    case "task": {
      // Conflict detection: check if task was modified by someone else while offline
      const taskPayload = item.payload as any;
      if (taskPayload.id) {
        const { data: serverVersion } = await supabase.from("tasks")
          .select("updated_at").eq("id", taskPayload.id).single();
        if (serverVersion && taskPayload._offline_timestamp) {
          const serverTime = new Date(serverVersion.updated_at).getTime();
          const offlineTime = new Date(taskPayload._offline_timestamp).getTime();
          if (serverTime > offlineTime) {
            // Conflict: server was modified after we went offline
            addOfflineConflict({
              type: "task",
              id: taskPayload.id,
              localData: taskPayload,
              serverTimestamp: serverVersion.updated_at,
              localTimestamp: taskPayload._offline_timestamp,
            });
            break; // Don't overwrite — let user resolve
          }
        }
        delete taskPayload._offline_timestamp;
        const { error } = await supabase.from("tasks").upsert(taskPayload, { onConflict: "id" });
        if (error) throw new Error(`Failed to sync task: ${error.message}`);
      } else {
        const { error } = await supabase.from("tasks").insert(item.payload);
        if (error) throw new Error(`Failed to sync task: ${error.message}`);
      }
      break;
    }
    default:
      console.warn(`Unknown queue item type: ${item.type}`);
  }
}

// ─── Offline Conflict Management ────────────────────────────────────────────

export interface OfflineConflict {
  type: string;
  id: string;
  localData: any;
  serverTimestamp: string;
  localTimestamp: string;
}

const CONFLICTS_KEY = "layaa_offline_conflicts";

function addOfflineConflict(conflict: OfflineConflict): void {
  const existing = getOfflineConflicts();
  existing.push(conflict);
  localStorage.setItem(CONFLICTS_KEY, JSON.stringify(existing));
}

export function getOfflineConflicts(): OfflineConflict[] {
  try { return JSON.parse(localStorage.getItem(CONFLICTS_KEY) || "[]"); }
  catch { return []; }
}

export function resolveOfflineConflict(id: string, keepLocal: boolean): void {
  const conflicts = getOfflineConflicts();
  const conflict = conflicts.find(c => c.id === id);
  if (conflict && keepLocal) {
    // Overwrite server with local data
    (supabase.from as any)(conflict.type + "s").upsert(conflict.localData, { onConflict: "id" });
  }
  // Remove from conflicts list either way
  localStorage.setItem(CONFLICTS_KEY, JSON.stringify(conflicts.filter(c => c.id !== id)));
}

export function clearOfflineConflicts(): void {
  localStorage.setItem(CONFLICTS_KEY, "[]");
}

export async function forceSyncNow(): Promise<{ synced: number; failed: number }> {
  const result = await syncOnlineWhenReady();
  return { synced: result.synced, failed: result.failed };
}

// ─── Initialization ───

export async function initializeOfflineSystem(): Promise<void> {
  // Set up event listeners
  window.addEventListener("online", () => {
    currentStatus = "online";
    onlineCallbacks.forEach(cb => cb());
    // Auto-sync when back online
    syncOnlineWhenReady().then(result => {
      if (result.synced > 0) {
        console.log(`[Offline] Synced ${result.synced} items`);
      }
      if (result.failed > 0) {
        console.warn(`[Offline] Failed to sync ${result.failed} items`);
      }
    });
  });

  window.addEventListener("offline", () => {
    currentStatus = "offline";
    offlineCallbacks.forEach(cb => cb());
  });

  // Cache current data on init
  if (navigator.onLine) {
    try {
      const { data: agents } = await supabase.from("agents").select("*");
      if (agents) for (const a of agents) await cacheAgent(a);
    } catch (e) {
      console.warn("[Offline] Failed to cache agents:", e);
    }

    // Sync any pending queue items
    const pending = await getQueuedItems();
    if (pending.length > 0) {
      console.log(`[Offline] Found ${pending.length} queued items, syncing...`);
      await syncOnlineWhenReady();
    }
  }
}
