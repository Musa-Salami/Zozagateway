"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/formatters";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ── Checkout form schema ──────────────────────────────────────
const checkoutSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Valid phone number is required"),
    deliveryType: z.enum(["DELIVERY", "PICKUP"]),
    address: z.string().optional(),
    city: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryType === "DELIVERY") {
        return !!data.address?.trim() && !!data.city?.trim();
      }
      return true;
    },
    {
      message: "Address and city are required for delivery",
      path: ["address"],
    }
  );

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const STEPS = ["Delivery Details", "Order Review", "Payment"];

interface CheckoutFormProps {
  className?: string;
}

export function CheckoutForm({ className }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      deliveryType: "DELIVERY",
      address: "",
      city: "",
      notes: "",
    },
  });

  const deliveryType = watch("deliveryType");
  const progressValue = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = async () => {
    if (currentStep === 0) {
      const valid = await trigger([
        "name",
        "phone",
        "deliveryType",
        "address",
        "city",
      ]);
      if (!valid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      // In production, this would call your order API and payment processor
      console.log("Order submitted:", { ...data, items, total });
      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Navigate to success page or show confirmation
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                index <= currentStep
                  ? "text-brand-500"
                  : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  index < currentStep
                    ? "bg-brand-500 text-white"
                    : index === currentStep
                      ? "border-2 border-brand-500 text-brand-500"
                      : "border-2 border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </div>
          ))}
        </div>
        <Progress value={progressValue} className="h-1.5" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Step 1: Delivery Details ──────────────────────── */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-500" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Delivery / Pickup Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Delivery Method</p>
                  <p className="text-xs text-muted-foreground">
                    {deliveryType === "DELIVERY"
                      ? "We'll deliver to your address"
                      : "You'll pick up at our store"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs",
                      deliveryType === "PICKUP"
                        ? "text-brand-500 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    Pickup
                  </span>
                  <Switch
                    checked={deliveryType === "DELIVERY"}
                    onCheckedChange={(checked) =>
                      setValue(
                        "deliveryType",
                        checked ? "DELIVERY" : "PICKUP"
                      )
                    }
                  />
                  <span
                    className={cn(
                      "text-xs",
                      deliveryType === "DELIVERY"
                        ? "text-brand-500 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    Delivery
                  </span>
                </div>
              </div>

              {/* Address (shown only for delivery) */}
              {deliveryType === "DELIVERY" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Special instructions..."
                  {...register("notes")}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 2: Order Review ─────────────────────────── */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-brand-500" />
                Order Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Your cart is empty.
                </p>
              ) : (
                <>
                  <div className="divide-y">
                    {items.map((item) => {
                      const image =
                        item.product.images?.[0]?.url ||
                        "/images/placeholder-product.png";
                      const lineTotal =
                        Number(item.product.price) * item.quantity;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} &times;{" "}
                              {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(lineTotal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Delivery Fee
                      </span>
                      <span>
                        {deliveryType === "PICKUP" || deliveryFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-brand-500">
                        {formatPrice(
                          deliveryType === "PICKUP"
                            ? subtotal
                            : total
                        )}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Step 3: Payment ──────────────────────────────── */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-500" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Placeholder for Stripe Elements */}
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="text-sm font-medium text-muted-foreground">
                  Stripe Payment Element
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Secure payment processing will be integrated here
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Amount to Pay</span>
                  <span className="text-brand-500">
                    {formatPrice(
                      deliveryType === "PICKUP" ? subtotal : total
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Navigation Buttons ───────────────────────────── */}
        <div className="flex items-center justify-between mt-6">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-brand-500 hover:bg-brand-600 text-white"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="bg-brand-500 hover:bg-brand-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
