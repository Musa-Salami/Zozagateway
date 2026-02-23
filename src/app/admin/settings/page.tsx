"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsStore, type StoreSettings } from "@/stores/settingsStore";

export default function SettingsPage() {
  const storeSettings = useSettingsStore((s) => s.settings);
  const hasHydrated = useSettingsStore((s) => s._hasHydrated);
  const loading = useSettingsStore((s) => s._loading);
  const saveSettings = useSettingsStore((s) => s.saveSettings);

  const [form, setForm] = useState<StoreSettings>(storeSettings);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    if (hasHydrated) setForm(storeSettings);
  }, [hasHydrated, storeSettings]);

  const patch = (updates: Partial<StoreSettings>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async (section: string) => {
    try {
      await saveSettings(form);
      toast.success(`${section} settings saved`, {
        description: "Your changes have been applied successfully.",
      });
    } catch {
      toast.error("Failed to save settings");
    }
  };

  if (!hasHydrated) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[480px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic details about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" value={form.storeName} onChange={(e) => patch({ storeName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">Description</Label>
                <Textarea id="store-description" value={form.storeDescription} onChange={(e) => patch({ storeDescription: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed bg-muted">
                    <span className="text-2xl font-bold text-brand-500">Z</span>
                  </div>
                  <Button variant="outline" className="gap-1.5"><Upload className="h-4 w-4" />Upload Logo</Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 512x512px, PNG or SVG</p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={form.currency} onValueChange={(v) => patch({ currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN (&#8358;)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (&#163;)</SelectItem>
                      <SelectItem value="EUR">EUR (&#8364;)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={form.timezone} onValueChange={(v) => patch({ timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Button className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={() => handleSave("General")} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery */}
        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Configuration</CardTitle>
              <CardDescription>Set delivery fees, thresholds, and service areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="delivery-fee">Delivery Fee (&#8358;)</Label>
                  <Input id="delivery-fee" type="number" step="0.01" value={form.deliveryFee} onChange={(e) => patch({ deliveryFee: Number(e.target.value) })} />
                  <p className="text-xs text-muted-foreground">Standard delivery fee per order</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free-threshold">Free Delivery Threshold (&#8358;)</Label>
                  <Input id="free-threshold" type="number" step="0.01" value={form.freeDeliveryThreshold} onChange={(e) => patch({ freeDeliveryThreshold: Number(e.target.value) })} />
                  <p className="text-xs text-muted-foreground">Orders above this amount get free delivery</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-areas">Delivery Areas</Label>
                <Textarea id="delivery-areas" value={form.deliveryAreas} onChange={(e) => patch({ deliveryAreas: e.target.value })} rows={3} placeholder="Comma-separated list of areas" />
                <p className="text-xs text-muted-foreground">Comma-separated list of areas your store delivers to</p>
              </div>
              <div className="flex justify-end">
                <Button className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={() => handleSave("Delivery")} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure which payment methods are available to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <span className="text-lg font-bold text-purple-500">S</span>
                  </div>
                  <div><p className="font-medium">Stripe</p><p className="text-sm text-muted-foreground">Accept credit/debit cards via Stripe</p></div>
                </div>
                <Switch checked={form.stripeEnabled} onCheckedChange={(v) => patch({ stripeEnabled: v })} />
              </div>
              {form.stripeEnabled && (
                <div className="ml-14 space-y-4 rounded-lg border bg-muted/30 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-pk">Publishable Key</Label>
                    <Input id="stripe-pk" value={form.stripePublicKey} onChange={(e) => patch({ stripePublicKey: e.target.value })} className="font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-sk">Secret Key</Label>
                    <div className="relative">
                      <Input id="stripe-sk" type={showSecretKey ? "text" : "password"} value={form.stripeSecretKey} onChange={(e) => patch({ stripeSecretKey: e.target.value })} className="font-mono text-sm pr-10" />
                      <button type="button" onClick={() => setShowSecretKey(!showSecretKey)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <span className="text-lg font-bold text-blue-500">B</span>
                  </div>
                  <div><p className="font-medium">Bank Transfer</p><p className="text-sm text-muted-foreground">Accept direct bank transfers</p></div>
                </div>
                <Switch checked={form.bankTransferEnabled} onCheckedChange={(v) => patch({ bankTransferEnabled: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <span className="text-lg font-bold text-emerald-500">C</span>
                  </div>
                  <div><p className="font-medium">Cash on Delivery</p><p className="text-sm text-muted-foreground">Pay with cash when order is delivered</p></div>
                </div>
                <Switch checked={form.cashOnDelivery} onCheckedChange={(v) => patch({ cashOnDelivery: v })} />
              </div>
              <div className="flex justify-end">
                <Button className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={() => handleSave("Payment")} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose which events trigger email notifications to admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div><p className="font-medium">New Order</p><p className="text-sm text-muted-foreground">Get notified when a new order is placed</p></div>
                  <Switch checked={form.emailNewOrder} onCheckedChange={(v) => patch({ emailNewOrder: v })} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div><p className="font-medium">Low Stock Alert</p><p className="text-sm text-muted-foreground">Get notified when a product stock falls below threshold</p></div>
                  <Switch checked={form.emailLowStock} onCheckedChange={(v) => patch({ emailLowStock: v })} />
                </div>
                {form.emailLowStock && (
                  <div className="ml-4 max-w-xs space-y-2 rounded-lg border bg-muted/30 p-4">
                    <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                    <Input id="low-stock-threshold" type="number" value={form.lowStockThreshold} onChange={(e) => patch({ lowStockThreshold: Number(e.target.value) })} />
                    <p className="text-xs text-muted-foreground">Alert when stock falls below this number</p>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div><p className="font-medium">Cancelled Order</p><p className="text-sm text-muted-foreground">Get notified when an order is cancelled</p></div>
                  <Switch checked={form.emailCancelledOrder} onCheckedChange={(v) => patch({ emailCancelledOrder: v })} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div><p className="font-medium">Daily Sales Report</p><p className="text-sm text-muted-foreground">Receive a daily summary of sales and orders at 8:00 AM</p></div>
                  <Switch checked={form.emailDailyReport} onCheckedChange={(v) => patch({ emailDailyReport: v })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={() => handleSave("Notification")} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
