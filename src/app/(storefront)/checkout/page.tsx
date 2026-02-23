"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, CheckCircle2, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { useCartStore } from "@/stores/cartStore";
import { generateOrderNumber } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push("/menu");
    }
  }, [items.length, orderComplete, router]);

  // Listen for form submission success from CheckoutForm
  useEffect(() => {
    const handleOrderSuccess = (e: CustomEvent<{ orderNumber: string }>) => {
      const num = e.detail?.orderNumber ?? generateOrderNumber();
      setOrderNumber(num);
      setOrderComplete(true);
      clearCart();
    };

    window.addEventListener("order-success", handleOrderSuccess as EventListener);
    return () => window.removeEventListener("order-success", handleOrderSuccess as EventListener);
  }, [clearCart]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mx-auto max-w-lg text-center"
        >
          {/* Confetti-like particles */}
          <div className="relative mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i * 30 * Math.PI) / 180) * (80 + Math.random() * 60),
                  y: Math.sin((i * 30 * Math.PI) / 180) * (80 + Math.random() * 60),
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.2 + i * 0.05,
                  ease: "easeOut",
                }}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: ["#f97316", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"][i % 6],
                  }}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-2 flex items-center justify-center gap-2">
              <PartyPopper className="h-6 w-6 text-amber-500" />
              <h1 className="text-3xl font-bold font-heading">Order Confirmed!</h1>
              <PartyPopper className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-muted-foreground mb-8">
              Thank you for your order! We are preparing your snacks with love.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold font-mono text-brand-500">
                    {orderNumber}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyOrderNumber}
                    className="h-8 w-8"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Save this number to track your order status.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          >
            <Link href="/orders">
              <Button className="bg-brand-500 hover:bg-brand-600">
                View My Orders
              </Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back link */}
        <Link
          href="/cart"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold font-heading md:text-4xl mb-8">
          Checkout
        </h1>

        <CheckoutForm />
      </motion.div>
    </div>
  );
}