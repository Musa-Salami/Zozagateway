"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Calendar,
  ChevronDown,
  Trash2,
  RefreshCw,
  CheckCircle,
  Package,
} from "lucide-react";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/stores/orderStore";
import type { Order, OrderStatus } from "@/types";

// ── Filter Tabs (dynamic from store) ─────────────────────────────────────

const statusLabels: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Picked Up", value: "PICKED_UP" },
  { label: "Cancelled", value: "CANCELLED" },
];

// ── Page Component ──────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState("7d");
  const hasHydrated = useOrderStore((state) => state._hasHydrated);
  const orders = useOrderStore((state) => state.orders);

  // Build dynamic filter tabs with counts
  const filterTabs = useMemo(() => {
    return statusLabels.map((s) => ({
      ...s,
      count:
        s.value === "all"
          ? orders.length
          : orders.filter((o) => o.status === s.value).length,
    }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

    // Date range filter
    if (dateRange !== "all") {
      const now = Date.now();
      const msMap: Record<string, number> = {
        today: 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now - (msMap[dateRange] ?? 7 * 24 * 60 * 60 * 1000);
      result = result.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
    }

    return result;
  }, [activeTab, dateRange, orders]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground max-w-sm">
          When customers place orders through the storefront, they will appear here automatically.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <p className="text-sm text-muted-foreground">
            {orders.length} total orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Filter */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                Bulk Actions
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Status
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-muted p-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <Badge
              variant="secondary"
              className={cn(
                "h-5 min-w-[20px] justify-center px-1.5 text-[10px]",
                activeTab === tab.value && "bg-brand-500/10 text-brand-500"
              )}
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <OrdersTable orders={filteredOrders} />
    </motion.div>
  );
}
