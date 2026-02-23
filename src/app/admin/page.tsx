"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Banknote,
  ShoppingBag,
  Clock,
  Package,
  Plus,
  ArrowRight,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import { TopProductsChart } from "@/components/admin/TopProductsChart";
import { CategoryPieChart } from "@/components/admin/CategoryPieChart";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/orderStore";
import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { formatPrice } from "@/lib/formatters";
import type { Order, SalesData, TopProduct } from "@/types";

// ── Page Component ──────────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  const ordersHydrated = useOrderStore((state) => state._hasHydrated);
  const productsHydrated = useProductStore((state) => state._hasHydrated);
  const hasHydrated = ordersHydrated && productsHydrated;
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);

  // ── Compute real stats ────────────────────────────────────────
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday
  ).length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // ── Revenue chart: daily revenue for last 30 days ─────────────
  const revenueData = useMemo(() => {
    const days = 30;
    const result: SalesData[] = [];
    for (let i = days - 1; i >= 0; i--) {
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
  }, [orders]);

  // ── Top products by revenue from order items ──────────────────
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; quantity: number }>();
    for (const order of orders) {
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
    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [orders]);

  // ── Category pie chart: revenue per category ──────────────────
  const categoryData = useMemo(() => {
    const catMap = new Map<string, number>();
    for (const order of orders) {
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
  }, [orders, categories]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders" className="gap-1.5">
              <ShoppingBag className="h-4 w-4" />
              View All Orders
            </Link>
          </Button>
          <Button size="sm" className="gap-1.5 bg-brand-500 hover:bg-brand-600" asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          change={0}
          icon={Banknote}
          color="orange"
        />
        <StatsCard
          title="Today's Orders"
          value={String(todayOrders)}
          change={0}
          icon={ShoppingBag}
          color="blue"
        />
        <StatsCard
          title="Pending Orders"
          value={String(pendingOrders)}
          change={0}
          icon={Clock}
          color="purple"
        />
        <StatsCard
          title="Total Products"
          value={String(products.length)}
          change={0}
          icon={Package}
          color="green"
        />
      </motion.div>

      {/* Revenue Chart */}
      <motion.div variants={item}>
        <RevenueChart data={revenueData} />
      </motion.div>

      {/* Two-column layout: Orders + Products/Categories */}
      <motion.div variants={item} className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Left: Recent Orders */}
        <div className="xl:col-span-3">
          <RecentOrdersTable orders={recentOrders} />
        </div>

        {/* Right: Top Products + Category Pie */}
        <div className="space-y-6 xl:col-span-2">
          <TopProductsChart data={topProducts} />
          <CategoryPieChart data={categoryData} />
        </div>
      </motion.div>

      {/* Mobile Quick Actions */}
      <motion.div variants={item} className="flex gap-3 sm:hidden">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/admin/orders" className="gap-1.5">
            <ShoppingBag className="h-4 w-4" />
            All Orders
          </Link>
        </Button>
        <Button className="flex-1 bg-brand-500 hover:bg-brand-600" asChild>
          <Link href="/admin/products/new" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
