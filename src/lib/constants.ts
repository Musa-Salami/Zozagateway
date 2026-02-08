export const SITE_NAME = "ZozaGateway";
export const SITE_DESCRIPTION = "Freshly made snacks, delivered to your doorstep";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const DELIVERY_FEE = 3.99;
export const FREE_DELIVERY_THRESHOLD = 25.0;
export const MAX_UPLOAD_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Preparing", color: "bg-purple-100 text-purple-800" },
  READY: { label: "Ready", color: "bg-green-100 text-green-800" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  PICKED_UP: { label: "Picked Up", color: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
} as const;

export const PAYMENT_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
} as const;

export const CATEGORIES_ICONS: Record<string, string> = {
  "chips-crisps": "🍟",
  "cookies-biscuits": "🍪",
  "pastries-pies": "🥧",
  "nuts-trail-mix": "🥜",
  "candy-sweets": "🍬",
  popcorn: "🍿",
  "dried-fruits": "🍇",
  "healthy-snacks": "🥗",
  beverages: "🥤",
  "gift-packs": "🎁",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "Grid3X3" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Sales", href: "/admin/sales", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];
