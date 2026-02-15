"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ── Page Component ──────────────────────────────────────────────────────────

export default function SettingsPage() {
  // General Settings
  const [storeName, setStoreName] = useState("Zoza Gateway Snacks");
  const [storeDescription, setStoreDescription] = useState(
    "Freshly made snacks, delivered to your doorstep"
  );
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Africa/Lagos");

  // Delivery Settings
  const [deliveryFee, setDeliveryFee] = useState("3.99");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("25.00");
  const [deliveryAreas, setDeliveryAreas] = useState(
    "Victoria Island, Lekki, Ikoyi, Surulere, Yaba, Ikeja, Ajah"
  );

  // Payment Settings
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const [stripePublicKey, setStripePublicKey] = useState("pk_live_****************************Xz4m");
  const [stripeSecretKey, setStripeSecretKey] = useState("sk_live_****************************8h2q");
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Notification Settings
  const [emailNewOrder, setEmailNewOrder] = useState(true);
  const [emailLowStock, setEmailLowStock] = useState(true);
  const [emailDailyReport, setEmailDailyReport] = useState(false);
  const [emailCancelledOrder, setEmailCancelledOrder] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved`, {
      description: "Your changes have been applied successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your store configuration and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[480px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* ── General Tab ─────────────────────────────────────────── */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic details about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">Description</Label>
                <Textarea
                  id="store-description"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed bg-muted">
                    <span className="text-2xl font-bold text-brand-500">Z</span>
                  </div>
                  <Button variant="outline" className="gap-1.5">
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 512x512px, PNG or SVG
                </p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="NGN">NGN (₦)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="gap-1.5 bg-brand-500 hover:bg-brand-600"
                  onClick={() => handleSave("General")}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Delivery Tab ────────────────────────────────────────── */}
        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Configuration</CardTitle>
              <CardDescription>
                Set delivery fees, thresholds, and service areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="delivery-fee">Delivery Fee ($)</Label>
                  <Input
                    id="delivery-fee"
                    type="number"
                    step="0.01"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Standard delivery fee per order
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free-threshold">Free Delivery Threshold ($)</Label>
                  <Input
                    id="free-threshold"
                    type="number"
                    step="0.01"
                    value={freeDeliveryThreshold}
                    onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Orders above this amount get free delivery
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-areas">Delivery Areas</Label>
                <Textarea
                  id="delivery-areas"
                  value={deliveryAreas}
                  onChange={(e) => setDeliveryAreas(e.target.value)}
                  rows={3}
                  placeholder="Comma-separated list of areas"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of areas your store delivers to
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  className="gap-1.5 bg-brand-500 hover:bg-brand-600"
                  onClick={() => handleSave("Delivery")}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Payments Tab ────────────────────────────────────────── */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure which payment methods are available to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <span className="text-lg font-bold text-purple-500">S</span>
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">
                      Accept credit/debit cards via Stripe
                    </p>
                  </div>
                </div>
                <Switch checked={stripeEnabled} onCheckedChange={setStripeEnabled} />
              </div>

              {stripeEnabled && (
                <div className="ml-14 space-y-4 rounded-lg border bg-muted/30 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-pk">Publishable Key</Label>
                    <Input
                      id="stripe-pk"
                      value={stripePublicKey}
                      onChange={(e) => setStripePublicKey(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-sk">Secret Key</Label>
                    <div className="relative">
                      <Input
                        id="stripe-sk"
                        type={showSecretKey ? "text" : "password"}
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                        className="font-mono text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSecretKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <span className="text-lg font-bold text-blue-500">B</span>
                  </div>
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">
                      Accept direct bank transfers
                    </p>
                  </div>
                </div>
                <Switch checked={bankTransferEnabled} onCheckedChange={setBankTransferEnabled} />
              </div>

              {/* Cash on Delivery */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <span className="text-lg font-bold text-emerald-500">C</span>
                  </div>
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Pay with cash when order is delivered
                    </p>
                  </div>
                </div>
                <Switch checked={cashOnDelivery} onCheckedChange={setCashOnDelivery} />
              </div>

              <div className="flex justify-end">
                <Button
                  className="gap-1.5 bg-brand-500 hover:bg-brand-600"
                  onClick={() => handleSave("Payment")}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications Tab ───────────────────────────────────── */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which events trigger email notifications to admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">New Order</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a new order is placed
                    </p>
                  </div>
                  <Switch checked={emailNewOrder} onCheckedChange={setEmailNewOrder} />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Low Stock Alert</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a product stock falls below threshold
                    </p>
                  </div>
                  <Switch checked={emailLowStock} onCheckedChange={setEmailLowStock} />
                </div>

                {emailLowStock && (
                  <div className="ml-4 max-w-xs space-y-2 rounded-lg border bg-muted/30 p-4">
                    <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                    <Input
                      id="low-stock-threshold"
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert when stock falls below this number
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Cancelled Order</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when an order is cancelled
                    </p>
                  </div>
                  <Switch checked={emailCancelledOrder} onCheckedChange={setEmailCancelledOrder} />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Daily Sales Report</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of sales and orders at 8:00 AM
                    </p>
                  </div>
                  <Switch checked={emailDailyReport} onCheckedChange={setEmailDailyReport} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="gap-1.5 bg-brand-500 hover:bg-brand-600"
                  onClick={() => handleSave("Notification")}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
