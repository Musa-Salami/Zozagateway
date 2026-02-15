"use client";

import { motion } from "framer-motion";
import { HeroSection } from "@/components/storefront/HeroSection";
import { FeaturedCarousel } from "@/components/storefront/FeaturedCarousel";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { HowItWorks } from "@/components/storefront/HowItWorks";
import { TestimonialCard } from "@/components/storefront/TestimonialCard";
import { Newsletter } from "@/components/storefront/Newsletter";
import type { Product, Category } from "@/types";

// -- Sample Featured Products --
const sampleFeaturedProducts: Product[] = [
  {
    id: "prod-1",
    name: "Honey BBQ Kettle Chips",
    slug: "honey-bbq-kettle-chips",
    description: "Thick-cut kettle chips with a smoky honey BBQ glaze. Perfectly crunchy and irresistibly sweet-savory.",
    price: 4.99,
    comparePrice: 6.99,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
    stock: 120,
    tags: ["bestseller", "crunchy"],
    dietary: ["Gluten-Free"],
    published: true,
    featured: true,
    images: [{ id: "img-1", productId: "prod-1", url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", publicId: "chips-1", position: 0 }],
    averageRating: 4.7,
    reviewCount: 89,
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "prod-2",
    name: "Double Chocolate Cookies",
    slug: "double-chocolate-cookies",
    description: "Rich, chewy cookies loaded with dark and milk chocolate chunks. Baked fresh daily.",
    price: 6.49,
    comparePrice: null,
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
    stock: 85,
    tags: ["fresh-baked", "chocolate"],
    dietary: [],
    published: true,
    featured: true,
    images: [{ id: "img-2", productId: "prod-2", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", publicId: "cookies-1", position: 0 }],
    averageRating: 4.9,
    reviewCount: 124,
    createdAt: "2025-05-15T10:00:00Z",
    updatedAt: "2025-11-20T10:00:00Z",
  },
  {
    id: "prod-3",
    name: "Classic Meat Pie",
    slug: "classic-meat-pie",
    description: "Flaky golden pastry filled with seasoned minced meat and savory gravy. A comforting snack.",
    price: 5.99,
    comparePrice: 7.49,
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3 },
    stock: 45,
    tags: ["comfort-food", "savory"],
    dietary: [],
    published: true,
    featured: true,
    images: [{ id: "img-3", productId: "prod-3", url: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400", publicId: "pie-1", position: 0 }],
    averageRating: 4.5,
    reviewCount: 67,
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-12-10T10:00:00Z",
  },
  {
    id: "prod-4",
    name: "Honey Roasted Almonds",
    slug: "honey-roasted-almonds",
    description: "Premium almonds roasted with a touch of honey and sea salt. Perfect on-the-go snack.",
    price: 8.99,
    comparePrice: null,
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4 },
    stock: 200,
    tags: ["healthy", "protein"],
    dietary: ["Gluten-Free", "Vegan"],
    published: true,
    featured: true,
    images: [{ id: "img-4", productId: "prod-4", url: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400", publicId: "almonds-1", position: 0 }],
    averageRating: 4.8,
    reviewCount: 52,
    createdAt: "2025-06-20T10:00:00Z",
    updatedAt: "2025-11-30T10:00:00Z",
  },
  {
    id: "prod-5",
    name: "Gummy Bear Mix",
    slug: "gummy-bear-mix",
    description: "A rainbow assortment of soft, fruity gummy bears. Fun for kids and adults alike.",
    price: 3.49,
    comparePrice: 4.99,
    categoryId: "cat-5",
    category: { id: "cat-5", name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5 },
    stock: 300,
    tags: ["fruity", "kids-favorite"],
    dietary: [],
    published: true,
    featured: true,
    images: [{ id: "img-5", productId: "prod-5", url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400", publicId: "gummy-1", position: 0 }],
    averageRating: 4.3,
    reviewCount: 38,
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-12-05T10:00:00Z",
  },
  {
    id: "prod-6",
    name: "Caramel Popcorn Tub",
    slug: "caramel-popcorn-tub",
    description: "Generously coated caramel popcorn made with real butter and brown sugar. Movie night essential.",
    price: 5.49,
    comparePrice: null,
    categoryId: "cat-6",
    category: { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6 },
    stock: 150,
    tags: ["movie-night", "sweet"],
    dietary: ["Gluten-Free"],
    published: true,
    featured: true,
    images: [{ id: "img-6", productId: "prod-6", url: "https://images.unsplash.com/photo-1585735675361-115f1f537af5?w=400", publicId: "popcorn-1", position: 0 }],
    averageRating: 4.6,
    reviewCount: 73,
    createdAt: "2025-05-10T10:00:00Z",
    updatedAt: "2025-11-15T10:00:00Z",
  },
  {
    id: "prod-7",
    name: "Kale & Quinoa Bites",
    slug: "kale-quinoa-bites",
    description: "Crispy baked bites with superfoods kale and quinoa. A guilt-free snack packed with nutrition.",
    price: 7.99,
    comparePrice: 9.99,
    categoryId: "cat-7",
    category: { id: "cat-7", name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7 },
    stock: 90,
    tags: ["superfood", "organic"],
    dietary: ["Vegan", "Gluten-Free"],
    published: true,
    featured: true,
    images: [{ id: "img-7", productId: "prod-7", url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", publicId: "kale-1", position: 0 }],
    averageRating: 4.4,
    reviewCount: 29,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-12-12T10:00:00Z",
  },
  {
    id: "prod-8",
    name: "Fresh Mango Smoothie",
    slug: "fresh-mango-smoothie",
    description: "Tropical mango smoothie blended with yogurt and a hint of lime. Refreshingly delicious.",
    price: 4.99,
    comparePrice: null,
    categoryId: "cat-8",
    category: { id: "cat-8", name: "Beverages", slug: "beverages", sortOrder: 8 },
    stock: 60,
    tags: ["tropical", "refreshing"],
    dietary: ["Vegetarian"],
    published: true,
    featured: true,
    images: [{ id: "img-8", productId: "prod-8", url: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400", publicId: "smoothie-1", position: 0 }],
    averageRating: 4.6,
    reviewCount: 41,
    createdAt: "2025-07-15T10:00:00Z",
    updatedAt: "2025-12-08T10:00:00Z",
  },
];

// -- Sample Categories --
const sampleCategories: Category[] = [
  { id: "cat-1", name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1, _count: { products: 18 } },
  { id: "cat-2", name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2, _count: { products: 24 } },
  { id: "cat-3", name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3, _count: { products: 12 } },
  { id: "cat-4", name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4, _count: { products: 15 } },
  { id: "cat-5", name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5, _count: { products: 30 } },
  { id: "cat-6", name: "Popcorn", slug: "popcorn", sortOrder: 6, _count: { products: 8 } },
  { id: "cat-7", name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7, _count: { products: 20 } },
  { id: "cat-8", name: "Beverages", slug: "beverages", sortOrder: 8, _count: { products: 14 } },
];

// -- Sample Testimonials --
const sampleTestimonials = [
  {
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80",
    rating: 5,
    review: "ZozaGateway has become my go-to for snack cravings! The honey BBQ kettle chips are absolutely addictive. Delivery is always fast and everything arrives fresh. Highly recommend!",
    date: "2025-11-15T10:00:00Z",
  },
  {
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
    rating: 5,
    review: "Best online snack store I have found! The variety is incredible and the quality is top-notch. My office orders from here every week. The chocolate cookies are out of this world.",
    date: "2025-10-28T10:00:00Z",
  },
  {
    name: "Amara Osei",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80",
    rating: 4,
    review: "Love the healthy snack options! The kale & quinoa bites are perfect for my work-from-home snacking. Great customer service too - they replaced a damaged order same day.",
    date: "2025-12-02T10:00:00Z",
  },
];

// -- Animation variants --
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Featured Products */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <FeaturedCarousel products={sampleFeaturedProducts} />
      </motion.div>

      {/* Categories */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-heading md:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Browse our delicious snack categories and find your favorites
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {sampleCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <HowItWorks />
      </motion.div>

      {/* Testimonials */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-heading md:text-3xl">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Real reviews from happy snack lovers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sampleTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <Newsletter />
      </motion.div>
    </>
  );
}