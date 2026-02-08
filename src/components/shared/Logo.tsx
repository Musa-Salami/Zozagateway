import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
} as const;

const iconSizeMap = {
  sm: 20,
  md: 28,
  lg: 40,
} as const;

export function Logo({ size = "md", className }: LogoProps) {
  const iconSize = iconSizeMap[size];

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="40" height="40" rx="10" fill="#F97316" />
        <path
          d="M10 28V12h4.5l5.5 10 5.5-10H30v16h-3.5V18.5L21.5 28h-3L13.5 18.5V28H10Z"
          fill="white"
        />
      </svg>
      <span
        className={cn(
          "font-heading font-bold tracking-tight",
          sizeMap[size]
        )}
      >
        <span className="text-brand-500">Zoza</span>
        <span className="text-foreground">Gateway</span>
      </span>
    </Link>
  );
}
