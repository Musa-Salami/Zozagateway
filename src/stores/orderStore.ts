"use client";

import { create } from "zustand";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

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
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // ── Selectors ──
  getOrder: (orderId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];
  getCustomers: () => Customer[];

  // ── Internal ──
  _initListener: () => void;
}

/* ── Firestore collection ref ────────────────────────────────────────── */

const ORDERS_COLLECTION = "orders";

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

/* ── Guard against duplicate listener init ───────────────────────────── */

let _listenerInitialized = false;

/* ── Store ───────────────────────────────────────────────────────────── */

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: [],
  _hasHydrated: false,

  /* ── Start Firestore real-time listener ───────────────── */
  _initListener: () => {
    if (_listenerInitialized) return;
    _listenerInitialized = true;

    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Order[];
        set({ orders, _hasHydrated: true });
      },
      (error) => {
        console.error("[orderStore] Firestore listener error:", error);
        // Still mark as hydrated so the UI doesn't spin forever
        set({ _hasHydrated: true });
      }
    );
  },

  /* ── Add a new order ───────────────────────────────────── */
  addOrder: async (order: Order) => {
    // Optimistic update for instant UI feedback
    set({ orders: [order, ...get().orders] });
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
    } catch (error) {
      console.error("[orderStore] Failed to save order:", error);
    }
  },

  /* ── Update order status ───────────────────────────────── */
  updateOrderStatus: async (orderId, status) => {
    const now = new Date().toISOString();
    const newTimeline = {
      id: `tl-${Date.now()}`,
      orderId,
      status,
      note: null,
      changedBy: "admin",
      createdAt: now,
    };

    // Optimistic update
    set({
      orders: get().orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: now,
              timeline: [...(o.timeline ?? []), newTimeline],
            }
          : o
      ),
    });

    try {
      const order = get().orders.find((o) => o.id === orderId);
      if (order) {
        await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
          status,
          updatedAt: now,
          timeline: order.timeline ?? [newTimeline],
        });
      }
    } catch (error) {
      console.error("[orderStore] Failed to update order status:", error);
    }
  },

  /* ── Update payment status ─────────────────────────────── */
  updatePaymentStatus: async (orderId, status) => {
    const now = new Date().toISOString();

    // Optimistic update
    set({
      orders: get().orders.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: status, updatedAt: now }
          : o
      ),
    });

    try {
      await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
        paymentStatus: status,
        updatedAt: now,
      });
    } catch (error) {
      console.error("[orderStore] Failed to update payment status:", error);
    }
  },

  /* ── Delete an order ───────────────────────────────────── */
  deleteOrder: async (orderId) => {
    // Optimistic update
    set({ orders: get().orders.filter((o) => o.id !== orderId) });

    try {
      await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
    } catch (error) {
      console.error("[orderStore] Failed to delete order:", error);
    }
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
}));

/* ── Auto-start listener in the browser ──────────────────────────────── */

if (typeof window !== "undefined") {
  useOrderStore.getState()._initListener();
}
