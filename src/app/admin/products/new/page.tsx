"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProductStore, CATEGORIES } from "@/stores/productStore";
import type { ProductImage } from "@/types";

// ── Page Component ──────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const addProduct = useProductStore((s) => s.addProduct);

  const handleSubmit = async (data: Record<string, unknown>, images: ProductImage[]) => {
    setIsLoading(true);
    const category = CATEGORIES.find((c) => c.id === data.categoryId);
    addProduct({
      name: data.name as string,
      description: (data.description as string) || "",
      price: Number(data.price) || 0,
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      categoryId: (data.categoryId as string) || "",
      category: category || CATEGORIES[0],
      stock: Number(data.stock) || 0,
      sku: (data.sku as string) || undefined,
      tags: (data.tags as string[]) || [],
      dietary: (data.dietary as string[]) || [],
      published: Boolean(data.published),
      featured: Boolean(data.featured),
      images: images || [],
    });
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
        categories={CATEGORIES}
        onSubmit={handleSubmit as any}
        isLoading={isLoading}
        onCancel={() => router.push("/admin/products")}
      />
    </motion.div>
  );
}
