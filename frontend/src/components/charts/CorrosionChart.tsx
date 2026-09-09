"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingDown, AlertTriangle } from "lucide-react";

interface CorrosionChartProps {
  data: Array<{ year: string; thickness: number; mawt: number }>;
  title?: string;
  description?: string;
  threshold?: number;
}

export function CorrosionChart({
  data,
  title = "Wall Thickness Degradation Curve vs MAWT Limit",
  description = "Historical ultrasonic thickness measurements and linear degradation projection.",
  threshold = 6.5,
}: CorrosionChartProps) {
  return (
    <Card className="my-4 p-4 sm:p-5 bg-surface-card border-border-medium shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-accent" />
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
          <Badge variant="danger" size="sm">
            MAWT Limit: {threshold} mm
          </Badge>
          <Badge variant="warning" size="sm">
            Breach: Q4 2027
          </Badge>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#222227" />
            <XAxis
              dataKey="year"
              stroke="#71717A"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#71717A"
              fontSize={11}
              domain={[4, 16]}
              unit="mm"
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
              formatter={(value: any, name: string) => [
                `${value} mm`,
                name === "thickness" ? "Measured Thickness" : "MAWT Retirement Limit",
              ]}
            />
            <ReferenceLine
              y={threshold}
              label={{
                value: "API 570 MAWT (6.5 mm)",
                fill: "#EF4444",
                fontSize: 10,
                position: "insideBottomRight",
              }}
              stroke="#EF4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="thickness"
              stroke="#FF6A00"
              strokeWidth={2.5}
              dot={{ fill: "#FF6A00", r: 4 }}
              activeDot={{ r: 6, fill: "#FF8533", stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-primary-muted">
        <div className="flex items-center gap-1.5 text-status-danger">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Calculated Corrosion Rate: 0.82 mm/year (ASTM A335 Grade P22)</span>
        </div>
        <span>Standard: API 570 Section 7.1</span>
      </div>
    </Card>
  );
}
