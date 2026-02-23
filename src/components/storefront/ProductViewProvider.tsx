"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { StarRating } from "@/components/shared/StarRating";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/* ── Context ──────────────────────────────────────────────────────────── */

interface ProductViewContextValue {
  openProduct: (product: Product) => void;
}

const ProductViewContext = createContext<ProductViewContextValue>({
  openProduct: () => {},
});

export const useProductView = () => useContext(ProductViewContext);

/* ── Provider + Dialog ────────────────────────────────────────────────── */

export function ProductViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNutrition, setShowNutrition] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const products = useProductStore((s) => s.products);

  const openProduct = useCallback((p: Product) => {
    setProduct(p);
    setSelectedImage(0);
    setQuantity(1);
    setShowNutrition(false);
    setAddedToCart(false);
  }, []);

  const handleClose = () => setProduct(null);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) => p.id !== product.id && p.published && p.categoryId === product.categoryId
      )
      .slice(0, 4);
  }, [products, product]);

  const hasDiscount =
    product != null &&
    product.comparePrice != null &&
    product.comparePrice > product.price;

  return (
    <ProductViewContext.Provider value={{ openProduct }}>
      {children}

      <Dialog open={!!product} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {product && (
            <>
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-background/80 backdrop-blur p-1.5 hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Image Gallery */}
                <div className="p-6 bg-muted/30">
                  {/* Main Image */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
                    <Image
                      src={
                        product.images[selectedImage]?.url ??
                        "/images/placeholder-product.png"
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {hasDiscount && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1">
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
                    <div className="flex gap-2">
                      {product.images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(idx)}
                          className={cn(
                            "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all",
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
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Info */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                  {/* Category & Name */}
                  <div>
                    {product.category && (
                      <Badge variant="secondary" className="mb-2">
                        {product.category.name}
                      </Badge>
                    )}
                    <h2 className="text-2xl font-bold font-heading md:text-3xl">
                      {product.name}
                    </h2>
                  </div>

                  {/* Rating */}
                  {product.averageRating != null && (
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.averageRating} size="md" />
                      <span className="text-sm text-muted-foreground">
                        {product.averageRating} ({product.reviewCount ?? 0} reviews)
                      </span>
                    </div>
                  )}

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
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {product.description}
                  </p>

                  {/* Dietary Tags */}
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

                  {/* Tags */}
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
                      className="flex w-full items-center justify-between p-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
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
                      <div className="border-t px-3 pb-3 pt-2">
                        <p className="text-sm text-muted-foreground mb-2">
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
                      </div>
                    )}
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-lg border px-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
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
                        "flex-1 h-11 text-sm font-semibold transition-all",
                        addedToCart
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-brand-500 hover:bg-brand-600"
                      )}
                    >
                      {addedToCart ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
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

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Heart className="mr-2 h-4 w-4" /> Wishlist
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>

                  {/* Related Products */}
                  {relatedProducts.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-semibold mb-3">You Might Also Like</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {relatedProducts.map((rp) => (
                            <button
                              key={rp.id}
                              onClick={() => openProduct(rp)}
                              className="flex items-center gap-2 rounded-lg border p-2 hover:bg-muted/50 transition-colors text-left"
                            >
                              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted flex-shrink-0">
                                <Image
                                  src={rp.images?.[0]?.url ?? "/images/placeholder-product.png"}
                                  alt={rp.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{rp.name}</p>
                                <p className="text-xs text-brand-500 font-semibold">{formatPrice(rp.price)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ProductViewContext.Provider>
  );
}
