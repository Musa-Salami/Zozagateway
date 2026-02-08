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
import type { Product } from "@/types";

// -- All sample products for the menu --
const allProducts: Product[] = [
  {
    id: "p1", name: "Honey BBQ Kettle Chips", slug: "honey-bbq-kettle-chips",
    description: "Thick-cut kettle chips with a smoky honey BBQ glaze.",
    price: 4.99, comparePrice: 6.99, categoryId: "cat-1",
    category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
    stock: 120, tags: ["bestseller"], dietary: ["Gluten-Free"],
    published: true, featured: true,
    images: [{ id: "i1", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "c1", position: 0 }],
    averageRating: 4.7, reviewCount: 89, createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "p2", name: "Sea Salt & Vinegar Crisps", slug: "sea-salt-vinegar-crisps",
    description: "Tangy and crispy with the perfect amount of salt.",
    price: 3.99, comparePrice: null, categoryId: "cat-1",
    category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
    stock: 95, tags: ["tangy"], dietary: ["Gluten-Free", "Vegan"],
    published: true, featured: false,
    images: [{ id: "i2", productId: "p2", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", publicId: "c2", position: 0 }],
    averageRating: 4.4, reviewCount: 56, createdAt: "2025-07-10T10:00:00Z", updatedAt: "2025-12-05T10:00:00Z",
  },
  {
    id: "p3", name: "Double Chocolate Cookies", slug: "double-chocolate-cookies",
    description: "Rich, chewy cookies loaded with dark and milk chocolate chunks.",
    price: 6.49, comparePrice: null, categoryId: "cat-2",
    category: { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
    stock: 85, tags: ["fresh-baked"], dietary: [],
    published: true, featured: true,
    images: [{ id: "i3", productId: "p3", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", publicId: "c3", position: 0 }],
    averageRating: 4.9, reviewCount: 124, createdAt: "2025-05-15T10:00:00Z", updatedAt: "2025-11-20T10:00:00Z",
  },
  {
    id: "p4", name: "Oatmeal Raisin Cookies", slug: "oatmeal-raisin-cookies",
    description: "Soft oatmeal cookies with plump raisins and a hint of cinnamon.",
    price: 5.49, comparePrice: null, categoryId: "cat-2",
    category: { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
    stock: 70, tags: ["wholesome"], dietary: ["Vegetarian"],
    published: true, featured: false,
    images: [{ id: "i4", productId: "p4", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", publicId: "c4", position: 0 }],
    averageRating: 4.2, reviewCount: 33, createdAt: "2025-08-05T10:00:00Z", updatedAt: "2025-12-02T10:00:00Z",
  },
  {
    id: "p5", name: "Classic Meat Pie", slug: "classic-meat-pie",
    description: "Flaky golden pastry filled with seasoned minced meat and savory gravy.",
    price: 5.99, comparePrice: 7.49, categoryId: "cat-3",
    category: { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3 },
    stock: 45, tags: ["savory"], dietary: [],
    published: true, featured: true,
    images: [{ id: "i5", productId: "p5", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "c5", position: 0 }],
    averageRating: 4.5, reviewCount: 67, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-10T10:00:00Z",
  },
  {
    id: "p6", name: "Honey Roasted Almonds", slug: "honey-roasted-almonds",
    description: "Premium almonds roasted with a touch of honey and sea salt.",
    price: 8.99, comparePrice: null, categoryId: "cat-4",
    category: { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4 },
    stock: 200, tags: ["healthy", "protein"], dietary: ["Gluten-Free", "Vegan"],
    published: true, featured: true,
    images: [{ id: "i6", productId: "p6", url: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400", publicId: "c6", position: 0 }],
    averageRating: 4.8, reviewCount: 52, createdAt: "2025-06-20T10:00:00Z", updatedAt: "2025-11-30T10:00:00Z",
  },
  {
    id: "p7", name: "Gummy Bear Mix", slug: "gummy-bear-mix",
    description: "A rainbow assortment of soft, fruity gummy bears.",
    price: 3.49, comparePrice: 4.99, categoryId: "cat-5",
    category: { id: "cat-5", name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5 },
    stock: 300, tags: ["fruity"], dietary: [],
    published: true, featured: true,
    images: [{ id: "i7", productId: "p7", url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400", publicId: "c7", position: 0 }],
    averageRating: 4.3, reviewCount: 38, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-05T10:00:00Z",
  },
  {
    id: "p8", name: "Caramel Popcorn Tub", slug: "caramel-popcorn-tub",
    description: "Generously coated caramel popcorn made with real butter.",
    price: 5.49, comparePrice: null, categoryId: "cat-6",
    category: { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6 },
    stock: 150, tags: ["movie-night"], dietary: ["Gluten-Free"],
    published: true, featured: true,
    images: [{ id: "i8", productId: "p8", url: "https://images.unsplash.com/photo-1585735675361-115f1f537af5?w=400", publicId: "c8", position: 0 }],
    averageRating: 4.6, reviewCount: 73, createdAt: "2025-05-10T10:00:00Z", updatedAt: "2025-11-15T10:00:00Z",
  },
  {
    id: "p9", name: "Kale & Quinoa Bites", slug: "kale-quinoa-bites",
    description: "Crispy baked bites with superfoods kale and quinoa.",
    price: 7.99, comparePrice: 9.99, categoryId: "cat-7",
    category: { id: "cat-7", name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7 },
    stock: 90, tags: ["superfood"], dietary: ["Vegan", "Gluten-Free"],
    published: true, featured: true,
    images: [{ id: "i9", productId: "p9", url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", publicId: "c9", position: 0 }],
    averageRating: 4.4, reviewCount: 29, createdAt: "2025-09-01T10:00:00Z", updatedAt: "2025-12-12T10:00:00Z",
  },
  {
    id: "p10", name: "Fresh Mango Smoothie", slug: "fresh-mango-smoothie",
    description: "Tropical mango smoothie blended with yogurt and a hint of lime.",
    price: 4.99, comparePrice: null, categoryId: "cat-8",
    category: { id: "cat-8", name: "Beverages", slug: "beverages", sortOrder: 8 },
    stock: 60, tags: ["tropical"], dietary: ["Vegetarian"],
    published: true, featured: false,
    images: [{ id: "i10", productId: "p10", url: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400", publicId: "c10", position: 0 }],
    averageRating: 4.6, reviewCount: 41, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-08T10:00:00Z",
  },
  {
    id: "p11", name: "Spinach Puff Pastry", slug: "spinach-puff-pastry",
    description: "Light and flaky puff pastry stuffed with creamy spinach and feta.",
    price: 4.49, comparePrice: null, categoryId: "cat-3",
    category: { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3 },
    stock: 55, tags: ["vegetarian"], dietary: ["Vegetarian"],
    published: true, featured: false,
    images: [{ id: "i11", productId: "p11", url: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400", publicId: "c11", position: 0 }],
    averageRating: 4.1, reviewCount: 22, createdAt: "2025-09-15T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "p12", name: "Trail Mix Energy Pack", slug: "trail-mix-energy-pack",
    description: "A power-packed mix of nuts, seeds, dried fruits, and dark chocolate.",
    price: 9.49, comparePrice: 11.99, categoryId: "cat-4",
    category: { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4 },
    stock: 110, tags: ["energy", "protein"], dietary: ["Gluten-Free", "Vegan"],
    published: true, featured: false,
    images: [{ id: "i12", productId: "p12", url: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400", publicId: "c12", position: 0 }],
    averageRating: 4.7, reviewCount: 48, createdAt: "2025-10-01T10:00:00Z", updatedAt: "2025-12-11T10:00:00Z",
  },
];

const categories = [
  "Chips & Crisps",
  "Cookies & Biscuits",
  "Pastries & Pies",
  "Nuts & Trail Mix",
  "Candy & Sweets",
  "Popcorn",
  "Healthy Snacks",
  "Beverages",
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
    let result = [...allProducts];

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
  }, [searchQuery, selectedCategories, selectedDietary, priceMin, priceMax, sortBy]);

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