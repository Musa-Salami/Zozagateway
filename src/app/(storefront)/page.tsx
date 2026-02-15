"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/storefront/HeroSection";
import { FeaturedCarousel } from "@/components/storefront/FeaturedCarousel";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { HowItWorks } from "@/components/storefront/HowItWorks";
import { TestimonialCard } from "@/components/storefront/TestimonialCard";
import { Newsletter } from "@/components/storefront/Newsletter";
import { useProductStore, CATEGORIES } from "@/stores/productStore";
import type { Category } from "@/types";

// -- Sample Testimonials --
const sampleTestimonials = [
  {
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80",
    rating: 5,
    review: "Zoza Gateway Snacks has become my go-to for snack cravings! The honey BBQ kettle chips are absolutely addictive. Delivery is always fast and everything arrives fresh. Highly recommend!",
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
  const products = useProductStore((s) => s.products);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured && p.published),
    [products]
  );

  const dynamicCategories = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        _count: {
          products: products.filter(
            (p) => p.categoryId === cat.id && p.published
          ).length,
        },
      })),
    [products]
  );

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
        <FeaturedCarousel products={featuredProducts} />
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
            {dynamicCategories.map((category) => (
              <CategoryCard key={category.id} category={category as Category} />
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