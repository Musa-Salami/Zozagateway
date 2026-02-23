"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CATEGORIES_ICONS } from "@/lib/constants";
import { useCategoryStore } from "@/stores/categoryStore";
import { useProductStore } from "@/stores/productStore";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

// ── Page Component ──────────────────────────────────────────────────────────

interface CategoryFormData {
  name: string;
  image: string;
  sortOrder: number;
}

export default function CategoriesPage() {
  const { categories, _hasHydrated, addCategory, updateCategory, deleteCategory, reorderCategories } = useCategoryStore();
  const products = useProductStore((s) => s.products);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    image: "",
    sortOrder: 0,
  });
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  if (!_hasHydrated) {
    return <LoadingSkeleton />;
  }

  // Compute real product counts per category
  const productCountMap = products.reduce<Record<string, number>>((acc, p) => {
    if (p.categoryId) {
      acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
    }
    return acc;
  }, {});

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ name: "", image: "", sortOrder: categories.length + 1 });
    setDialogOpen(true);
  };

  const openEditDialog = (cat: typeof categories[0]) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      image: cat.image ?? "",
      sortOrder: cat.sortOrder,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editingId) {
      await updateCategory(editingId, {
        name: formData.name,
        image: formData.image || undefined,
        sortOrder: formData.sortOrder,
      });
      toast.success("Category updated");
    } else {
      await addCategory({
        name: formData.name,
        image: formData.image || undefined,
        sortOrder: formData.sortOrder,
      });
      toast.success("Category added");
    }

    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    setDeleteDialog(null);
    toast.success("Category deleted");
  };

  const moveCategory = async (id: string, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((c) => c.id === id);

    if (direction === "up" && idx > 0) {
      const temp = sorted[idx].sortOrder;
      sorted[idx] = { ...sorted[idx], sortOrder: sorted[idx - 1].sortOrder };
      sorted[idx - 1] = { ...sorted[idx - 1], sortOrder: temp };
    } else if (direction === "down" && idx < sorted.length - 1) {
      const temp = sorted[idx].sortOrder;
      sorted[idx] = { ...sorted[idx], sortOrder: sorted[idx + 1].sortOrder };
      sorted[idx + 1] = { ...sorted[idx + 1], sortOrder: temp };
    }

    await reorderCategories(sorted.sort((a, b) => a.sortOrder - b.sortOrder));
  };

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories
          </p>
        </div>
        <Button className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedCategories.map((cat, index) => {
          const icon = CATEGORIES_ICONS[cat.slug] ?? "📦";
          const productCount = productCountMap[cat.id] ?? 0;
          return (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                          {icon}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {productCount} products
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order: {cat.sortOrder}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === 0}
                        onClick={() => moveCategory(cat.id, "up")}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === sortedCategories.length - 1}
                        onClick={() => moveCategory(cat.id, "down")}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(cat)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => setDeleteDialog(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Chips & Crisps"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-image">Image URL</Label>
              <Input
                id="cat-image"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://..."
              />
              {formData.image && (
                <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-order">Sort Order</Label>
              <Input
                id="cat-order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sortOrder: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-brand-500 hover:bg-brand-600" onClick={handleSave}>
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? Products in this category will need to be reassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// ── Page Component ──────────────────────────────────────────────────────────

interface CategoryFormData {
  name: string;
  image: string;
  sortOrder: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    image: "",
    sortOrder: 0,
  });
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ name: "", image: "", sortOrder: categories.length + 1 });
    setDialogOpen(true);
  };

  const openEditDialog = (cat: typeof categories[0]) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      image: cat.image ?? "",
      sortOrder: cat.sortOrder,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name: formData.name, image: formData.image || null, sortOrder: formData.sortOrder }
            : c
        )
      );
      toast.success("Category updated");
    } else {
      const newCat: typeof categories[0] = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        image: formData.image || null,
        sortOrder: formData.sortOrder,
        _count: { products: 0 },
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success("Category added");
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteDialog(null);
    toast.success("Category deleted");
  };

  const moveCategory = (id: string, direction: "up" | "down") => {
    setCategories((prev) => {
      const sorted = [...prev].sort((a, b) => a.sortOrder - b.sortOrder);
      const idx = sorted.findIndex((c) => c.id === id);
      if (direction === "up" && idx > 0) {
        const temp = sorted[idx].sortOrder;
        sorted[idx].sortOrder = sorted[idx - 1].sortOrder;
        sorted[idx - 1].sortOrder = temp;
      } else if (direction === "down" && idx < sorted.length - 1) {
        const temp = sorted[idx].sortOrder;
        sorted[idx].sortOrder = sorted[idx + 1].sortOrder;
        sorted[idx + 1].sortOrder = temp;
      }
      return sorted.sort((a, b) => a.sortOrder - b.sortOrder);
    });
  };

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories
          </p>
        </div>
        <Button className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedCategories.map((cat, index) => {
          const icon = CATEGORIES_ICONS[cat.slug] ?? "📦";
          return (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                          {icon}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cat._count?.products ?? 0} products
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order: {cat.sortOrder}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === 0}
                        onClick={() => moveCategory(cat.id, "up")}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === sortedCategories.length - 1}
                        onClick={() => moveCategory(cat.id, "down")}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(cat)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => setDeleteDialog(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Chips & Crisps"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-image">Image URL</Label>
              <Input
                id="cat-image"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://..."
              />
              {formData.image && (
                <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-order">Sort Order</Label>
              <Input
                id="cat-order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sortOrder: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-brand-500 hover:bg-brand-600" onClick={handleSave}>
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? Products in this category will need to be reassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
