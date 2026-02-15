"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/storefront/CartItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/formatters";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

interface CartSheetProps {
  children: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-brand-500" />
            Your Cart ({itemCount})
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Your cart is empty"
              : `You have ${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Add some delicious snacks to get started!"
              className="py-12"
            />
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer Totals */}
        {items.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-muted-foreground">
                Free delivery on orders over{" "}
                {formatPrice(FREE_DELIVERY_THRESHOLD)}
              </p>
            )}
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-brand-500">{formatPrice(total)}</span>
            </div>

            <SheetFooter className="flex-col gap-2 sm:flex-col">
              <SheetClose asChild>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/menu" className="w-full">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </SheetClose>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
