import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useExcludeMastered, useMasteredQuestions } from '@/hooks/useMasteredQuestions';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExcludeMasteredToggleProps {
  onChange?: (enabled: boolean) => void;
  className?: string;
}

export function ExcludeMasteredToggle({ onChange, className }: ExcludeMasteredToggleProps) {
  const { user } = useAuth();
  const { getPreference, setPreference } = useExcludeMastered();
  const { data: masteredQuestions, isLoading } = useMasteredQuestions();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      setEnabled(getPreference());
    }
  }, [user]);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    setPreference(value);
    onChange?.(value);
  };

  if (!user) return null;

  const masteredCount = masteredQuestions?.size || 0;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-xl border bg-card',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <Label htmlFor="exclude-mastered" className="font-medium cursor-pointer">
            Mode avancé
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Chargement...
              </span>
            ) : (
              <>
                Exclure les {masteredCount} question{masteredCount !== 1 ? 's' : ''} déjà maîtrisée{masteredCount !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>
      </div>
      <Switch
        id="exclude-mastered"
        checked={enabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
