"use client";

import { create } from "zustand";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

/* ── Demo Orders (seeded to Firestore on first run) ──────────────────── */

const demoOrders: Order[] = [
  {
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
      createdAt: "2025-06-15T10:00:00Z",
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
      { id: "oi-1", orderId: "ord-001", productId: "p1", product: { id: "p1", name: "Spicy Plantain Chips", slug: "spicy-plantain-chips", description: "Crispy and spicy plantain chips", price: 8.5, categoryId: "cat-1", stock: 150, tags: ["spicy", "popular"], dietary: [], published: true, featured: true, images: [{ id: "img-1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "chips", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 3, unitPrice: 8.5, totalPrice: 25.5 },
      { id: "oi-2", orderId: "ord-001", productId: "p2", product: { id: "p2", name: "Coconut Cookies", slug: "coconut-cookies", description: "Soft coconut cookies", price: 7.5, categoryId: "cat-2", stock: 200, tags: ["sweet"], dietary: ["gluten-free"], published: true, featured: false, images: [{ id: "img-2", productId: "p2", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", publicId: "cookie", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 2, unitPrice: 7.5, totalPrice: 15.0 },
      { id: "oi-3", orderId: "ord-001", productId: "p3", product: { id: "p3", name: "Honey Cashew Brittle", slug: "honey-cashew-brittle", description: "Crunchy honey cashew brittle", price: 12.0, categoryId: "cat-4", stock: 80, tags: ["premium"], dietary: ["gluten-free"], published: true, featured: true, images: [{ id: "img-3", productId: "p3", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "brittle", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 12.0, totalPrice: 12.0 },
    ],
    timeline: [
      { id: "tl-1", orderId: "ord-001", status: "PENDING", note: "Order placed by customer", changedBy: "System", createdAt: "2026-02-19T10:30:00Z" },
      { id: "tl-2", orderId: "ord-001", status: "CONFIRMED", note: "Payment confirmed via Stripe", changedBy: "System", createdAt: "2026-02-19T10:35:00Z" },
      { id: "tl-3", orderId: "ord-001", status: "PREPARING", note: "Kitchen started preparing the order", changedBy: "Admin User", createdAt: "2026-02-19T11:00:00Z" },
    ],
    createdAt: "2026-02-19T10:30:00Z",
    updatedAt: "2026-02-19T11:00:00Z",
  },
  {
    id: "ord-002",
    orderNumber: "ZG-X1Y2-Z3A4",
    userId: "u1",
    user: { id: "u1", email: "john.adeyemi@example.com", name: "John Adeyemi", phone: "+2348012345678", role: "CUSTOMER", avatar: null, createdAt: "2025-06-15T10:00:00Z" },
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
      { id: "oi-101", orderId: "ord-002", productId: "p1", product: { id: "p1", name: "Spicy Plantain Chips", slug: "spicy-plantain-chips", description: "Crispy plantain chips", price: 8.5, categoryId: "cat-1", stock: 150, tags: [], dietary: [], published: true, featured: true, images: [{ id: "img-1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "c1", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 2, unitPrice: 8.5, totalPrice: 17.0 },
      { id: "oi-102", orderId: "ord-002", productId: "p3", product: { id: "p3", name: "Honey Cashew Brittle", slug: "honey-cashew-brittle", description: "Crunchy brittle", price: 6.0, categoryId: "cat-4", stock: 80, tags: [], dietary: [], published: true, featured: true, images: [], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
      { id: "oi-103", orderId: "ord-002", productId: "p7", product: { id: "p7", name: "Granola Bites", slug: "granola-bites", description: "Healthy granola", price: 5.5, categoryId: "cat-7", stock: 100, tags: [], dietary: [], published: true, featured: false, images: [], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 5.5, totalPrice: 5.5 },
    ],
    timeline: [
      { id: "tl-4", orderId: "ord-002", status: "PENDING", note: "Order placed", changedBy: "System", createdAt: "2026-01-28T14:30:00Z" },
      { id: "tl-5", orderId: "ord-002", status: "DELIVERED", note: "Delivered to customer", changedBy: "Admin User", createdAt: "2026-01-29T10:00:00Z" },
    ],
    createdAt: "2026-01-28T14:30:00Z",
    updatedAt: "2026-01-29T10:00:00Z",
  },
  {
    id: "ord-003",
    orderNumber: "ZG-B5C6-D7E8",
    userId: "u2",
    user: { id: "u2", email: "amina.okafor@example.com", name: "Amina Okafor", phone: "+2348098765432", role: "CUSTOMER", avatar: null, createdAt: "2025-08-20T10:00:00Z" },
    status: "CONFIRMED",
    subtotal: 42.0,
    deliveryFee: 0,
    discount: 6.3,
    total: 35.7,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "45 Abuja Crescent, Wuse 2",
    city: "Abuja",
    phone: "+2348098765432",
    items: [
      { id: "oi-104", orderId: "ord-003", productId: "p2", product: { id: "p2", name: "Coconut Cookies", slug: "coconut-cookies", description: "Soft coconut cookies", price: 7.5, categoryId: "cat-2", stock: 200, tags: [], dietary: [], published: true, featured: false, images: [{ id: "img-2", productId: "p2", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", publicId: "c2", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 3, unitPrice: 7.5, totalPrice: 22.5 },
      { id: "oi-105", orderId: "ord-003", productId: "p5", product: { id: "p5", name: "Classic Meat Pie", slug: "classic-meat-pie", description: "Flaky meat pie", price: 9.0, categoryId: "cat-3", stock: 45, tags: [], dietary: [], published: true, featured: true, images: [{ id: "img-5", productId: "p5", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "c5", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 9.0, totalPrice: 9.0 },
    ],
    timeline: [
      { id: "tl-6", orderId: "ord-003", status: "PENDING", note: "Order placed", changedBy: "System", createdAt: "2026-02-22T11:15:00Z" },
      { id: "tl-7", orderId: "ord-003", status: "CONFIRMED", note: "Payment confirmed", changedBy: "System", createdAt: "2026-02-22T11:20:00Z" },
    ],
    createdAt: "2026-02-22T11:15:00Z",
    updatedAt: "2026-02-22T11:20:00Z",
  },
  {
    id: "ord-004",
    orderNumber: "ZG-F9G0-H1I2",
    userId: "u3",
    user: { id: "u3", email: "chidi.eze@example.com", name: "Chidi Eze", phone: "+2349011223344", role: "CUSTOMER", avatar: null, createdAt: "2025-09-10T10:00:00Z" },
    status: "DELIVERED",
    subtotal: 24.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 27.99,
    paymentStatus: "PAID",
    deliveryType: "PICKUP",
    phone: "+2349011223344",
    items: [
      { id: "oi-107", orderId: "ord-004", productId: "p4", product: { id: "p4", name: "Oatmeal Raisin Cookies", slug: "oatmeal-raisin-cookies", description: "Soft oatmeal cookies", price: 6.0, categoryId: "cat-2", stock: 70, tags: [], dietary: ["Vegetarian"], published: true, featured: false, images: [{ id: "img-4", productId: "p4", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", publicId: "c4", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 4, unitPrice: 6.0, totalPrice: 24.0 },
    ],
    timeline: [
      { id: "tl-8", orderId: "ord-004", status: "PENDING", note: "Order placed", changedBy: "System", createdAt: "2026-01-15T09:45:00Z" },
      { id: "tl-9", orderId: "ord-004", status: "DELIVERED", note: "Picked up by customer", changedBy: "Admin User", createdAt: "2026-01-15T14:00:00Z" },
    ],
    createdAt: "2026-01-15T09:45:00Z",
    updatedAt: "2026-01-15T14:00:00Z",
  },
  {
    id: "ord-005",
    orderNumber: "ZG-J3K4-L5M6",
    userId: "u1",
    user: { id: "u1", email: "john.adeyemi@example.com", name: "John Adeyemi", phone: "+2348012345678", role: "CUSTOMER", avatar: null, createdAt: "2025-06-15T10:00:00Z" },
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
      { id: "oi-108", orderId: "ord-005", productId: "p6", product: { id: "p6", name: "Caramel Popcorn", slug: "caramel-popcorn", description: "Sweet caramel popcorn", price: 11.0, categoryId: "cat-6", stock: 60, tags: [], dietary: [], published: true, featured: false, images: [], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 11.0, totalPrice: 11.0 },
      { id: "oi-109", orderId: "ord-005", productId: "p10", product: { id: "p10", name: "Fruit Juice Box", slug: "fruit-juice-box", description: "Fresh fruit juice", price: 4.0, categoryId: "cat-8", stock: 200, tags: [], dietary: [], published: true, featured: false, images: [], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 4.0, totalPrice: 4.0 },
    ],
    timeline: [
      { id: "tl-10", orderId: "ord-005", status: "PENDING", note: "Order placed", changedBy: "System", createdAt: "2025-12-20T16:20:00Z" },
      { id: "tl-11", orderId: "ord-005", status: "CANCELLED", note: "Cancelled by customer", changedBy: "System", createdAt: "2025-12-21T08:00:00Z" },
    ],
    createdAt: "2025-12-20T16:20:00Z",
    updatedAt: "2025-12-21T08:00:00Z",
  },
  {
    id: "ord-006",
    orderNumber: "ZG-N7O8-P9Q0",
    userId: "u2",
    user: { id: "u2", email: "amina.okafor@example.com", name: "Amina Okafor", phone: "+2348098765432", role: "CUSTOMER", avatar: null, createdAt: "2025-08-20T10:00:00Z" },
    status: "DELIVERED",
    subtotal: 56.0,
    deliveryFee: 0,
    discount: 8.4,
    total: 47.6,
    paymentStatus: "PAID",
    deliveryType: "DELIVERY",
    address: "45 Abuja Crescent, Wuse 2",
    city: "Abuja",
    phone: "+2348098765432",
    items: [
      { id: "oi-110", orderId: "ord-006", productId: "p1", product: { id: "p1", name: "Spicy Plantain Chips", slug: "spicy-plantain-chips", description: "Crispy plantain chips", price: 8.5, categoryId: "cat-1", stock: 150, tags: [], dietary: [], published: true, featured: true, images: [{ id: "img-1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "c1", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 2, unitPrice: 8.5, totalPrice: 17.0 },
      { id: "oi-111", orderId: "ord-006", productId: "p5", product: { id: "p5", name: "Classic Meat Pie", slug: "classic-meat-pie", description: "Flaky meat pie", price: 9.0, categoryId: "cat-3", stock: 45, tags: [], dietary: [], published: true, featured: true, images: [{ id: "img-5", productId: "p5", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "c5", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 2, unitPrice: 9.0, totalPrice: 18.0 },
      { id: "oi-112", orderId: "ord-006", productId: "p8", product: { id: "p8", name: "Mixed Nut Pack", slug: "mixed-nut-pack", description: "Premium mixed nuts", price: 13.0, categoryId: "cat-4", stock: 90, tags: [], dietary: ["Vegan"], published: true, featured: false, images: [], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 13.0, totalPrice: 13.0 },
    ],
    timeline: [
      { id: "tl-12", orderId: "ord-006", status: "PENDING", note: "Order placed", changedBy: "System", createdAt: "2025-11-30T13:00:00Z" },
      { id: "tl-13", orderId: "ord-006", status: "DELIVERED", note: "Delivered", changedBy: "Admin User", createdAt: "2025-12-01T09:00:00Z" },
    ],
    createdAt: "2025-11-30T13:00:00Z",
    updatedAt: "2025-12-01T09:00:00Z",
  },
  {
    id: "ord-007",
    orderNumber: "ZG-R1S2-T3U4",
    userId: "u4",
    user: { id: "u4", email: "fatima.bello@example.com", name: "Fatima Bello", phone: "+2348055667788", role: "CUSTOMER", avatar: null, createdAt: "2025-10-05T10:00:00Z" },
    status: "PENDING",
    subtotal: 33.0,
    deliveryFee: 3.99,
    discount: 0,
    total: 36.99,
    paymentStatus: "PENDING",
    deliveryType: "DELIVERY",
    address: "8 Kano Road, Sabon Gari",
    city: "Kano",
    phone: "+2348055667788",
    items: [
      { id: "oi-113", orderId: "ord-007", productId: "p2", product: { id: "p2", name: "Coconut Cookies", slug: "coconut-cookies", description: "Soft coconut cookies", price: 7.5, categoryId: "cat-2", stock: 200, tags: [], dietary: [], published: true, featured: false, images: [{ id: "img-2", productId: "p2", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", publicId: "c2", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 2, unitPrice: 7.5, totalPrice: 15.0 },
      { id: "oi-114", orderId: "ord-007", productId: "p3", product: { id: "p3", name: "Honey Cashew Brittle", slug: "honey-cashew-brittle", description: "Crunchy brittle", price: 12.0, categoryId: "cat-4", stock: 80, tags: [], dietary: [], published: true, featured: true, images: [{ id: "img-3", productId: "p3", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "c3", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 12.0, totalPrice: 12.0 },
    ],
    timeline: [
      { id: "tl-14", orderId: "ord-007", status: "PENDING", note: "Order placed", changedBy: "System", createdAt: "2026-02-23T08:15:00Z" },
    ],
    createdAt: "2026-02-23T08:15:00Z",
    updatedAt: "2026-02-23T08:15:00Z",
  },
  {
    id: "ord-008",
    orderNumber: "ZG-V5W6-X7Y8",
    userId: "u3",
    user: { id: "u3", email: "chidi.eze@example.com", name: "Chidi Eze", phone: "+2349011223344", role: "CUSTOMER", avatar: null, createdAt: "2025-09-10T10:00:00Z" },
    status: "READY",
    subtotal: 19.0,
    deliveryFee: 0,
    discount: 0,
    total: 19.0,
    paymentStatus: "PAID",
    deliveryType: "PICKUP",
    phone: "+2349011223344",
    items: [
      { id: "oi-115", orderId: "ord-008", productId: "p1", product: { id: "p1", name: "Spicy Plantain Chips", slug: "spicy-plantain-chips", description: "Crispy plantain chips", price: 8.5, categoryId: "cat-1", stock: 150, tags: [], dietary: [], published: true, featured: true, images: [{ id: "img-1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "c1", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 8.5, totalPrice: 8.5 },
      { id: "oi-116", orderId: "ord-008", productId: "p4", product: { id: "p4", name: "Oatmeal Raisin Cookies", slug: "oatmeal-raisin-cookies", description: "Soft oatmeal cookies", price: 5.5, categoryId: "cat-2", stock: 70, tags: [], dietary: ["Vegetarian"], published: true, featured: false, images: [{ id: "img-4", productId: "p4", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", publicId: "c4", position: 0 }], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 5.5, totalPrice: 5.5 },
      { id: "oi-117", orderId: "ord-008", productId: "p10", product: { id: "p10", name: "Fruit Juice Box", slug: "fruit-juice-box", description: "Fresh fruit juice", price: 5.0, categoryId: "cat-8", stock: 200, tags: [], dietary: [], published: true, featured: false, images: [], createdAt: "2025-10-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" }, quantity: 1, unitPrice: 5.0, totalPrice: 5.0 },
    ],
    timeline: [
      { id: "tl-15", orderId: "ord-008", status: "PENDING", note: "Order placed", changedBy: "System", createdAt: "2026-02-22T16:00:00Z" },
      { id: "tl-16", orderId: "ord-008", status: "CONFIRMED", note: "Payment confirmed", changedBy: "System", createdAt: "2026-02-22T16:05:00Z" },
      { id: "tl-17", orderId: "ord-008", status: "PREPARING", note: "Preparing order", changedBy: "Admin User", createdAt: "2026-02-22T16:30:00Z" },
      { id: "tl-18", orderId: "ord-008", status: "READY", note: "Ready for pickup", changedBy: "Admin User", createdAt: "2026-02-22T17:00:00Z" },
    ],
    createdAt: "2026-02-22T16:00:00Z",
    updatedAt: "2026-02-22T17:00:00Z",
  },
];

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

/* ── Seed demo orders if collection is empty ─────────────────────────── */

async function seedDemoOrders() {
  try {
    const snap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (snap.empty) {
      console.log("[orderStore] Seeding demo orders to Firestore...");
      const writes = demoOrders.map((o) =>
        setDoc(doc(db, ORDERS_COLLECTION, o.id), o)
      );
      await Promise.all(writes);
    }
  } catch (error) {
    console.error("[orderStore] Failed to seed demo orders:", error);
  }
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

    // Seed demo orders first (no-op if collection already has docs)
    seedDemoOrders();

    onSnapshot(
      collection(db, ORDERS_COLLECTION),
      (snapshot) => {
        const orders = snapshot.docs.map((d) => {
          const data = d.data() as Order;
          return {
            ...data,
            id: d.id,
            items: data.items ?? [],
            timeline: data.timeline ?? [],
          };
        });
        // Sort newest first (done in JS instead of Firestore orderBy to avoid index issues)
        orders.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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
