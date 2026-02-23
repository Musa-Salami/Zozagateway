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
import type { Category } from "@/types";

/* ── Default Categories (seeded to Firestore on first run) ───────────── */

const defaultCategories: Category[] = [
  { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1, _count: { products: 0 } },
  { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2, _count: { products: 0 } },
  { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3, _count: { products: 0 } },
  { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4, _count: { products: 0 } },
  { id: "cat-5", name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5, _count: { products: 0 } },
  { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6, _count: { products: 0 } },
  { id: "cat-7", name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7, _count: { products: 0 } },
  { id: "cat-8", name: "Beverages", slug: "beverages", sortOrder: 8, _count: { products: 0 } },
];

/* ── Store Interface ─────────────────────────────────────────────────── */

interface CategoryStore {
  categories: Category[];
  _hasHydrated: boolean;

  addCategory: (data: { name: string; image?: string; sortOrder: number }) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categories: Category[]) => Promise<void>;
  getCategory: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;

  _initListener: () => void;
}

/* ── Helper ──────────────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ── Firestore collection ────────────────────────────────────────────── */

const CATEGORIES_COLLECTION = "categories";

/* ── Seed defaults if collection is empty ────────────────────────────── */

async function seedDefaultCategories() {
  try {
    const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (snap.empty) {
      console.log("[categoryStore] Seeding default categories to Firestore...");
      const writes = defaultCategories.map((c) =>
        setDoc(doc(db, CATEGORIES_COLLECTION, c.id), c)
      );
      await Promise.all(writes);
    }
  } catch (error) {
    console.error("[categoryStore] Failed to seed defaults:", error);
  }
}

/* ── Guard against duplicate listener init ───────────────────────────── */

let _listenerInitialized = false;

/* ── Store (Firestore-backed) ────────────────────────────────────────── */

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
  categories: [],
  _hasHydrated: false,

  _initListener: () => {
    if (_listenerInitialized) return;
    _listenerInitialized = true;

    // Seed defaults first, then start real-time listener.
    seedDefaultCategories().then(() => {
      onSnapshot(
        collection(db, CATEGORIES_COLLECTION),
        (snapshot) => {
          const categories = snapshot.docs.map((d) => ({
            ...d.data(),
            id: d.id,
          })) as Category[];
          // Sort by sortOrder
          categories.sort((a, b) => a.sortOrder - b.sortOrder);
          set({ categories, _hasHydrated: true });
        },
        (error) => {
          console.error("[categoryStore] Firestore listener error:", error);
          // Don't fall back to hardcoded data — Firestore offline cache
          // will serve the last-known data. Just mark as hydrated.
          set({ _hasHydrated: true });
        }
      );
    });
  },

  addCategory: async (data) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: data.name,
      slug: slugify(data.name),
      image: data.image || undefined,
      sortOrder: data.sortOrder,
      _count: { products: 0 },
    };
    // Optimistic update
    set({ categories: [...get().categories, newCategory].sort((a, b) => a.sortOrder - b.sortOrder) });
    try {
      await setDoc(doc(db, CATEGORIES_COLLECTION, newCategory.id), newCategory);
    } catch (error) {
      console.error("[categoryStore] Failed to add category:", error);
    }
  },

  updateCategory: async (id, data) => {
    const updated = {
      ...data,
      slug: data.name ? slugify(data.name) : undefined,
    };
    const cleanUpdate = Object.fromEntries(
      Object.entries(updated).filter(([, v]) => v !== undefined)
    );

    // Optimistic update
    set({
      categories: get().categories
        .map((c) => (c.id === id ? { ...c, ...cleanUpdate } : c))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    });

    try {
      await updateDoc(doc(db, CATEGORIES_COLLECTION, id), cleanUpdate);
    } catch (error) {
      console.error("[categoryStore] Failed to update category:", error);
    }
  },

  deleteCategory: async (id) => {
    set({ categories: get().categories.filter((c) => c.id !== id) });
    try {
      await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
    } catch (error) {
      console.error("[categoryStore] Failed to delete category:", error);
    }
  },

  reorderCategories: async (reorderedCategories) => {
    set({ categories: reorderedCategories });
    try {
      const writes = reorderedCategories.map((c) =>
        updateDoc(doc(db, CATEGORIES_COLLECTION, c.id), { sortOrder: c.sortOrder })
      );
      await Promise.all(writes);
    } catch (error) {
      console.error("[categoryStore] Failed to reorder:", error);
    }
  },

  getCategory: (id) => get().categories.find((c) => c.id === id),
  getCategoryBySlug: (slug) => get().categories.find((c) => c.slug === slug),
}));

/* ── Auto-start listener in the browser ──────────────────────────────── */

if (typeof window !== "undefined") {
  useCategoryStore.getState()._initListener();
}
