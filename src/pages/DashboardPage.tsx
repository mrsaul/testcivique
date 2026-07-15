import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ComeBackRecap } from '@/components/dashboard/ComeBackRecap';
import { TrainingModes } from '@/components/dashboard/TrainingModes';
import { ThemeCard } from '@/components/dashboard/ThemeCard';
import { BadgesDisplay } from '@/components/badges/BadgesDisplay';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { THEMES, ThemeId } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();

  const { data: themeProgress } = useQuery({
    queryKey: ['theme-progress', user?.id],
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase
        .from('theme_progress')
        .select('theme, mastery_level, questions_answered')
        .eq('user_id', user.id);
      if (error) throw error;
      const map: Record<string, { mastery: number; answered: number }> = {};
      data?.forEach((row) => {
        map[row.theme] = { mastery: row.mastery_level ?? 0, answered: row.questions_answered ?? 0 };
      });
      return map;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const accuracy = profile && profile.total_questions_answered > 0
    ? Math.round((profile.correct_answers / profile.total_questions_answered) * 100)
    : 0;

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <Layout>
      <SEOHead title="Tableau de bord" noIndex />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Bonjour, {displayName} ! 👋
          </h1>
          <p className="text-muted-foreground">
            Continuez votre préparation à l'examen civique.
          </p>
        </div>

        {/* Come-back recap */}
        <ComeBackRecap />

        {/* Stats */}
        <StatsCards
          streak={profile?.streak_days || 0}
          totalAnswered={profile?.total_questions_answered || 0}
          correctAnswers={profile?.correct_answers || 0}
          accuracy={accuracy}
        />

        {/* Badges Section */}
        <BadgesDisplay showAll />

        {/* Training Modes */}
        <TrainingModes />

        {/* Theme Progress */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-semibold">Progression par thème</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {(Object.keys(THEMES) as ThemeId[]).map((themeId) => (
              <ThemeCard
                key={themeId}
                themeId={themeId}
                progress={themeProgress?.[themeId]?.mastery ?? 0}
                questionsAnswered={themeProgress?.[themeId]?.answered ?? 0}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
