import { useBadges } from '@/hooks/useBadges';
import { BADGES, BADGE_ORDER, BadgeType } from '@/lib/badges';
import { BadgeCard } from './BadgeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgesDisplayProps {
  className?: string;
  showAll?: boolean;
  compact?: boolean;
}

export function BadgesDisplay({ className, showAll = false, compact = false }: BadgesDisplayProps) {
  const { data: userBadges, isLoading } = useBadges();

  const earnedBadgeTypes = new Set(userBadges?.map((b) => b.badge_type) || []);

  const badgesToShow = showAll
    ? BADGE_ORDER
    : BADGE_ORDER.filter((type) => earnedBadgeTypes.has(type));

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showAll && badgesToShow.length === 0) {
    return null;
  }

  return (
    <Card className={cn('shadow-card', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-primary" />
          Badges ({earnedBadgeTypes.size}/{BADGE_ORDER.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={cn(
            'grid gap-3',
            compact
              ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
          )}
        >
          {badgesToShow.map((badgeType) => {
            const badge = BADGES[badgeType];
            const userBadge = userBadges?.find((b) => b.badge_type === badgeType);
            return (
              <BadgeCard
                key={badgeType}
                badge={badge}
                earned={earnedBadgeTypes.has(badgeType)}
                earnedAt={userBadge?.earned_at}
                size={compact ? 'sm' : 'md'}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
