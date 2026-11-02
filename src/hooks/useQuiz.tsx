import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ThemeId } from '@/lib/constants';
import { selectQuestions } from '@/lib/select-questions';

// Question without correct_answer (from quiz_questions view)
export interface QuizQuestion {
  id: string;
  theme: ThemeId;
  question: string;
  options: string[];
  explanation: string | null;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

// Full question with answer (for local sample questions only)
export interface Question extends QuizQuestion {
  correct_answer: number;
}

// Answer validation result from edge function
export interface AnswerValidation {
  isCorrect: boolean;
  correctAnswer: number;
  explanation: string | null;
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

// Validate answer via edge function
export async function validateAnswer(questionId: string, selectedAnswer: number): Promise<AnswerValidation> {
  const { data, error } = await supabase.functions.invoke('validate-answer', {
    body: { questionId, selectedAnswer },
  });

  if (error) {
    throw new Error('Failed to validate answer');
  }

  return data as AnswerValidation;
}

export function useQuestions(theme?: ThemeId, limit?: number) {
  return useQuery({
    queryKey: ['questions', theme, limit],
    queryFn: async () => {
      // Use the secure view that doesn't include correct_answer
      let query = supabase.from('quiz_questions').select('*');
      
      if (theme) {
        query = query.eq('theme', theme);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return selectQuestions((data ?? []) as QuizQuestion[], limit);
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

export function useQuizState(questions: QuizQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);
  const [lastValidation, setLastValidation] = useState<AnswerValidation | null>(null);

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;
  const progress = (currentIndex / questions.length) * 100;

  const submitAnswer = useCallback(async () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setIsValidating(true);
    
    try {
      // For sample questions (id starts with 'sample-'), validate locally
      if (currentQuestion.id.startsWith('sample-')) {
        // Sample questions have correct_answer embedded
        const questionWithAnswer = currentQuestion as Question;
        const isCorrect = selectedAnswer === questionWithAnswer.correct_answer;
        
        setLastValidation({
          isCorrect,
          correctAnswer: questionWithAnswer.correct_answer,
          explanation: questionWithAnswer.explanation,
        });
        
        if (isCorrect) {
          setCorrectCount((prev) => prev + 1);
        } else {
          setWrongQuestions((prev) => [...prev, currentQuestion]);
        }
        setAnsweredQuestions((prev) => [...prev, isCorrect]);
      } else {
        // Validate via edge function for database questions
        const validation = await validateAnswer(currentQuestion.id, selectedAnswer);
        setLastValidation(validation);
        
        if (validation.isCorrect) {
          setCorrectCount((prev) => prev + 1);
        } else {
          setWrongQuestions((prev) => [...prev, currentQuestion]);
        }
        setAnsweredQuestions((prev) => [...prev, validation.isCorrect]);
      }
      
      setShowResult(true);
    } catch (error) {
      console.error('Error validating answer:', error);
    } finally {
      setIsValidating(false);
    }
  }, [selectedAnswer, currentQuestion]);

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setLastValidation(null);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setAnsweredQuestions([]);
    setWrongQuestions([]);
    setLastValidation(null);
  }, []);

  return {
    currentIndex,
    currentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    showResult,
    isValidating,
    correctCount,
    answeredQuestions,
    wrongQuestions,
    lastValidation,
    isComplete,
    progress,
    submitAnswer,
    nextQuestion,
    reset,
  };
}
