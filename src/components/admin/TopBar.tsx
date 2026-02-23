"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  title: string;
  onMenuToggle: () => void;
  breadcrumbs?: { label: string; href?: string }[];
  notificationCount?: number;
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export function TopBar({
  title,
  onMenuToggle,
  breadcrumbs = [],
  notificationCount = 0,
  user = { name: "Admin User", email: "zozagatewaysnacks@gmail.com" },
}: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const logout = useAdminAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="shrink-0 lg:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Breadcrumbs & Title */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground"
            >
              Admin
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-3 w-3 shrink-0" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="truncate transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate text-foreground">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {title}
        </h1>
      </div>

      {/* Search */}
      <div
        className={cn(
          "hidden items-center md:flex",
          searchOpen && "flex"
        )}
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders, products..."
            className="h-9 w-[200px] bg-muted/50 pl-8 lg:w-[280px]"
          />
        </div>
      </div>

      {/* Mobile Search Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative shrink-0">
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {/* User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full"
          >
            <Avatar className="h-9 w-9">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="bg-brand-500/10 text-brand-500 text-xs font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
