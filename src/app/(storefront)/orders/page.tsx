import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPrice, formatDate } from "@/lib/formatters";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Order, OrderStatus } from "@/types";

// -- Sample orders --
const sampleOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ZG-LK2M9F-A7B3",
    userId: "u1",
    status: "DELIVERED",
    subtotal: 24.46,
    deliveryFee: 0,
    discount: 0,
    total: 24.46,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "123 Snack Lane",
    city: "Food City",
    phone: "+1 (555) 123-4567",
    items: [
      { id: "oi1", orderId: "ord-1", productId: "p1", quantity: 2, unitPrice: 4.99, totalPrice: 9.98 },
      { id: "oi2", orderId: "ord-1", productId: "p3", quantity: 1, unitPrice: 6.49, totalPrice: 6.49 },
      { id: "oi3", orderId: "ord-1", productId: "p6", quantity: 1, unitPrice: 8.99, totalPrice: 8.99 },
    ],
    createdAt: "2025-12-01T14:30:00Z",
    updatedAt: "2025-12-01T16:00:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "ZG-MN4P2Q-X9K1",
    userId: "u1",
    status: "PREPARING",
    subtotal: 16.47,
    deliveryFee: 3.99,
    discount: 0,
    total: 20.46,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "456 Treat Ave",
    city: "Snackville",
    phone: "+1 (555) 987-6543",
    items: [
      { id: "oi4", orderId: "ord-2", productId: "p5", quantity: 1, unitPrice: 5.99, totalPrice: 5.99 },
      { id: "oi5", orderId: "ord-2", productId: "p7", quantity: 3, unitPrice: 3.49, totalPrice: 10.47 },
    ],
    createdAt: "2025-12-10T09:15:00Z",
    updatedAt: "2025-12-10T09:45:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "ZG-QR7T5W-C2D8",
    userId: "u1",
    status: "CONFIRMED",
    subtotal: 31.46,
    deliveryFee: 0,
    discount: 3.15,
    total: 28.31,
    paymentStatus: "PAID",
    deliveryType: "PICKUP",
    phone: "+1 (555) 456-7890",
    items: [
      { id: "oi6", orderId: "ord-3", productId: "p9", quantity: 2, unitPrice: 7.99, totalPrice: 15.98 },
      { id: "oi7", orderId: "ord-3", productId: "p12", quantity: 1, unitPrice: 9.49, totalPrice: 9.49 },
      { id: "oi8", orderId: "ord-3", productId: "p10", quantity: 1, unitPrice: 4.99, totalPrice: 4.99 },
    ],
    promoCode: "SNACK10",
    createdAt: "2025-12-12T11:00:00Z",
    updatedAt: "2025-12-12T11:30:00Z",
  },
  {
    id: "ord-4",
    orderNumber: "ZG-AB3C8D-F5G7",
    userId: "u1",
    status: "CANCELLED",
    subtotal: 8.98,
    deliveryFee: 3.99,
    discount: 0,
    total: 12.97,
    paymentStatus: "REFUNDED",
    deliveryType: "DELIVERY",
    address: "789 Crunch Blvd",
    city: "Biscuit Town",
    phone: "+1 (555) 321-0987",
    items: [
      { id: "oi9", orderId: "ord-4", productId: "p2", quantity: 1, unitPrice: 3.99, totalPrice: 3.99 },
      { id: "oi10", orderId: "ord-4", productId: "p10", quantity: 1, unitPrice: 4.99, totalPrice: 4.99 },
    ],
    createdAt: "2025-11-20T16:45:00Z",
    updatedAt: "2025-11-21T08:00:00Z",
  },
  {
    id: "ord-5",
    orderNumber: "ZG-HJ6K1L-N4P9",
    userId: "u1",
    status: "PENDING",
    subtotal: 13.47,
    deliveryFee: 3.99,
    discount: 0,
    total: 17.46,
    paymentStatus: "PENDING",
    deliveryType: "DELIVERY",
    address: "321 Munch St",
    city: "Nibble City",
    phone: "+1 (555) 654-3210",
    items: [
      { id: "oi11", orderId: "ord-5", productId: "p8", quantity: 1, unitPrice: 5.49, totalPrice: 5.49 },
      { id: "oi12", orderId: "ord-5", productId: "p9", quantity: 1, unitPrice: 7.99, totalPrice: 7.99 },
    ],
    createdAt: "2025-12-14T13:00:00Z",
    updatedAt: "2025-12-14T13:00:00Z",
  },
];

export default function OrdersPage() {
  if (sampleOrders.length === 0) {
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
        {sampleOrders.map((order) => {
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