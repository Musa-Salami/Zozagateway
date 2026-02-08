"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MailOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setIsLoading(true);
      setError(null);

      // Placeholder: POST to password reset endpoint
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Failed to send reset link.");
      }

      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err) {
      // Show success even on error for security (don't reveal if email exists)
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-0 bg-white/80 shadow-2xl shadow-brand-500/5 backdrop-blur-xl dark:bg-gray-950/80 dark:shadow-brand-500/10">
          <CardHeader className="items-center space-y-4 pb-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
            >
              <Logo size="lg" />
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-5 py-6"
                >
                  {/* Envelope animation */}
                  <motion.div
                    className="relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <MailOpen className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <motion.div
                      className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 text-center"
                  >
                    <h2 className="font-heading text-xl font-bold">
                      Check Your Email!
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      We&apos;ve sent a password reset link to{" "}
                      <span className="font-medium text-foreground">
                        {submittedEmail}
                      </span>
                      . Check your inbox and follow the instructions to reset
                      your password.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full space-y-3"
                  >
                    <p className="text-center text-xs text-muted-foreground">
                      Didn&apos;t receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          setError(null);
                        }}
                        className="font-medium text-brand-500 hover:text-brand-600"
                      >
                        try again
                      </button>
                    </p>

                    <Link href="/auth/signin" className="block">
                      <Button
                        variant="outline"
                        className="h-11 w-full font-medium"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Icon */}
                  <div className="mb-5 flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, type: "spring" }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950/50"
                    >
                      <Mail className="h-8 w-8 text-brand-500" />
                    </motion.div>
                  </div>

                  {/* Heading */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 space-y-2 text-center"
                  >
                    <h1 className="font-heading text-2xl font-bold tracking-tight">
                      Reset Password
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Enter your email address and we&apos;ll send you a link to
                      reset your password
                    </p>
                  </motion.div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Email field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className={cn(
                            "h-11 pl-10",
                            errors.email &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                          {...register("email")}
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-11 w-full bg-brand-500 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reset Link
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Back to sign in */}
                  <div className="mt-6">
                    <Link href="/auth/signin" className="block">
                      <Button
                        variant="ghost"
                        className="h-11 w-full font-medium text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
