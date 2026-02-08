export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  categoryId: string;
  category?: Category;
  stock: number;
  sku?: string | null;
  tags: string[];
  dietary: string[];
  published: boolean;
  featured: boolean;
  images: ProductImage[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentId?: string | null;
  paymentStatus: PaymentStatus;
  deliveryType: "DELIVERY" | "PICKUP";
  address?: string | null;
  city?: string | null;
  phone: string;
  notes?: string | null;
  items: OrderItem[];
  timeline?: OrderTimelineEntry[];
  promoCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimelineEntry {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  changedBy?: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
  avatar?: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "PICKED_UP"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface DashboardStats {
  totalRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  revenue: number;
  quantity: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
