import { useOffline } from "@/hooks/use-offline";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export function OfflineIndicator() {
  const { status, queueCount, syncNow, isOffline, isSyncing } = useOffline();

  if (status === "online" && queueCount === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-16 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium shadow-lg border",
      isOffline && "bg-destructive/10 border-destructive/30 text-destructive",
      isSyncing && "bg-info/10 border-info/30 text-info",
      !isOffline && !isSyncing && queueCount > 0 && "bg-warning/10 border-warning/30 text-warning",
    )}>
      {isOffline && <WifiOff className="h-3.5 w-3.5" />}
      {isSyncing && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
      {!isOffline && !isSyncing && <Wifi className="h-3.5 w-3.5" />}
      <span>
        {isOffline && `📵 Offline Mode${queueCount > 0 ? ` — ${queueCount} items queued` : ""}`}
        {isSyncing && "🔄 Syncing..."}
        {!isOffline && !isSyncing && queueCount > 0 && `⚠️ ${queueCount} items pending sync`}
      </span>
      {(isOffline || queueCount > 0) && !isSyncing && (
        <button onClick={syncNow} className="p-1 rounded hover:bg-background/50 transition-colors" title="Sync now">
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
