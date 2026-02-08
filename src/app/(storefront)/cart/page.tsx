"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "@/components/storefront/CartItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/formatters";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SNACK10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try SNACK10");
      setPromoApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any snacks yet. Browse our menu and find something delicious!"
          actionLabel="Browse Menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading md:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-1 text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="divide-y p-4 md:p-6">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-4">
              <Link
                href="/menu"
                className="inline-flex items-center text-sm font-medium text-brand-500 hover:underline"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free delivery on orders over {formatPrice(FREE_DELIVERY_THRESHOLD)}
                    </p>
                  )}
                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="font-medium">Promo Discount (10%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="h-9"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyPromo}
                      className="shrink-0"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-destructive">{promoError}</p>
                  )}
                  {promoApplied && (
                    <p className="text-xs text-green-600">Code SNACK10 applied!</p>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-500">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="block">
                  <Button className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white text-base font-semibold">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}