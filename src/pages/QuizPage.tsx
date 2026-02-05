import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Button } from '@/components/ui/button';
import { useQuizState, Question } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';
import { THEMES, ThemeId, SESSION_TYPES } from '@/lib/constants';
import { SAMPLE_QUESTIONS } from '@/lib/questions-data';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCheckAndAwardBadges } from '@/hooks/useBadges';

type SessionType = 'daily' | 'theme' | 'mock_exam';

export default function QuizPage() {
  const { type, themeId } = useParams<{ type: SessionType; themeId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sessionType = type as SessionType || 'daily';
  const theme = themeId as ThemeId | undefined;
  const config = SESSION_TYPES[sessionType];
  const { checkBadges } = useCheckAndAwardBadges();
  const badgesCheckedRef = useRef(false);

  const quizState = useQuizState(questions);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      
      try {
        // Try to fetch from database first
        let query = supabase.from('questions').select('*');
        
        if (theme) {
          query = query.eq('theme', theme);
        }

        const { data: dbQuestions, error } = await query;

        let questionsToUse: Question[];

        if (error || !dbQuestions || dbQuestions.length === 0) {
          // Use sample questions if database is empty
          let filtered = SAMPLE_QUESTIONS;
          if (theme) {
            filtered = SAMPLE_QUESTIONS.filter(q => q.theme === theme);
          }
          
          // Shuffle and limit
          const shuffled = [...filtered].sort(() => Math.random() - 0.5);
          questionsToUse = shuffled.slice(0, config.questionCount).map((q, i) => ({
            id: `sample-${i}`,
            theme: q.theme as ThemeId,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            difficulty: q.difficulty as 'facile' | 'moyen' | 'difficile',
          }));
        } else {
          // Use database questions
          const shuffled = [...dbQuestions].sort(() => Math.random() - 0.5);
          questionsToUse = shuffled.slice(0, config.questionCount).map(q => ({
            ...q,
            options: q.options as string[],
          }));
        }

        setQuestions(questionsToUse);

        // Create session if authenticated
        if (user) {
          const { data: session, error: sessionError } = await supabase
            .from('quiz_sessions')
            .insert({
              user_id: user.id,
              session_type: sessionType,
              theme: theme || null,
              total_questions: questionsToUse.length,
            })
            .select()
            .single();

          if (!sessionError && session) {
            setSessionId(session.id);
          }
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        toast.error('Erreur lors du chargement des questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [theme, sessionType, config.questionCount, user]);

  // Update profile stats and check badges when quiz completes
  useEffect(() => {
    const updateStats = async () => {
      if (!quizState.isComplete || !user || !sessionId) return;
      if (badgesCheckedRef.current) return;
      badgesCheckedRef.current = true;

      try {
        // Complete the session
        await supabase
          .from('quiz_sessions')
          .update({
            correct_answers: quizState.correctCount,
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq('id', sessionId);

        // Update profile stats
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_questions_answered, correct_answers, last_practice_date, streak_days')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          const today = new Date().toISOString().split('T')[0];
          const lastDate = profile.last_practice_date;
          let newStreak = profile.streak_days;

          if (!lastDate) {
            newStreak = 1;
          } else if (lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastDate === yesterdayStr) {
              newStreak = profile.streak_days + 1;
            } else if (lastDate < yesterdayStr) {
              newStreak = 1;
            }
          }

          await supabase
            .from('profiles')
            .update({
              total_questions_answered: profile.total_questions_answered + questions.length,
              correct_answers: profile.correct_answers + quizState.correctCount,
              last_practice_date: today,
              streak_days: newStreak,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);
        }

        // Check and award badges
        await checkBadges({
          quizCompleted: true,
          correctCount: quizState.correctCount,
          totalQuestions: questions.length,
          sessionType: sessionType,
          theme: theme,
        });
      } catch (err) {
        console.error('Error updating stats:', err);
      }
    };

    updateStats();
  }, [quizState.isComplete, quizState.correctCount, user, sessionId, questions.length, sessionType, theme, checkBadges]);

  const getTitle = () => {
    if (theme && THEMES[theme]) {
      return THEMES[theme].name;
    }
    return config.name;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Aucune question disponible</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-display font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {quizState.isComplete ? (
          <QuizResults
            correctCount={quizState.correctCount}
            totalQuestions={questions.length}
            onRetry={() => {
              quizState.reset();
              // Reload questions
              window.location.reload();
            }}
            sessionType={sessionType}
          />
        ) : (
          <div className="space-y-6">
            <QuizProgress
              current={quizState.currentIndex}
              total={questions.length}
              correctCount={quizState.correctCount}
            />
            
            {quizState.currentQuestion && (
              <QuizQuestion
                question={quizState.currentQuestion}
                selectedAnswer={quizState.selectedAnswer}
                onSelectAnswer={quizState.setSelectedAnswer}
                showResult={quizState.showResult}
                onSubmit={quizState.submitAnswer}
                onNext={quizState.nextQuestion}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
