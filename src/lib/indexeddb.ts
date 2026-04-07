/**
 * IndexedDB operations for offline storage — Task 4
 */

const DB_NAME = "layaa_offline";
const DB_VERSION = 1;

const STORES = {
  conversations: "conversations",
  messages: "messages",
  agents: "agents",
  settings: "settings",
  offline_queue: "offline_queue",
  cache_metadata: "cache_metadata",
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.conversations)) db.createObjectStore(STORES.conversations, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORES.messages)) {
        const store = db.createObjectStore(STORES.messages, { keyPath: "id" });
        store.createIndex("conversation_id", "conversation_id", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.agents)) db.createObjectStore(STORES.agents, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORES.settings)) db.createObjectStore(STORES.settings, { keyPath: "key" });
      if (!db.objectStoreNames.contains(STORES.offline_queue)) {
        const store = db.createObjectStore(STORES.offline_queue, { keyPath: "id", autoIncrement: true });
        store.createIndex("type", "type", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.cache_metadata)) db.createObjectStore(STORES.cache_metadata, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putItem(storeName: string, item: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(item);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function getItem<T>(storeName: string, key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const request = tx.objectStore(storeName).get(key);
    request.onsuccess = () => { db.close(); resolve(request.result); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

async function getAllItems<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => { db.close(); resolve(request.result); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

async function getItemsByIndex<T>(storeName: string, indexName: string, key: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const index = tx.objectStore(storeName).index(indexName);
    const request = index.getAll(key);
    request.onsuccess = () => { db.close(); resolve(request.result); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

async function deleteItem(storeName: string, key: string | number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

// ─── Public API ───

export async function cacheConversation(conversation: any): Promise<void> {
  await putItem(STORES.conversations, conversation);
}

export async function cacheMessage(message: any): Promise<void> {
  await putItem(STORES.messages, message);
}

export async function cacheAgent(agent: any): Promise<void> {
  await putItem(STORES.agents, agent);
}

export async function cacheSetting(key: string, value: string): Promise<void> {
  await putItem(STORES.settings, { key, value });
}

export async function getCachedConversations(): Promise<any[]> {
  return getAllItems(STORES.conversations);
}

export async function getCachedMessages(conversationId: string): Promise<any[]> {
  return getItemsByIndex(STORES.messages, "conversation_id", conversationId);
}

export async function getCachedAgents(): Promise<any[]> {
  return getAllItems(STORES.agents);
}

export async function getCachedSetting(key: string): Promise<string | null> {
  const item = await getItem<{ key: string; value: string }>(STORES.settings, key);
  return item?.value ?? null;
}

// ─── Queue Operations ───

export interface QueuedItem {
  id?: number;
  type: "message" | "memory" | "approval" | "task";
  payload: any;
  createdAt: string;
}

export async function queueMessage(message: any): Promise<void> {
  await putItem(STORES.offline_queue, {
    type: "message", payload: message, createdAt: new Date().toISOString(),
  });
}

export async function queueMemory(memory: any): Promise<void> {
  await putItem(STORES.offline_queue, {
    type: "memory", payload: memory, createdAt: new Date().toISOString(),
  });
}

export async function getQueuedItems(): Promise<QueuedItem[]> {
  return getAllItems<QueuedItem>(STORES.offline_queue);
}

export async function getQueueCount(): Promise<number> {
  const items = await getQueuedItems();
  return items.length;
}

export async function removeQueuedItem(id: number): Promise<void> {
  await deleteItem(STORES.offline_queue, id);
}

export async function setLastSync(): Promise<void> {
  await putItem(STORES.cache_metadata, { key: "lastSync", value: new Date().toISOString() });
}

export async function getLastSync(): Promise<string | null> {
  const item = await getItem<{ key: string; value: string }>(STORES.cache_metadata, "lastSync");
  return item?.value ?? null;
}
