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
import { useOrderStore } from "@/stores/orderStore";
import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";
import type { SalesData, TopProduct } from "@/types";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

const datePresets = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

export default function SalesPage() {
  const [dateRange, setDateRange] = useState("30d");
  const orders = useOrderStore((s) => s.orders);
  const hasHydrated = useOrderStore((s) => s._hasHydrated);
  const categories = useCategoryStore((s) => s.categories);

  const daysCount = useMemo(() => {
    if (dateRange === "today") return 1;
    if (dateRange === "7d") return 7;
    if (dateRange === "90d") return 90;
    return 30;
  }, [dateRange]);

  const filteredOrders = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysCount);
    return orders.filter((o) => new Date(o.createdAt) >= cutoff);
  }, [orders, daysCount]);

  const revenueData = useMemo(() => {
    const result: SalesData[] = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayOrders = orders.filter((o) => o.createdAt.slice(0, 10) === dayStr);
      result.push({
        date: dayLabel,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return result;
  }, [orders, daysCount]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; quantity: number }>();
    for (const order of filteredOrders) {
      for (const item of order.items) {
        const name = item.product?.name ?? item.productId;
        const existing = map.get(name);
        if (existing) {
          existing.revenue += item.totalPrice;
          existing.quantity += item.quantity;
        } else {
          map.set(name, { name, revenue: item.totalPrice, quantity: item.quantity });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [filteredOrders]);

  const categoryData = useMemo(() => {
    const catMap = new Map<string, number>();
    for (const order of filteredOrders) {
      for (const item of order.items) {
        const catId = item.product?.categoryId ?? "uncategorized";
        catMap.set(catId, (catMap.get(catId) ?? 0) + item.totalPrice);
      }
    }
    return Array.from(catMap.entries())
      .map(([catId, value]) => {
        const cat = categories.find((c) => c.id === catId);
        return { name: cat?.name ?? "Other", value };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredOrders, categories]);

  const hourlyData = useMemo(() => {
    const grid = daysOfWeek.map(() => hours.map(() => 0));
    for (const order of filteredOrders) {
      const d = new Date(order.createdAt);
      const dayIdx = (d.getDay() + 6) % 7;
      const h = d.getHours();
      grid[dayIdx][h] += 1;
    }
    return grid;
  }, [filteredOrders]);

  const maxHourly = Math.max(1, ...hourlyData.flat());

  const grossRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? grossRevenue / totalOrders : 0;

  const metrics = [
    { title: "Gross Revenue", value: formatPrice(grossRevenue), icon: Banknote, color: "text-brand-500 bg-brand-500/10" },
    { title: "Avg Order Value", value: formatPrice(avgOrderValue), icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
    { title: "Total Orders", value: formatNumber(totalOrders), icon: ShoppingBag, color: "text-purple-500 bg-purple-500/10" },
  ];

  const getHeatColor = (value: number) => {
    const intensity = value / maxHourly;
    if (intensity === 0) return "bg-muted";
    if (intensity < 0.2) return "bg-brand-500/10";
    if (intensity < 0.4) return "bg-brand-500/25";
    if (intensity < 0.6) return "bg-brand-500/40";
    if (intensity < 0.8) return "bg-brand-500/60";
    return "bg-brand-500/80";
  };

  if (!hasHydrated) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your store&apos;s performance and revenue</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" />CSV</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><FileText className="h-4 w-4" />PDF</Button>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-muted p-1 w-fit">
        {datePresets.map((preset) => (
          <button key={preset.value} onClick={() => setDateRange(preset.value)} className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            dateRange === preset.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}>{preset.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            </CardContent>
          </Card>
        ))}
      </div>

      <RevenueChart data={revenueData} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsChart data={topProducts} />
        <CategoryPieChart data={categoryData} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Orders by Hour</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="flex items-center">
                <div className="w-12 shrink-0" />
                <div className="flex flex-1">
                  {hours.filter((h) => h % 3 === 0).map((h) => (
                    <div key={h} className="flex-1 text-center text-xs text-muted-foreground" style={{ minWidth: `${100 / 8}%` }}>
                      {h.toString().padStart(2, "0")}:00
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-1 space-y-1">
                {daysOfWeek.map((day, dayIdx) => (
                  <div key={day} className="flex items-center gap-1">
                    <div className="w-12 shrink-0 text-xs font-medium text-muted-foreground">{day}</div>
                    <div className="flex flex-1 gap-0.5">
                      {hours.map((h) => (
                        <div key={h} className={cn("aspect-square flex-1 rounded-sm transition-colors", getHeatColor(hourlyData[dayIdx][h]))}
                          title={`${day} ${h.toString().padStart(2, "0")}:00  ${hourlyData[dayIdx][h]} orders`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
