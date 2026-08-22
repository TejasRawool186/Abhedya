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
    <Card className="overflow-hidden border-b border-border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center border",
                airGapActive
                  ? "bg-success/15 text-success border-success/30"
                  : "bg-danger/15 text-danger border-danger/30"
              )}
            >
              {airGapActive ? (
                <ShieldCheck size={16} strokeWidth={2} />
              ) : (
                <ShieldAlert size={16} strokeWidth={2} />
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Network Sentinel
              </CardTitle>
              <CardDescription>
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
            className="h-8 w-8 text-muted hover:text-foreground"
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
              "rounded-lg border p-3 flex flex-col gap-1",
              airGapActive
                ? "border-success/30 bg-success/5"
                : "border-danger/30 bg-danger/5"
            )}
          >
            <div className="flex items-center gap-1.5">
              {airGapActive ? (
                <WifiOff size={12} className="text-success" />
              ) : (
                <ShieldAlert size={12} className="text-danger" />
              )}
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Air-Gap
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={airGapActive ? "success" : "danger"}>
                {airGapActive ? "ACTIVE" : "BREACHED"}
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-panel-2/50 p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-accent" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                External
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  external === 0 ? "text-success" : "text-danger"
                )}
              >
                {external}
              </span>
              <span className="text-[10px] text-muted uppercase tracking-wide">
                connections
              </span>
            </div>
          </div>
        </div>

        {blocked > 0 && (
          <div className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-2.5 flex items-center gap-2">
            <Shield size={13} className="text-warning shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-warning">
                Blocked Attempts
              </div>
              <div className="text-xs text-foreground">
                <span className="font-semibold tabular-nums">{blocked}</span>{" "}
                outbound connection attempts blocked this session
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/60">
          <div className="flex gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  airGapActive
                    ? "bg-success/70"
                    : i < 2
                    ? "bg-danger"
                    : "bg-muted-2"
                )}
                style={{ width: 8 + i * 2 }}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted ml-auto">
            Secure perimeter mode{" "}
            <span className={cn(airGapActive ? "text-success" : "text-danger")}>
              {airGapActive ? "ON" : "OFF"}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
});
