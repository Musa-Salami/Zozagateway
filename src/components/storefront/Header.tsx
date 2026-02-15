"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  Sparkles,
  Truck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SearchBar } from "@/components/storefront/SearchBar";
import { useCartStore } from "@/stores/cartStore";
import { NAV_LINKS, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PROMO_MESSAGES = [
  { icon: Truck, text: `Free delivery on orders over $${FREE_DELIVERY_THRESHOLD}!` },
  { icon: Sparkles, text: "Freshly made snacks — order today, enjoy tomorrow!" },
];

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  const { scrollY } = useScroll();
  const headerShadow = useTransform(scrollY, [0, 50], [0, 1]);
  const [shadow, setShadow] = useState(0);

  useEffect(() => {
    const unsubscribe = headerShadow.on("change", (v) => setShadow(v));
    return unsubscribe;
  }, [headerShadow]);

  // Rotate promo messages
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((i) => (i + 1) % PROMO_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const CurrentPromoIcon = PROMO_MESSAGES[promoIndex].icon;

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* ── Announcement / Promo Bar ── */}
      <AnimatePresence>
        {!promoDismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white"
          >
            <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium sm:text-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={promoIndex}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-1.5"
                >
                  <CurrentPromoIcon className="h-3.5 w-3.5" />
                  <span>{PROMO_MESSAGES[promoIndex].text}</span>
                </motion.div>
              </AnimatePresence>

              <Link
                href="/menu"
                className="ml-1 hidden items-center gap-0.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm transition-colors hover:bg-white/30 sm:inline-flex"
              >
                Shop Now <ChevronRight className="h-3 w-3" />
              </Link>

              <button
                onClick={() => setPromoDismissed(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 transition-colors hover:bg-white/20"
                aria-label="Dismiss banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Header ── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{
          boxShadow:
            shadow > 0
              ? `0 4px 30px rgba(0,0,0,${shadow * 0.08})`
              : "none",
        }}
        className="relative w-full bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
      >
        {/* Warm gradient accent line */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:h-[68px]">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation — pill style */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-0.5 rounded-full bg-muted/50 p-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 shadow-md shadow-brand-500/25"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search Toggle (Desktop) */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="hidden md:block overflow-hidden"
                >
                  <SearchBar onClose={() => setSearchOpen(false)} />
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:inline-flex rounded-full hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                  aria-label="Open search"
                >
                  <Search className="h-[18px] w-[18px]" />
                </Button>
              )}
            </AnimatePresence>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                aria-label="Cart"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 px-1 text-[10px] font-bold text-white shadow-lg shadow-brand-500/30"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Divider */}
            <div className="hidden md:block mx-1 h-6 w-px bg-border" />

            {/* Sign In */}
            <Link href="/auth/signin" className="hidden md:inline-flex">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 px-3 text-sm font-medium hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="border-b px-6 py-5">
                  <SheetTitle className="text-left">
                    <Logo size="sm" />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-1 p-4">
                  {/* Mobile Search */}
                  <div className="mb-3">
                    <SearchBar onClose={() => setMobileMenuOpen(false)} />
                  </div>

                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        pathname === link.href
                          ? "bg-gradient-to-r from-brand-50 to-brand-100/60 text-brand-600 dark:from-brand-500/15 dark:to-brand-500/5 dark:text-brand-400"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                      )}
                    </Link>
                  ))}

                  <div className="mt-4 border-t pt-4">
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-shadow">
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
