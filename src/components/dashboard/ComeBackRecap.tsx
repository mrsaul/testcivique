import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { THEMES, ThemeId } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target } from 'lucide-react';

const THEME_TOTALS: Record<string, number> = {
  principes_valeurs: 45,
  systeme_institutionnel: 52,
  droits_devoirs: 55,
  histoire_geographie: 53,
  vivre_societe: 88,
};

export function ComeBackRecap() {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const { data: recap } = useQuery({
    queryKey: ['comeback-recap', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('theme_progress')
        .select('theme, mastery_level, questions_answered')
        .eq('user_id', user.id);
      if (error) throw error;
      if (!data || data.length === 0) return null;

      // Pick a theme the user has engaged with but not mastered
      const candidates = data
        .map((r) => {
          const total = THEME_TOTALS[r.theme] ?? 50;
          const answered = r.questions_answered ?? 0;
          const mastery = r.mastery_level ?? 0;
          const remaining = Math.max(total - answered, 0);
          return { theme: r.theme as ThemeId, total, answered, mastery, remaining };
        })
        .filter((c) => c.answered > 0 && c.mastery < 90 && c.remaining > 0)
        .sort((a, b) => a.mastery - b.mastery);

      return candidates[0] ?? null;
    },
    enabled: !!user,
  });

  if (!recap) return null;
  const themeMeta = THEMES[recap.theme];
  if (!themeMeta) return null;

  const daysSince = profile?.last_practice_date
    ? Math.floor((Date.now() - new Date(profile.last_practice_date).getTime()) / 86_400_000)
    : null;

  const greeting =
    daysSince === null || daysSince <= 0
      ? 'Reprenez là où vous vous êtes arrêté'
      : daysSince === 1
        ? 'Bon retour ! Hier vous avez pratiqué —'
        : `Bon retour après ${daysSince} jours !`;

  return (
    <Card className="p-5 md:p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
          <h3 className="font-display font-semibold text-lg leading-snug">
            Il vous reste{' '}
            <span className="text-primary">{recap.remaining} question{recap.remaining > 1 ? 's' : ''}</span>{' '}
            à travailler sur le thème{' '}
            <span className="text-primary">{themeMeta.name}</span>
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Target className="w-3.5 h-3.5" />
            <span>
              Maîtrise actuelle : {recap.mastery}% · {recap.answered}/{recap.total} vues
            </span>
          </div>
        </div>
        <Button asChild size="lg" className="w-full md:w-auto">
          <Link to={`/quiz/theme/${recap.theme}`}>
            Reprendre
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
