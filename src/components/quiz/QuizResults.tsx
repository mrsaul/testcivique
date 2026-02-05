import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { EXAM_CONFIG } from '@/lib/constants';
import { Trophy, Target, RotateCcw, Home, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizResultsProps {
  correctCount: number;
  totalQuestions: number;
  onRetry: () => void;
  sessionType: 'daily' | 'theme' | 'mock_exam';
}

export function QuizResults({ correctCount, totalQuestions, onRetry, sessionType }: QuizResultsProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= EXAM_CONFIG.passingPercentage;
  const isMockExam = sessionType === 'mock_exam';

  const getMessage = () => {
    if (isMockExam) {
      if (passed) return { title: 'Félicitations ! 🎉', subtitle: 'Vous avez réussi l\'examen blanc !' };
      return { title: 'Continuez vos efforts ! 💪', subtitle: 'Vous n\'avez pas atteint les 80% requis.' };
    }
    if (percentage === 100) return { title: 'Parfait ! 🌟', subtitle: 'Score impeccable !' };
    if (percentage >= 80) return { title: 'Excellent ! 🎯', subtitle: 'Vous êtes sur la bonne voie.' };
    if (percentage >= 60) return { title: 'Bien joué ! 👍', subtitle: 'Continuez à vous entraîner.' };
    return { title: 'Courage ! 📚', subtitle: 'La pratique fait la perfection.' };
  };

  const { title, subtitle } = getMessage();

  return (
    <div className="max-w-md mx-auto space-y-6 animate-scale-in">
      <Card className={cn(
        'text-center shadow-elevated overflow-hidden',
        passed ? 'border-success' : 'border-warning'
      )}>
        <div className={cn(
          'py-8',
          passed ? 'bg-gradient-success' : 'bg-gradient-primary'
        )}>
          <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center animate-bounce-in">
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <Target className="w-12 h-12 text-white" />
            )}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-display">{title}</CardTitle>
          <p className="text-muted-foreground">{subtitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-5xl font-bold text-gradient">
              {percentage}%
            </div>
            <p className="text-lg">
              <span className="font-semibold">{correctCount}</span> / {totalQuestions} bonnes réponses
            </p>
          </div>

          {isMockExam && (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">
                Seuil de réussite : {EXAM_CONFIG.passingPercentage}% ({EXAM_CONFIG.passingScore}/{EXAM_CONFIG.totalQuestions})
              </p>
              <Progress 
                value={percentage} 
                className="h-3"
              />
              <div 
                className="relative h-0"
                style={{ left: `${EXAM_CONFIG.passingPercentage}%` }}
              >
                <div className="absolute -top-3 w-0.5 h-3 bg-foreground" />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onRetry} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Recommencer
            </Button>
            <Button asChild className="flex-1">
              <Link to="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Tableau de bord
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
