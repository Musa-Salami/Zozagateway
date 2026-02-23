"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";
import { useCartStore } from "@/stores/cartStore";
import { useProductView } from "@/components/storefront/ProductViewProvider";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { openProduct } = useProductView();

  const primaryImage =
    product.images?.[0]?.url || "/images/placeholder-product.png";
  const hasDiscount =
    product.comparePrice != null && product.comparePrice > product.price;

  const handleCardClick = () => {
    openProduct(product);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("group cursor-pointer", className)}
    >
      <Card className="overflow-hidden border transition-shadow hover:shadow-lg" onClick={handleCardClick}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white">
              {Math.round(
                ((product.comparePrice! - product.price) /
                  product.comparePrice!) *
                  100
              )}
              % OFF
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-3 right-3 bg-brand-500 hover:bg-brand-600 text-white">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Category */}
          {product.category && (
            <Badge variant="secondary" className="text-[10px] font-medium">
              {product.category.name}
            </Badge>
          )}

          {/* Name */}
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-brand-500 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating != null && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.averageRating} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount ?? 0})
              </span>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-brand-500">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); addItem(product); }}
              className="bg-brand-500 hover:bg-brand-600 text-white"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
