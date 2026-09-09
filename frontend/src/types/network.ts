export interface SocketConnection {
  id: string;
  protocol: "TCP" | "UDP" | "UNIX";
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: "LISTEN" | "ESTABLISHED" | "BLOCKED";
  processName: string;
  pid: number;
  isExternal: boolean;
  isBlocked: boolean;
}

export interface NetworkSentinelStats {
  airGapStatus: "VERIFIED_AIRGAP" | "DEGRADED" | "BREACH_DETECTED";
  totalSockets: number;
  externalSockets: number;
  blockedOutboundAttempts: number;
  outboundBytesTotal: number;
  inboundBytesTotal: number;
  lastChecked: string;
  hardwareInterface: string;
}
