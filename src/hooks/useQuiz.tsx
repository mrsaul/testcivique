import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ThemeId } from '@/lib/constants';

export interface Question {
  id: string;
  theme: ThemeId;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

export interface QuizSession {
  id: string;
  user_id: string;
  session_type: 'daily' | 'theme' | 'mock_exam';
  theme: ThemeId | null;
  total_questions: number;
  correct_answers: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

export function useQuestions(theme?: ThemeId, limit?: number) {
  return useQuery({
    queryKey: ['questions', theme, limit],
    queryFn: async () => {
      let query = supabase.from('questions').select('*');
      
      if (theme) {
        query = query.eq('theme', theme);
      }
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Shuffle questions
      const shuffled = [...(data as Question[])].sort(() => Math.random() - 0.5);
      return limit ? shuffled.slice(0, limit) : shuffled;
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      sessionType,
      theme,
      totalQuestions,
    }: {
      sessionType: 'daily' | 'theme' | 'mock_exam';
      theme?: ThemeId;
      totalQuestions: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          theme: theme || null,
          total_questions: totalQuestions,
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useCompleteSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      sessionId,
      correctAnswers,
    }: {
      sessionId: string;
      correctAnswers: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          correct_answers: correctAnswers,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useRecordAnswer() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      questionId,
      sessionId,
      selectedAnswer,
      isCorrect,
    }: {
      questionId: string;
      sessionId: string;
      selectedAnswer: number;
      isCorrect: boolean;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('user_answers').insert({
        user_id: user.id,
        question_id: questionId,
        session_id: sessionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
      });

      if (error) throw error;
    },
  });
}

export function useQuizState(questions: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;
  const progress = (currentIndex / questions.length) * 100;

  const submitAnswer = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, currentQuestion]);
    }
    setAnsweredQuestions((prev) => [...prev, isCorrect]);
    setShowResult(true);
  }, [selectedAnswer, currentQuestion]);

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setAnsweredQuestions([]);
    setWrongQuestions([]);
  }, []);

  return {
    currentIndex,
    currentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    showResult,
    correctCount,
    answeredQuestions,
    wrongQuestions,
    isComplete,
    progress,
    submitAnswer,
    nextQuestion,
    reset,
  };
}
