import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { THEMES, ThemeId } from '@/lib/constants';
import { Scale, Building2, FileText, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Scale,
  Building2,
  FileText,
  MapPin,
  Users,
};

interface ThemeCardProps {
  themeId: ThemeId;
  progress?: number;
  questionsAnswered?: number;
  className?: string;
}

export function ThemeCard({ themeId, progress = 0, questionsAnswered = 0, className }: ThemeCardProps) {
  const theme = THEMES[themeId];
  const Icon = iconMap[theme.icon as keyof typeof iconMap];

  const colorClasses: Record<ThemeId, string> = {
    principes_valeurs: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    systeme_institutionnel: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    droits_devoirs: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    histoire_geographie: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    vivre_societe: 'from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700',
  };

  return (
    <Link to={`/quiz/theme/${themeId}`}>
      <Card className={cn(
        'group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 overflow-hidden',
        className
      )}>
        <div className={cn(
          'h-2 bg-gradient-to-r transition-all duration-300',
          colorClasses[themeId]
        )} />
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2.5 rounded-xl bg-gradient-to-br text-white transition-transform group-hover:scale-110',
              colorClasses[themeId]
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {theme.shortName}
              </CardTitle>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {theme.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Maîtrise</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
