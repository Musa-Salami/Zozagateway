"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { useProductStore } from "@/stores/productStore";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

// Sample reviews (static for now)
const sampleReviews: Review[] = [
  {
    id: "rev-1",
    userId: "u1",
    productId: "p1",
    rating: 5,
    comment:
      "Absolutely incredible flavor! These are now my favorite snack. Will definitely order again!",
    user: {
      id: "u1",
      email: "sarah@example.com",
      name: "Sarah Johnson",
      role: "CUSTOMER",
      createdAt: "2025-01-01T00:00:00Z",
    },
    createdAt: "2025-11-20T10:00:00Z",
  },
  {
    id: "rev-2",
    userId: "u2",
    productId: "p1",
    rating: 4,
    comment:
      "Great quality and flavor. Packaging was also eco-friendly which I appreciate. Would order again.",
    user: {
      id: "u2",
      email: "mike@example.com",
      name: "Michael Chen",
      role: "CUSTOMER",
      createdAt: "2025-01-01T00:00:00Z",
    },
    createdAt: "2025-10-15T10:00:00Z",
  },
  {
    id: "rev-3",
    userId: "u3",
    productId: "p1",
    rating: 5,
    comment:
      "Best snack discovery of the year! I ordered these for a party and they were gone in minutes. Zoza Gateway Snacks delivers quality!",
    user: {
      id: "u3",
      email: "amara@example.com",
      name: "Amara Osei",
      role: "CUSTOMER",
      createdAt: "2025-01-01T00:00:00Z",
    },
    createdAt: "2025-12-01T10:00:00Z",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const products = useProductStore((s) => s.products);
  const product = useMemo(
    () => products.find((p) => p.slug === slug),
    [products, slug]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id && p.published && p.categoryId === product.categoryId
      )
      .slice(0, 4);
  }, [products, product]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNutrition, setShowNutrition] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold">Product not found</h2>
        <p className="text-muted-foreground mt-2">
          The snack you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  const hasDiscount =
    product.comparePrice != null && product.comparePrice > product.price;
  const categoryName =
    product.category?.name ?? "Snacks";
  const categorySlug = product.category?.slug ?? "all";

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewRating(0);
    setReviewText("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-500 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/menu" className="hover:text-brand-500 transition-colors">
          Menu
        </Link>
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
              src={
                product.images[selectedImage]?.url ??
                "/images/placeholder-product.png"
              }
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1">
                {Math.round(
                  ((product.comparePrice! - product.price) /
                    product.comparePrice!) *
                    100
                )}
                % OFF
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
                    selectedImage === idx
                      ? "border-brand-500 ring-2 ring-brand-500/20"
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
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
            <Badge variant="secondary" className="mb-3">
              {categoryName}
            </Badge>
            <h1 className="text-3xl font-bold font-heading md:text-4xl">
              {product.name}
            </h1>
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
            <span className="text-3xl font-bold text-brand-500">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Tags */}
          {product.dietary && product.dietary.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.dietary.map((d) => (
                <Badge
                  key={d}
                  variant="outline"
                  className="text-green-600 border-green-200"
                >
                  {d}
                </Badge>
              ))}
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
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
              Ingredients &amp; Nutrition Info
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showNutrition && "rotate-180"
                )}
              />
            </button>
            {showNutrition && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t px-4 pb-4 pt-3"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Ingredients:</strong> Premium quality ingredients,
                  carefully selected and prepared fresh.
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
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
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
                <>
                  <Check className="mr-2 h-5 w-5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </>
              )}
            </Button>
          </div>

          {/* Stock */}
          <p className="text-sm text-muted-foreground">
            {product.stock > 10 ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-amber-600 font-medium">
                Only {product.stock} left
              </span>
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
      {relatedProducts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            You Might Also Like
          </h2>
          <ProductGrid products={relatedProducts} className="lg:grid-cols-4" />
        </section>
      )}

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
