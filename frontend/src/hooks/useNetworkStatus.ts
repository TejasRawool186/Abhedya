import { useEffect, useCallback, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { getNetworkStatus } from "@/lib/api";

const DEFAULT_POLL_INTERVAL = 15000;

export interface UseNetworkStatusReturn {
  refresh: () => Promise<void>;
}

export function useNetworkStatus(
  pollInterval: number = DEFAULT_POLL_INTERVAL,
  autoPoll: boolean = true
): UseNetworkStatusReturn {
  const setNetworkStatus = useTaskStore((s) => s.setNetworkStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPollingRef = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const status = await getNetworkStatus();
      setNetworkStatus(status);
    } catch {
      // Silently fail - network status polling errors are non-critical
    }
  }, [setNetworkStatus]);

  useEffect(() => {
    refresh();

    if (!autoPoll) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    isPollingRef.current = true;
    intervalRef.current = setInterval(() => {
      refresh();
    }, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [refresh, pollInterval, autoPoll]);

  return {
    refresh,
  };
}
