"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingEmojis = [
  { emoji: "🍪", x: "10%", y: "20%", delay: 0 },
  { emoji: "🍟", x: "85%", y: "15%", delay: 0.5 },
  { emoji: "🥜", x: "75%", y: "70%", delay: 1 },
  { emoji: "🍿", x: "15%", y: "75%", delay: 1.5 },
  { emoji: "🥧", x: "90%", y: "45%", delay: 0.8 },
  { emoji: "🍬", x: "5%", y: "50%", delay: 1.2 },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-background to-orange-50 dark:from-brand-950/30 dark:via-background dark:to-orange-950/20">
      {/* Decorative floating emojis */}
      {floatingEmojis.map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl md:text-5xl select-none pointer-events-none opacity-20 dark:opacity-10"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}

      {/* Gradient decorations */}
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-500/10" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/10" />

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span>Handcrafted with love</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Freshly Made Snacks,{" "}
            <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
              Delivered to You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto"
          >
            Discover our curated selection of freshly made snacks, baked goods,
            and treats. Made with premium ingredients and delivered straight to
            your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-brand-500/25"
              >
                Order Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                variant="outline"
                size="lg"
                className="px-8 h-12 text-base font-semibold"
              >
                View Menu
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
