"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Package,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

// ── Demo Data ──────────────────────────────────────────────────────────────

const demoCategories = [
  { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
  { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
  { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3 },
  { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4 },
  { id: "cat-5", name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5 },
  { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6 },
  { id: "cat-7", name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7 },
  { id: "cat-8", name: "Beverages", slug: "beverages", sortOrder: 8 },
];

const colors = ["F97316", "3B82F6", "10B981", "8B5CF6", "F43F5E", "F59E0B", "06B6D4", "EC4899"];

const demoProducts: Product[] = [
  { id: "p1", name: "Spicy Plantain Chips", slug: "spicy-plantain-chips", description: "Crispy plantain chips with a spicy kick", price: 8.5, comparePrice: 10.0, categoryId: "cat-1", category: demoCategories[0] as any, stock: 150, sku: "ZG-001", tags: ["spicy", "popular"], dietary: [], published: true, featured: true, images: [{ id: "img-1", productId: "p1", url: `https://placehold.co/300x300/${colors[0]}/fff?text=Plantain+Chips`, publicId: "p1", position: 0 }], averageRating: 4.5, reviewCount: 32, createdAt: "2025-10-01T00:00:00Z", updatedAt: "2026-01-15T00:00:00Z" },
  { id: "p2", name: "Coconut Cookies", slug: "coconut-cookies", description: "Soft and chewy coconut cookies baked fresh", price: 7.5, categoryId: "cat-2", category: demoCategories[1] as any, stock: 200, sku: "ZG-002", tags: ["sweet"], dietary: ["gluten-free"], published: true, featured: false, images: [{ id: "img-2", productId: "p2", url: `https://placehold.co/300x300/${colors[1]}/fff?text=Coconut+Cookies`, publicId: "p2", position: 0 }], averageRating: 4.2, reviewCount: 28, createdAt: "2025-10-05T00:00:00Z", updatedAt: "2026-01-10T00:00:00Z" },
  { id: "p3", name: "Chin Chin Original", slug: "chin-chin-original", description: "Traditional Nigerian chin chin snack", price: 6.0, categoryId: "cat-3", category: demoCategories[2] as any, stock: 300, sku: "ZG-003", tags: ["traditional"], dietary: [], published: true, featured: true, images: [{ id: "img-3", productId: "p3", url: `https://placehold.co/300x300/${colors[2]}/fff?text=Chin+Chin`, publicId: "p3", position: 0 }], averageRating: 4.7, reviewCount: 45, createdAt: "2025-10-10T00:00:00Z", updatedAt: "2026-01-12T00:00:00Z" },
  { id: "p4", name: "Puff Puff Mix", slug: "puff-puff-mix", description: "Easy-to-make puff puff batter mix", price: 6.0, categoryId: "cat-3", category: demoCategories[2] as any, stock: 180, sku: "ZG-004", tags: ["diy"], dietary: [], published: true, featured: false, images: [{ id: "img-4", productId: "p4", url: `https://placehold.co/300x300/${colors[3]}/fff?text=Puff+Puff`, publicId: "p4", position: 0 }], averageRating: 4.0, reviewCount: 15, createdAt: "2025-10-15T00:00:00Z", updatedAt: "2026-01-08T00:00:00Z" },
  { id: "p5", name: "Garlic Roasted Nuts", slug: "garlic-roasted-nuts", description: "Premium roasted cashews and peanuts with garlic", price: 9.0, categoryId: "cat-4", category: demoCategories[3] as any, stock: 120, sku: "ZG-005", tags: ["premium"], dietary: ["vegan", "gluten-free"], published: true, featured: true, images: [{ id: "img-5", productId: "p5", url: `https://placehold.co/300x300/${colors[4]}/fff?text=Garlic+Nuts`, publicId: "p5", position: 0 }], averageRating: 4.6, reviewCount: 22, createdAt: "2025-10-20T00:00:00Z", updatedAt: "2026-01-14T00:00:00Z" },
  { id: "p6", name: "Honey Cashew Brittle", slug: "honey-cashew-brittle", description: "Crunchy honey-glazed cashew brittle", price: 11.0, comparePrice: 13.5, categoryId: "cat-5", category: demoCategories[4] as any, stock: 80, sku: "ZG-006", tags: ["premium", "gift"], dietary: ["gluten-free"], published: true, featured: false, images: [{ id: "img-6", productId: "p6", url: `https://placehold.co/300x300/${colors[5]}/fff?text=Brittle`, publicId: "p6", position: 0 }], averageRating: 4.8, reviewCount: 18, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2026-01-11T00:00:00Z" },
  { id: "p7", name: "Caramel Popcorn", slug: "caramel-popcorn", description: "Sweet caramel-coated popcorn", price: 5.5, categoryId: "cat-6", category: demoCategories[5] as any, stock: 250, sku: "ZG-007", tags: ["movie-night"], dietary: [], published: true, featured: false, images: [{ id: "img-7", productId: "p7", url: `https://placehold.co/300x300/${colors[6]}/fff?text=Popcorn`, publicId: "p7", position: 0 }], averageRating: 4.3, reviewCount: 40, createdAt: "2025-11-05T00:00:00Z", updatedAt: "2026-01-06T00:00:00Z" },
  { id: "p8", name: "Tropical Trail Mix", slug: "tropical-trail-mix", description: "Dried fruits and nuts tropical blend", price: 13.0, categoryId: "cat-7", category: demoCategories[6] as any, stock: 90, sku: "ZG-008", tags: ["healthy"], dietary: ["vegan", "gluten-free"], published: true, featured: true, images: [{ id: "img-8", productId: "p8", url: `https://placehold.co/300x300/${colors[7]}/fff?text=Trail+Mix`, publicId: "p8", position: 0 }], averageRating: 4.4, reviewCount: 12, createdAt: "2025-11-10T00:00:00Z", updatedAt: "2026-01-13T00:00:00Z" },
  { id: "p9", name: "Ginger Snap Biscuits", slug: "ginger-snap-biscuits", description: "Crunchy ginger-flavored biscuits", price: 5.0, categoryId: "cat-2", category: demoCategories[1] as any, stock: 220, sku: "ZG-009", tags: ["classic"], dietary: [], published: true, featured: false, images: [{ id: "img-9", productId: "p9", url: `https://placehold.co/300x300/${colors[0]}/fff?text=Ginger+Snaps`, publicId: "p9", position: 0 }], averageRating: 4.1, reviewCount: 25, createdAt: "2025-11-15T00:00:00Z", updatedAt: "2026-01-05T00:00:00Z" },
  { id: "p10", name: "Zobo Drink Mix", slug: "zobo-drink-mix", description: "Hibiscus tea drink mix sachets", price: 4.0, categoryId: "cat-8", category: demoCategories[7] as any, stock: 350, sku: "ZG-010", tags: ["drink", "traditional"], dietary: ["vegan"], published: true, featured: false, images: [{ id: "img-10", productId: "p10", url: `https://placehold.co/300x300/${colors[1]}/fff?text=Zobo`, publicId: "p10", position: 0 }], averageRating: 4.0, reviewCount: 35, createdAt: "2025-11-20T00:00:00Z", updatedAt: "2026-01-04T00:00:00Z" },
  { id: "p11", name: "Suya Spice Cashews", slug: "suya-spice-cashews", description: "Cashews coated in authentic suya spice", price: 10.5, categoryId: "cat-4", category: demoCategories[3] as any, stock: 0, sku: "ZG-011", tags: ["spicy", "premium"], dietary: ["vegan"], published: false, featured: false, images: [{ id: "img-11", productId: "p11", url: `https://placehold.co/300x300/${colors[2]}/fff?text=Suya+Cashews`, publicId: "p11", position: 0 }], averageRating: 4.9, reviewCount: 8, createdAt: "2025-12-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z" },
  { id: "p12", name: "Butter Scotch Candy", slug: "butter-scotch-candy", description: "Classic butterscotch hard candy", price: 3.5, categoryId: "cat-5", category: demoCategories[4] as any, stock: 500, sku: "ZG-012", tags: ["classic", "value"], dietary: [], published: true, featured: false, images: [{ id: "img-12", productId: "p12", url: `https://placehold.co/300x300/${colors[3]}/fff?text=Butterscotch`, publicId: "p12", position: 0 }], averageRating: 3.8, reviewCount: 20, createdAt: "2025-12-05T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
];

// ── Page Component ──────────────────────────────────────────────────────────

type ViewMode = "grid" | "table";
type SortField = "name" | "price" | "stock" | "createdAt";
type SortDir = "asc" | "desc";

export default function ProductsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [products, setProducts] = useState(demoProducts);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 h-3.5 w-3.5 text-brand-500" />
    ) : (
      <ChevronDown className="ml-1 h-3.5 w-3.5 text-brand-500" />
    );
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((p) =>
        statusFilter === "published" ? p.published : !p.published
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = a.price - b.price;
          break;
        case "stock":
          cmp = a.stock - b.stock;
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [products, search, categoryFilter, statusFilter, sortField, sortDir]);

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteDialog(null);
  };

  const handleStockUpdate = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <Button className="gap-1.5 bg-brand-500 hover:bg-brand-600" asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {demoCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md p-2 transition-colors",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "rounded-md p-2 transition-colors",
              viewMode === "table"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Grid View */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((product) => (
              <Card key={product.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images[0]?.url ?? "https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute right-2 top-2 flex flex-col gap-1">
                    {!product.published && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Draft
                      </Badge>
                    )}
                    {product.featured && (
                      <Badge className="bg-brand-500 text-white">
                        Featured
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                  <h3 className="mt-1 font-semibold leading-tight">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-500">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Stock:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStockUpdate(product.id, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded border text-xs hover:bg-muted"
                        >
                          -
                        </button>
                        <span className={cn(
                          "min-w-[32px] text-center text-sm font-medium",
                          product.stock === 0 ? "text-red-500" : product.stock < 20 ? "text-yellow-600" : ""
                        )}>
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleStockUpdate(product.id, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border text-xs hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeleteDialog(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]" />
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                      <span className="flex items-center">
                        Product <SortIcon field="name" />
                      </span>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("price")}>
                      <span className="flex items-center">
                        Price <SortIcon field="price" />
                      </span>
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("stock")}>
                      <span className="flex items-center">
                        Stock <SortIcon field="stock" />
                      </span>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product) => (
                    <TableRow key={product.id} className="cursor-pointer" onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
                      <TableCell>
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={product.images[0]?.url ?? "https://placehold.co/40x40/e2e8f0/94a3b8?text=?"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {product.category?.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          product.stock === 0 ? "text-red-500" : product.stock < 20 ? "text-yellow-600" : ""
                        )}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={product.published ? "default" : "secondary"} className={product.published ? "bg-emerald-500/10 text-emerald-600" : ""}>
                          {product.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/admin/products/${product.id}/edit`); }}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => { e.stopPropagation(); setDeleteDialog(product.id); }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
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
