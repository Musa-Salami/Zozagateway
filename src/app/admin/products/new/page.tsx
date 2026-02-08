"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Category, ProductImage } from "@/types";

// ── Demo Data ──────────────────────────────────────────────────────────────

const sampleCategories: Category[] = [
  { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
  { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
  { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3 },
  { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4 },
  { id: "cat-5", name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5 },
  { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6 },
  { id: "cat-7", name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7 },
  { id: "cat-8", name: "Beverages", slug: "beverages", sortOrder: 8 },
];

// ── Page Component ──────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Record<string, unknown>, images: ProductImage[]) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success("Product created successfully!", {
      description: `"${data.name}" has been added to your store.`,
    });
    router.push("/admin/products");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/admin" className="transition-colors hover:text-foreground">
          Dashboard
        </Link>
        <span className="mx-1">/</span>
        <Link href="/admin/products" className="transition-colors hover:text-foreground">
          Products
        </Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Add New</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>

      {/* Form */}
      <ProductForm
        categories={sampleCategories}
        onSubmit={handleSubmit as any}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
