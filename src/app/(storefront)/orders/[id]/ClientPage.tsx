"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowLeft, MapPin, Phone, Truck, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderTracker } from "@/components/storefront/OrderTracker";
import { formatPrice, formatDate, formatDateTime } from "@/lib/formatters";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Order, OrderStatus } from "@/types";

// -- Sample order data --
const sampleOrdersMap: Record<string, Order> = {
  "ord-1": {
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
    notes: "Please leave at the door",
    items: [
      {
        id: "oi1", orderId: "ord-1", productId: "p1", quantity: 2, unitPrice: 4.99, totalPrice: 9.98,
        product: {
          id: "p1", name: "Honey BBQ Kettle Chips", slug: "honey-bbq-kettle-chips",
          description: "Thick-cut kettle chips", price: 4.99, categoryId: "cat-1",
          stock: 120, tags: [], dietary: [], published: true, featured: true,
          images: [{ id: "i1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100", publicId: "c1", position: 0 }],
          createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
        },
      },
      {
        id: "oi2", orderId: "ord-1", productId: "p3", quantity: 1, unitPrice: 6.49, totalPrice: 6.49,
        product: {
          id: "p3", name: "Double Chocolate Cookies", slug: "double-chocolate-cookies",
          description: "Rich chocolate cookies", price: 6.49, categoryId: "cat-2",
          stock: 85, tags: [], dietary: [], published: true, featured: true,
          images: [{ id: "i3", productId: "p3", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=100", publicId: "c3", position: 0 }],
          createdAt: "2025-05-15T10:00:00Z", updatedAt: "2025-11-20T10:00:00Z",
        },
      },
      {
        id: "oi3", orderId: "ord-1", productId: "p6", quantity: 1, unitPrice: 8.99, totalPrice: 8.99,
        product: {
          id: "p6", name: "Honey Roasted Almonds", slug: "honey-roasted-almonds",
          description: "Premium roasted almonds", price: 8.99, categoryId: "cat-4",
          stock: 200, tags: [], dietary: ["Vegan"], published: true, featured: true,
          images: [{ id: "i6", productId: "p6", url: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=100", publicId: "c6", position: 0 }],
          createdAt: "2025-06-20T10:00:00Z", updatedAt: "2025-11-30T10:00:00Z",
        },
      },
    ],
    timeline: [
      { id: "t1", orderId: "ord-1", status: "PENDING", createdAt: "2025-12-01T14:30:00Z" },
      { id: "t2", orderId: "ord-1", status: "CONFIRMED", note: "Order confirmed", createdAt: "2025-12-01T14:35:00Z" },
      { id: "t3", orderId: "ord-1", status: "PREPARING", note: "Kitchen is preparing your order", createdAt: "2025-12-01T14:50:00Z" },
      { id: "t4", orderId: "ord-1", status: "READY", note: "Order ready for delivery", createdAt: "2025-12-01T15:20:00Z" },
      { id: "t5", orderId: "ord-1", status: "DELIVERED", note: "Order delivered", createdAt: "2025-12-01T16:00:00Z" },
    ],
    createdAt: "2025-12-01T14:30:00Z",
    updatedAt: "2025-12-01T16:00:00Z",
  },
  "ord-2": {
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
      {
        id: "oi4", orderId: "ord-2", productId: "p5", quantity: 1, unitPrice: 5.99, totalPrice: 5.99,
        product: {
          id: "p5", name: "Classic Meat Pie", slug: "classic-meat-pie",
          description: "Flaky golden pastry", price: 5.99, categoryId: "cat-3",
          stock: 45, tags: [], dietary: [], published: true, featured: true,
          images: [{ id: "i5", productId: "p5", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=100", publicId: "c5", position: 0 }],
          createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-10T10:00:00Z",
        },
      },
      {
        id: "oi5", orderId: "ord-2", productId: "p7", quantity: 3, unitPrice: 3.49, totalPrice: 10.47,
        product: {
          id: "p7", name: "Gummy Bear Mix", slug: "gummy-bear-mix",
          description: "Fruity gummy bears", price: 3.49, categoryId: "cat-5",
          stock: 300, tags: [], dietary: [], published: true, featured: true,
          images: [{ id: "i7", productId: "p7", url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=100", publicId: "c7", position: 0 }],
          createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-05T10:00:00Z",
        },
      },
    ],
    timeline: [
      { id: "t6", orderId: "ord-2", status: "PENDING", createdAt: "2025-12-10T09:15:00Z" },
      { id: "t7", orderId: "ord-2", status: "CONFIRMED", createdAt: "2025-12-10T09:20:00Z" },
      { id: "t8", orderId: "ord-2", status: "PREPARING", note: "Your order is being prepared", createdAt: "2025-12-10T09:45:00Z" },
    ],
    createdAt: "2025-12-10T09:15:00Z",
    updatedAt: "2025-12-10T09:45:00Z",
  },
};

// Default order for unknown IDs
const defaultOrder: Order = {
  id: "ord-default",
  orderNumber: "ZG-DEFAULT-0000",
  userId: "u1",
  status: "CONFIRMED",
  subtotal: 15.97,
  deliveryFee: 3.99,
  discount: 0,
  total: 19.96,
  paymentStatus: "PAID",
  deliveryType: "DELIVERY",
  address: "123 Main St",
  city: "Anytown",
  phone: "+1 (555) 000-0000",
  items: [],
  timeline: [
    { id: "td1", orderId: "ord-default", status: "PENDING", createdAt: "2025-12-01T10:00:00Z" },
    { id: "td2", orderId: "ord-default", status: "CONFIRMED", createdAt: "2025-12-01T10:05:00Z" },
  ],
  createdAt: "2025-12-01T10:00:00Z",
  updatedAt: "2025-12-01T10:05:00Z",
};

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = use(params);
  const order = sampleOrdersMap[id] ?? defaultOrder;
  const statusConfig = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/orders"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold font-heading md:text-3xl">
              Order {order.orderNumber}
            </h1>
            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Order Tracker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTracker currentStatus={order.status} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-brand-500" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No items in this order.
                </p>
              ) : (
                <div className="divide-y">
                  {order.items.map((item) => {
                    const imgUrl = item.product?.images?.[0]?.url ?? "/images/placeholder-product.png";
                    return (
                      <div key={item.id} className="flex items-center gap-4 py-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={imgUrl}
                            alt={item.product?.name ?? "Product"}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.product?.name ?? "Unknown Product"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} x {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <span className="font-semibold text-sm">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>
                  {order.deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(order.deliveryFee)
                  )}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-brand-500">{formatPrice(order.total)}</span>
              </div>
              {order.promoCode && (
                <p className="text-xs text-muted-foreground">
                  Promo code: <span className="font-mono font-medium">{order.promoCode}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-brand-500" />
                Delivery Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {order.deliveryType === "DELIVERY" ? "Delivery" : "Pickup"}
                </Badge>
              </div>
              {order.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {order.address}, {order.city}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{order.phone}</span>
              </div>
              {order.notes && (
                <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}