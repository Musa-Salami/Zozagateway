"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";
import { signUpSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

// Extend signUpSchema with confirmPassword
const signUpFormSchema = signUpSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormInput = z.infer<typeof signUpFormSchema>;

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 20, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 40, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score: 60, label: "Medium", color: "bg-yellow-500" };
  if (score <= 4) return { score: 80, label: "Strong", color: "bg-green-500" };
  return { score: 100, label: "Very Strong", color: "bg-emerald-500" };
}

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password", "");

  const passwordStrength = useMemo(
    () => getPasswordStrength(watchPassword),
    [watchPassword]
  );

  const passwordCriteria = useMemo(
    () => [
      { label: "At least 8 characters", met: watchPassword.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(watchPassword) },
      { label: "One number", met: /[0-9]/.test(watchPassword) },
      {
        label: "One special character",
        met: /[^A-Za-z0-9]/.test(watchPassword),
      },
    ],
    [watchPassword]
  );

  const onSubmit = async (data: SignUpFormInput) => {
    if (!acceptTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Failed to create account.");
      }

      setIsSuccess(true);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-1 text-center"
            >
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Create Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Join ZozaGateway and start ordering your favorite snacks
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-5 pt-4">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <div className="text-center">
                    <h2 className="font-heading text-lg font-semibold">
                      Account Created!
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Redirecting you to sign in...
                    </p>
                  </div>
                  <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
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
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className={cn(
                            "h-11 pl-10",
                            errors.name &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                          {...register("name")}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
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
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone (optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+234 800 000 0000"
                          className="h-11 pl-10"
                          {...register("phone")}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className={cn(
                            "h-11 pl-10 pr-10",
                            errors.password &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                          {...register("password")}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-destructive">
                          {errors.password.message}
                        </p>
                      )}

                      {/* Password strength indicator */}
                      {watchPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Password strength
                            </span>
                            <span
                              className={cn(
                                "text-xs font-medium",
                                passwordStrength.score <= 20
                                  ? "text-red-500"
                                  : passwordStrength.score <= 40
                                  ? "text-orange-500"
                                  : passwordStrength.score <= 60
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              )}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className={cn(
                                "h-full rounded-full transition-colors",
                                passwordStrength.color
                              )}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${passwordStrength.score}%`,
                              }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>

                          {/* Password criteria */}
                          <div className="grid grid-cols-2 gap-1">
                            {passwordCriteria.map((criterion) => (
                              <div
                                key={criterion.label}
                                className="flex items-center gap-1.5"
                              >
                                <div
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full transition-colors",
                                    criterion.met
                                      ? "bg-green-500"
                                      : "bg-muted-foreground/30"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-[11px]",
                                    criterion.met
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {criterion.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          className={cn(
                            "h-11 pl-10 pr-10",
                            errors.confirmPassword &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                          {...register("confirmPassword")}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked as boolean)
                        }
                        disabled={isLoading}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="terms"
                        className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="font-medium text-brand-500 hover:text-brand-600"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="font-medium text-brand-500 hover:text-brand-600"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isLoading || !acceptTerms}
                      className="h-11 w-full bg-brand-500 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Sign in link */}
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/auth/signin"
                      className="font-semibold text-brand-500 transition-colors hover:text-brand-600"
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
