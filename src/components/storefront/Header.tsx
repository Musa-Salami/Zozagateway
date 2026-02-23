"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  Settings,
  Home,
  UtensilsCrossed,
  Info,
  MessageCircle,
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
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<string, React.ElementType> = {
  "/": Home,
  "/menu": UtensilsCrossed,
  "/about": Info,
  "/contact": MessageCircle,
};

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Navigation – Tab Style */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/50 rounded-full px-1.5 py-1">
          {NAV_LINKS.map((link) => {
            const Icon = NAV_ICONS[link.href];
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all rounded-full",
                  isActive
                    ? "text-brand-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDesktopTab"
                    className="absolute inset-0 bg-background shadow-sm rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Search Toggle (Desktop) */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:block overflow-hidden"
              >
                <SearchBar onClose={() => setSearchOpen(false)} />
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hidden md:inline-flex"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.span>
              )}
            </Button>
          </Link>

          {/* Admin Button */}
          <Link href="/admin" className="hidden md:inline-flex">
            <Button
              size="sm"
              className="rounded-full gap-1.5 bg-foreground text-background hover:bg-foreground/90 font-medium text-sm px-4"
              aria-label="Admin dashboard"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>

          {/* User / Sign In */}
          <Link href="/auth/signin" className="hidden md:inline-flex">
            <Button variant="ghost" size="icon" aria-label="Sign in">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo size="sm" />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                {/* Mobile Search */}
                <div className="mb-4">
                  <SearchBar onClose={() => setMobileMenuOpen(false)} />
                </div>

                <div className="mt-2 border-t pt-4">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full mb-2">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-brand-500 hover:bg-brand-600">
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
  );
}
