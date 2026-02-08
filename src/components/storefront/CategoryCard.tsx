"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const emoji = CATEGORIES_ICONS[category.slug] || "📦";
  const productCount = category._count?.products ?? 0;

  return (
    <Link href={`/menu/${category.slug}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn("group", className)}
      >
        <Card className="overflow-hidden border transition-all hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800">
          <CardContent className="relative flex flex-col items-center justify-center p-6 text-center">
            {/* Category Image or Emoji */}
            {category.image ? (
              <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full bg-brand-50 dark:bg-brand-950/30">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-4xl transition-transform duration-300 group-hover:scale-110 dark:bg-brand-950/30">
                {emoji}
              </div>
            )}

            {/* Name */}
            <h3 className="font-semibold text-sm text-foreground group-hover:text-brand-500 transition-colors">
              {category.name}
            </h3>

            {/* Product Count */}
            <p className="mt-1 text-xs text-muted-foreground">
              {productCount} {productCount === 1 ? "product" : "products"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
