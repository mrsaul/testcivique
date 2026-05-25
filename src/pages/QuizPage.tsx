import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizResults } from '@/components/quiz/QuizResults';
import { QuizTimer } from '@/components/quiz/QuizTimer';
import { ExcludeMasteredToggle } from '@/components/quiz/ExcludeMasteredToggle';
import { DifficultyFilter, DifficultyLevel } from '@/components/quiz/DifficultyFilter';
import { Button } from '@/components/ui/button';
import { useQuizState, Question, QuizQuestion as QuizQuestionType } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';
import { useMasteredQuestions, useExcludeMastered } from '@/hooks/useMasteredQuestions';
import { THEMES, ThemeId, SESSION_TYPES, EXAM_CONFIG } from '@/lib/constants';
import { SAMPLE_QUESTIONS } from '@/lib/questions-data';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCheckAndAwardBadges } from '@/hooks/useBadges';
import { useCanAccessQuiz } from '@/hooks/usePremium';
import { PaywallCard } from '@/components/payment/PaywallCard';

type SessionType = 'daily' | 'theme' | 'mock_exam';

export default function QuizPage() {
  const { type, themeId } = useParams<{ type?: string; themeId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel[]>(['facile', 'moyen', 'difficile']);

  // Map URL param to session type (handle 'exam' -> 'mock_exam')
  const sessionType: SessionType = type === 'exam' ? 'mock_exam' : (type as SessionType) || 'daily';
  const theme = themeId as ThemeId | undefined;
  const config = SESSION_TYPES[sessionType] || SESSION_TYPES.daily;
  const { checkBadges } = useCheckAndAwardBadges();
  const badgesCheckedRef = useRef(false);
  const isMockExam = sessionType === 'mock_exam';

  const { data: masteredQuestions, isLoading: loadingMastered } = useMasteredQuestions();
  const { getPreference } = useExcludeMastered();
  const { canAccess, remainingFree } = useCanAccessQuiz();

  const quizState = useQuizState(questions);

  const handleReviewMistakes = useCallback(() => {
    if (quizState.wrongQuestions.length > 0) {
      // Cast wrongQuestions to Question[] for review mode (they have correct_answer from validation)
      setQuestions(quizState.wrongQuestions as Question[]);
      setIsReviewMode(true);
      setTimeUp(false);
      quizState.reset();
      badgesCheckedRef.current = false;
    }
  }, [quizState]);

  const handleTimeUp = useCallback(() => {
    setTimeUp(true);
    toast.error('Temps écoulé !', {
      description: 'Le temps imparti pour l\'examen est terminé.',
    });
  }, []);

  const startQuiz = useCallback(() => {
    setShowSetup(false);
  }, []);

  useEffect(() => {
    // Wait until we know the mastered questions (if user is logged in)
    if (!showSetup) {
      loadQuestions();
    }
  }, [showSetup]);

  const loadQuestions = async () => {
    setLoading(true);
    const excludeMastered = getPreference();
    
    try {
      // Try to fetch from secure view (without correct_answer)
      let query = supabase.from('quiz_questions').select('*');
      
      if (theme) {
        query = query.eq('theme', theme);
      }

      if (difficultyFilter.length < 3) {
        query = query.in('difficulty', difficultyFilter);
      }

      const { data: dbQuestions, error } = await query;

      let questionsToUse: Question[];

      if (error || !dbQuestions || dbQuestions.length === 0) {
        // Use sample questions if database is empty
        let filtered = SAMPLE_QUESTIONS;
        if (theme) {
          filtered = filtered.filter(q => q.theme === theme);
        }
        if (difficultyFilter.length < 3) {
          filtered = filtered.filter(q => difficultyFilter.includes(q.difficulty as DifficultyLevel));
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
        // Filter out mastered questions if the option is enabled
        let filteredQuestions = dbQuestions;
        if (excludeMastered && masteredQuestions && masteredQuestions.size > 0) {
          filteredQuestions = dbQuestions.filter(q => !masteredQuestions.has(q.id));
          
          // If all questions are mastered, show a message and use all questions
          if (filteredQuestions.length === 0) {
            toast.info('Félicitations ! Vous avez maîtrisé toutes les questions de ce thème.', {
              description: 'Toutes les questions seront incluses.',
            });
            filteredQuestions = dbQuestions;
          } else if (filteredQuestions.length < config.questionCount) {
            toast.info(`${filteredQuestions.length} questions non maîtrisées disponibles.`);
          }
        }

        // Use database questions (cast to Question for compatibility)
        const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
        questionsToUse = shuffled.slice(0, config.questionCount).map(q => ({
          ...q,
          options: q.options as string[],
          correct_answer: -1, // Placeholder, will be validated server-side
        })) as Question[];
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

        // Update theme progress
        if (theme) {
          const { data: existing } = await supabase
            .from('theme_progress')
            .select('questions_answered, correct_answers')
            .eq('user_id', user.id)
            .eq('theme', theme)
            .single();

          const newAnswered = (existing?.questions_answered ?? 0) + questions.length;
          const newCorrect = (existing?.correct_answers ?? 0) + quizState.correctCount;
          const mastery = newAnswered > 0 ? Math.round((newCorrect / newAnswered) * 100) : 0;

          if (existing) {
            await supabase
              .from('theme_progress')
              .update({
                questions_answered: newAnswered,
                correct_answers: newCorrect,
                mastery_level: mastery,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id)
              .eq('theme', theme);
          } else {
            await supabase
              .from('theme_progress')
              .insert({
                user_id: user.id,
                theme: theme,
                questions_answered: questions.length,
                correct_answers: quizState.correctCount,
                mastery_level: mastery,
              });
          }
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

  const seoTitle = (() => {
    if (theme && THEMES[theme]) return `Quiz – ${THEMES[theme].name}`;
    if (sessionType === 'mock_exam') return 'Examen blanc – Test Civique';
    if (sessionType === 'daily') return 'Entraînement quotidien – Test Civique';
    return getTitle();
  })();
  const seoDescription = theme && THEMES[theme]
    ? `Entraînez-vous sur le thème ${THEMES[theme].name} : ${THEMES[theme].description}`
    : sessionType === 'mock_exam'
      ? `Examen blanc chronométré de ${EXAM_CONFIG.mockExamDuration} minutes pour simuler l'examen civique français.`
      : "Pratiquez quotidiennement pour préparer l'examen civique français.";

  // Show paywall if free limit reached
  if (!canAccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="space-y-6">
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <PaywallCard />
          </div>
        </div>
      </Layout>
    );
  }

  // Show setup screen with toggle option
  if (showSetup && !isReviewMode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold mb-2">{getTitle()}</h1>
              <p className="text-muted-foreground">{config.description}</p>
              {remainingFree !== Infinity && (
                <p className="text-xs text-muted-foreground mt-2">
                  {remainingFree} question{remainingFree > 1 ? 's' : ''} gratuite{remainingFree > 1 ? 's' : ''} restante{remainingFree > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Questions</span>
                <span className="font-bold">{config.questionCount}</span>
              </div>
              {isMockExam && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durée</span>
                  <span className="font-bold">{EXAM_CONFIG.mockExamDuration} min</span>
                </div>
              )}
            </div>

            <ExcludeMasteredToggle />
            <DifficultyFilter selected={difficultyFilter} onChange={setDifficultyFilter} />

            <div className="flex flex-col gap-3">
              <Button onClick={startQuiz} size="lg" className="w-full" disabled={loadingMastered}>
                {loadingMastered ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  'Commencer'
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold">
                {isReviewMode ? '📝 Révision des erreurs' : getTitle()}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isReviewMode 
                  ? `${questions.length} question${questions.length > 1 ? 's' : ''} à revoir`
                  : config.description
                }
              </p>
            </div>
          </div>

          {/* Timer for mock exam (not in review mode) */}
          {isMockExam && !isReviewMode && !quizState.isComplete && !timeUp && (
            <QuizTimer
              durationMinutes={EXAM_CONFIG.mockExamDuration}
              onTimeUp={handleTimeUp}
              isPaused={quizState.showResult}
            />
          )}
        </div>

        {quizState.isComplete || timeUp ? (
          <QuizResults
            correctCount={quizState.correctCount}
            totalQuestions={questions.length}
            wrongCount={quizState.wrongQuestions.length}
            onRetry={() => {
              setTimeUp(false);
              setIsReviewMode(false);
              quizState.reset();
              badgesCheckedRef.current = false;
              window.location.reload();
            }}
            onReviewMistakes={quizState.wrongQuestions.length > 0 ? handleReviewMistakes : undefined}
            sessionType={isReviewMode ? 'daily' : sessionType}
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
                isValidating={quizState.isValidating}
                validation={quizState.lastValidation}
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
