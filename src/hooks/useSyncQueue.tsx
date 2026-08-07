import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { processQueue, getQueueLength } from "@/lib/syncQueue";
import { useToast } from "@/hooks/use-toast";

interface SyncContextType {
  pendingCount: number;
  isOnline: boolean;
  syncing: boolean;
}

const SyncContext = createContext<SyncContextType>({ pendingCount: 0, isOnline: true, syncing: false });

export function SyncProvider({ children }: { children: ReactNode }) {
  const [pendingCount, setPendingCount] = useState(getQueueLength());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const runSync = async () => {
    if (!navigator.onLine) return;
    setSyncing(true);
    const { processed } = await processQueue();
    setSyncing(false);
    setPendingCount(getQueueLength());
    if (processed > 0) {
      toast({ title: "Synced", description: `${processed} offline action${processed === 1 ? "" : "s"} sent.` });
    }
    // Tell every data hook to refetch, so stale cached reads get replaced
    // with the current shared state now that we're back online
    window.dispatchEvent(new CustomEvent("knot-sync-complete"));
  };

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); runSync(); };
    const handleOffline = () => setIsOnline(false);
    const handleQueueChanged = () => setPendingCount(getQueueLength());

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("knot-queue-changed", handleQueueChanged);

    if (navigator.onLine) runSync(); // catch up on anything queued from a previous session

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("knot-queue-changed", handleQueueChanged);
    };
  }, []);

  return <SyncContext.Provider value={{ pendingCount, isOnline, syncing }}>{children}</SyncContext.Provider>;
}

export function useSyncStatus() {
  return useContext(SyncContext);
}