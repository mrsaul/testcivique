import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SESSION_TYPES } from '@/lib/constants';
import { Calendar, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Calendar,
  BookOpen,
  GraduationCap,
};

interface TrainingModesProps {
  className?: string;
}

export function TrainingModes({ className }: TrainingModesProps) {
  const modes = [
    {
      type: 'daily' as const,
      ...SESSION_TYPES.daily,
      href: '/quiz/daily',
      color: 'from-primary to-primary/80',
    },
    {
      type: 'theme' as const,
      ...SESSION_TYPES.theme,
      href: '/themes',
      color: 'from-purple-500 to-purple-600',
    },
    {
      type: 'mock_exam' as const,
      ...SESSION_TYPES.mock_exam,
      href: '/quiz/exam',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-xl font-display font-semibold">Modes d'entraînement</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {modes.map((mode) => {
          const Icon = iconMap[mode.icon as keyof typeof iconMap];
          return (
            <Link key={mode.type} to={mode.href}>
              <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-3 rounded-xl bg-gradient-to-br text-white transition-transform group-hover:scale-110',
                      mode.color
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mode.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {mode.questionCount} questions
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                    Commencer
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
