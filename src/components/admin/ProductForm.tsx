"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { productSchema } from "@/lib/validators";
import type { Product, Category, ProductImage } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUploader } from "./ImageUploader";
import type { z } from "zod";

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormData, images: ProductImage[]) => void | Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

const DIETARY_OPTIONS = [
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "nut-free", label: "Nut-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
];

export function ProductForm({
  initialData,
  categories,
  onSubmit,
  isLoading = false,
  onCancel,
}: ProductFormProps) {
  const [images, setImages] = useState<ProductImage[]>(
    initialData?.images ?? []
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") ?? ""
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      comparePrice: initialData?.comparePrice ?? null,
      categoryId: initialData?.categoryId ?? "",
      stock: initialData?.stock ?? 0,
      sku: initialData?.sku ?? "",
      tags: initialData?.tags ?? [],
      dietary: initialData?.dietary ?? [],
      published: initialData?.published ?? false,
      featured: initialData?.featured ?? false,
    },
  });

  const published = watch("published");
  const featured = watch("featured");
  const dietary = watch("dietary");

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setValue("tags", tags);
  };

  const handleDietaryToggle = (id: string) => {
    const current = dietary ?? [];
    const updated = current.includes(id)
      ? current.filter((d) => d !== id)
      : [...current, id];
    setValue("dietary", updated);
  };

  const handleImageUpload = async (files: File[]) => {
    // Convert files to persistent base64 data URLs
    const newImages: ProductImage[] = await Promise.all(
      files.map(
        (file, i) =>
          new Promise<ProductImage>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                id: `img-${Date.now()}-${i}`,
                productId: initialData?.id ?? "",
                url: reader.result as string,
                publicId: `img-${Date.now()}-${i}`,
                position: images.length + i,
              });
            };
            reader.readAsDataURL(file);
          })
      )
    );
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemove = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated.map((img, i) => ({ ...img, position: i }));
    });
  };

  const submitHandler = (data: ProductFormData) => {
    onSubmit(data, images);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register("name")}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  rows={4}
                  {...register("description")}
                  className={cn(errors.description && "border-red-500")}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={images}
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
                onReorder={handleImageReorder}
              />
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price")}
                    className={cn(errors.price && "border-red-500")}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price (₦)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("comparePrice")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Original price for showing discount
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...register("stock")}
                    className={cn(errors.stock && "border-red-500")}
                  />
                  {errors.stock && (
                    <p className="text-xs text-red-500">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="e.g. ZG-001"
                    {...register("sku")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags & Dietary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags & Dietary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="e.g. popular, new arrival, bestseller"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="space-y-3">
                <Label>Dietary Information</Label>
                <div className="grid grid-cols-2 gap-3">
                  {DIETARY_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={dietary?.includes(option.id) ?? false}
                        onCheckedChange={() => handleDietaryToggle(option.id)}
                      />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Product is visible to customers
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setValue("published", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Show on homepage
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={watch("categoryId")}
                onValueChange={(val) => setValue("categoryId", val)}
              >
                <SelectTrigger
                  className={cn(errors.categoryId && "border-red-500")}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {initialData ? "Update Product" : "Create Product"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
