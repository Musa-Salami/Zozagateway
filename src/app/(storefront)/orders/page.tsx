"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPrice, formatDate } from "@/lib/formatters";
import { ORDER_STATUSES } from "@/lib/constants";
import { useOrderStore } from "@/stores/orderStore";
import type { Order, OrderStatus } from "@/types";

export default function OrdersPage() {
  const orders = useOrderStore((state) => state.orders);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders yet. Start browsing our menu!"
          actionLabel="Browse Menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading md:text-4xl">My Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage your order history
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
          return (
            <Card key={order.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                  {/* Left: Order info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold font-mono text-sm">
                        {order.orderNumber}
                      </h3>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span>
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Right: View Details */}
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}