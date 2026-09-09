"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, AlertCircle } from "lucide-react";
import { VibrationDataPoint } from "@/mocks/mockVibrationData";

interface VibrationFFTChartProps {
  data: VibrationDataPoint[];
  title?: string;
  description?: string;
  threshold?: number;
}

export function VibrationFFTChart({
  data,
  title = "Vibration FFT Spectral Frequency Distribution",
  description = "Fast Fourier Transform amplitude spectrum highlighting mechanical unbalance & bearing defect peaks.",
  threshold = 2.8,
}: VibrationFFTChartProps) {
  return (
    <Card className="my-4 p-4 sm:p-5 bg-surface-card border-border-medium shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-status-warning" />
            <h4 className="text-xs sm:text-sm font-bold text-primary font-mono">
              {title}
            </h4>
          </div>
          {description && (
            <p className="text-[11px] text-primary-secondary mt-0.5">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="warning" size="sm">
            ISO 10816 Limit: {threshold} mm/s
          </Badge>
          <Badge variant="danger" size="sm">
            Peak: 5.12 mm/s (BPFO)
          </Badge>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAmplitude" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF6A00" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222227" />
            <XAxis
              dataKey="frequencyHz"
              stroke="#71717A"
              fontSize={11}
              unit="Hz"
              tickLine={false}
            />
            <YAxis
              stroke="#71717A"
              fontSize={11}
              domain={[0, 6]}
              unit="mm/s"
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#16161B",
                borderColor: "#2D2D35",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#F4F4F5",
              }}
              formatter={(value: any, name: string, item: any) => [
                `${value} mm/s ${
                  item?.payload?.defectLabel ? `(${item.payload.defectLabel})` : ""
                }`,
                "Vibration Velocity",
              ]}
            />
            <ReferenceLine
              y={threshold}
              label={{
                value: "Alarm Threshold (2.8 mm/s)",
                fill: "#F59E0B",
                fontSize: 10,
                position: "insideBottomRight",
              }}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="amplitudeMmS"
              stroke="#FF6A00"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAmplitude)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-primary-muted">
        <div className="flex items-center gap-1.5 text-status-warning">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Severe Outer Race Defect Spike Detected at 148.5 Hz (BPFO)</span>
        </div>
        <span>Equipment: P-102B Crude Charge Pump</span>
      </div>
    </Card>
  );
}
