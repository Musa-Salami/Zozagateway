"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Printer,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatPrice, formatDateTime } from "@/lib/formatters";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import type { Order, OrderStatus, OrderTimelineEntry } from "@/types";
import { cn } from "@/lib/utils";

// ── Demo Data ──────────────────────────────────────────────────────────────

const demoOrder: Order = {
  id: "ord-001",
  orderNumber: "ZG-A1B2-C3D4",
  userId: "u1",
  user: {
    id: "u1",
    email: "john.adeyemi@example.com",
    name: "John Adeyemi",
    phone: "+2348012345678",
    role: "CUSTOMER",
    avatar: null,
    createdAt: "2025-11-15T10:00:00Z",
  },
  status: "PREPARING",
  subtotal: 52.5,
  deliveryFee: 3.99,
  discount: 5.25,
  total: 51.24,
  paymentId: "pi_3Nq2K4LkdIwHu7ix1a2b3c4d",
  paymentStatus: "PAID",
  deliveryType: "DELIVERY",
  address: "12 Lagos Street, Victoria Island, Lagos",
  city: "Lagos",
  phone: "+2348012345678",
  notes: "Please ring the bell twice. Leave at the door if no answer.",
  promoCode: "SNACK15",
  items: [
    {
      id: "oi-1",
      orderId: "ord-001",
      productId: "p1",
      product: {
        id: "p1",
        name: "Spicy Plantain Chips",
        slug: "spicy-plantain-chips",
        description: "Crispy and spicy plantain chips",
        price: 8.5,
        categoryId: "cat-1",
        stock: 150,
        tags: ["spicy", "popular"],
        dietary: [],
        published: true,
        featured: true,
        images: [{ id: "img-1", productId: "p1", url: "https://placehold.co/80x80/F97316/fff?text=Chips", publicId: "chips", position: 0 }],
        createdAt: "2025-10-01T00:00:00Z",
        updatedAt: "2025-10-01T00:00:00Z",
      },
      quantity: 3,
      unitPrice: 8.5,
      totalPrice: 25.5,
    },
    {
      id: "oi-2",
      orderId: "ord-001",
      productId: "p2",
      product: {
        id: "p2",
        name: "Coconut Cookies",
        slug: "coconut-cookies",
        description: "Soft coconut cookies",
        price: 7.5,
        categoryId: "cat-2",
        stock: 200,
        tags: ["sweet"],
        dietary: ["gluten-free"],
        published: true,
        featured: false,
        images: [{ id: "img-2", productId: "p2", url: "https://placehold.co/80x80/3B82F6/fff?text=Cookie", publicId: "cookie", position: 0 }],
        createdAt: "2025-10-01T00:00:00Z",
        updatedAt: "2025-10-01T00:00:00Z",
      },
      quantity: 2,
      unitPrice: 7.5,
      totalPrice: 15.0,
    },
    {
      id: "oi-3",
      orderId: "ord-001",
      productId: "p3",
      product: {
        id: "p3",
        name: "Honey Cashew Brittle",
        slug: "honey-cashew-brittle",
        description: "Crunchy honey cashew brittle",
        price: 12.0,
        categoryId: "cat-4",
        stock: 80,
        tags: ["premium"],
        dietary: ["gluten-free"],
        published: true,
        featured: true,
        images: [{ id: "img-3", productId: "p3", url: "https://placehold.co/80x80/10B981/fff?text=Brittle", publicId: "brittle", position: 0 }],
        createdAt: "2025-10-01T00:00:00Z",
        updatedAt: "2025-10-01T00:00:00Z",
      },
      quantity: 1,
      unitPrice: 12.0,
      totalPrice: 12.0,
    },
  ],
  timeline: [
    { id: "tl-1", orderId: "ord-001", status: "PENDING", note: "Order placed by customer", changedBy: "System", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    { id: "tl-2", orderId: "ord-001", status: "CONFIRMED", note: "Payment confirmed via Stripe", changedBy: "System", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString() },
    { id: "tl-3", orderId: "ord-001", status: "PREPARING", note: "Kitchen started preparing the order", changedBy: "Admin User", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  ],
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
};

const timelineIcons: Record<OrderStatus, React.ElementType> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PREPARING: Package,
  READY: CheckCircle2,
  DELIVERED: Truck,
  PICKED_UP: CheckCircle2,
  CANCELLED: XCircle,
};

const timelineColors: Record<OrderStatus, string> = {
  PENDING: "text-yellow-500 bg-yellow-500/10",
  CONFIRMED: "text-blue-500 bg-blue-500/10",
  PREPARING: "text-purple-500 bg-purple-500/10",
  READY: "text-green-500 bg-green-500/10",
  DELIVERED: "text-emerald-500 bg-emerald-500/10",
  PICKED_UP: "text-emerald-500 bg-emerald-500/10",
  CANCELLED: "text-red-500 bg-red-500/10",
};

// ── Page Component ──────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams();
  const [newStatus, setNewStatus] = useState<string>(demoOrder.status);
  const order = demoOrder; // In production, fetch by params.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back Link & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {order.orderNumber}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right pr-6">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {item.product?.images?.[0]?.url ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                N/A
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.product?.name ?? "Product"}</p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.product?.sku ?? "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right pr-6 font-medium">
                        {formatPrice(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Order Summary */}
              <div className="border-t p-6">
                <div className="ml-auto max-w-xs space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Discount {order.promoCode && <Badge variant="secondary" className="ml-1 text-[10px]">{order.promoCode}</Badge>}
                      </span>
                      <span className="text-red-500">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {order.timeline?.map((entry, index) => {
                  const Icon = timelineIcons[entry.status];
                  const color = timelineColors[entry.status];
                  const isLast = index === (order.timeline?.length ?? 0) - 1;

                  return (
                    <div key={entry.id} className="relative flex gap-4 pb-6">
                      {/* Line */}
                      {!isLast && (
                        <div className="absolute left-[17px] top-10 h-full w-px bg-border" />
                      )}
                      {/* Icon */}
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {ORDER_STATUSES[entry.status].label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(entry.createdAt)}
                          </p>
                        </div>
                        {entry.note && (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {entry.note}
                          </p>
                        )}
                        {entry.changedBy && (
                          <p className="mt-0.5 text-xs text-muted-foreground/70">
                            by {entry.changedBy}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ORDER_STATUSES) as OrderStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {ORDER_STATUSES[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full bg-brand-500 hover:bg-brand-600">
                Update Status
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{order.user?.name}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{order.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{order.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {order.deliveryType === "DELIVERY" ? "Home Delivery" : "Pickup"}
                </Badge>
              </div>
              {order.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{order.address}{order.city && `, ${order.city}`}</span>
                </div>
              )}
              {order.notes && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Delivery Notes</p>
                  <p className="mt-1 text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Method</span>
                <span className="text-sm font-medium">Stripe</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    PAYMENT_STATUSES[order.paymentStatus].color
                  )}
                >
                  {PAYMENT_STATUSES[order.paymentStatus].label}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="max-w-[160px] truncate text-xs font-mono text-muted-foreground">
                    {order.paymentId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
