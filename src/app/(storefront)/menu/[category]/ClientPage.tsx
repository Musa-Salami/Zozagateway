"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const products = useProductStore((s) => s.products);
  const hasHydrated = useProductStore((s) => s._hasHydrated);
  const getCategoryBySlug = useCategoryStore((s) => s.getCategoryBySlug);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const cat = getCategoryBySlug(category);
  const categoryName = cat?.name ?? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryProducts = products.filter(
    (p) => p.category?.slug === category || p.categoryId === cat?.id
  );

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
          {categoryProducts.length > 0
            ? `Browse all ${categoryProducts.length} products in ${categoryName.toLowerCase()}`
            : `No products found in ${categoryName.toLowerCase()}`}
        </p>
      </div>

      {/* Products */}
      <ProductGrid products={categoryProducts} />

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