"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
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
import type { Order, SalesData, TopProduct } from "@/types";

// ── Demo Data ──────────────────────────────────────────────────────────────

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

const demoOrders: Order[] = [
  {
    id: "ord-001",
    orderNumber: "ZG-A1B2-C3D4",
    userId: "u1",
    user: { id: "u1", email: "john@example.com", name: "John Adeyemi", phone: "+2348012345678", role: "CUSTOMER", createdAt: "2026-01-15T10:00:00Z" },
    status: "PENDING",
    subtotal: 24.5,
    deliveryFee: 3.99,
    discount: 0,
    total: 28.49,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "12 Lagos Street",
    phone: "+2348012345678",
    items: [
      { id: "oi-1", orderId: "ord-001", productId: "p1", quantity: 2, unitPrice: 8.5, totalPrice: 17.0 },
      { id: "oi-2", orderId: "ord-001", productId: "p2", quantity: 1, unitPrice: 7.5, totalPrice: 7.5 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "ord-002",
    orderNumber: "ZG-E5F6-G7H8",
    userId: "u2",
    user: { id: "u2", email: "amina@example.com", name: "Amina Bello", phone: "+2348023456789", role: "CUSTOMER", createdAt: "2026-01-10T08:00:00Z" },
    status: "PREPARING",
    subtotal: 42.0,
    deliveryFee: 0,
    discount: 5.0,
    total: 37.0,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "25 Abuja Crescent",
    phone: "+2348023456789",
    items: [
      { id: "oi-3", orderId: "ord-002", productId: "p3", quantity: 3, unitPrice: 6.0, totalPrice: 18.0 },
      { id: "oi-4", orderId: "ord-002", productId: "p4", quantity: 4, unitPrice: 6.0, totalPrice: 24.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "ord-003",
    orderNumber: "ZG-I9J0-K1L2",
    userId: "u3",
    user: { id: "u3", email: "chidi@example.com", name: "Chidi Okonkwo", phone: "+2348034567890", role: "CUSTOMER", createdAt: "2026-01-08T14:00:00Z" },
    status: "READY",
    subtotal: 18.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 21.99,
    paymentStatus: "PAID",
    deliveryType: "PICKUP",
    phone: "+2348034567890",
    items: [
      { id: "oi-5", orderId: "ord-003", productId: "p5", quantity: 2, unitPrice: 9.0, totalPrice: 18.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "ord-004",
    orderNumber: "ZG-M3N4-O5P6",
    userId: "u4",
    user: { id: "u4", email: "fatima@example.com", name: "Fatima Hassan", phone: "+2348045678901", role: "CUSTOMER", createdAt: "2026-01-05T12:00:00Z" },
    status: "DELIVERED",
    subtotal: 56.0,
    deliveryFee: 0,
    discount: 8.4,
    total: 47.6,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "8 Kano Road",
    phone: "+2348045678901",
    items: [
      { id: "oi-6", orderId: "ord-004", productId: "p1", quantity: 4, unitPrice: 8.5, totalPrice: 34.0 },
      { id: "oi-7", orderId: "ord-004", productId: "p6", quantity: 2, unitPrice: 11.0, totalPrice: 22.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "ord-005",
    orderNumber: "ZG-Q7R8-S9T0",
    userId: "u5",
    user: { id: "u5", email: "emeka@example.com", name: "Emeka Nwosu", phone: "+2348056789012", role: "CUSTOMER", createdAt: "2026-01-02T09:00:00Z" },
    status: "CANCELLED",
    subtotal: 15.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 18.99,
    paymentStatus: "REFUNDED",
    deliveryType: "DELIVERY",
    address: "3 Enugu Lane",
    phone: "+2348056789012",
    items: [
      { id: "oi-8", orderId: "ord-005", productId: "p2", quantity: 2, unitPrice: 7.5, totalPrice: 15.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "ord-006",
    orderNumber: "ZG-U1V2-W3X4",
    userId: "u6",
    user: { id: "u6", email: "ngozi@example.com", name: "Ngozi Eze", phone: "+2348067890123", role: "CUSTOMER", createdAt: "2025-12-28T16:00:00Z" },
    status: "CONFIRMED",
    subtotal: 33.5,
    deliveryFee: 0,
    discount: 3.35,
    total: 30.15,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "15 Ibadan Close",
    phone: "+2348067890123",
    items: [
      { id: "oi-9", orderId: "ord-006", productId: "p3", quantity: 2, unitPrice: 6.0, totalPrice: 12.0 },
      { id: "oi-10", orderId: "ord-006", productId: "p5", quantity: 1, unitPrice: 9.0, totalPrice: 9.0 },
      { id: "oi-11", orderId: "ord-006", productId: "p7", quantity: 1, unitPrice: 12.5, totalPrice: 12.5 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "ord-007",
    orderNumber: "ZG-Y5Z6-A7B8",
    userId: "u7",
    user: { id: "u7", email: "bola@example.com", name: "Bola Akinwale", phone: "+2348078901234", role: "CUSTOMER", createdAt: "2025-12-20T11:00:00Z" },
    status: "PENDING",
    subtotal: 19.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 22.99,
    paymentStatus: "PENDING",
    deliveryType: "DELIVERY",
    address: "7 Owerri Avenue",
    phone: "+2348078901234",
    items: [
      { id: "oi-12", orderId: "ord-007", productId: "p4", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
      { id: "oi-13", orderId: "ord-007", productId: "p8", quantity: 1, unitPrice: 13.0, totalPrice: 13.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "ord-008",
    orderNumber: "ZG-C9D0-E1F2",
    userId: "u8",
    user: { id: "u8", email: "kemi@example.com", name: "Kemi Oluwole", phone: "+2348089012345", role: "CUSTOMER", createdAt: "2025-12-18T07:00:00Z" },
    status: "PREPARING",
    subtotal: 27.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 30.99,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "22 Benin Road",
    phone: "+2348089012345",
    items: [
      { id: "oi-14", orderId: "ord-008", productId: "p1", quantity: 1, unitPrice: 8.5, totalPrice: 8.5 },
      { id: "oi-15", orderId: "ord-008", productId: "p6", quantity: 1, unitPrice: 11.0, totalPrice: 11.0 },
      { id: "oi-16", orderId: "ord-008", productId: "p2", quantity: 1, unitPrice: 7.5, totalPrice: 7.5 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "ord-009",
    orderNumber: "ZG-G3H4-I5J6",
    userId: "u9",
    user: { id: "u9", email: "tunde@example.com", name: "Tunde Bakare", phone: "+2348090123456", role: "CUSTOMER", createdAt: "2025-12-15T13:00:00Z" },
    status: "DELIVERED",
    subtotal: 64.0,
    deliveryFee: 0,
    discount: 9.6,
    total: 54.4,
    paymentStatus: "PAID",
    deliveryType: "PICKUP",
    phone: "+2348090123456",
    items: [
      { id: "oi-17", orderId: "ord-009", productId: "p7", quantity: 2, unitPrice: 12.5, totalPrice: 25.0 },
      { id: "oi-18", orderId: "ord-009", productId: "p3", quantity: 3, unitPrice: 6.0, totalPrice: 18.0 },
      { id: "oi-19", orderId: "ord-009", productId: "p8", quantity: 1, unitPrice: 13.0, totalPrice: 13.0 },
      { id: "oi-20", orderId: "ord-009", productId: "p4", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "ord-010",
    orderNumber: "ZG-K7L8-M9N0",
    userId: "u10",
    user: { id: "u10", email: "zainab@example.com", name: "Zainab Musa", phone: "+2348001234567", role: "CUSTOMER", createdAt: "2025-12-10T15:00:00Z" },
    status: "READY",
    subtotal: 21.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 24.99,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "5 Kaduna Place",
    phone: "+2348001234567",
    items: [
      { id: "oi-21", orderId: "ord-010", productId: "p5", quantity: 1, unitPrice: 9.0, totalPrice: 9.0 },
      { id: "oi-22", orderId: "ord-010", productId: "p1", quantity: 1, unitPrice: 8.5, totalPrice: 8.5 },
      { id: "oi-23", orderId: "ord-010", productId: "p4", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
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
          value="$12,450"
          change={8.2}
          icon={DollarSign}
          color="orange"
        />
        <StatsCard
          title="Today's Orders"
          value="47"
          change={12}
          icon={ShoppingBag}
          color="blue"
        />
        <StatsCard
          title="Pending Orders"
          value="12"
          change={-3}
          icon={Clock}
          color="purple"
        />
        <StatsCard
          title="Total Products"
          value="86"
          change={5}
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
          <RecentOrdersTable orders={demoOrders} />
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
