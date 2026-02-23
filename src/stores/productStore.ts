"use client";

import { create } from "zustand";
import type { Product, Category } from "@/types";

/* ── Categories ──────────────────────────────────────────────────────── */

export const CATEGORIES: Category[] = [
  { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1, _count: { products: 0 } },
  { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2, _count: { products: 0 } },
  { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3, _count: { products: 0 } },
  { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4, _count: { products: 0 } },
  { id: "cat-5", name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5, _count: { products: 0 } },
  { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6, _count: { products: 0 } },
  { id: "cat-7", name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7, _count: { products: 0 } },
  { id: "cat-8", name: "Beverages", slug: "beverages", sortOrder: 8, _count: { products: 0 } },
];

/* ── Default Products ────────────────────────────────────────────────── */

const defaultProducts: Product[] = [
  {
    id: "p1", name: "Honey BBQ Kettle Chips", slug: "honey-bbq-kettle-chips",
    description: "Thick-cut kettle chips with a smoky honey BBQ glaze. Perfectly crunchy and irresistibly sweet-savory.",
    price: 4.99, comparePrice: 6.99, categoryId: "cat-1",
    category: CATEGORIES[0], stock: 120, sku: "ZG-001",
    tags: ["bestseller", "crunchy"], dietary: ["Gluten-Free"],
    published: true, featured: true,
    images: [{ id: "img-1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "c1", position: 0 }],
    averageRating: 4.7, reviewCount: 89,
    createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "p2", name: "Sea Salt & Vinegar Crisps", slug: "sea-salt-vinegar-crisps",
    description: "Tangy and crispy with the perfect amount of salt.",
    price: 3.99, categoryId: "cat-1",
    category: CATEGORIES[0], stock: 95, sku: "ZG-002",
    tags: ["tangy"], dietary: ["Gluten-Free", "Vegan"],
    published: true, featured: false,
    images: [{ id: "img-2", productId: "p2", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", publicId: "c2", position: 0 }],
    averageRating: 4.4, reviewCount: 56,
    createdAt: "2025-07-10T10:00:00Z", updatedAt: "2025-12-05T10:00:00Z",
  },
  {
    id: "p3", name: "Double Chocolate Cookies", slug: "double-chocolate-cookies",
    description: "Rich, chewy cookies loaded with dark and milk chocolate chunks. Baked fresh daily.",
    price: 6.49, categoryId: "cat-2",
    category: CATEGORIES[1], stock: 85, sku: "ZG-003",
    tags: ["fresh-baked", "chocolate"], dietary: [],
    published: true, featured: true,
    images: [{ id: "img-3", productId: "p3", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", publicId: "c3", position: 0 }],
    averageRating: 4.9, reviewCount: 124,
    createdAt: "2025-05-15T10:00:00Z", updatedAt: "2025-11-20T10:00:00Z",
  },
  {
    id: "p4", name: "Oatmeal Raisin Cookies", slug: "oatmeal-raisin-cookies",
    description: "Soft oatmeal cookies with plump raisins and a hint of cinnamon.",
    price: 5.49, categoryId: "cat-2",
    category: CATEGORIES[1], stock: 70, sku: "ZG-004",
    tags: ["wholesome"], dietary: ["Vegetarian"],
    published: true, featured: false,
    images: [{ id: "img-4", productId: "p4", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", publicId: "c4", position: 0 }],
    averageRating: 4.2, reviewCount: 33,
    createdAt: "2025-08-05T10:00:00Z", updatedAt: "2025-12-02T10:00:00Z",
  },
  {
    id: "p5", name: "Classic Meat Pie", slug: "classic-meat-pie",
    description: "Flaky golden pastry filled with seasoned minced meat and savory gravy. A comforting snack.",
    price: 5.99, comparePrice: 7.49, categoryId: "cat-3",
    category: CATEGORIES[2], stock: 45, sku: "ZG-005",
    tags: ["comfort-food", "savory"], dietary: [],
    published: true, featured: true,
    images: [{ id: "img-5", productId: "p5", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "c5", position: 0 }],
    averageRating: 4.5, reviewCount: 67,
    createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-10T10:00:00Z",
  },
  {
    id: "p6", name: "Spinach Puff Pastry", slug: "spinach-puff-pastry",
    description: "Light and flaky puff pastry stuffed with creamy spinach and feta.",
    price: 4.49, categoryId: "cat-3",
    category: CATEGORIES[2], stock: 55, sku: "ZG-006",
    tags: ["vegetarian"], dietary: ["Vegetarian"],
    published: true, featured: false,
    images: [{ id: "img-6", productId: "p6", url: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400", publicId: "c6", position: 0 }],
    averageRating: 4.1, reviewCount: 22,
    createdAt: "2025-09-15T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "p7", name: "Honey Roasted Almonds", slug: "honey-roasted-almonds",
    description: "Premium almonds roasted with a touch of honey and sea salt. Perfect on-the-go snack.",
    price: 8.99, categoryId: "cat-4",
    category: CATEGORIES[3], stock: 200, sku: "ZG-007",
    tags: ["healthy", "protein"], dietary: ["Gluten-Free", "Vegan"],
    published: true, featured: true,
    images: [{ id: "img-7", productId: "p7", url: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400", publicId: "c7", position: 0 }],
    averageRating: 4.8, reviewCount: 52,
    createdAt: "2025-06-20T10:00:00Z", updatedAt: "2025-11-30T10:00:00Z",
  },
  {
    id: "p8", name: "Trail Mix Energy Pack", slug: "trail-mix-energy-pack",
    description: "A power-packed mix of nuts, seeds, dried fruits, and dark chocolate.",
    price: 9.49, comparePrice: 11.99, categoryId: "cat-4",
    category: CATEGORIES[3], stock: 110, sku: "ZG-008",
    tags: ["energy", "protein"], dietary: ["Gluten-Free", "Vegan"],
    published: true, featured: false,
    images: [{ id: "img-8", productId: "p8", url: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400", publicId: "c8", position: 0 }],
    averageRating: 4.7, reviewCount: 48,
    createdAt: "2025-10-01T10:00:00Z", updatedAt: "2025-12-11T10:00:00Z",
  },
  {
    id: "p9", name: "Gummy Bear Mix", slug: "gummy-bear-mix",
    description: "A rainbow assortment of soft, fruity gummy bears. Fun for kids and adults alike.",
    price: 3.49, comparePrice: 4.99, categoryId: "cat-5",
    category: CATEGORIES[4], stock: 300, sku: "ZG-009",
    tags: ["fruity", "kids-favorite"], dietary: [],
    published: true, featured: true,
    images: [{ id: "img-9", productId: "p9", url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400", publicId: "c9", position: 0 }],
    averageRating: 4.3, reviewCount: 38,
    createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-05T10:00:00Z",
  },
  {
    id: "p10", name: "Caramel Popcorn Tub", slug: "caramel-popcorn-tub",
    description: "Generously coated caramel popcorn made with real butter and brown sugar. Movie night essential.",
    price: 5.49, categoryId: "cat-6",
    category: CATEGORIES[5], stock: 150, sku: "ZG-010",
    tags: ["movie-night", "sweet"], dietary: ["Gluten-Free"],
    published: true, featured: true,
    images: [{ id: "img-10", productId: "p10", url: "https://images.unsplash.com/photo-1585735675361-115f1f537af5?w=400", publicId: "c10", position: 0 }],
    averageRating: 4.6, reviewCount: 73,
    createdAt: "2025-05-10T10:00:00Z", updatedAt: "2025-11-15T10:00:00Z",
  },
  {
    id: "p11", name: "Kale & Quinoa Bites", slug: "kale-quinoa-bites",
    description: "Crispy baked bites with superfoods kale and quinoa. A guilt-free snack packed with nutrition.",
    price: 7.99, comparePrice: 9.99, categoryId: "cat-7",
    category: CATEGORIES[6], stock: 90, sku: "ZG-011",
    tags: ["superfood", "organic"], dietary: ["Vegan", "Gluten-Free"],
    published: true, featured: true,
    images: [{ id: "img-11", productId: "p11", url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", publicId: "c11", position: 0 }],
    averageRating: 4.4, reviewCount: 29,
    createdAt: "2025-09-01T10:00:00Z", updatedAt: "2025-12-12T10:00:00Z",
  },
  {
    id: "p12", name: "Fresh Mango Smoothie", slug: "fresh-mango-smoothie",
    description: "Tropical mango smoothie blended with yogurt and a hint of lime. Refreshingly delicious.",
    price: 4.99, categoryId: "cat-8",
    category: CATEGORIES[7], stock: 60, sku: "ZG-012",
    tags: ["tropical", "refreshing"], dietary: ["Vegetarian"],
    published: true, featured: true,
    images: [{ id: "img-12", productId: "p12", url: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400", publicId: "c12", position: 0 }],
    averageRating: 4.6, reviewCount: 41,
    createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-08T10:00:00Z",
  },
];

/* ── Store Interface ─────────────────────────────────────────────────── */

interface ProductStore {
  products: Product[];
  addProduct: (data: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt" | "averageRating" | "reviewCount">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

/* ── Helper ──────────────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ── Store (NO persist → no hydration issues) ────────────────────────── */

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: defaultProducts,

  addProduct: (data) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: `p-${Date.now()}`,
      slug: slugify(data.name),
      averageRating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    set({ products: [newProduct, ...get().products] });
  },

  updateProduct: (id, data) => {
    set({
      products: get().products.map((p) =>
        p.id === id
          ? { ...p, ...data, slug: data.name ? slugify(data.name) : p.slug, updatedAt: new Date().toISOString() }
          : p
      ),
    });
  },

  deleteProduct: (id) => {
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  duplicateProduct: (id) => {
    const original = get().products.find((p) => p.id === id);
    if (!original) return;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...original,
      id: `p-${Date.now()}`,
      name: `${original.name} (Copy)`,
      slug: slugify(`${original.name}-copy-${Date.now()}`),
      sku: original.sku ? `${original.sku}-COPY` : undefined,
      published: false,
      featured: false,
      averageRating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    set({ products: [newProduct, ...get().products] });
  },

  getProduct: (id) => get().products.find((p) => p.id === id),
}));
