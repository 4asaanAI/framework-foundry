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
      const { error } = await supabase.from("agent_memories").insert(item.payload);
      if (error) throw new Error(`Failed to sync memory: ${error.message}`);
      break;
    }
    case "task": {
      const { error } = await supabase.from("tasks").insert(item.payload);
      if (error) throw new Error(`Failed to sync task: ${error.message}`);
      break;
    }
    default:
      console.warn(`Unknown queue item type: ${item.type}`);
  }
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
