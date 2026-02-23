"use client";

import React from "react";
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
import { formatPrice } from "@/lib/formatters";
import type { Order, SalesData, TopProduct } from "@/types";

// ── Chart Placeholder Data ──────────────────────────────────────────────────

const revenueData: SalesData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Math.floor(Math.random() * 800 + 400),
    orders: Math.floor(Math.random() * 30 + 10),
  };
});

const topProducts: TopProduct[] = [
  { name: "Spicy Plantain Chips", revenue: 1840, quantity: 230 },
  { name: "Coconut Cookies", revenue: 1560, quantity: 195 },
  { name: "Chin Chin Original", revenue: 1320, quantity: 165 },
  { name: "Puff Puff Mix", revenue: 1100, quantity: 138 },
  { name: "Garlic Roasted Nuts", revenue: 980, quantity: 122 },
  { name: "Honey Cashew Brittle", revenue: 850, quantity: 106 },
  { name: "Ginger Snap Biscuits", revenue: 720, quantity: 90 },
  { name: "Tropical Trail Mix", revenue: 640, quantity: 80 },
];

const categoryData = [
  { name: "Chips & Crisps", value: 3200 },
  { name: "Cookies & Biscuits", value: 2800 },
  { name: "Pastries & Pies", value: 2400 },
  { name: "Nuts & Trail Mix", value: 1900 },
  { name: "Candy & Sweets", value: 1600 },
  { name: "Popcorn", value: 1200 },
  { name: "Healthy Snacks", value: 900 },
  { name: "Beverages", value: 750 },
];

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
  const hasHydrated = useOrderStore((state) => state._hasHydrated);
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);

  // Compute real stats from orders
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday
  ).length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const recentOrders = orders.slice(0, 10); // most recent 10

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
