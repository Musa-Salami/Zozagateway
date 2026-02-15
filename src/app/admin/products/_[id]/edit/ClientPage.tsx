"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product, Category, ProductImage } from "@/types";

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

const sampleProduct: Product = {
  id: "p1",
  name: "Spicy Plantain Chips",
  slug: "spicy-plantain-chips",
  description: "Crispy plantain chips with a fiery spicy kick. Made from locally sourced plantains, sliced thin and fried to golden perfection. Each batch is seasoned with our signature blend of chili peppers and spices.",
  price: 8.5,
  comparePrice: 10.0,
  categoryId: "cat-1",
  stock: 150,
  sku: "ZG-001",
  tags: ["spicy", "popular", "bestseller"],
  dietary: ["vegan", "gluten-free"],
  published: true,
  featured: true,
  images: [
    { id: "img-1", productId: "p1", url: "https://placehold.co/400x400/F97316/fff?text=Plantain+Chips+1", publicId: "img-1", position: 0 },
    { id: "img-2", productId: "p1", url: "https://placehold.co/400x400/EA580C/fff?text=Plantain+Chips+2", publicId: "img-2", position: 1 },
  ],
  averageRating: 4.5,
  reviewCount: 32,
  createdAt: "2025-10-01T00:00:00Z",
  updatedAt: "2026-01-15T00:00:00Z",
};

// ── Page Component ──────────────────────────────────────────────────────────

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const productId = params.id as string;
  const product = useProductStore((s) => s.products.find((p) => p.id === productId));
  const storeUpdate = useProductStore((s) => s.updateProduct);
  const storeDelete = useProductStore((s) => s.deleteProduct);

  const handleSubmit = async (data: Record<string, unknown>, images: ProductImage[]) => {
    setIsLoading(true);
    const category = CATEGORIES.find((c) => c.id === data.categoryId);
    storeUpdate(productId, {
      name: data.name as string,
      description: (data.description as string) || "",
      price: Number(data.price) || 0,
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      categoryId: (data.categoryId as string) || "",
      category: category || undefined,
      stock: Number(data.stock) || 0,
      sku: (data.sku as string) || undefined,
      tags: (data.tags as string[]) || [],
      dietary: (data.dietary as string[]) || [],
      published: Boolean(data.published),
      featured: Boolean(data.featured),
      images: images || [],
    });
    setIsLoading(false);
    toast.success("Product updated successfully!", {
      description: `"${data.name}" has been updated.`,
    });
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    storeDelete(productId);
    toast.success("Product deleted", {
      description: `Product has been removed from your store.`,
    });
    router.push("/admin/products");
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold">Product not found</h2>
        <p className="text-muted-foreground mt-2">The product you&#39;re looking for doesn&#39;t exist.</p>
        <Button className="mt-4" asChild><Link href="/admin/products">Back to Products</Link></Button>
      </div>
    );
  }

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
        <span className="text-foreground">Edit</span>
      </nav>

      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
      </div>

      {/* Form */}
      <ProductForm
        initialData={product}
        categories={CATEGORIES}
        onSubmit={handleSubmit as any}
        isLoading={isLoading}
      />

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-500/20 dark:bg-red-500/5">
        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
        <p className="mt-1 text-sm text-red-600/80">
          Once you delete a product, there is no going back. Please be certain.
        </p>
        <Button
          variant="destructive"
          className="mt-4 gap-1.5"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Product
        </Button>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &quot;{product.name}&quot;?</DialogTitle>
            <DialogDescription>
              This will permanently remove the product and all its data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
