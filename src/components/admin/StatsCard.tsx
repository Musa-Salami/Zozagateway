"use client";

import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage } from "@/lib/formatters";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color?: "orange" | "blue" | "green" | "purple" | "rose";
}

const colorMap = {
  orange: {
    bg: "bg-brand-500/10",
    icon: "text-brand-500",
    ring: "ring-brand-500/20",
  },
  blue: {
    bg: "bg-blue-500/10",
    icon: "text-blue-500",
    ring: "ring-blue-500/20",
  },
  green: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-500",
    ring: "ring-emerald-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    icon: "text-purple-500",
    ring: "ring-purple-500/20",
  },
  rose: {
    bg: "bg-rose-500/10",
    icon: "text-rose-500",
    ring: "ring-rose-500/20",
  },
};

function AnimatedCounter({ value }: { value: string }) {
  const numericMatch = value.match(/[\d,.]+/);
  const numericValue = numericMatch
    ? parseFloat(numericMatch[0].replace(/,/g, ""))
    : 0;
  const prefix = value.substring(0, value.indexOf(numericMatch?.[0] ?? ""));
  const suffix = value.substring(
    value.indexOf(numericMatch?.[0] ?? "") + (numericMatch?.[0]?.length ?? 0)
  );

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (numericValue >= 1000) {
      return latest.toLocaleString("en-US", {
        minimumFractionDigits: numericValue % 1 !== 0 ? 2 : 0,
        maximumFractionDigits: 2,
      });
    }
    return latest.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  });

  React.useEffect(() => {
    const controls = animate(count, numericValue, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, numericValue]);

  return (
    <span className="flex items-baseline gap-0.5">
      <span>{prefix}</span>
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color = "orange",
}: StatsCardProps) {
  const colors = colorMap[color];
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group relative overflow-hidden p-6 transition-shadow duration-300 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              <AnimatedCounter value={value} />
            </p>
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-red-500/10 text-red-600"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {formatPercentage(change)}
            </div>
          </div>

          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
              colors.bg,
              colors.ring
            )}
          >
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
        </div>

        {/* Decorative gradient */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30",
            colors.bg
          )}
        />
      </Card>
    </motion.div>
  );
}
