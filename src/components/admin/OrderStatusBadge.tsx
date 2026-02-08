"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

const dotColorMap: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500",
  CONFIRMED: "bg-blue-500",
  PREPARING: "bg-purple-500",
  READY: "bg-green-500",
  DELIVERED: "bg-emerald-500",
  PICKED_UP: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

export function OrderStatusBadge({
  status,
  size = "md",
}: OrderStatusBadgeProps) {
  const statusConfig = ORDER_STATUSES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        statusConfig.color,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          dotColorMap[status],
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        )}
      />
      {statusConfig.label}
    </span>
  );
}
