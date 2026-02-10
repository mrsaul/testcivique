import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Gauge } from 'lucide-react';

export type DifficultyLevel = 'facile' | 'moyen' | 'difficile';

interface DifficultyFilterProps {
  selected: DifficultyLevel[];
  onChange: (levels: DifficultyLevel[]) => void;
  className?: string;
}

const LEVELS: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'facile', label: 'Facile', color: 'bg-green-500/15 text-green-700 border-green-500/30 hover:bg-green-500/25' },
  { value: 'moyen', label: 'Moyen', color: 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/25' },
  { value: 'difficile', label: 'Difficile', color: 'bg-red-500/15 text-red-700 border-red-500/30 hover:bg-red-500/25' },
];

export function DifficultyFilter({ selected, onChange, className }: DifficultyFilterProps) {
  const toggle = (level: DifficultyLevel) => {
    if (selected.includes(level)) {
      // Don't allow deselecting all
      if (selected.length === 1) return;
      onChange(selected.filter(l => l !== level));
    } else {
      onChange([...selected, level]);
    }
  };

  return (
    <div className={cn('p-4 rounded-xl border bg-card space-y-3', className)}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
          <Gauge className="w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-sm">Niveau de difficulté</p>
          <p className="text-xs text-muted-foreground">Sélectionnez un ou plusieurs niveaux</p>
        </div>
      </div>
      <div className="flex gap-2">
        {LEVELS.map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => toggle(value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
              selected.includes(value)
                ? color
                : 'bg-muted/50 text-muted-foreground border-transparent opacity-50'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
