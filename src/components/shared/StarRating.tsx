"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export function StarRating({
  rating,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.floor(displayRating);
        const isHalfFilled =
          !isFilled &&
          starValue === Math.ceil(displayRating) &&
          displayRating % 1 >= 0.25;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={cn(
              "relative transition-colors",
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            )}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
          >
            {isHalfFilled ? (
              <div className="relative">
                <Star
                  className={cn(sizeMap[size], "text-muted-foreground/30")}
                  fill="currentColor"
                />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={cn(sizeMap[size], "text-amber-400")}
                    fill="currentColor"
                  />
                </div>
              </div>
            ) : (
              <Star
                className={cn(
                  sizeMap[size],
                  isFilled
                    ? "text-amber-400 fill-amber-400"
                    : "text-muted-foreground/30 fill-muted-foreground/30"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
