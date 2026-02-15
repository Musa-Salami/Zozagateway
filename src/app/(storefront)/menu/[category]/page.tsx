"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import type { Product } from "@/types";

// -- Sample products keyed by category slug --
const productsByCategory: Record<string, Product[]> = {
  "chips-crisps": [
    {
      id: "p1", name: "Honey BBQ Kettle Chips", slug: "honey-bbq-kettle-chips",
      description: "Thick-cut kettle chips with a smoky honey BBQ glaze.",
      price: 4.99, comparePrice: 6.99, categoryId: "cat-1",
      category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
      stock: 120, tags: ["bestseller"], dietary: ["Gluten-Free"],
      published: true, featured: true,
      images: [{ id: "i1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "c1", position: 0 }],
      averageRating: 4.7, reviewCount: 89, createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
    },
    {
      id: "p2", name: "Sea Salt & Vinegar Crisps", slug: "sea-salt-vinegar-crisps",
      description: "Tangy and crispy with the perfect amount of salt.",
      price: 3.99, comparePrice: null, categoryId: "cat-1",
      category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
      stock: 95, tags: ["tangy"], dietary: ["Gluten-Free", "Vegan"],
      published: true, featured: false,
      images: [{ id: "i2", productId: "p2", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", publicId: "c2", position: 0 }],
      averageRating: 4.4, reviewCount: 56, createdAt: "2025-07-10T10:00:00Z", updatedAt: "2025-12-05T10:00:00Z",
    },
  ],
  "cookies-biscuits": [
    {
      id: "p3", name: "Double Chocolate Cookies", slug: "double-chocolate-cookies",
      description: "Rich, chewy cookies loaded with dark and milk chocolate chunks.",
      price: 6.49, comparePrice: null, categoryId: "cat-2",
      category: { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
      stock: 85, tags: ["fresh-baked"], dietary: [],
      published: true, featured: true,
      images: [{ id: "i3", productId: "p3", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", publicId: "c3", position: 0 }],
      averageRating: 4.9, reviewCount: 124, createdAt: "2025-05-15T10:00:00Z", updatedAt: "2025-11-20T10:00:00Z",
    },
    {
      id: "p4", name: "Oatmeal Raisin Cookies", slug: "oatmeal-raisin-cookies",
      description: "Soft oatmeal cookies with plump raisins and a hint of cinnamon.",
      price: 5.49, comparePrice: null, categoryId: "cat-2",
      category: { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
      stock: 70, tags: ["wholesome"], dietary: ["Vegetarian"],
      published: true, featured: false,
      images: [{ id: "i4", productId: "p4", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", publicId: "c4", position: 0 }],
      averageRating: 4.2, reviewCount: 33, createdAt: "2025-08-05T10:00:00Z", updatedAt: "2025-12-02T10:00:00Z",
    },
  ],
  "pastries-pies": [
    {
      id: "p5", name: "Classic Meat Pie", slug: "classic-meat-pie",
      description: "Flaky golden pastry filled with seasoned minced meat and savory gravy.",
      price: 5.99, comparePrice: 7.49, categoryId: "cat-3",
      category: { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3 },
      stock: 45, tags: ["savory"], dietary: [],
      published: true, featured: true,
      images: [{ id: "i5", productId: "p5", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "c5", position: 0 }],
      averageRating: 4.5, reviewCount: 67, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-10T10:00:00Z",
    },
  ],
};

const categoryNameMap: Record<string, string> = {
  "chips-crisps": "Chips & Crisps",
  "cookies-biscuits": "Cookies & Biscuits",
  "pastries-pies": "Pastries & Pies",
  "nuts-trail-mix": "Nuts & Trail Mix",
  "candy-sweets": "Candy & Sweets",
  "popcorn": "Popcorn",
  "healthy-snacks": "Healthy Snacks",
  "beverages": "Beverages",
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const categoryName = categoryNameMap[category] || category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const products = productsByCategory[category] ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-brand-500 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/menu" className="hover:text-brand-500 transition-colors">
          Menu
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{categoryName}</span>
      </nav>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading md:text-4xl">
          {categoryName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse all products in {categoryName.toLowerCase()}
        </p>
      </div>

      {/* Products */}
      <ProductGrid products={products} />

      {/* Back Link */}
      <div className="mt-10 text-center">
        <Link
          href="/menu"
          className="inline-flex items-center text-sm font-medium text-brand-500 hover:underline"
        >
          &larr; Back to Full Menu
        </Link>
      </div>
    </div>
  );
}