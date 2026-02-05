import { cn } from '@/lib/utils';
import { BadgeDefinition } from '@/lib/badges';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
  badge: BadgeDefinition;
  earned: boolean;
  earnedAt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeCard({ badge, earned, earnedAt, size = 'md' }: BadgeCardProps) {
  const Icon = badge.icon;

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        'relative rounded-xl border transition-all duration-300',
        sizeClasses[size],
        earned
          ? 'bg-card shadow-card hover:shadow-elevated'
          : 'bg-muted/50 opacity-60'
      )}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className={cn(
            'rounded-full p-3 transition-transform',
            earned ? badge.bgColor : 'bg-muted',
            earned && 'animate-bounce-in'
          )}
        >
          {earned ? (
            <Icon className={cn(iconSizes[size], badge.color)} />
          ) : (
            <Lock className={cn(iconSizes[size], 'text-muted-foreground')} />
          )}
        </div>

        <div>
          <h3
            className={cn(
              'font-semibold',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base'
            )}
          >
            {badge.name}
          </h3>
          <p
            className={cn(
              'text-muted-foreground mt-0.5',
              size === 'sm' && 'text-[10px]',
              size === 'md' && 'text-xs',
              size === 'lg' && 'text-sm'
            )}
          >
            {badge.description}
          </p>
          {earned && earnedAt && (
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(earnedAt).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      {earned && (
        <div className="absolute -top-1 -right-1">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
        </div>
      )}
    </div>
  );
}
