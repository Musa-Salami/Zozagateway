import { PackageOpen, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && (onAction || actionHref) && (
        <>
          {actionHref ? (
            <Button asChild className="bg-brand-500 hover:bg-brand-600">
              <a href={actionHref}>{actionLabel}</a>
            </Button>
          ) : (
            <Button
              onClick={onAction}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
