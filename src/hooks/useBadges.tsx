import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { BadgeType, BADGES } from '@/lib/badges';
import { toast } from 'sonner';

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  earned_at: string;
}

export function useBadges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['badges', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as UserBadge[];
    },
    enabled: !!user,
  });
}

export function useAwardBadge() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (badgeType: BadgeType) => {
      if (!user) throw new Error('Not authenticated');

      // Check if badge already earned
      const { data: existing } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id)
        .eq('badge_type', badgeType)
        .single();

      if (existing) return null; // Already has badge

      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_type: badgeType,
        })
        .select()
        .single();

      if (error) throw error;
      return data as UserBadge;
    },
    onSuccess: (data) => {
      if (data) {
        const badge = BADGES[data.badge_type as BadgeType];
        toast.success(`🏆 Nouveau badge : ${badge.name}`, {
          description: badge.description,
        });
        queryClient.invalidateQueries({ queryKey: ['badges'] });
      }
    },
  });
}

export function useCheckAndAwardBadges() {
  const { user } = useAuth();
  const awardBadge = useAwardBadge();

  const checkBadges = async (context: {
    quizCompleted?: boolean;
    correctCount?: number;
    totalQuestions?: number;
    sessionType?: 'daily' | 'theme' | 'mock_exam';
    theme?: string;
  }) => {
    if (!user) return;

    try {
      // Get user profile for stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_questions_answered, streak_days')
        .eq('user_id', user.id)
        .single();

      // Get completed sessions count
      const { count: sessionCount } = await supabase
        .from('quiz_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true);

      // Get user's existing badges
      const { data: existingBadges } = await supabase
        .from('user_badges')
        .select('badge_type')
        .eq('user_id', user.id);

      const earnedBadges = new Set(existingBadges?.map((b) => b.badge_type) || []);

      // First Quiz badge
      if (context.quizCompleted && sessionCount === 1 && !earnedBadges.has('first_quiz')) {
        await awardBadge.mutateAsync('first_quiz');
      }

      // Perfect Quiz badge
      if (
        context.quizCompleted &&
        context.correctCount === context.totalQuestions &&
        context.totalQuestions &&
        context.totalQuestions >= 5 &&
        !earnedBadges.has('perfect_quiz')
      ) {
        await awardBadge.mutateAsync('perfect_quiz');
      }

      // Theme Master badges
      if (
        context.quizCompleted &&
        context.sessionType === 'theme' &&
        context.correctCount === context.totalQuestions &&
        context.totalQuestions &&
        context.totalQuestions >= 10 &&
        context.theme
      ) {
        const themeBadgeMap: Record<string, BadgeType> = {
          principes_valeurs: 'theme_master_principes',
          systeme_institutionnel: 'theme_master_institutions',
          droits_devoirs: 'theme_master_droits',
          histoire_geographie: 'theme_master_histoire',
          vivre_societe: 'theme_master_vivre',
        };
        const themeBadge = themeBadgeMap[context.theme];
        if (themeBadge && !earnedBadges.has(themeBadge)) {
          await awardBadge.mutateAsync(themeBadge);
        }
      }

      // Exam Passed badge
      if (
        context.quizCompleted &&
        context.sessionType === 'mock_exam' &&
        context.correctCount &&
        context.totalQuestions &&
        (context.correctCount / context.totalQuestions) >= 0.8 &&
        !earnedBadges.has('exam_passed')
      ) {
        await awardBadge.mutateAsync('exam_passed');
      }

      // Streak badges
      if (profile?.streak_days) {
        if (profile.streak_days >= 3 && !earnedBadges.has('streak_3')) {
          await awardBadge.mutateAsync('streak_3');
        }
        if (profile.streak_days >= 7 && !earnedBadges.has('streak_7')) {
          await awardBadge.mutateAsync('streak_7');
        }
        if (profile.streak_days >= 30 && !earnedBadges.has('streak_30')) {
          await awardBadge.mutateAsync('streak_30');
        }
      }

      // Questions answered badges
      const totalQuestions = (profile?.total_questions_answered || 0) + (context.totalQuestions || 0);
      if (totalQuestions >= 50 && !earnedBadges.has('questions_50')) {
        await awardBadge.mutateAsync('questions_50');
      }
      if (totalQuestions >= 100 && !earnedBadges.has('questions_100')) {
        await awardBadge.mutateAsync('questions_100');
      }
      if (totalQuestions >= 500 && !earnedBadges.has('questions_500')) {
        await awardBadge.mutateAsync('questions_500');
      }

      // All themes started badge
      const { data: themeSessions } = await supabase
        .from('quiz_sessions')
        .select('theme')
        .eq('user_id', user.id)
        .eq('session_type', 'theme')
        .not('theme', 'is', null);

      const uniqueThemes = new Set(themeSessions?.map((s) => s.theme) || []);
      if (uniqueThemes.size >= 5 && !earnedBadges.has('all_themes_started')) {
        await awardBadge.mutateAsync('all_themes_started');
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  return { checkBadges };
}
