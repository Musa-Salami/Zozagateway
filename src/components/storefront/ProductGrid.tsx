"use client";

import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  className,
}: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton count={skeletonCount} className={className} />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
        actionLabel="View All Products"
        actionHref="/menu"
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
