"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Grid3X3,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Grid3X3,
  Users,
  BarChart3,
  Settings,
};

interface SidebarProps {
  currentPath?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentPath, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return activePath === "/admin";
    return activePath.startsWith(href);
  };

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col bg-slate-900 text-slate-300 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2.5 transition-opacity",
            collapsed && "justify-center"
          )}
        >
          <img
            src="/images/logo.png"
            alt="Zoza Gateway Snacks"
            className="h-10 w-auto shrink-0 object-contain dark:hidden"
          />
          <img
            src="/images/logo1.png"
            alt="Zoza Gateway Snacks"
            className="h-10 w-auto shrink-0 object-contain hidden dark:block"
          />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap font-heading text-lg font-bold text-white"
            >
              {SITE_NAME}
            </motion.span>
          )}
        </Link>

        {/* Mobile close button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:block"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                active
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-brand-500/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-5 w-5 shrink-0 transition-colors",
                  active ? "text-brand-500" : "text-slate-400 group-hover:text-white"
                )}
              />
              {!collapsed && (
                <span className="relative truncate">{link.label}</span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full z-50 ml-2 origin-left scale-0 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-transform group-hover:pointer-events-auto group-hover:scale-100">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="border-t border-slate-700/50 p-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white",
            collapsed && "justify-center px-2"
          )}
        >
          <Store className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen shrink-0 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
