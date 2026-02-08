"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatPrice } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopProductsChartProps {
  data: { name: string; revenue: number; quantity: number }[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { quantity: number } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-xl">
      <p className="mb-1 text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">
        Revenue: {formatPrice(payload[0].value)}
      </p>
      <p className="text-sm text-muted-foreground">
        Quantity: {payload[0].payload.quantity} sold
      </p>
    </div>
  );
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  // Sort by revenue descending and take top 10
  const sortedData = [...data]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Truncate long names
  const chartData = sortedData.map((item) => ({
    ...item,
    name: item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Top Products by Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(val: number) =>
                  val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                width={130}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
              <Bar
                dataKey="revenue"
                fill="#F97316"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
