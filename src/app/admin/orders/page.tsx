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
import type { Order, OrderStatus } from "@/types";

// ── Demo Data ──────────────────────────────────────────────────────────────

const names = [
  "John Adeyemi", "Amina Bello", "Chidi Okonkwo", "Fatima Hassan", "Emeka Nwosu",
  "Ngozi Eze", "Bola Akinwale", "Kemi Oluwole", "Tunde Bakare", "Zainab Musa",
  "Ade Ogundimu", "Halima Yusuf", "Ifeanyi Okoro", "Dayo Adeleke", "Sade Williams",
  "Musa Ibrahim", "Grace Etim", "Yemi Ojo",
];

const statuses: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "PICKED_UP", "CANCELLED",
];

const demoOrders: Order[] = Array.from({ length: 18 }, (_, i) => {
  const status = statuses[i % statuses.length];
  const name = names[i % names.length];
  const subtotal = Math.floor(Math.random() * 60 + 12);
  const deliveryFee = subtotal >= 25 ? 0 : 3.99;
  const discount = i % 4 === 0 ? Math.round(subtotal * 0.15 * 100) / 100 : 0;
  const total = Math.round((subtotal + deliveryFee - discount) * 100) / 100;
  const hoursAgo = i * 4 + Math.floor(Math.random() * 3);

  return {
    id: `ord-${String(i + 1).padStart(3, "0")}`,
    orderNumber: `ZG-${String.fromCharCode(65 + i)}${Math.floor(Math.random() * 9)}${String.fromCharCode(66 + i)}${Math.floor(Math.random() * 9)}-${String.fromCharCode(67 + (i % 20))}${Math.floor(Math.random() * 9)}${String.fromCharCode(68 + (i % 20))}${Math.floor(Math.random() * 9)}`,
    userId: `u${i + 1}`,
    user: {
      id: `u${i + 1}`,
      email: `${name.split(" ")[0].toLowerCase()}@example.com`,
      name,
      phone: `+23480${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
      role: "CUSTOMER",
      createdAt: "2025-12-01T10:00:00Z",
    },
    status,
    subtotal,
    deliveryFee,
    discount,
    total,
    paymentStatus: status === "CANCELLED" ? "REFUNDED" : i % 5 === 0 ? "PENDING" : "PAID",
    deliveryType: i % 3 === 0 ? "PICKUP" : "DELIVERY",
    address: i % 3 !== 0 ? `${i + 1} Sample Street, Lagos` : undefined,
    phone: `+23480${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
    items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
      id: `oi-${i}-${j}`,
      orderId: `ord-${String(i + 1).padStart(3, "0")}`,
      productId: `p${j + 1}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      unitPrice: Math.floor(Math.random() * 10) + 5,
      totalPrice: (Math.floor(Math.random() * 3) + 1) * (Math.floor(Math.random() * 10) + 5),
    })),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * hoursAgo).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * hoursAgo).toISOString(),
  };
});

// ── Filter Tabs ─────────────────────────────────────────────────────────────

const filterTabs: { label: string; value: string; count: number }[] = [
  { label: "All", value: "all", count: demoOrders.length },
  { label: "Pending", value: "PENDING", count: demoOrders.filter((o) => o.status === "PENDING").length },
  { label: "Preparing", value: "PREPARING", count: demoOrders.filter((o) => o.status === "PREPARING").length },
  { label: "Ready", value: "READY", count: demoOrders.filter((o) => o.status === "READY").length },
  { label: "Delivered", value: "DELIVERED", count: demoOrders.filter((o) => o.status === "DELIVERED").length },
  { label: "Cancelled", value: "CANCELLED", count: demoOrders.filter((o) => o.status === "CANCELLED").length },
];

// ── Page Component ──────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return demoOrders;
    return demoOrders.filter((o) => o.status === activeTab);
  }, [activeTab]);

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
            {demoOrders.length} total orders
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
