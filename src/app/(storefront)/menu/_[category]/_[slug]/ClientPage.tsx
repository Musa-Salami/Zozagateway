"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { ReviewCard } from "@/components/storefront/ReviewCard";
import { StarRating } from "@/components/shared/StarRating";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Product, Review } from "@/types";

// -- Sample product database --
const sampleProducts: Record<string, Product> = {
  "honey-bbq-kettle-chips": {
    id: "p1", name: "Honey BBQ Kettle Chips", slug: "honey-bbq-kettle-chips",
    description: "Thick-cut kettle chips with a smoky honey BBQ glaze. Perfectly crunchy and irresistibly sweet-savory. Made with premium potatoes, hand-cooked in small batches for maximum crunch. Our signature BBQ seasoning blends smoky paprika, sweet honey, and a touch of cayenne for a flavor that keeps you reaching for more.",
    price: 4.99, comparePrice: 6.99, categoryId: "cat-1",
    category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
    stock: 120, tags: ["bestseller", "crunchy"], dietary: ["Gluten-Free"],
    published: true, featured: true,
    images: [
      { id: "i1a", productId: "p1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600", publicId: "c1a", position: 0 },
      { id: "i1b", productId: "p1", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600", publicId: "c1b", position: 1 },
      { id: "i1c", productId: "p1", url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600", publicId: "c1c", position: 2 },
    ],
    averageRating: 4.5, reviewCount: 89,
    createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  "double-chocolate-cookies": {
    id: "p3", name: "Double Chocolate Cookies", slug: "double-chocolate-cookies",
    description: "Rich, chewy cookies loaded with dark and milk chocolate chunks. Baked fresh daily using premium Belgian chocolate. Each cookie is hand-formed and baked to perfection with a soft, gooey center and slightly crispy edges.",
    price: 6.49, comparePrice: null, categoryId: "cat-2",
    category: { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
    stock: 85, tags: ["fresh-baked", "chocolate"], dietary: [],
    published: true, featured: true,
    images: [
      { id: "i3a", productId: "p3", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600", publicId: "c3a", position: 0 },
      { id: "i3b", productId: "p3", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600", publicId: "c3b", position: 1 },
    ],
    averageRating: 4.9, reviewCount: 124,
    createdAt: "2025-05-15T10:00:00Z", updatedAt: "2025-11-20T10:00:00Z",
  },
};

// Fallback for any slug not in the map
const defaultProduct: Product = {
  id: "p-default", name: "Delicious Snack", slug: "delicious-snack",
  description: "A wonderfully crafted snack made with the finest ingredients. Perfect for any occasion. Rich in flavor and made with care in our kitchen.",
  price: 5.99, comparePrice: 7.99, categoryId: "cat-1",
  category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
  stock: 50, tags: ["premium"], dietary: ["Gluten-Free"],
  published: true, featured: false,
  images: [
    { id: "id1", productId: "p-default", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600", publicId: "d1", position: 0 },
    { id: "id2", productId: "p-default", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600", publicId: "d2", position: 1 },
  ],
  averageRating: 4.5, reviewCount: 24,
  createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
};

// Related products
const relatedProducts: Product[] = [
  {
    id: "rp1", name: "Sea Salt Crisps", slug: "sea-salt-crisps",
    description: "Classic sea salt flavor.", price: 3.99, comparePrice: null, categoryId: "cat-1",
    category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
    stock: 80, tags: [], dietary: ["Gluten-Free"], published: true, featured: false,
    images: [{ id: "ri1", productId: "rp1", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", publicId: "r1", position: 0 }],
    averageRating: 4.4, reviewCount: 56, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "rp2", name: "Caramel Popcorn", slug: "caramel-popcorn",
    description: "Sweet caramel coated popcorn.", price: 5.49, comparePrice: null, categoryId: "cat-6",
    category: { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6 },
    stock: 150, tags: [], dietary: ["Gluten-Free"], published: true, featured: false,
    images: [{ id: "ri2", productId: "rp2", url: "https://images.unsplash.com/photo-1585735675361-115f1f537af5?w=400", publicId: "r2", position: 0 }],
    averageRating: 4.6, reviewCount: 73, createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "rp3", name: "Oatmeal Cookies", slug: "oatmeal-cookies",
    description: "Wholesome oatmeal cookies.", price: 5.49, comparePrice: null, categoryId: "cat-2",
    category: { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
    stock: 70, tags: [], dietary: ["Vegetarian"], published: true, featured: false,
    images: [{ id: "ri3", productId: "rp3", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", publicId: "r3", position: 0 }],
    averageRating: 4.2, reviewCount: 33, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "rp4", name: "Honey Almonds", slug: "honey-almonds",
    description: "Honey roasted almonds.", price: 8.99, comparePrice: null, categoryId: "cat-4",
    category: { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4 },
    stock: 200, tags: [], dietary: ["Vegan", "Gluten-Free"], published: true, featured: false,
    images: [{ id: "ri4", productId: "rp4", url: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400", publicId: "r4", position: 0 }],
    averageRating: 4.8, reviewCount: 52, createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z",
  },
];

// Sample reviews
const sampleReviews: Review[] = [
  {
    id: "rev-1", userId: "u1", productId: "p1", rating: 5,
    comment: "Absolutely incredible flavor! These are now my favorite chips. The honey BBQ glaze is perfectly balanced - not too sweet, not too smoky. Will definitely order again!",
    user: { id: "u1", email: "sarah@example.com", name: "Sarah Johnson", role: "CUSTOMER", createdAt: "2025-01-01T00:00:00Z" },
    createdAt: "2025-11-20T10:00:00Z",
  },
  {
    id: "rev-2", userId: "u2", productId: "p1", rating: 4,
    comment: "Great crunch and flavor. Would love a spicier version! The chips are thick-cut and hold up well with dips. Packaging was also eco-friendly which I appreciate.",
    user: { id: "u2", email: "mike@example.com", name: "Michael Chen", role: "CUSTOMER", createdAt: "2025-01-01T00:00:00Z" },
    createdAt: "2025-10-15T10:00:00Z",
  },
  {
    id: "rev-3", userId: "u3", productId: "p1", rating: 5,
    comment: "Best snack discovery of the year! I ordered these for a party and they were gone in minutes. Everyone kept asking where I got them. Zoza Gateway Snacks delivers quality!",
    user: { id: "u3", email: "amara@example.com", name: "Amara Osei", role: "CUSTOMER", createdAt: "2025-01-01T00:00:00Z" },
    createdAt: "2025-12-01T10:00:00Z",
  },
];

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { category, slug } = use(params);
  const product = sampleProducts[slug] ?? { ...defaultProduct, slug, name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNutrition, setShowNutrition] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const hasDiscount = product.comparePrice != null && product.comparePrice > product.price;
  const categoryName = product.category?.name ?? category.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call an API
    setReviewRating(0);
    setReviewText("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/menu" className="hover:text-brand-500 transition-colors">Menu</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/menu/${category}`} className="hover:text-brand-500 transition-colors">{categoryName}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Left: Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted mb-4">
            <Image
              src={product.images[selectedImage]?.url ?? "/images/placeholder-product.png"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1">
                {Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImage === idx ? "border-brand-500 ring-2 ring-brand-500/20" : "border-transparent hover:border-muted-foreground/30"
                  )}
                >
                  <Image src={img.url} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Category & Name */}
          <div>
            <Badge variant="secondary" className="mb-3">{categoryName}</Badge>
            <h1 className="text-3xl font-bold font-heading md:text-4xl">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.averageRating ?? 0} size="md" />
            <span className="text-sm text-muted-foreground">
              {product.averageRating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-brand-500">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.comparePrice!)}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.dietary.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.dietary.map((d) => (
                <Badge key={d} variant="outline" className="text-green-600 border-green-200">{d}</Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Nutrition Accordion */}
          <div className="rounded-lg border">
            <button
              onClick={() => setShowNutrition(!showNutrition)}
              className="flex w-full items-center justify-between p-4 text-sm font-semibold hover:bg-muted/50 transition-colors"
            >
              Ingredients & Nutrition Info
              <ChevronDown className={cn("h-4 w-4 transition-transform", showNutrition && "rotate-180")} />
            </button>
            {showNutrition && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t px-4 pb-4 pt-3"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Ingredients:</strong> Premium potatoes, sunflower oil, honey, BBQ seasoning (paprika, garlic, onion, cayenne pepper), sea salt.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-muted/50 p-2 text-center">
                    <p className="font-semibold">150</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-2 text-center">
                    <p className="font-semibold">8g</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-2 text-center">
                    <p className="font-semibold">18g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-2 text-center">
                    <p className="font-semibold">2g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border px-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className={cn(
                "flex-1 h-12 text-base font-semibold transition-all",
                addedToCart
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-brand-500 hover:bg-brand-600"
              )}
            >
              {addedToCart ? (
                <><Check className="mr-2 h-5 w-5" /> Added!</>
              ) : (
                <><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</>
              )}
            </Button>
          </div>

          {/* Stock */}
          <p className="text-sm text-muted-foreground">
            {product.stock > 10 ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-amber-600 font-medium">Only {product.stock} left</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </p>

          {/* Share / Wishlist */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Heart className="mr-2 h-4 w-4" /> Wishlist
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">You Might Also Like</h2>
        <ProductGrid products={relatedProducts} className="lg:grid-cols-4" />
      </section>

      {/* Reviews Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">
          Customer Reviews ({sampleReviews.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {sampleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Write a Review */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Your Rating</p>
                <StarRating
                  rating={reviewRating}
                  interactive
                  onChange={setReviewRating}
                  size="lg"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600"
                disabled={reviewRating === 0}
              >
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}