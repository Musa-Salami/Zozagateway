"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { useProductStore, CATEGORIES } from "@/stores/productStore";

const categories = CATEGORIES.map((c) => c.name);

const dietaryOptions = ["Gluten-Free", "Vegan", "Vegetarian", "Organic"];

type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

function FilterSidebar({
  selectedCategories,
  toggleCategory,
  selectedDietary,
  toggleDietary,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  sortBy,
  setSortBy,
}: {
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  selectedDietary: string[];
  toggleDietary: (d: string) => void;
  priceMin: string;
  setPriceMin: (v: string) => void;
  priceMax: string;
  setPriceMax: (v: string) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Sort By</h3>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <span className="text-sm text-muted-foreground">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-9"
            min={0}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-9"
            min={0}
          />
        </div>
      </div>

      <Separator />

      {/* Dietary */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Dietary Options</h3>
        <div className="space-y-2">
          {dietaryOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedDietary.includes(opt)}
                onCheckedChange={() => toggleDietary(opt)}
              />
              <span className="text-sm text-muted-foreground">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const hasHydrated = useProductStore((s) => s._hasHydrated);
  const allProducts = useProductStore((s) => s.products);
  const publishedProducts = useMemo(
    () => allProducts.filter((p) => p.published),
    [allProducts]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleDietary = (d: string) => {
    setSelectedDietary((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedDietary.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDietary([]);
    setPriceMin("");
    setPriceMax("");
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    let result = [...publishedProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.includes(p.category?.name ?? "")
      );
    }

    // Dietary filter
    if (selectedDietary.length > 0) {
      result = result.filter((p) =>
        selectedDietary.some((d) => p.dietary.includes(d))
      );
    }

    // Price range
    if (priceMin) {
      result = result.filter((p) => p.price >= parseFloat(priceMin));
    }
    if (priceMax) {
      result = result.filter((p) => p.price <= parseFloat(priceMax));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popular":
      default:
        result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
    }

    return result;
  }, [publishedProducts, searchQuery, selectedCategories, selectedDietary, priceMin, priceMax, sortBy]);

  const filterSidebarProps = {
    selectedCategories,
    toggleCategory,
    selectedDietary,
    toggleDietary,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    sortBy,
    setSortBy,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-heading md:text-4xl">
          Our Snack Menu
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover our full range of freshly made snacks and treats
        </p>
      </motion.div>

      {/* Search & Mobile Filter Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Mobile filter button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden relative">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-brand-500 text-white text-[10px] px-1.5 py-0">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterSidebar {...filterSidebarProps} />
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sort (visible on mobile too for convenience) */}
        <div className="hidden sm:block lg:hidden">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="price-asc">Price: Low-High</SelectItem>
              <SelectItem value="price-desc">Price: High-Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {selectedCategories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/10"
              onClick={() => toggleCategory(cat)}
            >
              {cat}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {selectedDietary.map((d) => (
            <Badge
              key={d}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/10"
              onClick={() => toggleDietary(d)}
            >
              {d}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {(priceMin || priceMax) && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/10"
              onClick={() => { setPriceMin(""); setPriceMax(""); }}
            >
              ${priceMin || "0"} - ${priceMax || "..."}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-brand-500 hover:underline font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-brand-500 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterSidebar {...filterSidebarProps} />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}