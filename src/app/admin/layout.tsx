"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";

/* ── Admin login form ────────────────────────────────────────────────── */

function AdminLoginForm() {
  const login = useAdminAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = login(email, password);
    if (!ok) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-orange-50 dark:from-brand-950/40 dark:via-background dark:to-orange-950/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 bg-white/80 shadow-2xl shadow-brand-500/5 backdrop-blur-xl dark:bg-gray-950/80">
          <CardHeader className="items-center space-y-4 pb-2">
            <Logo size="lg" />
            <div className="space-y-1 text-center">
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Admin Login
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to access the admin dashboard
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

/* ── Admin layout ────────────────────────────────────────────────────── */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hydrate } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  // Avoid flash while reading localStorage
  if (!hydrated) return null;

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title="Admin"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          notificationCount={3}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
