"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus, OrderItem, PaymentStatus, User } from "@/types";

/* ── Customer type (derived from orders) ─────────────────────────────── */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
  joinedAt: string;
}

/* ── Store interface ─────────────────────────────────────────────────── */

interface OrderStore {
  orders: Order[];
  _hasHydrated: boolean;

  // ── Actions ──
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  deleteOrder: (orderId: string) => void;

  // ── Selectors ──
  getOrder: (orderId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];
  getCustomers: () => Customer[];
}

/* ── Helper: normalize phone for matching ────────────────────────────── */

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "");
}

/* ── Helper: build unique ID from name + phone ───────────────────────── */

function customerKeyFromOrder(order: Order): string {
  const phone = normalizePhone(order.phone);
  const name = (order.user?.name ?? "Guest").toLowerCase().trim();
  return `${name}::${phone}`;
}

/* ── Store ───────────────────────────────────────────────────────────── */

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      _hasHydrated: false,

      /* ── Add a new order ───────────────────────────────────── */
      addOrder: (order: Order) => {
        set({ orders: [order, ...get().orders] });
      },

      /* ── Update order status ───────────────────────────────── */
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  updatedAt: new Date().toISOString(),
                  timeline: [
                    ...(o.timeline ?? []),
                    {
                      id: `tl-${Date.now()}`,
                      orderId,
                      status,
                      note: null,
                      changedBy: "admin",
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : o
          ),
        });
      },

      /* ── Update payment status ─────────────────────────────── */
      updatePaymentStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() }
              : o
          ),
        });
      },

      /* ── Delete an order ───────────────────────────────────── */
      deleteOrder: (orderId) => {
        set({ orders: get().orders.filter((o) => o.id !== orderId) });
      },

      /* ── Get single order by ID ────────────────────────────── */
      getOrder: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      /* ── Get orders by phone ───────────────────────────────── */
      getOrdersByPhone: (phone) => {
        const norm = normalizePhone(phone);
        return get().orders.filter(
          (o) => normalizePhone(o.phone) === norm
        );
      },

      /* ── Derive unique customers from all orders ───────────── */
      getCustomers: () => {
        const ordersArr = get().orders;
        const customerMap = new Map<string, Customer>();

        for (const order of ordersArr) {
          const key = customerKeyFromOrder(order);
          const existing = customerMap.get(key);

          if (existing) {
            existing.ordersCount += 1;
            existing.totalSpent += order.total;
            if (new Date(order.createdAt) > new Date(existing.lastOrderAt)) {
              existing.lastOrderAt = order.createdAt;
            }
            if (new Date(order.createdAt) < new Date(existing.joinedAt)) {
              existing.joinedAt = order.createdAt;
            }
          } else {
            customerMap.set(key, {
              id: `cust-${normalizePhone(order.phone)}`,
              name: order.user?.name ?? "Guest",
              email: order.user?.email ?? "",
              phone: order.phone,
              avatar: null,
              ordersCount: 1,
              totalSpent: order.total,
              lastOrderAt: order.createdAt,
              joinedAt: order.createdAt,
            });
          }
        }

        return Array.from(customerMap.values());
      },
    }),
    {
      name: "zozagateway-orders",
      version: 2,
      partialize: (state) => ({ orders: state.orders }),
      onRehydrateStorage: () => () => {
        useOrderStore.setState({ _hasHydrated: true });
      },
    }
  )
);
