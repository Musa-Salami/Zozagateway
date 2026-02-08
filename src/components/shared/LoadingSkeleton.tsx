import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-3 space-y-3", className)}>
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-3.5 rounded-sm" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

interface TableRowSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function TableRowSkeleton({
  columns = 5,
  rows = 5,
  className,
}: TableRowSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 rounded-lg border bg-card p-4"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={cn(
                "h-5",
                colIdx === 0
                  ? "w-10"
                  : colIdx === 1
                    ? "w-40"
                    : "flex-1"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
