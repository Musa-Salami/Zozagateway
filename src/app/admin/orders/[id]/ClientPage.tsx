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
import { useOrderStore } from "@/stores/orderStore";
import { toast } from "sonner";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const timelineIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PREPARING: Package,
  READY: CheckCircle2,
  DELIVERED: Truck,
  PICKED_UP: CheckCircle2,
  CANCELLED: XCircle,
};

const timelineColors: Record<string, string> = {
  PENDING: "text-yellow-500 bg-yellow-500/10",
  CONFIRMED: "text-blue-500 bg-blue-500/10",
  PREPARING: "text-purple-500 bg-purple-500/10",
  READY: "text-green-500 bg-green-500/10",
  DELIVERED: "text-emerald-500 bg-emerald-500/10",
  PICKED_UP: "text-emerald-500 bg-emerald-500/10",
  CANCELLED: "text-red-500 bg-red-500/10",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const orders = useOrderStore((s) => s.orders);
  const hasHydrated = useOrderStore((s) => s._hasHydrated);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const order = orders.find((o) => o.id === orderId);
  const [newStatus, setNewStatus] = useState<string>(order?.status ?? "PENDING");

  if (!hasHydrated) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">This order does not exist.</p>
        <Button asChild><Link href="/admin/orders">Back to Orders</Link></Button>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) return;
    await updateOrderStatus(order.id, newStatus as OrderStatus);
    toast.success("Order status updated to " + (ORDER_STATUSES[newStatus as keyof typeof ORDER_STATUSES]?.label ?? newStatus));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="h-4 w-4" />Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Order Items</CardTitle></CardHeader>
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
                  {(order.items ?? []).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {item.product?.images?.[0]?.url ? (
                              <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">N/A</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.product?.name ?? "Product"}</p>
                            <p className="text-xs text-muted-foreground">SKU: {item.product?.sku ?? "\u2014"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right pr-6 font-medium">{formatPrice(item.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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

          {order.timeline && order.timeline.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Order Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {order.timeline.map((entry, index) => {
                    const Icon = timelineIcons[entry.status] ?? Clock;
                    const color = timelineColors[entry.status] ?? "text-gray-500 bg-gray-500/10";
                    const isLast = index === (order.timeline?.length ?? 0) - 1;
                    return (
                      <div key={entry.id} className="relative flex gap-4 pb-6">
                        {!isLast && <div className="absolute left-[17px] top-10 h-full w-px bg-border" />}
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{ORDER_STATUSES[entry.status as keyof typeof ORDER_STATUSES]?.label ?? entry.status}</p>
                            <p className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                          </div>
                          {entry.note && <p className="mt-0.5 text-sm text-muted-foreground">{entry.note}</p>}
                          {entry.changedBy && <p className="mt-0.5 text-xs text-muted-foreground/70">by {entry.changedBy}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(ORDER_STATUSES) as OrderStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>{ORDER_STATUSES[status].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full bg-brand-500 hover:bg-brand-600" onClick={handleStatusUpdate}>Update Status</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{order.user?.name ?? "Guest"}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                {order.user?.email && (
                  <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span>{order.user.email}</span></div>
                )}
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /><span>{order.phone}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4" />Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">{order.deliveryType === "DELIVERY" ? "Home Delivery" : "Pickup"}</Badge>
              {order.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{order.address}{order.city && (", " + order.city)}</span>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", PAYMENT_STATUSES[order.paymentStatus]?.color)}>
                  {PAYMENT_STATUSES[order.paymentStatus]?.label ?? order.paymentStatus}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="max-w-[160px] truncate text-xs font-mono text-muted-foreground">{order.paymentId}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
