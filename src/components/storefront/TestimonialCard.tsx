import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";
import { getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";

interface TestimonialCardProps {
  name: string;
  avatar?: string;
  rating: number;
  review: string;
  date: string;
  className?: string;
}

export function TestimonialCard({
  name,
  avatar,
  rating,
  review,
  date,
  className,
}: TestimonialCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400 text-sm font-medium">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
          </div>
        </div>

        {/* Rating */}
        <StarRating rating={rating} size="sm" className="mb-3" />

        {/* Review Text */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {review}
        </p>
      </CardContent>
    </Card>
  );
}
