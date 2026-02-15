"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  ShoppingBag,
  TrendingUp,
  Percent,
  Download,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TopProductsChart } from "@/components/admin/TopProductsChart";
import { CategoryPieChart } from "@/components/admin/CategoryPieChart";
import { cn } from "@/lib/utils";
import { formatPrice, formatNumber, formatPercentage } from "@/lib/formatters";
import type { SalesData, TopProduct } from "@/types";

// ── Demo Data ──────────────────────────────────────────────────────────────

const generate30DayData = (): SalesData[] =>
  Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.floor(Math.random() * 1200 + 300),
      orders: Math.floor(Math.random() * 40 + 8),
    };
  });

const revenueData = generate30DayData();

const topProducts: TopProduct[] = [
  { name: "Spicy Plantain Chips", revenue: 2840, quantity: 335 },
  { name: "Coconut Cookies", revenue: 2260, quantity: 301 },
  { name: "Chin Chin Original", revenue: 1920, quantity: 320 },
  { name: "Puff Puff Mix", revenue: 1650, quantity: 275 },
  { name: "Garlic Roasted Nuts", revenue: 1480, quantity: 164 },
  { name: "Honey Cashew Brittle", revenue: 1320, quantity: 120 },
  { name: "Caramel Popcorn", revenue: 1100, quantity: 200 },
  { name: "Tropical Trail Mix", revenue: 980, quantity: 75 },
];

const categoryData = [
  { name: "Chips & Crisps", value: 4800 },
  { name: "Cookies & Biscuits", value: 3900 },
  { name: "Pastries & Pies", value: 3400 },
  { name: "Nuts & Trail Mix", value: 2800 },
  { name: "Candy & Sweets", value: 2200 },
  { name: "Popcorn", value: 1700 },
  { name: "Healthy Snacks", value: 1400 },
  { name: "Beverages", value: 1100 },
];

// Hourly orders heatmap data (24h x 7 days)
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);
const hourlyData: number[][] = daysOfWeek.map(() =>
  hours.map((h) => {
    // Simulate peak hours pattern
    if (h < 6) return Math.floor(Math.random() * 2);
    if (h < 9) return Math.floor(Math.random() * 5 + 2);
    if (h < 12) return Math.floor(Math.random() * 10 + 5);
    if (h < 14) return Math.floor(Math.random() * 15 + 8);
    if (h < 17) return Math.floor(Math.random() * 8 + 3);
    if (h < 20) return Math.floor(Math.random() * 12 + 6);
    if (h < 22) return Math.floor(Math.random() * 8 + 3);
    return Math.floor(Math.random() * 3);
  })
);

const maxHourly = Math.max(...hourlyData.flat());

// ── Date Range Presets ───────────────────────────────────────────────────────

const datePresets = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "Custom", value: "custom" },
];

// ── Key Metrics ──────────────────────────────────────────────────────────────

const grossRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);
const netRevenue = Math.round(grossRevenue * 0.88);
const avgOrderValue = Math.round((grossRevenue / totalOrders) * 100) / 100;

const metrics = [
  { title: "Gross Revenue", value: formatPrice(grossRevenue), change: 12.5, icon: Banknote, color: "text-brand-500 bg-brand-500/10" },
  { title: "Net Revenue", value: formatPrice(netRevenue), change: 10.2, icon: Banknote, color: "text-emerald-500 bg-emerald-500/10" },
  { title: "Avg Order Value", value: formatPrice(avgOrderValue), change: 3.8, icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
  { title: "Total Orders", value: formatNumber(totalOrders), change: 15.1, icon: ShoppingBag, color: "text-purple-500 bg-purple-500/10" },
  { title: "Conversion Rate", value: "3.2%", change: 0.5, icon: Percent, color: "text-rose-500 bg-rose-500/10" },
];

// ── Page Component ──────────────────────────────────────────────────────────

export default function SalesPage() {
  const [dateRange, setDateRange] = useState("30d");

  const getHeatColor = (value: number) => {
    const intensity = value / maxHourly;
    if (intensity === 0) return "bg-muted";
    if (intensity < 0.2) return "bg-brand-500/10";
    if (intensity < 0.4) return "bg-brand-500/25";
    if (intensity < 0.6) return "bg-brand-500/40";
    if (intensity < 0.8) return "bg-brand-500/60";
    return "bg-brand-500/80";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track your store&apos;s performance and revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1 w-fit">
        {datePresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setDateRange(preset.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              dateRange === preset.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", metric.color)}>
                  <metric.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2">
                <span className={cn(
                  "text-xs font-semibold",
                  metric.change >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {formatPercentage(metric.change)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart (Large) */}
      <RevenueChart data={revenueData} />

      {/* Two-column: Top Products + Category Pie */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsChart data={topProducts} />
        <CategoryPieChart data={categoryData} />
      </div>

      {/* Orders by Hour Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Orders by Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Hour Labels */}
              <div className="flex items-center">
                <div className="w-12 shrink-0" />
                <div className="flex flex-1">
                  {hours
                    .filter((h) => h % 3 === 0)
                    .map((h) => (
                      <div
                        key={h}
                        className="flex-1 text-center text-xs text-muted-foreground"
                        style={{ minWidth: `${100 / 8}%` }}
                      >
                        {h.toString().padStart(2, "0")}:00
                      </div>
                    ))}
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="mt-1 space-y-1">
                {daysOfWeek.map((day, dayIdx) => (
                  <div key={day} className="flex items-center gap-1">
                    <div className="w-12 shrink-0 text-xs font-medium text-muted-foreground">
                      {day}
                    </div>
                    <div className="flex flex-1 gap-0.5">
                      {hours.map((h) => (
                        <div
                          key={h}
                          className={cn(
                            "aspect-square flex-1 rounded-sm transition-colors",
                            getHeatColor(hourlyData[dayIdx][h])
                          )}
                          title={`${day} ${h.toString().padStart(2, "0")}:00 — ${hourlyData[dayIdx][h]} orders`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex gap-0.5">
                  {["bg-muted", "bg-brand-500/10", "bg-brand-500/25", "bg-brand-500/40", "bg-brand-500/60", "bg-brand-500/80"].map((color) => (
                    <div key={color} className={cn("h-3 w-3 rounded-sm", color)} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
