"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, BookOpen } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
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
              <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
              <span>Fresh snacks delivered daily</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Freshly Made
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
              Snacks, Delivered
            </span>
            <br />
            to You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto"
          >
            Discover our <span className="font-semibold text-brand-500">handcrafted collection</span> of delicious snacks.
            From crispy chips to decadent cookies, satisfaction is just
            a click away.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4"
          >
            {/* Primary CTA */}
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white px-10 h-14 text-lg font-bold shadow-lg shadow-brand-500/25 rounded-xl"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://wa.me/c/2349039412203"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-green-600/25 rounded-xl"
                >
                  <WhatsAppIcon className="mr-2 h-5 w-5" />
                  WhatsApp Order
                </Button>
              </a>
              <Link href="/menu">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 h-12 text-base font-semibold rounded-xl"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Menu
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
