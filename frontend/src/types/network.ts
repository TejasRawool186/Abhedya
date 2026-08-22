export interface NetworkStatus {
  externalConnections: number;
  airGapActive: boolean;
  timestamp: string;
  blockedAttempts?: number;
  secureMode?: boolean;
}
