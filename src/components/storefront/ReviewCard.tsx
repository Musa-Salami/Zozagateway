import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";
import { getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const userName = review.user?.name ?? "Anonymous";
  const userAvatar = review.user?.avatar ?? undefined;

  return (
    <Card className={className}>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400 text-xs font-medium">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
