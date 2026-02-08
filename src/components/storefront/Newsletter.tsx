"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NewsletterProps {
  className?: string;
}

export function Newsletter({ className }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // In production, this would call an API endpoint
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-brand-500 to-orange-400 dark:from-brand-700 dark:to-orange-600",
        className
      )}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl font-heading">
            Stay in the Loop!
          </h2>
          <p className="mt-3 text-base text-white/80">
            Subscribe to our newsletter for exclusive deals, new arrivals, and
            delicious snack inspiration delivered to your inbox.
          </p>

          {submitted ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-white">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Thank you for subscribing!
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 max-w-sm bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-white"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-gray-900 hover:bg-gray-800 text-white px-8"
              >
                Subscribe
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-white/60">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
