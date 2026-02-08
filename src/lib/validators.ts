import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
  tags: z.array(z.string()).default([]),
  dietary: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  image: z.string().url().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const orderSchema = z.object({
  deliveryType: z.enum(["DELIVERY", "PICKUP"]),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().min(10, "Valid phone number is required"),
  notes: z.string().optional(),
  promoCode: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
