import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

const FREE_QUESTION_LIMIT = 5;

export function usePremiumStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['premium-status', user?.id],
    queryFn: async () => {
      if (!user) return { hasPremium: false, questionsAnswered: 0, expiresAt: null as string | null };

      const { data: profile } = await supabase
        .from('profiles')
        .select('has_premium, total_questions_answered, premium_expires_at')
        .eq('user_id', user.id)
        .single();

      const expiresAt = profile?.premium_expires_at ?? null;
      const notExpired = !expiresAt || new Date(expiresAt) > new Date();
      const hasPremium = (profile?.has_premium ?? false) && notExpired;

      return {
        hasPremium,
        questionsAnswered: profile?.total_questions_answered ?? 0,
        expiresAt,
      };
    },
    enabled: !!user,
  });
}

export function useCanAccessQuiz() {
  const { data } = usePremiumStatus();
  
  if (!data) return { canAccess: true, remainingFree: FREE_QUESTION_LIMIT };
  
  if (data.hasPremium) return { canAccess: true, remainingFree: Infinity };
  
  const remaining = Math.max(0, FREE_QUESTION_LIMIT - data.questionsAnswered);
  return { canAccess: remaining > 0, remainingFree: remaining };
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  const createPayment = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('create-payment');
    
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    
    if (data?.url) {
      // Try opening in new tab first; fall back to same-tab redirect if blocked
      // (mobile Safari and in-app browsers often block window.open after await).
      const newWindow = window.open(data.url, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = data.url;
      }
    }
    
    return data;
  }, []);

  const verifyPayment = useCallback(async (sessionId: string) => {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { session_id: sessionId },
    });
    
    if (error) throw error;
    
    if (data?.premium) {
      queryClient.invalidateQueries({ queryKey: ['premium-status'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
    
    return data;
  }, [queryClient]);

  return { createPayment, verifyPayment };
}

export { FREE_QUESTION_LIMIT };
