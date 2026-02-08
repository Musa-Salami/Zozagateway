"use client";

import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const ORDER_STEPS: {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { status: "PENDING", label: "Pending", icon: Clock },
  { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { status: "PREPARING", label: "Preparing", icon: ChefHat },
  { status: "READY", label: "Ready", icon: PackageCheck },
  { status: "DELIVERED", label: "Delivered", icon: Truck },
];

interface OrderTrackerProps {
  currentStatus: OrderStatus;
  className?: string;
}

export function OrderTracker({ currentStatus, className }: OrderTrackerProps) {
  const currentIndex = ORDER_STEPS.findIndex(
    (step) => step.status === currentStatus
  );

  // Handle cancelled status
  if (currentStatus === "CANCELLED") {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-800 dark:bg-red-950 dark:text-red-400">
          Order Cancelled
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Tracker */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {ORDER_STEPS.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.status}
                className="flex flex-1 flex-col items-center relative"
              >
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute top-5 right-1/2 w-full h-0.5 -translate-y-1/2",
                      index <= currentIndex
                        ? "bg-brand-500"
                        : "bg-muted-foreground/20"
                    )}
                  />
                )}

                {/* Step dot */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-muted-foreground/30 bg-background text-muted-foreground",
                    isCurrent && "ring-4 ring-brand-500/20"
                  )}
                >
                  <StepIcon className="h-5 w-5" />
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isCompleted
                      ? "text-brand-500"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Tracker */}
      <div className="sm:hidden space-y-3">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.status} className="flex items-center gap-3">
              {/* Vertical connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-muted-foreground/30 bg-background text-muted-foreground",
                    isCurrent && "ring-4 ring-brand-500/20"
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                {index < ORDER_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-6 w-0.5 my-1",
                      index < currentIndex
                        ? "bg-brand-500"
                        : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-brand-500" : "text-muted-foreground",
                  isCurrent && "font-semibold"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
