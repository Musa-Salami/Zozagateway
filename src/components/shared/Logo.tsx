import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const imageSizeMap = {
  sm: "h-10 w-auto",
  md: "h-14 w-auto",
  lg: "h-20 w-auto",
} as const;

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center shrink-0", className)}>
      <img
        src="/images/logo.png"
        alt="Zoza Gateway Snacks"
        className={cn("object-contain", imageSizeMap[size])}
      />
    </Link>
  );
}
