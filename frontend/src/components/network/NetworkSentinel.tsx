import { memo, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useTaskStore } from "@/store/useTaskStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, ShieldAlert, ShieldCheck, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, formatTimestamp } from "@/lib/utils";

export const NetworkSentinel = memo(function NetworkSentinel() {
  const network = useTaskStore((s) => s.network);
  const { refresh } = useNetworkStatus(15000, true);
  const [refreshing, setRefreshing] = useState(false);

  const airGapActive = network?.airGapActive ?? true;
  const external = network?.externalConnections ?? 0;
  const blocked = network?.blockedAttempts ?? 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setTimeout(() => setRefreshing(false), 400);
  };

  return (
    <Card className="rounded-none border-b border-[#242424] bg-[#121212] font-mono">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-none flex items-center justify-center border",
                airGapActive
                  ? "bg-[#181818] text-[#FF6A00] border-[#FF6A00]/40"
                  : "bg-[#181818] text-red-500 border-red-500/40"
              )}
            >
              {airGapActive ? (
                <ShieldCheck size={16} strokeWidth={2} />
              ) : (
                <ShieldAlert size={16} strokeWidth={2} />
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 font-mono uppercase tracking-wider text-xs font-bold text-[#F5F5F5]">
                Network Sentinel
              </CardTitle>
              <CardDescription className="text-[10px] text-zinc-400 font-mono uppercase mt-0.5">
                {network?.timestamp
                  ? `Updated ${formatTimestamp(network.timestamp)}`
                  : "Monitoring perimeter security"}
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            title="Refresh status"
            className="h-8 w-8 text-zinc-400 hover:text-zinc-100 rounded-none"
          >
            <RefreshCw
              size={14}
              className={cn(refreshing ? "animate-spin" : "")}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          <div
            className={cn(
              "rounded-none border p-3 flex flex-col gap-1",
              airGapActive
                ? "border-[#FF6A00]/30 bg-[#181818]"
                : "border-red-500/30 bg-[#181818]"
            )}
          >
            <div className="flex items-center gap-1.5">
              {airGapActive ? (
                <WifiOff size={12} className="text-[#FF6A00]" />
              ) : (
                <ShieldAlert size={12} className="text-red-500" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                Air-Gap
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={airGapActive ? "accent" : "danger"} className="rounded-none font-mono font-bold">
                {airGapActive ? "ACTIVE" : "BREACHED"}
              </Badge>
            </div>
          </div>

          <div className="rounded-none border border-[#242424] bg-[#181818] p-3 flex flex-col gap-1 font-mono">
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-[#FF6A00]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                External
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                className={cn(
                  "text-xl font-bold font-mono tabular-nums",
                  external === 0 ? "text-[#FF6A00]" : "text-red-500"
                )}
              >
                {external}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                conn
              </span>
            </div>
          </div>
        </div>

        {blocked > 0 && (
          <div className="mt-3 rounded-none border border-[#FF6A00]/40 bg-[#181818] p-2.5 flex items-center gap-2 font-mono">
            <Shield size={13} className="text-[#FF6A00] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A00]">
                Blocked Attempts
              </div>
              <div className="text-xs text-zinc-300 font-mono">
                <span className="font-bold tabular-nums">{blocked}</span>{" "}
                outbound connection attempts blocked this session
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#242424] font-mono">
          <div className="flex gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-none transition-all",
                  airGapActive
                    ? "bg-[#FF6A00]"
                    : i < 2
                    ? "bg-red-500"
                    : "bg-zinc-800"
                )}
                style={{ width: 8 + i * 2 }}
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400 ml-auto uppercase font-mono">
            Perimeter{" "}
            <span className={cn("font-bold", airGapActive ? "text-[#FF6A00]" : "text-red-500")}>
              {airGapActive ? "ON" : "OFF"}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

