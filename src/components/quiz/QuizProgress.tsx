import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface QuizProgressProps {
  current: number;
  total: number;
  correctCount: number;
  className?: string;
}

export function QuizProgress({ current, total, correctCount, className }: QuizProgressProps) {
  const progress = (current / total) * 100;
  const percentage = total > 0 ? Math.round((correctCount / Math.max(current, 1)) * 100) : 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">
          Question {Math.min(current + 1, total)} / {total}
        </span>
        <span className={cn(
          'font-semibold',
          percentage >= 80 ? 'text-success' : percentage >= 60 ? 'text-warning' : 'text-destructive'
        )}>
          {correctCount} / {current} correct{current !== 1 ? 's' : ''}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
