import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { QuizQuestion as QuizQuestionType, AnswerValidation } from '@/hooks/useQuiz';
import { Check, X, Loader2 } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showResult: boolean;
  isValidating?: boolean;
  validation?: AnswerValidation | null;
  onSubmit: () => void;
  onNext: () => void;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResult,
  isValidating = false,
  validation,
  onSubmit,
  onNext,
}: QuizQuestionProps) {
  const isCorrect = validation?.isCorrect ?? false;
  const correctAnswer = validation?.correctAnswer;
  const explanation = validation?.explanation ?? question.explanation;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold leading-relaxed">{question.question}</h2>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = showResult && index === correctAnswer;

          return (
            <button
              key={index}
              onClick={() => !showResult && !isValidating && onSelectAnswer(index)}
              disabled={showResult || isValidating}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                'hover:border-primary/50 hover:shadow-md',
                'disabled:cursor-default',
                !showResult && isSelected && 'border-primary bg-primary/5',
                !showResult && !isSelected && 'border-border bg-card',
                showResult && isCorrectOption && 'border-success bg-success-light animate-pulse-success',
                showResult && isSelected && !isCorrectOption && 'border-destructive bg-destructive-light animate-shake',
                showResult && !isSelected && !isCorrectOption && 'opacity-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                    !showResult && isSelected && 'bg-primary text-primary-foreground',
                    !showResult && !isSelected && 'bg-secondary text-secondary-foreground',
                    showResult && isCorrectOption && 'bg-success text-success-foreground',
                    showResult && isSelected && !isCorrectOption && 'bg-destructive text-destructive-foreground'
                  )}
                >
                  {showResult && isCorrectOption ? (
                    <Check className="w-4 h-4" />
                  ) : showResult && isSelected && !isCorrectOption ? (
                    <X className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="flex-1 font-medium">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && explanation && (
        <Card className={cn(
          'border-2 animate-slide-up',
          isCorrect ? 'border-success bg-success-light' : 'border-destructive bg-destructive-light'
        )}>
          <CardContent className="pt-4">
            <p className="font-semibold mb-1">
              {isCorrect ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
            </p>
            <p className="text-sm text-muted-foreground">{explanation}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        {!showResult ? (
          <Button
            onClick={onSubmit}
            disabled={selectedAnswer === null || isValidating}
            size="lg"
            className="px-8"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validation...
              </>
            ) : (
              'Valider'
            )}
          </Button>
        ) : (
          <Button onClick={onNext} size="lg" className="px-8">
            Question suivante
          </Button>
        )}
      </div>
    </div>
  );
}
