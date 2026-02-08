"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatPrice, formatDate, formatDateTime } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import type { Order } from "@/types";

// ── Demo Data ──────────────────────────────────────────────────────────────

const customer = {
  id: "u1",
  name: "John Adeyemi",
  email: "john.adeyemi@example.com",
  phone: "+2348012345678",
  avatar: null,
  joinedAt: "2025-06-15T10:00:00Z",
};

const customerOrders: Order[] = [
  {
    id: "ord-101",
    orderNumber: "ZG-X1Y2-Z3A4",
    userId: "u1",
    status: "DELIVERED",
    subtotal: 28.5,
    deliveryFee: 0,
    discount: 0,
    total: 28.5,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "12 Lagos Street",
    phone: "+2348012345678",
    items: [
      { id: "oi-101", orderId: "ord-101", productId: "p1", quantity: 2, unitPrice: 8.5, totalPrice: 17.0 },
      { id: "oi-102", orderId: "ord-101", productId: "p3", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
      { id: "oi-103", orderId: "ord-101", productId: "p7", quantity: 1, unitPrice: 5.5, totalPrice: 5.5 },
    ],
    createdAt: "2026-01-28T14:30:00Z",
    updatedAt: "2026-01-29T10:00:00Z",
  },
  {
    id: "ord-102",
    orderNumber: "ZG-B5C6-D7E8",
    userId: "u1",
    status: "PREPARING",
    subtotal: 42.0,
    deliveryFee: 0,
    discount: 6.3,
    total: 35.7,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "12 Lagos Street",
    phone: "+2348012345678",
    items: [
      { id: "oi-104", orderId: "ord-102", productId: "p2", quantity: 3, unitPrice: 7.5, totalPrice: 22.5 },
      { id: "oi-105", orderId: "ord-102", productId: "p5", quantity: 1, unitPrice: 9.0, totalPrice: 9.0 },
      { id: "oi-106", orderId: "ord-102", productId: "p8", quantity: 1, unitPrice: 13.0, totalPrice: 13.0 },
    ],
    createdAt: "2026-02-02T11:15:00Z",
    updatedAt: "2026-02-02T12:30:00Z",
  },
  {
    id: "ord-103",
    orderNumber: "ZG-F9G0-H1I2",
    userId: "u1",
    status: "DELIVERED",
    subtotal: 24.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 27.99,
    paymentStatus: "PAID",
    deliveryType: "PICKUP",
    phone: "+2348012345678",
    items: [
      { id: "oi-107", orderId: "ord-103", productId: "p4", quantity: 4, unitPrice: 6.0, totalPrice: 24.0 },
    ],
    createdAt: "2026-01-15T09:45:00Z",
    updatedAt: "2026-01-15T14:00:00Z",
  },
  {
    id: "ord-104",
    orderNumber: "ZG-J3K4-L5M6",
    userId: "u1",
    status: "CANCELLED",
    subtotal: 15.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 18.99,
    paymentStatus: "REFUNDED",
    deliveryType: "DELIVERY",
    address: "12 Lagos Street",
    phone: "+2348012345678",
    items: [
      { id: "oi-108", orderId: "ord-104", productId: "p6", quantity: 1, unitPrice: 11.0, totalPrice: 11.0 },
      { id: "oi-109", orderId: "ord-104", productId: "p10", quantity: 1, unitPrice: 4.0, totalPrice: 4.0 },
    ],
    createdAt: "2025-12-20T16:20:00Z",
    updatedAt: "2025-12-21T08:00:00Z",
  },
  {
    id: "ord-105",
    orderNumber: "ZG-N7O8-P9Q0",
    userId: "u1",
    status: "DELIVERED",
    subtotal: 56.0,
    deliveryFee: 0,
    discount: 8.4,
    total: 47.6,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "12 Lagos Street",
    phone: "+2348012345678",
    items: [
      { id: "oi-110", orderId: "ord-105", productId: "p1", quantity: 2, unitPrice: 8.5, totalPrice: 17.0 },
      { id: "oi-111", orderId: "ord-105", productId: "p5", quantity: 2, unitPrice: 9.0, totalPrice: 18.0 },
      { id: "oi-112", orderId: "ord-105", productId: "p8", quantity: 1, unitPrice: 13.0, totalPrice: 13.0 },
      { id: "oi-113", orderId: "ord-105", productId: "p9", quantity: 2, unitPrice: 5.0, totalPrice: 10.0 },
    ],
    createdAt: "2025-11-30T13:00:00Z",
    updatedAt: "2025-12-01T09:00:00Z",
  },
];

const totalSpent = customerOrders
  .filter((o) => o.status !== "CANCELLED")
  .reduce((sum, o) => sum + o.total, 0);
const totalOrders = customerOrders.length;
const avgOrderValue = totalSpent / Math.max(totalOrders - customerOrders.filter((o) => o.status === "CANCELLED").length, 1);

// ── Page Component ──────────────────────────────────────────────────────────

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back Link */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Customer Detail</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Profile + Stats */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="flex flex-col items-center pt-8 pb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-brand-500/10 text-brand-500 text-2xl font-bold">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{customer.name}</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(customer.joinedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{formatPrice(totalSpent)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10">
                  <TrendingUp className="h-5 w-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">{formatPrice(avgOrderValue)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Order History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <TableCell className="pl-6 font-medium text-brand-500">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
