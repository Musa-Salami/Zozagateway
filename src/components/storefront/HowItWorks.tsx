"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Search,
    title: "Browse",
    description:
      "Explore our wide selection of freshly made snacks, baked goods, and treats from our curated menu.",
  },
  {
    icon: ShoppingCart,
    title: "Order",
    description:
      "Add your favorites to the cart and checkout in seconds. We accept all major payment methods.",
  },
  {
    icon: Smile,
    title: "Enjoy",
    description:
      "Get your snacks delivered fresh to your doorstep or pick them up at our store. It's that simple!",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

interface HowItWorksProps {
  className?: string;
}

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold font-heading md:text-3xl">
            How It Works
          </h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Getting your favorite snacks has never been easier. Just three
            simple steps.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector Line (desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+40px)] hidden w-[calc(100%-80px)] md:block">
                  <div className="h-0.5 w-full bg-gradient-to-r from-brand-300 to-brand-100 dark:from-brand-700 dark:to-brand-900" />
                </div>
              )}

              {/* Icon */}
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/30">
                  <step.icon className="h-8 w-8 text-brand-500" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
