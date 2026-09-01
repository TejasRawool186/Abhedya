export interface NetworkStatus {
  externalConnections: number;
  airGapActive: boolean;
  timestamp: string;
  blockedAttempts?: number;
  secureMode?: boolean;
  is_airgapped?: boolean;
  egress_bytes?: number;
  active_enclave?: boolean;
  node_name?: string;
  latency_ms?: number;
}
