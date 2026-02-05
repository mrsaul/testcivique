import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Flame, Target, TrendingUp, Award } from 'lucide-react';

interface StatsCardsProps {
  streak: number;
  totalAnswered: number;
  correctAnswers: number;
  accuracy: number;
}

export function StatsCards({ streak, totalAnswered, correctAnswers, accuracy }: StatsCardsProps) {
  const stats = [
    {
      label: 'Série actuelle',
      value: streak,
      suffix: 'jours',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Questions répondues',
      value: totalAnswered,
      suffix: '',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Bonnes réponses',
      value: correctAnswers,
      suffix: '',
      icon: Award,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Précision',
      value: accuracy,
      suffix: '%',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-xl font-bold">
                  {stat.value}
                  {stat.suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.suffix}</span>}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
