"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Banknote,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useOrderStore } from "@/stores/orderStore";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const orders = useOrderStore((s) => s.orders);
  const hasHydrated = useOrderStore((s) => s._hasHydrated);
  const getCustomers = useOrderStore((s) => s.getCustomers);

  const customer = useMemo(() => {
    return getCustomers().find((c) => c.id === customerId);
  }, [getCustomers, customerId]);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return orders.filter((o) => o.phone === customer.phone).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, customer]);

  const avgOrderValue = useMemo(() => {
    if (!customer) return 0;
    const validOrders = customerOrders.filter((o) => o.status !== "CANCELLED");
    return validOrders.length > 0
      ? validOrders.reduce((sum, o) => sum + o.total, 0) / validOrders.length
      : 0;
  }, [customer, customerOrders]);

  if (!hasHydrated) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold mb-4">Customer Not Found</h1>
        <p className="text-muted-foreground mb-6">This customer does not exist.</p>
        <Button asChild><Link href="/admin/customers">Back to Customers</Link></Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/customers"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Customer Detail</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center pt-8 pb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-brand-500/10 text-brand-500 text-2xl font-bold">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{customer.name}</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {customer.email && (
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{customer.email}</span></div>
                )}
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{customer.phone}</span></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Joined {formatDate(customer.joinedAt)}</span></div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{customer.ordersCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Banknote className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{formatPrice(customer.totalSpent)}</p>
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

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Order History</CardTitle></CardHeader>
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
                  {customerOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No orders yet.</TableCell>
                    </TableRow>
                  ) : (
                    customerOrders.map((order) => (
                      <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push("/admin/orders/" + order.id)}>
                        <TableCell className="pl-6 font-medium text-brand-500">{order.orderNumber}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDateTime(order.createdAt)}</TableCell>
                        <TableCell>{(order.items ?? []).length}</TableCell>
                        <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                        <TableCell><OrderStatusBadge status={order.status} size="sm" /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
