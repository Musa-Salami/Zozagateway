"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Banknote,
  Building2,
  Wallet,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { toast } from "sonner";
import { formatPrice } from "@/lib/formatters";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { generateOrderNumber } from "@/lib/utils";
import type { Order, OrderItem, PaymentStatus } from "@/types";

// ── Payment method type ───────────────────────────────────────
type PaymentMethod = "cash" | "transfer" | "card";

// ── Checkout form schema ──────────────────────────────────────
const checkoutSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Valid phone number is required"),
    deliveryType: z.enum(["DELIVERY", "PICKUP"]),
    address: z.string().optional(),
    city: z.string().optional(),
    notes: z.string().optional(),
    promoCode: z.string().optional(),
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

// ── Transfer details (customize for your business) ────────────
const TRANSFER_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountNumber: "1234567890",
  accountName: "Zoza Gateway Snacks",
};

interface CheckoutFormProps {
  className?: string;
}

export function CheckoutForm({ className }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);

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
      promoCode: "",
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
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const orderNum = generateOrderNumber();
      const orderId = `ord-${Date.now()}`;
      const now = new Date().toISOString();

      // Determine payment status based on method
      const paymentStatus: PaymentStatus =
        paymentMethod === "card" ? "PAID" : "PENDING";

      // Build order items from cart (exclude full product to keep localStorage small)
      const orderItems: OrderItem[] = items.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        orderId,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
      }));

      // Build the full order
      const order: Order = {
        id: orderId,
        orderNumber: orderNum,
        userId: `guest-${Date.now()}`,
        user: {
          id: `guest-${Date.now()}`,
          email: "",
          name: data.name,
          phone: data.phone,
          role: "CUSTOMER",
          createdAt: now,
        },
        status: "PENDING",
        subtotal,
        deliveryFee,
        discount: 0,
        total,
        paymentStatus,
        deliveryType: data.deliveryType,
        address: data.address ?? null,
        city: data.city ?? null,
        phone: data.phone,
        notes: data.notes ?? null,
        items: orderItems,
        promoCode: data.promoCode ?? null,
        timeline: [
          {
            id: `tl-${Date.now()}`,
            orderId,
            status: "PENDING",
            note: `Order placed via ${paymentMethod === "cash" ? "Cash on Delivery" : paymentMethod === "transfer" ? "Bank Transfer" : "Card Payment"}`,
            changedBy: null,
            createdAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      // Save to order store (synced to Firestore)
      await addOrder(order);

      clearCart();
      window.dispatchEvent(
        new CustomEvent("order-success", { detail: { orderNumber: orderNum } })
      );
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(TRANSFER_DETAILS.accountNumber);
    setCopiedAccount(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopiedAccount(false), 2000);
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
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="promoCode" className="text-sm">Promo Code</Label>
                      <Input
                        id="promoCode"
                        placeholder="e.g. SNACK10"
                        {...register("promoCode")}
                        className="h-9"
                      />
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
                <Wallet className="h-5 w-5 text-brand-500" />
                Choose Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Options */}
              <div className="grid gap-3">
                {/* Cash Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                    paymentMethod === "cash"
                      ? "border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/20"
                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    paymentMethod === "cash" ? "bg-brand-500/10" : "bg-muted"
                  )}>
                    <Banknote className={cn("h-6 w-6", paymentMethod === "cash" ? "text-brand-500" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">
                      Pay with cash when your order arrives
                    </p>
                  </div>
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    paymentMethod === "cash"
                      ? "border-brand-500 bg-brand-500"
                      : "border-muted-foreground/30"
                  )}>
                    {paymentMethod === "cash" && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("transfer")}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                    paymentMethod === "transfer"
                      ? "border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/20"
                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    paymentMethod === "transfer" ? "bg-brand-500/10" : "bg-muted"
                  )}>
                    <Building2 className={cn("h-6 w-6", paymentMethod === "transfer" ? "text-brand-500" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground">
                      Transfer to our bank account before delivery
                    </p>
                  </div>
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    paymentMethod === "transfer"
                      ? "border-brand-500 bg-brand-500"
                      : "border-muted-foreground/30"
                  )}>
                    {paymentMethod === "transfer" && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>

                {/* Card Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                    paymentMethod === "card"
                      ? "border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/20"
                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    paymentMethod === "card" ? "bg-brand-500/10" : "bg-muted"
                  )}>
                    <CreditCard className={cn("h-6 w-6", paymentMethod === "card" ? "text-brand-500" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Card Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Pay securely with your debit or credit card
                    </p>
                  </div>
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    paymentMethod === "card"
                      ? "border-brand-500 bg-brand-500"
                      : "border-muted-foreground/30"
                  )}>
                    {paymentMethod === "card" && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>
              </div>

              {/* Transfer Details (shown when transfer is selected) */}
              {paymentMethod === "transfer" && (
                <div className="rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-3">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                    Transfer Details
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium">{TRANSFER_DETAILS.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account No.</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base">{TRANSFER_DETAILS.accountNumber}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={copyAccountNumber}
                        >
                          {copiedAccount ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Name</span>
                      <span className="font-medium">{TRANSFER_DETAILS.accountName}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-brand-500">
                        {formatPrice(deliveryType === "PICKUP" ? subtotal : total)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Please include your phone number as the transfer reference. Your order will be confirmed once payment is verified.
                  </p>
                </div>
              )}

              {/* Card Details (shown when card is selected) */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" maxLength={4} type="password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="Name on card" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Your card details are encrypted and secure</span>
                  </div>
                </div>
              )}

              {/* Cash info (shown when cash is selected) */}
              {paymentMethod === "cash" && (
                <div className="rounded-xl border bg-green-50/50 dark:bg-green-950/20 p-4">
                  <div className="flex items-start gap-3">
                    <Banknote className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please have the exact amount of{" "}
                        <span className="font-semibold text-brand-500">
                          {formatPrice(deliveryType === "PICKUP" ? subtotal : total)}
                        </span>{" "}
                        ready when your order arrives. Our delivery agent will collect the payment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Summary */}
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
              disabled={isSubmitting || items.length === 0 || !paymentMethod}
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
