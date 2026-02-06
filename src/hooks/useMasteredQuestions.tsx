import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useMasteredQuestions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['mastered-questions', user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>();

      // Get all question IDs that the user has answered correctly
      const { data, error } = await supabase
        .from('user_answers')
        .select('question_id')
        .eq('user_id', user.id)
        .eq('is_correct', true);

      if (error) throw error;

      // Return a Set of question IDs for fast lookup
      return new Set(data?.map((a) => a.question_id) || []);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useExcludeMastered() {
  const { user } = useAuth();
  const storageKey = `exclude-mastered-${user?.id}`;

  const getPreference = (): boolean => {
    if (!user) return false;
    const stored = localStorage.getItem(storageKey);
    return stored === 'true';
  };

  const setPreference = (value: boolean) => {
    if (!user) return;
    localStorage.setItem(storageKey, String(value));
  };

  return { getPreference, setPreference };
}
