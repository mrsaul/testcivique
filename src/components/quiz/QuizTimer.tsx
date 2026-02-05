import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface QuizTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  className?: string;
}

export function QuizTimer({ durationMinutes, onTimeUp, isPaused = false, className }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [hasCalledTimeUp, setHasCalledTimeUp] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !hasCalledTimeUp) {
      setHasCalledTimeUp(true);
      onTimeUp();
    }
  }, [timeLeft, onTimeUp, hasCalledTimeUp]);

  const percentage = (timeLeft / (durationMinutes * 60)) * 100;
  const isWarning = timeLeft <= 300 && timeLeft > 60; // Last 5 minutes
  const isCritical = timeLeft <= 60; // Last minute

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300',
        !isWarning && !isCritical && 'bg-card border-border',
        isWarning && 'bg-warning/10 border-warning text-warning animate-pulse',
        isCritical && 'bg-destructive/10 border-destructive text-destructive animate-pulse',
        className
      )}
    >
      {isCritical ? (
        <AlertTriangle className="w-5 h-5" />
      ) : (
        <Clock className={cn('w-5 h-5', isWarning ? 'text-warning' : 'text-muted-foreground')} />
      )}
      
      <div className="flex flex-col">
        <span
          className={cn(
            'font-mono text-xl font-bold tabular-nums',
            isCritical && 'text-destructive',
            isWarning && 'text-warning'
          )}
        >
          {formatTime(timeLeft)}
        </span>
        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-1000 rounded-full',
              !isWarning && !isCritical && 'bg-primary',
              isWarning && 'bg-warning',
              isCritical && 'bg-destructive'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
