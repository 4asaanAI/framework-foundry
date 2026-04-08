/**
 * Offline hook — Task 4
 */
import { useState, useEffect } from "react";
import { getOfflineStatus, onOnline, onOffline, forceSyncNow, type OfflineStatus } from "@/lib/offline";
import { getQueueCount } from "@/lib/indexeddb";

export function useOffline() {
  const [status, setStatus] = useState<OfflineStatus>(getOfflineStatus());
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const unsubOnline = onOnline(() => {
      setStatus("online");
      getQueueCount().then(setQueueCount);
    });
    const unsubOffline = onOffline(() => {
      setStatus("offline");
      getQueueCount().then(setQueueCount);
    });

    // Initial count
    getQueueCount().then(setQueueCount);

    return () => { unsubOnline(); unsubOffline(); };
  }, []);

  return {
    status,
    isOnline: status === "online",
    isOffline: status === "offline",
    isSyncing: status === "syncing",
    queueCount,
    syncNow: async () => {
      setStatus("syncing");
      const result = await forceSyncNow();
      setStatus("online");
      setQueueCount(0);
      return result;
    },
  };
}
