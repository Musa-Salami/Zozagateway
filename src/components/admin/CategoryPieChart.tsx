"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatPrice } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#F97316", // brand orange
  "#3B82F6", // blue
  "#10B981", // emerald
  "#8B5CF6", // purple
  "#F43F5E", // rose
  "#F59E0B", // amber
  "#06B6D4", // cyan
  "#EC4899", // pink
  "#6366F1", // indigo
  "#84CC16", // lime
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
}) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-xl">
      <p className="text-sm font-medium">{entry.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatPrice(entry.value)} ({(entry.payload.percent * 100).toFixed(1)}%)
      </p>
    </div>
  );
}

function CustomLegend({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>;
}) {
  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "10%" }}>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatPrice(total)}</p>
              <p className="text-xs text-muted-foreground">Total Sales</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
