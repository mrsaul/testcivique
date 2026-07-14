import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCreatePayment, FREE_QUESTION_LIMIT } from '@/hooks/usePremium';
import { Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { RedeemCodeCard } from './RedeemCodeCard';

export function PaywallCard() {
  const { createPayment } = useCreatePayment();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await createPayment();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardContent className="pt-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold">Accès limité atteint</h2>
          <p className="text-muted-foreground">
            Vous avez utilisé vos {FREE_QUESTION_LIMIT} questions gratuites.
            Débloquez l'accès illimité pour continuer votre préparation.
          </p>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <div className="text-center">
            <span className="text-3xl font-bold">5€</span>
            <span className="text-muted-foreground ml-1">paiement unique</span>
          </div>
          <ul className="space-y-2 text-sm">
            {[
              'Accès illimité à toutes les questions',
              'Tous les thèmes débloqués',
              'Examens blancs illimités',
              'Suivi de progression complet',
              'Accès à vie, sans abonnement',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Redirection...
            </>
          ) : (
            'Débloquer l\'accès — 5€'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Paiement sécurisé par Stripe. Pas d'abonnement.
        </p>
      </CardContent>
      <CardContent className="pt-0">
        <RedeemCodeCard />
      </CardContent>
    </Card>
  );
}
