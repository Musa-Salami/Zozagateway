"use client";

import { motion } from "framer-motion";

const floatingSnacks = [
  { emoji: "🍪", x: "8%", y: "15%", delay: 0, size: "text-4xl" },
  { emoji: "🍟", x: "88%", y: "10%", delay: 0.5, size: "text-5xl" },
  { emoji: "🥜", x: "78%", y: "72%", delay: 1, size: "text-3xl" },
  { emoji: "🍿", x: "12%", y: "78%", delay: 1.5, size: "text-5xl" },
  { emoji: "🥧", x: "92%", y: "48%", delay: 0.8, size: "text-4xl" },
  { emoji: "🍬", x: "4%", y: "45%", delay: 1.2, size: "text-3xl" },
  { emoji: "🧁", x: "50%", y: "5%", delay: 0.3, size: "text-4xl" },
  { emoji: "🍩", x: "65%", y: "85%", delay: 1.8, size: "text-5xl" },
  { emoji: "🍫", x: "30%", y: "90%", delay: 0.6, size: "text-3xl" },
  { emoji: "🥐", x: "95%", y: "25%", delay: 1.4, size: "text-4xl" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-orange-50 dark:from-brand-950/40 dark:via-background dark:to-orange-950/30">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand-300/20 blur-[100px] dark:bg-brand-500/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-300/20 blur-[100px] dark:bg-orange-500/10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/15 blur-[80px] dark:bg-brand-600/5" />

      {/* Floating snack emojis */}
      {floatingSnacks.map((item, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute select-none opacity-[0.12] dark:opacity-[0.06] ${item.size}`}
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 12, -12, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5 + i * 0.3,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Page content */}
      <div className="relative z-10 w-full px-4 py-8">{children}</div>
    </div>
  );
}
